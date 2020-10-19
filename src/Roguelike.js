import React from 'react';
import _ from 'lodash';
import { produce } from 'immer';
import { get_deck_name, generate_deck_s2, get_roguelike_pick } from './DeckGenerator';
import { str2deck } from './Game';
import { map_object, PRNG } from './utils';
// import { InversedTabs } from './InversedTabs';

import './Board.css';
import './Roguelike.css';
import { ICONS } from './icons';
import { CARDS } from './cards';
import { UPGRADES } from './upgrades';

export function introduce_roguelike_mode() {
  alert(`欢迎来到集成战略模式“黑角的金针菇迷境”！\n在每一局对战中，如果你挑战比要求难度更高的危机等级，则会获得更多的赏金！\n`);
}

function setup_roguelike_mode(S) {
  S.roguelike_mode = true;

  S.gold = 50;
  S.game_idx = 1;

  S.central_idx = 0;

  get_card_picks(S);
  reset_shop(S);
}

function setup_deck_selection(S) {
  S.deck_names = _.times(3, get_deck_name).map(x => x + "·黑角");
  S.deck_list = S.deck_names.map(generate_deck_s2).map(str2deck); // TODO: change the generator
}

function get_pick() {
  return get_roguelike_pick().map(card => CARDS.find(x => x.name == card));
}

function get_card_picks(S) {
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
  S.shop_items = _.times(3, get_shop_item);
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
  return <div className="gold-wrapper">
    <span className="gold-amount">{ICONS.gold}{props.gold}</span>
  </div>;
}
export function PickCards(props) {
  // console.log(props.picks);
  return <div className="central" align="center">
    <GoldAmount gold={props.gold} />
    <button className="refresh-picks" onClick={props.refresh_picks}><span>刷新选牌(10{ICONS.gold})</span></button>
    {props.picks.map((cards, idx) => <Pick cards={cards} check_cards={() => props.check_cards(idx)} pick_cards={() => props.pick_cards(idx)} />)}
    <button className="skip-picks" onClick={props.skip_picks}><span>跳过选牌并获得10{ICONS.gold}</span></button>
  </div>
}

function ShopItem(props) {
  return <div className="shop-item" align="center">
    <p className="shop-item-name">{props.name}</p>
    <p className="shop-item-price">{ICONS.gold}{props.price}</p>
    <button className="buy" onClick={props.buy}>查看</button>
  </div>
}

export function Shop(props) {
  return <div className="central" align="center">
    <GoldAmount gold={props.gold} />
    <button className="refresh-shop" onClick={props.refresh_shop}>刷新商店(10{ICONS.gold})</button>
    {props.shop_items.map((item, idx) => <ShopItem {...item} buy={() => props.buy(idx)} />)}
  </div>

}

export function FinishPick(props) {
  return <div className="central" align="center">
    <GoldAmount gold={props.gold} />
    <h2 className="finish-pick">你已经完成了选择</h2>
  </div>
}

export function RoguelikeTabs(props) {
  return <div className="roguelike-tabs" align="center">
    {props.selections.map((selection, idx) => <button className="roguelike-tab" onClick={()=>props.onSelect(idx)}>{selection}</button>)}
  </div>
}

export const roguelike = map_object(produce, {
  setup_roguelike_mode,
  setup_deck_selection,
  pick_cards,
  skip_pick,
});