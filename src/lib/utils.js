export const deepEqual = function(obj1, obj2) {
  if (!obj1) obj1 = {};
  if (!obj2) obj2 = {};

  const keys1 = Object.getOwnPropertyNames(obj1);
  const keys2 = Object.getOwnPropertyNames(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let i = 0; i < keys1.length; i++) {
    const key = keys1[i];

    if (obj1[key] !== obj2[key]) {
      return false
    }
  }

  return true;
}

export const deepIncludes = function(set1, key) {
  for (const elem of set1) {
    if (elem[0] === key[0] && deepEqual(elem[1], key[1])) {
      return true;
    }
  }

  return false;
}
