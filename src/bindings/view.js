import { Cache } from '../lib/cache';
import { NodeWatcher } from './nodewatcher';
import { documentReady } from './shims';

export class View {
  constructor(doc) {
    this._cache = new Cache();
    this._doc = doc;

    this.ready = documentReady();

    this._headWatcher = new NodeWatcher(doc.head, {
      type: ['added'],
      selector: 'style[type="application/mozi18n"]',
      onAdded: onAddedDefinitions.bind(this),
    });
    this._i18nWatcher = new NodeWatcher(doc.documentElement, {
      type: ['added', 'modified'],
      selector: '[data-i18n-value]',
      attributes: ['data-i18n-value', 'data-i18n-name', 'data-i18n-type', 'data-i18n-options'],
      onAdded: formatElements.bind(this),
      onModified: formatElements.bind(this),
    });

    if (doc.readyState !== 'loading') {
      this._headWatcher.prescan();
      this._i18nWatcher.prescan();
    }

    this._headWatcher.start();
    this._i18nWatcher.start();
  }

  define(name, key) {
    return this._cache.define(name, key);
  }

  get(key) {
    return this._cache.get(key);
  }

  handleEvent(evt) {
    const affectedElements = findAffectedElements.call(this,
        this._doc.documentElement, evt);
    const affectedObjects = this._cache.resetObjects(evt);

    formatElements.call(this, affectedElements);
    //fireObservers();
  }
}

function findAffectedElements(root, evt) {
  const affectedTypes = this._cache.getAffectedTypes(evt);

  const selector = Array.from(affectedTypes).map(
    type => `[data-i18n-type="${type}"]`).join(',');

  if (!selector) {
    return [];
  }
  return root.querySelectorAll(selector);
}

function onAddedDefinitions(elements) {
  for (let elem of elements) {
    const definitions = JSON.parse(elem.textContent);

    for (let name in definitions) {
      this.define(name, definitions[name]);
    }
  }
}

function formatElements(elements) {
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
