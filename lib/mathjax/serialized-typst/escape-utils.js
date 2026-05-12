"use strict";
/**
 * Unified expression scanner for Typst escape operations.
 *
 * Walks a Typst expression tracking bracket depth, skips quoted strings ("...")
 * and backslash-escaped characters, applies escape/detection at depth 0.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeUnbalancedParens = exports.escapeLrBrackets = exports.escapeLrSemicolons = exports.hasTopLevelSeparators = exports.escapeMatrixRowSeparators = exports.escapeCasesSeparators = exports.escapeContentSeparators = exports.escapeUnbalancedBraces = exports.escapeUnpairedBrackets = void 0;
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
    var parts = [];
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
                if (expr[j] === '"') {
                    break;
                }
                j++;
            }
            // end = closing quote position, or last char if unclosed.
            // slice(i, end + 1) captures the full quoted segment (including both quotes).
            // Setting i = end lets the for-loop's i++ advance past the closing quote.
            var end = j < expr.length ? j : expr.length - 1;
            if (!detectOnly) {
                parts.push(expr.slice(i, end + 1));
            }
            i = end;
            continue;
        }
        // Skip backslash-escaped chars: \, \; \( \) \[ \] \{ \} etc.
        if (ch === '\\' && i + 1 < expr.length) {
            if (!detectOnly) {
                parts.push(ch, expr[i + 1]);
            }
            i++;
            continue;
        }
        if (ch === '(') {
            parenDepth++;
            if (!detectOnly) {
                parts.push(ch);
            }
            continue;
        }
        if (ch === '[') {
            bracketDepth++;
            if (!detectOnly) {
                parts.push(ch);
            }
            continue;
        }
        if (ch === '{') {
            braceDepth++;
            if (!detectOnly) {
                parts.push(ch);
            }
            continue;
        }
        if (ch === ')') {
            if (parenDepth > 0) {
                parenDepth--;
            }
            if (!detectOnly) {
                parts.push(ch);
            }
            continue;
        }
        if (ch === ']') {
            if (bracketDepth > 0) {
                bracketDepth--;
            }
            if (!detectOnly) {
                parts.push(ch);
            }
            continue;
        }
        if (ch === '}') {
            if (braceDepth > 0) {
                braceDepth--;
            }
            if (!detectOnly) {
                parts.push(ch);
            }
            continue;
        }
        var isTopLevel = parenDepth === 0 && bracketDepth === 0 && braceDepth === 0;
        if (isTopLevel) {
            if (ch === ',' && (escapeComma || detectOnly)) {
                if (detectOnly) {
                    return SEPARATOR_FOUND;
                }
                parts.push('\\,');
                continue;
            }
            if (ch === ';' && (escapeSemicolon || detectOnly)) {
                if (detectOnly) {
                    return SEPARATOR_FOUND;
                }
                parts.push('\\;');
                continue;
            }
            if (ch === ':' && escapeColon) {
                // Insert space before : to prevent Typst named-argument parsing.
                // In mat() cells, H_+: or H_-: can be misinterpreted as named args
                // even though + and - are not word chars. Always add space when
                // preceded by any non-whitespace character.
                if (i > 0 && expr[i - 1] !== ' ') {
                    parts.push(' :');
                }
                else {
                    parts.push(':');
                }
                continue;
            }
        }
        if (!detectOnly) {
            parts.push(ch);
        }
    }
    return detectOnly ? '' : parts.join('');
};
/** Escape unpaired [ and ] with backslash to prevent Typst content-block syntax.
 *  Reuses scanBracketTokens (which skips quoted strings, escaped chars, and
 *  function-call parens) and findUnpairedIndices from bracket-utils. */
/** Escape characters at given positions by prepending backslash. */
var escapeAtPositions = function (expr, positions) {
    var parts = [];
    for (var i = 0; i < expr.length; i++) {
        if (positions.has(i)) {
            parts.push('\\', expr[i]);
        }
        else {
            parts.push(expr[i]);
        }
    }
    return parts.join('');
};
/** Escape unpaired brackets of a specific pair (openChar, closeChar) with backslash.
 *  Uses scanBracketTokens which skips quoted strings, escaped chars, and syntax
 *  parens — so already-escaped brackets pass through unchanged. */
var escapeUnpairedOfType = function (expr, openChar, closeChar) {
    var e_1, _a;
    if (expr.indexOf(openChar) === -1 && expr.indexOf(closeChar) === -1) {
        return expr;
    }
    var matching = (0, bracket_utils_1.scanBracketTokens)(expr).filter(function (b) { return b.char === openChar || b.char === closeChar; });
    if (matching.length === 0) {
        return expr;
    }
    var unpairedIndices = (0, bracket_utils_1.findUnpairedIndices)(matching.map(function (b) { return b.char; }));
    if (unpairedIndices.size === 0) {
        return expr;
    }
    var positions = new Set();
    try {
        for (var unpairedIndices_1 = tslib_1.__values(unpairedIndices), unpairedIndices_1_1 = unpairedIndices_1.next(); !unpairedIndices_1_1.done; unpairedIndices_1_1 = unpairedIndices_1.next()) {
            var idx = unpairedIndices_1_1.value;
            positions.add(matching[idx].pos);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (unpairedIndices_1_1 && !unpairedIndices_1_1.done && (_a = unpairedIndices_1.return)) _a.call(unpairedIndices_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return escapeAtPositions(expr, positions);
};
var escapeUnpairedBrackets = function (expr) {
    return escapeUnpairedOfType(expr, '[', ']');
};
exports.escapeUnpairedBrackets = escapeUnpairedBrackets;
var escapeUnbalancedBraces = function (expr) {
    return escapeUnpairedOfType(expr, '{', '}');
};
exports.escapeUnbalancedBraces = escapeUnbalancedBraces;
/** Escape , ; : at depth 0, plus unpaired [], (), {} in content inside Typst function
 *  calls. Backslash-escapes prevent Typst from parsing them as argument separators,
 *  named arguments, or unclosed delimiters. Skips "..." strings and escaped chars. */
var escapeContentSeparators = function (expr) {
    return scanExpression((0, exports.escapeUnbalancedBraces)((0, exports.escapeUnbalancedParens)((0, exports.escapeUnpairedBrackets)(expr))), { escapeComma: true, escapeSemicolon: true, escapeColon: true });
};
exports.escapeContentSeparators = escapeContentSeparators;
/** Escape , ; and : at depth 0 — for mat()/cases() cells where : is also a named-argument marker.
 *  For colons: inserts space before : when preceded by identifier.
 *  Also replaces unpaired brackets with Typst symbol names (bracket.l etc.). */
var escapeCasesSeparators = function (expr) {
    return scanExpression((0, bracket_utils_1.replaceUnpairedBrackets)(expr), {
        escapeComma: true,
        escapeSemicolon: true,
        escapeColon: true
    });
};
exports.escapeCasesSeparators = escapeCasesSeparators;
/** Escape ; and : at depth 0 — for mat() rows where commas are intentional column separators.
 *  Replaces unpaired brackets with Typst symbol names. */
var escapeMatrixRowSeparators = function (expr) {
    return scanExpression((0, bracket_utils_1.replaceUnpairedBrackets)(expr), {
        escapeSemicolon: true,
        escapeColon: true
    });
};
exports.escapeMatrixRowSeparators = escapeMatrixRowSeparators;
/** Check whether a Typst expression contains , or ; at top level (outside (), [] and {}).
 *  Skips content inside "..." strings (handles escaped quotes). */
var hasTopLevelSeparators = function (expr) {
    return scanExpression(expr, { detectOnly: true }) === SEPARATOR_FOUND;
};
exports.hasTopLevelSeparators = hasTopLevelSeparators;
/** Escape top-level ; → \; and colons after identifiers (word :) inside lr() content.
 *  Commas are safe in lr.  Skips content inside "..." strings and backslash-escaped chars. */
var escapeLrSemicolons = function (expr) {
    return scanExpression(expr, {
        escapeSemicolon: true,
        escapeColon: true
    });
};
exports.escapeLrSemicolons = escapeLrSemicolons;
/** Escape inner bracket characters inside lr() content so Typst doesn't auto-scale them.
 *  lr() auto-scales ALL unescaped delimiters inside it, but \left...\right only scales
 *  its own pair.  `chars` specifies which bracket characters to escape (defaults to all).
 *  Reuses scanBracketTokens which skips syntax parens (function calls, subscript/
 *  superscript grouping), quoted strings, and already-escaped chars. */
var escapeLrBrackets = function (expr, chars) {
    var e_2, _a;
    if (!consts_1.RE_BRACKET_CHARS.test(expr)) {
        return expr;
    }
    var brackets = (0, bracket_utils_1.scanBracketTokens)(expr);
    if (brackets.length === 0) {
        return expr;
    }
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
    if (positions.size === 0) {
        return expr;
    }
    return escapeAtPositions(expr, positions);
};
exports.escapeLrBrackets = escapeLrBrackets;
/** Escape unbalanced parens to prevent Typst group open/close interpretation. */
var escapeUnbalancedParens = function (expr) {
    return escapeUnpairedOfType(expr, '(', ')');
};
exports.escapeUnbalancedParens = escapeUnbalancedParens;
//# sourceMappingURL=escape-utils.js.map