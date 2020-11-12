import React from 'react';

import './icons.css';

const icon_height = 25;
const attr_icon_height = 20;

export const ICONS = {
  alcohol: (<img src="http://prts.wiki/images/a/a8/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%89%AD%E8%BD%AC%E9%86%87.png" height={icon_height} className="material" />),

  rma: (<img src="http://prts.wiki/images/7/7c/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_RMA70-12.png" height={icon_height} className="material" />),

  rock: (<img src="http://prts.wiki/images/e/e7/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E7%A0%94%E7%A3%A8%E7%9F%B3.png" height={icon_height} className="material" />),

  d32: (<img src="http://prts.wiki/images/7/76/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_D32%E9%92%A2.png" height={icon_height} className="material steel" />),

  mine: (<img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/209/pick_26cf.png" height={attr_icon_height} />),

  block: (<img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/259/shield_1f6e1.png" height={attr_icon_height} />),

  gold: (<img src="http://prts.wiki/images/b/b1/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%90%88%E7%BA%A6%E8%B5%8F%E9%87%91.png" height={attr_icon_height} />),

  order: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/></svg>,

  play: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 9l-6 6 6 6"/><path d="M20 4v7a4 4 0 0 1-4 4H5"/></svg>,

  mineAction: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,

  fight: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 11l-5-5-5 5M17 18l-5-5-5 5"/></svg>,

  action: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>,

  check: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,

  finish: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>,

  endturn: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>,

  endgame: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M19.8 12H9"/></svg>,

  pick: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="20.5" r="1"/><circle cx="18" cy="20.5" r="1"/><path d="M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6l1.6-8.4H7.1"/></svg>,

  battlefield: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon></svg>,
};

export const food_icons = [
  <span style={{color:"#00cd00"}}>■</span>,
  <span style={{color:"#1e90ff"}}>■</span>,
  <span style={{color:"rgb(229,131,8)"}}>■</span>,
  <span style={{color:"red"}}>■</span>,
];