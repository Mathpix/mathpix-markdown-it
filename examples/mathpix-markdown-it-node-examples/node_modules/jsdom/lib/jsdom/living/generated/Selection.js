"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertRange = require("./Range.js").convert;
const convertNode = require("./Node.js").convert;
const impl = utils.implSymbol;
const ctorRegistry = utils.ctorRegistrySymbol;

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
  throw new TypeError(`${context} is not of type 'Selection'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["Selection"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor Selection is not installed on the passed global object");
  }

  let obj = Object.create(ctor.prototype);
  obj = exports.setup(obj, globalObject, constructorArgs, privateData);
  return obj;
};
exports.createImpl = function createImpl(globalObject, constructorArgs, privateData) {
  const obj = exports.create(globalObject, constructorArgs, privateData);
  return utils.implForWrapper(obj);
};
exports._internalSetup = function _internalSetup(obj) {};
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
  class Selection {
    constructor() {
      throw new TypeError("Illegal constructor");
    }

    getRangeAt(index) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'getRangeAt' on 'Selection': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'getRangeAt' on 'Selection': parameter 1"
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].getRangeAt(...args));
    }

    addRange(range) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'addRange' on 'Selection': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertRange(curArg, { context: "Failed to execute 'addRange' on 'Selection': parameter 1" });
        args.push(curArg);
      }
      return this[impl].addRange(...args);
    }

    removeRange(range) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'removeRange' on 'Selection': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertRange(curArg, { context: "Failed to execute 'removeRange' on 'Selection': parameter 1" });
        args.push(curArg);
      }
      return this[impl].removeRange(...args);
    }

    removeAllRanges() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].removeAllRanges();
    }

    empty() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].empty();
    }

    collapse(node) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'collapse' on 'Selection': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg === null || curArg === undefined) {
          curArg = null;
        } else {
          curArg = convertNode(curArg, { context: "Failed to execute 'collapse' on 'Selection': parameter 1" });
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg !== undefined) {
          curArg = conversions["unsigned long"](curArg, {
            context: "Failed to execute 'collapse' on 'Selection': parameter 2"
          });
        } else {
          curArg = 0;
        }
        args.push(curArg);
      }
      return this[impl].collapse(...args);
    }

    setPosition(node) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'setPosition' on 'Selection': 1 argument required, but only " +
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
          curArg = convertNode(curArg, { context: "Failed to execute 'setPosition' on 'Selection': parameter 1" });
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg !== undefined) {
          curArg = conversions["unsigned long"](curArg, {
            context: "Failed to execute 'setPosition' on 'Selection': parameter 2"
          });
        } else {
          curArg = 0;
        }
        args.push(curArg);
      }
      return this[impl].setPosition(...args);
    }

    collapseToStart() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].collapseToStart();
    }

    collapseToEnd() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].collapseToEnd();
    }

    extend(node) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'extend' on 'Selection': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertNode(curArg, { context: "Failed to execute 'extend' on 'Selection': parameter 1" });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg !== undefined) {
          curArg = conversions["unsigned long"](curArg, {
            context: "Failed to execute 'extend' on 'Selection': parameter 2"
          });
        } else {
          curArg = 0;
        }
        args.push(curArg);
      }
      return this[impl].extend(...args);
    }

    setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 4) {
        throw new TypeError(
          "Failed to execute 'setBaseAndExtent' on 'Selection': 4 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertNode(curArg, { context: "Failed to execute 'setBaseAndExtent' on 'Selection': parameter 1" });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'setBaseAndExtent' on 'Selection': parameter 2"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[2];
        curArg = convertNode(curArg, { context: "Failed to execute 'setBaseAndExtent' on 'Selection': parameter 3" });
        args.push(curArg);
      }
      {
        let curArg = arguments[3];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'setBaseAndExtent' on 'Selection': parameter 4"
        });
        args.push(curArg);
      }
      return this[impl].setBaseAndExtent(...args);
    }

    selectAllChildren(node) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'selectAllChildren' on 'Selection': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertNode(curArg, { context: "Failed to execute 'selectAllChildren' on 'Selection': parameter 1" });
        args.push(curArg);
      }
      return this[impl].selectAllChildren(...args);
    }

    deleteFromDocument() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].deleteFromDocument();
    }

    containsNode(node) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'containsNode' on 'Selection': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertNode(curArg, { context: "Failed to execute 'containsNode' on 'Selection': parameter 1" });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg !== undefined) {
          curArg = conversions["boolean"](curArg, {
            context: "Failed to execute 'containsNode' on 'Selection': parameter 2"
          });
        } else {
          curArg = false;
        }
        args.push(curArg);
      }
      return this[impl].containsNode(...args);
    }

    toString() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].toString();
    }

    get anchorNode() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["anchorNode"]);
    }

    get anchorOffset() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["anchorOffset"];
    }

    get focusNode() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["focusNode"]);
    }

    get focusOffset() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["focusOffset"];
    }

    get isCollapsed() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["isCollapsed"];
    }

    get rangeCount() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["rangeCount"];
    }

    get type() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["type"];
    }
  }
  Object.defineProperties(Selection.prototype, {
    getRangeAt: { enumerable: true },
    addRange: { enumerable: true },
    removeRange: { enumerable: true },
    removeAllRanges: { enumerable: true },
    empty: { enumerable: true },
    collapse: { enumerable: true },
    setPosition: { enumerable: true },
    collapseToStart: { enumerable: true },
    collapseToEnd: { enumerable: true },
    extend: { enumerable: true },
    setBaseAndExtent: { enumerable: true },
    selectAllChildren: { enumerable: true },
    deleteFromDocument: { enumerable: true },
    containsNode: { enumerable: true },
    toString: { enumerable: true },
    anchorNode: { enumerable: true },
    anchorOffset: { enumerable: true },
    focusNode: { enumerable: true },
    focusOffset: { enumerable: true },
    isCollapsed: { enumerable: true },
    rangeCount: { enumerable: true },
    type: { enumerable: true },
    [Symbol.toStringTag]: { value: "Selection", configurable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["Selection"] = Selection;

  Object.defineProperty(globalObject, "Selection", {
    configurable: true,
    writable: true,
    value: Selection
  });
};

const Impl = require("../selection/Selection-impl.js");
