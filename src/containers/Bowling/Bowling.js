import React, { Component } from 'react';
import Scoreboard from '../../components/Scoreboard/Scoreboard';
import ButtonLg from '../../components/Buttons/ButtonLg/ButtonLg';
import {connect} from 'react-redux';
import * as reduxAction from '../../store/actions/index';
class Bowling extends Component {
    // REQUIREMENT 1. 
    // Start, which starts a new game of bowling 
    start(e){
        e.preventDefault(); 
        // Sets the game up with the correct amount of Frames. 
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
            rolls:[
                ...frame.rolls,
                {
                    type: null,
                    value: 0
                }
            ]
        }
        let frames = new Array(this.props.bowling.gameFrameTotal).fill(null).map((cur, idx)=> idx !== this.props.bowling.gameFrameTotal - 1 ? frame : lastFrame);
        this.props.createFramesAction(frames, !this.props.bowling.gameActive);
    }
    // REQUIREMENT 2: 
    // Roll, which takes the number of pins knocked down for a new roll
    roll(e){
        e.preventDefault();
        // Find the current playing Frame

        let rollValues = this.props.bowling.player1.frames[this.props.bowling.currentFrame].rolls.map((cur, idx)=>{return cur.value})
        const remainingPoints = () => {
            let value = 10;
            // TODO: Not sure this is working properly. 
            if (this.props.bowling.currentFrame === (this.props.bowling.gameFrameTotal - 1) && ((this.props.bowling.player1.frames[this.props.bowling.currentFrame].rolls[0].type === 'strike') || (this.props.bowling.player1.frames[this.props.bowling.currentFrame].rolls[1].type === 'spare' ))) {
                value = 20;
            }
            return value
        }
        let possiblePoints = remainingPoints() - rollValues.reduce((acc, cur)=>{return acc + cur});
        console.log(possiblePoints);
        // // This is the maximum integer that should randomly be generated.  Ex: 10-2 = 8
        let knockedPins = Math.ceil(Math.random() * possiblePoints);
        this.scoreByFrame(this.props.bowling, knockedPins);
     
    }
    // REQUIREMENT 3: 
    // returns current score for a specified frame
    scoreByFrame(bowlingState, knockedPins){
        let rollAttempt = bowlingState.player1.frames[bowlingState.currentFrame].rollAttempts;
        // ************************************************************************************** SETTING UP THE NEW FRAME
        const calculateFrame = ()=>{
            // ************************************************************************************** ROLL TYPE
            // This assigns a type to the roll, which is then later used leveraged in determining frame score & total score. 
           const rollType = () => {
                let value = 'normal';
                // Strike
                if (rollAttempt === 0 && knockedPins === 10){
                    value = 'strike';
                }
                // Spare
                if (rollAttempt === 1 && (bowlingState.player1.frames[bowlingState.currentFrame].rolls[0].value + knockedPins === 10)){
                    value = 'spare';
                }
                // Spare | Last Frame
                else if (rollAttempt === 2 && (bowlingState.player1.frames[bowlingState.currentFrame].rolls[1].value + knockedPins === 10)){
                    value = 'spare';
                }
                // TODO: IS THIS REFERENCEING 
                else if (rollAttempt === 2 &&  knockedPins === 10){
                    value = 'strike';
                }
                return value 
            };
            // ************************************************************************************** UPDATES THE ROLL WTIH TYPE & PINS
            let updatedRoll = {type:rollType(), value:knockedPins};
            let updatedRolls = [...bowlingState.player1.frames[bowlingState.currentFrame].rolls];
            updatedRolls[rollAttempt] = updatedRoll;
            // ************************************************************************************** UPDATES THE FRAME WITH THE ROLL
            let updatedFrame = { ...bowlingState.player1.frames[bowlingState.currentFrame] };
            updatedFrame = {
                ...updatedFrame,
                rollAttempts: rollAttempt += 1,
                rolls: updatedRolls  
            }
            let updatedFrames = [...bowlingState.player1.frames];
            updatedFrames[bowlingState.currentFrame] = updatedFrame;
            // ************************************************************************************** PER ROLL | CALCULATE THE SCORE
            calculateFrameScore(updatedFrames, bowlingState.currentFrame);
            // If there's two roll attempts on the frame, or if there's a strike go to next frame... 
            if ((bowlingState.currentFrame !== (bowlingState.gameFrameTotal - 1)) && ((updatedFrame.rollAttempts === 2) || (updatedFrame.rolls[0].type === 'strike'))){
                this.props.nextFrameAction(bowlingState.currentFrame);
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
                let targetValues = tFrames.map(cur=>cur.value);
                let baseScore = targetValues.reduce((acc, cur) => {
                    return acc + cur;
                });
                return baseScore + additionalPoints;
            }
            /// CYCLE THROUGH CURRENT FRAME ROLLS TO DETERMINE SCORING
            updatedFrames[currentFrame].rolls.map((roll, rollIdx) => {
                // FIRST FRAME
                // TODO: Is there anyway to makes this less of a mess?
                if ((rollIdx === 1 && roll.type !== null) && roll.type !== 'spare') {
                    // Sum Values, no Bonus Points. 
                    addValues(updatedFrames[currentFrame].rolls, 0, currentFrame);
                }
                // // MIDDLE FRAMES STRIKES
                else if (currentFrame !== (bowlingState.gameFrameTotal - 1 ) && currentFrame >= 1 && ( updatedFrames[currentFrame - 1].rolls[0].type === 'strike' )) {
                    addValues(updatedFrames[currentFrame].rolls, 10, currentFrame - 1);
                }
                  // // MIDDLE FRAMES SPARES
                else if (currentFrame !== (bowlingState.gameFrameTotal - 1 ) && currentFrame >= 1 && ( updatedFrames[currentFrame - 1].rolls[1].type === 'spare')) {
                    addValues([updatedFrames[currentFrame].rolls[0]], 10, currentFrame - 1);
                }
                // // LAST FRAME STRIKES & SPARES 
                else if (currentFrame === (bowlingState.gameFrameTotal - 1) && ((updatedFrames[currentFrame].rolls[0].type === 'strike') || (updatedFrames[currentFrame].rolls[1].type === 'spare' ))) {
                    addValues(updatedFrames[currentFrame].rolls, 10, currentFrame );
                }
                else {
                    addValues(updatedFrames[currentFrame].rolls, 0, currentFrame);
                }
            });
            this.props.scoreByFrameAction(updatedFrames);
            this.totalScore(updatedFrames);
        
        }
       return calculateFrame();
    }
    // REQUIREMENT 4: 
    // returns the total score for the game up to the given point
    totalScore(updatedFrames){
        
        const targetFrame = () => {
            if (this.props.bowling.currentFrame > 0) {
                let rollType = updatedFrames[this.props.bowling.currentFrame - 1].rolls.map(cur => { return cur.type });
                if (rollType.includes('strike') && updatedFrames[this.props.bowling.currentFrame].rollAttempts === 1) {
                    updateScore(this.props.bowling.currentFrame - 1);
                }
                else if (rollType.includes('spare') && updatedFrames[this.props.bowling.currentFrame].rollAttempts === 1) {
                    updateScore(this.props.bowling.currentFrame - 1);
                }
            }
            updateScore(this.props.bowling.currentFrame);
        } 
        const updateScore = (targetFrame) => {
            let frameScores = updatedFrames.map(frame => {
                return frame.frameScore;
            });
            let totalScore = frameScores.reduce((acc, cur) => { return acc + cur });
            let frame = { ...updatedFrames[targetFrame] }
            frame = { ...frame, totalScore: totalScore }
            updatedFrames[targetFrame] = frame
            this.props.totalScoreAction(updatedFrames);
            let rollTypes = frame.rolls.map(cur=>cur.type);
            let finalRollAmounts = rollTypes.includes('strike') || rollTypes.includes('spare') ? 3 : 2;
            if((this.props.currentFrame === this.props.gameFrameTotal - 1) && ( updatedFrames[this.props.currentFrame].rollAttempts === finalRollAmounts)){
                this.props.restartGameAction();
            }
        }
        return targetFrame();
    }
    render() {
        const startControls = () => {
            if(!this.props.bowling.restartGame){
                return (
                    <div>
                         <ButtonLg id='start-button' visible={!this.props.bowling.gameActive } click={this.start.bind(this)} text={'Start Game'}/> 
                         <ButtonLg id='roll-button' visible={this.props.bowling.gameActive} click={this.roll.bind(this)} text={'Roll'}/>
                    </div>
                )
            }
            else if(this.props.bowling.restartGame){
                return (
                    <div>
                        <div><h2>{this.props.player1.frames[this.props.gameFrameTotal - 1].totalScore < 100 ? 'Yikes...Mulligan' : 'Like a BOSS!'}</h2></div>
                        <div>Your total score was : {this.props.player1.frames[this.props.gameFrameTotal - 1].totalScore}</div><br/>
                        <ButtonLg id='restart-button' visible={this.props.bowling.restartGame} click={this.props.endGameAction} text={'Restart Game'}/>
                    </div>
                )
            }
        }
        return (
            <div>
                <Scoreboard player1={this.props.bowling.player1} />
                {startControls()}
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        bowling: state.bowling,
        restartGame: state.bowling.restartGame,
        gameFrameTotal: state.bowling.gameFrameTotal,
        gameActive: state.bowling.gameActive,
        currentFrame: state.bowling.currentFrame,
        player1: state.bowling.player1,
        frames:state.bowling.player1.frames
    }
}
const mapDispatchToProps = dispatch => {
    return {
        createFramesAction: (frames, gameActive)=>dispatch(reduxAction.createFrames(frames, gameActive)),
        scoreByFrameAction: (updatedFrames)=>dispatch(reduxAction.scoreByFrame(updatedFrames)),
        nextFrameAction: (currentFrame)=>dispatch(reduxAction.nextFrame(currentFrame)),
        totalScoreAction: (updatedFrames)=>dispatch(reduxAction.totalScore(updatedFrames)),
        restartGameAction: ()=>dispatch(reduxAction.restartGame()),
        endGameAction: ()=>dispatch(reduxAction.endGame())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Bowling);