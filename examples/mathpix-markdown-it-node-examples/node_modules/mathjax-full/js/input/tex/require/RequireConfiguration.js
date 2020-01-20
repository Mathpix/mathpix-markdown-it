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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Configuration_js_1 = require("../Configuration.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
var TexError_js_1 = require("../TexError.js");
var package_js_1 = require("../../../components/package.js");
var loader_js_1 = require("../../../components/loader.js");
var mathjax_js_1 = require("../../../mathjax.js");
var Options_js_1 = require("../../../util/Options.js");
var MJCONFIG = (global.MathJax ? global.MathJax.config || {} : {});
function RegisterExtension(jax, name) {
    var _a;
    var require = jax.parseOptions.options.require;
    var extension = name.substr(require.prefix.length);
    if (require.required.indexOf(extension) < 0) {
        require.required.push(extension);
        RegisterDependencies(jax, loader_js_1.CONFIG.dependencies[name]);
        var handler = Configuration_js_1.ConfigurationHandler.get(extension);
        if (handler) {
            var options_1 = MJCONFIG[name] || {};
            if (handler.options && Object.keys(handler.options).length === 1 && handler.options[extension]) {
                options_1 = (_a = {}, _a[extension] = options_1, _a);
            }
            jax.configuration.register(handler, jax, options_1);
        }
    }
}
function RegisterDependencies(jax, names) {
    var e_1, _a;
    if (names === void 0) { names = []; }
    var prefix = jax.parseOptions.options.require.prefix;
    try {
        for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
            var name_1 = names_1_1.value;
            if (name_1.substr(0, prefix.length) === prefix) {
                RegisterExtension(jax, name_1);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
function RequireLoad(parser, name) {
    var options = parser.options.require;
    var allow = options.allow;
    var extension = (name.substr(0, 1) === '[' ? '' : options.prefix) + name;
    var allowed = (allow.hasOwnProperty(extension) ? allow[extension] :
        allow.hasOwnProperty(name) ? allow[name] : options.defaultAllow);
    if (!allowed) {
        throw new TexError_js_1.default('BadRequire', 'Extension "%1" is now allowed to be loaded', extension);
    }
    if (package_js_1.Package.packages.has(extension)) {
        RegisterExtension(options.jax, extension);
    }
    else {
        mathjax_js_1.mathjax.retryAfter(loader_js_1.Loader.load(extension));
    }
}
exports.RequireLoad = RequireLoad;
function config(config, jax) {
    var options = jax.parseOptions.options.require;
    options.jax = jax;
    options.required = __spread(jax.options.packages);
    var prefix = options.prefix;
    if (prefix.match(/[^_a-zA-Z0-9]/)) {
        throw Error('Illegal characters used in \\require prefix');
    }
    if (!loader_js_1.CONFIG.paths[prefix]) {
        loader_js_1.CONFIG.paths[prefix] = '[mathjax]/input/tex/extensions';
    }
    options.prefix = '[' + prefix + ']/';
}
exports.RequireMethods = {
    Require: function (parser, name) {
        var required = parser.GetArgument(name);
        if (required.match(/[^_a-zA-Z0-9]/) || required === '') {
            throw new TexError_js_1.default('BadPackageName', 'Argument for %1 is not a valid package name', name);
        }
        RequireLoad(parser, required);
    }
};
exports.options = {
    require: {
        allow: Options_js_1.expandable({
            base: false,
            'all-packages': false
        }),
        defaultAllow: true,
        prefix: 'tex'
    }
};
new SymbolMap_js_1.CommandMap('require', { require: 'Require' }, exports.RequireMethods);
exports.RequireConfiguration = Configuration_js_1.Configuration.create('require', { handler: { macro: ['require'] }, config: config, options: exports.options });
//# sourceMappingURL=RequireConfiguration.js.map