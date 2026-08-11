import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import type Token from 'markdown-it/lib/token';
import type { RuleBlock } from 'markdown-it/lib/parser_block';
import { setTokenOpenList, setTokenCloseList, ListOpen, absorbSublistIntoWrapper } from "./latex-list-tokens";
import { ItemsListPush, ItemsAddToPrev, finalizeListItems, resolveListPadding, splitInlineListEnv } from "./latex-list-items";
import { GetItemizeLevelTokensByState, GetEnumerateLevel, ItemizeLevelTokenResult } from "./re-level";
import {
  ListType,
  ParsedListItem,
  ListOpenResult,
  LstEndResult,
  isListType,
  StateBlockLike,
  OpaqueStack, OpaqueEnvType
} from "./latex-list-types";
import { parseSetCounterNumber } from "./latex-list-common";
import { snapshotListLevels, restoreListLevels, getOpenListCount, type ListLevelState } from "./list-state";
import { getCaptionCounters, setCaptionCounters } from "../common/caption-counters";
import { matchPositionsCached, countPositionsAtOrAfter, firstPositionAtOrAfter, srcValueCached } from "../common/src-pos-cache";
import {
  FenceMarker,
  detectFenceOpen,
  isFenceClose,
  findVerbatimRanges,
  isInsideRanges,
} from "../common/verbatim-ranges";
import {
  LIST_TRANSIENT_ENV_KEYS,
  EnvSnapshot,
  snapshotEnvAll,
  releaseEnvSnapshot,
  restoreEnvAll,
  restoreEnvKeysFromAll,
} from "../common/env-transient";
import { flushBufferedTokens, createBufferedState, warnListRuleFailed } from "./latex-list-env-engine";
import { warnDistinct } from "../common/warn-distinct";
import {
  BEGIN_LIST_ENV_INLINE_RE,
  BEGIN_LST_INLINE_RE,
  BEGIN_TABULAR_INLINE_RE,
  END_LST_INLINE_RE,
  END_TABULAR_INLINE_RE,
  BEGIN_LIST_ENV_RE,
  END_LIST_ENV_INLINE_RE,
  LATEX_ITEM_COMMAND_INLINE_RE,
  LATEX_BLOCK_ENV_OPEN_RE,
  LATEX_BLOCK_ENV_NAMES,
  RENEWCOMMAND_LINE_RE,
  reSetCounter
} from "../common/consts";

// Outermost command-argument spans, ascending.
const ARG_SPANS_KEY = Symbol('mmd.argumentSpans');
const VERBATIM_KEY = Symbol('mmd.verbatimRanges');

// Built from the unanchored env regexes, so a sweep cannot drift from what the parser accepts.
const END_LIST_ENV_SWEEP_G: RegExp = new RegExp(END_LIST_ENV_INLINE_RE.source, 'g');
const BEGIN_LIST_ENV_SWEEP_G: RegExp = new RegExp(BEGIN_LIST_ENV_INLINE_RE.source, 'g');

// How many envs a line's tail leaves open: positive means it needs that many closers from ahead.
const unclosedEnvsIn = (s: string): number =>
  (s.match(BEGIN_LIST_ENV_SWEEP_G) || []).length - (s.match(END_LIST_ENV_SWEEP_G) || []).length;

// Offsets of every closer: the last one answers the early bail, the whole list feeds the depth check
// inside the body walk. Cached on the state the rule receives — the buffered state reads it through
// the prototype, so the sweep runs once per document rather than once per probe.
const LIST_END_OFFSETS_KEY = Symbol('mmd.listEndOffsets');
const listCloserOffsets = (state: StateBlock): readonly number[] =>
  matchPositionsCached(state, LIST_END_OFFSETS_KEY, END_LIST_ENV_SWEEP_G);

const lastListEndPos = (state: StateBlock): number => {
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

const LIST_BEGIN_OFFSETS_KEY = Symbol('mmd.listBeginOffsets');
const listOpenerOffsets = (state: StateBlock): readonly number[] =>
  matchPositionsCached(state, LIST_BEGIN_OFFSETS_KEY, BEGIN_LIST_ENV_SWEEP_G);

// Outermost `{}` pairs in one pass; a `{` that never closes stays on the stack and yields no span.
// Calling findEndMarker per brace rescanned the tail — `n^1.9` measured on a run of unmatched `{`.
// Exported to be tested directly: its ascending, non-overlapping output is what the span search assumes.
export const pairArgumentSpans = (text: string, verbatim: Array<[number, number]>): Array<[number, number]> => {
  const spans: Array<[number, number]> = [];
  const open: number[] = [];
  let range: number = 0;
  for (let i = 0; i < text.length; i++) {
    const chr: string = text[i];
    if (chr === '\\') {
      // Before the verbatim skip, so a `\` just outside a range consumes its first character.
      i++;                        // an escaped brace opens and closes nothing
      continue;
    }
    if (chr !== '{' && chr !== '}') {
      continue;
    }
    // A fenced block or an `lstlisting` is text: skip it whole rather than pair inside it.
    while (range < verbatim.length && verbatim[range][1] <= i) {
      range++;
    }
    if (range < verbatim.length && i >= verbatim[range][0]) {
      i = verbatim[range][1] - 1;
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
  let span: number = 0;
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
    while (span < spans.length && spans[span][1] < at) {
      span++;
    }
    // A balanced pair around it is knowledge, and it outranks the conservatism below: the `{` left open
    // earlier may sit in math or code, where it opens nothing.
    if (span < spans.length && at > spans[span][0] && at < spans[span][1]) {
      continue;                         // inside a command argument: text, not structure
    }
    if (insideVerbatim(state, at)) {
      continue;                         // written in code or math: text, whatever the braces say
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
const wrapperBeginAt = (lineText: string): RegExpExecArray | null => {
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
const absoluteOffsetOf = (
  state: StateBlockLike,
  line: number,
  lineText: string,
  match: RegExpExecArray
): number => {
  const at: number = state.eMarks[line] - lineText.length + match.index;
  // Past the end when it does not: the guard then finds no closer and declines, the safe side.
  return state.src.slice(at, at + match[0].length) === match[0] ? at : state.src.length;
};

// Structural (not text) offsets of `all` inside `[from, to)`.
const structuralCountIn = (
  state: StateBlockLike,
  all: readonly number[],
  from: number,
  to: number,
): number => {
  const spans: Array<[number, number]> = argumentSpansOf(state);
  let found = 0;
  for (let i: number = all.length - countPositionsAtOrAfter(all, from); i < all.length; i++) {
    if (all[i] >= to) {
      break;
    }
    if (!isInsideRanges(spans, all[i]) && !insideVerbatim(state, all[i])) {
      found++;
    }
  }
  return found;
};

// How many of the open lists the source past `at` can still close: structural closers there minus the
// openers that claim them, since a closer of a list opened after the wrapper is not ours to use.
const closersLeftAfter = (state: StateBlockLike, at: number): number =>
  structuralCountIn(state, listCloserOffsets(state as StateBlock), at, Infinity)
  - structuralCountIn(state, listOpenerOffsets(state as StateBlock), at, Infinity);

// Opening a wrapper as opaque swallows every line until its closer, so require one it can reach.
// Reaching past a closer of our own list swallowed it too, and the whole list then printed as
// literal LaTeX — that closer may be the last thing on its line, so position cannot decide it.
const hasCloserAhead = (state: StateBlockLike, from: number, name: string): boolean => {
  const sweep: RegExp | undefined = WRAPPER_END_SWEEP_G[name];
  const key: symbol | undefined = WRAPPER_END_OFFSETS_KEYS[name];
  if (!sweep || !key) {
    return false;
  }
  const at: number = firstPositionAtOrAfter(matchPositionsCached(state as StateBlock, key, sweep), from);
  if (at < 0) {
    return false;
  }
  // Swallowing our closer is allowed when the source past the wrapper still closes the open lists and
  // no list starts inside it — eating another list's `\begin` would lose that list.
  if (closesOurListWithin(state, from, at)) {
    const opensInside: number =
      structuralCountIn(state, listOpenerOffsets(state as StateBlock), from, at);
    // The live count, not this source's own depth: an ambient list from an outer parse still needs closing.
    if (opensInside > 0 || closersLeftAfter(state, at) < Math.max(1, getOpenListCount())) {
      return false;
    }
  }
  // A closer inside a fenced block or an `lstlisting` is text. Asked of the ranges, so a closed block
  // before it leaves the closer usable.
  return !insideVerbatim(state, at);
};

// The leftmost inline \begin/\end in `s`, or null once none is left. Both patterns need their
// literal plus a name, so a match is never empty and the caller's tail always shrinks.
const nextListEnvMatch = (s: string): { match: RegExpMatchArray; isEnd: boolean } | null => {
  const endMatch: RegExpMatchArray | null = s.match(END_LIST_ENV_INLINE_RE);
  const beginMatch: RegExpMatchArray | null = s.match(BEGIN_LIST_ENV_INLINE_RE);
  if (!endMatch && !beginMatch) {
    return null;
  }
  // Source order: an `\end` ahead of a `\begin` closes before the next level opens.
  const isEnd: boolean = !!endMatch && (!beginMatch || endMatch.index! < beginMatch.index!);
  return { match: isEnd ? endMatch! : beginMatch!, isEnd };
};

// Opens `openedType` and decides in one place whether it closes on this same line — the nested-tabular
// branch skipped that check, so its one-line form left the stack open for good.
const openOpaqueEnv = (
  stack: OpaqueStack,
  items: any[],
  openedType: OpaqueEnvType,
  afterBegin: string,
  nextLine: number
): LstEndResult => {
  stack = [...stack, openedType];
  const endRe: RegExp = END_OPAQUE_ENV_RE[openedType];
  const meSameLine: RegExpExecArray | null = endRe.exec(afterBegin);
  if (!meSameLine) {
    // `lineText` is a tail for the caller to re-parse, so it is only read when `handled` is false.
    return { handled: true, stack, items: ItemsAddToPrev(items, afterBegin, nextLine), lineText: '' };
  }
  const glue: string = openedType === "lstlisting" ? "\n" : "";
  items = ItemsAddToPrev(items, afterBegin.slice(0, meSameLine.index) + glue + meSameLine[0], nextLine);
  stack = stack.slice(0, -1);
  const afterSameLineEnd: string = afterBegin.slice(meSameLine.index + meSameLine[0].length);
  return afterSameLineEnd.trim().length
    ? { handled: false, stack, items, lineText: afterSameLineEnd }
    : { handled: true, stack, items, lineText: "" };
};

/**
 * Detects \begin{lstlisting} or \begin{tabular} on a line and enters an opaque env.
 * - Uses `stack` to track nesting (tabular can nest, lstlisting cannot).
 * - Text before \begin (including prefixes like \hline or & when nesting inside tabular) is preserved and added as normal list content.
 * - From \begin... to end of line is appended as raw/opaque text.
 *
 * @returns Updated { handled, stack, items, lineText }.
 */
const handleLstBeginInline = (
  lineText: string,
  stack: OpaqueStack,
  items: any[],
  nextLine: number,
  dStart: number,
  itemTag: RegExp,
  state: StateBlockLike
): LstEndResult => {
  const top: OpaqueEnvType = stack[stack.length - 1];
  // Inside lstlisting or a wrapper, every line is raw until that env's own closer.
  if (top && top !== "tabular") {
    return { handled: false, stack, items, lineText };
  }
  // All three patterns below need the literal, so one scan answers for them.
  if (lineText.indexOf('\\begin') < 0) {
    return { handled: false, stack, items, lineText };
  }
  // Reset regex lastIndex (important if /g/)
  BEGIN_LST_INLINE_RE.lastIndex = 0;
  BEGIN_TABULAR_INLINE_RE.lastIndex = 0;
  const mbLst: RegExpExecArray = BEGIN_LST_INLINE_RE.exec(lineText);
  const mbTab: RegExpExecArray = BEGIN_TABULAR_INLINE_RE.exec(lineText);
  // If we are inside tabular, allow only nested tabular
  if (top === "tabular") {
    if (!mbTab) return { handled: false, stack, items, lineText };
    // keep the prefix before \begin{tabular} (e.g. "\hline " or " & ")
    const prefix: string = lineText.slice(0, mbTab.index);
    if (prefix.length > 0) {
      items = ItemsAddToPrev(items, prefix, nextLine);
    }
    return openOpaqueEnv(stack, items, "tabular", lineText.slice(mbTab.index), nextLine);
  }
  // A wrapper opens only when its closer is ahead of the `\begin` itself: an `\end{X}` left of it read
  // as reachable and cost the whole list.
  const mbWrapRaw: RegExpExecArray | null = wrapperBeginAt(lineText);
  const mbWrap: RegExpExecArray | null =
    mbWrapRaw && hasCloserAhead(state, absoluteOffsetOf(state, nextLine, lineText, mbWrapRaw), mbWrapRaw[1])
      ? mbWrapRaw
      : null;
  // Earliest begin, or none. Seeded, so this stays a `null` the caller handles rather than a throw
  // the rule would swallow if the guard above and this fold ever drifted apart.
  const mb: RegExpMatchArray | null = [mbLst, mbTab, mbWrap]
    .filter(Boolean)
    .reduce((a, b) => (a && a.index <= b.index ? a : b), null);
  if (!mb) return { handled: false, stack, items, lineText };
  const openedType: OpaqueEnvType =
    mb === mbLst ? "lstlisting" : mb === mbTab ? "tabular" : mb[1] as OpaqueEnvType;
  const beginIndex: number = mb.index;
  const before: string = lineText.slice(0, beginIndex);
  const afterBegin: string = lineText.slice(beginIndex);
  if (before.length > 0) {
    if (itemTag.test(before)) {
      items = ItemsListPush(items, before, nextLine + dStart, nextLine + dStart);
    } else {
      items = ItemsAddToPrev(items, before, nextLine);
    }
  }
  return openOpaqueEnv(stack, items, openedType, afterBegin, nextLine);
}

/**
 * Detects \end{...} for the current opaque env (stack top).
 * - If not found, appends the full raw line (keeps indentation) as opaque text.
 * - If found, appends up to end marker, pops stack, and returns tail (if any).
 *
 * @returns Updated { handled, stack, items, lineText }.
 */
const handleLstEndInline = (
  lineText: string,
  stack: OpaqueStack,
  items: any[],
  nextLine: number,
  state
): LstEndResult => {
  const top: OpaqueEnvType = stack[stack.length - 1];
  if (!top) {
    return { handled: false, stack, items, lineText };
  }
  const endRe: RegExp = END_OPAQUE_ENV_RE[top];
  const me: RegExpExecArray = endRe.exec(lineText);
  if (!me) {
    // still inside opaque env → append raw line with indentation
    const rawLine = state.src.slice(state.bMarks[nextLine], state.eMarks[nextLine]);
    items = ItemsAddToPrev(items, rawLine, nextLine);
    return { handled: true, stack, items, lineText };
  }
  const endIndex: number = me.index;
  const endToken: string = lineText.slice(endIndex, endIndex + me[0].length);
  const beforeEnd: string = lineText.slice(0, endIndex);
  const afterEnd: string = lineText.slice(endIndex + me[0].length);
  // Append code continuation
  if (beforeEnd.length > 0) {
    const glue = top === "lstlisting" ? "\n" : "";
    items = ItemsAddToPrev(items, beforeEnd + glue + endToken, nextLine);
  } else {
    items = ItemsAddToPrev(items, endToken, nextLine);
  }
  // pop matching env
  stack = stack.slice(0, -1);
  // If nothing meaningful after end tag, consume line
  if (!afterEnd?.trim()?.length) {
    return { handled: true, stack, items, lineText: "" };
  }
  // return remainder to be parsed normally
  return { handled: false, stack, items, lineText: afterEnd };
}

type OpaqueProcessResult = {
  consumedLine: boolean;
  lineText: string;
  stack: OpaqueStack;
  items: ParsedListItem[];
};

/**
 * Processes "opaque" inline environments inside list parsing (currently: tabular, lstlisting).
 *
 * The function may:
 * - fully consume the current source line (appending it to `items` as raw text), OR
 * - close an opaque env and return a remaining tail to be parsed again on the same line
 *   (e.g. `\end{tabular} & \begin{tabular}{l}`).
 *
 * Each pass hands back a shorter tail, so malformed input cannot spin here.
 */
const processOpaqueLine = (
  params: {
    lineText: string;
    stack: OpaqueStack;
    items: ParsedListItem[];
    nextLine: number;
    state: StateBlockLike;
    renderStart: number;
  }
): OpaqueProcessResult => {
  let { lineText, stack, items, nextLine, state, renderStart } = params;
  // Termination is structural: every branch that keeps going hands back a shorter tail, so the loop
  // ends when it stops shrinking. No step count — the number of envs on a line is the input's business.
  let remaining: number = lineText.length + 1;
  while (lineText.length < remaining) {
    remaining = lineText.length;
    const top: OpaqueEnvType = stack[stack.length - 1];
    if (top) {
      // -------- inside opaque --------
      if (top === "tabular") {
        END_TABULAR_INLINE_RE.lastIndex = 0;
        BEGIN_TABULAR_INLINE_RE.lastIndex = 0;
        const me: RegExpExecArray = END_TABULAR_INLINE_RE.exec(lineText);
        const mb: RegExpExecArray = BEGIN_TABULAR_INLINE_RE.exec(lineText);
        // close if end exists before begin (or begin missing)
        if (me && (!mb || me.index <= mb.index)) {
          const endRes: LstEndResult = handleLstEndInline(lineText, stack, items, nextLine, state);
          stack = endRes.stack;
          items = endRes.items;
          if (endRes.handled) {
            return { consumedLine: true, lineText, stack, items };
          }
          // got tail → keep parsing same line
          lineText = endRes.lineText;
          continue;
        }
        // otherwise if begin exists, open nested tabular
        if (mb) {
          const beginRes: LstEndResult = handleLstBeginInline(
            lineText,
            stack,
            items,
            nextLine,
            renderStart,
            LATEX_ITEM_COMMAND_INLINE_RE,
            state
          );
          stack = beginRes.stack;
          items = beginRes.items;
          if (beginRes.handled) {
            return { consumedLine: true, lineText, stack, items };
          }
          lineText = beginRes.lineText;
          continue;
        }
        // plain opaque line inside tabular:
        // preserve indentation unless this is a tail
        const rawLine = state.src.slice(state.bMarks[nextLine], state.eMarks[nextLine]);
        const rawLineNoIndent = state.src.slice(
          state.bMarks[nextLine] + state.tShift[nextLine],
          state.eMarks[nextLine]
        );
        const toAppend = (lineText !== rawLineNoIndent) ? lineText : rawLine;
        items = ItemsAddToPrev(items, toAppend, nextLine);
        return { consumedLine: true, lineText, stack, items };
      }
      // other opaque (lstlisting): only try to end
      const endRes: LstEndResult = handleLstEndInline(lineText, stack, items, nextLine, state);
      stack = endRes.stack;
      items = endRes.items;
      if (endRes.handled) {
        return { consumedLine: true, lineText, stack, items };
      }
      lineText = endRes.lineText;
      continue;
    }
    // not inside opaque: try to begin
    const beginRes: LstEndResult = handleLstBeginInline(
      lineText,
      stack,
      items,
      nextLine,
      renderStart,
      LATEX_ITEM_COMMAND_INLINE_RE,
      state
    );
    stack = beginRes.stack;
    items = beginRes.items;
    if (beginRes.handled) {
      return { consumedLine: true, lineText, stack, items };
    }
    lineText = beginRes.lineText;
    return { consumedLine: false, lineText, stack, items };
  }
  // Unreachable today: every branch returns or shrinks the tail. Asserts that, rather than guarding it.
  warnDistinct('opaque-stall:' + stack.join('>'),
    '[list-env] an opaque line stopped shrinking; the tail is taken as text');
  items = ItemsAddToPrev(items, lineText, nextLine);
  return { consumedLine: true, lineText, stack, items };
};


/**
 * Parse a LaTeX list environment starting at `startLine` and emit tokens into `state`.
 *
 * Notes:
 * - The function is "strict": it returns false if the matching \end{...} is not found.
 * - Works with any StateBlock-like object (real block state or synthetic state for inline reuse).
 *
 * @returns true if the environment was successfully parsed and closed, otherwise false.
 */
export const ListsInternal = (
  state: StateBlockLike,
  startLine: number,
  endLine: number,
): boolean => {
  let pos: number = state.bMarks[startLine] + state.tShift[startLine];
  let max: number = state.eMarks[startLine];
  let lineText: string = state.src.slice(pos, max);
  const renderStart: number = state.md.options.renderElement && state.md.options.renderElement.startLine
      ? Number(state.md.options.renderElement.startLine)
      : 0;
  const oldParentType = state.parentType;
  const enumerateLevelTypes: string[] = GetEnumerateLevel();
  const dataMarkers: ItemizeLevelTokenResult = GetItemizeLevelTokensByState(state);
  const itemizeLevelTokens: Token[][] = dataMarkers.tokens;
  const itemizeLevelContents: string[] = dataMarkers.contents;
  let nextLine: number = startLine;
  let li: { value: number } | null = null;
  // Open list tokens by nesting level (padding → innermost) and every list-open token in doc
  // order (resolved top-down at the end). ListOpen seeds them and handles same-line content.
  const openTokens: Token[] = [];
  const allListTokens: Token[] = [];
  const listFrom: number = state.tokens.length;
  const openData: ListOpenResult = ListOpen(state, startLine + renderStart, lineText, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents, openTokens, allListTokens);
  let { iOpen = 0, tokenStart = null } = openData;
  li = openData.li ?? null;
  if (iOpen === 0) {
    // A single-line list (\begin…\item…\end on one line) is fully built by ListOpen; resolve here.
    absorbSublistIntoWrapper(state.tokens, listFrom);
    resolveListPadding(allListTokens);
    nextLine += 1;
    state.line = nextLine;
    state.startLine = startLine;
    state.parentType = oldParentType;
    state.level = state.prentLevel < 0 ? 0 : state.prentLevel;
    return true;
  } else {
    nextLine += 1;
  }
  let items: ParsedListItem[] = [];
  let haveClose: boolean = false;
  let opaqueStack: OpaqueStack = [];
  let fenceMarker: FenceMarker | null = null;
  const fenceBuffer: { lineText: string; rawLine: string; line: number }[] = [];
  // Process one ordinary (non-fence) list line: opaque envs, \setcounter, inline \begin/\end, \item, content.
  // Returns 'abort' (bail, emit nothing), 'break' (list closed — caller advances past this line) or 'proceed'.
  const processLine = (lineText: string, lineIdx: number): 'abort' | 'break' | 'proceed' => {
    // Handle opaque envs; may consume the line or return a tail to re-parse.
    const opaqueRes: OpaqueProcessResult = processOpaqueLine({
      lineText,
      stack: opaqueStack,
      items,
      nextLine: lineIdx,
      state,
      renderStart
    });
    opaqueStack = opaqueRes.stack;
    items = opaqueRes.items;
    lineText = opaqueRes.lineText;
    if (opaqueRes.consumedLine) {
      return 'proceed';
    }
    // Renders to nothing: joins without a break, which survived as an orphan `<br>`. forLatex keeps it.
    if (RENEWCOMMAND_LINE_RE.test(lineText)) {
      items = ItemsAddToPrev(items, lineText, lineIdx, !!state.md.options?.forLatex);
      return 'proceed';
    }
    // Handle \setcounter lines
    if (reSetCounter.test(lineText)) {
      let match: RegExpMatchArray | null = lineText.match(reSetCounter);
      if (match && state.md.options?.forLatex) {
        const token = state.push("setcounter", "", 0) as any;
        token.latex = match[0].trim();
      }
      if (match && match[2]) {
        let sE: string = match.index! + match[0].length < lineText.length
            ? lineText.slice(match.index! + match[0].length)
            : "";
        sE = sE.trim();
        const startNumber = parseSetCounterNumber(match) ?? 1;
        li = { value: startNumber };
        if (sE.length > 0) {
          items = ItemsAddToPrev(items, sE, lineIdx);
        }
        return 'proceed';
      }
    }
    // Every inline \begin/\end on the line, left to right. Handling only the first left the tail
    // of a collapsed `\end{itemize}\end{itemize}` to ItemsAddToPrev, which drops a pure closer —
    // so the outer list never closed and the strict `!haveClose` bail killed the whole rule.
    let tail: string = lineText;
    let env: { match: RegExpMatchArray; isEnd: boolean } | null = nextListEnvMatch(tail);
    const sawListEnv: boolean = !!env;
    while (env) {
      const { match: envMatch, isEnd } = env;
      const raw: string = envMatch[1].trim();
      // Defensive: the patterns match `itemize|enumerate` only, so this fires only if one widens.
      if (!isListType(raw)) {
        return 'abort';
      }
      let { sB, sE, isBacktickEscapedPair } = splitInlineListEnv(tail, envMatch);
      if (isBacktickEscapedPair) {
        items = ItemsListPush(items, tail, lineIdx, lineIdx);
        return 'proceed';
      }
      if (sB.length > 0) {
        // Any inline transition, not only one before a wrapper: appended to the item above, a marker
        // reached the block path in a chunk that already held a block env, where it printed as text.
        items = LATEX_ITEM_COMMAND_INLINE_RE.test(sB)
          ? ItemsListPush(items, sB, lineIdx, lineIdx)
          : ItemsAddToPrev(items, sB, lineIdx);
      }
      if (isEnd) {
        // An inline `\end` in the item body may already have popped this list inside
        // finalizeListItems — pop by identity so we never pop a list this `\end` didn't close.
        const closingList: Token | undefined = openTokens[openTokens.length - 1];
        ({ iOpen, items, li } = finalizeListItems(
          state,
          items,
          itemizeLevelTokens,
          enumerateLevelTypes,
          li,
          iOpen,
          itemizeLevelContents,
          openTokens, allListTokens
        ));
        setTokenCloseList(state, startLine + renderStart, lineIdx + renderStart);
        if (closingList && openTokens[openTokens.length - 1] === closingList) {
          // The line it closed on, so its `map` spans what it holds rather than a single line.
          if (closingList.map) {
            closingList.map[1] = Math.max(closingList.map[1], lineIdx + renderStart + 1);
          }
          openTokens.pop();
        }
        iOpen--;
        if (iOpen <= 0) {
          // The tail may open a sibling list. Its closer must sit in the tail, or on a later line
          // ahead of any fence — an unclosed sibling aborts the rule and drops this finished list.
          const tailEnv: { match: RegExpMatchArray; isEnd: boolean } | null = nextListEnvMatch(sE);
          let siblingClosable: boolean = false;
          if (tailEnv && !tailEnv.isEnd) {
            // Count, do not just look: a tail opening two levels needs two closers. Offsets only
            // past this point — a plain closer with nothing behind it is the common case, and the
            // fence sweep has no earlier warm-up, so it would run per rule entry.
            const needed: number = unclosedEnvsIn(sE);
            if (needed <= 0) {
              siblingClosable = true;
            } else {
              const lineEnd: number = state.eMarks[lineIdx];
              const closers: readonly number[] = listCloserOffsets(state);
              // Only closers outside verbatim content count: one written in code is text. Stops at
              // `needed`, so a document full of closers is not walked for nothing.
              let ahead: number = 0;
              for (let k: number = closers.length - countPositionsAtOrAfter(closers, lineEnd);
                   k < closers.length && ahead < needed; k++) {
                if (!insideVerbatim(state, closers[k])) {
                  ahead++;
                }
              }
              siblingClosable = ahead >= needed;
            }
          }
          if (siblingClosable) {
            // The outermost list closed, so the sibling opens outside any list: applyListCloseState
            // leaves `parentType` set, which would make it read as nested and lose 2.5em of indent.
            state.parentType = oldParentType;
          }
          if (!siblingClosable) {
            if (sE.length > 0) {
              items = ItemsAddToPrev(items, sE, lineIdx);
            }
            haveClose = true;
            return 'break';
          }
        }
      } else {
        const beginType: ListType = raw;
        ({ iOpen, items, li } = finalizeListItems(
          state,
          items,
          itemizeLevelTokens,
          enumerateLevelTypes,
          li,
          iOpen,
          itemizeLevelContents,
          openTokens, allListTokens
        ));
        // Real lines, or line numbering emits a bare class; the end is written when this list closes.
        // `state.startLine` is put back: items read it for `parentStart`, which is the list they sit in.
        const parentStartLine: number = state.startLine;
        const nestedOpen: Token = setTokenOpenList(state, lineIdx + renderStart, lineIdx + renderStart + 1,
          beginType, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents);
        state.startLine = parentStartLine;
        openTokens.push(nestedOpen);
        allListTokens.push(nestedOpen);
        iOpen++;
        // Every open env needs a closer of its own, and only closers ahead can serve. The sweep
        // over-counts (a `\end` inside a fence is not real), so a `<` here means closure is
        // impossible — without this the walk runs to EOF once per probed line.
        if (countPositionsAtOrAfter(listCloserOffsets(state), state.bMarks[lineIdx]) < iOpen) {
          return 'abort';
        }
      }
      tail = sE;
      env = nextListEnvMatch(tail);
    }
    if (sawListEnv) {
      // What is left after the last env: item text, as the single-pass tail was.
      if (tail.length > 0) {
        items = ItemsAddToPrev(items, tail, lineIdx);
      }
      return 'proceed';
    }
    // Regular line inside list: either a new \item or continuation
    if (LATEX_ITEM_COMMAND_INLINE_RE.test(lineText)) {
      items = ItemsListPush(items, lineText, lineIdx + renderStart, lineIdx + renderStart);
    } else {
      items = ItemsAddToPrev(items, lineText, lineIdx);
    }
    return 'proceed';
  };
  for (; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);
    // Fence: buffer lines; commit raw (indent kept) on close, else replay as content below. Not inside lstlisting/tabular.
    const rawLine: string = state.src.slice(state.bMarks[nextLine], state.eMarks[nextLine]);
    if (fenceMarker) {
      fenceBuffer.push({ lineText, rawLine, line: nextLine });
      if (isFenceClose(rawLine, fenceMarker)) {
        for (const b of fenceBuffer) {
          items = ItemsAddToPrev(items, b.rawLine, b.line);
        }
        fenceBuffer.length = 0;
        fenceMarker = null;
      }
      continue;
    }
    if (opaqueStack.length === 0) {
      fenceMarker = detectFenceOpen(rawLine);
      if (fenceMarker) {
        fenceBuffer.push({ lineText, rawLine, line: nextLine });
        continue;
      }
    }
    const sig: 'abort' | 'break' | 'proceed' = processLine(lineText, nextLine);
    if (sig === 'abort') {
      return false;
    }
    if (sig === 'break') {
      nextLine += 1;
      break;
    }
  }
  // Unclosed fence: buffered lines are ordinary content — replay them through the normal path.
  if (fenceMarker) {
    fenceMarker = null;
    for (const b of fenceBuffer) {
      const sig: 'abort' | 'break' | 'proceed' = processLine(b.lineText, b.line);
      if (sig === 'abort') {
        return false;
      }
      if (sig === 'break') {
        nextLine = b.line + 1;
        break;
      }
    }
    fenceBuffer.length = 0;
  }

  if (!haveClose) {
    // Strict mode: do not emit partial tokens (important for inline env wrapper).
    // No explicit \end{itemize}/\end{enumerate} found — flush remaining items
    return false;
  }

  state.line = nextLine;
  state.startLine = startLine;
  state.parentType = oldParentType;
  state.level = state.prentLevel < 0 ? 0 : state.prentLevel;
  if (tokenStart) {
    tokenStart.map![1] = nextLine + renderStart;
  }
  absorbSublistIntoWrapper(state.tokens, listFrom);
  resolveListPadding(allListTokens);
  return true;
};

/**
 * Block rule that parses LaTeX list environments:
 *   \begin{itemize} ... \end{itemize}
 *   \begin{enumerate} ... \end{enumerate}
 *
 * It:
 *  - detects list begin/end commands,
 *  - collects and splits \item content into logical items,
 *  - handles \setcounter and nested lists on the same line,
 *  - emits corresponding *_list_open, *_list_close, and list item tokens.
 */
export const Lists: RuleBlock = (
  state: StateBlock,
  startLine: number,
  endLine: number,
  silent: boolean
): boolean => {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  // Fast bail without allocating a substring: a list env line must start with '\'.
  if (pos >= max || state.src.charCodeAt(pos) !== 0x5c /* '\' */) {
    return false;
  }
  let lineText = state.src.slice(pos, max);
  let match: RegExpMatchArray | null = lineText.match(BEGIN_LIST_ENV_RE);
  if (!match) {
    return false;
  }
  const typeList: string = match[1].trim();
  if (!isListType(typeList)) {
    return false;
  }
  // No closer left in the source: the strict rule can only answer false, so skip the parse.
  if (lastListEndPos(state) < state.bMarks[startLine]) {
    return false;
  }
  // Probe answers are not memoised: it measured slower on every shape (see the spec).
  // `bufferedState` shares `env` by prototype, so ListsInternal mutates the real env: one whole-env
  // snapshot serves both restores below, naming keys would miss what a rule in the body writes.
  const captionSnap = getCaptionCounters();
  const envSnap: EnvSnapshot = snapshotEnvAll(state.env);
  // A discarded parse enters a level per `\begin` and, having no `\end`, never leaves it — without
  // this the depth grows with the number of probes, not with the real nesting.
  const listLevelSnap: readonly ListLevelState[] = snapshotListLevels();
  let committed = false;
  try {
    const bufferedState = createBufferedState(state);
    const ok: boolean = ListsInternal(bufferedState, startLine, endLine);
    if (!ok || silent) {
      return ok;
    }
    // Set before flushing: once tokens (carrying caption numbers) start entering state,
    // a mid-flush throw must not roll the counters back out from under them.
    committed = true;
    flushBufferedTokens(state, bufferedState.tokens);
    state.line = bufferedState.line;
    state.startLine = bufferedState.startLine;
    state.parentType = bufferedState.parentType;
    state.level = bufferedState.level;
    state.prentLevel = bufferedState.prentLevel;
    // No `types` copy-back: a committed list is balanced, so the walk already popped what it pushed.
    return true;
  } catch (e) {
    // A failed rule does not apply. Past the commit point tokens are already in state — nothing to
    // fall back to, so that one case propagates.
    if (committed) {
      throw e;
    }
    warnListRuleFailed(e);
    return false;
  } finally {
    if (!committed) {
      setCaptionCounters(captionSnap);
      restoreListLevels(listLevelSnap);
    }
    // Transient flags go back even on commit: a leaked isBlock=true wakes the inline fallback on the
    // next block (empty `<>` items). Everything else only when the tokens are discarded.
    restoreEnvKeysFromAll(state.env, LIST_TRANSIENT_ENV_KEYS, envSnap);
    if (!committed) {
      restoreEnvAll(state.env, envSnap);
    }
    releaseEnvSnapshot();
  }
};
