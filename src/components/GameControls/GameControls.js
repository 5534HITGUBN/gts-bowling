import React from 'react';
import Aux from '../../hoc/Aux/Aux';
import ButtonLg from '../../components/Buttons/ButtonLg/ButtonLg';
const GameControls = (props) => {
    const controls = () => {
        if (props.gameActive) {
            return (
                <Aux>
                    <ButtonLg visible={!props.restartGame} click={props.roll} text={'Roll'} />
                    <ButtonLg visible={props.restartGame} click={props.restartGameAction} text={'Restart'} />
                </Aux>
            )
        }
    }
    console.log(props.restartGame)
    return (
        <div>
            <ButtonLg visible={!props.gameActive} click={props.start} text={'Start Game'} />
            {controls()}
        </div>
    );
};
export default GameControls;