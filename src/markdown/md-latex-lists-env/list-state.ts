import { warnDistinct } from "../common/warn-distinct";

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

// Counted, not boolean: a marker parsed inside another must not clear the flag early.
let markerParseDepth = 0;

// One entry per open list level, innermost last.
let listLevels: ListLevelState[] = [];

/**
 * Reset all list-related state.
 * Should be called before starting a new parsing session.
 */
export const resetListState = (): void => {
  listLevels = [];
};

/**
 * Enter a new nested list level (e.g., encountering \begin{itemize}).
 * The counter is always fresh: a discarded parse can leave a level with items still open.
 */
export const enterListLevel = (): void => {
  listLevels.push({ openItems: 0 });
};

/**
 * Leave the current list level (e.g., encountering \end{itemize}).
 * If already outside lists, logs a warning.
 */
export const leaveListLevel = (): void => {
  if (listLevels.length === 0) {
    warnDistinct('leave:' + getListDepth(),
      '[list-state] leaving a list level while outside any list', { depth: getListDepth() });
    return;
  }
  listLevels.pop();
};

/**
 * Get the state object for the current depth level.
 *
 * @returns State object or undefined.
 */
export const getCurrentListLevelState = (): ListLevelState | undefined => {
  return listLevels[listLevels.length - 1];
};

/**
 * Increment the number of opened \item commands on the current list level.
 * Logs a warning if called when no list level is active.
 */
export const incrementItemCount = (): void => {
  const level = getCurrentListLevelState();
  if (!level) {
    warnDistinct('increment:' + getListDepth(),
      '[list-state] incrementItemCount called outside of any list level',
      {
        currentListDepth: getListDepth(),
        listLevels,
      }
    );
    return;
  }
  level.openItems += 1;
};

/** Current nesting depth (-1 outside any list). Read-only view for cache keys. */
export const getListDepth = (): number => listLevels.length - 1;

/** How many lists are open right now — a live count, not a snapshot. */
export const getOpenListCount = (): number => listLevels.length;

// Structural: a length puts back neither a dropped level nor the `openItems` of a surviving one.
// The empty case is shared: a top-level list opens with no levels yet, and that is the common one.
const NO_LEVELS: readonly ListLevelState[] = Object.freeze([]);

export const snapshotListLevels = (): readonly ListLevelState[] =>
  listLevels.length === 0 ? NO_LEVELS : listLevels.map((level) => ({ openItems: level.openItems }));

export const restoreListLevels = (snapshot: readonly ListLevelState[]): void => {
  listLevels = snapshot.map((level) => ({ openItems: level.openItems }));
};

// A marker body is parsed with the block flag still set on `env`, so a list written there became a
// real list inside the marker's `<span>`.
export const isParsingMarker = (): boolean => markerParseDepth > 0;

export const beginMarkerParse = (): void => {
  markerParseDepth++;
};

export const endMarkerParse = (): void => {
  markerParseDepth--;
};
