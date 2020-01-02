import { clone } from "@utils";
import { Action, Reducer } from 'redux';
import { Actions, AuthState, ILogoutAction, IReceiveLoginAction, IRequestLoginAction } from './state';
import { baseReducer, BaseKnownAction } from '@reducers';

const unloadedState: AuthState = {
    data: null,
    username: null,
    indicators: {
        operationLoading: false
    }
};

export type KnownAction = BaseKnownAction | IRequestLoginAction |
    IReceiveLoginAction | ILogoutAction;

export const reducer: Reducer<AuthState> = (currentState: AuthState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    var cloneIndicators = () => clone(currentState.indicators);

    var indicatorReducer = baseReducer(currentState, incomingAction);
    if (indicatorReducer)
        return { ...currentState, indicators: indicatorReducer.indicators };

    switch (action.type) {
        case Actions.ReceiveLogin:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            currentState.data = action.payload.token;
            currentState.username = action.payload.username;
            localStorage.setItem("user", action.payload.token);
            return { ...currentState, indicators };
        case Actions.RequestLogin:
            var indicators = cloneIndicators();
            indicators.operationLoading = true;
            return { ...currentState, indicators };
        case Actions.Logout:
            currentState.data = null;
            currentState.username = null;
            localStorage.removeItem("user");
            return { ...currentState };
        default:
            break;
    }

    return currentState || unloadedState;
};
