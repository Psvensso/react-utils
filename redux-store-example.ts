/// <reference path="../../node_modules/@types/webpack-env/index.d.ts" />
import { Store, createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from "redux-thunk";
import { answersReducer, claimsReducer, concensusReducer, targetObjectsReducer } from "./reducers";

//NEEDS TO FOLLOW : IRootState
const rootReducers = {
    answers: answersReducer,
    claims:claimsReducer,
    concents:concensusReducer,
    targetObjects:targetObjectsReducer
};

export type IRootState = { [k in keyof (typeof rootReducers)]: ReturnType<(typeof rootReducers)[k]> };

interface MapLike<T> {
    [index: string]: T;
}



/**
 * getStore
 * Wraps store in a 'singleton' function,
 * This allows for a deffered loading of bootstrap data (like user id) on initial load.
 */
let store: Store<IRootState> = null;
export function getStore() {
    if (!!store) {
        return store;
    }
    function buildRootReducer(allReducers) {
        return combineReducers<IRootState>(Object.assign({}, allReducers));
    }
    // Build middleware. These are functions that can process the actions before they reach the store.
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    // If devTools is installed, connect to it
    const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension;

    // Combine all reducers and instantiate the app-wide store instance
    const allReducers = buildRootReducer(rootReducers);

    store = createStore(
        allReducers,
        compose(
            applyMiddleware(thunk),
            devToolsExtension ? devToolsExtension() : f => f
        )
    ) as Store<IRootState>;

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('./store', () => {
            const nextRootReducer = require<any>('./store');
            store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
        });
    }

    return store;
}  
