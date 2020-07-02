import React from 'react';
import './Controller.css';
import { material_icons } from './orders';

function process_action(action) {
  if (action.includes("强化")) {
    return (<span>强化{material_icons[parseInt(action[2])]}</span>);
  }

  return action;
}

export const Controller = (props) => {
  return (
    <div className="controller" >
      {Object.keys(props.actions).map(
        (action) => (
          <button onClick={props.actions[action]} className="controller-button" >{process_action(action)}</button>
        )
      )}
      <button className="controller-button" onClick={props.checkCard} style={{display:props.checkCard?"":"none"}}>查看</button>
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
        {props.action}
      </button>
    </div>
  );
};