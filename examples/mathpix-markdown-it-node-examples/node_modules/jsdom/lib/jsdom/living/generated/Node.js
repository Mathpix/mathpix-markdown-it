"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertGetRootNodeOptions = require("./GetRootNodeOptions.js").convert;
const impl = utils.implSymbol;
const ctorRegistry = utils.ctorRegistrySymbol;
const EventTarget = require("./EventTarget.js");

/**
 * When an interface-module that implements this interface as a mixin is loaded, it will append its own `.is()`
 * method into this array. It allows objects that directly implements *those* interfaces to be recognized as
 * implementing this mixin interface.
 */
exports._mixedIntoPredicates = [];
exports.is = function is(obj) {
  if (obj) {
    if (utils.hasOwn(obj, impl) && obj[impl] instanceof Impl.implementation) {
      return true;
    }
    for (const isMixedInto of exports._mixedIntoPredicates) {
      if (isMixedInto(obj)) {
        return true;
      }
    }
  }
  return false;
};
exports.isImpl = function isImpl(obj) {
  if (obj) {
    if (obj instanceof Impl.implementation) {
      return true;
    }

    const wrapper = utils.wrapperForImpl(obj);
    for (const isMixedInto of exports._mixedIntoPredicates) {
      if (isMixedInto(wrapper)) {
        return true;
      }
    }
  }
  return false;
};
exports.convert = function convert(obj, { context = "The provided value" } = {}) {
  if (exports.is(obj)) {
    return utils.implForWrapper(obj);
  }
  throw new TypeError(`${context} is not of type 'Node'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["Node"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor Node is not installed on the passed global object");
  }

  let obj = Object.create(ctor.prototype);
  obj = exports.setup(obj, globalObject, constructorArgs, privateData);
  return obj;
};
exports.createImpl = function createImpl(globalObject, constructorArgs, privateData) {
  const obj = exports.create(globalObject, constructorArgs, privateData);
  return utils.implForWrapper(obj);
};
exports._internalSetup = function _internalSetup(obj) {
  EventTarget._internalSetup(obj);
};
exports.setup = function setup(obj, globalObject, constructorArgs = [], privateData = {}) {
  privateData.wrapper = obj;

  exports._internalSetup(obj);
  Object.defineProperty(obj, impl, {
    value: new Impl.implementation(globalObject, constructorArgs, privateData),
    configurable: true
  });

  obj[impl][utils.wrapperSymbol] = obj;
  if (Impl.init) {
    Impl.init(obj[impl], privateData);
  }
  return obj;
};

exports.install = function install(globalObject) {
  if (globalObject.EventTarget === undefined) {
    throw new Error("Internal error: attempting to evaluate Node before EventTarget");
  }
  class Node extends globalObject.EventTarget {
    constructor() {
      throw new TypeError("Illegal constructor");
    }

    getRootNode() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertGetRootNodeOptions(curArg, {
          context: "Failed to execute 'getRootNode' on 'Node': parameter 1"
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].getRootNode(...args));
    }

    hasChildNodes() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasChildNodes();
    }

    normalize() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].normalize();
    }

    cloneNode() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          curArg = conversions["boolean"](curArg, { context: "Failed to execute 'cloneNode' on 'Node': parameter 1" });
        } else {
          curArg = false;
        }
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].cloneNode(...args));
    }

    isEqualNode(otherNode) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'isEqualNode' on 'Node': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg === null || curArg === undefined) {
          curArg = null;
        } else {
          curArg = module.exports.convert(curArg, {
            context: "Failed to execute 'isEqualNode' on 'Node': parameter 1"
          });
        }
        args.push(curArg);
      }
      return this[impl].isEqualNode(...args);
    }

    isSameNode(otherNode) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'isSameNode' on 'Node': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg === null || curArg === undefined) {
          curArg = null;
        } else {
          curArg = module.exports.convert(curArg, { context: "Failed to execute 'isSameNode' on 'Node': parameter 1" });
        }
        args.push(curArg);
      }
      return this[impl].isSameNode(...args);
    }

    compareDocumentPosition(other) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'compareDocumentPosition' on 'Node': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = module.exports.convert(curArg, {
          context: "Failed to execute 'compareDocumentPosition' on 'Node': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].compareDocumentPosition(...args);
    }

    contains(other) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'contains' on 'Node': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg === null || curArg === undefined) {
          curArg = null;
        } else {
          curArg = module.exports.convert(curArg, { context: "Failed to execute 'contains' on 'Node': parameter 1" });
        }
        args.push(curArg);
      }
      return this[impl].contains(...args);
    }

    lookupPrefix(namespace) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'lookupPrefix' on 'Node': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg === null || curArg === undefined) {
          curArg = null;
        } else {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'lookupPrefix' on 'Node': parameter 1"
          });
        }
        args.push(curArg);
      }
      return this[impl].lookupPrefix(...args);
    }

    lookupNamespaceURI(prefix) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'lookupNamespaceURI' on 'Node': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg === null || curArg === undefined) {
          curArg = null;
        } else {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'lookupNamespaceURI' on 'Node': parameter 1"
          });
        }
        args.push(curArg);
      }
      return this[impl].lookupNamespaceURI(...args);
    }

    isDefaultNamespace(namespace) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'isDefaultNamespace' on 'Node': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg === null || curArg === undefined) {
          curArg = null;
        } else {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'isDefaultNamespace' on 'Node': parameter 1"
          });
        }
        args.push(curArg);
      }
      return this[impl].isDefaultNamespace(...args);
    }

    insertBefore(node, child) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'insertBefore' on 'Node': 2 arguments required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = module.exports.convert(curArg, { context: "Failed to execute 'insertBefore' on 'Node': parameter 1" });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg === null || curArg === undefined) {
          curArg = null;
        } else {
          curArg = module.exports.convert(curArg, {
            context: "Failed to execute 'insertBefore' on 'Node': parameter 2"
          });
        }
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].insertBefore(...args));
    }

    appendChild(node) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'appendChild' on 'Node': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = module.exports.convert(curArg, { context: "Failed to execute 'appendChild' on 'Node': parameter 1" });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].appendChild(...args));
    }

    replaceChild(node, child) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'replaceChild' on 'Node': 2 arguments required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = module.exports.convert(curArg, { context: "Failed to execute 'replaceChild' on 'Node': parameter 1" });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = module.exports.convert(curArg, { context: "Failed to execute 'replaceChild' on 'Node': parameter 2" });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].replaceChild(...args));
    }

    removeChild(child) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'removeChild' on 'Node': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = module.exports.convert(curArg, { context: "Failed to execute 'removeChild' on 'Node': parameter 1" });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].removeChild(...args));
    }

    get nodeType() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["nodeType"];
    }

    get nodeName() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["nodeName"];
    }

    get baseURI() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["baseURI"];
    }

    get isConnected() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["isConnected"];
    }

    get ownerDocument() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["ownerDocument"]);
    }

    get parentNode() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["parentNode"]);
    }

    get parentElement() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["parentElement"]);
    }

    get childNodes() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.getSameObject(this, "childNodes", () => {
        return utils.tryWrapperForImpl(this[impl]["childNodes"]);
      });
    }

    get firstChild() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["firstChild"]);
    }

    get lastChild() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["lastChild"]);
    }

    get previousSibling() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["previousSibling"]);
    }

    get nextSibling() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["nextSibling"]);
    }

    get nodeValue() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["nodeValue"];
    }

    set nodeValue(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (V === null || V === undefined) {
        V = null;
      } else {
        V = conversions["DOMString"](V, {
          context: "Failed to set the 'nodeValue' property on 'Node': The provided value"
        });
      }
      this[impl]["nodeValue"] = V;
    }

    get textContent() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["textContent"];
    }

    set textContent(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (V === null || V === undefined) {
        V = null;
      } else {
        V = conversions["DOMString"](V, {
          context: "Failed to set the 'textContent' property on 'Node': The provided value"
        });
      }
      this[impl]["textContent"] = V;
    }
  }
  Object.defineProperties(Node.prototype, {
    getRootNode: { enumerable: true },
    hasChildNodes: { enumerable: true },
    normalize: { enumerable: true },
    cloneNode: { enumerable: true },
    isEqualNode: { enumerable: true },
    isSameNode: { enumerable: true },
    compareDocumentPosition: { enumerable: true },
    contains: { enumerable: true },
    lookupPrefix: { enumerable: true },
    lookupNamespaceURI: { enumerable: true },
    isDefaultNamespace: { enumerable: true },
    insertBefore: { enumerable: true },
    appendChild: { enumerable: true },
    replaceChild: { enumerable: true },
    removeChild: { enumerable: true },
    nodeType: { enumerable: true },
    nodeName: { enumerable: true },
    baseURI: { enumerable: true },
    isConnected: { enumerable: true },
    ownerDocument: { enumerable: true },
    parentNode: { enumerable: true },
    parentElement: { enumerable: true },
    childNodes: { enumerable: true },
    firstChild: { enumerable: true },
    lastChild: { enumerable: true },
    previousSibling: { enumerable: true },
    nextSibling: { enumerable: true },
    nodeValue: { enumerable: true },
    textContent: { enumerable: true },
    [Symbol.toStringTag]: { value: "Node", configurable: true },
    ELEMENT_NODE: { value: 1, enumerable: true },
    ATTRIBUTE_NODE: { value: 2, enumerable: true },
    TEXT_NODE: { value: 3, enumerable: true },
    CDATA_SECTION_NODE: { value: 4, enumerable: true },
    ENTITY_REFERENCE_NODE: { value: 5, enumerable: true },
    ENTITY_NODE: { value: 6, enumerable: true },
    PROCESSING_INSTRUCTION_NODE: { value: 7, enumerable: true },
    COMMENT_NODE: { value: 8, enumerable: true },
    DOCUMENT_NODE: { value: 9, enumerable: true },
    DOCUMENT_TYPE_NODE: { value: 10, enumerable: true },
    DOCUMENT_FRAGMENT_NODE: { value: 11, enumerable: true },
    NOTATION_NODE: { value: 12, enumerable: true },
    DOCUMENT_POSITION_DISCONNECTED: { value: 0x01, enumerable: true },
    DOCUMENT_POSITION_PRECEDING: { value: 0x02, enumerable: true },
    DOCUMENT_POSITION_FOLLOWING: { value: 0x04, enumerable: true },
    DOCUMENT_POSITION_CONTAINS: { value: 0x08, enumerable: true },
    DOCUMENT_POSITION_CONTAINED_BY: { value: 0x10, enumerable: true },
    DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: { value: 0x20, enumerable: true }
  });
  Object.defineProperties(Node, {
    ELEMENT_NODE: { value: 1, enumerable: true },
    ATTRIBUTE_NODE: { value: 2, enumerable: true },
    TEXT_NODE: { value: 3, enumerable: true },
    CDATA_SECTION_NODE: { value: 4, enumerable: true },
    ENTITY_REFERENCE_NODE: { value: 5, enumerable: true },
    ENTITY_NODE: { value: 6, enumerable: true },
    PROCESSING_INSTRUCTION_NODE: { value: 7, enumerable: true },
    COMMENT_NODE: { value: 8, enumerable: true },
    DOCUMENT_NODE: { value: 9, enumerable: true },
    DOCUMENT_TYPE_NODE: { value: 10, enumerable: true },
    DOCUMENT_FRAGMENT_NODE: { value: 11, enumerable: true },
    NOTATION_NODE: { value: 12, enumerable: true },
    DOCUMENT_POSITION_DISCONNECTED: { value: 0x01, enumerable: true },
    DOCUMENT_POSITION_PRECEDING: { value: 0x02, enumerable: true },
    DOCUMENT_POSITION_FOLLOWING: { value: 0x04, enumerable: true },
    DOCUMENT_POSITION_CONTAINS: { value: 0x08, enumerable: true },
    DOCUMENT_POSITION_CONTAINED_BY: { value: 0x10, enumerable: true },
    DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: { value: 0x20, enumerable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["Node"] = Node;

  Object.defineProperty(globalObject, "Node", {
    configurable: true,
    writable: true,
    value: Node
  });
};

const Impl = require("../nodes/Node-impl.js");
