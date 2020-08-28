import { Client } from 'boardgame.io/react';
import { AC } from './Game';
import { Board } from './Board';

// import 'antd/dist/antd.css';

const App = Client({ 
  game: AC, 
  board: Board,
  debug: false,
});

export default App;