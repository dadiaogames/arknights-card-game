import React from 'react';
import { gainMaterials, payMaterials } from './Game';
import { ICONS } from './icons';

export var ORDERS = [
  {
    requirements: [3,0,0,0],
    score: 2,
    reward: 1,
    effect(G, ctx) {
      if (payMaterials(G, ctx, [0,0,1,0])) {
        gainMaterials(G, ctx, 2);
      }
    },
  },
  {
    requirements: [0,3,0,0],
    score: 2,
    reward: 2,
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
    effect(G, ctx) {
      if (payMaterials(G, ctx, [0,1,0,0])) {
        gainMaterials(G, ctx, 2);
      }
    },
  },

];