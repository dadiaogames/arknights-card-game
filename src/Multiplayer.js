import React from 'react';
import _ from 'lodash';

import './Board.css';
import './DeckConstruction.css';
import './Multiplayer.css';

function show_multiplayer_intro() {
  alert("欢迎来到多维合作模式！\n这是一个要求二人联机游玩的模式，\n在该模式中，合作双方将共享分数、动乱、敌方场面和材料，\n其他资源(如费用、手牌、场面、订单等)均不共享，\n所以商议好解场的分工和材料的分配，是获胜的关键！\n额外注意:\n* 此模式下，双方需要交流的信息非常多，最好连麦或维持高强度打字通讯；\n* 在开始操作之前，先确认一下双方敌人场面是否一致，否则可能会出现不同步的bug；\n* 敌人状态(比如横置、易伤等)不共享；\n* 敌人的亡语效果仅对一方生效；");
}

export function Multiplayer(props) {
  return <div className="board" style={{textAlign: 'center'}}>
    <img className="multiplayer-img" src="https://img.nga.178.com/attachments/mon_202101/26/-klbw3Q16o-808bZ14T3cSbn-8d.gif"></img>
    <div className="multiplayer-intro">欢迎来到多维合作模式！</div>
    <button className="multiplayer-btn" onClick={props.create_room}>创建房间</button><br/>
    <button  className="multiplayer-btn" onClick={props.enter_room}>加入房间</button><br/>
    <button className="multiplayer-back-btn" onClick={props.back}>返回</button>
    <button className="multiplayer-intro-btn" onClick={show_multiplayer_intro}>合作模式介绍</button>
  </div>
}

export function CreateRoom(props) {
  return <div className="board" style={{textAlign: 'center'}}>
    <div className="create-room-intro">请选择难度</div>
    <button className="difficulty-btn" onClick={props.enter_difficulty(4)}>普通</button><br/>
    <button className="difficulty-btn" onClick={props.enter_difficulty(5)}>高压</button><br/>
    <button className="difficulty-btn" onClick={props.enter_difficulty(6)}>危急</button><br/>
    <button className="multiplayer-back-btn" onClick={props.back}>返回</button>
  </div>
}

export function EnterRoom(props) {
  return <div className="board" style={{textAlign: 'center'}}>
    <div style={{marginTop: "45%"}}>
    <form>
        请输入房间号:&nbsp;
        <input 
          type = "text"
          value = {props.value} 
          onChange = {props.handleChange} 
          className = "input-deck-name"
        />
      </form>
      <button onClick={props.enter_room} className="multiplayer-btn" style={{marginTop:"20%", padding:"5%"}} > 进入房间 </button><br/>
      <button onClick={props.back} className="multiplayer-back-btn" > 返回 </button>
  </div>
  </div>
}

export function get_room_id(difficulty) {
  let date = new Date();
  return "" + (date.getMinutes()%10) + (date.getSeconds()+10) + difficulty + _.random(9);
}