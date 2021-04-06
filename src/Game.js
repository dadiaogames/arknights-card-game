import React from 'react';
import _ from 'lodash';
import { CARDS } from "./cards";
import { BOSSES, ENEMIES } from "./enemies";
import { ORDERS, material_icons, default_order } from "./orders";
import { UPGRADES } from './upgrades';
import { get_deck_name, generate_deck, generate_deck_s2, generate_deck_s1, solver_core, scorer_core, pick_scorers, pick_vanguards } from './DeckGenerator';
import { arr2obj, mod_slice, PRNG, vector_diff, vector_sum } from "./utils";
import { ICONS, food_icons } from "./icons";
import { ALTER_ARTS } from "./alters";

export function move(G, ctx, d1, d2, idx) {
  let card = G[d1].splice(idx || 0, 1)[0];
  G[d2].push(card);
  return card;
}

export function payCost(G, ctx, cost, from_card) {
  if (G.costs >= cost) {
    G.costs -= cost;

    if (from_card) {
      for (let f of G.onPayCost) {
        f(G, ctx, cost);
      }
    }

    return true;
  }

  else{
    logMsg(G, ctx, "费用不足");
    return false;
  }
}

export function gainMaterials(G, ctx, count) {
  let gained = [];

  for (let i=0; i<count; i++) {
    let material = ctx.random.Die(3)-1;
    G.materials[material] += 1; //TODO: add this to log
    gained.push(material);
  }

  G.gained = gained;
}

export function payMaterials(G, ctx, requirements) {
  let delta = 0;
  for (let i=0; i<4; i++) {
    if (G.materials[i] < requirements[i]) {
      delta += requirements[i] - G.materials[i];
    }
  }

  if (G.materials[3] < delta) {
    logMsg(G, ctx, "材料不足");
    return false;
  }

  else {
    for (let i=0; i<4; i++) {
      G.materials[i] -= requirements[i];

      if (G.materials[i] < 0) {
        G.materials[3] += G.materials[i]; //add a negative num is reduce
        G.materials[i] = 0;
      }
    }

    G.gained = [];

    return true;
  }
}

function use(G, ctx, card) {
  if (!card.exhausted) {
    card.exhausted = true;

    if (G.stage == "player") {
      for (let f of G.onUseCard) {
        f(G, ctx, card);
      }
    }

    return true;
  }

  else {
    if (G.stage == "player") {
      logMsg(G, ctx, "该卡已被横置(已使用过)，无法使用");
    }
    return false;
  }
}

export function get_blocker(G, ctx, enemy) {
  let idx = G.efield.indexOf(enemy);
  let blocked_enemies = 0;

  if (idx == -1) {
    return false;
  }

  for (let c of G.field) {
    blocked_enemies += Math.max(0, c.block||0);
    if (blocked_enemies > idx) {
      return c;
    }
  }

  return false;
}

function out(G, ctx, deck, idx) {
  let card = G[deck][idx];
  let discard = (deck == "field") ? "discard" : "ediscard";
  move(G, ctx, deck, discard, idx);
  logMsg(G, ctx, `${card.name} 被摧毁${(deck=="efield")?"(+1分)":""}`);
  if (card.onOut) {
    card.onOut(G, ctx, card);
  }
}

export function deal_damage(G, ctx, deck, idx, dmg) {
  let card = G[deck][idx];

  if (card) {
    //cards with no damage may not have the damage attr
    let total_dmg = dmg + (card.vulnerable || 0);
    card.dmg = (card.dmg || 0) + total_dmg;
    logMsg(G, ctx, `${card.name} 受到${total_dmg}点伤害`);

    if (card.dmg >= card.hp) {
      // if (~G.efield.indexOf(card)) {
      //   out(G, ctx, deck, idx);
      // }
      card.exhausted = true;
    }
  }
}

export function deal_random_damage(G, ctx, amount) {
  let enemy = ctx.random.Shuffle(G.efield.filter(x => (x.dmg < x.hp)))[0];
  if (enemy) {
    let idx = G.efield.indexOf(enemy);
    deal_damage(G, ctx, "efield", idx, amount);
  }
}

export function silent(card) {
  card.onPlay = undefined;
  card.onMine = undefined;
  card.onFight = undefined;
  card.action = undefined;
  card.onRest = undefined;
  card.onOut = undefined;
  card.desc = "";
}

export function addTags(G, ctx, tags) {
  for (let t of tags) {
    t.effect(G, ctx);
  }
}

export function init_card_state(G, ctx, card) {
  card.dmg = 0;
  card.power = card.power || 0;
  if (card.material == undefined) {
    card.material = (ctx.random.Die(3) - 1); 
  }
  card.exhausted = G.exhausted_enter;
  return card;
}

export function eliminate_field(G, ctx, user) {
  let card = ctx.random.Shuffle(G.field.filter(x => (!x.exhausted) && (x != user)))[0];
  if (card) {
    G.field = G.field.filter(x => x != card);
    if (card.onOut) {
      card.onOut(G, ctx, card);
    }
  }
  return card;
}

export function draw(G, ctx) {
  // First, check the limit
  if (G.hand.length >= G.hand_limit) {
    logMsg(G, ctx, "手牌数已达到上限");
    return;
  }
  else {
    if (G.deck.length > 0) {
      G.hand.unshift(G.deck.pop());
    } 
    else {
      // G.danger += 1;
      // logMsg(G, ctx, "无牌可抽，增加1点动乱值");
      logMsg(G, ctx, "无牌可抽");
    }
  }
}

export function drop(G, ctx) {
  let idx = ctx.random.Die(G.hand.length) - 1;
  if (~idx) {
    G.hand.splice(idx, 1);

    G.has_discarded = true;

    for (let f of G.onDropCard) {
      f(G, ctx);
    }
  }
}

export function mulligan(G, ctx, choices) {
  let discarded = G.hand.filter((x, idx) => choices[idx]);
  G.hand = [...G.hand.slice(0,5).filter((x, idx) => !choices[idx]), ...G.hand.slice(5)];
  if (G.hand.length < 5) {
    let num_draw = 5 - G.hand.length; // What a tricky feature of js
    for (let i = 0; i < num_draw; i++) {
      draw(G, ctx);
    }
    G.deck = ctx.random.Shuffle([...G.deck, ...discarded]);
  }

  // Psudo-shuffle the deck
  // let solver = G.deck.find(x => solver_core.includes(x.name)) || G.deck[0];
  // let scorer = G.deck.find(x => scorer_core.includes(x.name)) || G.deck[1];
  // G.deck = [...G.deck.filter(x => ![solver, scorer].includes(x)), scorer, solver];

  // Add init here
  G.hand = [...G.deck.filter(card => card.is_init), ...G.hand];
}

export function play_card(G, ctx, card) {
  if (G.field.length < G.field_limit) {
    let inserted = init_card_state(G, ctx, {...card});
    G.field = [...G.field, inserted];
    if (inserted.onPlay) {
      inserted.onPlay(G, ctx, inserted);
    }
    for (let bonus of (inserted.onPlayBonus || [])) {
      if (bonus && (bonus.effect != undefined)) {
        bonus.effect(G, ctx, inserted);
      }
    }
    return inserted;
  }
  else {
    logMsg(G, ctx, "场上干员数已达到上限");
    return false;
  }
}

function play(G, ctx, idx) {
  let card = G.hand[idx]; //No need to verify at this stage

  // if (G.limit_hand_field && (G.field.length >= 6)) {
  //   logMsg(G, ctx, "场上干员数已达到上限");
  //   return;
  // }

  if (payCost(G, ctx, card.cost)) {
    // move(G, ctx, "hand", "field", idx);
    // init_card_state(G, ctx, card);
    G.hand.splice(idx, 1);
    logMsg(G, ctx, `部署 ${card.name}(剩余部署位: ${G.field_limit-G.field.length-1})`);
    let inserted = play_card(G, ctx, card); // EH: What a strange abstraction, this should be changed
    if (inserted) {
      for (let f of G.onPlayCard) {
        f(G, ctx, inserted, card);
      }
    }
    else {
      G.costs += card.cost;
      G.hand.unshift(card);
    }
  }

  else {
    logMsg(G, ctx, `费用不足，无法部署`);
  }
}

function mine(G, ctx, idx) {
  let card = G.field[idx];

  if (use(G, ctx, card) && (G.stage == "player")) {
    gainMaterials(G, ctx, card.mine);
    logMsg(G, ctx, `使用 ${card.name} 采掘`);
    if (card.onMine) {
      card.onMine(G, ctx, card);
    }
    for (let f of G.onCardMine) {
      f(G, ctx, card);
    }
  }
}

function setValue(G, ctx, attr, val) {
  G[attr] = val;
}

export function refreshOrder(G, ctx) {
  // console.log("Orders:", [...G.odeck], G.round_num);
  // console.log("Picks:", [...G.another_deck], G.round_num);
  G.orders = mod_slice(G.odeck, G.round_num*8, 8);
  G.orders = sort_orders(G.orders);
}

function sort_orders(orders) {
  return orders.sort((x,y) => {
    let price_y = _.sum(y.requirements);
    let price_x = _.sum(x.requirements);
    if (price_y != price_x) return price_x - price_y;
    if (y.advanced && !x.advanced) return -1;
    if (!y.advanced && x.advanced) return 1;
    return x.requirements.indexOf(3) - y.requirements.indexOf(3);
  });
}

// function sort_orders(G) {
//   G.orders = G.orders.sort((x,y)=>{
//     if (y.advanced && !x.advanced) return -1;
//     if (!y.advanced && x.advanced) return 1;
//     return x.requirements.indexOf(3) - y.requirements.indexOf(3);
//   });
// }

function sort_finished(G) {
  G.finished = G.finished.sort((x,y)=>(x.order_id-y.order_id));
}

function price_up(order) {
  // let new_requirements = order.requirements;
  // if (order.advanced) {
  //   new_requirements[3] += 1;
  // }
  // else {
  //   new_requirements = new_requirements.map(x => (x == 0)? 0 : x+1);
  // }
  // return {...order, requirements: new_requirements};
  if (order.advanced) {
    order.requirements[3] += 1;
  }
  else {
    order.requirements = order.requirements.map(x => (x==0)?0:x+1);
  }
}

function finishOrder(G, ctx, idx) {
  let order = G.orders[idx];

  if (payMaterials(G, ctx, order.requirements)) {
    G.score += order.score;
    if (order.reward != undefined) {
      G.materials[order.reward] += 1;
    }
    G.finished.push({...G.orders.splice(idx, 1)[0]});
    logMsg(G, ctx, "完成订单");
    // sort_orders(G);

    if ([4,8].includes(G.finished.length)) {
      G.orders.map(price_up);
      G.odeck.map(price_up);
    }
  }
}

function useOrder(G, ctx, idx, field_selected, enemy_selected) {
  let order = G.finished[idx];

  if (use(G, ctx, order) && ((order.cost == undefined) || (payMaterials(G, ctx, order.cost)))) {
    order.effect(G, ctx, field_selected, enemy_selected);
    for (let f of G.onUseOrder) {
      f(G, ctx, order);
    }
  }
}

function harvest(G, ctx) {
  let harvest_orders = G.finished.filter(x => x.harvest);
  for (let order of harvest_orders) {
    if (use(G, ctx, order)) {
      order.effect(G, ctx);
    }
  }
}

export function drawEnemy(G, ctx) {
  if (G.edeck.length > 0) {
    let enemy = move(G, ctx, "edeck", "efield");
    enemy.exhausted = G.enemy_exhausted_enter;
    enemy.dmg = 0;
    enemy.enraged = enemy.enraged || false;
    logMsg(G, ctx, `${enemy.name} 入场(还剩${G.edeck.length}张)`);
    if (enemy.is_elite) {
      switchEnemy(G, ctx);
      // if (enemy.onPlay && !surge) {
      //   enemy.onPlay(G, ctx, enemy);
      // }
    }
    if (enemy.onPlay) {
      enemy.onPlay(G, ctx, enemy);
    }
  
  }
}

export function addBoss(G, ctx, boss_name) {
  let boss = {...BOSSES.find(x => x.name == boss_name)};

  boss.exhausted = false;
  if (boss.name == "复仇者") {
    boss.dmg = -98;
  }
  else {
    boss.dmg = -24;
  }
  G.efield.push(boss);
}

export function switchEnemy(G, ctx) {
  // if (G.not_switch) {
  //   return false;
  // }

  let len = G.efield.length;
  let enemy = G.efield[len-1];
  let switcher = G.efield[len-2];

  // let surge = false;
  // if (len == 1) {
  //   surge = true;
  // }
  // else if (switcher.is_elite) {
  //   surge = true;
  // }

  // if (surge) {
  //   G.efield.pop();
  //   drawEnemy(G, ctx);
  // }
  if (switcher && (!switcher.is_elite)) {
    G.efield.splice(len-2, 1);
  }
  else {
    enemy.atk = Math.max(enemy.atk - 2, 1);
    enemy.hp = Math.max(enemy.hp - 2, 1);
  }

  // return false;
}

export function enemy2card(G, ctx) {
  let enemy = Object.assign({}, ctx.random.Shuffle(G.edeck)[0]);
  enemy = {
    ...enemy,
    was_enemy: true,
    cost: 1,
    mine: 3,
    block: 2,
    reinforce: 1,
    reinforce_desc: "+3/+3",
    material: ctx.random.Die(3)-1,
    onReinforce: (G, ctx, self) => {
      self.atk += 3;
      self.hp += 3;
    },
  };
  if (typeof enemy.desc == "string") {
    enemy.desc = enemy.desc.replace("动乱", "采掘");
    enemy.desc = enemy.desc.replace("入场", "部署");
  }
  return enemy;
}

export function generate_combined_card(G, ctx) {
  let card = {
    reversed: true,
    cost: ctx.random.Die(12)-2,
    atk: ctx.random.Die(12)-2,
    hp: ctx.random.Die(12),
    mine: ctx.random.Die(5),
    block: ctx.random.Die(4)-1,
    reinforce: 1,
    material: ctx.random.Die(3)-1,
    desc: [],
  };

  let time_points = [
    ["部署: ", "onPlay"],
    ["采掘: ", "onMine"],
    ["战斗: ", "onFight"],
    ["行动: ", "action"],
    ["摧毁: ", "onOut"],
  ];
  time_points = ctx.random.Shuffle(time_points).slice(0,2);
  let effects = ctx.random.Shuffle(G.EFFECTS);

  for (let i=0; i<2; i++) {
    card.desc.push(`${time_points[i][0]}${effects[i][0]}`);
    card[time_points[i][1]] = effects[i][1];
  }
  card.desc = [card.desc[0], <br/>, card.desc[1]];

  card.reinforce_desc = effects[2][0];
  card.onReinforce = effects[2][1];

  let title = ctx.random.Shuffle(G.CARDS)[0];
  card.name = title.name.split("").reverse().join("");
  if (card.name == "W") {
    card.name = "M";
  }
  card.illust = title.illust;

  return card;
  
}

function fight(G, ctx, idx1, idx2) {
  if (idx1 < 0 || idx1 >= G.field.length || idx2 < 0 || idx2 >= G.efield.length) {
    console.log("invalid move");
    logMsg(G, ctx, "请先选定场上干员后，再点击敌人和\"战斗\"");
    return;
  }

  let card = G.field[idx1];
  let enemy = G.efield[idx2];

  if (use(G, ctx, card) && (G.stage == "player")) {
    logMsg(G, ctx, `使用 ${card.name} 战斗`);
    deal_damage(G, ctx, "efield", idx2, card.atk);
    if (card.onFight) {
      card.onFight(G, ctx, card, enemy);
    }
    for (let f of G.onCardFight) {
      f(G, ctx, card, enemy);
    }
  }
}

function act(G, ctx, idx) {
  let card = G.field[idx];

  if (use(G, ctx, card) && (G.stage == "player")) {
    logMsg(G, ctx, `使用 ${card.name} 行动`);
    card.action(G, ctx, card);

    for (let f of G.onCardAct) {
      f(G, ctx, card);
    }
  }
}

export function reinforce_card(G, ctx, card) {
  card.power = card.power || 0; // EH: are there any better methods to write less var||0?
  card.power += 1;
  if (card.onReinforce) {
    card.onReinforce(G, ctx, card);
  }
}

export function get_num_rest_cards(G, ctx) {
  return G.field.filter(x => (!x.exhausted)).length;
}

export function rest(G, ctx) {
  let rest_cards = G.field.filter(x => (!x.exhausted));
  let num_rest_cards = rest_cards.length;

  for (let i=0; i<num_rest_cards; i++) {
      // draw(G, ctx);
      G.costs += 1;
  }

  for (let card of rest_cards) {
    if (card.onRest) {
      card.onRest(G, ctx, card);
    }
  }
}

export function reinforce(G, ctx, idx) {
  let card = G.field[idx];
  let requirements = [0,0,0,0];
  requirements[card.material] = card.reinforce;

  if (G.reinforce_need_cost) {
    let paid = payCost(G, ctx, 1);
    if (!paid) {
      return;
    }
  }

  if (payMaterials(G, ctx, requirements)) {
    reinforce_card(G, ctx, card);
  }
}

export function choice(ctx, alist) {
  return ctx.random.Shuffle(alist)[0];
}

export function reinforce_hand(G, ctx) {
  let card = ctx.random.Shuffle(G.hand)[0];

  if (card) {
    reinforce_card(G, ctx, card);
  }
}

export function exhaust_order(G, ctx) {
  let orders = G.finished.filter(x => !x.exhausted);
  if (orders.length > 0) {
    let order = choice(ctx, orders);
    order.exhausted = true;
    return order;
  }
  else {
    return undefined;
  }
}

export function reinforce_field(G, ctx) {
  let card = choice(ctx, G.field.filter(x => (!(x.exhausted||["诗怀雅"].includes(x.name)))));

  if (card) {
    reinforce_card(G, ctx, card);
  }
}

export function exhaust_random_enemy(G, ctx) {
  let unexhausted = G.efield.filter(x => (!(x.exhausted||x.unyielding)));
  if (unexhausted.length > 0) {
    ctx.random.Shuffle(unexhausted)[0].exhausted = true;
  }
}

export function reduce_enemy_atk(G, ctx, amount) {
  let reduced = ctx.random.Shuffle(G.efield)[0];
  if (reduced) {
    reduced.atk -= amount;
  }
}

export function add_vulnerable(G, ctx, amount) {
  let enemy = choice(ctx, G.efield);
  if (enemy) {
    enemy.vulnerable = (enemy.vulnerable || 0) + amount;
  }
}

export function ready_random_card(G, ctx, self) {
  let exhausted_cards = G.field.filter(x => (x.exhausted && (x != self)));
  let prepared_cards = exhausted_cards.filter(x => (![self.name, "雷蛇", "白面鸮", "艾雅法拉", "能天使", "温蒂", "白雪", "霜叶", "夜莺", "白金"].includes(x.name)));
  if ((exhausted_cards.length != 0) && (prepared_cards.length == 0)) {
    logMsg(G, ctx, "干员们感到意外的疲惫，无法被重置");
  }
  if (prepared_cards.length > 0) {
    let card = ctx.random.Shuffle(prepared_cards)[0];
    card.ready_times = card.ready_times || 0;
    if (card.ready_times >= 5) {
      logMsg(G, ctx, `${card.name} 感到意外的疲惫`);
      return;
    }
    card.exhausted = false;
    card.ready_times += 1;
    logMsg(G, ctx, `重置 ${card.name}`);
  }

}

export function fully_restore(G, ctx) {
  // EH: find a "sorted" function instead of this way
  let card = [...G.field].sort((x,y) => {
    if (x.dmg != y.dmg) {
      return y.dmg - x.dmg;
    }
    else {
      return x.hp-y.hp;
    }
  })[0];
  let cured = card.dmg;
  card.dmg = 0;

  return cured;
}

export function cure(G, ctx, amount) {
  // EH: find a "sorted" function instead of this way
  let card = [...G.field].sort((x,y) => {
    if (x.dmg != y.dmg) {
      return y.dmg - x.dmg;
    }
    else {
      return x.hp-y.hp;
    }
  })[0];
  if (card) {
    card.dmg = Math.max(card.dmg - amount, 0);
    // if (card.dmg < 0) {
      // card.hp -= card.dmg;
      // card.dmg = 0;
    // }
  }
  return card;
}

export function get_rhine_order(G, ctx) {
  let order = {...(ctx.random.Shuffle(G.odeck)[0])};
  order.rhine = true;
  order.color = undefined;
  G.finished.unshift(order);
  // sort_finished(G);
}

function enemyInit(G, ctx) {
  clearField(G, ctx, "efield");
  G.stage = "enemy";
}

export function enemyMove(G, ctx, idx) {
  let enemy = G.efield[idx];

  if (use(G, ctx, enemy)) {

    if (enemy.action && (!enemy.enraged)) {
      enemy.action(G, ctx, enemy);
      logMsg(G, ctx, `${enemy.name} 使用其行动能力`);
    }

    else {
      let blocker = get_blocker(G, ctx, enemy);
      let blocker_idx = G.field.indexOf(blocker);

      if (blocker_idx != -1) {
        deal_damage(G, ctx, "field", blocker_idx, enemy.atk);
        logMsg(G, ctx, `${enemy.name} 对 ${blocker.name} 发起了进攻`);
        if (enemy.onFight) {
          enemy.onFight(G, ctx, enemy, blocker);
        }
      }

      else {
        if (enemy.enraged) {
          if (G.field.length > 0) {
            let card = ctx.random.Shuffle(G.field.filter(x=>(x.hp>x.dmg)))[0];
            let card_idx = G.field.indexOf(card);
            if (card){
              deal_damage(G, ctx, "field", card_idx, enemy.atk);
              if (enemy.onFight) {
                enemy.onFight(G, ctx, enemy, card);
              }
            }
            logMsg(G, ctx, `暴怒的 ${enemy.name} 发起了进攻`);
          }
        }
        else {
          G.danger += 1;
          logMsg(G, ctx, `${enemy.name} 发起了动乱`);
          if (enemy.onMine) {
            enemy.onMine(G, ctx, enemy);
          }
        }
      }
    }
  }
}

export function clearField(G, ctx, field="field") {
  for (let i=G[field].length-1; i>=0; i--) {
    let card = G[field][i];
    if (card.hp - card.dmg <= 0) {
      out(G, ctx, field, i);
      if (field == "efield") {
        G.score += 1;
        for (let f of G.onEnemyOut) {
          f(G, ctx);
        }
      }
    }
  }
}

function refresh(G, ctx) {
  for (let card of [].concat(G.field, G.efield, G.finished)) {
    card.exhausted = false;
  }
}

function onScenarioBegin(G, ctx) {
  //Setup edeck
  for (let enemy of G.edeck) {
    if (enemy.atk < 0) { 
      enemy.atk = 0;
    }
  }

  //SetUp
  for (let i=0; i<4; i++){
    draw(G, ctx);
  }

  for (let i=0; i<2; i++){
    drawEnemy(G, ctx);
  }

  refreshOrder(G, ctx);

  console.log("Setup finished");
  G.playing = true;
  ctx.events.endTurn(); // After set playing to true, end turn to call onTurnBegin effects
}

export function str2deck(deck_data) {
  let card_dict = arr2obj(CARDS);
  let deck = [];
  let rng = new PRNG(deck_data);
  let alter_art = (rng.random() <= 0.33);
  if (alter_art) {
    console.log("Got some alter!");
  }
  else {
    console.log("No alter here.");
  }

  let cards = deck_data.split("\n");
  for (let i=0; i<cards.length; i++) {
    let card = cards[i];
    let card_data = card.split(" ");
    if (card_data.length >= 2) {
      let amount = parseInt(card_data[0]) || 0; // If it's NaN, then assign it 0
      let target_card = card_dict[card_data[1]];

      if (target_card) {
        //init card state here
        for (let j=0; j<amount; j++) {
            let new_card = {
              ...target_card,
              material: i % 3,
            };

            if (alter_art) {
              let altered = ALTER_ARTS[new_card.name];
              if (altered) {
                new_card.old_illust = new_card.illust;
                new_card.illust = altered;
                new_card.was_enemy = true;
                new_card.name += "(异画)";
              }
            }

            deck.push(new_card);
        }
      }
    }
  }

  // Limit alter art
  if (alter_art) {
    for (let card of deck) {
      if (card.old_illust && rng.random() <= 0.33) {
        card.illust = card.old_illust;
        card.was_enemy = false;
        card.name = card.name.slice(0, card.name.length-4);
      }
    }
  }

  return deck;
}

// function setDeck(G, ctx, deck_data) {
//   G.deck = ctx.random.Shuffle(str2deck(deck_data));
// }

function setDecks(G, ctx, decks) {
  Object.assign(G, decks);
  G.another_deck = ctx.random.Shuffle(G.deck);
  // To make sure each time also got different ctx.random results
  // EH: However, it's still better if I can adjust the seed of ctx
  for (let i=0; i<G.shuffle_times; i++) {
    ctx.random.D4(); 
  }
}

export function init_decks(deck, seed) {
  // let deck = str2deck(deck_data);
  // deck = deck.map(x=>({...x, reversed:true}));
  let rng = new PRNG(seed);

  let get_enemies = () => (ENEMIES.map(x=>({...x})));
  let edeck = get_enemies().concat(get_enemies());
  let odeck = ORDERS.map((x,idx)=>({...x, order_id:idx, color:rng.randRange(3)}));

  deck = rng.shuffle(deck);
  edeck = rng.shuffle(edeck);
  odeck = [...rng.shuffle(odeck), ...rng.shuffle(odeck)];

  edeck = edeck.slice(0, 22);

  return {deck, edeck, odeck, shuffle_times:rng.randRange(30)};
}

export function logMsg(G, ctx, msg) {
  G.messages.unshift(msg);
}

function changeMsg(G, ctx, msg) {
  G.messages[0] = msg;
}

export function achieve(G, ctx, achievement_name, achievement_desc, card) {
  if (card && !G.achievements[card.name]) {
    alert(`达成成就: ${achievement_name}\n${achievement_desc}`);
    G.achievements[card.name] = true;
  }
}

export function setup(ctx) {
    const G = {};
    setup_scenario(G, ctx);

    return G;
}

function setup_events(G, ctx) {   
  G.onPlayCard = [];
  G.onUseCard = [];
  G.onCardMine = [];
  G.onCardFight = [];
  G.onCardAct = [];
  G.onCardReinforced = [];

  G.onPayCost = [];
  G.onDropCard = [];

  G.onUseOrder = [];

  G.onEnemyOut = [];
}

function setup_turn_states(G, ctx) {
  G.has_discarded = false;
}

function setupRoguelikeBattle(G, ctx, relics) {
  G.relics = relics.map(x => ({...x}));

  for (let r of G.relics) {
    r.onBattleBegin && r.onBattleBegin(G, ctx, r);
  }
}

export function setup_scenario(G, ctx) {
    G.hand = [];
    G.field = [];

    G.deck = [];
    // let get_enemies = () => (ENEMIES.map(x=>Object.assign({},x)));
    // G.edeck = ctx.random.Shuffle(get_enemies().concat(get_enemies())).slice(0,20);
    // G.odeck = ctx.random.Shuffle(ORDERS.map((x,idx)=>({...x, order_id:idx})));
    G.edeck = [];
    G.odeck = [];
    
    G.efield = [];
    G.discard = [];
    G.ediscard = [];

    G.orders = [];
    // G.finished = [default_order];
    G.finished = [];

    G.picks = [];

    G.costs = 2; //On turn begin, gain 3, so it's 2 at setup
    G.materials = [1, 1, 1, 0]; //EH: it may not be a good idea to set materials in array, but whatever, do it at first

    G.score = 0;
    G.danger = 0;
    G.goal = 12;
    G.max_danger = 8;
    G.num_enemies_out = 2;
    G.field_limit = 8;
    G.hand_limit = 8;

    G.relics = [];
    G.extra_gain = 0;

    setup_events(G, ctx);

    G.exhausted_enter = false;
    G.enemy_exhausted_enter = true;

    G.messages = ["欢迎来到明日方舟: 采掘行动"];
    G.achievements = {};

    G.playing = false;
    G.gained = [];
    G.stage = "player";
    G.round_num = 0;

    G.diff_cnt = 0;

    G.CARDS = CARDS.slice(0);
    let banned_cards = ["可露希尔"];
    G.CARDS = G.CARDS.filter(x => !banned_cards.includes(x.name));
    let effects = [];
    for (let c of CARDS.filter(x=>((typeof x.desc == "string")))) {
      let desc = c.desc.split(":").slice(1).join("");
      if (c.onPlay) {
        effects.push([desc, c.onPlay]);
      }
      if (c.onMine) {
        effects.push([desc, c.onMine]);
      }
      if (c.action) {
        effects.push([desc, c.action]);
      }
    }
    G.EFFECTS = effects;
    // G.ORDERS = [...ORDERS];

    console.log("Scenario setup finished.");
}

function setup_competition_deck(G, ctx, Deck=[]) {
  G.Deck = Deck;
}

export function pick(G, ctx, idx) {
  let card = G.picks[idx];

  if (card) {
    if (payMaterials(G, ctx, card.price)) {
      G.picks.splice(idx, 1);
      G.hand.unshift(card);
    }
  }
}

export function refresh_picks(G, ctx) {
  // G.picks = ctx.random.Shuffle(G.deck).slice(0, 5);
  G.picks = mod_slice(G.another_deck, G.round_num*5, 5);

  // Add special card every turn to ensure there is a required card in that stage
  // if (G.round_num >= 3) {
  let special_card_name = choice(ctx, (G.round_num >= 3)? pick_scorers : pick_vanguards);
  let special_card = G.CARDS.find(x => x.name == special_card_name);
  if (special_card) {
    G.picks[2] = {...special_card, material: ctx.random.Die(3)-1};
  }
  // }

  let add_price = (pick, idx) => {
    let price = [0, 0, 0, 0];
    let requirement = ctx.random.Die(3) - 1;
    price[requirement] = [1,1,1,2,2][idx] || 1;
    return {...pick, price};
  }
  G.picks = G.picks.map(add_price);
}

export function summon(G, ctx, card, self) {
  let idx = G.field.indexOf(self) + 1;
  if (card) {
    let new_card = init_card_state(G, ctx, {...card});
    G.field.splice(idx, 0, new_card);
    new_card.exhausted = false;
  }
}

function setup_deck_selection(G, ctx, num_shuffles) {
  _.times(num_shuffles, ctx.random.D4);
  G.deck_list = [];
  G.deck_names = _.times(3, get_deck_name);
  let deck_generators = [generate_deck_s2, generate_deck_s2, generate_deck_s1];
  for (let i=0; i<3; i++) {
    G.deck_list.push(str2deck(deck_generators[i](G.deck_names[i])));
  }
  G.num_upgrades = 15;
}


function select_deck(G, ctx, idx) {
  G.Deck = G.deck_list[idx];
  for (let card of G.Deck) {
    card.onPlayBonus = [];
  }
  refresh_selections(G, ctx);
}

function refresh_selections(G, ctx) {
  // TOFINDOUT: Double list bug? Or say copy list bug? If modify items in sliced version of the list, then the item from the main list is not modified. Maybe "new card object" bug is similar.
  // G.selections = ctx.random.Shuffle(G.Deck).slice(0,3);
  // Control the 12 selections on frontend? On frontend at first, if there are requirements for reconstructing it to backend, reconstruct it.    
  G.selections = ctx.random.Shuffle(G.Deck);
  G.upgrades = ctx.random.Shuffle(UPGRADES).slice(0,3);


  G.num_upgrades -= 1;
  if (G.num_upgrades <= 0) {
    G.finish_upgrading = true;
  }
}

function upgrade(G, ctx, card_idx, upgrade_idx) {
  let card = G.selections[card_idx];
  let upgrade = G.upgrades[upgrade_idx];
  if (card && upgrade) {
    upgrade.effect(card);
    card.upgraded = true;
  }
  // To prevent double list bug
  G.Deck = G.selections;
}

function receive_diff(G, ctx, diff) {
  G.score += diff.score;
  G.danger += diff.danger;
  G.materials = vector_sum(G.materials, diff.materials);
  G.efield.map((enemy, idx) => {
    enemy.dmg += diff.efield_dmg[idx] || 0;
    enemy.hp += diff.efield_hp[idx] || 0;
  });
}

export function get_desc(card) {
  return  <span>
    <span style={{fontSize:"120%"}}>
      {card.atk}/{card.hp} &nbsp;
      {ICONS.mine}{card.mine} &nbsp;
      {(card.block>0)? (<span>{ICONS.block}{card.block}</span>) : ""}
    </span>
    <br/>
    {card.desc||""}
    <br/>
    <span style={{
      display: (card.onPlayBonus && card.onPlayBonus.length > 0)?"":"none"
    }}>
      <i>
      部署奖励: {card.onPlayBonus && card.onPlayBonus.reduce((acc, val) => (acc + val.name + " "), "")}
      </i>
      <br/>
    </span>
    ({_.times(card.reinforce, ()=>material_icons[card.material || 0])}: {card.reinforce_desc||""})
    <br />
    <i>{card.quote||""}</i>
  </span>;
}

export const AC = {
  setup: setup,

  moves: {
    setup_scenario,
    setDecks,
    addTags,
    onScenarioBegin,
    mulligan,
    draw,
    play,
    mine,
    act,
    reinforce,
    rest,
    setValue,
    refreshOrder,
    finishOrder,
    useOrder,
    harvest,
    drawEnemy,
    fight,
    clearField,
    enemyInit,
    enemyMove,
    logMsg,
    changeMsg,
    setup_competition_deck,
    setup_deck_selection,
    select_deck,
    refresh_selections,
    upgrade,
    pick,
    setupRoguelikeBattle,
    receive_diff,
  },

  turn: {
    onBegin(G, ctx) {
      if (G.playing) {
        console.log("On turn begin");
        logMsg(G, ctx, "回合开始");
        G.stage = "player";
        G.round_num += 1;

        refresh(G, ctx);
        // draw(G, ctx);
        if (G.deck.length > 0) {
          G.hand.unshift(G.deck.pop());
        } 
        refreshOrder(G, ctx);
        G.costs += 3;
        refresh_picks(G, ctx);
        sort_finished(G, ctx);

        setup_events(G, ctx);
        setup_turn_states(G, ctx);

        for (let card of [...G.hand, ...G.field, ...G.efield, ...G.relics]) {
          card.ready_times = 0;
          if (card.onTurnBegin) {
            card.onTurnBegin(G, ctx, card);
          }
        }

        if (G.enemy_grow && G.round_num > 1) {
          for (let enemy of [...G.edeck, ...G.efield]) {
            enemy.atk += 1;
            enemy.hp += 1;
          }
        }
        
        if (G.enemy_hp_grow && G.round_num > 1) {
          for (let enemy of [...G.edeck, ...G.efield]) {
            enemy.hp += 2;
          }
        }

        if (G.round_num == 3 && G.reinforceOnR3) {
          for (let enemy of [...G.edeck, ...G.efield]) {
            enemy.hp += 4;
          }
        }
        
        if (G.round_num == 3 && G.dashOnR3) {
          G.enemy_exhausted_enter = false;
        }

        if (G.round_num == 4 && G.reinforceOnR4) {
          for (let enemy of [...G.edeck, ...G.efield]) {
            enemy.atk += 5;
            enemy.hp += 5;
          }
        }

        if (G.round_num == 3 && G.moreEnemiesOnR3) {
          G.num_enemies_out += 1;
        }

        if (G.fog) {
          for (let i=G.field.length-1; i>=0; i--) {
            deal_damage(G, ctx, "field", i, 1);
          }
          clearField(G, ctx, "field"); // Add this to discard destroyed cards
          // EH: Maybe this can be reconstructed?
        }

        if (G.limit_hand && G.hand.length > 5) {
          G.discard = [...G.discard, ...G.hand.slice(5)];
          G.hand = G.hand.slice(0, 5);
        }

        if (G.danger < 0) {
          G.danger = 0;
        }

        if (G.reduce_goal) {
          G.goal -= 4;
        }
      }
    },

    onEnd(G, ctx) {
      clearField(G, ctx, "field");
    },

    // moveLimit: 1000,    // I don't know why, when adding this line, the init hand size comes to 4, and this won't work for infinity loop as loop occurs in one move

  },

  endIf(G, ctx) {
    if (G.playing) {
      // if (G.deck.length == 0) {
      //   return {
      //     win: false,
      //     reason: "牌库被抽光",
      //   };
      // }
      if (G.edeck.length == 0) {
        return {
          win: false,
          reason: "敌人牌库被抽光",
        }
      }
      else if (G.danger >= G.max_danger) {
        return {
          win: false,
          reason: "动乱指数过高",
        }
      }
      else if (G.score >= G.goal) {
        return {
          win: true,
        }
      }
    }
  },

  seed: 114514,

  plugins: [
    {
      name: "diff",
      fnWrap: (fn) => (G, ctx, ...args) => {
        if (typeof args[0] == "object" && "is_diff" in args[0]) {
          return fn(G, ctx, ...args);
        }
        else {
          let {score: prev_score, danger: prev_danger, materials: prev_materials, efield: prev_efield} = G;
          let new_G = fn(G, ctx, ...args);
          let {score, danger, materials, efield} = new_G;
          // Send diff whatever when move
          let diff = {
            is_diff: true,
            score: score - prev_score,
            danger: danger - prev_danger,
            materials: vector_diff(materials, prev_materials),
            efield_dmg: vector_diff(efield.map(e=>e.dmg), prev_efield.map(e=>e.dmg)),
            efield_hp: vector_diff(efield.map(e=>e.hp), prev_efield.map(e=>e.hp)),
          }
          let diff_cnt = new_G.diff_cnt;
          let span_diff = [diff.score, diff.danger, ...diff.materials, ...diff.efield_dmg, ...diff.efield_hp];
          if (_.sum(span_diff) > 0) {
            diff_cnt += 1;
            console.log("Diff:", diff);
          }
          return {...new_G, diff_cnt, diff};
        }
      }
    }
  ],
  

  // TODO: know how to set available moves to all moves, then add this phase feature
  // phases: {
  //   // TODO: set available moves on phases
  //   preScenario: {
  //     start: true,
  //     next: "scenario",
  //     onEnd(G, ctx) {
  //       console.log("Scenario setup finished, enter the game");
  //     }
  //   },

  //   scenario: {
  //     turn: {
  //       onBegin(G, ctx) {
  //         console.log("On turn begin");
  //         refresh(G, ctx);
  //         draw(G, ctx);
  //         G.costs += 3;
  //       },

  //     },

  //   }
  // },

};