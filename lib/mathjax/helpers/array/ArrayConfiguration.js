"use strict";
/**
 * Configuration file for the Array package.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayConfiguration = void 0;
var Configuration_js_1 = require("mathjax-full/js/input/tex/Configuration.js");
require("./ArrayMappings");
exports.ArrayConfiguration = Configuration_js_1.Configuration.create('array', {
    handler: {
        environment: ['array-environment']
    }
});
//# sourceMappingURL=ArrayConfiguration.js.map