"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textCollapse = void 0;
// Clean up tokens after emphasis and strikethrough postprocessing:
// merge adjacent text nodes into one and re-calculate all token levels
//
// This is necessary because initially emphasis delimiter markers (*, _, ~)
// are treated as their own separate text tokens. Then emphasis rule either
// leaves them as text (needed to merge with adjacent text) or turns them
// into opening/closing tags (which messes up levels inside).
//
exports.textCollapse = function (state) {
    var _a;
    var curr, last, level = 0, tokens = state.tokens, max = state.tokens.length;
    for (curr = last = 0; curr < max; curr++) {
        // re-calculate levels after emphasis/strikethrough turns some text nodes
        // into opening/closing tags
        if (tokens[curr].nesting < 0)
            level--; // closing tag
        tokens[curr].level = level;
        if (tokens[curr].nesting > 0)
            level++; // opening tag
        if (tokens[curr].type === 'text' &&
            curr + 1 < max &&
            tokens[curr + 1].type === 'text') {
            if (tokens[curr].hasOwnProperty('nextPos') && !tokens[curr + 1].hasOwnProperty('nextPos')) {
                tokens[curr + 1].nextPos = tokens[curr].nextPos + ((_a = tokens[curr + 1].content) === null || _a === void 0 ? void 0 : _a.length);
            }
            // collapse two adjacent text nodes
            tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
        }
        else {
            if (curr !== last) {
                tokens[last] = tokens[curr];
            }
            last++;
        }
    }
    if (curr !== last) {
        tokens.length = last;
    }
};
//# sourceMappingURL=text-collapse.js.map