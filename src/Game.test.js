import { mulligan } from './Game';

it("mulligan", () => {
  let G = {
    hand: [1,2,3,4,5],
    deck: [6,7,8,9,10],
  };
  let ctx = {
    random: {
      Shuffle: x=>x,
    }
  };
  mulligan(G, ctx, [false, true, false, true, false]);
  console.log(G.hand);
  console.log(G.deck);
});