"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeLrDelimiter = exports.mapDelimiter = exports.markUnpairedBrackets = exports.replaceUnpairedBrackets = exports.findUnpairedIndices = exports.scanBracketTokens = exports.serializePrefixBeforeMo = exports.treeContainsMo = exports.delimiterToTypst = void 0;
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
/** Check whether ( at position i is a syntactic paren (not a math delimiter).
 *  True when preceded by:
 *  - ASCII letter: function call — sqrt(, frac(
 *  - dot + ASCII letter: method call — arrow.r(
 *  - _ or ^: subscript/superscript grouping — _(x + y), ^(n)
 *  Unicode letters (л, α) are math variables, not calls.
 *  Digits before ( are mathematical grouping (.4(), not a call. */
var isSyntaxParen = function (expr, i) {
    var prev = expr[i - 1];
    return consts_1.RE_ASCII_LETTER.test(prev)
        || (prev === '.' && i > 1 && consts_1.RE_ASCII_LETTER.test(expr[i - 2]))
        || prev === '_' || prev === '^';
};
/** Scan a Typst expression and collect bracket positions, skipping escaped chars,
 *  quoted strings, and syntax parens (function calls, subscript/superscript grouping). */
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
            // Skip syntax parens: function calls (sqrt(), frac()), method calls
            // (arrow.r()), and script grouping (_(), ^()).  Digits before ( are
            // NOT syntax — .4( is mathematical grouping, not a call.
            if (ch === '(' && i > 0 && isSyntaxParen(expr, i)) {
                var openPos = i;
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
                // If no matching ) found, this is not a real function call —
                // register the ( and backtrack so the for-loop re-scans the
                // range from openPos+1, picking up any [, ], {, } inside.
                if (depth > 0) {
                    brackets.push({ char: '(', pos: openPos });
                    i = openPos; // for-loop i++ → openPos+1
                }
                continue;
            }
            brackets.push({ char: ch, pos: i });
        }
    }
    return brackets;
};
exports.scanBracketTokens = scanBracketTokens;
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
exports.findUnpairedIndices = findUnpairedIndices;
// Replace unpaired brackets in a matrix/cases cell with Typst symbol names.
// Brackets that have a matching open/close pair in the same cell are kept as-is.
// Escaped brackets (\[), brackets inside quoted strings ("..."), and brackets
// inside function-call parens (e.g. frac(...)) are ignored.
var replaceUnpairedBrackets = function (expr) {
    var e_4, _a;
    if (!consts_1.RE_BRACKET_CHARS.test(expr))
        return expr;
    var brackets = (0, exports.scanBracketTokens)(expr);
    var unpairedTokenIndices = (0, exports.findUnpairedIndices)(brackets.map(function (b) { return b.char; }));
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
            // Symbol names (paren.l, bracket.r, …) are Typst identifiers —
            // they must be space-separated from any adjacent non-whitespace.
            if (result.length > 0 && !consts_1.RE_TRAILING_WS.test(result)) {
                result += ' ';
            }
            result += sym;
            if (i + 1 < expr.length && !consts_1.RE_LEADING_WS.test(expr[i + 1])) {
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
// Nodes whose Typst handlers wrap ALL children in function calls (sqrt(), frac(),
// cancel(), overline(), underline(), hat(), etc.).  Brackets inside these nodes
// cannot pair with brackets outside — each child is processed as a separate scope.
var SCOPE_BOUNDARIES = new Set([
    'msqrt', 'mroot', 'mfrac', 'menclose', 'mover', 'munder',
]);
// Nodes where the base (child[0]) stays in the parent scope but script children
// (sub/sup) are separate scopes.  The base of msub/msup is in the same visual
// scope as surrounding content (e.g. (a+b)^2 → ) is the base of msup and must
// pair with ( outside).  But script children are wrapped in ^(…) / _(…), so
// brackets inside scripts cannot pair with brackets outside.
var SCRIPT_SCOPE_KINDS = new Set([
    'msub', 'msup', 'msubsup',
]);
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
        var e_6, _a, e_7, _b;
        var _c, _d, _e;
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
            for (var _f = tslib_1.__values(((_c = node.childNodes) !== null && _c !== void 0 ? _c : [])), _g = _f.next(); !_g.done; _g = _f.next()) {
                var child = _g.value;
                if (SCOPE_BOUNDARIES.has(child.kind)) {
                    try {
                        // Each child of the scope boundary is a separate scope
                        for (var _h = (e_7 = void 0, tslib_1.__values(((_d = child.childNodes) !== null && _d !== void 0 ? _d : []))), _j = _h.next(); !_j.done; _j = _h.next()) {
                            var grandchild = _j.value;
                            (0, exports.markUnpairedBrackets)(grandchild);
                        }
                    }
                    catch (e_7_1) { e_7 = { error: e_7_1 }; }
                    finally {
                        try {
                            if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
                        }
                        finally { if (e_7) throw e_7.error; }
                    }
                }
                else if (SCRIPT_SCOPE_KINDS.has(child.kind)) {
                    // Base (child[0]) stays in parent scope; script children are separate
                    var kids = (_e = child.childNodes) !== null && _e !== void 0 ? _e : [];
                    if (kids[0])
                        walk(kids[0]);
                    for (var k = 1; k < kids.length; k++) {
                        (0, exports.markUnpairedBrackets)(kids[k]);
                    }
                }
                else {
                    walk(child);
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    walk(root);
    var unpairedIndices = (0, exports.findUnpairedIndices)(bracketNodes.map(function (b) { return b.char; }));
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