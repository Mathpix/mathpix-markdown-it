import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import type Token from 'markdown-it/lib/token';
import type { RuleBlock } from 'markdown-it/lib/parser_block';
import { setTokenOpenList, setTokenCloseList, ListOpen } from "./latex-list-tokens";
import { ListItemsBlock, ItemsListPush, ItemsAddToPrev, finalizeListItems, splitInlineListEnv } from "./latex-list-items";
import { GetItemizeLevelTokensByState, GetEnumerateLevel, ItemizeLevelTokenResult } from "./re-level";
import {
  ListType,
  ParsedListItem,
  ListOpenResult,
  LstEndResult,
  isListType
} from "./latex-list-types";
import { parseSetCounterNumber } from "./latex-list-common";
import {
  BEGIN_LIST_ENV_INLINE_RE,
  BEGIN_LST_INLINE_RE,
  END_LST_INLINE_RE,
  BEGIN_LIST_ENV_RE,
  END_LIST_ENV_INLINE_RE,
  LATEX_ITEM_COMMAND_INLINE_RE,
  reSetCounter
} from "../common/consts";

/**
 * Try to handle an inline `\begin{lstlisting}` on the given line.
 *
 * Behavior:
 * - If already inside a lstlisting environment (`envDepth > 0`), does nothing.
 * - If a `\begin{lstlisting}` is found:
 *   - Text before the begin is appended either as a new list item (when it matches `itemTag`)
 *     or concatenated to the previous item.
 *   - Sets `envDepth` to 1 (entered lstlisting).
 *   - Appends the substring starting at `\begin{lstlisting}` to the end of the line
 *     as code content in the current item.
 *
 * The function does not mutate inputs; it returns the updated state.
 *
 * @param lineText The full text of the current line.
 * @param envDepth Current lstlisting nesting depth.
 * @param items    Collected items so far (list builder state).
 * @param nextLine The current (next) line index used for item position metadata.
 * @param dStart   Document start line offset to compute absolute positions.
 * @param itemTag  RegExp to detect list item prefixes (e.g., `^\s*\\item`).
 * @returns Updated handling result with flags, depth, items, and original line text.
 */
const handleLstBeginInline = (
  lineText: string,
  envDepth: number,
  items: any[],
  nextLine: number,
  dStart: number,
  itemTag: RegExp
): LstEndResult => {
  // If already inside lstlisting, do nothing.
  if (envDepth > 0) {
    return { handled: false, envDepth, items, lineText };
  }
  const mb: RegExpMatchArray = BEGIN_LST_INLINE_RE.exec(lineText);
  if (!mb) {
    return { handled: false, envDepth, items, lineText };
  }
  const beginIndex: number = mb.index;
  // Is there text BEFORE \begin{lstlisting} ?
  const before: string = lineText.slice(0, beginIndex).trimEnd();
  const afterBegin: string = lineText.slice(beginIndex); // start from \begin...
  // If there was something before begin, it was regular text/part of \item:
  if (before.length > 0) {
    if (itemTag.test(before)) {
      items = ItemsListPush(items, before, nextLine + dStart, nextLine + dStart);
    } else {
      items = ItemsAddToPrev(items, before, nextLine);
    }
  }
  envDepth = 1; //entered lstlisting
  items = ItemsAddToPrev(items, afterBegin, nextLine);//The part from \begin{lstlisting} to the end of the line is considered a code string.
  return { handled: true, envDepth, items, lineText };
}

/**
 * Try to handle an inline `\end{lstlisting}` on the current line.
 *
 * Behavior:
 * - If not inside an lstlisting environment (`envDepth === 0`), does nothing.
 * - If no end marker is found on this line, appends the full line (with original leading whitespace)
 *   to the current item and reports `handled: true` (still inside the env).
 * - If an end marker is present:
 *   - Appends everything up to `\end{...}` (plus the end token itself) to the current item.
 *   - Resets `envDepth` to 0 (leaves lstlisting).
 *   - If there is trailing text after the end token, returns it in `lineText` so the caller
 *     can continue processing the remainder of the line; otherwise returns an empty `lineText`.
 *
 * The function does not mutate inputs; it returns the updated state.
 *
 * @param lineText Current line text (may contain `\end{lstlisting}`).
 * @param envDepth Current lstlisting nesting depth (0 if outside).
 * @param items    Accumulated items list (list builder state).
 * @param nextLine Line index used for item position metadata.
 * @param state    Markdown-It state (used to read the original line with indentation).
 * @returns Updated result with flags, depth, items, and remaining line text (if any).
 */
const handleLstEndInline = (
  lineText: string,
  envDepth: number,
  items: any[],
  nextLine: number,
  state
): LstEndResult => {
  // If we are not inside lstlisting, we exit
  if (envDepth === 0) {
    return { handled: false, envDepth, items, lineText };
  }
  const me: RegExpMatchArray = END_LST_INLINE_RE.exec(lineText);
  if (!me) {
    // There is no end of environment - just add the line as is
    lineText = state.src.slice(state.bMarks[nextLine], state.eMarks[nextLine]); // It is important to take into account the leading whitespace characters.
    items = ItemsAddToPrev(items, lineText, nextLine);
    return { handled: true, envDepth, items, lineText };
  }
  // There is an end of environment in this line
  const endIndex: number = me.index;
  const endToken: string = lineText.slice(endIndex, endIndex + me[0].length);
  const beforeEnd: string = lineText.slice(0, endIndex);
  const afterEnd: string = lineText.slice(endIndex + me[0].length);
  // Everything up to \end{...} is a continuation of the code
  if (beforeEnd.length > 0) {
    items = ItemsAddToPrev(items, beforeEnd + '\n' + endToken, nextLine);
  } else {
    items = ItemsAddToPrev(items, endToken, nextLine);
  }
  envDepth = 0; // Exit lstlisting
  if (!afterEnd?.trim()?.length) {
    return { handled: true, envDepth, items, lineText: '' };
  }
  return { handled: false, envDepth, items, lineText: afterEnd };
}

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
  // In silent mode: only report that this block can start; do not modify state or emit tokens.
  if (silent) {
    return true;
  }
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
  let envDepth: number = 0; // >0 — inside lstlisting environment
  for (; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);
    // 1) If you are NOT currently inside lstlisting, first search for \begin{lstlisting}
    if (envDepth === 0) {
      const beginRes: LstEndResult = handleLstBeginInline(lineText, envDepth, items, nextLine, renderStart, LATEX_ITEM_COMMAND_INLINE_RE);
      envDepth = beginRes.envDepth;
      if (beginRes.handled) {
        continue; // this line is already fully processed
      }
      lineText = beginRes.lineText;
    }
    // 2) If inside lstlisting, look for \end{lstlisting}
    if (envDepth > 0) {
      const endRes: LstEndResult = handleLstEndInline(lineText, envDepth, items, nextLine, state);
      envDepth = endRes.envDepth;
      items = endRes.items;
      if (endRes.handled) {
        continue;
      }
      lineText = endRes.lineText;
    }
    // Handle \setcounter lines
    if (reSetCounter.test(lineText)) {
      match = lineText.match(reSetCounter);
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
    // No explicit \end{itemize}/\end{enumerate} found — flush remaining items
    console.log("NOT CLOSE TAG.");
    ListItemsBlock(state, items);
    li = null;
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
