"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapshotEnvForInline = exports.LIST_TRANSIENT_ENV_KEYS = void 0;
var tslib_1 = require("tslib");
// Transient env flags set only while parsing inside a LaTeX list block. They gate the
// inline list fallback (`if (!state.env.isBlock) ...`) and are valid only during that
// parse. They must never be persisted into a token's `envToInline` snapshot: core-inline
// replays envToInline onto the shared env, so a captured `isBlock: true` would leak into
// unrelated later content and wake the inline fallback (empty `<>` list items).
exports.LIST_TRANSIENT_ENV_KEYS = ['isBlock', 'inheritedListType', 'parentType', 'prentLevel'];
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
//# sourceMappingURL=env-transient.js.map