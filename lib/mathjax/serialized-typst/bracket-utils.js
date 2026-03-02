"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeLrOpenDelimiter = exports.mapDelimiter = exports.markUnpairedBrackets = exports.replaceUnpairedBrackets = exports.serializePrefixBeforeMo = exports.treeContainsMo = exports.delimiterToTypst = void 0;
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
var lrOpenEscapeMap = {
    '(': '\\(',
    ')': '\\)',
    '[': '\\[',
    '{': '\\{',
    '}': '\\}',
};
var delimiterToTypst = function (delim) {
    switch (delim) {
        case '(': return '"("';
        case ')': return '")"';
        case '[': return '"["';
        case ']': return '"]"';
        case '{': return '"{"';
        case '}': return '"}"';
        case '|': return '"|"';
        case '\u2016': return '"\u2016"'; // double vertical bar ‖
        case '\u2225': return '"\u2016"'; // parallel → ‖
        default: return '"' + delim + '"';
    }
};
exports.delimiterToTypst = delimiterToTypst;
var treeContainsMo = function (node, moText, skipPhantom) {
    var e_1, _a;
    if (skipPhantom === void 0) { skipPhantom = true; }
    if (!node)
        return false;
    if (skipPhantom && node.kind === 'mphantom')
        return false;
    if (node.kind === 'mo') {
        var text = (0, common_1.getNodeText)(node);
        if (text === moText)
            return true;
    }
    if (node.childNodes) {
        try {
            for (var _b = tslib_1.__values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if ((0, exports.treeContainsMo)(child, moText, skipPhantom))
                    return true;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return false;
};
exports.treeContainsMo = treeContainsMo;
// Serialize all visible content in a node subtree up to (but not including)
// the first mo with the given text. Returns the serialized prefix.
var serializePrefixBeforeMo = function (node, serialize, stopMoText) {
    var e_2, _a;
    // Walk the mtd → inferredMrow → mpadded chain to find the flat math children
    var flatChildren = [];
    var extractFlat = function (n) {
        var e_3, _a;
        if (!n || !n.childNodes)
            return;
        if (n.kind === 'mphantom')
            return;
        if (n.kind === 'mtd' || n.kind === 'mpadded' || n.kind === 'mstyle' || n.isInferred) {
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
            if (child.kind === 'mo' && (0, common_1.getNodeText)(child) === stopMoText) {
                break;
            }
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
// Replace unpaired brackets in a matrix/cases cell with Typst symbol names.
// Brackets that have a matching open/close pair in the same cell are kept as-is.
// Escaped brackets (\[), brackets inside quoted strings ("..."), and brackets
// inside function-call parens (e.g. frac(...)) are ignored.
var replaceUnpairedBrackets = function (expr) {
    var e_4, _a, e_5, _b, e_6, _c;
    if (!consts_1.RE_BRACKET_CHARS.test(expr))
        return expr;
    var brackets = [];
    for (var i = 0; i < expr.length; i++) {
        var ch = expr[i];
        if (ch === '\\') {
            i++;
            continue;
        } // skip backslash-escaped
        // Skip quoted strings
        if (ch === '"') {
            i++;
            while (i < expr.length && expr[i] !== '"') {
                if (expr[i] === '\\')
                    i++; // skip escaped char in string
                i++;
            }
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
                        i++;
                        while (i < expr.length && expr[i] !== '"') {
                            if (expr[i] === '\\')
                                i++;
                            i++;
                        }
                    }
                    else if (expr[i] === '(')
                        depth++;
                    else if (expr[i] === ')')
                        depth--;
                    if (depth > 0)
                        i++;
                }
                // i now points to the closing ), skip it
                continue;
            }
            brackets.push({ char: ch, pos: i });
        }
    }
    var unmatched = new Set();
    try {
        for (var _d = tslib_1.__values(Object.entries(consts_1.OPEN_BRACKETS)), _e = _d.next(); !_e.done; _e = _d.next()) {
            var _f = tslib_1.__read(_e.value, 2), open_1 = _f[0], close_1 = _f[1];
            var stack = [];
            try {
                for (var brackets_1 = (e_5 = void 0, tslib_1.__values(brackets)), brackets_1_1 = brackets_1.next(); !brackets_1_1.done; brackets_1_1 = brackets_1.next()) {
                    var b = brackets_1_1.value;
                    if (b.char === open_1) {
                        stack.push(b.pos);
                    }
                    else if (b.char === close_1) {
                        if (stack.length > 0) {
                            stack.pop(); // matched
                        }
                        else {
                            unmatched.add(b.pos); // unmatched close
                        }
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (brackets_1_1 && !brackets_1_1.done && (_b = brackets_1.return)) _b.call(brackets_1);
                }
                finally { if (e_5) throw e_5.error; }
            }
            try {
                // Any remaining in stack are unmatched opens
                for (var stack_1 = (e_6 = void 0, tslib_1.__values(stack)), stack_1_1 = stack_1.next(); !stack_1_1.done; stack_1_1 = stack_1.next()) {
                    var pos = stack_1_1.value;
                    unmatched.add(pos);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (stack_1_1 && !stack_1_1.done && (_c = stack_1.return)) _c.call(stack_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
        }
        finally { if (e_4) throw e_4.error; }
    }
    if (unmatched.size === 0)
        return expr;
    var result = '';
    for (var i = 0; i < expr.length; i++) {
        if (unmatched.has(i)) {
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
    var bracketNodes = [];
    // Check if an mo node is a \left...\right delimiter (first/last child of
    // an mrow with texClass=INNER and open/close properties).  These must NOT
    // participate in pairing — otherwise \right] would pair with an inner [.
    var isLeftRightDelimiter = function (moNode) {
        var parent = moNode.parent;
        if (!parent || parent.kind !== 'mrow')
            return false;
        if (parent.getProperty('texClass') !== MmlNode_1.TEXCLASS.INNER)
            return false;
        if (parent.getProperty('open') === undefined && parent.getProperty('close') === undefined)
            return false;
        var ch = parent.childNodes;
        if (!ch || ch.length === 0)
            return false;
        return ch[0] === moNode || ch[ch.length - 1] === moNode;
    };
    var walk = function (node) {
        var e_7, _a;
        if (!node)
            return;
        if (node.kind === 'mo') {
            var text = (0, common_1.getNodeText)(node);
            if (text && (consts_1.OPEN_BRACKETS[text] || consts_1.CLOSE_BRACKETS[text])) {
                // Skip \left...\right delimiters — they are handled by the mrow handler
                if (!isLeftRightDelimiter(node)) {
                    bracketNodes.push({ node: node, char: text });
                }
            }
        }
        if (node.childNodes) {
            try {
                for (var _b = tslib_1.__values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    walk(child);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
    };
    walk(root);
    // STRICT stack pairing: closing bracket matches ONLY the top of the stack
    var stack = [];
    var paired = new Set();
    for (var i = 0; i < bracketNodes.length; i++) {
        var ch = bracketNodes[i].char;
        if (consts_1.OPEN_BRACKETS[ch]) {
            stack.push(i);
        }
        else if (consts_1.CLOSE_BRACKETS[ch]) {
            if (stack.length > 0) {
                var topIdx = stack[stack.length - 1];
                if (bracketNodes[topIdx].char === consts_1.CLOSE_BRACKETS[ch]) {
                    paired.add(topIdx);
                    paired.add(i);
                    stack.pop();
                }
                // Top doesn't match → do NOT search deeper, leave both unpaired
            }
        }
    }
    for (var i = 0; i < bracketNodes.length; i++) {
        if (!paired.has(i)) {
            var ch = bracketNodes[i].char;
            bracketNodes[i].node.setProperty(consts_1.UNPAIRED_BRACKET_PROP, consts_1.OPEN_BRACKETS[ch] ? 'open' : 'close');
        }
    }
};
exports.markUnpairedBrackets = markUnpairedBrackets;
var mapDelimiter = function (delim) {
    var mapped = typst_symbol_map_1.typstSymbolMap.get(delim);
    if (mapped) {
        return mapped;
    }
    return delim;
};
exports.mapDelimiter = mapDelimiter;
var escapeLrOpenDelimiter = function (delim) {
    if (lrOpenEscapeMap[delim])
        return lrOpenEscapeMap[delim];
    var mapped = typst_symbol_map_1.typstSymbolMap.get(delim);
    if (mapped)
        return mapped;
    return delim;
};
exports.escapeLrOpenDelimiter = escapeLrOpenDelimiter;
//# sourceMappingURL=bracket-utils.js.map