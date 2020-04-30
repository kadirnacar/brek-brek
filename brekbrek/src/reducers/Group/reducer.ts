import {Action} from 'redux';
import {
  Actions,
  GroupState,
  IClearAction,
  IReceiveCreateAction,
  IRequestCreateAction,
  IReceiveListAction,
  IRequestListAction,
} from './state';

const unloadedState: GroupState = {
  current: null,
  groups: [],
};

export type KnownAction =
  | IReceiveCreateAction
  | IRequestCreateAction
  | IClearAction
  | IReceiveListAction
  | IRequestListAction;

export const reducer = (
  currentState: GroupState = unloadedState,
  incomingAction: Action,
) => {
  const action = incomingAction as KnownAction;
  switch (action.type) {
    case Actions.ReceiveCreate:
      if (action.payload) {
        currentState.current = action.payload;
        currentState.groups.push(action.payload);
      }
      currentState.isRequest = false;
      return {...currentState};
    case Actions.RequestCreate:
      currentState.isRequest = true;
      return {...currentState};
    case Actions.ReceiveList:
      if (action.payload) {
        currentState.groups = action.payload;
      }
      currentState.isRequest = false;
      return {...currentState};
    case Actions.RequestList:
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
