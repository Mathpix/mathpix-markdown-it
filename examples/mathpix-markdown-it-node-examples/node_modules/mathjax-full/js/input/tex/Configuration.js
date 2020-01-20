"use strict";
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
var ParseMethods_js_1 = require("./ParseMethods.js");
var MapHandler_js_1 = require("./MapHandler.js");
var Options_js_1 = require("../../util/Options.js");
var sm = require("./SymbolMap.js");
var MapHandler_js_2 = require("./MapHandler.js");
var FunctionList_js_1 = require("../../util/FunctionList.js");
var Configuration = (function () {
    function Configuration(name, handler, fallback, items, tags, options, nodes, preprocessors, postprocessors, _a, _b) {
        if (handler === void 0) { handler = {}; }
        if (fallback === void 0) { fallback = {}; }
        if (items === void 0) { items = {}; }
        if (tags === void 0) { tags = {}; }
        if (options === void 0) { options = {}; }
        if (nodes === void 0) { nodes = {}; }
        if (preprocessors === void 0) { preprocessors = []; }
        if (postprocessors === void 0) { postprocessors = []; }
        var _c = __read(_a, 2), init = _c[0], priority = _c[1];
        var _d = __read(_b, 2), config = _d[0], configPriority = _d[1];
        this.name = name;
        this.handler = handler;
        this.fallback = fallback;
        this.items = items;
        this.tags = tags;
        this.options = options;
        this.nodes = nodes;
        this.preprocessors = preprocessors;
        this.postprocessors = postprocessors;
        this.initMethod = new FunctionList_js_1.FunctionList();
        this.configMethod = new FunctionList_js_1.FunctionList();
        if (init) {
            this.initMethod.add(init, priority || 0);
        }
        if (config) {
            this.configMethod.add(config, configPriority || priority || 0);
        }
        this.handler = Object.assign({ character: [], delimiter: [], macro: [], environment: [] }, handler);
        ConfigurationHandler.set(name, this);
    }
    Configuration.create = function (name, config) {
        if (config === void 0) { config = {}; }
        return new Configuration(name, config.handler || {}, config.fallback || {}, config.items || {}, config.tags || {}, config.options || {}, config.nodes || {}, config.preprocessors || [], config.postprocessors || [], [config.init, config.priority], [config.config, config.configPriority]);
    };
    Configuration.empty = function () {
        return Configuration.create('empty');
    };
    ;
    Configuration.extension = function () {
        new sm.MacroMap(MapHandler_js_1.ExtensionMaps.NEW_MACRO, {}, {});
        new sm.DelimiterMap(MapHandler_js_1.ExtensionMaps.NEW_DELIMITER, ParseMethods_js_1.default.delimiter, {});
        new sm.CommandMap(MapHandler_js_1.ExtensionMaps.NEW_COMMAND, {}, {});
        new sm.EnvironmentMap(MapHandler_js_1.ExtensionMaps.NEW_ENVIRONMENT, ParseMethods_js_1.default.environment, {}, {});
        return Configuration.create('extension', { handler: { character: [],
                delimiter: [MapHandler_js_1.ExtensionMaps.NEW_DELIMITER],
                macro: [MapHandler_js_1.ExtensionMaps.NEW_DELIMITER,
                    MapHandler_js_1.ExtensionMaps.NEW_COMMAND,
                    MapHandler_js_1.ExtensionMaps.NEW_MACRO],
                environment: [MapHandler_js_1.ExtensionMaps.NEW_ENVIRONMENT]
            } });
    };
    ;
    Configuration.prototype.init = function (configuration) {
        this.initMethod.execute(configuration);
    };
    Configuration.prototype.config = function (configuration, jax) {
        var e_1, _a, e_2, _b;
        this.configMethod.execute(configuration, jax);
        try {
            for (var _c = __values(this.preprocessors), _d = _c.next(); !_d.done; _d = _c.next()) {
                var pre = _d.value;
                typeof pre === 'function' ? jax.preFilters.add(pre) :
                    jax.preFilters.add(pre[0], pre[1]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _e = __values(this.postprocessors), _f = _e.next(); !_f.done; _f = _e.next()) {
                var post = _f.value;
                typeof post === 'function' ? jax.postFilters.add(post) :
                    jax.postFilters.add(post[0], post[1]);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    Configuration.prototype.append = function (config) {
        var e_3, _a, e_4, _b, e_5, _c, e_6, _d, e_7, _e, e_8, _f;
        var handlers = Object.keys(config.handler);
        try {
            for (var handlers_1 = __values(handlers), handlers_1_1 = handlers_1.next(); !handlers_1_1.done; handlers_1_1 = handlers_1.next()) {
                var key = handlers_1_1.value;
                try {
                    for (var _g = (e_4 = void 0, __values(config.handler[key])), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var map = _h.value;
                        this.handler[key].unshift(map);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (handlers_1_1 && !handlers_1_1.done && (_a = handlers_1.return)) _a.call(handlers_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        Object.assign(this.fallback, config.fallback);
        Object.assign(this.items, config.items);
        Object.assign(this.tags, config.tags);
        Options_js_1.defaultOptions(this.options, config.options);
        Object.assign(this.nodes, config.nodes);
        try {
            for (var _j = __values(config.preprocessors), _k = _j.next(); !_k.done; _k = _j.next()) {
                var pre = _k.value;
                this.preprocessors.push(pre);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
            }
            finally { if (e_5) throw e_5.error; }
        }
        ;
        try {
            for (var _l = __values(config.postprocessors), _m = _l.next(); !_m.done; _m = _l.next()) {
                var post = _m.value;
                this.postprocessors.push(post);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
            }
            finally { if (e_6) throw e_6.error; }
        }
        ;
        try {
            for (var _o = __values(config.initMethod), _p = _o.next(); !_p.done; _p = _o.next()) {
                var init = _p.value;
                this.initMethod.add(init.item, init.priority);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_p && !_p.done && (_e = _o.return)) _e.call(_o);
            }
            finally { if (e_7) throw e_7.error; }
        }
        ;
        try {
            for (var _q = __values(config.configMethod), _r = _q.next(); !_r.done; _r = _q.next()) {
                var init = _r.value;
                this.configMethod.add(init.item, init.priority);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_r && !_r.done && (_f = _q.return)) _f.call(_q);
            }
            finally { if (e_8) throw e_8.error; }
        }
        ;
    };
    Configuration.prototype.register = function (config, jax, options) {
        var e_9, _a, e_10, _b, e_11, _c;
        if (options === void 0) { options = {}; }
        this.append(config);
        config.init(this);
        var parser = jax.parseOptions;
        parser.handlers = new MapHandler_js_2.SubHandlers(this);
        parser.nodeFactory.setCreators(config.nodes);
        try {
            for (var _d = __values(Object.keys(config.items)), _e = _d.next(); !_e.done; _e = _d.next()) {
                var kind = _e.value;
                parser.itemFactory.setNodeClass(kind, config.items[kind]);
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_9) throw e_9.error; }
        }
        Options_js_1.defaultOptions(parser.options, config.options);
        Options_js_1.userOptions(parser.options, options);
        config.config(this, jax);
        try {
            for (var _f = __values(config.preprocessors), _g = _f.next(); !_g.done; _g = _f.next()) {
                var pre = _g.value;
                Array.isArray(pre) ? jax.preFilters.add(pre[0], pre[1]) : jax.preFilters.add(pre);
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_10) throw e_10.error; }
        }
        try {
            for (var _h = __values(config.postprocessors), _j = _h.next(); !_j.done; _j = _h.next()) {
                var post = _j.value;
                Array.isArray(post) ? jax.postFilters.add(post[0], post[1]) : jax.postFilters.add(post);
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
            }
            finally { if (e_11) throw e_11.error; }
        }
    };
    return Configuration;
}());
exports.Configuration = Configuration;
;
var ConfigurationHandler;
(function (ConfigurationHandler) {
    var maps = new Map();
    ConfigurationHandler.set = function (name, map) {
        maps.set(name, map);
    };
    ConfigurationHandler.get = function (name) {
        return maps.get(name);
    };
    ConfigurationHandler.keys = function () {
        return maps.keys();
    };
})(ConfigurationHandler = exports.ConfigurationHandler || (exports.ConfigurationHandler = {}));
//# sourceMappingURL=Configuration.js.map