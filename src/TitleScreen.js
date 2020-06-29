import React from 'react';
import './TitleScreen.css';

export const TitleScreen = (props) => (
  <div style={{textAlign: "center", marginTop:"50%"}}>
    <h2>明日方舟: 采掘行动</h2>
    <button className="title-screen-button" onClick={props.enterGame}>进入游戏</button><br/>
    <button className="title-screen-button" onClick={props.checkRule}>查看规则</button><br/>
  </div>
);