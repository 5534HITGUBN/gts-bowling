import React from 'react';
import './_Frame.scss';
import Rolls from './Rolls/Rolls';
import FrameScore from './FrameScore/FrameScore';

const Frame = (props) => {
    return (
        <div className="Frame">
            <span>{`Frame: ${props.frameNumber}`}</span>
            <div className="Frame__content">
                <Rolls frameData={props.frameData} lastFrame={props.lastFrame}/> 
                <FrameScore frameScore={props.frameData.totalScore}/>
            </div>
        </div>
    );
};
export default Frame;


