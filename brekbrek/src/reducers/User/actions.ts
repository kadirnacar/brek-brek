import {UserService} from '@services';
import {batch} from 'react-redux';
import {Actions} from './state';
import * as LocalStorage from '../../store/localStorage';
import {Alert} from 'react-native';

export const actionCreators = {
  loginWithGoogle: () => async (dispatch, getState) => {
    let isSuccess: boolean = false;
    let message: string = null;
    await batch(async () => {
      await dispatch({type: Actions.RequestUserItem});
      var result = await UserService.loginWithGoogle();
      const user = result.value ? result.value : null;
      if (user)
        await dispatch({
          type: Actions.ReceiveUserItem,
          payload: user.user,
        });
      if (result.hasErrors()) {
        // Alert.alert(result.errors[0]);
        message = result.errors[0];
        isSuccess = false;
        return {success: isSuccess, message: message};
      }

      isSuccess = user != null;

      if (isSuccess) {
        const state = await getState();
        if (state.User) {
          await LocalStorage.setItem(
            'user',
            JSON.stringify(state.User.current),
          );
          await LocalStorage.setItem('token', user.token);
        }
      }
    });
    return {success: isSuccess, message: message};
  },
  loginWithFacebook: () => async (dispatch, getState) => {
    let isSuccess: boolean = false;
    let message: string = null;
    await batch(async () => {
      await dispatch({type: Actions.RequestUserItem});
      var result = await UserService.loginWithFacebook();
      const user = result && result.value ? result.value : null;
      if (user)
        await dispatch({
          type: Actions.ReceiveUserItem,
          payload: user && user.user ? user.user : null,
        });

      if (result.hasErrors()) {
        message = result.errors[0];
        isSuccess = false;
        return {success: isSuccess, message: message};
      }

      isSuccess = user != null;

      if (isSuccess) {
        const state = await getState();
        if (state.User) {
          await LocalStorage.setItem(
            'user',
            JSON.stringify(state.User.current),
          );
          await LocalStorage.setItem('token', user.token);
        }
      }
    });
    return {success: isSuccess, message: message};
  },
  clear: () => async (dispatch, getState) => {
    await LocalStorage.removeItem('user');
    await LocalStorage.removeItem('token');
    await dispatch({type: Actions.ClearItem});
  },
};
