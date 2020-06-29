import { get_deck_name, generate_deck } from './DeckGenerator';

it("Test deck generator", () => {
  console.log("克洛丝");
  console.log(generate_deck("克洛丝"));
  console.log("克洛丝")
  console.log(generate_deck("克洛丝"));
  let deck_name = get_deck_name();
  console.log(deck_name);
  console.log(generate_deck(deck_name));
  deck_name = get_deck_name();
  console.log(deck_name);
  console.log(generate_deck(deck_name));
  deck_name = get_deck_name();
  console.log(deck_name);
  console.log(generate_deck(deck_name));
});