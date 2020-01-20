"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const isBlob = require("./Blob.js").is;
const convertFilePropertyBag = require("./FilePropertyBag.js").convert;
const impl = utils.implSymbol;
const ctorRegistry = utils.ctorRegistrySymbol;
const Blob = require("./Blob.js");

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
  throw new TypeError(`${context} is not of type 'File'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["File"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor File is not installed on the passed global object");
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
  Blob._internalSetup(obj);
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
  if (globalObject.Blob === undefined) {
    throw new Error("Internal error: attempting to evaluate File before Blob");
  }
  class File extends globalObject.Blob {
    constructor(fileBits, fileName) {
      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to construct 'File': 2 arguments required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (!utils.isObject(curArg)) {
          throw new TypeError("Failed to construct 'File': parameter 1" + " is not an iterable object.");
        } else {
          const V = [];
          const tmp = curArg;
          for (let nextItem of tmp) {
            if (isBlob(nextItem)) {
              nextItem = utils.implForWrapper(nextItem);
            } else if (utils.isArrayBuffer(nextItem)) {
            } else if (ArrayBuffer.isView(nextItem)) {
            } else {
              nextItem = conversions["USVString"](nextItem, {
                context: "Failed to construct 'File': parameter 1" + "'s element"
              });
            }
            V.push(nextItem);
          }
          curArg = V;
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["USVString"](curArg, { context: "Failed to construct 'File': parameter 2" });
        args.push(curArg);
      }
      {
        let curArg = arguments[2];
        curArg = convertFilePropertyBag(curArg, { context: "Failed to construct 'File': parameter 3" });
        args.push(curArg);
      }
      return exports.setup(Object.create(new.target.prototype), globalObject, args);
    }

    get name() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["name"];
    }

    get lastModified() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["lastModified"];
    }
  }
  Object.defineProperties(File.prototype, {
    name: { enumerable: true },
    lastModified: { enumerable: true },
    [Symbol.toStringTag]: { value: "File", configurable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["File"] = File;

  Object.defineProperty(globalObject, "File", {
    configurable: true,
    writable: true,
    value: File
  });
};

const Impl = require("../file-api/File-impl.js");
