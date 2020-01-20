"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const impl = utils.implSymbol;
const ctorRegistry = utils.ctorRegistrySymbol;
const HTMLElement = require("./HTMLElement.js");

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
  throw new TypeError(`${context} is not of type 'HTMLImageElement'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["HTMLImageElement"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor HTMLImageElement is not installed on the passed global object");
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
  HTMLElement._internalSetup(obj);
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
  if (globalObject.HTMLElement === undefined) {
    throw new Error("Internal error: attempting to evaluate HTMLImageElement before HTMLElement");
  }
  class HTMLImageElement extends globalObject.HTMLElement {
    constructor() {
      throw new TypeError("Illegal constructor");
    }

    get alt() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "alt");
      return value === null ? "" : value;
    }

    set alt(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'alt' property on 'HTMLImageElement': The provided value"
      });

      this[impl].setAttributeNS(null, "alt", V);
    }

    get src() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["src"];
    }

    set src(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'src' property on 'HTMLImageElement': The provided value"
      });

      this[impl]["src"] = V;
    }

    get srcset() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["srcset"];
    }

    set srcset(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'srcset' property on 'HTMLImageElement': The provided value"
      });

      this[impl]["srcset"] = V;
    }

    get sizes() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "sizes");
      return value === null ? "" : value;
    }

    set sizes(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'sizes' property on 'HTMLImageElement': The provided value"
      });

      this[impl].setAttributeNS(null, "sizes", V);
    }

    get crossOrigin() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "crossorigin");
      return value === null ? "" : value;
    }

    set crossOrigin(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (V === null || V === undefined) {
        V = null;
      } else {
        V = conversions["DOMString"](V, {
          context: "Failed to set the 'crossOrigin' property on 'HTMLImageElement': The provided value"
        });
      }
      this[impl].setAttributeNS(null, "crossorigin", V);
    }

    get useMap() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "usemap");
      return value === null ? "" : value;
    }

    set useMap(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'useMap' property on 'HTMLImageElement': The provided value"
      });

      this[impl].setAttributeNS(null, "usemap", V);
    }

    get isMap() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasAttributeNS(null, "ismap");
    }

    set isMap(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'isMap' property on 'HTMLImageElement': The provided value"
      });

      if (V) {
        this[impl].setAttributeNS(null, "ismap", "");
      } else {
        this[impl].removeAttributeNS(null, "ismap");
      }
    }

    get width() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["width"];
    }

    set width(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["unsigned long"](V, {
        context: "Failed to set the 'width' property on 'HTMLImageElement': The provided value"
      });

      this[impl]["width"] = V;
    }

    get height() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["height"];
    }

    set height(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["unsigned long"](V, {
        context: "Failed to set the 'height' property on 'HTMLImageElement': The provided value"
      });

      this[impl]["height"] = V;
    }

    get naturalWidth() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["naturalWidth"];
    }

    get naturalHeight() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["naturalHeight"];
    }

    get complete() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["complete"];
    }

    get currentSrc() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["currentSrc"];
    }

    get name() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "name");
      return value === null ? "" : value;
    }

    set name(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'name' property on 'HTMLImageElement': The provided value"
      });

      this[impl].setAttributeNS(null, "name", V);
    }

    get lowsrc() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["lowsrc"];
    }

    set lowsrc(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'lowsrc' property on 'HTMLImageElement': The provided value"
      });

      this[impl]["lowsrc"] = V;
    }

    get align() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "align");
      return value === null ? "" : value;
    }

    set align(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'align' property on 'HTMLImageElement': The provided value"
      });

      this[impl].setAttributeNS(null, "align", V);
    }

    get hspace() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = parseInt(this[impl].getAttributeNS(null, "hspace"));
      return isNaN(value) || value < 0 || value > 2147483647 ? 0 : value;
    }

    set hspace(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["unsigned long"](V, {
        context: "Failed to set the 'hspace' property on 'HTMLImageElement': The provided value"
      });

      this[impl].setAttributeNS(null, "hspace", String(V > 2147483647 ? 0 : V));
    }

    get vspace() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = parseInt(this[impl].getAttributeNS(null, "vspace"));
      return isNaN(value) || value < 0 || value > 2147483647 ? 0 : value;
    }

    set vspace(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["unsigned long"](V, {
        context: "Failed to set the 'vspace' property on 'HTMLImageElement': The provided value"
      });

      this[impl].setAttributeNS(null, "vspace", String(V > 2147483647 ? 0 : V));
    }

    get longDesc() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["longDesc"];
    }

    set longDesc(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'longDesc' property on 'HTMLImageElement': The provided value"
      });

      this[impl]["longDesc"] = V;
    }

    get border() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "border");
      return value === null ? "" : value;
    }

    set border(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'border' property on 'HTMLImageElement': The provided value",
        treatNullAsEmptyString: true
      });

      this[impl].setAttributeNS(null, "border", V);
    }
  }
  Object.defineProperties(HTMLImageElement.prototype, {
    alt: { enumerable: true },
    src: { enumerable: true },
    srcset: { enumerable: true },
    sizes: { enumerable: true },
    crossOrigin: { enumerable: true },
    useMap: { enumerable: true },
    isMap: { enumerable: true },
    width: { enumerable: true },
    height: { enumerable: true },
    naturalWidth: { enumerable: true },
    naturalHeight: { enumerable: true },
    complete: { enumerable: true },
    currentSrc: { enumerable: true },
    name: { enumerable: true },
    lowsrc: { enumerable: true },
    align: { enumerable: true },
    hspace: { enumerable: true },
    vspace: { enumerable: true },
    longDesc: { enumerable: true },
    border: { enumerable: true },
    [Symbol.toStringTag]: { value: "HTMLImageElement", configurable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["HTMLImageElement"] = HTMLImageElement;

  Object.defineProperty(globalObject, "HTMLImageElement", {
    configurable: true,
    writable: true,
    value: HTMLImageElement
  });
};

const Impl = require("../nodes/HTMLImageElement-impl.js");
