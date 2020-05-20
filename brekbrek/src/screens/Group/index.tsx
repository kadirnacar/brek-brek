import {LoaderSpinner} from '@components';
import {UserStatus} from '@models';
import {NavigationProp} from '@react-navigation/native';
import {GroupActions, UserActions} from '@reducers';
import {ApplicationState} from '@store';
import {colors, ExposedToJava} from '@tools';
import React, {Component} from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  PermissionsAndroid,
} from 'react-native';
import InCallManager from 'react-native-incall-manager';
import SafeAreaView from 'react-native-safe-area-view';
import Share, {Options} from 'react-native-share';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const {width} = Dimensions.get('window');

interface GroupScreenState {
  isStart?: boolean;
  data?: string;
  activeUser?: string;
  speakerOn?: boolean;
}

interface GroupProps {
  navigation: NavigationProp<any>;
  GroupActions: typeof GroupActions;
  UserActions: typeof UserActions;
}

type Props = GroupProps & ApplicationState;

export class GroupScreenComp extends Component<Props, GroupScreenState> {
  constructor(props) {
    super(props);
    this.handleShare = this.handleShare.bind(this);
    this.state = {
      isStart: false,
      data: null,
      activeUser: null,
      speakerOn: true,
    };
  }

  async componentDidMount() {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );

    if (!granted) {
      const result = await PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      if(!result){
        this.props.navigation.navigate("Home");
      }
    }
    if (!this.props.User.current) {
      await this.props.UserActions.checkUser();
    }
    await this.props.GroupActions.getItem(this.props.Group.currentId);
    if (!this.props.Group || !this.props.Group.current) {
      return;
    }
    ExposedToJava.start(
      this.props.Group.current.Id,
      this.props.User.current.Id,
      this.props.User.current.DisplayName,
    );
    ExposedToJava.onPeerConnectionChange = (status, userId) => {
      switch (status) {
        case 'connected':
          this.props.Group.current.Users[userId].status = UserStatus.Online;
          break;
        case 'disconnected':
          this.props.Group.current.Users[userId].status = UserStatus.Offline;
          break;
      }
      this.setState({});
    };
    ExposedToJava.onData = (userId, data) => {
      switch (data.command) {
        case 'start':
          this.setState({activeUser: userId});
          break;
        case 'end':
          this.setState({activeUser: null});
          break;
      }
    };
  }

  async handleShare() {
    const url = `http://brekbrek.kadirnacar.com/join/${this.props.Group.current.Id}`;
    const title = 'BrekBrek Görüşme Daveti';
    const message = `${this.props.User.current.DisplayName}, sizi görüşmeye davet etti.`;
    const options: Options = {
      title: title,
      subject: title,
      message: `${message} ${url}`,
    };

    await Share.open(options);
  }
  componentWillUnmount() {
    ExposedToJava.close();
  }
  render() {
    const users = (this.props.Group.current && this.props.Group.current.Users
      ? Object.keys(this.props.Group.current.Users).filter(
          (x) => x != this.props.User.current.Id,
        )
      : []
    )
      .map((id) => this.props.Group.current.Users[id])
      .sort((a, b) => {
        if (a.status < b.status) {
          return -1;
        } else if (a.status > b.status) {
          return 1;
        }
        return 0;
      });
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors.bodyBackground}}>
        <LoaderSpinner showLoader={this.props.Group.isRequest} />
        <View
          style={{
            padding: 10,
            borderBottomWidth: 1,
            backgroundColor: colors.color4,
            borderBottomColor: colors.borderColor,
            minHeight: 50,
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              flex: 1,
              fontSize: 22,
              color: colors.color3,
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            {this.props.Group && this.props.Group.current
              ? this.props.Group.current.Name
              : ''}
          </Text>
          <TouchableOpacity
            style={{
              padding: 10,
              width: 45,
              height: 35,
              justifyContent: 'center',
              alignItems: 'flex-end',
              alignContent: 'flex-end',
              alignSelf: 'flex-end',
            }}
            onPress={this.handleShare}>
            <FontAwesome5Icon
              name="user-plus"
              size={20}
              color={colors.color3}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{
            flex: 1,
          }}>
          {users.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  backgroundColor: colors.bodyBackground,
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.borderColor,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      borderWidth: item.status == UserStatus.Talking ? 1 : 0,
                      borderColor: colors.activeBorderColor,
                      backgroundColor: colors.color2,
                      alignContent: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 30,
                      width: 60,
                      height: 60,
                      marginRight: 10,
                    }}>
                    <FontAwesome5Icon
                      name="user"
                      size={30}
                      color={
                        item.status == UserStatus.Offline || !item.status
                          ? colors.headerTextColor
                          : colors.activeBorderColor
                      }
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      alignItems: 'center',
                      alignSelf: 'center',
                      color:
                        item.status == UserStatus.Offline || !item.status
                          ? colors.headerTextColor
                          : colors.activeBorderColor,
                    }}>
                    {item.DisplayName}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            right: 0,
            left: 0,
            bottom: 40,
          }}>
          <TouchableHighlight
            // disabled={!!this.state.activeUser}
            onPressIn={() => {
              ExposedToJava.startVoice();
            }}
            onPressOut={() => {
              ExposedToJava.stopVoice();
            }}
            style={{
              backgroundColor: this.state.activeUser
                ? colors.color4
                : '#ff5722',
              width: 100,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              alignSelf: 'center',
              height: 100,
            }}>
            <FontAwesome5Icon
              name="microphone"
              size={30}
              color={colors.primaryButtonTextColor}
            />
          </TouchableHighlight>
        </View>

        <View
          style={{
            position: 'absolute',
            zIndex: 99,
            right: 10,
            bottom: 40,
          }}>
          <TouchableHighlight
            onPress={async () => {
              // this.webRtcConnection.speakerOnOff(!this.state.speakerOn);
              InCallManager.setSpeakerphoneOn(!this.state.speakerOn);
              this.setState({speakerOn: !this.state.speakerOn});
            }}
            style={{
              backgroundColor: !this.state.speakerOn
                ? colors.color4
                : colors.primaryButtonColor,
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
              color={colors.primaryButtonTextColor}
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
      UserActions: bindActionCreators({...UserActions}, dispatch),
    };
  },
)(GroupScreenComp);
