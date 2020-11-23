import React from 'react';
import _ from 'lodash';
import { produce } from 'immer';
import { get_deck_name, generate_deck_s2, get_roguelike_pick } from './DeckGenerator';
import { str2deck } from './Game';
import { map_object, PRNG } from './utils';
import { TAGS } from './tags';
// import { InversedTabs } from './InversedTabs';

import './Board.css';
import './Card.css';
import './Roguelike.css';
import './Competition.css';
import { ICONS } from './icons';
import { CARDS, heijiao_in_dream } from './cards';
import { UPGRADES } from './upgrades';

export function introduce_roguelike_mode() {
  alert(`欢迎来到Roguelike模式“黑角的金针菇迷境”！\n通关要求：完成9局对战；\n每一局对战，都有要求的危机等级，在要求的危机等级下，完成该局对战，即可获得赏金，并进入下一局对战；\n如果其中一次对局失败，则本次Roguelike旅程即失败，胜败乃兵家常事，大侠请重头再来；\n在每一局对战中，如果你挑战比要求难度更高的危机等级，则会获得更多的赏金！\n`);
}

function setup_roguelike_mode(S) {
  console.log("Roguelike mode reset");
  S.roguelike_mode = true;

  S.Deck = [];

  S.gold = 60;

  S.game_count = 1;
  S.level_required = 0;

  S.central_idx = 0;

  S.dream_count = 0;

  reset_card_picks(S);
  reset_shop(S);
}

function end_roguelike_mode(S) {
  S.roguelike_mode = false;
  S.tags = TAGS.map(x => ({...x}));
}

function set_difficulty(S, difficulty) {
  S.difficulty = difficulty;

  S.levels = [12, 14, 16, 18, 22, 26, 30, 34, 45];

  if (difficulty == "hard") {
    S.levels = [15, 18, 21, 24, 30, 36, 42, 48, 60];
  }

  S.level_required = S.levels[0];
}

function setup_deck_selection(S) {
  S.deck_names = _.times(3, get_deck_name).map(x => x + "·黑角");
  S.deck_list = S.deck_names.map(generate_deck_s2).map(str2deck); // TODO: change the generator
}

function get_pick() {
  return get_roguelike_pick().map(card => CARDS.find(x => x.name == card)).filter(card => card != undefined);
}

function reset_card_picks(S) {
  S.card_picks = _.times(3, get_pick);
}

function get_shop_item() {
  let shop_item = {};
  let rng = new PRNG(Math.random()); // It seems like set seed in PRNG setup does not work, it is so wired.

  // Get upgrade
  let upgrade = rng.choice(UPGRADES);
  shop_item.name = "升级: " + upgrade.name;
  shop_item.price = 20;

  return shop_item;
}

function reset_shop(S) {
  S.shop_items = _.times(6, get_shop_item);
}

// EH: Actually it's better to set all formats the same, but Deck selection is done on board
function pick_cards(S, idx) {
  S.Deck = [...S.Deck, ...S.card_picks[idx]];
  S.card_picks = undefined;
}

function skip_pick(S) {
  S.card_picks = undefined;
  S.gold += 10;
}

function enter_dream(S) {
  S.dream_count += 1;
  if (S.dream_count == 9) {
    alert("已进入黑角梦境");
    S.Deck = _.times(10, () => heijiao_in_dream);
  }
  S.gold = 5000;
}

export function get_gold_gained(risk_level, level_required) {
   let gold_gained = 30;

    let level_diff = risk_level - level_required;
    gold_gained += Math.min(level_diff * 10, 100);

    // For slam, don't store them in variables, instead, calculate it on time
    // So do plenty of other things
    if (level_diff >= 4) {
      gold_gained += 50;
    }
    if (level_diff >= 8) {
      gold_gained += 50;
    }

    return gold_gained;

}

function continue_run(S) {
  // Resets go here
  S.central_idx = 1;
  reset_shop(S);
  reset_card_picks(S);

  if (S.won) {
    S.gold += get_gold_gained(S.level_achieved, S.level_required);
  }

  S.game_count += 1;
  if ((S.level_achieved - S.level_required) >= 8) {
    S.game_count += 1;
  }
  S.game_count = Math.min(S.game_count, 9);

  S.level_required = S.levels[S.game_count - 1];
}

export function RoguelikeDeckSelection(props) {
  return <div className="board" align="center">
    <div className="deck-selection-title">选择你的卡组</div>
    {props.decks.map(deck => <RoguelikeDeckRepr {...deck} />)}
    <br/>
    {/* <button className="deck-selection-button" onClick={props.back}>返回</button> */}
  </div>
}

function RoguelikeDeckRepr(props) {
  return <div className="deck-repr" align="center">
    <div className="deck-repr-name">{props.deckName || "\"热泵通道\"推进之王"}</div>
    <button className="deck-repr-button" onClick={props.checkDeck}>查看</button>
    <button className="deck-repr-button" onClick={props.selectDeck}>选择</button>
  </div>
}


export function Prepare(props) {
  return <div className="central" align="center">
    <h3 className="prepare">目前进度: 第{props.game_idx}/9战</h3>
    <p className="prepare">要求危机等级: {props.risk_level_required}</p>
    <button className="prepare" onClick={props.enter_game} >进入对战</button>
    <button className="prepare" onClick={props.check_deck} >查看卡组</button>
  </div>;
}

export function Pick(props) {
  return <div className="pick" align="center">
    <br/>
    {props.cards.map(card => <>{card.name}<br/></>)}
    <button className="pick-button" onClick={props.check_cards}>查看</button>
    <button className="pick-button" onClick={props.pick_cards}>加入</button>
  </div>
}

export function GoldAmount(props) {
  return <div className="gold-wrapper desc">
    <span className="gold-amount">{ICONS.gold}{props.gold}</span>
  </div>;
}
export function PickCards(props) {
  // console.log(props.picks);
  return <div className="central" align="center">
    <GoldAmount gold={props.gold} />
    <button className="refresh-picks" onClick={props.refresh_picks}><span>刷新选牌({ICONS.gold}10)</span></button>
    {props.picks.map((cards, idx) => <Pick cards={cards} check_cards={() => props.check_cards(idx)} pick_cards={() => props.pick_cards(idx)} />)}
    <button className="skip-picks" onClick={props.skip_picks}><span>跳过选牌并获得{ICONS.gold}10</span></button>
  </div>
}

function ShopItem(props) {
  return <div className="shop-item" align="center">
    <div className="shop-item-img-container"><img src={props.src} className="shop-item-img"/></div>
    <div className="shop-item-info" align="center">
      <span className="shop-item-name">{props.name}</span>
      <br/>
      <span className="shop-item-price">{ICONS.gold}{props.price}</span>
      <br/>
      <div className="shop-item-desc">{props.desc}</div>
    </div>
    <button className="buy" onClick={props.buy}>购买</button>
  </div>
}

export function Shop(props) {
  return <div className="central" align="center">
    <GoldAmount gold={props.gold} />
    <div className="shop-items">    
      {props.shop_items.map((item, idx) => <ShopItem {...item} buy={() => props.buy(idx)} />)}
    </div>
    <button className="refresh-shop" onClick={props.refresh_shop}>刷新商店(10{ICONS.gold})</button>
  </div>

}

export function Roguelike(props) {
  return <div className="central">
    <div className="heijiao-container-2"></div>
    <div className="counter-container" align="center">
      <div className="battle-count-title" >第<span className="battle-count">{props.game_count || 1}</span>/<span onClick={props.enter_dream}>9</span>战</div>
    </div>
    <div className="roguelike-operations">
      <button onClick={props.enter_battle} className="roguelike-operation primary">进入对战</button>
      <button onClick={props.check_deck} className="roguelike-operation">查看卡组</button>
      <button onClick={props.check_relics} className="roguelike-operation">查看藏品</button>
    </div>
  </div>
}

export function FinishPick(props) {
  return <div className="central" align="center">
    <GoldAmount gold={props.gold} />
    <div className="finish-pick">你已经完成了选择</div>
  </div>
}

export function RoguelikeTabs(props) {
  return <div className="roguelike-tabs" align="center">
    {props.selections.map((selection, idx) => <button className="roguelike-tab" onClick={()=>props.onSelect(idx)}>{selection}</button>)}
  </div>
}

export function RoguelikeEntry(props) {
  return <div className="board">
    <div className="entry">欢迎来到集成战略模式“黑角的金针菇迷境”！<br/>请选择难度</div>
    <div className="difficulty-selection">
      {props.difficulties.map(selection => <button className="difficulty-button" onClick={selection.handleClick}>{selection.name}</button>)}
    </div>
    <button className="introduce-button" onClick={introduce_roguelike_mode}>集成战略模式介绍</button>
  </div>
}

export function ShowMeTheMoney(props) {
  return <div className="gold-gained">
    {ICONS.gold}+{props.amount}
  </div>

}

export function ResultWin(props) {
  let slam = "";
  if (props.slam) {
    slam = "满贯！";
  }
  if (props.grand_slam) {
    slam = "大满贯！";
  }
  return <div className="board" align="center">
    <div className="result-info">
      任务完成<br/>
      第{props.game_count}/9战<br/>
      要求等级: {props.level_required}<br/>
      实际等级: {props.level_achieved}<br/>
    </div>
    <ShowMeTheMoney 
      amount = {props.gold_amount}
    />
    <div className="slam">{slam}</div>
    <button className="continue-btn primary" onClick={props.continue} >继续</button>
  </div>

}

export function ResultLose(props) {
  return <div className="board" align="center">
    <div className="result-info">
      任务失败<br/>
      第{props.game_count}/9战<br/>
    </div>
    <div className="result-quote">
      胜败乃兵家常事<br/>
      大侠请重新来过
    </div>
    <button className="endrun-btn" onClick={props.continue}>结束游戏</button>
  </div>
}

export function FinalResult(props) {
  return <div className="board" align="center">
    <div className="result-info">
      <div className="ascension">通关！</div>
      完成难度: {props.difficulty}
    </div>
    {/* TODO: Add show deck and show relics */}
  <button className="endrun-btn" onClick={props.continue}>{props.endgame}</button>
  </div>


}

export const roguelike = {
  setup_roguelike_mode,
  set_difficulty,
  setup_deck_selection,
  pick_cards,
  skip_pick,
  enter_dream,
  continue_run,
  end_roguelike_mode,
};