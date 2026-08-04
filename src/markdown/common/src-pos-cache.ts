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
