'use strict';

export class Context {
  constructor(env) {
    this._env = env;
    this.names = new Map();
  }

  define(name, type, options) {
    this.names.set(name, [type, options]);
  }

  get(type, options) {
    return this._env.get([type, options]);
  }
  
  getNamed(name) {
    const key = this.names[name];
    return this._env.get(key);
  }

  getAffected(evt) {
    return this._env.getAffected(evt);
  }

  resetKeys(keys) {
    return this._env.resetKeys(keys);
  }
}
