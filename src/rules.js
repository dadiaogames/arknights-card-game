import React from 'react';
import { CARDS } from './cards';
import { ORDERS, material_icons } from './orders';

export const RULES = <div>
  <h3>明日方舟: 采掘行动 游戏规则</h3>
  <br/><br/>
  游戏目标: 获得10分；
  <br/><br/>
  在你的回合，你可以做以下事情: <br/><br/>
  <b>* 部署干员: </b>将干员从手牌中部署到场上，并消耗其部署费用(写在左上角)；<br/><br/>
  <b>* 使用干员采掘: </b>干员每有1点采掘能力，就获得1个随机材料；<br/>
  <i>举例: 博士首先使用“史都华德”进行采掘，史都华德的采掘能力为3，因此获得3个随机材料，博士因此获得了{material_icons[0]}、{material_icons[0]}和{material_icons[2]}；然后使用“阿米娅”进行采掘，阿米娅的采掘能力为2，因此获得{material_icons[0]}和{material_icons[1]}，而阿米娅的效果为“采掘: 获得1分”，所以在采掘完成后，博士还能获得1分；</i><br/><br/>
  <b>* 使用干员战斗:</b> 对目标敌人造成[攻击力]点伤害；<br/>
  <i>举例: 博士使用“克洛丝”对“破阵者”发起攻击，克洛丝的攻击力为3，因此对破阵者造成3点伤害，破阵者的生命值为2，伤害大于生命值，因此破阵者被摧毁；</i><br/><br/>
  <b>* 使用干员行动:</b> 如果干员有"行动:"效果，则可以触发其"行动:"效果；<br/>
  <i>举例: 博士使用“桃金娘”行动，桃金娘的能力为“行动: 获得3点费用”，因此博士使用桃金娘行动后，获得了3点费用</i><br/><br/>
  <b>* 完成订单:</b> 消耗订单所需的材料组合(写在订单左上角)，完成订单，获得订单的奖励(写在订单右上角，通常是2分和1个材料)；{material_icons[3]}是百搭资源，可作为任意资源交付订单；<br/><br/>
  <b>* 使用订单:</b> 已完成的订单，拥有自己的订单能力，每回合可使用一次；<br/>
<i>举例: 博士首先使用完成区的第一个订单，能力描述为“{material_icons[0]}→？+？”，也就是可以用1个{material_icons[0]}换2个随机材料，博士因此消耗1个{material_icons[0]}，获得了2个随机材料，分别为{material_icons[1]}和{material_icons[2]}，此时博士刚好凑够了3个{material_icons[2]}，立刻完成了一个需要3个{material_icons[2]}的订单，获得了2分和1个{material_icons[1]}，该订单的能力描述为“{material_icons[0]}→2分”，也就是可以用1个{material_icons[0]}换2分，博士使用了该订单，消耗了1个{material_icons[0]}，获得了2分；</i><br/>
  <br/>
  以上的事情，在你的回合，可以以任意顺执行任意次，在你的回合结束后，进入整合运动阶段；<br/><br/>
  首先，翻开2张敌人牌，以横置状态入场；<br/><br/>
  然后，场上处于重置状态的敌人，从左到右行动一次，被阻挡的敌人，会向阻挡者发起攻击，未被阻挡的敌人，会发起动乱，增加动乱值，动乱值达到8点时，游戏立刻失败；<br/><br/>
  干员的阻挡数标在场上干员的右上角，以蓝色的盾牌表示，“阻挡X”表示阻挡敌人阵列最左侧的X个敌人，已经被阻挡的敌人，不会被重复阻挡；<br/>
  <i>举例: 博士的场上有3名干员，克洛丝(阻挡0)，米格鲁(阻挡2)，和玫兰莎(阻挡1)，敌方场上有4只源石虫；克洛丝阻挡数为0，所以不阻挡任何敌人；米格鲁阻挡数为2，所以会阻挡前两只源石虫；玫兰莎阻挡数为1，所以会阻挡第三只源石虫(因为前两只已经被米格鲁阻挡)；第四只源石虫未被阻挡，因此会发起动乱，增加1点动乱值；</i>
  <br/><br/>
  拥有“行动”能力的敌人(比如高阶术师)，无论被阻挡与否，都会执行其“行动”能力；
  <br/>
  被激怒的敌人，无论被阻挡与否，都会攻击场上的一名随机干员，而不会动乱或行动；
</div>;