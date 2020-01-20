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
var mathjax_js_1 = require("../mathjax.js");
var MathItem_js_1 = require("../core/MathItem.js");
var SerializedMmlVisitor_js_1 = require("../core/MmlTree/SerializedMmlVisitor.js");
var Options_js_1 = require("../util/Options.js");
var sre_js_1 = require("./sre.js");
var currentSpeech = 'none';
MathItem_js_1.newState('ENRICHED', 30);
MathItem_js_1.newState('ATTACHSPEECH', 155);
function EnrichedMathItemMixin(BaseMathItem, MmlJax, toMathML) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.enrich = function (document) {
            if (this.state() >= MathItem_js_1.STATE.ENRICHED)
                return;
            if (typeof sre === 'undefined' || !sre.Engine.isReady()) {
                mathjax_js_1.mathjax.retryAfter(sre_js_1.sreReady);
            }
            if (document.options.enrichSpeech !== currentSpeech) {
                SRE.setupEngine({ speech: document.options.enrichSpeech });
                currentSpeech = document.options.enrichSpeech;
            }
            var math = new document.options.MathItem('', MmlJax);
            var enriched = SRE.toEnriched(toMathML(this.root));
            math.math = ('outerHTML' in enriched ? enriched.outerHTML : enriched.toString());
            math.display = this.display;
            math.compile(document);
            this.root = math.root;
            this.inputData.originalMml = math.math;
            this.state(MathItem_js_1.STATE.ENRICHED);
        };
        class_1.prototype.attachSpeech = function (document) {
            var e_1, _a;
            if (this.state() >= MathItem_js_1.STATE.ATTACHSPEECH)
                return;
            var attributes = this.root.attributes;
            var speech = (attributes.get('aria-label') ||
                this.getSpeech(this.root));
            if (speech) {
                var adaptor = document.adaptor;
                var node = this.typesetRoot;
                adaptor.setAttribute(node, 'aria-label', speech);
                try {
                    for (var _b = __values(adaptor.childNodes(node)), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var child = _c.value;
                        adaptor.setAttribute(child, 'aria-hidden', 'true');
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
            this.state(MathItem_js_1.STATE.ATTACHSPEECH);
        };
        class_1.prototype.getSpeech = function (node) {
            var e_2, _a;
            var attributes = node.attributes;
            if (!attributes)
                return;
            var speech = attributes.getExplicit('data-semantic-speech');
            if (!attributes.getExplicit('data-semantic-parent') && speech) {
                return speech;
            }
            try {
                for (var _b = __values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    var value = this.getSpeech(child);
                    if (value != null) {
                        return value;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        return class_1;
    }(BaseMathItem));
}
exports.EnrichedMathItemMixin = EnrichedMathItemMixin;
function EnrichedMathDocumentMixin(BaseDocument, MmlJax) {
    var _a;
    return _a = (function (_super) {
            __extends(class_2, _super);
            function class_2() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.apply(this, __spread(args)) || this;
                MmlJax.setMmlFactory(_this.mmlFactory);
                var ProcessBits = _this.constructor.ProcessBits;
                if (!ProcessBits.has('enriched')) {
                    ProcessBits.allocate('enriched');
                    ProcessBits.allocate('attach-speech');
                }
                var visitor = new SerializedMmlVisitor_js_1.SerializedMmlVisitor(_this.mmlFactory);
                var toMathML = (function (node) { return visitor.visitTree(node); });
                _this.options.MathItem =
                    EnrichedMathItemMixin(_this.options.MathItem, MmlJax, toMathML);
                return _this;
            }
            class_2.prototype.attachSpeech = function () {
                var e_3, _a;
                if (!this.processed.isSet('attach-speech')) {
                    try {
                        for (var _b = __values(this.math), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var math = _c.value;
                            math.attachSpeech(this);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    this.processed.set('attach-speech');
                }
                return this;
            };
            class_2.prototype.enrich = function () {
                var e_4, _a;
                if (!this.processed.isSet('enriched')) {
                    try {
                        for (var _b = __values(this.math), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var math = _c.value;
                            math.enrich(this);
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                    this.processed.set('enriched');
                }
                return this;
            };
            class_2.prototype.state = function (state, restore) {
                if (restore === void 0) { restore = false; }
                _super.prototype.state.call(this, state, restore);
                if (state < MathItem_js_1.STATE.ENRICHED) {
                    this.processed.clear('enriched');
                }
                return this;
            };
            return class_2;
        }(BaseDocument)),
        _a.OPTIONS = __assign({}, BaseDocument.OPTIONS, { enrichSpeech: 'none', renderActions: Options_js_1.expandable(__assign({}, BaseDocument.OPTIONS.renderActions, { enrich: [MathItem_js_1.STATE.ENRICHED], attachSpeech: [MathItem_js_1.STATE.ATTACHSPEECH] })) }),
        _a;
}
exports.EnrichedMathDocumentMixin = EnrichedMathDocumentMixin;
function EnrichHandler(handler, MmlJax) {
    MmlJax.setAdaptor(handler.adaptor);
    handler.documentClass =
        EnrichedMathDocumentMixin(handler.documentClass, MmlJax);
    return handler;
}
exports.EnrichHandler = EnrichHandler;
//# sourceMappingURL=semantic-enrich.js.map