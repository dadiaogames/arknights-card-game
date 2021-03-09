import React, { useState } from 'react';
import { useSpring, animated, config as springConfig } from 'react-spring';

const ripple_style = {
  position: "absolute",
  borderRadius: "50%",
  width: "200px",
  height: "200px",
  background: "rgba(160, 160, 160, 0.5)",
  // zIndex: -1,
};

export function Ripple(props) {
  // Props: playing, setPlaying
  // console.log("Ripple render:", props.playing);
  let from_state = {
    ...ripple_style,
    ...props.variants, // Here, "variants" for additional styles and "variant" for one type of style, but maybe "type" is more prefered than "variant"
    transform: "scale(0)",
    opacity: 0.6,
  };
  let to_state = [{
    opacity: 0,
    transform: "scale(2.5)",
  }, 
  {
    transform: "scale(0)",
  }
  ];
  let anim = useSpring({
    from: from_state,
    to: (props.playing)? to_state : from_state,
    onRest() {
      if (props.playing) {
        props.setPlaying(false);
      }
    },
    config: {duration: 200},
  });
   return <animated.div 
      className="ripple" 
      style = {anim}
    >
    </animated.div>;
}