import { nextMathSpan } from "./math-spans";
import { getInlineCodeListFromString } from "../common";
import { BEGIN_LST_INLINE_RE, END_LST_INLINE_RE } from "./consts";

/**
 * Stretches of source a parser reads verbatim: fenced blocks, `lstlisting` bodies, inline code and math.
 * A rule that re-reads raw source — the list guard looking ahead for a wrapper's closer — must skip
 * them, or a `{` or an `\end{itemize}` written there reads as structure. Detection mirrors the rules
 * that own each construct: the core fence rule, and `simpleMath`/`multiMath` for math — within a
 * paragraph, as those rules pair it.
 */

const BACKTICK: number = 0x60;
const TILDE: number = 0x7E;
const SPACE: number = 0x20;
const TAB: number = 0x09;

export type FenceMarker = { char: number; len: number };

const skipUpTo3Spaces = (rawLine: string): number => {
  let pos = 0;
  while (pos < 3 && rawLine.charCodeAt(pos) === SPACE) {
    pos++;
  }
  return pos;
};

/** Marker of a fence opening this line, or null. Mirrors the core fence rule (mmd-fence.ts): marker
 *  ` or ~, run of 3 or more, up to 3 leading spaces, no backtick in a backtick fence's info string. */
export const detectFenceOpen = (rawLine: string): FenceMarker | null => {
  const pos: number = skipUpTo3Spaces(rawLine);
  const char: number = rawLine.charCodeAt(pos);
  if (char !== BACKTICK && char !== TILDE) {
    return null;
  }
  let len = 0;
  while (rawLine.charCodeAt(pos + len) === char) {
    len++;
  }
  if (len < 3) {
    return null;
  }
  if (char === BACKTICK && rawLine.indexOf('`', pos + len) >= 0) {
    return null;
  }
  return { char, len };
};

/** Does this line close `fence`? Same char, at least as long, blank tail. */
export const isFenceClose = (rawLine: string, fence: FenceMarker): boolean => {
  const pos: number = skipUpTo3Spaces(rawLine);
  if (rawLine.charCodeAt(pos) !== fence.char) {
    return false;
  }
  let len = 0;
  while (rawLine.charCodeAt(pos + len) === fence.char) {
    len++;
  }
  if (len < fence.len) {
    return false;
  }
  for (let i = pos + len; i < rawLine.length; i++) {
    const c: number = rawLine.charCodeAt(i);
    if (c !== SPACE && c !== TAB) {
      return false;
    }
  }
  return true;
};

const lineEndFrom = (text: string, from: number): number => {
  const at: number = text.indexOf('\n', from);
  return at < 0 ? text.length : at;
};

// Where a fenced block opened on this line ends, or the end of `text` when it never closes.
const fenceRangeEnd = (text: string, afterOpenLine: number, fence: FenceMarker): number => {
  let scan: number = afterOpenLine;
  while (scan <= text.length) {
    const end: number = lineEndFrom(text, scan);
    if (isFenceClose(text.slice(scan, end), fence)) {
      return end;
    }
    if (end >= text.length) {
      return text.length;
    }
    scan = end + 1;
  }
  return text.length;
};

// Same for an `lstlisting` body, whose closer may sit on the opening line.
const listingRangeEnd = (text: string, openLineEnd: number, tailAfterOpen: string): number => {
  if (END_LST_INLINE_RE.test(tailAfterOpen)) {
    return openLineEnd;
  }
  let scan: number = openLineEnd + 1;
  while (scan <= text.length) {
    const end: number = lineEndFrom(text, scan);
    if (END_LST_INLINE_RE.test(text.slice(scan, end))) {
      return end;
    }
    if (end >= text.length) {
      return text.length;
    }
    scan = end + 1;
  }
  return text.length;
};

/**
 * Every verbatim stretch of `text`, ascending and non-overlapping. An unclosed fence, `lstlisting` or
 * math environment runs to the end, as the owning rules treat it.
 */
export const findVerbatimRanges = (text: string): Array<[number, number]> => {
  const ranges: Array<[number, number]> = [];
  const blankLines: number[] = [];
  let lineStart = 0;
  // Blocks first, line by line: a `$` inside a fence is not math, so math is asked for the gaps between.
  // Blank lines are recorded on the way — they bound where math may pair.
  while (lineStart <= text.length) {
    const lineEnd: number = lineEndFrom(text, lineStart);
    const line: string = text.slice(lineStart, lineEnd);
    const fence: FenceMarker | null = detectFenceOpen(line);
    if (fence) {
      const end: number = fenceRangeEnd(text, lineEnd + 1, fence);
      ranges.push([lineStart, end]);
      lineStart = end + 1;
      continue;
    }
    const listingOpen: RegExpMatchArray | null = line.match(BEGIN_LST_INLINE_RE);
    if (listingOpen) {
      const openAt: number = listingOpen.index;
      const end: number = listingRangeEnd(text, lineEnd, line.slice(openAt + listingOpen[0].length));
      ranges.push([lineStart + openAt, end]);
      lineStart = end + 1;
      continue;
    }
    if (!line.trim()) {
      blankLines.push(lineStart);
    }
    lineStart = lineEnd + 1;
  }
  // Inline code is verbatim too; math is looked for outside the blocks above, a `$` in a fence opening nothing.
  const spans: Array<[number, number]> = ranges.slice();
  for (const item of getInlineCodeListFromString(text)) {
    spans.push([item.posStart, item.posEnd]);
  }
  let gapFrom = 0;
  let breakAt = 0;
  for (let i = 0; i <= ranges.length; i++) {
    const gapTo: number = i < ranges.length ? ranges[i][0] : text.length;
    // Per paragraph: the inline rules pair math inside one token, so a `$` across a blank line opens nothing.
    let blockFrom: number = gapFrom;
    while (blockFrom < gapTo) {
      while (breakAt < blankLines.length && blankLines[breakAt] <= blockFrom) {
        breakAt++;
      }
      const blockTo: number = breakAt < blankLines.length
        ? Math.min(blankLines[breakAt], gapTo)
        : gapTo;
      let seek: number = blockFrom;
      while (seek < blockTo) {
        const span = nextMathSpan(text, seek, true, blockTo);
        if (!span) {
          break;
        }
        // Clamped: display math that legitimately crosses a blank line is covered only to that line.
        spans.push([span.start, Math.min(span.end, blockTo)]);
        seek = span.end > seek ? span.end : seek + 1;
      }
      blockFrom = blockTo + 1;
    }
    if (i < ranges.length) {
      gapFrom = ranges[i][1];
    }
  }
  // Union: sources do overlap — inline code can open before a fence and close after — and a binary
  // search over overlapping ranges answers wrongly.
  spans.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const merged: Array<[number, number]> = [];
  for (const span of spans) {
    const last: [number, number] | undefined = merged[merged.length - 1];
    if (last && span[0] <= last[1]) {
      if (span[1] > last[1]) {
        last[1] = span[1];
      }
    } else {
      merged.push([span[0], span[1]]);
    }
  }
  return merged;
};

/** Is `at` inside one of the ascending `ranges`? Half-open `[start, end)`. Binary search, no allocation. */
export const isInsideRanges = (ranges: ReadonlyArray<readonly [number, number]>, at: number): boolean => {
  let low = 0;
  let high = ranges.length - 1;
  while (low <= high) {
    const mid: number = (low + high) >> 1;
    if (ranges[mid][1] <= at) {
      low = mid + 1;
    } else if (ranges[mid][0] > at) {
      high = mid - 1;
    } else {
      return true;
    }
  }
  return false;
};
