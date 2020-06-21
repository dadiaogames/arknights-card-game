import React from 'react';
import { Card, CardRow } from './Card';

import './Board.css';

export class Board extends React.Component {
  render() {
    return (
      <div className="board" >
        <CardRow />
      </div>
    );
  }
}