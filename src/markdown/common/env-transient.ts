// Transient env flags set only while parsing inside a LaTeX list block. They gate the
// inline list fallback (`if (!state.env.isBlock) ...`) and are valid only during that
// parse. They must never be persisted into a token's `envToInline` snapshot: core-inline
// replays envToInline onto the shared env, so a captured `isBlock: true` would leak into
// unrelated later content and wake the inline fallback (empty `<>` list items).
export const LIST_TRANSIENT_ENV_KEYS: readonly string[] = ['isBlock', 'inheritedListType', 'parentType', 'prentLevel'];

// Env keys written by the rules reachable from a list body — floats, align, tabular, section
// numbering; rolled back only when the speculative parse is discarded (else the tokens own them).
// Hand-maintained, not derived from the write sites: a new key shows up as a failing probe case
// in tests/_parse-isolation.js ("leaves state.env unchanged") and belongs in this list.
export const LIST_SPECULATIVE_ENV_KEYS: readonly string[] =
  ['caption', 'captionPos', 'captionIsLabelFormatEmpty', 'captionIsSingleLineCheck',
   'envType', 'align', 'alignEnvBlock', 'number', 'type',
   'isInline', 'subTabular', 'tabulare'];

const TRANSIENT_KEY_SET: Set<string> = new Set(LIST_TRANSIENT_ENV_KEYS);

// Rolled-back keys hold `undefined`; replaying that would clear a key that went live later.
// The begin-tabular trio is exempt — it sets these undefined on purpose and needs the replay.
const REPLAY_UNDEFINED_KEYS: Set<string> = new Set(['isInline', 'subTabular', 'tabulare']);
const CLOBBER_PRONE_KEYS: Set<string> = new Set(
  LIST_SPECULATIVE_ENV_KEYS.filter((k) => !REPLAY_UNDEFINED_KEYS.has(k)));

// Snapshot of `env` for a token's `envToInline`, minus the transient list-parse flags. Copies
// wanted keys instead of deleting from a spread: `delete` leaves it in dictionary mode (~13%).
export const snapshotEnvForInline = (env: any): any => {
  const snap: any = {};
  for (const k of Object.keys(env)) {
    if (TRANSIENT_KEY_SET.has(k)) {
      continue;
    }
    if (env[k] === undefined && CLOBBER_PRONE_KEYS.has(k)) {
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
