import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import type Token from 'markdown-it/lib/token';
import type { RuleBlock } from 'markdown-it/lib/parser_block';
import { setTokenOpenList, setTokenCloseList, ListOpen } from "./latex-list-tokens";
import { ItemsListPush, ItemsAddToPrev, finalizeListItems, splitInlineListEnv } from "./latex-list-items";
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
  const openData: ListOpenResult = ListOpen(state, startLine + renderStart, lineText, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents);
  let { iOpen = 0, tokenStart = null } = openData;
  li = openData.li ?? null;
  if (iOpen === 0) {
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
  for (; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);
    // Handle opaque envs; may consume the line or return a tail to re-parse.
    const opaqueRes: OpaqueProcessResult = processOpaqueLine({
      lineText,
      stack: opaqueStack,
      items,
      nextLine,
      state,
      renderStart
    });
    opaqueStack = opaqueRes.stack;
    items = opaqueRes.items;
    lineText = opaqueRes.lineText;
    if (opaqueRes.consumedLine) {
      continue;
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
          items = ItemsAddToPrev(items, sE, nextLine);
        }
        continue;
      }
    }
    // Handle inline \end{itemize}/\end{enumerate}
    if (END_LIST_ENV_INLINE_RE.test(lineText)) {
      const endMatch: RegExpMatchArray = lineText.match(END_LIST_ENV_INLINE_RE);
      if (endMatch) {
        const raw: string = endMatch[1].trim();
        if (!isListType(raw)) {
          return false;
        }
        let { sB, sE, isBacktickEscapedPair } = splitInlineListEnv(lineText, endMatch);
        if (isBacktickEscapedPair) {
          items = ItemsListPush(items, lineText, nextLine, nextLine);
          continue;
        }
        if (sB.length > 0) {
          items = ItemsAddToPrev(items, sB, nextLine);
        }
        ({ iOpen, items, li } = finalizeListItems(
          state,
          items,
          itemizeLevelTokens,
          enumerateLevelTypes,
          li,
          iOpen,
          itemizeLevelContents,
          tokenStart
        ));
        setTokenCloseList(state, startLine + renderStart, nextLine + renderStart);
        if (sE.length > 0) {
          items = ItemsAddToPrev(items, sE, nextLine);
        }
        iOpen--;
        if (iOpen <= 0) {
          haveClose = true;
          nextLine += 1;
          break;
        }
      }
      continue;
    }
    // Handle inline \begin{itemize}/\begin{enumerate}
    if (BEGIN_LIST_ENV_INLINE_RE.test(lineText)) {
      const beginMatch = lineText.match(BEGIN_LIST_ENV_INLINE_RE);
      if (beginMatch) {
        const raw = beginMatch[1].trim();
        if (!isListType(raw)) {
          return false;
        }
        const beginType: ListType = raw;

        let { sB, sE, isBacktickEscapedPair } = splitInlineListEnv(lineText, beginMatch);
        if (isBacktickEscapedPair) {
          items = ItemsListPush(items, lineText, nextLine, nextLine);
          continue;
        }
        if (sB.length > 0) {
          items = ItemsAddToPrev(items, sB, nextLine);
        }
        ({ iOpen, items, li } = finalizeListItems(
          state,
          items,
          itemizeLevelTokens,
          enumerateLevelTypes,
          li,
          iOpen,
          itemizeLevelContents,
          tokenStart
        ));
        setTokenOpenList(state, -1, -1, beginType, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents);
        if (sE.length > 0) {
          items = ItemsAddToPrev(items, sE, nextLine);
        }
        iOpen++;
      }
    } else {
      // Regular line inside list: either a new \item or continuation
      if (LATEX_ITEM_COMMAND_INLINE_RE.test(lineText)) {
        items = ItemsListPush(items, lineText, nextLine + renderStart, nextLine + renderStart);
      } else {
        items = ItemsAddToPrev(items, lineText, nextLine);
      }
    }
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
  let lineText = state.src.slice(pos, max);
  // Must start with backslash to be LaTeX command
  if (lineText.charCodeAt(0) !== 0x5c /* '\' */) {
    return false;
  }
  let match: RegExpMatchArray | null = lineText.match(BEGIN_LIST_ENV_RE);
  if (!match) {
    return false;
  }
  const typeList: string = match[1].trim();
  if (!isListType(typeList)) {
    return false;
  }
  // Buffer tokens first (do not write into the real state during parsing)
  const bufferedState = createBufferedState(state);
  // Run the original logic on bufferedState instead of state
  const ok: boolean = ListsInternal(bufferedState, startLine, endLine); // we'll define it
  if (!ok) return false;
  // In silent mode: only report that this block can start; do not modify state or emit tokens.
  if (silent) {
    return true;
  }
  // Flush tokens to the real state at the end
  flushBufferedTokens(state, bufferedState.tokens);
  // Sync state fields modified by parsing
  state.line = bufferedState.line;
  state.startLine = bufferedState.startLine;
  state.parentType = bufferedState.parentType;
  state.level = bufferedState.level;
  state.prentLevel = bufferedState.prentLevel;
  state.env = bufferedState.env;
  return true;
};
