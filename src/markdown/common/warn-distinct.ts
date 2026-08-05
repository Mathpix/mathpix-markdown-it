// Speculative parses reach these diagnostics once per offending line, so a desync would flood a
// consumer's log. Report each distinct case once per parse (reset below); a repeat says nothing new.
const warned: Set<string> = new Set();

export const warnDistinct = (key: string, ...args: any[]): void => {
  if (warned.has(key)) {
    return;
  }
  warned.add(key);
  console.warn(...args);
};

// Called per parse from resetMmdGlobalState, next to the other cross-parse resets.
export const resetWarnDistinct = (): void => {
  warned.clear();
};
