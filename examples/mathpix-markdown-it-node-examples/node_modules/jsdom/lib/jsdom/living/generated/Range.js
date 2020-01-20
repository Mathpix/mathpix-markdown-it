"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertNode = require("./Node.js").convert;
const impl = utils.implSymbol;
const ctorRegistry = utils.ctorRegistrySymbol;
const AbstractRange = require("./AbstractRange.js");

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
  throw new TypeError(`${context} is not of type 'Range'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["Range"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor Range is not installed on the passed global object");
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
  AbstractRange._internalSetup(obj);
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
  if (globalObject.AbstractRange === undefined) {
    throw new Error("Internal error: attempting to evaluate Range before AbstractRange");
  }
  class Range extends globalObject.AbstractRange {
    constructor() {
      return exports.setup(Object.create(new.target.prototype), globalObject, undefined);
    }

    setStart(node, offset) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'setStart' on 'Range': 2 arguments required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertNode(curArg, { context: "Failed to execute 'setStart' on 'Range': parameter 1" });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'setStart' on 'Range': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].setStart(...args);
    }

    setEnd(node, offset) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'setEnd' on 'Range': 2 arguments required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertNode(curArg, { context: "Failed to execute 'setEnd' on 'Range': parameter 1" });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'setEnd' on 'Range': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].setEnd(...args);
    }

    setStartBefore(node) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'setStartBefore' on 'Range': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertNode(curArg, { context: "Failed to execute 'setStartBefore' on 'Range': parameter 1" });
        args.push(curArg);
      }
      return this[impl].setStartBefore(...args);
    }

    setStartAfter(node) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'setStartAfter' on 'Range': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertNode(curArg, { context: "Failed to execute 'setStartAfter' on 'Range': parameter 1" });
        args.push(curArg);
      }
      return this[impl].setStartAfter(...args);
    }

    setEndBefore(node) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'setEndBefore' on 'Range': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertNode(curArg, { context: "Failed to execute 'setEndBefore' on 'Range': parameter 1" });
        args.push(curArg);
      }
      return this[impl].setEndBefore(...args);
    }

    setEndAfter(node) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'setEndAfter' on 'Range': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertNode(curArg, { context: "Failed to execute 'setEndAfter' on 'Range': parameter 1" });
        args.push(curArg);
      }
      return this[impl].setEndAfter(...args);
    }

    collapse() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          curArg = conversions["boolean"](curArg, { context: "Failed to execute 'collapse' on 'Range': parameter 1" });
        } else {
          curArg = false;
        }
        args.push(curArg);
      }
      return this[impl].collapse(...args);
    }

    selectNode(node) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'selectNode' on 'Range': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertNode(curArg, { context: "Failed to execute 'selectNode' on 'Range': parameter 1" });
        args.push(curArg);
      }
      return this[impl].selectNode(...args);
    }

    selectNodeContents(node) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'selectNodeContents' on 'Range': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertNode(curArg, { context: "Failed to execute 'selectNodeContents' on 'Range': parameter 1" });
        args.push(curArg);
      }
      return this[impl].selectNodeContents(...args);
    }

    compareBoundaryPoints(how, sourceRange) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'compareBoundaryPoints' on 'Range': 2 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["unsigned short"](curArg, {
          context: "Failed to execute 'compareBoundaryPoints' on 'Range': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = module.exports.convert(curArg, {
          context: "Failed to execute 'compareBoundaryPoints' on 'Range': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].compareBoundaryPoints(...args);
    }

    deleteContents() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].deleteContents();
    }

    extractContents() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl].extractContents());
    }

    cloneContents() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl].cloneContents());
    }

    insertNode(node) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'insertNode' on 'Range': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertNode(curArg, { context: "Failed to execute 'insertNode' on 'Range': parameter 1" });
        args.push(curArg);
      }
      return this[impl].insertNode(...args);
    }

    surroundContents(newParent) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'surroundContents' on 'Range': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertNode(curArg, { context: "Failed to execute 'surroundContents' on 'Range': parameter 1" });
        args.push(curArg);
      }
      return this[impl].surroundContents(...args);
    }

    cloneRange() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl].cloneRange());
    }

    detach() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].detach();
    }

    isPointInRange(node, offset) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'isPointInRange' on 'Range': 2 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertNode(curArg, { context: "Failed to execute 'isPointInRange' on 'Range': parameter 1" });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'isPointInRange' on 'Range': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].isPointInRange(...args);
    }

    comparePoint(node, offset) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'comparePoint' on 'Range': 2 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertNode(curArg, { context: "Failed to execute 'comparePoint' on 'Range': parameter 1" });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'comparePoint' on 'Range': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].comparePoint(...args);
    }

    intersectsNode(node) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'intersectsNode' on 'Range': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertNode(curArg, { context: "Failed to execute 'intersectsNode' on 'Range': parameter 1" });
        args.push(curArg);
      }
      return this[impl].intersectsNode(...args);
    }

    toString() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].toString();
    }

    createContextualFragment(fragment) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'createContextualFragment' on 'Range': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'createContextualFragment' on 'Range': parameter 1"
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].createContextualFragment(...args));
    }

    get commonAncestorContainer() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["commonAncestorContainer"]);
    }
  }
  Object.defineProperties(Range.prototype, {
    setStart: { enumerable: true },
    setEnd: { enumerable: true },
    setStartBefore: { enumerable: true },
    setStartAfter: { enumerable: true },
    setEndBefore: { enumerable: true },
    setEndAfter: { enumerable: true },
    collapse: { enumerable: true },
    selectNode: { enumerable: true },
    selectNodeContents: { enumerable: true },
    compareBoundaryPoints: { enumerable: true },
    deleteContents: { enumerable: true },
    extractContents: { enumerable: true },
    cloneContents: { enumerable: true },
    insertNode: { enumerable: true },
    surroundContents: { enumerable: true },
    cloneRange: { enumerable: true },
    detach: { enumerable: true },
    isPointInRange: { enumerable: true },
    comparePoint: { enumerable: true },
    intersectsNode: { enumerable: true },
    toString: { enumerable: true },
    createContextualFragment: { enumerable: true },
    commonAncestorContainer: { enumerable: true },
    [Symbol.toStringTag]: { value: "Range", configurable: true },
    START_TO_START: { value: 0, enumerable: true },
    START_TO_END: { value: 1, enumerable: true },
    END_TO_END: { value: 2, enumerable: true },
    END_TO_START: { value: 3, enumerable: true }
  });
  Object.defineProperties(Range, {
    START_TO_START: { value: 0, enumerable: true },
    START_TO_END: { value: 1, enumerable: true },
    END_TO_END: { value: 2, enumerable: true },
    END_TO_START: { value: 3, enumerable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["Range"] = Range;

  Object.defineProperty(globalObject, "Range", {
    configurable: true,
    writable: true,
    value: Range
  });
};

const Impl = require("../range/Range-impl.js");
