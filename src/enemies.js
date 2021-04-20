import React from 'react';
import 
  { drawEnemy, switchEnemy, deal_damage, enemyMove,
    get_blocker, logMsg, ready_random_card, clearField, draw, gainMaterials, init_card_state, choice
 } from "./Game";

export const ENEMIES = [
  // --- Good enemies begin ---
  {
    name: "小兵",
    atk: 2,
    hp: 3,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_0.png",
  },
  {
    name: "游击队战士",
    atk: 1,
    hp: 1,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_1.png",
    desc: "入场: 使1个敌人获得+2/+2",
    onPlay(G, ctx, self) {
      // let enemy = ctx.random.Shuffle(G.efield)[0];
      let enemy = G.efield[0];
      if (enemy) {
        enemy.atk += 2;
        enemy.hp += 2;
      }
    }
  },
  {
    name: "敌方能天使",
    atk: 2,
    hp: 4,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_2.png",
    desc: "行动: 对最后部署的干员造成[攻击力]点伤害",
    action(G, ctx, self) {
      let card = G.field[G.field.length-1];
      if (card) {
        card.dmg += self.atk;
      }
    }
  },
  {
    name: "雪怪小队",
    atk: 3,
    hp: 4,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_3.png",
    desc: "摧毁: 摸2张牌",
    onOut(G, ctx) {
      draw(G, ctx);
      draw(G, ctx);
    }
  },
  {
    name: "法术大师A2",
    atk: 4,
    hp: 5,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_4.png",
    desc: "摧毁: 获得2个材料",
    onOut(G, ctx) {
      gainMaterials(G, ctx, 2);
    }
  },

  {
    name: "敌方风笛",
    atk: 5,
    hp: 6,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_5.png",
    desc: "摧毁: 打出牌库顶的1张牌",
    onOut(G, ctx) {
      let new_card = G.deck[0];
      G.deck = G.deck.slice(1);
      if (new_card != undefined) {
        G.field.push(init_card_state(G, ctx, {...new_card}));
        logMsg(G, ctx, `打出 ${new_card.name}`);
      }
    }
  },

  {
    name: "猎犬",
    atk: 1,
    hp: 2,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_6.png",
    desc: "冲锋",
    onPlay(G, ctx, self) {
      self.exhausted = false;
    }
  },
  {
    name: "源石虫",
    atk: 1,
    hp: 1,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_7.png",
    desc: "入场: 召唤1个1/1的源石虫",
    onPlay(G, ctx, self) {
      let self_copy = {...self, atk:1, hp:1};
      G.efield.splice(G.efield.length-1, 0, self_copy);
    }
  },
  {
    name: "重装",
    atk: 4,
    hp: 6,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_8.png",
    desc: "替换",
    is_elite: true,
  },
  {
    name: "破阵者",
    atk: 3,
    hp: 2,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_9.png",
    desc: "动乱: 额外增加1点动乱值",
    onMine(G, ctx) {
      G.danger += 1;
    }
  },
  {
    name: "术师",
    atk: 2,
    hp: 2,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_10.png",
    desc: "行动: 对1个无阻挡能力干员，造成[攻击力]点伤害",
    action(G, ctx, self) {
      let high = G.field.filter(x => (x.block == 0));
      if (high.length > 0) {
        ctx.random.Shuffle(high)[0].dmg += self.atk;
      }
    }
  },
  // {
  //   name: "空降兵",
  //   atk: 2,
  //   hp: 2,
  //   illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_11.png",
  //   desc: "入场: 使1个敌人获得+2攻击力",
  //   onPlay(G, ctx) {
  //     // ctx.random.Shuffle(G.efield)[0].atk += 2;
  //     let enemy = G.efield[0];
  //     if (enemy) {
  //       enemy.atk += 2;
  //     }
  //   }
  // },
  {
    name: "高阶术师",
    atk: 2,
    hp: 4,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_12.png",
    is_elite: true,
    desc: "替换, 行动: 对2个无阻挡能力干员, 造成[攻击力]点伤害",
    action(G, ctx, self) {
      let high = G.field.filter(x => (x.block == 0));
      for (let card of ctx.random.Shuffle(high).slice(0,2)) {
        card.dmg += self.atk;
      }
    }
  },

  {
    name: "高能源石虫",
    atk: 1,
    hp: 2,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_13.png",
    desc: "摧毁: 对最后部署的干员造成[攻击力+2]点伤害",
    onOut(G, ctx, self) {
      let idx = G.field.length - 1;
      if (G.field[idx]) {
        deal_damage(G, ctx, "field", idx, self.atk+2);
        logMsg(G, ctx, `高能源石虫对 ${G.field[idx].name} 造成了${self.atk+2}点伤害`);
      }
    }
  },

  {
    name: "乌萨斯刁民",
    atk: -3,
    hp: 6,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_14.png",
    desc: "摧毁: 获得2点费用",
    onOut(G, ctx) {
      G.costs += 2;
    }
  },
  {
    name: "冰爆源石虫",
    atk: -2,
    hp: 1,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_15.png",
    desc: "摧毁: 失去2点费用",
    onOut(G, ctx) {
      G.costs -= 2;
    }
  },

  // --- Good Enemies Above ---
  
  // {
  //   name: "双持剑士",
  //   atk: 2,
  //   hp: 4,
  //   illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_16.png",
  //   desc: "无法被横置",
  //   unyielding: true,
  // },

  {
    name: "寻仇者",
    atk: 3,
    hp: 3,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_17.png",
    desc: "愤怒",
    enraged: true,
  },

  // {
  //   name: "复仇者",
  //   atk: 3,
  //   hp: 6,
  //   illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_28.png",
  //   desc: "替换，愤怒，超杀: 增加1点动乱值",
  //   is_elite: true,
  //   enraged: true,
  //   onFight(G, ctx, self, card) {
  //     if (card.dmg > card.hp) {
  //       G.danger += 1;
  //     }
  //   },
  // },
  
  // {
  //   name: "碎岩者",
  //   illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_19.png",
  //   atk: -3,
  //   hp: 8,
  //   // onTurnBegin(G, ctx, self) {
  //   //   if (self.atk <= 0) {
  //   //     self.atk = 1;
  //   //   }
  //   // }
  // },

  {
    name: "碎岩者组长",
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_20.png",
    atk: -2,
    hp: 12,
    desc: "替换",
    is_elite: true,
    // onTurnBegin(G, ctx, self) {
    //   if (self.atk <= 0) {
    //     self.atk = 1;
    //   }
    // }
  },

  // {
  //   name: "酸液源石虫",
  //   illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_21.png",
  //   atk: -1,
  //   hp: 4,
  //   desc: "替换, 摧毁: 对所有干员造成1点伤害",
  //   is_elite: true,
  //   onOut(G, ctx, self) {
  //     for (let card of G.field) {
  //       card.dmg += 1;
  //     }
  //   },
  // },

  {
    name: "拳手",
    atk: 5,
    hp: 5,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_22.png",
    desc: "摧毁: 重置一个干员",
    onOut(G, ctx, self) {
      ready_random_card(G, ctx, self);
    }
  },

  {
    name: "法术近卫",
    atk: 4,
    hp: 4,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_23.png",
    desc: "摧毁: 获得2分",
    onOut(G, ctx, self) {
      G.score += 2;
    }
  },

  {
    name: "法术近卫组长",
    atk: 8,
    hp: 8,
    is_elite: true,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_24.png",
    desc: "摧毁: 获得6分",
    onOut(G, ctx, self) {
      G.score += 6;
    }
  },
  
  {
    name: "哨兵",
    atk: 0,
    hp: 2,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_25.png",
    desc: "行动: 翻开1张敌人牌",
    action(G, ctx, self) {
      drawEnemy(G, ctx);
    },
    onTurnBegin(G, ctx, self) {
      if (self.atk > 0) {
        self.atk = 0;
      }
    }
  },

  {
    name: "瓦斯车",
    atk: 2,
    hp: 4,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/enemy_gas.png",
    desc: "摧毁: 对所有其他敌人造成2点伤害",
    onOut(G, ctx) {
      for (let enemy of G.efield) {
        enemy.dmg += 2;
      }
    }
  },

  {
    name: "敌方安洁莉娜",
    atk: 5,
    hp: 5,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/enemy_angelina.png",
    desc: "摧毁: 触发手牌中一个干员的\"部署:\"效果(极境除外)",
    onOut(G, ctx) {
      let player = choice(ctx, G.hand.filter(x => x.onPlay && (x.name != "极境")));
      if (player) {
        player.onPlay(G, ctx, player);
        logMsg(G, ctx, `触发 ${player.name} 的部署效果`);
      }
    }
  },

  {
    name: "得意",
    atk: 5,
    hp: 5,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/enemy_deyi.png",
    desc: "摧毁: 对一个敌人造成5点伤害",
    onOut(G, ctx) {
      let enemy = choice(ctx, G.efield);
      if (enemy) {
        enemy.dmg += 5;
      }
    }
  },

  // {
  //   name: "狂暴宿主组长",
  //   atk: -2,
  //   hp: 6,
  //   is_elite: true,
  //   illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_26.png",
  //   desc: "替换，摧毁: 胜利所需分数+4",
  //   onOut(G, ctx, self) {
  //     G.goal += 4;
  //   },
  //   // onTurnBegin(G, ctx, self) {
  //   //   if (self.atk <= 0) {
  //   //     self.atk = 1;
  //   //   }
  //   // }
  // },


];

export const BOSSES = [
  {
    name: "大泡普",
    atk: 4,
    hp: 1,
    is_boss: true,
    is_elite: true,
    enraged: true,
    illust: "https://dadiaogames.gitee.io/images/imagebed/bigbob.png",
    desc: <span>愤怒，超杀: 失去1点费用<br/>摧毁: 获得15分</span>,
    onFight(G, ctx, self, card) {
      if (card.dmg > card.hp) {
        G.costs -= 1;
      }
    },
    onOut(G, ctx) {
      G.score += 15;
    }
  },

  {
    name: "锈锤战士",
    atk: 5,
    hp: 1,
    is_boss: true,
    is_elite: true,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_27.png",
    desc: <span>行动: 对最后部署的干员造成5点伤害<br/>摧毁: 获得15分</span>,
    action(G, ctx, self) {
      let card = G.field[G.field.length-1];
      if (card) {
        card.dmg += self.atk;
        if (card.dmg > card.hp) {
          G.field = G.field.filter(x => x != card)
        }
      }
    },
    onOut(G, ctx) {
      G.score += 15;
    }
  },
  {
    name: "复仇者",
    atk: 99,
    hp: 1,
    is_boss: true,
    is_elite: true,
    illust: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_enemies_28.png",
    desc: <span>超杀: 增加1点动乱值<br/>摧毁: 获得80分</span>,
    onFight(G, ctx, self, card) {
      if (card.dmg > card.hp) {
        G.danger += 1;
      }
    },
    onOut(G, ctx) {
      G.score += 80;
    }
  },
];