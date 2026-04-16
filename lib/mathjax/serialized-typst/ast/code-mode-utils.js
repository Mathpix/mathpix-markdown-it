"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsBlockCodeFunc = void 0;
var consts_1 = require("../consts");
/** Check if a node contains a block-level code-mode function (#math.equation,
 *  #grid). These break math flow when placed inside math wrappers (lr(), $...$,
 *  frac(), sqrt(), etc.) or alongside other math content.
 *
 *  Recurses ONLY into SeqNode children. Does NOT descend into FuncCall.args /
 *  FuncCall.body / Delimited.body — those subtrees were built by handlers that
 *  already processed their children via serialize.visitNode, which auto-converts
 *  block-code to inline. By the time we receive a built FuncCall/Delimited,
 *  no block-code can remain in its descendants. */
var containsBlockCodeFunc = function (node) {
    if (node.type === 'func' && node.hash && consts_1.BLOCK_CODE_FUNCS.has(node.name)) {
        return true;
    }
    if (node.type === 'seq') {
        return node.children.some(exports.containsBlockCodeFunc);
    }
    return false;
};
exports.containsBlockCodeFunc = containsBlockCodeFunc;
//# sourceMappingURL=code-mode-utils.js.map