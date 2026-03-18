"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomCmdTypst = exports.getCustomCmdUnicode = exports.customCmdMap = void 0;
exports.customCmdMap = {
    Varangle: { unicode: '\u2222', typst: 'angle.spheric' },
    llbracket: { unicode: '\u27E6', typst: 'bracket.l.stroked' },
    rrbracket: { unicode: '\u27E7', typst: 'bracket.r.stroked' }, // ⟧ right double bracket
};
/** Lookup Unicode replacement for a custom command. Returns undefined if not found. */
var getCustomCmdUnicode = function (cmd) { var _a; return (_a = exports.customCmdMap[cmd]) === null || _a === void 0 ? void 0 : _a.unicode; };
exports.getCustomCmdUnicode = getCustomCmdUnicode;
/** Lookup Typst replacement for a custom command. Returns undefined if not found. */
var getCustomCmdTypst = function (cmd) { var _a; return (_a = exports.customCmdMap[cmd]) === null || _a === void 0 ? void 0 : _a.typst; };
exports.getCustomCmdTypst = getCustomCmdTypst;
//# sourceMappingURL=custom-cmd-map.js.map