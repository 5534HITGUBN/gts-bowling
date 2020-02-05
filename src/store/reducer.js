import * as actionsTypes from './actions/actionsTypes';
const initialState = {
    test: 'TESTING FROM REDUX REDUCER',
    gameFrameTotal: 10,
    gameActive: false,
    currentFrame: 0,
    player1: {
        frames: [],
        totalScore: 0
    }
}
const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionsTypes.TESTING_ACTION:
        console.log('TESTING_ACTION');
        return {
            ...state
        }
    }
    // if(action.type === "TESTING_ACTION"){
    //     console.log('TESTING ACTION REDUX');
    //     return state;
    // }
    return state;
}
export default reducer;