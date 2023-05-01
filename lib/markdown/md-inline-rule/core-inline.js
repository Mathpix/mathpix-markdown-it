"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreInline = void 0;
var tslib_1 = require("tslib");
/** Top-level inline rule executor
 * Replace inline core rule
 *
 * By default the state.env that is passed to the inline parser only has the latest values.
 * We add this rule to be able to pass the current variables (obtained during block parsing) to the inline parser.
 * This is necessary to match labels with the current block.
 * */
exports.coreInline = function (state) {
    var tokens = state.tokens;
    var token;
    var currentTag = {};
    // Parse inlines
    for (var i = 0; i < tokens.length; i++) {
        token = tokens[i];
        if (token.currentTag) {
            currentTag = token.currentTag;
        }
        if (token.type === 'inline') {
            state.md.inline.parse(token.content, state.md, Object.assign({}, tslib_1.__assign({}, state.env), {
                currentTag: currentTag,
            }), token.children);
        }
    }
};
//# sourceMappingURL=core-inline.js.map