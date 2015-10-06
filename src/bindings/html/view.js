'use strict';

import { formatMutations } from './dom';

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

    const observer = new MutationObserver(formatMutations.bind(null, this));
    this._observe = () => observer.observe(doc, observerConfig);
    this._disconnect = () => observer.disconnect();

    this._observe();
    client.registerView(this);
  }

  _getFormatter(...args) {
    return  this._client.getFormatter(this, ...args);
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
