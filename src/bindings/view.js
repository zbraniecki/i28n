import { Cache } from '../lib/cache';
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

    this._cache = new Cache();
    this._doc = doc;

    this.ready = documentReady();
  }

  define(name, key) {
    return this._cache.define(name, key);
  }

  get(key) {
    return this._cache.get(key);
  }

  handleEvent(evt) {
    const affectedObjects = this._cache.resetObjects(evt);
    const affectedElement = findAffectedElements(this._doc, evt);

    fireObservers(affectedObjects);
  }
}

function findAffectedElements(root, evt) {
}

function onAddedDefinitions(elements) {
  for (const elem of elements) {
    const definitions = JSON.parse(elem.textContent);

    for (const name in definitions) {
      this.define(name, definitions[name]);
    }
  }
}

function onAddedI18nElement(elements) {
  for (const elem of elements) {
    if (!elem.hasAttribute('data-i18n-value')) {
      continue;
    }
    const value = elem.getAttribute('data-i18n-value');
    const name = elem.hasAttribute('data-i18n-name') ?
      elem.getAttribute('data-i18n-name') : undefined;
    const type = elem.getAttribute('data-i18n-type');
    const options = elem.hasAttribute('data-i18n-options') ?
      JSON.parse(elem.getAttribute('data-i18n-options')) : undefined;

    const formatter = this._cache.get(name || {type, options});
    switch (type) {
      case 'datetime':
        const resolvedValue = new Date(parseInt(value));
        elem.textContent = formatter.format(resolvedValue);
        break;
    }
  }
}

function fireObservers(affectedObjects) {
}
