import React from 'react';
import './_FrameScore.scss';
const FrameScore = (props) => {
    return (
        <div className="FrameScore">
            FRAME SCORE: {props.frameScore}
        </div>
    );
};

export default FrameScore;