"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includegraphicsTagB = exports.includegraphicsTag = exports.endTag = void 0;
var endTag = function (arg) {
    return new RegExp('\\\\end\s{0,}\{(' + arg + ')\}');
};
exports.endTag = endTag;
exports.includegraphicsTag = /\\includegraphics\s*(?:\[(.*?)\]\s*)?\{([^}]*)\}/s;
exports.includegraphicsTagB = /^\\includegraphics\s*(?:\[(.*?)\]\s*)?\{([^}]*)\}/s;
//# sourceMappingURL=utils.js.map