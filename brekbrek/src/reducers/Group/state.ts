import {IGroup} from '@models';
import {IBaseReducer} from '../BaseReducer';

export enum Actions {
  RequestCreate = 'REQUEST_CREATE_GROUP',
  ReceiveCreate = 'RECEIVE_CREATE_GROUP',
  RequestUpdate = 'REQUEST_UPDATE_GROUP',
  ReceiveUpdate = 'RECEIVE_UPDATE_GROUP',
  RequestDelete = 'REQUEST_DELETE_GROUP',
  ReceiveDelete = 'RECEIVE_DELETE_GROUP',
  RequestList = 'REQUEST_LIST_GROUP',
  ReceiveList = 'RECEIVE_LIST_GROUP',
  ClearItem = 'CLEAR_USER',
}

export interface GroupState extends IBaseReducer {
  groups: IGroup[];
  current: IGroup;
}

export interface IClearAction {
  type: Actions.ClearItem;
}

export interface IRequestUpdateAction {
  type: Actions.RequestUpdate;
}

export interface IReceiveUpdateAction {
  type: Actions.ReceiveUpdate;
  payload: IGroup;
}

export interface IRequestDeleteAction {
  type: Actions.RequestDelete;
}

export interface IReceiveDeleteAction {
  type: Actions.ReceiveDelete;
  payload: any;
}

export interface IRequestCreateAction {
  type: Actions.RequestCreate;
}

export interface IReceiveCreateAction {
  type: Actions.ReceiveCreate;
  payload: IGroup;
}

export interface IRequestListAction {
  type: Actions.RequestList;
}

export interface IReceiveListAction {
  type: Actions.ReceiveList;
  payload: IGroup[];
}
