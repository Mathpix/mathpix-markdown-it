/** Resets module-level cross-parse state: TOC slugs, labels, theorem/list/footnote counters, MathJax numbering.
 *  Does NOT clear state.env.__mathpix (released with env) or tabular caches (cleanup_tabular_state hook handles those).
 *  Auto-invoked via reset_mmd_global_state hook; exported for one-shot converters. */
export declare const resetMmdGlobalState: () => void;
