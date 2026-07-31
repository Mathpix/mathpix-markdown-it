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
// Env the nested block rules write while a list body is parsed speculatively: floats
// (`begin-table.ts`) and tabulars (`begin-tabular`). Rolled back only when that parse is
// discarded; on commit the flushed tokens own them. A *committed* float still leaves the float
// keys set — `begin-table` never clears them (pre-existing, happens without a list too).
exports.LIST_SPECULATIVE_ENV_KEYS = ['caption', 'captionPos', 'captionIsLabelFormatEmpty', 'captionIsSingleLineCheck',
    'envType', 'align', 'alignEnvBlock', 'number', 'type',
    'isInline', 'subTabular', 'tabulare'];
// Snapshot of `env` for a token's `envToInline`, minus the transient list-parse flags.
var snapshotEnvForInline = function (env) {
    var e_1, _a;
    var snap = tslib_1.__assign({}, env);
    try {
        for (var LIST_TRANSIENT_ENV_KEYS_1 = tslib_1.__values(exports.LIST_TRANSIENT_ENV_KEYS), LIST_TRANSIENT_ENV_KEYS_1_1 = LIST_TRANSIENT_ENV_KEYS_1.next(); !LIST_TRANSIENT_ENV_KEYS_1_1.done; LIST_TRANSIENT_ENV_KEYS_1_1 = LIST_TRANSIENT_ENV_KEYS_1.next()) {
            var k = LIST_TRANSIENT_ENV_KEYS_1_1.value;
            delete snap[k];
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (LIST_TRANSIENT_ENV_KEYS_1_1 && !LIST_TRANSIENT_ENV_KEYS_1_1.done && (_a = LIST_TRANSIENT_ENV_KEYS_1.return)) _a.call(LIST_TRANSIENT_ENV_KEYS_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return snap;
};
exports.snapshotEnvForInline = snapshotEnvForInline;
// Record presence and value of `keys` in `env`, so they can be restored later.
var snapshotEnvKeys = function (env, keys) {
    var e_2, _a;
    var had = {};
    var snap = {};
    try {
        for (var keys_1 = tslib_1.__values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
            var k = keys_1_1.value;
            had[k] = k in env;
            snap[k] = env[k];
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return { had: had, snap: snap };
};
exports.snapshotEnvKeys = snapshotEnvKeys;
// Restore `keys` in `env` from a snapshotEnvKeys() result (deletes keys that were absent).
var restoreEnvKeys = function (env, keys, had, snap) {
    var e_3, _a;
    try {
        for (var keys_2 = tslib_1.__values(keys), keys_2_1 = keys_2.next(); !keys_2_1.done; keys_2_1 = keys_2.next()) {
            var k = keys_2_1.value;
            if (had[k]) {
                env[k] = snap[k];
            }
            else {
                delete env[k];
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (keys_2_1 && !keys_2_1.done && (_a = keys_2.return)) _a.call(keys_2);
        }
        finally { if (e_3) throw e_3.error; }
    }
};
exports.restoreEnvKeys = restoreEnvKeys;
//# sourceMappingURL=env-transient.js.map