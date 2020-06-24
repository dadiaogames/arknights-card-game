import React from 'react';
import { Card, CardRow } from './Card';
import { Controller } from './Controller';
import { Panel } from './Panel';
import { map_object, sleep } from './utils';
import { ICONS } from './icons';

import './Board.css';

export class Board extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      hand_selected: -1,
      field_selected: -1,
      efield_selected: -1,
      order_selected: -1,
      finished_selected: -1,

      branch: {},
      show_field: false,

      stage: "player",
    };

    this.handle_hand_clicked = this.handle_hand_clicked.bind(this);
    this.handle_field_clicked = this.handle_field_clicked.bind(this);
    this.handle_efield_clicked = this.handle_efield_clicked.bind(this);
    this.handle_order_clicked = this.handle_order_clicked.bind(this);
    this.handle_finished_clicked = this.handle_finished_clicked.bind(this);

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

    this.wrap_controller_action = this.wrap_controller_action.bind(this);
    this.set_branch = this.set_branch.bind(this);

    this.play_card = this.play_card.bind(this);
    this.use_mine = this.use_mine.bind(this);
    this.use_fight = this.use_fight.bind(this);
    this.finish_order = this.finish_order.bind(this);
    this.use_order = this.use_order.bind(this);

    this.branches = {
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
      order: {
        完成: this.finish_order,
      },
      finished: {
        行动: this.use_order,
      },
    };
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
    return {
      illust: card.illust,
      atk: card.atk,
      hp: (card.hp - card.dmg),
      cost: card.cost,
    };
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
      o_illust: "https://ak.hypergryph.com/assets/index/images/ak/common/story/item_mortal_city.png",
      requirements: requirements,
      score: card.score,
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
      o_illust: "https://ak.hypergryph.com/assets/index/images/ak/common/story/item_mortal_city.png",
    };
  }

  process_finished_state(card) {
    return {
      selected: (this.state.finished_selected == this.props.G.finished.indexOf(card)),
      exhausted: card.exhausted, 
    }

  }

  enemy_move(i) {
    if (i < this.props.G.efield.length) {
      this.setState({stage: "enemy"});
      if (i < 0) {
        this.props.moves.drawEnemy(); // start from -2 to draw 2 enemies
      }
      else {
        this.props.moves.enemyMove(i);
      }
      sleep(400).then(() => {this.enemy_move(i+1);});
    }
    else{
      this.props.events.endTurn();
      this.setState({stage:"player"});
    }
  }

  handle_hand_clicked(idx) {
    return () => {
      this.setState({hand_selected: idx});
      this.set_branch("hand");
    };
  }

  handle_field_clicked(idx) {
    return () => {
      this.setState({field_selected: idx});
      this.set_branch("field");
    };
  }

  handle_efield_clicked(idx) {
    return () => {
      this.setState({efield_selected: idx});
      this.set_branch("efield");
    };
  }

  handle_order_clicked(idx) {
    return () => {
      this.setState({order_selected: idx});
      this.set_branch("order");
    };
  }

  handle_finished_clicked(idx) {
    return () => {
      this.setState({finished_selected: idx});
      this.set_branch("finished");
    };
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

  render() {
    //EH: map object in state changing and store the mapped object in state

    //SR: player panel
    let player_panel = (<div>
      <p style={{marginTop:"2%"}}>
        {ICONS.alcohol}: {this.props.G.materials[0]}&nbsp;&nbsp;&nbsp;
        {ICONS.rma}: {this.props.G.materials[1]}&nbsp;&nbsp;&nbsp;
        {ICONS.rock}: {this.props.G.materials[2]}&nbsp;&nbsp;&nbsp;
        {ICONS.d32}: {this.props.G.materials[3]}&nbsp;&nbsp;&nbsp;
        费用: {this.props.G.costs}  
        <br/>
        <button 
          style={{fontSize:"105%", marginRight:"2%"}}
          onClick={() => {this.setState({show_field: !this.state.show_field})}}
        >
          {(this.state.show_field)? "查看订单" : "查看战场"}
        </button>
        <button 
          style={{
            fontSize: "105%", 
            display:(this.state.stage=="enemy")?"none":""
          }} 
          onClick={()=>{this.enemy_move(-2);}}
        >
          结束回合
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
        />
        {(this.state.show_field)? hand_cardrow : orders_cardrow}
        <Panel 
          variant = "player-panel"
          content = {player_panel}
        />

      </div>
    );
  }
}