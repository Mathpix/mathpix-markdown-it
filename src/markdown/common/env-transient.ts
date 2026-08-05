// Transient env flags set only while parsing inside a LaTeX list block. They gate the
// inline list fallback (`if (!state.env.isBlock) ...`) and are valid only during that
// parse. They must never be persisted into a token's `envToInline` snapshot: core-inline
// replays envToInline onto the shared env, so a captured `isBlock: true` would leak into
// unrelated later content and wake the inline fallback (empty `<>` list items).
export const LIST_TRANSIENT_ENV_KEYS: readonly string[] = ['isBlock', 'inheritedListType', 'parentType', 'prentLevel'];

const TRANSIENT_KEY_SET: Set<string> = new Set(LIST_TRANSIENT_ENV_KEYS);

// Rolled-back keys hold `undefined`; replaying that would clear a key that went live later.
// The tabular trio is exempt: a nested `tabular` needs the cleared value to reach the replay, and
// dropping it from this set changes 12 nested-table tsv/csv fixtures (measured).
const REPLAY_UNDEFINED_KEYS: Set<string> = new Set(['isInline', 'subTabular', 'tabulare']);

// Snapshot of `env` for a token's `envToInline`, minus the transient list-parse flags. Copies
// wanted keys instead of deleting from a spread: `delete` leaves it in dictionary mode (~13%).
export const snapshotEnvForInline = (env: any): any => {
  const snap: any = {};
  for (const k of Object.keys(env)) {
    if (TRANSIENT_KEY_SET.has(k)) {
      continue;
    }
    if (env[k] === undefined && !REPLAY_UNDEFINED_KEYS.has(k)) {
      continue;
    }
    snap[k] = env[k];
  }
  // Symbol entries (TOC tokens, math cache) are never list flags. Enumerable only, to keep the
  // same reach the `{...env}` spread had.
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
  snapshotDepth++;
  const keys: string[] = Object.keys(env);
  for (let i = 0; i < keys.length; i++) {
    snapshot.keys[i] = keys[i];
    snapshot.values[i] = env[keys[i]];
  }
  // Truncate, not just count: a leftover tail from a longer snapshot would answer a later search.
  snapshot.keys.length = keys.length;
  snapshot.values.length = keys.length;
  snapshot.length = keys.length;
  return snapshot;
};

export const releaseEnvSnapshot = (): void => {
  if (snapshotDepth > 0) {
    snapshotDepth--;
  }
};

// Puts back every value the parse changed and clears the keys it added (`undefined`, never `delete`
// — see restoreEnvKeys). Same loop notices a key deleted by a foreign rule, so an equal key count
// cannot hide one deletion plus one addition; without such a delete the sweep never runs.
export const restoreEnvAll = (env: any, snap: EnvSnapshot): void => {
  const { keys, values, length } = snap;
  let vanished = false;
  let currentCount = 0;
  for (let i = 0; i < length; i++) {
    const key: string = keys[i];
    if (!(key in env)) {
      vanished = true;
      env[key] = values[i];
    } else if (env[key] !== values[i]) {
      env[key] = values[i];
    }
  }
  const current: string[] = Object.keys(env);
  currentCount = current.length;
  if (!vanished && currentCount === length) {
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

// Restores just `keys` out of a full snapshot, so one snapshot serves both the always-on transient
// restore and the rollback. A key missing from the snapshot was added by the parse.
export const restoreEnvKeysFromAll = (
  env: any,
  keys: readonly string[],
  snap: EnvSnapshot,
): void => {
  for (let i = 0; i < keys.length; i++) {
    const key: string = keys[i];
    const index: number = snap.keys.lastIndexOf(key, snap.length - 1);
    env[key] = index === -1 ? undefined : snap.values[index];
  }
};

// Record presence and value of `keys` in `env`, so they can be restored later.
export const snapshotEnvKeys = (env: any, keys: readonly string[]): { had: { [k: string]: boolean }; snap: { [k: string]: any } } => {
  const had: { [k: string]: boolean } = {};
  const snap: { [k: string]: any } = {};
  for (const k of keys) {
    had[k] = k in env;
    snap[k] = env[k];
  }
  return { had, snap };
};

// Absent keys get `undefined`, not `delete`: `delete` drops `env` into dictionary mode for the
// rest of the parse (~20% on list-heavy input). Readers test the value, so it is equivalent.
export const restoreEnvKeys = (env: any, keys: readonly string[], had: { [k: string]: boolean }, snap: { [k: string]: any }): void => {
  for (const k of keys) {
    env[k] = had[k] ? snap[k] : undefined;
  }
};
