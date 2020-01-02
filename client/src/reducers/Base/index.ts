import { clone } from "@utils";
import { Action, Reducer } from 'redux';

export enum BaseActions {
    IndicatorStart = "INDICATOR_START",
    IndicatorEnd = "INDICATOR_END"
}

export interface BaseState {
    indicators?: {
        operationLoading: boolean;
    };
}

export interface IIndicatorStartAction {
    type: BaseActions.IndicatorStart;
}

export interface IIndicatorEndAction {
    type: BaseActions.IndicatorEnd;
}

export type BaseKnownAction = IIndicatorStartAction |
    IIndicatorEndAction;

const unloadedState: BaseState = {
    indicators: {
        operationLoading: false
    }
};
export const baseReducer: Reducer<BaseState> = (currentState: BaseState, incomingAction: Action) => {
    const action = incomingAction as BaseKnownAction;
    var cloneIndicators = () => clone(currentState.indicators);

    switch (action.type) {
        case BaseActions.IndicatorStart:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            return { ...currentState, indicators };
        case BaseActions.IndicatorEnd:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            return { ...currentState, indicators };
        default:
            return null;
    }
};