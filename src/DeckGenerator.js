import { CARDS } from "./cards";
import { arr2obj, PRNG } from "./utils";
var _ = require("lodash");

const PREFIXES = "欧皇 非酋 只肝不氪 只氪不肝 肝帝 碎石猛肝 一发入魂 搓玉者 线索7传递者 借点龙门币 调箱师 不要恐慌 大哥抽芙蓉 热泵通道 高级资深干员 非洲战神 黄票之源 注意力涣散 弑君者迫害者 空降兵拯救者 工口发生 工具人 摔炮 中门对狙 富婆 老婆 猛男 打得不错 神抽狗 金色普通 龙门粗口 Kokodayo 拳皇".split(" ");

const SEEDS = "龙门外环 龙门市区 荒芜广场 无人危楼 59区废墟 破碎大道 荒漠 新街 中转站 霜冻废墟 黄铁峡谷 军械库东".split(" ");

// const dubin_defend = `杜宾 0 3
// 推进之王 0 3
// 天火 0 1
// 香草 2 3
// 讯使 2 3
// 芬 2 3
// 玫兰莎 2 3
// 米格鲁 3 4
// 芙蓉 3 4
// 蛇屠箱 0 2
// 清流 0 2`;

const dubin_score = `杜宾 2 3
推进之王 2 3
天火 1 2
讯使 2 3
芬 2 3
米格鲁 2 3
玫兰莎 2 3
史都华德 2 3
芙蓉 2 3
克洛丝 0 2
蛇屠箱 0 2
炎熔 1 2
阿米娅 2 3
杰西卡 2 3
梓兰 0 1
凛冬 0 2
真理 0 2
调香师 0 1
极境 0 1
狮蝎 0 1`;

const solve = `天火 1 2
克洛丝 2 3
杰西卡 2 3
蓝毒 2 3
巡林者 2 3
银灰 0 2
香草 2 3
陈 2 3
炎熔 2 3
梅尔 0 2
白面鸮 0 2
真理 1 2
伊桑 0 1
拉普兰德 1 2
极境 1 2
狮蝎 0 1
年 0 1`;

const penguin =  `德克萨斯 3 4
空 2 3
可颂 0 2
能天使 1 2
莫斯提马 1 2
白面鸮 0 2
阿消 2 3
伊桑 0 2
拉普兰德 1 2
极境 0 2
芬 0 2
狮蝎 0 1
年 0 1`;

const highcost = `风笛 2 3
红豆 0 2
桃金娘 2 3
极境 2 3
蛇屠箱 1 2
清流 1 3
巡林者 1 3
12F 1 3
黑角 1 3
杜林 1 3
夜刀 0 2
芙兰卡 0 2
雷蛇 0 2
可颂 0 2
陈 0 2
蓝毒 0 2
银灰 0 2
白面鸮 0 2
伊桑 1 2
年 1 2`;

const rhine = `赫默 1 3
白面鸮 1 3
梅尔 1 3
史都华德 1 3
12F 1 2
伊芙利特 1 2
塞雷娅 1 2
清流 1 2
桃金娘 2 3
极境 0 2
讯使 2 3
蛇屠箱 2 3
芙蓉 0 2
伊桑 0 1
芬 1 2
年 0 1
狮蝎 0 1`;

const eyja = `艾雅法拉 1 2
阿米娅 2 3
杰西卡 2 3
讯使 2 3
凛冬 2 3
德克萨斯 1 2
极境 1 2
史都华德 0 2
雷蛇 0 2
可颂 0 2
蓝毒 0 2
陈 0 2
克洛丝 0 2
芬 1 2
真理 0 2
伊桑 0 1`;

const angelina = `安洁莉娜 1 2
芬 2 3
推进之王 2 3
陈 2 3
翎羽 2 3
桃金娘 1 2
杜宾 1 2
塞雷娅 1 2
天火 1 2
星极 0 2
角峰 0 2
蛇屠箱 0 2
芙蓉 0 2
伊桑 0 1
极境 2 3
狮蝎 1 2`;

const karlan = `银灰 1 3
崖心 1 3
角峰 1 3
初雪 3 4
星极 2 3
赫默 1 2
白面鸮 2 3
蓝毒 2 3
讯使 2 3
极境 1 2
芬 1 2
真理 0 2
伊桑 0 2
年 0 1
狮蝎 0 1`;

const ursus = `凛冬 2 3
真理 3 4
古米 2 3
早露 2 3
史都华德 2 3
阿米娅 0 2
杰西卡 0 2
蓝毒 0 2
黑角 0 2
桃金娘 1 2
极境 1 2
芬 1 2
推进之王 0 2
陈 0 2
芙兰卡 0 2
白面鸮 0 2
伊桑 0 1
梅尔 0 2
猎蜂 0 1
年 0 1
狮蝎 0 1`;

const strategies = [dubin_score, solve, penguin, highcost, rhine, eyja, angelina, karlan, ursus];


function get_random_card(rng) {
  return rng.choice(CARDS).name;
}

export function get_deck_name() {
  let rng = new PRNG(Math.random());
  return '"' + rng.choice(PREFIXES) + '"' + get_random_card(rng);
}

export function get_seed_name() {
  let rng = new PRNG(Math.random());
  return rng.choice(SEEDS) + String.fromCharCode(97+rng.randRange(26));
}

export function get_single_card(rng, name, count1, count2) {
  let count = count1;
  if (count2) {
    count += rng.randRange(count2 - count1 + 1);
  }
  return [count, name];
}

function arr2deck(arr) {
  let deck = [];

  for (let card of arr) {
    for (let i=0; i<card[0]; i++) {
      deck.push(card[1]);
    }
  }

  return deck;

}

function deck2str(deck) {
  let output = {};

  for (let card of deck) {
    if (output[card]) {
      output[card] += 1;
    }
    else {
      output[card] = 1;
    }
  }

  let cards = Object.keys(output).sort();
  return cards.map(c => `${output[c]} ${c}`).join("\n");
}

function remove_redundant(deck) {
  for (let card of deck) {
    if (card[0] > 3) {
      card[0] = 3;
    }
  }
  return deck;
}

export function generate_deck(deck_name) {
  let deck = [];
  let rng = new PRNG(deck_name);
  let strategy = rng.choice(strategies).split("\n");
  for (let s of strategy) {
    let strategy = s.split(" ");
    deck.push(get_single_card(rng, strategy[0], parseInt(strategy[1]), parseInt(strategy[2])));
  }

  deck = rng.shuffle(arr2deck(deck)).slice(0, 25);
  let amount_add = 35 - deck.length;
  for (let i=0; i<amount_add; i++) {
    deck.push(get_random_card(rng));
  }

  // if (deck.length > 30) {
  //   let amount_remove = deck.length - 30;
  //   for (let i=0; i<(amount_remove); i++) {
  //     deck.splice(rng.randRange(deck.length), 1);
  //   }
  // }


  return deck2str(deck);

  //TODO: let deck be the summarized version, this is an advanced feature
}

export function is_standard(deck_data) {
  let numbers = deck_data.split("\n").map(x=>parseInt(x.split(" ")[0]));
  let names = deck_data.split("\n").map(x=>(x.split(" ")[1])); // EH: reconstruct this
  numbers = numbers.filter(x => !isNaN(x));
  let unique_names = [...new Set(names)];
  if (names.length != unique_names.length) {
    return false;
  }
  for (let i of numbers) {
    if (i > 3) {
      return false;
    }
  }
  let sum_value = _.sum(numbers);
  if (sum_value < 30) {
    return false;
  }

  return true;
}