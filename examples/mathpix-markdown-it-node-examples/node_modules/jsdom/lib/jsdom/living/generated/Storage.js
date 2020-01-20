"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

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
  throw new TypeError(`${context} is not of type 'Storage'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["Storage"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor Storage is not installed on the passed global object");
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

  obj = new Proxy(obj, {
    get(target, P, receiver) {
      if (typeof P === "symbol") {
        return Reflect.get(target, P, receiver);
      }
      const desc = this.getOwnPropertyDescriptor(target, P);
      if (desc === undefined) {
        const parent = Object.getPrototypeOf(target);
        if (parent === null) {
          return undefined;
        }
        return Reflect.get(target, P, receiver);
      }
      if (!desc.get && !desc.set) {
        return desc.value;
      }
      const getter = desc.get;
      if (getter === undefined) {
        return undefined;
      }
      return Reflect.apply(getter, receiver, []);
    },

    has(target, P) {
      if (typeof P === "symbol") {
        return Reflect.has(target, P);
      }
      const desc = this.getOwnPropertyDescriptor(target, P);
      if (desc !== undefined) {
        return true;
      }
      const parent = Object.getPrototypeOf(target);
      if (parent !== null) {
        return Reflect.has(parent, P);
      }
      return false;
    },

    ownKeys(target) {
      const keys = new Set();

      for (const key of target[impl][utils.supportedPropertyNames]) {
        if (!(key in target)) {
          keys.add(`${key}`);
        }
      }

      for (const key of Reflect.ownKeys(target)) {
        keys.add(key);
      }
      return [...keys];
    },

    getOwnPropertyDescriptor(target, P) {
      if (typeof P === "symbol") {
        return Reflect.getOwnPropertyDescriptor(target, P);
      }
      let ignoreNamedProps = false;

      const namedValue = target[impl].getItem(P);

      if (namedValue !== null && !(P in target) && !ignoreNamedProps) {
        return {
          writable: true,
          enumerable: true,
          configurable: true,
          value: utils.tryWrapperForImpl(namedValue)
        };
      }

      return Reflect.getOwnPropertyDescriptor(target, P);
    },

    set(target, P, V, receiver) {
      if (typeof P === "symbol") {
        return Reflect.set(target, P, V, receiver);
      }
      if (target === receiver) {
        if (typeof P === "string" && !utils.isArrayIndexPropName(P)) {
          let namedValue = V;

          namedValue = conversions["DOMString"](namedValue, {
            context: "Failed to set the '" + P + "' property on 'Storage': The provided value"
          });

          target[impl].setItem(P, namedValue);

          return true;
        }
      }
      let ownDesc;

      if (ownDesc === undefined) {
        ownDesc = Reflect.getOwnPropertyDescriptor(target, P);
      }
      if (ownDesc === undefined) {
        const parent = Reflect.getPrototypeOf(target);
        if (parent !== null) {
          return Reflect.set(parent, P, V, receiver);
        }
        ownDesc = { writable: true, enumerable: true, configurable: true, value: undefined };
      }
      if (!ownDesc.writable) {
        return false;
      }
      if (!utils.isObject(receiver)) {
        return false;
      }
      const existingDesc = Reflect.getOwnPropertyDescriptor(receiver, P);
      let valueDesc;
      if (existingDesc !== undefined) {
        if (existingDesc.get || existingDesc.set) {
          return false;
        }
        if (!existingDesc.writable) {
          return false;
        }
        valueDesc = { value: V };
      } else {
        valueDesc = { writable: true, enumerable: true, configurable: true, value: V };
      }
      return Reflect.defineProperty(receiver, P, valueDesc);
    },

    defineProperty(target, P, desc) {
      if (typeof P === "symbol") {
        return Reflect.defineProperty(target, P, desc);
      }
      if (!utils.hasOwn(target, P)) {
        if (desc.get || desc.set) {
          return false;
        }

        let namedValue = desc.value;

        namedValue = conversions["DOMString"](namedValue, {
          context: "Failed to set the '" + P + "' property on 'Storage': The provided value"
        });

        target[impl].setItem(P, namedValue);

        return true;
      }
      return Reflect.defineProperty(target, P, desc);
    },

    deleteProperty(target, P) {
      if (typeof P === "symbol") {
        return Reflect.deleteProperty(target, P);
      }

      if (target[impl].getItem(P) !== null && !(P in target)) {
        target[impl].removeItem(P);
        return true;
      }

      return Reflect.deleteProperty(target, P);
    },

    preventExtensions() {
      return false;
    }
  });

  obj[impl][utils.wrapperSymbol] = obj;
  if (Impl.init) {
    Impl.init(obj[impl], privateData);
  }
  return obj;
};

exports.install = function install(globalObject) {
  class Storage {
    constructor() {
      throw new TypeError("Illegal constructor");
    }

    key(index) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'key' on 'Storage': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["unsigned long"](curArg, { context: "Failed to execute 'key' on 'Storage': parameter 1" });
        args.push(curArg);
      }
      return this[impl].key(...args);
    }

    getItem(key) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'getItem' on 'Storage': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, { context: "Failed to execute 'getItem' on 'Storage': parameter 1" });
        args.push(curArg);
      }
      return this[impl].getItem(...args);
    }

    setItem(key, value) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'setItem' on 'Storage': 2 arguments required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, { context: "Failed to execute 'setItem' on 'Storage': parameter 1" });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["DOMString"](curArg, { context: "Failed to execute 'setItem' on 'Storage': parameter 2" });
        args.push(curArg);
      }
      return this[impl].setItem(...args);
    }

    removeItem(key) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'removeItem' on 'Storage': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'removeItem' on 'Storage': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].removeItem(...args);
    }

    clear() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].clear();
    }

    get length() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["length"];
    }
  }
  Object.defineProperties(Storage.prototype, {
    key: { enumerable: true },
    getItem: { enumerable: true },
    setItem: { enumerable: true },
    removeItem: { enumerable: true },
    clear: { enumerable: true },
    length: { enumerable: true },
    [Symbol.toStringTag]: { value: "Storage", configurable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["Storage"] = Storage;

  Object.defineProperty(globalObject, "Storage", {
    configurable: true,
    writable: true,
    value: Storage
  });
};

const Impl = require("../webstorage/Storage-impl.js");
