"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const isDocument = require("./Document.js").is;
const isBlob = require("./Blob.js").is;
const isFormData = require("./FormData.js").is;
const XMLHttpRequestResponseType = require("./XMLHttpRequestResponseType.js");
const impl = utils.implSymbol;
const ctorRegistry = utils.ctorRegistrySymbol;
const XMLHttpRequestEventTarget = require("./XMLHttpRequestEventTarget.js");

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
  throw new TypeError(`${context} is not of type 'XMLHttpRequest'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["XMLHttpRequest"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor XMLHttpRequest is not installed on the passed global object");
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
  XMLHttpRequestEventTarget._internalSetup(obj);
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
  if (globalObject.XMLHttpRequestEventTarget === undefined) {
    throw new Error("Internal error: attempting to evaluate XMLHttpRequest before XMLHttpRequestEventTarget");
  }
  class XMLHttpRequest extends globalObject.XMLHttpRequestEventTarget {
    constructor() {
      return exports.setup(Object.create(new.target.prototype), globalObject, undefined);
    }

    open(method, url) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'open' on 'XMLHttpRequest': 2 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      switch (arguments.length) {
        case 2:
          {
            let curArg = arguments[0];
            curArg = conversions["ByteString"](curArg, {
              context: "Failed to execute 'open' on 'XMLHttpRequest': parameter 1"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[1];
            curArg = conversions["USVString"](curArg, {
              context: "Failed to execute 'open' on 'XMLHttpRequest': parameter 2"
            });
            args.push(curArg);
          }
          break;
        case 3:
          {
            let curArg = arguments[0];
            curArg = conversions["ByteString"](curArg, {
              context: "Failed to execute 'open' on 'XMLHttpRequest': parameter 1"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[1];
            curArg = conversions["USVString"](curArg, {
              context: "Failed to execute 'open' on 'XMLHttpRequest': parameter 2"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[2];
            curArg = conversions["boolean"](curArg, {
              context: "Failed to execute 'open' on 'XMLHttpRequest': parameter 3"
            });
            args.push(curArg);
          }
          break;
        case 4:
          {
            let curArg = arguments[0];
            curArg = conversions["ByteString"](curArg, {
              context: "Failed to execute 'open' on 'XMLHttpRequest': parameter 1"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[1];
            curArg = conversions["USVString"](curArg, {
              context: "Failed to execute 'open' on 'XMLHttpRequest': parameter 2"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[2];
            curArg = conversions["boolean"](curArg, {
              context: "Failed to execute 'open' on 'XMLHttpRequest': parameter 3"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[3];
            if (curArg !== undefined) {
              if (curArg === null || curArg === undefined) {
                curArg = null;
              } else {
                curArg = conversions["USVString"](curArg, {
                  context: "Failed to execute 'open' on 'XMLHttpRequest': parameter 4"
                });
              }
            } else {
              curArg = null;
            }
            args.push(curArg);
          }
          break;
        default:
          {
            let curArg = arguments[0];
            curArg = conversions["ByteString"](curArg, {
              context: "Failed to execute 'open' on 'XMLHttpRequest': parameter 1"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[1];
            curArg = conversions["USVString"](curArg, {
              context: "Failed to execute 'open' on 'XMLHttpRequest': parameter 2"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[2];
            curArg = conversions["boolean"](curArg, {
              context: "Failed to execute 'open' on 'XMLHttpRequest': parameter 3"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[3];
            if (curArg !== undefined) {
              if (curArg === null || curArg === undefined) {
                curArg = null;
              } else {
                curArg = conversions["USVString"](curArg, {
                  context: "Failed to execute 'open' on 'XMLHttpRequest': parameter 4"
                });
              }
            } else {
              curArg = null;
            }
            args.push(curArg);
          }
          {
            let curArg = arguments[4];
            if (curArg !== undefined) {
              if (curArg === null || curArg === undefined) {
                curArg = null;
              } else {
                curArg = conversions["USVString"](curArg, {
                  context: "Failed to execute 'open' on 'XMLHttpRequest': parameter 5"
                });
              }
            } else {
              curArg = null;
            }
            args.push(curArg);
          }
      }
      return this[impl].open(...args);
    }

    setRequestHeader(name, value) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'setRequestHeader' on 'XMLHttpRequest': 2 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["ByteString"](curArg, {
          context: "Failed to execute 'setRequestHeader' on 'XMLHttpRequest': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["ByteString"](curArg, {
          context: "Failed to execute 'setRequestHeader' on 'XMLHttpRequest': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].setRequestHeader(...args);
    }

    send() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          if (curArg === null || curArg === undefined) {
            curArg = null;
          } else {
            if (isDocument(curArg) || isBlob(curArg) || isFormData(curArg)) {
              curArg = utils.implForWrapper(curArg);
            } else if (utils.isArrayBuffer(curArg)) {
            } else if (ArrayBuffer.isView(curArg)) {
            } else {
              curArg = conversions["USVString"](curArg, {
                context: "Failed to execute 'send' on 'XMLHttpRequest': parameter 1"
              });
            }
          }
        } else {
          curArg = null;
        }
        args.push(curArg);
      }
      return this[impl].send(...args);
    }

    abort() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].abort();
    }

    getResponseHeader(name) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'getResponseHeader' on 'XMLHttpRequest': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["ByteString"](curArg, {
          context: "Failed to execute 'getResponseHeader' on 'XMLHttpRequest': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].getResponseHeader(...args);
    }

    getAllResponseHeaders() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].getAllResponseHeaders();
    }

    overrideMimeType(mime) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'overrideMimeType' on 'XMLHttpRequest': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'overrideMimeType' on 'XMLHttpRequest': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].overrideMimeType(...args);
    }

    get onreadystatechange() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["onreadystatechange"]);
    }

    set onreadystatechange(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = utils.tryImplForWrapper(V);

      this[impl]["onreadystatechange"] = V;
    }

    get readyState() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["readyState"];
    }

    get timeout() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["timeout"];
    }

    set timeout(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["unsigned long"](V, {
        context: "Failed to set the 'timeout' property on 'XMLHttpRequest': The provided value"
      });

      this[impl]["timeout"] = V;
    }

    get withCredentials() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["withCredentials"];
    }

    set withCredentials(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'withCredentials' property on 'XMLHttpRequest': The provided value"
      });

      this[impl]["withCredentials"] = V;
    }

    get upload() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.getSameObject(this, "upload", () => {
        return utils.tryWrapperForImpl(this[impl]["upload"]);
      });
    }

    get responseURL() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["responseURL"];
    }

    get status() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["status"];
    }

    get statusText() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["statusText"];
    }

    get responseType() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["responseType"]);
    }

    set responseType(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = `${V}`;
      if (!XMLHttpRequestResponseType.enumerationValues.has(V)) {
        return;
      }

      this[impl]["responseType"] = V;
    }

    get response() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["response"];
    }

    get responseText() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["responseText"];
    }

    get responseXML() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["responseXML"]);
    }
  }
  Object.defineProperties(XMLHttpRequest.prototype, {
    open: { enumerable: true },
    setRequestHeader: { enumerable: true },
    send: { enumerable: true },
    abort: { enumerable: true },
    getResponseHeader: { enumerable: true },
    getAllResponseHeaders: { enumerable: true },
    overrideMimeType: { enumerable: true },
    onreadystatechange: { enumerable: true },
    readyState: { enumerable: true },
    timeout: { enumerable: true },
    withCredentials: { enumerable: true },
    upload: { enumerable: true },
    responseURL: { enumerable: true },
    status: { enumerable: true },
    statusText: { enumerable: true },
    responseType: { enumerable: true },
    response: { enumerable: true },
    responseText: { enumerable: true },
    responseXML: { enumerable: true },
    [Symbol.toStringTag]: { value: "XMLHttpRequest", configurable: true },
    UNSENT: { value: 0, enumerable: true },
    OPENED: { value: 1, enumerable: true },
    HEADERS_RECEIVED: { value: 2, enumerable: true },
    LOADING: { value: 3, enumerable: true },
    DONE: { value: 4, enumerable: true }
  });
  Object.defineProperties(XMLHttpRequest, {
    UNSENT: { value: 0, enumerable: true },
    OPENED: { value: 1, enumerable: true },
    HEADERS_RECEIVED: { value: 2, enumerable: true },
    LOADING: { value: 3, enumerable: true },
    DONE: { value: 4, enumerable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["XMLHttpRequest"] = XMLHttpRequest;

  Object.defineProperty(globalObject, "XMLHttpRequest", {
    configurable: true,
    writable: true,
    value: XMLHttpRequest
  });
};

const Impl = require("../xhr/XMLHttpRequest-impl.js");
