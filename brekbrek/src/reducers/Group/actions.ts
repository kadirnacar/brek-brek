import {IGroup, Result} from '@models';
import {batch} from 'react-redux';
import {Actions} from './state';
import {GroupService} from '@services';

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
      }
    });
    return result;
  },
  clear: () => async (dispatch, getState) => {
    await dispatch({type: Actions.ClearItem});
  },
};
