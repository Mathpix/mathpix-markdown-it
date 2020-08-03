"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextWidth = exports.endTag = void 0;
exports.endTag = function (arg) {
    return new RegExp('\\\\end\s{0,}\{(' + arg + ')\}');
};
exports.getTextWidth = function () {
    var el_container = document ? document.getElementById('container-ruller') : null;
    return el_container ? el_container.offsetWidth : 800;
};
//# sourceMappingURL=utils.js.map