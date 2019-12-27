import { AuthState, AuthReducer } from '@reducers';

export interface ApplicationState {
    Auth?: AuthState;
}

export const reducers = {
    Auth: AuthReducer,
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): Promise<any>;
}

export interface AppThunkActionAsync<TAction, TResult> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): Promise<TResult>
}