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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var OutputJax_js_1 = require("./common/OutputJax.js");
var WrapperFactory_js_1 = require("./chtml/WrapperFactory.js");
var tex_js_1 = require("./chtml/fonts/tex.js");
var LENGTHS = require("../util/lengths.js");
var CHTML = (function (_super) {
    __extends(CHTML, _super);
    function CHTML(options) {
        if (options === void 0) { options = null; }
        var _this = _super.call(this, options, WrapperFactory_js_1.CHTMLWrapperFactory, tex_js_1.TeXFont) || this;
        _this.font.adaptiveCSS(_this.options.adaptiveCSS);
        return _this;
    }
    CHTML.prototype.escaped = function (math, html) {
        this.setDocument(html);
        return this.html('span', {}, [this.text(math.math)]);
    };
    CHTML.prototype.styleSheet = function (html) {
        var sheet = _super.prototype.styleSheet.call(this, html);
        this.adaptor.setAttribute(sheet, 'id', CHTML.STYLESHEETID);
        return sheet;
    };
    CHTML.prototype.addClassStyles = function (CLASS) {
        var _a;
        if (!this.options.adaptiveCSS || CLASS.used) {
            if (CLASS.autoStyle && CLASS.kind !== 'unknown') {
                this.cssStyles.addStyles((_a = {},
                    _a['mjx-' + CLASS.kind] = {
                        display: 'inline-block',
                        'text-align': 'left'
                    },
                    _a));
            }
            _super.prototype.addClassStyles.call(this, CLASS);
        }
    };
    CHTML.prototype.processMath = function (math, parent) {
        this.factory.wrap(math).toCHTML(parent);
    };
    CHTML.prototype.clearCache = function () {
        var e_1, _a;
        this.cssStyles.clear();
        this.font.clearCache();
        try {
            for (var _b = __values(this.factory.getKinds()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var kind = _c.value;
                this.factory.getNodeClass(kind).used = false;
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
    CHTML.prototype.unknownText = function (text, variant) {
        var styles = {};
        var scale = 100 / this.math.metrics.scale;
        if (scale !== 100) {
            styles['font-size'] = this.fixed(scale, 1) + '%';
            styles.padding = LENGTHS.em(75 / scale) + ' 0 ' + LENGTHS.em(20 / scale) + ' 0';
        }
        if (variant !== '-explicitFont') {
            this.cssFontStyles(this.font.getCssFont(variant), styles);
        }
        return this.html('mjx-utext', { variant: variant, style: styles }, [this.text(text)]);
    };
    CHTML.prototype.measureTextNode = function (text) {
        var adaptor = this.adaptor;
        text = adaptor.clone(text);
        var style = { position: 'absolute', 'white-space': 'nowrap' };
        var node = this.html('mjx-measure-text', { style: style }, [text]);
        adaptor.append(adaptor.parent(this.math.start.node), this.container);
        adaptor.append(this.container, node);
        var w = adaptor.nodeSize(text, this.math.metrics.em)[0] / this.math.metrics.scale;
        adaptor.remove(this.container);
        adaptor.remove(node);
        return { w: w, h: .75, d: .2 };
    };
    CHTML.prototype.getFontData = function (styles) {
        var font = _super.prototype.getFontData.call(this, styles);
        font[0] = 'MJXZERO, ' + font[0];
        return font;
    };
    CHTML.prototype.cssFontStyles = function (font, styles) {
        if (styles === void 0) { styles = {}; }
        font[0] = 'MJXZERO, ' + font[0];
        return _super.prototype.cssFontStyles.call(this, font, styles);
    };
    CHTML.NAME = 'CHTML';
    CHTML.OPTIONS = __assign({}, OutputJax_js_1.CommonOutputJax.OPTIONS, { adaptiveCSS: true });
    CHTML.commonStyles = {
        'mjx-container [space="1"]': { 'margin-left': '.111em' },
        'mjx-container [space="2"]': { 'margin-left': '.167em' },
        'mjx-container [space="3"]': { 'margin-left': '.222em' },
        'mjx-container [space="4"]': { 'margin-left': '.278em' },
        'mjx-container [space="5"]': { 'margin-left': '.333em' },
        'mjx-container [rspace="1"]': { 'margin-right': '.111em' },
        'mjx-container [rspace="2"]': { 'margin-right': '.167em' },
        'mjx-container [rspace="3"]': { 'margin-right': '.222em' },
        'mjx-container [rspace="4"]': { 'margin-right': '.278em' },
        'mjx-container [rspace="5"]': { 'margin-right': '.333em' },
        'mjx-container [size="s"]': { 'font-size': '70.7%' },
        'mjx-container [size="ss"]': { 'font-size': '50%' },
        'mjx-container [size="Tn"]': { 'font-size': '60%' },
        'mjx-container [size="sm"]': { 'font-size': '85%' },
        'mjx-container [size="lg"]': { 'font-size': '120%' },
        'mjx-container [size="Lg"]': { 'font-size': '144%' },
        'mjx-container [size="LG"]': { 'font-size': '173%' },
        'mjx-container [size="hg"]': { 'font-size': '207%' },
        'mjx-container [size="HG"]': { 'font-size': '249%' },
        'mjx-container [width="full"]': { width: '100%' },
        'mjx-box': { display: 'inline-block' },
        'mjx-block': { display: 'block' },
        'mjx-itable': { display: 'inline-table' },
        'mjx-row': { display: 'table-row' },
        'mjx-row > *': { display: 'table-cell' },
        'mjx-mtext': {
            display: 'inline-block'
        },
        'mjx-mstyle': {
            display: 'inline-block'
        },
        'mjx-merror': {
            display: 'inline-block',
            color: 'red',
            'background-color': 'yellow'
        },
        'mjx-mphantom': { visibility: 'hidden' }
    };
    CHTML.STYLESHEETID = 'MJX-CHTML-styles';
    return CHTML;
}(OutputJax_js_1.CommonOutputJax));
exports.CHTML = CHTML;
//# sourceMappingURL=chtml.js.map