import {GroupReducer, GroupState, UserReducer, UserState} from '@reducers';
import * as LocalStorage from './localStorage';
export {LocalStorage};

export interface ApplicationState {
  User: UserState;
  Group: GroupState;
}

export const reducers = {
  User: UserReducer,
  Group: GroupReducer,
};

export interface AppThunkAction<TAction> {
  (
    dispatch: (action: TAction) => void,
    getState: () => ApplicationState,
  ): Promise<any>;
}

export interface AppThunkActionAsync<TAction, TResult> {
  (
    dispatch: (action: TAction) => void,
    getState: () => ApplicationState,
  ): Promise<TResult>;
}
