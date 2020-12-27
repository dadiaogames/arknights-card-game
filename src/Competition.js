import React from 'react';
import { CardRow } from './Card';
import { EnterGame } from './Controller';

import './Board.css';
import './Competition.css';
import { get_desc } from './Game';

function DeckRepr(props) {
  return <div className="deck-repr" align="center">
    <div className="deck-repr-name">{props.deckName || "\"热泵通道\"推进之王"}</div>
    <button className="deck-repr-button" onClick={props.checkDeck}>查看</button>
    <button className="deck-repr-button" onClick={props.selectDeck}>选择</button>
  </div>
}

function process_selected_desc(card) {
  // let desc = [card.desc];

  // if (card.onPlayBonus && (card.onPlayBonus.length > 0)) {
  //   desc.push(` (${card.onPlayBonus.map(x => x.name).join(" ")})`);
  // }

  // return desc;

  return (card.mine != undefined)? get_desc(card) : "";
}

function introduce_competition_mode() {
  alert(`欢迎来到竞技模式！此模式适合对游戏规则有足够了解的玩家前来挑战;\n首先，从3套随机卡组中选择1套，作为本次竞技模式的参赛卡组;\n然后，对该卡组进行15次强化;\n接着，进行5次完整的对局，最后，取5次对局中成绩最好的3次对局，以该3局的平均成绩作为最终结果;\n对于一次对局的成绩，如果对局成功，则以该局的危机等级作为该局成绩; 如果该局失败，则成绩记为0;`);
}

export function DeckSelection(props) {
  return <div className="board" align="center">
    <div className="deck-selection-title">{props.welcome_title}<br/>请选择你的参赛卡组</div>
    {props.decks.map(deck => <DeckRepr {...deck} />)}
    <br/>
    <button className="deck-selection-button" onClick={props.introduce || introduce_competition_mode}>{props.introduce_title}</button>
    <button className="deck-selection-button" onClick={props.back}>返回</button>
  </div>
}

export function DeckUpgrade(props) {
  return <div className="board">
    <CardRow cards={props.upgrades || []} states={props.upgradeStates || []} additionalStyle={{marginTop: "20%"}} handleClick={props.handleUpgradeClick}/>
    <div className="upgrade-desc">{props.selectedUpgrade.desc? "获得"+props.selectedUpgrade.desc : ""}</div>
    <CardRow cards={props.cards || []} states={props.cardStates || []} handleClick={props.handleCardClick} additionalStyle={{marginTop: "2%"}}/>
    <div className="card-desc">{props.selectedCard && process_selected_desc(props.selectedCard)}</div>
    <button className="deck-selection-button" style={{margin:"2%", padding:"3.5%"}} onClick={props.handleClick}>升级</button>
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