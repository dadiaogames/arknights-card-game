import React from 'react';
import './TagSelection.css';


function Tag(props) {
  // let bg_color = "#c5c5c5";
  let bg_color = "#434343";
  if (props.selected) {
    bg_color = "#0098dc";
  }
  if (props.locked) {
    bg_color = "#096dd9";
  }

  return <div className="tag" style={{backgroundColor: bg_color}} onClick={props.handleClick} >
    <img className="tag-img" src={props.src} >
    </img>
  </div>
}

export const TagSelection = (props) => {
  // let tbody = [];

  // for (let i=0; i<props.tags.length; i+=3) {
  //   let row = [];
  //   let row_tags = props.tags.slice(i, i+3);
  //   for (let tag of row_tags) {
  //     let borderColor = "black";
  //     if (tag.selected) {
  //       borderColor = "red";
  //     }
  //     if (tag.locked) {
  //       borderColor = "#1E90FF";
  //     }
  //     row.push(
  //       <td 
  //         onClick={props.handleClick(props.tags.indexOf(tag))}
  //       >
  //         <div className="tag">
  //         <img 
  //           className="tag-img" 
  //           src={tag.src}
  //           style={{
  //           borderColor: borderColor,
  //         }} 
  //         ></img>
  //         </div>
  //       </td>
  //     );
  //   }
  //   tbody.push(<tr>{row}</tr>);
  // }

  return (
    <div className="tag-selection" >
      {/* <table>
        <tbody>{tbody}</tbody>
      </table> */}
      {props.tags.map((tag, idx) => <Tag {...tag} handleClick={props.handleClick(idx)} />)}
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
        {props.selected_tags.map((tag) => (
          <li 
            className="tag-desc"
            style={{
              color: (props.just_selected == tag)? "#096dd9" : "black",
            }}
          >
            {tag.desc}
          </li>
        ))}
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