"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAstSerializer = exports.dispatchFull = void 0;
var tslib_1 = require("tslib");
var MmlNode_js_1 = require("mathjax-full/js/core/MmlTree/MmlNode.js");
var types_1 = require("./types");
var builders_1 = require("./builders");
var serialize_1 = require("./serialize");
var common_1 = require("../common");
var consts_1 = require("../consts");
var code_mode_utils_1 = require("./code-mode-utils");
var custom_cmd_map_1 = require("../../custom-cmd-map");
var inferred_mrow_patterns_1 = require("../inferred-mrow-patterns");
var token_handlers_1 = require("./token-handlers");
var script_handlers_1 = require("./script-handlers");
var structural_handlers_1 = require("./structural-handlers");
var table_handlers_1 = require("./table-handlers");
var AST_HANDLERS = {
    mi: token_handlers_1.miAst,
    mo: token_handlers_1.moAst,
    mn: token_handlers_1.mnAst,
    mtext: token_handlers_1.mtextAst,
    mspace: token_handlers_1.mspaceAst,
    mfrac: script_handlers_1.mfracAst,
    msup: script_handlers_1.msupAst,
    msub: script_handlers_1.msubAst,
    msubsup: script_handlers_1.msubsupAst,
    msqrt: script_handlers_1.msqrtAst,
    mroot: script_handlers_1.mrootAst,
    mover: script_handlers_1.moverAst,
    munder: script_handlers_1.munderAst,
    munderover: script_handlers_1.munderoverAst,
    mmultiscripts: script_handlers_1.mmultiscriptsAst,
    mrow: structural_handlers_1.mrowAst,
    mpadded: structural_handlers_1.mpaddedAst,
    mphantom: structural_handlers_1.mphantomAst,
    menclose: structural_handlers_1.mencloseAst,
    mstyle: structural_handlers_1.mstyleAst,
    mtable: table_handlers_1.mtableAst,
    mtr: table_handlers_1.mtrAst,
};
var EMPTY_RESULT = {
    node: (0, builders_1.seq)([])
};
/** Build an error result with fallback text extracted from the MathML node.
 *  Returns the error message alongside the result for error collection. */
var makeError = function (node, kind, e) {
    var message = e instanceof Error ? e.message : String(e);
    var fallback = (0, common_1.getNodeText)(node) || '';
    return {
        result: { node: (0, builders_1.errorNode)(fallback, kind, message) },
        message: "[".concat(kind, "] ").concat(message),
    };
};
/** Dispatch a MathML node to its AST handler. Returns TypstMathResult (block + inline). */
var dispatchFull = function (node, serialize) {
    if (node instanceof MmlNode_js_1.TextNode) {
        return {
            node: (0, builders_1.symbol)(node.getText())
        };
    }
    if (node instanceof MmlNode_js_1.XMLNode) {
        return EMPTY_RESULT;
    }
    // Inferred mrow: full pattern matching (delimiters, idotsint, thousand seps, etc.)
    if (node.isInferred) {
        return visitInferredMrowAst(node, serialize);
    }
    // TeXAtom: custom commands or delegate to child
    if (node.kind === consts_1.TEX_ATOM) {
        return visitTeXAtomAst(node, serialize);
    }
    var handler = AST_HANDLERS[node.kind];
    if (handler) {
        try {
            return handler(node, serialize);
        }
        catch (e) {
            var err = makeError(node, node.kind, e);
            serialize.errors.push(err.message);
            return err.result;
        }
    }
    return handleAllAst(node, serialize);
};
exports.dispatchFull = dispatchFull;
/** TeXAtom: check for custom command, otherwise delegate to single child. */
var visitTeXAtomAst = function (node, serialize) {
    var _a, _b;
    try {
        var cmd = (_a = node.getProperty) === null || _a === void 0 ? void 0 : _a.call(node, 'data-custom-cmd');
        var customTypst = cmd ? (0, custom_cmd_map_1.getCustomCmdTypst)(cmd) : undefined;
        if (customTypst) {
            return {
                node: (0, builders_1.symbol)(customTypst)
            };
        }
        if (((_b = node.childNodes) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            return (0, exports.dispatchFull)(node.childNodes[0], serialize);
        }
        return EMPTY_RESULT;
    }
    catch (e) {
        var err = makeError(node, consts_1.TEX_ATOM, e);
        serialize.errors.push(err.message);
        return err.result;
    }
};
/** Serialize all children as a SeqNode (no pattern matching -- used for non-inferred containers). */
var handleAllAst = function (node, serialize) {
    var _a, _b;
    var blockChildren = [];
    var inlineChildren = [];
    var hasInlineDiff = false;
    var nodeChildren = (_a = node.childNodes) !== null && _a !== void 0 ? _a : [];
    for (var i = 0; i < nodeChildren.length; i++) {
        var result = (0, exports.dispatchFull)(nodeChildren[i], serialize);
        blockChildren.push(result.node);
        inlineChildren.push((_b = result.nodeInline) !== null && _b !== void 0 ? _b : result.node);
        if (result.nodeInline) {
            hasInlineDiff = true;
        }
    }
    if (hasInlineDiff) {
        return {
            node: (0, builders_1.seq)(blockChildren),
            nodeInline: (0, builders_1.seq)(inlineChildren)
        };
    }
    return {
        node: (0, builders_1.seq)(blockChildren)
    };
};
/**
 * Inferred mrow with pattern matching. Order matters:
 *
 * 1. Big delimiters — before bare delimiters: \bigl( is TeXAtom(sized mo),
 *    not a bare mo. If bare ran first, it would miss the sizing.
 * 2. Bare delimiters — before normal mo: groups |..|→lr(), ⌈⌉→ceil() etc.
 *    for correct subscript attachment (norm(x)_2 vs ‖x‖_2).
 * 3. \idotsint — before normal: ∫⋯∫ with scripts is 3 siblings that must
 *    be merged into lr(integral dots.c integral) with shared scripts.
 * 4. Thousand separators — before comma becomes operator: 1,000→1\,000.
 * 5. Combining chains — before mi: consecutive non-Latin mi→text("merged").
 * 6. Tagged eqnArray — consumes all remaining siblings (pre/post content).
 * 7. \not overlay — wraps next sibling in cancel().
 */
var visitInferredMrowAst = function (node, serialize) {
    var _a, _b, _c;
    var children = (_a = node.childNodes) !== null && _a !== void 0 ? _a : [];
    var blockNodes = [];
    var inlineNodes = [];
    var hasInlineDiff = false;
    /** Push a node that is identical for block and inline */
    var pushSame = function (n) {
        blockNodes.push(n);
        inlineNodes.push(n);
    };
    /** Push a full result (block + optional inline variant) */
    var pushResult = function (r) {
        var _a;
        blockNodes.push(r.node);
        inlineNodes.push((_a = r.nodeInline) !== null && _a !== void 0 ? _a : r.node);
        if (r.nodeInline) {
            hasInlineDiff = true;
        }
    };
    try {
        var j = 0;
        while (j < children.length) {
            var child = children[j];
            // Pattern 1: Big delimiter (\big, \Big, \bigg, \Bigg)
            var bigDelim = (0, inferred_mrow_patterns_1.tryBigDelimiterPattern)(node, j, serialize);
            if (bigDelim) {
                pushSame(bigDelim.node);
                j = bigDelim.nextJ;
                continue;
            }
            // Pattern 2: Bare delimiter pairing (|...|, floor, ceil, norm — no chevrons)
            var bareDelim = (0, inferred_mrow_patterns_1.tryBareDelimiterPattern)(node, j, serialize);
            if (bareDelim) {
                pushSame(bareDelim.node);
                j = bareDelim.nextJ;
                continue;
            }
            // Pattern 3: \idotsint (integral dots integral with scripts)
            var idotsint = (0, inferred_mrow_patterns_1.tryIdotsintPattern)(node, j, serialize);
            if (idotsint) {
                pushSame(idotsint.node);
                j = idotsint.nextJ;
                continue;
            }
            // Pattern 4: Thousand separator chain (1,000,000)
            var thousandSep = (0, inferred_mrow_patterns_1.tryThousandSepPattern)(node, j, serialize);
            if (thousandSep) {
                pushSame(thousandSep.node);
                j = thousandSep.nextJ;
                continue;
            }
            // Pattern 5: Combining-mark chain (Devanagari, Arabic, etc.)
            var combChain = (0, structural_handlers_1.tryCombiningMiChainAst)(node, j);
            if (combChain) {
                pushSame(combChain.node);
                j = combChain.nextIndex;
                continue;
            }
            // Pattern 6: Tagged eqnArray mtable with sibling content
            if ((0, inferred_mrow_patterns_1.isTaggedEqnArray)(child)) {
                // Build pre-content from accumulated block nodes
                var preNode = (0, builders_1.seq)(tslib_1.__spreadArray([], tslib_1.__read(blockNodes), false));
                var preStr = (0, serialize_1.serializeTypstMath)(preNode).trim();
                if (preStr) {
                    var store = (_b = types_1.astNodeStore.get(child)) !== null && _b !== void 0 ? _b : {};
                    store.preContent = preNode;
                    types_1.astNodeStore.set(child, store);
                    blockNodes.length = 0;
                    inlineNodes.length = 0;
                }
                // Build post-content from remaining children as typed AST nodes
                var postNodes = [];
                for (var k = j + 1; k < children.length; k++) {
                    postNodes.push(serialize.visitNode(children[k]));
                }
                if (postNodes.length > 0) {
                    var postNode = (0, builders_1.seq)(postNodes);
                    if ((0, serialize_1.serializeTypstMath)(postNode).trim()) {
                        var store = (_c = types_1.astNodeStore.get(child)) !== null && _c !== void 0 ? _c : {};
                        store.postContent = postNode;
                        types_1.astNodeStore.set(child, store);
                    }
                }
                pushResult(serialize.visitNodeFull(child));
                break;
            }
            // Pattern 7: \not negation overlay -- wrap next sibling in cancel()
            if ((0, common_1.isNegationOverlay)(child) && j + 1 < children.length) {
                var nextNode = serialize.visitNode(children[j + 1]);
                pushSame((0, builders_1.funcCall)('cancel', [(0, builders_1.posArg)((0, builders_1.mathVal)(nextNode))]));
                j += 2;
                continue;
            }
            // Normal processing -- via AST dispatcher (preserving block/inline split)
            pushResult(serialize.visitNodeFull(child));
            j++;
        }
    }
    catch (e) {
        var err = makeError(node, 'inferred-mrow', e);
        serialize.errors.push(err.message);
        blockNodes.push(err.result.node);
        inlineNodes.push(err.result.node);
    }
    if (hasInlineDiff) {
        // Block-level code-mode funcs (#align, #grid, #math.equation) with siblings
        // disrupt math flow. Use inline variants to keep everything in math mode.
        // Inline #box/#circle/#text/#highlight/#hide are safe and do NOT trigger this.
        if (blockNodes.length > 1) {
            var hasCodeModeBlock = false;
            for (var i = 0; i < blockNodes.length; i++) {
                if (blockNodes[i] !== inlineNodes[i] && (0, code_mode_utils_1.containsBlockCodeFunc)(blockNodes[i])) {
                    hasCodeModeBlock = true;
                    break;
                }
            }
            if (hasCodeModeBlock) {
                return {
                    node: (0, builders_1.seq)(inlineNodes),
                };
            }
        }
        return {
            node: (0, builders_1.seq)(blockNodes),
            nodeInline: (0, builders_1.seq)(inlineNodes)
        };
    }
    return {
        node: (0, builders_1.seq)(blockNodes)
    };
};
/**
 * Create a self-referencing ITypstMathSerializer that dispatches through the AST pipeline.
 * Children are returned as typed TypstMathNode, not raw(string).
 *
 * visitNode auto-prefers nodeInline when the block variant contains a block-level
 * code-mode function (#math.equation, #grid). Handlers that wrap children in math
 * constructs (frac, sqrt, lr, hat, hide, box, etc.) call visitNode and would
 * otherwise nest block-level constructs inside math wrappers — which Typst rejects.
 * Handlers that need both variants explicitly use visitNodeFull (mtable, mrow with
 * \left...\right, inferred mrow) and handle the block/inline split themselves.
 */
var createAstSerializer = function (labels) {
    if (labels === void 0) { labels = null; }
    var errors = [];
    var serialize = {
        visitNode: function (child) {
            var result = (0, exports.dispatchFull)(child, serialize);
            if (result.nodeInline && (0, code_mode_utils_1.containsBlockCodeFunc)(result.node)) {
                return result.nodeInline;
            }
            return result.node;
        },
        visitNodeFull: function (child) { return (0, exports.dispatchFull)(child, serialize); },
        labels: labels,
        errors: errors,
    };
    return serialize;
};
exports.createAstSerializer = createAstSerializer;
//# sourceMappingURL=dispatcher.js.map