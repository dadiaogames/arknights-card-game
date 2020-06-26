import React from 'react';
import './Panel.css';

export const Panel = (props) => {
  return (<div className={props.variant}>
    {props.content}
  </div>);
};