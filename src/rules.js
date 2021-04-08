import React from 'react';
import { CARDS } from './cards';
import { ORDERS, material_icons } from './orders';
import { ICONS } from './icons';

import './rules.css';

export const RULES = <div>
  <h2>明日方舟: 采掘行动 游戏规则</h2>
  <img className="rules-img" src="https://i.postimg.cc/cCzdr1gZ/klbw3-Q5-f5ob-Zc-T3c-Sy4-u0-jpg-medium.jpg" />
  <br/><br/>
  <a href="https://www.bilibili.com/video/BV1554y167ax
">2分钟视频教学(B站)</a>
  <br/><br/>
  游戏目标: <b>获得12分</b>
  <br/><br/>
  在你的回合，你可以做以下事情: <br/><br/>
  <b>* 部署干员: </b>将干员部署到场上，并消耗其费用(写在左上角)；
  <img className="rules-img" src="https://i.postimg.cc/P5MCJTqv/2021-04-08-11-19-39.png" />
  <br/><br/>
  <b>* 使用干员战斗:</b> 点击场上干员，然后点击敌人，接着点击“战斗”，该干员就会对敌人发起攻击！若摧毁了敌人可获得1分；<br/>
  <img className="rules-img" src="https://i.postimg.cc/FKs7J8fW/2021-04-08-11-20-54.png" />
  <br/>
  <i>举例: 博士使用"玫兰莎"对"敌方能天使"发起攻击，"玫兰莎"的攻击力为4，因此对"敌方能天使"造成4点伤害；</i><br/>
  <img className="rules-img" src="https://i.postimg.cc/BZdLwmyb/2021-04-08-11-31-27.png" />
  <br/><br/>
  <b>* 使用干员采掘: </b>干员每有1点采掘力，就获得1个随机材料（材料有什么用？可以交订单得分，也可以强化干员）；
  <img className="rules-img" src="https://i.postimg.cc/nVs9ky3N/2021-04-08-11-20-07.png" />
  <br/>
  <i>举例: 博士使用"史都华德"进行采掘，史都华德的采掘力为3，博士因此获得了{material_icons[0]}{material_icons[0]}和{material_icons[1]}；</i><br/><br/>
  <img className="rules-img" src="https://i.postimg.cc/BvYt5pHq/2021-04-08-11-20-25.png" /><br/>
    <b>* 使用干员行动:</b> 如果干员有"行动:"效果，则触发之；
  <img className="rules-img" src="https://i.postimg.cc/VkwSzdzc/2021-04-08-11-21-15.png" />
    <br/>
  <i>举例: 博士使用"桃金娘"行动，桃金娘的能力为"行动: 获得3点费用"，因此博士使用桃金娘行动后，获得了3点费用；</i><br/><br/>
  <b>* 完成订单:</b> 消耗订单所需的材料组合(写在订单左上角)，完成订单，获得订单的奖励(写在右上角，通常是2分和1个材料)；{material_icons[3]}是百搭资源，可作为任意资源使用；
  <img className="rules-img" src="https://i.postimg.cc/cHvCF3Bf/2021-04-08-11-21-57.png" />
  <br/><br/>
  <b>* 使用订单能力:</b> 已完成的订单，拥有自己的订单能力，每回合可使用一次；
  <img className="rules-img" src="https://i.postimg.cc/6TJXL2M6/2021-04-08-11-22-12.png" />
  <br/>
  <i>举例: 博士消耗了3个{material_icons[1]}，完成了1个需要3个{material_icons[1]}的订单，获得了2分和1个{material_icons[2]}，此时博士刚好凑够了3个{material_icons[2]}，立刻再完成了一个需要3个{material_icons[2]}的订单，获得了2分和1个{material_icons[1]}，该订单的能力描述为"{material_icons[0]}→2分"，也就是可以用1个{material_icons[0]}换2分，博士使用了该订单，消耗了1个{material_icons[0]}，获得了2分，此时博士总共获得了6分，再得9分即可获胜；</i><br/>
  <br/>
  以上的事情，在你的回合，可以以任意顺序执行任意次；<br/>
  额外说明: 所有干员能力的作用对象(如造成伤害、强化手牌、横置、重置等)均为随机选择<br/><br/>
  <b>看到这里，只要你理解了部署、战斗、采掘，以及如何通过完成订单得分之后，就可以开始玩起来啦！</b><br/>以下内容都是对规则细节的补充：<br/><br/>
  回合结束时，场上每有1个重置状态的干员，就获得1点费用；<br/>
  在你的回合结束后，进入整合运动阶段:<br/><br/>
  首先，<b>翻开2张敌人牌，</b>以横置状态入场；<br/><br/>
  然后，场上的敌人，<b>从左到右行动一次，</b>被阻挡的敌人，会向其阻挡者发起攻击；未被阻挡的敌人，会发起动乱，增加动乱值，动乱值达到8点时，游戏立刻失败；<br/><br/>
  干员的阻挡数标在场上干员的右上角，以蓝色的盾牌表示，"阻挡X"表示阻挡敌人阵列最左侧的X个敌人，已经被阻挡的敌人，不会被重复阻挡；
  <img className="rules-img" src="https://i.postimg.cc/sxXLQp7G/2021-04-08-11-22-50.png" />
  <br/>
  <i>举例: 博士的场上有3名干员，克洛丝(阻挡0)，米格鲁(阻挡2)，和玫兰莎(阻挡1)，敌方场上有4只源石虫；克洛丝阻挡数为0，所以不阻挡任何敌人；米格鲁阻挡数为2，所以会阻挡前两只源石虫；玫兰莎阻挡数为1，所以会阻挡第三只源石虫(因为前两只已经被米格鲁阻挡)；第四只源石虫未被阻挡，因此会发起动乱，增加1点动乱值；</i>
  <br/><br/>
  拥有"行动:"能力的敌人(比如高阶术师)，无论被阻挡与否，都会执行其"行动:"能力；
  <br/>
  愤怒状态的敌人，一定会发起攻击，如果未被阻挡，则会攻击场上的一名随机干员，而不会发起动乱或行动；
  <br/><br/>
  <b>挑战任务:</b>
  <br/>
  * 完成危机等级18  <br/>
  * 完成危机等级30  <br/>
  * 完成危机等级-50  <br/>
  * 在“周常挑战”中达到SS评级 <br/>
  * 通关“黑角的金针菇迷境”整装待发难度  <br/>
  * 使用自组卡组"20 斯卡蒂"完成危机等级18  <br/>
  * 使用自组卡组"20 嘉维尔"完成危机等级18  <br/>
  * 使用自组卡组"20 热水壶"完成危机等级18  <br/>
  * 完成危机等级40  <br/>
  <br/><br/>
  <h4>FAQ:</h4>
  <b>Q: 这游戏为什么这么屑？</b><br/>
  A: 大雕出品，必属精品；<br/>
  <b>Q: {"<+1>"}是什么+1?</b><br/>
  A: 你有没有觉得{"<>"}很像一个镐子？<br/>
  <b>Q: “重置状态”是什么意思？</b><br/>
  A: 边是黑的，就是重置状态，边是红的，就是横置状态，干员一回合只能动一次，边从黑色变成红色，就是动过了；<br/>
  <b>Q: “超杀”是什么意思？</b><br/>
  A: “超杀”全称为“战斗: 摧毁目标并造成额外伤害时”，属于“战斗:”效果的一种，比如5点攻击力打2血的，溢出了3点伤害，就会触发“超杀”效果；<br/>
  <b>Q: 场面和手牌的上限都是多少？</b><br/>
  A: 场面上限和手牌上限都是7，召唤类效果无视场面上限，获得手牌类效果(比如摄影车、清流)无视手牌上限;<br/>
  <b>Q: 哪些干员无法被重置？</b><br/>
  A: 雷蛇，白面鸮，艾雅法拉，能天使，温蒂，霜叶；<br/>
  <b>Q: 为什么阿米娅强化1次之后，点击行动，会变成近卫阿米娅？</b><br/>
  A: 游戏里还有更多的彩蛋等着你来发现~<br/>
  <b>Q: 替换是什么意思？</b><br/>
  A: 出场时会换掉敌人阵列中最后一个非精英敌人，是个好效果；<br/>
  <b>Q: 为什么敌方牌库被抽完也算输？</b><br/>
  A: 只有分数达标才算赢，别的都算输；<br/>
  <b>Q: </b><br/>
  A: <br/>
  <b>Q: </b><br/>
  A: <br/>
  <br/><br/>
  <b>成就一览:</b>
  <br/>
  <span>* 女主角</span><br/>
  <span>* 罗德岛的基石</span><br/>
  <span>* 常山豆子龙</span><br/>
  <span>* 特殊召唤</span><br/>
  <span>* 推进之王</span><br/>
  <span>* 赤霄·绝影</span><br/>
  <span>* 企鹅物流</span><br/>
  <span>* 龙门消防局</span><br/>
  {/* <span>* 无敌的小火龙</span><br/> */}
  <span>* 沸腾爆裂</span><br/>
  <span>* 真银斩</span><br/>
  <span>* 爆发剂·榴莲味</span><br/>
  <span>* 17张牌你能秒我</span><br/>
  <span>* 德克萨斯做得到吗</span><br/>
</div>;