
import {
    AuthState, AuthReducer,
    DataState, DataReducer
} from '@reducers';

export interface ApplicationState {
    Auth: AuthState;
    Data: DataState;
}

export const reducers = {
    Auth: AuthReducer,
    Data: DataReducer,
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): Promise<any>;
}

export interface AppThunkActionAsync<TAction, TResult> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): Promise<TResult>
}