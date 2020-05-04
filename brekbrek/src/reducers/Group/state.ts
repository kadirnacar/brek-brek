import {IGroup, IGroupUser} from '@models';
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
  RequestUserList = 'REQUEST_LIST_USERS',
  ReceiveUserList = 'RECEIVE_LIST_USERS',
  SetCurrent = 'SET_CURRENT',
  ClearItem = 'CLEAR_USER',
}

export interface GroupState extends IBaseReducer {
  groups: IGroup[];
  current: IGroup;
}

export interface IClearAction {
  type: Actions.ClearItem;
}

export interface ISetCurrent {
  type: Actions.SetCurrent;
  payload: IGroup;
}

export interface IRequestUpdateAction {
  type: Actions.RequestUpdate;
}

export interface IReceiveUpdateAction {
  type: Actions.ReceiveUpdate;
  payload: {Id: any; item: IGroup};
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

export interface IRequestUserListAction {
  type: Actions.RequestUserList;
}

export interface IReceiveUserListAction {
  type: Actions.ReceiveUserList;
  groupId: string;
  payload: IGroupUser;
}
