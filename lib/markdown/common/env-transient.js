"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreEnvKeysFromAll = exports.resetEnvSnapshotPool = exports.restoreEnvAll = exports.releaseEnvSnapshot = exports.snapshotEnvAll = exports.snapshotEnvForInline = exports.LIST_TRANSIENT_ENV_KEYS = void 0;
var tslib_1 = require("tslib");
var warn_distinct_1 = require("./warn-distinct");
// Transient env flags set only while parsing inside a LaTeX list block. They gate the
// inline list fallback (`if (!state.env.isBlock) ...`) and are valid only during that
// parse. They must never be persisted into a token's `envToInline` snapshot: core-inline
// replays envToInline onto the shared env, so a captured `isBlock: true` would leak into
// unrelated later content and wake the inline fallback (empty `<>` list items).
exports.LIST_TRANSIENT_ENV_KEYS = ['isBlock', 'inheritedListType', 'parentType', 'prentLevel'];
// Pool slots kept warm across parses; deeper ones are released.
var MAX_WARM_SNAPSHOTS = 8;
var TRANSIENT_KEY_SET = new Set(exports.LIST_TRANSIENT_ENV_KEYS);
// Rolled-back keys hold `undefined`; replaying that would clear a key that went live later. The
// tabular trio is exempt (dropping it changes 12 nested-table fixtures); the list is measured over
// the shapes in `_parse-isolation.js`, so a key parked by a shape outside them needs adding there.
// `tabulare` is the tabular rule's own spelling: renaming it here drops 12 fixtures.
var REPLAY_UNDEFINED_KEYS = new Set(['isInline', 'subTabular', 'tabulare']);
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
            if (env[k] === undefined && !REPLAY_UNDEFINED_KEYS.has(k)) {
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
        // Symbol entries (TOC tokens, math cache, sweep buckets) are never list flags. Enumerable only, to
        // keep the same reach the `{...env}` spread had; the buckets ride along by reference, keyed by src.
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
// Snapshots are taken and released in LIFO order (a nested list is strictly inside its parent), so
// they come from a pool: the arrays stay warm and a list env costs no allocation. Depth is released
// by releaseEnvSnapshot in the same `finally` that restores.
var snapshotPool = [];
var snapshotDepth = 0;
// Every own string key and value of `env`, so a discarded parse can be undone without naming the
// keys a rule might write. Symbol keys are out, as they were with the named list.
var snapshotEnvAll = function (env) {
    var snapshot = snapshotPool[snapshotDepth];
    if (!snapshot) {
        snapshot = { keys: [], values: [], length: 0 };
        snapshotPool[snapshotDepth] = snapshot;
    }
    snapshotDepth++;
    var keys = Object.keys(env);
    for (var i = 0; i < keys.length; i++) {
        snapshot.keys[i] = keys[i];
        snapshot.values[i] = env[keys[i]];
    }
    // Truncate, not just count: a leftover tail from a longer snapshot would answer a later search.
    snapshot.keys.length = keys.length;
    snapshot.values.length = keys.length;
    snapshot.length = keys.length;
    return snapshot;
};
exports.snapshotEnvAll = snapshotEnvAll;
var releaseEnvSnapshot = function () {
    if (snapshotDepth === 0) {
        return;
    }
    snapshotDepth--;
    // Drop the values: the slot outlives the parse and would hold that document's objects alive.
    var released = snapshotPool[snapshotDepth];
    released.keys.length = 0;
    released.values.length = 0;
    released.length = 0;
};
exports.releaseEnvSnapshot = releaseEnvSnapshot;
// Puts back every value the parse changed, clears the keys it added: `undefined`, never `delete`,
// which drops `env` into dictionary mode. The count check also catches a key a foreign rule deleted.
// Compared by identity, so an object mutated in place is not restored — that rule must undo it.
var restoreEnvAll = function (env, snap) {
    // A slot that is not the innermost was already emptied by a pool reset: restoring from it blanks
    // every key the consumer owns, so leave `env` alone instead.
    if (snapshotPool[snapshotDepth - 1] !== snap) {
        (0, warn_distinct_1.warnDistinct)('env-snapshot-order', '[env] the snapshot is not the innermost one; env is left as the parse wrote it');
        return;
    }
    var keys = snap.keys, values = snap.values, length = snap.length;
    var vanished = false;
    for (var i = 0; i < length; i++) {
        var key = keys[i];
        // Own keys only: `in` would read an inherited `toString` as still present.
        if (!Object.prototype.hasOwnProperty.call(env, key)) {
            vanished = true;
            env[key] = values[i];
        }
        else if (env[key] !== values[i]) {
            env[key] = values[i];
        }
    }
    var current = Object.keys(env);
    if (!vanished && current.length === length) {
        return;
    }
    var had = new Set();
    for (var i = 0; i < length; i++) {
        had.add(keys[i]);
    }
    for (var i = 0; i < current.length; i++) {
        if (!had.has(current[i])) {
            env[current[i]] = undefined;
        }
    }
};
exports.restoreEnvAll = restoreEnvAll;
// Undoes depth drift left by a parse killed between snapshot and release.
// Safe while no rule runs a full md.parse/md.render: a nested one would hit this hook mid-snapshot.
var resetEnvSnapshotPool = function () {
    snapshotDepth = 0;
    if (snapshotPool.length > MAX_WARM_SNAPSHOTS) {
        snapshotPool.length = MAX_WARM_SNAPSHOTS;
    }
    for (var i = 0; i < snapshotPool.length; i++) {
        var slot = snapshotPool[i];
        slot.keys.length = 0;
        slot.values.length = 0;
        slot.length = 0;
    }
};
exports.resetEnvSnapshotPool = resetEnvSnapshotPool;
// Restores just `keys` out of a full snapshot, so one snapshot serves both the always-on transient
// restore and the rollback. A key missing from the snapshot was added by the parse.
var restoreEnvKeysFromAll = function (env, keys, snap) {
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var index = snap.keys.lastIndexOf(key, snap.length - 1);
        env[key] = index === -1 ? undefined : snap.values[index];
    }
};
exports.restoreEnvKeysFromAll = restoreEnvKeysFromAll;
//# sourceMappingURL=env-transient.js.map