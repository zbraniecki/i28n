'use strict';

import { Env } from '../../lib/env';

export class Service {
  constructor() {
    this.ctxs = new Map();
    this.env = new Env();
  }

  registerView(view) {
    this.ctxs.set(view, this.env.createContext());
  }

  get(view, key) {
    return this.ctxs.get(view).get(key[0], key[1]);
  }

  getAffected(view, evt) {
    return this.ctxs.get(view).getAffected(evt);
  }

  resetKeys(view, keys) {
    return this.ctxs.get(view).resetKeys(keys);
  }
}
