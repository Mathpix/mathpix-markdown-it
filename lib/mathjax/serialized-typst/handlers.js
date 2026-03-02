"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
var common_1 = require("./common");
var token_handlers_1 = require("./token-handlers");
var script_handlers_1 = require("./script-handlers");
var structural_handlers_1 = require("./structural-handlers");
var table_handlers_1 = require("./table-handlers");
var defaultHandler = function (node, serialize) { return (0, common_1.handleAll)(node, serialize); };
var isHandlerKind = function (k) { return k in handlers; };
var handlers = {
    mi: token_handlers_1.mi,
    mo: token_handlers_1.mo,
    mn: token_handlers_1.mn,
    mfrac: script_handlers_1.mfrac,
    msup: script_handlers_1.msup,
    msub: script_handlers_1.msub,
    msubsup: script_handlers_1.msubsup,
    msqrt: script_handlers_1.msqrt,
    mover: script_handlers_1.mover,
    munder: script_handlers_1.munder,
    munderover: script_handlers_1.munderover,
    mmultiscripts: script_handlers_1.mmultiscripts,
    mspace: token_handlers_1.mspace,
    mtext: token_handlers_1.mtext,
    mtable: table_handlers_1.mtable,
    mrow: structural_handlers_1.mrow,
    mtr: table_handlers_1.mtr,
    mpadded: structural_handlers_1.mpadded,
    mroot: script_handlers_1.mroot,
    menclose: structural_handlers_1.menclose,
    mstyle: structural_handlers_1.mstyle,
    mphantom: structural_handlers_1.mphantom,
};
var handle = function (node, serialize) {
    var kind = node.kind;
    var handler = isHandlerKind(kind) ? handlers[kind] : defaultHandler;
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