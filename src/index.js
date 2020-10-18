// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';
// import 'bootstrap/dist/css/bootstrap.css'
//
// ReactDOM.render(<App />, document.getElementById('root'));
//
// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();


import React from 'react';
import thunk from 'redux-thunk'
import {createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider } from 'react-redux'
import { render } from 'react-dom'
// import { createLogger } from 'redux-logger'
import App from './v2/App'
import rootReducer from './store/reducers/index'
import {BrowserRouter, Route, Router} from "react-router-dom";
import { browserHistory } from 'react-router'
import {BLOCK_LAYER, COUNTY_LAYER, FETCH_TILES_SUCCESS, NATION_LAYER, STATE_LAYER} from "./store/ActionTypes";
import { fetchFilters} from "./store/actions";
import './index.css'
 import 'bootstrap/dist/css/bootstrap.css'
import {syncHistoryWithStore, routerReducer, routerMiddleware} from 'react-router-redux'
import { createBrowserHistory } from 'history'

import { push } from 'connected-react-router'
import {StateProvider} from "./v2/context/store";

const middleware = [ thunk ];
const composeEnhancer =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        }) : compose;

if (process.env.NODE_ENV !== 'production') {
    // middleware.push(createLogger())
}


const history = createBrowserHistory()
//
// const store = createStore(
//     rootReducer(history),
//     composeEnhancer(
//         applyMiddleware(
//             routerMiddleware(history),
//             thunk
//         )
//     ),
// )
//
//
//
// store.dispatch(fetchFilters())
render(


        <StateProvider>
            <App />
        </StateProvider>
    ,
    document.getElementById('root')
)
