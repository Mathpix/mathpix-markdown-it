// Speculative parses reach these diagnostics once per offending line, so a desync would flood a
// consumer's log. Report each distinct case once per parse (reset below); a repeat says nothing new.
const warned: Set<string> = new Set();
// A key carries a list depth or an error message, so a pathological document can mint many. Past the
// cap the set stops growing and reporting: it exists to dedupe a flood, not to itemise one.
const MAX_DISTINCT_KEYS = 200;

let capReported: boolean = false;

export const warnDistinct = (key: string, ...args: any[]): void => {
  if (warned.has(key)) {
    return;
  }
  if (warned.size >= MAX_DISTINCT_KEYS) {
    // Said once, so a reader knows the log is truncated rather than complete.
    if (!capReported) {
      capReported = true;
      console.warn(`[mmd] more than ${MAX_DISTINCT_KEYS} distinct diagnostics in one render; the rest are silent`);
    }
    return;
  }
  warned.add(key);
  console.warn(...args);
};

// Called per render from the `reset_mmd_global_state` rule, before its partial-render bail — so it is
// not part of the public resetMmdGlobalState, which a partial render skips.
export const resetWarnDistinct = (): void => {
  warned.clear();
  capReported = false;
};
