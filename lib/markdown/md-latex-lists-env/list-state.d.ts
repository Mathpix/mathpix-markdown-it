/**
 * State manager for nested LaTeX list environments (e.g., \begin{itemize}, \item).
 *
 * This module tracks the current depth of nested lists and the number of \item
 * entries opened at each depth level during parsing.
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
 * Automatically creates state storage for the new level if needed.
 */
export declare const enterListLevel: () => void;
/**
 * Leave the current list level (e.g., encountering \end{itemize}).
 * If already outside lists, logs a warning.
 */
export declare const leaveListLevel: () => void;
/**
 * Get the state object for a specific depth level.
 *
 * @param depth - The list depth level.
 * @returns State object or undefined.
 */
export declare const getListLevelState: (depth: number) => ListLevelState | undefined;
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
