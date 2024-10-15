"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorModel = void 0;
var tslib_1 = require("tslib");
var TexError_js_1 = require("mathjax-full/js/input/tex/TexError.js");
var IconConstants_js_1 = require("./IconConstants.js");
var ColorModelProcessors = new Map();
var ColorModel = /** @class */ (function () {
    function ColorModel() {
        /**
         * User defined colors.
         *
         * This variable is local to the parser, so two parsers in the same
         * JavaScript thread can have two different sets of user-defined colors.
         */
        this.userColors = new Map();
    }
    /**
     * Converts a color model from string representation to its CSS format `#44ff00`
     *
     * @param {string} model The coloring model type: `rgb` `RGB` or `gray`.
     * @param {string} def The color definition: `0.5,0,1`, `128,0,255`, `0.5`.
     * @return {string} The color definition in CSS format e.g. `#44ff00`.
     */
    ColorModel.prototype.normalizeColor = function (model, def) {
        if (!model || model === 'named') {
            // Allow to define colors directly by using the CSS format e.g. `#888`
            return def;
        }
        if (ColorModelProcessors.has(model)) {
            var modelProcessor = ColorModelProcessors.get(model);
            return modelProcessor(def);
        }
        throw new TexError_js_1.default('UndefinedColorModel', 'Color model \'%1\' not defined', model);
    };
    /**
     * Look up a color based on its model and definition.
     *
     * @param {string} model The coloring model type: `named`, `rgb` `RGB` or `gray`.
     * @param {string} def The color definition: `red, `0.5,0,1`, `128,0,255`, `0.5`.
     * @return {string} The color definition in CSS format e.g. `#44ff00`.
     */
    ColorModel.prototype.getColor = function (model, def) {
        if (!model || model === 'named') {
            return this.getColorByName(def);
        }
        return this.normalizeColor(model, def);
    };
    /**
     * Get a named color.
     *
     * @param {string} name The color name e.g. `darkblue`.
     * @return {string} The color definition in CSS format e.g. `#44ff00`.
     *
     * To retain backward compatilbity with MathJax v2 this method returns
     * unknown as-is, this is useful for both passing through CSS format colors like `#ff0`,
     * or even standard CSS color names that this plugin is unaware of.
     *
     * In TeX format, this would help to let `\textcolor{#f80}{\text{Orange}}` show an
     * orange word.
     */
    ColorModel.prototype.getColorByName = function (name) {
        if (this.userColors.has(name)) {
            return this.userColors.get(name);
        }
        if (IconConstants_js_1.COLORS.has(name)) {
            return IconConstants_js_1.COLORS.get(name);
        }
        // Pass the color name as-is to CSS
        return name;
    };
    /**
     * Create a new user-defined color.
     *
     * This color is local to the parser, so another MathJax parser won't be poluted.
     *
     * @param {string} model The coloring model type: e.g. `rgb`, `RGB` or `gray`.
     * @param {string} name The color name: `darkblue`.
     * @param {string} def The color definition in the color model format: `128,0,255`.
     */
    ColorModel.prototype.defineColor = function (model, name, def) {
        var normalized = this.normalizeColor(model, def);
        this.userColors.set(name, normalized);
    };
    return ColorModel;
}());
exports.ColorModel = ColorModel;
/**
 * Get an rgb color.
 *
 * @param {OptionList} parserOptions The parser options object.
 * @param {string} rgb The color definition in rgb: `0.5,0,1`.
 * @return {string} The color definition in CSS format e.g. `#44ff00`.
 */
ColorModelProcessors.set('rgb', function (rgb) {
    var e_1, _a;
    var rgbParts = rgb.trim().split(/\s*,\s*/);
    var RGB = '#';
    if (rgbParts.length !== 3) {
        throw new TexError_js_1.default('ModelArg1', 'Color values for the %1 model require 3 numbers', 'rgb');
    }
    try {
        for (var rgbParts_1 = tslib_1.__values(rgbParts), rgbParts_1_1 = rgbParts_1.next(); !rgbParts_1_1.done; rgbParts_1_1 = rgbParts_1.next()) {
            var rgbPart = rgbParts_1_1.value;
            if (!rgbPart.match(/^(\d+(\.\d*)?|\.\d+)$/)) {
                throw new TexError_js_1.default('InvalidDecimalNumber', 'Invalid decimal number');
            }
            var n = parseFloat(rgbPart);
            if (n < 0 || n > 1) {
                throw new TexError_js_1.default('ModelArg2', 'Color values for the %1 model must be between %2 and %3', 'rgb', '0', '1');
            }
            var pn = Math.floor(n * 255).toString(16);
            if (pn.length < 2) {
                pn = '0' + pn;
            }
            RGB += pn;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (rgbParts_1_1 && !rgbParts_1_1.done && (_a = rgbParts_1.return)) _a.call(rgbParts_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return RGB;
});
/**
 * Get an RGB color.
 *
 * @param {OptionList} parserOptions The parser options object.
 * @param {string} rgb The color definition in RGB: `128,0,255`.
 * @return {string} The color definition in CSS format e.g. `#44ff00`.
 */
ColorModelProcessors.set('RGB', function (rgb) {
    var e_2, _a;
    var rgbParts = rgb.trim().split(/\s*,\s*/);
    var RGB = '#';
    if (rgbParts.length !== 3) {
        throw new TexError_js_1.default('ModelArg1', 'Color values for the %1 model require 3 numbers', 'RGB');
    }
    try {
        for (var rgbParts_2 = tslib_1.__values(rgbParts), rgbParts_2_1 = rgbParts_2.next(); !rgbParts_2_1.done; rgbParts_2_1 = rgbParts_2.next()) {
            var rgbPart = rgbParts_2_1.value;
            if (!rgbPart.match(/^\d+$/)) {
                throw new TexError_js_1.default('InvalidNumber', 'Invalid number');
            }
            var n = parseInt(rgbPart);
            if (n > 255) {
                throw new TexError_js_1.default('ModelArg2', 'Color values for the %1 model must be between %2 and %3', 'RGB', '0', '255');
            }
            var pn = n.toString(16);
            if (pn.length < 2) {
                pn = '0' + pn;
            }
            RGB += pn;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (rgbParts_2_1 && !rgbParts_2_1.done && (_a = rgbParts_2.return)) _a.call(rgbParts_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return RGB;
});
/**
 * Get a gray-scale value.
 *
 * @param {OptionList} parserOptions The parser options object.
 * @param {string} gray The color definition in RGB: `0.5`.
 * @return {string} The color definition in CSS format e.g. `#808080`.
 */
ColorModelProcessors.set('gray', function (gray) {
    if (!gray.match(/^\s*(\d+(\.\d*)?|\.\d+)\s*$/)) {
        throw new TexError_js_1.default('InvalidDecimalNumber', 'Invalid decimal number');
    }
    var n = parseFloat(gray);
    if (n < 0 || n > 1) {
        throw new TexError_js_1.default('ModelArg2', 'Color values for the %1 model must be between %2 and %3', 'gray', '0', '1');
    }
    var pn = Math.floor(n * 255).toString(16);
    if (pn.length < 2) {
        pn = '0' + pn;
    }
    return "#".concat(pn).concat(pn).concat(pn);
});
//# sourceMappingURL=IconUtil.js.map