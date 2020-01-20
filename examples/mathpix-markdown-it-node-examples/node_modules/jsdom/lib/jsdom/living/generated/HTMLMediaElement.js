"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertTextTrackKind = require("./TextTrackKind.js").convert;
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
  throw new TypeError(`${context} is not of type 'HTMLMediaElement'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["HTMLMediaElement"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor HTMLMediaElement is not installed on the passed global object");
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
    throw new Error("Internal error: attempting to evaluate HTMLMediaElement before HTMLElement");
  }
  class HTMLMediaElement extends globalObject.HTMLElement {
    constructor() {
      throw new TypeError("Illegal constructor");
    }

    load() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].load();
    }

    canPlayType(type) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'canPlayType' on 'HTMLMediaElement': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'canPlayType' on 'HTMLMediaElement': parameter 1"
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].canPlayType(...args));
    }

    play() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl].play());
    }

    pause() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].pause();
    }

    addTextTrack(kind) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'addTextTrack' on 'HTMLMediaElement': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = convertTextTrackKind(curArg, {
          context: "Failed to execute 'addTextTrack' on 'HTMLMediaElement': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg !== undefined) {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'addTextTrack' on 'HTMLMediaElement': parameter 2"
          });
        } else {
          curArg = "";
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[2];
        if (curArg !== undefined) {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'addTextTrack' on 'HTMLMediaElement': parameter 3"
          });
        } else {
          curArg = "";
        }
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].addTextTrack(...args));
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
        context: "Failed to set the 'src' property on 'HTMLMediaElement': The provided value"
      });

      this[impl]["src"] = V;
    }

    get currentSrc() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["currentSrc"];
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
          context: "Failed to set the 'crossOrigin' property on 'HTMLMediaElement': The provided value"
        });
      }
      this[impl].setAttributeNS(null, "crossorigin", V);
    }

    get networkState() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["networkState"];
    }

    get preload() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "preload");
      return value === null ? "" : value;
    }

    set preload(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'preload' property on 'HTMLMediaElement': The provided value"
      });

      this[impl].setAttributeNS(null, "preload", V);
    }

    get buffered() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["buffered"]);
    }

    get readyState() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["readyState"];
    }

    get seeking() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["seeking"];
    }

    get currentTime() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["currentTime"];
    }

    set currentTime(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["double"](V, {
        context: "Failed to set the 'currentTime' property on 'HTMLMediaElement': The provided value"
      });

      this[impl]["currentTime"] = V;
    }

    get duration() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["duration"];
    }

    get paused() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["paused"];
    }

    get defaultPlaybackRate() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["defaultPlaybackRate"];
    }

    set defaultPlaybackRate(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["double"](V, {
        context: "Failed to set the 'defaultPlaybackRate' property on 'HTMLMediaElement': The provided value"
      });

      this[impl]["defaultPlaybackRate"] = V;
    }

    get playbackRate() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["playbackRate"];
    }

    set playbackRate(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["double"](V, {
        context: "Failed to set the 'playbackRate' property on 'HTMLMediaElement': The provided value"
      });

      this[impl]["playbackRate"] = V;
    }

    get played() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["played"]);
    }

    get seekable() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["seekable"]);
    }

    get ended() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["ended"];
    }

    get autoplay() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasAttributeNS(null, "autoplay");
    }

    set autoplay(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'autoplay' property on 'HTMLMediaElement': The provided value"
      });

      if (V) {
        this[impl].setAttributeNS(null, "autoplay", "");
      } else {
        this[impl].removeAttributeNS(null, "autoplay");
      }
    }

    get loop() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasAttributeNS(null, "loop");
    }

    set loop(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'loop' property on 'HTMLMediaElement': The provided value"
      });

      if (V) {
        this[impl].setAttributeNS(null, "loop", "");
      } else {
        this[impl].removeAttributeNS(null, "loop");
      }
    }

    get controls() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasAttributeNS(null, "controls");
    }

    set controls(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'controls' property on 'HTMLMediaElement': The provided value"
      });

      if (V) {
        this[impl].setAttributeNS(null, "controls", "");
      } else {
        this[impl].removeAttributeNS(null, "controls");
      }
    }

    get volume() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["volume"];
    }

    set volume(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["double"](V, {
        context: "Failed to set the 'volume' property on 'HTMLMediaElement': The provided value"
      });

      this[impl]["volume"] = V;
    }

    get muted() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["muted"];
    }

    set muted(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'muted' property on 'HTMLMediaElement': The provided value"
      });

      this[impl]["muted"] = V;
    }

    get defaultMuted() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasAttributeNS(null, "muted");
    }

    set defaultMuted(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'defaultMuted' property on 'HTMLMediaElement': The provided value"
      });

      if (V) {
        this[impl].setAttributeNS(null, "muted", "");
      } else {
        this[impl].removeAttributeNS(null, "muted");
      }
    }

    get audioTracks() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.getSameObject(this, "audioTracks", () => {
        return utils.tryWrapperForImpl(this[impl]["audioTracks"]);
      });
    }

    get videoTracks() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.getSameObject(this, "videoTracks", () => {
        return utils.tryWrapperForImpl(this[impl]["videoTracks"]);
      });
    }

    get textTracks() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.getSameObject(this, "textTracks", () => {
        return utils.tryWrapperForImpl(this[impl]["textTracks"]);
      });
    }
  }
  Object.defineProperties(HTMLMediaElement.prototype, {
    load: { enumerable: true },
    canPlayType: { enumerable: true },
    play: { enumerable: true },
    pause: { enumerable: true },
    addTextTrack: { enumerable: true },
    src: { enumerable: true },
    currentSrc: { enumerable: true },
    crossOrigin: { enumerable: true },
    networkState: { enumerable: true },
    preload: { enumerable: true },
    buffered: { enumerable: true },
    readyState: { enumerable: true },
    seeking: { enumerable: true },
    currentTime: { enumerable: true },
    duration: { enumerable: true },
    paused: { enumerable: true },
    defaultPlaybackRate: { enumerable: true },
    playbackRate: { enumerable: true },
    played: { enumerable: true },
    seekable: { enumerable: true },
    ended: { enumerable: true },
    autoplay: { enumerable: true },
    loop: { enumerable: true },
    controls: { enumerable: true },
    volume: { enumerable: true },
    muted: { enumerable: true },
    defaultMuted: { enumerable: true },
    audioTracks: { enumerable: true },
    videoTracks: { enumerable: true },
    textTracks: { enumerable: true },
    [Symbol.toStringTag]: { value: "HTMLMediaElement", configurable: true },
    NETWORK_EMPTY: { value: 0, enumerable: true },
    NETWORK_IDLE: { value: 1, enumerable: true },
    NETWORK_LOADING: { value: 2, enumerable: true },
    NETWORK_NO_SOURCE: { value: 3, enumerable: true },
    HAVE_NOTHING: { value: 0, enumerable: true },
    HAVE_METADATA: { value: 1, enumerable: true },
    HAVE_CURRENT_DATA: { value: 2, enumerable: true },
    HAVE_FUTURE_DATA: { value: 3, enumerable: true },
    HAVE_ENOUGH_DATA: { value: 4, enumerable: true }
  });
  Object.defineProperties(HTMLMediaElement, {
    NETWORK_EMPTY: { value: 0, enumerable: true },
    NETWORK_IDLE: { value: 1, enumerable: true },
    NETWORK_LOADING: { value: 2, enumerable: true },
    NETWORK_NO_SOURCE: { value: 3, enumerable: true },
    HAVE_NOTHING: { value: 0, enumerable: true },
    HAVE_METADATA: { value: 1, enumerable: true },
    HAVE_CURRENT_DATA: { value: 2, enumerable: true },
    HAVE_FUTURE_DATA: { value: 3, enumerable: true },
    HAVE_ENOUGH_DATA: { value: 4, enumerable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["HTMLMediaElement"] = HTMLMediaElement;

  Object.defineProperty(globalObject, "HTMLMediaElement", {
    configurable: true,
    writable: true,
    value: HTMLMediaElement
  });
};

const Impl = require("../nodes/HTMLMediaElement-impl.js");
