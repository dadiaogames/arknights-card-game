import React from 'react';
import { CardRow } from './Card';

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
  console.log(props.cards);
  return <div className="board">
    <CardRow cards={[]} additionalStyle={{marginTop: "35%"}}/>
    <div className="card-desc">Some desc</div>
    <CardRow cards={props.cards || []}/>
    <div className="card-desc">{props.selectedCard && props.selectedCard.desc}</div>
    <button className="deck-selection-button" style={{margin:"2%"}}>完成选择</button>
  </div>
}