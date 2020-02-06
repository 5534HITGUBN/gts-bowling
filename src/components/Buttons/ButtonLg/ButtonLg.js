import React from 'react';
import Aux from '../../../hoc/Aux/Aux';
import './_ButtonLg.scss';
const ButtonLg = (props) => {
    return (
        <Aux>
            <button id={props.id} data-test="component-button" className={props.visible ? `Button ButtonLg` : `Button--hidden`} onClick={(e)=>props.click(e)}>{props.text}</button> 
        </Aux>
    );
};
export default ButtonLg;