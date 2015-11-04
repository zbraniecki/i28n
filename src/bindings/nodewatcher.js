
export class NodeWatcher {
  constructor(root, options) {
    this._root = root;
    this._options = options;
    this._observer = new MutationObserver(onMutations.bind(null, this));

    this._observerConfig = {
      attributes: false,
      characterData: false,
      childList: true,
      subtree: true,
    };

    if (this._options.type.includes('modified')) {
      this._observerConfig.attributes = true;
      this._observerConfig.attributeFilter = this._options.attributes;
    }
  }

  start() {
    this._observer.observe(this._root, this._observerConfig);
  }

  stop() {
    this._observer.disconnect();
  }
}

function onMutations(nodeWatcher, mutations) {
  const addedTargets = new Set();
  const modifiedTargets = new Set();
  const removedTargets = new Set();

  for (let mutation of mutations) {
    switch (mutation.type) {
      case 'attributes':
        modifiedTargets.add(mutation.target);
        break;
      case 'childList':
        for (let addedNode of mutation.addedNodes) {
          if (addedNode.nodeType === addedNode.ELEMENT_NODE) {
            if (addedNode.childElementCount) {
              getMatchingElements(nodeWatcher._options.selector, addedNode).forEach(
                addedTargets.add.bind(addedTargets));
            } else {
              if (addedNode.matches(nodeWatcher._options.selector)) {
                addedTargets.add(addedNode);
              }
            }
          }
        }
        break;
    }
  }

  if (addedTargets.size) {
    nodeWatcher._options.onAdded(addedTargets);
  }
  if (modifiedTargets.size) {
    nodeWatcher._options.onModified(modifiedTargets);
  }
}

function getMatchingElements(selector, root) {
  const elems = Array.from(root.querySelectorAll(selector));

  if (typeof root.matches === 'function' && root.matches(selector)) {
    elems.push(root);
  }

  return elems;
}
