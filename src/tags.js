import { addBoss, enemy2card } from "./Game";

const tag_list = [
  {
    src: "https://i.postimg.cc/XNQSRt18/img-tags-0.png",
    desc: "胜利所需的分数+4",
    level: 1,
    effect(G, ctx) {
      G.goal += 4;
    }
  },
  {
    src: "https://i.postimg.cc/fyT43vym/img-tags-1.png",
    desc: "我方可承受的动乱指数-2",
    level: 1,
    effect(G, ctx) {
      G.max_danger -= 2;
    }
  },
  {
    src: "https://i.postimg.cc/hvCkV7Qw/img-tags-2.png",
    desc: "所有敌人获得+1攻击力",
    level: 1,
    effect(G, ctx) {
      for (let enemy of G.edeck) {
        enemy.atk += 1;
      }
    }
  },
  {
    src: "https://i.postimg.cc/sXJdDLj3/img-tags-3.png",
    desc: "所有敌人获得+2生命值",
    level: 1,
    effect(G, ctx) {
      for (let enemy of G.edeck) {
        enemy.hp += 2;
      }
    }
  },
  {
    src: "https://i.postimg.cc/NMtvttwN/img-tags-4.png",
    desc: "可同时部署的干员数-1",
    level: 1,
    challenge: true,
    unstackable: true,
    extra_challenge: true,
    effect(G, ctx){
      G.field_limit -= 1;
    }
  },
  {
    src: "https://i.postimg.cc/hGTRNjNz/img-tags-5.png",
    desc: "敌方牌库减少40%的牌",
    level: 2,
    standard_level: 3,
    unstackable: true,
    extra_challenge: true,
    effect(G, ctx) {
      G.edeck = G.edeck.slice(0,14);
    }
  },
  // {
  //   src: "https://i.postimg.cc/FHf4gGZx/img-tags-6.png",
  //   desc: "所有高台干员部署费用+1",
  //   level: 1,
  //   effect(G, ctx) {
  //     for (let card of G.deck.filter(x=>((x.block||0)==0))) {
  //       card.cost += 1;
  //     }
  //   }
  // },
  
{
    src: "https://i.postimg.cc/fR6hHXqQ/img-tags-7.png",
    desc: "所有精英敌人获得+2/+4",
    level: 2,
    standard_level: 1,
    // stackable: true,
    effect(G, ctx) {
      for (let enemy of G.edeck) {
        if (enemy.is_elite) {
          enemy.atk += 2;
          enemy.hp += 4;
        }
      }
    }
  },
{
    src: "https://i.postimg.cc/65bKvFd3/img-tags-8.png",
    desc: "2回合后，每回合额外翻开1张敌人牌",
    level: 2,
    standard_level: 1,
    effect(G, ctx){
      G.moreEnemiesOnR3 = true;
    }
  },
// {
//     src: "https://i.postimg.cc/ZnVSjM2w/img-tags-9.png",
//     desc: "强化干员需要消耗1点费用",
//     level: 2,
//     challenge: true,
//     // standard_level: 4,
//     effect(G, ctx) {
//       // for (let card of G.deck) {
//       //   card.reinforce += 1;
//       // }
//       G.reinforce_need_cost = true;
//     }
//   },
  
{
  src: "https://i.postimg.cc/Y0p76Hn4/img-tags-10.png",
  desc: "强化干员需要的材料数+1",
  level: 2,
  effect(G, ctx) {
    for (let card of G.deck) {
      card.reinforce += 1;
    }
  }
},

  // {
  //   src: "https://i.postimg.cc/5N21jfQT/img-tags-11.png",
  //   desc: "回合开始时，所有敌人获得+2生命值",
  //   level: 2,
  //   standard_level: 4,
  //   effect(G, ctx){
  //     G.enemy_hp_grow = true;
  //   }
  // },

  

  // {
  //   src: "https://i.postimg.cc/wj36496L/img-tags-15.png",
  //   desc: "手牌上限和场上干员数量上限调整为6",
  //   level: 2,
  //   effect(G, ctx) {
  //     G.limit_hand_field = true;
  //   }
  // },

  


  

  {
    src: "https://i.postimg.cc/KcNxZ1jt/img-tags-13.png",
    desc: "所有干员采掘力-1",
    level: 2,
    challenge: true,
    unstackable: true,
    advance: true,
    effect(G, ctx){
      for (let card of G.deck) {
        card.mine -= 1;
        card.mine = Math.max(0, card.mine);
      }
    }
  },

  


  

  // {
  //   src: "https://i.postimg.cc/R0Hv9GJ0/img-tags-14.png",
  //   desc: "所有干员的部署费用提升至1.5倍",
  //   level: 3,
  //   effect(G, ctx) {
  //     for (let card of G.deck) {
  //       card.cost *= 1.5;
  //     }
  //   }
  // },
  // {
  //   src: "https://i.postimg.cc/wj36496L/img-tags-15.png",
  //   desc: "可同时部署的干员数-3",
  //   level: 3,
  //   challenge: true,
  //   unstackable: true,
  //   extra_challenge: true,
  //   standard_level: 5,
  //   effect(G, ctx){
  //     G.field_limit -= 3;
  //   }
  // },
  {
    src: "https://i.postimg.cc/W1KsQx3K/img-tags-16.png",
    desc: "所有订单的分数-1",
    level: 3,
    standard_level: 3,
    unstackable: true,
    effect(G, ctx) {
      for (let order of G.odeck) {
        order.score -= 1;
      }
    }
  },

  // {
  //   src: "https://i.postimg.cc/gkzcRvQM/img-tags-17.png",
  //   desc: "所有干员攻击力-2",
  //   level: 3,
  //   challenge: true,
  //   unstackable: true,
  //   effect(G, ctx) {
  //     // G.goal += 28; // Because first turn gonna -4 too
  //     // G.reduce_goal = true;
  //     for (let card of G.deck) {
  //       card.atk -= 2;
  //     }
  //   }
  // },

  {
    src: "https://i.postimg.cc/1t0PVtHh/img-tags-18.png",
    desc: "每回合额外翻开1张敌人牌",
    level: 3,
    challenge: true,
    stackable: true,
    advance: true,
    standard_level: 4,
    effect(G, ctx) {
      G.num_enemies_out += 1;
    }
  },

  

  {
    src: "https://i.postimg.cc/MTJqGR1m/img-tags-19.png",
    desc: "回合开始时，所有敌人获得+1/+1",
    level: 3,
    standard_level: 1,
    effect(G, ctx){
      G.enemy_grow = true;
    }
  },

  {
    src: "https://i.postimg.cc/zXxzky1q/img-tags-20.png",
    desc: "回合开始时，所有干员受到1点伤害",
    level: 3,
    standard_level: 1,
    effect(G, ctx){
      G.fog = true;
    }
  },

  
  
  {
    src: "https://i.postimg.cc/Wp6bh9WF/img-tags-21.png",
    desc: "胜利所需分数+12",
    level: 3,
    standard_level: 4,
    stackable: true,
    effect(G, ctx){
      G.goal += 12;
    }
  },

  {
    src: "https://i.postimg.cc/j2Xsm5wQ/img-tags-22.png",
    desc: "3回合后，所有敌人获得+5/+5",
    level: 3,
    // standard_level: 3,
    effect(G, ctx){
      G.reinforceOnR4 = true;
    }
  },

  {
    src: "https://i.postimg.cc/7hDHK76Z/img-tags-23.png",
    desc: "2回合后，所有敌人获得\"冲锋\"",
    level: 4,
    challenge: true,
    unstackable: true,
    effect(G, ctx) {
      G.dashOnR3 = true;
    }
  },

  {
    src: "https://i.postimg.cc/7ZQLqfBK/img-tags-24.png",
    desc: "增加Boss\"大泡普\"，胜利所需分数+10",
    level: 4,
    challenge: true,
    stackable: true,
    effect(G, ctx){
      addBoss(G, ctx, "大泡普");
      G.goal += 10;
    }
  },
  {
    src: "https://i.postimg.cc/TPzYWBvm/img-tags-25.png",
    desc: "增加Boss\"锈锤战士\"，胜利所需分数+10",
    level: 4,
    challenge: true,
    stackable: true,
    effect(G, ctx){
      addBoss(G, ctx, "锈锤战士");
      G.goal += 10;
    }
  },
  {
    src: "https://i.postimg.cc/jjwS2tmt/img-tags-26.png",
    desc: "胜利所需分数+24",
    level: 5,
    challenge: true,
    // stackable: true,
    // standard_level: 5,
    effect(G, ctx) {
      G.goal += 24;
    }
  },
{
    src: "https://i.postimg.cc/4dp4vwX0/img-tags-27.png",
    desc: "这个tag是送你的哦~",
    level: -50,
    unstackable: true,
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
  //   src: "https://i.postimg.cc/qv7Rf8Gt/img-tags-28.png",
  //   desc: "干员以疲劳状态入场",
  //   level: 10,
  //   unstackable: true,
  //   effect(G, ctx){
  //     G.exhausted_enter = true;
  //   }
  // },
  
];

export const final_tag = {
  src: "https://i.postimg.cc/yYjdrf04/img-tags-29.png",
  desc: "增加Boss\"复仇者\"，胜利所需分数+100",
  level: 100,
  effect(G, ctx){
    addBoss(G, ctx, "复仇者");
    G.goal += 100;
  }
};

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