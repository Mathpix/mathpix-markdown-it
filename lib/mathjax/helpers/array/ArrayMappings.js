"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sm = require("mathjax-full/js/input/tex/SymbolMap.js");
var ParseMethods_js_2 = require("mathjax-full/js/input/tex/ParseMethods.js");
var ArrayMethods_1 = require("./ArrayMethods");
/**
 * Environments from the Array package.
 */
new sm.EnvironmentMap('array-environment', ParseMethods_js_2.default.environment, {
    array: ['AlignedArray']
}, ArrayMethods_1.default);
//# sourceMappingURL=ArrayMappings.js.map