import React from 'react';
import { useSpring, animated, interpolate } from 'react-spring';

export function useShaker(playing, setPlaying, changeX=0, changeY=0, config, onEnd) {
  let from_state = {
    x: 0,
    y: 0
  };
  let to_state = {
    x: changeX,
    y: changeY,
  };

  let {x, y} = useSpring({
    from: from_state,
    to: (playing)? [to_state, from_state] : from_state,
    config,
    onRest() {
      if (playing) {
        setPlaying(false);
        onEnd && onEnd();
      }
    },
  });

  return {
    transform: interpolate([x,y], (x,y)=>`translate(${x}px, ${y}px)`)
  };
}