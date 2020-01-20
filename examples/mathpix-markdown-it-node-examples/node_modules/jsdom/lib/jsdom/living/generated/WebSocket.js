"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const isBlob = require("./Blob.js").is;
const convertBlob = require("./Blob.js").convert;
const BinaryType = require("./BinaryType.js");
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
  throw new TypeError(`${context} is not of type 'WebSocket'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["WebSocket"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor WebSocket is not installed on the passed global object");
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
    throw new Error("Internal error: attempting to evaluate WebSocket before EventTarget");
  }
  class WebSocket extends globalObject.EventTarget {
    constructor(url) {
      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to construct 'WebSocket': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, { context: "Failed to construct 'WebSocket': parameter 1" });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg !== undefined) {
          if (utils.isObject(curArg)) {
            if (curArg[Symbol.iterator] !== undefined) {
              if (!utils.isObject(curArg)) {
                throw new TypeError(
                  "Failed to construct 'WebSocket': parameter 2" + " sequence" + " is not an iterable object."
                );
              } else {
                const V = [];
                const tmp = curArg;
                for (let nextItem of tmp) {
                  nextItem = conversions["DOMString"](nextItem, {
                    context: "Failed to construct 'WebSocket': parameter 2" + " sequence" + "'s element"
                  });

                  V.push(nextItem);
                }
                curArg = V;
              }
            } else {
            }
          } else {
            curArg = conversions["DOMString"](curArg, { context: "Failed to construct 'WebSocket': parameter 2" });
          }
        } else {
          curArg = [];
        }
        args.push(curArg);
      }
      return exports.setup(Object.create(new.target.prototype), globalObject, args);
    }

    close() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          curArg = conversions["unsigned short"](curArg, {
            context: "Failed to execute 'close' on 'WebSocket': parameter 1",
            clamp: true
          });
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg !== undefined) {
          curArg = conversions["USVString"](curArg, {
            context: "Failed to execute 'close' on 'WebSocket': parameter 2"
          });
        }
        args.push(curArg);
      }
      return this[impl].close(...args);
    }

    send(data) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'send' on 'WebSocket': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (isBlob(curArg)) {
          {
            let curArg = arguments[0];
            curArg = convertBlob(curArg, { context: "Failed to execute 'send' on 'WebSocket': parameter 1" });
            args.push(curArg);
          }
        } else if (utils.isArrayBuffer(curArg)) {
          {
            let curArg = arguments[0];
            curArg = conversions["ArrayBuffer"](curArg, {
              context: "Failed to execute 'send' on 'WebSocket': parameter 1"
            });
            args.push(curArg);
          }
        } else if (ArrayBuffer.isView(curArg)) {
          {
            let curArg = arguments[0];
            if (ArrayBuffer.isView(curArg)) {
            } else {
              throw new TypeError(
                "Failed to execute 'send' on 'WebSocket': parameter 1" + " is not of any supported type."
              );
            }
            args.push(curArg);
          }
        } else {
          {
            let curArg = arguments[0];
            curArg = conversions["USVString"](curArg, {
              context: "Failed to execute 'send' on 'WebSocket': parameter 1"
            });
            args.push(curArg);
          }
        }
      }
      return this[impl].send(...args);
    }

    get url() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["url"];
    }

    get readyState() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["readyState"];
    }

    get bufferedAmount() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["bufferedAmount"];
    }

    get onopen() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["onopen"]);
    }

    set onopen(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = utils.tryImplForWrapper(V);

      this[impl]["onopen"] = V;
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

    get onclose() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["onclose"]);
    }

    set onclose(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = utils.tryImplForWrapper(V);

      this[impl]["onclose"] = V;
    }

    get extensions() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["extensions"];
    }

    get protocol() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["protocol"];
    }

    get onmessage() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["onmessage"]);
    }

    set onmessage(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = utils.tryImplForWrapper(V);

      this[impl]["onmessage"] = V;
    }

    get binaryType() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["binaryType"]);
    }

    set binaryType(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = `${V}`;
      if (!BinaryType.enumerationValues.has(V)) {
        return;
      }

      this[impl]["binaryType"] = V;
    }
  }
  Object.defineProperties(WebSocket.prototype, {
    close: { enumerable: true },
    send: { enumerable: true },
    url: { enumerable: true },
    readyState: { enumerable: true },
    bufferedAmount: { enumerable: true },
    onopen: { enumerable: true },
    onerror: { enumerable: true },
    onclose: { enumerable: true },
    extensions: { enumerable: true },
    protocol: { enumerable: true },
    onmessage: { enumerable: true },
    binaryType: { enumerable: true },
    [Symbol.toStringTag]: { value: "WebSocket", configurable: true },
    CONNECTING: { value: 0, enumerable: true },
    OPEN: { value: 1, enumerable: true },
    CLOSING: { value: 2, enumerable: true },
    CLOSED: { value: 3, enumerable: true }
  });
  Object.defineProperties(WebSocket, {
    CONNECTING: { value: 0, enumerable: true },
    OPEN: { value: 1, enumerable: true },
    CLOSING: { value: 2, enumerable: true },
    CLOSED: { value: 3, enumerable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["WebSocket"] = WebSocket;

  Object.defineProperty(globalObject, "WebSocket", {
    configurable: true,
    writable: true,
    value: WebSocket
  });
};

const Impl = require("../websockets/WebSocket-impl.js");
