import React, { useState, useEffect } from 'react';
import { Ripple } from './Ripple';
import { useShaker } from './Shaker';
import { animated } from 'react-spring';
import { material_icons } from './orders';

import './Panel.css';

export const Panel = (props) => {
  return (<div className={props.variant}>
    {props.content}
  </div>);
};

export function ScoreBoard(props) {
  let [playing, setPlaying] = useState(false);

  useEffect(() => setPlaying(true), [props.score]);

  return <div style={{position:"relative", display:"inline-block"}}>
    <Ripple 
      playing={playing} 
      setPlaying={setPlaying} 
      variants={{top: "-95px", left:"-70px"}}
    />
    分数:{props.score}/{props.goal}
  </div>;
}

export function MaterialDisplay(props) {
  // Props: idx, gained, materials, playing, setPlaying
  let idx = props.idx;
  let anim = useShaker(props.playing, props.setPlaying, 0, -30, {duration: 125});
  return (
      <div 
        style={{
          display: "inline-block",
          color:(props.gained.includes(idx))?"blue":"black",
        }}
      >
        <animated.div
          style={{
            position: "relative",
            display: "inline-block",
            ...anim,
          }}
        >
          {material_icons[idx]}
        </animated.div>
        :{props.materials[idx]}&nbsp;&nbsp;&nbsp; 
      </div>
    );
}