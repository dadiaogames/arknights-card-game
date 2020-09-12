import React from 'react';
import { CardRow } from './Card';
import { EnterGame } from './Controller';

import './Board.css';
import './Competition.css';

function DeckRepr(props) {
  return <div className="deck-repr" align="center">
    <div className="deck-repr-name">{props.deckName || "\"热泵通道\"推进之王"}</div>
    <button className="deck-repr-button" onClick={props.checkDeck}>查看</button>
    <button className="deck-repr-button" onClick={props.selectDeck}>选择</button>
  </div>
}

export function DeckSelection(props) {
  return <div className="board" align="center">
    <div className="deck-selection-title">欢迎来到竞技模式！<br/>请选择你的参赛卡组</div>
    {props.decks.map(deck => <DeckRepr {...deck} />)}
    <br/>
    <button className="deck-selection-button">竞技模式介绍</button>
    <button className="deck-selection-button" onClick={props.back}>返回</button>
  </div>
}

export function DeckUpgrade(props) {
  return <div className="board">
    <CardRow cards={props.upgrades || []} states={props.upgradeStates || []} additionalStyle={{marginTop: "35%"}} handleClick={props.handleUpgradeClick}/>
    <div className="card-desc">{props.selectedUpgrade.desc? "获得"+props.selectedUpgrade.desc : ""}</div>
    <CardRow cards={props.cards || []} states={props.cardStates || []} handleClick={props.handleCardClick}/>
    <div className="card-desc">{props.selectedCard && props.selectedCard.desc}</div>
    <button className="deck-selection-button" style={{margin:"2%", padding:"3.5%"}} onClick={props.handleClick}>强化</button>
  </div>
}

export function Competition(props) {
  return <div className="board">
    <div className="results" align="center">
      {props.results[0]}&nbsp;&nbsp;{props.results[1]}&nbsp;&nbsp;{props.results[2]}<br/>
      {props.results[3]}&nbsp;&nbsp;{props.results[4]}
    </div>
    <div className="final-result" align="center">
      <span style={{display:(props.finalResult>=0)?"":"none"}}>最终成绩: <div style={{color: "#1E90FF", fontSize:"250%"}}>{props.finalResult}</div></span>
    </div>

    <EnterGame actions={props.actions} divAlign="center" />

  </div>

}