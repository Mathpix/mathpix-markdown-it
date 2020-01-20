"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertSelectionMode = require("./SelectionMode.js").convert;
const convertFileList = require("./FileList.js").convert;
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
  throw new TypeError(`${context} is not of type 'HTMLInputElement'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["HTMLInputElement"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor HTMLInputElement is not installed on the passed global object");
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
    throw new Error("Internal error: attempting to evaluate HTMLInputElement before HTMLElement");
  }
  class HTMLInputElement extends globalObject.HTMLElement {
    constructor() {
      throw new TypeError("Illegal constructor");
    }

    stepUp() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          curArg = conversions["long"](curArg, {
            context: "Failed to execute 'stepUp' on 'HTMLInputElement': parameter 1"
          });
        } else {
          curArg = 1;
        }
        args.push(curArg);
      }
      return this[impl].stepUp(...args);
    }

    stepDown() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          curArg = conversions["long"](curArg, {
            context: "Failed to execute 'stepDown' on 'HTMLInputElement': parameter 1"
          });
        } else {
          curArg = 1;
        }
        args.push(curArg);
      }
      return this[impl].stepDown(...args);
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
          "Failed to execute 'setCustomValidity' on 'HTMLInputElement': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'setCustomValidity' on 'HTMLInputElement': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].setCustomValidity(...args);
    }

    select() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].select();
    }

    setRangeText(replacement) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'setRangeText' on 'HTMLInputElement': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      switch (arguments.length) {
        case 1:
          {
            let curArg = arguments[0];
            curArg = conversions["DOMString"](curArg, {
              context: "Failed to execute 'setRangeText' on 'HTMLInputElement': parameter 1"
            });
            args.push(curArg);
          }
          break;
        case 2:
          throw new TypeError(
            "Failed to execute 'setRangeText' on 'HTMLInputElement': only " + arguments.length + " arguments present."
          );
          break;
        case 3:
          {
            let curArg = arguments[0];
            curArg = conversions["DOMString"](curArg, {
              context: "Failed to execute 'setRangeText' on 'HTMLInputElement': parameter 1"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[1];
            curArg = conversions["unsigned long"](curArg, {
              context: "Failed to execute 'setRangeText' on 'HTMLInputElement': parameter 2"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[2];
            curArg = conversions["unsigned long"](curArg, {
              context: "Failed to execute 'setRangeText' on 'HTMLInputElement': parameter 3"
            });
            args.push(curArg);
          }
          break;
        default:
          {
            let curArg = arguments[0];
            curArg = conversions["DOMString"](curArg, {
              context: "Failed to execute 'setRangeText' on 'HTMLInputElement': parameter 1"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[1];
            curArg = conversions["unsigned long"](curArg, {
              context: "Failed to execute 'setRangeText' on 'HTMLInputElement': parameter 2"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[2];
            curArg = conversions["unsigned long"](curArg, {
              context: "Failed to execute 'setRangeText' on 'HTMLInputElement': parameter 3"
            });
            args.push(curArg);
          }
          {
            let curArg = arguments[3];
            if (curArg !== undefined) {
              curArg = convertSelectionMode(curArg, {
                context: "Failed to execute 'setRangeText' on 'HTMLInputElement': parameter 4"
              });
            } else {
              curArg = "preserve";
            }
            args.push(curArg);
          }
      }
      return this[impl].setRangeText(...args);
    }

    setSelectionRange(start, end) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'setSelectionRange' on 'HTMLInputElement': 2 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'setSelectionRange' on 'HTMLInputElement': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'setSelectionRange' on 'HTMLInputElement': parameter 2"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[2];
        if (curArg !== undefined) {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'setSelectionRange' on 'HTMLInputElement': parameter 3"
          });
        }
        args.push(curArg);
      }
      return this[impl].setSelectionRange(...args);
    }

    get accept() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "accept");
      return value === null ? "" : value;
    }

    set accept(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'accept' property on 'HTMLInputElement': The provided value"
      });

      this[impl].setAttributeNS(null, "accept", V);
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
        context: "Failed to set the 'alt' property on 'HTMLInputElement': The provided value"
      });

      this[impl].setAttributeNS(null, "alt", V);
    }

    get autocomplete() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "autocomplete");
      return value === null ? "" : value;
    }

    set autocomplete(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'autocomplete' property on 'HTMLInputElement': The provided value"
      });

      this[impl].setAttributeNS(null, "autocomplete", V);
    }

    get autofocus() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasAttributeNS(null, "autofocus");
    }

    set autofocus(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'autofocus' property on 'HTMLInputElement': The provided value"
      });

      if (V) {
        this[impl].setAttributeNS(null, "autofocus", "");
      } else {
        this[impl].removeAttributeNS(null, "autofocus");
      }
    }

    get defaultChecked() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasAttributeNS(null, "checked");
    }

    set defaultChecked(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'defaultChecked' property on 'HTMLInputElement': The provided value"
      });

      if (V) {
        this[impl].setAttributeNS(null, "checked", "");
      } else {
        this[impl].removeAttributeNS(null, "checked");
      }
    }

    get checked() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["checked"];
    }

    set checked(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'checked' property on 'HTMLInputElement': The provided value"
      });

      this[impl]["checked"] = V;
    }

    get dirName() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "dirname");
      return value === null ? "" : value;
    }

    set dirName(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'dirName' property on 'HTMLInputElement': The provided value"
      });

      this[impl].setAttributeNS(null, "dirname", V);
    }

    get disabled() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasAttributeNS(null, "disabled");
    }

    set disabled(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'disabled' property on 'HTMLInputElement': The provided value"
      });

      if (V) {
        this[impl].setAttributeNS(null, "disabled", "");
      } else {
        this[impl].removeAttributeNS(null, "disabled");
      }
    }

    get form() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["form"]);
    }

    get files() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["files"]);
    }

    set files(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (V === null || V === undefined) {
        V = null;
      } else {
        V = convertFileList(V, {
          context: "Failed to set the 'files' property on 'HTMLInputElement': The provided value"
        });
      }
      this[impl]["files"] = V;
    }

    get formNoValidate() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasAttributeNS(null, "formnovalidate");
    }

    set formNoValidate(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'formNoValidate' property on 'HTMLInputElement': The provided value"
      });

      if (V) {
        this[impl].setAttributeNS(null, "formnovalidate", "");
      } else {
        this[impl].removeAttributeNS(null, "formnovalidate");
      }
    }

    get formTarget() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "formtarget");
      return value === null ? "" : value;
    }

    set formTarget(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'formTarget' property on 'HTMLInputElement': The provided value"
      });

      this[impl].setAttributeNS(null, "formtarget", V);
    }

    get indeterminate() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["indeterminate"];
    }

    set indeterminate(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'indeterminate' property on 'HTMLInputElement': The provided value"
      });

      this[impl]["indeterminate"] = V;
    }

    get inputMode() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "inputmode");
      return value === null ? "" : value;
    }

    set inputMode(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'inputMode' property on 'HTMLInputElement': The provided value"
      });

      this[impl].setAttributeNS(null, "inputmode", V);
    }

    get list() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["list"]);
    }

    get max() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "max");
      return value === null ? "" : value;
    }

    set max(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'max' property on 'HTMLInputElement': The provided value"
      });

      this[impl].setAttributeNS(null, "max", V);
    }

    get maxLength() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["maxLength"];
    }

    set maxLength(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["long"](V, {
        context: "Failed to set the 'maxLength' property on 'HTMLInputElement': The provided value"
      });

      this[impl]["maxLength"] = V;
    }

    get min() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "min");
      return value === null ? "" : value;
    }

    set min(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'min' property on 'HTMLInputElement': The provided value"
      });

      this[impl].setAttributeNS(null, "min", V);
    }

    get minLength() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["minLength"];
    }

    set minLength(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["long"](V, {
        context: "Failed to set the 'minLength' property on 'HTMLInputElement': The provided value"
      });

      this[impl]["minLength"] = V;
    }

    get multiple() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasAttributeNS(null, "multiple");
    }

    set multiple(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'multiple' property on 'HTMLInputElement': The provided value"
      });

      if (V) {
        this[impl].setAttributeNS(null, "multiple", "");
      } else {
        this[impl].removeAttributeNS(null, "multiple");
      }
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
        context: "Failed to set the 'name' property on 'HTMLInputElement': The provided value"
      });

      this[impl].setAttributeNS(null, "name", V);
    }

    get pattern() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "pattern");
      return value === null ? "" : value;
    }

    set pattern(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'pattern' property on 'HTMLInputElement': The provided value"
      });

      this[impl].setAttributeNS(null, "pattern", V);
    }

    get placeholder() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "placeholder");
      return value === null ? "" : value;
    }

    set placeholder(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'placeholder' property on 'HTMLInputElement': The provided value"
      });

      this[impl].setAttributeNS(null, "placeholder", V);
    }

    get readOnly() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasAttributeNS(null, "readonly");
    }

    set readOnly(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'readOnly' property on 'HTMLInputElement': The provided value"
      });

      if (V) {
        this[impl].setAttributeNS(null, "readonly", "");
      } else {
        this[impl].removeAttributeNS(null, "readonly");
      }
    }

    get required() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasAttributeNS(null, "required");
    }

    set required(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'required' property on 'HTMLInputElement': The provided value"
      });

      if (V) {
        this[impl].setAttributeNS(null, "required", "");
      } else {
        this[impl].removeAttributeNS(null, "required");
      }
    }

    get size() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["size"];
    }

    set size(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["unsigned long"](V, {
        context: "Failed to set the 'size' property on 'HTMLInputElement': The provided value"
      });

      this[impl]["size"] = V;
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
        context: "Failed to set the 'src' property on 'HTMLInputElement': The provided value"
      });

      this[impl]["src"] = V;
    }

    get step() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "step");
      return value === null ? "" : value;
    }

    set step(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'step' property on 'HTMLInputElement': The provided value"
      });

      this[impl].setAttributeNS(null, "step", V);
    }

    get type() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["type"];
    }

    set type(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'type' property on 'HTMLInputElement': The provided value"
      });

      this[impl]["type"] = V;
    }

    get defaultValue() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "value");
      return value === null ? "" : value;
    }

    set defaultValue(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'defaultValue' property on 'HTMLInputElement': The provided value"
      });

      this[impl].setAttributeNS(null, "value", V);
    }

    get value() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["value"];
    }

    set value(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'value' property on 'HTMLInputElement': The provided value",
        treatNullAsEmptyString: true
      });

      this[impl]["value"] = V;
    }

    get valueAsDate() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["valueAsDate"];
    }

    set valueAsDate(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (V === null || V === undefined) {
        V = null;
      } else {
        V = conversions["object"](V, {
          context: "Failed to set the 'valueAsDate' property on 'HTMLInputElement': The provided value"
        });
      }
      this[impl]["valueAsDate"] = V;
    }

    get valueAsNumber() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["valueAsNumber"];
    }

    set valueAsNumber(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["unrestricted double"](V, {
        context: "Failed to set the 'valueAsNumber' property on 'HTMLInputElement': The provided value"
      });

      this[impl]["valueAsNumber"] = V;
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

    get labels() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["labels"]);
    }

    get selectionStart() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["selectionStart"];
    }

    set selectionStart(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (V === null || V === undefined) {
        V = null;
      } else {
        V = conversions["unsigned long"](V, {
          context: "Failed to set the 'selectionStart' property on 'HTMLInputElement': The provided value"
        });
      }
      this[impl]["selectionStart"] = V;
    }

    get selectionEnd() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["selectionEnd"];
    }

    set selectionEnd(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (V === null || V === undefined) {
        V = null;
      } else {
        V = conversions["unsigned long"](V, {
          context: "Failed to set the 'selectionEnd' property on 'HTMLInputElement': The provided value"
        });
      }
      this[impl]["selectionEnd"] = V;
    }

    get selectionDirection() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["selectionDirection"];
    }

    set selectionDirection(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (V === null || V === undefined) {
        V = null;
      } else {
        V = conversions["DOMString"](V, {
          context: "Failed to set the 'selectionDirection' property on 'HTMLInputElement': The provided value"
        });
      }
      this[impl]["selectionDirection"] = V;
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
        context: "Failed to set the 'align' property on 'HTMLInputElement': The provided value"
      });

      this[impl].setAttributeNS(null, "align", V);
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
        context: "Failed to set the 'useMap' property on 'HTMLInputElement': The provided value"
      });

      this[impl].setAttributeNS(null, "usemap", V);
    }
  }
  Object.defineProperties(HTMLInputElement.prototype, {
    stepUp: { enumerable: true },
    stepDown: { enumerable: true },
    checkValidity: { enumerable: true },
    reportValidity: { enumerable: true },
    setCustomValidity: { enumerable: true },
    select: { enumerable: true },
    setRangeText: { enumerable: true },
    setSelectionRange: { enumerable: true },
    accept: { enumerable: true },
    alt: { enumerable: true },
    autocomplete: { enumerable: true },
    autofocus: { enumerable: true },
    defaultChecked: { enumerable: true },
    checked: { enumerable: true },
    dirName: { enumerable: true },
    disabled: { enumerable: true },
    form: { enumerable: true },
    files: { enumerable: true },
    formNoValidate: { enumerable: true },
    formTarget: { enumerable: true },
    indeterminate: { enumerable: true },
    inputMode: { enumerable: true },
    list: { enumerable: true },
    max: { enumerable: true },
    maxLength: { enumerable: true },
    min: { enumerable: true },
    minLength: { enumerable: true },
    multiple: { enumerable: true },
    name: { enumerable: true },
    pattern: { enumerable: true },
    placeholder: { enumerable: true },
    readOnly: { enumerable: true },
    required: { enumerable: true },
    size: { enumerable: true },
    src: { enumerable: true },
    step: { enumerable: true },
    type: { enumerable: true },
    defaultValue: { enumerable: true },
    value: { enumerable: true },
    valueAsDate: { enumerable: true },
    valueAsNumber: { enumerable: true },
    willValidate: { enumerable: true },
    validity: { enumerable: true },
    validationMessage: { enumerable: true },
    labels: { enumerable: true },
    selectionStart: { enumerable: true },
    selectionEnd: { enumerable: true },
    selectionDirection: { enumerable: true },
    align: { enumerable: true },
    useMap: { enumerable: true },
    [Symbol.toStringTag]: { value: "HTMLInputElement", configurable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["HTMLInputElement"] = HTMLInputElement;

  Object.defineProperty(globalObject, "HTMLInputElement", {
    configurable: true,
    writable: true,
    value: HTMLInputElement
  });
};

const Impl = require("../nodes/HTMLInputElement-impl.js");
