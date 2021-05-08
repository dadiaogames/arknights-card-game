import { gainMaterials, draw, deal_random_damage, reinforce_card, fully_restore, get_rhine_order, reinforce_hand, init_card_state, refresh_picks, summon } from './Game';
import { ready_order } from './orders';

export const UPGRADES = [
  {
    name: "+4/+0",
    desc: "+4攻击力", // Write "获得"always
    effect(card) {
      card.atk += 4;
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
    name: "+2/+4",
    desc: "+2/+4", // Write "获得"always
    effect(card) {
      card.atk += 2;
      card.hp += 4;
    }
  },

  {
    name: "<+2>",
    desc: "采掘力+2",
    effect(card) {
      card.mine += 2;
    }
  },

  {
    name: "-1费",
    desc: "部署费用-1", // Write "获得"always
    effect(card) {
      card.cost -= 1;
    }
  },

  {
    name: "阻挡数+2",
    desc: "阻挡数+2",
    effect(card) {
      card.block = card.block || 0;
      card.block += 2;
    }
  },

  {
    name: "起始",
    desc: "\"对局开始时，将这张牌置入手牌\"",
    effect(card) {
      card.is_init = true;
      if (typeof card.desc == "string") {
        card.desc += " (起始)";
      }
      else {
        card.desc = [card.desc, "(起始)"];
      }
    }
  },



  // Init "onplay bonus" before
  {
    name: "4分",
    desc: "部署奖励:\"获得4分\"",
    effect(card) {
      card.onPlayBonus.push({
        name: this.name,
        effect(G, ctx, card) {
          G.score += 4;
        }
      });
    }
  },

  // {
  //   name: "1分 刷新选牌",
  //   desc: "部署奖励:\"获得1分并刷新选牌区\"",
  //   effect(G, ctx, card) {
  //     card.onPlayBonus.push({
  //       name: this.name,
  //       effect(card) {
  //         G.score += 1;
  //         refresh_picks(G, ctx);
  //       }
  //     });
  //   }
  // },

  {
    name: "3材料",
    desc: "部署奖励:\"获得3个材料\"",
    effect(card) {
      card.onPlayBonus.push({
        name: this.name,
        effect(G, ctx, card) {
          gainMaterials(G, ctx, 3);
        }
      });
    }
  },

  // {
  //   name: "3张牌",
  //   desc: "部署奖励:\"摸3张牌\"",
  //   effect(card) {
  //     card.onPlayBonus.push({
  //       name: this.name,
  //       effect(G, ctx, card) {
  //         draw(G, ctx);
  //         draw(G, ctx);
  //         draw(G, ctx);
  //       }
  //     });
  //   }
  // },

  {
    name: "6伤害",
    desc: "部署奖励:\"造成6点伤害\"",
    effect(card) {
      card.onPlayBonus.push({
        name: this.name,
        effect(G, ctx, card) {
          deal_random_damage(G, ctx, 6);
        }
      });
    }
  },

  {
    name: "强化1",
    desc: "部署奖励:\"强化自己1次\"",
    effect(card) {
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
    effect(card) {
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
    desc: "部署奖励:\"获得2张2费干员牌并使其费用-1\"",
    effect(card) {
      // Maybe reconstruct this to call the skill of Ansel is better?
      card.onPlayBonus.push({
        name: this.name,
        effect(G, ctx, card) {
          for (let i=0; i<2; i++) {
            let new_card = ctx.random.Shuffle(G.CARDS.filter(x=>(x.cost==2)))[0];
            if (new_card) {
              // new_card = init_card_state(G, ctx, {...new_card});
              // new_card.hp = 1;
              // G.field.push(new_card);
              G.hand.unshift({...new_card, cost: 1});
            }
          }
        }
    });
  }
},

// {
//   name: "迷迭香之力",
//   desc: "部署奖励:\"召唤1个随机干员的2/2复制\"",
//   effect(card) {
//     card.onPlayBonus.push(
//       {
//         name: this.name,
//         effect (G, ctx, self) {
//         let card = ctx.random.Shuffle(G.CARDS)[0];
//         card = {...card};
//         card.atk = 2;
//         card.hp = 2;
//         card.mine = 1;
//         card.cost = 2;
//         summon(G, ctx, card, self);
//     }});
//   }
// },

// {
//     name: "凯尔希之力",
//     desc: "部署奖励:\"召唤1个自己的1/1复制\"",
//     effect(card) {
//       // Maybe reconstruct this to call the skill of Ansel is better?
//       card.onPlayBonus.push({
//         name: this.name,
//         effect(G, ctx, card) {
//           if (card) {
//             let new_card = G.CARDS.find(x => x.name == card.name);
//             new_card = init_card_state(G, ctx, {...new_card});
//             new_card.atk = 1;
//             new_card.hp = 1;
//             new_card.mine = 1;
//             new_card.cost = 1;
//             new_card.power = 0;
//             G.field.push(new_card);
//           }
//         }
//     });
//   }
// },

// {
//   name: "回响",
//   desc: "部署奖励:\"将1张自己的同名牌加入手牌，并使其费用-1\"",
//   effect(card) {
//     // Maybe reconstruct this to call the skill of Ansel is better?
//     card.onPlayBonus.push({
//       name: this.name,
//       effect(G, ctx, card) {
//         let name = card.name;
//         if (name.includes("异画")) {
//           name = name.slice(0, name.length-4);
//         }
//         let new_card = G.CARDS.find(x => x.name == name);
//         if (new_card) {
//           G.hand.unshift({...new_card, cost: new_card.cost-1});
//         }
//       }
//   });
// }
// },

  // {
  //   name: "完全治疗",
  //   desc: "部署奖励:\"完全治疗场上的1个干员\"",
  //   effect(G, ctx, card) {
  //     card.onPlayBonus.push({
  //       name: this.name,
  //       effect(card) {
  //         fully_restore(G, ctx);
  //       }
  //     });
  //   }
  // },

  // {
  //   name: "订单1",
  //   desc: "部署奖励:\"获得1个已完成的订单\"",
  //   effect(card) {
  //     card.onPlayBonus.push({
  //       name: this.name,
  //       effect(G, ctx, card) {
  //         G.finished.push({...ctx.random.Shuffle(G.odeck)[0]});
  //       }
  //     });
  //   }
  // },

  // {
  //   name: "化解",
  //   desc: "部署奖励:\"化解所有动乱值\"",
  //   effect(G, ctx, card) {
  //     card.onPlayBonus.push({
  //       name: this.name,
  //       effect(card) {
  //         G.danger = 0;
  //       }
  //     });
  //   }
  // },

  {
    name: "加倍",
    desc: "自己所有部署奖励的复制(最多500个)",
    effect(card) {
      if (card.onPlayBonus && (card.onPlayBonus.length <= 500)) {
        card.onPlayBonus = [...card.onPlayBonus, ...card.onPlayBonus];
      }
    }
  },
  
];