import 
  { drawEnemy, switchEnemy, deal_damage, enemyMove,
    get_blocker, logMsg, ready_random_card,
 } from "./Game";

export var ENEMIES = [
  {
    name: "小兵",
    atk: 2,
    hp: 3,
    illust: "http://prts.wiki/images/3/34/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E5%A3%AB%E5%85%B5.png",
  },
  {
    name: "游击队战士",
    atk: 1,
    hp: 2,
    illust: "http://prts.wiki/images/a/ac/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E6%B8%B8%E5%87%BB%E9%98%9F%E6%88%98%E5%A3%AB.png",
    desc: "入场: 使1个敌人获得+2/+2",
    onPlay(G, ctx, self) {
      let enemy = ctx.random.Shuffle(G.efield)[0];
      enemy.atk += 2;
      enemy.hp += 2;
    }
  },
  {
    name: "弩手",
    atk: 2,
    hp: 4,
    illust: "http://prts.wiki/images/a/a5/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E5%B0%84%E6%89%8B.png",
    desc: "行动: 对最后部署的单位，造成[攻击力]点伤害",
    action(G, ctx, self) {
      let card = G.field[G.field.length-1];
      if (card) {
        card.dmg += self.atk;
      }
    }
  },
  {
    name: "猎犬",
    atk: 2,
    hp: 2,
    illust: "http://prts.wiki/images/3/3f/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E7%8C%8E%E7%8B%97.png",
    desc: "冲锋",
    onPlay(G, ctx, self) {
      self.exhausted = false;
    }
  },
  {
    name: "源石虫",
    atk: 1,
    hp: 1,
    illust: "http://prts.wiki/images/3/3e/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E6%BA%90%E7%9F%B3%E8%99%AB.png",
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
    illust: "http://prts.wiki/images/f/f0/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E9%87%8D%E8%A3%85%E9%98%B2%E5%BE%A1%E8%80%85.png",
    desc: "替换",
    is_elite: true,
  },
  {
    name: "破阵者",
    atk: 3,
    hp: 2,
    illust: "http://prts.wiki/images/f/f2/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E7%A0%B4%E9%98%B5%E8%80%85.png",
    desc: "动乱: 额外增加1点动乱值",
    onMine(G, ctx) {
      G.danger += 1;
    }
  },
  {
    name: "术师",
    atk: 2,
    hp: 4,
    illust: "http://prts.wiki/images/0/02/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E6%9C%AF%E5%B8%88.png",
    desc: "行动: 对1个无阻挡能力干员，造成[攻击力]点伤害",
    action(G, ctx, self) {
      let high = G.field.filter(x => (x.block == 0));
      if (high.length > 0) {
        ctx.random.Shuffle(high)[0].dmg += self.atk;
      }
    }
  },
  {
    name: "空降兵",
    atk: 2,
    hp: 2,
    illust: "http://prts.wiki/images/f/f7/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E7%A9%BA%E9%99%8D%E5%85%B5.png",
    desc: "入场: 使1个敌人获得+2攻击力",
    onPlay(G, ctx) {
      ctx.random.Shuffle(G.efield)[0].atk += 2;
    }
  },
  {
    name: "高阶术师",
    atk: 2,
    hp: 6,
    illust: "http://prts.wiki/images/b/b9/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E9%AB%98%E9%98%B6%E6%9C%AF%E5%B8%88.png",
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
    illust: "http://prts.wiki/images/6/68/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E9%AB%98%E8%83%BD%E6%BA%90%E7%9F%B3%E8%99%AB.png",
    desc: "摧毁: 对1个随机干员造成[攻击力+2]点伤害",
    onOut(G, ctx, self) {
      if (G.field.length > 0) {
        let idx = ctx.random.Die(G.field.length) - 1;
        deal_damage(G, ctx, "field", idx, self.atk+2);
        logMsg(G, ctx, `高能源石虫对 ${G.field[idx].name} 造成了${self.atk+2}点伤害`);
      }
    }
  },
  
  {
    name: "双持剑士",
    atk: 2,
    hp: 4,
    illust: "http://prts.wiki/images/d/d8/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E5%8F%8C%E6%8C%81%E5%89%91%E5%A3%AB%E7%BB%84%E9%95%BF.png",
    desc: "无法被横置",
    unyielding: true,
  },

  {
    name: "寻仇者",
    atk: 2,
    hp: 4,
    illust: "http://prts.wiki/images/d/d0/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E5%AF%BB%E4%BB%87%E8%80%85.png",
    desc: "愤怒",
    enraged: true,
  },

  {
    name: "复仇者",
    atk: 3,
    hp: 6,
    illust: "http://prts.wiki/images/1/14/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E5%A4%8D%E4%BB%87%E8%80%85.png",
    desc: "替换，愤怒，超杀: 增加1点动乱值",
    is_elite: true,
    enraged: true,
    onFight(G, ctx, self, card) {
      if (card.dmg > card.hp) {
        G.danger += 1;
      }
    },
  },
  
  {
    name: "碎岩者",
    illust: "http://prts.wiki/images/b/bd/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E7%A2%8E%E5%B2%A9%E8%80%85.png",
    atk: -3,
    hp: 8,
    onTurnBegin(G, ctx, self) {
      if (self.atk <= 0) {
        self.atk = 1;
      }
    }
  },

  {
    name: "碎岩者组长",
    illust: "http://prts.wiki/images/b/bf/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E7%A2%8E%E5%B2%A9%E8%80%85%E7%BB%84%E9%95%BF.png",
    atk: -2,
    hp: 12,
    desc: "替换",
    is_elite: true,
    onTurnBegin(G, ctx, self) {
      if (self.atk <= 0) {
        self.atk = 1;
      }
    }
  },

  {
    name: "酸液源石虫",
    illust: "http://prts.wiki/images/6/6b/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E9%85%B8%E6%B6%B2%E6%BA%90%E7%9F%B3%E8%99%AB%C2%B7%CE%B1.png",
    atk: 1,
    hp: 2,
    desc: "替换, 入场/摧毁: 对所有干员造成1点伤害",
    is_elite: true,
    onPlay(G, ctx, self) {
      for (let card of G.field) {
        card.dmg += 1;
      }
    },
    onOut(G, ctx, self) {
      self.onPlay(G, ctx, self);
    }
  },

  {
    name: "拳手",
    atk: 4,
    hp: 4,
    illust: "http://prts.wiki/images/e/e5/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E6%89%93%E6%89%8B.png",
    desc: "摧毁: 重置1个干员",
    onOut(G, ctx, self) {
      ready_random_card(G, ctx, self);
    }
  },
  
  {
    name: "哨兵",
    atk: 0,
    hp: 4,
    illust: "http://prts.wiki/images/1/16/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E8%90%A8%E5%8D%A1%E5%85%B9%E5%93%A8%E5%85%B5.png",
    desc: "行动: 翻开1张敌人牌",
    action(G, ctx, self) {
      drawEnemy(G, ctx);
    }
  },

  {
    name: "狂暴宿主组长",
    atk: -2,
    hp: 6,
    is_elite: true,
    illust: "http://prts.wiki/images/e/ec/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E7%8B%82%E6%9A%B4%E5%AE%BF%E4%B8%BB%E6%8E%B7%E9%AA%A8%E6%89%8B.png",
    desc: "替换，摧毁: 胜利所需分数+4",
    onOut(G, ctx, self) {
      G.goal += 4;
    },
    onTurnBegin(G, ctx, self) {
      if (self.atk <= 0) {
        self.atk = 1;
      }
    }
  },


];