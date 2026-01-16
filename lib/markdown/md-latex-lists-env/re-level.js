"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearItemizeLevelTokens = exports.ChangeLevel = exports.GetItemizeLevelTokensByState = exports.GetItemizeLevelTokens = exports.SetItemizeLevelTokensByIndex = exports.SetItemizeLevelTokens = exports.GetEnumerateLevel = exports.GetItemizeLevel = exports.SetDefaultEnumerateLevel = exports.SetDefaultItemizeLevel = exports.itemizeLevelTokens = exports.enumerateLevel = exports.itemizeLevel = void 0;
var tslib_1 = require("tslib");
var list_markers_1 = require("../common/list-markers");
var consts_1 = require("../common/consts");
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
/**
 * Parse bullet tokens for all itemize levels.
 */
var SetItemizeLevelTokens = function (state) {
    var originalOptions = tslib_1.__assign({}, state.md.options);
    if (state.md.options.forDocx) {
        state.md.options = tslib_1.__assign(tslib_1.__assign({}, state.md.options), { outMath: {
                include_svg: true,
                include_mathml_word: false,
            } });
    }
    exports.itemizeLevelTokens = exports.itemizeLevel.map(function (level) {
        var children = [];
        state.md.inline.parse(level, state.md, state.env, children);
        return children;
    });
    state.md.options = originalOptions;
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
    var originalOptions = tslib_1.__assign({}, state.md.options);
    if (state.md.options.forDocx) {
        state.md.options = tslib_1.__assign(tslib_1.__assign({}, state.md.options), { outMath: {
                include_svg: true,
                include_mathml_word: false,
            } });
    }
    var children = [];
    state.md.inline.parse(exports.itemizeLevel[index], state.md, state.env, children);
    exports.itemizeLevelTokens[index] = children;
    state.md.options = originalOptions;
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
 * Clears stored itemize level token cache.
 */
var clearItemizeLevelTokens = function () {
    exports.itemizeLevelTokens = [];
};
exports.clearItemizeLevelTokens = clearItemizeLevelTokens;
//# sourceMappingURL=re-level.js.map