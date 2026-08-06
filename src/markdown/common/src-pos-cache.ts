import type StateBlock from 'markdown-it/lib/rules_block/state_block';

type SrcPosEntry = { src: string; lastPos: number };

/**
 * Offset of the last `patternG` match in `state.src`, or -1, cached on the state under `key`.
 *
 * Block rules use it to reject in O(1) what would otherwise cost a scan to end of source per
 * probe — terminator scans re-ask the same rule for every line, which makes such a scan quadratic
 * over a document.
 *
 * `patternG` MUST carry /g and must not be shared with a caller that relies on its `lastIndex`.
 * A nested `state.md.block.parse(...)` builds its own StateBlock, so a cache on the outer state is
 * never read by a nested parse; within one state, reassigning `state.src` invalidates the entry
 * (strings are immutable, so identity is a sound check).
 */
export const lastMatchPosCached = (
  state: StateBlock,
  key: symbol,
  patternG: RegExp,
): number => {
  const slot = state as unknown as Record<symbol, SrcPosEntry | undefined>;
  const cached = slot[key];
  if (cached && cached.src === state.src) {
    return cached.lastPos;
  }
  patternG.lastIndex = 0;
  let lastPos: number = -1;
  let m: RegExpExecArray | null;
  while ((m = patternG.exec(state.src)) !== null) {
    lastPos = m.index;
    // Empty-match guard: a pattern that can match '' would otherwise spin here.
    if (m.index === patternG.lastIndex) {
      patternG.lastIndex++;
    }
  }
  patternG.lastIndex = 0;
  slot[key] = { src: state.src, lastPos };
  return lastPos;
};

/**
 * Offsets of every `patternG` match in `state.src`, ascending, cached on the state under `key`.
 * Same contract as lastMatchPosCached: /g required, invalidated when `state.src` is reassigned.
 */
export const matchPositionsCached = (
  state: StateBlock,
  key: symbol,
  patternG: RegExp,
): readonly number[] => {
  const slot = state as unknown as Record<symbol, { src: string; positions: number[] } | undefined>;
  const cached = slot[key];
  if (cached && cached.src === state.src) {
    return cached.positions;
  }
  patternG.lastIndex = 0;
  const positions: number[] = [];
  let match: RegExpExecArray | null;
  while ((match = patternG.exec(state.src)) !== null) {
    positions.push(match.index);
    if (match.index === patternG.lastIndex) {
      patternG.lastIndex++;
    }
  }
  patternG.lastIndex = 0;
  slot[key] = { src: state.src, positions };
  return positions;
};

/** How many of the ascending `positions` are at or after `minOffset` — binary search, no allocation. */
export const countPositionsAtOrAfter = (positions: readonly number[], minOffset: number): number => {
  let firstIndex = 0;
  let pastLastIndex = positions.length;
  while (firstIndex < pastLastIndex) {
    const middleIndex: number = (firstIndex + pastLastIndex) >> 1;
    if (positions[middleIndex] < minOffset) {
      firstIndex = middleIndex + 1;
    } else {
      pastLastIndex = middleIndex;
    }
  }
  return positions.length - firstIndex;
};

/** The nearest of the ascending `positions` at or after `minOffset`, or -1 when none is left. */
export const firstPositionAtOrAfter = (positions: readonly number[], minOffset: number): number => {
  const count: number = countPositionsAtOrAfter(positions, minOffset);
  return count > 0 ? positions[positions.length - count] : -1;
};
