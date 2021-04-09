import React from 'react';
import { 
  deal_damage, draw, deal_random_damage, gainMaterials,
  move, exhaust_random_enemy, ready_random_card, cure, 
  payCost, get_rhine_order, init_card_state, payMaterials,
  reinforce_hand, reinforce_card, enemy2card, logMsg,
  get_num_rest_cards, generate_combined_card, achieve, drop,
  clearField, drawEnemy, fully_restore, reduce_enemy_atk, silent, summon, eliminate_field, reinforce_field, choice, add_vulnerable, play_card, exhaust_order, get_blocker,
} from './Game';
import { classes } from './DeckGenerator';
import { material_icons, ready_order } from './orders';
import { food_icons } from './icons';

export function init_card(card) {
  return {
    name: "card",
    block: 0,
    dmg: 0,
    power: 0,
    // material: rng.randRange(3),

    onPlayBonus: [],

    ...card,
  };
}


export const CARDS = [
  {
    name: "克洛丝",
    cost: 1,
    atk: 3,
    hp: 1,
    mine: 1,
    block: 0,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_0.png",
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 3;
      self.hp += 1;
    },
    reinforce_desc: "+3/+1",
  },

  {
    name: "阿米娅",
    cost: 3,
    atk: 4,
    hp: 2,
    mine: 3,
    block: 0,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_1.png",
    desc: "采掘: 获得1分",
    onMine(G, ctx, self) {
      let delta = 1 + self.power;
      G.score += delta;
      logMsg(G, ctx, `使用 阿米娅 获得${delta}分`);

      if (delta >= 30) {
        achieve(G, ctx, "女主角", "使用阿米娅获得30分以上", self);
      }
    },
    action(G, ctx, self) {
      if (self.power == 1) {
        let queen = G.CARDS.find(x => x.name == "阿米娅-近卫");
        Object.assign(self, queen);
        self.onPlay(G, ctx, self);
      }
      else {
        logMsg(G, ctx, "只需要强化1次即可");
      }
      self.exhausted = false;
    },
    reinforce: 2,
    reinforce_desc: "再获得1分",
  },

  {
    name: "杰西卡",
    cost: 3,
    atk: 5,
    hp: 2,
    mine: 2,
    block: 0,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_2.png",
    desc: "采掘: 造成3点伤害",
    onMine(G, ctx, self) {
      deal_random_damage(G, ctx, 3 + 3 * self.power);
    },
    reinforce: 1,
    reinforce_desc: "伤害+3",
  },

  {
    name: "玫兰莎",
    cost: 2,
    atk: 4,
    hp: 4,
    mine: 1,
    block: 1,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_3.png",
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
    reinforce_desc: "+2/+2",
  },
  
  // {
  //   name:"芙兰卡", 
  //   cost:4, 
  //   atk:6, 
  //   hp:6, 
  //   mine:3, 
  //   block:1, 
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_4.png",
  //   reinforce: 2,
  //   onReinforce(G, ctx, self) {
  //     self.atk += 6;
  //     self.hp += 6;
  //   },
  //   reinforce_desc: "+6/+6",
  // },

  {
    name: "米格鲁",
    cost: 2,
    atk: 0,
    hp: 6,
    mine: 1,
    block: 2,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_5.png",
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.hp += 6;
    },
    reinforce_desc: "+0/+6",
  },

  {
    name: "史都华德",
    cost: 2,
    atk: 2,
    hp: 2,
    mine: 3,
    block: 0,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_6.png",
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.mine += 1;
    },
    reinforce_desc: "<+1>",
  },

  // {
  //   name: "12F",
  //   cost: 5,
  //   atk: 6,
  //   hp: 4,
  //   mine: 5,
  //   block: 0,
  //   illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_7.png",
  //   reinforce: 2,
  //   onReinforce(G, ctx, self) {
  //     self.mine += 1;
  //   },
  //   reinforce_desc: "<+1>",
  // },
  
  {
    name: "巡林者",
    cost: 5,
    atk: 10,
    hp: 4,
    mine: 3,
    block: 0,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_8.png",
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.atk += 5;
      self.hp += 2;
    },
    reinforce_desc: "+5/+2",
  },

  {
    name: "黑角",
    cost: 8,
    atk: 8,
    hp: 8,
    mine: 4,
    block: 2,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_9.png",
    reinforce: 2,
    action(G, ctx, self) {
      let white = G.CARDS.find(x => x.name == "白面鸮");
      Object.assign(self, white);
      self.exhausted = false;
    },
    onReinforce(G, ctx, self) {
      self.atk += 8;
      self.hp += 8;
    },
    reinforce_desc: "+8/+8",
  },
  
  {
    name:"夜刀",
    cost:12,
    atk:16,
    hp:16,
    mine:8,
    block:2,
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_10.png",
    reinforce: 1,
    
    onReinforce(G, ctx, self) {
      self.atk += 4;
      self.hp += 4;

      if (self.atk >= 50) {
        achieve(G, ctx, "罗德岛的基石", "夜刀的攻击力达到50", self);
      }
    },
    reinforce_desc: "+4/+4",
  },

  {
    name: "芬",
    cost: 2,
    atk: 2,
    hp: 2,
    mine: 1,
    block: 1,
    desc: "部署: 摸2张牌",
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_11.png",
    onPlay(G, ctx, self) {
      draw(G, ctx);
      draw(G, ctx);
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      draw(G, ctx);
    },
    reinforce_desc: "摸1张牌",
  },

  
  // 超模就超模吧 桃金娘这么可爱 就不削了 按照模型 应该削到3费或者改成2/1 其实也没有 2费如果是4/2的话 桃金娘也没问题
  {
    name: "桃金娘",
    cost: 2,
    atk: 2,
    hp: 2,
    mine: 1,
    block: 1,
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_12.png",
    desc: "行动: 获得3点费用，本回合阻挡数-1",
    // onTurnBegin(G, ctx, self) {
    //   if (self.block <= 0) {
    //     self.block = 1;
    //   }
    // },
    action(G, ctx, self) {
      G.costs += 3 + 2 * self.power;
      if (self.block > 0) {
        self.block -= 1;
        self.onTurnBegin = (G, ctx, self) => {
          self.block += 1;
          self.onTurnBegin = undefined;
        };
      }
    },
    reinforce: 2,
    reinforce_desc: "再获得2点费用",
  },

  {
    name:"香草", 
    cost:3, 
    atk:4, 
    hp:3, 
    mine:1, 
    block:1, 
    desc:"战斗: 获得2点费用", 
    illust:"https://dadiaogames.gitee.io/images/imagebed/vanilla.png",
    onFight(G, ctx, self) {
      G.costs += 2 + 1 * self.power;
    },
    reinforce: 1,
    reinforce_desc: "再获得1点费用",
  },

  {
    name:"讯使", 
    cost:3, 
    atk:2, 
    hp:3, 
    mine:2, 
    block:1, 
    desc:"采掘: 获得2点费用", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_13.png",
    onMine(G, ctx, self) {
      G.costs += 2 + 1 * self.power;
    },
    reinforce: 1,
    reinforce_desc: "再获得1点费用",
  },
  
  {
    name:"极境",
    cost:5,
    atk:2,
    hp:1,
    mine:1,
    block:1,
    desc: "部署: 获得7点费用",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_14.png",
    reinforce: 2,

    onPlay(G, ctx) {
      G.costs += 7;
    },
    
    onReinforce(G, ctx, self) {
      G.costs += 2;
    },
    reinforce_desc: "获得2点费用",
  },

  {
    name:"清道夫", 
    cost:3, 
    atk:5, 
    hp:2, 
    mine:1, 
    block:1, 
    desc:"采掘: 摧毁场上1个(重置的)干员，并获得3点费用", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_15.png",
    onMine(G, ctx, self) {
      if (eliminate_field(G, ctx, self)) {
        G.costs += 3;
      }
    },
    reinforce: 1,
    reinforce_desc: "+2/+2",
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    }
  },
  
  {
    name:"德克萨斯", 
    cost:3, 
    atk:4, 
    hp:2, 
    mine:1, 
    block:1, 
    desc:"采掘: 横置1个敌人，然后每有1个横置的敌人，就获得1点费用", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_16.png",
    onMine(G, ctx, self) {
      exhaust_random_enemy(G, ctx);
      let num_exhausted = G.efield.filter(x=>x.exhausted).length;
      G.costs += num_exhausted;
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.atk += 5;
      self.hp += 5;
    },
    reinforce_desc: "+5/+5",
  },
  {
    name:"红豆",
    cost:4,
    atk:6,
    hp:4,
    mine:1,
    block:1,
    desc: "超杀: 每造成2点额外伤害，就获得1点费用",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_17.png",
    reinforce: 1,
    onFight(G, ctx, self, enemy) {
      if (enemy.dmg > enemy.hp) {
        let delta = (enemy.dmg - enemy.hp) / 2;
        G.costs += delta;
        logMsg(G, ctx, `使用 ${self.name} 获得${delta}点费用`);

        if (delta >= 10) {
          achieve(G, ctx, "常山豆子龙", "使用红豆获得至少10点费用", self);
        }
      }
    },
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
    reinforce_desc: "+2/+2",
  },
  
  {
    name:"风笛", 
    cost:3, 
    atk:4, 
    hp:2, 
    mine:1, 
    block:1, 
    desc:"行动: 打出牌库顶的1张牌", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_18.png",
    action(G, ctx, self) {
      // if (G.limit_hand_field && G.field.length >= 6) {
      //   logMsg(G, ctx, "场上干员数已达到上限");
      //   return;
      // }
      let new_card = G.deck[0];
      G.deck = G.deck.slice(1);
      let idx = G.field.indexOf(self) + 1;
      if (new_card) {
        G.field.splice(idx, 0, init_card_state(G, ctx, {...new_card}));
        // insert_field(G, ctx, new_card, idx);
        logMsg(G, ctx, `打出 ${new_card.name}`);
      }
      if (new_card.name == "夜刀") {
        achieve(G, ctx, "特殊召唤", "使用风笛跳出夜刀", self);
      }
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
    reinforce_desc: "+2/+2",
  },
  
  // {
  //   name:"红豆", 
  //   cost:3, 
  //   atk:3, 
  //   hp:2, 
  //   mine:1, 
  //   block:1, 
  //   desc:"摧毁: 将手牌中的1个干员部署到场上", 
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_17.png",
  //   onOut(G, ctx, self) {
  //     if (G.hand.length > 0) {
  //       let idx = ctx.random.Die(G.hand.length) - 1;
  //       let card = G.hand.splice(idx, 1)[0];
  //       G.field.push(card);
  //       init_card_state(G, ctx, card);
  //     }
  //     G.costs += 3 * self.power;
  //   },
  //   reinforce: 1,
  //   reinforce_desc: "并返还3点费用",
  // },
  
  {
    name:"推进之王", 
    cost:3, 
    atk:4, 
    hp:2, 
    mine:1, 
    block:1, 
    desc:"部署: 所有手牌的费用-1", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_20.png",
    onPlay(G, ctx, self) {
      for (let card of G.hand) {
        card.cost -= 1;
      }
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      if (self.onPlay) {
        self.onPlay(G, ctx);
      }
      if (self.power >= 5) {
        achieve(G, ctx, "推进之王", "强化推进之王5次", self);
      }
    },
    reinforce_desc: "触发1次\"部署:\"效果",
  },

  {
    name: "炎熔",
    cost: 3,
    atk: 4,
    hp: 2,
    mine: 3,
    block: 0,
    desc: "战斗: 获得1个材料",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_21.png",
    onFight(G, ctx, self) {
      gainMaterials(G, ctx, 1+self.power);
    },
    reinforce: 2,
    reinforce_desc: "再获得1个材料",
  },

   
  {
    name:"蓝毒", 
    cost:4, 
    atk:6, 
    hp:3, 
    mine:2, 
    block:0, 
    desc:"战斗: 再造成3点伤害", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_22.png",
    onFight(G, ctx, self) {
      deal_random_damage(G, ctx, 3 + 4 * self.power);
    },
    reinforce: 1,
    reinforce_desc: "伤害+4",
  },
  
  {
    name:"杜宾", 
    cost:5, 
    atk:2, 
    hp:1, 
    mine:1, 
    block:1, 
    desc:"部署: 场上所有其他干员获得+2/+2", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_23.png",
    onPlay(G, ctx, self) {
      for (let card of G.field) {
        if (card != self) {
          card.atk += 2;
          card.hp += 2;
        }
      }
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
    reinforce_desc: "+2/+2",
  }, 
  
  // {
  //   name:"杜林", 
  //   cost:3, 
  //   atk:2, 
  //   hp:1, 
  //   mine:2, 
  //   block:0, 
  //   desc:"部署: 场上所有其他干员获得<+1>", 
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_138.png",
  //   onPlay(G, ctx, self) {
  //     for (let card of G.field) {
  //       if (card != self) {
  //         card.mine += 1;
  //       }
  //     }
  //   },
  //   reinforce: 2,
  //   onReinforce(G, ctx, self) {
  //     self.mine += 1;
  //   },
  //   reinforce_desc: "<+1>",
  // },

  
  {
    name:"陈", 
    cost:5, 
    atk:4, 
    hp:4, 
    mine:2, 
    block:1, 
    desc:"部署: 造成4点伤害，重复2次", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_25.png",
    onPlay(G, ctx, self) {
      deal_random_damage(G, ctx, 4);
      deal_random_damage(G, ctx, 4);
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      if (self.onPlay) {
        self.onPlay(G, ctx);
      }

      if (~G.hand.indexOf(self) && (self.power >= 15)) {
        achieve(G, ctx, "赤霄·绝影", "陈在手牌中被强化过至少15次", self);
      }
    },
    reinforce_desc: "触发1次\"部署:\"效果",
  },

  {
    name:"柏喙",
    cost:4,
    atk:5,
    hp:4,
    mine:2,
    block:1,
    desc: "采掘: 获得+3/+3",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_26.png",
    reinforce: 1,
    onMine(G, ctx, self) {
      self.atk += 3;
      self.hp += 3;
    },
    reinforce_desc: "+2/+2",
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
  },

  {
    name:"慕斯", 
    cost:3, 
    atk:2, 
    hp:4, 
    mine:3, 
    block:1, 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_27.png",
    reinforce: 1,
    desc: "战斗: 使目标攻击力-6",
    onFight(G, ctx, self, enemy) {
      enemy.atk -= 6;
    },
    onReinforce(G, ctx, self) {
      self.atk += 3;
      self.hp += 3;
    },
    reinforce_desc: "+3/+3",
  },
  
  {
    name:"星极", 
    cost:4, 
    atk:6, 
    hp:3, 
    mine:2, 
    block:0, 
    desc: <span>采掘: 弃2张牌，获得2个{material_icons[3]}</span>, 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_28.png",
    onMine(G, ctx, self) {
      if (G.hand.length >= 2) {
        drop(G, ctx);
        drop(G, ctx);
        G.materials[3] += 2;
      }
      else {
        logMsg(G, ctx, "手牌不够");
        // self.exhausted = false;
      }
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
      self.mine += 1;
    },
    reinforce_desc: "+2/+2 <+1>",
  },
  
  {
    name:"蛇屠箱", 
    cost:3, 
    atk:2, 
    hp:6, 
    mine:2, 
    block:2, 
    desc:"行动: 获得+6生命值，本回合阻挡数+1", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_29.png",
    action(G, ctx, self) {
      self.hp += 6 + 4 * self.power;
      self.block += 1;
      self.onTurnBegin = (G, ctx, self) => {
        self.block -= 1;
        self.onTurnBegin = undefined;
      }
    },
    reinforce: 1,
    reinforce_desc: "再获得+4生命值",
  },

// {
//     name:"斑点", 
//     cost:4, 
//     atk:2, 
//     hp:12, 
//     mine:2, 
//     block:2, 
//     desc:"行动: 完全治疗自己", 
//     illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_62.png",
//     action(G, ctx, self) {
//       // let self_idx = G.field.indexOf(self);
//       // G.field.map((card, idx) => {
//       //   if ([self_idx-1, self_idx, self_idx+1].includes(idx)) {
//       //     card.hp += 4;
//       //   }
//       // });
//       self.dmg = 0;
//     },
//     reinforce: 1,
//     reinforce_desc: "+0/+6",
//     onReinforce(G, ctx, self) {
//       self.hp += 6;
//     }
//   },

  {
    name:"星熊", 
    cost:3, 
    atk:2, 
    hp:8, 
    mine:1, 
    block:2, 
    desc:"行动: 消耗1点费用，对阻挡的所有敌人造成2点伤害，然后重置自己", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_119.png",
    action(G, ctx, self) {
      if (payCost(G, ctx, 1, true)) {
        // self.atk += 2;
        // self.hp += 2;
        // self.block += 1;
        for (let enemy of G.efield) {
          if (get_blocker(G, ctx, enemy) == self) {
            enemy.dmg += 2;
          }
        }
      }
      self.exhausted = false;
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.block += 1;
    },
    reinforce_desc: "阻挡数+1",
  },
  


  {
    name:"年", 
    cost:5, 
    atk:3, 
    hp:9, 
    mine:2, 
    block:2, 
    desc:"部署: 场上所有其他干员阻挡数+1", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_32.png",
    onPlay(G, ctx, self) {
      for (let card of G.field) {
        if (card != self) {
          card.block += 1;
        }
      }
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.block += 1;
    },
    reinforce_desc: "阻挡数+1",
  },
  
  {
    name:"可颂", 
    cost:3, 
    atk:2, 
    hp:6, 
    mine:1, 
    block:2, 
    desc:"战斗: 横置目标，如果目标已经被横置，则将其摧毁", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_33.png",
    onFight(G, ctx, self, enemy) {
      if (enemy.exhausted) {
        enemy.dmg += enemy.hp;
      }
      else {
        enemy.exhausted = true;
      }
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.hp += 10;
    },
    reinforce_desc: "+0/+10",
  },

    
  {
    name:"雷蛇", 
    cost:6, 
    atk:2, 
    hp:12, 
    mine:1, 
    block:2, 
    desc:"采掘/战斗: 重置1个干员", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_34.png",
    onMine(G, ctx, self) {
      ready_random_card(G, ctx, self);
    },
    onFight(G, ctx, self) {
      ready_random_card(G, ctx, self);
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.hp += 10;
    },
    reinforce_desc: "+0/+10",
  },
  
  {
    name:"芙蓉", 
    cost:2, 
    atk:0, 
    hp:2, 
    mine:1, 
    block:0, 
    desc:"采掘: 使场上1个(重置的)干员获得+2/+2", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_35.png",
    // onPlay(G, ctx, self) {
    //   fully_restore(G, ctx);
    // },
    onMine(G, ctx, self) {
      let card = choice(ctx, G.field.filter(x => x!=self).filter(x => !x.exhausted));
      if (card) {
        card.atk += 2 + self.power;
        card.hp += 2 + self.power;
      }

    },
    reinforce: 1,
    // onReinforce(G, ctx, self) {
    //   cure(G, ctx, 6);
    // },
    reinforce_desc: "再获得+1/+1",
  },

  {
    name:"安赛尔", 
    cost:2,
    atk:0, 
    hp:2, 
    mine:2, 
    block:0, 
    desc:"行动: 召唤1个2费干员", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_36.png",
    action(G, ctx, self) {
      let new_card = ctx.random.Shuffle(G.CARDS.filter(x=>(x.cost==(2+(self.power||0)))))[0];
      let idx = G.field.indexOf(self) + 1;
      if (new_card) {
        // G.field.splice(idx, 0, init_card_state(G, ctx, {...new_card}));
        // insert_field(G, ctx, new_card, idx);
        summon(G, ctx, new_card, self);
      }
    },
    reinforce: 2,
    reinforce_desc: "召唤的干员费用+1",
  },
  
  {
    name:"末药", 
    cost:2,
    atk:2, 
    hp:1, 
    mine:1, 
    block:1, 
    desc:"部署: 使1个(重置的)干员获得+3/+3", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_37.png",
    onPlay(G, ctx, self) {
      // let card = ctx.random.Shuffle(G.field.filter(x=>(x!=self)))[0];
      let card = choice(ctx, G.field.filter(x => x!=self).filter(x => !x.exhausted));
      if (card) {
        card.atk += 3;
        card.hp += 3;
      }
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      cure(G, ctx, 6);
    },
    reinforce_desc: "治疗1个干员的6点伤害",

  },
  
  // {
  //   name:"Lancet-2", 
  //   cost:3,
  //   atk:0, 
  //   hp:2, 
  //   mine:1, 
  //   block:0, 
  //   desc:"部署: 本回合下一次部署干员时，会额外部署1次", 
  //   was_enemy: true,
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_37.png",
  //   onPlay(G, ctx, self) {
  //     let play_again = () => {
  //       let played = false;
  //       return (G, ctx, card_played, card) => {
  //         if (!played) {
  //           play_card(G, ctx, card);
  //           played = true;
  //         }
  //       }};
  //     G.onPlayCard.push(
  //       play_again(),
  //     );
  //   },
  //   reinforce: 1,
  //   onReinforce(G, ctx, self) {
  //     cure(G, ctx, 6);
  //   },
  //   reinforce_desc: "治疗1个干员的6点伤害",
  // },
  
  // {
  //   name:"清流", 
  //   cost:3, 
  //   atk:0, 
  //   hp:3, 
  //   mine:3, 
  //   block:0, 
  //   desc:"行动: 使1个干员获得+9生命值", 
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_103.png",
  //   action(G, ctx, self) {
  //     cure(G, ctx, 9);
  //   },
  //   reinforce: 1,
  //   onReinforce(G, ctx, self) {
  //     cure(G, ctx, 5);
  //   },
  //   reinforce_desc: "使1个干员获得+5生命值",
  // },

  // {
  //   name:"嘉维尔", 
  //   cost:3, 
  //   atk:0, 
  //   hp:3, 
  //   mine:3, 
  //   block:0, 
  //   desc:"行动: 使1个干员获得+3攻击力", 
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_79.png",
  //   action(G, ctx, self) {
  //     let field = G.field.filter(x => (x != self));
  //     let card = ctx.random.Shuffle(field)[0];
  //     if (card) {
  //       card.atk += 3 + 3 * self.power;
  //     }
  //   },
  //   reinforce: 1,
  //   reinforce_desc: "攻击力加成+3",
  // },

  // {
  //   name:"闪灵",
  //   cost:3,
  //   atk:4,
  //   hp:3,
  //   mine:2,
  //   block:0,
  //   desc: "行动: 完全治疗1个干员，如果治疗了至少4点伤害，则获得2分",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_41.png",
  //   reinforce: 2,
  //   action(G, ctx, self) {
  //     let cured = fully_restore(G, ctx);
  //     if (cured >= 4) {
  //       G.score += 2 + 2 * self.power;
  //     }
  //   },
  //   reinforce_desc: "再获得2分",
  // },

  {
    name:"空", 
    cost:4, 
    atk:0, 
    hp:3, 
    mine:3, 
    block:0, 
    desc:"行动: 横置2个敌人", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_42.png",
    action(G, ctx, self) {
      exhaust_random_enemy(G, ctx);
      exhaust_random_enemy(G, ctx);
    },
    onReinforce(G, ctx, self) {
      self.exhausted = false;
    },
    reinforce: 3,
    reinforce_desc: "重置自己",
  },

  // {
  //   name:"莫斯提马",
  //   cost:4,
  //   atk:6,
  //   hp:3,
  //   mine:2,
  //   block:0,
  //   desc:"采掘/战斗: 每有1个被横置的敌人，就获得1个材料",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_43.png",
  //   onMine(G, ctx, self) {
  //     let num_exhausted = G.efield.filter(x=>x.exhausted).length;
  //     gainMaterials(G, ctx, num_exhausted);

  //   },
  //   onFight(G, ctx, self) {
  //     this.onMine(G, ctx, self);
  //   },
  //   reinforce: 1,
  //   onReinforce(G, ctx, self) {
  //     self.atk += 2;
  //     self.hp += 1;
  //     self.mine += 1;
  //   },
  //   reinforce_desc: "+2/+1 <+1>",
  // },
  
  {
    name:"大帝",
    cost:2,
    atk:2,
    hp:2,
    mine:1,
    block:1,
    desc:"部署: 每有1个被横置的敌人，就获得1分",
    illust:"https://s1.ax1x.com/2020/08/10/abktzR.png",
    onPlay(G, ctx, self) {
      let num_exhausted = G.efield.filter(x=>x.exhausted).length;
      G.score += num_exhausted;
      if (num_exhausted >= 10) {
        achieve(G, ctx, "企鹅物流", "场上有至少10个敌人被横置时部署大帝", self);
      }
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 3;
      self.hp += 3;
    },
    reinforce_desc: "+3/+3",
  },

  
  {
    name:"阿消", 
    cost:3, 
    atk:4, 
    hp:3, 
    mine:2, 
    block:1, 
    desc:"行动: 消耗3点费用，获得6分", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_44.png",
    action(G, ctx, self) {
      if (payCost(G, ctx, 3 + self.power, true)) {
        let delta = 6 + 2 * self.power;
        G.score += delta;

        if (delta >= 40) {
          achieve(G, ctx, "龙门消防局", "使用阿消获得至少40分", self);
        }
      }
    },
    reinforce: 1,
    reinforce_desc: "消耗费用+1，得分+2",
  },
  
  {
    name:"铃兰", 
    cost:3, 
    atk:2, 
    hp:2, 
    mine:2, 
    block:0, 
    desc:"行动: 本回合剩余时间内，每部署1个干员，就获得2分", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_45.png",
    action(G, ctx) {
      G.onPlayCard.push(
        (G, ctx) => {
          G.score += 2;
        }
      );
    },
    onReinforce(G, ctx, self) {
      this.action(G, ctx);
    },
    reinforce: 3,
    reinforce_desc: "触发1次\"行动:\"效果",
  },

  {
    name:"赫默",
    cost:3,
    atk:4,
    hp:3,
    mine:1,
    block:0,
    desc:"采掘: 重置2个订单",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_46.png",
    onMine(G, ctx, self) {
      ready_order(G, ctx, true);
      ready_order(G, ctx, true);
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      cure(G, ctx, 6);
    },
    reinforce_desc: "治疗1个干员的6点伤害",
  },
  
  {
    name:"白面鸮",
    cost:4,
    atk:0,
    hp:3,
    mine:2,
    block:0,
    desc:"行动: 重置1个干员，重置1个订单",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_143.png",
    action(G, ctx, self) {
      ready_random_card(G, ctx, self);
      ready_order(G, ctx);
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      G.costs += 2;
    },
    reinforce_desc: "获得2点费用",
  },

  {
    name:"伊芙利特",
    cost:4,
    atk:4,
    hp:3,
    mine:4,
    block:0,
    desc: "行动: 摧毁3个颜色相同的(重置的)订单，获得12分",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_48.png",
    action(G, ctx, self) {
      for (let i=0; i<3; i++) {
        let colored_orders = G.finished.filter(x => (!x.exhausted) && (x.color == i));
        if (colored_orders.length >= 3) {
          G.finished = G.finished.filter(x => !colored_orders.includes(x));
          G.score += 12;
          logMsg(G, ctx, "获得12分");
          return;
        }
      }
      self.exhausted = false;
      logMsg(G, ctx, "没有3个同色的订单");
    },
    reinforce: 2,
    reinforce_desc: "获得2分",
    onReinforce(G, ctx, self){
      G.score += 2;
    },
  },

  {
    name:"塞雷娅",
    cost:4,
    atk:4,
    hp:9,
    mine:2,
    block:2,
    desc: "行动: 本回合剩余时间内，使用其他干员战斗时，重置1个订单",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_49.png",
    action(G, ctx, self) {
      G.onCardFight.push(
        (G, ctx) => {
          ready_order(G, ctx, true);
        }
      );
    },
    reinforce: 1,
    reinforce_desc: "使1个敌人获得易伤1",
    onReinforce(G, ctx, self){
      add_vulnerable(G, ctx, 1);
    },
  },
{
    name:"凯尔希",
    cost:2,
    atk:2,
    hp:2,
    mine:2,
    block:0,
    desc: "采掘: 横置1个订单，并触发其能力2次",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_50.png",
    onMine(G, ctx, self) {
      let order = exhaust_order(G, ctx);
      if (order) {
        for (let i=0; i<(2+self.power); i++) {
          if ((order.cost == undefined) || payMaterials(G, ctx, order.cost, true)) {
            order.effect(G, ctx);
          }
        }
      }
      else {
        logMsg(G, ctx, "没有可横置的订单");
      }
    },
    reinforce: 2,
    reinforce_desc: "再触发1次",
  },
{
    name:"松果",
    cost:2,
    atk:2,
    hp:1,
    mine:1,
    block:0,
    desc: "部署: 横置2个订单，摧毁1个敌人，如果2个订单颜色相同，则再摧毁1个",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_51.png",
    onPlay(G, ctx, self) {
      let order1 = exhaust_order(G, ctx);
      let order2 = exhaust_order(G, ctx);
      if (order1 != undefined && order2 != undefined) {
        let times = (order1.color == order2.color)? 2 : 1;
        for (let i=0; i<times; i++) {
          let enemy = choice(ctx, G.efield.filter(x => x.hp > x.dmg));
          enemy.dmg += enemy.hp;
        }
      }
      else {
        logMsg(G, ctx, "没有足够的订单");
      }
    },
    reinforce: 1,
    reinforce_desc: "造成4点伤害",
    onReinforce(G, ctx, self){
      deal_random_damage(G, ctx, 4);
    },
  },
  // {
  //   name:"白金",
  //   cost:3,
  //   atk:5,
  //   hp:2,
  //   mine:2,
  //   block:0,
  //   desc: "超杀: 横置1个订单，重置1个干员",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_52.png",
  //   reinforce: 1,
  //   reinforce_desc: "+2/+1",
  //   onFight(G, ctx, self, enemy) {
  //     if (enemy.dmg > enemy.hp && exhaust_order(G, ctx)) {
  //       ready_random_card(G, ctx, self);
  //     }
  //   },
  //   onReinforce(G, ctx, self){
  //     self.atk += 2;
  //     self.hp += 1;
  //   },
  // },
// {
//     name:"豆苗",
//     cost:2,
//     atk:3,
//     hp:2,
//     mine:1,
//     block:0,
//     desc: <span>采掘: 横置1个订单，如果该订单是<br/>{food_icons[0]}: 获得3点费用<br/>{food_icons[1]}: 摸2张牌，并使该牌费用-1<br/>{food_icons[2]}: 召唤手牌中1个干员的4/4复制</span>,
//     illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_53.png",
//     onMine(G, ctx, self) {
//       let order = exhaust_order(G, ctx);
//       if (order) {
//         if (order.color == 0) {
//           G.costs += 3;
//         }
//         else if (order.color == 1) {
//           draw(G, ctx);
//           draw(G, ctx);
//           G.hand[0].cost -= 1;
//           G.hand[1].cost -= 1;
//         }
//         else {
//           let card = choice(ctx, G.hand);
//           if (card) {
//             summon(G, ctx, {
//               ...card,
//               atk: 4,
//               hp: 4,
//               mine: 2,
//               cost: 3,
//             }, self);
//           }
//       }
//       }
//     },
//     reinforce: 1,
//     reinforce_desc: "获得1点费用",
//     onReinforce(G, ctx, self){
//       G.costs += 1;
//     },
//   },
{
    name:"夜莺",
    cost:2,
    atk:0,
    hp:2,
    mine:2,
    block:0,
    desc: <span>行动: 横置1个订单，如果该订单是<br/>{food_icons[0]}: 重置1个干员<br/>{food_icons[1]}: 横置2个敌人<br/>{food_icons[2]}: 触发场上1个干员的"部署:"效果(极境除外)</span>,
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_100.png",
    action(G, ctx, self) {
      let order = exhaust_order(G, ctx);
      if (order) {
        if (order.color == 0) {
          ready_random_card(G, ctx, self);
        }
        else if (order.color == 1) {
          exhaust_random_enemy(G, ctx);
          exhaust_random_enemy(G, ctx);
        }
        else {
          let card = choice(ctx, G.field.filter(x => x.onPlay && x.name != "极境"));
          if (card) {
            card.onPlay(G, ctx, card);
            logMsg(G, ctx, `触发 ${card.name} 的部署效果`);
          }
          else {
            logMsg(G, ctx, "没有合适的干员触发");
          }
        }
      }
    },
    reinforce: 1,
    reinforce_desc: "治疗1个干员的6点伤害",
    onReinforce(G, ctx, self){
      cure(G, ctx, 6);
    },
  },
  {
    name:"天火",
    cost:4,
    atk:6,
    hp:3,
    mine:4,
    block:0,
    desc: "超杀: 每造成2点额外伤害，就获得1个材料",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_55.png",
    // onMine(G, ctx, self) {
    //   let count = G.finished.filter(x => x.exhausted).length;
    //   for (let order of G.finished) {
    //     order.exhausted = false;
    //   }

    //   if (count >= 10) {
    //     achieve(G, ctx, "无敌的小火龙", "使用伊芙利特重置至少10个订单", self);
    //   }

    // },

    onFight(G, ctx, self, enemy) {
      if (enemy.dmg > enemy.hp) {
        let delta = enemy.dmg - enemy.hp;
        let times = Math.floor(delta / 2);
        // for (let i=0; i<times; i++) {
        //   let order = choice(ctx, G.finished.filter(x => !x.exhausted));
        //   if (order) {
        //     order.effect(G, ctx);
        //     logMsg(G, ctx, ["触发订单 ", order.desc]);
        //   }
        // }
        gainMaterials(G, ctx, times);
      }
    },
    // action(G, ctx) {
    //   G.onUseOrder.push(
    //     (G, ctx) => {
    //       deal_random_damage(G, ctx, 3);
    //     }
    //   );
    // },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 1;
    },
    reinforce_desc: "+2/+1",
  },
  
  // {
  //   name:"远山",
  //   cost:3,
  //   atk:4,
  //   hp:2,
  //   mine:1,
  //   block:0,
  //   desc:"部署/采掘/战斗: 重置1个已完成的订单",
  //   illust:"http://prts.wiki/images/f/f3/%e7%ab%8b%e7%bb%98_%e6%b8%85%e6%b5%81_1.png",
  //   onMine(G, ctx, self) {
  //     for (let order of ctx.random.Shuffle(G.finished)) {
  //       if (order.exhausted) {
  //         order.exhausted = false;
  //         break;
  //       }
  //     }
  //   },
  //   reinforce: 1,
  //   onReinforce(G, ctx, self) {
  //     self.atk += 4;
  //     self.hp += 2;
  //   },
  //   reinforce_desc: "+4/+2",
  // }, 
  
  // {
  //   name:"梅尔",
  //   cost:2,
  //   atk:2,
  //   hp:1,
  //   mine:1,
  //   block:1,
  //   desc: "部署: 获得1个已完成的订单，其能力为\"?→造成5点伤害\"",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_145.png",
  //   reinforce: 1,

  //   onPlay(G, ctx) {
  //     let order = {};
  //     let material = ctx.random.Die(3) - 1;
  //     let requirements = [0,0,0,0];
  //     requirements[material] = 1;
  //     order.desc = <span>{material_icons[material]}→5伤害</span>;
  //     order.effect = (G,ctx) => {
  //       if (payMaterials(G, ctx, requirements)) {
  //         deal_random_damage(G, ctx, 5);
  //       }
  //     };
  //     order.is_rhine = true;
  //     G.finished.unshift(order);
  //   },
    
  //   onReinforce(G, ctx) {
  //     deal_random_damage(G, ctx, 3);
  //   },
  //   reinforce_desc: "造成3点伤害",
  // },

 
  // {
  //   name:"稀音",
  //   cost:2,
  //   atk:3,
  //   hp:2,
  //   mine:2,
  //   block:0,
  //   desc:<span>部署: 获得1个已完成的订单，其能力为"{material_icons[0]}{material_icons[1]}{material_icons[2]}→获得4分"</span>,
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_144.png",
  //   reinforce: 1,
  //   onPlay(G, ctx, self) {
  //     let order = {}; // EH: Reconstruct this as this code is the same as Meier
  //     let requirements = [1,1,1,0];
  //     order.desc = <span>{material_icons[0]}{material_icons[1]}{material_icons[2]}→4分</span>;
  //     order.effect = (G, ctx) => {
  //       if (payMaterials(G, ctx, requirements)) {
  //         G.score += 4;
  //       }
  //     };
  //     G.finished.unshift(order);
  //   },
  //   onReinforce(G, ctx, self) {
  //     self.hp += 2;
  //     self.atk += 2;
  //   },
  //   reinforce_desc: "+2/+2",
  // },
  
  {
    name:"摄影车",
    cost:3,
    atk:2,
    hp:2,
    mine:1,
    block:1,
    desc:"部署: 获得2个召唤物\"稀音\"",
    was_enemy: true,
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_59.png",
    onPlay(G, ctx, self) {
      let card = extra_cards.find(x => x.name == "稀音");
      G.hand = [card, card, ...G.hand];
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      let card = extra_cards.find(x => x.name == "稀音");
      G.hand = [card, ...G.hand];
    },
    reinforce_desc: "获得1个\"稀音\"",
  },
  
  {
    name:"机械水獭",
    cost:3,
    atk:2,
    hp:2,
    mine:1,
    block:1,
    desc:"部署: 获得2个召唤物\"梅尔\"",
    was_enemy: true,
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_60.png",
    onPlay(G, ctx, self) {
      let card = extra_cards.find(x => x.name == "梅尔");
      G.hand = [card.generator(ctx), card.generator(ctx), ...G.hand];
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      let card = extra_cards.find(x => x.name == "梅尔");
      G.hand = [card.generator(ctx), ...G.hand];
    },
    reinforce_desc: "获得1个\"梅尔\"",
  },
  
  {
    name:"龙腾",
    was_enemy: true,
    cost:3,
    atk:2,
    hp:3,
    mine:2,
    block:0,
    desc:<span>行动: 消耗1组{material_icons.slice(0,3)}，召唤3个"麦哲伦"</span>,
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_61.png",
    action(G, ctx, self) {
      if (payMaterials(G, ctx, [1,1,1,0])) {
        let generator = extra_cards.find(x => x.name == "麦哲伦");
        for (let i=0; i<3; i++) {
          let card = generator.generate(ctx);
          summon(G, ctx, {...card}, self);
        }
      }
    },
    reinforce: 1,
    reinforce_desc: "造成3点伤害",
    onReinforce(G, ctx, self) {
      deal_random_damage(G, ctx, 3);
    },
  },

  
  // {
  //   name:"斑点",
  //   cost:6,
  //   atk:3,
  //   hp:6,
  //   mine:2,
  //   block:3,
  //   desc:"部署: 每有1个已完成的订单，就获得+1/+2",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_62.png",
  //   onPlay(G, ctx, self) {
  //     let num_finished = G.finished.length;
  //     self.atk += num_finished;
  //     self.hp += 2 * num_finished;
  //   },
  //   reinforce: 1,
  //   onReinforce(G, ctx, self) {
  //     self.block += 1;
  //   },
  //   reinforce_desc: "阻挡数+1",
  // },
  
  {
    name:"艾雅法拉",
    cost:4,
    atk:3,
    hp:3,
    mine:2,
    block:0,
    desc:"采掘: 触发场上所有干员的\"采掘:\"效果",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_63.png",
    onMine(G, ctx, self) {
      if (~G.field.indexOf(self)) { // To prevent reinforce hand infinite loop
        for (let card of G.field) {
          if (card.onMine && (card.onMine != self.onMine)) {
            card.onMine(G, ctx, card);
          }
        }
      }
    },
    reinforce: 2,
    // onReinforce(G, ctx, self) {
    //   let miners = G.deck.filter(x => x.onMine);
    //   if (miners.length > 0) {
    //     let card = ctx.random.Shuffle(miners)[0];
    //     G.hand.unshift(Object.assign({}, card));
    //   }
    // },
    onReinforce(G, ctx, self) {
      self.mine += 1;
    },
    reinforce_desc: "<+1>",
  },

  {
    name:"能天使", 
    cost:4, 
    atk:6, 
    hp:3, 
    mine:1, 
    block:0, 
    desc:"战斗: 触发场上所有干员的\"战斗:\"效果", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_64.png",
    onFight(G, ctx, self, enemy) {
      if (~G.field.indexOf(self)) {
        for (let card of G.field) {
          if (card.onFight && (card.onFight != self.onFight)) {
            card.onFight(G, ctx, card, enemy);
          }
        }
      }
    },
    reinforce: 2,
    // onReinforce(G, ctx, self) {
    //   let fighters = G.deck.filter(x => x.onFight);
    //   if (fighters.length > 0) {
    //     let card = ctx.random.Shuffle(fighters)[0];
    //     G.hand.unshift(Object.assign({}, card));
    //   }
    // },
    onReinforce(G, ctx, self) {
      self.atk += 3;
      self.hp += 1;
    },
    reinforce_desc: "+3/+1",
  },
  {
    name:"温蒂", 
    cost:6, 
    atk:4, 
    hp:6, 
    mine:2, 
    block:1, 
    desc:"行动: 触发场上所有干员的\"行动:\"效果", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_65.png",
    action(G, ctx, self, enemy) {
      if (~G.field.indexOf(self)) { // To ensure effect is executed in field
        for (let card of G.field.map(x=>x)) {
          if (card.action && (card.action != self.action)) {
            card.action(G, ctx, card);
          }
        }
      }
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      let actors = G.deck.filter(x => x.action);
      if (actors.length > 0) {
        let card = ctx.random.Shuffle(actors)[0];
        G.hand.unshift(Object.assign({}, card));
      }
    },
    reinforce_desc: "检索1张有\"行动:\"效果的牌",
  },
  {
    name:"安洁莉娜",
    cost:6,
    atk:4,
    hp:4,
    mine:2,
    block:1,
    desc:"部署: 触发手牌中所有干员的\"部署:\"效果",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_66.png",
    onPlay(G, ctx, self) {
      for (let card of G.hand.map(x=>x)) { //Copy the list to prevent infinite loop
        if (card.onPlay && (card.onPlay != self.onPlay)) {
          card.onPlay(G, ctx, card);
        }
      }
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      let battlecries = G.deck.filter(x => x.onPlay);
      if (battlecries.length > 0) {
        let card = ctx.random.Shuffle(battlecries)[0];
        G.hand.unshift(Object.assign({}, card));
      }
    },
    reinforce_desc: "检索1张有\"部署:\"效果的牌",
  },

  {
    name:"普罗旺斯", 
    cost:3,
    atk:5, 
    hp:2, 
    mine:1, 
    block:0, 
    desc:"采掘: 获得2分，然后横置1个干员，该干员每有2点攻击力，就再获得1分", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_67.png",
    onMine(G, ctx, self) {
      let card = ctx.random.Shuffle(G.field.filter(x=>(!x.exhausted)))[0];
      if (card) {
        card.exhausted = true;
        let delta = Math.floor(card.atk / 2) + 2;
        G.score += delta;
        logMsg(G, ctx, `使用 普罗旺斯 获得${delta}分`);
      }
      // let power = self.power;
      // G.onPayCost.push(
      //   (G, ctx, amount) => {
      //     for (let i=0; i<amount; i++) {
      //       deal_random_damage(G, ctx, 3 + power);
      //     }
      //   }
      // );
    },
    reinforce: 2,
    reinforce_desc: "触发1次\"采掘:\"效果",
    onReinforce(G, ctx, self) {
      this.onMine && this.onMine(G, ctx, self);
    }
  },
  
  // {
  //   name:"灰喉", 
  //   cost:4,
  //   atk:2, 
  //   hp:1, 
  //   mine:1, 
  //   block:0, 
  //   desc:"部署: 获得+15攻击力直到回合结束", 
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_68.png",
  //   onPlay(G, ctx, self) {
  //     let delta = 15;
  //     self.atk += delta;
  //     self.played = true;
  //     self.onTurnBegin = (G, ctx, self) => {
  //       if (self.played) {
  //         self.atk -= delta;
  //         self.played = false;
  //       }
  //     }
  //   },
  //   reinforce: 1,
  //   onReinforce(G, ctx, self) {
  //     self.atk += 2;
  //     self.hp += 2;
  //   },
  //   reinforce_desc: "+2/+2",

  // },
  {
    name:"煌",
    cost:6,
    atk:5,
    hp:7,
    mine:2,
    block:1,
    desc:"超杀: 每造成2点额外伤害，就获得1分",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_69.png",
    onFight(G, ctx, self, enemy) {
      if (enemy.dmg > enemy.hp) {
        let delta = enemy.dmg - enemy.hp;
        let score_gained = Math.floor(delta / 2);
        G.score += score_gained;
        logMsg(G, ctx, `使用 ${self.name} 获得${score_gained}分`);
        if (score_gained >= 50) {
          achieve(G, ctx, "沸腾爆裂", "使用煌获得至少50分", self);
        }
      }
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 3;
      self.hp += 1;
    },
    reinforce_desc: "+3/+1",
  },

  // {
  //   name:"断崖",
  //   cost:4,
  //   atk:6,
  //   hp:4,
  //   mine:2,
  //   block:1,
  //   desc:"超杀: 每造成1点额外伤害，就摸1张牌",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_70.png",
  //   onFight(G, ctx, self, enemy) {
  //     if (enemy.dmg > enemy.hp) {
  //       let delta = enemy.dmg - enemy.hp;
  //       for (let i=0; i<delta; i++) {
  //         draw(G, ctx);
  //       }
  //     }
  //   },
  //   reinforce: 1,
  //   onReinforce(G, ctx, self) {
  //     self.atk += 2;
  //     self.hp += 2;
  //   },
  //   reinforce_desc: "+2/+2",
  // },
  {
    name:"迷迭香",
    cost:4,
    atk:5,
    hp:3,
    mine:1,
    block:0,
    desc:"超杀: 每造成2点额外伤害，就再对1个敌人造成3点伤害",
    illust:"https://z3.ax1x.com/2020/11/26/Ddxxbt.png",
    onFight(G, ctx, self, enemy) {
      if (enemy.dmg > enemy.hp) {
        // for (let i=0; i<2; i++) {
        //   let card = ctx.random.Shuffle(G.CARDS.filter(x => x.onMine || x.onFight || x.action))[0];
        //   card = {...card};
        //   card.atk = 2;
        //   card.hp = 2;
        //   card.mine = 1;
        //   card.cost = 2;
        //   summon(G, ctx, card, self);
        // }
        let delta = enemy.dmg - enemy.hp;
        for (let i=0; i<Math.floor(delta/2); i++) {
          deal_random_damage(G, ctx, 3);
        }
      }
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 1;
    },
    reinforce_desc: "+2/+1",
  },

  {
    name:"安比尔",
    cost:3,
    atk:5,
    hp:2,
    mine:1,
    block:0,
    desc:"行动: 本回合剩余时间内，干员的\"超杀:\"效果将额外触发1次",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_71.png",
    action(G, ctx) {
      G.onCardFight.push(
        (G, ctx, self, enemy) => {
          if (enemy.dmg > enemy.hp && ((typeof self.desc) == "string") && self.desc.includes("超杀")) {
            self.onFight && self.onFight(G, ctx, self, enemy);
          }
        }
      );
    },
    reinforce: 3,
    onReinforce(G, ctx, self) {
      this.action(G, ctx);
    },
    reinforce_desc: "触发1次\"行动:\"效果",
  },
  {
    name:"黑",
    cost:3,
    atk:5,
    hp:2,
    mine:1,
    block:0,
    desc:"战斗: 攻击正前方的敌人时，造成伤害翻倍",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_72.png",
    onFight(G, ctx, self, enemy) {
      let idx = G.field.indexOf(self);
      let target = G.efield[idx];  // it's fine if it is undefined
      if (enemy == target) {
        enemy.dmg += self.atk;
      }
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 1;
    },
    reinforce_desc: "+2/+1",
  },
  
  {
    name:"酸糖", 
    cost:3,
    atk:5, 
    hp:2, 
    mine:1, 
    block:0, 
    desc:"行动: 本回合剩余时间内，每有1个敌人被摧毁，就获得2分", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_73.png",
    action(G, ctx, self) {
      // G.onCardFight.push((G, ctx, card, enemy) => {
      //   if (enemy.dmg >= enemy.hp) {
      //     G.score += 2;
      //   }
      // });
      G.onEnemyOut.push(
        (G, ctx) => {
          G.score += 2;
        }
      );
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      this.action(G, ctx, self);
    },
    reinforce_desc: "触发1次\"行动\"效果",

  },

  {
    name:"热水壶", 
    cost:2,
    atk:3, 
    hp:3, 
    mine:2, 
    block: 1,
    was_enemy: true,
    desc:"部署: 变成1个随机干员", 
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_74.png",
    onPlay(G, ctx, self) {
      // self.hp += 2;
      // G.costs += 1;
      // G.score += 2 * G.discard.filter(x => (x.name == "热水壶")).length;
      let card = choice(ctx, G.CARDS.filter(c => c.onMine || c.onFight || c.action));
      Object.assign(self, {...card, atk:self.atk, hp:self.hp, mine:self.mine, block:self.block, was_enemy:false})
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
    reinforce_desc: "+2/+2",

  },

  {
    name:"刻俄柏",
    cost:5,
    atk:3,
    hp:3,
    mine:2,
    block:0,
    desc:"部署/采掘/战斗: 造成1点伤害，重复3次",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_75.png",
    onPlay(G, ctx, self) {
      for (let i=0; i<(3+2*self.power); i++) {
        deal_random_damage(G, ctx, 1);
      }
    },
    onMine(G, ctx, self) {
      // for (let i=0; i<(3+3*self.power); i++) {
      //   deal_random_damage(G, ctx, 1);
      // }
      this.onPlay(G, ctx, self);
    },
    onFight(G, ctx, self) {
      // for (let i=0; i<(3+3*self.power); i++) {
      //   deal_random_damage(G, ctx, 1);
      // }
      this.onPlay(G, ctx, self);
    },
    reinforce: 1,
    reinforce_desc: "再重复2次",
  },

 
  
  {
    name:"斯卡蒂",
    cost:3,
    atk:3,
    hp:3,
    mine:2,
    block:1,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_76.png",
    reinforce: 1,
    desc: "部署/采掘/战斗/行动: 触发1个随机干员的部署/采掘/战斗/行动效果",
    onPlay(G, ctx, self) {
      let card = ctx.random.Shuffle(G.CARDS.filter(x=>x.onPlay))[0];
      card.onPlay(G, ctx, self);
      if (card.name != "斯卡蒂") {
        logMsg(G, ctx, [`触发 ${card.name} 的部署效果`, '"', card.desc, '"']);
      }
    },
    onMine(G, ctx, self) {
      let card = ctx.random.Shuffle(G.CARDS.filter(x=>x.onMine))[0];
      card.onMine(G, ctx, self);
      if (card.name != "斯卡蒂") {
        logMsg(G, ctx, [`触发 ${card.name} 的采掘效果`, '"', card.desc, '"']);
      }
    },
    onFight(G, ctx, self, enemy) {
      let card = ctx.random.Shuffle(G.CARDS.filter(x=>x.onFight))[0];
      card.onFight(G, ctx, self, enemy);
      if (card.name != "斯卡蒂") {
        logMsg(G, ctx, [`触发 ${card.name} 的战斗效果`, '"', card.desc, '"']);
      }
    },
    action(G, ctx, self) {
      let card = ctx.random.Shuffle(G.CARDS.filter(x=>x.action))[0];
      card.action(G, ctx, self);
      if (card.name != "斯卡蒂") {
        logMsg(G, ctx, [`触发 ${card.name} 的行动效果`, '"', card.desc, '"']);
      }
    },
    onReinforce(G, ctx, self) {
      let card = ctx.random.Shuffle(G.CARDS.filter(x=>x.onReinforce))[0];
      card.onReinforce(G, ctx, self);
      if (card.name != "斯卡蒂") {
        logMsg(G, ctx, `触发 ${card.name} 的强化效果 \"${card.reinforce_desc}\"`);
      }
    },
    
    reinforce_desc: "触发1个随机干员的强化效果",
  },

  {
    name:"图耶",
    cost:6,
    atk:2,
    hp:2,
    mine:1,
    block:0,
    desc:"部署: 召唤5个随机干员的1/1复制",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_77.png",
    onPlay(G, ctx, self) {
      let cards = ctx.random.Shuffle(G.CARDS).filter(c => c.onMine || c.onFight || c.action || (c.cost >= 4));
      for (let i=0; i<5; i++) {
        let card = {...cards[i]}; // Copy at this stage
        card.atk = 1;
        card.hp = 1;
        card.mine = 1;
        card.cost = 1;
        // G.field.push(init_card_state(G, ctx, card));
        // insert_field(G, ctx, card);
        summon(G, ctx, card, self);
      }
    },
    reinforce: 1,
    onReinforce(G, ctx) {
      G.score += 1;
    },
    reinforce_desc: "获得1分",
  },

  // {
  //   name:"暴行",
  //   cost:2,
  //   atk:4,
  //   hp:4,
  //   mine:1,
  //   block:1,
  //   desc:"部署/采掘: 将所有手牌替换为随机干员牌",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_78.png",
  //   onPlay(G, ctx) {
  //     let cards = ctx.random.Shuffle(G.CARDS).slice(0, G.hand.length);
  //     G.hand = cards.map(x => ({...x}));
  //   },
  //   onMine(G, ctx) {
  //     this.onPlay(G, ctx);
  //   },
  //   reinforce: 1,
  //   onReinforce(G, ctx) {
  //     this.onPlay(G, ctx);
  //   },
  //   reinforce_desc: "将所有手牌替换为随机干员牌",
  // },

  {
    name:"嘉维尔",
    cost:3,
    atk:3,
    hp:2,
    mine:2,
    block:0,
    desc:"部署: 将场上所有干员变成随机干员",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_79.png",
    onPlay(G, ctx, self) {
      let change_card = (card) => {
        let new_card = ctx.random.Shuffle(G.CARDS.filter(x => (x.onMine || x.onFight || x.action)))[0];
        let { name, desc, illust, onMine, onFight, action, reinforce, reinforce_desc, onReinforce } = new_card;
        let extracted_attrs = { name, desc, illust, onMine, onFight, action, reinforce, reinforce_desc, onReinforce }; // EH: This is written twice which is not cool, however, are there methods in js for changing this?
        return {...card, ...extracted_attrs};
      }
      G.field = G.field.map(change_card);
    },
    reinforce: 1,
    reinforce_desc: "将场上所有干员变成随机干员",
    onReinforce(G, ctx) {
      this.onPlay(G, ctx);
    },
  },
  
  {
    name: "阿米娅-近卫",
    cost: 6,
    atk: 6,
    hp: 6,
    mine: 3,
    block: 1,
    illust: "https://z3.ax1x.com/2020/11/12/BvqDyQ.png",
    desc: `行动: 造成3点伤害，重复4次，然后本回合剩余时间内，使用干员采掘时，获得1分，整场战斗限1次(采掘/战斗: 强化此技能)`,
    // was_enemy: true,
    onPlay(G, ctx, self) {
      self.skill_power = 0;
      let reinforce_skill = (G, ctx, self) => {
        self.skill_power = (self.skill_power || 0) + 1;
        self.desc = `行动: 造成3点伤害，重复${4+self.skill_power}次，然后本回合剩余时间内，使用干员采掘时，获得${1+Math.floor(self.skill_power/3)}分，整场战斗限1次(采掘/战斗: 强化此技能)`;
      };
      
      self.onMine = reinforce_skill;
      self.onFight = reinforce_skill;
      self.desc = this.desc;
    },
    action: (G, ctx, self) => {
      let skill_power = self.skill_power || 1;
        for (let i=0; i<(4+skill_power); i++) {
          deal_random_damage(G, ctx, 3);
        }
        for (let j=0; j<Math.floor(skill_power/3 + 1); j++) {
          G.onCardMine.push((G, ctx) => {
            G.score += 1;
          });
        }
        self.action = undefined;
        self.onMine = undefined;
        self.onFight = undefined;
        self.desc = "";
      },
    reinforce: 1,
    reinforce_desc: "+1/+4",
    onReinforce(G, ctx, self) {
      self.atk += 1;
      self.hp += 4;
    }
  },

  {
    name:"银灰",
    cost:4,
    atk:6,
    hp:3,
    mine:1,
    block:1,
    desc: <span>采掘/战斗: 消耗1个{material_icons[3]}，重置自己</span>,
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_80.png",
    onMine(G, ctx, self) {
      if (payMaterials(G, ctx, [0,0,0,1])) {
        self.exhausted = false;

        self.use_count = self.use_count || 0;
        self.use_count += 1;

        if (self.use_count >= 10) {
          achieve(G, ctx, "真银斩", "一回合内使用银灰10次以上", self);
        }
      }
    },
    onFight(G, ctx, self) {
      this.onMine(G, ctx, self);
    },
    onTurnBegin(G, ctx, self) {
      self.use_count = 0;
    },
    reinforce: 1,
    reinforce_desc: "+1/+1",
    onReinforce(G, ctx, self) {
      self.atk += 1;
      self.hp += 1;
    }
  },
  {
    name:"崖心",
    cost:3,
    atk:4,
    hp:3,
    mine:2,
    block:1,
    desc:<span>行动: 消耗2个{material_icons[3]}，获得6分</span>,
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_81.png",
    action(G, ctx, self) {
      if (payMaterials(G, ctx, [0,0,0,2])) {
        G.score += 6 + 2 * self.power;
      }
    },
    reinforce: 2,
    reinforce_desc: "再获得2分",
  },
  {
    name:"雪雉",
    cost:3,
    atk:4,
    hp:3,
    mine:2,
    block:1,
    desc:"行动: 清除弃牌堆中的5张牌，获得6分",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_82.png",
    action(G, ctx, self) {
      if (G.discard.length >= 5) {
        G.discard = G.discard.slice(5);
        G.score += 6 + 2 * self.power;
        logMsg(G, ctx, `弃牌堆中还剩${G.discard.length}张`);
      }
      else {
        logMsg(G, ctx, `弃牌堆中的牌数量不够(${G.discard.length}张)`);
        self.exhausted = false;
      }
    },
    reinforce: 2,
    reinforce_desc: "再获得2分",
  },

  // {
  //   name:"初雪",
  //   cost:3,
  //   atk:4,
  //   hp:3,
  //   mine:2,
  //   block:0,
  //   desc:<span>行动: 获得1个{material_icons[3]}，然后每有1组{material_icons.slice(0,3)}，就再获得1个{material_icons[3]}</span>,
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_83.png",
  //   action(G, ctx, self) {
  //     G.materials[3] += 1 + G.materials.slice(0,3).sort()[0];
  //   },
  //   reinforce: 2,
  //   reinforce_desc: "获得2点费用",
  //   onReinforce(G, ctx, self) {
  //     G.costs += 2;
  //   },
  // },
  // {
  //   name:"角峰",
  //   cost:4,
  //   atk:3,
  //   hp:6,
  //   mine:1,
  //   block:2,
  //   desc:<span>部署: 每有1个{material_icons[3]}，就获得+1/+1</span>,
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_84.png",
  //   onPlay(G, ctx, self) {
  //     self.atk += G.materials[3];
  //     self.hp += G.materials[3];
  //   },
  //   reinforce: 1,
  //   onReinforce(G, ctx, self) {
  //     self.atk += 1;
  //     self.hp += 3;
  //   },
  //   reinforce_desc: "+1/+3",
  // },
  {
    name:"棘刺",
    cost:2,
    atk:2,
    hp:4,
    mine:1,
    block:1,
    desc:"行动: 弃1张牌，造成3点伤害，然后重置自己",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_85.png",
    action(G, ctx, self) {
      if (G.hand.length > 0) {
        drop(G, ctx);
        deal_random_damage(G, ctx, 3+self.power);
        self.exhausted = false;
        self.use_count -= 1;
      }
      else {
        logMsg(G, ctx, "手牌不足 或 使用次数已达到上限");
      }
    },
    onTurnBegin(G, ctx, self) {
      self.use_count = 20;
    },
    reinforce: 1,
    reinforce_desc: "伤害+1",
  },
  
  {
    name:"夜烟",
    cost:3,
    atk:3,
    hp:2,
    mine:3,
    block:0,
    desc:"采掘: 消耗2点费用，再获得3个材料",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_86.png",
    onMine(G, ctx) {
      if (payCost(G, ctx, 2, true)) {
        gainMaterials(G, ctx, 3);
      }
    },
    reinforce: 2,
    reinforce_desc: "<+1>",
    onReinforce(G, ctx, self) {
      self.mine += 1;
    }
  },

  {
    name:"梓兰",
    cost:3,
    atk:3,
    hp:2,
    mine:2,
    block:0,
    desc: "部署/采掘/战斗: 化解1点动乱值",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_87.png",
    reinforce: 1,
    onMine(G, ctx, self) {
      G.danger -= 1;
    },
    onFight(G, ctx, self) {
      G.danger -= 1;
    },
    onPlay(G, ctx, self) {
      G.danger -= 1;
    },
    onReinforce(G, ctx, self) {
      G.danger -= 1;
    },
    reinforce_desc: "化解1点动乱值",
  },
  
  // {
  //   name:"麦哲伦",
  //   cost:3,
  //   atk:2,
  //   hp:1,
  //   mine:2,
  //   block:0,
  //   desc:"部署: 化解5点动乱值",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_146.png",
  //   reinforce: 1,
  //   onPlay(G, ctx, self) {
  //     G.danger -= 5;
  //   },
  //   onReinforce(G, ctx, self) {
  //     self.mine += 1;
  //   },
  //   reinforce_desc: "<+1>",
  // },
 
  
  {
    name:"苏苏洛",
    cost:3,
    atk:0,
    hp:2,
    mine:1,
    block:0,
    desc:<span>部署: 每有1组{material_icons.slice(0,3)}，就获得2分</span>,
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_89.png",
    reinforce: 1,
    onPlay(G, ctx, self) {
      G.score += 2 * G.materials.slice(0,3).sort()[0];
    },
    onReinforce(G, ctx) {
      cure(G, ctx, 6);
    },
    reinforce_desc: "治疗1个干员的6点伤害",
  },

  {
    name:"孑",
    cost:2,
    atk:7,
    hp:7,
    mine:3,
    block:1,
    desc:"部署: 获得\"回合开始时: 消耗2点费用\"",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_90.png",
    reinforce: 1,
    onPlay(G, ctx, self) {
      self.onTurnBegin = (G, ctx, self) => {
        G.costs -= 2;
        // let paid = payCost(G, ctx, 2);
        // if (!paid) {
        //   self.atk -= 5;
        //   self.hp -= 5;
        // }
      };
    },
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
    reinforce_desc: "+2/+2",
  },



  {
    name:"凛冬",
    cost:3,
    atk:3,
    hp:3,
    mine:1,
    block:1,
    // desc: "采掘/战斗: 强化1张手牌",
    desc: "采掘/战斗: 强化场上1个(重置的)干员",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_91.png",
    reinforce: 1,
    // onMine(G, ctx, self) {
    //   reinforce_hand(G, ctx);
    // },
    // onFight(G, ctx, self) {
    //   reinforce_hand(G, ctx);
    //   let num_reinforced = G.hand.filter(x => (x.power > 0)).length;
    //   G.costs += num_reinforced;
    // },
    onMine(G, ctx, self) {
      reinforce_field(G, ctx);
    },
    onFight(G, ctx, self) {
      reinforce_field(G, ctx);
    },
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
    reinforce_desc: "+2/+2",
  },
  {
    name:"真理",
    cost:2,
    atk:2,
    hp:2,
    mine:2,
    block:0,
    desc: "行动: 强化1张手牌，重复2次",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_92.png",
    reinforce: 2,
    action(G, ctx, self) {
      for (let i=0; i<self.power+2; i++){
        reinforce_hand(G, ctx);
      }
    },
    reinforce_desc: "再重复1次",
  },
  // {
  //   name:"古米",
  //   cost:4,
  //   atk:3,
  //   hp:6,
  //   mine:2,
  //   block:2,
  //   desc: "采掘/战斗: 强化场上1个(重置的)干员",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_93.png",
  //   reinforce: 1,
  //   onMine(G, ctx, self) {
  //     reinforce_field(G, ctx);
  //   },
  //   onFight(G, ctx, self) {
  //     reinforce_field(G, ctx);
  //   },
  //   onReinforce(G, ctx, self) {
  //     self.hp += 6;
  //   },
  //   reinforce_desc: "+0/+6",
  // },

  {
    name:"诗怀雅",
    cost:3,
    atk:2,
    hp:1,
    mine:1,
    block:1,
    desc: "部署: 强化场上1个(重置的)干员，重复2次",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_99.png",
    reinforce: 1,
    onPlay(G, ctx, self) {
      reinforce_field(G, ctx);
      reinforce_field(G, ctx);
      // reinforce_field(G, ctx);
    },
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
    reinforce_desc: "+2/+2",
  },

  // {
  //   name:"早露",
  //   cost:5,
  //   atk:5,
  //   hp:2,
  //   mine:2,
  //   block:0,
  //   desc: "部署: 每有1张被强化过的手牌(包括自己)，就造成3点伤害并获得1分",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_95.png",
  //   reinforce: 1,
  //   onPlay(G, ctx, self) {
  //     let num_reinforced = [...G.hand, self].filter(x => (x.power > 0)).length;
  //     for (let i=0; i<num_reinforced; i++) {
  //       deal_random_damage(G, ctx, 3);
  //       G.score += 1;
  //     }
  //   },
  //   onReinforce(G, ctx, self) {
  //     deal_random_damage(G, ctx, 3);
  //   },
  //   reinforce_desc: "造成3点伤害",
  // },

  //休整一家暂时退休
  // {
  //   name:"守林人",
  //   cost:4,
  //   atk:5,
  //   hp:3,
  //   mine:2,
  //   block:0,
  //   desc: "休整: 造成3点伤害，每有1个休整中的干员，伤害就+2",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_96.png",
  //   reinforce: 1,
  //   onRest(G, ctx, self) {
  //     deal_random_damage(G, ctx, 3 + 2 * get_num_rest_cards(G, ctx) + 3 * self.power);
  //   },
  //   reinforce_desc: "伤害+3",
  // },
  {
    name:"霜叶",
    cost:2,
    atk:3,
    hp:2,
    mine:2,
    block:0,
    desc: "采掘: 将场上1个(重置的)干员返回手牌",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_97.png",
    reinforce: 1,
    // onRest(G, ctx, self) {
    //   let num_rest_cards = get_num_rest_cards(G, ctx);
    //   self.atk += num_rest_cards;
    //   self.hp += num_rest_cards;
    // },
    onMine(G, ctx, self) {
      let card = choice(ctx, G.field.filter(x => !x.exhausted));
      if (card) {
        G.field = G.field.filter(x => x != card);
        G.hand.unshift(card);
      }
    },
    onReinforce(G, ctx, self) {
      self.block += 1;
    },
    reinforce_desc: "阻挡数+1",
  },
  // {
  //   name:"锡兰",
  //   cost:2,
  //   atk:3,
  //   hp:2,
  //   mine:2,
  //   block:0,
  //   desc: "采掘: 本回合剩余时间内，每打出1张牌，就摸1张牌",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_98.png",
  //   reinforce: 2,
  //   // onRest(G, ctx, self) {
  //   //   let num_rest_cards = get_num_rest_cards(G, ctx);
  //   //   G.score += num_rest_cards;
  //   // },
  //   onMine(G, ctx, self) {
  //     G.onPlayCard.push(
  //       (G, ctx) => {
  //         draw(G, ctx);
  //       }
  //     );
  //   },
  //   onReinforce(G, ctx, self) {
  //     G.costs += 2;
  //   },
  //   reinforce_desc: "获得2点费用",
  // },
  // // {
  // //   name:"诗怀雅",
  // //   cost:4,
  // //   atk:4,
  // //   hp:5,
  // //   mine:1,
  // //   block:1,
  // //   desc: "休整: 触发场上1个干员的\"部署:\"效果(极境和安洁莉娜除外)",
  // //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_99.png",
  // //   reinforce: 1,
  // //   onRest(G, ctx, self) {
  // //     let player = ctx.random.Shuffle(G.field.filter(x => (x.onPlay && !["极境", "安洁莉娜"].includes(x.name))))[0];
  // //     if (player) {
  // //       player.onPlay(G, ctx, player);
  // //       logMsg(G, ctx, `触发 ${player.name} 的部署效果`);
  // //     }
  // //   },
  // //   onReinforce(G, ctx, self) {
  // //     self.atk += 2;
  // //     self.hp += 2;
  // //   },
  // //   reinforce_desc: "+2/+2",
  // // },
  // {
  //   name:"夜莺",
  //   cost:5,
  //   atk:0,
  //   hp:3,
  //   mine:3,
  //   block:0,
  //   desc: "休整: 触发场上所有干员的\"休整:\"效果",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_100.png",
  //   onRest(G, ctx, self) {
  //     if (~G.field.indexOf(self)) {
  //       for (let card of G.field.map(x=>x)) {
  //         if (card.onRest && (card.onRest != self.onRest)) {
  //           card.onRest(G, ctx, card);
  //         }
  //       }
  //     }
  //   },
  //   reinforce: 1,
  //   onReinforce(G, ctx, self) {
  //     let resters = G.deck.filter(x => x.onRest);
  //     if (resters.length > 0) {
  //       let card = ctx.random.Shuffle(resters)[0];
  //       G.hand.unshift(Object.assign({}, card));
  //     }
  //   },
  //   reinforce_desc: "检索1张有\"休整:\"效果的牌",
  // },

  {
    name:"阿",
    cost:1,
    atk:2,
    hp:2,
    mine:1,
    block:0,
    desc: "行动: 摧毁1个(重置的)干员，获得3分",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_101.png",
    reinforce: 1,
    action(G, ctx, self) {
      // let card = ctx.random.Shuffle(G.field.filter(x => (x!=self && !x.exhausted)))[0];
      // if (card) {
      //   card.dmg += 3;
      //   G.score += 3;
      //   if (card.dmg >= card.hp) {
      //     // let card_idx = G.field.indexOf(card);
      //     // G.field.splice(card_idx, 1);
      //     // G.discard.push(card);
      //     G.field = G.field.filter(x => x != card);
      //     G.discard = [card, ...G.discard];
      //   }
      //   // else {
      //     // card.onMine = (G, ctx) => {G.score += 4};
      //     // card.onFight = card.onMine;
      //     // card.desc = "采掘/战斗: 获得4分";
      //     // G.score += 3;
      //   // }
        if (eliminate_field(G, ctx, self)) {
          G.score += 3;
        }
        self.use_count = (self.use_count || 0) + 1;
        if (self.use_count == 10) {
          achieve(G, ctx, "爆发剂·榴莲味", "一局内使用阿10次以上", self);
        }
    },
    onReinforce(G, ctx, self) {
      self.exhausted = false;
    },
    reinforce_desc: "重置自己",
  },
  
  {
    name:"断罪者",
    cost:2,
    atk:3,
    hp:2,
    mine:1,
    block:1,
    desc: "行动: 弃掉所有手牌，然后每弃掉1张，就获得1分",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_102.png",
    reinforce: 1,
    action(G, ctx, self) {
      let num_cards = G.hand.length;
      G.discard = [...G.discard, ...G.hand]; // EH: reconstruct the discard
      G.hand = [];
      G.score += num_cards;
      logMsg(G, ctx, `使用 断罪者 获得${num_cards}分`);
      G.has_discarded = true;

      if (num_cards >= 17) {
        achieve(G, ctx, "17张牌你能秒我", "使用断罪者弃掉至少17张手牌", self);
      }

      // G.onDropCard.push(
      //   (G, ctx) => {
      //     G.score += 1;
      //   }
      // );
    },
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
    reinforce_desc: "+2/+2",
  },
  {
    name:"清流",
    cost:2,
    atk:3,
    hp:2,
    mine:2,
    block:0,
    desc: "部署: 将弃牌堆中的所有牌返回手牌",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_103.png",
    reinforce: 1,
    onPlay(G, ctx, self) {
      G.hand = [...G.discard, ...G.hand];
      G.discard = [];

      // if (G.limit_hand_field && G.hand.length >= 6) {
      //   logMsg(G, ctx, "手牌数已达到上限");
      //   G.hand = G.hand.slice(G.hand.length-6);
      // }
    },
    onReinforce(G, ctx, self) {
      cure(G, ctx, 6);
    },
    reinforce_desc: "治疗1个干员的6点伤害",
  },
  {
    name:"调香师",
    cost:3,
    atk:0,
    hp:2,
    mine:2,
    block:0,
    desc: "采掘: 摸2张牌",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_104.png",
    onMine(G, ctx, self) {
      draw(G, ctx);
      draw(G, ctx);
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      cure(G, ctx, 6);
    },
    reinforce_desc: "治疗1个干员的6点伤害",


  },

  {
    name:"食铁兽",
    cost:6,
    atk:6,
    hp:5,
    mine:3,
    block:1,
    desc: "行动: 获得5分",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_105.png",
    reinforce: 2,
    action(G, ctx) {
      G.score += 5;
    },
    onReinforce(G, ctx, self) {
      G.score += 2;
    },
    reinforce_desc: "获得2分",
  },

  // {
  //   name:"格拉尼",
  //   cost:4,
  //   atk:1,
  //   hp:1,
  //   mine:1,
  //   block:1,
  //   desc: "摧毁: 召唤\"格拉尼\"",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_106.png",
  //   reinforce: 1,
  //   onOut(G, ctx, self) {
  //     let new_card = G.CARDS.find(x => x.name == "格拉尼");
  //     G.field.push(init_card_state(G, ctx, {...new_card}));
  //   },
  //   onReinforce(G, ctx, self) {
  //     self.atk += 2;
  //     self.hp += 2;
  //   },
  //   reinforce_desc: "+2/+2",
  // },
  
  {
    name:"宴",
    cost:2,
    atk:2,
    hp:2,
    mine:1,
    block:1,
    desc: "部署: 获得+5/+5直到回合结束",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_107.png",
    reinforce: 1,
    onPlay(G, ctx, self) {
      self.atk += 5;
      self.dmg -= 5;
      self.power += 1;

      self.played = true;
      self.onTurnBegin = (G, ctx, self) => {
        if (self.played) {
          self.atk -= 5 * self.power;
          self.power = 0;
          if (self.dmg < 0) {
            self.dmg = 0;
          }
          if ((self.hp - self.dmg) <= 0) {
            self.exhausted = true;
          }
          self.played = false;
        }
      }
    },
    onReinforce(G, ctx, self) {
      this.onPlay(G, ctx, self);
      self.power -= 1;
    },
    reinforce_desc: "触发1次\"部署:\"效果",
  },
  
  // {
  //   name:"月见夜", 
  //   cost:3, 
  //   atk:3, 
  //   hp:3, 
  //   mine:1, 
  //   block:1, 
  //   desc:"采掘/战斗: 如果你在本回合弃过手牌，则获得+3/+3", 
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_108.png",
  //   onMine(G, ctx, self) {
  //     if (G.has_discarded) {
  //       self.atk += 3;
  //       self.hp += 3;
  //     }
  //   },
  //   onFight(G, ctx, self) {
  //     this.onMine(G, ctx, self);
  //   },
  //   reinforce: 1,
  //   reinforce_desc: "+2/+2",
  //   onReinforce(G, ctx, self) {
  //     self.atk += 2;
  //     self.hp += 2;
  //   }
  // },


  {
    name:"远山",
    cost:3,
    atk:3,
    hp:2,
    mine:2,
    block:0,
    desc: "部署: 获得3个材料",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_109.png",
    reinforce: 2,
    onPlay(G, ctx, self) {
      gainMaterials(G, ctx, 3);
      // self.mine += 3;
      // self.played = true;
      // self.onTurnBegin = (G, ctx, self) => {
      //   if (self.played) {
      //     self.mine -= 3;
      //     self.played = false;
      //   }
      // }
    },
    onReinforce(G, ctx, self) {
      self.mine += 1;
    },
    reinforce_desc: "<+1>",
  },
  
  {
    name:"砾",
    cost:1,
    atk:1,
    hp:1,
    mine:1,
    block:1,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_110.png",
    reinforce: 1,
    desc: "摧毁: 返回手牌",
    // onPlay(G, ctx, self) {
      // let time_points = [["采掘: ", "onMine"], ["战斗: ", "onFight"], ["行动: ", "action"], ["摧毁: ", "onOut"]];
      // let time_point = ctx.random.Shuffle(time_points)[0];
      // let effects = ctx.random.Shuffle(G.EFFECTS);
      // let effect = effects[0];
      // self.desc = time_point[0] + effect[0];
      // self[time_point[1]] = effect[1];
      // self.reinforce_desc = effects[1][0];
      // self.onReinforce = effects[1][1];
      // logMsg(G, ctx, `获得效果"${self.desc}"`);
    // },
    onOut(G, ctx, self) {
      let gravel = G.CARDS.find(x => x.name == "砾");
      G.hand.unshift({...gravel});
    },
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
    reinforce_desc: "+2/+2",
  },
  {
    name:"红",
    cost:2,
    atk:3,
    hp:1,
    mine:1,
    block:1,
    desc: "部署: 横置1个敌人",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_111.png",
    reinforce: 1,
    onPlay(G, ctx, self) {
      // G.score += 1;
      // let num_reds = G.discard.filter(x => (x.name == "红")).length;
      // G.score += num_reds;
      exhaust_random_enemy(G, ctx);
    },
    onReinforce(G, ctx, self) {
      G.score += 1;
    },
    reinforce_desc: "获得1分",
  },
  // {
  //   name:"卡夫卡",
  //   cost:2,
  //   atk:2,
  //   hp:1,
  //   mine:2,
  //   block:1,
  //   desc: "部署: 如果场上干员数量多于敌人，则获得5分",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_112.png",
  //   reinforce: 2,
  //   onPlay(G, ctx, self) {
  //     if (G.field.length > G.efield.length) {
  //       G.score += 5;
  //     }
  //   },
  //   onReinforce(G, ctx, self) {
  //     G.hand.unshift({...CARDS.find(x => x.name == "卡夫卡")});
  //   },
  //   reinforce_desc: "获得1张\"卡夫卡\"",
  // },
  

  {
    name:"薄绿",
    cost:2,
    atk:3,
    hp:2,
    mine:2,
    block:0,
    desc: "采掘: 将弃牌堆中1张有\"部署:\"效果的牌返回手牌",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_113.png",
    reinforce: 1,
    onMine(G, ctx, self) {
      let card = ctx.random.Shuffle(G.discard).find(x => x.onPlay);
      if (card != undefined) {
        G.hand.unshift(card);
      }
    },
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
    reinforce_desc: "+2/+2",
  },
  
  {
    name:"森蚺",
    cost:5,
    atk:2,
    hp:2,
    mine:1,
    block:1,
    desc: "部署: 随机强化自己4次",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_114.png",
    reinforce: 1,
    onPlay(G, ctx, self) {
      let cards = ctx.random.Shuffle(G.CARDS.filter(x=>x.onReinforce)).slice(0, 4);
      for (let card of cards) {
        if (self) {
          card.onReinforce(G, ctx, self);
        }
      }
      logMsg(G, ctx, `触发 ${cards.map(x => x.name).join(",")} 的强化效果`);
    },
    // onReinforce(G, ctx, self) {
    //   self.atk += 2;
    //   self.hp += 2;
    // },
    // reinforce_desc: "+2/+2",
    onReinforce(G, ctx, self) {
      let card = ctx.random.Shuffle(G.CARDS.filter(x=>x.onReinforce))[0];
      card.onReinforce(G, ctx, self);
      if (card.name != "斯卡蒂") {
        logMsg(G, ctx, `触发 ${card.name} 的强化效果 \"${card.reinforce_desc}\"`);}
    },
    
    reinforce_desc: "触发1个随机干员的强化效果",

  },

  {
    name:"赫拉格",
    cost:6,
    atk:5,
    hp:8,
    mine:2,
    block:1,
    desc: "超杀: 每造成2点额外伤害，就获得+1攻击力并治疗5点伤害",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_115.png",
    reinforce: 1,
    onFight(G, ctx, self, enemy) {
      if (enemy.dmg > enemy.hp) {
        let excess = Math.floor((enemy.dmg - enemy.hp) / 2);
        self.atk += excess;
        self.dmg = Math.max((self.dmg - excess * 5), 0);
      }
    },
    onReinforce(G, ctx, self) {
      self.atk += 1;
      self.hp += 1;
    },
    reinforce_desc: "+1/+1",
  },
  {
    name:"波登可",
    cost:4,
    atk:2,
    hp:2,
    mine:2,
    block:0,
    desc: "行动: 触发手牌中1个干员的\"部署:\"效果(极境除外)",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_116.png",
    reinforce: 1,
    action(G, ctx, self) {
      let player = ctx.random.Shuffle(G.hand.filter(x => (x.onPlay && !["极境"].includes(x.name))))[0];
      if (player) {
        player.onPlay(G, ctx, player);
        logMsg(G, ctx, `触发 ${player.name} 的部署效果`);
      }
      else {
        logMsg(G, ctx, "没有合适的干员触发");
      }
    },
    onReinforce(G, ctx, self) {
      draw(G, ctx);
    },
    reinforce_desc: "摸1张牌",
  },
  
  
  {
    name:"巫恋",
    cost:3,
    atk:2,
    hp:2,
    mine:1,
    block:0,
    desc:"采掘: 使1个敌人获得易伤2，重复2次",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_117.png",
    reinforce: 2,
    onMine(G, ctx, self) {
      // let actor = ctx.random.Shuffle(G.field.filter(x => x.action))[0];
      // if (actor) {
      //   actor.action(G, ctx, actor);
      //   logMsg(G, ctx, `触发 ${actor.name} 的行动效果`);
      // }
      // let idx = G.field.indexOf(self);
      // if (~idx) {
      //   let enemy = G.efield[idx];
      //   if (enemy) {
      //     enemy.atk /= 2;
      //     enemy.hp /= 2;
      //   }
      // }
      // reduce_enemy_atk(G, ctx, 4);
      // reduce_enemy_atk(G, ctx, 4);
      for (let i=0; i<2+self.power; i++) {
        add_vulnerable(G, ctx, 2);
      }
    },
    // onReinforce(G, ctx, self) {
    //   G.costs += 2;
    // },
    reinforce_desc: "再重复1次",
  },
  
  {
    name:"刻刀",
    cost:2,
    atk:2,
    hp:1,
    mine:1,
    block:1,
    desc: "部署: 摧毁1个受到伤害的敌人",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_118.png",
    reinforce: 1,
    onPlay(G, ctx, self) {
      let damaged_enemy = ctx.random.Shuffle(G.efield.filter(x => (x.dmg > 0 && x.dmg < x.hp)))[0];
      if (damaged_enemy) {
        // let enemy_idx = G.efield.indexOf(damaged_enemy); // TODO: have a "list.remove()" funcion is better
        // G.efield.splice(enemy_idx, 1);
        // logMsg(G, ctx, `${damaged_enemy.name} 被摧毁`)
        damaged_enemy.dmg = damaged_enemy.hp;
      }
    },
    onReinforce(G, ctx, self) {
      deal_random_damage(G, ctx, 3);
    },
    reinforce_desc: "造成3点伤害",
  },
  // {
  //   name:"星熊",
  //   cost:6,
  //   atk:3,
  //   hp:3,
  //   mine:3,
  //   block:3,
  //   desc: "部署: 每有1张手牌，就获得+6生命值",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_119.png",
  //   reinforce: 1,
  //   onPlay(G, ctx, self) {
  //     let num_cards = G.hand.length;
  //     self.hp += 6 * num_cards;
  //   },
  //   onReinforce(G, ctx, self) {
  //     self.hp += 6;
  //     self.block += 1;
  //   },
  //   reinforce_desc: "+0/+6，阻挡数+1",
  // },
  // {
  //   name:"四月",
  //   cost:3,
  //   atk:2,
  //   hp:1,
  //   mine:0,
  //   block:0,
  //   desc: "部署: 重置场上所有干员，然后沉默所有被重置的干员并使其采掘力变为0",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_120.png",
  //   reinforce: 1,
  //   onPlay(G, ctx, self) {
  //     G.field.map(card => {
  //       if (card.exhausted) {
  //         card.exhausted = false;
  //         card.mine = 0;
  //         silent(card);
  //       }
  //     })
  //   },
  //   onReinforce(G, ctx, self) {
  //     self.atk += 3;
  //     self.hp += 1;
  //   },
  //   reinforce_desc: "+3/+1",
  // },
  {
    name:"惊蛰",
    cost:2,
    atk:3,
    hp:2,
    mine:2,
    block:0,
    desc:<span>行动: 消耗1组{material_icons.slice(0,3)}，获得6点费用</span>,
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_121.png",
    reinforce: 2,
    action(G, ctx, self) {
      if (payMaterials(G, ctx, [1,1,1,0])) {
        G.costs += 6;
      }
    },
    onReinforce(G, ctx, self) {
      G.costs += 2;
    },
    reinforce_desc: "获得2点费用",
  },

  // {
  //   name:"贾维",
  //   cost:3,
  //   atk:3,
  //   hp:2,
  //   mine:1,
  //   block:1,
  //   desc:"采掘: 弃2张牌，获得4点费用",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_122.png",
  //   onMine(G, ctx, self) {
  //     if (G.hand.length >= 2) {
  //       drop(G, ctx);
  //       drop(G, ctx);
  //       G.costs += 4;
  //     }
  //     else {
  //       logMsg(G, ctx, "手牌不足");
  //     }
  //   },
  //   reinforce: 1,
  //   reinforce_desc: "+2/+2",
  //   onReinforce(G, ctx, self) {
  //     self.atk += 2;
  //     self.hp += 2;
  //   }
  // },
  {
    name:"泥岩",
    cost:5,
    atk:6,
    hp:6,
    mine:2,
    block:2,
    desc:"部署: 消耗所有剩余费用，然后每消耗1点，就获得+3/+3",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_123.png",
    onPlay(G, ctx, self) {
      let cost_remained = G.costs;
      self.atk += 3 * cost_remained;
      self.hp += 3 * cost_remained;
      G.costs = 0;
    },
    reinforce: 1,
    reinforce_desc: "阻挡数+1",
    onReinforce(G, ctx, self) {
      self.block += 1;
    },
  },
  // {
  //   name:"断崖",
  //   cost:4,
  //   atk:5,
  //   hp:5,
  //   mine:2,
  //   block:1,
  //   desc:"行动: 弃2张牌，获得+2/+2，然后重置自己",
  //   illust:"",
  //   action(G, ctx, self) {
  //     if (G.hand.length >= 2) {
  //       drop(G, ctx);
  //       drop(G, ctx);
  //       self.atk += 2 + self.power;
  //       self.hp += 2 + self.power;
  //     }
  //     self.exhausted = false;
  //   },
  //   reinforce: 1,
  //   reinforce_desc: "再获得+1/+1",
  // },
  {
    name:"微风",
    cost:3,
    atk:0,
    hp:3,
    mine:3,
    block:0,
    desc:"行动: 弃2张牌，召唤1个4费干员",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_124.png",
    action(G, ctx, self) {
      if (G.hand.length >= 2) {
        drop(G, ctx);
        drop(G, ctx);
        let new_card = ctx.random.Shuffle(G.CARDS.filter(x=>(x.cost==4)))[0];
        summon(G, ctx, new_card, self);
      }
      else {
        logMsg(G, ctx, "手牌不足");
        self.exhausted = false;
      }
    },
    reinforce: 2,
    reinforce_desc: "召唤1个2费干员",
    onReinforce(G, ctx, self) {
      let new_card = ctx.random.Shuffle(G.CARDS.filter(x=>(x.cost==2)))[0];
      summon(G, ctx, new_card, self);
    },
  },
  // {
  //   name:"迷迭香",
  //   cost:4,
  //   atk:6,
  //   hp:3,
  //   mine:2,
  //   block:0,
  //   desc:"超杀: 召唤2个随机干员的1/1",
  //   illust:"https://z3.ax1x.com/2020/11/26/Ddxxbt.png",
  //   onPlay(G, ctx, self) {
  //   },
  //   onMine(G, ctx, self) {
  //   },
  //   onFight(G, ctx, self, enemy) {
  //   },
  //   action(G, ctx, self) {
  //   },
  //   reinforce: 1,
  //   reinforce_desc: "+2/+1",
  //   onReinforce(G, ctx, self) {
  //     self.atk += 2;
  //     self.hp += 1;
  //   },
  // },
  {
    name:"亚叶",
    cost:2,
    atk:3,
    hp:2,
    mine:2,
    block:0,
    desc:<span>行动: 消耗1组{material_icons.slice(0,3)}，召唤1个随机干员的6/6复制</span>,
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_125.png",
    action(G, ctx, self) {
      if (payMaterials(G, ctx, [1,1,1,0])) {
        let card = ctx.random.Shuffle(G.CARDS.filter(x => x.onMine || x.onFight || x.action))[0];
        card = {...card};
        card.atk = 6;
        card.hp = 6;
        card.mine = 3;
        card.cost = 5;
        summon(G, ctx, card, self);
      }
    },
    reinforce: 1,
    reinforce_desc: "造成3点伤害",
    onReinforce(G, ctx, self) {
      deal_random_damage(G, ctx, 3);
    },
  },{
    name:"史尔特尔",
    cost:4,
    atk:6,
    hp:3,
    mine:1,
    block:1,
    desc:"超杀: 消耗1点费用，重置自己",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_126.png",
    onFight(G, ctx, self, enemy) {
      // if (G.field.indexOf(self) == G.efield.indexOf(enemy) && payCost(G, ctx, 1)) {
      //   self.exhausted = false;
      // }
      if (enemy.dmg > enemy.hp && payCost(G, ctx, 1, true)) {
        self.exhausted = false;
      }
    },
    reinforce: 1,
    reinforce_desc: "+1/+1",
    onReinforce(G, ctx, self) {
      self.atk += 1;
      self.hp += 1;
    },
  },
  // {
  //   name:"流星",
  //   cost:2,
  //   atk:4,
  //   hp:2,
  //   mine:0,
  //   block:0,
  //   desc:"部署: 造成5点伤害",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_127.png",
  //   onPlay(G, ctx, self) {
  //     deal_random_damage(G, ctx, 5);
  //   },
  //   reinforce: 1,
  //   reinforce_desc: "造成3点伤害",
  //   onReinforce(G, ctx, self) {
  //     deal_random_damage(G, ctx, 3);
  //   },
  // },

  // {
  //     name:"空爆",
  //     cost:2,
  //     atk:4,
  //     hp:2,
  //     mine:1,
  //     block:0,
  //     desc:"采掘: 摧毁场上1个(重置的)干员，然后造成4点伤害，重复2次",
  //     illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_128.png",
  //     onMine(G, ctx, self) {
  //       if (eliminate_field(G, ctx, self)) {
  //         for (let i=0; i<(2+self.power); i++) {
  //           deal_random_damage(G, ctx, 4);
  //         }
  //       }
  //     },
  //     action(G, ctx, self) {
  //       if (self.power == 1) {
  //         let meteorite = G.CARDS.find(x => x.name == "陨星");
  //         Object.assign(self, meteorite);
  //         self.action = undefined;
  //       }
  //       else {
  //         logMsg(G, ctx, "只需要强化1次即可");
  //         self.exhausted = false;
  //       }
  //     },
  //     reinforce: 1,
  //     reinforce_desc: "再重复1次",
  //     // onReinforce(G, ctx, self) {
  //     //   deal_random_damage(G, ctx, 3);
  //     // },
  //   },

  {
    name:"卡达",
    cost:3,
    atk:3,
    hp:3,
    mine:1,
    block:1,
    desc:"行动: 本回合剩余时间内，使用其他干员采掘时，重置自己",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_129.png",
    action(G, ctx, self) {
      self.fever = true;
      G.onCardMine.push(
        (G, ctx, mcard) => {
          for (let card of G.field) {
            if (card.fever && (!mcard.fever)) {
              card.exhausted = false;
            }
          }
        }
      );
    },
    onTurnBegin(G, ctx, self) {
      self.fever = false;
    },
    reinforce: 2,
    reinforce_desc: "+2/+2",
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
  },

  {
    name:"白雪",
    cost:2,
    atk:3,
    hp:2,
    mine:1,
    block:0,
    desc: "采掘/战斗: 触发手牌中1个干员的采掘/战斗效果",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_130.png",
    reinforce: 1,
    onMine(G, ctx, self) {
      let miner = ctx.random.Shuffle(G.hand.filter(x => (x.onMine && !["白雪"].includes(x.name))))[0];
      if (miner) {
        miner.onMine(G, ctx, self);
        logMsg(G, ctx, `触发 ${miner.name} 的采掘效果`);
      }
      else {
        logMsg(G, ctx, "未找到合适的干员触发效果");
      }
    },
    onFight(G, ctx, self) {
      let fighter = ctx.random.Shuffle(G.hand.filter(x => (x.onFight && !["白雪"].includes(x.name))))[0];
      if (fighter) {
        fighter.onFight(G, ctx, self);
        logMsg(G, ctx, `触发 ${fighter.name} 的战斗效果`);
      }
      else {
        logMsg(G, ctx, "未找到合适的干员触发效果");
      }
    },
    onReinforce(G, ctx, self) {
      draw(G, ctx);
    },
    reinforce_desc: "摸1张牌",
  },
  
  

  // {
  //   name:"伊桑",
  //   cost:2,
  //   atk:2,
  //   hp:2,
  //   mine:1,
  //   block:0,
  //   desc: "行动: 变成手牌中1个干员的复制",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_131.png",
  //   reinforce: 3,
  //   action(G, ctx, self) {
  //     // if (G.field.length > 1){
  //     //   G.field[G.field.length-1] = Object.assign({}, ctx.random.Shuffle(G.field.slice(0,G.field.length-1))[0]);
  //     // }
  //     let card = choice(ctx, G.hand);
  //     if (card) {
  //       Object.assign(self, card);
  //       self.exhausted = false;
  //     }
  //   },
  //   onReinforce(G, ctx, self) {
  //     G.hand.unshift(enemy2card(G, ctx));
  //   },
  //   reinforce_desc: "将1张敌人牌加入手牌",
  // },
  
  {
    name:"W",
    cost:4,
    atk:6,
    hp:3,
    mine:1,
    block:0,
    desc:<span>行动: 消耗1组{material_icons.slice(0,3)}，造成4点伤害，重复4次</span>,

    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_132.png",
    // onPlay(G, ctx) {
    //   drawEnemy(G, ctx);
    // },
    action(G, ctx, self) {
      if (payMaterials(G, ctx, [1,1,1,0])) {
        for (let i=0; i<(4+self.power); i++) {
          deal_random_damage(G, ctx, 4);
        }
      }
    },
    reinforce: 1,
    // onReinforce(G, ctx, self) {
      // self.atk += 3;
      // self.hp += 3;
    // },
    reinforce_desc: "再重复1次",
  },

  {
    name:"陨星",
    cost:4,
    atk:3,
    hp:3,
    mine:1,
    block:0,
    desc: "战斗: 同时对其攻击目标相邻的敌人造成伤害",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_133.png",
    onFight(G, ctx, self, enemy) {
      let enemy_idx = G.efield.indexOf(enemy);
      for (let e of [G.efield[enemy_idx-1], G.efield[enemy_idx+1]]) {
        if (e) {
          e.dmg += self.atk;
        }
      }
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 1;
      self.hp += 1;
    },
    reinforce_desc: "+1/+1",
  },

 
  //  {
  //   name:"猎蜂",
  //   cost:1,
  //   atk:1,
  //   hp:1,
  //   mine:1,
  //   block:1,
  //   desc: "战斗: 激怒目标",
  //   illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_134.png",
  //   reinforce: 1,

  //   onFight(G, ctx, self, enemy) {
  //     enemy.enraged = true;
  //   },

  //   onReinforce(G, ctx, self) {
  //     self.atk += 3;
  //     self.hp += 3;
  //   },
  //   reinforce_desc: "+3/+3",
  // },

  {
    name:"拉普兰德",
    cost:4,
    atk:1,
    hp:2,
    mine:1,
    block:1,
    desc: "战斗: 将目标变成1/1并将其沉默",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_135.png",
    reinforce: 2,

    onFight(G, ctx, self, enemy) {
      let blank_enemy = {
        name: "源石虫",
        atk: 1,
        hp: 1,
        illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_7.png",
        dmg: 0,
        exhausted: false,
      };
      let idx = G.efield.indexOf(enemy);
      if (!enemy.is_boss) {
        G.efield[idx] = blank_enemy;
      }
    },

    onReinforce(G, ctx, self) {
      let texas = G.CARDS.find(x => (x.name == "德克萨斯"));
      texas.onMine = undefined;
      texas.desc = "";
      // G.field.push(init_card_state(G, ctx, {...texas}));
      summon(G, ctx, {...texas}, self);

      if (self.power >= 8) {
        achieve(G, ctx, "德克萨斯做得到吗", "使用拉普兰德部署8个德克萨斯", self);
      }
    },
    reinforce_desc: "召唤\"德克萨斯\"并将其沉默",
  },

  {
    name:"翎羽",
    cost:2,
    atk:2,
    hp:1,
    mine:1,
    block:1,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_137.png",
    reinforce: 1,
    desc: "部署: 重置1个干员",

    onPlay(G, ctx, self) {
      ready_random_card(G, ctx, self);
    },
    
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;

      if (self.power == 3) {
        let wind = G.CARDS.find(x => x.name == "风笛");
        if (~G.field.indexOf(self)) {
          Object.assign(self, wind);
        }
      }
    },
    reinforce_desc: "+2/+2",
  },
  // {
  //   name:"杜林",
  //   cost:5,
  //   atk:4,
  //   hp:7,
  //   mine:2,
  //   block:2,
  //   illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_138.png",
  //   reinforce: 1,
  //   desc: "摧毁: 如果\"巡林者\"也在弃牌堆，则部署\"夜刀\"",

  //   onOut(G, ctx, self) {
  //     let target = G.discard.find(x => x.name=="巡林者");
  //     if (target) {
  //       let dragon = G.CARDS.find(x => x.name=="夜刀");
  //       if (dragon) {
  //         G.field.push(init_card_state(G, ctx, Object.assign({}, dragon)));
  //       }
  //     }

  //   },
    
  //   onReinforce(G, ctx, self) {
  //     self.atk += 1;
  //     self.hp += 3;
  //   },
  //   reinforce_desc: "+1/+3",
  // },

  {
    name:"狮蝎",
    cost:3,
    atk:4,
    hp:3,
    mine:2,
    block:0,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_139.png",
    reinforce: 2,
    desc: "行动: 将场上所有干员变成高1费的干员",

    action(G, ctx, self) {
      for (let i=0; i<G.field.length; i++) {
        let card = G.field[i];
        let new_card = ctx.random.Shuffle(G.CARDS.filter(x=>(x.cost==(card.cost+1+(self.power||0)))))[0];
        if (new_card) {
          G.field.splice(i, 1, init_card_state(G, ctx, {...new_card}));
          for (let j=0; j<card.power; j++) {
            reinforce_card(G, ctx, G.field[i]);
          }
          G.field[i].exhausted = card.exhausted;
        }
      }
    },
    reinforce_desc: "费用再+1",
  },
  {
    name:"坚雷",
    cost:8,
    atk:4,
    hp:16,
    mine:2,
    block:2,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_140.png",
    reinforce: 1,
    desc: "行动: 获得1张干员牌，并强化其3次",
    action(G, ctx, self) {
      let card = {...ctx.random.Shuffle(G.CARDS)[0]};
      G.hand.unshift(card);
      for (let i=0; i<(3+self.power); i++) {
        reinforce_card(G, ctx, card);
      }
    },
    reinforce_desc: "再强化1次",
  },
  
  // {
  //   name:"暗索",
  //   cost:2,
  //   atk:2,
  //   hp:2,
  //   mine:1,
  //   block:1,
  //   illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_141.png",
  //   reinforce: 1,
  //   desc: "部署/行动: 从另一个游戏里偷1张牌",
  //   onPlay(G, ctx, self) {
  //     G.hand.unshift({...ctx.random.Shuffle(BORROWS)[0]});
  //   },
  //   action(G, ctx, self) {
  //     G.hand.unshift({...ctx.random.Shuffle(BORROWS)[0]});
  //   },
  //   reinforce_desc: "从另一个游戏里偷1张牌",
  //   onReinforce(G, ctx, self) {
  //     G.hand.unshift({...ctx.random.Shuffle(BORROWS)[0]});
  //   }
  // },

  {
    name:"可露希尔",
    cost:5,
    atk:1,
    hp:1,
    mine:1,
    block:0,
    illust: "https://s1.ax1x.com/2020/08/10/abkasx.png",
    reinforce: 1,
    desc: "部署: ？？？",
    onPlay(G, ctx) {
      for (let i=0; i<5; i++) {
        G.hand.unshift(generate_combined_card(G, ctx));
      }
    },
    reinforce_desc: "？？？",
    onReinforce(G, ctx) {
      G.hand.unshift(generate_combined_card(G, ctx));
    }
  },

].map(init_card);

export const BORROWS = [
  // {
  //   name:"陆逊",
  //   cost:3,
  //   atk:3,
  //   hp:3,
  //   mine:2,
  //   block:0,
  //   illust: "https://b-ssl.duitang.com/uploads/blog/201306/12/20130612021923_k3EJx.thumb.700_0.jpeg",
  //   was_enemy: true,
  //   reinforce: 1,
  //   desc: "行动: 当你失去最后的手牌时，你可以摸一张牌",
  //   action(G, ctx, self) {
  //     if (G.hand.length == 0) {
  //       draw(G, ctx);
  //       self.exhausted = false;
  //     }
  //   },
  //   reinforce_desc: "+2/+2",
  //   onReinforce(G, ctx, self) {
  //     self.atk += 2;
  //     self.hp += 2;
  //   }
  // },

  // {
  //   name:"凯露",
  //   cost:10,
  //   atk:3,
  //   hp:2,
  //   mine:2,
  //   block:0,
  //   illust: "https://img.moegirl.org/common/thumb/c/cb/Karyl.png/545px-Karyl.png",
  //   reinforce: 1,
  //   was_enemy: true,
  //   desc: "行动: 使1个敌人变成\"凯露\"",
  //   action(G, ctx, self) {
  //     let enemy = ctx.random.Shuffle(G.efield.filter(x => (x.name != "凯露")))[0];
  //     if (enemy) {
  //       G.efield[G.efield.indexOf(enemy)] = {...self, exhausted: false};
  //     }
  //   },
  //   reinforce_desc: "+2/+2",
  //   onReinforce(G, ctx, self) {
  //     self.atk += 2;
  //     self.hp += 2;
  //   }
  // },

  {
    name:"青眼白龙",
    cost:4,
    atk:3000,
    hp:2500,
    mine:4,
    block:1,
    illust: "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1495165458,392829716&fm=173&app=49&f=JPEG?w=544&h=544&s=B0A7DC140001EFF7589EB14603008098",
    was_enemy: true,
    reinforce: 1,
    desc: "召唤: 解放2个怪兽",
    onPlay(G, ctx, self) {
      if (G.field.length > 2) {
        G.field = G.field.slice(2);
      }
      else {
        G.field = G.field.slice(0, G.field.length-1);
      }
    },
    reinforce_desc: "获得1张\"青眼白龙\"",
    onReinforce(G, ctx, self) {
      G.hand.unshift({...self});
    }
  },

  // {
  //   name:"尤格萨隆",
  //   cost:10,
  //   atk:1,
  //   hp:1,
  //   mine:1,
  //   block:1,
  //   illust: "https://bkimg.cdn.bcebos.com/pic/0b46f21fbe096b63f62413aab97b9044ebf81b4c06ba?x-bce-process=image/watermark,g_7,image_d2F0ZXIvYmFpa2UyNzI=,xp_5,yp_5",
  //   reinforce: 1,
  //   was_enemy: true,
  //   desc: "战吼: 随机施放10个法术",
  //   onPlay(G, ctx, self) {
  //     for (let i=0; i<10; i++) {
  //       let effect = ctx.random.Shuffle(G.EFFECTS)[0];
  //       effect[1](G, ctx, self);
  //       logMsg(G, ctx, "施放 "+effect[0]);
  //     }
  //   },
  //   reinforce_desc: "随机施放1个法术",
  //   onReinforce(G, ctx, self) {
  //     let effect = ctx.random.Shuffle(G.EFFECTS)[0];
  //     effect[1](G, ctx, self);
  //     logMsg(G, ctx, "施放 "+effect[0]);
  //   }
  // },

  {
    name:"火车王",
    cost:2,
    atk:6,
    hp:2,
    mine:3,
    block:1,
    illust: "http://newsimg.5054399.com/uploads/userup/1405/1015531B059.jpg",
    reinforce: 1,
    was_enemy: true,
    desc: "战吼: 为对手召唤2只1/1的源石虫",
    onPlay(G, ctx, self) {
      let blank_enemy = {
        name: "源石虫",
        atk: 1,
        hp: 1,
        illust: "http://prts.wiki/images/3/3e/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E6%BA%90%E7%9F%B3%E8%99%AB.png",
        dmg: 0,
        exhausted: false,
      };
      G.efield.push({...blank_enemy});
      G.efield.push({...blank_enemy});
    },
    reinforce_desc: "+2/+2",
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    }
  },

  {
    name:"百变泽鲁斯",
    cost:1,
    atk:1,
    hp:1,
    mine:1,
    block:1,
    illust: "https://i03piccdn.sogoucdn.com/f8b756971cd5abcd",
    was_enemy: true,
    reinforce: 1,
    desc: "如果这张牌在你的手牌中，每个回合都会随机变成一张随从牌",
    onTurnBegin(G, ctx, self) {
      let idx = G.hand.indexOf(self);
      if (~idx) {
        G.hand[idx] = {...ctx.random.Shuffle(G.CARDS)[0], onTurnBegin: self.onTurnBegin, reinforce_desc: self.reinforce_desc, was_enemy:true}; // add "was enemy" to differ it from other cards, may got a better method, and meybe in the future other cards may use this feature "was_enemy" as well, but at this time only this card use this feature.
      }
    },
    reinforce_desc: "这张牌由百变泽鲁斯变成",
    onReinforce(G, ctx, self) {
      self.onTurnBegin(G, ctx, self);
    }
  },

].map(init_card);

export const heijiao_in_dream =  {
    name:"黑角",
    cost:1,
    atk:8,
    hp:8,
    mine:4,
    block:2,
    onPlayBonus: [],
    desc:"部署: 获得5000分",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_143.png",
    onPlay(G, ctx) {
      G.score += 5000;
    },
    action(G, ctx, self) {
      ready_random_card(G, ctx, self);
      ready_order(G, ctx);
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      G.costs += 2;
    },
    reinforce_desc: "获得2点费用",
};

export const extra_cards = [
  {
    name:"稀音",
    cost:0,
    atk:1,
    hp:1,
    mine:1,
    block:1,
    material:3,
    desc:"",
    illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_144.png",
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.hp += 3;
      self.atk += 3;
    },
    reinforce_desc: "+3/+3",
  },
  {
    name: "梅尔",
    generator(ctx) {
      let material = ctx.random.Die(3) - 1;
      return {
          name:"梅尔",
          cost:1,
          atk:3,
          hp:2,
          mine:2,
          block:0,
          material:3,
          desc: <span>行动: 消耗1个{material_icons[material]}，造成6点伤害</span>,
          illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_145.png",
          reinforce: 1,
      
          action(G, ctx) {
            let requirements = [0,0,0,0];
            requirements[material] = 1;
            if (payMaterials(G, ctx, requirements)) {
                deal_random_damage(G, ctx, 6);
            }
          },
          
          onReinforce(G, ctx) {
            deal_random_damage(G, ctx, 5);
          },
          reinforce_desc: "造成5点伤害",
        };
    }
  },
  {
    name: "麦哲伦",
    generate(ctx) {
      let name = choice(ctx, "麦迪文 麦当劳 麦当娜 麦克雷 麦旋风 麦克斯韦 张信哲 哥伦布 周杰伦 炎亚纶 拿破仑 达尔文 刘德华".split(" "));
      let values = choice(ctx, [
        {
          atk: 2,
          hp: 2,
          mine: 1,
          block: 2,
        },
        {
          atk: 4,
          hp: 2,
          mine: 0,
          block: 1,
        },
        {
          atk: 0,
          hp: 2,
          mine: 2,
          block: 1,
        },
      ]);
      return {
          name,
          ...values,
          cost:1,
          material:3,
          illust:"https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_146.png",
          reinforce: 1,
          onReinforce(G, ctx) {
            deal_random_damage(G, ctx, 5);
          },
          reinforce_desc: "造成5点伤害",
        };
    }
  },
    
].map(init_card);

export const default_filter = x => x;

const type_filter = (type_,deck) => classes[type_].map(name => deck.find(card => card.name == name)).filter(card => card);

export const FILTERS = [
  
  {
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_147.png",
    f(deck) {
      return type_filter("producers", deck);
    }
  },

  {
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_148.png",
    f(deck) {
      return type_filter("solvers", deck);
    }
  },
  {
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_149.png",
    f(deck) {
      return type_filter("miners", deck);
    }
  },

  {
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_150.png",
    f(deck) {
      return type_filter("standers", deck);
    }
  },

  {
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_151.png",
    f(deck) {
      return type_filter("defenders", deck);
    }
  },

  {
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_152.png",
    f(deck) {
      return type_filter("supporters", deck);
    }
  },

  {
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_cards_153.png",
    f(deck) {
      return type_filter("scorers", deck);
    }
  },

  {
    illust: "https://z3.ax1x.com/2020/12/08/r9iiyq.png",
    f(deck) {
      return type_filter("randomizers", deck);
    }
  },

];

export const default_deck = CARDS.map(x => `1 ${x.name}`).join("\n");