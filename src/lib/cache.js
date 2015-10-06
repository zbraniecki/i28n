'use strict';

import { deepEqual, deepIncludes } from './utils';

const knownObjects = {
  datetime: {
    create: function(options) {
      const resolvedOptions = Object.assign({}, options);
      if (options.hour) {
        resolvedOptions.hour12 = navigator.mozHour12;
      }
      return Intl.DateTimeFormat(
        navigator.languages,
        resolvedOptions
      );
    },
    isAffected: function(reason, options) {
      if (reason === 'languagechange') {
        return true;
      }
      if (reason === 'timeformatchange') {
        return 'hour' in options;
      }
      return false;
    }
  },
};

export class Cache {
  constructor() {
    this.store = new Map();
  }

  _find([type, options]) {
    for (let [key, value] of this.store) {
      if (key[0] === type &&
          deepEqual(key[1], options)) {
        return value;
      }
    }
  }

  set([type, options]) {
    const object = knownObjects[type].create(options);
    const obj = {
      intlObject: object
    };
    this.store.set([type, options], obj);
    return obj;
  }

  get(key) {
    let obj = this._find(key);

    if (!obj) {
      obj = this.set(key);
    }

    if (!obj.intlObject) {
      obj.intlObject = knownObjects[key[0]].create(key[1]);
    }
    return obj.intlObject;
  }

  getAffected(evt) {
    const affectedKeys = new Set();

    this.store.forEach((obj, [type, options]) => {
      if (knownObjects[type].isAffected(evt.type, options)) {
        affectedKeys.add([type, options]);
      }
    });

    return affectedKeys;
  }

  resetKeys(keys) {
    this.store.forEach((obj, key) => {
      if (deepIncludes(keys, key)) {
        this.store.get(key).intlObject = undefined;
      }
    });
  }
}

