import Routes from "@routes";
import "font-awesome/css/font-awesome.css";
import { SnackbarProvider } from 'notistack';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import history from "./history";
import { loadState } from "./store/localStorage";
import { StoreHelper } from "./store/StoreHelper";
import "./assets/style.scss";

const initialState = loadState();
const store = StoreHelper.initStore(history, initialState);
const authInfo = localStorage.getItem('user');

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <SnackbarProvider maxSnack={3} anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}>
        <Routes />
      </SnackbarProvider>
    </BrowserRouter>
  </Provider>
  ,
  document.getElementById("react-root")
);
