// Transient env flags set only while parsing inside a LaTeX list block. They gate the
// inline list fallback (`if (!state.env.isBlock) ...`) and are valid only during that
// parse. They must never be persisted into a token's `envToInline` snapshot: core-inline
// replays envToInline onto the shared env, so a captured `isBlock: true` would leak into
// unrelated later content and wake the inline fallback (empty `<>` list items).
export const LIST_TRANSIENT_ENV_KEYS: readonly string[] = ['isBlock', 'inheritedListType', 'parentType', 'prentLevel'];

const TRANSIENT_KEY_SET: Set<string> = new Set(LIST_TRANSIENT_ENV_KEYS);

// Rolled-back keys hold `undefined`; replaying that would clear a key that went live later.
// The begin-tabular trio is exempt — it sets these undefined on purpose and needs the replay.
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

// Every own string key and value of `env`, so a discarded parse can be undone without naming the
// keys a rule might write. Symbol keys are out, as they were with the named list.
export const snapshotEnvAll = (env: any): { keys: string[]; values: any[] } => {
  const keys: string[] = Object.keys(env);
  const values: any[] = new Array(keys.length);
  for (let i = 0; i < keys.length; i++) {
    values[i] = env[keys[i]];
  }
  return { keys, values };
};

// Puts back every value the parse changed and clears the keys it added (`undefined`, never `delete`
// — see restoreEnvKeys). Same loop notices a key deleted by a foreign rule, so an equal key count
// cannot hide one deletion plus one addition; without such a delete the sweep never runs.
export const restoreEnvAll = (env: any, snap: { keys: string[]; values: any[] }): void => {
  const { keys, values } = snap;
  let vanished = false;
  for (let i = 0; i < keys.length; i++) {
    const key: string = keys[i];
    if (!(key in env)) {
      vanished = true;
      env[key] = values[i];
    } else if (env[key] !== values[i]) {
      env[key] = values[i];
    }
  }
  const current: string[] = Object.keys(env);
  if (!vanished && current.length === keys.length) {
    return;
  }
  const had: Set<string> = new Set(keys);
  for (let i = 0; i < current.length; i++) {
    if (!had.has(current[i])) {
      env[current[i]] = undefined;
    }
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
