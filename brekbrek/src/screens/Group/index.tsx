import {LoaderSpinner} from '@components';
import config from '@config';
import {NavigationProp} from '@react-navigation/native';
import {GroupActions} from '@reducers';
import {ApplicationState} from '@store';
import {SocketClient} from '@tools';
import React, {Component} from 'react';
import {Text, View} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {mediaDevices} from 'react-native-webrtc';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

interface GroupScreenState {}

interface GroupProps {
  navigation: NavigationProp<any>;
  GroupActions: typeof GroupActions;
}

type Props = GroupProps & ApplicationState;

export class GroupScreenComp extends Component<Props, GroupScreenState> {
  constructor(props) {
    super(props);
    this.state = {
      showAddGroup: false,
    };
    this.props.navigation.setOptions({
      // canGoBack: true,
    });
  }
  socketClient: SocketClient;
  async componentDidMount() {
    if (!this.socketClient) {
      this.socketClient = new SocketClient(config.wsUrl, {
        Id: this.props.Group.current.Id,
      });
      await this.socketClient.connect();
      this.socketClient.send('test', {dd: 'deneme'});
      this.socketClient.onMessageEvent = (e) => {
        console.log(e);
      };
    }
    mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then((stream) => {
        console.log(stream);
        // Got stream!
      })
      .catch((error) => {
        // Log error
      });
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
