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
} from './state';
import {IGroupUser, UserStatus} from '@models';

const unloadedState: GroupState = {
  current: null,
  isRequest: false,
};

export type KnownAction =
  | IReceiveCreateAction
  | IRequestCreateAction
  | IClearAction
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
    case Actions.ClearItem:
      currentState.isRequest = false;
      currentState.current = null;
      return {...currentState};
    default:
      break;
  }

  return currentState || unloadedState;
};
