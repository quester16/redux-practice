import {legacy_createStore as createStore, combineReducers, compose, applyMiddleware} from 'redux';
import {configureStore} from "@reduxjs/toolkit";
import heroes from "../reducers/heroes";
import filters from "../reducers/filters";
import ReduxThunk from "redux-thunk";


const stringMiddlware = () => (next) => (action) => {
    if(typeof action === 'string'){
        return next({
            type: action
        })
    }
    return next(action)
}


// creating enhancers 
const enhancer = (createStore) => (...args) => {
    const store = createStore(...args)

    const oldDispatch = store.dispatch
    store.dispatch = (action) => {
        if(typeof action === 'string'){
            return oldDispatch({
                type: action
            })
        }
        return oldDispatch(action)
    }
    return store
}

const store = createStore(
    combineReducers({heroes, filters}),
    compose( applyMiddleware(ReduxThunk, stringMiddlware),
          window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

// const store = configureStore({
//     reducer: {heroes, filters},
//     middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddlware),
//     devTools: process.env.NODE_ENV !== 'production'
// })

export default store;