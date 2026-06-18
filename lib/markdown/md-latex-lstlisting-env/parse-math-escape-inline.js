"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMathEscapeInline = exports.createMathOnlyInlineParser = void 0;
var tslib_1 = require("tslib");
var mdPluginRaw_1 = require("../mdPluginRaw");
/**
 * Cache for math-only inline parsers keyed by the base MarkdownIt instance.
 * Avoids re-allocating a new parser on every call.
 */
var MATH_INLINE_CACHE = new WeakMap();
var BACKSLASH = 0x5C;
var DOLLAR = 0x24;
/**
 * Verbatim backslash rule for code listings. Backslashes are kept literal (code is verbatim),
 * so a doubled `\\( / \\[` stays non-math in strict mode. Exception: a run of backslashes
 * immediately before `$` drops exactly one backslash and the `$` is a literal dollar
 * (`\$` -> `$`, `\\$` -> `\$`); only a bare `$` toggles math under mathescape.
 */
var verbatimBackslash = function (state, silent) {
    var max = state.posMax;
    var start = state.pos;
    if (state.src.charCodeAt(start) !== BACKSLASH) {
        return false;
    }
    // peek the maximal run of backslashes to detect a trailing $
    var run = start;
    while (run < max && state.src.charCodeAt(run) === BACKSLASH) {
        run++;
    }
    // ONLY the \$ case: a run of backslashes immediately before $ drops exactly one backslash,
    // and the $ is a literal dollar (\$ -> $, \\$ -> \$). Nothing else changes.
    if (run < max && state.src.charCodeAt(run) === DOLLAR) {
        if (!silent) {
            state.pending += '\\'.repeat(run - start - 1) + '$';
        }
        state.pos = run + 1;
        return true;
    }
    // every other case: original behavior — keep this backslash verbatim and consume a \\ pair so
    // a following \( / \[ is not re-opened as math (a leftover single \( is left for multiMath)
    var pos = start;
    if (!silent) {
        state.pending += '\\';
    }
    pos++;
    if (pos < max && state.src.charCodeAt(pos) === BACKSLASH) {
        if (!silent) {
            state.pending += '\\';
        }
        pos++;
    }
    state.pos = pos;
    return true;
};
/**
 * Create (or retrieve from cache) a Markdown-It instance configured to parse ONLY
 * inline math and plain text. This keeps the behavior consistent with `baseMd` options
 * (html, breaks, typographer, etc.), but strips all other inline rules.
 *
 * Rule precedence: markdown-it's `text` rule runs first but terminates on \ / $ / [, so
 * multiMath/simpleMath still see every delimiter opener before `text` consumes it. `escape`
 * is replaced with `verbatimBackslash` because listing code is verbatim.
 *
 * Cache caveat: options are snapshotted at construction. Safe while each render builds a fresh
 * baseMd (per mdInit); if baseMd is reused across renders with different mathDelimiterMode, the
 * cached parser keeps the first mode.
 */
var createMathOnlyInlineParser = function (baseMd) {
    var cached = MATH_INLINE_CACHE.get(baseMd);
    if (cached)
        return cached;
    var BaseMdCtor = baseMd.constructor;
    var mathMd = new BaseMdCtor(baseMd.options);
    // multiMath/simpleMath before escape; escape replaced with verbatim rule (code is literal)
    mathMd.inline.ruler.before('escape', 'multiMath', mdPluginRaw_1.multiMath);
    mathMd.inline.ruler.before('escape', 'simpleMath', mdPluginRaw_1.simpleMath);
    mathMd.inline.ruler.at('escape', verbatimBackslash);
    mathMd.inline.ruler.enableOnly(['multiMath', 'simpleMath', 'text', 'escape']);
    MATH_INLINE_CACHE.set(baseMd, mathMd);
    return mathMd;
};
exports.createMathOnlyInlineParser = createMathOnlyInlineParser;
/**
 * Parse a string with ONLY math inline rules enabled.
 *
 * @param baseMd  Original Markdown-It instance (its options are reused).
 * @param src     Raw source to parse (e.g., the inside of lstlisting with mathescape).
 * @param env     Environment object; it will be shallow-cloned and augmented with `mathescape_ctx: true`.
 * @returns       Array of tokens containing only text + inline/display math tokens.
 */
var parseMathEscapeInline = function (baseMd, src, env) {
    if (env === void 0) { env = {}; }
    var mathMd = (0, exports.createMathOnlyInlineParser)(baseMd);
    var tokens = [];
    var envClone = tslib_1.__assign(tslib_1.__assign({}, env), { mathescape_ctx: true });
    mathMd.inline.parse(src, mathMd, envClone, tokens);
    return tokens;
};
exports.parseMathEscapeInline = parseMathEscapeInline;
//# sourceMappingURL=parse-math-escape-inline.js.map