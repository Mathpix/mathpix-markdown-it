"use strict";
/**
 * Unified expression scanner for Typst escape operations.
 *
 * Walks a Typst expression tracking bracket depth, skips quoted strings ("...")
 * and backslash-escaped characters, applies escape/detection at depth 0.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeUnbalancedParens = exports.escapeLrBrackets = exports.escapeLrSemicolons = exports.hasTopLevelSeparators = exports.escapeCasesSeparators = exports.escapeContentSeparators = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("./consts");
var bracket_utils_1 = require("./bracket-utils");
var SEPARATOR_FOUND = 'found';
/**
 * Walk a Typst expression tracking bracket depth, skipping quoted strings
 * and backslash-escaped characters. Apply escape/detection per opts.
 *
 * In detectOnly mode: returns '' if no separator found, or SEPARATOR_FOUND on first hit.
 * In transform mode: returns the escaped expression string.
 */
var isDetectMode = function (opts) {
    return opts.detectOnly === true;
};
var scanExpression = function (expr, opts) {
    var detectOnly = isDetectMode(opts);
    var escapeComma = !detectOnly && !!opts.escapeComma;
    var escapeSemicolon = !detectOnly && !!opts.escapeSemicolon;
    var escapeColon = !detectOnly && !!opts.escapeColon;
    // Separate depth counters per bracket type to avoid cross-type mismatches
    var parenDepth = 0; // ()
    var bracketDepth = 0; // []
    var braceDepth = 0; // {}
    var result = '';
    for (var i = 0; i < expr.length; i++) {
        var ch = expr[i];
        // Skip quoted strings: copy "..." verbatim (unclosed quote consumes to end)
        if (ch === '"') {
            var j = i + 1;
            while (j < expr.length) {
                if (expr[j] === '\\') {
                    j += 2;
                    continue;
                }
                if (expr[j] === '"')
                    break;
                j++;
            }
            var end = j < expr.length ? j : expr.length - 1;
            if (!detectOnly) {
                result += expr.slice(i, end + 1);
            }
            i = end;
            continue;
        }
        // Skip backslash-escaped chars: \, \; \( \) \[ \] \{ \} etc.
        if (ch === '\\' && i + 1 < expr.length) {
            if (!detectOnly) {
                result += ch + expr[i + 1];
            }
            i++;
            continue;
        }
        if (ch === '(') {
            parenDepth++;
            if (!detectOnly)
                result += ch;
            continue;
        }
        if (ch === '[') {
            bracketDepth++;
            if (!detectOnly)
                result += ch;
            continue;
        }
        if (ch === '{') {
            braceDepth++;
            if (!detectOnly)
                result += ch;
            continue;
        }
        if (ch === ')') {
            if (parenDepth > 0)
                parenDepth--;
            if (!detectOnly)
                result += ch;
            continue;
        }
        if (ch === ']') {
            if (bracketDepth > 0)
                bracketDepth--;
            if (!detectOnly)
                result += ch;
            continue;
        }
        if (ch === '}') {
            if (braceDepth > 0)
                braceDepth--;
            if (!detectOnly)
                result += ch;
            continue;
        }
        var isTopLevel = parenDepth === 0 && bracketDepth === 0 && braceDepth === 0;
        if (isTopLevel) {
            if (ch === ',' && (escapeComma || detectOnly)) {
                if (detectOnly)
                    return SEPARATOR_FOUND;
                result += '\\,';
                continue;
            }
            if (ch === ';' && (escapeSemicolon || detectOnly)) {
                if (detectOnly)
                    return SEPARATOR_FOUND;
                result += '\\;';
                continue;
            }
            if (ch === ':' && escapeColon) {
                // Check the preceding char in the source expression, not the transformed result,
                // so other transformations cannot affect colon-spacing logic
                if (i > 0 && consts_1.RE_WORD_CHAR.test(expr[i - 1])) {
                    result += ' :';
                }
                else {
                    result += ':';
                }
                continue;
            }
        }
        if (!detectOnly) {
            result += ch;
        }
    }
    return detectOnly ? '' : result;
};
/** Escape unpaired [ and ] with backslash to prevent Typst content-block syntax.
 *  Reuses scanBracketTokens (which skips quoted strings, escaped chars, and
 *  function-call parens) and findUnpairedIndices from bracket-utils. */
var escapeUnpairedBrackets = function (expr) {
    var e_1, _a;
    if (expr.indexOf('[') === -1 && expr.indexOf(']') === -1)
        return expr;
    var allBrackets = (0, bracket_utils_1.scanBracketTokens)(expr);
    var squareBrackets = allBrackets.filter(function (b) { return b.char === '[' || b.char === ']'; });
    if (squareBrackets.length === 0)
        return expr;
    var unpairedTokenIndices = (0, bracket_utils_1.findUnpairedIndices)(squareBrackets.map(function (b) { return b.char; }));
    if (unpairedTokenIndices.size === 0)
        return expr;
    var unpairedPositions = new Set();
    try {
        for (var unpairedTokenIndices_1 = tslib_1.__values(unpairedTokenIndices), unpairedTokenIndices_1_1 = unpairedTokenIndices_1.next(); !unpairedTokenIndices_1_1.done; unpairedTokenIndices_1_1 = unpairedTokenIndices_1.next()) {
            var idx = unpairedTokenIndices_1_1.value;
            unpairedPositions.add(squareBrackets[idx].pos);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (unpairedTokenIndices_1_1 && !unpairedTokenIndices_1_1.done && (_a = unpairedTokenIndices_1.return)) _a.call(unpairedTokenIndices_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var result = '';
    for (var i = 0; i < expr.length; i++) {
        if (unpairedPositions.has(i)) {
            result += '\\' + expr[i];
        }
        else {
            result += expr[i];
        }
    }
    return result;
};
/** Escape , ; and : at depth 0, and unpaired [ ] in content placed inside any Typst function call.
 *  Uses backslash escapes (\, \;) and space-before-colon (word: → word :) to prevent
 *  Typst from parsing as argument separators or named arguments.
 *  Skips content inside "..." strings and already-escaped sequences. */
var escapeContentSeparators = function (expr) {
    return scanExpression(escapeUnpairedBrackets(expr), { escapeComma: true, escapeSemicolon: true, escapeColon: true });
};
exports.escapeContentSeparators = escapeContentSeparators;
/** Escape , ; and : at depth 0 — for mat()/cases() cells where : is also a named-argument marker.
 *  For colons: inserts space before : when preceded by identifier.
 *  Also replaces unpaired brackets with Typst symbol names (bracket.l etc.). */
var escapeCasesSeparators = function (expr) {
    return scanExpression((0, bracket_utils_1.replaceUnpairedBrackets)(expr), { escapeComma: true, escapeSemicolon: true, escapeColon: true });
};
exports.escapeCasesSeparators = escapeCasesSeparators;
/** Check whether a Typst expression contains , or ; at top level (outside (), [] and {}).
 *  Skips content inside "..." strings (handles escaped quotes). */
var hasTopLevelSeparators = function (expr) {
    return scanExpression(expr, { detectOnly: true }) === SEPARATOR_FOUND;
};
exports.hasTopLevelSeparators = hasTopLevelSeparators;
/** Escape top-level ; → \; and colons after identifiers (word :) inside lr() content.
 *  Commas are safe in lr.  Skips content inside "..." strings and backslash-escaped chars. */
var escapeLrSemicolons = function (expr) {
    return scanExpression(expr, { escapeSemicolon: true, escapeColon: true });
};
exports.escapeLrSemicolons = escapeLrSemicolons;
/** Escape inner bracket characters inside lr() content so Typst doesn't auto-scale them.
 *  lr() auto-scales ALL unescaped delimiters inside it, but \left...\right only scales
 *  its own pair.  `chars` specifies which bracket characters to escape (defaults to all).
 *  Reuses scanBracketTokens which skips syntax parens (function calls, subscript/
 *  superscript grouping), quoted strings, and already-escaped chars. */
var escapeLrBrackets = function (expr, chars) {
    var e_2, _a;
    if (!consts_1.RE_BRACKET_CHARS.test(expr))
        return expr;
    var brackets = (0, bracket_utils_1.scanBracketTokens)(expr);
    if (brackets.length === 0)
        return expr;
    var positions = new Set();
    try {
        for (var brackets_1 = tslib_1.__values(brackets), brackets_1_1 = brackets_1.next(); !brackets_1_1.done; brackets_1_1 = brackets_1.next()) {
            var b = brackets_1_1.value;
            if (!chars || chars.has(b.char)) {
                positions.add(b.pos);
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (brackets_1_1 && !brackets_1_1.done && (_a = brackets_1.return)) _a.call(brackets_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    if (positions.size === 0)
        return expr;
    var result = '';
    for (var i = 0; i < expr.length; i++) {
        if (positions.has(i)) {
            result += '\\' + expr[i];
        }
        else {
            result += expr[i];
        }
    }
    return result;
};
exports.escapeLrBrackets = escapeLrBrackets;
/** Escape unbalanced parentheses: ( → "(" and ) → ")".
 *  Prevents lone parens from being parsed as Typst syntax (group open/close)
 *  inside wrapping function calls like overline(), cancel(), etc.
 *  Uses scanBracketTokens (which skips syntax parens, quoted strings,
 *  and escaped chars) + findUnpairedIndices for reliable pairing. */
var escapeUnbalancedParens = function (content) {
    var e_3, _a;
    if (content.indexOf('(') === -1 && content.indexOf(')') === -1)
        return content;
    var allBrackets = (0, bracket_utils_1.scanBracketTokens)(content);
    var parens = allBrackets.filter(function (b) { return b.char === '(' || b.char === ')'; });
    if (parens.length === 0)
        return content;
    var unpairedTokenIndices = (0, bracket_utils_1.findUnpairedIndices)(parens.map(function (b) { return b.char; }));
    if (unpairedTokenIndices.size === 0)
        return content;
    var unpairedPositions = new Set();
    try {
        for (var unpairedTokenIndices_2 = tslib_1.__values(unpairedTokenIndices), unpairedTokenIndices_2_1 = unpairedTokenIndices_2.next(); !unpairedTokenIndices_2_1.done; unpairedTokenIndices_2_1 = unpairedTokenIndices_2.next()) {
            var idx = unpairedTokenIndices_2_1.value;
            unpairedPositions.add(parens[idx].pos);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (unpairedTokenIndices_2_1 && !unpairedTokenIndices_2_1.done && (_a = unpairedTokenIndices_2.return)) _a.call(unpairedTokenIndices_2);
        }
        finally { if (e_3) throw e_3.error; }
    }
    var result = '';
    for (var i = 0; i < content.length; i++) {
        if (unpairedPositions.has(i)) {
            result += '\\' + content[i];
        }
        else {
            result += content[i];
        }
    }
    return result;
};
exports.escapeUnbalancedParens = escapeUnbalancedParens;
//# sourceMappingURL=escape-utils.js.map