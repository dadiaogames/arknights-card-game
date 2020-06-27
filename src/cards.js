import { deal_damage } from './Game';

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
      if (G.efield.length > 0){
        let idx = ctx.random.Die(G.efield.length) - 1
        deal_damage(G, ctx, "efield", idx, 3);
      }
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

];

export const default_deck = "2 克洛丝\n2 玫兰莎\n2 米格鲁\n2 史都华德\n2 12F\n2 巡林者\n2 黑角\n2 阿米娅\n2 杰西卡\n";