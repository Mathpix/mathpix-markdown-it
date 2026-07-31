// Transient env flags set only while parsing inside a LaTeX list block. They gate the
// inline list fallback (`if (!state.env.isBlock) ...`) and are valid only during that
// parse. They must never be persisted into a token's `envToInline` snapshot: core-inline
// replays envToInline onto the shared env, so a captured `isBlock: true` would leak into
// unrelated later content and wake the inline fallback (empty `<>` list items).
export const LIST_TRANSIENT_ENV_KEYS: readonly string[] = ['isBlock', 'inheritedListType', 'parentType', 'prentLevel'];

// Env the nested block rules write while a list body is parsed speculatively: floats
// (`begin-table.ts`) and tabulars (`begin-tabular`). Rolled back only when that parse is
// discarded; on commit the flushed tokens own them. A *committed* float still leaves the float
// keys set — `begin-table` never clears them (pre-existing, happens without a list too).
export const LIST_SPECULATIVE_ENV_KEYS: readonly string[] =
  ['caption', 'captionPos', 'captionIsLabelFormatEmpty', 'captionIsSingleLineCheck',
   'envType', 'align', 'alignEnvBlock', 'number', 'type',
   'isInline', 'subTabular', 'tabulare'];

// Snapshot of `env` for a token's `envToInline`, minus the transient list-parse flags.
export const snapshotEnvForInline = (env: any): any => {
  const snap: any = { ...env };
  for (const k of LIST_TRANSIENT_ENV_KEYS) {
    delete snap[k];
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

// Restore `keys` in `env` from a snapshotEnvKeys() result (deletes keys that were absent).
export const restoreEnvKeys = (env: any, keys: readonly string[], had: { [k: string]: boolean }, snap: { [k: string]: any }): void => {
  for (const k of keys) {
    if (had[k]) {
      env[k] = snap[k];
    } else {
      delete env[k];
    }
  }
};
