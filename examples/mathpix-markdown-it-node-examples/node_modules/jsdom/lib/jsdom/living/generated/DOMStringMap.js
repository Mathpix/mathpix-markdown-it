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
  throw new TypeError(`${context} is not of type 'DOMStringMap'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["DOMStringMap"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor DOMStringMap is not installed on the passed global object");
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
        if (!utils.hasOwn(target, key)) {
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

      const namedValue = target[impl][utils.namedGet](P);

      if (namedValue !== undefined && !utils.hasOwn(target, P) && !ignoreNamedProps) {
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
            context: "Failed to set the '" + P + "' property on 'DOMStringMap': The provided value"
          });

          const creating = !(target[impl][utils.namedGet](P) !== undefined);
          if (creating) {
            target[impl][utils.namedSetNew](P, namedValue);
          } else {
            target[impl][utils.namedSetExisting](P, namedValue);
          }

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

      if (desc.get || desc.set) {
        return false;
      }

      let namedValue = desc.value;

      namedValue = conversions["DOMString"](namedValue, {
        context: "Failed to set the '" + P + "' property on 'DOMStringMap': The provided value"
      });

      const creating = !(target[impl][utils.namedGet](P) !== undefined);
      if (creating) {
        target[impl][utils.namedSetNew](P, namedValue);
      } else {
        target[impl][utils.namedSetExisting](P, namedValue);
      }

      return true;
    },

    deleteProperty(target, P) {
      if (typeof P === "symbol") {
        return Reflect.deleteProperty(target, P);
      }

      if (target[impl][utils.namedGet](P) !== undefined && !utils.hasOwn(target, P)) {
        target[impl][utils.namedDelete](P);
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
  class DOMStringMap {
    constructor() {
      throw new TypeError("Illegal constructor");
    }
  }
  Object.defineProperties(DOMStringMap.prototype, {
    [Symbol.toStringTag]: { value: "DOMStringMap", configurable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["DOMStringMap"] = DOMStringMap;

  Object.defineProperty(globalObject, "DOMStringMap", {
    configurable: true,
    writable: true,
    value: DOMStringMap
  });
};

const Impl = require("../nodes/DOMStringMap-impl.js");
