import React from 'react';
import { gainMaterials, payMaterials, logMsg, refreshOrder, payCost } from './Game';
import { ICONS } from './icons';

export const order_illust = "https://ak.hypergryph.com/assets/index/images/ak/common/story/item_mortal_city.png";

export const rhine_illust = "http://ak.mooncell.wiki/images/4/4e/%E7%AB%8B%E7%BB%98_%E5%A1%9E%E9%9B%B7%E5%A8%85_1.png";

export const material_icons = [ICONS.alcohol, ICONS.rma, ICONS.rock, ICONS.d32];

function add_atk_hp(G, ctx, field_selected) {
  let card = G.field[field_selected];
  if (!card) {
    if (G.field.length == 0) return;
    card = G.field[G.field.length - 1]; // EH: change this to "last"
    logMsg(G, ctx, "建议: 请选定场面上想加成的干员后使用该订单");
  }
  card.atk += 2;
  card.hp += 2;
}

function deal3dmg(G, ctx, field_selected, enemy_selected) {
  let enemy = G.efield[enemy_selected];
  if (!enemy) {
    if (G.efield.length == 0) return;
    enemy = G.efield[G.efield.length - 1]; // EH: change this to "last"
    logMsg(G, ctx, "建议: 请选定目标敌人后使用该订单");
  }
  enemy.dmg += 3;
  logMsg(G, ctx, `${enemy.name} 受到3点伤害`);
}

function ready_order(G, ctx) {
  let order = ctx.random.Shuffle(G.finished.filter(x => x.exhausted))[0];
  if (order) {
    order.exhausted = false;
  }
}

export const default_order = {
  desc: "1费→刷新",
  effect(G, ctx){
    if (payCost(G, ctx, 1)) {
      refreshOrder(G, ctx);
    }
  }
}

export const ORDERS = [
  {
    requirements: [3,0,0,0],
    score: 2,
    reward: 1,
    desc: (<span>{material_icons[2]} → 2分</span>),
    cost: [0,0,1,0],
    effect(G, ctx) {
        G.score += 2;
    },
  },
  {
    requirements: [0,3,0,0],
    score: 2,
    reward: 2,
    desc: (<span>{material_icons[0]} → 2分</span>),
    cost: [1,0,0,0],
    effect(G, ctx) {
        G.score += 2;
    },

  },
  {
    requirements: [0,0,3,0],
    score: 2,
    reward: 0,
    desc: (<span>{material_icons[1]} → 2分</span>),
    cost: [0,1,0,0],
    effect(G, ctx) {
        G.score += 2;
    },
  },
  

  {
    requirements: [3,0,0,0],
    score: 2,
    reward: 1,
    desc: (<span>{material_icons[2]}→{material_icons[0]}{material_icons[1]}</span>),
    cost: [0,0,1,0],
    effect(G, ctx) {
      G.materials[0] += 1;
      G.materials[1] += 1;
    },
  },
  {
    requirements: [0,3,0,0],
    score: 2,
    reward: 2,
    desc: (<span>{material_icons[0]}→{material_icons[1]}{material_icons[2]}</span>),
    cost: [1,0,0,0],
    effect(G, ctx) {
      G.materials[1] += 1;
      G.materials[2] += 1;
    },

  },
  {
    requirements: [0,0,3,0],
    score: 2,
    reward: 0,
    desc: (<span>{material_icons[1]}→{material_icons[0]}{material_icons[2]}</span>),
    cost: [0,1,0,0],
    effect(G, ctx) {
      G.materials[0] += 1;
      G.materials[2] += 1;
    },
  },

  {
    requirements: [3,0,0,0],
    score: 2,
    reward: 2,
    desc: (<span>{material_icons[1]}→{material_icons[3]}+1费</span>),
    cost: [0,1,0,0],
    effect(G, ctx) {
        G.materials[3] += 1;
        G.costs += 1;
    },
  },
  {
    requirements: [0,3,0,0],
    score: 2,
    reward: 0,
    desc: (<span>{material_icons[2]}→{material_icons[3]}+1费</span>),
    // desc: (<span>{material_icons[2]} → {material_icons[3]} </span>),
    cost: [0,0,1,0],
    effect(G, ctx) {
        G.materials[3] += 1;
        G.costs += 1;
    },

  },
  {
    requirements: [0,0,3,0],
    score: 2,
    reward: 1,
    desc: (<span>{material_icons[0]}→{material_icons[3]}+1费</span>),
    // desc: (<span>{material_icons[0]} → {material_icons[3]} </span>),
    cost: [1,0,0,0],
    effect(G, ctx) {
        G.materials[3] += 1;
        G.costs += 1;
    },
  },

  {
    requirements: [3,0,0,0],
    score: 2,
    reward: 2,
    desc: (<span>获得: {material_icons[1]}</span>),
    harvest: true,
    effect(G, ctx) {
      G.materials[1] += 1;
    },
  },

  {
    requirements: [0,3,0,0],
    score: 2,
    reward: 0,
    desc: (<span>获得: {material_icons[2]}</span>),
    harvest: true,
    effect(G, ctx) {
      G.materials[2] += 1;
    },
  },

  {
    requirements: [0,0,3,0],
    score: 2,
    reward: 1,
    desc: (<span>获得: {material_icons[0]}</span>),
    harvest: true,
    effect(G, ctx) {
      G.materials[0] += 1;
    },
  },

  {
    requirements: [3,0,0,0],
    score: 2,
    reward: 1,
    desc: (<span>{material_icons[2]} → 2费</span>),
    cost: [0,0,1,0],
    effect(G, ctx) {
        G.costs += 2;
    },
  },
  {
    requirements: [0,3,0,0],
    score: 2,
    reward: 2,
    desc: (<span>{material_icons[0]} → 2费</span>),
    cost: [1,0,0,0],
    effect(G, ctx) {
        G.costs += 2;
    },

  },
  {
    requirements: [0,0,3,0],
    score: 2,
    reward: 0,
    desc: (<span>{material_icons[1]} → 2费</span>),
    cost: [0,1,0,0],
    effect(G, ctx) {
        G.costs += 2;
    },
  },
  

  {
    requirements: [1,1,1,0],
    score: 2,
    reward: 3,
    desc: (<span>+2/+2</span>),
    effect: add_atk_hp,
  },
  // {
  //   requirements: [0,3,0,0],
  //   score: 2,
  //   reward: 2,
  //   desc: (<span>{material_icons[0]}→+3/+3</span>),
  //   cost: [1,0,0,0],
  //   effect: add_atk_hp,
  // },
  // {
  //   requirements: [0,0,3,0],
  //   score: 2,
  //   reward: 0,
  //   desc: (<span>{material_icons[1]}→+3/+3</span>),
  //   cost: [0,1,0,0],
  //   effect: add_atk_hp,
  // },
  {
    requirements: [1,1,1,0],
    score: 2,
    reward: 3,
    desc: (<span>3伤害</span>),
    effect: deal3dmg,
  },
  // {
  //   requirements: [0,3,0,0],
  //   score: 2,
  //   reward: 2,
  //   desc: (<span>{material_icons[0]} → 4伤害</span>),
  //   cost: [1,0,0,0],
  //   effect: deal4dmg,
  // },
  // {
  //   requirements: [0,0,3,0],
  //   score: 2,
  //   reward: 0,
  //   desc: (<span>{material_icons[1]} → 4伤害</span>),
  //   cost: [0,1,0,0],
  //   effect: deal4dmg,
  // },
  

  {
    requirements: [3,0,0,0],
    score: 2,
    reward: 1,
    desc: (<span>重置1订单</span>),
    effect: ready_order,
  },
  {
    requirements: [0,3,0,0],
    score: 2,
    reward: 2,
    desc: (<span>重置1订单</span>),
    effect: ready_order,
  },
  {
    requirements: [0,0,3,0],
    score: 2,
    reward: 0,
    desc: (<span>重置1订单</span>),
    effect: ready_order,
  },

];