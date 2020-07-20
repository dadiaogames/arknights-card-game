import React from 'react';
import { gainMaterials, payMaterials } from './Game';
import { ICONS } from './icons';

export const order_illust = "https://ak.hypergryph.com/assets/index/images/ak/common/story/item_mortal_city.png";

export const rhine_illust = "http://ak.mooncell.wiki/images/4/4e/%E7%AB%8B%E7%BB%98_%E5%A1%9E%E9%9B%B7%E5%A8%85_1.png";

export const material_icons = [ICONS.alcohol, ICONS.rma, ICONS.rock, ICONS.d32];

export const ORDERS = [
  {
    requirements: [3,0,0,0],
    score: 2,
    reward: 1,
    desc: (<span>{material_icons[2]} → 2分</span>),
    effect(G, ctx) {
      if (payMaterials(G, ctx, [0,0,1,0])) {
        G.score += 2;
      }
    },
  },
  {
    requirements: [0,3,0,0],
    score: 2,
    reward: 2,
    desc: (<span>{material_icons[0]} → 2分</span>),
    effect(G, ctx) {
      if (payMaterials(G, ctx, [1,0,0,0])) {
        G.score += 2;
      }
    },

  },
  {
    requirements: [0,0,3,0],
    score: 2,
    reward: 0,
    desc: (<span>{material_icons[1]} → 2分</span>),
    effect(G, ctx) {
      if (payMaterials(G, ctx, [0,1,0,0])) {
        G.score += 2;
      }
    },
  },
  

  {
    requirements: [3,0,0,0],
    score: 2,
    reward: 1,
    desc: (<span>{material_icons[2]} → ? + ?</span>),
    effect(G, ctx) {
      if (payMaterials(G, ctx, [0,0,1,0])) { // TODO: reconstruct this, "if pay materials" should not be at here
        gainMaterials(G, ctx, 2);
      }
    },
  },
  {
    requirements: [0,3,0,0],
    score: 2,
    reward: 2,
    desc: (<span>{material_icons[0]} → ? + ?</span>),
    effect(G, ctx) {
      if (payMaterials(G, ctx, [1,0,0,0])) {
        gainMaterials(G, ctx, 2);
      }
    },

  },
  {
    requirements: [0,0,3,0],
    score: 2,
    reward: 0,
    desc: (<span>{material_icons[1]} → ? + ?</span>),
    effect(G, ctx) {
      if (payMaterials(G, ctx, [0,1,0,0])) {
        gainMaterials(G, ctx, 2);
      }
    },
  },

  {
    requirements: [3,0,0,0],
    score: 2,
    reward: 2,
    desc: (<span>{material_icons[1]}→{material_icons[3]}+1费</span>),
    effect(G, ctx) {
      if (payMaterials(G, ctx, [0,1,0,0])) {
        G.materials[3] += 1;
        G.costs += 1;
      }
    },
  },
  {
    requirements: [0,3,0,0],
    score: 2,
    reward: 0,
    desc: (<span>{material_icons[1]}→{material_icons[3]}+1费</span>),
    // desc: (<span>{material_icons[2]} → {material_icons[3]} </span>),
    effect(G, ctx) {
      if (payMaterials(G, ctx, [0,0,1,0])) {
        G.materials[3] += 1;
        G.costs += 1;
      }
    },

  },
  {
    requirements: [0,0,3,0],
    score: 2,
    reward: 1,
    desc: (<span>{material_icons[1]}→{material_icons[3]}+1费</span>),
    // desc: (<span>{material_icons[0]} → {material_icons[3]} </span>),
    effect(G, ctx) {
      if (payMaterials(G, ctx, [1,0,0,0])) {
        G.materials[3] += 1;
        G.costs += 1;
      }
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

];