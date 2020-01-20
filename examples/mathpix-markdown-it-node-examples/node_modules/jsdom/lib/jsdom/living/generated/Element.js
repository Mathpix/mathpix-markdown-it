"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertAttr = require("./Attr.js").convert;
const convertShadowRootInit = require("./ShadowRootInit.js").convert;
const isNode = require("./Node.js").is;
const impl = utils.implSymbol;
const ctorRegistry = utils.ctorRegistrySymbol;
const Node = require("./Node.js");

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
  throw new TypeError(`${context} is not of type 'Element'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["Element"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor Element is not installed on the passed global object");
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
  Node._internalSetup(obj);
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
  if (globalObject.Node === undefined) {
    throw new Error("Internal error: attempting to evaluate Element before Node");
  }
  class Element extends globalObject.Node {
    constructor() {
      throw new TypeError("Illegal constructor");
    }

    hasAttributes() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasAttributes();
    }

    getAttributeNames() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl].getAttributeNames());
    }

    getAttribute(qualifiedName) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'getAttribute' on 'Element': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'getAttribute' on 'Element': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].getAttribute(...args);
    }

    getAttributeNS(namespace, localName) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'getAttributeNS' on 'Element': 2 arguments required, but only " +
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
            context: "Failed to execute 'getAttributeNS' on 'Element': parameter 1"
          });
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'getAttributeNS' on 'Element': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].getAttributeNS(...args);
    }

    setAttribute(qualifiedName, value) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'setAttribute' on 'Element': 2 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'setAttribute' on 'Element': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'setAttribute' on 'Element': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].setAttribute(...args);
    }

    setAttributeNS(namespace, qualifiedName, value) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 3) {
        throw new TypeError(
          "Failed to execute 'setAttributeNS' on 'Element': 3 arguments required, but only " +
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
            context: "Failed to execute 'setAttributeNS' on 'Element': parameter 1"
          });
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'setAttributeNS' on 'Element': parameter 2"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[2];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'setAttributeNS' on 'Element': parameter 3"
        });
        args.push(curArg);
      }
      return this[impl].setAttributeNS(...args);
    }

    removeAttribute(qualifiedName) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'removeAttribute' on 'Element': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'removeAttribute' on 'Element': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].removeAttribute(...args);
    }

    removeAttributeNS(namespace, localName) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'removeAttributeNS' on 'Element': 2 arguments required, but only " +
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
            context: "Failed to execute 'removeAttributeNS' on 'Element': parameter 1"
          });
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'removeAttributeNS' on 'Element': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].removeAttributeNS(...args);
    }

    toggleAttribute(qualifiedName) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'toggleAttribute' on 'Element': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'toggleAttribute' on 'Element': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg !== undefined) {
          curArg = conversions["boolean"](curArg, {
            context: "Failed to execute 'toggleAttribute' on 'Element': parameter 2"
          });
        }
        args.push(curArg);
      }
      return this[impl].toggleAttribute(...args);
    }

    hasAttribute(qualifiedName) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'hasAttribute' on 'Element': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'hasAttribute' on 'Element': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].hasAttribute(...args);
    }

    hasAttributeNS(namespace, localName) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'hasAttributeNS' on 'Element': 2 arguments required, but only " +
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
            context: "Failed to execute 'hasAttributeNS' on 'Element': parameter 1"
          });
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'hasAttributeNS' on 'Element': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].hasAttributeNS(...args);
    }

    getAttributeNode(qualifiedName) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'getAttributeNode' on 'Element': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'getAttributeNode' on 'Element': parameter 1"
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].getAttributeNode(...args));
    }

    getAttributeNodeNS(namespace, localName) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'getAttributeNodeNS' on 'Element': 2 arguments required, but only " +
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
            context: "Failed to execute 'getAttributeNodeNS' on 'Element': parameter 1"
          });
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'getAttributeNodeNS' on 'Element': parameter 2"
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].getAttributeNodeNS(...args));
    }

    setAttributeNode(attr) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'setAttributeNode' on 'Element': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertAttr(curArg, { context: "Failed to execute 'setAttributeNode' on 'Element': parameter 1" });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].setAttributeNode(...args));
    }

    setAttributeNodeNS(attr) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'setAttributeNodeNS' on 'Element': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertAttr(curArg, { context: "Failed to execute 'setAttributeNodeNS' on 'Element': parameter 1" });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].setAttributeNodeNS(...args));
    }

    removeAttributeNode(attr) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'removeAttributeNode' on 'Element': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertAttr(curArg, { context: "Failed to execute 'removeAttributeNode' on 'Element': parameter 1" });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].removeAttributeNode(...args));
    }

    attachShadow(init) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'attachShadow' on 'Element': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertShadowRootInit(curArg, {
          context: "Failed to execute 'attachShadow' on 'Element': parameter 1"
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].attachShadow(...args));
    }

    closest(selectors) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'closest' on 'Element': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, { context: "Failed to execute 'closest' on 'Element': parameter 1" });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].closest(...args));
    }

    matches(selectors) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'matches' on 'Element': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, { context: "Failed to execute 'matches' on 'Element': parameter 1" });
        args.push(curArg);
      }
      return this[impl].matches(...args);
    }

    webkitMatchesSelector(selectors) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'webkitMatchesSelector' on 'Element': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'webkitMatchesSelector' on 'Element': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].webkitMatchesSelector(...args);
    }

    getElementsByTagName(qualifiedName) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'getElementsByTagName' on 'Element': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'getElementsByTagName' on 'Element': parameter 1"
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].getElementsByTagName(...args));
    }

    getElementsByTagNameNS(namespace, localName) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'getElementsByTagNameNS' on 'Element': 2 arguments required, but only " +
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
            context: "Failed to execute 'getElementsByTagNameNS' on 'Element': parameter 1"
          });
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'getElementsByTagNameNS' on 'Element': parameter 2"
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].getElementsByTagNameNS(...args));
    }

    getElementsByClassName(classNames) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'getElementsByClassName' on 'Element': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'getElementsByClassName' on 'Element': parameter 1"
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].getElementsByClassName(...args));
    }

    insertAdjacentElement(where, element) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'insertAdjacentElement' on 'Element': 2 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'insertAdjacentElement' on 'Element': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = module.exports.convert(curArg, {
          context: "Failed to execute 'insertAdjacentElement' on 'Element': parameter 2"
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].insertAdjacentElement(...args));
    }

    insertAdjacentText(where, data) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'insertAdjacentText' on 'Element': 2 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'insertAdjacentText' on 'Element': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'insertAdjacentText' on 'Element': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].insertAdjacentText(...args);
    }

    insertAdjacentHTML(position, text) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'insertAdjacentHTML' on 'Element': 2 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'insertAdjacentHTML' on 'Element': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'insertAdjacentHTML' on 'Element': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].insertAdjacentHTML(...args);
    }

    getClientRects() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl].getClientRects());
    }

    getBoundingClientRect() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl].getBoundingClientRect());
    }

    before() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      for (let i = 0; i < arguments.length; i++) {
        let curArg = arguments[i];
        if (isNode(curArg)) {
          curArg = utils.implForWrapper(curArg);
        } else {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'before' on 'Element': parameter " + (i + 1)
          });
        }
        args.push(curArg);
      }
      return this[impl].before(...args);
    }

    after() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      for (let i = 0; i < arguments.length; i++) {
        let curArg = arguments[i];
        if (isNode(curArg)) {
          curArg = utils.implForWrapper(curArg);
        } else {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'after' on 'Element': parameter " + (i + 1)
          });
        }
        args.push(curArg);
      }
      return this[impl].after(...args);
    }

    replaceWith() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      for (let i = 0; i < arguments.length; i++) {
        let curArg = arguments[i];
        if (isNode(curArg)) {
          curArg = utils.implForWrapper(curArg);
        } else {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'replaceWith' on 'Element': parameter " + (i + 1)
          });
        }
        args.push(curArg);
      }
      return this[impl].replaceWith(...args);
    }

    remove() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].remove();
    }

    prepend() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      for (let i = 0; i < arguments.length; i++) {
        let curArg = arguments[i];
        if (isNode(curArg)) {
          curArg = utils.implForWrapper(curArg);
        } else {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'prepend' on 'Element': parameter " + (i + 1)
          });
        }
        args.push(curArg);
      }
      return this[impl].prepend(...args);
    }

    append() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      for (let i = 0; i < arguments.length; i++) {
        let curArg = arguments[i];
        if (isNode(curArg)) {
          curArg = utils.implForWrapper(curArg);
        } else {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'append' on 'Element': parameter " + (i + 1)
          });
        }
        args.push(curArg);
      }
      return this[impl].append(...args);
    }

    querySelector(selectors) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'querySelector' on 'Element': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'querySelector' on 'Element': parameter 1"
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].querySelector(...args));
    }

    querySelectorAll(selectors) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'querySelectorAll' on 'Element': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'querySelectorAll' on 'Element': parameter 1"
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].querySelectorAll(...args));
    }

    get namespaceURI() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["namespaceURI"];
    }

    get prefix() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["prefix"];
    }

    get localName() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["localName"];
    }

    get tagName() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["tagName"];
    }

    get id() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "id");
      return value === null ? "" : value;
    }

    set id(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, { context: "Failed to set the 'id' property on 'Element': The provided value" });

      this[impl].setAttributeNS(null, "id", V);
    }

    get className() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "class");
      return value === null ? "" : value;
    }

    set className(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'className' property on 'Element': The provided value"
      });

      this[impl].setAttributeNS(null, "class", V);
    }

    get classList() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.getSameObject(this, "classList", () => {
        return utils.tryWrapperForImpl(this[impl]["classList"]);
      });
    }

    set classList(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      this.classList.value = V;
    }

    get slot() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "slot");
      return value === null ? "" : value;
    }

    set slot(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'slot' property on 'Element': The provided value"
      });

      this[impl].setAttributeNS(null, "slot", V);
    }

    get attributes() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.getSameObject(this, "attributes", () => {
        return utils.tryWrapperForImpl(this[impl]["attributes"]);
      });
    }

    get shadowRoot() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["shadowRoot"]);
    }

    get innerHTML() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["innerHTML"];
    }

    set innerHTML(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'innerHTML' property on 'Element': The provided value",
        treatNullAsEmptyString: true
      });

      this[impl]["innerHTML"] = V;
    }

    get outerHTML() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["outerHTML"];
    }

    set outerHTML(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'outerHTML' property on 'Element': The provided value",
        treatNullAsEmptyString: true
      });

      this[impl]["outerHTML"] = V;
    }

    get scrollTop() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["scrollTop"];
    }

    set scrollTop(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["unrestricted double"](V, {
        context: "Failed to set the 'scrollTop' property on 'Element': The provided value"
      });

      this[impl]["scrollTop"] = V;
    }

    get scrollLeft() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["scrollLeft"];
    }

    set scrollLeft(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["unrestricted double"](V, {
        context: "Failed to set the 'scrollLeft' property on 'Element': The provided value"
      });

      this[impl]["scrollLeft"] = V;
    }

    get scrollWidth() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["scrollWidth"];
    }

    get scrollHeight() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["scrollHeight"];
    }

    get clientTop() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["clientTop"];
    }

    get clientLeft() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["clientLeft"];
    }

    get clientWidth() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["clientWidth"];
    }

    get clientHeight() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["clientHeight"];
    }

    get previousElementSibling() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["previousElementSibling"]);
    }

    get nextElementSibling() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["nextElementSibling"]);
    }

    get children() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.getSameObject(this, "children", () => {
        return utils.tryWrapperForImpl(this[impl]["children"]);
      });
    }

    get firstElementChild() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["firstElementChild"]);
    }

    get lastElementChild() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["lastElementChild"]);
    }

    get childElementCount() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["childElementCount"];
    }

    get assignedSlot() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["assignedSlot"]);
    }
  }
  Object.defineProperties(Element.prototype, {
    hasAttributes: { enumerable: true },
    getAttributeNames: { enumerable: true },
    getAttribute: { enumerable: true },
    getAttributeNS: { enumerable: true },
    setAttribute: { enumerable: true },
    setAttributeNS: { enumerable: true },
    removeAttribute: { enumerable: true },
    removeAttributeNS: { enumerable: true },
    toggleAttribute: { enumerable: true },
    hasAttribute: { enumerable: true },
    hasAttributeNS: { enumerable: true },
    getAttributeNode: { enumerable: true },
    getAttributeNodeNS: { enumerable: true },
    setAttributeNode: { enumerable: true },
    setAttributeNodeNS: { enumerable: true },
    removeAttributeNode: { enumerable: true },
    attachShadow: { enumerable: true },
    closest: { enumerable: true },
    matches: { enumerable: true },
    webkitMatchesSelector: { enumerable: true },
    getElementsByTagName: { enumerable: true },
    getElementsByTagNameNS: { enumerable: true },
    getElementsByClassName: { enumerable: true },
    insertAdjacentElement: { enumerable: true },
    insertAdjacentText: { enumerable: true },
    insertAdjacentHTML: { enumerable: true },
    getClientRects: { enumerable: true },
    getBoundingClientRect: { enumerable: true },
    before: { enumerable: true },
    after: { enumerable: true },
    replaceWith: { enumerable: true },
    remove: { enumerable: true },
    prepend: { enumerable: true },
    append: { enumerable: true },
    querySelector: { enumerable: true },
    querySelectorAll: { enumerable: true },
    namespaceURI: { enumerable: true },
    prefix: { enumerable: true },
    localName: { enumerable: true },
    tagName: { enumerable: true },
    id: { enumerable: true },
    className: { enumerable: true },
    classList: { enumerable: true },
    slot: { enumerable: true },
    attributes: { enumerable: true },
    shadowRoot: { enumerable: true },
    innerHTML: { enumerable: true },
    outerHTML: { enumerable: true },
    scrollTop: { enumerable: true },
    scrollLeft: { enumerable: true },
    scrollWidth: { enumerable: true },
    scrollHeight: { enumerable: true },
    clientTop: { enumerable: true },
    clientLeft: { enumerable: true },
    clientWidth: { enumerable: true },
    clientHeight: { enumerable: true },
    previousElementSibling: { enumerable: true },
    nextElementSibling: { enumerable: true },
    children: { enumerable: true },
    firstElementChild: { enumerable: true },
    lastElementChild: { enumerable: true },
    childElementCount: { enumerable: true },
    assignedSlot: { enumerable: true },
    [Symbol.toStringTag]: { value: "Element", configurable: true },
    [Symbol.unscopables]: {
      value: {
        slot: true,
        before: true,
        after: true,
        replaceWith: true,
        remove: true,
        prepend: true,
        append: true,
        __proto__: null
      },
      configurable: true
    }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["Element"] = Element;

  Object.defineProperty(globalObject, "Element", {
    configurable: true,
    writable: true,
    value: Element
  });
};

const Impl = require("../nodes/Element-impl.js");
