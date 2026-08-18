import type StateBlock from 'markdown-it/lib/rules_block/state_block';

// Hosted on `state.env`, which a buffered probe state inherits by reference: a cache written on the
// probe itself dies with it, so the sweep reran for every probe and the scan stayed quadratic.
// One entry per `src`, oldest evicted — and a hit refreshes its slot, or a run of nested parses
// would drop the outer document's entry, the one asked over and over.
const MAX_SOURCES_PER_KEY = 8;

// Which keys were ever used, so a render can empty the buckets without naming them.
const bucketKeys: Set<symbol> = new Set();

// A hot slot in front of the map: every call asks for the current `src`, and comparing that string by
// identity beats hashing several KB of source per block rule call. A miss falls through to the map.
// Slots, not bare values: a computed `undefined` must read as present, or its caller recomputes per ask.
interface Slot<T> {
  value: T;
}
interface Bucket<T> {
  hotSrc: string | null;
  hotSlot: Slot<T> | null;
  bySrc: Map<string, Slot<T>>;
}

// Read structurally, so an inline state — same `src`, same `env` — can use the cache as well.
type SrcState = { src: string; env?: any };

const bucketOf = <T>(state: SrcState, key: symbol): Bucket<T> => {
  // Falling back to `state` puts the cache outside the per-render clear, so it lives and dies with
  // that state instead. Every real state carries an `env`; a hand-built one may not.
  const host = ((state as any).env ?? state) as Record<symbol, Bucket<T> | undefined>;
  const bucket: Bucket<T> | undefined = host[key];
  if (bucket) {
    return bucket;
  }
  bucketKeys.add(key);
  return (host[key] = { hotSrc: null, hotSlot: null, bySrc: new Map<string, Slot<T>>() });
};

/** Empties the buckets on `env`: a host reusing one env would otherwise keep old documents alive.
 *  Emptied, not deleted — `delete` would drop `env` into dictionary mode for the whole parse. */
export const clearSrcPosCaches = (env: any): void => {
  if (!env) {
    return;
  }
  bucketKeys.forEach((key: symbol) => {
    const bucket: Bucket<any> | undefined = env[key];
    if (bucket) {
      bucket.hotSrc = null;
      bucket.hotSlot = null;
      bucket.bySrc.clear();
    }
  });
};

// Re-inserting makes this the newest entry: insertion order is the age order eviction reads.
// Skipped for a lone entry — nothing to age against, and this runs per block rule call.
const recall = <T>(bucket: Bucket<T>, src: string): Slot<T> | null => {
  if (bucket.hotSrc === src) {
    return bucket.hotSlot;
  }
  const hit: Slot<T> | undefined = bucket.bySrc.get(src);
  if (!hit) {
    return null;
  }
  if (bucket.bySrc.size > 1) {
    bucket.bySrc.delete(src);
    bucket.bySrc.set(src, hit);
  }
  bucket.hotSrc = src;
  bucket.hotSlot = hit;
  return hit;
};

// Insertion order is age order, so the oldest source goes and the current one stays cached. Eviction
// leaves the hot slot alone, so a key holds at most nine sources until the per-render clear.
const remember = <T>(bucket: Bucket<T>, src: string, value: T): T => {
  if (bucket.bySrc.size >= MAX_SOURCES_PER_KEY) {
    bucket.bySrc.delete(bucket.bySrc.keys().next().value);
  }
  const slot: Slot<T> = { value };
  bucket.bySrc.set(src, slot);
  bucket.hotSrc = src;
  bucket.hotSlot = slot;
  return value;
};

/**
 * Offset of the last `patternG` match in `state.src`, or -1, cached on `state.env` under `key`.
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
  const bucket: Bucket<number> = bucketOf<number>(state, key);
  const cached: Slot<number> | null = recall(bucket, state.src);
  if (cached) {
    return cached.value;
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
  state: SrcState,
  key: symbol,
  patternG: RegExp,
): readonly number[] => {
  const bucket: Bucket<number[]> = bucketOf<number[]>(state, key);
  const cached: Slot<number[]> | null = recall(bucket, state.src);
  if (cached) {
    return cached.value;
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

/**
 * Any value derived from `state.src`, cached on `state.env` under `key` — same contract as the sweeps
 * above: one entry per `src`, computed on first ask, so a caller asked per block pays once.
 */
export const srcValueCached = <T>(
  state: SrcState,
  key: symbol,
  compute: (src: string) => T,
): T => {
  const bucket: Bucket<T> = bucketOf<T>(state, key);
  const cached: Slot<T> | null = recall(bucket, state.src);
  return cached ? cached.value : remember(bucket, state.src, compute(state.src));
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

