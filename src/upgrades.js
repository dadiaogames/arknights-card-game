import { gainMaterials, draw, deal_random_damage, reinforce_card, fully_restore, get_rhine_order, reinforce_hand, init_card_state } from './Game';

export const UPGRADES = [
  {
    name: "+2/+0",
    desc: "+2攻击力", // Write "获得"always
    effect(G, ctx, card) {
      card.atk += 2;
    }
  },
  // {
  //   name: "+0/+4",
  //   desc: "+4生命值", // Write "获得"always
  //   effect(G, ctx, card) {
  //     card.hp += 4;
  //   }
  // },
  {
    name: "+1/+3",
    desc: "+1/+3", // Write "获得"always
    effect(G, ctx, card) {
      card.atk += 1;
      card.hp += 3;
    }
  },
  {
    name: "-1费",
    desc: "部署费用-1", // Write "获得"always
    effect(G, ctx, card) {
      card.cost -= 1;
    }
  },

  // Init "onplay bonus" before
  {
    name: "3分",
    desc: "部署奖励:\"获得3分\"",
    effect(G, ctx, card) {
      card.onPlayBonus.push({
        name: this.name,
        effect(G, ctx, card) {
          G.score += 3;
        }
      });
    }
  },

  {
    name: "2材料",
    desc: "部署奖励:\"获得2个材料\"",
    effect(G, ctx, card) {
      card.onPlayBonus.push({
        name: this.name,
        effect(G, ctx, card) {
          gainMaterials(G, ctx, 2);
        }
      });
    }
  },

  {
    name: "2张牌",
    desc: "部署奖励:\"摸2张牌\"",
    effect(G, ctx, card) {
      card.onPlayBonus.push({
        name: this.name,
        effect(G, ctx, card) {
          draw(G, ctx);
          draw(G, ctx);
        }
      });
    }
  },

  {
    name: "3伤害",
    desc: "部署奖励:\"造成3点伤害\"",
    effect(G, ctx, card) {
      card.onPlayBonus.push({
        name: this.name,
        effect(G, ctx, card) {
          deal_random_damage(G, ctx, 3);
        }
      });
    }
  },

  {
    name: "强化1",
    desc: "部署奖励:\"强化自己1次\"",
    effect(G, ctx, card) {
      card.onPlayBonus.push({
        name: this.name,
        effect(G, ctx, card) {
          reinforce_card(G, ctx, card);
        }
      });
    }
  },

  {
    name: "手牌强化2",
    desc: "部署奖励:\"强化2张手牌\"",
    effect(G, ctx, card) {
      card.onPlayBonus.push({
        name: this.name,
        effect(G, ctx, card) {
          reinforce_hand(G, ctx);
          reinforce_hand(G, ctx);
        }
      });
    }
  },

  {
    name: "2费干员",
    desc: "部署奖励:\"部署1个费用为2的干员并使其生命值降为1\"",
    effect(G, ctx, card) {
      // Maybe reconstruct this to call the skill of Ansel is better?
      card.onPlayBonus.push({
        name: this.name,
        effect(G, ctx, card) {
          let new_card = ctx.random.Shuffle(G.CARDS.filter(x=>(x.cost==2)))[0];
          if (new_card) {
            new_card = init_card_state(G, ctx, {...new_card});
            new_card.hp = 1;
            G.field.push(new_card);
          }
        }
    });
  }
},

  // {
  //   name: "完全治疗",
  //   desc: "部署奖励:\"完全治疗场上的1个干员\"",
  //   effect(G, ctx, card) {
  //     card.onPlayBonus.push({
  //       name: this.name,
  //       effect(G, ctx, card) {
  //         fully_restore(G, ctx);
  //       }
  //     });
  //   }
  // },

  {
    name: "订单1",
    desc: "部署奖励:\"获得1个已完成的订单\"",
    effect(G, ctx, card) {
      card.onPlayBonus.push({
        name: this.name,
        effect(G, ctx, card) {
          get_rhine_order(G, ctx);
        }
      });
    }
  },

  {
    name: "化解",
    desc: "部署奖励:\"化解所有动乱值\"",
    effect(G, ctx, card) {
      card.onPlayBonus.push({
        name: this.name,
        effect(G, ctx, card) {
          G.danger = 0;
        }
      });
    }
  },

  {
    name: "加倍",
    desc: "自己所有部署奖励的复制",
    effect(G, ctx, card) {
      card.onPlayBonus = [...card.onPlayBonus, ...card.onPlayBonus];
    }
  },
  
];