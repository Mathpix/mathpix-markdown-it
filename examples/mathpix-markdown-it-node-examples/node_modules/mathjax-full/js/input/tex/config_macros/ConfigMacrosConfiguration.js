"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Configuration_js_1 = require("../Configuration.js");
var Options_js_1 = require("../../../util/Options.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
var Symbol_js_1 = require("../Symbol.js");
var NewcommandMethods_js_1 = require("../newcommand/NewcommandMethods.js");
function configMacrosConfig(config, jax) {
    var e_1, _a;
    var macros = config.options.macros;
    try {
        for (var _b = __values(Object.keys(macros)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var cs = _c.value;
            var def = (typeof macros[cs] === 'string' ? [macros[cs]] : macros[cs]);
            var macro = Array.isArray(def[2]) ?
                new Symbol_js_1.Macro(cs, NewcommandMethods_js_1.default.MacroWithTemplate, def.slice(0, 2).concat(def[2])) :
                new Symbol_js_1.Macro(cs, NewcommandMethods_js_1.default.Macro, def);
            ConfigMacrosMap.add(cs, macro);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
var ConfigMacrosMap = new SymbolMap_js_1.CommandMap('configMacros', {}, {});
exports.ConfigMacrosConfiguration = Configuration_js_1.Configuration.create('configMacros', {
    handler: { macro: ['configMacros'] },
    config: configMacrosConfig,
    options: { macros: Options_js_1.expandable({}) }
});
//# sourceMappingURL=ConfigMacrosConfiguration.js.map