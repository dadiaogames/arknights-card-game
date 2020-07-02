import React from 'react';
import { 
  deal_damage, draw, deal_random_damage, gainMaterials,
  move, exhaust_random_enemy, ready_random_card, cure, 
  payCost, get_rhine_order, init_card_state, payMaterials,
  reinforce_hand, reinforce_card
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
      G.score += 1 + self.power;
    },
    reinforce: 1,
    reinforce_desc: "再获得1分",
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
    atk: 8,
    hp: 4,
    mine: 3,
    block: 0,
    illust: "http://ak.mooncell.wiki/images/c/c8/%E7%AB%8B%E7%BB%98_%E5%B7%A1%E6%9E%97%E8%80%85_1.png",
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.atk += 6;
      self.hp += 2;
    },
    reinforce_desc: "+6/+2",
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
      self.atk += 2;
      self.hp += 2;
    },
    reinforce_desc: "+2/+2",
  },

  {
    name: "炎熔",
    cost: 3,
    atk: 4,
    hp: 2,
    mine: 2,
    block: 0,
    desc: "战斗: 获得1个随机材料",
    illust:"http://ak.mooncell.wiki/images/8/80/%E7%AB%8B%E7%BB%98_%E7%82%8E%E7%86%94_1.png",
    onFight(G, ctx, self) {
      gainMaterials(G, ctx, 1+self.power);
    },
    reinforce: 1,
    reinforce_desc: "再获得1个",
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
    action(G, ctx, self) {
      G.costs += 3 + 3 * self.power;
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
    desc:"战斗：获得2点费用", 
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
    hp:4, 
    mine:1, 
    block:1, 
    desc:"采掘：获得2点费用", 
    illust:"http://ak.mooncell.wiki/images/1/16/%E7%AB%8B%E7%BB%98_%E8%AE%AF%E4%BD%BF_1.png",
    onMine(G, ctx, self) {
      G.costs += 2 + 2 * self.power;
    },
    reinforce: 1,
    reinforce_desc: "再获得2点费用",
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
    onMine(G, ctx, self) {
      exhaust_random_enemy(G, ctx);
      let num_exhausted = G.efield.filter(x=>x.exhausted).length;
      G.costs += num_exhausted + self.power * 2;
    },
    reinforce: 1,
    reinforce_desc: "再获得2点费用",
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
    cost:4, 
    atk:3, 
    hp:2, 
    mine:1, 
    block:1, 
    desc:"亡语：将手牌中的1名干员部署到场上", 
    illust:"http://ak.mooncell.wiki/images/7/70/%E7%AB%8B%E7%BB%98_%E7%BA%A2%E8%B1%86_1.png",
    onOut(G, ctx, self) {
      if (G.hand.length > 0) {
        let card = move(G, ctx, "hand", "field");
        init_card_state(G, ctx, card);
      }
      G.costs += 2 * self.power;
    },
    reinforce: 1,
    reinforce_desc: "并返还2点费用",
  },
  
  {
    name:"推进之王", 
    cost:4, 
    atk:3, 
    hp:3, 
    mine:1, 
    block:1, 
    desc:"部署：所有手牌的费用-1", 
    illust:"http://ak.mooncell.wiki/images/6/6f/%E7%AB%8B%E7%BB%98_%E6%8E%A8%E8%BF%9B%E4%B9%8B%E7%8E%8B_1.png",
    onPlay(G, ctx, self) {
      for (let card of G.hand) {
        card.cost -= 1;
      }
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.onPlay(G, ctx);
    },
    reinforce_desc: "触发一次”部署:“效果",
  },

  {
    name:"天火", 
    cost:5, 
    atk:3, 
    hp:2, 
    mine:1, 
    block:0, 
    desc:"部署：场上所有其他干员获得<+2>", 
    illust:"http://ak.mooncell.wiki/images/c/c2/%E7%AB%8B%E7%BB%98_%E5%A4%A9%E7%81%AB_1.png",
    onPlay(G, ctx, self) {
      for (let card of G.field) {
        if (card.name != self.name) {
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
    name:"能天使", 
    cost:4, 
    atk:4, 
    hp:3, 
    mine:2, 
    block:0, 
    desc:"攻击被横置的敌人时，对所有敌人造成2点伤害", 
    illust:"http://ak.mooncell.wiki/images/b/bd/%E7%AB%8B%E7%BB%98_%E8%83%BD%E5%A4%A9%E4%BD%BF_1.png",
    onFight(G, ctx, self, enemy) {
      if (enemy.exhausted) {
        for (let i=G.efield.length-1; i>=0; i--) {
          deal_damage(G, ctx, "efield", i, 2+self.power);
        }
      }
    },
    reinforce: 1,
    reinforce_desc: "伤害+1",
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
    onFight(G, ctx, self) {
      deal_random_damage(G, ctx, 3+self.power*2);
    },
    reinforce: 1,
    reinforce_desc: "伤害+2",
  },
  
  {
    name:"杜宾", 
    cost:4, 
    atk:2, 
    hp:2, 
    mine:1, 
    block:2, 
    desc:"部署：场上每有1个干员，就获得+1/+1和<+1>", 
    illust:"http://ak.mooncell.wiki/images/2/25/%E7%AB%8B%E7%BB%98_%E6%9D%9C%E5%AE%BE_1.png",
    onPlay(G, ctx, self) {
      for (let card of G.field) {
        self.atk += 1;
        self.hp += 1;
        self.mine += 1;
      }
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      self.block += 1;
    },
    reinforce_desc: "阻挡数+1",
  },
  
  {
    name:"陈", 
    cost:6, 
    atk:4, 
    hp:4, 
    mine:2, 
    block:1, 
    desc:"部署：对两名敌人造成4点伤害", 
    illust:"http://ak.mooncell.wiki/images/b/bc/%E7%AB%8B%E7%BB%98_%E9%99%88_1.png",
    onPlay(G, ctx, self) {
      deal_random_damage(G, ctx, 4);
      deal_random_damage(G, ctx, 4);
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.onPlay(G, ctx);
    },
    reinforce_desc: "触发一次”部署:“效果",
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
    cost:6, 
    atk:4, 
    hp:4, 
    mine:3, 
    block:1, 
    desc: <span>部署：获得2个{material_icons[3]}</span>, 
    illust:"http://ak.mooncell.wiki/images/b/bb/%E7%AB%8B%E7%BB%98_%E6%98%9F%E6%9E%81_1.png",
    onPlay(G, ctx, self) {
      G.materials[3] += 2;
    },
    reinforce: 1,
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
    desc:"行动：获得+3生命值", 
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
    desc:"采掘/战斗：横置1个敌人", 
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
    desc:"采掘/战斗：重置1个干员", 
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
    desc:"行动：使一名干员获得+5生命值", 
    illust:"http://ak.mooncell.wiki/images/b/b9/%E7%AB%8B%E7%BB%98_%E8%8A%99%E8%93%89_1.png",
    action(G, ctx, self) {
      cure(G, ctx, 5 + 3 * self.power);
    },
    reinforce: 1,
    reinforce_desc: "再获得+3生命值",
  },
  
  {
    name:"清流", 
    cost:4, 
    atk:0, 
    hp:3, 
    mine:3, 
    block:0, 
    desc:"行动：使一名干员获得+9生命值", 
    illust:"http://ak.mooncell.wiki/images/f/f3/%E7%AB%8B%E7%BB%98_%E6%B8%85%E6%B5%81_1.png",
    action(G, ctx, self) {
      cure(G, ctx, 9 + 6 * self.power);
    },
    reinforce: 2,
    reinforce_desc: "再获得+6生命值",
  },
  
  {
    name:"空", 
    cost:4, 
    atk:0, 
    hp:3, 
    mine:2, 
    block:0, 
    desc:"行动：横置2个敌人", 
    illust:"http://ak.mooncell.wiki/images/f/f0/%E7%AB%8B%E7%BB%98_%E7%A9%BA_1.png",
    action(G, ctx, self) {
      exhaust_random_enemy(G, ctx);
      exhaust_random_enemy(G, ctx);
      if (self.power > 0) {
        exhaust_random_enemy(G, ctx);
      }
    },
    reinforce: 2,
    reinforce_desc: "再横置1个，限强化1次",
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
    desc:"部署：获得2个“莱茵生命订单”",
    illust:"http://ak.mooncell.wiki/images/7/7f/%E7%AB%8B%E7%BB%98_%E8%B5%AB%E9%BB%98_1.png",
    onPlay(G, ctx, self) {
      get_rhine_order(G, ctx);
      get_rhine_order(G, ctx);
    },
    reinforce: 1,
    onReinforce(G, ctx, self) {
      get_rhine_order(G, ctx);
    },
    reinforce_desc: "获得1个”莱茵生命订单“",
  },
  
  {
    name:"白面鸮",
    cost:4,
    atk:0,
    hp:3,
    mine:3,
    block:0,
    desc:"行动：重置1个干员，获得1个“莱茵生命订单”",
    illust:"http://ak.mooncell.wiki/images/a/ac/%E7%AB%8B%E7%BB%98_%E7%99%BD%E9%9D%A2%E9%B8%AE_1.png",
    action(G, ctx, self) {
      get_rhine_order(G, ctx);
      ready_random_card(G, ctx, self);
      if (self.power > 0) {
        ready_random_card(G, ctx, self);
      }
    },
    reinforce: 2,
    reinforce_desc: "再重置1个干员，限强化1次",
  },

  {
    name:"伊芙利特",
    cost:4,
    atk:4,
    hp:3,
    mine:4,
    block:0,
    desc:"行动：重置所有已完成的订单",
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
    desc:"采掘：重置1个已完成的订单",
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
    desc:"部署：每有1个已完成的订单，就获得+1/+2",
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
    desc:"采掘：触发场上所有干员的“采掘:”效果",
    illust:"http://ak.mooncell.wiki/images/c/c0/%E7%AB%8B%E7%BB%98_%E8%89%BE%E9%9B%85%E6%B3%95%E6%8B%89_1.png",
    onMine(G, ctx, self) {
      for (let card of G.field) {
        if (card.onMine && (card.name != self.name)) {
          card.onMine(G, ctx, self);
          if (self.power > 0) {
            card.onMine(G, ctx, self);
          }
        }
      }
    },
    reinforce: 2,
    onReinforce(G, ctx, self) {
      self.onMine(G, ctx, self);
    },
    reinforce_desc: "触发一次自己的“采掘:”效果",
  },
  
  {
    name:"安洁莉娜",
    cost:6,
    atk:4,
    hp:4,
    mine:3,
    block:1,
    desc:"部署：触发手牌中所有干员的“部署:”效果",
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
      self.block += 1;
    },
    reinforce_desc: "阻挡数+1",
  },
  
  {
    name:"莫斯提马",
    cost:3,
    atk:4,
    hp:2,
    mine:2,
    block:0,
    desc:"采掘：每有1个横置的敌人，就额外获得1个随机材料",
    illust:"http://ak.mooncell.wiki/images/c/cd/%E7%AB%8B%E7%BB%98_%E8%8E%AB%E6%96%AF%E6%8F%90%E9%A9%AC_1.png",
    onMine(G, ctx, self) {
      if (self.power > 0) {
        exhaust_random_enemy(G, ctx);
      }
      let num_exhausted = G.efield.filter(x=>x.exhausted).length;
      gainMaterials(G, ctx, num_exhausted);
    },
    reinforce: 2,
    reinforce_desc: "获得”采掘:横置1个敌人“，限强化1次",
  },

  {
    name:"银灰",
    cost:6,
    atk:5,
    hp:6,
    mine:2,
    block:1,
    desc: <span>采掘/战斗：消耗1个{material_icons[3]}，并重置自己</span>,
    illust:"http://ak.mooncell.wiki/images/0/03/%E7%AB%8B%E7%BB%98_%E9%93%B6%E7%81%B0_1.png",
    onMine(G, ctx, self) {
      if (payMaterials(G, ctx, [0,0,0,1])) {
        self.exhausted = false;
      }
    },
    onFight(G, ctx, self) {
      self.onMine(G, ctx, self);
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
    desc:<span>行动：消耗1个{material_icons[3]}，获得3分</span>,
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
    desc:<span>行动：获得1个{material_icons[3]}，然后每有1组{material_icons.slice(0,3)}，就再获得1个{material_icons[3]}</span>,
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
    desc:<span>部署：每有1个{material_icons[3]}，就获得+1/+1</span>,
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
    desc: "部署/采掘/战斗：化解1点动乱值",
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
    desc: "采掘/战斗：强化1张手牌",
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
    desc: "行动：强化2张手牌",
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
    desc: "部署：在手牌中每被强化过1次，就强化场上的1名干员",
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
      self.atk += 1;
      self.hp += 2;
    },
    reinforce_desc: "+1/+2",
  },
  {
    name:"早露",
    cost:4,
    atk:6,
    hp:3,
    mine:2,
    block:0,
    desc: "部署：在手牌中每被强化过1次，就对一名敌人造成3点伤害",
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
    reinforce_desc: "对一名敌人造成3点伤害",
  },

  {
    name:"伊桑",
    cost:3,
    atk:1,
    hp:1,
    mine:1,
    block:0,
    desc: "部署：变成场上一名干员的复制",
    illust:"http://ak.mooncell.wiki/images/e/e0/%E7%AB%8B%E7%BB%98_%E4%BC%8A%E6%A1%91_1.png",
    reinforce: 1,
    onPlay(G, ctx, self) {
      if (G.field.length > 0){
        G.field[G.field.length-1] = Object.assign({}, ctx.random.Shuffle(G.field.slice(0,G.field.length-1))[0]);
      }
    },
    onReinforce(G, ctx, self) {
      G.danger += 1;
    },
    reinforce_desc: "动乱值+1",
  },

  {
    name:"调香师",
    cost:3,
    atk:0,
    hp:2,
    mine:2,
    block:0,
    desc: "行动：使一名地面干员获得+4生命值，重复2次",
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
    desc: "部署：使2个订单的能力改为”→造成5点伤害“",
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
    desc: "战斗：激怒目标",
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
    hp:5,
    mine:1,
    block:1,
    desc: "战斗：将目标变成1/1并失去所有能力",
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
      self.hp += 4;
    },
    reinforce_desc: "+0/+4",
  },

];

export const default_deck = CARDS.map(x => `1 ${x.name}`).join("\n");