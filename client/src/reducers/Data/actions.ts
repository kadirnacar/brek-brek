import { AuthService, DataService } from "@services";
import { ApplicationState, AppThunkAction } from '@store';
import { KnownAction } from './reducer';
import { Actions } from './state';
import { BaseActions } from "../Base";
export class DataActions {
    getItem = (entity: string, id: number): AppThunkAction<KnownAction> => async (dispatch, getState: () => ApplicationState) => {
        const state = getState();
        const cacheData = state.Data[entity].List.find(data => data.Id == id);
        if (cacheData) {
            dispatch({ type: Actions.SetCurrentData, entityName: entity, payload: cacheData });
        } else {
            dispatch({ type: Actions.RequestItemData });
            var result = await DataService.getItem(entity, id);
            dispatch({ type: Actions.ReceiveItemData, entityName: entity, payload: result.value });
        }
    }
    getList = (entity: string, cache: boolean = false): AppThunkAction<KnownAction> => async (dispatch, getState: () => ApplicationState) => {
        dispatch({ type: Actions.RequestListData });
        if (cache) {
            const state = getState();
            if (state.Data[entity].List.length > 0) {
                dispatch({ type: Actions.ReceiveListData, entityName: entity, payload: state.Data[entity].List });
                return true;
            }
        }
        var result = await DataService.getList(entity);

        if (!result.hasErrors) {
            dispatch({ type: Actions.ReceiveListData, entityName: entity, payload: result.value });
            return true;
        } else {
            dispatch({ type: BaseActions.IndicatorEnd });
            return result.errors;
        }
    }
    createItem = (entity: string, item: any) => async (dispatch, getState: () => ApplicationState) => {
        dispatch({ type: Actions.RequestCreateData });

        var result = await DataService.create(entity, item);
        if (!result.hasErrors) {
            await dispatch({ type: Actions.ReceiveCreateData, entityName: entity, payload: result.value });
            return true;
        } else {
            dispatch({ type: BaseActions.IndicatorEnd });
            return result.errors;
        }
    }
    updateItem = (entity: string, item: any) => async (dispatch, getState: () => ApplicationState) => {
        dispatch({ type: Actions.RequestUpdateData });

        var result = await DataService.update(entity, item);
        if (!result.hasErrors) {
            await dispatch({ type: Actions.ReceiveUpdateData, entityName: entity, payload: result.value });
            return true;
        } else {
            dispatch({ type: BaseActions.IndicatorEnd });
            return result.errors;
        }
    }
    deleteItem = (entity: string, id: number) => async (dispatch, getState: () => ApplicationState) => {
        dispatch({ type: Actions.RequestDeleteData });

        var result = await DataService.delete(entity, id);
        if (!result.hasErrors) {
            await dispatch({ type: Actions.ReceiveDeleteData, entityName: entity, id });
            return true;
        } else {
            dispatch({ type: BaseActions.IndicatorEnd });
            return result.errors;
        }
    }
}
export const actionCreators: DataActions = new DataActions();