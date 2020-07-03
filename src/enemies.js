import 
  { drawEnemy, switchEnemy, deal_damage, enemyMove,

 } from "./Game";

export var ENEMIES = [
  {
    name: "小兵",
    atk: 3,
    hp: 3,
    illust: "http://ak.mooncell.wiki/images/3/34/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E5%A3%AB%E5%85%B5.png",
  },
  {
    name: "猎犬",
    atk: 2,
    hp: 2,
    illust: "http://ak.mooncell.wiki/images/3/3f/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E7%8C%8E%E7%8B%97.png",
    desc: "冲锋",
    onPlay(G, ctx, self) {
      self.exhausted = false;
    }
  },
  {
    name: "源石虫",
    atk: 1,
    hp: 1,
    illust: "http://ak.mooncell.wiki/images/3/3e/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E6%BA%90%E7%9F%B3%E8%99%AB.png",
    desc: "涌动",
    onPlay(G, ctx) {
      drawEnemy(G, ctx);
    }
  },
  {
    name: "重装",
    atk: 4,
    hp: 6,
    illust: "http://ak.mooncell.wiki/images/f/f0/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E9%87%8D%E8%A3%85%E9%98%B2%E5%BE%A1%E8%80%85.png",
    desc: "替换",
    is_elite: true,
  },
  {
    name: "破阵者",
    atk: 3,
    hp: 2,
    illust: "http://ak.mooncell.wiki/images/f/f2/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E7%A0%B4%E9%98%B5%E8%80%85.png",
    desc: "动乱: 额外增加1点动乱值",
    onUnrest(G, ctx) {
      G.danger += 1;
    }
  },
  {
    name: "术师",
    atk: 2,
    hp: 4,
    illust: "http://ak.mooncell.wiki/images/0/02/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E6%9C%AF%E5%B8%88.png",
    desc: "行动: 对1个无阻挡能力单位，造成等同于自己攻击力的伤害",
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
    illust: "http://ak.mooncell.wiki/images/f/f7/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E7%A9%BA%E9%99%8D%E5%85%B5.png",
    desc: "入场：使1个敌人获得+3攻击力",
    onPlay(G, ctx) {
      ctx.random.Shuffle(G.efield)[0].atk += 3;
    }
  },
  {
    name: "高阶术师",
    atk: 2,
    hp: 6,
    illust: "http://ak.mooncell.wiki/images/b/b9/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E9%AB%98%E9%98%B6%E6%9C%AF%E5%B8%88.png",
    is_elite: true,
    desc: "替换，行动：对所有干员造成等同于自己攻击力的伤害",
    action(G, ctx, self) {
      for (let card of G.field) {
        card.dmg += self.atk;
      }
    }
  },

  {
    name: "高能源石虫",
    atk: 1,
    hp: 3,
    illust: "http://ak.mooncell.wiki/images/6/68/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E9%AB%98%E8%83%BD%E6%BA%90%E7%9F%B3%E8%99%AB.png",
    desc: "亡语：对1个随机干员造成{攻击力+2}点伤害",
    onOut(G, ctx, self) {
      if (G.field.length > 0) {
        let idx = ctx.random.Die(G.field.length) - 1;
        deal_damage(G, ctx, "field", idx, self.atk+2);
      }
    }
    
  },
  
  {
    name: "双持剑士",
    atk: 3,
    hp: 2,
    illust: "http://ak.mooncell.wiki/images/d/d8/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E5%8F%8C%E6%8C%81%E5%89%91%E5%A3%AB%E7%BB%84%E9%95%BF.png",
    desc: "无法被横置",
    unyielding: true,
  },

  {
    name: "寻仇者",
    atk: 3,
    hp: 4,
    illust: "http://ak.mooncell.wiki/images/d/d0/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E5%AF%BB%E4%BB%87%E8%80%85.png",
    desc: "愤怒",
    enraged: true,
  },

  {
      name: "复仇者",
      atk: 4,
      hp: 6,
      illust: "http://ak.mooncell.wiki/images/1/14/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E5%A4%8D%E4%BB%87%E8%80%85.png",
      desc: "替换，愤怒，超杀：再次攻击",
      is_elite: true,
      enraged: true,
      onFight(G, ctx, self, card) {
        let idx = G.efield.indexOf(self);
        if (card.dmg > card.hp) {
          self.exhausted = false;
          enemyMove(G, ctx, idx);
        }
      },
    
  },

];