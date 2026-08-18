import { warnDistinct } from "./warn-distinct";

// Transient env flags set only while parsing inside a LaTeX list block. They gate the
// inline list fallback (`if (!state.env.isBlock) ...`) and are valid only during that
// parse. They must never be persisted into a token's `envToInline` snapshot: core-inline
// replays envToInline onto the shared env, so a captured `isBlock: true` would leak into
// unrelated later content and wake the inline fallback (empty `<>` list items).
export const LIST_TRANSIENT_ENV_KEYS: readonly string[] = ['isBlock', 'inheritedListType', 'parentType', 'prentLevel'];

// A discarded parse rolls back every own string key of `env`, the caption counters and the level stack.
// The four keys above go back on every exit, commit included. Marker registries, TOC slugs, theorem and
// section counters, labels, footnotes and warn dedup are not rolled back — their rules reset per render.

// Pool slots kept warm across parses; deeper ones are released.
const MAX_WARM_SNAPSHOTS = 8;

const TRANSIENT_KEY_SET: Set<string> = new Set(LIST_TRANSIENT_ENV_KEYS);

// Snapshot of `env` for a token's `envToInline`, minus the transient list-parse flags. Every other key
// is kept, `undefined` included, so the replay clears what the spread it replaced would have cleared —
// dropping those by value instead needed an allowlist measured against fixtures. Copies wanted keys
// rather than deleting from a spread: `delete` leaves the object in dictionary mode (~13%).
export const snapshotEnvForInline = (env: any): any => {
  const snap: any = {};
  for (const k of Object.keys(env)) {
    if (TRANSIENT_KEY_SET.has(k)) {
      continue;
    }
    snap[k] = env[k];
  }
  // Symbol entries (TOC tokens, math cache, sweep buckets) are never list flags. Enumerable only, to
  // keep the same reach the `{...env}` spread had; the buckets ride along by reference, keyed by src.
  for (const k of Object.getOwnPropertySymbols(env)) {
    if (Object.prototype.propertyIsEnumerable.call(env, k)) {
      snap[k] = env[k];
    }
  }
  return snap;
};

export interface EnvSnapshot {
  keys: string[];
  values: any[];
  length: number;
}

// Snapshots are taken and released in LIFO order (a nested list is strictly inside its parent), so
// they come from a pool: the arrays stay warm and a list env costs no allocation. Depth is released
// by releaseEnvSnapshot in the same `finally` that restores.
const snapshotPool: EnvSnapshot[] = [];
let snapshotDepth = 0;

// Every own string key and value of `env`, so a discarded parse can be undone without naming the
// keys a rule might write. Symbol keys are out, as they were with the named list.
export const snapshotEnvAll = (env: any): EnvSnapshot => {
  let snapshot: EnvSnapshot = snapshotPool[snapshotDepth];
  if (!snapshot) {
    snapshot = { keys: [], values: [], length: 0 };
    snapshotPool[snapshotDepth] = snapshot;
  }
  // Claimed before the read, so a getter that re-enters gets the next slot and not this one; released
  // again if that read throws, since the pool reset no longer undoes drift for a live snapshot.
  snapshotDepth++;
  try {
    const keys: string[] = Object.keys(env);
    for (let i = 0; i < keys.length; i++) {
      snapshot.keys[i] = keys[i];
      snapshot.values[i] = env[keys[i]];
    }
    // Truncate, not just count: a leftover tail from a longer snapshot would answer a later search.
    snapshot.keys.length = keys.length;
    snapshot.values.length = keys.length;
    snapshot.length = keys.length;
  } catch (e) {
    snapshotDepth--;
    throw e;
  }
  return snapshot;
};

export const releaseEnvSnapshot = (): void => {
  if (snapshotDepth === 0) {
    return;
  }
  snapshotDepth--;
  // Drop the values: the slot outlives the parse and would hold that document's objects alive.
  const released: EnvSnapshot = snapshotPool[snapshotDepth];
  released.keys.length = 0;
  released.values.length = 0;
  released.length = 0;
};

// Puts back every value the parse changed, clears the keys it added: `undefined`, never `delete`,
// which drops `env` into dictionary mode. The count check also catches a key a foreign rule deleted.
// Compared by identity, so an object mutated in place is not restored — that rule must undo it.
// A slot that is not the innermost was already emptied by a pool reset, so restoring from it would blank
// every key the consumer owns. Both restores ask this first and leave `env` alone when it says no.
// Depth, not age: the pool hands the same object back at one depth, so a handle kept past its parse
// and asked at that depth would pass. Every caller restores in the `finally` that took it.
const snapshotIsUsable = (snap: EnvSnapshot): boolean => {
  if (snapshotPool[snapshotDepth - 1] === snap) {
    return true;
  }
  warnDistinct('env-snapshot-order',
    '[env] the snapshot is not the innermost one; env is left as the parse wrote it');
  return false;
};

export const restoreEnvAll = (env: any, snap: EnvSnapshot): void => {
  if (!snapshotIsUsable(snap)) {
    return;
  }
  const { keys, values, length } = snap;
  let vanished = false;
  for (let i = 0; i < length; i++) {
    const key: string = keys[i];
    // Own keys only: `in` would read an inherited `toString` as still present.
    if (!Object.prototype.hasOwnProperty.call(env, key)) {
      vanished = true;
      env[key] = values[i];
    } else if (env[key] !== values[i]) {
      env[key] = values[i];
    }
  }
  const current: string[] = Object.keys(env);
  if (!vanished && current.length === length) {
    return;
  }
  const had: Set<string> = new Set();
  for (let i = 0; i < length; i++) {
    had.add(keys[i]);
  }
  for (let i = 0; i < current.length; i++) {
    if (!had.has(current[i])) {
      env[current[i]] = undefined;
    }
  }
};

// Empties the warm pool between renders. A live snapshot here means a nested md.parse/md.render:
// emptying its slot would blank the keys the outer parse must put back, so the pool is kept.
export const resetEnvSnapshotPool = (): void => {
  if (snapshotDepth > 0) {
    warnDistinct('env-pool-nested',
      '[env] snapshot pool reset while a snapshot is live; the pool is kept');
    return;
  }
  if (snapshotPool.length > MAX_WARM_SNAPSHOTS) {
    snapshotPool.length = MAX_WARM_SNAPSHOTS;
  }
  for (let i = 0; i < snapshotPool.length; i++) {
    const slot: EnvSnapshot = snapshotPool[i];
    slot.keys.length = 0;
    slot.values.length = 0;
    slot.length = 0;
  }
};

// Restores just `keys` out of a full snapshot, so one snapshot serves both the always-on transient
// restore and the rollback. A key missing from the snapshot was added by the parse.
export const restoreEnvKeysFromAll = (
  env: any,
  keys: readonly string[],
  snap: EnvSnapshot,
): void => {
  if (!snapshotIsUsable(snap)) {
    return;
  }
  for (let i = 0; i < keys.length; i++) {
    const key: string = keys[i];
    const index: number = snap.keys.lastIndexOf(key, snap.length - 1);
    if (index !== -1) {
      env[key] = snap.values[index];
    } else if (Object.prototype.hasOwnProperty.call(env, key)) {
      // Added by the parse, so blanked rather than deleted; a key neither side has is left absent.
      env[key] = undefined;
    }
  }
};
