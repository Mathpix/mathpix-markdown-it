/**
 * State manager for nested LaTeX list environments (e.g., \begin{itemize}, \item).
 *
 * Levels are a stack: enter pushes, leave pops, depth is the length. No separate depth index —
 * an index plus an array are two sources of truth, and rolling back one desyncs `openItems`.
 *
 * Depth levels:
 *   -1 — outside of any list
 *    0 — first list level
 *    1 — nested list level
 *    ...
 */
export interface ListLevelState {
    openItems: number;
}
/**
 * Reset all list-related state.
 * Should be called before starting a new parsing session.
 */
export declare const resetListState: () => void;
/**
 * Enter a new nested list level (e.g., encountering \begin{itemize}).
 * The counter is always fresh: a discarded parse can leave a level with items still open.
 */
export declare const enterListLevel: () => void;
/**
 * Leave the current list level (e.g., encountering \end{itemize}).
 * If already outside lists, logs a warning.
 */
export declare const leaveListLevel: () => void;
/**
 * Get the state object for the current depth level.
 *
 * @returns State object or undefined.
 */
export declare const getCurrentListLevelState: () => ListLevelState | undefined;
/**
 * Increment the number of opened \item commands on the current list level.
 * Logs a warning if called when no list level is active.
 */
export declare const incrementItemCount: () => void;
/** Current nesting depth (-1 outside any list). Read-only view for cache keys. */
export declare const getListDepth: () => number;
/** Open-level count, to hand back to restoreListLevels after a speculative parse. */
export declare const snapshotListLevels: () => number;
/** Drop levels entered since the snapshot. Only truncates, never re-creates. */
export declare const restoreListLevels: (depth: number) => void;
