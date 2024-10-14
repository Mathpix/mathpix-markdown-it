"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontMetrics = void 0;
var tslib_1 = require("tslib");
var opentype = require('opentype.js');
var ariaBase64_1 = require("./ariaBase64");
var FontMetrics = /** @class */ (function () {
    function FontMetrics() {
        this.font = null;
        this.font = null;
        this.loadFont();
    }
    FontMetrics.prototype.loadFont = function () {
        if (typeof Buffer !== 'undefined') {
            // Convert Base64 string to a buffer
            var fontBuffer = Buffer.from(ariaBase64_1.base64AriaFont, 'base64');
            // Load the font only once
            // const fontBuffer = fs.readFileSync(this.fontPath);
            this.font = opentype.parse(fontBuffer.buffer);
        }
    };
    FontMetrics.prototype.getWidth = function (text, fontSize) {
        var e_1, _a;
        if (!this.font) {
            return 0;
        }
        var totalWidth = 0;
        try {
            for (var text_1 = tslib_1.__values(text), text_1_1 = text_1.next(); !text_1_1.done; text_1_1 = text_1.next()) {
                var char = text_1_1.value;
                var glyph = this.font.charToGlyph(char);
                var advanceWidth = glyph.advanceWidth;
                // Convert the width from font units to pixels
                var pixelWidth = (advanceWidth / this.font.unitsPerEm) * fontSize;
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
    FontMetrics.prototype.getWidthInEx = function (text, fontSize) {
        if (!this.font) {
            return 0;
        }
        var widthX = this.getWidth('x', fontSize);
        var widthText = this.getWidth(text, fontSize);
        // Calculate width in ex
        return widthText / widthX;
    };
    return FontMetrics;
}());
exports.FontMetrics = FontMetrics;
//# sourceMappingURL=text-dimentions.js.map