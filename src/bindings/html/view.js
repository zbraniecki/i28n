'use strict';

import { formatMutations, formatElements } from './dom';
import { deepEqual, deepIncludes } from '../../lib/utils';

const observerConfig = {
  attributes: true,
  characterData: false,
  childList: true,
  subtree: true,
  attributeFilter: ['data-i18n-format', 'data-i18n-value', 'data-i18n-options']
};

export class View {
  constructor(client, doc) {
    this._doc = doc;
    this._client = client;
    this._observer = new MutationObserver(formatMutations.bind(null, this));
    this._keys = new Map();

    this._observe();
    client.registerView(this);
  }

  _observe() {
    window.addEventListener('timeformatchange', this);
    window.addEventListener('languagechange', this);
    this._observer.observe(this._doc, observerConfig);
  }

  _disconnect() {
    this._observer.disconnect();
  }

  _get(...args) {
    return  this._client.get(this, ...args);
  }

  _set(elem, key) {
    if (!this._keys.has(key)) {
      this._keys.set(key, new Set());
    }
    this._keys.get(key).add(elem);
  }

  handleEvent(evt) {
    const affectedKeys = this._client.getAffected(this, evt);

    this._client.resetKeys(this, affectedKeys);

    const affectedElems = new Set();
    this._keys.forEach((elems, key) => {
      if (deepIncludes(affectedKeys, key)) {
        elems.forEach(elem => affectedElems.add(elem));
      }
    });

    formatElements(this, affectedElems);
  }








  /* DOM API */
  setAttributes(element, format, value, options) {
    element.setAttribute('data-i18n-format', format);
    if (value) {
      element.setAttribute('data-i18n-value', value.toString());
    }
    if (options) {
      element.setAttribute('data-i18n-options', JSON.stringify(options));
    }
  }

  setFormat(element, format, options) {
    element.setAttribute('data-i18n-format', format);
    if (options) {
      element.setAttribute('data-i18n-options', JSON.stringify(options));
    }
  }
  setValue(element, value) {
    element.setAttribute('data-i18n-value', value.toString());
  }
  setOptions(element, options) {
    element.setAttribute('data-i18n-options', JSON.stringify(options));
  }
}
