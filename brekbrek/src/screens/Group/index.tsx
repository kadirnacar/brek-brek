import {LoaderSpinner} from '@components';
import config from '@config';
import {UserStatus} from '@models';
import {NavigationProp} from '@react-navigation/native';
import {GroupActions, UserActions} from '@reducers';
import {ApplicationState, LocalStorage} from '@store';
import {SocketClient, WebRtcConnection, colors} from '@tools';
import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import SafeAreaView from 'react-native-safe-area-view';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {VolumeControlEvents} from 'react-native-volume-control';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import HeadphoneDetection from 'react-native-headphone-detection';
import Share, {Options} from 'react-native-share';
import CallDetectorManager from 'react-native-call-detection';
import RNBeep from 'react-native-a-beep';

const {width} = Dimensions.get('window');

interface GroupScreenState {
  isStart?: boolean;
  data?: string;
  peers?: string[];
  activeUser?: string;
  connected?: boolean;
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
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.state = {
      peers: [],
      isStart: false,
      data: null,
      activeUser: null,
      speakerOn: true,
      connected: false,
    };
    this.props.navigation.setOptions({
      // canGoBack: true,
    });
  }
  socketClient: SocketClient;
  webRtcConnection: WebRtcConnection;
  startInterval;
  volumeListener;
  callDetector: CallDetectorManager;
  async startListenerTapped() {
    this.callDetector = new CallDetectorManager(
      async (event, phoneNumber) => {
        if (event === 'Disconnected') {
        } else if (event === 'Connected') {
          await this.webRtcConnection.close();
          this.props.navigation.navigate('Home');
        } else if (event === 'Incoming') {
          await this.webRtcConnection.close();
          this.props.navigation.navigate('Home');
        } else if (event === 'Dialing') {
          await this.webRtcConnection.close();
          this.props.navigation.navigate('Home');
        } else if (event === 'Offhook') {
          await this.webRtcConnection.close();
          this.props.navigation.navigate('Home');
        } else if (event === 'Missed') {
        }
      },
      false,
      () => {},
      {
        title: 'Phone State Permission',
        message:
          'This app needs access to your phone state in order to react and/or to adapt to incoming calls.',
      },
    );
  }

  stopListenerTapped() {
    this.callDetector && this.callDetector.dispose();
  }
  handleHeadPhone(e) {
    if (e.audioJack || e.bluetooth) {
      this.webRtcConnection.speakerOnOff(false);
      this.setState({speakerOn: false});
    } else {
      this.webRtcConnection.speakerOnOff(true);
      this.setState({speakerOn: true});
    }
  }
  async componentDidMount() {
    if(!this.props.User.current){
      await this.props.UserActions.checkUser()
    }
    await this.props.GroupActions.getItem(this.props.Group.currentId);
    if (!this.props.Group || !this.props.Group.current) {
      return;
    }
    this.startListenerTapped();
    // await this.props.GroupActions.getGroupUsers(this.props.Group.current.Id);
    if (!this.socketClient) {
      this.socketClient = new SocketClient(config.wsUrl, {
        Id: this.props.Group.current.Id,
      });
      const result = await this.socketClient.connect();
      this.setState({connected: true});
      this.socketClient.onConnected = async (state) => {
        if (!this.state.connected) {
          await this.webRtcConnection.connect();
        }
        this.setState({connected: true});
      };
      this.socketClient.onErrorEvent = (e) => {
        this.webRtcConnection.close();
        this.setState({connected: false});
      };
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
              RNBeep.beep();
              this.setState({activeUser: id});
              break;
            case 'end':
              if (
                this.props.Group.current.Users &&
                id in this.props.Group.current.Users
              ) {
                this.props.Group.current.Users[id].status = UserStatus.Online;
              }
              RNBeep.beep();
              this.setState({activeUser: null});
              break;
          }
        };
        this.webRtcConnection.onConnectionChange = (status, userId) => {
          switch (status) {
            case 'connected':
              if (
                this.props.Group.current.Users[userId].status !=
                UserStatus.Online
              ) {
                this.props.Group.current.Users[userId].status =
                  UserStatus.Online;
              }
              break;
            case 'disconnected':
              if (
                this.props.Group.current.Users[userId].status !=
                UserStatus.Offline
              ) {
                this.props.Group.current.Users[userId].status =
                  UserStatus.Offline;
              }
              break;
          }
        };
      }
      await this.webRtcConnection.connect();
    }
    const headPhone = await HeadphoneDetection.isAudioDeviceConnected();
    this.handleHeadPhone(headPhone);
    HeadphoneDetection.addListener((e) => {
      this.handleHeadPhone(e);
    });
    this.volumeListener = VolumeControlEvents.addListener(
      'VolumeChanged',
      (event) => {
        if (!this.state.isStart && !this.state.activeUser) {
          this.setState({isStart: true}, () => {
            this.handleStart();
          });
          BackgroundTimer.clearInterval(this.startInterval);
        } else {
          if (this.startInterval) {
            BackgroundTimer.clearInterval(this.startInterval);
            if (Platform.OS == 'ios') {
              BackgroundTimer.stop();
            }
          }

          if (Platform.OS == 'ios') {
            BackgroundTimer.start();
          }

          this.startInterval = BackgroundTimer.setInterval(() => {
            this.setState({isStart: false}, () => {
              this.handleStop();
              BackgroundTimer.clearInterval(this.startInterval);
              BackgroundTimer.stop();
            });
          }, 700);
        }
      },
    );
  }
  handleStart() {
    if (this.state.connected) {
      RNBeep.beep();

      this.webRtcConnection.sendData({
        command: 'start',
      });
      this.webRtcConnection.startMediaStream();
      this.setState({});
    }
  }
  handleStop() {
    RNBeep.beep();

    this.webRtcConnection.sendData({
      command: 'end',
    });
    this.webRtcConnection.stopMediaStream();
    this.setState({});
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

    if (this.volumeListener) {
      this.volumeListener.remove();
    }
    this.stopListenerTapped();
    if (HeadphoneDetection.remove) {
      // The remove is not necessary on Android
      HeadphoneDetection.remove();
    }
    // SystemSetting.removeVolumeListener(this.volumeListener);
    if (this.socketClient) {
      this.socketClient.dispose();
      if (this.webRtcConnection) {
        this.webRtcConnection.close();
      }
    }
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
                        item.status == UserStatus.Offline
                          ? colors.color1
                          : colors.color3
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
                        item.status == UserStatus.Offline
                          ? colors.color1
                          : colors.color3,
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
            disabled={!!this.state.activeUser && this.state.connected}
            onPressIn={this.handleStart}
            onPressOut={this.handleStop}
            style={{
              backgroundColor:
                this.state.activeUser || !this.state.connected
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
              this.webRtcConnection.speakerOnOff(!this.state.speakerOn);
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
