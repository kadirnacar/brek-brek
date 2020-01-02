import { BaseState } from '@reducers';

export enum Actions {
    RequestLogin = "REQUEST_AUTH_LOGIN",
    ReceiveLogin = "RECEIVE_AUTH_LOGIN",
    Logout = "RECEIVE_AUTH_LOGOUT"
}

export interface AuthState extends BaseState {
    data?: any;
    username: string;
}

export interface ILogoutAction {
    type: Actions.Logout;
}

export interface IRequestLoginAction {
    type: Actions.RequestLogin;
}

export interface IReceiveLoginAction {
    type: Actions.ReceiveLogin;
    payload: any;
}