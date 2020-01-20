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
Object.defineProperty(exports, "__esModule", { value: true });
var Wrapper_js_1 = require("../common/Wrapper.js");
var svg_js_1 = require("../svg.js");
var SVGWrapper = (function (_super) {
    __extends(SVGWrapper, _super);
    function SVGWrapper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = null;
        return _this;
    }
    SVGWrapper.prototype.toSVG = function (parent) {
        this.addChildren(this.standardSVGnode(parent));
    };
    SVGWrapper.prototype.addChildren = function (parent) {
        var e_1, _a;
        var x = 0;
        try {
            for (var _b = __values(this.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                child.toSVG(parent);
                if (child.element) {
                    child.place(x + child.bbox.L * child.bbox.rscale, 0);
                }
                x += (child.bbox.L + child.bbox.w + child.bbox.R) * child.bbox.rscale;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    SVGWrapper.prototype.standardSVGnode = function (parent) {
        var svg = this.createSVGnode(parent);
        this.handleStyles();
        this.handleScale();
        this.handleColor();
        this.handleAttributes();
        return svg;
    };
    SVGWrapper.prototype.createSVGnode = function (parent) {
        var href = this.node.attributes.get('href');
        if (href) {
            parent = this.adaptor.append(parent, this.svg('a', { href: href }));
            var _a = this.getBBox(), h = _a.h, d = _a.d, w = _a.w;
            this.adaptor.append(parent, this.svg('rect', {
                'data-hitbox': true, fill: 'none', stroke: 'none', 'pointer-events': 'all',
                width: this.fixed(w), height: this.fixed(h + d), y: this.fixed(-d)
            }));
        }
        this.element = this.adaptor.append(parent, this.svg('g', { 'data-mml-node': this.node.kind }));
        return this.element;
    };
    SVGWrapper.prototype.handleStyles = function () {
        if (!this.styles)
            return;
        var styles = this.styles.cssText;
        if (styles) {
            this.adaptor.setAttribute(this.element, 'style', styles);
        }
    };
    SVGWrapper.prototype.handleScale = function () {
        if (this.bbox.rscale !== 1) {
            var scale = 'scale(' + this.fixed(this.bbox.rscale / 1000, 3) + ')';
            this.adaptor.setAttribute(this.element, 'transform', scale);
        }
    };
    SVGWrapper.prototype.handleColor = function () {
        var adaptor = this.adaptor;
        var attributes = this.node.attributes;
        var mathcolor = attributes.getExplicit('mathcolor');
        var color = attributes.getExplicit('color');
        var mathbackground = attributes.getExplicit('mathbackground');
        var background = attributes.getExplicit('background');
        if (mathcolor || color) {
            adaptor.setAttribute(this.element, 'fill', mathcolor || color);
            adaptor.setAttribute(this.element, 'stroke', mathcolor || color);
        }
        if (mathbackground || background) {
            var _a = this.getBBox(), h = _a.h, d = _a.d, w = _a.w;
            var rect = this.svg('rect', {
                fill: mathbackground || background,
                x: 0, y: this.fixed(-d),
                width: this.fixed(w),
                height: this.fixed(h + d),
                'data-bgcolor': true
            });
            var child = adaptor.firstChild(this.element);
            if (child) {
                adaptor.insert(rect, child);
            }
            else {
                adaptor.append(this.element, rect);
            }
        }
    };
    SVGWrapper.prototype.handleAttributes = function () {
        var e_2, _a, e_3, _b;
        var attributes = this.node.attributes;
        var defaults = attributes.getAllDefaults();
        var skip = SVGWrapper.skipAttributes;
        try {
            for (var _c = __values(attributes.getExplicitNames()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var name_1 = _d.value;
                if (skip[name_1] === false || (!(name_1 in defaults) && !skip[name_1] &&
                    !this.adaptor.hasAttribute(this.element, name_1))) {
                    this.adaptor.setAttribute(this.element, name_1, attributes.getExplicit(name_1));
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (attributes.get('class')) {
            var names = attributes.get('class').trim().split(/ +/);
            try {
                for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                    var name_2 = names_1_1.value;
                    this.adaptor.addClass(this.element, name_2);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (names_1_1 && !names_1_1.done && (_b = names_1.return)) _b.call(names_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
    };
    SVGWrapper.prototype.place = function (x, y, element) {
        if (element === void 0) { element = null; }
        if (!(x || y))
            return;
        if (!element) {
            element = this.element;
        }
        var transform = this.adaptor.getAttribute(element, 'transform') || '';
        transform = 'translate(' + this.fixed(x) + ', ' + this.fixed(y) + ')' + (transform ? ' ' + transform : '');
        this.adaptor.setAttribute(element, 'transform', transform);
    };
    SVGWrapper.prototype.placeChar = function (n, x, y, parent, variant) {
        var e_4, _a;
        if (variant === void 0) { variant = null; }
        if (variant === null) {
            variant = this.variant;
        }
        var C = n.toString(16).toUpperCase();
        var _b = __read(this.getVariantChar(variant, n), 4), h = _b[0], d = _b[1], w = _b[2], data = _b[3];
        if ('p' in data) {
            var path = (data.p ? 'M' + data.p + 'Z' : '');
            this.place(x, y, this.adaptor.append(parent, this.charNode(variant, C, path)));
        }
        else if ('c' in data) {
            var g = this.adaptor.append(parent, this.svg('g', { 'data-c': C }));
            this.place(x, y, g);
            x = 0;
            try {
                for (var _c = __values(this.unicodeChars(data.c)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var n_1 = _d.value;
                    x += this.placeChar(n_1, x, y, g, variant);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        else if (data.unknown) {
            var char = String.fromCharCode(n);
            var text = this.adaptor.append(parent, this.jax.unknownText(char, variant));
            this.place(x, y, text);
            return this.jax.measureTextNodeWithCache(text, char, variant).w;
        }
        return w;
    };
    SVGWrapper.prototype.charNode = function (variant, C, path) {
        var cache = this.jax.options.fontCache;
        return (cache !== 'none' ? this.useNode(variant, C, path) : this.pathNode(C, path));
    };
    SVGWrapper.prototype.pathNode = function (C, path) {
        return this.svg('path', { 'data-c': C, d: path });
    };
    SVGWrapper.prototype.useNode = function (variant, C, path) {
        var use = this.svg('use');
        var id = '#' + this.jax.fontCache.cachePath(variant, C, path);
        this.adaptor.setAttribute(use, 'xlink:href', id, svg_js_1.XLINKNS);
        return use;
    };
    SVGWrapper.prototype.drawBBox = function () {
        var _a = this.getBBox(), w = _a.w, h = _a.h, d = _a.d;
        var box = this.svg('g', { style: {
                opacity: .25
            } }, [
            this.svg('rect', {
                fill: 'red',
                height: this.fixed(h),
                width: this.fixed(w)
            }),
            this.svg('rect', {
                fill: 'green',
                height: this.fixed(d),
                width: this.fixed(w),
                y: this.fixed(-d)
            })
        ]);
        var node = this.element || this.parent.element;
        this.adaptor.append(node, box);
    };
    SVGWrapper.prototype.html = function (type, def, content) {
        if (def === void 0) { def = {}; }
        if (content === void 0) { content = []; }
        return this.jax.html(type, def, content);
    };
    SVGWrapper.prototype.svg = function (type, def, content) {
        if (def === void 0) { def = {}; }
        if (content === void 0) { content = []; }
        return this.jax.svg(type, def, content);
    };
    SVGWrapper.prototype.text = function (text) {
        return this.jax.text(text);
    };
    SVGWrapper.prototype.createMo = function (text) {
        return _super.prototype.createMo.call(this, text);
    };
    SVGWrapper.prototype.coreMO = function () {
        return _super.prototype.coreMO.call(this);
    };
    SVGWrapper.prototype.fixed = function (x, n) {
        if (n === void 0) { n = 1; }
        return this.jax.fixed(x * 1000, n);
    };
    SVGWrapper.kind = 'unknown';
    return SVGWrapper;
}(Wrapper_js_1.CommonWrapper));
exports.SVGWrapper = SVGWrapper;
//# sourceMappingURL=Wrapper.js.map