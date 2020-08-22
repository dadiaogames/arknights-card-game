import _ from 'lodash';
import { CARDS } from "./cards";
import { arr2obj, PRNG } from "./utils";

const PREFIXES = "欧皇 非酋 只肝不氪 只氪不肝 肝帝 碎石猛肝 一发入魂 基建搓玉者 线索7传递者 借点龙门币 调箱师 不要恐慌 大哥抽芙蓉 热泵通道 高级资深干员 非洲战神 黄票之源 注意力涣散 弑君者迫害者 空降兵拯救者 工口发生 工具人 摔炮 中门对狙 富婆 老婆 猛男 打得不错 神抽狗 金色普通 龙门粗口 Kokodayo 拳皇".split(" ");

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

const cost_vanguard =  `极境 1 2
香草 1 2
讯使 1 2
桃金娘 1 2`;

const draw_vanguard = `芬 1 2
清道夫 1 2
调香师 1 1
清流 0 1`;

const scorer = `阿米娅 0 2
崖心 0 2
阿消 0 1
食铁兽 0 2
铃兰 0 1
麦哲伦 0 1
断罪者 0 1`;

// const dubin_score = `杜宾 2 3
// 推进之王 2 3
// 天火 1 2
// 讯使 1 2
// 香草 1 2
// 桃金娘 1 2
// 芬 2 3
// 清道夫 1 2
// 米格鲁 2 3
// 玫兰莎 2 3
// 克洛丝 2 3
// 史都华德 2 3
// 安赛尔 1 2
// 阿米娅 2 3
// 杰西卡 2 3
// 慕斯 0 2
// 蛇屠箱 0 2
// 炎熔 0 2
// 蓝毒 0 2
// 白金 1 2
// 梓兰 0 1
// 凛冬 0 2
// 真理 0 2
// 极境 0 1
// 狮蝎 1 2
// 斯卡蒂 1 2
// 阿 1 2
// 麦哲伦 1 2
// 食铁兽 1 2
// 清流 0 2`;

const solve = `能天使 1 2
煌 2 3
黑 2 3
阿消 0 2
食铁兽 0 2
克洛丝 2 3
杰西卡 1 2
蓝毒 2 3
白金 2 3
末药 1 2
宴 2 3
巡林者 2 3
陈 1 2
红豆 2 3
炎熔 2 3
刻俄柏 2 3
刻刀 1 2
白面鸮 1 2
拉普兰德 1 2
柏喙 1 2
翎羽 1 2
杜宾 0 2
伊桑 0 1
斯卡蒂 1 2`;

const penguin =  `德克萨斯 3 4
空 3 4
莫斯提马 3 3
皇帝 2 2
波登可 1 2
阿消 1 2
麦哲伦 0 2
温蒂 1 2
艾雅法拉 1 2
调香师 1 2
可颂 0 2
白面鸮 1 2
阿米娅 0 2
拉普兰德 1 2
梓兰 1 2
年 0 2
夜刀 1 2`;

const highcost = `风笛 3 3
桃金娘 1 2
温蒂 1 2
惊蛰 1 2
阿消 1 2
巡林者 1 2
12F 1 2
黑角 1 2
刻俄柏 1 2
煌 1 2
食铁兽 2 2
雷蛇 1 2
蓝毒 1 2
银灰 1 2
白面鸮 1 2
巫恋 1 2
年 1 2
夜刀 1 3`;

const rhine = `赫默 2 3
白面鸮 3 3
麦哲伦 1 2
梅尔 1 2
稀音 2 3
伊芙利特 2 2
塞雷娅 1 2
米格鲁 2 3
红 2 3
巡林者 1 2
银灰 1 2
麦哲伦 1 2
阿米娅 1 2
艾雅法拉 1 2
惊蛰 1 2
阿消 1 2
讯使 1 2
梅尔 1 2
陈 1 2
斯卡蒂 1 2`;

// const eyja = `艾雅法拉 2 3
// 阿米娅 2 3
// 杰西卡 2 3
// 凛冬 2 3
// 斯卡蒂 2 3
// 讯使 3 4
// 惊蛰 1 2
// 德克萨斯 0 2
// 调香师 1 2
// 清道夫 1 2
// 刻俄柏 1 2
// 克洛丝 1 2
// 米格鲁 1 2
// 蓝毒 1 2
// 慕斯 1 2
// 真理 1 2
// 赫默 1 2
// 梅尔 1 2
// 伊芙利特 1 2
// 梓兰 1 2`;

const angelina = `安洁莉娜 3 3
波登可 2 3
芬 2 3
推进之王 1 2
陈 2 3
翎羽 2 3
极境 1 2
末药 1 2
远山 1 2
星极 1 2
红 2 3
刻俄柏 1 2
清流 1 2
古米 1 2
梓兰 1 2
狮蝎 2 2
斯卡蒂 2 3`;

const karlan = `银灰 2 3
崖心 2 3
角峰 2 2
初雪 2 3
星极 1 2
赫默 1 2
白面鸮 0 2
慕斯 1 2
末药 0 2
芙蓉 0 2
讯使 1 2
伊桑 1 2
斯卡蒂 1 2`;

const ursus = `凛冬 2 3
真理 2 3
古米 2 3
早露 0 2
慕斯 1 2
桃金娘 1 2
惊蛰 1 2
调香师 1 2
推进之王 1 2
陈 2 3
斯卡蒂 2 3
伊桑 1 2
阿米娅 0 2
食铁兽 2 2
炎熔 1 2
黑角 0 2
芙兰卡 0 2
拉普兰德 1 2
雷蛇 0 2`;

// const arise = `阿 2 3
// 断罪者 2 3
// 清流 2 3
// 芬 2 3
// 调香师 2 3
// 推进之王 2 3
// 波登可 1 2
// 米格鲁 2 3
// 蛇屠箱 2 3
// 红 2 3
// 翎羽 1 2
// 斯卡蒂 0 2
// 克洛丝 1 2
// 玫兰莎 1 2
// 史都华德 1 2
// 极境 2 3
// 桃金娘 2 3
// 惊蛰 2 3
// 慕斯 1 2
// 刻刀 1 2
// 梓兰 1 2
// 麦哲伦 1 2
// 星熊 0 2`;

const champion = `香草 1 2
极境 1 2
调香师 2 3
芬 0 2
能天使 2 3
拉普兰德 2 3
清道夫 1 2
白面鸮 0 2
雷蛇 1 2
艾雅法拉 2 3
断罪者 2 3
清流 0 2`;

const rest = `夜莺 2 2
守林人 1 3
霜叶 1 2
锡兰 2 3
诗怀雅 2 3
陈 1 2
推进之王 2 2
末药 1 2
远山 0 2
星极 0 2
刻俄柏 1 2
古米 1 2
斯卡蒂 3 3
红 2 3
稀音 1 2
米格鲁 1 2
断罪者 0 2`;

const fullmoon = `铃兰 2 3
推进之王 2 3
红 3 3
调香师 2 3
极境 2 3
惊蛰 0 2
安洁莉娜 0 2
诗怀雅 0 2
米格鲁 2 3
霜叶 0 2
星熊 0 2
杜宾 0 2
天火 0 1
清流 0 1
安赛尔 0 2
末药 1 2
孑 2 3
宴 1 3
梅尔 0 2
白金 0 2
斯卡蒂 1 2
真理 0 2
刻刀 0 2`;

// const strategies = [dubin_score, solve, penguin, highcost, rhine, eyja, angelina, karlan, ursus, arise, champion];
const strategies = [solve, penguin, highcost, rhine, angelina, karlan, ursus, champion, rest, fullmoon];

function get_random_card(rng) {
  let banned_cards = ["砾", "可露希尔"];
  let card_pool = CARDS.filter(x => (!banned_cards.includes(x.name)));
  return rng.choice(card_pool).name;
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

function deck_from_strategy(strategy, amount, rng) {
  let deck = [];
  for (let l of strategy.split("\n")) {
    let card = l.split(" ");
    deck.push(get_single_card(rng, card[0], parseInt(card[1]), parseInt(card[2])));
  }
  deck = rng.shuffle(arr2deck(deck)).slice(0, amount);
  return deck;
}

export function generate_deck(deck_name) {
  let deck = [];
  let rng = new PRNG(deck_name);

  // Basic deck
  deck = [...deck, ...deck_from_strategy(cost_vanguard, 5, rng)];
  deck = [...deck, ...deck_from_strategy(draw_vanguard, 3, rng)];
  deck = [...deck, ...deck_from_strategy(scorer, 2, rng)];

  // Strategy deck
  let strategy = rng.choice(strategies);
  deck = [...deck, ...deck_from_strategy(strategy, 18, rng)];

  // Random cards
  let amount_add = 40 - deck.length;
  for (let i=0; i<amount_add; i++) {
    deck.push(get_random_card(rng));
  }

  return deck2str(deck);
}

export function is_standard(deck_data) {
  let numbers = deck_data.split("\n").map(x=>parseInt(x.split(" ")[0]));
  let names = deck_data.split("\n").map(x=>(x.split(" ")[1])); // EH: reconstruct this
  numbers = numbers.filter(x => !isNaN(x));
  let unique_names = [...new Set(names)];
  if (names.length != unique_names.length) {
    return false;
  }
  let banned_cards = ["可露希尔", "砾"];
  for (let card of banned_cards) {
    if (names.includes(card)) {
      return false;
    }
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