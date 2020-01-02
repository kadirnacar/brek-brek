import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        const authInfo = localStorage.getItem('user');
        const isLogin = authInfo == null;
        return (
            isLogin
                ? <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                :
                <Component private={true} {...props} />

        );
    }
    } />
)