// Speculative parses reach these diagnostics once per offending line, so a desync would flood a
// consumer's log. Report each distinct case once per parse (reset below); a repeat says nothing new.
const warned: Set<string> = new Set();
// A key carries a list depth or an error message, so a pathological document can mint many. Past the
// cap the set stops growing and reporting: it exists to dedupe a flood, not to itemise one.
const MAX_DISTINCT_KEYS = 200;
// Per cause family, so a document minting hundreds of `list-rule-failed:` keys cannot silence the one
// warning another subsystem has to give. The family is the key up to its first colon.
const MAX_KEYS_PER_FAMILY = 40;

let capReported: boolean = false;
const perFamily: Map<string, number> = new Map();
const familyCapReported: Set<string> = new Set();

const familyOf = (key: string): string => {
  const at: number = key.indexOf(':');
  return at < 0 ? key : key.slice(0, at);
};

export const warnDistinct = (key: string, ...args: any[]): void => {
  if (warned.has(key)) {
    return;
  }
  const family: string = familyOf(key);
  const usedByFamily: number = perFamily.get(family) ?? 0;
  if (usedByFamily >= MAX_KEYS_PER_FAMILY) {
    if (!familyCapReported.has(family)) {
      familyCapReported.add(family);
      console.warn(`[mmd] more than ${MAX_KEYS_PER_FAMILY} distinct '${family}' diagnostics in one render; the rest of that family are silent`);
    }
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
  perFamily.set(family, usedByFamily + 1);
  console.warn(...args);
};

// Called per render from the `reset_mmd_global_state` rule, before its partial-render bail — so it is
// not part of the public resetMmdGlobalState, which a partial render skips.
export const resetWarnDistinct = (): void => {
  warned.clear();
  capReported = false;
  perFamily.clear();
  familyCapReported.clear();
};
