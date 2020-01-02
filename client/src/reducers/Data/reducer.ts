import { clone } from "@utils";
import { Action, Reducer } from 'redux';
import {
    Actions, DataItemState, DataState, IReceiveListDataAction, IRequestListDataAction,
    IReceiveItemDataAction, IRequestItemDataAction,
    IReceiveCreateDataAction, IRequestCreateDataAction,
    IReceiveDeleteDataAction, IRequestDeleteDataAction,
    IReceiveUpdateDataAction, IRequestUpdateDataAction,
    ISetItemDataAction
} from './state';
import { baseReducer, BaseKnownAction } from '@reducers';

const unloadedState: DataState = {
    User: { List: [] }
};

export type KnownAction = BaseKnownAction | IReceiveListDataAction | IRequestListDataAction
    | IReceiveCreateDataAction | IRequestCreateDataAction
    | IReceiveItemDataAction | IRequestItemDataAction
    | IReceiveDeleteDataAction | IRequestDeleteDataAction
    | IReceiveUpdateDataAction | IRequestUpdateDataAction | ISetItemDataAction;

export const reducer: Reducer<DataState> = (currentState: DataState = unloadedState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    var cloneIndicators = () => clone(currentState.indicators);

    var indicatorReducer = baseReducer(currentState, incomingAction);
    if (indicatorReducer)
        return { ...currentState, indicators: indicatorReducer.indicators };

    switch (action.type) {

        case Actions.SetCurrentData:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            if (action.payload) {
                currentState[action.entityName].CurrentItem = action.payload;
            }
            return { ...currentState, indicators };

        case Actions.ReceiveItemData:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            if (action.payload)
                currentState[action.entityName].CurrentItem = action.payload;
            return { ...currentState, indicators };
        case Actions.RequestItemData:
            var indicators = cloneIndicators();
            indicators.operationLoading = true;
            return { ...currentState, indicators };

        case Actions.ReceiveListData:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            currentState[action.entityName].List = action.payload;
            return { ...currentState, indicators };
        case Actions.RequestListData:
            var indicators = cloneIndicators();
            indicators.operationLoading = true;
            return { ...currentState, indicators };
        case Actions.ReceiveCreateData:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            currentState[action.entityName].List.push(action.payload);
            return { ...currentState, indicators };
        case Actions.RequestCreateData:
            var indicators = cloneIndicators();
            indicators.operationLoading = true;
            return { ...currentState, indicators };
        case Actions.ReceiveDeleteData:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            const index = currentState[action.entityName].List.findIndex(itm => itm.Id == action.id);
            currentState[action.entityName].List.splice(index, 1);
            return { ...currentState, indicators };
        case Actions.RequestDeleteData:
            var indicators = cloneIndicators();
            indicators.operationLoading = true;
            return { ...currentState, indicators };
        case Actions.ReceiveUpdateData:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            const updateItemIndex = currentState[action.entityName].List.findIndex(itm => itm.Id == action.payload.Id);
            currentState[action.entityName].List[updateItemIndex] = action.payload;
            return { ...currentState, indicators };
        case Actions.RequestUpdateData:
            var indicators = cloneIndicators();
            indicators.operationLoading = true;
            return { ...currentState, indicators };
        default:
            break;
    }
    return currentState || unloadedState;
};
