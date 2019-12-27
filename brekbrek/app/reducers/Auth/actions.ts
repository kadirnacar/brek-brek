import { AuthService } from "@services";
import * as LocalStorage from '../../store/localStorage';
import { ApplicationState } from "@store";
import { bindActionCreators } from 'redux';
import { Actions } from './state';
import uuid from 'uuid/v4';

export const actionCreators = {
    
    login: (username, password) => async (dispatch, getState) => {
        const state: ApplicationState = getState();
        dispatch({ type: Actions.RequestLogin });
        var result = await AuthService.login(username, password, state.Auth.anonymousId);
        await dispatch({ type: Actions.ReceiveLogin, payload: result.value });
    },
    loginFacebook: (id, name, email) => async (dispatch, getState) => {
        const state: ApplicationState = getState();
        dispatch({ type: Actions.RequestLogin });
        var result = await AuthService.loginFacebook(id, name, email, state.Auth.anonymousId);
        await dispatch({ type: Actions.ReceiveLogin, payload: result.value });
    },
    loginGoogle: (id, name, email) => async (dispatch, getState) => {
        const state: ApplicationState = getState();
        dispatch({ type: Actions.RequestLogin });
        var result = await AuthService.loginGoogle(id, name, email, state.Auth.anonymousId);
        await dispatch({ type: Actions.ReceiveLogin, payload: result.value });
    },
    loginAnonymous: (id, name) => async (dispatch, getState) => {
        dispatch({ type: Actions.RequestLogin });
        var result = await AuthService.loginAnonymous(id, name);
        if (result.value)
            result.value.anonymousId = id;
        await dispatch({ type: Actions.ReceiveLogin, payload: result.value });
    },
    checkAuth: () => async (dispatch, getState) => {
        const authInfo = await LocalStorage.getItem('user');
        const isLogin = authInfo == null;
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
    logout: () => async (dispatch, getState) => {
        const state: ApplicationState = getState();
       
        await dispatch({ type: Actions.Logout });
        const id = state.Auth.anonymousId ? state.Auth.anonymousId : uuid();
        const loginAnonymous = await bindActionCreators(actionCreators.loginAnonymous, dispatch);
        await loginAnonymous(id, "Anonymous User");
    }
}