import type StateBlock from 'markdown-it/lib/rules_block/state_block';

// Hosted on `state.env`, which a buffered probe state inherits by reference: a cache written on the
// probe itself dies with it, so the sweep reran for every probe and the scan stayed quadratic.
// Keyed by `src`, so a nested parse cannot evict the outer document's entry.
const MAX_SOURCES_PER_KEY = 8;
const bucketOf = <T>(state: StateBlock, key: symbol): Map<string, T> => {
  const host = ((state as any).env ?? state) as Record<symbol, Map<string, T> | undefined>;
  return host[key] ?? (host[key] = new Map<string, T>());
};

// Insertion order is age order, so the oldest source goes and the current one stays cached.
const remember = <T>(bucket: Map<string, T>, src: string, value: T): T => {
  if (bucket.size >= MAX_SOURCES_PER_KEY) {
    bucket.delete(bucket.keys().next().value);
  }
  bucket.set(src, value);
  return value;
};

/**
 * Offset of the last `patternG` match in `state.src`, or -1, cached on the state under `key`.
 *
 * Block rules use it to reject in O(1) what would otherwise cost a scan to end of source per
 * probe — terminator scans re-ask the same rule for every line, which makes such a scan quadratic
 * over a document.
 *
 * `patternG` MUST carry /g and must not be shared with a caller that relies on its `lastIndex`.
 * Entries are per `src`: a nested parse reads its own, and reassigning `state.src` picks a different
 * one (strings are immutable, so identity is a sound key).
 */
export const lastMatchPosCached = (
  state: StateBlock,
  key: symbol,
  patternG: RegExp,
): number => {
  const bucket: Map<string, number> = bucketOf<number>(state, key);
  const cached: number | undefined = bucket.get(state.src);
  if (cached !== undefined) {
    return cached;
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
  return remember(bucket, state.src, lastPos);
};

/**
 * Offsets of every `patternG` match in `state.src`, ascending, cached on `state.env` under `key`.
 * Same contract as lastMatchPosCached: /g required, one entry per `src`.
 */
export const matchPositionsCached = (
  state: StateBlock,
  key: symbol,
  patternG: RegExp,
): readonly number[] => {
  const bucket: Map<string, number[]> = bucketOf<number[]>(state, key);
  const cached: number[] | undefined = bucket.get(state.src);
  if (cached) {
    return cached;
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
  return remember(bucket, state.src, positions);
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
