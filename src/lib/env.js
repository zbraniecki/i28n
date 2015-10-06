'use strict';

import { Context } from './context';

const formatters = [];

export class Env {
  constructor() {
  }

  createContext() {
    return new Context(this);
  }

  getFormatter(type, options, elem) {
    let pos = findFormatter(type, options);
    if (pos === -1) {
      return setFormatter(type, options, elem);
    }
    formatters[pos].elements.add(elem);
    return formatters[pos].object;
  }
}


function setFormatter(type, options, elem) {
  let object;

  switch (type) {
    case 'datetime':
      object = Intl.DateTimeFormat(navigator.languages, options);
      break;
    case 'number':
      object = Intl.NumberFormat(navigator.languages, options);
      break;
  }

  const formatter = {
    type: type,
    options: options,
    object: object,
    elements: new Set([elem]),
  };

  formatters.push(formatter);
  return formatter.object;
}

function findFormatter(type, options) {
  for (let i = 0; i < formatters.length; i++) {
    let formatter = formatters[i];

    if (formatter.type === type && deepEqual(formatter.options, options)) {
      return i;
    }
  }
  return -1;
}

function removeFormatter() {
}

function deepEqual(obj1, obj2) {
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
