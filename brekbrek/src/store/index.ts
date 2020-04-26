
import {  UserReducer, UserState } from '@reducers';
import * as LocalStorage from './localStorage';
export { LocalStorage };

export interface ApplicationState {
    User: UserState;
}

export const reducers = {
    User: UserReducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): Promise<any>;
}

export interface AppThunkActionAsync<TAction, TResult> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): Promise<TResult>
}