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
var Wrapper_js_1 = require("../Wrapper.js");
var math_js_1 = require("../../common/Wrappers/math.js");
var math_js_2 = require("../../../core/MmlTree/MmlNodes/math.js");
var SVGmath = (function (_super) {
    __extends(SVGmath, _super);
    function SVGmath() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmath.prototype.toSVG = function (parent) {
        var e_1, _a;
        _super.prototype.toSVG.call(this, parent);
        var adaptor = this.adaptor;
        var display = (this.node.attributes.get('display') === 'block');
        if (display) {
            adaptor.setAttribute(this.jax.container, 'display', 'true');
        }
        var _b = __read(this.getAlignShift(), 2), align = _b[0], shift = _b[1];
        if (align !== 'center') {
            adaptor.setAttribute(this.jax.container, 'justify', align);
        }
        if (display && shift) {
            this.jax.shift = shift;
        }
        if (this.jax.document.options.internalSpeechTitles) {
            var attributes = this.node.attributes;
            var speech = (attributes.get('aria-label') || attributes.get('data-semantic-speech'));
            if (speech) {
                var id = this.getTitleID();
                var label = this.svg('title', { id: id }, [this.text(speech)]);
                adaptor.insert(label, adaptor.firstChild(this.element));
                adaptor.setAttribute(this.element, 'aria-labeledby', id);
                adaptor.removeAttribute(this.element, 'aria-label');
                try {
                    for (var _c = __values(this.childNodes[0].childNodes), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var child = _d.value;
                        adaptor.setAttribute(child.element, 'aria-hidden', 'true');
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        }
    };
    SVGmath.prototype.getTitleID = function () {
        return 'mjx-svg-title-' + String(this.jax.options.titleID++);
    };
    SVGmath.prototype.setChildPWidths = function (recompute, w, clear) {
        if (w === void 0) { w = null; }
        if (clear === void 0) { clear = true; }
        return _super.prototype.setChildPWidths.call(this, recompute, this.parent ? w : this.metrics.containerWidth / this.jax.pxPerEm, false);
    };
    SVGmath.kind = math_js_2.MmlMath.prototype.kind;
    SVGmath.styles = {
        'mjx-container[jax="SVG"][display="true"]': {
            display: 'block',
            'text-align': 'center',
            margin: '1em 0'
        },
        'mjx-container[jax="SVG"][justify="left"]': {
            'text-align': 'left'
        },
        'mjx-container[jax="SVG"][justify="right"]': {
            'text-align': 'right'
        }
    };
    return SVGmath;
}(math_js_1.CommonMathMixin(Wrapper_js_1.SVGWrapper)));
exports.SVGmath = SVGmath;
//# sourceMappingURL=math.js.map