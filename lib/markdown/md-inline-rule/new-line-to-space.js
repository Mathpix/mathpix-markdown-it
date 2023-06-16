"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newlineToSpace = void 0;
var isSpace = require('markdown-it/lib/common/utils').isSpace;
exports.newlineToSpace = function (state, silent) {
    var pmax, max, pos = state.pos;
    if (state.src.charCodeAt(pos) !== 0x0A /* \n */) {
        return false;
    }
    if (!state.env.newlineToSpace) {
        return false;
    }
    pmax = state.pending.length - 1;
    max = state.posMax;
    // '  \n' -> hardbreak
    // Lookup in pending chars is bad practice! Don't copy to other rules!
    // Pending string is stored in concat mode, indexed lookups will cause
    // convertion to flat mode.
    var token = null;
    if (!silent) {
        if (pmax >= 0 && state.pending.charCodeAt(pmax) === 0x20) {
            if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 0x20) {
                state.pending = state.pending.replace(/ +$/, '');
                token = state.push('flatNewLine', '', 0);
            }
            else {
                state.pending = state.pending.slice(0, -1);
                token = state.push('flatNewLine', '', 0);
            }
        }
        else {
            token = state.push('flatNewLine', '', 0);
        }
    }
    pos++;
    // skip heading spaces for next line
    while (pos < max && isSpace(state.src.charCodeAt(pos))) {
        pos++;
    }
    state.pos = pos;
    if (token) {
        token.nextPos = pos;
    }
    return true;
};
//# sourceMappingURL=new-line-to-space.js.map