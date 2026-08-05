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

// Called per parse by resetListState(), the only caller — see md-latex-lists-env/list-state.ts.
export const resetWarnDistinct = (): void => {
  warned.clear();
};
