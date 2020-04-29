import {AppNavigation} from '@navigation';
import React, {Component} from 'react';
import {View} from 'react-native';
import SafeAreaView, {SafeAreaProvider} from 'react-native-safe-area-view';
import {Provider} from 'react-redux';
import store from './tools/store';
import {LocalStorage} from '@store';
import {UserActionTypes} from '@reducers';

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
    if (user) {
      store.dispatch({
        type: UserActionTypes.ReceiveUserItem,
        payload: JSON.parse(user),
      });
    }
    this.setState({isLoaded: true, isLogin: !!token});
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
            <View></View>
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}
