import Actions from "./myActions";
export interface ReducerState {

}

const defaultState: ReducerState = {

};

export const reducerName = (state: ReducerState = defaultState, action: Actions): ReducerState => {

    return state;
}
