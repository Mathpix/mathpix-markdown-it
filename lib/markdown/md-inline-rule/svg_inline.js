"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svg_inline = void 0;
var consts_1 = require("../common/consts");
function extractFullSVGContent(html) {
    var regex = /<svg\b[^>]*>|<\/svg>/gi; // Match opening and closing <svg> tags
    var match;
    var stack = []; // Stack to track opening <svg> tags
    var matches = []; // Store full matched <svg> elements
    while ((match = regex.exec(html)) !== null) {
        if (match[0].startsWith('<svg')) {
            // Found an opening <svg> tag, push its position to the stack
            stack.push(match.index);
        }
        else if (match[0].startsWith('</svg>')) {
            // Found a closing </svg> tag
            if (stack.length > 0) {
                var start = stack.pop(); // Pop the last opening <svg> position from the stack
                if (stack.length === 0) {
                    // When the stack is empty, it means we've found a full <svg> block
                    var fullSvg = html.slice(start, regex.lastIndex); // Extract the full <svg> content
                    matches.push(fullSvg); // Store the full matched <svg>
                }
            }
        }
    }
    return matches;
}
var svg_inline = function (state, silent) {
    var max, pos = state.pos;
    if (!state.md.options.html) {
        return false;
    }
    // Check start
    max = state.posMax;
    if (state.src.charCodeAt(pos) !== 0x3C /* < */ ||
        pos + 2 >= max) {
        return false;
    }
    var match = state.src
        .slice(pos)
        .match(consts_1.svgInlineRegex);
    if (!match) {
        return false;
    }
    var matchedSVGs = extractFullSVGContent(state.src
        .slice(pos));
    if (!(matchedSVGs === null || matchedSVGs === void 0 ? void 0 : matchedSVGs.length)) {
        return false;
    }
    if (!silent) {
        var token = state.push('html_inline', '', 0);
        token.content = state.src.slice(pos, pos + matchedSVGs[0].length);
        token.isSvg = true;
    }
    state.pos += matchedSVGs[0].length;
    return true;
};
exports.svg_inline = svg_inline;
//# sourceMappingURL=svg_inline.js.map