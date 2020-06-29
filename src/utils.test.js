import { PRNG } from "./utils"

it('Test the PRNG', () => {
  let rng = new PRNG("克洛丝");
  for (let i=0; i<10; i++) {
    rng.random();
    rng.randRange(10);
    rng.choice([2,3,4]);
  }
});
// it('Test the PRNG', ()=>{
//   let rng = new PRNG("克洛丝");
//   console.log("克洛丝");
//   for (let i=0; i<10; i++) {
//     console.log(rng.random());
//   }

//   let rng2 = new PRNG("克洛丝");
//   console.log("克洛丝2");
//   for (let i=0; i<10; i++) {
//     console.log(rng2.random());
//   }

//   let rng3 = new PRNG("玫兰莎");
//   console.log("玫兰莎");
//   for (let i=0; i<10; i++) {
//     console.log(rng3.random());
//   }
// });