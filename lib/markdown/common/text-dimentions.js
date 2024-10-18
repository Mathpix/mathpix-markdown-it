"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fontMetrics = exports.FontMetrics = exports.eFontType = void 0;
var tslib_1 = require("tslib");
var opentype_js_1 = require("opentype.js");
var fonSizeDef = 16;
var exDef = 8.296875;
var eFontType;
(function (eFontType) {
    eFontType["normal"] = "normal";
    eFontType["bold"] = "bold";
})(eFontType = exports.eFontType || (exports.eFontType = {}));
var FontMetrics = /** @class */ (function () {
    function FontMetrics() {
        this.font = null;
        this.fontBold = null;
        this.fontSize = fonSizeDef;
        this.ex = exDef;
    }
    FontMetrics.prototype.loadFont = function (options) {
        var _a, _b;
        if (!options.font) {
            console.warn("[FontMetrics]=> No font provided");
            return;
        }
        this.font = (0, opentype_js_1.parse)(options.font);
        if (options.fontBold) {
            this.fontBold = (0, opentype_js_1.parse)(options.fontBold);
        }
        this.fontSize = (_a = options.fontSize) !== null && _a !== void 0 ? _a : fonSizeDef;
        this.ex = (_b = options.ex) !== null && _b !== void 0 ? _b : exDef;
    };
    FontMetrics.prototype.isFontLoaded = function () {
        if (!this.font) {
            return false;
        }
        return true;
    };
    FontMetrics.prototype.getGlyph = function (char, fontType) {
        if (fontType === void 0) { fontType = eFontType.normal; }
        var isBold = this.fontBold && fontType === eFontType.bold;
        return isBold
            ? this.fontBold.charToGlyph(char)
            : this.font.charToGlyph(char);
    };
    FontMetrics.prototype.getWidth = function (text, fontType) {
        var e_1, _a;
        if (fontType === void 0) { fontType = eFontType.normal; }
        if (!this.isFontLoaded()) {
            console.warn("[FontMetrics]=> No font loaded");
            return 0;
        }
        if (typeof text !== "string" || text.length === 0) {
            return 0;
        }
        try {
            var totalWidth = 0;
            var isBold = this.fontBold && fontType === eFontType.bold;
            var font = isBold ? this.fontBold : this.font;
            var unitsPerEm = font.unitsPerEm;
            try {
                for (var text_1 = tslib_1.__values(text), text_1_1 = text_1.next(); !text_1_1.done; text_1_1 = text_1.next()) {
                    var char = text_1_1.value;
                    var glyph = this.getGlyph(char, fontType);
                    var advanceWidth = glyph.advanceWidth;
                    // Convert the width from font units to pixels
                    var pixelWidth = (advanceWidth / unitsPerEm) * this.fontSize;
                    totalWidth += pixelWidth;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (text_1_1 && !text_1_1.done && (_a = text_1.return)) _a.call(text_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return totalWidth;
        }
        catch (err) {
            console.error("[ERROR]=>[FontMetrics.getWidth]=>", err);
            return 0;
        }
    };
    FontMetrics.prototype.getWidthInEx = function (text, fontType) {
        if (fontType === void 0) { fontType = eFontType.normal; }
        if (!this.isFontLoaded() || !this.ex) {
            console.warn("[FontMetrics]=> No font or invalid ex value");
            return 0;
        }
        var widthText = this.getWidth(text, fontType);
        // Calculate width in ex
        return widthText / this.ex;
    };
    return FontMetrics;
}());
exports.FontMetrics = FontMetrics;
exports.fontMetrics = new FontMetrics();
//# sourceMappingURL=text-dimentions.js.map