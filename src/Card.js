import React from 'react';
import './Card.css';

export var Card = (props) => {
  let border_color = "black";

  if (props.exhausted) {
    border_color = "red";
  }
  if (props.selected) {
    border_color = "blue";
  };

  return (
    <div
      className="card"
      style = {{
        borderColor: border_color,
      }}
    >
      <Data variant="cost" value="2" />
      <Data variant="illust" value="http://ak.mooncell.wiki/images/6/61/%E7%AB%8B%E7%BB%98_12F_1.png" />
    </div>

  );
};

export var Data = (props) => {
  let img_variants = ["illust"];
  if (img_variants.includes(props.variant)) {
    return (
      <div
        className={props.variant}
        style={{
          position: "absolute",
        }}
      >
        <img
          className = {props.variant}
          src = {props.value}
        />
      </div>
    );
  }
  else{
    return (
      <div 
        style={{
          position: "absolute",
          border: "1px solid",
        }}
        className={props.variant}
      >
        {props.value}
      </div>
    );
  }
}

export var CardRow = (props) => {
  return (
    <div className="card-row">
      <Card />
    </div>
  );
}