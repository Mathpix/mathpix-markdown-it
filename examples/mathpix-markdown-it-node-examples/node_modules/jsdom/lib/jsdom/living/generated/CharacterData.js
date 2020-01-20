"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

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
  throw new TypeError(`${context} is not of type 'CharacterData'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["CharacterData"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor CharacterData is not installed on the passed global object");
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
    throw new Error("Internal error: attempting to evaluate CharacterData before Node");
  }
  class CharacterData extends globalObject.Node {
    constructor() {
      throw new TypeError("Illegal constructor");
    }

    substringData(offset, count) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'substringData' on 'CharacterData': 2 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'substringData' on 'CharacterData': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'substringData' on 'CharacterData': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].substringData(...args);
    }

    appendData(data) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'appendData' on 'CharacterData': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'appendData' on 'CharacterData': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].appendData(...args);
    }

    insertData(offset, data) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'insertData' on 'CharacterData': 2 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'insertData' on 'CharacterData': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'insertData' on 'CharacterData': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].insertData(...args);
    }

    deleteData(offset, count) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'deleteData' on 'CharacterData': 2 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'deleteData' on 'CharacterData': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'deleteData' on 'CharacterData': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].deleteData(...args);
    }

    replaceData(offset, count, data) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 3) {
        throw new TypeError(
          "Failed to execute 'replaceData' on 'CharacterData': 3 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'replaceData' on 'CharacterData': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'replaceData' on 'CharacterData': parameter 2"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[2];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'replaceData' on 'CharacterData': parameter 3"
        });
        args.push(curArg);
      }
      return this[impl].replaceData(...args);
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
            context: "Failed to execute 'before' on 'CharacterData': parameter " + (i + 1)
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
            context: "Failed to execute 'after' on 'CharacterData': parameter " + (i + 1)
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
            context: "Failed to execute 'replaceWith' on 'CharacterData': parameter " + (i + 1)
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

    get data() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["data"];
    }

    set data(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'data' property on 'CharacterData': The provided value",
        treatNullAsEmptyString: true
      });

      this[impl]["data"] = V;
    }

    get length() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["length"];
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
  }
  Object.defineProperties(CharacterData.prototype, {
    substringData: { enumerable: true },
    appendData: { enumerable: true },
    insertData: { enumerable: true },
    deleteData: { enumerable: true },
    replaceData: { enumerable: true },
    before: { enumerable: true },
    after: { enumerable: true },
    replaceWith: { enumerable: true },
    remove: { enumerable: true },
    data: { enumerable: true },
    length: { enumerable: true },
    previousElementSibling: { enumerable: true },
    nextElementSibling: { enumerable: true },
    [Symbol.toStringTag]: { value: "CharacterData", configurable: true },
    [Symbol.unscopables]: {
      value: { before: true, after: true, replaceWith: true, remove: true, __proto__: null },
      configurable: true
    }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["CharacterData"] = CharacterData;

  Object.defineProperty(globalObject, "CharacterData", {
    configurable: true,
    writable: true,
    value: CharacterData
  });
};

const Impl = require("../nodes/CharacterData-impl.js");
