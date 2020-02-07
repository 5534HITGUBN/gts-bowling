import React from 'react';
import ReactDOM from 'react-dom';
///// REDUX IMPORTS 
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import bowlingReducer from './store/reducers/bowlingReducer';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
///// REDUX IMPORTS 
import App from './App';

// This was setup with combine Reducers in the event we end up needing more containers & state in the future. 
const rootReducer = combineReducers({
    bowling: bowlingReducer,
});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));
ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));
