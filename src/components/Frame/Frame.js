import React from 'react';
import './_Frame.scss';
import Rolls from './Rolls/Rolls';
import FrameScore from './FrameScore/FrameScore';

const Frame = (props) => {
    return (
        <div className={(props.currentFrame+1 === props.frameNumber )|| (props.currentFrame === props.frameNumber )? 'Frame':'Frame Frame--hidden-mobile' }>
            <div className="Frame__frame-number">{`Frame ${props.frameNumber}`}</div>
            <div className={props.currentFrame+1 === props.frameNumber? 'Frame__frame-indicator  Frame__frame-indicator--active' : 'Frame__frame-indicator' }></div>
            <div className="Frame__content">
                <Rolls frameData={props.frameData} lastFrame={props.lastFrame}/> 
                <FrameScore frameData={props.frameData}/>
            </div>
        </div>
    );
};
export default Frame;


