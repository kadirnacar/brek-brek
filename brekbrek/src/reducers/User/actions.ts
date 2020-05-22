import {Result, IUser} from '@models';
import {UserService} from '@services';
import {batch} from 'react-redux';
import * as LocalStorage from '../../store/localStorage';
import {AsyncAlert} from '../../tools/AsyncAlert';
import {Actions} from './state';

export const actionCreators = {
  leaveGroup: (groupId) => async (dispatch, getState) => {
    let result: Result<any>;
    await batch(async () => {
      dispatch({type: Actions.RequestLeaveGroup});
      result = await UserService.leaveGroup(groupId);
      if (result.hasErrors()) {
        await AsyncAlert(result.errors[0]);
      }
      dispatch({
        type: Actions.ReceiveLeaveGroup,
        payload: result.value,
      });
    });
    return result;
  },
  loginWithGoogle: (fcmToken) => async (dispatch, getState) => {
    let isSuccess: boolean = false;
    let message: string = null;
    await batch(async () => {
      dispatch({type: Actions.RequestUserItem});
      var result = await UserService.loginWithGoogle(fcmToken);
      const user = result.value ? result.value : null;
      if (user)
        dispatch({
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
  loginWithFacebook: (fcmToken) => async (dispatch, getState) => {
    let isSuccess: boolean = false;
    let message: string = null;
    await batch(async () => {
      await dispatch({type: Actions.RequestUserItem});
      var result = await UserService.loginWithFacebook(fcmToken);
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
  checkUser: () => async (dispatch, getState) => {
    let result: Result<any>;
    await batch(async () => {
      dispatch({type: Actions.RequestUserItem});
      result = await UserService.checkUser();
      if (result.hasErrors()) {
        await AsyncAlert(result.errors[0]);
      }
      dispatch({
        type: Actions.ReceiveUserItem,
        payload: result.hasErrors() ? null : result.value.data,
      });
      if (!result.hasErrors())
        await LocalStorage.setItem('user', JSON.stringify(result.value.data));
    });
    return await result;
  },
  clear: () => async (dispatch, getState) => {
    await LocalStorage.removeItem('user');
    await LocalStorage.removeItem('token');
    await dispatch({type: Actions.ClearItem});
  },
};
