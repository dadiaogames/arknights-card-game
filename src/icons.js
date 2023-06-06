import React from 'react';

import './icons.css';
import mine_img from './采掘.png';
import block_img from './阻挡.png';

const icon_height = 25;
const attr_icon_height = 20;

export const ICONS = {
  alcohol: (<img src="https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_icons_5.png" height={icon_height} alt="醇" className="material" />),

  rma: (<img src="https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_icons_6.png" height={icon_height} alt="球" className="material" />),

  rock: (<img src="https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_icons_7.png" height={icon_height} alt="石" className="material" />),

  d32: (<img src="https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_icons_3.png" height={icon_height} alt="钢" className="material steel" />),

  mine: (<img src={mine_img} height={attr_icon_height} />),

  block: (<img src={block_img} height={attr_icon_height} />),

  gold: (<img src="https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_icons_4.png" style={{height: "1.1em"}} className="steel" />),

  order: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/></svg>,

  play: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V6M5 12l7-7 7 7"/></svg>,

  mineAction: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,

  fight: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 11l-5-5-5 5M17 18l-5-5-5 5"/></svg>,

  action: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>,

  check: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,

  finish: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>,

  endturn: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>,

  endgame: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M19.8 12H9"/></svg>,

  pick: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="20.5" r="1"/><circle cx="18" cy="20.5" r="1"/><path d="M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6l1.6-8.4H7.1"/></svg>,

  battlefield: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon></svg>,

  reset: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>,
};

export const food_icons = [
  <span style={{color:"#73d13d"}}>■</span>,
  <span style={{color:"#1e90ff"}}>■</span>,
  <span style={{color:"rgb(229,131,8)"}}>■</span>,
  <span style={{color:"red"}}>■</span>,
];

const smaller_height = '1.1em';
export const smaller_icons = [
  (<img src="https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_icons_5.png" style={{height:smaller_height}} className="material" />),

  (<img src="https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_icons_6.png" style={{height:smaller_height}} className="material" />),

  (<img src="https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_icons_7.png" style={{height:smaller_height}} className="material" />),

  (<img src="https://dadiaogames.gitee.io/glowing-octo-robot/integrated/img_icons_3.png" style={{height:smaller_height}} className="material steel" />),
]