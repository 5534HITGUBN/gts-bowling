import * as actionsTypes from '../actions/actionsTypes';
const initialState = {
    gameFrameTotal: 10,
    gameActive: false,
    restartGame: false,
    currentFrame: 0,
    player1: {
        totalScore: 0,
        frames: [],
    }
}
const bowlingReducer = (state = initialState, action) => {
    switch (action.type) {
        // 1. CREATE FRAMES
        case actionsTypes.CREATE_FRAMES:
            return {
                ...state,
                gameActive: action.payload.gameActive,
                player1: {
                    ...state.player1,
                    frames: [
                        ...action.payload.frames
                    ]
                }
            }
        // 2. SCORE FRAME
        case actionsTypes.SCORE_BY_FRAME:
            return {
                ...state,
                player1: {
                    ...state.player1,
                    frames: [
                        ...action.payload.updatedFrames
                    ],
                }
            }
        // 3. GO TO NEXT FRAME
        case actionsTypes.NEXT_FRAME:
            return {
                ...state,
                currentFrame: action.payload.nextFrame
            }
        // 4. SCORE
        case actionsTypes.TOTAL_SCORE:
            return {
                ...state,
                player1: {
                    ...state.player1,
                    frames: [
                        ...action.payload.updatedFrames
                    ]
                }
            }
        // 5. RESTART GAME
        case actionsTypes.RESTART_GAME:
            return {
                ...state,
                restartGame: action.payload.restartGame,

            }
        // 6. END GAME
        case actionsTypes.END_GAME:
            return {
                ...state,
                gameActive: action.payload.gameActive,
                restartGame: action.payload.restartGame,
                currentFrame: 0,
                player1: {
                    frames: [
                        
                    ]
                }
            }
   
    }
    return state;
}
export default bowlingReducer;