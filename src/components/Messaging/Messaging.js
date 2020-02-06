import React from 'react';
import './_Messaging.scss';

const Messaging = (props) => {
    if (props.restartGame) {
        return (
            <div className="Messaging">
                <div><h2>{props.frames[props.gameFrameTotal - 1].totalScore < 100 ? '...Mulligan' : 'Like a BOSS!'}</h2></div>
            </div>
        );
    }
    else {
        return (
            <div className="Messaging"></div>
        )
    }
};
export default Messaging;