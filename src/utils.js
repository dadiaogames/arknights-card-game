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