import { Context } from '../lib/context';
import { NodeWatcher } from './nodewatcher';
import { documentReady } from './shims';

export class View {
  constructor(doc) {
    this._headWatcher = new NodeWatcher(doc.head, {
      type: ['added'],
      selector: 'style[type="application/mozi18n"]',
      onAdded: onAddedDefinitions.bind(this),
    });
    this._i18nWatcher = new NodeWatcher(doc, {
      type: ['added', 'modified'],
      selector: '[data-i18n-value]',
      attributes: ['data-i18n-value', 'data-i18n-name', 'data-i18n-type', 'data-i18n-options'],
      onAdded: onAddedI18nElement.bind(this),
      onModified: onAddedI18nElement.bind(this),
    });

    this._headWatcher.start();
    this._i18nWatcher.start();

    this._ctx = new Context(doc);

    this.ready = documentReady();
  }

  define(name, key) {
    return this._ctx._cache.define(name, key);
  }

  get(key) {
    return this._ctx._cache.get(key);
  }
}

function onAddedDefinitions(elements) {
  for (let elem of elements) {
    let definitions = JSON.parse(elem.textContent);

    for (let name in definitions) {
      this.define(name, definitions[name]);
    }
  }
}

function onAddedI18nElement(elements) {
  for (let elem of elements) {
    if (!elem.hasAttribute('data-i18n-value')) {
      continue;
    }
    const value = elem.getAttribute('data-i18n-value');
    const name = elem.hasAttribute('data-i18n-name') ?
      elem.getAttribute('data-i18n-name') : undefined;
    const type = elem.getAttribute('data-i18n-type');
    const options = elem.hasAttribute('data-i18n-options') ?
      JSON.parse(elem.getAttribute('data-i18n-options')) : undefined;

    const formatter = this._ctx._cache.get(name || {type, options});
    switch (type) {
      case 'datetime':
        let resolvedValue = new Date(parseInt(value));
        elem.textContent = formatter.format(resolvedValue);
        break;
    }
  }
}
