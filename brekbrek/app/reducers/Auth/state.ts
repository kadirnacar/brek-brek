
export enum Actions {
    RequestLogin = "REQUEST_AUTH_LOGIN",
    ReceiveLogin = "RECEIVE_AUTH_LOGIN",
    Logout = "RECEIVE_AUTH_LOGOUT"
}

export interface AuthState {
    token?: any;
    username?: string;
    userId: number;
    type: "Admin" | "User" | "Facebook" | "Google" | "Anonymous";
    name: string;
    email: string;
    anonymousId: string;
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