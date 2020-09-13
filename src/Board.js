import React from 'react';
import _ from 'lodash';
import { Tabs, TabList, Tab } from 'react-tabs';
import { useSpring, animated } from 'react-spring';
import { Card, SCard, CardRow, CheckCard, SCardRow, TypeFilter } from './Card';
import { Controller, EnterGame } from './Controller';
import { Panel, ScoreBoard, MaterialDisplay } from './Panel';
import { TagSelection, TagList, RiskLevel } from './TagSelection';
import { DeckConstruction, DeckGeneration, Settings } from './DeckConstruction';
import { TitleScreen } from './TitleScreen';
import { DeckSelection, DeckUpgrade, Competition } from './Competition';
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

const init_animations = {
  field: {},
  efield: {},
  finished: {},
  materials: {},
};

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
    this.handle_selection_clicked = this.handle_selection_clicked.bind(this) 
    this.handle_upgrade_clicked = this.handle_upgrade_clicked.bind(this);

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
    this.process_selection_state = this.process_selection_state.bind(this);
    this.process_upgrade_data = this.process_upgrade_data.bind(this)
    this.process_upgrade_state = this.process_upgrade_state.bind(this)

    this.process_card_details = this.process_card_details.bind(this);
    this.process_enemy_details = this.process_enemy_details.bind(this);
    this.process_order_details = this.process_order_details.bind(this);

    this.process_deck_data = this.process_deck_data.bind(this);

    this.set_animations = this.set_animations.bind(this);
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
    this.render_deck_selection_board = this.render_deck_selection_board.bind(this);
    this.render_deck_upgrade_board = this.render_deck_upgrade_board.bind(this);
    this.render_competition_board = this.render_competition_board.bind(this);

    this.enter_competition_mode = this.enter_competition_mode.bind(this);
    this.select_deck = this.select_deck.bind(this);
    this.upgrade_card = this.upgrade_card.bind(this);
    this.start_competition = this.start_competition.bind(this);

    this.change_board = this.change_board.bind(this);
    this.choose_tag = this.choose_tag.bind(this);
    this.choose_standard_tags = this.choose_standard_tags.bind(this);
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
      selection_selected: -1,
      upgrade_selected: -1,
      hand_choices: [false, false, false, false, false],

      branch: {},
      show_field: true,
      show_tag_selection: false,

      stage: "player",

      animations: {...init_animations},

      board: this.render_title_board, 
      // board: this.render_competition_board,
      last_board: this.render_title_board,

      tags: TAGS.map(x=>({...x})),
      risk_level: 0, // this is changed on game begin
      standard_level: 0,

      deck_mode: "random",
      deck_name: get_deck_name(),
      deck_data: CARDS.slice(0,10).map(x=>`3 ${x.name}`).join("\n"),
      preview_deck: CARDS.map(x=>({...x, material:Math.floor(Math.random()*3)})),

      seed: get_seed_name(),

      checking: {},

      scenario_finished: false,
    };

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

  choose_standard_tags(tags, current_standard_level) {
    let new_tags = [...tags];
    // let current_standard_level = this.state.standard_level + 1;
    for (let tag of new_tags) {
      if (tag.standard_level <= current_standard_level) {
        tag.selected = true;
      }
      if ((current_standard_level >= 1) && [0,3].includes(new_tags.indexOf(tag))) {
        tag.selected = true;
      }
      if ((current_standard_level >= 2) && [4,6,12].includes(new_tags.indexOf(tag))) {
        tag.selected = true;
      }
      if ((current_standard_level >= 3) && [1,9,13].includes(new_tags.indexOf(tag))) {
        tag.selected = true;
      }
    }

    if (this.state.competition_mode) {
      for (let tag of new_tags) {
        if (tag.selected) {
          tag.locked = true;
        }
      }
    }

    return new_tags;
  }

  get_risk_level() {
    let selected_tags = this.state.tags.filter(t => (t.selected || t.locked));
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
    this.set_animations("field", this.props.G.field.length, true);
    this.setState({hand_selected: -1});
    return {};
  }
  
  use_mine() {
    this.props.moves.mine(this.state.field_selected);
    // this.set_animations("field", this.state.field_selected, true);
    this.setState({field_selected: -1});
    return {};
  }

  use_fight() {
    this.props.moves.fight(this.state.field_selected, this.state.efield_selected);
    // this.set_animations("efield", this.state.efield_selected, true);
    this.setState({
      field_selected: -1,
      efield_selected: -1,
    });
    return {};
  }

  use_act() {
    this.props.moves.act(this.state.field_selected);
    // this.set_animations("field", this.state.field_selected, true);
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
    // this.set_animations("finished", this.props.G.finished.length, true);
    this.setState({order_selected: -1});
    return {};
  }

  use_order() {
    this.props.moves.useOrder(this.state.finished_selected);
    // this.set_animations("field", this.state.finished_selected, true);
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

  set_animations(cardrow, idx, value) {
    let animations = {...this.state.animations};
    animations[cardrow][idx] = value;
    this.setState({animations});
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

  process_hand_state(card, idx) {
    return {
      selected: (this.state.hand_selected == idx),
      upgraded: card.upgraded,
    };
  }
  
  process_selection_state(card, idx) {
    return {
      selected: (this.state.selection_selected == idx),
      upgraded: card.upgraded,
    };
  }

  process_upgrade_data(card) {
    return {
      upgrade_name: <span><br/>{card.name}</span>,
    };
  }

  process_upgrade_state(card, idx) {
    return {
      selected: (this.state.upgrade_selected == idx),
    };
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

  process_field_state(card, idx) {
    return {
      selected: (this.state.field_selected == idx),
      exhausted: card.exhausted, 
      damaged: (card.dmg > 0),
      playing: this.state.animations.field[idx],
      setPlaying: (value) => this.set_animations("field", idx, value),
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

  process_efield_state(card, idx) {
    return {
      selected: (this.state.efield_selected == idx),
      exhausted: card.exhausted, 
      damaged: (card.dmg > 0),
      dmg: card.dmg,
      enraged: card.enraged,
      shaking: this.state.animations.efield[idx],
      setShaking: (value) => this.set_animations("efield", idx, value),
      onEnd: () => {this.props.moves.clearField("efield");console.log("onEnd");},
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
          <span style={{
            display: (card.onPlayBonus && card.onPlayBonus.length > 0)?"":"none"
          }}>
            <i>
            部署奖励: {card.onPlayBonus && card.onPlayBonus.reduce((acc, val) => (acc + val.name + " "), "")}
            </i>
            <br/>
          </span>
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

  handle_selection_clicked(idx) {
    return () => {
      this.setState({
        selection_selected: idx,
      })
    }
  }
  handle_upgrade_clicked(idx) {
    return () => {
      this.setState({
        upgrade_selected: idx,
      });
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
      // console.log(Object.keys(new_branch));
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
    const BOARDS = {
      "title": this.render_title_board,
      "rules": this.render_rules_board,
      "game": this.render_game_board,
      "tag": this.render_tag_board,
      "deck": this.render_deck_board,
      "card": this.render_card_board,
      "preview": this.render_preview_board,
      "mulligan": this.render_mulligan_board,
      "settings": this.render_setting_board,
      "deck_selection": this.render_deck_selection_board,
      "deck_upgrade": this.render_deck_upgrade_board,
      "competition": this.render_competition_board,
    };
    this.setState({last_board: this.state.board})
    this.setState({board: BOARDS[new_board]});
  }

  check_deck() {
    this.change_board("preview");
  }

  back() {
    this.setState({board: this.state.last_board});
  }

  enter_game() {
    let deck = [];
    let seed = this.state.seed;
    if (!this.state.competition_mode){
      let deck_data = (this.state.deck_mode == "random")? generate_deck(this.state.deck_name) : this.state.deck_data;
      deck = str2deck(deck_data);
    }
    else {
      deck = this.state.Deck;
      seed += this.state.results.length;
    }
    // EH: it's better to setup each scenario in one function, and in backend
    this.props.moves.setDecks(init_decks(deck, seed));
    this.props.moves.addTags(this.state.tags.filter(t => (t.selected || t.locked)));
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
    
    if (this.state.competition_mode) {
      this.change_board("competition");
    }
    else{
      this.change_board("tag");
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Materials
    for (let i=0; i<this.props.G.materials.length; i++) {
      let material_diff = this.props.G.materials[i] - prevProps.G.materials[i];
      if (material_diff > 0) {
        this.set_animations("materials", i, true);
      } 
    }

    // About result
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
        else if (risk_level >= 30 && risk_level < 50) {
          grade = "SSSSS";
        }
        else {
          grade = "SSSSSS";
        }
        // TODO: reconstruct this part, flat is better than nested
        let finish = this.props.G.rhodes_training_mode?"任务失败":"任务完成";
        alert(`${finish}\n完成危机等级: ${risk_level}\n评级: ${grade}\n使用卡组: ${this.state.deck_mode=="random"?this.state.deck_name:`${is_standard(this.state.deck_data)?"标准":"狂野"}自组卡组`}\n地图种子: ${this.state.seed}`);
        if (this.state.competition_mode) {
          this.setState({results: [...this.state.results, risk_level]});
        }
      }

      else {
        let failed = this.props.G.rhodes_training_mode?"任务完成":"任务失败";
        alert(`${failed}\n原因: ${result.reason}\n${this.props.G.rhodes_training_mode?`评级: ${good_grade}\n`:""}地图种子: ${this.state.seed}`);
        if (this.state.competition_mode) {
          this.setState({results: [...this.state.results, 0]});
        }
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

  process_deck_data(deck, idx) {
    let checkDeck = () => {
      this.setState({preview_deck: deck});
      this.check_deck();
    };
    return {
      deckName: get_deck_name(),
      checkDeck,
      selectDeck: () => {this.select_deck(idx)},
    }
  }

  upgrade_card() {
    this.props.moves.upgrade(this.state.selection_selected, this.state.upgrade_selected); 
    this.props.moves.refresh_selections();
    this.setState({selection_selected: -1, upgrade_selected: -1});

    if (this.props.G.finish_upgrading) {
      this.start_competition();
    }
  }

  enter_competition_mode() {
    this.setState({competition_mode: true});
    this.props.moves.setup_deck_selection(_.random(50));
    this.change_board("deck_selection");
  }

  start_competition() {
    this.setState({
      // Deck: this.props.G.Deck,
      // preview_deck: this.props.G.Deck,
      results: [],
    });
    this.setState({tags: this.choose_standard_tags(TAGS.map(x=>({...x})), 2)});
    this.change_board("competition");
  }

  select_deck(idx) {
    this.props.moves.select_deck(idx);
    this.change_board("deck_upgrade");
  }

  render_deck_selection_board() {
    let back = () => {
      this.change_board("title");
      // Unlock all tags here? Because only one tag source shared between normal and competition mode
      this.setState({competition_mode: false})
    };
    return <DeckSelection decks={this.props.G.deck_list.map(this.process_deck_data)} back={back} />
  }

  render_deck_upgrade_board() {
    return <DeckUpgrade 
      cards = {this.props.G.selections.map(this.process_hand_data).slice(0,3)}
      cardStates = {this.props.G.selections.map(this.process_selection_state)}
      selectedCard = {{...this.props.G.selections[this.state.selection_selected]}}
      handleCardClick = {this.handle_selection_clicked}
      upgrades = {this.props.G.upgrades.map(this.process_upgrade_data)}
      upgradeStates = {this.props.G.upgrades.map(this.process_upgrade_state)}
      selectedUpgrade = {{...this.props.G.upgrades[this.state.upgrade_selected]}}
      handleUpgradeClick = {this.handle_upgrade_clicked}
      handleClick = {this.upgrade_card}
    />
  }

  render_competition_board() {
    let actions = {
       "查看卡组": () => {
         this.setState({preview_deck: this.state.Deck || this.props.G.Deck});  // Write deck init here, not in "start_competition", because of async moves and would swallow the last card upgrade
         this.change_board("preview");
      },
       "进入游戏": () => {
         this.setState({Deck: this.state.Deck || this.props.G.Deck});
         this.change_board("tag");
      },
     };
     let finalResult = undefined;
     if (this.state.results.length >= 5) {
       finalResult = _.mean(this.state.results.sort((a,b) => (b-a)).slice(0,3));
       finalResult = _.round(finalResult, 2);
       actions = {
         "查看卡组": actions.查看卡组,
         "结束游戏": () => {
           this.change_board("title");
           this.setState({
             competition_mode: false,
             Deck: undefined,
            });
         } 
      };
     }
    return <Competition 
     results = {[...this.state.results, ..._.times(5-this.state.results.length, ()=>"_")]}
     finalResult = {finalResult}
     actions = {actions}
    />;
  }

  render_game_board() {
    // EH: map object in state changing and store the mapped object in state

    // SR: player panel
    // TODO: reconstruct this, this is stateful, and html elements should go to stateless
    // let material_display = (idx) => (
    //   <div 
    //     style={{
    //       display: "inline-block",
    //       color:(this.props.G.gained.includes(idx))?"blue":"black",
    //     }}
    //   >
    //     <animated.div
    //       style={{
    //         display: "inline-block",
    //       }}
    //     >
    //       {material_icons[idx]}
    //     </animated.div>
    //     :{this.props.G.materials[idx]}&nbsp;&nbsp;&nbsp; 
    //   </div>
    // );

    let player_panel = (<div align="center">
      <p style={{marginTop:"2%"}}>
        {[0,1,2,3].map(
            (idx) => <MaterialDisplay 
              playing = {this.state.animations.materials[idx]}
              setPlaying = {(value) => this.set_animations('materials', idx, value)}
              idx = {idx}
              gained = {this.props.G.gained}
              materials = {this.props.G.materials}
            />
          )
        }
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
            this.props.moves.rest();
            this.props.moves.enemyInit();
            this.enemy_move(-this.props.G.num_enemies_out);
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
        {/* <span>分数:{this.props.G.score}/{this.props.G.goal}</span> */}
        <ScoreBoard score={this.props.G.score} goal={this.props.G.goal} />
      <br/>
        <button 
          onClick={()=>this.end_game()}
          style = {{
            position: "absolute",
            fontSize: "120%",
            top: "2%",
            left: "88%",

            display: (this.state.competition_mode)?"none":"",
          }}
        >
        ⟳
        </button>

        <span 
          onClick={()=>{alert(this.props.G.messages.slice(0,20).join("\n"));}}
        >
          {this.props.G.messages[0]}
        </span>
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
        <div className="card-display">
          <SCard card={this.state.checking} />
        </div>

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

    let actions = {
      进入游戏: () => {this.change_board("deck");},
      快速设置: () => this.setState({
        tags: this.choose_standard_tags(this.state.tags, this.state.standard_level+1),
        standard_level: this.state.standard_level + 1,
      }),
      "竞技模式(推荐)": this.enter_competition_mode, 
      返回标题: () => this.change_board("title"),
    };

    if (this.state.competition_mode) {
      actions = {
        进入游戏: () => this.enter_game(),
      }
    }

    return (
      <div className="board" >
        <TagSelection 
          tags = {this.state.tags}
          handleClick = {this.choose_tag}
        />
        <TagList 
          selected_tags = {this.state.tags.filter(t => (t.selected || t.locked))}
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
          actions = {actions}
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
          actions = {{
            进入游戏: () => this.enter_game(),
            高级设置: () => this.change_board("settings"),
            返回合约: () => this.change_board("tag"),
          }}
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