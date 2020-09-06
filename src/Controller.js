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
      {Object.keys(props.actions).map(action => <button
        className = "enter-game"
        onClick = {props.actions[action]}
      >
        {action}
      </button>)}
      {/* <button
        className = "enter-game"
        onClick = {props.advancedSettings}
        style = {{display:props.advancedSettings?"":"none"}}
      >
        高级设置
      </button>
      <button
        className = "enter-game"
        onClick = {props.fastSetup}
        style = {{display:props.fastSetup?"":"none"}}
      >
        快速设置
      </button>
      <button
        className = "enter-game"
        onClick = {props.back}
        style = {{display:props.back?"":"none"}}
      >
        返回标题
      </button> */}
    </div>
  );
};