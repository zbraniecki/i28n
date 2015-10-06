'use strict';

import { Context } from './context';
import { Cache } from './cache';

export class Env {
  constructor() {
    this.cache = new Cache();
  }

  createContext() {
    return new Context(this);
  }

  get(key) {
    return this.cache.get(key);
  }

  getAffected(evt) {
    return this.cache.getAffected(evt);
  }

  resetKeys(keys) {
    return this.cache.resetKeys(keys);
  }
}
