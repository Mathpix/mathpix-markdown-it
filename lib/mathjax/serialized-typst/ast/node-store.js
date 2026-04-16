"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.astNodeStore = void 0;
/** Side-channel for storing AST nodes alongside MathML nodes.
 *  MathML setProperty only accepts string | number | boolean,
 *  so we use a WeakMap keyed by the MathML node instead. */
exports.astNodeStore = new WeakMap();
//# sourceMappingURL=node-store.js.map