"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertBlobPropertyBag = require("./BlobPropertyBag.js").convert;
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
  throw new TypeError(`${context} is not of type 'Blob'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["Blob"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor Blob is not installed on the passed global object");
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
  class Blob {
    constructor() {
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          if (!utils.isObject(curArg)) {
            throw new TypeError("Failed to construct 'Blob': parameter 1" + " is not an iterable object.");
          } else {
            const V = [];
            const tmp = curArg;
            for (let nextItem of tmp) {
              if (module.exports.is(nextItem)) {
                nextItem = utils.implForWrapper(nextItem);
              } else if (utils.isArrayBuffer(nextItem)) {
              } else if (ArrayBuffer.isView(nextItem)) {
              } else {
                nextItem = conversions["USVString"](nextItem, {
                  context: "Failed to construct 'Blob': parameter 1" + "'s element"
                });
              }
              V.push(nextItem);
            }
            curArg = V;
          }
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = convertBlobPropertyBag(curArg, { context: "Failed to construct 'Blob': parameter 2" });
        args.push(curArg);
      }
      return exports.setup(Object.create(new.target.prototype), globalObject, args);
    }

    slice() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          curArg = conversions["long long"](curArg, {
            context: "Failed to execute 'slice' on 'Blob': parameter 1",
            clamp: true
          });
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg !== undefined) {
          curArg = conversions["long long"](curArg, {
            context: "Failed to execute 'slice' on 'Blob': parameter 2",
            clamp: true
          });
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[2];
        if (curArg !== undefined) {
          curArg = conversions["DOMString"](curArg, { context: "Failed to execute 'slice' on 'Blob': parameter 3" });
        }
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].slice(...args));
    }

    get size() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["size"];
    }

    get type() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["type"];
    }
  }
  Object.defineProperties(Blob.prototype, {
    slice: { enumerable: true },
    size: { enumerable: true },
    type: { enumerable: true },
    [Symbol.toStringTag]: { value: "Blob", configurable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["Blob"] = Blob;

  Object.defineProperty(globalObject, "Blob", {
    configurable: true,
    writable: true,
    value: Blob
  });
};

const Impl = require("../file-api/Blob-impl.js");
