import { AuthService } from "@services";
import { ApplicationState, AppThunkAction } from '@store';
import { KnownAction } from './reducer';
import { Actions } from './state';
import { BaseActions } from "../Base";

export const actionCreators = {
    login: (username, password): AppThunkAction<KnownAction> => async (dispatch, getState: () => ApplicationState) => {
        dispatch({ type: Actions.RequestLogin });
        var result = await AuthService.login(username, password);

        if (!result.hasErrors) {
            dispatch({ type: Actions.ReceiveLogin, payload: result.value });
            return true;
        } else {
            dispatch({ type: BaseActions.IndicatorEnd });
            return result.errors;
        }
    },
    checkAuth: (): AppThunkAction<KnownAction> => async (dispatch, getState: () => ApplicationState) => {
        const authInfo = localStorage.getItem('user');
        const isLogin = false;// authInfo == null;
        if (isLogin) {
            return false;
        }
        var result = await AuthService.checkAuth();

        if (!result.hasErrors) {
            if (result.value == false)
                dispatch({ type: Actions.Logout });
            else
                return true;
        } else {
            console.log(result.errors);
            return false;
        }
    },
    logout: (): AppThunkAction<KnownAction> => async (dispatch, getState: () => ApplicationState) => {
        dispatch({ type: Actions.Logout });
    }
}