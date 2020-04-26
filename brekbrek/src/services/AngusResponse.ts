
export interface AngusResponse<T> {
    DataTypes?: any;
    TotalCount?: number;
    ResultSets: Array<Array<T>>;
    SQL: string;
}
export interface FunctionReturn{
    Return?: string;
}
export interface AngusFunctionResponse<T> extends Array<Array<FunctionReturn>> {
}