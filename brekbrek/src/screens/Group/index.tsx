import {LoaderSpinner} from '@components';
import config from '@config';
import {UserStatus} from '@models';
import {NavigationProp} from '@react-navigation/native';
import {GroupActions} from '@reducers';
import {ApplicationState} from '@store';
import {SocketClient, WebRtcConnection} from '@tools';
import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const {width} = Dimensions.get('window');

interface GroupScreenState {
  userId?: string;
  data?: string;
  peers?: string[];
  activeUser?: string;
  speakerOn?: boolean;
}

interface GroupProps {
  navigation: NavigationProp<any>;
  GroupActions: typeof GroupActions;
}

type Props = GroupProps & ApplicationState;

export class GroupScreenComp extends Component<Props, GroupScreenState> {
  constructor(props) {
    super(props);
    this.state = {
      peers: [],
      userId: null,
      data: null,
      activeUser: null,
      speakerOn: true,
    };
    this.props.navigation.setOptions({
      // canGoBack: true,
    });
  }
  socketClient: SocketClient;
  webRtcConnection: WebRtcConnection;
  async componentDidMount() {
    
    if (!this.props.Group || !this.props.Group.current) {
      return;
    }
    await this.props.GroupActions.getGroupUsers(this.props.Group.current.Id);
    if (!this.socketClient) {
      this.socketClient = new SocketClient(config.wsUrl, {
        Id: this.props.Group.current.Id,
      });
      const result = await this.socketClient.connect();
      if (result == WebSocket.OPEN) {
        this.webRtcConnection = new WebRtcConnection(
          this.socketClient,
          this.props.Group.current.Id,
          this.props.User.current.Id,
        );

        this.webRtcConnection.onData = (id, data) => {
          const message = JSON.parse(data.data);
          switch (message.command) {
            case 'start':
              if (
                this.props.Group.current.Users &&
                id in this.props.Group.current.Users
              ) {
                this.props.Group.current.Users[id].status = UserStatus.Talking;
              }
              this.setState({activeUser: id});
              break;
            case 'end':
              if (
                this.props.Group.current.Users &&
                id in this.props.Group.current.Users
              ) {
                this.props.Group.current.Users[id].status = UserStatus.Online;
              }
              this.setState({activeUser: null});
              break;
          }
        };
        this.webRtcConnection.onConnectionChange = (status, userId) => {
          switch (status) {
            case 'connected':
              this.props.Group.current.Users[userId].status = UserStatus.Online;
              break;
            case 'disconnected':
              this.props.Group.current.Users[userId].status =
                UserStatus.Offline;
              break;
          }
          this.setState({});
        };
      }
      await this.webRtcConnection.connect();
    }
  }

  componentWillUnmount() {
    if (this.socketClient) {
      this.socketClient.dispose();
      if (this.webRtcConnection) {
        this.webRtcConnection.close();
      }
    }
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <LoaderSpinner showLoader={this.props.Group.isRequest} />
        <View
          style={{
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#cccccc',
            minHeight: 50,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 22,
              color: '#000',
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            {this.props.Group && this.props.Group.current
              ? this.props.Group.current.Name
              : ''}
          </Text>
        </View>
        <View
          style={{
            padding: 10,
            flex: 1,
            borderBottomWidth: 1,
            borderBottomColor: '#cccccc',
            justifyContent: 'center',
          }}>
          <FlatList
            numColumns={3}
            contentContainerStyle={{
              flex: 1,
              alignContent: 'center',
              alignItems: 'center',
            }}
            data={
              this.props.Group.current && this.props.Group.current.Users
                ? Object.keys(this.props.Group.current.Users)
                : []
            }
            renderItem={(item) => {
              // console.log(item.item, this.state.userId);
              return (
                <View
                  key={item.index}
                  style={{
                    backgroundColor:
                      this.props.Group.current.Users[item.item].status ==
                      UserStatus.Online
                        ? '#3bb33f'
                        : this.props.Group.current.Users[item.item].status ==
                          UserStatus.Talking
                        ? '#9332a8'
                        : '#cccccc',
                    borderWidth: 5,
                    borderColor: '#d3d3d3',
                    width: width / 3 - 20,
                    margin: 10,
                    borderRadius: (width / 3 - 20) / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    height: width / 3 - 20,
                  }}>
                  <Text
                    style={{
                      justifyContent: 'center',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#fff',
                    }}>
                    {this.props.Group.current.Users[item.item].DisplayName}
                  </Text>
                </View>
              );
            }}
            keyExtractor={(item) => item}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            right: 0,
            left: 0,
            bottom: 40,
          }}>
          <TouchableHighlight
            disabled={!!this.state.activeUser}
            onPressIn={async () => {
              this.setState({userId: this.props.User.current.Id}, () => {
                this.webRtcConnection.sendData({
                  command: 'start',
                });
                this.webRtcConnection.startMediaStream();
              });
            }}
            onPressOut={async () => {
              this.setState({userId: this.props.User.current.Id}, () => {
                this.webRtcConnection.sendData({
                  command: 'end',
                });
                this.webRtcConnection.stopMediaStream();
              });
            }}
            style={{
              backgroundColor: this.state.activeUser ? '#cccccc' : '#ff5722',
              width: 100,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              alignSelf: 'center',
              height: 100,
            }}>
            <FontAwesome5Icon name="microphone" size={30} color="#ffffff" />
          </TouchableHighlight>
        </View>

        <View
          style={{
            position: 'absolute',
            right: 10,
            left: 0,
            bottom: 40,
          }}>
          <TouchableHighlight
            onPress={async () => {
              this.webRtcConnection.speakerOnOff(!this.state.speakerOn);
              this.setState({speakerOn: !this.state.speakerOn});
            }}
            style={{
              backgroundColor: !this.state.speakerOn ? '#cccccc' : '#4287f5',
              width: 50,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'flex-end',
              alignSelf: 'flex-end',
              height: 50,
            }}>
            <FontAwesome5Icon
              name={this.state.speakerOn ? 'volume-up' : 'volume-mute'}
              size={20}
              color="#ffffff"
            />
          </TouchableHighlight>
        </View>
      </SafeAreaView>
    );
  }
}
export const GroupScreen = connect(
  (state: ApplicationState) => state,
  (dispatch) => {
    return {
      GroupActions: bindActionCreators({...GroupActions}, dispatch),
    };
  },
)(GroupScreenComp);
