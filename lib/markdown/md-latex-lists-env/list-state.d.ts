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
/** How many lists are open right now — a live count, not a snapshot. */
export declare const getOpenListCount: () => number;
export declare const snapshotListLevels: () => readonly ListLevelState[];
export declare const restoreListLevels: (snapshot: readonly ListLevelState[]) => void;
export declare const isParsingMarker: () => boolean;
export declare const beginMarkerParse: () => void;
export declare const endMarkerParse: () => void;
