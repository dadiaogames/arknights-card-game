import _ from 'lodash';
import { AVATARS } from './avatars';
import { CARDS } from "./cards";
import { arr2obj, PRNG } from "./utils";

const PREFIXES = "欧皇 非酋 只肝不氪 只氪不肝 肝帝 碎石猛肝 一发入魂 基建搓玉者 线索7传递者 借点龙门币 调箱师 不要恐慌 大哥抽芙蓉 高级资深干员 非洲战神 黄票之源 注意力涣散 弑君者迫害者 空降兵拯救者 工口发生 工具人 摔炮 中门对狙 富婆 老婆 猛男 金色普通 龙门粗口 蕾丝花边超短裙 泳装 充电宝 抛光 JK 洁哥不要 蕾丝花边超短裙 老婆 泳装".split(" ");

const SEEDS = "龙门厕所 250区废墟 完整小道 旧街 中转坐 霜烤废墟 废铁峡谷 军械库北 风蚀矮天 荒废受厂 龙门厕所 荒废受厂 风蚀矮天".split(" ");

export const classes = {
  producers: "极境 讯使 香草 桃金娘 红豆 清道夫 德克萨斯 豆苗 推进之王 芬 调香师 断崖 锡兰 豆苗".split(" "),
  solvers: "克洛丝 巡林者 杰西卡 蓝毒 陨星 流星 空爆 能天使 黑 W 陈 棘刺 史尔特尔 拉普兰德 刻刀 松果 刻俄柏 四月".split(" "),
  miners: "史都华德 12F 阿米娅 炎熔 夜烟 远山 天火 星极 艾雅法拉".split(" "),
  standers: "玫兰莎 芙兰卡 慕斯 柏喙 赫拉格 孑 宴 银灰 凛冬 卡达 阿米娅-近卫 机械水獭 末药 杜宾 森蚺 夜刀".split(" "),
  defenders: "米格鲁 蛇屠箱 斑点 年 可颂 古米 雷蛇 塞雷娅 泥岩 砾 摄影车 龙腾 星熊".split(" "),
  supporters: "梓兰 红 诗怀雅 安洁莉娜 霜叶 薄绿 清流 翎羽 白面鸮 赫默 爱丽丝 空 波登可 真理 巫恋 安比尔 温蒂 夜莺 黑角".split(" "),
  scorers: "阿消 崖心 食铁兽 雪雉 铃兰 白金 普罗旺斯 煌 阿 断罪者 伊芙利特 阿米娅".split(" "),
  randomizers: "斯卡蒂 图耶 热水壶 嘉维尔 迷迭香 风笛 安赛尔 微风 亚叶 伊桑 狮蝎 坚雷 暗索 可露希尔".split(" "),
};

// const dubin_defend = `杜宾 0 3
// 推进之王 0 3
// 杜林 0 1
// 香草 2 3
// 讯使 2 3
// 芬 2 3
// 玫兰莎 2 3
// 米格鲁 3 4
// 芙蓉 3 4
// 蛇屠箱 0 2
// 清流 0 2`;

export const pick_scorers = "阿米娅 阿消 崖心 雪雉 白金 煌 爱丽丝 苏苏洛".split(" ");

export const pick_vanguards = "极境 讯使 香草 桃金娘 豆苗 豆苗 推进之王".split(" ");

const cost_vanguard =  `极境 1 2
香草 0 2
讯使 0 2
桃金娘 1 2
豆苗 0 1
推进之王 0 1
清道夫 0 1
红豆 0 1
凛冬 0 1
嵯峨 0 1`;

const draw_vanguard = `芬 1 2
调香师 1 1
锡兰 0 1
清流 0 1`;

const scorer = `阿米娅 1 1
崖心 1 1
煌 1 1
食铁兽 1 1
白金 1 1
普罗旺斯 0 1
阿消 1 1
爱丽丝 1 1
伊芙利特 1 1
雪雉 0 1
铃兰 0 1
断罪者 1 1
阿 1 1`;

const miner =  `史都华德 1 1
夜烟 1 1
远山 1 1
炎熔 1 1
伊芙利特 0 1
天火 1 1`;

const shooter = `棘刺 1 1
陈 1 1
银灰 1 1
W 1 1
卡达 1 1
拉普兰德 0 1
史尔特尔 1 1
刻刀 1 1
刻俄柏 1 1
迷迭香 1 1
黑 1 1
星熊 1 1
能天使 0 1
陨星 1 1
松果 0 1
酸糖 1 1
黑角 0 1`;

const defender = `米格鲁 1 1
蛇屠箱 0 1
年 0 1
龙腾 0 1
摄影车 1 1`;

const supporter = `翎羽 1 1
白面鸮 1 1
雷蛇 0 1
赫默 1 1
爱丽丝 1 1
末药 1 1
塞雷娅 0 1
白金 0 1
夜莺 0 1
安比尔 0 1
图耶 0 1
凛冬 1 1
真理 1 1
诗怀雅 1 1
霜叶 1 1
波登可 0 1
巫恋 1 1`;

export const solver_core = "棘刺 陈 银灰 W 松果 刻刀 刻俄柏".split(" ");
export const scorer_core = "阿米娅 阿消 崖心 雪雉 白金 铃兰 普罗旺斯 煌 爱丽丝 伊芙利特".split(" ");

// const dubin_score = `杜宾 2 3
// 推进之王 2 3
// 杜林 1 2
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
// 苏苏洛 1 2
// 食铁兽 1 2
// 清流 0 2`;

const solve = `能天使 1 2
煌 2 3
棘刺 1 2
陨星 1 2
白金 1 2
普罗旺斯 1 2
灰喉 0 2
克洛丝 2 3
蓝毒 1 3
白金 1 3
末药 1 2
宴 2 3
孑 1 2
巡林者 2 3
陈 1 2
红豆 1 2
炎熔 1 2
刻俄柏 2 3
刻刀 1 2
白面鸮 1 2
拉普兰德 1 2
柏喙 1 2
翎羽 1 2
杜宾 1 3
伊桑 0 1
黑 0 1
斯卡蒂 1 2`;

const penguin =  `德克萨斯 2 3
空 2 3
莫斯提马 1 2
大帝 2 2
波登可 1 2
艾雅法拉 1 2
阿消 1 2
苏苏洛 0 2
温蒂 1 2
可颂 1 2
白面鸮 1 2
阿米娅 1 2
拉普兰德 1 2
梓兰 0 2
坚雷 1 2
夜刀 1 2`;

const highcost = `风笛 3 3
桃金娘 1 2
温蒂 1 2
豆苗 1 2
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
赫拉格 1 2
普罗旺斯 1 2
坚雷 1 2
夜刀 1 3`;

const rhine = `赫默 2 3
白面鸮 3 3
苏苏洛 1 2
梅尔 2 3
稀音 1 2
天火 2 2
塞雷娅 1 2
米格鲁 2 3
红 2 3
史都华德 1 2
巡林者 1 2
银灰 1 2
苏苏洛 0 2
阿米娅 1 2
艾雅法拉 0 2
豆苗 0 2
陈 1 2
斯卡蒂 1 2`;

const eyja = `艾雅法拉 1 2
阿米娅 1 2
杰西卡 0 2
凛冬 0 2
真理 1 2
调香师 1 2
清道夫 0 2
断罪者 0 2
刻俄柏 1 2
刻刀 0 2
克洛丝 0 2
柏喙 1 2
雷蛇 1 2
翎羽 0 2
慕斯 1 2
赫默 1 2
天火 0 2
梓兰 0 2`;

const angelina = `安洁莉娜 3 3
陈 3 3
热水壶 3 4
波登可 2 3
芬 2 3
推进之王 1 2
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
桃金娘 1 2
豆苗 1 2
推进之王 1 2
陈 2 3
斯卡蒂 2 3
伊桑 1 2
阿米娅 1 2
食铁兽 2 2
炎熔 1 2
黑角 0 2
芙兰卡 0 2
拉普兰德 1 2
艾雅法拉 0 1
能天使 0 1
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
// 豆苗 2 3
// 慕斯 1 2
// 刻刀 1 2
// 梓兰 1 2
// 苏苏洛 1 2
// 星熊 0 2`;

const champion = `香草 1 2
极境 1 2
调香师 1 2
清道夫 1 2
芬 1 2
能天使 1 2
拉普兰德 2 3
白面鸮 0 2
雷蛇 1 2
艾雅法拉 1 2
断罪者 2 2
清流 1 2`;

const rest = `夜莺 2 2
守林人 2 2
霜叶 2 2
锡兰 2 3
诗怀雅 2 2
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
调香师 1 2
芬 1 2
极境 2 3
豆苗 0 2
安洁莉娜 0 2
诗怀雅 0 2
米格鲁 2 3
玫兰莎 1 2
史都华德 1 2
克洛丝 1 2
霜叶 0 2
星熊 0 2
杜宾 1 2
杜林 0 2
清流 0 2
安赛尔 0 2
末药 1 2
孑 2 3
宴 2 3
梅尔 1 2
白金 0 2
斯卡蒂 1 2
真理 0 2
刻刀 1 2`;

// const strategies = [dubin_score, solve, penguin, highcost, rhine, eyja, angelina, karlan, ursus, arise, champion];
const strategies = [solve, penguin, highcost, rhine, karlan, ursus, fullmoon];

// Maybe this should be rewrite to mini_sets_S2 with plenty of union sets
const mini_sets = [
  //基本阿米娅单核
  ' 阿米娅 雷蛇 艾雅法拉 ',
  ' 阿米娅 夜烟 炎熔|史都华德|爱丽丝 ',

  //风笛套
  ' 风笛 白面鸮 温蒂',
  ' 风笛 夜刀|食铁兽 黑角|食铁兽 ',

  //莱茵订单流
  ' 赫默 赫默|白面鸮 爱丽丝 ',

  //火龙单核
  ' 伊芙利特 赫默 史都华德|夜烟|炎熔 ',

  //企鹅物流 有德狗爆费核心 有空大帝刷分核心 还有空德可颂的清场
  ' 德克萨斯 德克萨斯 艾雅法拉 ',
  ' 空 空 温蒂 波登可 大帝 ',
  ' 德克萨斯 可颂 可颂 ',

  //能天使核心各种 能陨速清场 能炎熔刷材料
  // ' 能天使 陨星 蓝毒 炎熔 ',
  // ' 能天使 陨星 拉普兰德 刻俄柏 ',

  //陨星单核
  ' 能天使 陨星 雷蛇 末药 ',

  //狙击流
  ' 空爆|清道夫|阿 摄影车|机械水獭 砾 ',

  //艾雅法拉核心各种
  // ' 艾雅法拉 杰西卡 柏喙 柏喙 ',
  ' 艾雅法拉 巫恋 刻俄柏 巫恋|刻俄柏 ', // 易伤流

  //安洁莉娜强力全套
  ' 安洁莉娜 陈|翎羽 陈|诗怀雅 ',
  // ' 安洁莉娜 推进之王 推进之王 森蚺|泥岩 ',

  //送盾流
  ' 年 米格鲁 米格鲁|摄影车 ',

  //梅尔清场流
  // ' 机械水獭 机械水獭 史都华德|远山|杜林 ',

  //雷蛇引擎流
  ' 艾雅法拉  能天使  雷蛇 白雪 ',

  //温蒂引擎刷分流
  ' 温蒂 白面鸮 食铁兽 ',

  //崖心刷钢流
  ' 星极 赫默|白面鸮 崖心 ',

  //经典断罪者套
  ' 调香师 调香师 艾雅法拉 棘刺 微风|棘刺 清流 断罪者 ',

  //召唤回手套
  ' 图耶 安赛尔 霜叶|薄绿 ',

  //调香师单核
  ' 棘刺|微风 棘刺|微风 调香师 芬|调香师 ',

  //铃兰小家族
  ' 铃兰 阿|空爆|清道夫|霜叶 摄影车|砾 ',

  //波登可经典引擎战吼套
  ' 波登可 白面鸮 温蒂 ',
  //波登可全员增强
  // ' 波登可 图耶 杜宾 杜宾 ',

  //苏苏洛经典套
  // ' 苏苏洛 杜林 卡达 波登可 ',

  //消费流
  // ' 阿消 夜烟 史尔特尔 豆苗 ',

  //史尔特尔
  ' 史尔特尔 末药 白金 ',

  //真理单核套路集合
  // ' 凛冬 凛冬 真理 ',
  ' 刻俄柏|陈 食铁兽|伊芙利特 真理 ',
  // ' 伊桑 刻俄柏 芙兰卡 真理 ',

  //经典强化
  // ' 古米 古米|诗怀雅 ',

  //超杀
  ' 安比尔 天火|煌|迷迭香|白金 煌 ',

  //绝对解场
  ' 白金 拉普兰德 刻刀 ',

  //刻刀别的配合
  ' 刻刀 霜叶 ',

  //整活套路
  ' 斯卡蒂 斯卡蒂 森蚺 ',
  // ' 图耶 亚叶 ',
  ' 安赛尔 安赛尔|微风 微风 ',
  ' 图耶 狮蝎 狮蝎 ',
  ' 热水壶 热水壶 斯卡蒂 ',

  //养巨怪套路
  ' 安洁莉娜 波登可 森蚺 森蚺 ',
  ' 安洁莉娜 极境 泥岩 ',

  //卡夫卡
  ' 卡夫卡 摄影车 安洁莉娜 ',
  
  //刻刀单核小套路
  ' 刻刀 刻刀 刻俄柏 波登可 ',
  //前期猛打小套路
  // ' 孑 宴 孑|宴  翎羽 ',
  //前期直接打爆 稳住直接持续
  ' 孑 孑 史都华德 豆苗 ',
  //拉狗单核小套路
  ' 拉普兰德  能天使  刻俄柏 ',
  //柏喙小套路
  ' 柏喙 翎羽 夜莺 ',
  //银灰单核
  ' 银灰 赫默|爱丽丝 星极 ',
  //清道夫小配合
  // ' 清道夫 空爆 砾 摄影车 流星 ',
  //闪灵小配合
  // ' 闪灵 蛇屠箱 ',
  //史尔特尔小配合
  // ' 史尔特尔 米格鲁 空 ',
  //阿米娅近卫小配合
  ' 阿米娅-近卫 卡达 龙腾|机械水獭 ',

  //W小配合
  ' W 史都华德|夜烟|炎熔 ',

  //安洁其他配合
  ' 安洁莉娜 远山|杜宾 远山|红 ',

  //苏苏洛
  ' 苏苏洛 波登可 ',

  //普罗旺斯
  ' 普罗旺斯 巡林者 ',
  //还有一个普罗旺斯泥岩的套路 然而这个套路一个问题在于 需要的牌太多了 这边尽可能都是小combo 不能是大的 但只有20张 所以加上也无妨
  ' 普罗旺斯 泥岩 极境 安洁莉娜 波登可 霜叶|闪灵 ',

  //夕
  ' 夕 送葬人 ',

].map(mini_set => mini_set.split(" ").filter(card => card != ""));
  // ' 阿 蛇屠箱 闪灵 ',
  // ' 棘刺 棘刺 调香师 芬 ',
  // ' 白金 白金 刻俄柏 陨星 蓝毒 能天使 刻刀 杜宾 翎羽 ',
  // ' 米格鲁 玫兰莎 史都华德 嘉维尔 ',
  // ' 锡兰  锡兰  夜莺 ',
  // ' 普罗旺斯  灰喉  巡林者 波登可 ',
  // ' 安洁莉娜 陈 陈  波登可 ',
  // ' 铃兰  安洁莉娜  极境  芬  推进之王  推进之王 ',
  // ' 梅尔 赫默 白面鸮 天火  艾雅法拉 ',
  // ' 能天使 蓝毒 陨星 白金 ',
  // ' 霜叶  图耶  杜宾 ',
  // ' 守林人  守林人  夜莺 ',
  //  ' 末药  银灰  初雪 ',
  //  ' 梓兰  梓兰  能天使 ',
  //  ' 赫默  稀音  梅尔 梅尔 史都华德  天火  塞雷娅 ',
  //  ' 温蒂  白面鸮  桃金娘 ',
  //  ' 白金  末药  煌 ',
  //' 拉普兰德  白雪  白雪 ',
  //  ' 白金 米格鲁 米格鲁 红 ',


function get_random_card(rng) {
  let banned_cards = ["可露希尔"];
  let card_pool = CARDS.filter(x => (!banned_cards.includes(x.name))).filter(x => !(x.hard));
  return rng.choice(card_pool).name;
}

export function get_deck_name(seed) {
  let rng = new PRNG(seed || Math.random());
  return '"' + rng.choice(PREFIXES) + '"' + get_random_card(rng);
}

export function get_challenge_name(rng) {
  let card = rng.choice(AVATARS);
  return {
    desc:`${card[0]}在${rng.choice(SEEDS)}`, 
    illust:card[1],
  };
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

export function get_roguelike_pick() {
  let rng = new PRNG(Math.random());
  let selection = rng.choice(mini_sets);
  if (selection.length > 3) {
    selection = selection.slice(0, 3);
  }
  else if (selection.length < 3) {
    selection = rng.shuffle([...selection, ...selection]).slice(0, 3);
  }

  selection = selection.map(select_one_card(rng));

  return selection;
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

export function deck2str(deck) {
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

function deck_from_mini_sets(amount, rng) {
  let deck = [];
  let sets = rng.shuffle([...mini_sets, ...mini_sets]);

  for (let mini_set of sets) {
    deck = [...deck, ...mini_set];
    if (deck.length >= amount) {
      break;
    }
  }
  
  return rng.shuffle(deck).slice(0, amount);
}


export function generate_deck_s1(deck_name) {
  let deck = [];
  let rng = new PRNG(deck_name);

  // Basic deck
  deck = [...deck, ...deck_from_strategy(cost_vanguard, 5, rng)];
  deck = [...deck, ...deck_from_strategy(draw_vanguard, 1, rng)];
  deck = [...deck, ...deck_from_strategy(scorer, 3, rng)];

  // Strategy deck
  let strategy = rng.choice(strategies);
  deck = [...deck, ...deck_from_strategy(strategy, 16, rng)];

  // Random cards
  let amount_add = 32 - deck.length;
  for (let i=0; i<amount_add; i++) {
    deck.push(get_random_card(rng));
  }

  return deck2str(deck);
}

export const select_one_card = rng => x => x.includes("|")? rng.choice(x.split("|")):x;

export function generate_deck_s2(deck_name) {
  let deck = [];
  let rng = new PRNG(deck_name);

  // Basic deck
  deck = [...deck, ...deck_from_strategy(cost_vanguard, 6, rng)];
  deck = [...deck, ...deck_from_strategy(scorer, 1, rng)];
  // deck = [...deck, ...deck_from_strategy(draw_vanguard, 1, rng)];
  deck = [...deck, ...deck_from_strategy(miner, 1, rng)];
  deck = [...deck, ...deck_from_strategy(shooter, 2, rng)];
  deck = [...deck, ...deck_from_strategy(supporter, 2, rng)];

  // Strategy deck
  // deck = [...deck, ...deck_from_mini_sets(12, rng)];
  deck = [...deck, ...deck_from_mini_sets(6, rng)];

  // Let diff goes
  // console.log("deck before", deck);
  deck = deck.map(select_one_card(rng));
  // console.log("deck after", deck);

  // No more than 5 hard cards
  // console.log("Deck before:", deck);
  // deck = [...deck.filter(x => !(CARDS.find(y => y.name == x)).hard), ...deck.filter(x => (CARDS.find(y => y.name == x).hard)).slice(0,5)];
  let is_hard_card = (x) => {
    let card = CARDS.find(y => y.name == x);
    if (card) {
      return card.hard;
    }
    else {
      return false;
    }
  }
  deck = [...deck.filter(x => !is_hard_card(x)), ...deck.filter(x => is_hard_card(x)).slice(0,4)];
  // console.log("Deck after:", deck);

  // No more than 3
  let deck_dict = deck.reduce((acc, val) => ({...acc, [val]: (acc[val]+1)||1}), {})
  for (let card in deck_dict) {
    if (deck_dict[card] > 3) {
      deck_dict[card] = 3;
    }
  }

  deck = Object.keys(deck_dict).reduce((acc, val) => [...acc, ..._.times(deck_dict[val], ()=>val)], [])

  // Random cards
  let amount_add = 25 - deck.length;
  for (let i=0; i<amount_add; i++) {
    deck.push(get_random_card(rng));
  }

  return deck2str(deck);
}

export function generate_roguelike_deck(deck_name) {
  // let deck = ["黑角", "极境", deck_name.slice(0,-3)];
  // let deck = ["黑角", deck_name.slice(0,-3)];
  let deck = deck_name.split("·");
  // console.log(deck);
  let rng = new PRNG(deck_name);

  // Basic deck
  deck = [...deck, ...deck_from_strategy(cost_vanguard, 1, rng)];
  deck = [...deck, ...deck_from_strategy(scorer, 1, rng)];
  // deck = [...deck, ...deck_from_strategy(miner, 1, rng)];
  deck = [...deck, ...deck_from_strategy(shooter, 1, rng)];
  // deck = [...deck, ...deck_from_strategy(supporter, 1, rng)];
  // console.log(deck);

  // Random cards
  let amount_add = 7 - deck.length;
  for (let i=0; i<amount_add; i++) {
    deck.push(get_random_card(rng));
  }

  return deck2str(deck);
}


export function generate_deck(deck_name) {
  let rng = new PRNG(deck_name);
  // let generator = (rng.random() > 0.05)? generate_deck_s2 : generate_deck_s1;
  let generator = generate_deck_s2;
  return generator(deck_name);
}

export function is_standard(deck_data) {
  let numbers = deck_data.split("\n").map(x=>parseInt(x.split(" ")[0]));
  let names = deck_data.split("\n").map(x=>(x.split(" ")[1])); // EH: reconstruct this
  numbers = numbers.filter(x => !isNaN(x));
  let unique_names = [...new Set(names)];
  if (names.length != unique_names.length) {
    return false;
  }
  let banned_cards = ["可露希尔"];
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
  if (sum_value != 20) {
    return false;
  }

  return true;
}