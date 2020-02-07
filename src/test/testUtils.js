import checkPropTypes from 'check-prop-types';
import {createStore} from 'redux';
import bowlingReducer from '../store/reducers/bowlingReducer';

/**
 *Create a testing store with importd reducers, middleware, and initital state
 * glovbal: bowling reducer
 * @function setup
 * @param {object} initialState - Initial state for the setup
 * @returns {Store} - Redux store
 */

export const storeFactory = (initialState) => {
    createStore(bowlingReducer, initialState)
}

/** 
 * Return node(s) with the given data-test attribute.
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper.
 * @param {string} val - Value of data-test attribute for search. 
 * @returns {ShallowWrapper} 
 */
export const findByTestAttr = (wrapper, val) => {
    return wrapper.find(`[data-test="${val}"]`);
}