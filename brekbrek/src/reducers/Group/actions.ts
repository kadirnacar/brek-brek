import {IGroup, Result, IGroupUser} from '@models';
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
  clear: () => async (dispatch, getState) => {
    dispatch({type: Actions.ClearItem});
  },
  setCurrent: (item: IGroup) => async (dispatch, getState) => {
    dispatch({type: Actions.SetCurrent, payload: item});
  },
};
