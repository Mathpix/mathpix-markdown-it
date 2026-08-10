"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeAssignToken = exports.flushBufferedTokens = exports.flushTokensToInline = exports.parseListEnvRawToTokens = exports.createBufferedState = exports.buildBlockStateFromRaw = exports.shiftTokenAbsolutePositions = exports.warnListRuleFailed = void 0;
var tslib_1 = require("tslib");
var TokenCtor = require("markdown-it/lib/token");
var latex_list_env_block_1 = require("./latex-list-env-block");
var caption_counters_1 = require("../common/caption-counters");
var list_state_1 = require("./list-state");
var warn_distinct_1 = require("../common/warn-distinct");
// One report per distinct cause per parse: the name alone collapses to `Error` for most
// internal faults, and the caller has no other signal (see the diagnostics Non-Goal).
var warnListRuleFailed = function (e) {
    var _a;
    var cause = e;
    (0, warn_distinct_1.warnDistinct)('list-rule-failed:' + (cause === null || cause === void 0 ? void 0 : cause.name) + ':' + ((_a = cause === null || cause === void 0 ? void 0 : cause.message) !== null && _a !== void 0 ? _a : ''), '[list] list rule failed; skipping the list', e);
};
exports.warnListRuleFailed = warnListRuleFailed;
// Hoisted: safeAssignToken runs per flushed token, so a per-call Set would dominate the copy.
var SAFE_ASSIGN_SKIP = new Set(["type", "tag", "nesting", "level", "block"]);
/** Shallow clone but shift known position fields by baseOffset */
var shiftTokenAbsolutePositions = function (tok, baseOffset) {
    var e_1, _a, e_2, _b;
    if (!baseOffset) {
        return tok;
    }
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
        Token: TokenCtor, // a real StateBlock carries it; rules build tokens through it
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
    // `env` is deliberately left inherited, so the buffered parse writes straight to the real env
    // and the commit path needs no copy-back. Giving a probe its own child env was measured slower:
    // the child allocation plus one extra prototype hop per read costs more than the snapshot.
    var tempState = Object.create(state);
    tempState.tokens = [];
    tempState.level = state.level;
    tempState.push = (function (type, tag, nesting) {
        var tok = new TokenCtor(type, tag, nesting);
        tok.block = true;
        tok.level = tempState.level;
        if (nesting === 1) {
            tempState.level++;
        }
        if (nesting === -1) {
            tempState.level--;
        }
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
    // Roll back caption counters if the speculative parse is discarded (!ok / throw); on ok
    // the caller uses the tokens, so the numbers are kept. Mirrors the Lists block rule.
    // No env rollback: this parse writes to a copy of env, not the caller's.
    // (This path is reached with a complete env, so !ok only fires on an internal abort — a
    // defensive rollback, not reachable via public input.)
    var captionSnap = (0, caption_counters_1.getCaptionCounters)();
    var listLevelSnap = (0, list_state_1.snapshotListLevels)();
    var ok = false;
    try {
        ok = (0, latex_list_env_block_1.ListsInternal)(blockState, 0, blockState.lineMax);
        return { ok: ok, tokens: blockState.tokens, state: blockState };
    }
    finally {
        if (!ok) {
            (0, caption_counters_1.setCaptionCounters)(captionSnap);
            (0, list_state_1.restoreListLevels)(listLevelSnap);
        }
    }
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
    // Object.keys, not `for...in`: measured faster here even with the array it allocates.
    var keys = Object.keys(src);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (SAFE_ASSIGN_SKIP.has(key)) {
            continue;
        }
        target[key] = src[key];
    }
    return target;
};
exports.safeAssignToken = safeAssignToken;
//# sourceMappingURL=latex-list-env-engine.js.map