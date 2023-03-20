"use strict";
/**
 * @fileoverview The Array Parse methods.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var BaseMethods_js_2 = require("mathjax-full/js/input/tex/base/BaseMethods.js");
var ParseUtil_js_1 = require("mathjax-full/js/input/tex/ParseUtil.js");
// Namespace
var ArrayMethods = BaseMethods_js_2.default;
/**
 * Replace the AlignedArray method to set the name attribute which points to the environment
 * */
ArrayMethods.AlignedArray = function (parser, begin) {
    var envName = begin.getName();
    var align = parser.GetBrackets('\\begin{' + envName + '}');
    var item = BaseMethods_js_2.default.Array(parser, begin);
    if (item.hasOwnProperty('arraydef')) {
        item.arraydef['name'] = envName;
    }
    else {
        item['arraydef'] = {
            name: envName
        };
    }
    return ParseUtil_js_1.default.setArrayAlign(item, align);
};
/**
 * Replace the AmsMethods.AmsEqnArray method to set the name attribute which points to the environment.
 * Used for aligned, gathered
 * */
ArrayMethods.AmsEqnArray = function (parser, begin, numbered, taggable, align, spacing, style) {
    var envName = begin.getName();
    var args = parser.GetBrackets('\\begin{' + envName + '}');
    var array = BaseMethods_js_2.default.EqnArray(parser, begin, numbered, taggable, align, spacing, style);
    if (array.hasOwnProperty('arraydef')) {
        array.arraydef['name'] = envName;
    }
    else {
        array['arraydef'] = {
            name: envName
        };
    }
    return ParseUtil_js_1.default.setArrayAlign(array, args);
};
exports.default = ArrayMethods;
//# sourceMappingURL=ArrayMethods.js.map