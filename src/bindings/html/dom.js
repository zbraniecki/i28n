'use strict';

export function formatMutations(view, mutations) {
  const targets = new Set();
  const removed = new Set();

  for (let mutation of mutations) {
    switch (mutation.type) {
      case 'attributes':
        targets.add(mutation.target);
        break;

      case 'childList':
        for (let addedNode of mutation.addedNodes) {
          if (addedNode.nodeType === addedNode.ELEMENT_NODE) {
            if (addedNode.childElementCount) {
              getI18nElements(addedNode).forEach(targets.add.bind(targets));
            } else {
              if (addedNode.hasAttribute('data-i18n-value')) {
                targets.add(addedNode);
              }
            }
          }
        }
        for (let removedNode of mutation.removedNodes) {
          if (removedNode.nodeType === removedNode.ELEMENT_NODE) {
            if (removedNode.childElementCount) {
              getI18nElements(addedNode).forEach(removed.add.bind(removed));
            } else {
              if (removedNode.hasAttribute('data-i18n-value')) {
                removed.add(removedNode);
              }
            }
          }
        }
        break;
    }
  }

  if (targets.size === 0) {
    return;
  }

  formatElements(view, Array.from(targets));
}

function getI18nElements(element) {
  const nodes = Array.from(element.querySelectorAll('[data-i18n-value]'));

  if (typeof element.hasAttribute === 'function' &&
      element.hasAttribute('data-i18n-value')) {
    nodes.push(element);
  }

  return nodes;
}

function formatDocument() {
  formatFragment(document.documentElement);
}

function formatFragment(root) {
  return formatElements(getI18nElement(root));
}

function formatElements(view, elements) {
  view._disconnect();

  for (let i = 0; i < elements.length; i++) {
    formatElement(view, elements[i]);
  }
  view._observe();
}

function formatElement(view, elem) {
  const format = elem.getAttribute('data-i18n-format');
  if (!elem.hasAttribute('data-i18n-value')) {
    return;
  }

  const value = elem.getAttribute('data-i18n-value');
  const options = elem.hasAttribute('data-i18n-options') ?
    JSON.parse(elem.getAttribute('data-i18n-options')) : {};

  const formatter = view._getFormatter(format, options, elem);
  let resolvedValue;

  switch (format) {
    case 'datetime':
      resolvedValue = new Date(parseInt(value));
      const resolvedOptions = Object.assign({}, options);
      if (resolvedOptions.hour12 === undefined) {
        resolvedOptions.hour12 = navigator.mozHour12;
      }
      elem.textContent = formatter.format(resolvedValue);
      break;
    case 'number':
      resolvedValue = parseInt(value);
      elem.textContent = formatter.format(resolvedValue);
      break;
    case 'mozduration':
      resolvedValue = parseInt(value);
      mozIntl.DurationFormat(navigator.languages, options).then(f => {
        elem.textContent = f.format(resolvedValue);
      });
      break;
    case 'mozrelativetime':
      resolvedValue = parseInt(value);
      var f = mozIntl.RelativeTimeFormat(navigator.languages, options);
      f.format(resolvedValue).then(v => {
        elem.textContent = v;
      });
      break;
  }
}
