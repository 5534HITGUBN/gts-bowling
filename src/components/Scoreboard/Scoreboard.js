import React from 'react';
import './_Scoreboard.scss';
import Frame from '../Frame/Frame';
const Scoreboard = (props) => {
    let length = props.player1.frames.length;
    return (
        <div className="Scoreboard">
            {props.player1.frames.map((cur, idx)=>{
                return (
                    <Frame key={`frame-${idx}`} lastFrame={idx === length -1 ? true : false} frameData={cur} frameNumber={idx+1} currentFrame={props.currentFrame} />
                )
            })}
        </div>
    );
};
export default Scoreboard;
//TODO: do we the current frame seems redundant on the props