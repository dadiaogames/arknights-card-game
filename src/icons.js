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

};

export const food_icons = [
  <span style={{color:"#00cd00"}}>■</span>,
  <span style={{color:"#1e90ff"}}>■</span>,
  <span style={{color:"rgb(229,131,8)"}}>■</span>,
  <span style={{color:"red"}}>■</span>,
];