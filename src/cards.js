import { 
  deal_damage, draw, deal_random_damage, gainMaterials,
  move, exhaust_random_enemy, ready_random_card, cure, 
  payCost, 
} from './Game';

export var CARDS = [
  {
    name: "克洛丝",
    cost: 1,
    atk: 3,
    hp: 1,
    mine: 1,
    block: 0,
    illust: "http://ak.mooncell.wiki/images/b/ba/%E7%AB%8B%E7%BB%98_%E5%85%8B%E6%B4%9B%E4%B8%9D_1.png",
  },

  {
    name: "阿米娅",
    cost: 3,
    atk: 4,
    hp: 2,
    mine: 2,
    block: 0,
    illust: "http://ak.mooncell.wiki/images/d/dd/%E7%AB%8B%E7%BB%98_%E9%98%BF%E7%B1%B3%E5%A8%85_1.png",
    desc: "采掘: 获得1分",
    onMine(G, ctx) {
      G.score += 1;
    }
  },

  {
    name: "杰西卡",
    cost: 3,
    atk: 5,
    hp: 2,
    mine: 1,
    block: 0,
    illust: "http://ak.mooncell.wiki/images/9/96/%E7%AB%8B%E7%BB%98_%E6%9D%B0%E8%A5%BF%E5%8D%A1_1.png",
    desc: "采掘: 造成3点伤害",
    onMine(G, ctx) {
      deal_random_damage(G, ctx, 3);
    }
  },

  {
    name: "玫兰莎",
    cost: 2,
    atk: 2,
    hp: 3,
    mine: 1,
    block: 1,
    illust: "http://ak.mooncell.wiki/images/0/09/%E7%AB%8B%E7%BB%98_%E7%8E%AB%E5%85%B0%E8%8E%8E_1.png",
  },

  {
    name: "米格鲁",
    cost: 2,
    atk: 0,
    hp: 5,
    mine: 1,
    block: 2,
    illust: "http://ak.mooncell.wiki/images/4/44/%E7%AB%8B%E7%BB%98_%E7%B1%B3%E6%A0%BC%E9%B2%81_1.png",
  },

  {
    name: "史都华德",
    cost: 2,
    atk: 2,
    hp: 2,
    mine: 2,
    block: 0,
    illust: "http://ak.mooncell.wiki/images/4/44/%E7%AB%8B%E7%BB%98_%E5%8F%B2%E9%83%BD%E5%8D%8E%E5%BE%B7_1.png",
  },

  {
    name: "12F",
    cost: 6,
    atk: 6,
    hp: 4,
    mine: 5,
    block: 0,
    illust: "http://ak.mooncell.wiki/images/6/61/%E7%AB%8B%E7%BB%98_12F_1.png",
  },

  {
    name: "黑角",
    cost: 8,
    atk: 8,
    hp: 8,
    mine: 4,
    block: 2,
    illust: "http://ak.mooncell.wiki/images/d/dc/%E7%AB%8B%E7%BB%98_%E9%BB%91%E8%A7%92_1.png",
  },

  {
    name: "巡林者",
    cost: 5,
    atk: 8,
    hp: 4,
    mine: 3,
    block: 0,
    illust: "http://ak.mooncell.wiki/images/c/c8/%E7%AB%8B%E7%BB%98_%E5%B7%A1%E6%9E%97%E8%80%85_1.png",
  },

  {
    name: "芬",
    cost: 3,
    atk: 1,
    hp: 2,
    mine: 1,
    block: 1,
    desc: "部署: 摸2张牌",
    illust: "http://ak.mooncell.wiki/images/a/af/%E7%AB%8B%E7%BB%98_%E8%8A%AC_1.png",
    onPlay(G, ctx) {
      draw(G, ctx);
      draw(G, ctx);
    },
  },

  {
    name: "炎熔",
    cost: 3,
    atk: 4,
    hp: 2,
    mine: 2,
    block: 0,
    illust:"http://ak.mooncell.wiki/images/8/80/%E7%AB%8B%E7%BB%98_%E7%82%8E%E7%86%94_1.png",
    onFight(G, ctx) {
      gainMaterials(G, ctx, 1);
    }
  },

  {
    name: "桃金娘",
    cost: 2,
    atk: 2,
    hp: 2,
    mine: 1,
    block: 0,
    illust:"http://ak.mooncell.wiki/images/4/42/%E7%AB%8B%E7%BB%98_%E6%A1%83%E9%87%91%E5%A8%98_1.png",
    desc: "行动：获得3点费用",
    action(G, ctx) {
      G.costs += 3;
    }
  },
  {
    name:"香草", 
    cost:3, 
    atk:4, 
    hp:3, 
    mine:1, 
    block:1, 
    desc:"战斗：获得2点费用", 
    illust:"http://ak.mooncell.wiki/images/a/a0/%E7%AB%8B%E7%BB%98_%E9%A6%99%E8%8D%89_1.png",
    onFight(G, ctx) {
      G.costs += 2;
    }
  },

  {
    name:"讯使", 
    cost:3, 
    atk:2, 
    hp:4, 
    mine:1, 
    block:1, 
    desc:"采掘：获得2点费用", 
    illust:"http://ak.mooncell.wiki/images/1/16/%E7%AB%8B%E7%BB%98_%E8%AE%AF%E4%BD%BF_1.png",
    onMine(G, ctx) {
      G.costs += 2;
    }
  },
  
  {
    name:"德克萨斯", 
    cost:3, 
    atk:5, 
    hp:2, 
    mine:1, 
    block:1, 
    desc:"采掘：横置1个敌人，然后每有1个横置的敌人，就获得1点费用", 
    illust:"http://ak.mooncell.wiki/images/f/fc/%E7%AB%8B%E7%BB%98_%E5%BE%B7%E5%85%8B%E8%90%A8%E6%96%AF_1.png",
    onMine(G, ctx) {
      exhaust_random_enemy(G, ctx);
      let num_exhausted = G.efield.filter(x=>x.exhausted).length;
      G.costs += num_exhausted;
    }
  },
  
  {
    name:"风笛", 
    cost:3, 
    atk:4, 
    hp:3, 
    mine:2, 
    block:1, 
    desc:"行动：打出牌库顶的1张牌", 
    illust:"http://ak.mooncell.wiki/images/5/5e/%E7%AB%8B%E7%BB%98_%E9%A3%8E%E7%AC%9B_1.png",
    action(G, ctx) {
      let card = move(G, ctx, "deck", "field");
      card.dmg = 0;
      card.exhausted = G.exhausted_enter;
      //EH: add "init field card state" function
    }
  },
  
  {
    name:"红豆", 
    cost:4, 
    atk:3, 
    hp:1, 
    mine:2, 
    block:1, 
    desc:"亡语：获得3点费用", 
    illust:"http://ak.mooncell.wiki/images/7/70/%E7%AB%8B%E7%BB%98_%E7%BA%A2%E8%B1%86_1.png",
    onOut(G, ctx) {
      G.costs += 3;
    }
  },
  
  {
    name:"推进之王", 
    cost:5, 
    atk:3, 
    hp:3, 
    mine:1, 
    block:1, 
    desc:"部署：所有手牌的费用-1", 
    illust:"http://ak.mooncell.wiki/images/6/6f/%E7%AB%8B%E7%BB%98_%E6%8E%A8%E8%BF%9B%E4%B9%8B%E7%8E%8B_1.png",
    onPlay(G, ctx) {
      for (let card of G.hand) {
        card.cost -= 1;
      }
    }
  },
  
  {
    name:"能天使", 
    cost:3, 
    atk:5, 
    hp:2, 
    mine:1, 
    block:0, 
    desc:"攻击被横置的敌人时，伤害+3", 
    illust:"http://ak.mooncell.wiki/images/b/bd/%E7%AB%8B%E7%BB%98_%E8%83%BD%E5%A4%A9%E4%BD%BF_1.png",
    onFight(G, ctx, self, enemy) {
      if (enemy.exhausted) {
        let idx = G.efield.indexOf(enemy);
        if (idx > 0) {
          deal_damage(G, ctx, "efield", idx, 3);
        }
      }
    }
  },
  
  {
    name:"蓝毒", 
    cost:4, 
    atk:5, 
    hp:3, 
    mine:2, 
    block:0, 
    desc:"战斗：对一个敌人造成3点伤害", 
    illust:"http://ak.mooncell.wiki/images/6/66/%E7%AB%8B%E7%BB%98_%E8%93%9D%E6%AF%92_1.png",
    onFight(G, ctx) {
      deal_random_damage(G, ctx, 3);
    }
  },
  
  {
    name:"杜宾", 
    cost:4, 
    atk:3, 
    hp:3, 
    mine:1, 
    block:1, 
    desc:"部署：场上所有干员获得+1/+1", 
    illust:"http://ak.mooncell.wiki/images/2/25/%E7%AB%8B%E7%BB%98_%E6%9D%9C%E5%AE%BE_1.png",
    onPlay(G, ctx) {
      for (let card of G.hand) {
        card.atk += 1;
        card.hp += 1;
      }
    }
  },
  
  {
    name:"陈", 
    cost:6, 
    atk:4, 
    hp:4, 
    mine:2, 
    block:1, 
    desc:"部署：对两名敌人造成3点伤害", 
    illust:"http://ak.mooncell.wiki/images/b/bc/%E7%AB%8B%E7%BB%98_%E9%99%88_1.png",
    onPlay(G, ctx) {
      deal_random_damage(G, ctx, 3);
      deal_random_damage(G, ctx, 3);
    }
  },
  
  {
    name:"芙兰卡", 
    cost:4, 
    atk:4, 
    hp:5, 
    mine:2, 
    block:1, 
    desc:"_", 
    illust:"http://ak.mooncell.wiki/images/6/6c/%E7%AB%8B%E7%BB%98_%E8%8A%99%E5%85%B0%E5%8D%A1_1.png",
  },
  
  {
    name:"星极", 
    cost:6, 
    atk:4, 
    hp:4, 
    mine:3, 
    block:1, 
    desc:"部署：获得2个D32钢", 
    illust:"http://ak.mooncell.wiki/images/b/bb/%E7%AB%8B%E7%BB%98_%E6%98%9F%E6%9E%81_1.png",
    onPlay(G, ctx) {
      G.materials[3] += 2;
    }
  },
  
  {
    name:"蛇屠箱", 
    cost:3, 
    atk:2, 
    hp:5, 
    mine:1, 
    block:2, 
    desc:"行动：获得+3生命值", 
    illust:"http://ak.mooncell.wiki/images/c/c7/%E7%AB%8B%E7%BB%98_%E8%9B%87%E5%B1%A0%E7%AE%B1_1.png",
    action(G, ctx, self) {
      self.hp += 3;
    }
  },
  
  {
    name:"可颂", 
    cost:6, 
    atk:3, 
    hp:8, 
    mine:1, 
    block:2, 
    desc:"采掘/战斗：横置1个敌人", 
    illust:"http://ak.mooncell.wiki/images/6/62/%E7%AB%8B%E7%BB%98_%E5%8F%AF%E9%A2%82_1.png",
    onMine(G, ctx) {
      exhaust_random_enemy(G, ctx);
    },
    onFight(G, ctx) {
      exhaust_random_enemy(G, ctx);
    }
  },
  
  {
    name:"雷蛇", 
    cost:6, 
    atk:3, 
    hp:8, 
    mine:1, 
    block:2, 
    desc:"采掘/战斗：重置1个干员", 
    illust:"http://ak.mooncell.wiki/images/3/39/%E7%AB%8B%E7%BB%98_%E9%9B%B7%E8%9B%87_1.png",
    onMine(G, ctx) {
      ready_random_card(G, ctx);
    },
    onFight(G, ctx) {
      ready_random_card(G, ctx);
    }
  },
  
  {
    name:"芙蓉", 
    cost:2, 
    atk:0, 
    hp:2, 
    mine:1, 
    block:0, 
    desc:"行动：使一名干员获得+4生命值", 
    illust:"http://ak.mooncell.wiki/images/f/f3/%E7%AB%8B%E7%BB%98_%E6%B8%85%E6%B5%81_1.png",
    action(G, ctx) {
      cure(G, ctx, 4);
    }
  },
  
  {
    name:"清流", 
    cost:4, 
    atk:0, 
    hp:3, 
    mine:3, 
    block:0, 
    desc:"行动：使一名干员获得+6生命值", 
    illust:"http://ak.mooncell.wiki/images/e/e9/%E7%AB%8B%E7%BB%98_%E9%97%AA%E7%81%B5_1.png",
    action(G, ctx) {
      cure(G, ctx, 6);
    }
  },
  
  {
    name:"空", 
    cost:3, 
    atk:0, 
    hp:3, 
    mine:2, 
    block:0, 
    desc:"行动：横置2个敌人", 
    illust:"http://ak.mooncell.wiki/images/f/f0/%E7%AB%8B%E7%BB%98_%E7%A9%BA_1.png",
    action(G, ctx) {
      exhaust_random_enemy(G, ctx);
      exhaust_random_enemy(G, ctx);
    }
  },
  
  {
    name:"阿消", 
    cost:4, 
    atk:3, 
    hp:4, 
    mine:2, 
    block:1, 
    desc:"行动：消耗3点费用，获得4分", 
    illust:"http://ak.mooncell.wiki/images/c/c6/%E7%AB%8B%E7%BB%98_%E9%98%BF%E6%B6%88_1.png",
    action(G, ctx) {
      if (payCost(G, ctx, 3)) {
        G.score += 4;
      }
    }
  },
  

];

export const default_deck = CARDS.map(x => `1 ${x.name}`).join("\n");