"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includegraphicsTagB = exports.includegraphicsTag = exports.endTag = void 0;
exports.endTag = function (arg) {
    return new RegExp('\\\\end\s{0,}\{(' + arg + ')\}');
};
exports.includegraphicsTag = /\\includegraphics\s{0,}\[?([^}]*)\]?\s{0,}\{([^}]*)\}/;
exports.includegraphicsTagB = /^\\includegraphics\s{0,}\[?([^}]*)\]?\s{0,}\{([^}]*)\}/;
//# sourceMappingURL=utils.js.map