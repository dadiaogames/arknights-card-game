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

function get_blocker(G, ctx, enemy) {
  let idx = G.efield.indexOf(enemy);
  let blocked_enemies = 0;

  for (let c of G.field) {
    blocked_enemies += c.block || 0;
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
  logMsg(G, ctx, `${card.name} 被摧毁`);
  if (card.onOut) {
    card.onOut(G, ctx, card);
  }
}

export function deal_damage(G, ctx, deck, idx, dmg) {
  let card = G[deck][idx];

  //cards with no damage may not have the damage attr
  card.dmg = card.dmg || 0;
  card.dmg += dmg;
  logMsg(G, ctx, `${card.name} 受到${dmg}点伤害`);

  if (card.dmg >= card.hp && G.stage != "enemy") {
    out(G, ctx, deck, idx);
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

export function init_card_state(G, ctx, card) {
  card.dmg = 0;
  card.power = card.power || 0;
  card.exhausted = G.exhausted_enter;
  return card;
}

export function draw(G, ctx) {
  if (G.deck.length > 0) {
    G.hand.unshift(G.deck.pop());
  } //TODO: else, lose the game
}

export function mulligan(G, ctx, choices) {
  let discarded = G.hand.filter((x, idx) => choices[idx]);
  G.hand = G.hand.filter((x, idx) => !choices[idx]);
  if (G.hand.length < 5) {
    let num_draw = 5 - G.hand.length; // What a tricky feature of js
    for (let i = 0; i < num_draw; i++) {
      draw(G, ctx);
    }
    G.deck = ctx.random.Shuffle([...G.deck, ...discarded]);
  }
}

function play(G, ctx, idx) {
  let card = G.hand[idx]; //No need to verify at this stage

  if (payCost(G, ctx, card.cost)) {
    move(G, ctx, "hand", "field", idx);
    init_card_state(G, ctx, card);
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
    sort_orders(G);
  }
}

function sort_orders(G) {
  G.orders = G.orders.sort((x,y)=>(x.requirements.indexOf(3)-y.requirements.indexOf(3)));
}

function sort_finished(G) {
  G.finished = G.finished.sort((x,y)=>(x.order_id-y.order_id));
}

function finishOrder(G, ctx, idx) {
  let order = G.orders[idx];

  if (payMaterials(G, ctx, order.requirements)) {
    G.materials[order.reward] += 1;
    G.score += order.score;
    G.finished.push(G.orders.splice(idx, 1)[0]);
    logMsg(G, ctx, "完成订单");
    sort_finished(G);
  }
}

function useOrder(G, ctx, idx) {
  let order = G.finished[idx];

  if (use(G, ctx, order)) {
    order.effect(G, ctx);
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
    enemy.exhausted = true;
    enemy.dmg = 0;
    enemy.enraged = enemy.enraged || false;
    logMsg(G, ctx, `${enemy.name} 入场`);
    if (enemy.is_elite) {
      switchEnemy(G, ctx);
    }
    if (enemy.onPlay) {
      enemy.onPlay(G, ctx, enemy);
    }
  }
}

export function switchEnemy(G, ctx) {
  let len = G.efield.length;
  let enemy = G.efield[len-1];
  let switcher = G.efield[len-2];

  let surge = false;
  if (len == 1) {
    surge = true;
  }
  else if (switcher.is_elite) {
    surge = true;
  }

  if (surge) {
    G.efield.pop();
    drawEnemy(G, ctx);
  }
  else {
    G.efield.splice(len-2, 1);
  }
}

export function enemy2hand(G, ctx) {
  let enemy = Object.assign({}, ctx.random.Shuffle(G.edeck)[0]);
  enemy = {
    ...enemy,
    cost: 1,
    mine: 5,
    block: 3,
    reinforce: 1,
    reinforce_desc: "+4/+4",
    material: ctx.random.Die(3)-1,
    onReinforce: (G, ctx, self) => {
      self.atk += 4;
      self.hp += 4;
    },
  };
  G.hand.unshift(enemy);
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

export function reinforce_card(G, ctx, card) {
  card.power = card.power || 0;
  card.power += 1;
  if (card.onReinforce) {
    card.onReinforce(G, ctx, card);
  }
}

export function reinforce(G, ctx, idx) {
  let card = G.field[idx];
  let requirements = [0,0,0,0];
  requirements[card.material] = card.reinforce;

  if (G.harder_reinforce) {
    let paid = payCost(G, ctx, 1);
    if (!paid) {
      return;
    }
  }

  if (payMaterials(G, ctx, requirements)) {
    reinforce_card(G, ctx, card);
  }
}

export function reinforce_hand(G, ctx) {
  let card = ctx.random.Shuffle(G.hand)[0];

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

export function ready_random_card(G, ctx, self) {
  let exhausted_cards = G.field.filter(x => (x.exhausted && (![self.name, "雷蛇", "白面鸮"].includes(x.name))));
  if (exhausted_cards.length > 0) {
    ctx.random.Shuffle(exhausted_cards)[0].exhausted = false;
  }

}

export function cure(G, ctx, amount) {
  // EH: find a "sorted" function instead of this way
  let ranked_field_by_dmg = G.field.filter(x=>(x.block>0)).sort((x,y) => {
    if (x.dmg > y.dmg) {
      return -1;
    }
    else if (x.dmg < y.dmg) {
      return 1;
    }
    else {
      return x.hp-y.hp;
    }
  });
  let card = ranked_field_by_dmg[0];
  if (card) {
    card.dmg -= amount;
    if (card.dmg < 0) {
      card.hp -= card.dmg;
      card.dmg = 0;
    }
  }
}

export function get_rhine_order(G, ctx) {
  let order = Object.assign({}, ctx.random.Shuffle(G.odeck)[0]);
  order.rhine = true;
  G.finished.unshift(order);
  sort_finished(G);
}

function enemyInit(G, ctx) {
  G.stage = "enemy";
}

function enemyMove(G, ctx, idx) {
  let enemy = G.efield[idx];

  if (use(G, ctx, enemy)) {
    if (enemy.action) {
      enemy.action(G, ctx, enemy);
      logMsg(G, ctx, `${enemy.name} 使用其行动能力`);
    }

    else if (enemy.enraged) {
      if (G.field.length > 0) {
        deal_damage(G, ctx, "field", ctx.random.Die(G.field.length)-1, enemy.atk);
        if (enemy.onFight) {
          enemy.onFight(G, ctx, enemy);
        }
        logMsg(G, ctx, `暴怒的 ${enemy.name} 发起了进攻`);
      }
    }

    else {
      let blocker = get_blocker(G, ctx, enemy);
      let blocker_idx = G.field.indexOf(blocker);

      if (blocker_idx != -1) {
        deal_damage(G, ctx, "field", blocker_idx, enemy.atk);
        logMsg(G, ctx, `${enemy.name} 对 ${blocker.name} 发起了进攻`);
      }

      else {
        G.danger += 1;
        logMsg(G, ctx, `${enemy.name} 发起了动乱`);
        if (enemy.onUnrest) {
          enemy.onUnrest(G, ctx, enemy);
        }
      }
    }
  }
}

function onEnemyStageEnd(G, ctx) {
  for (let i=G.field.length-1; i>=0; i--) {
    let card = G.field[i];
    if (card.hp - card.dmg <= 0) {
      out(G, ctx, "field", i);
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

  for (let i=0; i<4; i++){
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
  for (let i=0; i<cards.length; i++) {
    let card = cards[i];
    let card_data = card.split(" ");
    if (card_data.length >= 2) {
      let amount = parseInt(card_data[0]) || 0; // If it's NaN, then assign it 0
      let target_card = card_dict[card_data[1]];

      if (target_card) {
        //init card state here
        target_card.material = i % 3;
        for (let j=0; j<amount; j++) {
            deck.push(Object.assign({}, target_card));
        }
      }
    }
  }

  return deck;
}

function setDeck(G, ctx, deck_data) {
  G.deck = ctx.random.Shuffle(str2deck(deck_data));
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
    G.odeck = ctx.random.Shuffle(ORDERS.map((x,idx)=>({...x, order_id:idx})));
    
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
    G.stage = "player";

    console.log(ctx.random);

    return G;
  }

export const AC = {
  setup: setup,

  moves: {
    setDeck,
    addTags,
    onScenarioBegin,
    mulligan,
    draw,
    play,
    mine,
    act,
    reinforce,
    setValue,
    drawOrder,
    finishOrder,
    useOrder,
    harvest,
    drawEnemy,
    fight,
    enemyInit,
    enemyMove,
    logMsg,
    changeMsg,
  },

  turn: {
    onBegin(G, ctx) {
      if (G.playing) {
        console.log("On turn begin");
        logMsg(G, ctx, "回合开始");
        G.stage = "player";
        refresh(G, ctx);
        draw(G, ctx);
        drawOrder(G, ctx);
        G.costs += 3;

        for (let card of G.field.concat(G.efield.concat(G.finished))) {
          if (card.onTurnBegin) {
            card.onTurnBegin(G, ctx, card);
          }
        }

        if (G.fog) {
          for (let i=G.field.length-1; i>=0; i--) {
            deal_damage(G, ctx, "field", i, 1);
          }
        }
        if (G.danger < 0) {
          G.danger = 0;
        }
      }
    },

    onEnd(G, ctx) {
      onEnemyStageEnd(G, ctx);
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
  },

  seed: undefined,
  

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