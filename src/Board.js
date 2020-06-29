import React from 'react';
import { Card, CardRow, CardDetailed } from './Card';
import { Controller, EnterGame } from './Controller';
import { Panel } from './Panel';
import { TagSelection, TagList, RiskLevel } from './TagSelection';
import { DeckConstruction } from './DeckConstruction';
import { get_deck_name, generate_deck } from './DeckGenerator';
import { map_object, sleep } from './utils';
import { CARDS, default_deck } from './cards';
import { order_illust, material_icons } from './orders';
import { ICONS } from './icons';
import { TAGS } from './tags';

import './Board.css';

export class Board extends React.Component {

  constructor(props){
    super(props);

    this.handle_hand_clicked = this.handle_hand_clicked.bind(this);
    this.handle_field_clicked = this.handle_field_clicked.bind(this);
    this.handle_efield_clicked = this.handle_efield_clicked.bind(this);
    this.handle_order_clicked = this.handle_order_clicked.bind(this);
    this.handle_finished_clicked = this.handle_finished_clicked.bind(this);
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

    this.play_card = this.play_card.bind(this);
    this.use_mine = this.use_mine.bind(this);
    this.use_fight = this.use_fight.bind(this);
    this.use_act = this.use_act.bind(this);
    this.finish_order = this.finish_order.bind(this);
    this.use_order = this.use_order.bind(this);

    this.render_game_board = this.render_game_board.bind(this);
    this.render_tag_board = this.render_tag_board.bind(this);
    this.render_deck_board = this.render_deck_board.bind(this);
    this.render_card_board = this.render_card_board.bind(this);

    this.change_board = this.change_board.bind(this);
    this.choose_tag = this.choose_tag.bind(this);
    this.get_risk_level = this.get_risk_level.bind(this);
    this.enter_game = this.enter_game.bind(this);

    this.state = {
      hand_selected: -1,
      field_selected: -1,
      efield_selected: -1,
      order_selected: -1,
      finished_selected: -1,

      branch: {},
      show_field: true,
      show_tag_selection: false,

      stage: "player",

      board: this.render_tag_board, //function or string here?

      tags: TAGS,
      risk_level: 0, // this is changed on game begin
      deck_name: get_deck_name(),

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
  
  process_hand_data(card) {
    return {
      illust: card.illust,
      atk: card.atk,
      hp: card.hp,
      cost: card.cost,
    };
  }

  process_hand_state(card) {
    return {
      selected: (this.state.hand_selected == this.props.G.hand.indexOf(card)),
    }
  }
  
  process_field_data(card) {
    let data = {
      illust: card.illust,
      atk: card.atk,
      hp: (card.hp - card.dmg),
      mine: (<span>{ICONS.mine}{card.mine}</span>),
    };
    if (card.block > 0) {
      data.block = (<span>{ICONS.block}{card.block}</span>);
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
    return {
      e_illust: card.illust,
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
      o_illust: order_illust,
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
    return {
      illust_detailed: card.illust,
      cost_detailed: card.cost,
      desc: (
        <span>
          {card.atk}/{card.hp} &nbsp;
          {ICONS.mine}{card.mine} &nbsp;
          {(card.block>0)? (<span>{ICONS.block}{card.block}</span>) : ""}
          <br/>
          {card.desc||""}
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
      this.setState({stage: "enemy"});
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
      this.setState({stage:"player"});
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

      let new_branch = this.branches.field;
      console.log(Object.keys(new_branch));
      // Add action
      if (this.props.G.field[idx].action) {
        new_branch["行动"] = this.use_act;
      }
      console.log(Object.keys(new_branch));
      // TODO: add reinforce

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

  handle_deck_change(event) {
    this.setState(
      {deck_name: event.target.value}
    );
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
      "game": this.render_game_board,
      "tag": this.render_tag_board,
      "deck": this.render_deck_board,
      "card": this.render_card_board,
    };
    this.setState({board: boards[new_board]});
  }

  enter_game() {
    this.props.moves.setDeck(generate_deck(this.state.deck_name));
    this.props.moves.addTags(this.state.tags.filter(t => t.selected));
    this.props.moves.onScenarioBegin();
    this.change_board("game");
  }

  end_game() {
    this.props.reset();
    this.setState({scenario_finished: false});
    this.change_board("tag");
  }

  componentDidUpdate() {
    let result = this.props.ctx.gameover;
    if (result && !this.state.scenario_finished) {
      this.setState({scenario_finished: true});

      if (result.win) {
        let risk_level = this.get_risk_level();
        let grade = "D";
        // TODO: reconstruct this using "range" function
        if (risk_level >= 0 && risk_level < 2) {
          grade = "C";
        }
        else if (risk_level >= 2 && risk_level < 4) {
          grade = "B";
        }
        else if (risk_level >= 4 && risk_level < 6) {
          grade = "A";
        }
        else if (risk_level >= 6 && risk_level < 8) {
          grade = "S";
        }
        else if (risk_level >= 8 && risk_level < 10) {
          grade = "SS";
        }
        else {
          grade = "SSS";
        }
        alert(`任务完成\n完成危机等级: ${risk_level}\n评级: ${grade}`);
      }

      else {
        alert(`任务失败\n原因: ${result.reason}`);

      }

    }
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
            display: (this.state.stage=="enemy")? "none" : ""
          }} 
          onClick={()=>{this.enemy_move(-2);}}
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
      />
    );

    let finished_cardrow = (
      <CardRow 
        cards = {this.props.G.finished.map(this.process_finished_data)}
        states = {this.props.G.finished.map(this.process_finished_state)}
        handleClick = {this.handle_finished_clicked}
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
        <CardDetailed 
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
            display:(risk_level>=5)? "" : "none"
          }}
        >
          当前合约难度极大，请谨慎行动
        </div>
        
        <EnterGame 
          switchScene = {() => {this.change_board("deck")}}
          switchText = "查看卡组"
          enterGame = {() => {this.enter_game()}}
        />

        
      </div>
    );
  }

  render_deck_board() {
    return (
      <div className="board" >
        <DeckConstruction
          value = {this.state.deck_name}
          handleChange = {this.handle_deck_change}
          changeName = {() => this.setState({deck_name:get_deck_name()})}    
          />

        <EnterGame 
          switchScene = {() => {this.change_board("tag")}}
          switchText = "查看词条"
          enterGame = {() => {this.enter_game()}}
        />
      </div>
    );
  }

  render() {
    return this.state.board(); 
  }
}