"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreEnvKeys = exports.snapshotEnvKeys = exports.snapshotEnvForInline = exports.LIST_SPECULATIVE_ENV_KEYS = exports.LIST_TRANSIENT_ENV_KEYS = void 0;
var tslib_1 = require("tslib");
// Transient env flags set only while parsing inside a LaTeX list block. They gate the
// inline list fallback (`if (!state.env.isBlock) ...`) and are valid only during that
// parse. They must never be persisted into a token's `envToInline` snapshot: core-inline
// replays envToInline onto the shared env, so a captured `isBlock: true` would leak into
// unrelated later content and wake the inline fallback (empty `<>` list items).
exports.LIST_TRANSIENT_ENV_KEYS = ['isBlock', 'inheritedListType', 'parentType', 'prentLevel'];
// Env keys written by the rules reachable from a list body — floats, align, tabular, section
// numbering; rolled back only when the speculative parse is discarded (else the tokens own them).
// Hand-maintained, not derived from the write sites: a new key shows up as a failing probe case
// in tests/_parse-isolation.js ("leaves state.env unchanged") and belongs in this list.
exports.LIST_SPECULATIVE_ENV_KEYS = ['caption', 'captionPos', 'captionIsLabelFormatEmpty', 'captionIsSingleLineCheck',
    'envType', 'align', 'alignEnvBlock', 'number', 'type',
    'isInline', 'subTabular', 'tabulare'];
var TRANSIENT_KEY_SET = new Set(exports.LIST_TRANSIENT_ENV_KEYS);
// Rolled-back keys hold `undefined`; replaying that would clear a key that went live later.
// The begin-tabular trio is exempt — it sets these undefined on purpose and needs the replay.
var REPLAY_UNDEFINED_KEYS = new Set(['isInline', 'subTabular', 'tabulare']);
var CLOBBER_PRONE_KEYS = new Set(exports.LIST_SPECULATIVE_ENV_KEYS.filter(function (k) { return !REPLAY_UNDEFINED_KEYS.has(k); }));
// Snapshot of `env` for a token's `envToInline`, minus the transient list-parse flags. Copies
// wanted keys instead of deleting from a spread: `delete` leaves it in dictionary mode (~13%).
var snapshotEnvForInline = function (env) {
    var e_1, _a, e_2, _b;
    var snap = {};
    try {
        for (var _c = tslib_1.__values(Object.keys(env)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var k = _d.value;
            if (TRANSIENT_KEY_SET.has(k)) {
                continue;
            }
            if (env[k] === undefined && CLOBBER_PRONE_KEYS.has(k)) {
                continue;
            }
            snap[k] = env[k];
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    try {
        // Symbol entries (TOC tokens, math cache) are never list flags. Enumerable only, to keep the
        // same reach the `{...env}` spread had.
        for (var _e = tslib_1.__values(Object.getOwnPropertySymbols(env)), _f = _e.next(); !_f.done; _f = _e.next()) {
            var k = _f.value;
            if (Object.prototype.propertyIsEnumerable.call(env, k)) {
                snap[k] = env[k];
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return snap;
};
exports.snapshotEnvForInline = snapshotEnvForInline;
// Record presence and value of `keys` in `env`, so they can be restored later.
var snapshotEnvKeys = function (env, keys) {
    var e_3, _a;
    var had = {};
    var snap = {};
    try {
        for (var keys_1 = tslib_1.__values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
            var k = keys_1_1.value;
            had[k] = k in env;
            snap[k] = env[k];
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return { had: had, snap: snap };
};
exports.snapshotEnvKeys = snapshotEnvKeys;
// Absent keys get `undefined`, not `delete`: `delete` drops `env` into dictionary mode for the
// rest of the parse (~20% on list-heavy input). Readers test the value, so it is equivalent.
var restoreEnvKeys = function (env, keys, had, snap) {
    var e_4, _a;
    try {
        for (var keys_2 = tslib_1.__values(keys), keys_2_1 = keys_2.next(); !keys_2_1.done; keys_2_1 = keys_2.next()) {
            var k = keys_2_1.value;
            env[k] = had[k] ? snap[k] : undefined;
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (keys_2_1 && !keys_2_1.done && (_a = keys_2.return)) _a.call(keys_2);
        }
        finally { if (e_4) throw e_4.error; }
    }
};
exports.restoreEnvKeys = restoreEnvKeys;
//# sourceMappingURL=env-transient.js.map