import { Client } from 'boardgame.io/react';
import { AC } from './Game';
import { Board } from './Board';

const App = Client({ 
  game: AC, 
  board: Board,
  debug: false,
});

export default App;