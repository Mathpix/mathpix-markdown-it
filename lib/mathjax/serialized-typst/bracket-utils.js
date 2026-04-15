"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeLrDelimiter = exports.mapDelimiter = exports.clearUnpairedBracketMarks = exports.markUnpairedBrackets = exports.replaceUnpairedBrackets = exports.findUnpairedIndices = exports.scanBracketTokens = exports.treeContainsMo = exports.delimiterToTypst = void 0;
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
// Function wrappers (sqrt, frac, etc.): brackets inside cannot pair with outside.
// mtr/mlabeledtr: each cell (mtd) is a separate scope — brackets cannot pair
// across cells or rows, preventing orphaned brackets in aligned/mat() output.
// mphantom/mpadded: content is wrapped in #hide($...$) / #highlight[$...$] —
// brackets inside the wrapped $...$ must pair within it, else they end up
// unmatched across the wrapping boundary in the Typst output.
var SCOPE_BOUNDARIES = new Set([
    'msqrt', 'mroot', 'mfrac', 'menclose', 'mover', 'munder', 'munderover',
    'mphantom', 'mpadded',
    'mtr', 'mlabeledtr',
    'mstyle',
]);
// Nodes where the base (child[0]) stays in the parent scope but script children
// (sub/sup) are separate scopes.  The base of msub/msup is in the same visual
// scope as surrounding content (e.g. (a+b)^2 → ) is the base of msup and must
// pair with ( outside).  But script children are wrapped in ^(…) / _(…), so
// brackets inside scripts cannot pair with brackets outside.
var SCRIPT_SCOPE_KINDS = new Set([
    'msub', 'msup', 'msubsup',
]);
/** Skip past a quoted string starting at position i (the opening ").
 *  Returns the index of the closing " or end of string. */
var skipQuotedString = function (expr, i) {
    i++;
    while (i < expr.length && expr[i] !== '"') {
        if (expr[i] === '\\') {
            i++;
        }
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
    if (!node) {
        return false;
    }
    if (skipPhantom && node.kind === 'mphantom') {
        return false;
    }
    if (node.kind === 'mo' && (0, common_1.getNodeText)(node) === moText) {
        return true;
    }
    try {
        for (var _c = tslib_1.__values(((_b = node.childNodes) !== null && _b !== void 0 ? _b : [])), _d = _c.next(); !_d.done; _d = _c.next()) {
            var child = _d.value;
            if ((0, exports.treeContainsMo)(child, moText, skipPhantom)) {
                return true;
            }
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
                    else if (expr[i] === '(') {
                        depth++;
                    }
                    else if (expr[i] === ')') {
                        depth--;
                    }
                    if (depth > 0) {
                        i++;
                    }
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
    // Start with all bracket indices as unpaired; remove when matched
    var unpaired = new Set();
    for (var i = 0; i < chars.length; i++) {
        var ch = chars[i];
        if (consts_1.OPEN_BRACKETS[ch]) {
            unpaired.add(i);
            stack.push(i);
        }
        else if (consts_1.CLOSE_BRACKETS[ch]) {
            unpaired.add(i);
            if (stack.length > 0) {
                var topIdx = stack[stack.length - 1];
                if (chars[topIdx] === consts_1.CLOSE_BRACKETS[ch]) {
                    unpaired.delete(topIdx);
                    unpaired.delete(i);
                    stack.pop();
                }
            }
        }
    }
    return unpaired;
};
exports.findUnpairedIndices = findUnpairedIndices;
// Replace unpaired brackets in a matrix/cases cell with Typst symbol names.
// Brackets that have a matching open/close pair in the same cell are kept as-is.
// Escaped brackets (\[), brackets inside quoted strings ("..."), and brackets
// inside function-call parens (e.g. frac(...)) are ignored.
var replaceUnpairedBrackets = function (expr) {
    var e_2, _a;
    if (!consts_1.RE_BRACKET_CHARS.test(expr)) {
        return expr;
    }
    var brackets = (0, exports.scanBracketTokens)(expr);
    var unpairedTokenIndices = (0, exports.findUnpairedIndices)(brackets.map(function (b) { return b.char; }));
    var unmatchedPositions = new Set();
    try {
        for (var unpairedTokenIndices_1 = tslib_1.__values(unpairedTokenIndices), unpairedTokenIndices_1_1 = unpairedTokenIndices_1.next(); !unpairedTokenIndices_1_1.done; unpairedTokenIndices_1_1 = unpairedTokenIndices_1.next()) {
            var idx = unpairedTokenIndices_1_1.value;
            unmatchedPositions.add(brackets[idx].pos);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (unpairedTokenIndices_1_1 && !unpairedTokenIndices_1_1.done && (_a = unpairedTokenIndices_1.return)) _a.call(unpairedTokenIndices_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    if (unmatchedPositions.size === 0) {
        return expr;
    }
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
/** A mrow with open/close properties (from \left...\right) is a scope
 *  boundary for bracket pairing — inner brackets must not pair with outer
 *  ones. Otherwise \left( [ x \right) would pair [ inside with ] outside,
 *  leaving an unclosed [ in the serialized lr() body. */
var isLeftRightScope = function (node) {
    if (node.kind !== 'mrow') {
        return false;
    }
    if ((0, common_1.getProp)(node, 'texClass') !== MmlNode_1.TEXCLASS.INNER) {
        return false;
    }
    return (0, common_1.getProp)(node, 'open') !== undefined
        || (0, common_1.getProp)(node, 'close') !== undefined;
};
var markUnpairedBrackets = function (root, inTableCell) {
    var e_3, _a;
    if (inTableCell === void 0) { inTableCell = false; }
    var bracketNodes = [];
    // Check if an mo node is a \left...\right delimiter (first/last child of
    // an mrow with texClass=INNER and open/close properties).  These must NOT
    // participate in pairing — otherwise \right] would pair with an inner [.
    var isLeftRightDelimiter = function (moNode) {
        var parent = moNode.parent;
        if (!parent || !isLeftRightScope(parent)) {
            return false;
        }
        var ch = parent.childNodes;
        if (!ch || ch.length === 0) {
            return false;
        }
        return ch[0] === moNode || ch[ch.length - 1] === moNode;
    };
    var walk = function (node) {
        var e_4, _a, e_5, _b;
        var _c, _d, _e;
        if (!node) {
            return;
        }
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
                    // Each child of the scope boundary is a separate scope.
                    // mtable: each row is separate; brackets can't pair across rows.
                    var childInMatrix = child.kind === 'mtr' || child.kind === 'mlabeledtr' || inTableCell;
                    try {
                        for (var _h = (e_5 = void 0, tslib_1.__values(((_d = child.childNodes) !== null && _d !== void 0 ? _d : []))), _j = _h.next(); !_j.done; _j = _h.next()) {
                            var grandchild = _j.value;
                            (0, exports.markUnpairedBrackets)(grandchild, childInMatrix);
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                }
                else if (isLeftRightScope(child)) {
                    // mrow from \left...\right: inner brackets pair only within this mrow,
                    // not with outer siblings. Run markUnpairedBrackets on the whole mrow
                    // as a single scope (NOT per-grandchild — tokens inside form ONE expression).
                    (0, exports.markUnpairedBrackets)(child, inTableCell);
                }
                else if (SCRIPT_SCOPE_KINDS.has(child.kind)) {
                    // Base (child[0]) stays in parent scope; script children are separate.
                    // Exception: opening bracket as script base (e.g. [^{\circ}) must be
                    // excluded — in Typst [^(compose) C] the [ starts auto-matching and
                    // the ^ inside has no base, causing a parse error.
                    var kids = (_e = child.childNodes) !== null && _e !== void 0 ? _e : [];
                    if (kids[0]) {
                        walk(kids[0]);
                    }
                    for (var k = 1; k < kids.length; k++) {
                        (0, exports.markUnpairedBrackets)(kids[k], inTableCell);
                    }
                }
                else {
                    walk(child);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    walk(root);
    var unpairedIndices = (0, exports.findUnpairedIndices)(bracketNodes.map(function (b) { return b.char; }));
    try {
        for (var unpairedIndices_1 = tslib_1.__values(unpairedIndices), unpairedIndices_1_1 = unpairedIndices_1.next(); !unpairedIndices_1_1.done; unpairedIndices_1_1 = unpairedIndices_1.next()) {
            var i = unpairedIndices_1_1.value;
            var ch = bracketNodes[i].char;
            var dir = consts_1.OPEN_BRACKETS[ch] ? 'open' : 'close';
            // In table cell context, use 'table-open'/'table-close' so moAst uses symbol
            // names (paren.l, bracket.l, brace.l) instead of escaped forms (\(, \[, \{).
            bracketNodes[i].node.setProperty(consts_1.UNPAIRED_BRACKET_PROP, inTableCell ? 'table-' + dir : dir);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (unpairedIndices_1_1 && !unpairedIndices_1_1.done && (_a = unpairedIndices_1.return)) _a.call(unpairedIndices_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
};
exports.markUnpairedBrackets = markUnpairedBrackets;
/** Remove data-unpaired-bracket properties set by markUnpairedBrackets.
 *  Call after Typst serialization to avoid leaking state to other visitors. */
var clearUnpairedBracketMarks = function (root) {
    var walk = function (node) {
        var e_6, _a;
        if (!node) {
            return;
        }
        if ((0, common_1.getProp)(node, consts_1.UNPAIRED_BRACKET_PROP) !== undefined) {
            node.removeProperty(consts_1.UNPAIRED_BRACKET_PROP);
        }
        if (node.childNodes) {
            try {
                for (var _b = tslib_1.__values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    walk(child);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
    };
    walk(root);
};
exports.clearUnpairedBracketMarks = clearUnpairedBracketMarks;
var mapDelimiter = function (delim) { var _a; return (_a = typst_symbol_map_1.typstSymbolMap.get(delim)) !== null && _a !== void 0 ? _a : delim; };
exports.mapDelimiter = mapDelimiter;
/** Map delimiter for use inside lr(): apply lr-specific escapes first,
 *  then fall back to typstSymbolMap, then return as-is. */
var escapeLrDelimiter = function (delim) { var _a, _b; return (_b = (_a = LR_DELIMITER_ESCAPE_MAP[delim]) !== null && _a !== void 0 ? _a : typst_symbol_map_1.typstSymbolMap.get(delim)) !== null && _b !== void 0 ? _b : delim; };
exports.escapeLrDelimiter = escapeLrDelimiter;
//# sourceMappingURL=bracket-utils.js.map