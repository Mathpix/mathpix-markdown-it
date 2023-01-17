"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hardBreak = exports.softBreak = void 0;
/**
 * Replacing the default rules to ignore insertion of line breaks after hidden tokens.
 * Hidden tokens do not participate in rendering
 * */
exports.softBreak = function (tokens, idx, options /*, env */) {
    var beforeToken = idx - 1 < 0 ? null : tokens[idx - 1];
    if (beforeToken && beforeToken.hidden) {
        return '';
    }
    return options.breaks ? (options.xhtmlOut ? '<br />\n' : '<br>\n') : '\n';
};
exports.hardBreak = function (tokens, idx, options /*, env */) {
    var beforeToken = idx - 1 < 0 ? null : tokens[idx - 1];
    if (beforeToken && beforeToken.hidden) {
        return '';
    }
    return options.xhtmlOut ? '<br />\n' : '<br>\n';
};
//# sourceMappingURL=breaks.js.map