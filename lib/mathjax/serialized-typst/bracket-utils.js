"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeLrDelimiter = exports.mapDelimiter = exports.markUnpairedBrackets = exports.replaceUnpairedBrackets = exports.serializePrefixBeforeMo = exports.treeContainsMo = exports.delimiterToTypst = void 0;
var tslib_1 = require("tslib");
var MmlNode_1 = require("mathjax-full/js/core/MmlTree/MmlNode");
var consts_1 = require("./consts");
var common_1 = require("./common");
var typst_symbol_map_1 = require("./typst-symbol-map");
var BRACKET_SYMBOL_MAP = {
    '[': 'bracket.l',
    ']': 'bracket.r',
    '(': 'paren.l',
    ')': 'paren.r',
    '{': 'brace.l',
    '}': 'brace.r',
};
// Escape delimiters that cause parse errors inside lr() when unpaired.
// All ASCII brackets except ] are escaped: ( and [ open groups/content blocks,
// ) closes the lr() function call prematurely, { and } are code block syntax.
// ] is left unescaped so lr() can recognise and auto-size it as a delimiter.
var LR_DELIMITER_ESCAPE_MAP = {
    '(': '\\(',
    ')': '\\)',
    '[': '\\[',
    '{': '\\{',
    '}': '\\}',
};
// Delimiter → Typst string literal mapping for explicit delimiter arguments
var DELIMITER_LITERAL_MAP = (_a = {
        '(': '"("',
        ')': '")"',
        '[': '"["',
        ']': '"]"',
        '{': '"{"',
        '}': '"}"',
        '|': '"|"'
    },
    _a[consts_1.DOUBLE_VERT] = "\"".concat(consts_1.DOUBLE_VERT, "\""),
    _a[consts_1.PARALLEL_SIGN] = "\"".concat(consts_1.DOUBLE_VERT, "\""),
    _a);
// Container kinds that should be flattened when walking to find direct math children
var FLATTENABLE_CONTAINER_KINDS = new Set([
    'mtd', 'mpadded', 'mstyle',
]);
var shouldFlattenNode = function (n) {
    return FLATTENABLE_CONTAINER_KINDS.has(n.kind) || n.isInferred;
};
/** Skip past a quoted string starting at position i (the opening ").
 *  Returns the index of the closing " or end of string. */
var skipQuotedString = function (expr, i) {
    i++;
    while (i < expr.length && expr[i] !== '"') {
        if (expr[i] === '\\')
            i++;
        i++;
    }
    return i;
};
// Delimiter is always a single Unicode char (safe for unescaped Typst string literal)
var delimiterToTypst = function (delim) { var _a; return (_a = DELIMITER_LITERAL_MAP[delim]) !== null && _a !== void 0 ? _a : "\"".concat(delim, "\""); };
exports.delimiterToTypst = delimiterToTypst;
var treeContainsMo = function (node, moText, skipPhantom) {
    var e_1, _a;
    var _b;
    if (skipPhantom === void 0) { skipPhantom = true; }
    if (!node)
        return false;
    if (skipPhantom && node.kind === 'mphantom')
        return false;
    if (node.kind === 'mo' && (0, common_1.getNodeText)(node) === moText)
        return true;
    try {
        for (var _c = tslib_1.__values(((_b = node.childNodes) !== null && _b !== void 0 ? _b : [])), _d = _c.next(); !_d.done; _d = _c.next()) {
            var child = _d.value;
            if ((0, exports.treeContainsMo)(child, moText, skipPhantom))
                return true;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
};
exports.treeContainsMo = treeContainsMo;
// Serialize all visible content in a node subtree up to (but not including)
// the first mo with the given text. Returns the serialized prefix (block variant only).
var serializePrefixBeforeMo = function (node, serialize, stopMoText) {
    var e_2, _a;
    var flatChildren = [];
    var extractFlat = function (n) {
        var e_3, _a;
        if (!n || !n.childNodes)
            return;
        if (n.kind === 'mphantom')
            return;
        if (shouldFlattenNode(n)) {
            try {
                for (var _b = tslib_1.__values(n.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    extractFlat(child);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        else {
            flatChildren.push(n);
        }
    };
    extractFlat(node);
    var result = '';
    try {
        for (var flatChildren_1 = tslib_1.__values(flatChildren), flatChildren_1_1 = flatChildren_1.next(); !flatChildren_1_1.done; flatChildren_1_1 = flatChildren_1.next()) {
            var child = flatChildren_1_1.value;
            if (child.kind === 'mo' && (0, common_1.getNodeText)(child) === stopMoText)
                break;
            var data = serialize.visitNode(child, '');
            result += data.typst;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (flatChildren_1_1 && !flatChildren_1_1.done && (_a = flatChildren_1.return)) _a.call(flatChildren_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return result.trim();
};
exports.serializePrefixBeforeMo = serializePrefixBeforeMo;
/** Scan a Typst expression and collect bracket positions, skipping escaped chars,
 *  quoted strings, and function-call parens (preceded by word char or dot). */
var scanBracketTokens = function (expr) {
    var brackets = [];
    for (var i = 0; i < expr.length; i++) {
        var ch = expr[i];
        if (ch === '\\') {
            i++;
            continue;
        }
        if (ch === '"') {
            i = skipQuotedString(expr, i);
            continue;
        }
        if (consts_1.RE_BRACKET_CHARS.test(ch)) {
            // Skip function-call parens (preceded by word char or .)
            if (ch === '(' && i > 0 && consts_1.RE_WORD_DOT_END.test(expr[i - 1])) {
                var depth = 1;
                i++;
                while (i < expr.length && depth > 0) {
                    if (expr[i] === '\\') {
                        i++;
                    }
                    else if (expr[i] === '"') {
                        i = skipQuotedString(expr, i);
                    }
                    else if (expr[i] === '(')
                        depth++;
                    else if (expr[i] === ')')
                        depth--;
                    if (depth > 0)
                        i++;
                }
                continue;
            }
            brackets.push({ char: ch, pos: i });
        }
    }
    return brackets;
};
/** Strict stack pairing: a closing bracket matches ONLY the corresponding open
 *  at the top of the stack. On mismatch the top stays in the stack and the
 *  closing bracket is left unpaired — both sides remain unmatched.
 *  Returns the set of indices (into the chars array) that are unpaired. */
var findUnpairedIndices = function (chars) {
    var stack = [];
    var paired = new Set();
    for (var i = 0; i < chars.length; i++) {
        var ch = chars[i];
        if (consts_1.OPEN_BRACKETS[ch]) {
            stack.push(i);
        }
        else if (consts_1.CLOSE_BRACKETS[ch]) {
            if (stack.length > 0) {
                var topIdx = stack[stack.length - 1];
                if (chars[topIdx] === consts_1.CLOSE_BRACKETS[ch]) {
                    paired.add(topIdx);
                    paired.add(i);
                    stack.pop();
                }
            }
        }
    }
    var unpaired = new Set();
    for (var i = 0; i < chars.length; i++) {
        if (!paired.has(i))
            unpaired.add(i);
    }
    return unpaired;
};
// Replace unpaired brackets in a matrix/cases cell with Typst symbol names.
// Brackets that have a matching open/close pair in the same cell are kept as-is.
// Escaped brackets (\[), brackets inside quoted strings ("..."), and brackets
// inside function-call parens (e.g. frac(...)) are ignored.
var replaceUnpairedBrackets = function (expr) {
    var e_4, _a;
    if (!consts_1.RE_BRACKET_CHARS.test(expr))
        return expr;
    var brackets = scanBracketTokens(expr);
    var unpairedTokenIndices = findUnpairedIndices(brackets.map(function (b) { return b.char; }));
    var unmatchedPositions = new Set();
    try {
        for (var unpairedTokenIndices_1 = tslib_1.__values(unpairedTokenIndices), unpairedTokenIndices_1_1 = unpairedTokenIndices_1.next(); !unpairedTokenIndices_1_1.done; unpairedTokenIndices_1_1 = unpairedTokenIndices_1.next()) {
            var idx = unpairedTokenIndices_1_1.value;
            unmatchedPositions.add(brackets[idx].pos);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (unpairedTokenIndices_1_1 && !unpairedTokenIndices_1_1.done && (_a = unpairedTokenIndices_1.return)) _a.call(unpairedTokenIndices_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    if (unmatchedPositions.size === 0)
        return expr;
    var result = '';
    for (var i = 0; i < expr.length; i++) {
        if (unmatchedPositions.has(i)) {
            var sym = BRACKET_SYMBOL_MAP[expr[i]];
            if (result.length > 0 && consts_1.RE_WORD_DOT_END.test(result[result.length - 1])) {
                result += ' ';
            }
            result += sym;
            if (i + 1 < expr.length && consts_1.RE_WORD_CHAR.test(expr[i + 1])) {
                result += ' ';
            }
        }
        else {
            result += expr[i];
        }
    }
    return result;
};
exports.replaceUnpairedBrackets = replaceUnpairedBrackets;
var markUnpairedBrackets = function (root) {
    var e_5, _a;
    var bracketNodes = [];
    // Check if an mo node is a \left...\right delimiter (first/last child of
    // an mrow with texClass=INNER and open/close properties).  These must NOT
    // participate in pairing — otherwise \right] would pair with an inner [.
    var isLeftRightDelimiter = function (moNode) {
        var parent = moNode.parent;
        if (!parent || parent.kind !== 'mrow')
            return false;
        if ((0, common_1.getProp)(parent, 'texClass') !== MmlNode_1.TEXCLASS.INNER)
            return false;
        if ((0, common_1.getProp)(parent, 'open') === undefined && (0, common_1.getProp)(parent, 'close') === undefined)
            return false;
        var ch = parent.childNodes;
        if (!ch || ch.length === 0)
            return false;
        return ch[0] === moNode || ch[ch.length - 1] === moNode;
    };
    var walk = function (node) {
        var e_6, _a;
        var _b;
        if (!node)
            return;
        if (node.kind === 'mo') {
            var text = (0, common_1.getNodeText)(node);
            if (text && (consts_1.OPEN_BRACKETS[text] || consts_1.CLOSE_BRACKETS[text])) {
                if (!isLeftRightDelimiter(node)) {
                    bracketNodes.push({ node: node, char: text });
                }
            }
        }
        try {
            for (var _c = tslib_1.__values(((_b = node.childNodes) !== null && _b !== void 0 ? _b : [])), _d = _c.next(); !_d.done; _d = _c.next()) {
                var child = _d.value;
                walk(child);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    walk(root);
    var unpairedIndices = findUnpairedIndices(bracketNodes.map(function (b) { return b.char; }));
    try {
        for (var unpairedIndices_1 = tslib_1.__values(unpairedIndices), unpairedIndices_1_1 = unpairedIndices_1.next(); !unpairedIndices_1_1.done; unpairedIndices_1_1 = unpairedIndices_1.next()) {
            var i = unpairedIndices_1_1.value;
            var ch = bracketNodes[i].char;
            bracketNodes[i].node.setProperty(consts_1.UNPAIRED_BRACKET_PROP, consts_1.OPEN_BRACKETS[ch] ? 'open' : 'close');
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (unpairedIndices_1_1 && !unpairedIndices_1_1.done && (_a = unpairedIndices_1.return)) _a.call(unpairedIndices_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
};
exports.markUnpairedBrackets = markUnpairedBrackets;
var mapDelimiter = function (delim) { var _a; return (_a = typst_symbol_map_1.typstSymbolMap.get(delim)) !== null && _a !== void 0 ? _a : delim; };
exports.mapDelimiter = mapDelimiter;
/** Map delimiter for use inside lr(): apply lr-specific escapes first,
 *  then fall back to typstSymbolMap, then return as-is. */
var escapeLrDelimiter = function (delim) { var _a, _b; return (_b = (_a = LR_DELIMITER_ESCAPE_MAP[delim]) !== null && _a !== void 0 ? _a : typst_symbol_map_1.typstSymbolMap.get(delim)) !== null && _b !== void 0 ? _b : delim; };
exports.escapeLrDelimiter = escapeLrDelimiter;
//# sourceMappingURL=bracket-utils.js.map