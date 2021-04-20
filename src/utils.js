import _ from 'lodash';

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

export function vector_sum(v1, v2) {
  if (v1.length != v2.length) {
    return v1;
  }
  else {
    return v1.map((v,i) =>(v + v2[i]));
  }
}

export function vector_diff(v1, v2) {
  if (v1.length != v2.length) {
    return [0];
  }
  else {
    return v1.map((v,i) => (v - v2[i]));
  }
}

export function arr2obj(arr) {
  let new_obj = {};

  for (let item of arr) {
    new_obj[item.name] = item;
  }

  return new_obj;
}

export function mod_slice(arr, idx, cnt) {
  let len = arr.length;
  let from = idx % len;
  return [...arr.slice(from, len), ...arr.slice(0, from)].slice(0, cnt);
}

export function list_min_max_idx(alist) {
  let max = _.max(alist);
  let min = _.min(alist);
  let equal_idx = (val) => alist.map((x, idx) => (x == val)?idx:undefined).filter(i => i != undefined);
  return [equal_idx(min), equal_idx(max)];
}

export class PRNG {
  constructor(seed) {
    this.seed = seed || 0;

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