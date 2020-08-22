import React from 'react';
import './TitleScreen.css';

export const TitleScreen = (props) => (
  <div style={{textAlign: "center", marginTop:"40%"}}>
    <h2>明日方舟: 采掘行动</h2>
    <div >
      制作: <a href="https://space.bilibili.com/8492192/dynamic/">大雕游戏</a>
    </div>
    <button className="title-screen-button" onClick={props.enterGame}>进入游戏</button><br/>
    <button className="title-screen-button" onClick={props.checkRule}>玩法教学</button><br/>
    <button className="title-screen-button" onClick={props.checkDeck}>干员图鉴</button><br/>
  </div>
);