'use strict';

export class Context {
  constructor(env) {
    this._env = env;
  }

  getFormatter(type, options, elem) {
    return this._env.getFormatter(type, options, elem);
  }
}
