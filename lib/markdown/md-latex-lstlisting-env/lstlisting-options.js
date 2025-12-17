"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyLstListingOptionsToToken = void 0;
var parse_attribures_1 = require("../common/parse-attribures");
var parse_math_escape_inline_1 = require("./parse-math-escape-inline");
var consts_1 = require("../common/consts");
/**
 * Parse a LaTeX listings `language` value into `{ name, dialect }`.
 *
 * Supported forms:
 * - "Ada"
 * - "{Ada}"
 * - "\"Ada\""
 * - "[2005]Ada"
 * - "{[riscv]Assembler}"
 *
 * The function:
 * - Strips surrounding quotes (single/double) if present.
 * - Strips a single pair of outer curly braces `{ ... }` if present.
 * - If the remaining string starts with `[... ]`, the part inside the brackets
 *   is treated as the dialect and the rest as the language name.
 *
 * On empty or falsy input returns `{ name: '', dialect: null }`.
 */
var parseLstLanguage = function (raw) {
    var _a;
    if (!raw) {
        return { name: '', dialect: null, hlName: '' };
    }
    // 1. Trim whitespace
    var s = raw.trim();
    if (!s) {
        return { name: '', dialect: null, hlName: '' };
    }
    // 2. Strip surrounding quotes, if present
    var firstChar = s[0];
    var lastChar = s[s.length - 1];
    if ((firstChar === '"' && lastChar === '"') ||
        (firstChar === "'" && lastChar === "'")) {
        s = s.slice(1, -1).trim();
    }
    // 3. Strip single outer curly braces { ... }, if present
    if (s.startsWith('{') && s.endsWith('}')) {
        s = s.slice(1, -1).trim();
    }
    var dialect = null;
    var name;
    if (s.startsWith('[')) {
        var closing = s.indexOf(']');
        if (closing > 0) {
            dialect = s.slice(1, closing).trim(); // e.g. "2005"
            name = s.slice(closing + 1).trim(); // e.g. "Ada"
        }
        else {
            // Malformed: "[" without closing "]" → treat whole string as language name
            name = s;
        }
    }
    else {
        name = s;
    }
    var hlName = name ? ((_a = consts_1.LST_HLJS_LANGUAGES[name.toLowerCase()]) !== null && _a !== void 0 ? _a : name) : '';
    return { name: name, dialect: dialect, hlName: hlName };
};
/**
 * Apply LaTeX lstlisting-like options to a Markdown-It token.
 *
 * - Parses raw lst options into a structured attributes object.
 * - Parses `language` into `{ name, dialect }` via `parseLstLanguage`.
 * - Stores all attributes under `token.meta.attributes`.
 * - If `mathescape` is enabled, replaces `token.children` with a math-aware
 *   inline parse of the code content (no links/emphasis).
 *
 * This function mutates the given token in-place.
 */
var applyLstListingOptionsToToken = function (token, content, opts, state) {
    var _a, _b;
    if (!opts)
        return;
    var attributes = (_a = (0, parse_attribures_1.parseAttributes)(opts)) !== null && _a !== void 0 ? _a : {};
    var languageValue = typeof attributes.language === 'string'
        ? attributes.language
        : null;
    var parsedLanguage = languageValue
        ? parseLstLanguage(languageValue)
        : null;
    var meta = (_b = token.meta) !== null && _b !== void 0 ? _b : (token.meta = {});
    meta.language = parsedLanguage;
    if (attributes.mathescape) {
        // parse only math inside the code (no links/emphasis)
        token.children = (0, parse_math_escape_inline_1.parseMathEscapeInline)(state.md, content, state.env);
        meta.hasMathescape = true;
    }
};
exports.applyLstListingOptionsToToken = applyLstListingOptionsToToken;
//# sourceMappingURL=lstlisting-options.js.map