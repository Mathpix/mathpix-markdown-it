"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertBlob = require("./Blob.js").convert;
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
  throw new TypeError(`${context} is not of type 'FileReader'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["FileReader"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor FileReader is not installed on the passed global object");
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
    throw new Error("Internal error: attempting to evaluate FileReader before EventTarget");
  }
  class FileReader extends globalObject.EventTarget {
    constructor() {
      return exports.setup(Object.create(new.target.prototype), globalObject, undefined);
    }

    readAsArrayBuffer(blob) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'readAsArrayBuffer' on 'FileReader': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertBlob(curArg, { context: "Failed to execute 'readAsArrayBuffer' on 'FileReader': parameter 1" });
        args.push(curArg);
      }
      return this[impl].readAsArrayBuffer(...args);
    }

    readAsBinaryString(blob) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'readAsBinaryString' on 'FileReader': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertBlob(curArg, {
          context: "Failed to execute 'readAsBinaryString' on 'FileReader': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].readAsBinaryString(...args);
    }

    readAsText(blob) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'readAsText' on 'FileReader': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertBlob(curArg, { context: "Failed to execute 'readAsText' on 'FileReader': parameter 1" });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg !== undefined) {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'readAsText' on 'FileReader': parameter 2"
          });
        }
        args.push(curArg);
      }
      return this[impl].readAsText(...args);
    }

    readAsDataURL(blob) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'readAsDataURL' on 'FileReader': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertBlob(curArg, { context: "Failed to execute 'readAsDataURL' on 'FileReader': parameter 1" });
        args.push(curArg);
      }
      return this[impl].readAsDataURL(...args);
    }

    abort() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].abort();
    }

    get readyState() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["readyState"];
    }

    get result() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["result"]);
    }

    get error() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["error"]);
    }

    get onloadstart() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["onloadstart"]);
    }

    set onloadstart(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = utils.tryImplForWrapper(V);

      this[impl]["onloadstart"] = V;
    }

    get onprogress() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["onprogress"]);
    }

    set onprogress(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = utils.tryImplForWrapper(V);

      this[impl]["onprogress"] = V;
    }

    get onload() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["onload"]);
    }

    set onload(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = utils.tryImplForWrapper(V);

      this[impl]["onload"] = V;
    }

    get onabort() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["onabort"]);
    }

    set onabort(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = utils.tryImplForWrapper(V);

      this[impl]["onabort"] = V;
    }

    get onerror() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["onerror"]);
    }

    set onerror(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = utils.tryImplForWrapper(V);

      this[impl]["onerror"] = V;
    }

    get onloadend() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["onloadend"]);
    }

    set onloadend(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = utils.tryImplForWrapper(V);

      this[impl]["onloadend"] = V;
    }
  }
  Object.defineProperties(FileReader.prototype, {
    readAsArrayBuffer: { enumerable: true },
    readAsBinaryString: { enumerable: true },
    readAsText: { enumerable: true },
    readAsDataURL: { enumerable: true },
    abort: { enumerable: true },
    readyState: { enumerable: true },
    result: { enumerable: true },
    error: { enumerable: true },
    onloadstart: { enumerable: true },
    onprogress: { enumerable: true },
    onload: { enumerable: true },
    onabort: { enumerable: true },
    onerror: { enumerable: true },
    onloadend: { enumerable: true },
    [Symbol.toStringTag]: { value: "FileReader", configurable: true },
    EMPTY: { value: 0, enumerable: true },
    LOADING: { value: 1, enumerable: true },
    DONE: { value: 2, enumerable: true }
  });
  Object.defineProperties(FileReader, {
    EMPTY: { value: 0, enumerable: true },
    LOADING: { value: 1, enumerable: true },
    DONE: { value: 2, enumerable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["FileReader"] = FileReader;

  Object.defineProperty(globalObject, "FileReader", {
    configurable: true,
    writable: true,
    value: FileReader
  });
};

const Impl = require("../file-api/FileReader-impl.js");
