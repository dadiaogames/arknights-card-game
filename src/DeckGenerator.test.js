import { get_deck_name, generate_deck } from './DeckGenerator';

it("Test deck generator", () => {
  console.log("克洛丝");
  console.log(generate_deck("克洛丝"));
  console.log("克洛丝")
  console.log(generate_deck("克洛丝"));
  for (let i=0; i<10; i++){
    let deck_name = get_deck_name();
    let deck = generate_deck(deck_name);
    console.log(deck_name);
    console.log(deck);
  }
});