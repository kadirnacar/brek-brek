import {Action} from 'redux';
import {
  Actions,
  GroupState,
  IClearAction,
  IReceiveCreateAction,
  IRequestCreateAction,
  IReceiveListAction,
  IRequestListAction,
  IReceiveUpdateAction,
  IRequestUpdateAction,
  IReceiveDeleteAction,
  IRequestDeleteAction,
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
  | IRequestListAction
  | IReceiveUpdateAction
  | IRequestUpdateAction
  | IReceiveDeleteAction
  | IRequestDeleteAction;

export const reducer = (
  currentState: GroupState = unloadedState,
  incomingAction: Action,
) => {
  const action = incomingAction as KnownAction;
  switch (action.type) {
    case Actions.ReceiveDelete:
      if (action.payload) {
        const old = currentState.groups.findIndex(
          (i) => i.Id == action.payload.GroupId,
        );
        if (old > -1) currentState.groups.splice(old, 1);
      }
      currentState.isRequest = false;
      return {...currentState};
    case Actions.RequestDelete:
      currentState.isRequest = true;
      return {...currentState};
    case Actions.ReceiveUpdate:
      if (action.payload) {
        const old = currentState.groups.findIndex(
          (i) => i.Id == action.payload.Id,
        );
        if (old > -1) currentState.groups.splice(old, 1);
        currentState.groups.push(action.payload);
      }
      currentState.isRequest = false;
      return {...currentState};
    case Actions.RequestUpdate:
      currentState.isRequest = true;
      return {...currentState};
    case Actions.ReceiveCreate:
      if (action.payload) {
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
