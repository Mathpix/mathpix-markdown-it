import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import type Token from 'markdown-it/lib/token';
import type { RuleBlock } from 'markdown-it/lib/parser_block';
import { setTokenOpenList, setTokenCloseList, ListOpen, absorbSublistIntoWrapper } from "./latex-list-tokens";
import { ItemsListPush, ItemsAddToPrev, finalizeListItems, resolveListPadding } from "./latex-list-items";
import { GetItemizeLevelTokensByState, GetEnumerateLevel, ItemizeLevelTokenResult } from "./re-level";
import {
  ListType,
  ParsedListItem,
  ListOpenResult,
  isListType,
  StateBlockLike,
  OpaqueStack
} from "./latex-list-types";
import { parseSetCounterNumber } from "./latex-list-common";
import { renewCommandSpanEnd } from "../common";
import { snapshotListLevels, restoreListLevels, getOpenListCount, type ListLevelState } from "./list-state";
import { getCaptionCounters, setCaptionCounters } from "../common/caption-counters";
import { countPositionsAtOrAfter } from "../common/src-pos-cache";
import { FenceMarker, detectFenceOpen, isFenceClose } from "../common/verbatim-ranges";
import {
  LIST_TRANSIENT_ENV_KEYS,
  EnvSnapshot,
  snapshotEnvAll,
  releaseEnvSnapshot,
  restoreEnvAll,
  restoreEnvKeysFromAll,
} from "../common/env-transient";
import { flushBufferedTokens, createBufferedState, warnListRuleFailed } from "./latex-list-env-engine";
import { processOpaqueLine, OpaqueProcessResult } from "./latex-list-opaque";
import { warnDistinct } from "../common/warn-distinct";
import {
  BEGIN_LIST_ENV_RE,
  LATEX_BLOCK_ENV_OPEN_RE,
  LATEX_ITEM_COMMAND_INLINE_RE,
  RENEWCOMMAND_LINE_RE,
  reSetCounter
} from "../common/consts";

import {
  unclosedEnvsIn,
  splitInlineListEnv,
  listCloserOffsets,
  lastListEndPos,
  canCloseAfter,
  listDepthBetween,
  nextListEnvMatch,
  maskNonStructure,
} from "./list-source-model";

/**
 * Parse a LaTeX list environment starting at `startLine` and emit tokens into `state`.
 *
 * Notes:
 * - The function is "strict": it returns false if the matching \end{...} is not found.
 * - Works with any StateBlock-like object (real block state or synthetic state for inline reuse).
 *
 * @returns true if the environment was successfully parsed and closed, otherwise false.
 */
const LEADING_SPACE_RE: RegExp = /^\s*/;
const leadingSpaceOf = (text: string): number => LEADING_SPACE_RE.exec(text)[0].length;

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
    state.level = state.prentLevel > 0 ? state.prentLevel : 0;
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
    // An opaque env on this line consumes it below, so the counter branch never sees it — all seven,
    // `tabular` included. `reSetCounter` is anchored: one inside the env body does not match.
    const counterMatch: RegExpMatchArray | null = lineText.match(reSetCounter);
    if (counterMatch && counterMatch[2] && LATEX_BLOCK_ENV_OPEN_RE.test(lineText)) {
      li = { value: parseSetCounterNumber(counterMatch) ?? 1 };
      if (state.md.options?.forLatex) {
        const token = state.push("setcounter", "", 0) as any;
        token.latex = counterMatch[0].trim();
      }
      lineText = lineText.slice(counterMatch.index! + counterMatch[0].length);
    }
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
    // Measured by its own span, so structure after it reaches the walk with its own line, and an
    // `\item` inside the macro body stays part of the macro.
    if (RENEWCOMMAND_LINE_RE.test(lineText)) {
      const spanEnd: number = renewCommandSpanEnd(lineText);
      const rest: string = spanEnd > 0 ? lineText.slice(spanEnd) : '';
      // Span unmeasurable: only a line carrying structure goes to the walk, or that closer is lost.
      const keepForWalk: boolean = spanEnd < 0
        && (!!nextListEnvMatch(lineText) || LATEX_ITEM_COMMAND_INLINE_RE.test(lineText));
      if (rest.trim() && (!!nextListEnvMatch(rest) || LATEX_ITEM_COMMAND_INLINE_RE.test(rest))) {
        items = ItemsAddToPrev(items, lineText.slice(0, spanEnd), lineIdx,
          !!state.md.options?.forLatex);
        lineText = rest;
      } else if (!keepForWalk) {
        items = ItemsAddToPrev(items, lineText, lineIdx, !!state.md.options?.forLatex);
        return 'proceed';
      }
    }
    // Handle \setcounter lines
    if (reSetCounter.test(lineText)) {
      let match: RegExpMatchArray | null = lineText.match(reSetCounter);
      if (match && state.md.options?.forLatex) {
        const token = state.push("setcounter", "", 0) as any;
        token.latex = match[0].trim();
      }
      if (match && match[2]) {
        // Whole for the walk, which anchors offsets on the line's end and needs a suffix; trimmed
        // only for the content path.
        const rest: string = match.index! + match[0].length < lineText.length
            ? lineText.slice(match.index! + match[0].length)
            : "";
        const sE: string = rest.trim();
        const startNumber = parseSetCounterNumber(match) ?? 1;
        li = { value: startNumber };
        // The counter is set either way; structure sharing the line goes to the walk, not into the
        // item above — that is where a closer was lost and the list dropped.
        if (sE.length > 0 && (!!nextListEnvMatch(sE) || LATEX_ITEM_COMMAND_INLINE_RE.test(sE))) {
          lineText = rest;
        } else {
          if (sE.length > 0) {
            items = ItemsAddToPrev(items, sE, lineIdx);
          }
          return 'proceed';
        }
      }
    }
    // Every inline \begin/\end on the line, left to right. Handling only the first left the tail
    // of a collapsed `\end{itemize}\end{itemize}` to ItemsAddToPrev, which drops a pure closer —
    // so the outer list never closed and the strict `!haveClose` bail killed the whole rule.
    let tail: string = lineText;
    // Where `tail` sits in the source, so a leftover can be handed back by offset rather than by text.
    let tailAt: number = state.bMarks[lineIdx] + state.tShift[lineIdx];
    // Masked once, then cut in step with `tail`: masking keeps length and spaces, so the same slice
    // and trim keep the two aligned. Re-masking per match was quadratic over the line.
    let maskedTail: string = maskNonStructure(tail);
    let env: { match: RegExpMatchArray; isEnd: boolean } | null = nextListEnvMatch(maskedTail);
    // Every command on the line is written as text: kept as one chunk, the way it was before masking.
    if (!env && nextListEnvMatch(tail)) {
      items = ItemsListPush(items, tail, lineIdx, lineIdx);
      return 'proceed';
    }
    const sawListEnv: boolean = !!env;
    while (env) {
      const { match: envMatch, isEnd } = env;
      const raw: string = envMatch[1].trim();
      // Defensive: the patterns match `itemize|enumerate` only, so this fires only if one widens.
      if (!isListType(raw)) {
        return 'abort';
      }
      // The match came from the masked line, so it is never inside a code span — asking again here
      // parsed the whole line's spans per match.
      let { sB, sE } = splitInlineListEnv(tail, envMatch);
      // Masking keeps length, so one cut fits both strings.
      const cut: number = (envMatch.index ?? 0) + envMatch[0].length;
      const maskedSE: string = maskedTail.slice(cut).trim();
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
        // Asked after the parse, and of the level stack rather than of the handle above: an inline
        // `\end` in the body closes the list there, and a second tag for it reaches the page.
        if (getOpenListCount() > 0) {
          setTokenCloseList(state, startLine + renderStart, lineIdx + renderStart, closingList);
        }
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
          // Masked: an opener in a code span read as a sibling, and the next closer emitted a bare tag.
          const tailEnv: { match: RegExpMatchArray; isEnd: boolean } | null = nextListEnvMatch(maskedSE);
          let siblingClosable: boolean = false;
          if (tailEnv && !tailEnv.isEnd) {
            // Count, do not just look: a tail opening two levels needs two closers. The count walks
            // the tail as this loop does, so both agree on which transitions are real.
            const needed: number = unclosedEnvsIn(sE);
            // In order, not by balance: a net count let an unclosed env below subtract a closer this
            // sibling reaches first.
            siblingClosable = canCloseAfter(state, state.eMarks[lineIdx], needed);
          }
          if (siblingClosable) {
            // The outermost list closed, so the sibling opens outside any list: applyListCloseState
            // leaves `parentType` set, which would make it read as nested and lose 2.5em of indent.
            state.parentType = oldParentType;
          }
          if (!siblingClosable) {
            // Nothing emits a leftover after the outermost closer, so hand that stretch of the line back
            // to the block phase — by offset, on commit. A leftover holding list structure stays here:
            // re-read as a document it would open as a top-level list, skipping the closer count above.
            const tailFrom: number = tailAt + cut + leadingSpaceOf(tail.slice(cut));
            if (sE.length > 0 && lineIdx > startLine
              && !nextListEnvMatch(maskNonStructure(sE))) {
              state.listTailFrom = { line: lineIdx, at: tailFrom };
            }
            // No else: items are flushed above, so a leftover added here reaches no token. One holding
            // list structure is dropped by decision (Non-Goals).
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
      // `sE` is trimmed, so the offset follows the untrimmed cut plus the leading space it dropped.
      tailAt = tailAt + cut + leadingSpaceOf(tail.slice(cut));
      tail = sE;
      // A zero step would spin, so the walk ends rather than trust the pattern to advance.
      if (cut <= 0) {
        break;
      }
      maskedTail = maskedSE;
      env = nextListEnvMatch(maskedTail);
    }
    if (sawListEnv) {
      // What is left after the last env: item text. A tail holding an `\item` opens one, as `sB`
      // above does — appended to a list just opened, it had nothing to attach to and was lost.
      if (tail.length > 0) {
        items = LATEX_ITEM_COMMAND_INLINE_RE.test(tail)
          ? ItemsListPush(items, tail, lineIdx, lineIdx)
          : ItemsAddToPrev(items, tail, lineIdx);
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
  state.level = state.prentLevel > 0 ? state.prentLevel : 0;
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
  // Asked as a paragraph terminator: a paragraph holding an unclosed opener above owns this list in its
  // own content, and ending it here left the env split between two blocks, each with half of it.
  const inParagraph: number | undefined = (state as StateBlockLike).listParagraphStart;
  if (silent && inParagraph !== undefined
    && listDepthBetween(state, inParagraph, state.bMarks[startLine]) > 0) {
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
  // A discarded parse enters a level per `\begin` and, having no `\end`, never leaves it — without
  // this the depth grows with the number of probes, not with the real nesting.
  const listLevelSnap: readonly ListLevelState[] = snapshotListLevels();
  // Inside the `try`: reading a consumer's `env` can throw, and that must decline the rule, not the
  // render. Null until the slot is really taken.
  let envSnap: EnvSnapshot | null = null;
  let committed = false;
  try {
    envSnap = snapshotEnvAll(state.env);
    const bufferedState = createBufferedState(state);
    const ok: boolean = ListsInternal(bufferedState, startLine, endLine);
    if (!ok || silent) {
      return ok;
    }
    // Set before flushing: once tokens (carrying caption numbers) start entering state,
    // a mid-flush throw must not roll the counters back out from under them.
    committed = true;
    flushBufferedTokens(state, bufferedState.tokens);
    // Only here: the line marks are shared with the real state by prototype, so a probe writing them
    // would move the document's own lines under a parse that never applied.
    const tailFrom = (bufferedState as StateBlockLike).listTailFrom;
    if (tailFrom) {
      state.bMarks[tailFrom.line] = tailFrom.at;
      state.tShift[tailFrom.line] = 0;
      // `sCount` stays: it names the container, and zeroed it read as dedented — the leftover left its
      // markdown item and broke that list in two.
    }
    state.line = tailFrom ? tailFrom.line : bufferedState.line;
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
    try {
      if (!committed) {
        setCaptionCounters(captionSnap);
        restoreListLevels(listLevelSnap);
      }
      // Transient flags go back even on commit: a leaked isBlock=true wakes the inline fallback on the
      // next block (empty `<>` items). Everything else only when the tokens are discarded.
      if (envSnap) {
        restoreEnvKeysFromAll(state.env, LIST_TRANSIENT_ENV_KEYS, envSnap);
        if (!committed) {
          restoreEnvAll(state.env, envSnap);
        }
      }
    } catch (e) {
      // A getter-only or frozen key makes the write-back throw. Putting `env` back is ours, so a
      // failure is reported, not propagated.
      warnDistinct('env-restore-failed:' + (e?.name ?? 'Error'),
        '[env] could not restore a key the consumer owns', { message: e?.message });
    } finally {
      // Always: a throw above would hold the slot for the process, and the reset declines while live.
      if (envSnap) {
        releaseEnvSnapshot();
      }
    }
  }
};
