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
    src: "http://ak.mooncell.wiki/images/f/f7/Enemy_movespeed_1.png",
    desc: "干员以横置状态入场",
    level: 3,
    effect(G, ctx){
      G.exhausted_enter = true;
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
    src: "http://ak.mooncell.wiki/images/9/95/Char_debuff_1.png",
    desc: "回合开始时，所有干员受到1点伤害",
    level: 3,
    effect(G, ctx){
      G.fog = true;
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
    src: "http://ak.mooncell.wiki/images/e/eb/Global_pcharnum_2.png",
    desc: "所有订单的分数-1",
    level: 3,
    effect(G, ctx){
      for (let order of G.odeck) {
        order.score -= 1;
      }
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