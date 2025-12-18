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
/**
 * Create (or retrieve from cache) a Markdown-It instance configured to parse ONLY
 * inline math and plain text. This keeps the behavior consistent with `baseMd` options
 * (html, breaks, typographer, etc.), but strips all other inline rules.
 *
 * Order matters:
 *  1) multiMath (handles \[, \(, \begin{...})
 *  2) simpleMath (handles $...$ / $$...$$)
 *  3) text fallback
 */
var createMathOnlyInlineParser = function (baseMd) {
    var cached = MATH_INLINE_CACHE.get(baseMd);
    if (cached)
        return cached;
    // Reuse base options, but do not copy plugins/rules — we install only math rules below.
    // This is cleaner than `new (baseMd as any).constructor(...)` and keeps typing intact.
    var BaseMdCtor = baseMd.constructor;
    var mathMd = new BaseMdCtor(baseMd.options);
    // Register math rules right before "text" to ensure correct precedence.
    mathMd.inline.ruler.before('text', 'multiMath', mdPluginRaw_1.multiMath);
    mathMd.inline.ruler.before('text', 'simpleMath', mdPluginRaw_1.simpleMath);
    // Enable only our two math rules + the default "text" rule.
    mathMd.inline.ruler.enableOnly(['multiMath', 'simpleMath', 'text']);
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