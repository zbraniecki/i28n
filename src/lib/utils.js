'use strict';

export function deepEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (var i = 0; i < keys1.length; i++) {
    let key = keys1[i];
    if (!keys2.includes(key)) {
      return false;
    }
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}

export function deepIncludes(set1, key) {
  for (let elem of set1) {
    if (elem[0] === key[0] &&
        deepEqual(elem[1], key[1])) {
      return true;
    }
  };
  return false;
}
