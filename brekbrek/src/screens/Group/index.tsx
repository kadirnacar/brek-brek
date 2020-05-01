import {LoaderSpinner} from '@components';
import {IGroup} from '@models';
import {NavigationProp} from '@react-navigation/native';
import {GroupActions} from '@reducers';
import {ApplicationState} from '@store';
import React, {Component} from 'react';
import {Text, View} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SocketClient} from '@tools';
import config from '@config';

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
      this.socketClient.send('deneme');
      this.socketClient.onMessageEvent = (e) => {
        console.log(e);
      };
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
          }}>
          <Text
            style={{
              fontSize: 16,
              color: '#000',
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
