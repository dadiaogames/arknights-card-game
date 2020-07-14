import { setup, init_card_state } from './Game';
import { CARDS, BORROWS } from './cards';
import { ENEMIES } from './enemies';

it('cards run normally', () => {
  let ctx = {
    random: {
      Shuffle: arr => arr,
      Die: n => n-1,
    },
  };
  let G = setup(ctx);

  for (let card of [].concat(CARDS, BORROWS, ENEMIES)) {
    G.deck = CARDS.map(x => x);
    G.hand = CARDS.map(x => x);
    G.field = CARDS.map(x => init_card_state(G, ctx, x));
    G.efield = ENEMIES.map(x => x);
    if (card.onPlay) {
      card.onPlay(G, ctx, card);
    }
    if (card.onMine) {
      card.onMine(G, ctx, card);
    }
    if (card.onFight) {
      card.onFight(G, ctx, card, G.efield[0]);
    }
    if (card.action) {
      card.action(G, ctx, card);
    }
    if (card.onOut) {
      card.onOut(G, ctx, card);
    }
    if (card.action) {
      card.action(G, ctx, card);
    }
    if (card.onUnrest) {
      card.onUnrest(G, ctx, card);
    }
    if (card.onReinforce) {
      card.onReinforce(G, ctx, card);
    }
  }

}
);

it('Angelina', () => {
  let ctx = {
    random: {
      Shuffle: arr => arr,
      Die: n => n-1,
    },
  };
  let G = setup(ctx);
  
  let angelina = CARDS.filter(x => x.name=="安洁莉娜")[0];
  let fen = CARDS.filter(x => x.name=="芬")[0];

  G.hand = [angelina, fen];
  G.deck = [fen, fen, fen, fen, fen, fen, fen];

  angelina.onPlay(G, ctx, angelina);
  console.log(G.deck.length);

});