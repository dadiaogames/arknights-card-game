import React from 'react';
import './DeckConstruction.css';

export const DeckConstruction = (props) => {
  return (
    <div className="deck-construction" >
      <form>
        请输入卡组名:&nbsp;
        <input 
          type = "text"
          value = {props.value} 
          onChange = {props.handleChange} 
          className = "input-deck-name"
        />
      </form>
      <button
          onClick={props.changeName} 
          style={{
            fontSize: "105%",
            marginTop: "5%",
          }}
        >
          换个随机名字
        </button>
      <br/>
      <p>给卡组取个好听的名字，然后系统会根据名字，生成一套卡组。</p>
    </div>
  );
};