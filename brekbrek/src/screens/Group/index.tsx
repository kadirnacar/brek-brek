import {LoaderSpinner} from '@components';
import config from '@config';
import {NavigationProp} from '@react-navigation/native';
import {GroupActions} from '@reducers';
import {ApplicationState} from '@store';
import {SocketClient, WebRtcConnection} from '@tools';
import React, {Component} from 'react';
import {Text, TouchableHighlight, View, TextInput} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

interface GroupScreenState {
  userId?: string;
  data?: string;
  message?: string;
}

interface GroupProps {
  navigation: NavigationProp<any>;
  GroupActions: typeof GroupActions;
}

type Props = GroupProps & ApplicationState;

export class GroupScreenComp extends Component<Props, GroupScreenState> {
  constructor(props) {
    super(props);
    this.state = {};
    this.props.navigation.setOptions({
      // canGoBack: true,
    });
  }
  socketClient: SocketClient;
  webRtcConnection: WebRtcConnection;
  async componentDidMount() {
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
      }
    }
  }

  componentWillUnmount() {
    if (this.socketClient) {
      this.socketClient.dispose();
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
            borderBottomWidth: 1,
            borderBottomColor: '#cccccc',
            minHeight: 50,
            justifyContent: 'center',
          }}>
          <TextInput
            value={this.state.message}
            onChangeText={(text) => {
              this.setState({message: text});
            }}
          />
        </View>
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
            {this.state.userId ? this.state.userId : ''}
          </Text>
          <Text
            style={{
              fontSize: 22,
              color: '#000',
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            {this.state.data ? this.state.data : ''}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#ff5722',
            width: 70,
            height: 70,
            borderRadius: 35,
            position: 'absolute',
            right: 10,
            bottom: 40,
          }}>
          <TouchableHighlight
            onPress={async () => {
              console.log('okk');
              // await this.webRtcConnection.startStream();
              this.webRtcConnection.sendData(this.state.message);
            }}
            style={{
              width: 70,
              borderRadius: 35,
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              alignSelf: 'center',
              height: 70,
            }}>
            <FontAwesome5Icon name="plus" size={30} color="#ffffff" />
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
