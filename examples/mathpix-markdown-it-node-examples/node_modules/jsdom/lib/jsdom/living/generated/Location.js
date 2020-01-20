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
  throw new TypeError(`${context} is not of type 'Location'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["Location"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor Location is not installed on the passed global object");
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
  Object.defineProperties(
    obj,
    Object.getOwnPropertyDescriptors({
      assign(url) {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        if (arguments.length < 1) {
          throw new TypeError(
            "Failed to execute 'assign' on 'Location': 1 argument required, but only " + arguments.length + " present."
          );
        }
        const args = [];
        {
          let curArg = arguments[0];
          curArg = conversions["USVString"](curArg, {
            context: "Failed to execute 'assign' on 'Location': parameter 1"
          });
          args.push(curArg);
        }
        return this[impl].assign(...args);
      },
      replace(url) {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        if (arguments.length < 1) {
          throw new TypeError(
            "Failed to execute 'replace' on 'Location': 1 argument required, but only " + arguments.length + " present."
          );
        }
        const args = [];
        {
          let curArg = arguments[0];
          curArg = conversions["USVString"](curArg, {
            context: "Failed to execute 'replace' on 'Location': parameter 1"
          });
          args.push(curArg);
        }
        return this[impl].replace(...args);
      },
      reload() {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        return this[impl].reload();
      },
      get href() {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        return obj[impl]["href"];
      },
      set href(V) {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        V = conversions["USVString"](V, {
          context: "Failed to set the 'href' property on 'Location': The provided value"
        });

        obj[impl]["href"] = V;
      },
      toString() {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }
        return obj[impl]["href"];
      },
      get origin() {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        return obj[impl]["origin"];
      },
      get protocol() {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        return obj[impl]["protocol"];
      },
      set protocol(V) {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        V = conversions["USVString"](V, {
          context: "Failed to set the 'protocol' property on 'Location': The provided value"
        });

        obj[impl]["protocol"] = V;
      },
      get host() {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        return obj[impl]["host"];
      },
      set host(V) {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        V = conversions["USVString"](V, {
          context: "Failed to set the 'host' property on 'Location': The provided value"
        });

        obj[impl]["host"] = V;
      },
      get hostname() {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        return obj[impl]["hostname"];
      },
      set hostname(V) {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        V = conversions["USVString"](V, {
          context: "Failed to set the 'hostname' property on 'Location': The provided value"
        });

        obj[impl]["hostname"] = V;
      },
      get port() {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        return obj[impl]["port"];
      },
      set port(V) {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        V = conversions["USVString"](V, {
          context: "Failed to set the 'port' property on 'Location': The provided value"
        });

        obj[impl]["port"] = V;
      },
      get pathname() {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        return obj[impl]["pathname"];
      },
      set pathname(V) {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        V = conversions["USVString"](V, {
          context: "Failed to set the 'pathname' property on 'Location': The provided value"
        });

        obj[impl]["pathname"] = V;
      },
      get search() {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        return obj[impl]["search"];
      },
      set search(V) {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        V = conversions["USVString"](V, {
          context: "Failed to set the 'search' property on 'Location': The provided value"
        });

        obj[impl]["search"] = V;
      },
      get hash() {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        return obj[impl]["hash"];
      },
      set hash(V) {
        if (!this || !exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }

        V = conversions["USVString"](V, {
          context: "Failed to set the 'hash' property on 'Location': The provided value"
        });

        obj[impl]["hash"] = V;
      }
    })
  );

  Object.defineProperties(obj, {
    assign: { configurable: false, writable: false },
    replace: { configurable: false, writable: false },
    reload: { configurable: false, writable: false },
    href: { configurable: false },
    toString: { configurable: false, writable: false },
    origin: { configurable: false },
    protocol: { configurable: false },
    host: { configurable: false },
    hostname: { configurable: false },
    port: { configurable: false },
    pathname: { configurable: false },
    search: { configurable: false },
    hash: { configurable: false }
  });
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
  class Location {
    constructor() {
      throw new TypeError("Illegal constructor");
    }
  }
  Object.defineProperties(Location.prototype, { [Symbol.toStringTag]: { value: "Location", configurable: true } });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["Location"] = Location;

  Object.defineProperty(globalObject, "Location", {
    configurable: true,
    writable: true,
    value: Location
  });
};

const Impl = require("../window/Location-impl.js");
