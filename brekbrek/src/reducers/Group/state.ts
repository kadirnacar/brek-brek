import {IGroup} from '@models';
import {IBaseReducer} from '../BaseReducer';

export enum Actions {
  RequestCreate = 'REQUEST_CREATE_GROUP',
  ReceiveCreate = 'RECEIVE_CREATE_GROUP',
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
