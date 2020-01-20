"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
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
var SymbolMap_js_1 = require("../SymbolMap.js");
var Symbol_js_1 = require("../Symbol.js");
var RequireConfiguration_js_1 = require("../require/RequireConfiguration.js");
var package_js_1 = require("../../../components/package.js");
var Options_js_1 = require("../../../util/Options.js");
var AutoloadCommandMap = (function (_super) {
    __extends(AutoloadCommandMap, _super);
    function AutoloadCommandMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AutoloadCommandMap.prototype.remove = function (name) {
        this.map.delete(name);
    };
    return AutoloadCommandMap;
}(SymbolMap_js_1.CommandMap));
exports.AutoloadCommandMap = AutoloadCommandMap;
function Autoload(parser, name, extension, isMacro) {
    var e_1, _a, e_2, _b;
    if (package_js_1.Package.packages.has(parser.options.require.prefix + extension)) {
        var def = parser.options.autoload[extension];
        var _c = __read((def.length === 2 && Array.isArray(def[0]) ? def : [def, []]), 2), macros = _c[0], envs = _c[1];
        try {
            for (var macros_1 = __values(macros), macros_1_1 = macros_1.next(); !macros_1_1.done; macros_1_1 = macros_1.next()) {
                var macro = macros_1_1.value;
                AutoloadMacros.remove(macro);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (macros_1_1 && !macros_1_1.done && (_a = macros_1.return)) _a.call(macros_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var envs_1 = __values(envs), envs_1_1 = envs_1.next(); !envs_1_1.done; envs_1_1 = envs_1.next()) {
                var env = envs_1_1.value;
                AutoloadEnvironments.remove(env);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (envs_1_1 && !envs_1_1.done && (_b = envs_1.return)) _b.call(envs_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        parser.i -= name.length + (isMacro ? 0 : 7);
    }
    RequireConfiguration_js_1.RequireLoad(parser, extension);
}
function initAutoload(config) {
    if (!config.options.require) {
        Options_js_1.defaultOptions(config.options, RequireConfiguration_js_1.RequireConfiguration.options);
    }
}
function configAutoload(config, jax) {
    var e_3, _a, e_4, _b, e_5, _c;
    var parser = jax.parseOptions;
    var macros = parser.handlers.get('macro');
    var environments = parser.handlers.get('environment');
    var autoload = parser.options.autoload;
    try {
        for (var _d = __values(Object.keys(autoload)), _e = _d.next(); !_e.done; _e = _d.next()) {
            var extension = _e.value;
            var def = autoload[extension];
            var _f = __read((def.length === 2 && Array.isArray(def[0]) ? def : [def, []]), 2), macs = _f[0], envs = _f[1];
            try {
                for (var macs_1 = (e_4 = void 0, __values(macs)), macs_1_1 = macs_1.next(); !macs_1_1.done; macs_1_1 = macs_1.next()) {
                    var name_1 = macs_1_1.value;
                    if (!macros.lookup(name_1) || name_1 === 'color') {
                        AutoloadMacros.add(name_1, new Symbol_js_1.Macro(name_1, Autoload, [extension, true]));
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (macs_1_1 && !macs_1_1.done && (_b = macs_1.return)) _b.call(macs_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
            try {
                for (var envs_2 = (e_5 = void 0, __values(envs)), envs_2_1 = envs_2.next(); !envs_2_1.done; envs_2_1 = envs_2.next()) {
                    var name_2 = envs_2_1.value;
                    if (!environments.lookup(name_2)) {
                        AutoloadEnvironments.add(name_2, new Symbol_js_1.Macro(name_2, Autoload, [extension, false]));
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (envs_2_1 && !envs_2_1.done && (_c = envs_2.return)) _c.call(envs_2);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
        }
        finally { if (e_3) throw e_3.error; }
    }
    if (!parser.options.require.jax) {
        RequireConfiguration_js_1.RequireConfiguration.config(config, jax);
    }
}
var AutoloadMacros = new AutoloadCommandMap('autoload-macros', {}, {});
var AutoloadEnvironments = new AutoloadCommandMap('autoload-environments', {}, {});
exports.AutoloadConfiguration = Configuration_js_1.Configuration.create('autoload', {
    handler: {
        macro: ['autoload-macros'],
        environment: ['autoload-environments']
    },
    options: {
        autoload: Options_js_1.expandable({
            action: ['toggle', 'mathtip', 'texttip'],
            amsCd: [[], ['CD']],
            bbox: ['bbox'],
            boldsymbol: ['boldsymbol'],
            braket: ['bra', 'ket', 'braket', 'set', 'Bra', 'Ket', 'Braket', 'Set', 'ketbra', 'Ketbra'],
            cancel: ['cancel', 'bcancel', 'xcancel', 'cancelto'],
            color: ['color', 'definecolor', 'textcolor', 'colorbox', 'fcolorbox'],
            enclose: ['enclose'],
            extpfeil: ['xtwoheadrightarrow', 'xtwoheadleftarrow', 'xmapsto',
                'xlongequal', 'xtofrom', 'Newextarrow'],
            html: ['href', 'class', 'style', 'cssId'],
            mhchem: ['ce', 'pu'],
            newcommand: ['newcommand', 'renewcommand', 'newenvironment', 'renewenvironment', 'def', 'let'],
            unicode: ['unicode'],
            verb: ['verb']
        })
    },
    config: configAutoload, configPriority: 10,
    init: initAutoload, priority: 10
});
//# sourceMappingURL=AutoloadConfiguration.js.map