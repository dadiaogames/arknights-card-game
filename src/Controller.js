import React from 'react';
import './Controller.css';

//TODO: reconstruct the controller
export const Controller = (props) => {
  return (
    <div className="controller" >
      {Object.keys(props.actions).map(
        (action) => (
          <button onClick={props.actions[action]} className="controller-button" >{action}</button>
        )
      )}
        <button className="controller-button" onClick={props.checkCard} style={{float:"right", display:props.checkCard?"":"none"}}>查看</button>
    </div>
  );
};

export const EnterGame = (props) => {
  return (
    <div className="enter-game" >
      <button
        className = "enter-game"
        onClick = {props.switchScene}
      >
        {props.switchText}
      </button>
      <button
        className = "enter-game"
        onClick = {props.enterGame}
      >
        进入游戏
      </button>
    </div>
  );
};