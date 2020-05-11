import {AppNavigation} from '@navigation';
import {UserActionTypes} from '@reducers';
import {LocalStorage} from '@store';
import React, {Component} from 'react';
import {Platform, View, Linking, BackHandler} from 'react-native';
import SafeAreaView, {SafeAreaProvider} from 'react-native-safe-area-view';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {Provider} from 'react-redux';
import store from './tools/store';
import NetInfo from '@react-native-community/netinfo';
import {AsyncAlert} from './tools/AsyncAlert';
import VersionCheck from 'react-native-version-check';
import {UserService} from './services/UserService';
import config from '@config';

interface AppState {
  isLoaded: boolean;
  isLogin: boolean;
}

export default class App extends Component<any, AppState> {
  constructor(props) {
    super(props);
    this.handleLinking = this.handleLinking.bind(this);
    this.state = {
      isLoaded: false,
      isLogin: false,
    };
  }
  async componentDidMount() {
    const connectionState = await NetInfo.fetch();
    if (!connectionState.isConnected) {
      await AsyncAlert('İnternet bağlantınızı kontrol ediniz.');
      BackHandler.exitApp();
      return;
    }
    const packageName = VersionCheck.getPackageName();
    const buildNumber = VersionCheck.getCurrentBuildNumber();
    const version = VersionCheck.getCurrentVersion();

    const latestversion = await VersionCheck.getLatestVersion({
      forceUpdate: true,
      provider: async () => {
        const version = await fetch(`${config.restUrl}/api/app/`);
        return version.json();
      },
    });
    if (latestversion && latestversion.version) {
      const need = await VersionCheck.needUpdate({
        currentVersion: version,
        latestVersion: latestversion.version,
        forceUpdate: true,
        provider: async () => {
          const version = await fetch(`${config.restUrl}/api/app/`);
          return await version.json();
        },
      });
      if (
        need.isNeeded &&
        (latestversion.force == true || latestversion.force == 'true')
      ) {
        await AsyncAlert('Lütfen uygulamayı güncelleyiniz.');
        BackHandler.exitApp();
      }
    }

    const user = await LocalStorage.getItem('user');
    const token = await LocalStorage.getItem('token');
    if (token) {
      const checkUser = await UserService.checkUser();
      if (checkUser.hasErrors()) {
        await AsyncAlert(checkUser.errors[0]);
        this.setState({isLoaded: true, isLogin: false});
      } else if (!checkUser.value.success) {
        this.setState({isLoaded: true, isLogin: false});
      } else {
        store.dispatch({
          type: UserActionTypes.ReceiveUserItem,
          payload: JSON.parse(user),
        });
        this.setState({isLoaded: true, isLogin: true});
      }
    } else {
      this.setState({isLoaded: true, isLogin: false});
    }
    // if (Platform.OS === 'android') {
    const url = await Linking.getInitialURL();
    console.log('url', url);
    // } else {
    Linking.addEventListener('url', this.handleLinking);
    // }
  }
  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleLinking);
  }
  handleLinking(url) {
    console.log('handleUrl', url);
  }
  render() {
    return (
      <SafeAreaProvider>
        <SafeAreaView
          style={{flex: 1, flexDirection: 'row'}}
          forceInset={{top: 'always', bottom: 'never'}}>
          {this.state.isLoaded ? (
            <Provider store={store}>
              <AppNavigation isLogin={this.state.isLogin} />
            </Provider>
          ) : (
            <View
              style={{
                flex: 1,
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <FontAwesome5Icon
                name="users"
                size={95}
                style={{
                  borderWidth: 1,
                  borderRadius: 80,
                  width: 160,
                  height: 160,
                  paddingTop: Platform.OS == 'ios' ? 30 : 0,
                  alignItems: 'center',
                  alignSelf: 'center',
                  alignContent: 'center',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}
              />
            </View>
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}
