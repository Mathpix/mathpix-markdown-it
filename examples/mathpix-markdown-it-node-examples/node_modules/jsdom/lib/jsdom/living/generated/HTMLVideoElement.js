"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const impl = utils.implSymbol;
const ctorRegistry = utils.ctorRegistrySymbol;
const HTMLMediaElement = require("./HTMLMediaElement.js");

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
  throw new TypeError(`${context} is not of type 'HTMLVideoElement'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["HTMLVideoElement"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor HTMLVideoElement is not installed on the passed global object");
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
  HTMLMediaElement._internalSetup(obj);
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
  if (globalObject.HTMLMediaElement === undefined) {
    throw new Error("Internal error: attempting to evaluate HTMLVideoElement before HTMLMediaElement");
  }
  class HTMLVideoElement extends globalObject.HTMLMediaElement {
    constructor() {
      throw new TypeError("Illegal constructor");
    }

    get width() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = parseInt(this[impl].getAttributeNS(null, "width"));
      return isNaN(value) || value < 0 || value > 2147483647 ? 0 : value;
    }

    set width(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["unsigned long"](V, {
        context: "Failed to set the 'width' property on 'HTMLVideoElement': The provided value"
      });

      this[impl].setAttributeNS(null, "width", String(V > 2147483647 ? 0 : V));
    }

    get height() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = parseInt(this[impl].getAttributeNS(null, "height"));
      return isNaN(value) || value < 0 || value > 2147483647 ? 0 : value;
    }

    set height(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["unsigned long"](V, {
        context: "Failed to set the 'height' property on 'HTMLVideoElement': The provided value"
      });

      this[impl].setAttributeNS(null, "height", String(V > 2147483647 ? 0 : V));
    }

    get videoWidth() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["videoWidth"];
    }

    get videoHeight() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["videoHeight"];
    }

    get poster() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["poster"];
    }

    set poster(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'poster' property on 'HTMLVideoElement': The provided value"
      });

      this[impl]["poster"] = V;
    }

    get playsInline() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasAttributeNS(null, "playsinline");
    }

    set playsInline(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'playsInline' property on 'HTMLVideoElement': The provided value"
      });

      if (V) {
        this[impl].setAttributeNS(null, "playsinline", "");
      } else {
        this[impl].removeAttributeNS(null, "playsinline");
      }
    }
  }
  Object.defineProperties(HTMLVideoElement.prototype, {
    width: { enumerable: true },
    height: { enumerable: true },
    videoWidth: { enumerable: true },
    videoHeight: { enumerable: true },
    poster: { enumerable: true },
    playsInline: { enumerable: true },
    [Symbol.toStringTag]: { value: "HTMLVideoElement", configurable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["HTMLVideoElement"] = HTMLVideoElement;

  Object.defineProperty(globalObject, "HTMLVideoElement", {
    configurable: true,
    writable: true,
    value: HTMLVideoElement
  });
};

const Impl = require("../nodes/HTMLVideoElement-impl.js");
