import { IUser } from '@models';
import { IBaseReducer } from '../BaseReducer';

export enum Actions {
    RequestUserItem = "REQUEST_USER",
    ReceiveUserItem = "RECEIVE_USER",
    ClearItem = "CLEAR_USER",
}

export interface UserState extends IBaseReducer {
    current: IUser;
}

export interface IClearAction {
    type: Actions.ClearItem;
}

export interface IRequestUserItemAction {
    type: Actions.RequestUserItem;
}

export interface IReceiveUserItemAction {
    type: Actions.ReceiveUserItem;
    payload: any;
}