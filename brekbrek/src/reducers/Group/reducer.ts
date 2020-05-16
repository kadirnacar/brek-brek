import {Action} from 'redux';
import {
  Actions,
  GroupState,
  IClearAction,
  IReceiveCreateAction,
  IRequestCreateAction,
  IReceiveUpdateAction,
  IRequestUpdateAction,
  IReceiveGroupAction,
  IRequestGroupAction,
  ISetCurrentAction,
} from './state';
import {IGroupUser, UserStatus} from '@models';

const unloadedState: GroupState = {
  current: null,
  currentId: null,
  isRequest: false,
};

export type KnownAction =
  | IReceiveCreateAction
  | IRequestCreateAction
  | IClearAction
  | ISetCurrentAction
  | IReceiveUpdateAction
  | IRequestUpdateAction
  | IReceiveGroupAction
  | IRequestGroupAction;

export const reducer = (
  currentState: GroupState = unloadedState,
  incomingAction: Action,
) => {
  const action = incomingAction as KnownAction;
  switch (action.type) {
    case Actions.ReceiveGroup:
      if (action.payload) {
        currentState.current = action.payload;
      }
      currentState.isRequest = false;
      return {...currentState};
    case Actions.RequestGroup:
      currentState.isRequest = true;
      return {...currentState};
    case Actions.ReceiveUpdate:
      currentState.isRequest = false;
      return {...currentState};
    case Actions.RequestUpdate:
      currentState.isRequest = true;
      return {...currentState};
    case Actions.ReceiveCreate:
      currentState.isRequest = false;
      return {...currentState};
    case Actions.RequestCreate:
      currentState.isRequest = true;
      return {...currentState};
    case Actions.SetCurrent:
      currentState.currentId = action.payload;
      currentState.isRequest = false;
      currentState.current = null;
      return {...currentState};
    case Actions.ClearItem:
      currentState.isRequest = false;
      currentState.current = null;
      currentState.currentId = null;
      return {...currentState};
    default:
      break;
  }

  return currentState || unloadedState;
};
