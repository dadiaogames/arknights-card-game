import { enemy2card } from "./Game";

const tag_list = [
  {
    src: "http://ak.mooncell.wiki/images/d/d3/Enemy_def_1.png",
    desc: "胜利所需的分数+2",
    level: 1,
    effect(G, ctx) {
      G.goal += 2;
    }
  },
  {
    src: "http://ak.mooncell.wiki/images/a/a6/Global_lifepoint_1.png",
    desc: "我方可承受的动乱指数-2",
    level: 1,
    effect(G, ctx) {
      G.max_danger -= 2;
    }
  },
  {
    src: "http://ak.mooncell.wiki/images/5/5a/Enemy_atk_1.png",
    desc: "所有敌人获得+1攻击力",
    level: 1,
    effect(G, ctx) {
      for (let enemy of G.edeck) {
        enemy.atk += 1;
      }
    }
  },
  {
    src: "http://ak.mooncell.wiki/images/4/4e/Enemy_hp_1.png",
    desc: "所有敌人获得+1生命值",
    level: 1,
    effect(G, ctx) {
      for (let enemy of G.edeck) {
        enemy.hp += 1;
      }
    }
  },
  {
    src: "http://ak.mooncell.wiki/images/7/71/Level_predefines_1.png",
    desc: "敌方牌库减少20%的牌",
    level: 1,
    effect(G, ctx) {
      G.edeck = G.edeck.slice(0, G.edeck.length-4);
    }
  },
  {
    src: "http://ak.mooncell.wiki/images/6/65/Char_cost_casterhealer_1.png",
    desc: "所有高台干员部署费用+1",
    level: 1,
    effect(G, ctx) {
      for (let card of G.deck.filter(x=>((x.block||0)==0))) {
        card.cost += 1;
      }
    }
  },
  {
    src: "http://ak.mooncell.wiki/images/5/5a/Char_atk_2.png",
    desc: "所有干员获得-2攻击力",
    level: 2,
    effect(G, ctx) {
      for (let card of G.deck) {
        card.atk -= 2;
        if (card.atk < 0) {
          card.atk = 0;
        }
      }
    }
  },

  {
    src: "http://ak.mooncell.wiki/images/3/3f/Char_blockminus_2.png",
    desc: "所有干员阻挡数-1",
    level: 2,
    effect(G, ctx){
      for (let card of G.deck) {
        if (card.block > 0) {
          card.block -= 1;
        }
      }
    }
  },

  {
    src: "http://ak.mooncell.wiki/images/0/06/Enemy_reveng_3.png",
    desc: "所有精英敌人获得+3/+3",
    level: 2,
    effect(G, ctx) {
      for (let enemy of G.edeck) {
        if (enemy.is_elite) {
          enemy.atk += 3;
          enemy.hp += 3;
        }
      }
    }
  },

  {
    src: "http://ak.mooncell.wiki/images/6/6d/Enemy_eagent_1.png",
    desc: "敌人无法被横置",
    level: 2,
    effect(G, ctx){
      for (let enemy of G.edeck) {
        enemy.unyielding = true;
      }
    }
  },

  {
    src: "http://ak.mooncell.wiki/images/c/c7/Global_costrecovery_1.png",
    desc: "强化干员需要消耗2点费用",
    level: 2,
    effect(G, ctx) {
      G.harder_reinforce = true;
    }
  },

  {
    src: "http://ak.mooncell.wiki/images/f/f1/Enemy_buster_1.png",
    desc: "这个tag是送你的哦~",
    level: -2,
    effect(G, ctx) {
      let deck = G.deck.map(x=>enemy2card(G, ctx));
      G.edeck = ctx.random.Shuffle(G.deck.map(x=>({...x, power:0}))); // If don't add power:0, plenty of bugs gonna come
      G.deck = deck;
      G.rhodes_training_mode = true;
    }
  },

  {
    src: "http://ak.mooncell.wiki/images/0/06/Enemy_attackspeed_2.png",
    desc: "每回合额外翻开1张敌人牌",
    level: 3,
    effect(G, ctx) {
      G.more_enemies = true;
    }
  },

  {
    src: "http://ak.mooncell.wiki/images/e/eb/Global_pcharnum_2.png",
    desc: "所有订单的分数-1",
    level: 3,
    effect(G, ctx) {
      for (let order of G.odeck) {
        order.score -= 1;
      }
    }
  },

  {
    src: "http://ak.mooncell.wiki/images/0/03/Enemy_atk_2.png",
    desc: "所有敌人获得+2/+2",
    level: 3,
    effect(G, ctx){
      for (let enemy of G.edeck) {
        enemy.atk += 2;
        enemy.hp += 2;
      }
    }
  },


  
  
  {
    src: "http://ak.mooncell.wiki/images/0/09/Enemy_hp_3.png",
    desc: "胜利所需分数+5",
    level: 3,
    effect(G, ctx){
      G.goal += 5;
    }
  },

  {
    src: "http://ak.mooncell.wiki/images/9/95/Char_debuff_1.png",
    desc: "回合开始时，所有干员受到1点伤害",
    level: 3,
    effect(G, ctx){
      G.fog = true;
    }
  },

  {
    src: "http://ak.mooncell.wiki/images/c/c1/Char_cdtime_2.png",
    desc: "干员以横置状态入场",
    level: 5,
    effect(G, ctx){
      G.exhausted_enter = true;
    }
  },


  
];

function process_tags(tag_list) {
  let tags = [];

  for (let t of tag_list) {
    t.selected = false;

    if (t.level == 1) {
      for (let i=0; i<3; i++) {
        tags.push(Object.assign({}, t)); // EH: maybe this can be reconstructed to one line instead of for loop
      }
    }
    else {
      tags.push(Object.assign({}, t));
    }
  }

  return tags;
}

export const TAGS = process_tags(tag_list);