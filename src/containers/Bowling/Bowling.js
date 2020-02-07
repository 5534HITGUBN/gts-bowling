import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as reduxAction from '../../store/actions/index';

import Scoreboard from '../../components/Scoreboard/Scoreboard';
import Header from '../../components/Header/Header';
import Messaging from '../../components/Messaging/Messaging';
import GameControls from '../../components/GameControls/GameControls';
import Aux from '../../hoc/Aux/Aux';
class Bowling extends Component {
    // REQUIREMENT 1. 
    // starts a new game of bowling 
    start(e) {
        // e.preventDefault(); 
        const frame = {
            rollAttempts: 0,
            frameScore: 0,
            totalScore: 0,
            rolls: [
                { type: null, value: 0},
                { type: null, value: 0},
            ]
        }
        // Last Frame
        // Game is setup so game duration is the same & 
        const lastFrame = {
            ...frame,
            rolls: [
                ...frame.rolls,
                { type: null, value: 0},
            ]
        }
        const frames = new Array(this.props.gameFrameTotal).fill(null).map((cur, idx) => idx !== this.props.gameFrameTotal - 1 ? frame : lastFrame);
        this.props.createFramesAction(frames, !this.props.gameActive);
    }
    // REQUIREMENT 2: 
    // Roll, which takes the number of pins knocked down for a new roll
    roll(e) {
        e.preventDefault();
        // Find the current playing Frame
        const rollValues = this.props.player1.frames[this.props.currentFrame].rolls.map((cur, idx) => { return cur.value })
        const remainingPoints = () => {
            let value = 10;
            // Final Frame & 1st or 2nd Roll are not normal
            if (this.props.currentFrame === (this.props.gameFrameTotal - 1)) {
                const finalRollTypes = this.props.player1.frames[this.props.currentFrame].rolls.map(cur=>{return cur.type});
                finalRollTypes.includes('spare', 'strike') ?    value = 20 : value = 10
            }
            return value
        }
        let possiblePoints = remainingPoints() - rollValues.reduce((acc, cur) => { return acc + cur });
        let knockedPins = Math.ceil(Math.random() * possiblePoints);
        this.scoreByFrame(knockedPins);
    }
    // REQUIREMENT 3: 
    // returns current score for a specified frame
    scoreByFrame(knockedPins) {
        let rollAttempt = this.props.player1.frames[this.props.currentFrame].rollAttempts;
        const calculateFrame = () => {
            // This assigns a type to the roll
            // later used leveraged in determining frame score & total score. 
            const rollType = () => {
                let value = 'normal';
                // Strike
                if (rollAttempt === 0 && knockedPins === 10) {
                    value = 'strike';
                }
                // Spare
                else if (rollAttempt === 1 && (this.props.player1.frames[this.props.currentFrame].rolls[0].value + knockedPins === 10)) {
                    value = 'spare';
                }
                // Spare | Last Frame
                else if (rollAttempt === 2 && (this.props.player1.frames[this.props.currentFrame].rolls[1].value + knockedPins === 10)) {
                    value = 'spare';
                }
                else if (rollAttempt === 2 && knockedPins === 10) {
                    value = 'strike';
                }
                return value
            };
            // UPDATES THE ROLL WTIH TYPE & VALUE
            const updatedRoll = { type: rollType(), value: knockedPins };
            const updatedRolls = [...this.props.player1.frames[this.props.currentFrame].rolls];
            updatedRolls[rollAttempt] = updatedRoll;
            //  UPDATES THE FRAME WITH THE ROLL
            let updatedFrame = { ...this.props.player1.frames[this.props.currentFrame] };
            //  we need to set strike roll attempts to 2 for displaying the score properly. 
            const frameIncrement = rollType() === 'strike' ? 2 : 1
            updatedFrame = {
                ...updatedFrame,
                rollAttempts: rollAttempt += frameIncrement,
                rolls: updatedRolls
            }
            const updatedFrames = [...this.props.player1.frames];
            updatedFrames[this.props.currentFrame] = updatedFrame;
            //  PER ROLL | CALCULATE THE SCORE
            calculateFrameScore(updatedFrames, this.props.currentFrame);
            // If there's two roll attempts on the frame, or if there's a strike go to next frame... 
            if ((this.props.currentFrame !== (this.props.gameFrameTotal - 1)) && ((updatedFrame.rollAttempts === 2) || (updatedFrame.rolls[0].type === 'strike'))) {
                this.props.nextFrameAction(this.props.currentFrame);
            }
        }
        // FRAME CALCULATION
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
                    case 'strike':
                    case 'strike-strike':
                    // case 'strike-spare':
                        // Do nothing - more data / rolls are required 
                        break;
                    case 'strike-spare':
                        // 3 strikes in a row... 
                        addValues(updatedFrames[currentFrame].rolls, 20, currentFrame - 1);
                        break;
                    case 'strike-strike-strike':
                        // 3 strikes in a row... 
                        addValues(updatedFrames[currentFrame].rolls, 30, currentFrame - 2);
                        break;
                    case 'strike-strike-normal':
                        // 2 strikes in a row... 
                        addValues([updatedFrames[currentFrame].rolls[0]], 20, currentFrame - 2);
                        break;
                    case 'strike-normal-normal':
                        addValues(updatedFrames[currentFrame].rolls, 10, currentFrame - 2);
                        break;
                    case 'strike-spare-normal':
           
                        addValues(updatedFrames[currentFrame-1].rolls, 10, currentFrame - 2);
                        break;
                    case 'strike-spare-spare':
                        addValues([updatedFrames[currentFrame].rolls[0]], 20, currentFrame - 2);
                        break;
                    case 'spare-normal':
                    case 'spare-normal-normal':
                    case 'normal-spare-normal':
                        addValues([updatedFrames[currentFrame].rolls[0]], 10, currentFrame - 1);
                        break;
                    case 'spare-spare-normal':
                    case 'spare-strike': 
                        addValues([updatedFrames[currentFrame].rolls[0]], 10, currentFrame - 1);
                        break;
                    default:
                        addValues(updatedFrames[currentFrame].rolls, 0, currentFrame);
                }
            }
            // creates overall frame roll type
            const convertToSingleType = (val) => {
                switch (val) {
                    // normal -- without a second roll
                    case 'normal-':
                    case 'normal-normal':
                        val = 'normal';
                        break;
                    // Spare
                    case 'normal-spare':
                        val = 'spare';
                        break;
                    case 'strike-':
                    case 'strike-normal':
                        val = 'strike';
                        break;
                    default:
                        val ='normal';
                }
                return val;
            }
            const rollTypeValues = (idx) => {
                let value;
                // join both roll values together to create a string -> then determines the overall frame roll type. 
                value = convertToSingleType(updatedFrames[idx].rolls.map(cur => { return cur.type }).join('-'));
                return value
            }
            const currentRoll = rollTypeValues(this.props.currentFrame);
        
            scoreBasedOnRolls(`${currentRoll}`);
            if (this.props.currentFrame >= 1) {
                const firstPreviousRoll = rollTypeValues(this.props.currentFrame - 1);
  
                if ((firstPreviousRoll === 'strike' || firstPreviousRoll === 'spare') && this.props.currentFrame >= 2) {
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
        const totalScores = updatedFrames.map(cur => { return cur.frameScore });
        let frame = { ...updatedFrames[this.props.currentFrame] };
        frame = { 
            ...frame,
             totalScore: totalScores.reduce((cur, acc) => { return cur + acc })
        }
        updatedFrames[this.props.currentFrame] = frame;
        this.props.totalScoreAction(updatedFrames);
        // FINAL FRAME: 
        const rollTypes = frame.rolls.map(cur => cur.type);
        const finalRollAmounts = rollTypes.includes('strike') || rollTypes.includes('spare') ? 3 : 2;
        if ((this.props.currentFrame === this.props.gameFrameTotal - 1) && (updatedFrames[this.props.currentFrame].rollAttempts === finalRollAmounts)) {
            this.props.restartGameAction();
        }
    }
    render() {
        return (
            <Aux>
                <div></div>
                <Header frames={this.props.player1.frames} currentFrame={this.props.currentFrame} />
                <Scoreboard player1={this.props.player1} currentFrame={this.props.currentFrame} />
                <Messaging restartGame={this.props.restartGame} frames={this.props.frames} gameFrameTotal={this.props.gameFrameTotal} />
                <GameControls restartGame={this.props.restartGame} restartGameAction={this.props.endGameAction} gameActive={this.props.gameActive} start={()=>this.start()} roll={(e)=>this.roll(e)}/>
            </Aux>
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