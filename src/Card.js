import React from 'react';
import './Card.css';

export const Card = (props) => {
  let additional_styles = {
    illust: {},
    e_illust: {},
    o_illust: {},
    hp: {},
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
  }

  return (
    <div
      className="card"
      onClick = {props.handleClick}
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
  let img_variants = ["illust", "e_illust", "o_illust"]; // EH: reconstruct this
  let is_img = img_variants.includes(props.variant);
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
}

export const CardRow = (props) => {
  return (
    <div className="card-row">
      {props.cards.map((card, idx) => (
        <Card
          data={card}
          cardState = {props.states[idx]}
          handleClick={(props.handleClick)? (props.handleClick(idx)) : null} 
        />
      ))}
    </div>
  );
}