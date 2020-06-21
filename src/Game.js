import { CARDS } from "./cards";
import { ENEMIES } from "./enemies";
import { ORDERS } from "./orders";

function move(G, ctx, d1, d2, idx) {
  let cd_idx = idx || 0;
  let card = G[d1].splice(cd_idx, 1)[0];
  G[d2].push(card);
  return card;
}

function payCost(G, ctx, cost) {
  if (G.costs >= cost) {
    G.costs -= cost
    return true;
  }

  else{
    return false;
  }
}

function gainMaterials(G, ctx, count) {
  let cnt = count || 1;

  for (let i=0; i<cnt; i++) {
    G.materials[ctx.random.Die(3)-1] += 1; //TODO: add this to log
  }
}

function payMaterials(G, ctx, requirements) {
  let delta = 0;
  for (let i=0; i<4; i++) {
    if (G.materials[i] < requirements[i]) {
      delta += requirements[i] - G.materials[i];
    }
  }

  if (G.materials[3] < delta) {
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

function deal_damage(G, ctx, deck, idx, dmg) {
  let card = G[deck][idx];

  //cards with no damage may not have the damage attr
  card.dmg = card.dmg || 0;
  card.dmg += dmg;

  if (card.dmg >= card.hp) {
    let discard = (deck == "field") ? "discard" : "ediscard";
    move(G, ctx, deck, discard, idx);
  }
}

function add_tags(G, ctx, tags) {
  for (let t of tags) {
    t.effect(G, ctx);
  }
}

function draw(G, ctx) {
  if (G.deck.length > 0) {
    move(G, ctx, "deck", "hand");
  } //TODO: else, lose the game
}

function play(G, ctx, idx) {
  let card = G.hand[idx]; //No need to verify at this stage

  if (payCost(G, ctx, card.cost)) {
    move(G, ctx, "hand", "field", idx);
    card.dmg = 0;
    card.exhausted = false;
    //TODO: if this is a spell instead of creature
    //TODO: onPlay
  }
}

function mine(G, ctx, idx) {
  let card = G.field[idx];

  if (use(G, ctx, card)) {
    gainMaterials(G, ctx, card.mine);
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
    G.finished.push(G.orders.splice(idx, 1)[0]);
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
  }
}

function fight(G, ctx, idx1, idx2) {
  let card = G.field[idx1];
  let enemy = G.efield[idx2];

  if (use(G, ctx, card)) {
    deal_damage(G, ctx, "efield", idx2, card.atk);
  }
}

function enemyMove(G, ctx, idx) {
  let enemy = G.efield[idx];

  if (use(G, ctx, enemy)) {
    let blocker = get_blocker(G, ctx, idx);
    let blocker_idx = G.field.indexOf(blocker);

    if (blocker) {
      deal_damage(G, ctx, "field", blocker_idx, enemy.atk);
    }

    else {
      G.danger += 1;
    }
  }
}

function refresh(G, ctx) {
  for (let card of [].concat(G.field, G.efield, G.finished)) {
      card.exhausted = false;
  }
}

export const AC = {
  setup(ctx) {
    const G = {};

    G.hand = [];
    G.field = [];

    G.deck = CARDS.map(x=>x);
    G.edeck = ENEMIES.map(x=>x);
    G.odeck = ORDERS.map(x=>x);
    //TODO: deck is set instead of defined
    // G.deck = [];
    // for (let c of CARDS) {
    //   G.deck.push(Object.assign({}, c));
    // }
    // No need to do this in first stage
    // On second stage, a function would turn the unique card list to an object, then copy based on the pool config


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

    G.messages = [];

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

    return G;
  },

  moves: {
    draw,
    play,
    mine,
    setValue,
    drawOrder,
    finishOrder,
    useOrder,
    drawEnemy,
    fight,
    enemyMove,
  },

  turn: {
    onBegin(G, ctx) {
      console.log("On turn begin");
      refresh(G, ctx);
      draw(G, ctx);
      G.cost += 3;
    },
  },

};

export { gainMaterials, payMaterials };