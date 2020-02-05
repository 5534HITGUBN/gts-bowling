import React from 'react';
import './_Roll.scss';
const Roll = (props) => {
    // If there is a spare or strike render the appropriate alias symbol. 
    const alias = (rollNumber) => {
        let rollValues = props.rolls.map((cur, idx)=>{return cur.value})
        let rollValueSum = rollValues.reduce((acc, cur)=>{return acc + cur});
        let value
      
        
        if(parseInt(rollNumber) === 1){

           value = props.rolls[0].value === 10 ? 'X' : props.rolls[0].value;
           return value;
        }
        else if(parseInt(rollNumber) === 2 ){

            // If the sum of the two frames is 10, and the first frame is not 10... It's a spare. 

            value = rollValueSum >= 10 && props.rolls[0].value !== 10 ? '/' : props.rolls[1].value;
            return value;
        }
        else if (parseInt(rollNumber) === 3){
            // console.log('last roll')
            // If it's a strike on first frame you could try to roll a second strike. 
            // if its a spare you get to roll again. 

            if(props.rolls[2] === 10){
                value = 'X'
      
            }
            else{
                value = props.rolls[2].valuea
         
            }
            return props.rolls[2].value
        }
      
    }
    return (
        <div className={ !props.lastFrame ? `Roll` :  `Roll Roll--last-frame`}>
            <div className="Roll__number">
                <span>Roll {props.rollNumber}</span>
            </div>
            <div className="Roll__score">
                <span>Score: {alias(props.rollNumber)}</span>
            </div>
        </div>
    );
};
export default Roll;