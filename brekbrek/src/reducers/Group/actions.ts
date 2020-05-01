import { IGroup, Result } from '@models';
import { GroupService } from '@services';
import { batch } from 'react-redux';
import { Actions } from './state';
import { AsyncAlert } from '../../tools/AsyncAlert';

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
  updateItem: (item: IGroup) => async (dispatch, getState) => {
    let result: Result<IGroup>;
    await batch(async () => {
      dispatch({type: Actions.RequestUpdate});
      result = await GroupService.update(item);
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
  deleteItem: (item: IGroup) => async (dispatch, getState) => {
    let result: Result<IGroup>;
    await batch(async () => {
      dispatch({type: Actions.RequestDelete});
      result = await GroupService.delete(item);
      if (result.hasErrors()) {
        await AsyncAlert(result.errors[0]);
      }
      dispatch({
        type: Actions.ReceiveDelete,
        payload: result.value,
      });
    });
    return result;
  },
  getUserGroups: () => async (dispatch, getState) => {
    let result: Result<IGroup[]>;
    await batch(async () => {
      dispatch({type: Actions.RequestList});
      result = await GroupService.getUserGroups();
      console.log(result);
      if (result.hasErrors()) {
        await AsyncAlert(result.errors[0]);
      }
      dispatch({
        type: Actions.ReceiveList,
        payload: result.value,
      });
    });

    return result;
  },
  clear: () => async (dispatch, getState) => {
    await dispatch({type: Actions.ClearItem});
  },
};
