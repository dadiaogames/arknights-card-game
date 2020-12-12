import React from 'react';
import _ from 'lodash';
import { choice, deal_random_damage, draw, gainMaterials, init_card_state, logMsg, reinforce_hand, summon } from './Game';
import { random_upgrade } from './Roguelike';
import { UPGRADES } from './upgrades';
import { relic_images, relic_names } from './assets';

export const RELICS = [
  // {
  //   name: "可露希尔的怜悯",
  //   desc: "跳过选牌时,额外获得10赏金",
  //   onSkipPick(S) {
  //     S.gold += 10;
  //   }
  // },
  // {
  //   name: "乌萨斯列巴",
  //   desc: "回合开始时，额外摸2张牌",
  //   onTurnBegin(G, ctx){
  //     draw(G, ctx);
  //     draw(G, ctx);
  //   }
  // },
  {
    name: "超高级沙发",
    desc: "可同时部署人数+1",
    onBattleBegin(G, ctx){
      G.field_limit += 1;
    }
  },
  {
    name: "锈刃-处决",
    desc: "部署2费及以下的干员时，造成4点伤害",
    onTurnBegin(G, ctx){
      G.onPlayCard.push((G, ctx, card) => {
        if (card.cost <= 2) {
          deal_random_damage(G, ctx, 4);
        }
      });
    }
  },{
    name: "荒地龙舌兰",
    desc: "每回合少获得1点费用，但获得3个材料",
    onTurnBegin(G, ctx){
      G.costs -= 1;
      gainMaterials(G, ctx, 3);
    }
  },{
    name: "一份演讲稿",
    desc: "对局开始时，召唤1个2费干员",
    onBattleBegin(G, ctx){
      let new_card = ctx.random.Shuffle(G.CARDS.filter(x=>(x.cost==2)))[0];
      // summon(G, ctx, new_card, {});
      G.field.push(init_card_state(G, ctx, {...new_card, hp:new_card.hp+1}));
    }
  },
  {
    name: "人事部密信",
    desc: "回合开始时，召唤1个随机干员的1/2复制",
    onTurnBegin(G, ctx){
      let new_card = ctx.random.Shuffle(G.CARDS)[0];
      // summon(G, ctx, new_card, {});
      let played_card = init_card_state(G, ctx, {...new_card,
        atk: 1,
        hp: 2,
        mine: 1,
        cost: 1,
      });
      played_card.exhausted = false;
      G.field.push(played_card);
    }
  },
  {
    name: "生命之水",
    desc: "回合开始时，强化1张手牌",
    onTurnBegin(G, ctx) {
      reinforce_hand(G, ctx);
    }
  },

  
  {
    name: "地区行动方案",
    desc: "起始获得额外1组材料，胜利所需分数+2",
    onBattleBegin(G, ctx){
      for (let i=0; i<3; i++) {
        G.materials[i] += 1;
      }
      G.goal += 2;
    }
  },
  {
    name: "一杯昏睡红茶",
    desc: "部署干员时，有概率额外触发1次“部署:”效果",
    onTurnBegin(G, ctx) {
      G.onPlayCard.push(
        (G, ctx, card) => {
          if (ctx.random.D4() == 1) {
            card.onPlay(G, ctx, card);
            logMsg(G, ctx, `额外触发1次 ${card.name} 的部署效果`);
          }
        }
      );
    }
  },
  // {
  //   desc: "回合开始时，如果场上干员数达到了上限，则获得5分",
  //   onTurnBegin(G, ctx){
  //     if (G.field.length == G.field_limit) {
  //       G.score += 5;
  //     }
  //   }
  // },
  // {
  //   name: "综合园艺成果",
  //   desc: "对战开始时,牌组里每有4张牌,就获得1分",
  //   onBattleBegin(G, ctx) {
  //     G.score += Math.floor(G.deck.length / 4);
  //   }
  // },
  {
    name:"风干大蕉果", 
    desc:"选牌时,里面的1个干员获得强化3",
    onPickCards(S) {
      let card = S.rng.choice(S.Deck.slice(0,3));
      let reinforce = UPGRADES.find(x => x.name == "强化1");
      reinforce.effect(card);
      reinforce.effect(card);
      reinforce.effect(card);
    }
  },
  {
    name:"古旧钱币", 
    desc:"每次对战结束时,额外获得10赏金",
    onBattleEnd(S) {
      S.gold += 10;
    }
  },
  {
    name:"“嘎呜”挂饰", 
    desc:"达成满贯以上时,额外获得30赏金",
    onBattleEnd(S) {
      if ((S.level_achieved - S.level_required) >= 4) {
        S.gold += 30;
      }
    }
  },
  {
    name:"真理的书单", 
    desc:"战斗结束时,随机升级2个干员",
    onBattleEnd(S) {
      random_upgrade(S);
      random_upgrade(S);
    }
  },
  {
    name: "手工小包",
    desc: "达成满贯以上时，随机获得1个藏品",
    onBattleEnd(S){
      if ((S.level_achieved - S.level_required) >= 4) {
        let relic = S.rng.choice(S.RELICS);
        console.log(relic.name);
        S.relics.unshift({...relic});
        alert("通过 手工小包 获得 "+relic.name);
      }
    }
  },
  // {
  //   name:"奇怪的$墨镜", 
  //   desc:"购买藏品后,获得5赏金",
  //   onBuyRelic(S, relic) {
  //     S.gold += 5;
  //   }
  // },
  // {
  //   name:"一份演讲稿", 
  //   desc:"购买藏品时,有概率随机升级1个干员",
  //   onBuyRelic(S, relic) {
  //     if (S.rng.random() <= 0.5) {
  //       random_upgrade(S);
  //     }
  //   }
  // },
  {
    name:"迷迭香之拥", 
    desc:"购买藏品时,有小概率获得1个其复制",
    onBuyRelic(S, relic) {
      if (S.rng.random() <= 0.2) {
        S.relics.unshift({...relic});
        alert(`获得${relic.name}的复制`);
      }
    }
  },
  {
    name:"咪波·运输型", 
    desc:"对局开始时费用+1",
    onBattleBegin(G, ctx) {
      G.costs += 1;
    }
  },
  {
    name:"芙蓉的健康餐", 
    desc:"所有敌人获得-1/-0",
    onBattleBegin(G, ctx) {
      G.edeck.map(enemy => {enemy.atk = Math.max(enemy.atk-1, 0);});
    }
  },
  {
    name:"压缩糖砖", 
    desc:"胜利所需分数-2(最低为10)",
    onTurnBegin(G, ctx) {
      if (G.round_num == 1) {
        G.goal -= 2;
        G.goal = Math.max(G.goal, 10);
      }
    }
  },
  {
    name:"香草沙士汽水", 
    desc:"每局首次使用干员时不会横置(可叠加)",
    onBattleBegin(G, ctx, self) {
      self.used = false;
    },
    onTurnBegin(G, ctx, self) {
      G.onUseCard.push(
        (G, ctx, card) => {
          console.log(G.relics.map(x=>({...x})));
          let gas = G.relics.find(x => x.name == "香草沙士汽水" && (!x.used));
          console.log({...gas});
          if (gas && ~G.field.indexOf(card) && card.exhausted) {
            card.exhausted = false;
            gas.used = true;
          }
        }
      );
    }
  },
  {
    name:"倒转的怀表", 
    desc:"回合开始时,每有1点动乱就获得3分",
    onTurnBegin(G, ctx) {
      G.score += 3 * G.danger;
    }
  },
  // {
  //   name:"断杖-织法者", 
  //   desc:"回合开始时,敌人数量每多我方1个,就获得1个钢",
  //   onTurnBegin(G, ctx) {
  //     let diff = G.efield.length - G.field.length;
  //     if (diff > 0) {
  //       G.materials[3] += diff;
  //     }
  //   }
  // },
  {
    name:"米格鲁的饼干", 
    desc:"所有阻挡数至少为2的,阻挡数+2",
    onBattleBegin(G, ctx) {
      G.deck.map(x => {
        if (x.block >= 2) {
          x.block += 2;
        }
      });
    }
  },
  {
    name:"断杖-咏唱", 
    desc:"所有采掘力至少为3的,<+2>",
    onBattleBegin(G, ctx) {
      G.deck.map(x => {
        if (x.mine >= 3) {
          x.mine += 2;
        }
      });
    }
  },
  {
    name:"铁卫-推进", 
    desc:" 阻挡数多于2的,阻挡数-1,但是+4/+4",
    onBattleBegin(G, ctx) {
      G.deck.map(x => {
        if (x.block >= 2) {
          x.block -= 1;
          x.atk += 4;
          x.hp += 4;
        }
      });
    }
  },
  // {
  //   name:"辉煌工匠包", 
  //   desc:" 所有干员 +3攻 <-1>",
  //   onBattleBegin(G, ctx) {
  //     G.deck.map(x => {
  //       x.atk += 3;
  //       x.mine = Math.max(x.mine - 1, 0);
  //     });
  //   }
  // },
  {
    name:"左半边椰子壳", 
    desc:" 所有干员+1费,+4/+4",
    onBattleBegin(G, ctx) {
      G.deck.map(x => {
        x.cost += 1;
        x.atk += 4;
        x.hp += 4;
      });
    }
  },
  {
    name:"右半边椰子壳", 
    desc:" 所有干员-1费,胜利所需分数+8",
    onBattleBegin(G, ctx) {
      G.deck.map(x => {
        x.cost -= 1;
      });
      G.goal += 8;
    }
  },
  {
    name:"摩根队长佳酿", 
    desc:"起始获得2个钢",
    onBattleBegin(G, ctx) {
      G.materials[3] += 2;
    }
  },
  {
    name:"“坏家伙”来了！", 
    desc:"起始获得1个随机的强化3干员加入手牌",
    onBattleBegin(G, ctx) { 
      let reinforce = UPGRADES.find(x => x.name == "强化1");
      let card = choice(ctx, G.CARDS);
      reinforce.effect(card);
      reinforce.effect(card);
      reinforce.effect(card);
      G.hand.unshift(card);
    }
  },
  {
    name:"残弩-战场依存", 
    desc:"所有干员获得 采掘:造成2点伤害",
    onTurnBegin(G, ctx) {
      G.onCardMine.push(
        (G, ctx) => {
          deal_random_damage(G, ctx, 2);
        }
      );
    }
  },
  {
    name:"断杖-突破", 
    desc:"所有干员获得 超杀:获得1个材料",
    onTurnBegin(G, ctx) {
      G.onCardFight.push(
        (G, ctx, card, enemy) => {
          if (enemy.dmg > enemy.hp) {
            gainMaterials(G, ctx, 1);
          }
        }
      );
    }
  },
  // {
  //   name:"锈刃-无人之境", 
  //   desc:"所有干员获得 部署:获得1分",
  //   onTurnBegin(G, ctx) {
  //     G.onPlayCard.push(
  //       (G, ctx) => {
  //         G.score += 1;
  //       }
  //     );
  //   }
  // },
  {
    name:"热水壶", 
    desc:"购买时变成手里一个藏品的复制",
    onBought(S) {
      let self = S.relics[0];
      let relic = S.rng.choice(S.relics.slice(1));
      if (relic) {
        Object.assign(self, relic);
      }
    }
  },
  {
    name:"全息粉粉沙盒", 
    desc:"购买时变成2个随机藏品",
    onBought(S) {
      let self = S.relics[0];
      S.relics = S.relics.slice(1);
      for (let i=0; i<2; i++) {
        let relic = S.rng.choice(S.RELICS);
        S.relics.unshift({...relic});      
      }
      alert(`获得 ${S.relics[0].name} ${S.relics[1].name}`);
    }
  },
].map(init_relic);

export function init_relic(relic) {
  return {
    ...relic,
    illust: get_relic_img(relic),
  };
}

export function get_relic_img(relic) {
  return relic_images[relic_names.indexOf(relic.name)];
}