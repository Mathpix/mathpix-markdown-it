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
import { snapshotListLevels, restoreListLevels, type ListLevelState } from "./list-state";
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
  LATEX_ITEM_COMMAND_INLINE_RE,
  RENEWCOMMAND_LINE_RE,
  reSetCounter
} from "../common/consts";

import {
  unclosedEnvsIn,
  splitInlineListEnv,
  listCloserOffsets,
  lastListEndPos,
  closersLeftAfter,
  nextListEnvMatch,
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
        setTokenCloseList(state, startLine + renderStart, lineIdx + renderStart, closingList);
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
            // Count, do not just look: a tail opening two levels needs two closers. The count walks
            // the tail as this loop does, so both agree on which transitions are real.
            const needed: number = unclosedEnvsIn(sE);
            if (needed <= 0) {
              siblingClosable = true;
            } else {
              // Free closers, not every closer: one claimed by a list opened further down is not ours.
              siblingClosable = closersLeftAfter(state, state.eMarks[lineIdx]) >= needed;
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
