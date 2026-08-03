import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import type Token from 'markdown-it/lib/token';
import type { RuleBlock } from 'markdown-it/lib/parser_block';
import { setTokenOpenList, setTokenCloseList, ListOpen } from "./latex-list-tokens";
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
import { getCaptionCounters, setCaptionCounters } from "../common/caption-counters";
import {
  LIST_TRANSIENT_ENV_KEYS,
  LIST_SPECULATIVE_ENV_KEYS,
  snapshotEnvKeys,
  restoreEnvKeys,
} from "../common/env-transient";
import { flushBufferedTokens, createBufferedState } from "./latex-list-env-engine";
import {
  BEGIN_LIST_ENV_INLINE_RE,
  BEGIN_LST_INLINE_RE,
  BEGIN_TABULAR_INLINE_RE,
  END_LST_INLINE_RE,
  END_TABULAR_INLINE_RE,
  BEGIN_LIST_ENV_RE,
  END_LIST_ENV_INLINE_RE,
  LATEX_ITEM_COMMAND_INLINE_RE,
  reSetCounter
} from "../common/consts";

// A fenced code block (``` or ~~~) inside a list env is opaque like lstlisting: its lines are collected raw so
// the code keeps its indentation (the normal content path de-indents via tShift, which `\item` detection needs).
// Detection mirrors the core fence rule (mmd-fence.ts): marker ` (0x60) or ~ (0x7E), run length ≥ 3, ≤ 3 leading
// spaces; a backtick open cannot carry a backtick in its info string; a close is same char, ≥ open length, blank tail.
const BACKTICK: number = 0x60;
const TILDE: number = 0x7E;
type FenceMarker = { char: number; len: number };
const skipUpTo3Spaces = (rawLine: string): number => {
  let pos = 0;
  while (pos < 3 && rawLine.charCodeAt(pos) === 0x20) {
    pos++;
  }
  return pos;
};
const detectFenceOpen = (rawLine: string): FenceMarker | null => {
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
    return null; // an info string on a backtick fence cannot contain a backtick
  }
  return { char, len };
};
const isFenceClose = (rawLine: string, fence: FenceMarker): boolean => {
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
    if (c !== 0x20 && c !== 0x09) {
      return false; // tail must be blank
    }
  }
  return true;
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
  itemTag: RegExp
): LstEndResult => {
  const top: OpaqueEnvType = stack[stack.length - 1];
  // If we are inside lstlisting, ignore any begin markers.
  if (top === "lstlisting") {
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
    const beginAndRest: string = lineText.slice(mbTab.index);
    // open nested tabular
    stack = [...stack, "tabular"];
    if (prefix.length > 0) {
      items = ItemsAddToPrev(items, prefix, nextLine);
    }
    items = ItemsAddToPrev(items, beginAndRest, nextLine);
    return { handled: true, stack, items, lineText };
  }
  // If stack is empty:
  if (!mbLst && !mbTab) return { handled: false, stack, items, lineText };
  // Choose earliest begin if both exist
  const mb: RegExpMatchArray =
    mbLst && mbTab
      ? (mbLst.index <= mbTab.index ? mbLst : mbTab)
      : (mbLst || mbTab)!;
  const openedType: OpaqueEnvType =
    mb === mbLst ? "lstlisting" : "tabular";
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
  stack = [...stack, openedType];
  items = ItemsAddToPrev(items, afterBegin, nextLine);
  return { handled: true, stack, items, lineText };
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
  const endRe: RegExp = top === "lstlisting"
    ? END_LST_INLINE_RE
    : END_TABULAR_INLINE_RE;
  endRe.lastIndex = 0;
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
 * Uses a guard to prevent infinite loops on malformed input.
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
  let guard: number = 0;
  while (guard++ < 50) {
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
            LATEX_ITEM_COMMAND_INLINE_RE
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
      LATEX_ITEM_COMMAND_INLINE_RE
    );
    stack = beginRes.stack;
    items = beginRes.items;
    if (beginRes.handled) {
      return { consumedLine: true, lineText, stack, items };
    }
    lineText = beginRes.lineText;
    return { consumedLine: false, lineText, stack, items };
  }
  // safety: if guard exceeded, treat as consumed to avoid infinite loop
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
  const openData: ListOpenResult = ListOpen(state, startLine + renderStart, lineText, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents, openTokens, allListTokens);
  let { iOpen = 0, tokenStart = null } = openData;
  li = openData.li ?? null;
  if (iOpen === 0) {
    // A single-line list (\begin…\item…\end on one line) is fully built by ListOpen; resolve here.
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
    // Handle inline \end{itemize}/\end{enumerate}
    if (END_LIST_ENV_INLINE_RE.test(lineText)) {
      const endMatch: RegExpMatchArray = lineText.match(END_LIST_ENV_INLINE_RE);
      if (endMatch) {
        const raw: string = endMatch[1].trim();
        if (!isListType(raw)) {
          return 'abort';
        }
        let { sB, sE, isBacktickEscapedPair } = splitInlineListEnv(lineText, endMatch);
        if (isBacktickEscapedPair) {
          items = ItemsListPush(items, lineText, lineIdx, lineIdx);
          return 'proceed';
        }
        if (sB.length > 0) {
          items = ItemsAddToPrev(items, sB, lineIdx);
        }
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
          openTokens.pop();
        }
        if (sE.length > 0) {
          items = ItemsAddToPrev(items, sE, lineIdx);
        }
        iOpen--;
        if (iOpen <= 0) {
          haveClose = true;
          return 'break';
        }
      }
      return 'proceed';
    }
    // Handle inline \begin{itemize}/\begin{enumerate}
    if (BEGIN_LIST_ENV_INLINE_RE.test(lineText)) {
      const beginMatch = lineText.match(BEGIN_LIST_ENV_INLINE_RE);
      if (beginMatch) {
        const raw = beginMatch[1].trim();
        if (!isListType(raw)) {
          return 'abort';
        }
        const beginType: ListType = raw;
        let { sB, sE, isBacktickEscapedPair } = splitInlineListEnv(lineText, beginMatch);
        if (isBacktickEscapedPair) {
          items = ItemsListPush(items, lineText, lineIdx, lineIdx);
          return 'proceed';
        }
        if (sB.length > 0) {
          items = ItemsAddToPrev(items, sB, lineIdx);
        }
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
        const nestedOpen: Token = setTokenOpenList(state, -1, -1, beginType, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents);
        openTokens.push(nestedOpen);
        allListTokens.push(nestedOpen);
        if (sE.length > 0) {
          items = ItemsAddToPrev(items, sE, lineIdx);
        }
        iOpen++;
      }
    } else {
      // Regular line inside list: either a new \item or continuation
      if (LATEX_ITEM_COMMAND_INLINE_RE.test(lineText)) {
        items = ItemsListPush(items, lineText, lineIdx + renderStart, lineIdx + renderStart);
      } else {
        items = ItemsAddToPrev(items, lineText, lineIdx);
      }
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
  resolveListPadding(allListTokens);
  return true;
};

// Per-state memo of silent-probe results, invalidated when `state.src` is reassigned. Unbounded
// by design: it lives and dies with one parse, holding at most one entry per list-start line.
const LIST_PROBE_KEY = Symbol('mmd.listProbe');
type ListProbeCache = { src: string; map: Map<string, boolean> };

const getCachedListProbe = (state: StateBlock, key: string): boolean | undefined => {
  const slot = state as unknown as Record<symbol, ListProbeCache | undefined>;
  const cached = slot[LIST_PROBE_KEY];
  return cached && cached.src === state.src ? cached.map.get(key) : undefined;
};

const setCachedListProbe = (state: StateBlock, key: string, ok: boolean): void => {
  const slot = state as unknown as Record<symbol, ListProbeCache | undefined>;
  let cached = slot[LIST_PROBE_KEY];
  if (!cached || cached.src !== state.src) {
    cached = { src: state.src, map: new Map() };
    slot[LIST_PROBE_KEY] = cached;
  }
  cached.map.set(key, ok);
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
  // A silent probe answers "does a closed list env start here?", which needs the full
  // speculative parse. Paragraph/footnote terminator scans re-ask it for the same line many
  // times, so memoize per state. Key covers every input the answer depends on.
  const probeKey: string = silent
    ? `${startLine}:${endLine}:${state.parentType}:${state.prentLevel}:${(state.env as any)?.inheritedListType}`
    : '';
  if (silent) {
    const cached: boolean | undefined = getCachedListProbe(state, probeKey);
    if (cached !== undefined) {
      return cached;
    }
  }
  // `bufferedState` shares `env` by prototype, so ListsInternal mutates the real env.
  // Snapshot/restore its transient fields on every exit (abort, silent, commit): a list
  // ending in a block item leaks isBlock=true and wakes the inline fallback on the next
  // block, and a silent probe must not change state.
  const transientSnap = snapshotEnvKeys(state.env, LIST_TRANSIENT_ENV_KEYS);
  // The speculative parse runs the list body (incl. \begin{figure}/\begin{table}\caption),
  // which bumps the module-global caption counters and writes float env. On a non-committing
  // exit the tokens are discarded, so roll both back; on commit they match the flushed tokens.
  const captionSnap = getCaptionCounters();
  const floatEnvSnap = snapshotEnvKeys(state.env, LIST_SPECULATIVE_ENV_KEYS);
  let committed = false;
  try {
    const bufferedState = createBufferedState(state);
    const ok: boolean = ListsInternal(bufferedState, startLine, endLine);
    if (!ok || silent) {
      if (silent) {
        setCachedListProbe(state, probeKey, ok);
      }
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
    return true;
  } finally {
    restoreEnvKeys(state.env, LIST_TRANSIENT_ENV_KEYS, transientSnap.had, transientSnap.snap);
    if (!committed) {
      setCaptionCounters(captionSnap);
      restoreEnvKeys(state.env, LIST_SPECULATIVE_ENV_KEYS, floatEnvSnap.had, floatEnvSnap.snap);
    }
  }
};
