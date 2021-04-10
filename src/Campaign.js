import React from 'react';
import { TAGS } from './tags';
import { CARDS } from './cards';

import './Board.css';
import './Campaign.css';
import { ENEMIES } from './enemies';
import { ORDERS } from './orders';

const HEADINGS = {
  黑角: "https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_avatars_170.png",
  阿米娅: "https://z3.ax1x.com/2020/11/28/D61jL8.png",
  sea1: "https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/smaller_sea/sea1.png",
  sea2: "https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/smaller_sea/sea2.png",
  sea3: "https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/smaller_sea/sea3.png",
  sea4: "https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/smaller_sea/sea4.png",
  sea5: "https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/smaller_sea/sea5.png",
  sea6: "https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/smaller_sea/sea6.png",
  sea7: "https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/smaller_sea/sea7.png",
  sea8: "https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/smaller_sea/sea8.png",
  sea9: "https://dadiaogames.gitee.io/glowing-octo-robot/tutorials/smaller_sea/sea9.png",
};

export function make_dialogs(dialogs) {
  let dialog_list = dialogs.split("\n");
  return dialog_list.map(d => {
    let d_seperated = d.split(" ");
    if (d_seperated.length == 2) {
      return {
        heading: d_seperated[0],
        dialog: d_seperated[1],
      };
    }
    else {
      return {
        demonstrate_img: d,
      };
    }
  });
}

export function Dialog(props) {
  return <div className="board" style={{textAlign: 'center'}}>
    {(props.demonstrate_img)?
      (<img src={props.demonstrate_img} className="demonstrate-img"></img>)
      :(<>
        <img src={HEADINGS[props.heading]} className="dialog-heading"></img>
        <div className="dialog">{props.dialog}</div>
      </>)
    }
    {/* <button className={"dialog-button"+((props.demonstrate_img)?" primary":"")} onClick={props.proceed}>继续</button> */}
    <button className="dialog-button" onClick={props.proceed}>继续</button>
  </div>
}