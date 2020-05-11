import {AppNavigation} from '@navigation';
import {UserActionTypes, GroupActions} from '@reducers';
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
import {GroupService} from './services/GroupService';
import {AppService} from './services/AppService';

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
        const result = await AppService.getLastVersion();
        if (result.hasErrors()) {
          return {};
        } else {
          return result.value;
        }
      },
      // fetch(`${config.restUrl}/api/app/`)
      //   .then((r) => r.json())
      //   .then(({version}) => version),
    });
    if (latestversion && latestversion.version) {
      const need = await VersionCheck.needUpdate({
        currentVersion: version,
        latestVersion: latestversion.version,
        forceUpdate: true,
        provider: async () => {
          const result = await AppService.getLastVersion();
          if (result.hasErrors()) {
            return {};
          } else {
            return result.value;
          }
        },
      });
      if (
        need.isNeeded &&
        (latestversion.force == true || latestversion.force == 'true')
      ) {
        await AsyncAlert('Lütfen uygulamayı güncelleyiniz.');
        if (Platform.OS == 'ios' && latestversion.appStoreUrl) {
          Linking.openURL(latestversion.appStoreUrl);
        }
        if (Platform.OS == 'android' && latestversion.playStoreUrl) {
          Linking.openURL(latestversion.playStoreUrl);
        }
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
    if (url) {
      try {
        const groupId = url.split('/').pop();
        console.log(groupId);
        if (groupId) {
          await GroupService.joinGroup(groupId);
          await GroupActions.getUserGroups()(store.dispatch, store.getState);
        }
      } catch {}
    }
    // } else {
    Linking.addEventListener('url', this.handleLinking);
    // }
  }
  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleLinking);
  }
  async handleLinking(url) {
    if (url && url.url) {
      try {
        const groupId = url.url.split('/').pop();
        if (groupId) {
          await GroupService.joinGroup(groupId);
          await GroupActions.getUserGroups()(store.dispatch, store.getState);
        }
      } catch {}
    }
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
