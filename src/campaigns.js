import { make_dialogs } from './Campaign';
import { TAGS } from './tags';
import { CARDS } from './cards';
import { ENEMIES } from './enemies';
import { ORDERS } from './orders';

const tutorial_dialogs_1 = `sea1 欢迎来到《明日方舟：采掘行动》，这是一款非常严肃、正经的同人游戏
sea9 看到对面那个二五仔了吗
https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/enemy.png
sea7 他闻起来太臭了，快解掉他！
sea5 所以如何解掉他？
sea8 首先，部署玫兰莎
https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/deploy1.png
https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/deploy2.png`;

const tutorial_dialogs_2 = `sea2 漂亮，就是这样！
sea8 接下来用玫兰莎和那个二五仔战斗
https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/fight1.png
https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/fight2.png
https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/fight3.png`;

const tutorial_dialogs_3 =`sea2 太棒了！
sea3 玫兰莎摧毁了敌人
https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/atk.png
sea9 敌人被摧毁后可以获得1分
sea8 分数达到12分，就赢了！
sea7 玫兰莎战斗之后，进入了疲劳状态，本回合也无事可做了
sea4 那就结束回合吧！`;

const tutorial_dialogs_4 = `阿米娅 博士，你还有很多工作要做，还不能休息哦
sea1 哈哈，我回来了！
sea3 你已经掌握了，如何通过战斗摧毁敌人得分
sea7 然而还有一种，更快的得分方式！
sea8 那就是完成订单
sea9 先点入“查看订单”界面
sea3 点击订单，然后点击“完成”
https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/order1.png`;
// https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/order3.png

const tutorial_dialogs_5 = `sea1 漂亮，你完成了一个订单，获得了大量分数
sea3 这游戏就是这么玩的！你已经完全掌握了这款游戏~
sea6 部署干员，使用干员战斗，完成订单
sea7 通过摧毁敌人和完成订单得分
sea1 分数达到12分就赢了！
sea8 加油，这一局你会赢得很轻松的
sea1 DameDane~Dameyo~DameDanoyo~`;

const tutorial_dialogs_6 = `sea8 看到这两个二五仔了吗
sea7 部署巡林者，把他们全部解掉！`;

const tutorial_dialogs_7 = `sea1 哈哈，我又回来了！
sea8 干员不仅可以用来战斗，也可以用来采掘材料
https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/mine.png
sea4 材料，可以用来完成订单，也可以用来强化干员
sea3 如果你觉得目前关卡太简单，可以挑战更高的危机等级，或者肉鸽模式
sea1 通过危机等级18之后，你就是高手了！`;

export const CAMPAIGNS = {
  tutorial: {
    dialogs: make_dialogs(tutorial_dialogs_1),
    tags: TAGS.map(x => ({...x})),
    setup(G, ctx) {
      // G.goal = 15;
      let sword_master = {
        ...CARDS.find(x => x.name == "玫兰莎"),
        material: 1,
        onPlay(G, ctx) {
          G.dialogs = make_dialogs(tutorial_dialogs_2);
        },
      };

      let donkey = {
        ...CARDS.find(x => x.name == "阿米娅"),
        illust: "https://z3.ax1x.com/2020/11/28/D61jL8.png",
        was_enemy: true,
        material: 2,
        onPlay(G, ctx) {
          G.dialogs = make_dialogs(tutorial_dialogs_4);
        }
      };

      let skyfire = {
        ...CARDS.find(x => x.name == "巡林者"),
        material: 1,
      }

      let sea = {
        ...CARDS.find(x => x.name == "玫兰莎"),
        material: 2,
        illust: "https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/smaller_sea/sea1.png",
        was_enemy: true,
        atk: 99,
        hp: 99,
        mine: 3,
        name: "Sea",
        onPlay(G, ctx) {
          G.dialogs = make_dialogs(tutorial_dialogs_7);
        }
      }

      let enemy1 = {
        ...ENEMIES.find(x => x.name == "小兵"),
        atk: 2,
        hp: 4,
        dmg: 0,
        onOut(G, ctx) {
          G.dialogs = make_dialogs(tutorial_dialogs_3);
        }
      };

      let enemy2 = {
        ...ENEMIES.find(x => x.name == "敌方能天使"),
        dmg: 0,
      };
      
      let enemy3 = {
        ...ENEMIES.find(x => x.name == "寻仇者"),
        atk: 10,
        hp: 4,
        dmg: 0,
        onPlay(G, ctx) {
          G.dialogs = make_dialogs(tutorial_dialogs_6);
        },
        onOut(G, ctx) {
          G.dialogs = make_dialogs("sea3 就是这样！你已经完全掌握了战斗，等两位干员都战斗完以后，就可以结束回合了");
        }
      };

      let enemy4 = {
        ...enemy2,
        onPlay(G, ctx) {
          G.dialogs = make_dialogs("sea8 哦吼，来了一位熟悉的老朋友，快把她部署上去！");
        }
      };

      let order1 = {...ORDERS[6], 
        color:0,
        onFinished(G, ctx) {
          G.not_refresh_orders = false;
          G.dialogs = make_dialogs(tutorial_dialogs_5);
        }
      };
      let order2 = {...ORDERS[4], color:0};
      

      G.hand = [sword_master];
      G.efield = [enemy1];
      G.orders = [order1, order2];
      G.deck = [...G.deck, sea, donkey, skyfire];
      G.edeck = [enemy2, enemy3, {...enemy2}, enemy4,  ...G.edeck];
      G.materials = [3,2,0,0];
      G.not_refresh_orders = true;
    }
  },
};