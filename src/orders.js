import { gainMaterials, payMaterials } from "./Game";

export var ORDERS = [
  {
    requirements: [3,0,0,0],
    reward: 1,
    effect(G, ctx) {
      if (payMaterials(G, ctx, [0,0,1,0])) {
        gainMaterials(G, ctx, 2);
      }
    },
  },
  {
    requirements: [0,3,0,0],
    reward: 2,
    effect(G, ctx) {
      if (payMaterials(G, ctx, [1,0,0,0])) {
        gainMaterials(G, ctx, 2);
      }
    },

  },
  {
    requirements: [0,0,3,0],
    reward: 0,
    effect(G, ctx) {
      if (payMaterials(G, ctx, [0,1,0,0])) {
        gainMaterials(G, ctx, 2);
      }
    },
  },

];