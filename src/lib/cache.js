import { deepEqual } from './utils';
import { knownObjects } from './objects';

export class Cache {
  constructor() {
    this._store = new Map();
    this._names = new Map();
  }
  _find({ type, options }) {
    for (let [key, value] of this._store) {
      if (key[0] === type && deepEqual(key[1], options)) {
        return value;
      }
    }
  }

  define(name, key) {
    this._names.set(name, key);
  }

  _set(key) {
    console.log('setting a new cache object');
    let { type, options } = typeof key === 'string' ?
      this._names.get(key) : key;

    const intlObject = knownObjects[type].create(options || {});
    this._store.set([type, options], intlObject);
    return intlObject;
  }

  get(key) {
    if (typeof key === 'string') {
      if (!this._names.has(key)) {
        throw new Error('Undefined intl object: ' + key);
      }
      key = this._names.get(key);
    }

    return this._find(key) || this._set(key);
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
        this.store.delete(key);
      }
    });
  }
}
