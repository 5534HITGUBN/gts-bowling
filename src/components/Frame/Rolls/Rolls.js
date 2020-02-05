import React from 'react';
import "./_Rolls.scss";
import Roll from './Roll/Roll';
import Aux from '../../../hoc/Aux/Aux';
const Rolls = (props) => {
    const returnRolls = () => {
        if (props.lastFrame && (props.frameData.rolls[0].type === 'strike' || props.frameData.rolls[1].type === 'spare' )){
            return (
                <Aux>
                    <Roll  lastFrame={true} rolls={props.frameData.rolls} rollNumber="1"/>
                    <Roll  lastFrame={true} rolls={props.frameData.rolls} rollNumber="2"/>
                    <Roll  lastFrame={true} rolls={props.frameData.rolls} rollNumber="3"/>
                </Aux>
            )
        }
        else {
            return (
                <Aux>
                    <Roll  lastFrame={false} rolls={props.frameData.rolls} rollNumber="1" />
                    <Roll  lastFrame={false} rolls={props.frameData.rolls} rollNumber="2"/>
                </Aux>
            )
        }
    }
    return (
        <div>
            <div className="Rolls"> 
   
                {returnRolls()}
              
            </div>
        </div>
    );
};

export default Rolls;