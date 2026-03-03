"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
var common_1 = require("./common");
var token_handlers_1 = require("./token-handlers");
var script_handlers_1 = require("./script-handlers");
var structural_handlers_1 = require("./structural-handlers");
var table_handlers_1 = require("./table-handlers");
var handlers = {
    mi: token_handlers_1.mi,
    mo: token_handlers_1.mo,
    mn: token_handlers_1.mn,
    mtext: token_handlers_1.mtext,
    mspace: token_handlers_1.mspace,
    mfrac: script_handlers_1.mfrac,
    msup: script_handlers_1.msup,
    msub: script_handlers_1.msub,
    msubsup: script_handlers_1.msubsup,
    msqrt: script_handlers_1.msqrt,
    mroot: script_handlers_1.mroot,
    mover: script_handlers_1.mover,
    munder: script_handlers_1.munder,
    munderover: script_handlers_1.munderover,
    mmultiscripts: script_handlers_1.mmultiscripts,
    mrow: structural_handlers_1.mrow,
    mpadded: structural_handlers_1.mpadded,
    mphantom: structural_handlers_1.mphantom,
    menclose: structural_handlers_1.menclose,
    mstyle: structural_handlers_1.mstyle,
    mtable: table_handlers_1.mtable,
    mtr: table_handlers_1.mtr,
};
// Keys are exactly HandlerKind at compile time; Set<string> for cast-free runtime guard
var HANDLER_KIND_SET = new Set(Object.keys(handlers));
var isHandlerKind = function (k) { return HANDLER_KIND_SET.has(k); };
/**
 * Top-level dispatch: route a MathML node to the appropriate handler.
 * Guards against unexpected handler errors — logs a warning and returns
 * empty output so the rest of the expression can still be serialized.
 */
var handle = function (node, serialize) {
    var kind = node.kind;
    var handler = isHandlerKind(kind) ? handlers[kind] : common_1.handleAll;
    try {
        return handler(node, serialize);
    }
    catch (e) {
        if (typeof console !== 'undefined' && console.warn) {
            console.warn("[typst-serializer] handler error for \"".concat(kind || 'unknown', "\":"), e);
        }
        return (0, common_1.initTypstData)();
    }
};
exports.handle = handle;
//# sourceMappingURL=handlers.js.map