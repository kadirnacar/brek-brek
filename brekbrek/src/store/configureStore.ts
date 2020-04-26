import { applyMiddleware, combineReducers, compose, createStore, ReducersMapObject, Store, StoreEnhancerStoreCreator } from "redux";
import thunk from "redux-thunk";
import { ApplicationState, reducers } from "./index";

export const configureStore = (initialState: any) => {
  // const windowIfDefined = typeof window === 'undefined' ? null : window as any;
  // const devToolsExtension = windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__;
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const createStoreWithMiddleware = composeEnhancers(applyMiddleware(thunk), <S>(next: StoreEnhancerStoreCreator<S>) => next)(
    createStore
  );
  const allReducers = buildRootReducer(reducers);
  const store = createStoreWithMiddleware(allReducers, initialState) as Store<ApplicationState>;
  return store;
};

const buildRootReducer = (allReducers: ReducersMapObject): any => {
  return combineReducers(Object.assign({}, allReducers));
};
