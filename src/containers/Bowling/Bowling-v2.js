import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as reduxAction from '../../store/actions/index';

import Scoreboard from '../../components/Scoreboard/Scoreboard';
import ButtonLg from '../../components/Buttons/ButtonLg/ButtonLg';
import Header from '../../components/Header/Header';
import Messaging from '../../components/Messaging/Messaging';
class Bowling extends Component {
    componentDidMount(){
        this.start();
    }
    // REQUIREMENT 1. 
    // Start, which starts a new game of bowling 
    start(e){
        // e.preventDefault(); 
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
        let frames = new Array(this.props.gameFrameTotal).fill(null).map((cur, idx)=> idx !== this.props.gameFrameTotal - 1 ? frame : lastFrame);
        this.props.createFramesAction(frames, !this.props.bowling.gameActive);
    }
    // REQUIREMENT 2: 
    // Roll, which takes the number of pins knocked down for a new roll
    roll(e){
        e.preventDefault();
        // Find the current playing Frame

        let rollValues = this.props.player1.frames[this.props.currentFrame].rolls.map((cur, idx)=>{return cur.value})
        const remainingPoints = () => {
            let value = 10;
            // TODO: Not sure this is working properly. 
            if (this.props.currentFrame === (this.props.gameFrameTotal - 1) && ((this.props.player1.frames[this.props.currentFrame].rolls[0].type === 'strike') || (this.props.player1.frames[this.props.currentFrame].rolls[1].type === 'spare' ))) {
                value = 20;
            }
            return value
        }
        let possiblePoints = remainingPoints() - rollValues.reduce((acc, cur)=>{return acc + cur});
        // // This is the maximum integer that should randomly be generated.  Ex: 10-2 = 8
        let knockedPins = Math.ceil(Math.random() * possiblePoints);
        this.scoreByFrame(knockedPins);
     
    }
    // REQUIREMENT 3: 
    // returns current score for a specified frame
    scoreByFrame(knockedPins){
        let rollAttempt = this.props.player1.frames[this.props.currentFrame].rollAttempts;
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
                if (rollAttempt === 1 && (this.props.player1.frames[this.props.currentFrame].rolls[0].value + knockedPins === 10)){
                    value = 'spare';
                }
                // Spare | Last Frame
                else if (rollAttempt === 2 && (this.props.player1.frames[this.props.currentFrame].rolls[1].value + knockedPins === 10)){
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
            if ((this.props.currentFrame !== (this.props.gameFrameTotal - 1)) && ((updatedFrame.rollAttempts === 2) || (updatedFrame.rolls[0].type === 'strike'))){
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
                let targetValues = tFrames.map(cur=>cur.value);
                let baseScore = targetValues.reduce((acc, cur) => {
                    return acc + cur;
                });
                return baseScore + additionalPoints;
            }

            /// CYCLE THROUGH CURRENT FRAME ROLLS TO DETERMINE SCORING
            updatedFrames[currentFrame].rolls.map((roll, rollIdx) => {
                // FIRST FRAME
        
                // FIRST FRAME
                if ((rollIdx === 1 && roll.type !== null) && roll.type !== 'spare') {
                    // Sum Values, no Bonus Points. 
                    // s7 - two frames ago was a strike, previous frame was a spare. 
                    addValues(updatedFrames[currentFrame].rolls, 0, currentFrame);
                }
                // MIDDLE FRAMES
                else if (currentFrame !== (this.props.gameFrameTotal - 1 ) && (currentFrame >= 1) ) {
                    // s2 - Previous Frame Had Strike & Current Has Spare
                    if ((updatedFrames[currentFrame - 1].rolls[0].type === 'strike') && ( updatedFrames[currentFrame].rolls[1].type !== 'spare' ) ){
                        addValues(updatedFrames[currentFrame].rolls, 10, currentFrame - 1);
                    }
                    // s3 - Two Consecutive Strikes, but not enough frames to calculate frame score. 
                    else if (updatedFrames[currentFrame -1].rolls[0].type === 'strike' && updatedFrames[currentFrame].rolls[0].type === 'strike' ){
                        // do nothing yet if we have two strikes in a row we need another frame's data. 
                        return;
                    }
                    // s5 - Strike & Consecutive Spare. 
                    else if ((updatedFrames[currentFrame - 1].rolls[0].type === 'strike') && (updatedFrames[currentFrame].rolls[1].type === 'spare')){
                        // do nothing yet if we have two strikes in a row we need another frame's data. 
                        return; 
                    }
                    // s6 - If previous frame had a spare. 
                    else if (updatedFrames[currentFrame - 1].rolls[1].type === 'spare') {
                        addValues([updatedFrames[currentFrame].rolls[0]], 10, currentFrame - 1);
                    }
                    // As long as there are atleast two complete frames - we have to check for consecutive Strikes. 
                    else if(currentFrame >= 2 ){
                        if ( (updatedFrames[currentFrame - 2].rolls[0].type === 'strike') && (updatedFrames[currentFrame - 1].rolls[1].type === 'spare') ){
                          
                            addValues([updatedFrames[currentFrame].rolls[0]], 20, currentFrame - 2);
                        }
                        // S4
                        else if(updatedFrames[currentFrame].rolls[0].type === 'strike' && updatedFrames[currentFrame - 1].rolls[0] === 'strike' && updatedFrames[currentFrame - 2].rolls[0] === 'strike'){
                       
                            addValues(updatedFrames[currentFrame].rolls, 30, currentFrame - 2);
                        }
                        else {
                            addValues(updatedFrames[currentFrame].rolls, 0, currentFrame);
                        }
                    }
                    else {
                        addValues(updatedFrames[currentFrame].rolls, 0, currentFrame);
                    }
  
                }
                // LAST FRAME
                else if (currentFrame === (this.props.gameFrameTotal - 1)) {
                    const lastFrameTypes = updatedFrames[this.props.currentFrame].rolls.map(cur=>cur.type);
                    console.log(lastFrameTypes)
                    if (lastFrameTypes[0] === 'strike' && lastFrameTypes[1] === 'strike', lastFrameTypes[2] === 'strike' ){
                        addValues(updatedFrames[currentFrame].rolls, 30, currentFrame );
                    }
                    else if ((lastFrameTypes[0] === 'strike' )&& (lastFrameTypes[2].type === 'strike')){
                        addValues(updatedFrames[currentFrame].rolls, 20, currentFrame );
                    }
                    else if ((lastFrameTypes[1] === 'spare' )){
                        addValues(updatedFrames[currentFrame].rolls, 10, currentFrame );
                    }
                    else if (updatedFrames[currentFrame - 1].rolls[1].type === 'spare') {
                        addValues([updatedFrames[currentFrame].rolls[0]], 10, currentFrame - 1);
                    }
                }

                // addValues([updatedFrames[currentFrame].rolls[0]], 10, currentFrame);
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
            if (this.props.currentFrame > 0) {
                let rollType = updatedFrames[this.props.currentFrame - 1].rolls.map(cur => { return cur.type });
                if (rollType.includes('strike') && updatedFrames[this.props.currentFrame].rollAttempts === 2) {
                    updateScore(this.props.currentFrame - 1);
                }
                else if (rollType.includes('spare') && updatedFrames[this.props.currentFrame].rollAttempts === 1) {
                    updateScore(this.props.currentFrame - 1);
                }
            }
            updateScore(this.props.currentFrame);
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
                         <ButtonLg visible={!this.props.bowling.gameActive } click={this.start.bind(this)} text={'Start Game'}/> 
                         <ButtonLg visible={this.props.bowling.gameActive} click={this.roll.bind(this)} text={'Roll'}/>
                    </div>
                )
            }
            else if(this.props.bowling.restartGame){
                return (
                    <div>
                        <ButtonLg visible={this.props.bowling.restartGame} click={this.props.endGameAction} text={'Restart Game'}/>
                    </div>
                )
            }
            return (
                <div>
                  
                </div>
            )
        }
        return (
            <div>
                <Header frames={this.props.player1.frames} currentFrame={this.props.currentFrame}/>
                <Scoreboard player1={this.props.player1}  currentFrame={this.props.currentFrame}/>
                <Messaging restartGame={this.props.restartGame} frames={this.props.frames} gameFrameTotal={this.props.gameFrameTotal}/>
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