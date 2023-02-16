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
exports.default = ArrayMethods;
//# sourceMappingURL=ArrayMethods.js.map