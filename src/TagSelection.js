import React from 'react';
import './TagSelection.css';

export const TagSelection = (props) => {
  let tbody = [];

  for (let i=0; i<props.tags.length; i+=3) {
    let row = [];
    let row_tags = props.tags.slice(i, i+3);
    for (let tag of row_tags) {
      row.push(
        <td 
          className="tag" 
          
          onClick={props.handleClick(props.tags.indexOf(tag))}
        >
          <img 
            className="tag" 
            src={tag.src}
            style={{
            borderColor: (tag.selected)? "red":"black"
          }} 
          ></img>
        </td>
      );
    }
    tbody.push(<tr>{row}</tr>);
  }

  return (
    <div className="tag-selection" >
      <table>
        <tbody>{tbody}</tbody>
      </table>
    </div>
  );
};

export const TagList = (props) => {
  return (
    <div className="tag-list" >
      <ul
        style = {{
          marginLeft: "-6%",
          marginTop: "1%",
        }}
      >
        {props.selected_tags.map((tag) => (<li className="tag-desc">{tag.desc}</li>))}
      </ul>
    </div>
  );
};

export const RiskLevel = (props) => {
  return (
    <div className="risk-level" >
      危机等级:<br/>
      <span className="risk-level-value">{props.risk_level}</span>
    </div>
  );
}