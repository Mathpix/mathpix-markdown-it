"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertHTMLFormElement = require("./HTMLFormElement.js").convert;
const isBlob = require("./Blob.js").is;
const convertBlob = require("./Blob.js").convert;
const impl = utils.implSymbol;
const ctorRegistry = utils.ctorRegistrySymbol;

const IteratorPrototype = Object.create(utils.IteratorPrototype, {
  next: {
    value: function next() {
      const internal = this[utils.iterInternalSymbol];
      const { target, kind, index } = internal;
      const values = Array.from(target[impl]);
      const len = values.length;
      if (index >= len) {
        return { value: undefined, done: true };
      }

      const pair = values[index];
      internal.index = index + 1;
      const [key, value] = pair.map(utils.tryWrapperForImpl);

      let result;
      switch (kind) {
        case "key":
          result = key;
          break;
        case "value":
          result = value;
          break;
        case "key+value":
          result = [key, value];
          break;
      }
      return { value: result, done: false };
    },
    writable: true,
    enumerable: true,
    configurable: true
  },
  [Symbol.toStringTag]: {
    value: "FormData Iterator",
    configurable: true
  }
});

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
  throw new TypeError(`${context} is not of type 'FormData'.`);
};

exports.createDefaultIterator = function createDefaultIterator(target, kind) {
  const iterator = Object.create(IteratorPrototype);
  Object.defineProperty(iterator, utils.iterInternalSymbol, {
    value: { target, kind, index: 0 },
    configurable: true
  });
  return iterator;
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["FormData"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor FormData is not installed on the passed global object");
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
  class FormData {
    constructor() {
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          curArg = convertHTMLFormElement(curArg, { context: "Failed to construct 'FormData': parameter 1" });
        }
        args.push(curArg);
      }
      return exports.setup(Object.create(new.target.prototype), globalObject, args);
    }

    append(name, value) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'append' on 'FormData': 2 arguments required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      switch (arguments.length) {
        case 2:
          {
            let curArg = arguments[0];
            curArg = conversions["USVString"](curArg, {
              context: "Failed to execute 'append' on 'FormData': parameter 1"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[1];
            if (isBlob(curArg)) {
              {
                let curArg = arguments[1];
                curArg = convertBlob(curArg, { context: "Failed to execute 'append' on 'FormData': parameter 2" });
                args.push(curArg);
              }
            } else {
              {
                let curArg = arguments[1];
                curArg = conversions["USVString"](curArg, {
                  context: "Failed to execute 'append' on 'FormData': parameter 2"
                });
                args.push(curArg);
              }
            }
          }
          break;
        default:
          {
            let curArg = arguments[0];
            curArg = conversions["USVString"](curArg, {
              context: "Failed to execute 'append' on 'FormData': parameter 1"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[1];
            curArg = convertBlob(curArg, { context: "Failed to execute 'append' on 'FormData': parameter 2" });
            args.push(curArg);
          }
          {
            let curArg = arguments[2];
            if (curArg !== undefined) {
              curArg = conversions["USVString"](curArg, {
                context: "Failed to execute 'append' on 'FormData': parameter 3"
              });
            }
            args.push(curArg);
          }
      }
      return this[impl].append(...args);
    }

    delete(name) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'delete' on 'FormData': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, { context: "Failed to execute 'delete' on 'FormData': parameter 1" });
        args.push(curArg);
      }
      return this[impl].delete(...args);
    }

    get(name) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'get' on 'FormData': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, { context: "Failed to execute 'get' on 'FormData': parameter 1" });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].get(...args));
    }

    getAll(name) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'getAll' on 'FormData': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, { context: "Failed to execute 'getAll' on 'FormData': parameter 1" });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].getAll(...args));
    }

    has(name) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'has' on 'FormData': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, { context: "Failed to execute 'has' on 'FormData': parameter 1" });
        args.push(curArg);
      }
      return this[impl].has(...args);
    }

    set(name, value) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'set' on 'FormData': 2 arguments required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      switch (arguments.length) {
        case 2:
          {
            let curArg = arguments[0];
            curArg = conversions["USVString"](curArg, {
              context: "Failed to execute 'set' on 'FormData': parameter 1"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[1];
            if (isBlob(curArg)) {
              {
                let curArg = arguments[1];
                curArg = convertBlob(curArg, { context: "Failed to execute 'set' on 'FormData': parameter 2" });
                args.push(curArg);
              }
            } else {
              {
                let curArg = arguments[1];
                curArg = conversions["USVString"](curArg, {
                  context: "Failed to execute 'set' on 'FormData': parameter 2"
                });
                args.push(curArg);
              }
            }
          }
          break;
        default:
          {
            let curArg = arguments[0];
            curArg = conversions["USVString"](curArg, {
              context: "Failed to execute 'set' on 'FormData': parameter 1"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[1];
            curArg = convertBlob(curArg, { context: "Failed to execute 'set' on 'FormData': parameter 2" });
            args.push(curArg);
          }
          {
            let curArg = arguments[2];
            if (curArg !== undefined) {
              curArg = conversions["USVString"](curArg, {
                context: "Failed to execute 'set' on 'FormData': parameter 3"
              });
            }
            args.push(curArg);
          }
      }
      return this[impl].set(...args);
    }

    keys() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return exports.createDefaultIterator(this, "key");
    }

    values() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return exports.createDefaultIterator(this, "value");
    }

    entries() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return exports.createDefaultIterator(this, "key+value");
    }

    forEach(callback) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      if (arguments.length < 1) {
        throw new TypeError("Failed to execute 'forEach' on 'iterable': 1 argument required, " + "but only 0 present.");
      }
      if (typeof callback !== "function") {
        throw new TypeError(
          "Failed to execute 'forEach' on 'iterable': The callback provided " + "as parameter 1 is not a function."
        );
      }
      const thisArg = arguments[1];
      let pairs = Array.from(this[impl]);
      let i = 0;
      while (i < pairs.length) {
        const [key, value] = pairs[i].map(utils.tryWrapperForImpl);
        callback.call(thisArg, value, key, this);
        pairs = Array.from(this[impl]);
        i++;
      }
    }
  }
  Object.defineProperties(FormData.prototype, {
    append: { enumerable: true },
    delete: { enumerable: true },
    get: { enumerable: true },
    getAll: { enumerable: true },
    has: { enumerable: true },
    set: { enumerable: true },
    keys: { enumerable: true },
    values: { enumerable: true },
    entries: { enumerable: true },
    forEach: { enumerable: true },
    [Symbol.toStringTag]: { value: "FormData", configurable: true },
    [Symbol.iterator]: { value: FormData.prototype.entries, configurable: true, writable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["FormData"] = FormData;

  Object.defineProperty(globalObject, "FormData", {
    configurable: true,
    writable: true,
    value: FormData
  });
};

const Impl = require("../xhr/FormData-impl.js");
