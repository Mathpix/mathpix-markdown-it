"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hardBreak = exports.softBreak = void 0;
/**
 * Replacing the default rules to ignore insertion of line breaks after hidden tokens.
 * Hidden tokens do not participate in rendering
 * */
var softBreak = function (tokens, idx, options /*, env */) {
    var beforeToken = idx - 1 < 0 ? null : tokens[idx - 1];
    if (beforeToken && beforeToken.hidden) {
        return '';
    }
    if (tokens[idx].hidden) {
        return tokens[idx].showSpace
            ? ' '
            : tokens[idx].showLineBreak
                ? '\n'
                : '';
    }
    if (options.forPptx) {
        return options.breaks ? (options.xhtmlOut ? '<br /><span class="br-break"></span>\n' : '<br><span class="br-break"></span>\n') : '\n';
    }
    return options.breaks ? (options.xhtmlOut ? '<br />\n' : '<br>\n') : '\n';
};
exports.softBreak = softBreak;
var hardBreak = function (tokens, idx, options /*, env */) {
    var beforeToken = idx - 1 < 0 ? null : tokens[idx - 1];
    if (beforeToken && beforeToken.hidden) {
        return '';
    }
    if (options.forPptx) {
        return options.xhtmlOut ? '<br /><span class="br-break"></span>\n' : '<br><span class="br-break"></span>\n';
    }
    return options.xhtmlOut ? '<br />\n' : '<br>\n';
};
exports.hardBreak = hardBreak;
//# sourceMappingURL=breaks.js.map