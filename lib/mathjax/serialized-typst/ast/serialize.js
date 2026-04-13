"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeTypstMath = void 0;
var tslib_1 = require("tslib");
var serialize_context_1 = require("./serialize-context");
var escape_utils_1 = require("../escape-utils");
var consts_1 = require("../consts");
var labels_1 = require("../../../markdown/common/labels");
var bracket_utils_1 = require("../bracket-utils");
/** Any escaped bracket at start: \( \) \[ \] \{ \} */
var RE_ESCAPED_BRACKET_START = /^\\[()[\]{}]/;
/** Any escaped bracket at end: ...\( ...\) etc. — NOT a separator */
var RE_ESCAPED_BRACKET_END = /\\[()[\]{}]$/;
var RE_BACKSLASH = /\\/g;
var RE_DOUBLE_QUOTE = /"/g;
/** Only escape \ before " and trailing \ — for mtext where MathJax preserves raw LaTeX */
var RE_BACKSLASH_BEFORE_QUOTE_OR_END = /\\(?=")|\\$/g;
/** Operators that need escaping or special formatting in Typst math mode */
var OPERATOR_ESCAPE_MAP = {
    '/': '\\/',
    ';': '\\;',
    '"': 'quote.double',
    ',': ',', // comma — serialized with trailing space
};
/** Functions that use multi-line formatting when they have 2+ positional args (rows) */
var MULTILINE_POSITIONAL_FUNCS = new Set([
    'mat',
    'cases',
]);
/** Code-mode functions (#grid) that always use multi-line formatting */
var MULTILINE_CODE_FUNCS = new Set([
    'grid',
]);
/** Separator chars that cannot be bare script bases — must be quoted */
var SEPARATOR_BASES = new Set([
    ',',
    ';'
]);
/** Escape all backslashes and double-quotes for Typst string literals */
var escapeStringContent = function (value) {
    return value
        .replace(RE_BACKSLASH, '\\\\')
        .replace(RE_DOUBLE_QUOTE, '\\"');
};
/** Escape only dangerous backslashes (before " and trailing) for mtext strings */
var escapeMathTextContent = function (value) {
    return value
        .replace(RE_BACKSLASH_BEFORE_QUOTE_OR_END, '\\\\')
        .replace(RE_DOUBLE_QUOTE, '\\"');
};
/** Serialize a single AST node to a Typst math string */
var serializeTypstMath = function (node) {
    switch (node.type) {
        case "seq" /* TypstMathNodeType.Seq */: {
            var result = serializeSeq(node);
            return node.trailingNewline ? result + '\n' : result;
        }
        case "symbol" /* TypstMathNodeType.Symbol */:
            return node.value;
        case "text" /* TypstMathNodeType.Text */: {
            var escape_1 = node.preserveBackslash ? escapeMathTextContent : escapeStringContent;
            return '"' + escape_1(node.value) + '"';
        }
        case "number" /* TypstMathNodeType.Number */:
            return node.value;
        case "operator" /* TypstMathNodeType.Operator */:
            return serializeOperator(node);
        case "func" /* TypstMathNodeType.FuncCall */:
            return serializeFuncCall(node);
        case "script" /* TypstMathNodeType.Script */:
            return serializeScript(node);
        case "delimited" /* TypstMathNodeType.Delimited */:
            return serializeDelimited(node);
        case "space" /* TypstMathNodeType.Space */:
            return node.width ? ' ' + node.width + ' ' : '';
        case "linebreak" /* TypstMathNodeType.Linebreak */:
            return ' \\\n';
        case "alignment" /* TypstMathNodeType.Alignment */:
            return ' ' + node.variant;
        case "raw" /* TypstMathNodeType.Raw */:
            return (node.leadingNewline ? '\n' : '') + node.value + (node.trailingNewline ? '\n' : '');
        case "placeholder" /* TypstMathNodeType.Placeholder */:
            return '""';
        case "label" /* TypstMathNodeType.Label */:
            return ' <' + (0, labels_1.sanitizeLabel)(node.key) + '>';
        case "matrix-row" /* TypstMathNodeType.MatrixRow */:
            return node.cells
                .map(function (cell) { return (0, escape_utils_1.escapeCasesSeparators)((0, exports.serializeTypstMath)(cell).trim()); })
                .join(', ');
        case "inline-math" /* TypstMathNodeType.InlineMath */: {
            var inner = (0, exports.serializeTypstMath)(node.body);
            return node.display ? '$ ' + inner + ' $' : '$' + inner + '$';
        }
    }
};
exports.serializeTypstMath = serializeTypstMath;
var serializeSeq = function (node) {
    var children = node.children;
    if (children.length === 0) {
        return '';
    }
    var parts = [];
    var prevSerialized = '';
    var prevNodeIdx = -1;
    var prevWasCompactAlignment = false;
    for (var i = 0; i < children.length; i++) {
        var serialized = (0, exports.serializeTypstMath)(children[i]);
        // After a compact alignment marker (eqnArray &), strip the leading space from
        // the next token so that "& = b" becomes "&= b" (Typst alignment convention)
        if (prevWasCompactAlignment && serialized) {
            serialized = serialized.replace(/^ /, '');
        }
        if (serialized && prevSerialized) {
            // Never add extra space after compact alignment marker — content attaches directly
            if (!prevWasCompactAlignment && needsSeparator(prevSerialized, serialized, children[prevNodeIdx])) {
                parts.push(' ');
            }
        }
        parts.push(serialized);
        if (serialized) {
            var child = children[i];
            prevWasCompactAlignment = child.type === "alignment" /* TypstMathNodeType.Alignment */
                && !!child.compact && child.variant === '&';
            prevSerialized = serialized;
            prevNodeIdx = i;
        }
    }
    return parts.join('');
};
/**
 * Decide whether a space is needed between two adjacent serialized tokens.
 * Mirrors the logic of needsTokenSeparator + needsSpaceBetweenNodes from common.ts
 * but operates on serialized strings and AST node types instead of MmlNode.
 */
var needsSeparator = function (prev, next, prevNode) {
    if (!prev || !next) {
        return false;
    }
    if (consts_1.RE_PHANTOM_BASE.test(next)) {
        return false;
    }
    // Escaped bracket at end (\( \) \[ etc.) is NOT a separator
    var prevIsSeparator = consts_1.RE_SEPARATOR_END.test(prev) && !RE_ESCAPED_BRACKET_END.test(prev);
    if (consts_1.RE_TOKEN_START.test(next) && !prevIsSeparator) {
        return true;
    }
    // Any escaped bracket at start of next needs space after word/dot chars
    if (RE_ESCAPED_BRACKET_START.test(next) && consts_1.RE_WORD_DOT_END.test(prev)) {
        return true;
    }
    // Space before (, [ or { after a script node to prevent Typst function-call parsing
    if (prevNode.type === "script" /* TypstMathNodeType.Script */) {
        var ch = next[0];
        if (ch === '[' || ch === '{') {
            return true;
        }
        if (ch === '(') {
            if (isDerivativeScript(prevNode)) {
                return false;
            }
            // Builtin ops with scripts: sin^2(x) — no space needed
            if (isBuiltinOpScript(prevNode)) {
                return false;
            }
            return true;
        }
    }
    // Space before [ or { after a function call to prevent Typst trailing-content-block parsing.
    // frac(1, 2)[x] → Typst parses [x] as body argument to frac, causing an error.
    // Space before ( after code-mode (#hash) function to prevent chained-call parsing.
    // #box(stroke: 0.5pt, $G$)(s) → Typst calls box result with (s), causing an error.
    if (prevNode.type === "func" /* TypstMathNodeType.FuncCall */) {
        var ch = next[0];
        if (ch === '[' || ch === '{') {
            return true;
        }
        if (ch === '(' && prevNode.hash) {
            return true;
        }
    }
    // Space before [ or { after a delimited node (lr, abs, norm, etc.)
    // lr(| x |)[y] → Typst parses [y] as body argument to lr.
    if (prevNode.type === "delimited" /* TypstMathNodeType.Delimited */) {
        var ch = next[0];
        if (ch === '[' || ch === '{') {
            return true;
        }
    }
    // Space before ( after multi-char identifier to prevent emptyset(i) → function call
    if (next[0] === '(' && consts_1.RE_ALPHA_END.test(prev)) {
        var match = prev.match(consts_1.RE_TRAILING_DOTTED_IDENT);
        if (match && match[1].length > 1 && !consts_1.TYPST_BUILTIN_OPS.has(match[1])) {
            return true;
        }
    }
    return false;
};
/**
 * Check whether a ScriptNode is a derivative pattern like f'(x).
 * In that case we do NOT insert a space before the following paren.
 */
var isDerivativeScript = function (node) {
    if (!node.sup || node.sub) {
        return false;
    }
    if (node.base.type !== "symbol" /* TypstMathNodeType.Symbol */) {
        return false;
    }
    // Prime superscript: the sup is a symbol whose value is a prime char
    if (node.sup.type === "symbol" /* TypstMathNodeType.Symbol */) {
        var val = node.sup.value;
        return val === "'" || val === "''" || val === "'''";
    }
    // Raw prime shorthand
    if (node.sup.type === "raw" /* TypstMathNodeType.Raw */) {
        var val = node.sup.value;
        return val === "'" || val === "''" || val === "'''";
    }
    // Parenthesized superscript: f^{(n)}(a) — the (n) is a group, not function args
    var supStr = (0, exports.serializeTypstMath)(node.sup).trim();
    if (supStr.startsWith('(') && supStr.endsWith(')')) {
        return true;
    }
    return false;
};
/** Check if a ScriptNode's base is a Typst builtin operator (sin, cos, log, etc.).
 *  sin^2(x) should NOT get space before ( — builtin ops accept args directly. */
var isBuiltinOpScript = function (node) {
    if (node.base.type === "symbol" /* TypstMathNodeType.Symbol */) {
        return consts_1.TYPST_BUILTIN_OPS.has(node.base.value);
    }
    return false;
};
var serializeOperator = function (node) {
    var _a;
    var escaped = (_a = OPERATOR_ESCAPE_MAP[node.value]) !== null && _a !== void 0 ? _a : node.value;
    if (node.spaced) {
        return ' ' + escaped + ' ';
    }
    if (node.unaryPrefix) {
        return ' ' + escaped;
    }
    // Comma gets trailing space for readability: a, b not a,b
    if (node.value === ',') {
        return ', ';
    }
    return escaped;
};
var serializeFuncCall = function (node, parentCodeMode, indentLevel) {
    var _a, _b;
    if (parentCodeMode === void 0) { parentCodeMode = false; }
    if (indentLevel === void 0) { indentLevel = 0; }
    var prefix = node.hash ? '#' : '';
    var codeMode = !!node.hash || parentCodeMode;
    var escapeCtx = (_b = (_a = node.escapeContext) !== null && _a !== void 0 ? _a : serialize_context_1.FUNC_ESCAPE_CONTEXTS[node.name]) !== null && _b !== void 0 ? _b : "standard" /* FuncEscapeContext.Standard */;
    var argStrings = [];
    for (var i = 0; i < node.args.length; i++) {
        argStrings.push(serializeFuncArg(node.args[i], escapeCtx, codeMode, indentLevel));
    }
    // Separate named and positional args
    var named = [];
    var positional = [];
    for (var i = 0; i < node.args.length; i++) {
        (node.args[i].kind === "named" /* FuncArgKind.Named */ ? named : positional).push(argStrings[i]);
    }
    // Check for multi-line formatting
    var isMultilinePositional = MULTILINE_POSITIONAL_FUNCS.has(node.name)
        && positional.length >= 2
        && !node.singleLine;
    var isMultilineCode = MULTILINE_CODE_FUNCS.has(node.name);
    var isMultiline = isMultilinePositional || isMultilineCode;
    var argsStr;
    if (isMultiline) {
        var indent_1 = ' '.repeat(indentLevel + 2);
        if (node.semicolonSep) {
            // mat: named on first line, rows indented with ;\n separator, trailing comma
            var parts = [];
            if (named.length > 0) {
                parts.push(named.join(', '));
            }
            parts.push('\n' + positional.map(function (r) { return indent_1 + r; }).join(';\n') + ',\n' + ' '.repeat(indentLevel));
            argsStr = parts.join(', ');
        }
        else if (isMultilineCode) {
            // Code-mode (#grid, #math.equation): ALL args indented on new lines
            var allArgs = tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(named), false), tslib_1.__read(positional), false);
            argsStr = '\n' + allArgs.map(function (a) { return indent_1 + a; }).join(',\n') + ',\n' + ' '.repeat(indentLevel);
        }
        else {
            // Math-mode (cases): named on first line, positional indented
            var parts = [];
            if (named.length > 0) {
                parts.push(named.join(', '));
            }
            parts.push('\n' + positional.map(function (r) { return indent_1 + r; }).join(',\n') + ',\n' + ' '.repeat(indentLevel));
            argsStr = parts.join(', ');
        }
    }
    else if (node.semicolonSep) {
        // Single-row mat: named args with , then positional with ;
        var parts = [];
        if (named.length > 0) {
            parts.push(named.join(', '));
        }
        if (positional.length > 0) {
            parts.push(positional.join('; '));
        }
        argsStr = parts.join(', ');
    }
    else {
        argsStr = argStrings.join(', ');
    }
    var result;
    if (argsStr || !node.body) {
        result = prefix + node.name + '(' + argsStr + ')';
    }
    else {
        result = prefix + node.name;
    }
    if (node.body) {
        var bodyParts = [];
        for (var i = 0; i < node.body.length; i++) {
            bodyParts.push((0, exports.serializeTypstMath)(node.body[i]));
        }
        result += '[' + bodyParts.join('') + ']';
    }
    if (node.trailingNewline) {
        result += '\n';
    }
    return result;
};
var serializeFuncArg = function (arg, escapeCtx, codeMode, indentLevel) {
    if (codeMode === void 0) { codeMode = false; }
    if (indentLevel === void 0) { indentLevel = 0; }
    var valueStr = serializeArgValue(arg.value, escapeCtx, codeMode, indentLevel);
    if (arg.kind === "named" /* FuncArgKind.Named */) {
        return arg.name + ': ' + valueStr;
    }
    return valueStr;
};
var serializeArgValue = function (value, escapeCtx, codeMode, indentLevel) {
    if (codeMode === void 0) { codeMode = false; }
    if (indentLevel === void 0) { indentLevel = 0; }
    switch (value.type) {
        case "math" /* ArgValueType.Math */: {
            var serialized = (0, exports.serializeTypstMath)(value.node).trim();
            if (!serialized) {
                return '""';
            }
            return applyFuncEscaping(serialized, escapeCtx);
        }
        case "string" /* ArgValueType.String */:
            return '"' + escapeStringContent(value.value) + '"';
        case "bool" /* ArgValueType.Bool */:
            if (codeMode) {
                return value.value ? 'true' : 'false';
            }
            return value.value ? '#true' : '#false';
        case "ident" /* ArgValueType.Ident */:
            return value.value;
        case "length" /* ArgValueType.Length */:
            return value.value;
        case "raw" /* ArgValueType.Raw */:
            return value.value;
        case "inlineMath" /* ArgValueType.InlineMath */: {
            var inner = (0, exports.serializeTypstMath)(value.node);
            return value.display ? '$ ' + inner + ' $' : '$' + inner + '$';
        }
        case "call" /* ArgValueType.Call */:
            return serializeFuncCall(value.node, codeMode, indentLevel + 2);
    }
};
/** Apply context-appropriate escaping to serialized math content inside function args */
var applyFuncEscaping = function (expr, ctx) {
    switch (ctx) {
        case "none" /* FuncEscapeContext.None */:
            return expr;
        case "standard" /* FuncEscapeContext.Standard */:
            return (0, escape_utils_1.escapeContentSeparators)(expr);
        case "matrix-cell" /* FuncEscapeContext.MatrixCell */:
            return (0, escape_utils_1.escapeCasesSeparators)(expr);
        case "matrix-row" /* FuncEscapeContext.MatrixRow */:
            return (0, escape_utils_1.escapeMatrixRowSeparators)(expr);
        case "wrapper" /* FuncEscapeContext.Wrapper */:
            return (0, escape_utils_1.escapeUnbalancedParens)((0, escape_utils_1.escapeContentSeparators)(expr));
        case "string-arg" /* FuncEscapeContext.StringArg */:
            return escapeStringContent(expr);
        case "lr-content" /* FuncEscapeContext.LrContent */:
            return (0, escape_utils_1.escapeLrSemicolons)(expr);
    }
};
/** Serialize script base: quote separator chars, placeholder for empty */
var serializeScriptBase = function (node) {
    var s = (0, exports.serializeTypstMath)(node);
    var trimmed = s.trim();
    if (SEPARATOR_BASES.has(trimmed)) {
        return '"' + trimmed + '"';
    }
    return trimmed || '""';
};
var serializeScript = function (node) {
    // Prescripts → attach(base, tl: ..., bl: ..., tr: ..., br: ...)
    if (node.preSub || node.preSup) {
        var serializeAttachArg = function (n) {
            var s = (0, exports.serializeTypstMath)(n).trim();
            return (0, escape_utils_1.escapeContentSeparators)(s || '""');
        };
        var args = [serializeAttachArg(node.base)];
        if (node.preSup) {
            args.push('tl: ' + serializeAttachArg(node.preSup));
        }
        if (node.preSub) {
            args.push('bl: ' + serializeAttachArg(node.preSub));
        }
        if (node.sup) {
            args.push('tr: ' + serializeAttachArg(node.sup));
        }
        if (node.sub) {
            args.push('br: ' + serializeAttachArg(node.sub));
        }
        return 'attach(' + args.join(', ') + ')';
    }
    // Regular sub/sup with _() ^() grouping
    var base = serializeScriptBase(node.base);
    var result = base;
    if (node.sub) {
        var subStr = (0, exports.serializeTypstMath)(node.sub).trim();
        result += node.bareSub ? '_' + subStr : formatScriptPart('_', subStr);
    }
    if (node.sup) {
        result += formatScriptPart('^', (0, exports.serializeTypstMath)(node.sup).trim());
    }
    return result;
};
/** Format _x or _(multi-char). Escapes unbalanced parens inside grouping to
 *  prevent bare ( or ) from breaking the ^(...) / _(...) syntax. */
var formatScriptPart = function (prefix, content) {
    if (!content) {
        return '';
    }
    if (content.length > 1) {
        return prefix + '(' + (0, escape_utils_1.escapeUnbalancedParens)(content) + ')';
    }
    return prefix + content;
};
/** Build the set of ASCII bracket chars to escape inside lr() based on delimiters.
 *  When delimiters are standard brackets, escape those and their peers.
 *  When delimiters are non-bracket chars (|, ‖, ⟨, etc.), Typst still auto-scales
 *  ALL unescaped brackets inside lr(), so we escape all ASCII bracket types. */
var buildLrBracketChars = function (openDelim, closeDelim) {
    var e_1, _a;
    var _b;
    var chars = new Set();
    var hasBracketDelim = false;
    try {
        for (var _c = tslib_1.__values([openDelim, closeDelim]), _d = _c.next(); !_d.done; _d = _c.next()) {
            var d = _d.value;
            if (d && (d in consts_1.OPEN_BRACKETS || d in consts_1.CLOSE_BRACKETS)) {
                hasBracketDelim = true;
                chars.add(d);
                var peer = (_b = consts_1.OPEN_BRACKETS[d]) !== null && _b !== void 0 ? _b : consts_1.CLOSE_BRACKETS[d];
                if (peer) {
                    chars.add(peer);
                }
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
    if (!hasBracketDelim && (openDelim || closeDelim)) {
        chars.add('[');
        chars.add(']');
        chars.add('(');
        chars.add(')');
        chars.add('{');
        chars.add('}');
    }
    return chars;
};
/** Escape body content for lr() with delimiter-specific bracket escaping */
var escapeLrBody = function (body, openDelim, closeDelim) {
    var chars = buildLrBracketChars(openDelim, closeDelim);
    var escaped = chars.size > 0 ? (0, escape_utils_1.escapeLrBrackets)(body, chars) : body;
    return (0, escape_utils_1.escapeLrSemicolons)(escaped);
};
var serializeDelimited = function (node) {
    var bodyStr = (0, exports.serializeTypstMath)(node.body).trim();
    var openDelim = node.open;
    var closeDelim = node.close;
    var openMapped = openDelim ? (0, bracket_utils_1.mapDelimiter)(openDelim) : '';
    var closeMapped = closeDelim ? (0, bracket_utils_1.mapDelimiter)(closeDelim) : '';
    var hasVisibleOpen = !!openMapped;
    var hasVisibleClose = !!closeMapped;
    // Shorthand functions: abs/norm/floor/ceil when no top-level separators
    if (node.kind !== "lr" /* DelimitedKind.Lr */ && hasVisibleOpen && hasVisibleClose) {
        if (!(0, escape_utils_1.hasTopLevelSeparators)(bodyStr)) {
            var funcName = node.kind;
            return funcName + '(' + (0, escape_utils_1.escapeContentSeparators)(bodyStr) + ')';
        }
        // Has separators — use lr() with raw Unicode delimiter chars
        // (‖, ⌊, ⌋, ⌈, ⌉ are valid Typst lr() delimiters)
        var escaped_1 = escapeLrBody(bodyStr, openDelim, closeDelim);
        return 'lr(' + openDelim + ' ' + escaped_1 + ' ' + closeDelim + ')';
    }
    // lr() with both delimiters visible
    if (hasVisibleOpen && hasVisibleClose) {
        var escaped_2 = escapeLrBody(bodyStr, openDelim, closeDelim);
        // Mismatched pairs need backslash-escaped delimiters
        var typstOpen = (openDelim in consts_1.OPEN_BRACKETS && consts_1.OPEN_BRACKETS[openDelim] !== closeDelim)
            ? '\\' + openDelim : openMapped;
        var typstClose = (closeDelim in consts_1.CLOSE_BRACKETS && consts_1.CLOSE_BRACKETS[closeDelim] !== openDelim)
            ? '\\' + closeDelim : closeMapped;
        return 'lr(' + typstOpen + ' ' + escaped_2 + ' ' + typstClose + ')';
    }
    // One-sided lr(): \left. ... \right) or \left( ... \right.
    // Typst lr() supports unmatched delimiters: "this can be used to scale unmatched delimiters".
    var openEsc = openDelim ? (0, bracket_utils_1.escapeLrDelimiter)(openDelim) : '';
    var closeEsc = closeDelim ? (0, bracket_utils_1.escapeLrDelimiter)(closeDelim) : '';
    var escaped = escapeLrBody(bodyStr, openDelim, closeDelim);
    if (openEsc) {
        return 'lr(' + openEsc + ' ' + escaped + ')';
    }
    if (closeEsc) {
        return 'lr(' + escaped + ' ' + closeEsc + ')';
    }
    return bodyStr;
};
//# sourceMappingURL=serialize.js.map