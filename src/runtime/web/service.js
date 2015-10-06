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

  getFormatter(view, type, options, elem) {
    return this.ctxs.get(view).getFormatter(type, options, elem);
  }
}
