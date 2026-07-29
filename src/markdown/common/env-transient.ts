// Transient env flags set only while parsing inside a LaTeX list block. They gate the
// inline list fallback (`if (!state.env.isBlock) ...`) and are valid only during that
// parse. They must never be persisted into a token's `envToInline` snapshot: core-inline
// replays envToInline onto the shared env, so a captured `isBlock: true` would leak into
// unrelated later content and wake the inline fallback (empty `<>` list items).
export const LIST_TRANSIENT_ENV_KEYS: readonly string[] = ['isBlock', 'inheritedListType', 'parentType', 'prentLevel'];

// Snapshot of `env` for a token's `envToInline`, minus the transient list-parse flags.
export const snapshotEnvForInline = (env: any): any => {
  const snap: any = { ...env };
  for (const k of LIST_TRANSIENT_ENV_KEYS) {
    delete snap[k];
  }
  return snap;
};
