import { clone } from "../../utils";
import { Action, Reducer } from 'redux';
import { Actions, AuthState, ILogoutAction, IReceiveLoginAction, IRequestLoginAction } from './state';
import * as LocalStorage from '../../store/localStorage';

const unloadedState: AuthState = {
    token: null,
    username: null,
    name: null,
    type: null,
    email: null,
    userId: null,
    anonymousId: null
};

export type KnownAction = IRequestLoginAction | IReceiveLoginAction | ILogoutAction;

export const reducer = (currentState: AuthState = unloadedState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;

    switch (action.type) {
        case Actions.ReceiveLogin:
            if (action && action.payload) {
                currentState.token = action.payload.token;
                currentState.username = action.payload.username;
                currentState.name = action.payload.name;
                currentState.type = action.payload.type;
                currentState.userId = action.payload.userId;
                currentState.email = action.payload.email;
                if (action.payload.anonymousId)
                    currentState.anonymousId = action.payload.anonymousId;
                LocalStorage.setItem("user", JSON.stringify(currentState));
            }
            return { ...currentState };
        case Actions.RequestLogin:
            return { ...currentState };
        case Actions.Logout:
            currentState.token = null;
            currentState.username = null;
            currentState.name = null;
            currentState.type = null;
            currentState.userId = null;
            currentState.email = null;
            LocalStorage.removeItem("user");
            return { ...currentState };
        default:
            break;
    }

    return currentState || unloadedState;
};
