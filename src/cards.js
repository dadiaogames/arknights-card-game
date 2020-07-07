import React from 'react';
import { 
  deal_damage, draw, deal_random_damage, gainMaterials,
  move, exhaust_random_enemy, ready_random_card, cure, 
  payCost, get_rhine_order, init_card_state, payMaterials,
  reinforce_hand, reinforce_card, enemy2card, logMsg,
  generate_combined_card,
} from './Game';
import { material_icons } from './orders';

export var CARDS = [
  {
    name: "克洛丝",
    cost: 1,
    atk: 3,
    hp: 1,
    mine: 1,
    block: 0,
    illust: "http://ak.mooncell.wiki/images/b/ba/%E7%AB%8B%E7%BB%98_%E5%85%8B%E6%B4%9B%E4%B8%9D_1.png",
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
    mine: 2,
    block: 0,
    illust: "http://ak.mooncell.wiki/images/d/dd/%E7%AB%8B%E7%BB%98_%E9%98%BF%E7%B1%B3%E5%A8%85_1.png",
    desc: "采掘: 获得1分",
    onMine(G, ctx, self) {
      G.score += 1 + 2 * self.power;
    },
    reinforce: 3,
    reinforce_desc: "再获得2分",
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
    onMine(G, ctx, self) {
      deal_random_damage(G, ctx, 3+2*self.power);
    },
    reinforce: 1,
    reinforce_desc: "伤害+2",
  },

  {
    name: "玫兰莎",
    cost: 2,
    atk: 3,
    hp: 3,
    mine: 1,
    block: 1,
    illust: "http://ak.mooncell.wiki/images/0/09/%E7%AB%8B%E7%BB%98_%E7%8E%AB%E5%85%B0%E8%8E%8E_1.png",
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
    reinforce_desc: "+2/+2",
  },

  {
    name: "米格鲁",
    cost: 2,
    atk: 0,
    hp: 6,
    mine: 1,
    block: 2,
    illust: "http://ak.mooncell.wiki/images/4/44/%E7%AB%8B%E7%BB%98_%E7%B1%B3%E6%A0%BC%E9%B2%81_1.png",
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.hp += 4;
    },
    reinforce_desc: "+0/+4",
  },

  {
    name: "史都华德",
    cost: 2,
    atk: 2,
    hp: 2,
    mine: 3,
    block: 0,
    illust: "http://ak.mooncell.wiki/images/4/44/%E7%AB%8B%E7%BB%98_%E5%8F%B2%E9%83%BD%E5%8D%8E%E5%BE%B7_1.png",
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.mine += 1;
    },
    reinforce_desc: "<+1>",
  },

  {
    name: "12F",
    cost: 6,
    atk: 6,
    hp: 4,
    mine: 5,
    block: 0,
    illust: "http://ak.mooncell.wiki/images/6/61/%E7%AB%8B%E7%BB%98_12F_1.png",
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.mine += 3;
    },
    reinforce_desc: "<+3>",
  },

  {
    name: "黑角",
    cost: 8,
    atk: 8,
    hp: 8,
    mine: 4,
    block: 2,
    illust: "http://ak.mooncell.wiki/images/d/dc/%E7%AB%8B%E7%BB%98_%E9%BB%91%E8%A7%92_1.png",
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.atk += 5;
      self.hp += 5;
    },
    reinforce_desc: "+5/+5",
  },

  {
    name: "巡林者",
    cost: 5,
    atk: 7,
    hp: 4,
    mine: 2,
    block: 0,
    illust: "http://ak.mooncell.wiki/images/c/c8/%E7%AB%8B%E7%BB%98_%E5%B7%A1%E6%9E%97%E8%80%85_1.png",
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 3;
      self.hp += 1;
    },
    reinforce_desc: "+3/+1",
  },

  {
    name: "芬",
    cost: 2,
    atk: 1,
    hp: 2,
    mine: 1,
    block: 1,
    desc: "部署: 摸2张牌",
    illust: "http://ak.mooncell.wiki/images/a/af/%E7%AB%8B%E7%BB%98_%E8%8A%AC_1.png",
    onPlay(G, ctx, self) {
      draw(G, ctx);
      draw(G, ctx);
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      draw(G, ctx);
      draw(G, ctx);
    },
    reinforce_desc: "摸2张牌",
  },

  
  {
    name: "桃金娘",
    cost: 2,
    atk: 2,
    hp: 2,
    mine: 1,
    block: 1,
    illust:"http://ak.mooncell.wiki/images/4/42/%E7%AB%8B%E7%BB%98_%E6%A1%83%E9%87%91%E5%A8%98_1.png",
    desc: "行动: 获得3点费用，本回合阻挡数-1",
    onTurnBegin(G, ctx, self) {
      if (self.block <= 0) {
        self.block = 1;
      }
    },
    action(G, ctx, self) {
      G.costs += 3 + 3 * self.power;
      self.block -= 1;
    },
    reinforce: 2,
    reinforce_desc: "再获得3点费用",
  },

  {
    name:"香草", 
    cost:3, 
    atk:4, 
    hp:3, 
    mine:1, 
    block:1, 
    desc:"战斗: 获得2点费用", 
    illust:"http://ak.mooncell.wiki/images/a/a0/%E7%AB%8B%E7%BB%98_%E9%A6%99%E8%8D%89_1.png",
    onFight(G, ctx, self) {
      G.costs += 2 + 2 * self.power;
    },
    reinforce: 1,
    reinforce_desc: "再获得2点费用",
  },

  {
    name:"讯使", 
    cost:3, 
    atk:2, 
    hp:3, 
    mine:1, 
    block:1, 
    desc:"采掘: 获得4点费用", 
    illust:"http://ak.mooncell.wiki/images/1/16/%E7%AB%8B%E7%BB%98_%E8%AE%AF%E4%BD%BF_1.png",
    onMine(G, ctx, self) {
      G.costs += 4 + 2 * self.power;
    },
    reinforce: 1,
    reinforce_desc: "再获得2点费用",
  },

  {
    name:"清道夫", 
    cost:3, 
    atk:3, 
    hp:4, 
    mine:1, 
    block:1, 
    desc:"采掘/战斗: 摸1张牌", 
    illust:"https://img.moegirl.org/common/1/1d/%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E7%AB%8B%E7%BB%98_%E6%B8%85%E9%81%93%E5%A4%AB_1.png",
    onMine(G, ctx) {
      draw(G, ctx);
    },
    onFight(G, ctx) {
      draw(G, ctx);
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
    atk:5, 
    hp:2, 
    mine:1, 
    block:1, 
    desc:"采掘: 横置1个敌人，然后每有1个横置的敌人，就获得1点费用", 
    illust:"http://ak.mooncell.wiki/images/f/fc/%E7%AB%8B%E7%BB%98_%E5%BE%B7%E5%85%8B%E8%90%A8%E6%96%AF_1.png",
    onMine(G, ctx, self) {
      exhaust_random_enemy(G, ctx);
      let num_exhausted = G.efield.filter(x=>x.exhausted).length;
      G.costs += num_exhausted + self.power * 2;
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
    reinforce_desc: "+2/+2",
  },
  
  {
    name:"风笛", 
    cost:4, 
    atk:4, 
    hp:3, 
    mine:2, 
    block:1, 
    desc:"行动: 打出牌库顶的1张牌", 
    illust:"http://ak.mooncell.wiki/images/5/5e/%E7%AB%8B%E7%BB%98_%E9%A3%8E%E7%AC%9B_1.png",
    action(G, ctx, self) {
      let card = move(G, ctx, "deck", "field");
      init_card_state(G, ctx, card);
      //EH: add "init field card state" function
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
    reinforce_desc: "+2/+2",
  },
  
  {
    name:"红豆", 
    cost:3, 
    atk:3, 
    hp:2, 
    mine:1, 
    block:1, 
    desc:"亡语: 将手牌中的1个干员部署到场上", 
    illust:"http://ak.mooncell.wiki/images/7/70/%E7%AB%8B%E7%BB%98_%E7%BA%A2%E8%B1%86_1.png",
    onOut(G, ctx, self) {
      if (G.hand.length > 0) {
        let idx = ctx.random.Die(G.hand.length) - 1;
        let card = G.hand.splice(idx, 1)[0];
        G.field.push(card);
        init_card_state(G, ctx, card);
      }
      G.costs += 3 * self.power;
    },
    reinforce: 1,
    reinforce_desc: "并返还3点费用",
  },
  
  {
    name:"推进之王", 
    cost:4, 
    atk:3, 
    hp:3, 
    mine:1, 
    block:1, 
    desc:"部署: 所有手牌的费用-1", 
    illust:"http://ak.mooncell.wiki/images/6/6f/%E7%AB%8B%E7%BB%98_%E6%8E%A8%E8%BF%9B%E4%B9%8B%E7%8E%8B_1.png",
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
    },
    reinforce_desc: "触发1次\"部署:\"效果",
  },

  {
    name: "炎熔",
    cost: 3,
    atk: 4,
    hp: 2,
    mine: 2,
    block: 0,
    desc: "战斗: 获得1个材料",
    illust:"http://ak.mooncell.wiki/images/8/80/%E7%AB%8B%E7%BB%98_%E7%82%8E%E7%86%94_1.png",
    onFight(G, ctx, self) {
      gainMaterials(G, ctx, 1+2*self.power);
    },
    reinforce: 3,
    reinforce_desc: "再获得2个材料",
  },

   
  {
    name:"蓝毒", 
    cost:4, 
    atk:5, 
    hp:3, 
    mine:2, 
    block:0, 
    desc:"战斗: 对1个敌人造成3点伤害", 
    illust:"http://ak.mooncell.wiki/images/6/66/%E7%AB%8B%E7%BB%98_%E8%93%9D%E6%AF%92_1.png",
    onFight(G, ctx, self) {
      deal_random_damage(G, ctx, 3+self.power*2);
    },
    reinforce: 1,
    reinforce_desc: "伤害+2",
  },
  
  {
    name:"杜宾", 
    cost:5, 
    atk:2, 
    hp:2, 
    mine:1, 
    block:1, 
    desc:"部署: 使场上所有其他干员获得+2/+2", 
    illust:"http://ak.mooncell.wiki/images/2/25/%E7%AB%8B%E7%BB%98_%E6%9D%9C%E5%AE%BE_1.png",
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
      for (let card of G.field) {
        if (card != self) {
          card.atk += 1;
          card.hp += 1;
        }
      }
    },
    reinforce_desc: "使场上所有其他干员获得+1/+1",
  }, 
  
  {
    name:"天火", 
    cost:5, 
    atk:3, 
    hp:2, 
    mine:1, 
    block:0, 
    desc:"部署: 场上所有其他干员获得<+2>", 
    illust:"http://ak.mooncell.wiki/images/c/c2/%E7%AB%8B%E7%BB%98_%E5%A4%A9%E7%81%AB_1.png",
    onPlay(G, ctx, self) {
      for (let card of G.field) {
        if (card != self) {
          card.mine += 2;
        }
      }
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.mine += 3;
    },
    reinforce_desc: "<+3>",
  },

  
  {
    name:"陈", 
    cost:6, 
    atk:4, 
    hp:4, 
    mine:2, 
    block:1, 
    desc:"部署: 造成4点伤害，重复2次", 
    illust:"http://ak.mooncell.wiki/images/b/bc/%E7%AB%8B%E7%BB%98_%E9%99%88_1.png",
    onPlay(G, ctx, self) {
      deal_random_damage(G, ctx, 4);
      deal_random_damage(G, ctx, 4);
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      if (self.onPlay) {
        self.onPlay(G, ctx);
      }
    },
    reinforce_desc: "触发1次\"部署:\"效果",
  },
  
  {
    name:"芙兰卡", 
    cost:4, 
    atk:4, 
    hp:5, 
    mine:2, 
    block:1, 
    illust:"http://ak.mooncell.wiki/images/6/6c/%E7%AB%8B%E7%BB%98_%E8%8A%99%E5%85%B0%E5%8D%A1_1.png",
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.atk += 5;
      self.hp += 5;
    },
    reinforce_desc: "+5/+5",
  },
  
  {
    name:"星极", 
    cost:5, 
    atk:3, 
    hp:4, 
    mine:2, 
    block:1, 
    desc: <span>部署: 获得3个{material_icons[3]}</span>, 
    illust:"http://ak.mooncell.wiki/images/b/bb/%E7%AB%8B%E7%BB%98_%E6%98%9F%E6%9E%81_1.png",
    onPlay(G, ctx, self) {
      G.materials[3] += 3;
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      G.materials[3] += 1;
    },
    reinforce_desc: <span>获得1个{material_icons[3]}</span>,
  },
  
  {
    name:"蛇屠箱", 
    cost:3, 
    atk:2, 
    hp:5, 
    mine:1, 
    block:2, 
    desc:"行动: 获得+3生命值", 
    illust:"http://ak.mooncell.wiki/images/c/c7/%E7%AB%8B%E7%BB%98_%E8%9B%87%E5%B1%A0%E7%AE%B1_1.png",
    action(G, ctx, self) {
      self.hp += 3 + 2 * self.power;
    },
    reinforce: 1,
    reinforce_desc: "再获得+2生命值",
  },
  
  {
    name:"可颂", 
    cost:6, 
    atk:3, 
    hp:8, 
    mine:1, 
    block:2, 
    desc:"采掘/战斗: 横置1个敌人", 
    illust:"http://ak.mooncell.wiki/images/6/62/%E7%AB%8B%E7%BB%98_%E5%8F%AF%E9%A2%82_1.png",
    onMine(G, ctx, self) {
      exhaust_random_enemy(G, ctx);
    },
    onFight(G, ctx, self) {
      exhaust_random_enemy(G, ctx);
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.hp += 8;
    },
    reinforce_desc: "+0/+8",
  },
  
  {
    name:"雷蛇", 
    cost:6, 
    atk:3, 
    hp:8, 
    mine:1, 
    block:2, 
    desc:"采掘/战斗: 重置1个干员", 
    illust:"http://ak.mooncell.wiki/images/3/39/%E7%AB%8B%E7%BB%98_%E9%9B%B7%E8%9B%87_1.png",
    onMine(G, ctx, self) {
      ready_random_card(G, ctx, self);
    },
    onFight(G, ctx, self) {
      ready_random_card(G, ctx, self);
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.hp += 8;
    },
    reinforce_desc: "+0/+8",
  },
  
  {
    name:"芙蓉", 
    cost:2, 
    atk:0, 
    hp:2, 
    mine:1, 
    block:0, 
    desc:"行动: 使1个干员获得+5生命值", 
    illust:"http://ak.mooncell.wiki/images/b/b9/%E7%AB%8B%E7%BB%98_%E8%8A%99%E8%93%89_1.png",
    action(G, ctx, self) {
      cure(G, ctx, 5 + 3 * self.power);
    },
    reinforce: 1,
    reinforce_desc: "再获得+3生命值",
  },

  {
    name:"安赛尔", 
    cost:2,
    atk:0, 
    hp:2, 
    mine:2, 
    block:0, 
    desc:"行动: 使1个干员获得+2/+2", 
    illust:"http://ak.mooncell.wiki/images/e/e4/%E7%AB%8B%E7%BB%98_%E5%AE%89%E8%B5%9B%E5%B0%94_1.png",
    action(G, ctx, self) {
      let card = ctx.random.Shuffle(G.field)[0];
      if (card) {
        card.atk += 2 + self.power;
        card.hp += 2 + self.power;
      }
    },
    reinforce: 1,
    reinforce_desc: "再获得+1/+1",
  },
  
  {
    name:"清流", 
    cost:4, 
    atk:0, 
    hp:3, 
    mine:3, 
    block:0, 
    desc:"行动: 使1个干员获得+9生命值", 
    illust:"http://ak.mooncell.wiki/images/f/f3/%E7%AB%8B%E7%BB%98_%E6%B8%85%E6%B5%81_1.png",
    action(G, ctx, self) {
      cure(G, ctx, 9);
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      cure(G, ctx, 5);
    },
    reinforce_desc: "使1个干员获得+5生命值",
  },

  {
    name:"嘉维尔", 
    cost:3, 
    atk:0, 
    hp:3, 
    mine:2, 
    block:0, 
    desc:"行动: 使1个干员获得+4攻击力", 
    illust:"http://ak.mooncell.wiki/images/f/f0/%E7%AB%8B%E7%BB%98_%E5%98%89%E7%BB%B4%E5%B0%94_1.png",
    action(G, ctx, self) {
      let field = G.field.filter(x => (x != self));
      let card = ctx.random.Shuffle(field)[0];
      if (card) {
        card.atk += 4;
      }
    },
    onReinforce(G, ctx, self) {
      // TODO: reconstruct this, find a way that only calling a function is enough and it can be used in all creatures, like static method?
      let field = G.field.filter(x => (x != self));
      let card = ctx.random.Shuffle(field)[0];
      if (card) {
        card.atk += 3;
      }
    },
    reinforce: 1,
    reinforce_desc: "使1个干员获得+3攻击力",
  },
  
  {
    name:"空", 
    cost:4, 
    atk:0, 
    hp:3, 
    mine:3, 
    block:0, 
    desc:"行动: 横置2个敌人", 
    illust:"http://ak.mooncell.wiki/images/f/f0/%E7%AB%8B%E7%BB%98_%E7%A9%BA_1.png",
    action(G, ctx, self) {
      exhaust_random_enemy(G, ctx);
      exhaust_random_enemy(G, ctx);
    },
    onReinforce(G, ctx, self) {
      self.mine += 3;
    },
    reinforce: 2,
    reinforce_desc: "<+3>",
  },
  
  {
    name:"阿消", 
    cost:4, 
    atk:3, 
    hp:4, 
    mine:2, 
    block:1, 
    desc:"行动: 消耗3点费用，获得4分", 
    illust:"http://ak.mooncell.wiki/images/c/c6/%E7%AB%8B%E7%BB%98_%E9%98%BF%E6%B6%88_1.png",
    action(G, ctx, self) {
      if (payCost(G, ctx, 3-2*self.power)) {
        G.score += 4;
      }
    },
    reinforce: 1,
    reinforce_desc: "消耗费用-2",
  },

  {
    name:"赫默",
    cost:3,
    atk:2,
    hp:2,
    mine:1,
    block:1,
    desc:"部署: 获得2个\"莱茵生命订单\"",
    illust:"http://ak.mooncell.wiki/images/7/7f/%E7%AB%8B%E7%BB%98_%E8%B5%AB%E9%BB%98_1.png",
    onPlay(G, ctx, self) {
      get_rhine_order(G, ctx);
      get_rhine_order(G, ctx);
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      get_rhine_order(G, ctx);
    },
    reinforce_desc: "获得1个\"莱茵生命订单\"",
  },
  
  {
    name:"白面鸮",
    cost:4,
    atk:0,
    hp:3,
    mine:3,
    block:0,
    desc:"行动: 重置1个干员，获得1个\"莱茵生命订单\"",
    illust:"http://ak.mooncell.wiki/images/a/ac/%E7%AB%8B%E7%BB%98_%E7%99%BD%E9%9D%A2%E9%B8%AE_1.png",
    action(G, ctx, self) {
      get_rhine_order(G, ctx);
      ready_random_card(G, ctx, self);
    },
    reinforce: 1,
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
    desc:"行动: 重置所有已完成的订单",
    illust:"http://ak.mooncell.wiki/images/5/53/%E7%AB%8B%E7%BB%98_%E4%BC%8A%E8%8A%99%E5%88%A9%E7%89%B9_1.png",
    action(G, ctx, self) {
      for (let order of G.finished) {
        order.exhausted = false;
      }
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.mine += 3;
    },
    reinforce_desc: "<+3>",
  },
  
  {
    name:"远山",
    cost:3,
    atk:4,
    hp:2,
    mine:2,
    block:0,
    desc:"采掘: 重置1个已完成的订单",
    illust:"http://ak.mooncell.wiki/images/4/4a/%E7%AB%8B%E7%BB%98_%E8%BF%9C%E5%B1%B1_1.png",
    onMine(G, ctx, self) {
      for (let order of ctx.random.Shuffle(G.finished)) {
        if (order.exhausted) {
          order.exhausted = false;
          break;
        }
      }
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 4;
      self.hp += 2;
    },
    reinforce_desc: "+4/+2",
  },
  
  {
    name:"塞雷娅",
    cost:7,
    atk:3,
    hp:6,
    mine:2,
    block:3,
    desc:"部署: 每有1个已完成的订单，就获得+1/+2",
    illust:"http://ak.mooncell.wiki/images/4/4e/%E7%AB%8B%E7%BB%98_%E5%A1%9E%E9%9B%B7%E5%A8%85_1.png",
    onPlay(G, ctx, self) {
      let num_finished = G.finished.length;
      self.atk += num_finished;
      self.hp += 2 * num_finished;
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.block += 1;
    },
    reinforce_desc: "阻挡数+1",
  },
  
  {
    name:"艾雅法拉",
    cost:4,
    atk:4,
    hp:3,
    mine:3,
    block:0,
    desc:"采掘: 触发场上所有干员的\"采掘:\"效果",
    illust:"http://ak.mooncell.wiki/images/c/c0/%E7%AB%8B%E7%BB%98_%E8%89%BE%E9%9B%85%E6%B3%95%E6%8B%89_1.png",
    onMine(G, ctx, self) {
      if (~G.field.indexOf(self)) { // To prevent reinforce hand infinite loop
        for (let card of G.field) {
          if (card.onMine && (card.name != self.name)) {
            card.onMine(G, ctx, card);
          }
        }
      }
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      let miners = G.deck.filter(x => x.onMine);
      if (miners.length > 0) {
        let card = ctx.random.Shuffle(miners)[0];
        G.hand.unshift(Object.assign({}, card));
      }
    },
    reinforce_desc: "检索1张有\"采掘:\"效果的牌",
  },

  {
    name:"能天使", 
    cost:4, 
    atk:5, 
    hp:3, 
    mine:2, 
    block:0, 
    desc:"战斗: 触发场上所有干员的\"战斗:\"效果", 
    illust:"http://ak.mooncell.wiki/images/b/bd/%E7%AB%8B%E7%BB%98_%E8%83%BD%E5%A4%A9%E4%BD%BF_1.png",
    onFight(G, ctx, self, enemy) {
      if (~G.field.indexOf(self)) {
        for (let card of G.field) {
          if (card.onFight && (card.name != self.name)) {
            card.onFight(G, ctx, card, enemy);
          }
        }
      }
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      let fighters = G.deck.filter(x => x.onFight);
      if (fighters.length > 0) {
        let card = ctx.random.Shuffle(fighters)[0];
        G.hand.unshift(Object.assign({}, card));
      }
    },
    reinforce_desc: "检索1张有\"战斗:\"效果的牌",
  },
  {
    name:"温蒂", 
    cost:5, 
    atk:5, 
    hp:6, 
    mine:2, 
    block:1, 
    desc:"行动: 触发场上所有干员的\"行动:\"效果", 
    illust:"http://ak.mooncell.wiki/images/2/26/%E7%AB%8B%E7%BB%98_%E6%B8%A9%E8%92%82_1.png",
    action(G, ctx, self, enemy) {
      if (~G.field.indexOf(self)) {
        for (let card of G.field) {
          if (card.action && (card.name != self.name)) {
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
    mine:3,
    block:1,
    desc:"部署: 触发手牌中所有干员的\"部署:\"效果",
    illust:"http://ak.mooncell.wiki/images/f/fe/%E7%AB%8B%E7%BB%98_%E5%AE%89%E6%B4%81%E8%8E%89%E5%A8%9C_1.png",
    onPlay(G, ctx, self) {
      for (let card of G.hand.map(x=>x)) { //Copy the list to prevent infinite loop
        if (card.onPlay && (card.name != self.name)) {
          card.onPlay(G, ctx, self);
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
    name:"煌",
    cost:6,
    atk:5,
    hp:6,
    mine:2,
    block:1,
    desc:"超杀: 每造成2点额外伤害，就获得1分",
    illust:"http://ak.mooncell.wiki/images/3/38/%E7%AB%8B%E7%BB%98_%E7%85%8C_1.png",
    onFight(G, ctx, self, enemy) {
      if (enemy.dmg > enemy.hp) {
        let delta = enemy.dmg - enemy.hp;
        let score_gained = Math.floor(delta / 2);
        G.score += score_gained;
        logMsg(G, ctx, `使用 煌 获得${score_gained}分`);
      }
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 1;
      self.hp += 3;
    },
    reinforce_desc: "+1/+3",
  },

  {
    name:"刻俄柏",
    cost:5,
    atk:4,
    hp:3,
    mine:2,
    block:0,
    desc:"部署/采掘/战斗: 造成3点伤害, 随机分配到所有敌人身上",
    illust:"http://prts.wiki/images/3/3d/%E7%AB%8B%E7%BB%98_%E5%88%BB%E4%BF%84%E6%9F%8F_1.png",
    onPlay(G, ctx, self) {
      for (let i=0; i<(3*(1+self.power)); i++) {
        deal_random_damage(G, ctx, 1);
      }
    },
    onMine(G, ctx, self) {
      for (let i=0; i<(3*(1+self.power)); i++) {
        deal_random_damage(G, ctx, 1);
      }
    },
    onFight(G, ctx, self) {
      for (let i=0; i<(3*(1+self.power)); i++) {
        deal_random_damage(G, ctx, 1);
      }
    },
    reinforce: 1,
    reinforce_desc: "伤害+3",
  },

  
  {
    name:"莫斯提马",
    cost:4,
    atk:6,
    hp:3,
    mine:2,
    block:0,
    desc:"采掘: 每有1个被横置的敌人，就再获得1个材料",
    illust:"http://ak.mooncell.wiki/images/c/cd/%E7%AB%8B%E7%BB%98_%E8%8E%AB%E6%96%AF%E6%8F%90%E9%A9%AC_1.png",
    onMine(G, ctx, self) {
      let num_exhausted = G.efield.filter(x=>x.exhausted).length;
      gainMaterials(G, ctx, num_exhausted);
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.mine += 1;
    },
    reinforce_desc: "<+1>",
  },

  {
    name:"银灰",
    cost:6,
    atk:5,
    hp:6,
    mine:2,
    block:1,
    desc: <span>采掘/战斗: 消耗1个{material_icons[3]}，并重置自己</span>,
    illust:"http://ak.mooncell.wiki/images/0/03/%E7%AB%8B%E7%BB%98_%E9%93%B6%E7%81%B0_1.png",
    onMine(G, ctx, self) {
      if (payMaterials(G, ctx, [0,0,0,1])) {
        self.exhausted = false;
      }
    },
    onFight(G, ctx, self) {
      if (payMaterials(G, ctx, [0,0,0,1])) {
        self.exhausted = false;
      }
    },
    reinforce: 2,
    reinforce_desc: "+3/+1 <+1>",
    onReinforce(G, ctx, self) {
      self.atk += 3;
      self.hp += 1;
      self.mine += 1;
    }
  },
  {
    name:"崖心",
    cost:3,
    atk:3,
    hp:4,
    mine:1,
    block:1,
    desc:<span>行动: 消耗1个{material_icons[3]}，获得3分</span>,
    illust:"http://ak.mooncell.wiki/images/a/a7/%E7%AB%8B%E7%BB%98_%E5%B4%96%E5%BF%83_1.png",
    action(G, ctx, self) {
      if (payMaterials(G, ctx, [0,0,0,1])) {
        G.score += 3 + self.power;
      }
    },
    reinforce: 1,
    reinforce_desc: "再获得1分",
  },
  {
    name:"初雪",
    cost:3,
    atk:4,
    hp:3,
    mine:2,
    block:0,
    desc:<span>行动: 获得1个{material_icons[3]}，然后每有1组{material_icons.slice(0,3)}，就再获得1个{material_icons[3]}</span>,
    illust:"http://ak.mooncell.wiki/images/d/de/%E7%AB%8B%E7%BB%98_%E5%88%9D%E9%9B%AA_1.png",
    action(G, ctx, self) {
      G.materials[3] += 1 + G.materials.slice(0,3).sort()[0];
    },
    reinforce: 1,
    reinforce_desc: "获得2点费用",
    onReinforce(G, ctx, self) {
      G.costs += 2;
    },
  },
  {
    name:"角峰",
    cost:4,
    atk:2,
    hp:5,
    mine:1,
    block:2,
    desc:<span>部署: 每有1个{material_icons[3]}，就获得+1/+1</span>,
    illust:"http://ak.mooncell.wiki/images/6/6c/%E7%AB%8B%E7%BB%98_%E8%A7%92%E5%B3%B0_1.png",
    onPlay(G, ctx, self) {
      self.atk += G.materials[3];
      self.hp += G.materials[3];
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.atk += 1;
      self.hp += 3;
    },
    reinforce_desc: "+1/+3",
  },

  {
    name:"梓兰",
    cost:3,
    atk:3,
    hp:2,
    mine:2,
    block:0,
    desc: "部署/采掘/战斗: 化解1点动乱值",
    illust:"http://ak.mooncell.wiki/images/b/bb/%E7%AB%8B%E7%BB%98_%E6%A2%93%E5%85%B0_1.png",
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
      self.atk += 3;
      self.hp += 1;
    },
    reinforce_desc: "+3/+1",
  },

  {
    name:"凛冬",
    cost:3,
    atk:2,
    hp:3,
    mine:1,
    block:1,
    desc: "采掘/战斗: 强化1张手牌",
    illust:"http://ak.mooncell.wiki/images/6/6e/%E7%AB%8B%E7%BB%98_%E5%87%9B%E5%86%AC_1.png",
    reinforce: 1,
    onMine(G, ctx, self) {
      reinforce_hand(G, ctx);
    },
    onFight(G, ctx, self) {
      reinforce_hand(G, ctx);
    },
    onReinforce(G, ctx, self) {
      self.atk += 3;
      self.hp += 3;
    },
    reinforce_desc: "+3/+3",
  },
  {
    name:"真理",
    cost:2,
    atk:3,
    hp:2,
    mine:1,
    block:0,
    desc: "行动: 强化2张手牌",
    illust:"http://ak.mooncell.wiki/images/1/19/%E7%AB%8B%E7%BB%98_%E7%9C%9F%E7%90%86_1.png",
    reinforce: 1,
    action(G, ctx, self) {
      for (let i=0; i<self.power+2; i++){
        reinforce_hand(G, ctx);
      }
    },
    reinforce_desc: "再强化1张",
  },
  {
    name:"古米",
    cost:4,
    atk:3,
    hp:5,
    mine:1,
    block:2,
    desc: "部署: 在手牌中每被强化过1次，就强化场上的1个干员",
    illust:"http://ak.mooncell.wiki/images/1/16/%E7%AB%8B%E7%BB%98_%E5%8F%A4%E7%B1%B3_1.png",
    reinforce: 1,
    onPlay(G, ctx, self) {
      let power = self.power || 0;
      for (let i=0; i<power; i++) {
        let card = ctx.random.Shuffle(G.field)[0];
        if (card){
          reinforce_card(G, ctx, card);
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
    name:"早露",
    cost:4,
    atk:6,
    hp:3,
    mine:2,
    block:0,
    desc: "部署: 在手牌中每被强化过1次，就对1个敌人造成3点伤害",
    illust:"http://ak.mooncell.wiki/images/6/6f/%E7%AB%8B%E7%BB%98_%E6%97%A9%E9%9C%B2_1.png",
    reinforce: 1,
    onPlay(G, ctx, self) {
      let power = self.power || 0;
      for (let i=0; i<power; i++) {
        deal_random_damage(G, ctx, 3);
      }
    },
    onReinforce(G, ctx, self) {
      deal_random_damage(G, ctx, 3);
    },
    reinforce_desc: "造成3点伤害",
  },

  {
    name:"伊桑",
    cost:3,
    atk:1,
    hp:1,
    mine:1,
    block:0,
    desc: "部署: 变成场上1个干员的复制",
    illust:"http://ak.mooncell.wiki/images/e/e0/%E7%AB%8B%E7%BB%98_%E4%BC%8A%E6%A1%91_1.png",
    reinforce: 1,
    onPlay(G, ctx, self) {
      if (G.field.length > 1){
        G.field[G.field.length-1] = Object.assign({}, ctx.random.Shuffle(G.field.slice(0,G.field.length-1))[0]);
      }
    },
    onReinforce(G, ctx, self) {
      G.hand.unshift(enemy2card(G, ctx));
    },
    reinforce_desc: "将1张敌人牌加入手牌",
  },
  
  {
    name:"W",
    cost:6,
    atk:6,
    hp:6,
    mine:3,
    block:1,
    desc: "行动: 将1张敌人牌加入手牌",
    illust:"http://ak.mooncell.wiki/images/4/44/%E7%AB%8B%E7%BB%98_W_1.png",
    action(G, ctx, self) {
      let card = enemy2card(G, ctx);
      for (let i=0; i<self.power; i++) {
        reinforce_card(G, ctx, card);
      }
      G.hand.unshift(card);
    },
    reinforce: 2,
    reinforce_desc: "并强化其1次",
  },

  {
    name:"调香师",
    cost:3,
    atk:0,
    hp:2,
    mine:2,
    block:0,
    desc: "行动: 使1个有阻挡能力的干员获得+4生命值，重复2次",
    illust:"http://ak.mooncell.wiki/images/5/5c/%E7%AB%8B%E7%BB%98_%E8%B0%83%E9%A6%99%E5%B8%88_1.png",
    reinforce: 1,
    action(G, ctx, self) {
      let warriors = G.field.filter(x => (x.block > 0));

      if (warriors.length > 0){
        for (let i=0; i<2; i++) {
          let warrior = ctx.random.Shuffle(warriors)[0];
          warrior.hp += 4 + self.power;
        }
      }
    },
    reinforce_desc: "生命值加成+1",
  },

  {
    name:"梅尔",
    cost:2,
    atk:3,
    hp:2,
    mine:1,
    block:0,
    desc: "部署: 使2个订单的能力改为\"→造成5点伤害\"",
    illust:"http://ak.mooncell.wiki/images/f/f0/%E7%AB%8B%E7%BB%98_%E6%A2%85%E5%B0%94_1.png",
    reinforce: 1,

    onPlay(G, ctx) {
      let orders = ctx.random.Shuffle(G.finished);
      if (orders.length > 2) {
        orders = orders.slice(0,2);
      }
      for (let order of orders) {
        let material = ctx.random.Die(3) - 1;
        let requirements = [0,0,0,0];
        requirements[material] = 1;
        order.desc = <span>{material_icons[material]}→5伤害</span>;
        order.effect = (G,ctx) => {
          if (payMaterials(G, ctx, requirements)) {
            deal_random_damage(G, ctx, 5);
          }
        };
      }
    },
    
    onReinforce(G, ctx) {
      deal_random_damage(G, ctx, 3);
    },
    reinforce_desc: "造成3点伤害",
  },

  {
    name:"猎蜂",
    cost:1,
    atk:1,
    hp:1,
    mine:1,
    block:1,
    desc: "战斗: 激怒目标",
    illust:"http://ak.mooncell.wiki/images/f/f8/%E7%AB%8B%E7%BB%98_%E7%8C%8E%E8%9C%82_1.png",
    reinforce: 1,

    onFight(G, ctx, self, enemy) {
      enemy.enraged = true;
    },

    onReinforce(G, ctx, self) {
      self.atk += 3;
      self.hp += 3;
    },
    reinforce_desc: "+3/+3",
  },

  {
    name:"拉普兰德",
    cost:4,
    atk:1,
    hp:3,
    mine:1,
    block:1,
    desc: "战斗: 将目标变成1/1并失去所有能力",
    illust:"http://ak.mooncell.wiki/images/7/75/%E7%AB%8B%E7%BB%98_%E6%8B%89%E6%99%AE%E5%85%B0%E5%BE%B7_1.png",
    reinforce: 1,

    onFight(G, ctx, self, enemy) {
      let blank_enemy = {
        name: "源石虫",
        atk: 1,
        hp: 1,
        illust: "http://ak.mooncell.wiki/images/3/3e/%E5%A4%B4%E5%83%8F_%E6%95%8C%E4%BA%BA_%E6%BA%90%E7%9F%B3%E8%99%AB.png",
        dmg: 0,
        exhausted: false,
      };
      let idx = G.efield.indexOf(enemy);
      G.efield[idx] = blank_enemy;
    },

    onReinforce(G, ctx, self) {
      self.hp += 3;
    },
    reinforce_desc: "+0/+3",
  },

  {
    name:"极境",
    cost:5,
    atk:2,
    hp:2,
    mine:1,
    block:1,
    desc: "部署: 获得7点费用",
    illust:"http://ak.mooncell.wiki/images/5/5a/%E7%AB%8B%E7%BB%98_%E6%9E%81%E5%A2%83_1.png",
    reinforce: 1,

    onPlay(G, ctx) {
      G.costs += 7;
    },
    
    onReinforce(G, ctx, self) {
      G.costs += 2;
    },
    reinforce_desc: "获得2点费用",
  },

  {
    name:"夜刀",
    cost:12,
    atk:12,
    hp:12,
    mine:6,
    block:4,
    illust:"http://ak.mooncell.wiki/images/a/ad/%E7%AB%8B%E7%BB%98_%E5%A4%9C%E5%88%80_1.png",
    reinforce: 1,
    
    onReinforce(G, ctx, self) {
      G.atk += 4;
      G.hp += 4;
    },
    reinforce_desc: "+4/+4",
  },

  {
    name:"翎羽",
    cost:3,
    atk:2,
    hp:2,
    mine:1,
    block:1,
    illust: "http://ak.mooncell.wiki/images/8/84/%E7%AB%8B%E7%BB%98_%E7%BF%8E%E7%BE%BD_1.png",
    reinforce: 1,
    desc: "部署: 重置1个干员",

    onPlay(G, ctx, self) {
      ready_random_card(G, ctx, self);
    },
    
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
    reinforce_desc: "+2/+2",
  },
  {
    name:"杜林",
    cost:5,
    atk:4,
    hp:7,
    mine:2,
    block:2,
    illust: "http://ak.mooncell.wiki/images/f/f7/%E7%AB%8B%E7%BB%98_%E6%9D%9C%E6%9E%97_1.png",
    reinforce: 1,
    desc: "亡语: 如果\"巡林者\"也在弃牌堆，则部署\"夜刀\"",

    onOut(G, ctx, self) {
      let target = G.discard.find(x => x.name=="巡林者");
      if (target) {
        let dragon = G.CARDS.find(x => x.name=="夜刀");
        if (dragon) {
          G.field.push(init_card_state(G, ctx, Object.assign({}, dragon)));
        }
      }

    },
    
    onReinforce(G, ctx, self) {
      self.atk += 1;
      self.hp += 3;
    },
    reinforce_desc: "+1/+3",
  },
  {
    name:"狮蝎",
    cost:3,
    atk:5,
    hp:2,
    mine:2,
    block:0,
    illust: "http://ak.mooncell.wiki/images/9/98/%E7%AB%8B%E7%BB%98_%E7%8B%AE%E8%9D%8E_1.png",
    reinforce: 1,
    desc: "行动: 将场上所有干员变成{费用+1}的干员",

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
    name:"年",
    cost:8,
    atk:4,
    hp:12,
    mine:2,
    block:3,
    illust: "http://ak.mooncell.wiki/images/c/c9/%E7%AB%8B%E7%BB%98_%E5%B9%B4_1.png",
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

  {
    name:"斯卡蒂",
    cost:3,
    atk:3,
    hp:3,
    mine:1,
    block:1,
    illust: "http://ak.mooncell.wiki/images/4/45/%E7%AB%8B%E7%BB%98_%E6%96%AF%E5%8D%A1%E8%92%82_1.png",
    reinforce: 1,
    desc: "部署/采掘/战斗/行动: 触发1个随机干员的部署/采掘/战斗/行动效果",
    onPlay(G, ctx, self) {
      let card = ctx.random.Shuffle(G.CARDS.filter(x=>(x.onPlay&&(x.name!="可露希尔"))))[0];
      logMsg(G, ctx, `触发 ${card.name} 的部署效果`);
      card.onPlay(G, ctx, self);
    },
    onMine(G, ctx, self) {
      let card = ctx.random.Shuffle(G.CARDS.filter(x=>x.onMine))[0];
      logMsg(G, ctx, `触发 ${card.name} 的采掘效果`);
      card.onMine(G, ctx, self);
    },
    onFight(G, ctx, self, enemy) {
      let card = ctx.random.Shuffle(G.CARDS.filter(x=>x.onFight))[0];
      logMsg(G, ctx, `触发 ${card.name} 的战斗效果`);
      card.onFight(G, ctx, self, enemy);
    },
    action(G, ctx, self) {
      let card = ctx.random.Shuffle(G.CARDS.filter(x=>x.action))[0];
      logMsg(G, ctx, `触发 ${card.name} 的行动效果`);
      card.action(G, ctx, self);
    },
    onReinforce(G, ctx, self) {
      let card = ctx.random.Shuffle(G.CARDS.filter(x=>x.onReinforce))[0];
      logMsg(G, ctx, `触发 ${card.name} 的强化效果`);
      card.onReinforce(G, ctx, self);
    },
    
    reinforce_desc: "触发1个随机干员的强化效果",
  },

  {
    name:"砾",
    cost:1,
    atk:1,
    hp:1,
    mine:1,
    block:1,
    illust: "http://ak.mooncell.wiki/images/3/38/%E7%AB%8B%E7%BB%98_%E7%A0%BE_1.png",
    reinforce: 1,
    desc: "部署: 获得1个随机能力",
    onPlay(G, ctx, self) {
      let time_points = [["采掘: ", "onMine"], ["战斗: ", "onFight"], ["行动: ", "action"], ["亡语: ", "onOut"]];
      let time_point = ctx.random.Shuffle(time_points)[0];
      let effects = ctx.random.Shuffle(G.EFFECTS);
      let effect = effects[0];
      self.desc = time_point[0] + effect[0];
      self[time_point[1]] = effect[1];
      self.reinforce_desc = effects[1][0];
      self.onReinforce = effects[1][1];
      logMsg(G, ctx, `获得效果"${self.desc}"`);
    },
    onReinforce(G, ctx, self) {
      self.atk += 2;
      self.hp += 2;
    },
    reinforce_desc: "+2/+2",
  },

  {
    name:"可露希尔",
    cost:5,
    atk:1,
    hp:1,
    mine:1,
    block:0,
    illust: "https://img.moegirl.org/common/thumb/4/43/Ak_char_007_closre_1.png/800px-Ak_char_007_closre_1.png",
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

];

export const default_deck = CARDS.map(x => `1 ${x.name}`).join("\n");