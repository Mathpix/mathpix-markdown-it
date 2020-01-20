"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertAddEventListenerOptions = require("./AddEventListenerOptions.js").convert;
const convertEventListenerOptions = require("./EventListenerOptions.js").convert;
const convertEvent = require("./Event.js").convert;
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
  throw new TypeError(`${context} is not of type 'EventTarget'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["EventTarget"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor EventTarget is not installed on the passed global object");
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
  class EventTarget {
    constructor() {
      return exports.setup(Object.create(new.target.prototype), globalObject, undefined);
    }

    addEventListener(type, callback) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'addEventListener' on 'EventTarget': 2 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'addEventListener' on 'EventTarget': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg === null || curArg === undefined) {
          curArg = null;
        } else {
          curArg = utils.tryImplForWrapper(curArg);
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[2];
        if (curArg !== undefined) {
          if (curArg === null || curArg === undefined) {
            curArg = convertAddEventListenerOptions(curArg, {
              context: "Failed to execute 'addEventListener' on 'EventTarget': parameter 3"
            });
          } else if (utils.isObject(curArg)) {
            curArg = convertAddEventListenerOptions(curArg, {
              context: "Failed to execute 'addEventListener' on 'EventTarget': parameter 3" + " dictionary"
            });
          } else if (typeof curArg === "boolean") {
            curArg = conversions["boolean"](curArg, {
              context: "Failed to execute 'addEventListener' on 'EventTarget': parameter 3"
            });
          } else {
            curArg = conversions["boolean"](curArg, {
              context: "Failed to execute 'addEventListener' on 'EventTarget': parameter 3"
            });
          }
        }
        args.push(curArg);
      }
      return this[impl].addEventListener(...args);
    }

    removeEventListener(type, callback) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'removeEventListener' on 'EventTarget': 2 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'removeEventListener' on 'EventTarget': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg === null || curArg === undefined) {
          curArg = null;
        } else {
          curArg = utils.tryImplForWrapper(curArg);
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[2];
        if (curArg !== undefined) {
          if (curArg === null || curArg === undefined) {
            curArg = convertEventListenerOptions(curArg, {
              context: "Failed to execute 'removeEventListener' on 'EventTarget': parameter 3"
            });
          } else if (utils.isObject(curArg)) {
            curArg = convertEventListenerOptions(curArg, {
              context: "Failed to execute 'removeEventListener' on 'EventTarget': parameter 3" + " dictionary"
            });
          } else if (typeof curArg === "boolean") {
            curArg = conversions["boolean"](curArg, {
              context: "Failed to execute 'removeEventListener' on 'EventTarget': parameter 3"
            });
          } else {
            curArg = conversions["boolean"](curArg, {
              context: "Failed to execute 'removeEventListener' on 'EventTarget': parameter 3"
            });
          }
        }
        args.push(curArg);
      }
      return this[impl].removeEventListener(...args);
    }

    dispatchEvent(event) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'dispatchEvent' on 'EventTarget': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertEvent(curArg, { context: "Failed to execute 'dispatchEvent' on 'EventTarget': parameter 1" });
        args.push(curArg);
      }
      return this[impl].dispatchEvent(...args);
    }
  }
  Object.defineProperties(EventTarget.prototype, {
    addEventListener: { enumerable: true },
    removeEventListener: { enumerable: true },
    dispatchEvent: { enumerable: true },
    [Symbol.toStringTag]: { value: "EventTarget", configurable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["EventTarget"] = EventTarget;

  Object.defineProperty(globalObject, "EventTarget", {
    configurable: true,
    writable: true,
    value: EventTarget
  });
};

const Impl = require("../events/EventTarget-impl.js");
