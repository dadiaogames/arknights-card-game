import React from 'react';
import _ from 'lodash';
import { produce } from 'immer';
import { get_deck_name, generate_deck_s2, get_roguelike_pick, generate_roguelike_deck } from './DeckGenerator';
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
import { RELICS } from './relics';

export function introduce_roguelike_mode() {
  alert(`欢迎来到Roguelike模式“黑角的金针菇迷境”！\n通关要求：完成9局对战；\n每一局对战，都有要求的危机等级，成功完成该局对战，即可获得赏金，并进入下一局对战；\n如果其中一次对局失败，则本次Roguelike旅程即宣告失败，胜败乃兵家常事，大侠请重头再来；\n在每一局对战中，如果你挑战比要求难度更高的危机等级，则会获得更多的赏金！每高1级，就会额外获得10赏金；\n如果比要求等级高4级，则会达成“满贯”，额外获得50赏金；\n如果比要求等级高8级，则会达成“大满贯”，额外获得120赏金！`);
}

function reset_tags() {
  return TAGS.map(x => ({...x}));
}

function setup_roguelike_mode(S) {
  console.log("Roguelike mode reset");
  S.roguelike_mode = true;

  S.rng = new PRNG(S.seed || Date());

  init_tags(S);
  S.RELICS = RELICS.map(x => ({...x}));

  S.Deck = [];
  S.relics = [];
  S.gold = 100;


  S.game_count = 1;
  S.level_required = 0;

  S.central_idx = 0;

  S.dream_count = 0;

  reset_card_picks(S);
  // reset_shop(S);
}

function select_deck(S, deck) {
  S.Deck = deck;
  reset_shop(S);
}

function end_roguelike_mode(S) {
  S.roguelike_mode = false;
  S.tags = reset_tags();
}

function move_on(S) {
  S.game_count += 1;
  S.tags.splice(S.tags.length-1, 0, ...S.remained_tags.slice(0,2));
  S.remained_tags = S.remained_tags.slice(2);
}

function init_tags(S) {
  let tags = reset_tags();
  let final_tag = tags[tags.length - 1];
  // let init_tags = [...tags.slice(0,6), ...tags.filter((x,idx) => [6,7,9,10,12,13].includes(idx)), final_tag];
  let init_tags = [...tags.slice(0,15), final_tag];
  let remained_tags = S.rng.shuffle(tags.filter(t => !init_tags.includes(t)));
  S.tags = [...init_tags.slice(0,init_tags.length-1), ...remained_tags.slice(0,2), final_tag];
  S.remained_tags = remained_tags.slice(2);
}

function reduce_basic_tags(tags, rng) {
  // return tags.filter((x,idx) => !rng.choice([[6,7,8],[9,10,11],[12,13,14]]).includes(idx));
  return [...tags.slice(0,6), ...rng.shuffle(tags.slice(6)).slice(0,6).sort((t1,t2) => tags.indexOf(t1)-tags.indexOf(t2))];
}

function setup_normal_challenge(tags, rng) {
  for (let t of tags) {
    if (t.standard_level <= 2 || [0,3,4,6,12].includes(tags.indexOf(t))) {
      t.locked = true;
    }
  }
  let challenge_tag = rng.choice(tags.filter(x => x.challenge));
  challenge_tag.locked = true;
  let locked_tags = tags.filter(x => x.locked && [2,3].includes(x.level));
  let other_tags = tags.filter(x => !x.locked && [2,3].includes(x.level));
  other_tags = rng.shuffle(other_tags).slice(0,3);
  return [...reduce_basic_tags(tags.slice(0,15), rng), ...locked_tags, ...other_tags];
}

function setup_exhausted_challenge(tags, rng) {
  tags[0].locked = true;
  tags[1].locked = true;
  let final_tag = tags[tags.length-1];
  final_tag.locked = true;
  let basic_tags = tags.filter(x => x.level == 1);
  let another_challenge_tag = rng.choice(tags.filter(x => x.level == 3));
  another_challenge_tag.locked = true;
  let advanced_tags = rng.shuffle(tags.filter(x => [2,3].includes(x.level) && x != another_challenge_tag)).slice(0,5);
  return [...reduce_basic_tags(basic_tags, rng), another_challenge_tag, ...advanced_tags, final_tag];
}

function setup_daily_tags(S) {
  let rng = new PRNG(S.date);
  let tags = reset_tags();

  if (rng.random() <= 0.6) {
    S.tags = setup_normal_challenge(tags, rng);
    S.level_required = 24;
  }
  else {
    S.tags = setup_exhausted_challenge(tags, rng);
    S.level_required = 18;
  }
}

function enter_daily_mode(S) {
  S.daily_mode = true;
  S.date = Date().slice(0,15);
  // S.date = Math.random();
  setup_daily_tags(S);
}

function end_daily_mode(S) {
  S.daily_mode = false;
  S.tags = reset_tags();
}

function set_difficulty(S, difficulty) {
  S.difficulty = difficulty;

  S.levels = [12, 14, 16, 18, 22, 26, 30, 34, 45];

  if (difficulty == "hard") {
    S.levels = [15, 18, 21, 24, 30, 36, 42, 48, 60];
  }

  if (["medium", "hard"].includes(difficulty)) {
    S.tags[S.tags.length-1].locked = true;
  }

  if (["hard"].includes(difficulty)) {
    S.tags[0].locked = true;
    S.tags[1].locked = true;
  }

  S.level_required = S.levels[0];
}

function preprocess_roguelike_card(card) {
  card.onPlayBonus = [];
}

function setup_deck_selection(S) {
  let rng = S.rng;
  S.deck_names = _.times(3, ()=>rng.choice(CARDS.map(x=>x.name))).map(x => x + "·黑角");
  S.deck_list = S.deck_names.map(generate_roguelike_deck).map(str2deck); // TODO: change the generator
  S.deck_list.map(deck => deck.map(preprocess_roguelike_card))
}

function get_pick(S) {
  return get_roguelike_pick().map(card => CARDS.find(x => x.name == card)).filter(card => card != undefined).map(card => ({...card, material:S.rng.randRange(3)})); // EH: Let material not be local solution, but global solution
}

function reset_card_picks(S) {
  S.card_picks = _.times(3, ()=>get_pick(S));
}

function get_shop_item(S) {
  // let rng = new PRNG(Math.random());
  // let rng = S.rng;

  let item_type = S.rng.randRange(100);
  // console.log(item_type, "item type");

  if (item_type <= 60) {
    // TODO: change this to relic
    return get_relic(S);
  }
  else if (item_type <= 95) {
    // TODO: change this to upgrade
    return get_upgrade(S);
  }
  else{
    return delete_card(S);
  }

}

function get_upgrade(S) {
  let shop_item = {};

  // Get upgrade
  let upgrade = S.rng.choice(UPGRADES);
  shop_item.name = "升级: " + upgrade.name;
  shop_item.price = S.rng.randRange(10) + 15;
  // console.log("This deck", S.Deck);
  shop_item.indexes = S.rng.shuffle(S.Deck.map((x,idx)=>idx)).slice(0,4);
  shop_item.desc = "获得 " + upgrade.desc;
  shop_item.src = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/259/up-arrow_2b06.png";
  shop_item.onBought = (S, idx) => {
    let card = S.Deck[idx];
    // console.log("Upgrade on ", card.name, "with ", upgrade.desc)
    if (card) {
      upgrade.effect(card);
    }
    card.upgraded = true;
  };

  return shop_item;
}

// function get_reinforceupgrade(S, rng) {
//   let shop_item = {};

//   // Get upgrade
//   let upgrade = rng.choice(UPGRADES);
//   shop_item.name = "升级: " + upgrade.name;
//   shop_item.price = rng.randRange(20) + 20;
//   console.log("This deck", S.Deck);
//   shop_item.indexes = rng.shuffle(S.Deck.map((x,idx)=>idx)).slice(0,4);
//   shop_item.desc = "获得 " + upgrade.desc;
//   shop_item.onBought = (S, idx) => {
//     let card = S.Deck[idx];
//     console.log("Upgrade on ", card.name, "with ", upgrade.desc)
//     if (card) {
//       upgrade.effect(card);
//     }
//     card.upgraded = true;
//   };

//   return shop_item;
// }

function get_reinforced_card(S, rng) {
  let shop_item = {};

  // Get card
  let card = {
    ...rng.choice(CARDS),
    material: rng.randRange(3),
    upgraded: true,
    onPlayBonus: [], // EH: this should be abstracted instead of write here again
  };
  let reinforce_time = rng.randRange(2) + 1;

  shop_item.name = card.name + "(强化" + reinforce_time + ")";
  shop_item.price = rng.randRange(20) + 20 + (30+rng.randRange(20)) * (reinforce_time - 1);
  shop_item.desc = card.desc;

  let reinforce_once = UPGRADES.find(x => x.name == "强化1");
  for (let i=0; i<reinforce_time; i++) {
    reinforce_once.effect(card);
  }

  shop_item.onBought = (S) => {
    S.Deck.unshift(card);
  };

  return shop_item;
}

function get_relic(S) {
  let shop_item = {};
  let relic = S.rng.choice(RELICS);

  shop_item.name = relic.name;
  shop_item.desc = relic.desc;
  shop_item.price = 30 + S.rng.randRange(20);
  shop_item.src = relic.illust;

  shop_item.onBought = (S) => {
    let bought = {...relic};
    console.log("Bought relic ", bought.name);

    for (let r of S.relics) {
      r.onBuyRelic && r.onBuyRelic(S, bought, r);
    }

    S.relics.unshift(bought);
    if (bought.onBought) {
      bought.onBought(S);
    }
  }

  return shop_item;
}

function delete_card(S) {
  let shop_item = {};

  shop_item.name = "删1张牌";
  shop_item.price = 10 + S.rng.randRange(10);
  shop_item.indexes = S.rng.shuffle(S.Deck.map((x,idx)=>idx)).slice(0,4);
  shop_item.desc = "";
  shop_item.src = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/271/foot_dark-skin-tone_1f9b6-1f3ff_1f3ff.png";
  shop_item.onBought = (S, card_idx) => {
    console.log("The index:", card_idx);
    console.log("Before delete", S.Deck.length, S.Deck);
    S.Deck = S.Deck.filter((x,idx) => (idx != card_idx));
    console.log("After delete", S.Deck.length, S.Deck);
  }

  return shop_item;
}


function payGold(S, amount) {
  if (S.gold >= amount) {
    S.gold -= amount;
    return true;
  }
  else {
    alert("剩余赏金不够");
    return false;
  }
}

function buy(S, idx) {
  let item = S.current_item;
  let item_idx = S.current_item_idx;
  if (payGold(S, item.price)) {
    S.shop_items = S.shop_items.filter((x,idx) => idx != item_idx);
    if (idx != undefined) {
      console.log("The indexes are:", S.current_item.indexes.map(x=>x));
      console.log("The selected index is:", idx);
      console.log("The chosen index is:", S.current_item.indexes[idx]);
      let card_idx = S.current_item.indexes[idx];
      item.onBought(S, card_idx);
    }
    else {
      item.onBought(S);
    }
  }
}

function reset_shop(S) {
  S.shop_items = _.times(6, ()=>get_shop_item(S));
}

function refresh_shop(S) {
  if (payGold(S, 10)) {
    reset_shop(S);
  }
}

// EH: Actually it's better to set all formats the same, but Deck selection is done on board
function pick_cards(S, idx) {
  S.Deck = [...S.card_picks[idx], ...S.Deck];
  S.card_picks = undefined;

  for (let r of S.relics) {
    r.onPickCards && r.onPickCards(S);
  }
}

function skip_pick(S) {
  S.card_picks = undefined;
  S.gold += 10;

  for (let r of S.relics) {
    r.onSkipPick && r.onSkipPick(S);
  }
}

function enter_dream(S) {
  S.dream_count += 1;
  if (S.dream_count == 9) {
    alert("已进入黑角梦境");
    S.Deck = _.times(10, () => heijiao_in_dream);
    S.relics = [...S.RELICS];
  }
  S.gold = 5000;
}

export function get_gold_gained(risk_level, level_required) {
   let gold_gained = 20;

    let level_diff = risk_level - level_required;
    gold_gained += level_diff * 10;

    // For slam, don't store them in variables, instead, calculate it on time
    // So do plenty of other things
    if (level_diff >= 4) {
      gold_gained += 50;
    }
    if (level_diff >= 8) {
      gold_gained += 70;
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

  for (let r of [...S.relics]) {
    r.onBattleEnd && r.onBattleEnd(S, r);
  }

  // TODO: Reconstruct this part, into moveOn()
  // S.game_count += 1;
  move_on(S)

  if ((S.level_achieved - S.level_required) >= 4) {
    // S.game_count += 1;
    move_on(S)
  }
  if ((S.level_achieved - S.level_required) >= 8) {
    // S.game_count += 1;
    move_on(S)
  }
  S.game_count = Math.min(S.game_count, 9);

  S.level_required = S.levels[S.game_count - 1];
}

export function random_upgrade(S) {
  let card = S.rng.choice(S.Deck);
  let upgrade = S.rng.choice(UPGRADES);
  upgrade.effect(card);
  alert(`${card.name} is upgraded with ${upgrade.name}`);
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
      {props.shop_items.map((item, idx) => <ShopItem {...item} buy={props.buy(idx)} />)}
    </div>
    <button className="refresh-shop" onClick={props.refresh_shop}>刷新商店({ICONS.gold}10)</button>
  </div>

}

export function Roguelike(props) {
  return <div className="central">
    <div className="heijiao-container-2">
      <img src="http://prts.wiki/images/d/dc/%E7%AB%8B%E7%BB%98_%E9%BB%91%E8%A7%92_1.png" className="heijiao-img-2" />
    </div>
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
  return <div className="board" align="center">
    <div className="entry">欢迎来到集成战略模式<br/>“黑角的金针菇迷境”<br/>请选择难度</div>
    <div className="difficulty-selection">
      {props.difficulties.map(selection => <button className="difficulty-button" onClick={selection.handleClick}>{selection.name}</button>)}
    </div>
    <button className="introduce-button" onClick={props.back}>返回</button>
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
  select_deck,

  pick_cards,
  skip_pick,
  enter_dream,
  buy,
  reset_shop,
  refresh_shop,

  continue_run,
  end_roguelike_mode,

  enter_daily_mode,
  end_daily_mode,
};