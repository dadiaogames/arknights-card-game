export function map_object(fn, obj) {
  let new_obj = {};

  for (let k in obj) {
    new_obj[k] = fn(obj[k], k);
  }

  return new_obj;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function arr2obj(arr) {
  let new_obj = {};

  for (let item of arr) {
    new_obj[item.name] = item;
  }

  return new_obj;
}

export class PRNG {
  constructor(seed) {
    this.seed = seed;

    this.val = 0.0;
    if (typeof seed == "string"){
      for (let i=0; i<seed.length; i++) {
        this.val += seed.charCodeAt(i);
      }
    }
    else {
      this.val = seed;
    }

    // this.random = this.random.bind(this);
    // No need to bind
  }

  random() {
    let x = Math.sin(this.val++) * 10000;
    let result = x - Math.floor(x);
    this.val += 2; //To ensure this is stable
    return result;
  }

  randRange(x) {
    return Math.floor(x * this.random());
  }

  choice(arr) {
    let len = arr.length;
    return arr[this.randRange(len)];
  }

  shuffle(deck) {
    let clone = deck.slice(0);
    let srcIndex = deck.length;
    let dstIndex = 0;
    let shuffled = new Array(srcIndex);

    while (srcIndex) {
      let randIndex = (srcIndex * this.random()) | 0;
      shuffled[dstIndex++] = clone[randIndex];
      clone[randIndex] = clone[--srcIndex];
    }

    return shuffled;
  }
}