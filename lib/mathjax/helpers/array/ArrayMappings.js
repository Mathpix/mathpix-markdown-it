"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sm = require("mathjax-full/js/input/tex/SymbolMap.js");
var ParseMethods_js_2 = require("mathjax-full/js/input/tex/ParseMethods.js");
var ParseUtil_js_1 = require("mathjax-full/js/input/tex/ParseUtil.js");
var ArrayMethods_1 = require("./ArrayMethods");
/**
 * Copied from /mathjax-full/ts/input/tex/ams/AmsMappings.ts
 */
var COLS = function (W) {
    var WW = [];
    for (var i = 0, m = W.length; i < m; i++) {
        WW[i] = ParseUtil_js_1.default.Em(W[i]);
    }
    return WW.join(' ');
};
/**
 * Environments from the Array package.
 */
new sm.EnvironmentMap('array-environment', ParseMethods_js_2.default.environment, {
    array: ['AlignedArray'],
    gathered: ['AmsEqnArray', null, null, null, 'c', null, '.5em', 'D'],
    aligned: ['AmsEqnArray', null, null, null, 'rlrlrlrlrlrl',
        COLS([0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0]), '.5em', 'D'],
}, ArrayMethods_1.default);
//# sourceMappingURL=ArrayMappings.js.map