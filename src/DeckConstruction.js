import React from 'react';
import './DeckConstruction.css';

export const DeckConstruction = (props) => {
  return (
    <div className="deck-construction" >
      <form>
        <textarea 
          value={props.value} 
          onChange={props.handleChange} 
          className="deck-construction" 
          rows={25}
          columns={20}
        />
      </form>
    </div>
  );
};