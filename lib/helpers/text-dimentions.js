"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fontMetrics = exports.FontMetrics = void 0;
var tslib_1 = require("tslib");
var opentype = require('opentype.js');
var FontMetrics = /** @class */ (function () {
    function FontMetrics() {
        this.font = null;
        this.fontBold = null;
        this.font = null;
        this.fontBold = null;
    }
    FontMetrics.prototype.loadFont = function (fonts) {
        if (fonts.normal) {
            this.font = opentype.parse(fonts.normal);
            if (fonts.bold) {
                this.fontBold = opentype.parse(fonts.bold);
            }
        }
    };
    FontMetrics.prototype.getWidth = function (text, fontSize, fontType) {
        var e_1, _a;
        if (fontType === void 0) { fontType = 'normal'; }
        if (!this.font) {
            return 0;
        }
        var totalWidth = 0;
        var isBold = this.fontBold && fontType === 'bold';
        try {
            for (var text_1 = tslib_1.__values(text), text_1_1 = text_1.next(); !text_1_1.done; text_1_1 = text_1.next()) {
                var char = text_1_1.value;
                var glyph = isBold ? this.fontBold.charToGlyph(char) : this.font.charToGlyph(char);
                var advanceWidth = glyph.advanceWidth;
                var unitsPerEm = isBold ? this.fontBold.unitsPerEm : this.font.unitsPerEm;
                // Convert the width from font units to pixels
                var pixelWidth = (advanceWidth / unitsPerEm) * fontSize;
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
    };
    FontMetrics.prototype.getWidthInEx = function (text, fontSize, fontType) {
        if (fontType === void 0) { fontType = 'normal'; }
        if (!this.font) {
            return 0;
        }
        var widthX = fontSize === 16
            ? 8.296875
            : this.getWidth('x', fontSize);
        var widthText = this.getWidth(text, fontSize, fontType);
        // Calculate width in ex
        return widthText / widthX;
    };
    return FontMetrics;
}());
exports.FontMetrics = FontMetrics;
exports.fontMetrics = new FontMetrics();
//# sourceMappingURL=text-dimentions.js.map