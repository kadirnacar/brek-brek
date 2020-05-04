import {LoaderSpinner} from '@components';
import config from '@config';
import {NavigationProp} from '@react-navigation/native';
import {GroupActions} from '@reducers';
import {ApplicationState} from '@store';
import {SocketClient, WebRtcConnection} from '@tools';
import React, {Component} from 'react';
import {
  FlatList,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
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
}

interface GroupProps {
  navigation: NavigationProp<any>;
  GroupActions: typeof GroupActions;
}

type Props = GroupProps & ApplicationState;

export class GroupScreenComp extends Component<Props, GroupScreenState> {
  constructor(props) {
    super(props);
    this.state = {peers: []};
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

        this.webRtcConnection.connect();
        this.webRtcConnection.onData = (id, data) => {
          this.setState({userId: id, data: JSON.stringify(data.data)});
        };

        this.webRtcConnection.onConnectionChange = (peers) => {
          this.setState({peers});
        };
      }
    }
  }

  componentWillUnmount() {
    if (this.socketClient) {
      this.socketClient.dispose();
      this.webRtcConnection.close();
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
              console.log(item.item,this.state.userId)
              return (
                <View
                  key={item.index}
                  style={{
                    backgroundColor:
                      this.state.userId == item.item ? '#3bb33f' : '#9332a8',
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
                    {this.props.Group.current.Users[item.item]}
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
            onPress={async () => {
              this.setState({userId:this.props.User.current.Id},()=>{
                this.webRtcConnection.sendData("ss");

              })
            }}
            style={{
              backgroundColor: '#ff5722',
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
