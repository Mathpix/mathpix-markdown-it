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
  throw new TypeError(`${context} is not of type 'HTMLObjectElement'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["HTMLObjectElement"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor HTMLObjectElement is not installed on the passed global object");
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
    throw new Error("Internal error: attempting to evaluate HTMLObjectElement before HTMLElement");
  }
  class HTMLObjectElement extends globalObject.HTMLElement {
    constructor() {
      throw new TypeError("Illegal constructor");
    }

    checkValidity() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].checkValidity();
    }

    reportValidity() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].reportValidity();
    }

    setCustomValidity(error) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'setCustomValidity' on 'HTMLObjectElement': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'setCustomValidity' on 'HTMLObjectElement': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].setCustomValidity(...args);
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

      V = conversions["USVString"](V, {
        context: "Failed to set the 'data' property on 'HTMLObjectElement': The provided value"
      });

      this[impl]["data"] = V;
    }

    get type() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "type");
      return value === null ? "" : value;
    }

    set type(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'type' property on 'HTMLObjectElement': The provided value"
      });

      this[impl].setAttributeNS(null, "type", V);
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
        context: "Failed to set the 'name' property on 'HTMLObjectElement': The provided value"
      });

      this[impl].setAttributeNS(null, "name", V);
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
        context: "Failed to set the 'useMap' property on 'HTMLObjectElement': The provided value"
      });

      this[impl].setAttributeNS(null, "usemap", V);
    }

    get form() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["form"]);
    }

    get width() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "width");
      return value === null ? "" : value;
    }

    set width(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'width' property on 'HTMLObjectElement': The provided value"
      });

      this[impl].setAttributeNS(null, "width", V);
    }

    get height() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "height");
      return value === null ? "" : value;
    }

    set height(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'height' property on 'HTMLObjectElement': The provided value"
      });

      this[impl].setAttributeNS(null, "height", V);
    }

    get contentDocument() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["contentDocument"]);
    }

    get willValidate() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["willValidate"];
    }

    get validity() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["validity"]);
    }

    get validationMessage() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["validationMessage"];
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
        context: "Failed to set the 'align' property on 'HTMLObjectElement': The provided value"
      });

      this[impl].setAttributeNS(null, "align", V);
    }

    get archive() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "archive");
      return value === null ? "" : value;
    }

    set archive(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'archive' property on 'HTMLObjectElement': The provided value"
      });

      this[impl].setAttributeNS(null, "archive", V);
    }

    get code() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "code");
      return value === null ? "" : value;
    }

    set code(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'code' property on 'HTMLObjectElement': The provided value"
      });

      this[impl].setAttributeNS(null, "code", V);
    }

    get declare() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasAttributeNS(null, "declare");
    }

    set declare(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'declare' property on 'HTMLObjectElement': The provided value"
      });

      if (V) {
        this[impl].setAttributeNS(null, "declare", "");
      } else {
        this[impl].removeAttributeNS(null, "declare");
      }
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
        context: "Failed to set the 'hspace' property on 'HTMLObjectElement': The provided value"
      });

      this[impl].setAttributeNS(null, "hspace", String(V > 2147483647 ? 0 : V));
    }

    get standby() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "standby");
      return value === null ? "" : value;
    }

    set standby(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'standby' property on 'HTMLObjectElement': The provided value"
      });

      this[impl].setAttributeNS(null, "standby", V);
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
        context: "Failed to set the 'vspace' property on 'HTMLObjectElement': The provided value"
      });

      this[impl].setAttributeNS(null, "vspace", String(V > 2147483647 ? 0 : V));
    }

    get codeBase() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["codeBase"];
    }

    set codeBase(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'codeBase' property on 'HTMLObjectElement': The provided value"
      });

      this[impl]["codeBase"] = V;
    }

    get codeType() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "codetype");
      return value === null ? "" : value;
    }

    set codeType(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'codeType' property on 'HTMLObjectElement': The provided value"
      });

      this[impl].setAttributeNS(null, "codetype", V);
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
        context: "Failed to set the 'border' property on 'HTMLObjectElement': The provided value",
        treatNullAsEmptyString: true
      });

      this[impl].setAttributeNS(null, "border", V);
    }
  }
  Object.defineProperties(HTMLObjectElement.prototype, {
    checkValidity: { enumerable: true },
    reportValidity: { enumerable: true },
    setCustomValidity: { enumerable: true },
    data: { enumerable: true },
    type: { enumerable: true },
    name: { enumerable: true },
    useMap: { enumerable: true },
    form: { enumerable: true },
    width: { enumerable: true },
    height: { enumerable: true },
    contentDocument: { enumerable: true },
    willValidate: { enumerable: true },
    validity: { enumerable: true },
    validationMessage: { enumerable: true },
    align: { enumerable: true },
    archive: { enumerable: true },
    code: { enumerable: true },
    declare: { enumerable: true },
    hspace: { enumerable: true },
    standby: { enumerable: true },
    vspace: { enumerable: true },
    codeBase: { enumerable: true },
    codeType: { enumerable: true },
    border: { enumerable: true },
    [Symbol.toStringTag]: { value: "HTMLObjectElement", configurable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["HTMLObjectElement"] = HTMLObjectElement;

  Object.defineProperty(globalObject, "HTMLObjectElement", {
    configurable: true,
    writable: true,
    value: HTMLObjectElement
  });
};

const Impl = require("../nodes/HTMLObjectElement-impl.js");
