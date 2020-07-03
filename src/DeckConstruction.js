import React from 'react';
import './DeckConstruction.css';
import { is_standard } from './DeckGenerator';

export const DeckConstruction = (props) => {
  return (
    <div className="deck-construction">
      <form>
        请组出一套强力或欢乐的卡组
        <br/>
        当前卡组为&nbsp;{is_standard(props.value)?"标准卡组":"狂野卡组"}
        <br/>
        <textarea 
          value={props.value} 
          onChange={props.handleChange} 
          className="deck-construction-textarea" 
          rows={15}
          cols={20}
        />
      </form>
      <button
        onClick={props.checkDeck} 
        className="deck-construction-button"
      >
        查看卡组
      </button>
      <button
        onClick={props.checkCards} 
        className="deck-construction-button"
      >
        干员图鉴
      </button>
      <button
        onClick={()=>{
          alert("标准卡组: 至少30张, 且同名卡不能超过3张;\n狂野卡组: 来啊, 整活啊!");
        }} 
        className="deck-construction-button"
      >
        查看标准
      </button>
      <br/>
      <br/>
      <span>提示：系统不会帮你保存卡组，记得自行保存！</span>
    </div>
  )
}

export const DeckGeneration = (props) => {
  return (
    <div className="deck-generation" >
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
          className="deck-construction-button"
        >
          换个随机名字
        </button>
        <button
          onClick={props.checkDeck} 
          className="deck-construction-button"
        >
          查看卡组
        </button>
        
      <br/>
      <p>给卡组取个好听的名字，然后系统会根据名字，生成一套卡组。</p>
    </div>
  );
};