import { Cache } from './cache';

export class Context {
  constructor(doc) {
    this._doc = doc;
    //this._observer = new MutationObserver(formatMutations.bind(null, this));
    this._cache = new Cache();
    this._keys = new Map();
    //this._observe();
  }
}

