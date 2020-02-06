import React from 'react';
import './_Header.scss';
import Logo from '../../assets/images/bowling.svg'
import { totalScore } from '../../store/actions';
const Header = (props) => {
    const totalScore = () => {
        let value = 0;
        if(props.frames.length > 1 && props.frames[props.currentFrame].rollAttempts !== 0 && (props.currentFrame !== 0)){
            value = props.frames[props.currentFrame].totalScore;
            return value
        }
        else if(props.frames.length > 1 && props.frames[props.currentFrame].rollAttempts === 0 && (props.currentFrame !== 0)){
            value = props.frames[props.currentFrame - 1].totalScore;
            return value
        }
        return value
    }
    // const idx = props.currentFrame;
    // // const totalScore = currentFrame.totalScore;
    // console.log(currentFrame[idx])
    return (
        <div className="Header">
            <h1>BOWLING</h1>
            <div className="Header__logo">
                <img src={Logo}/>
            </div>
         
            <div className="Header__cta">
                <div className="Header__cta__graphic"></div>
                <div className="Header__cta__score">
                    <span>TOTAL SCORE</span>
                    <div className="Header__score__large-number">
                    {totalScore()}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Header;