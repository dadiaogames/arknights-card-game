import { enemy2card } from "./Game";

const tag_list = [
  {
    src: "http://prts.wiki/images/d/d3/Enemy_def_1.png",
    desc: "胜利所需的分数+4",
    level: 1,
    effect(G, ctx) {
      G.goal += 4;
    }
  },
  {
    src: "http://prts.wiki/images/a/a6/Global_lifepoint_1.png",
    desc: "我方可承受的动乱指数-2",
    level: 1,
    effect(G, ctx) {
      G.max_danger -= 2;
    }
  },
  {
    src: "http://prts.wiki/images/5/5a/Enemy_atk_1.png",
    desc: "所有敌人获得+1攻击力",
    level: 1,
    effect(G, ctx) {
      for (let enemy of G.edeck) {
        enemy.atk += 1;
      }
    }
  },
  {
    src: "http://prts.wiki/images/4/4e/Enemy_hp_1.png",
    desc: "所有敌人获得+2生命值",
    level: 1,
    effect(G, ctx) {
      for (let enemy of G.edeck) {
        enemy.hp += 2;
      }
    }
  },
  {
    src: "http://prts.wiki/images/7/71/Level_predefines_1.png",
    desc: "敌方牌库减少20%的牌",
    level: 1,
    effect(G, ctx) {
      G.edeck = G.edeck.slice(0, G.edeck.length-4);
    }
  },
  // {
  //   src: "http://prts.wiki/images/6/65/Char_cost_casterhealer_1.png",
  //   desc: "所有高台干员部署费用+1",
  //   level: 1,
  //   effect(G, ctx) {
  //     for (let card of G.deck.filter(x=>((x.block||0)==0))) {
  //       card.cost += 1;
  //     }
  //   }
  // },
  {
    src: "http://prts.wiki/images/9/99/Enemy_movespeed_2.png",
    desc: "2回合后，所有敌人获得\"冲锋\"",
    level: 2,
    effect(G, ctx) {
      G.dashOnR3 = true;
    }
  },

  {
    src: "http://prts.wiki/images/a/a0/Enemy_hp_2.png",
    desc: "2回合后，所有敌人获得+4生命值",
    level: 2,
    effect(G, ctx){
      G.reinforceOnR3 = true;
    }
  },

  {
    src: "http://prts.wiki/images/0/06/Enemy_reveng_3.png",
    desc: "所有精英敌人获得+2/+4",
    level: 2,
    is_standard: true,
    effect(G, ctx) {
      for (let enemy of G.edeck) {
        if (enemy.is_elite) {
          enemy.atk += 2;
          enemy.hp += 4;
        }
      }
    }
  },

  // {
  //   src: "http://prts.wiki/images/4/46/Global_forbidloc_2.png",
  //   desc: "手牌上限和场上干员数量上限调整为6",
  //   level: 2,
  //   effect(G, ctx) {
  //     G.limit_hand_field = true;
  //   }
  // },

  {
    src: "http://prts.wiki/images/c/cd/Global_tokencnt_2.png",
    desc: "强化干员需要的材料数+1",
    level: 2,
    effect(G, ctx) {
      for (let card of G.deck) {
        card.reinforce += 1;
      }
    }
  },


  {
    src: "http://prts.wiki/images/6/6d/Enemy_eagent_1.png",
    desc: "敌人无法被横置",
    level: 2,
    effect(G, ctx){
      for (let enemy of G.edeck) {
        enemy.unyielding = true;
      }
    }
  },

  {
    src: "http://prts.wiki/images/f/f4/Enemy_reveng_spdmod_2.png",
    desc: "每过2回合，每回合就额外翻开1张敌人牌",
    level: 2,
    is_standard: true,
    effect(G, ctx){
      G.more_enemies = true;
    }
  },


  {
    src: "http://prts.wiki/images/f/f1/Enemy_buster_1.png",
    desc: "这个tag是送你的哦~",
    level: -50,
    effect(G, ctx) {
      let deck = G.deck.map(x=>enemy2card(G, ctx));
      G.edeck = ctx.random.Shuffle(G.deck.map(x=>({...x, power:0}))); // If don't add power:0, plenty of bugs gonna come
      G.deck = deck;
      G.rhodes_training_mode = true;

      for (let card of G.edeck) {
        if (typeof card.desc == "string") {
          card.desc = card.desc.replace("采掘", "动乱");
          card.desc = card.desc.replace("部署", "入场");
        }
      }
    }
  },

  // {
  //   src: "http://prts.wiki/images/7/7f/Global_costrecovery_3.png",
  //   desc: "所有干员的部署费用提升至1.5倍",
  //   level: 3,
  //   effect(G, ctx) {
  //     for (let card of G.deck) {
  //       card.cost *= 1.5;
  //     }
  //   }
  // },

  {
    src: "http://prts.wiki/images/e/eb/Global_pcharnum_2.png",
    desc: "所有订单的分数-1",
    level: 3,
    effect(G, ctx) {
      for (let order of G.odeck) {
        order.score -= 1;
      }
    }
  },

  {
    src: "http://prts.wiki/images/0/06/Enemy_attackspeed_2.png",
    desc: "每回合额外翻开1张敌人牌",
    level: 3,
    effect(G, ctx) {
      G.num_enemies_out += 1;
    }
  },

  

  {
    src: "http://prts.wiki/images/0/03/Enemy_atk_2.png",
    desc: "回合开始时，所有敌人获得+1/+1",
    level: 3,
    is_standard: true,
    effect(G, ctx){
      G.enemy_grow = true;
    }
  },

  {
    src: "http://prts.wiki/images/9/95/Char_debuff_1.png",
    desc: "回合开始时，所有干员受到1点伤害",
    level: 3,
    is_standard: true,
    effect(G, ctx){
      G.fog = true;
    }
  },

  
  
  {
    src: "http://prts.wiki/images/d/d3/Enemy_def_1.png",
    desc: "胜利所需分数+10",
    level: 3,
    effect(G, ctx){
      G.goal += 10;
    }
  },

  {
    src: "http://prts.wiki/images/4/40/Enemy_hirman_2.png",
    desc: "3回合后，所有敌人获得+6/+6",
    level: 3,
    effect(G, ctx){
      G.reinforceOnR4 = true;
    }
  },

  
  {
    src: "http://prts.wiki/images/c/c1/Char_cdtime_2.png",
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