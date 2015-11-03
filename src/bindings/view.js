import { Context } from '../lib/context';
import { NodeWatcher } from './nodewatcher';

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
      onAdded: onAddedI18nElement.bind(this),
    });

    this._headWatcher.start();
    this._i18nWatcher.start();

    this._ctx = new Context(doc);
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
    const value = elem.getAttribute('data-i18n-value');
    const type = elem.getAttribute('data-i18n-type');
    const options = elem.hasAttribute('data-i18n-options') ?
      JSON.parse(elem.getAttribute('data-i18n-options')) : undefined;

    const formatter = this._ctx._cache.get({type, options});
    switch (type) {
      case 'datetime':
        let resolvedValue = new Date(parseInt(value));
        elem.textContent = formatter.format(resolvedValue);
        break;
    }
  }
}
