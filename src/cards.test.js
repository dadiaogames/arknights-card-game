import { setup } from './Game';
import { CARDS } from './cards';
import { ENEMIES } from './enemies';

it('cards run normally', () => {
  let ctx = {
    random: {
      Shuffle: arr => arr,
      Die: n => n-1,
    },
  };
  let G = setup(ctx);

  for (let card of G.field) {
    G.deck = CARDS.map(x => x);
    G.hand = CARDS.map(x => x);
    G.field = CARDS.map(x => x);
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
  }

}
);