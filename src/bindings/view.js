import { Cache } from '../lib/cache';
import { NodeWatcher } from './nodewatcher';
import { documentReady } from './shims';

export class View {
  constructor(doc) {
    this._cache = new Cache();
    this._doc = doc;

    this.ready = documentReady();

    this._i18nWatcher = new NodeWatcher(doc.documentElement, {
      type: ['added', 'modified'],
      selector: '[data-i18n-value]',
      attributes: ['data-i18n-value', 'data-i18n-type', 'data-i18n-options'],
      onAdded: formatElements.bind(this),
      onModified: formatElements.bind(this),
    });

    if (doc.readyState !== 'loading') {
      this._i18nWatcher.prescan();
    }

    this._i18nWatcher.start();
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

function formatElements(elements) {
  for (let elem of elements) {
    if (!elem.hasAttribute('data-i18n-value')) {
      continue;
    }
    const value = elem.getAttribute('data-i18n-value');
    const type = elem.getAttribute('data-i18n-type');
    const options = elem.hasAttribute('data-i18n-options') ?
      JSON.parse(elem.getAttribute('data-i18n-options')) : undefined;

    const formatter = this._cache.get({type, options});
    let resolvedValue;
    switch (type) {
      case 'datetime':
        resolvedValue = new Date(parseInt(value));
        elem.textContent = formatter.format(resolvedValue);
        break;
      case 'number':
        resolvedValue = new Date(parseInt(value));
        elem.textContent = formatter.format(resolvedValue);
        break;
    }
  }
}

function fireObservers(affectedObjects) {
}
