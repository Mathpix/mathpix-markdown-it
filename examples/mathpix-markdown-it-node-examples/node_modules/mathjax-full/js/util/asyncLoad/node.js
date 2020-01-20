"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mathjax_js_1 = require("../../mathjax.js");
var root = __dirname.replace(/\/[^\/]*\/[^\/]*$/, '/');
if (!mathjax_js_1.mathjax.asyncLoad && typeof require !== 'undefined') {
    mathjax_js_1.mathjax.asyncLoad = function (name) {
        return require(name.charAt(0) === '.' ? root + name : name);
    };
}
//# sourceMappingURL=node.js.map