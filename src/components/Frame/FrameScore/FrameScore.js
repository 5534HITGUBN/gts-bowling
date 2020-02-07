import React from 'react';
import './_FrameScore.scss';
const FrameScore = (props) => {
    return (
        <div className="FrameScore">
            <span>Frame Score</span>
             { props.frameData.rollAttempts >= 2 ? props.frameData.frameScore : null}
        </div>
    );
};
export default FrameScore;