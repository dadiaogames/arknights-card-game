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
    desc: "所有敌人获得+2攻击力",
    level: 1,
    effect(G, ctx) {
      for (let enemy of G.edeck) {
        enemy.atk += 2;
      }
    }
  },
  {
    src: "http://ak.mooncell.wiki/images/4/4e/Enemy_hp_1.png",
    desc: "所有敌人获得+2生命值",
    level: 1,
    effect(G, ctx) {
      for (let enemy of G.edeck) {
        enemy.hp += 2;
      }
    }
  },
  {
    src: "http://ak.mooncell.wiki/images/f/f7/Enemy_movespeed_1.png",
    desc: "干员以横置状态入场",
    level: 2,
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