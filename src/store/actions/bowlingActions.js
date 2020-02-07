import * as actionTypes from './actionsTypes';
export const createFrames = (frames, gameActive) => {
    // Blank Frame:
    // Sets the game up with the correct amount of Frames. 
    return {
        type: actionTypes.CREATE_FRAMES,
        payload: {
            gameActive: gameActive,
            frames: [...frames]
        }
    }
}
export const scoreByFrame = (updatedFrames) => {
    // REDUCER PAYLOAD: 
    return {
        type: actionTypes.SCORE_BY_FRAME,
        payload: {
            updatedFrames: [...updatedFrames],
        }
    }
}
export const nextFrame = (currentFrame) => {
    return {
        type: actionTypes.NEXT_FRAME, 
        payload:{
            nextFrame : currentFrame += 1
        }
    }
}
export const totalScore = (updatedFrames) => {

  return {
        type: actionTypes.TOTAL_SCORE,
        payload: {
            updatedFrames: [...updatedFrames]
        }
    }
}
export const restartGame = () => {
    return {
        type: actionTypes.RESTART_GAME,
        payload: {
            restartGame: true
        }
    }
}
export const endGame = () => {
    return {
        type: actionTypes.END_GAME,
        payload: {
            gameActive: false,
            restartGame: false
        }
    }
}
