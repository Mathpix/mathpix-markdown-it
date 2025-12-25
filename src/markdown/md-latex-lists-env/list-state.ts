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

// Internal state
let listLevels: ListLevelState[] = [];
let currentListDepth: number = -1; // -1 means “not inside a list”

/**
 * Reset all list-related state.
 * Should be called before starting a new parsing session.
 */
export const resetListState = (): void => {
  listLevels = [];
  currentListDepth = -1;
};

/**
 * Enter a new nested list level (e.g., encountering \begin{itemize}).
 * Automatically creates state storage for the new level if needed.
 */
export const enterListLevel = (): void => {
  currentListDepth++;

  if (!listLevels[currentListDepth]) {
    listLevels[currentListDepth] = { openItems: 0 };
  }
};

/**
 * Leave the current list level (e.g., encountering \end{itemize}).
 * If already outside lists, logs a warning.
 */
export const leaveListLevel = (): void => {
  if (currentListDepth < 0) {
    console.warn('[list-state] Attempt to leave list level while depth = -1');
    return;
  }
  currentListDepth--;
};

/**
 * Get the state object for a specific depth level.
 *
 * @param depth - The list depth level.
 * @returns State object or undefined.
 */
export const getListLevelState = (depth: number): ListLevelState | undefined => {
  return listLevels[depth];
};

/**
 * Get the state object for the current depth level.
 *
 * @returns State object or undefined.
 */
export const getCurrentListLevelState = (): ListLevelState | undefined => {
  return listLevels[currentListDepth];
};

/**
 * Increment the number of opened \item commands on the current list level.
 * Logs a warning if called when no list level is active.
 */
export const incrementItemCount = (): void => {
  const level = getCurrentListLevelState();
  if (!level) {
    console.warn(
      '[list-state] incrementItemCount called outside of any list level',
      {
        currentListDepth,
        listLevels,
      }
    );
    return;
  }
  level.openItems += 1;
};
