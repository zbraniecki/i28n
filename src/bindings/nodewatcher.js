
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
  }

  start() {
    this._observer.observe(this._root, this._observerConfig);
  }

  stop() {
    this._observer.disconnect();
  }
}

function onMutations(nodeWatcher, mutations) {
  const targets = new Set();
  const removed = new Set();

  for (let mutation of mutations) {
    switch (mutation.type) {
      case 'childList':
        for (let addedNode of mutation.addedNodes) {
          if (addedNode.nodeType === addedNode.ELEMENT_NODE) {
            if (addedNode.childElementCount) {
              getMatchingElements(nodeWatcher._options.selector, addedNode).forEach(
                targets.add.bind(targets));
            } else {
              if (addedNode.matches(nodeWatcher._options.selector)) {
                targets.add(addedNode);
              }
            }
          }
        }
        break;
    }
  }

  if (targets.size) {
    nodeWatcher._options.onAdded(targets);
  }
}

function getMatchingElements(selector, root) {
  const elems = Array.from(root.querySelectorAll(selector));

  if (typeof root.matches === 'function' && root.matches(selector)) {
    elems.push(root);
  }

  return elems;
}
