import {IGroup, Result, IGroupUser, IUserGroup} from '@models';
import {GroupService} from '@services';
import {batch} from 'react-redux';
import {Actions} from './state';
import {AsyncAlert} from '../../tools/AsyncAlert';

export const actionCreators = {
  createItem: (item: IGroup) => async (dispatch, getState) => {
    let result: Result<IGroup>;
    await batch(async () => {
      dispatch({type: Actions.RequestCreate});
      result = await GroupService.create(item);
      if (result.hasErrors()) {
        await AsyncAlert(result.errors[0]);
      }
      dispatch({
        type: Actions.ReceiveCreate,
        payload: result.value,
      });
    });
    return result;
  },
  getItem: (groupId) => async (dispatch, getState) => {
    let result: Result<IGroup>;
    await batch(async () => {
      dispatch({type: Actions.RequestGroup});
      result = await GroupService.getItem(groupId);
      if (result.hasErrors()) {
        await AsyncAlert(result.errors[0]);
      }
      dispatch({
        type: Actions.ReceiveGroup,
        payload: result.value,
        groupId: groupId,
      });
    });
    return await result;
  },
  updateItem: (id, item) => async (dispatch, getState) => {
    let result: Result<IGroup>;
    await batch(async () => {
      dispatch({type: Actions.RequestUpdate});
      result = await GroupService.update({...item, Id: id});
      if (result.hasErrors()) {
        await AsyncAlert(result.errors[0]);
      }
      dispatch({
        type: Actions.ReceiveUpdate,
        payload: {Id: item.Id, item},
      });
    });
    return await result;
  },
  clear: () => async (dispatch, getState) => {
    dispatch({type: Actions.ClearItem});
  },
  setCurrent: (groupId) => async (dispatch, getState) => {
    dispatch({type: Actions.SetCurrent, payload: groupId});
  },
};
