import {IGroup, IGroupUser, IUserGroup} from '@models';
import {IBaseReducer} from '../BaseReducer';

export enum Actions {
  RequestCreate = 'REQUEST_CREATE_GROUP',
  ReceiveCreate = 'RECEIVE_CREATE_GROUP',
  RequestUpdate = 'REQUEST_UPDATE_GROUP',
  ReceiveUpdate = 'RECEIVE_UPDATE_GROUP',
  RequestGroup = 'REQUEST_GROUP',
  ReceiveGroup = 'RECEIVE_GROUP',
  SetCurrent = 'SET_CURRENT',
  ClearItem = 'CLEAR_USER',
}

export interface GroupState extends IBaseReducer {
  current?: IGroup;
  currentId?: string;
}

export interface IClearAction {
  type: Actions.ClearItem;
}

export interface ISetCurrentAction {
  type: Actions.SetCurrent;
  payload: string;
}

export interface IRequestUpdateAction {
  type: Actions.RequestUpdate;
}

export interface IReceiveUpdateAction {
  type: Actions.ReceiveUpdate;
  payload: {Id: any; item: IGroup};
}

export interface IRequestCreateAction {
  type: Actions.RequestCreate;
}

export interface IReceiveCreateAction {
  type: Actions.ReceiveCreate;
  payload: IGroup;
}

export interface IRequestGroupAction {
  type: Actions.RequestGroup;
}

export interface IReceiveGroupAction {
  type: Actions.ReceiveGroup;
  groupId: string;
  payload: any;
}
