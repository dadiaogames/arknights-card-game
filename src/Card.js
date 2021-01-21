import React, { useEffect } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { animated } from 'react-spring';
import { useShaker } from './Shaker';
import { Ripple } from './Ripple';

import 'react-tabs/style/react-tabs.css';
import './Card.css';

export const Card = (props) => {
  let additional_styles = {
    illust: {},
    e_illust: {},
    o_illust: {},
    r_illust: {},
    hp: {},
    atk: {},
    upgrade_name: {},
    cost: {},
    price: {},
    cost_detailed: {},
    order_effect: {},
    finished_effect: {},
    requirements: {},
    score: {},
  };

  if (props.cardState.exhausted) {
    let exhausted_border = "1px solid #f5222d";
    for (let attr in additional_styles) {
      if (attr.includes("illust")) {
        additional_styles[attr].border = exhausted_border;
      }
    }
    //EH: reconstruct this part
  }
  if (props.cardState.selected) {
    if (props.cardState.exhausted) {
      let selected_exhausted_border = "3px solid #9254de"; // Selected Exhausted Border
      for (let attr in additional_styles) {
        if (attr.includes("illust")) {
          additional_styles[attr].border = selected_exhausted_border;
        }
      }

    }
    else {
      let selected_border = "3px solid #096dd9"; // Selected Border
      for (let attr in additional_styles) {
        if (attr.includes("illust")|| (attr == "upgrade_name")) {
          additional_styles[attr].border = selected_border;
        }
        additional_styles.requirements.border = selected_border;
        // additional_styles.score.border = selected_border;
      }
    }
  };
  if (props.cardState.damaged) { 
    additional_styles.hp.color = "red";
    //EH: only font change color and border does not change, are there parameters like that? I've searched through the parameters and did not find such one.
  };
  if (props.cardState.enraged) {
    additional_styles.atk.color = "orange";
  };
  if (props.cardState.upgraded) {
    additional_styles.cost.color = "#1E90FF";
    additional_styles.price.borderColor = "#1E90FF";
    // additional_styles.cost_detailed.color = "#1E90FF";
  }
  if (props.cardState.color >= 0) {
    const color = props.cardState.color;
    const order_colors = ["#00cd00", "#1e90ff", "rgb(229,131,8)"];
    additional_styles.order_effect.borderColor = order_colors[color];
    additional_styles.finished_effect.borderColor = order_colors[color];
  }
  // if (props.cardState.left_more) {
  //   additional_styles.illust.marginLeft = "-150%";
  // }
  // EH: Find a way to let some illust change pattern

  let shaker = useShaker(props.cardState.shaking, props.cardState.setShaking, -25, -25, {duration:105}, props.cardState.onEnd);

  useEffect(() => {
    if ((props.cardState.dmg > 0) && props.cardState.setShaking) {
    // if (props.cardState.setShaking) {
      props.cardState.setShaking(true);
    }
  }, 
  [props.cardState.dmg]);

  return (
    <div
      className="card"
      onClick = {props.handleClick}
      style = {props.cardStyle}
    >
      <Ripple 
        playing = {props.cardState.playing}
        setPlaying = {props.cardState.setPlaying || function(){return;}}
        variants = {{top:"-50%", left:"-50%"}}
      />
      <animated.div style={{width: "100%", height: "100%", ...shaker}}>
      {Object.keys(props.data).filter(key => (props.data[key] != undefined)).map((variant) => (
        <Data
          variant = {variant}
          value = {props.data[variant]}
          additionalStyle = {additional_styles[variant]}
        />
      ))}
      </animated.div>
    </div>

  );
};

export const Data = (props) => {
  let is_img = props.variant.includes("illust");
  let img_tag = (
    <img
        className = {props.variant}
        src = {props.value}
    />
  );

  return (
    <div
      className = {"data "+props.variant}
      style = {props.additionalStyle}
    >
      {(is_img) ? img_tag : props.value}
    </div>
  );
};

export const CardRow = (props) => {
  // EH: is card state really required? can it combine to data? okay, the problem is, all data are shown, and states are style changers
  return (
    <div className="card-row" style={props.additionalStyle} >
      {props.cards.map((card, idx) => (
        <Card
          data={card}
          cardState = {props.states? props.states[idx]:{}}
          handleClick={(props.handleClick)? (props.handleClick(idx)) : null} 
          // This is not a good idea for handleClick?
          cardStyle = {props.cardStyle}
        />
      ))}
    </div>
  );
}

// EH: "data" or "card", need to be the same for both card and SCard
export const SCard = (props) =>  (
  <div className="card-detailed" style={props.additionalStyle} onClick={props.handleClick} >
      {Object.keys(props.card).map((variant) => (
        <Data
          variant = {variant}
          value = {props.card[variant]}
        />
      ))}
  </div>
);

export const SCardRow = (props) => {
  // EH: is card state really required? can it combine to data? okay, the problem is, all data are shown, and states are style changers
  // TODO: props.what?props.what:undefined, reconstruct this
  return (
    <div className="card-detailed-row" >
      {props.cards.map((card, idx) => (
        <SCard
          card = {card}
          handleClick = {props.handleClick?props.handleClick(idx):undefined}
          additionalStyle = {props.additionalStyles?props.additionalStyles[idx]:undefined}
        />
      ))}
    </div>
  );
};

export const TypeFilter = (props) => (
  <div className="type-filter" style={{border:(props.selected)?"4px solid #096dd9":"4px solid grey"}} onClick={props.handleClick}>
    <img className="type-filter-img" src={props.illust} />
  </div>
);

export const TypeFilterContainer = (props) => (
  <div className="type-filter-container">
    {props.filters.map(filter_ => <TypeFilter {...filter_} />)}
  </div>
);

// TODO: Combine this with SCardRow
export const CheckCard = (props) => {
  return (
    <div className="check-card" align="center">
      <SCard card={props.card} />
      <button className="card-detailed-button" onClick={props.handleClick}>完成查看</button>
    </div>
  )
};