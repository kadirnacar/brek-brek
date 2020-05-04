import {AppNavigation} from '@navigation';
import React, {Component} from 'react';
import {View, Text, Platform} from 'react-native';
import SafeAreaView, {SafeAreaProvider} from 'react-native-safe-area-view';
import {Provider} from 'react-redux';
import store from './tools/store';
import {LocalStorage} from '@store';
import {UserActionTypes} from '@reducers';
import {UserService} from './services/UserService';
import {AsyncAlert} from './tools/AsyncAlert';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

interface AppState {
  isLoaded: boolean;
  isLogin: boolean;
}
export default class App extends Component<any, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isLogin: false,
    };
  }
  async componentDidMount() {
    const user = await LocalStorage.getItem('user');
    const token = await LocalStorage.getItem('token');
    if (token) {
      // const checkUser = await UserService.checkUser();
      // if (checkUser.hasErrors()) {
      //   await AsyncAlert(checkUser.errors[0]);
      //   this.setState({isLoaded: true, isLogin: false});
      // } else 
      // if (!checkUser.value.success) {
      //   this.setState({isLoaded: true, isLogin: false});
      // } else 
      {
        store.dispatch({
          type: UserActionTypes.ReceiveUserItem,
          payload: JSON.parse(user),
        });
        this.setState({isLoaded: true, isLogin: true});
      }
    } else {
      this.setState({isLoaded: true, isLogin: false});
    }
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
