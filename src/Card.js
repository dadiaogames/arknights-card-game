import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './Card.css';

export const Card = (props) => {
  let additional_styles = {
    illust: {},
    e_illust: {},
    o_illust: {},
    hp: {},
    atk: {},
  };

  if (props.cardState.exhausted) {
    let exhausted_border = "1px solid red";
    additional_styles.illust.border = exhausted_border;
    additional_styles.e_illust.border = exhausted_border;
    additional_styles.o_illust.border = exhausted_border;
    //EH: reconstruct this part
  }
  if (props.cardState.selected) {
    if (props.cardState.exhausted) {
      let selected_exhausted_border = "3px solid purple";
      additional_styles.illust.border = selected_exhausted_border;
      additional_styles.e_illust.border = selected_exhausted_border;
      additional_styles.o_illust.border = selected_exhausted_border;

    }
    else {
      let selected_border = "3px solid blue";
      additional_styles.illust.border = selected_border;
      additional_styles.e_illust.border = selected_border;
      additional_styles.o_illust.border = selected_border;
    }
  };
  if (props.cardState.damaged) { 
    additional_styles.hp.color = "red";
    //EH: only font change color and border does not change, are there parameters like that? I've searched through the parameters and did not find such one.
  };
  if (props.cardState.enraged) {
    additional_styles.atk.color = "purple";
  };

  return (
    <div
      className="card"
      onClick = {props.handleClick}
      style = {props.cardStyle}
    >
      {Object.keys(props.data).map((variant) => (
        <Data
          variant = {variant}
          value = {props.data[variant]}
          additionalStyle = {additional_styles[variant]}
        />
      ))}
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
          cardState = {props.states[idx]}
          handleClick={(props.handleClick)? (props.handleClick(idx)) : null} 
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
  <div className="type-filter">
  <Tabs>
    <TabList>
      <Tab>Title 1</Tab>
      <Tab>Title 2</Tab>
      <Tab>Title 2</Tab>
      <Tab>Title 2</Tab>
      <Tab>Title 2</Tab>
      <Tab>Title 2</Tab>
      <Tab>Title 2</Tab>
      <Tab>Title 2</Tab>
      <Tab>Title 2</Tab>
    </TabList>

  </Tabs>
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