import { CARDS } from "./cards";
import { arr2obj, PRNG } from "./utils";

const PREFIXES = "欧皇 非酋 只肝不氪 只氪不肝 肝帝 碎石猛肝 一发入魂 搓玉者 线索7传递者 借点龙门币 调箱师 不要恐慌 大哥抽芙蓉 地火 高级资深干员 非洲战神 黄票之源 注意力涣散 精二满级 弑君者迫害者 空降兵拯救者 工口发生 工具人 摔炮 中门对狙 公招巨头 富婆 老婆 猛男 打得不错 神抽狗 金色普通".split(" ");

const dubin_defend = `杜宾 0 3
推进之王 0 3
天火 0 1
香草 2 3
讯使 2 3
芬 2 3
玫兰莎 2 3
米格鲁 3 4
芙蓉 3 4
蛇屠箱 0 2
清流 0 2`;

const dubin_score = `杜宾 0 3
推进之王 0 3
天火 0 3
香草 2 3
讯使 2 3
芬 2 3
米格鲁 0 3
玫兰莎 0 2
芙蓉 0 2
克洛丝 0 2
清流 0 1
蛇屠箱 0 1
史都华德 3 4
炎熔 2 3
阿米娅 2 3`;

const solve = `空 2 3
能天使 1 3
天火 1 3
克洛丝 1 3
杰西卡 1 3
蓝毒 1 3
桃金娘 1 3
香草 1 3
陈 0 2
德克萨斯 0 2
炎熔 0 2
芬 0 2
推进之王 0 2
阿消 0 2
蛇屠箱 0 2`;

const penguin =  `德克萨斯 2 3
空 2 3
可颂 1 3
能天使 1 3
巡林者 0 2
雷蛇 0 2
桃金娘 1 3
讯使 0 2
阿消 0 2`;

const highcost = `风笛 2 3
红豆 3 4
桃金娘 2 4
蛇屠箱 1 3
清流 1 3
巡林者 1 3
12F 1 3
黑角 1 3
芙兰卡 0 3
可颂 0 2
陈 0 2
蓝毒 0 2
雷蛇 0 2
星极 0 2
天火 0 2`;

let strategies = [dubin_defend, dubin_score, solve, penguin, highcost];


function get_random_card(rng) {
  return rng.choice(CARDS).name;
}

export function get_deck_name() {
  let rng = new PRNG(Math.random());
  return '"' + rng.choice(PREFIXES) + '"' + get_random_card(rng);
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

export function generate_deck(deck_name) {
  let deck = [];
  let rng = new PRNG(deck_name);
  let s1 = rng.choice(strategies).split("\n");
  let s2 = rng.choice(strategies).split("\n");
  for (let s of s1.concat(s2)) {
    let strategy = s.split(" ");
    deck.push(get_single_card(rng, strategy[0], parseInt(strategy[1]), parseInt(strategy[2])));
  }

  deck = arr2deck(deck);

  if (deck.length < 30) {
    for (let i=0; i<(30-deck.length); i++) {
      deck.push(get_random_card(rng));
    }
  }

  if (deck.length > 30) {
    for (let i=0; i<(deck.length-30); i++) {
      deck.splice(rng.randRange(deck.length), 1);
    }
  }

  return deck2str(deck);

  //TODO: let deck be the summarized version, this is an advanced feature
}