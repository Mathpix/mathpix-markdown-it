"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearItemizeLevelTokens = exports.ChangeLevel = exports.GetItemizeLevelTokensByState = exports.GetItemizeLevelTokens = exports.SetItemizeLevelTokensByIndex = exports.SetItemizeLevelTokens = exports.clearMarkerTokens = exports.GetEnumerateLevel = exports.GetItemizeLevel = exports.SetDefaultEnumerateLevel = exports.SetDefaultItemizeLevel = exports.itemizeLevelTokens = exports.enumerateLevel = exports.itemizeLevel = void 0;
var tslib_1 = require("tslib");
var convert_math_to_html_1 = require("../common/convert-math-to-html");
var list_markers_1 = require("../common/list-markers");
var consts_1 = require("../common/consts");
var list_state_1 = require("./list-state");
// These registries stay outside the Lists rollback: `\renewcommand` is document content, and rolling
// it back gave two renders two answers.
/** Active itemize levels (mutable state) */
exports.itemizeLevel = [];
/** Active enumerate levels (mutable state) */
exports.enumerateLevel = [];
/** Parsed tokens for itemize bullets */
exports.itemizeLevelTokens = [];
/**
 * Reset and return default itemize bullet definitions.
 */
var SetDefaultItemizeLevel = function () {
    exports.itemizeLevel = tslib_1.__spreadArray([], tslib_1.__read(list_markers_1.itemizeLevelDefaults), false);
    return exports.itemizeLevel;
};
exports.SetDefaultItemizeLevel = SetDefaultItemizeLevel;
/**
 * Reset and return default enumerate level definitions.
 */
var SetDefaultEnumerateLevel = function () {
    exports.enumerateLevel = tslib_1.__spreadArray([], tslib_1.__read(list_markers_1.enumerateLevelDefaults), false);
    return exports.enumerateLevel;
};
exports.SetDefaultEnumerateLevel = SetDefaultEnumerateLevel;
/**
 * Return itemize level array (or fallback to defaults).
 */
var GetItemizeLevel = function (data) {
    if (data === void 0) { data = null; }
    if (!data || data.length === 0) {
        return exports.itemizeLevel.length === 0
            ? (0, exports.SetDefaultItemizeLevel)()
            : tslib_1.__spreadArray([], tslib_1.__read(exports.itemizeLevel), false);
    }
    return tslib_1.__spreadArray([], tslib_1.__read(data), false);
};
exports.GetItemizeLevel = GetItemizeLevel;
/**
 * Return enumerate level array (or fallback to defaults).
 */
var GetEnumerateLevel = function (data) {
    if (data === void 0) { data = null; }
    if (!data || data.length === 0) {
        return exports.enumerateLevel.length === 0
            ? (0, exports.SetDefaultEnumerateLevel)()
            : tslib_1.__spreadArray([], tslib_1.__read(exports.enumerateLevel), false);
    }
    return tslib_1.__spreadArray([], tslib_1.__read(data), false);
};
exports.GetEnumerateLevel = GetEnumerateLevel;
// Every list open re-parsed the same few marker macros, and that was most of the inline work in a
// list-heavy document. Cached per parse on `env`, keyed by the macro itself; consumers only render.
// A symbol, like the sweep caches: a string key lands in `Object.keys`, where the env snapshot blanks
// it on every discarded probe.
var MARKER_TOKENS_ENV_KEY = Symbol('mmd.markerTokens');
// Dropped per render: shared tokens would otherwise carry a rule's write into the next render.
var clearMarkerTokens = function (env) {
    if (env && env[MARKER_TOKENS_ENV_KEY]) {
        env[MARKER_TOKENS_ENV_KEY] = undefined;
    }
};
exports.clearMarkerTokens = clearMarkerTokens;
// `env` belongs to the consumer and may reach two md instances or two option sets, whose tokens are
// not interchangeable — so the bucket is dropped when either changes.
var markerBucket = function (state) {
    var env = state.env;
    var cache = env[MARKER_TOKENS_ENV_KEY];
    if (cache && cache.md === state.md && cache.outMath === state.md.options.outMath) {
        return cache.byMacro;
    }
    var byMacro = new Map();
    env[MARKER_TOKENS_ENV_KEY] = { md: state.md, outMath: state.md.options.outMath, byMacro: byMacro };
    return byMacro;
};
// The cached originals, which no reader ever receives — every read takes a copy below. Frozen so that a
// path returning one uncopied, or our own code writing into the cache, fails here instead of leaking
// into the next list: that is how `link_open` was caught piling `target` onto a shared marker.
var freezeMarkerToken = function (token) {
    if (token.attrs) {
        token.attrs.forEach(function (attr) { return Object.freeze(attr); });
        Object.freeze(token.attrs);
    }
    if (token.children) {
        token.children.forEach(freezeMarkerToken);
        Object.freeze(token.children);
    }
    // `Object.freeze` is shallow: without these a write into `meta` or `map` would reach every list of the
    // render. Measured, no marker body produces either today — the guarantee, not a fixed defect.
    if (token.meta) {
        Object.freeze(token.meta);
    }
    if (token.map) {
        Object.freeze(token.map);
    }
    Object.freeze(token);
};
// A copy per read, always. Handing out the shared token cost either a leak into every later list with
// the same marker, or — once the cache was frozen — a `TypeError` out of `md.render` when a consumer's
// rule wrote to it. The copy carries its own `attrs` and `children`, so a write travels nowhere.
var readableMarker = function (token) {
    var copy = Object.assign(Object.create(Object.getPrototypeOf(token)), token);
    if (token.attrs) {
        copy.attrs = token.attrs.map(function (attr) { return attr.slice(); });
    }
    if (token.children) {
        copy.children = token.children.map(readableMarker);
    }
    // `meta` and `map` too: shared, a write into them would reach the frozen original and throw.
    if (token.meta) {
        copy.meta = tslib_1.__assign({}, token.meta);
    }
    if (token.map) {
        copy.map = token.map.slice();
    }
    return copy;
};
var parseMarkerTokens = function (state, level, cacheable) {
    var bucket = cacheable && state.env ? markerBucket(state) : null;
    var cached = bucket === null || bucket === void 0 ? void 0 : bucket.get(level);
    if (cached) {
        // Measured: not distinguishable over the corpus; on 400 lists of five items the copies cost about
        // 2 ms of 22 when the marker is math — its children are the parsed formula — and noise otherwise.
        return cached.map(readableMarker);
    }
    var children = [];
    (0, list_state_1.beginMarkerParse)();
    try {
        state.md.inline.parse(level, state.md, state.env, children);
    }
    finally {
        (0, list_state_1.endMarkerParse)();
    }
    if (bucket) {
        // Only what is cached: a write into a shared token reached every later list with the same marker.
        children.forEach(freezeMarkerToken);
        bucket.set(level, children);
        // Read back as any other list: the first must not get the frozen originals.
        return children.map(readableMarker);
    }
    return children;
};
/**
 * Parse bullet tokens for all itemize levels.
 */
var SetItemizeLevelTokens = function (state) {
    var originalOutMath = state.md.options.outMath;
    var docxMutation = !!state.md.options.forDocx;
    if (docxMutation) {
        state.md.options.outMath = {
            include_svg: true,
            include_mathml_word: false,
        };
        (0, convert_math_to_html_1.beginCacheBypass)(state);
    }
    try {
        // forDocx parses with mutated outMath and no math cache, so it keeps its own uncached tokens.
        exports.itemizeLevelTokens = exports.itemizeLevel.map(function (level) { return parseMarkerTokens(state, level, !docxMutation); });
    }
    finally {
        state.md.options.outMath = originalOutMath;
        if (docxMutation)
            (0, convert_math_to_html_1.endCacheBypass)(state);
    }
    return {
        tokens: tslib_1.__spreadArray([], tslib_1.__read(exports.itemizeLevelTokens), false),
        contents: tslib_1.__spreadArray([], tslib_1.__read(exports.itemizeLevel), false),
    };
};
exports.SetItemizeLevelTokens = SetItemizeLevelTokens;
/**
 * Parse bullet tokens for a specific itemize level index.
 */
var SetItemizeLevelTokensByIndex = function (state, index) {
    var originalOutMath = state.md.options.outMath;
    var docxMutation = !!state.md.options.forDocx;
    if (docxMutation) {
        state.md.options.outMath = {
            include_svg: true,
            include_mathml_word: false,
        };
        (0, convert_math_to_html_1.beginCacheBypass)(state);
    }
    try {
        exports.itemizeLevelTokens[index] = parseMarkerTokens(state, exports.itemizeLevel[index], !docxMutation);
    }
    finally {
        state.md.options.outMath = originalOutMath;
        if (docxMutation)
            (0, convert_math_to_html_1.endCacheBypass)(state);
    }
};
exports.SetItemizeLevelTokensByIndex = SetItemizeLevelTokensByIndex;
/**
 * Returns cached itemize level tokens or provided subset.
 */
var GetItemizeLevelTokens = function (data) {
    if (data === void 0) { data = null; }
    if (!data || data.length === 0) {
        return exports.itemizeLevelTokens.length > 0 ? tslib_1.__spreadArray([], tslib_1.__read(exports.itemizeLevelTokens), false) : [];
    }
    return tslib_1.__spreadArray([], tslib_1.__read(data), false);
};
exports.GetItemizeLevelTokens = GetItemizeLevelTokens;
/**
 * Get both bullet content and parsed tokens from state.
 */
var GetItemizeLevelTokensByState = function (state) {
    if (exports.itemizeLevelTokens.length > 0) {
        return {
            contents: tslib_1.__spreadArray([], tslib_1.__read(exports.itemizeLevel), false),
            tokens: tslib_1.__spreadArray([], tslib_1.__read(exports.itemizeLevelTokens), false),
        };
    }
    return (0, exports.SetItemizeLevelTokens)(state);
};
exports.GetItemizeLevelTokensByState = GetItemizeLevelTokensByState;
/**
 * Change list style for \labelitemi, \labelenumi etc.
 * Supports both itemize and enumerate levels.
 */
var ChangeLevel = function (state, data) {
    if (!data)
        return false;
    var _a = data.command, command = _a === void 0 ? "" : _a, _b = data.params, params = _b === void 0 ? "" : _b;
    if (!command || !params)
        return false;
    // ENUMERATE: labelenumi, labelenumii...
    var index = consts_1.ENUM_LEVEL_COMMANDS.indexOf(command);
    if (index >= 0) {
        var match = params.match(consts_1.LATEX_ENUM_STYLE_RE);
        if (match) {
            var styleMatch = match[0].slice(1).match(consts_1.LATEX_ENUM_STYLE_KEY_RE);
            if (styleMatch) {
                exports.enumerateLevel[index] = consts_1.ENUM_STYLES[styleMatch[0]];
                return true;
            }
        }
        return false;
    }
    // ITEMIZE: labelitemi, labelitemii...
    index = consts_1.ITEM_LEVEL_COMMANDS.indexOf(command);
    if (index >= 0) {
        exports.itemizeLevel[index] = params;
        (0, exports.SetItemizeLevelTokensByIndex)(state, index);
        return true;
    }
    return false;
};
exports.ChangeLevel = ChangeLevel;
/**
 * Clears stored itemize level token cache. The definitions survive by design: set once per md
 * instance, so a chunked host keeps a \renewcommand from an earlier chunk.
 */
var clearItemizeLevelTokens = function () {
    exports.itemizeLevelTokens = [];
};
exports.clearItemizeLevelTokens = clearItemizeLevelTokens;
//# sourceMappingURL=re-level.js.map