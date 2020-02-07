import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as reduxAction from '../../store/actions/index';

import Scoreboard from '../../components/Scoreboard/Scoreboard';
import ButtonLg from '../../components/Buttons/ButtonLg/ButtonLg';
import Header from '../../components/Header/Header';
import Messaging from '../../components/Messaging/Messaging';
import GameControls from '../../components/GameControls/GameControls';
import Aux from '../../hoc/Aux/Aux';
class Bowling extends Component {
    // REQUIREMENT 1. 
    start(e) {
        // e.preventDefault(); 
        const frame = {
            rollAttempts: 0,
            frameScore: 0,
            totalScore: 0,
            rolls: [
                {
                    type: null,
                    value: 0
                },
                {
                    type: null,
                    value: 0
                },
            ]
        }
        // last frame, no matter the game frame duration has one extra roll if applicable. 
        const lastFrame = {
            ...frame,
            rolls: [
                ...frame.rolls,
                {
                    type: null,
                    value: 0
                }
            ]
        }
        let frames = new Array(this.props.gameFrameTotal).fill(null).map((cur, idx) => idx !== this.props.gameFrameTotal - 1 ? frame : lastFrame);
        this.props.createFramesAction(frames, !this.props.gameActive);
    }
    // REQUIREMENT 2: 
    // Roll, which takes the number of pins knocked down for a new roll
    roll(e) {
        e.preventDefault();
        // Find the current playing Frame
        let rollValues = this.props.player1.frames[this.props.currentFrame].rolls.map((cur, idx) => { return cur.value })
        const remainingPoints = () => {
            let value = 10;
            // TODO: Not sure this is working properly. 
            if (this.props.currentFrame === (this.props.gameFrameTotal - 1) && ((this.props.player1.frames[this.props.currentFrame].rolls[0].type === 'strike') || (this.props.player1.frames[this.props.currentFrame].rolls[1].type === 'spare'))) {
                value = 20;
            }
            return value
        }
        let possiblePoints = remainingPoints() - rollValues.reduce((acc, cur) => { return acc + cur });
        //  maximum points that should randomly be generated.  Ex: 10-2 = 8
        let knockedPins = Math.ceil(Math.random() * possiblePoints);
    //    let knockedPins = Math.ceil(Math.random() * 10);
        this.scoreByFrame(knockedPins);
    }
    // REQUIREMENT 3: 
    // returns current score for a specified frame
    scoreByFrame(knockedPins) {
        let rollAttempt = this.props.player1.frames[this.props.currentFrame].rollAttempts;
        // ************************************************************************************** SETTING UP THE NEW FRAME
        const calculateFrame = () => {
            // ************************************************************************************** ROLL TYPE
            // This assigns a type to the roll, which is then later used leveraged in determining frame score & total score. 
            const rollType = () => {
                let value = 'normal';
                // Strike
                if (rollAttempt === 0 && knockedPins === 10) {
                    value = 'strike';
                }
                // Spare
                if (rollAttempt === 1 && (this.props.player1.frames[this.props.currentFrame].rolls[0].value + knockedPins === 10)) {
                    value = 'spare';
                }
                // Spare | Last Frame
                else if (rollAttempt === 2 && (this.props.player1.frames[this.props.currentFrame].rolls[1].value + knockedPins === 10)) {
                    value = 'spare';
                }
                // TODO: IS THIS REFERENCEING 
                else if (rollAttempt === 2 && knockedPins === 10) {
                    value = 'strike';
                }
                return value
            };
            // ************************************************************************************** UPDATES THE ROLL WTIH TYPE & VALUE
            let updatedRoll = { type: rollType(), value: knockedPins };
            let updatedRolls = [...this.props.player1.frames[this.props.currentFrame].rolls];
            updatedRolls[rollAttempt] = updatedRoll;
            // ************************************************************************************** UPDATES THE FRAME WITH THE ROLL
            let updatedFrame = { ...this.props.player1.frames[this.props.currentFrame] };
            //  we need to set strike roll attempts to 2 for displaying the score properly. 
            let frameIncrement = rollType() === 'strike' ? 2 : 1
            updatedFrame = {
                ...updatedFrame,
                rollAttempts: rollAttempt += frameIncrement,
                rolls: updatedRolls
            }
            let updatedFrames = [...this.props.player1.frames];
            updatedFrames[this.props.currentFrame] = updatedFrame;
            // ************************************************************************************** PER ROLL | CALCULATE THE SCORE
            calculateFrameScore(updatedFrames, this.props.currentFrame);
            // If there's two roll attempts on the frame, or if there's a strike go to next frame... 
            if ((this.props.currentFrame !== (this.props.gameFrameTotal - 1)) && ((updatedFrame.rollAttempts === 2) || (updatedFrame.rolls[0].type === 'strike'))) {
                this.props.nextFrameAction(this.props.currentFrame);
            }
        }
        // ************************************************************************************** FRAME CALCULATION
        const calculateFrameScore = (updatedFrames, currentFrame) => {
            // Select the targeted frame & update the Frame score. 
            // Sums the total frames -> if a strike or spare adds 10 points 
            const addValues = (targetedFrames, bonus, currentFrameIdx) => {
                //// Calculate Frame Score
                let currentFrameScore = reduceArr(targetedFrames, bonus);
                //// Update the Frame Score. 
                updateframeScore(currentFrameIdx, currentFrameScore);
            }
            const updateframeScore = (targetFrame, currentFrameScore) => {
                updatedFrames[targetFrame].frameScore = currentFrameScore;
            }
            // Sums the rolls scores of a frame -> if strike or spare adds 10 points to sum -> otherwise 0
            const reduceArr = (tFrames, additionalPoints) => {
                let targetValues = tFrames.map(cur => cur.value);
                let baseScore = targetValues.reduce((acc, cur) => {
                    return acc + cur;
                });
                return baseScore + additionalPoints;
            }
            const scoreBasedOnRolls = (roll) => {
                switch (roll) {
                    // NORMAL
                    case 'strike-normal':
                    case 'normal-strike-normal':
                    case 'spare-strike-normal':
                        addValues(updatedFrames[currentFrame].rolls, 10, (currentFrame - 1));
                        break;
                    case 'strike-strike':
                        // Do nothing - more data is needed 
                        break;
                    case 'strike-spare':
                        // Do nothing - more data is needed 
                        break;
                    case 'strike-strike-strike':
                        // 3 strikes in a row... 
                        addValues(updatedFrames[currentFrame].rolls, 20, (currentFrame - 2));
                        break;
                    case 'strike-strike-normal':
                        // 3 strikes in a row... 
                        addValues(updatedFrames[currentFrame].rolls, 20, (currentFrame - 2));
                        break;
                    case 'spare-strike':
                        addValues([updatedFrames[currentFrame].rolls[0]], 20, (currentFrame - 2));
                        break;
                    // case 'spare':
                    case 'spare-normal':
                        addValues([updatedFrames[currentFrame].rolls[0]], 10, currentFrame - 1);
                        break;
                    default:
                        addValues(updatedFrames[currentFrame].rolls, 0, currentFrame);
                }
            }
            // Single Roll 
            // TODO: CHECK THIS OUT... THIS
            const convertToSingleType = (val) => {
                switch (val) {
                    case 'normal-normal':
                        val = 'normal';
                        break;
                    case 'normal-':
                        val = 'normal'
                        break;
                    case 'normal-spare':
                        val = 'spare';
                        break;
                    case 'strike-':
                        val = 'strike';
                        break;
                    default:
                        val = 'normal';
                }
                return val;
            }
            const rollTypeValues = (idx) => {
                let value;
                value = convertToSingleType(updatedFrames[idx].rolls.map(cur => { return cur.type }).join('-'));
                return value
            }
            let currentRoll = rollTypeValues(this.props.currentFrame);
            scoreBasedOnRolls(`${currentRoll}`);
            if (this.props.currentFrame > 1) {
                let firstPreviousRoll = rollTypeValues(this.props.currentFrame - 1);
           
                if (firstPreviousRoll === 'strike') {
                    let secondPreviousRoll = rollTypeValues(this.props.currentFrame - 2);
                    scoreBasedOnRolls(`${secondPreviousRoll}-${firstPreviousRoll}-${currentRoll}`);
      
                }
                else {
                    scoreBasedOnRolls(`${firstPreviousRoll}-${currentRoll}`);
                }
            }
            else {
                scoreBasedOnRolls(`${currentRoll}`);
            }
            this.props.scoreByFrameAction(updatedFrames);
            this.totalScore(updatedFrames);
        }
        return calculateFrame();
    }
    // REQUIREMENT 4: 
    // returns the total score for the game up to the given point
    totalScore(updatedFrames) {
        let totalScores = updatedFrames.map(cur => { return cur.frameScore });
        
        let frame = { ...updatedFrames[this.props.currentFrame] };
        frame = { 
            ...frame,
             totalScore: totalScores.reduce((cur, acc) => { return cur + acc })
        }
        updatedFrames[this.props.currentFrame] = frame;
        this.props.totalScoreAction(updatedFrames);
        // FINAL FRAME: 
        let rollTypes = frame.rolls.map(cur => cur.type);
        let finalRollAmounts = rollTypes.includes('strike') || rollTypes.includes('spare') ? 3 : 2;
        if ((this.props.currentFrame === this.props.gameFrameTotal - 1) && (updatedFrames[this.props.currentFrame].rollAttempts === finalRollAmounts)) {
            this.props.restartGameAction();
        }
    }
    render() {
        return (
            <div>
                <Header frames={this.props.player1.frames} currentFrame={this.props.currentFrame} />
                <Scoreboard player1={this.props.player1} currentFrame={this.props.currentFrame} />
                <Messaging restartGame={this.props.restartGame} frames={this.props.frames} gameFrameTotal={this.props.gameFrameTotal} />
                <GameControls restartGame={this.props.restartGame} restartGameAction={this.props.endGameAction} gameActive={this.props.gameActive} start={()=>this.start()} roll={(e)=>this.roll(e)}/>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        restartGame: state.bowling.restartGame,
        gameFrameTotal: state.bowling.gameFrameTotal,
        gameActive: state.bowling.gameActive,
        currentFrame: state.bowling.currentFrame,
        player1: state.bowling.player1,
        frames: state.bowling.player1.frames
    }
}
const mapDispatchToProps = dispatch => {
    return {
        createFramesAction: (frames, gameActive) => dispatch(reduxAction.createFrames(frames, gameActive)),
        scoreByFrameAction: (updatedFrames) => dispatch(reduxAction.scoreByFrame(updatedFrames)),
        nextFrameAction: (currentFrame) => dispatch(reduxAction.nextFrame(currentFrame)),
        totalScoreAction: (updatedFrames) => dispatch(reduxAction.totalScore(updatedFrames)),
        restartGameAction: () => dispatch(reduxAction.restartGame()),
        endGameAction: (e) => dispatch(reduxAction.endGame(e))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Bowling);