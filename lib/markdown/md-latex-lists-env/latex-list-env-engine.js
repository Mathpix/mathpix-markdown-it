"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeAssignToken = exports.flushBufferedTokens = exports.flushTokensToInline = exports.parseListEnvRawToTokens = exports.createBufferedState = exports.buildBlockStateFromRaw = exports.shiftTokenAbsolutePositions = void 0;
var tslib_1 = require("tslib");
var TokenCtor = require("markdown-it/lib/token");
var latex_list_env_block_1 = require("./latex-list-env-block");
/** Shallow clone but shift known position fields by baseOffset */
var shiftTokenAbsolutePositions = function (tok, baseOffset) {
    var e_1, _a, e_2, _b;
    if (!baseOffset)
        return tok;
    // inlinePos is the important one in your lists
    if (tok.inlinePos && typeof tok.inlinePos === "object") {
        if (typeof tok.inlinePos.start_content === "number")
            tok.inlinePos.start_content += baseOffset;
        if (typeof tok.inlinePos.end_content === "number")
            tok.inlinePos.end_content += baseOffset;
        if (typeof tok.inlinePos.start === "number")
            tok.inlinePos.start += baseOffset;
        if (typeof tok.inlinePos.end === "number")
            tok.inlinePos.end += baseOffset;
    }
    // Optional: shift token.map if you store absolute line mapping somewhere (rare in inline)
    // if (tok.map && Array.isArray(tok.map)) { ... }
    // Shift markerTokens too (if they have inlinePos)
    if (tok.markerTokens && Array.isArray(tok.markerTokens)) {
        try {
            for (var _c = tslib_1.__values(tok.markerTokens), _d = _c.next(); !_d.done; _d = _c.next()) {
                var child = _d.value;
                (0, exports.shiftTokenAbsolutePositions)(child, baseOffset);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    // Shift children if some later pipeline attaches them (rare here, but safe)
    if (tok.children && Array.isArray(tok.children)) {
        try {
            for (var _e = tslib_1.__values(tok.children), _f = _e.next(); !_f.done; _f = _e.next()) {
                var child = _f.value;
                (0, exports.shiftTokenAbsolutePositions)(child, baseOffset);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    return tok;
};
exports.shiftTokenAbsolutePositions = shiftTokenAbsolutePositions;
/**
 * Builds a minimal StateBlock-like object from a raw LaTeX environment string.
 *
 * Notes:
 * - Normalizes CRLF to LF.
 * - Computes `bMarks/eMarks/tShift` so `state.src.slice(bMarks[i]+tShift[i], eMarks[i])`
 *   matches each logical line (without a trailing "\n" after the last line).
 * - `env` is shallow-copied and forced to `{ isBlock: true }` for downstream checks.
 */
var buildBlockStateFromRaw = function (md, raw, baseEnv) {
    var normalized = raw.replace(/\r\n/g, "\n");
    var lines = normalized.split("\n");
    var st = {
        md: md,
        src: normalized,
        env: tslib_1.__assign(tslib_1.__assign({}, (baseEnv || {})), { isBlock: true, isInline: true }),
        tokens: [],
        bMarks: [],
        eMarks: [],
        tShift: [],
        line: 0,
        startLine: 0,
        lineMax: lines.length,
        parentType: "root",
        level: 0,
        prentLevel: 0,
    };
    var offset = 0;
    for (var i = 0; i < lines.length; i++) {
        st.bMarks[i] = offset;
        st.tShift[i] = 0;
        offset += lines[i].length;
        st.eMarks[i] = offset;
        // Only add '\n' between lines (not after last line)
        if (i !== lines.length - 1)
            offset += 1;
    }
    st.push = function (type, tag, nesting) {
        // const tok = new (Token as any)(type, tag, nesting);
        var tok = new TokenCtor(type, tag, nesting);
        tok.block = true;
        tok.level = st.level;
        if (nesting === 1)
            st.level++;
        if (nesting === -1)
            st.level--;
        st.tokens.push(tok);
        return tok;
    };
    return st;
};
exports.buildBlockStateFromRaw = buildBlockStateFromRaw;
/**
 * Creates a buffered state that collects tokens into a local array instead of
 * mutating the original StateBlock tokens immediately.
 *
 * Useful when you want "all-or-nothing" token emission (e.g., for inline reuse,
 * strict parsing, rollback on failure).
 */
var createBufferedState = function (state) {
    // prototype-inherit all read-only properties (bMarks, eMarks, src, etc.)
    var tempState = Object.create(state);
    // isolate tokens + env
    tempState.tokens = [];
    // tempState.env = { ...(state.env || {}) };
    // IMPORTANT: start from current level, and advance/decrease with nesting
    tempState.level = state.level;
    tempState.push = (function (type, tag, nesting) {
        // const tok = new (Token as any)(type, tag, nesting);
        var tok = new TokenCtor(type, tag, nesting);
        tok.block = true;
        tok.level = tempState.level;
        // Maintain level changes the same way markdown-it does
        if (nesting === 1)
            tempState.level++;
        if (nesting === -1)
            tempState.level--;
        tempState.tokens.push(tok);
        return tok;
    });
    return tempState;
};
exports.createBufferedState = createBufferedState;
/**
 * Run ListsInternal on raw env and return produced tokens.
 * baseOffset used later to shift positions to absolute.
 */
var parseListEnvRawToTokens = function (md, raw, baseEnv) {
    var blockState = (0, exports.buildBlockStateFromRaw)(md, raw, baseEnv);
    var ok = (0, latex_list_env_block_1.ListsInternal)(blockState, 0, blockState.lineMax);
    return { ok: ok, tokens: blockState.tokens, state: blockState };
};
exports.parseListEnvRawToTokens = parseListEnvRawToTokens;
/**
 * Push cloned tokens into inline state and shift local positions by baseOffset.
 */
var flushTokensToInline = function (inlineState, tokens, baseOffset) {
    var e_3, _a, e_4, _b;
    var pushCloned = function (sourceToken) {
        var newToken = inlineState.push(sourceToken.type, sourceToken.tag, sourceToken.nesting);
        // Copy fields safely
        (0, exports.safeAssignToken)(newToken, sourceToken);
        // Fix positions
        (0, exports.shiftTokenAbsolutePositions)(newToken, baseOffset);
    };
    try {
        for (var tokens_1 = tslib_1.__values(tokens), tokens_1_1 = tokens_1.next(); !tokens_1_1.done; tokens_1_1 = tokens_1.next()) {
            var srcToken = tokens_1_1.value;
            if ((srcToken === null || srcToken === void 0 ? void 0 : srcToken.type) === 'inline') {
                if (!srcToken.content) {
                    continue;
                }
                var children = [];
                inlineState.md.inline.parse(srcToken.content, inlineState.md, inlineState.env, children);
                try {
                    for (var children_1 = (e_4 = void 0, tslib_1.__values(children)), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                        var child = children_1_1.value;
                        pushCloned(child);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (children_1_1 && !children_1_1.done && (_b = children_1.return)) _b.call(children_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                continue;
            }
            pushCloned(srcToken);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (tokens_1_1 && !tokens_1_1.done && (_a = tokens_1.return)) _a.call(tokens_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
};
exports.flushTokensToInline = flushTokensToInline;
/**
 * Flushes buffered tokens into the real StateBlock using state.push().
 * This preserves markdown-it internal level mechanics.
 *
 * NOTE:
 * - Do not blindly overwrite `level` during assignment, since state.push() already
 *   applies correct nesting transitions. Prefer safeAssignToken() that skips level.
 */
var flushBufferedTokens = function (state, buffered) {
    var e_5, _a;
    try {
        for (var buffered_1 = tslib_1.__values(buffered), buffered_1_1 = buffered_1.next(); !buffered_1_1.done; buffered_1_1 = buffered_1.next()) {
            var t = buffered_1_1.value;
            var tok = state.push(t.type, t.tag, t.nesting);
            (0, exports.safeAssignToken)(tok, t);
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (buffered_1_1 && !buffered_1_1.done && (_a = buffered_1.return)) _a.call(buffered_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
};
exports.flushBufferedTokens = flushBufferedTokens;
/**
 * Safe assign: copy custom fields but do NOT overwrite core ones that markdown-it sets.
 */
var safeAssignToken = function (target, src) {
    var e_6, _a;
    var SKIP = new Set(["type", "tag", "nesting", "level", "block"]);
    try {
        for (var _b = tslib_1.__values(Object.keys(src)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var key = _c.value;
            if (SKIP.has(key))
                continue;
            target[key] = src[key];
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_6) throw e_6.error; }
    }
    return target;
};
exports.safeAssignToken = safeAssignToken;
//# sourceMappingURL=latex-list-env-engine.js.map