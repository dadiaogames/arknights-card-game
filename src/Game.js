import { React } from 'react';
import { CARDS } from "./cards";
import { ENEMIES } from "./enemies";
import { ORDERS, material_icons } from "./orders";
import { arr2obj } from "./utils";

export function move(G, ctx, d1, d2, idx) {
  let cd_idx = idx || 0;
  let card = G[d1].splice(cd_idx, 1)[0];
  G[d2].push(card);
  return card;
}

export function payCost(G, ctx, cost) {
  if (G.costs >= cost) {
    G.costs -= cost
    return true;
  }

  else{
    logMsg(G, ctx, "费用不足");
    return false;
  }
}

export function gainMaterials(G, ctx, count) {
  let cnt = count || 1;
  let gained = [];

  for (let i=0; i<cnt; i++) {
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
    return true;
  }

  else {
    return false;
  }
}

function get_blocker(G, ctx, idx) {
  //Return who blocks this enemy
  let blocked_enemies = 0;

  for (let c of G.field) {
    blocked_enemies += c.block || 0;
    if (blocked_enemies > idx) {
      return c;
    }
  }

  return false;
}

export function deal_damage(G, ctx, deck, idx, dmg) {
  let card = G[deck][idx];

  //cards with no damage may not have the damage attr
  card.dmg = card.dmg || 0;
  card.dmg += dmg;
  logMsg(G, ctx, `${card.name} 受到${dmg}点伤害`);

  if (card.dmg >= card.hp) {
    let discard = (deck == "field") ? "discard" : "ediscard";
    move(G, ctx, deck, discard, idx);
    logMsg(G, ctx, `${card.name} 被摧毁`);
    if (card.onOut) {
      card.onOut(G, ctx, card);
    }
  }
}

export function deal_random_damage(G, ctx, amount) {
  if (G.efield.length > 0){
    let idx = ctx.random.Die(G.efield.length) - 1
    deal_damage(G, ctx, "efield", idx, amount);
  }
}

export function addTags(G, ctx, tags) {
  for (let t of tags) {
    t.effect(G, ctx);
  }
}

export function draw(G, ctx) {
  if (G.deck.length > 0) {
    G.hand.unshift(G.deck.pop());
  } //TODO: else, lose the game
}

function play(G, ctx, idx) {
  let card = G.hand[idx]; //No need to verify at this stage

  if (payCost(G, ctx, card.cost)) {
    move(G, ctx, "hand", "field", idx);
    card.dmg = 0;
    card.exhausted = G.exhausted_enter;
    logMsg(G, ctx, `部署 ${card.name}`);
    //TODO: if this is a spell instead of creature
    //TODO: onPlay
    if (card.onPlay) {
      card.onPlay(G, ctx, card);
    }
  }
}

function mine(G, ctx, idx) {
  let card = G.field[idx];

  if (use(G, ctx, card)) {
    gainMaterials(G, ctx, card.mine);
    logMsg(G, ctx, `使用 ${card.name} 采掘`);
    if (card.onMine) {
      card.onMine(G, ctx, card);
    }
  }
}

function setValue(G, ctx, attr, val) {
  G[attr] = val;
}

function drawOrder(G, ctx) {
  if (G.odeck.length > 0) {
    move(G, ctx, "odeck", "orders");
  }
}

function finishOrder(G, ctx, idx) {
  let order = G.orders[idx];

  if (payMaterials(G, ctx, order.requirements)) {
    G.materials[order.reward] += 1;
    G.score += order.score;
    G.finished.push(G.orders.splice(idx, 1)[0]);
    logMsg(G, ctx, "完成订单");
  }
}

function useOrder(G, ctx, idx) {
  let order = G.finished[idx];

  if (use(G, ctx, order)) {
    order.effect(G, ctx);
  }
}

function drawEnemy(G, ctx) {
  if (G.edeck.length > 0) {
    let enemy = move(G, ctx, "edeck", "efield");
    enemy.exhausted = true;
    enemy.dmg = 0;
    logMsg(G, ctx, `${enemy.name} 入场`);
    if (enemy.onPlay) {
      enemy.onPlay(G, ctx, enemy);
    }
  }
}

function fight(G, ctx, idx1, idx2) {
  if (idx1 < 0 || idx1 >= G.field.length || idx2 < 0 || idx2 >= G.efield.length) {
    console.log("invalid move");
    return;
  }

  let card = G.field[idx1];
  let enemy = G.efield[idx2];

  if (use(G, ctx, card)) {
    logMsg(G, ctx, `使用 ${card.name} 战斗`);
    deal_damage(G, ctx, "efield", idx2, card.atk);
    if (card.onFight) {
      card.onFight(G, ctx, card, enemy);
    }
  }
}

function act(G, ctx, idx) {
  let card = G.field[idx];

  if (use(G, ctx, card)) {
    card.action(G, ctx, card);
    logMsg(G, ctx, `使用 ${card.name} 行动`);
  }
}

export function exhaust_random_enemy(G, ctx) {
  let unexhausted = G.efield.filter(x => (!x.exhausted));
  if (unexhausted.length > 0) {
    ctx.random.Shuffle(unexhausted)[0].exhausted = true;
  }
}

export function ready_random_card(G, ctx, self) {
  let exhausted_cards = G.field.filter(x => (x.exhausted && (x.name != self.name)));
  if (exhausted_cards.length > 0) {
    ctx.random.Shuffle(exhausted_cards)[0].exhausted = false;
  }

}

export function cure(G, ctx, amount) {
  // EH: find a "sorted" function instead of this way
  let ranked_field_by_dmg = G.field.map(x=>x).sort(x => -x.dmg);
  let card = ranked_field_by_dmg[0];
  card.dmg -= amount;
  if (card.dmg < 0) {
    card.hp -= card.dmg;
    card.dmg = 0;
  }
}

export function get_rhine_order(G, ctx) {
  let order = Object.assign({}, ctx.random.Shuffle(G.odeck)[0]);
  order.rhine = true;
  G.finished.unshift(order);
}

function enemyMove(G, ctx, idx) {
  let enemy = G.efield[idx];

  if (use(G, ctx, enemy)) {
    let blocker = get_blocker(G, ctx, idx);
    let blocker_idx = G.field.indexOf(blocker);

    if (blocker) {
      deal_damage(G, ctx, "field", blocker_idx, enemy.atk);
      logMsg(G, ctx, `${enemy.name} 对 ${blocker.name} 发起了进攻`);
    }

    else {
      G.danger += 1;
      logMsg(G, ctx, `${enemy.name} 发起了动乱`);
    }
  }
}

function refresh(G, ctx) {
  for (let card of [].concat(G.field, G.efield, G.finished)) {
      card.exhausted = false;
  }
}

function onScenarioBegin(G, ctx) {
  //SetUp
  for (let i=0; i<4; i++){
    draw(G, ctx);
  }

  for (let i=0; i<2; i++){
    drawEnemy(G, ctx);
  }

  for (let i=0; i<3; i++){
    drawOrder(G, ctx);
  }
  console.log("Setup finished");
  G.playing = true;
  ctx.events.endTurn();
}

export function str2deck(deck_data) {
  let card_dict = arr2obj(CARDS);
  let deck = [];

  let cards = deck_data.split("\n");
  for (let card of cards) {
    let card_data = card.split(" ");
    if (card_data.length >= 2) {
      let amount = parseInt(card_data[0]) || 0; // If it's NaN, then assign it 0
      let target_card = card_dict[card_data[1]];
      if (target_card) {
        for (let i=0; i<amount; i++) {
            deck.push(Object.assign({}, target_card));
        }
      }
    }
  }

  return deck;
}

function setDeck(G, ctx, deck_data) {
  let deck = str2deck(deck_data);
  G.deck = ctx.random.Shuffle(deck);
}

function logMsg(G, ctx, msg) {
  G.messages.unshift(msg);
}

function changeMsg(G, ctx, msg) {
  G.messages[0] = msg;
}

export function setup(ctx) {
    const G = {};

    G.hand = [];
    G.field = [];

    G.deck = [];
    let get_enemies = () => (ENEMIES.map(x=>Object.assign({},x)));
    G.edeck = ctx.random.Shuffle(get_enemies().concat(get_enemies()));
    G.odeck = ctx.random.Shuffle(ORDERS.map(x=>Object.assign({},x)));
    
    G.efield = [];
    G.discard = [];
    G.ediscard = [];

    G.orders = [];
    G.finished = [];

    G.costs = 2; //On turn begin, gain 3, so it's 2 at setup
    G.materials = [0, 0, 0, 0]; //EH: it may not be a good idea to set materials in array, but whatever, do it at first

    G.score = 0;
    G.danger = 0;
    G.goal = 10;
    G.max_danger = 8;

    G.exhausted_enter = false;

    G.messages = ["欢迎来到明日方舟: 采掘行动"];

    G.playing = false;
    G.gained = [];

    return G;
  }

export const AC = {
  setup: setup,

  moves: {
    setDeck,
    addTags,
    onScenarioBegin,
    draw,
    play,
    mine,
    act,
    setValue,
    drawOrder,
    finishOrder,
    useOrder,
    drawEnemy,
    fight,
    enemyMove,
    logMsg,
    changeMsg,
  },

  turn: {
    onBegin(G, ctx) {
        if (G.playing) {
          console.log("On turn begin");
          logMsg(G, ctx, "回合开始");
          refresh(G, ctx);
          draw(G, ctx);
          drawOrder(G, ctx);
          G.costs += 3;
      }
    },
  },

  endIf(G, ctx) {
    if (G.playing) {
      if (G.deck.length == 0) {
        return {
          win: false,
          reason: "牌库被抽光",
        };
      }
      else if (G.edeck.length == 0) {
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
  }
  

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