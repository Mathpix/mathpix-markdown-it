import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import { StateBlockLike, OpaqueEnvType } from "./latex-list-types";
import { getOpenListCount } from "./list-state";
import { matchPositionsCached, countPositionsAtOrAfter, srcValueCached } from "../common/src-pos-cache";
import { findVerbatimRanges, isInsideRanges } from "../common/verbatim-ranges";
import {
  BEGIN_LIST_ENV_INLINE_RE,
  END_LIST_ENV_INLINE_RE,
  END_LST_INLINE_RE,
  END_TABULAR_INLINE_RE,
  LATEX_BLOCK_ENV_OPEN_RE,
  LATEX_BLOCK_ENV_NAMES,
} from "../common/consts";

// What the list rule knows about its source text, and nothing about tokens: where content is verbatim,
// where a command argument spans, whether a closer is structural, whether a wrapper can reach its own.
// One model, so the readers that ask these questions cannot drift apart — each one that did cost an item.

// Outermost command-argument spans, ascending.
const ARG_SPANS_KEY = Symbol('mmd.argumentSpans');
const VERBATIM_KEY = Symbol('mmd.verbatimRanges');

// Built from the unanchored env regexes, so a sweep cannot drift from what the parser accepts.
const END_LIST_ENV_SWEEP_G: RegExp = new RegExp(END_LIST_ENV_INLINE_RE.source, 'g');
const BEGIN_LIST_ENV_SWEEP_G: RegExp = new RegExp(BEGIN_LIST_ENV_INLINE_RE.source, 'g');

/** Text around an inline transition. A transition with a backtick on both sides sits in a code span,
 *  and the parse loop leaves the whole line to the inline path when it meets one. */
export const splitInlineListEnv = (
  lineText: string,
  match
) => {
  const sB: string = match.index! > 0 ? lineText.slice(0, match.index).trim() : "";
  const sE: string = match.index! + match[0].length < lineText.length
    ? lineText.slice(match.index! + match[0].length).trim()
    : "";
  const isBacktickEscapedPair: boolean = sB.includes("`") && sE.includes("`");
  return { sB, sE, isBacktickEscapedPair };
};

// How many envs a line's tail leaves open: positive means it needs that many closers from ahead.
// Counted by walking the tail as the parse loop does — a plain text count called a closer in a code
// span real, and the loop then opened a sibling it could never close.
export const unclosedEnvsIn = (s: string): number => {
  let depth = 0;
  let tail: string = s;
  let env: { match: RegExpMatchArray; isEnd: boolean } | null = nextListEnvMatch(tail);
  while (env) {
    const split = splitInlineListEnv(tail, env.match);
    if (split.isBacktickEscapedPair) {
      break;
    }
    depth += env.isEnd ? -1 : 1;
    tail = split.sE;
    env = nextListEnvMatch(tail);
  }
  return depth;
};

// Offsets of every closer: the last one answers the early bail, the whole list feeds the depth check
// inside the body walk. Cached on the state the rule receives — the buffered state reads it through
// the prototype, so the sweep runs once per document rather than once per probe.
const LIST_END_OFFSETS_KEY = Symbol('mmd.listEndOffsets');
const CLOSER_SUFFIX_KEY = Symbol('mmd.closerSuffix');
const OPENER_SUFFIX_KEY = Symbol('mmd.openerSuffix');
export const listCloserOffsets = (state: StateBlock): readonly number[] =>
  matchPositionsCached(state, LIST_END_OFFSETS_KEY, END_LIST_ENV_SWEEP_G);

export const lastListEndPos = (state: StateBlock): number => {
  const offsets: readonly number[] = listCloserOffsets(state);
  return offsets.length ? offsets[offsets.length - 1] : -1;
};

// Wrapper names: the shared table minus the two that bring their own detection. Everything below is
// derived from it, so a name added there cannot silently miss the guard.
const WRAPPER_ENV_NAMES: readonly string[] = Object.freeze(
  LATEX_BLOCK_ENV_NAMES.filter((name) => name !== 'tabular' && name !== 'lstlisting')
);

// Closer offsets per wrapper name, cached like the list sweeps: no scan of the source tail per
// `\begin`, which was O(remainder) on every occurrence.
const WRAPPER_END_SWEEP_G: Readonly<Record<string, RegExp>> = Object.freeze(
  WRAPPER_ENV_NAMES.reduce((acc, name) => {
    acc[name] = new RegExp('\\\\end\\{' + name + '\\}', 'g');
    return acc;
  }, {} as Record<string, RegExp>)
);
const WRAPPER_END_OFFSETS_KEYS: Readonly<Record<string, symbol>> = Object.freeze(
  WRAPPER_ENV_NAMES.reduce((acc, name) => {
    acc[name] = Symbol('mmd.end_' + name);
    return acc;
  }, {} as Record<string, symbol>)
);

// Closer per opaque env: the stack top picks its own, so a nested `\end{tabular}` is raw content
// inside a `table` rather than its closer. The two with their own patterns are named, the rest derived.
const END_OPAQUE_ENV_RE: Readonly<Record<OpaqueEnvType, RegExp>> = Object.freeze(
  WRAPPER_ENV_NAMES.reduce((acc, name) => {
    acc[name] = new RegExp('\\\\end\\{' + name + '\\}');
    return acc;
  }, { lstlisting: END_LST_INLINE_RE, tabular: END_TABULAR_INLINE_RE } as Record<string, RegExp>)
) as Readonly<Record<OpaqueEnvType, RegExp>>;

// Global clones of the same patterns, for a scan that resumes past a closer it rejected.
// Clones, not the shared originals: a scan here returns mid-loop and leaves `lastIndex` set, and the
// verbatim check it calls on the way execs the originals.
const END_OPAQUE_ENV_SEARCH_G: Readonly<Record<OpaqueEnvType, RegExp>> = Object.freeze(
  (Object.keys(END_OPAQUE_ENV_RE) as OpaqueEnvType[]).reduce((acc, name) => {
    acc[name] = new RegExp(END_OPAQUE_ENV_RE[name].source, 'g');
    return acc;
  }, {} as Record<OpaqueEnvType, RegExp>)
);

const LIST_BEGIN_OFFSETS_KEY = Symbol('mmd.listBeginOffsets');
const listOpenerOffsets = (state: StateBlock): readonly number[] =>
  matchPositionsCached(state, LIST_BEGIN_OFFSETS_KEY, BEGIN_LIST_ENV_SWEEP_G);

// Outermost `{}` pairs in one pass; a `{` that never closes stays on the stack and yields no span.
// Calling findEndMarker per brace rescanned the tail — `n^1.9` measured on a run of unmatched `{`.
// Every balanced pair, the env name in `\end{itemize}` included. Exported to be tested directly.
export const pairArgumentSpans = (text: string, verbatim: Array<[number, number]>): Array<[number, number]> => {
  const spans: Array<[number, number]> = [];
  const open: number[] = [];
  let range: number = 0;
  for (let i = 0; i < text.length; i++) {
    const chr: string = text[i];
    if (chr !== '{' && chr !== '}' && chr !== '\\') {
      continue;
    }
    // Verbatim is text: skip it whole. Before the escape check, or a `\` ending a range escapes past it.
    while (range < verbatim.length && verbatim[range][1] <= i) {
      range++;
    }
    if (range < verbatim.length && i >= verbatim[range][0]) {
      i = verbatim[range][1] - 1;
      continue;
    }
    if (chr === '\\') {
      i++;                        // an escaped brace opens and closes nothing
      continue;
    }
    if (chr === '{') {
      open.push(i);
      continue;
    }
    const from: number | undefined = open.pop();
    if (from !== undefined) {
      spans.push([from, i]);          // every pair: depth 1 alone would lose all pairs under a stray `{`
    }
  }
  // Keep the outermost, as findEndMarker returned; ascending, so the span search stays a binary one.
  spans.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  const outer: Array<[number, number]> = [];
  let reach = -1;
  for (const span of spans) {
    if (span[1] > reach) {
      outer.push(span);
      reach = span[1];
    }
  }
  return outer;
};

const verbatimRangesOf = (state: StateBlockLike): Array<[number, number]> =>
  srcValueCached(state as StateBlock, VERBATIM_KEY, findVerbatimRanges);

// Both are cached per source, and the pairing reads the ranges rather than finding them again.
const argumentSpansOf = (state: StateBlockLike): Array<[number, number]> =>
  srcValueCached(state as StateBlock, ARG_SPANS_KEY,
    (src: string) => pairArgumentSpans(src, verbatimRangesOf(state)));

const insideVerbatim = (state: StateBlockLike, at: number): boolean =>
  isInsideRanges(verbatimRangesOf(state), at);

// Text, not structure: code, math, or a command argument. One predicate, so no reader asks half of it.
const writtenAsText = (state: StateBlockLike, at: number): boolean =>
  isInsideRanges(argumentSpansOf(state), at) || insideVerbatim(state, at);

// Is a closer in `[from, to)` ours? `\item b \end{itemize}` ends the list, `\caption{x \end{itemize} y}`
// is text. Order decides, not counts: one closer and one opener balance out on a tally, yet a closer
// standing first is still ours. Offsets and spans are ascending, so one merge walk answers it.
const closesOurListWithin = (state: StateBlockLike, from: number, to: number): boolean => {
  const closerOffsets: readonly number[] = listCloserOffsets(state as StateBlock);
  const closersAhead: number = countPositionsAtOrAfter(closerOffsets, from)
    - countPositionsAtOrAfter(closerOffsets, to);
  if (closersAhead <= 0) {
    return false;
  }
  const openerOffsets: readonly number[] = listOpenerOffsets(state as StateBlock);
  const openersAhead: number = countPositionsAtOrAfter(openerOffsets, from)
    - countPositionsAtOrAfter(openerOffsets, to);
  const spans: Array<[number, number]> = argumentSpansOf(state);
  let closer: number = closerOffsets.length - countPositionsAtOrAfter(closerOffsets, from);
  let opener: number = openerOffsets.length - countPositionsAtOrAfter(openerOffsets, from);
  let depth: number = 0;
  for (let step: number = 0; step < closersAhead + openersAhead; step++) {
    const nextCloser: number = closer < closerOffsets.length ? closerOffsets[closer] : Infinity;
    const nextOpener: number = opener < openerOffsets.length ? openerOffsets[opener] : Infinity;
    const isCloser: boolean = nextCloser <= nextOpener;
    const at: number = isCloser ? nextCloser : nextOpener;
    if (isCloser) {
      closer++;
    } else {
      opener++;
    }
    // A balanced pair around it outranks conservatism: a `{` left open earlier may sit in math or code,
    // where it opens nothing.
    if (isInsideRanges(spans, at) || insideVerbatim(state, at)) {
      continue;
    }
    depth += isCloser ? -1 : 1;
    if (depth < 0) {
      return true;
    }
  }
  return false;
};

// The first wrapper opening on this line, or null. Asking for the first block env instead let a
// `\begin{tabular}` ahead of it decide the answer, by where it sits in the shared name list.
const WRAPPER_BEGIN_SWEEP_G: RegExp = new RegExp(LATEX_BLOCK_ENV_OPEN_RE.source, 'g');
export const wrapperBeginAt = (lineText: string): RegExpExecArray | null => {
  WRAPPER_BEGIN_SWEEP_G.lastIndex = 0;
  let mb: RegExpExecArray | null = WRAPPER_BEGIN_SWEEP_G.exec(lineText);
  while (mb) {
    if (WRAPPER_ENV_NAMES.indexOf(mb[1]) >= 0) {
      return mb;
    }
    mb = WRAPPER_BEGIN_SWEEP_G.exec(lineText);
  }
  return null;
};

// Where `match` sits in the source: `lineText` is a suffix of its line, so the line's end anchors it.
export const absoluteOffsetOf = (
  state: StateBlockLike,
  line: number,
  lineText: string,
  index: number,
  text: string
): number => {
  const at: number = state.eMarks[line] - lineText.length + index;
  // -1 when the anchor does not hold; each caller decides what that means.
  return state.src.slice(at, at + text.length) === text ? at : -1;
};

// How many of `all` from index `i` on are structural, cached per source: a walk per wrapper made a
// document of them super-linear — 1600 units went 2.25× slower than `master` before this.
const structuralSuffix = (
  state: StateBlockLike,
  all: readonly number[],
  key: symbol,
): Int32Array =>
  srcValueCached(state as StateBlock, key, () => {
    const spans: Array<[number, number]> = argumentSpansOf(state);
    const suffix: Int32Array = new Int32Array(all.length + 1);
    for (let i: number = all.length - 1; i >= 0; i--) {
      const structural: boolean = !isInsideRanges(spans, all[i]) && !insideVerbatim(state, all[i]);
      suffix[i] = suffix[i + 1] + (structural ? 1 : 0);
    }
    return suffix;
  });

// Structural (not text) offsets of `all` inside `[from, to)`, as a difference of two suffix counts.
// Private: the suffix is cached under `key` but built from `all`, so only this module pairs the two.
const structuralCountIn = (
  state: StateBlockLike,
  all: readonly number[],
  key: symbol,
  from: number,
  to: number,
): number => {
  const suffix: Int32Array = structuralSuffix(state, all, key);
  const startAt: number = all.length - countPositionsAtOrAfter(all, from);
  const endAt: number = all.length - countPositionsAtOrAfter(all, to);
  return suffix[startAt] - suffix[endAt];
};

// How many of the open lists the source past `at` can still close: structural closers there minus the
// openers that claim them, since a closer of a list opened after the wrapper is not ours to use.
export const closersLeftAfter = (state: StateBlockLike, at: number): number =>
  structuralCountIn(state, listCloserOffsets(state as StateBlock), CLOSER_SUFFIX_KEY, at, Infinity)
  - structuralCountIn(state, listOpenerOffsets(state as StateBlock), OPENER_SUFFIX_KEY, at, Infinity);

// Opening a wrapper as opaque swallows every line until its closer, so require one it can reach.
// Reaching past a closer of our own list swallowed it too, and the whole list then printed as
// literal LaTeX — that closer may be the last thing on its line, so position cannot decide it.
export const hasCloserAhead = (state: StateBlockLike, from: number, name: string): boolean => {
  const sweep: RegExp | undefined = WRAPPER_END_SWEEP_G[name];
  const key: symbol | undefined = WRAPPER_END_OFFSETS_KEYS[name];
  if (!sweep || !key) {
    return false;
  }
  const offsets: readonly number[] = matchPositionsCached(state as StateBlock, key, sweep);
  // Every closer ahead, not just the first: one written as text — in code, math or an argument — left
  // the wrapper transparent while a real closer stood below.
  for (let i = offsets.length - countPositionsAtOrAfter(offsets, from); i < offsets.length; i++) {
    const at: number = offsets[i];
    if (writtenAsText(state, at)) {
      continue;
    }
    // Swallowing our closer is allowed when the source past the wrapper still closes the open lists and
    // no list starts inside it — eating another list's `\begin` would lose that list. A closer farther
    // out swallows a superset, so failing here ends the search rather than moving it along.
    if (closesOurListWithin(state, from, at)) {
      const opensInside: number =
        structuralCountIn(state, listOpenerOffsets(state as StateBlock), OPENER_SUFFIX_KEY, from, at);
      // The live count, not this source's own depth: an ambient list from an outer parse still needs closing.
      if (opensInside > 0 || closersLeftAfter(state, at) < Math.max(1, getOpenListCount())) {
        return false;
      }
    }
    return true;
  }
  return false;
};

// The leftmost inline \begin/\end in `s`, or null once none is left. Both patterns need their
// literal plus a name, so a match is never empty and the caller's tail always shrinks.
export const nextListEnvMatch = (s: string): { match: RegExpMatchArray; isEnd: boolean } | null => {
  const endMatch: RegExpMatchArray | null = s.match(END_LIST_ENV_INLINE_RE);
  const beginMatch: RegExpMatchArray | null = s.match(BEGIN_LIST_ENV_INLINE_RE);
  if (!endMatch && !beginMatch) {
    return null;
  }
  // Source order: an `\end` ahead of a `\begin` closes before the next level opens.
  const isEnd: boolean = !!endMatch && (!beginMatch || endMatch.index! < beginMatch.index!);
  return { match: isEnd ? endMatch! : beginMatch!, isEnd };
};

// The first closer in `text` that is not written in code, or null. A wrapper's closer inside a fence, an
// `lstlisting` or a code span is content — and a later one on the same line is still its closer.
export const firstUsableCloser = (
  state: StateBlockLike,
  line: number,
  text: string,
  env: OpaqueEnvType,
  skipCodeClosers: boolean
): { index: number; length: number } | null => {
  const checkVerbatim: boolean = skipCodeClosers && WRAPPER_ENV_NAMES.indexOf(env) >= 0;
  // Global, so a skipped closer costs no slice of the rest of the line.
  const scan: RegExp = END_OPAQUE_ENV_SEARCH_G[env];
  scan.lastIndex = 0;
  let found: RegExpExecArray | null;
  while ((found = scan.exec(text)) !== null) {
    // Unanchored (-1) counts as structure: the closer is taken, as it was before the ranges existed.
    const at: number = checkVerbatim
      ? absoluteOffsetOf(state, line, text, found.index, found[0])
      : -1;
    if (at < 0 || !writtenAsText(state, at)) {
      return { index: found.index, length: found[0].length };
    }
  }
  return null;
};
