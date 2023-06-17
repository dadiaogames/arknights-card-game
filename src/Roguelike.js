import React from 'react';
import _ from 'lodash';
import { produce } from 'immer';
import { get_deck_name, generate_deck_s2, get_roguelike_pick, generate_roguelike_deck, get_challenge_name, deck2str } from './DeckGenerator';
import { str2deck } from './Game';
import { map_object, PRNG } from './utils';
import { final_tag, TAGS } from './tags';
// import { InversedTabs } from './InversedTabs';
import block_img from './阻挡.png';

import './Board.css';
import './Card.css';
import './Roguelike.css';
import './Competition.css';
import { ICONS } from './icons';
import { CARDS, heijiao_in_dream } from './cards';
import { UPGRADES } from './upgrades';
import { RELICS } from './relics';
import { lose_image, result_images } from './assets';
import { CardRow } from './Card';

export function introduce_roguelike_mode() {
  alert(`欢迎来到Roguelike模式“黑角的金针菇迷境”！\n通关要求：完成9局对战；\n太长不看：每一局要尽可能挑战比要求等级更高的危机等级！这样才能获得更多赏金(高的等级数是4的倍数最好)；\n* 每一局对战，都有要求的危机等级，成功完成该局对战，即可获得30赏金和1次升级，并进入下一局对战；\n* 在每一局对战中，如果你挑战比要求难度更高的危机等级，则会获得更多的赏金！每高1级，就会额外获得5赏金(最高40赏金)；\n* 如果比要求等级高4级，则会达成“满贯”，额外获得30赏金和1个藏品，并跳过1局对战；\n* 如果比要求等级高8级，则会达成“大满贯”，额外获得60赏金和3个藏品！并跳过2局对战；\n* 在“天灾降临”难度下，没有藏品“全局作战文件”`);
}

function weekly_introduction() {
  alert(`欢迎来到周常挑战模式！\n在这个模式中，你将在固定的牌组和牌序中，探索一套牌组的上限；\n根据表现，你将会得到以下评级：\n* 24级: S\n* 32级: SS\n* 40级: SSS`);
}

const advanced_cards = "阿 雷蛇 霜星 鞭刃 翎羽 白面鸮 塞雷娅 爱丽丝 初雪 真理 艾雅法拉 能天使 温蒂 安洁莉娜 Lancet-2 Castle-3 普罗旺斯 安比尔 卡达 图耶 梓兰 霜叶 清流 波登可 巫恋 亚叶 伊桑 夜莺".split(" ");

function reset_tags() {
  return TAGS.map(x => ({...x}));
}

function setup_roguelike_mode(S) {
  console.log("Roguelike mode reset");
  S.roguelike_mode = true;

  S.rng = new PRNG(S.seed || Date());

  init_tags_S2(S);
  S.RELICS = RELICS.map(x => ({...x}));

  S.Deck = [];
  S.relics = [];
  S.gold = 50;

  // S.scene_queue = ["upgrade", ..._.times(12, ()=>"init_card"), "relic"];
  S.scene_queue = ["upgrade", "relic", ..._.times(2, ()=>"init_card"), "deck_selection"];
  S.current_upgrades = [];
  S.current_indexes = [];
  S.current_relics = [];

  S.game_count = 1;
  S.level_required = 0;

  S.central_idx = 0;

  S.dream_count = 0;

  // reset_card_picks(S);
  reset_shop(S);
}

function select_deck(S, deck) {
  S.Deck = deck;
  reset_shop(S);
}

function end_roguelike_mode(S) {
  S.roguelike_mode = false;
  S.tags = reset_tags();
  CARDS.map(preprocess_roguelike_card); // To prevent onPlayBonus pointer bug
}

function tags_proceed(S) {
  S.tags = [...S.tags, ...S.remained_tags.slice(0,2)];
  S.remained_tags = S.remained_tags.slice(2);
}

function move_on(S) {
  S.game_count += 1;
  // S.tags.splice(S.tags.length-1, 0, ...S.remained_tags.slice(0,2));
  // S.remained_tags = S.remained_tags.slice(2);
  tags_proceed(S);

  // S.scene_queue.unshift("pick");
  // S.scene_queue.unshift("upgrade");

  // if (S.difficulty == "hard") {
  //   S.rng.choice(S.tags.filter(t => t.stackable && (!t.locked))).locked = true;
  // }

  if ((S.difficulty == "hard" || S.difficulty == "expert") && S.game_count == 9) {
    S.tags = [...S.tags, ..._.times(4, () => ({...final_tag}))];
    for (let tag of S.tags) {
      if (tag.stackable) {
        tag.locked = true;
      }
    }
  }
}

function init_tags_S2(S) {
  let tags = reset_tags();
  let basic_tags = tags.slice(0, 15);
  let repeat_tags = tags.filter(t => t.stackable).flatMap(t => _.times(3, ()=>({...t})));
  let remained_tags = S.rng.shuffle(tags.filter(t => (!basic_tags.includes(t)) && t.level > 0));
  let init_added_tags = remained_tags.filter(t => (t.standard_level <= 3));
  // init_added_tags.map(t => {if (t.standard_level <= 2) t.locked = true;});
  S.tags = [...basic_tags, ...repeat_tags, ...init_added_tags].map(t => ({...t}));
  S.remained_tags = remained_tags.filter(t => !init_added_tags.includes(t));
  tags_proceed(S);
}

function init_tags(S) {
  let tags = reset_tags();
  let final_tag = tags[tags.length - 1];
  // let init_tags = [...tags.slice(0,6), ...tags.filter((x,idx) => [6,7,9,10,12,13].includes(idx)), final_tag];
  let init_tags = [...tags.slice(0,15), final_tag];
  let remained_tags = S.rng.shuffle(tags.filter(t => (!init_tags.includes(t)) && t.level > 0));
  S.tags = [...init_tags.slice(0,init_tags.length-1), ...remained_tags.slice(0,2), final_tag];
  S.remained_tags = remained_tags.slice(2);
}

function reduce_basic_tags(tags, rng) {
  // return tags.filter((x,idx) => !rng.choice([[6,7,8],[9,10,11],[12,13,14]]).includes(idx));
  return [...tags.slice(0,6), ...rng.shuffle(tags.slice(6)).slice(0,6).sort((t1,t2) => tags.indexOf(t1)-tags.indexOf(t2))];
}

export function choose_standard_tags(tags, current_standard_level) {
    let new_tags = tags.map(t => ({...t}));
    // let current_standard_level = this.state.standard_level + 1;
    for (let tag of new_tags) {
      if (tag.standard_level <= current_standard_level) {
        tag.selected = true;
      }
      // if ((current_standard_level >= 1) && [0,3].includes(new_tags.indexOf(tag))) {
      //   tag.selected = true;
      // }
      if ((current_standard_level >= 1) && [0,1,2,3,4,6,7,9,12,13].includes(new_tags.indexOf(tag))) {
        tag.selected = true;
      }
      if ((current_standard_level >= 2) && [8,10,14].includes(new_tags.indexOf(tag))) {
        tag.selected = true;
      }
      // if ((current_standard_level >= 3) && [7,8].includes(new_tags.indexOf(tag))) {
      //   tag.selected = true;
      // }
      // if ((current_standard_level >= 4) && _.range(0,100).includes(new_tags.indexOf(tag))) {
      //   tag.selected = true;
      // }
      // if ((current_standard_level >= 6) && [7,8].includes(new_tags.indexOf(tag))) {
        // tag.selected = true;
      // }
    }

    // if (this.state.competition_mode) {
    //   for (let tag of new_tags) {
    //     if (tag.selected) {
    //       tag.locked = true;
    //     }
    //   }
    // }

    return new_tags;
}

function setup_normal_challenge(tags, rng) {
  for (let t of tags) {
    if (t.standard_level <= 2 || [0,1,2,3,4,6,9,12].includes(tags.indexOf(t))) {
      t.locked = true;
    }
  }
  let challenge_tag = rng.choice(tags.filter(x => x.challenge));
  challenge_tag.locked = true;
  let locked_tags = tags.filter(x => x.locked && [2,3].includes(x.level));
  let other_tags = tags.filter(x => !x.locked && [2,3].includes(x.level));
  other_tags = rng.shuffle(other_tags).slice(0,3);
  return [...tags.slice(0,12), ...locked_tags, ...other_tags];
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
  return [...basic_tags, another_challenge_tag, ...advanced_tags, final_tag];
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

function setup_weekly_tags(S) {
  let tags = reset_tags();
  // for (let t of tags) {
  //   if (t.standard_level <= 2 || [0,3,4,6,9].includes(tags.indexOf(t))) {
  //     t.locked = true;
  //   }
  // }
  // S.tags = choose_standard_tags(tags, 2);
  // S.tags.map(t => {if (t.selected) t.locked = true;});
  S.tags = tags;
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

function generate_weekly_challenges(S) {
  let rng = new PRNG(S.week);
  let challenges = [];
  for (let i=0; i<1; i++) {
    challenges.push(get_challenge_name(rng));
  }
  S.challenges = challenges;
}

function setup_weekly_challenge(S, idx) {
  S.deck_mode = "random";
  S.deck_name = S.challenges[idx].desc;
  S.seed = S.challenges[idx].desc;
  S.weekly_challenge_idx = idx + 1;
  S.changer("tag");
}

function enter_weekly_mode(S) {
  S.weekly_mode = true;
  let d = new Date();
  S.week = d.getFullYear() * 10000 + (d.getMonth()+1) * 100 + d.getDate() - d.getDay();
  generate_weekly_challenges(S);
  setup_weekly_tags(S);
  S.changer("weekly");
}

function end_weekly_mode(S) {
  S.weekly_mode = false;
  S.tags = reset_tags();
  S.changer("tag");
}

function set_difficulty(S, difficulty) {
  S.difficulty = difficulty;

  S.levels = [12, 14, 16, 18, 22, 26, 30, 34, 45];

  if (difficulty == "easy") {
    S.levels = [8, 10, 12, 14, 18, 22, 26, 30, 40];
  }

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

function set_difficulty_S2(S, difficulty) {
  S.difficulty = difficulty;

  S.levels = [4, 8, 12, 18, 24, 30, 36, 45, 60];

  if (difficulty == "medium") {
    S.levels = [18, 22, 26, 30, 36, 42, 48, 56, 70];
    S.tags = choose_standard_tags(S.tags, 1);
  }

  if (difficulty == "hard") {
    S.levels = [24, 30, 36, 42, 50, 60, 70, 80, 200];
    S.tags = choose_standard_tags(S.tags, 2);
  }

  if (difficulty == "expert") {
    S.levels = [32, 38, 44, 50, 60, 70, 80, 90, 300];
    S.tags = choose_standard_tags(S.tags, 2);
    S.RELICS = S.RELICS.filter(x => x.name != "全局作战文件");
  }

  // if (["medium", "hard"].includes(difficulty)) {
  //   for(let tag_idx of [0,3,4,6,9]) {
  //     S.tags[tag_idx].locked = true;
  //   }
  // }

  // if (difficulty == "hard") {
  //   S.tags[12].locked = true; // EH: This is redundant, get "set standard tags" out
  //   for (let t of S.tags) {
  //     if (t.standard_level == 3) {
  //       t.locked = true;
  //     }
  //   }
  // }

  // if (difficulty == "easy") {
  //   for (let tag of S.tags) {
  //     tag.locked = false;
  //   }
  // }

  // S.tags.map(t => {if (t.selected) t.locked = true;});
  for (let t of S.tags) {
    if (t.selected) {
      t.locked = true;
    }
  }

  S.level_required = S.levels[0];
}

function preprocess_roguelike_card(card) {
  card.onPlayBonus = [];
}

function get_roguelike_deck_name(rng) {
  let names = rng.shuffle(CARDS.map(x => x.name).filter(x => x != "可露希尔")).slice(0,2);
  return `${names[0]}·${names[1]}`;
}

function setup_roguelike_decks(S) {
  let rng = S.rng;
  // S.deck_names = _.times(2, ()=>rng.shuffle(CARDS.map(x=>x.name).filter(x => x != "可露希尔")).slice(0,2));
  S.deck_names = _.times(2, () => get_roguelike_deck_name(rng));
  S.deck_list = S.deck_names.map(generate_roguelike_deck).map(str2deck); // TODO: change the generator
  S.deck_list.map(deck => deck.map(preprocess_roguelike_card))
}

function setup_deck_selection(S) {
  S.Deck = str2deck(deck2str(["黑角", "极境"]));
  S.Deck.map(preprocess_roguelike_card);
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
  else if (item_type <= 85) {
    // TODO: change this to upgrade
    return get_upgrade(S);
  }
  else if (item_type <= 93) {
    return get_card_pick(S);
  }
  else if (item_type <= 95) {
    return get_card_pick(S, true);
  }
  else{
    return delete_card(S);
  }

}

function click_that_button(S) {
  if (S.rng.randRange(100) <= 70 && S.gold >= 0) {
    let value = S.rng.randRange(100);

    if (value <= 20) {
      alert(`喵喵喵~‍(=・ω・=)\n(获得5赏金)`);
      S.gold += 5;
    }
    else if (value <= 30) {
      alert(`讨厌，不要点人家啦‍‍(╯°口°)╯(┴—┴\n(失去50赏金)`)
      S.gold -= 50;
    }
    else if (value == 40 || value == 41) {
      alert(`这么喜欢点人家，给你点赏金好啦‍_(:з」∠)_\n(获得50赏金)`);
      S.gold += 50;
    }
    else if (value == 50 || value == 51 || value == 52) {
      let relic = S.rng.choice(RELICS);
      S.relics.unshift({...relic});
      alert(`这么喜欢点人家，送你个小礼物好啦~(｀・ω・´)\n(获得${relic.name})`);
    }
    else if (value == 60) {
      alert(`‍其实，我超喜欢你的ε=ε=(ノ≧∇≦)ノ\n(获得100赏金)`);
      S.gold += 100;

    }
    else {
      return;
    }
  }
  else {
    if (S.gold <= 0) {
      alert("需要赏金为正时，按钮才会和你玩哦‍(=・ω・=)");
    }
    else {
      return;
    }
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
  shop_item.src = {block_img};
  shop_item.onBought = (S, idx) => {
    let card = S.Deck[idx];
    // console.log("Upgrade on ", card.name, "with ", upgrade.desc)
    if (card != undefined) {
      upgrade.effect(card);
      card.upgraded = true;
      return true;
    }
    else {
      return false;
    }
  };

  return shop_item;
}

function get_pick_indexes(S, is_advanced) {
  let normal_indexes = CARDS.map((x,idx) => idx);
  let advanced_indexes = CARDS.filter(x => advanced_cards.includes(x.name)).map(x => CARDS.indexOf(x));
  return S.rng.shuffle(is_advanced?advanced_indexes:normal_indexes).slice(0,6);
}

export function get_card_pick(S, is_advanced) {
  return {
    name: is_advanced?"高级自选干员":"自选干员",
    price: 0,
    // indexes: S.rng.shuffle(CARDS.slice(0, -1).map((x,idx)=>idx)).slice(0,6),
    indexes: get_pick_indexes(S, is_advanced),
    desc: "从6个强化干员中，选择你最心仪的那一个",
    src: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/271/ok-hand_1f44c.png",
    is_pick: true,
    onBought(S, idx) {
      let card = {...CARDS[idx]};
      if (card) {
        let reinforce = UPGRADES.find(x => x.name == "强化1");
        reinforce.effect(card);
        card.upgraded = true;
        S.Deck.unshift({...card});
        for (let r of S.relics) {
          r.onPickCard && r.onPickCard(S, card);
        }
        return true;
      }
      else {
        return false;
      }
    }
  };
}

export function get_init_card_pick(S) {
  return {
    name: "初始自选干员",
    price: 0,
    indexes: S.rng.shuffle(CARDS.slice(0, -1).map((x,idx)=>idx)).slice(0,3),
    desc: "从3个干员中，选择你最心仪的那一个",
    src: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/271/ok-hand_1f44c.png",
    is_pick: true,
  };
}

function get_indexes_from_cost(cost) {
  if (cost == 16) {
    return CARDS.slice(0, CARDS.length-1).map((x,idx)=>(x.cost <= 1 || x.cost >= 6)?idx:undefined).filter(x => x != undefined);
  }
  else {
    return CARDS.slice(0, CARDS.length-1).map((x,idx)=>(x.cost==cost)?idx:undefined).filter(x => x != undefined);
  }
}

export function get_specific_card_pick(S, cost) {
  return {
    name: `${cost}费自选干员`,
    price: 0,
    indexes: get_indexes_from_cost(cost),
    desc: "从N个干员中，选择你最心仪的那一个",
    src: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/271/ok-hand_1f44c.png",
    is_pick: true,
    onBought(S, idx) {
      let card = CARDS[idx];
      if (card) {
        S.Deck.unshift({...card, material: S.rng.randRange(3)});
        for (let r of S.relics) {
          r.onPickCard && r.onPickCard(S, card);
        }
      }
      return true;
    }
  };
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
    return true;
  };

  return shop_item;
}

export function get_relic(S) {
  let shop_item = {};
  let relic = {...S.rng.choice(S.RELICS)};

  shop_item.name = relic.name;
  shop_item.desc = relic.desc;
  shop_item.price = 25 + S.rng.randRange(30);
  shop_item.src = relic.illust;
  shop_item.is_relic = true;

  shop_item.onBought = (S) => {
    console.log("Bought relic ", relic.name);

    for (let r of [...S.relics]) {
      r.onBuyRelic && r.onBuyRelic(S, relic, r);
    }

    S.relics.unshift(relic);
    if (relic.onBought) {
      relic.onBought(S);
    }
    return true;
  }

  return shop_item;
}

export function delete_card(S) {
  let shop_item = {};

  shop_item.name = "删一张牌";
  shop_item.price = 0;
  shop_item.indexes = S.Deck.map((x,idx)=>idx);
  shop_item.desc = "";
  shop_item.src = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/271/foot_dark-skin-tone_1f9b6-1f3ff_1f3ff.png";
  shop_item.onBought = (S, card_idx) => {
    S.Deck = S.Deck.filter((x,idx) => (idx != card_idx));
    return true;
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
      let filtered_indexes = S.current_item.is_pick? S.current_item.indexes : S.current_item.indexes.filter(i => S.Deck[i] != undefined);
      console.log("The filtered indexes are:", filtered_indexes);
      console.log("The selected index is:", idx);
      console.log("The chosen index is:", filtered_indexes[idx]);
      let card_idx = filtered_indexes[idx];
      item.onBought(S, card_idx);
    }
    else {
      item.onBought(S);
    }
  }
}

function select_init_card(S, idx) {
  let card = CARDS[S.current_item.indexes[idx]];
  if (card) {
    S.Deck.unshift({...card, material: S.rng.randRange(3)});
    reset_shop(S);
    proceed(S);
  }
}

function reset_shop(S) {
  S.shop_items = _.times(3, ()=>get_shop_item(S));

  for (let r of S.relics) {
    r.onRefreshShop && r.onRefreshShop(S);
  }
}

function refresh_shop(S) {
  if (payGold(S, 2)) {
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
    S.Deck = _.times(10, () => ({...heijiao_in_dream}));
    S.relics = [...S.RELICS];
  }
  S.gold = 5000;
}

export function get_gold_gained(risk_level, level_required) {
   let gold_gained = 30;

    let level_diff = risk_level - level_required;
    gold_gained += Math.min(level_diff * 5, 40);

    // For slam, don't store them in variables, instead, calculate it on time
    // So do plenty of other things
    if (level_diff >= 4) {
      gold_gained += 30;
    }
    if (level_diff >= 8) {
      gold_gained += 30;
    }

    let slam_bonus = Math.floor((level_diff - 8) / 4) * 40;
    if (slam_bonus > 0) {
      gold_gained += slam_bonus;
    }

    if (gold_gained > 300) {
      gold_gained = 300;
    }

    return gold_gained;

}

function continue_run(S) {
  // Resets go here
  S.central_idx = 1;
  // reset_shop(S);
  reset_card_picks(S);

  if (S.won) {
    S.gold += get_gold_gained(S.level_achieved, S.level_required);
  }

  for (let r of [...S.relics]) {
    r.onBattleEnd && r.onBattleEnd(S, r);
  }

  // S.scene_queue.unshift("pick");
  S.scene_queue.unshift("upgrade");

  // TODO: Reconstruct this part, into moveOn()
  // S.game_count += 1;
  move_on(S);

  if ((S.level_achieved - S.level_required) >= 4) {
    // S.game_count += 1;
    move_on(S);
    S.scene_queue.unshift("relic");
  }
  if ((S.level_achieved - S.level_required) >= 8) {
    // S.game_count += 1;
    move_on(S);
    S.scene_queue.unshift("relic");
    S.scene_queue.unshift("relic");
  }

  let num_bonus = Math.floor((S.level_achieved - S.level_required) / 4);
  let num_extra_relics = Math.max(num_bonus-2, 0);
  let num_upgrades = Math.min(num_bonus, 2);
  S.scene_queue = [
    // ..._.times(num_extra_relics, ()=>"relic"), 
    ..._.times(num_upgrades, ()=>"upgrade"), 
    ...S.scene_queue
  ];
  // console.log(S.scene_queue);

  S.game_count = Math.min(S.game_count, 9);
  S.level_required = S.levels[S.game_count - 1];

}

function proceed(S) {
  if (S.scene_queue.length == 0) {
    S.changer("roguelike");
  }
  else {
    let scene = S.scene_queue.pop();
    if (scene == "upgrade") {
      S.current_upgrades = S.rng.shuffle(UPGRADES).slice(0,3);
      S.current_indexes = S.rng.shuffle(S.Deck.map((x,idx)=>idx)).slice(0,3);
      S.changer("roguelike_deck_upgrade");
    }
    else if (scene == "pick") {
      S.current_item = get_card_pick(S);
      S.changer("roguelike_shop");
    }
    else if (scene == "init_card") {
      S.current_item = get_init_card_pick(S);
      S.changer("roguelike_shop");
    }
    else if (scene == "relic") {
      S.current_relics = S.rng.shuffle(S.RELICS).slice(0,3);
      S.changer("roguelike_relic_selection");
    }
    else if (scene = "deck_selection") {
      S.changer("roguelike_deck_selection");
    }
  }
}

function upgrade_card(S) {
  let upgrade = S.current_upgrades[S.upgrade_selected];
  let card = S.Deck[S.current_indexes[S.selection_selected]];
  if (upgrade != undefined && card != undefined) {
    upgrade.effect(card);
    card.upgraded = true;
    proceed(S);
  }
}

function pick_relic(S, idx) {
  let relic = S.current_relics[idx];
  if (relic) {
    S.relics.unshift({...relic});
    proceed(S);
  }
}

function use_relic(S, idx) {
  let relic = S.relics[idx];
  if (relic && relic.onUse && (!relic.used)) {
    relic.onUse(S);
    relic.used = true;
  }
}

export function random_upgrade(S) {
  let card = S.rng.choice(S.Deck);
  let upgrade = S.rng.choice(UPGRADES);
  upgrade.effect(card);
  card.upgraded = true;
  return `${card.name} is upgraded with ${upgrade.name}`;
}


export function RoguelikeDeckSelection(props) {
  return <div className="board game-board" align="center">
    <div className="roguelike-deck-selection-title">选择你的卡组</div>
    <div className="roguelike-deck-selection">
      {props.decks.map(deck => <RoguelikeDeckRepr {...deck} />)}
    </div>
    </div>
}

function RoguelikeDeckRepr(props) {
  return <div className="roguelike-deck-repr" align="center">
    <div className="roguelike-deck-repr-name">{props.deckName || "\"热泵通道\"推进之王"}</div>
    <CardRow cards={str2deck(generate_roguelike_deck(props.deckName)).map(({cost, atk, hp, illust, was_enemy}) => ({[was_enemy?"e_illust":"illust"]: illust, cost, atk, hp}))} additionalStyle={{height: "55%", marginTop: "1%"}} />
    <button className="roguelike-deck-repr-button" onClick={props.checkDeck}>查看</button>
    <button className="roguelike-deck-repr-button" onClick={props.selectDeck}>选择</button>
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
    <button className="refresh-picks" onClick={props.click_that_button}><span>卖萌按钮QwQ</span></button>
    {props.picks.map((cards, idx) => <Pick cards={cards} check_cards={() => props.check_cards(idx)} pick_cards={() => props.pick_cards(idx)} />)}
    <button className="skip-picks" onClick={props.skip_picks}><span>跳过选牌并获得{ICONS.gold}10</span></button>
  </div>
}

function ShopItem(props) {
  return <div className="shop-item">
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

function Relic(props) {
  return <div className="shop-item">
    <div className="shop-item-img-container"><img src={props.illust} className="shop-item-img"/></div>
    <div className="shop-item-info" align="center">
      <span className="shop-item-name">{props.name}</span>
      <br/>
      <br/>
      <div className="shop-item-desc">{props.desc}</div>
    </div>
    {(props.operation)?<button className="buy" onClick={props.operation.effect}>{props.operation.name}</button>:""}
  </div>
}

export function Relics(props) {
  return <div className="board" align="center">
    <div style={{marginTop:"20%", fontSize:"110%"}}>{(props.checking)?"现有藏品":"选择一个藏品"}</div>
    <div className="relics">
      {props.relics.map((relic)=><Relic {...relic} />)}
    </div>
    <button className="continue-btn" style={{marginTop: "2%"}} onClick={props.proceed} >{(props.checking)?"返回":"跳过"}</button>
  </div>;
}

export function Weekly(props) {
  return <div className="board" align="center">
    <div style={{marginTop:"20%", fontSize:"110%"}} onClick={props.click_title} >本周是{props.week}</div>
    <div className="relics">
      {props.challenges.map((challenge)=><Relic {...challenge} />)}
    </div>
    <button className="weekly-btn" style={{marginTop: "2%"}} onClick={props.back} >返回</button>
    <button className="weekly-btn" style={{marginTop: "2%"}} onClick={weekly_introduction} >周常模式介绍</button>
  </div>;
}

export function Shop(props) {
  return <div className="central" align="center">
    <GoldAmount gold={props.gold} />
    <div className="shop-items">    
      {props.shop_items.map((item, idx) => <ShopItem {...item} buy={props.buy(idx)} />)}
    </div>
    <button className="refresh-shop" onClick={props.refresh_shop}>刷新商店({ICONS.gold}2)</button>
  </div>

}

export function Roguelike(props) {
  return <div className="central">
    <div className="heijiao-container-2">
      <img src="https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_9.png" className="heijiao-img-2" />
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
    <img src="https://dadiaogames.gitee.io/images/imagebed/HeijiaoRoguelike.png" className="roguelike-intro-img"></img>
    <div className="entry">请选择难度</div>
    <div className="difficulty-selection">
      {props.difficulties.map(selection => <button className="difficulty-button" onClick={selection.handleClick}>{selection.name}</button>)}
    </div>
    <button className="introduce-button" onClick={props.back}>返回</button>
    <button className="introduce-button" onClick={props.set_seed}>种子设置</button>
    <button className="introduce-button" onClick={introduce_roguelike_mode}>肉鸽模式介绍</button>
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
      博士请重新来过
    </div>
    <div className="lose-img-container">
      <img src={lose_image} className="lose-img"></img>
    </div>
    <button className="endrun-btn" onClick={props.continue}>结束游戏</button>
  </div>
}

export function FinalResult(props) {
  let [src, p_id] = props.rng.choice(result_images);
  return <div className="board" align="center">
    <div className="result-info">
      <div className="ascension">通关！</div>
      完成难度: {props.difficulty}
    </div>
    <div className="result-img-container">
      <img className="result-img" src={src} />
    </div>
    <div className="result-win-quote">面对天灾，<br/>我们甚至秀得飞起</div>
    {/* TODO: Add show deck and show relics */}
  <button className="endrun-btn" onClick={props.continue}>{props.endgame}</button>
  <div className="illust-info">图片p站id: {p_id}</div>
  </div>


}

export const roguelike = {
  setup_roguelike_mode,
  set_difficulty,
  set_difficulty_S2,
  setup_roguelike_decks,
  setup_deck_selection,
  select_deck,
  select_init_card,

  pick_cards,
  skip_pick,
  enter_dream,
  buy,
  reset_shop,
  refresh_shop,
  click_that_button,

  continue_run,
  end_roguelike_mode,
  proceed,
  upgrade_card,
  pick_relic,
  use_relic,

  enter_daily_mode,
  end_daily_mode,
  setup_weekly_challenge,
  generate_weekly_challenges,
  enter_weekly_mode,
  end_weekly_mode,
};