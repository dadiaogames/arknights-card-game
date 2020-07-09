import React from 'react';
import { Tabs, TabList, Tab } from 'react-tabs';
import { Card, CardRow, CheckCard, SCardRow, TypeFilter } from './Card';
import { Controller, EnterGame } from './Controller';
import { Panel } from './Panel';
import { TagSelection, TagList, RiskLevel } from './TagSelection';
import { DeckConstruction, DeckGeneration, Settings } from './DeckConstruction';
import { TitleScreen } from './TitleScreen';
import { get_deck_name, get_seed_name, generate_deck, is_standard } from './DeckGenerator';
import { str2deck, init_decks } from './Game';
import { map_object, sleep } from './utils';
import { CARDS, default_deck } from './cards';
import { order_illust, rhine_illust, material_icons } from './orders';
import { ICONS } from './icons';
import { TAGS } from './tags';
import { RULES } from './rules';

import './Board.css';
import 'react-tabs/style/react-tabs.css';

var _ = require("lodash");

export class Board extends React.Component {

  constructor(props){
    super(props);

    this.handle_hand_clicked = this.handle_hand_clicked.bind(this);
    this.handle_field_clicked = this.handle_field_clicked.bind(this);
    this.handle_efield_clicked = this.handle_efield_clicked.bind(this);
    this.handle_order_clicked = this.handle_order_clicked.bind(this);
    this.handle_finished_clicked = this.handle_finished_clicked.bind(this);
    this.handle_mulligan_clicked = this.handle_mulligan_clicked.bind(this);
    this.handle_deck_change = this.handle_deck_change.bind(this);

    this.enemy_move = this.enemy_move.bind(this);

    this.process_hand_data = this.process_hand_data.bind(this);
    this.process_hand_state = this.process_hand_state.bind(this);
    this.process_field_data = this.process_field_data.bind(this);
    this.process_field_state = this.process_field_state.bind(this);
    this.process_efield_data = this.process_efield_data.bind(this);
    this.process_efield_state = this.process_efield_state.bind(this);
    this.process_order_data = this.process_order_data.bind(this);
    this.process_order_state = this.process_order_state.bind(this);
    this.process_finished_data = this.process_finished_data.bind(this);
    this.process_finished_state = this.process_finished_state.bind(this);

    this.process_card_details = this.process_card_details.bind(this);
    this.process_enemy_details = this.process_enemy_details.bind(this);
    this.process_order_details = this.process_order_details.bind(this);

    this.wrap_controller_action = this.wrap_controller_action.bind(this);
    this.set_branch = this.set_branch.bind(this);
    this.check_card = this.check_card.bind(this);
    this.get_illust_attr = this.get_illust_attr.bind(this);

    this.play_card = this.play_card.bind(this);
    this.use_mine = this.use_mine.bind(this);
    this.use_fight = this.use_fight.bind(this);
    this.use_act = this.use_act.bind(this);
    this.reinforce_card = this.reinforce_card.bind(this);
    this.finish_order = this.finish_order.bind(this);
    this.use_order = this.use_order.bind(this);
    this.harvest_orders = this.harvest_orders.bind(this);

    this.render_title_board = this.render_title_board.bind(this);
    this.render_rules_board = this.render_rules_board.bind(this);
    this.render_game_board = this.render_game_board.bind(this);
    this.render_tag_board = this.render_tag_board.bind(this);
    this.render_deck_board = this.render_deck_board.bind(this);
    this.render_card_board = this.render_card_board.bind(this);
    this.render_preview_board = this.render_preview_board.bind(this);
    this.render_mulligan_board = this.render_mulligan_board.bind(this);
    this.render_setting_board = this.render_setting_board.bind(this);

    this.change_board = this.change_board.bind(this);
    this.choose_tag = this.choose_tag.bind(this);
    this.get_risk_level = this.get_risk_level.bind(this);
    this.enter_game = this.enter_game.bind(this);
    this.check_deck = this.check_deck.bind(this);
    this.back = this.back.bind(this);

    this.state = {
      hand_selected: -1,
      field_selected: -1,
      efield_selected: -1,
      order_selected: -1,
      finished_selected: -1,
      hand_choices: [false, false, false, false, false],

      branch: {},
      show_field: true,
      show_tag_selection: false,

      stage: "player",

      board: this.render_title_board, 
      // board: this.render_mulligan_board,
      last_board: this.render_title_board,

      tags: TAGS,
      risk_level: 0, // this is changed on game begin

      deck_mode: "random",
      deck_name: get_deck_name(),
      deck_data: CARDS.slice(0,10).map(x=>`3 ${x.name}`).join("\n"),
      preview_deck: CARDS.map(x=>({...x, material:Math.floor(Math.random()*3)})),

      seed: get_seed_name(),

      checking: {},

      scenario_finished: false,
    };

    this.branches = { // TODO: set all "check" aside to the right, this is not done using Controller, first set the width of controller, then add a new button on render_board
      hand: {
        部署: this.play_card,
      },
      field: {
        采掘: this.use_mine,
        战斗: this.use_fight,
      },
      efield: {
        战斗: this.use_fight,
      },
      orders: {
        完成: this.finish_order,
      },
      finished: {
        行动: this.use_order,
        一键收货: this.harvest_orders,
      },
    };

    this.log_select = () => ((this.props.G.messages[0].includes("选定")? this.props.moves.changeMsg : this.props.moves.logMsg));
  }

  choose_tag(idx) {
    return () => {
      let new_tags = this.state.tags;
      new_tags[idx].selected = !new_tags[idx].selected;
      this.setState({tags: new_tags});
    };
  }

  get_risk_level() {
    let selected_tags = this.state.tags.filter(t => t.selected);
    let reducer = (acc, val) => (acc + val.level);
    let risk_level = selected_tags.reduce(reducer, 0);
    return risk_level;
  }
  
  check_card() {
    this.change_board("card");
    return this.state.branch;
  }

  play_card() {
    this.props.moves.play(this.state.hand_selected);
    this.setState({hand_selected: -1});
    return {};
  }
  
  use_mine() {
    this.props.moves.mine(this.state.field_selected);
    this.setState({field_selected: -1});
    return {};
  }

  use_fight() {
    this.props.moves.fight(this.state.field_selected, this.state.efield_selected);
    this.setState({
      field_selected: -1,
      efield_selected: -1,
    });
    return {};
  }

  use_act() {
    this.props.moves.act(this.state.field_selected);
    this.setState({field_selected: -1});
    return {};
  }

  reinforce_card() {
    this.props.moves.reinforce(this.state.field_selected);
    this.setState({field_selected: -1});
    return {};
  }

  finish_order() {
    this.props.moves.finishOrder(this.state.order_selected);
    this.setState({order_selected: -1});
    return {};
  }

  use_order() {
    this.props.moves.useOrder(this.state.finished_selected);
    this.setState({finished_selected: -1});
    return {};
  }

  harvest_orders() {
    this.props.moves.harvest();
    this.setState({finished_selected: -1});
    return {};
  }

  get_illust_attr(card) {
    if (card.was_enemy) {
      return "e_illust";
    }

    else if (card.reversed) {
      return "r_illust";
    }

    else {
      return "illust";
    }
  }
  
  process_hand_data(card) {
    let illust = this.get_illust_attr(card);
    let data = {
      [illust]: card.illust,
      atk: card.atk,
      hp: card.hp,
      cost: card.cost,
    };
    if (card.power > 0) {
      data.power = "↑"+card.power;
    }
    return data;
  }

  process_hand_state(card) {
    return {
      selected: (this.state.hand_selected == this.props.G.hand.indexOf(card)),
    }
  }
  
  process_field_data(card) {
    let illust = this.get_illust_attr(card);
    let data = {
      [illust]: card.illust,
      atk: card.atk,
      hp: (card.hp - card.dmg),
      mine: (<span>{ICONS.mine}{card.mine}</span>),
    };
    if (card.block > 0) {
      data.block = (<span>{ICONS.block}{card.block}</span>);
    }
    if (card.power > 0) {
      data.power = `↑${card.power}`;
    }
    return data;
  }

  process_field_state(card) {
    return {
      selected: (this.state.field_selected == this.props.G.field.indexOf(card)),
      exhausted: card.exhausted, 
      damaged: (card.dmg > 0),
    }
  }

  process_efield_data(card) {
    let illust = this.props.G.rhodes_training_mode?"illust":"e_illust";
    return {
      [illust]: card.illust,
      atk: card.atk,
      hp: (card.hp - card.dmg),
      //cost: card.cost,
    };
  }

  process_efield_state(card) {
    return {
      selected: (this.state.efield_selected == this.props.G.efield.indexOf(card)),
      exhausted: card.exhausted, 
      damaged: (card.dmg > 0),
      enraged: card.enraged,
    }
  }

  process_order_data(card) {
    //EH: reconstruct this
    let requirements = [];
    for (let i=0; i<3; i++) {
      let icon = ICONS[Object.keys(ICONS)[i]];
      let amount = card.requirements[i];
      for (let j=0; j<amount; j++) {
        requirements.push(icon);
      }
    }
    return {
      o_illust: "https://ak.hypergryph.com/upload/images/20190228/32ddf0470a305376204d1312ca4720f9.jpg",
      requirements: requirements,
      score: card.score,
      reward: material_icons[card.reward],
      order_effect: card.desc,
    };
  }

  process_order_state(card) {
    return {
      selected: (this.state.order_selected == this.props.G.orders.indexOf(card)),
      exhausted: card.exhausted, 
    }

  }

  process_finished_data(card) {
    return {
      o_illust: card.rhine? rhine_illust : order_illust,
      finished_effect: card.desc,
    };
  }

  process_finished_state(card) {
    return {
      selected: (this.state.finished_selected == this.props.G.finished.indexOf(card)),
      exhausted: card.exhausted, 
    }
  }

  process_card_details(card) {
    let illust = card.was_enemy?"eo_illust_detailed":"illust_detailed";
    if (card.reversed) {
      illust = "r_" + illust;
    }
    return {
      [illust]: card.illust,
      cost_detailed: card.cost,
      desc: (
        <span>
          <span style={{fontSize:"120%"}}>
            {card.atk}/{card.hp} &nbsp;
            {ICONS.mine}{card.mine} &nbsp;
            {(card.block>0)? (<span>{ICONS.block}{card.block}</span>) : ""}
          </span>
          <br/>
          {card.desc||""}
          <br/>
          ({_.times(card.reinforce, ()=>material_icons[card.material])}: {card.reinforce_desc||""})
          <br />
          <i>{card.quote||""}</i>
        </span>
      ), // TODO: figure out why only string formatting does not work, I think it maybe because of JSX only accept string in html way instead of js way
    }
  }

  process_enemy_details(card) {
    return {
      eo_illust_detailed: card.illust,
      desc: (
        <span>
          {card.atk}/{card.hp}
          <br/>
          {card.desc||""}
        </span>
      ),
    }
  }

  process_order_details(card) {
    return {
      eo_illust_detailed: order_illust,
      desc: card.desc,
    };
  }

  enemy_move(i) {
    if (i < this.props.G.efield.length) {
      let sleep_time = 350;
      if (i < 0) {
        this.props.moves.drawEnemy(); // start from -2 to draw 2 enemies
      }
      else {
        if (this.props.G.efield[i].exhausted) {
          sleep_time = 50;
        }
        this.props.moves.enemyMove(i);
      }
      sleep(sleep_time).then(() => {this.enemy_move(i+1);});
    }
    else{
      this.props.events.endTurn();
    }
  }

  handle_hand_clicked(idx) {
    let card = this.props.G.hand[idx];
    return () => {
      this.setState({
        hand_selected: idx,
        checking: this.process_card_details(card),
      });
      this.set_branch("hand");
      this.log_select()("选定 "+card.name);
    };
  }

  handle_field_clicked(idx) {
    let card = this.props.G.field[idx];
    return () => {
      this.setState({
        field_selected: idx,
        checking: this.process_card_details(card),
      });
      this.log_select()("选定 "+card.name);

      let new_branch = Object.assign({}, this.branches.field);
      // Add action
      if (this.props.G.field[idx].action) {
        new_branch["行动"] = this.use_act;
      }
      console.log(Object.keys(new_branch));
      // Add reinforce
      new_branch["强化"+card.material] = this.reinforce_card;

      this.setState({branch: map_object(this.wrap_controller_action, new_branch)});
    };
  }

  handle_efield_clicked(idx) {
    let card = this.props.G.efield[idx];
    return () => {
      this.setState({
        efield_selected: idx,
        checking: this.process_enemy_details(card),
      });
      this.set_branch("efield");
      this.log_select()("选定 "+card.name);
    };
  }

  handle_order_clicked(idx) {
    let card = this.props.G.orders[idx];
    return () => {
      this.setState({
        order_selected: idx,
        checking: this.process_order_details(card),
      });
      this.set_branch("orders");
      this.log_select()("选定订单");
    };
  }

  handle_finished_clicked(idx) {
    let card = this.props.G.finished[idx];
    return () => {
      this.setState({
        finished_selected: idx,
        checking: this.process_order_details(card),
      });
      this.set_branch("finished");
      this.log_select()("选定订单");
    };
  }

  handle_mulligan_clicked(idx) {
    return () => {
      let choices = this.state.hand_choices;
      choices[idx] = !choices[idx];
      this.setState({hand_choices: choices});
    }
  }

  handle_deck_change(event) {
    let attr = (this.state.deck_mode == "random")? "deck_name" : "deck_data";
    let changer = {};
    // TODO: reconstruct this
    changer[attr] = event.target.value;
    this.setState(changer);
  }

  wrap_controller_action(action) {
    return () => {this.set_branch(action())};
  }

  set_branch(branch) {
    if (typeof branch == "string") {
        this.setState({
          branch: map_object(this.wrap_controller_action, this.branches[branch])
        });
    }
    else {
      this.setState({branch: map_object(this.wrap_controller_action, branch)});
    }

  }

  change_board(new_board) {
    const boards = {
      "title": this.render_title_board,
      "rules": this.render_rules_board,
      "game": this.render_game_board,
      "tag": this.render_tag_board,
      "deck": this.render_deck_board,
      "card": this.render_card_board,
      "preview": this.render_preview_board,
      "mulligan": this.render_mulligan_board,
      "settings": this.render_setting_board,
    };
    this.setState({last_board: this.state.board})
    this.setState({board: boards[new_board]});
  }

  check_deck() {
    this.change_board("preview");
  }

  back() {
    this.setState({board: this.state.last_board});
  }

  enter_game() {
    let deck_data = (this.state.deck_mode == "random")? generate_deck(this.state.deck_name) : this.state.deck_data;
    this.props.moves.setDecks(init_decks(deck_data, this.state.seed));
    this.props.moves.addTags(this.state.tags.filter(t => t.selected));
    this.props.moves.onScenarioBegin();
    this.setState({hand_choices: [false, false, false, false, false]});
    this.change_board("mulligan");
  }

  end_game() {
    this.props.reset();
    this.setState({
      scenario_finished: false,
      seed: get_seed_name(),
    });
    this.change_board("tag");
  }

  componentDidUpdate() {
    let result = this.props.ctx.gameover;
    if (result && !this.state.scenario_finished) {
      this.setState({scenario_finished: true});
      let good_grade = "O-oooooooooo AAAAE-A-A-I-A-U- JO-oooooooooooo AAE-O-A-A-U-U-A- E-eee-ee-eee AAAAE-A-E-I-E-A- JO-ooo-oo-oo-oo EEEEO-A-AAA-AAAA";

      if (result.win) {
        let risk_level = this.get_risk_level();
        let grade = "D";
        // TODO: reconstruct this using "range" function
        if (risk_level < 0 || this.props.G.rhodes_training_mode) {
          grade = good_grade;
        }
        else if (risk_level >= 0 && risk_level < 2) {
          grade = "C";
        }
        else if (risk_level >= 2 && risk_level < 4) {
          grade = "B";
        }
        else if (risk_level >= 4 && risk_level < 8) {
          grade = "A";
        }
        else if (risk_level >= 8 && risk_level < 12) {
          grade = "S";
        }
        else if (risk_level >= 12 && risk_level < 16) {
          grade = "SS";
        }
        else if (risk_level >= 16 && risk_level < 22) {
          grade = "SSS";
        }
        else if (risk_level >= 22 && risk_level < 30) {
          grade = "SSSS";
        }
        else {
          grade = "SSSSS";
        }
        // TODO: reconstruct this part, flat is better than nested
        let finish = this.props.G.rhodes_training_mode?"任务失败":"任务完成";
        alert(`${finish}\n完成危机等级: ${risk_level}\n评级: ${grade}\n使用卡组: ${this.state.deck_mode=="random"?this.state.deck_name:`${is_standard(this.state.deck_data)?"标准":"狂野"}自组卡组`}\n地图种子: ${this.state.seed}`);
      }

      else {
        let failed = this.props.G.rhodes_training_mode?"任务完成":"任务失败";
        alert(`${failed}\n原因: ${result.reason}\n${this.props.G.rhodes_training_mode?`评级: ${good_grade}\n`:""}地图种子: ${this.state.seed}`);
      }

    }
  }

  render_title_board() {
    return <div className="board">
      <TitleScreen enterGame={()=>this.change_board("tag")} checkRule={()=>this.change_board("rules")} checkDeck={this.check_deck} />
    </div>;
  }

  render_rules_board() {
    return <div className="board">
      <div style={{
        height: "80%", 
        width: "94%", 
        margin:"3%", 
        overflow:"scroll",
        }}>
        {/* this part, css in js, or css in file? 
        In my view, after this part is moved to a new file, change it to css in file
        TODO: reconstruct this part
        */}
      {RULES}
      </div>
      <button 
        onClick={()=>this.change_board("title")}
        className="preview-button"
      >
        返回
      </button>
    </div>;
  }

  render_preview_board() {
    return (<div className="board" >
      <SCardRow 
        cards = {this.state.preview_deck.map(this.process_card_details)}
      />
      <button className="preview-button" onClick={this.back}>
        返回
      </button>
    </div>);
  }

  render_mulligan_board() {
    // TODO: reconstruct the mulligan part
    return (<div className="board" style={{position:"relative"}} >
      <span style={{position:"absolute", top:"10%", left:"3%"}}>请选择要重调的手牌</span>
      <SCardRow 
        cards = {this.props.G.hand.map(this.process_card_details)}
        handleClick = {this.handle_mulligan_clicked}
        additionalStyles = {this.state.hand_choices.map(x => ({border: x?"3px solid blue":"2px solid"}))}
      />
      <button 
        className="preview-button" 
        onClick={() => {
          this.props.moves.mulligan(this.state.hand_choices);
          this.change_board("game");
        }}
      >
        完成重调
      </button>
    </div>);

  }

  render_game_board() {
    // EH: map object in state changing and store the mapped object in state

    // SR: player panel
    // TODO: reconstruct this, this is stateful, and html elements should go to stateless
    let material_display = (idx) => (
      <span style={{color:(this.props.G.gained.includes(idx))?"blue":"black"}}>
        {material_icons[idx]}:{this.props.G.materials[idx]}&nbsp;&nbsp;&nbsp; 
      </span>
    );

    let player_panel = (<div>
      <p style={{marginTop:"2%"}}>
        {[0,1,2,3].map(material_display)}
        费用: {this.props.G.costs}  
        <br/>
        <button 
          className="player-panel-button"
          onClick={() => {this.setState({show_field: !this.state.show_field})}}
        >
          {(this.state.show_field)? "查看订单" : "查看战场"}
        </button>
        <button 
          className="player-panel-button"
          style={{
            display: (this.props.G.stage=="enemy")? "none" : ""
          }} 
          onClick={()=>{
            this.props.moves.enemyInit();
            this.enemy_move(this.props.G.more_enemies?-3:-2);
          }}
        >
          结束回合
        </button>
        <button 
          className="player-panel-button"
          style={{
            display: (this.props.ctx.gameover)? "" : "none"
          }} 
          onClick={()=>{this.end_game();}}
        >
          结束游戏
        </button>
      </p>
    </div>);

    //SR: game panel and debug the <p> and maybe get all styles out of this
    //And learn about the diff between span and p
    let game_panel = (<div>
      <p style={{marginTop: "0%"}}>
        动乱:{this.props.G.danger}/{this.props.G.max_danger} &nbsp;&nbsp;&nbsp;
        分数:{this.props.G.score}/{this.props.G.goal}<br/>
        <button 
          onClick={()=>this.end_game()}
          style = {{
            position: "absolute",
            fontSize: "120%",
            top: "2%",
            left: "88%",
          }}
        >
        ⟳
        </button>

        <span onClick={()=>{alert(this.props.G.messages.slice(0,20).join("\n"));}}>{this.props.G.messages[0]}</span>
      </p>
          </div>);

    let field_cardrow = (
      <CardRow 
        cards = {this.props.G.field.map(this.process_field_data)}
        states = {this.props.G.field.map(this.process_field_state)}
        handleClick = {this.handle_field_clicked}
      />
    );

    let hand_cardrow = (
      <CardRow
          cards = {this.props.G.hand.map(this.process_hand_data)}
          states = {this.props.G.hand.map(this.process_hand_state)}
          handleClick = {this.handle_hand_clicked}
        />
    );

    let orders_cardrow = (
      <CardRow 
        cards = {this.props.G.orders.map(this.process_order_data)}
        states = {this.props.G.orders.map(this.process_order_state)}
        handleClick = {this.handle_order_clicked}
        additionalStyle = {{height: "28%"}}
        cardStyle = {{height: "70%", marginRight:"5%"}}
      />
    );

    let finished_cardrow = (
      <CardRow 
        cards = {this.props.G.finished.map(this.process_finished_data)}
        states = {this.props.G.finished.map(this.process_finished_state)}
        handleClick = {this.handle_finished_clicked}
        additionalStyle = {{height: "25%", marginTop:"16%"}}
      />
    );

    return (
      <div className="board" >
        <Panel 
          variant = "game-panel"
          content = {game_panel}
        />
        <CardRow 
          cards = {this.props.G.efield.map(this.process_efield_data)}
          states = {this.props.G.efield.map(this.process_efield_state)}
          handleClick = {this.handle_efield_clicked}
          additionalStyle = {{display: this.state.show_field?"":"none"}}
        />
        {(this.state.show_field)? field_cardrow : finished_cardrow}
        <Controller 
          actions = {this.state.branch}
          checkCard = {(Object.keys(this.state.branch).length!=0)?this.wrap_controller_action(this.check_card):undefined}
        />
        {(this.state.show_field)? hand_cardrow : orders_cardrow}
        <Panel 
          variant = "player-panel"
          content = {player_panel}
        />

      </div>
    );
  }

  render_card_board() {
    return (
      <div className="board" align="center">
        <CheckCard 
          card={this.state.checking} 
          handleClick={()=>this.change_board("game")} 
        />
      </div>
    );

  }

  render_tag_board() {
    let risk_level = this.get_risk_level();

    return (
      <div className="board" >
        <TagSelection 
          tags = {this.state.tags}
          handleClick = {this.choose_tag}
        />
        <TagList 
          selected_tags = {this.state.tags.filter(t => t.selected)}
        />
        <RiskLevel 
          risk_level = {risk_level}
        />
        <br/>
        <div 
          style={{
            color: "red", 
            marginLeft: "2%",
            marginTop: "-3%",
            display:(risk_level>=16)? "" : "none"
          }}
        >
          当前合约难度极大，请谨慎行动
        </div>
        
        <EnterGame 
          switchScene = {() => {this.change_board("deck")}}
          action = "查看卡组"
        />
        
      </div>
    );
  }

  render_deck_board() {
    let deck_generation = (<DeckGeneration
      value = {this.state.deck_name}
      handleChange = {this.handle_deck_change}
      changeName = {() => this.setState({deck_name:get_deck_name()})}    
      checkDeck = {() => {
        this.setState({preview_deck: str2deck(generate_deck(this.state.deck_name))});
        this.check_deck();
      }}
      />);

    let deck_construction = (<DeckConstruction 
      value = {this.state.deck_data}
      handleChange = {this.handle_deck_change}
      checkDeck = {() => {
        this.setState({preview_deck: str2deck(this.state.deck_data)});
        this.check_deck();
      }}
      checkCards = {() => {
        this.setState({
          preview_deck: CARDS.map(x=>({...x, material:Math.floor(Math.random()*3)})),});
        this.check_deck();
      }}
    />)

    return (
      <div className="board" >
        <Tabs 
          onSelect={(idx)=>this.setState({deck_mode:["random", "custom"][idx]})}
          selectedIndex={["random", "custom"].indexOf(this.state.deck_mode)}
          style={{margin: "2%", height: "8%",}}
        >
          <TabList>
            <Tab>随机卡组</Tab>
            <Tab>自组卡组</Tab>
          </TabList>
        </Tabs>

        {(this.state.deck_mode == "random")? deck_generation : deck_construction}

        <EnterGame 
          switchScene = {() => {this.enter_game()}}
          action = "进入游戏"
          advancedSettings = {() => {this.change_board("settings")}}
        />
      </div>
    );
  }

  render_setting_board() {
    return (<div className="board">
      <Settings 
        back = {() => this.back()}
        handleChange = {(event) => {this.setState({seed: event.target.value})}}
        value = {this.state.seed}
      />
    </div>);
  }

  render() {
    return this.state.board(); 
  }
}