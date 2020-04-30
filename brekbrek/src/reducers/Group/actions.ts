import {IGroup, Result} from '@models';
import {batch} from 'react-redux';
import {Actions} from './state';
import {GroupService} from '@services';
import { Alert } from 'react-native';

export const actionCreators = {
  createItem: (item: IGroup) => async (dispatch, getState) => {
    let result: Result<IGroup>;
    await batch(async () => {
      await dispatch({type: Actions.RequestCreate});

      result = await GroupService.create(item);
      if (!result.hasErrors()) {
        await dispatch({
          type: Actions.ReceiveCreate,
          payload: result.value,
        });
      } else {
        await dispatch({
          type: Actions.ReceiveCreate,
          payload: null,
        });
        Alert.alert(result.errors[0]);
      }
    });
    return result;
  },
  updateItem: (item: IGroup) => async (dispatch, getState) => {
    let result: Result<IGroup>;
    await batch(async () => {
      await dispatch({type: Actions.RequestUpdate});

      result = await GroupService.update(item);
      if (!result.hasErrors()) {
        await dispatch({
          type: Actions.ReceiveUpdate,
          payload: result.value,
        });
      } else {
        await dispatch({
          type: Actions.ReceiveUpdate,
          payload: null,
        });
        Alert.alert(result.errors[0]);
      }
    });
    return result;
  },
  deleteItem: (item: IGroup) => async (dispatch, getState) => {
    let result: Result<IGroup>;
    await batch(async () => {
      await dispatch({type: Actions.RequestDelete});

      result = await GroupService.delete(item);
      if (!result.hasErrors()) {
        await dispatch({
          type: Actions.ReceiveDelete,
          payload: result.value,
        });
      } else {
        await dispatch({
          type: Actions.ReceiveDelete,
          payload: null,
        });
        Alert.alert(result.errors[0]);
      }
    });
    return result;
  },
  getUserGroups: () => async (dispatch, getState) => {
    let result: Result<IGroup[]>;
    await batch(async () => {
      await dispatch({type: Actions.RequestList});

      result = await GroupService.getUserGroups();
      if (!result.hasErrors()) {
        await dispatch({
          type: Actions.ReceiveList,
          payload: result.value,
        });
      } else {
        await dispatch({
          type: Actions.ReceiveList,
          payload: null,
        });
        Alert.alert(result.errors[0]);
      }
    });
    return result;
  },
  clear: () => async (dispatch, getState) => {
    await dispatch({type: Actions.ClearItem});
  },
};
