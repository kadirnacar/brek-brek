import { User, BaseModel } from '@models';
import { BaseState } from '@reducers';

export enum Actions {
    RequestItemData = "REQUEST_ITEM_DATA",
    ReceiveItemData = "RECEIVE_ITEM_DATA",
    SetCurrentData = "SET_CURRENT_DATA",
    RequestListData = "REQUEST_LIST_DATA",
    ReceiveListData = "RECEIVE_LIST_DATA",
    RequestCreateData = "REQUEST_CREATE_DATA",
    ReceiveCreateData = "RECEIVE_CREATE_DATA",
    RequestUpdateData = "REQUEST_UPDATE_DATA",
    ReceiveUpdateData = "RECEIVE_UPDATE_DATA",
    RequestDeleteData = "REQUEST_DELETE_DATA",
    ReceiveDeleteData = "RECEIVE_DELETE_DATA",
}

export interface DataItemState<T extends BaseModel> {
    List: T[];
    CurrentItem?: T;
}

export interface DataState extends BaseState {
    User: DataItemState<User>;
}

export interface ISetItemDataAction {
    type: Actions.SetCurrentData;
    entityName: string;
    payload: BaseModel;
}

export interface IRequestItemDataAction {
    type: Actions.RequestItemData;
}

export interface IReceiveItemDataAction {
    type: Actions.ReceiveItemData;
    entityName: string;
    payload: BaseModel;
}

export interface IRequestListDataAction {
    type: Actions.RequestListData;
}

export interface IReceiveListDataAction {
    type: Actions.ReceiveListData;
    entityName: string;
    payload: BaseModel[];
}

export interface IRequestCreateDataAction {
    type: Actions.RequestCreateData;
}

export interface IReceiveCreateDataAction {
    type: Actions.ReceiveCreateData;
    entityName: string;
    payload: BaseModel;
}

export interface IRequestUpdateDataAction {
    type: Actions.RequestUpdateData;
}

export interface IReceiveUpdateDataAction {
    type: Actions.ReceiveUpdateData;
    entityName: string;
    payload: BaseModel;
}

export interface IRequestDeleteDataAction {
    type: Actions.RequestDeleteData;
}

export interface IReceiveDeleteDataAction {
    type: Actions.ReceiveDeleteData;
    entityName: string;
    id: number;
}