import { ItemsListPush, ItemsAddToPrev } from "./latex-list-items";
import {
  ParsedListItem,
  LstEndResult,
  StateBlockLike,
  OpaqueStack, OpaqueEnvType
} from "./latex-list-types";
import { warnDistinct } from "../common/warn-distinct";
import {
  BEGIN_LST_INLINE_RE,
  BEGIN_TABULAR_INLINE_RE,
  END_TABULAR_INLINE_RE,
  LATEX_ITEM_COMMAND_INLINE_RE,
} from "../common/consts";
import {
  wrapperBeginAt,
  absoluteOffsetOf,
  hasCloserAhead,
  firstUsableCloser,
  nextListEnvMatch,
  maskNonStructure,
  unclosedEnvsIn,
} from "./list-source-model";
import { getOpenListCount } from "./list-state";

// Lines the list rule must not read as structure: a fence, an `lstlisting` body, a `tabular`. The
// stack, the items and the rest of the line go in and come back out — the parse loop owns them.

// Opens `openedType` and decides in one place whether it closes on this same line — the nested-tabular
// branch skipped that check, so its one-line form left the stack open for good.
const openOpaqueEnv = (
  stack: OpaqueStack,
  items: ParsedListItem[],
  openedType: OpaqueEnvType,
  afterBegin: string,
  nextLine: number,
  state: StateBlockLike
): LstEndResult => {
  // Not skipping a closer in code here: measured, the wrapper's own block rule truncates its content at
  // that closer anyway, and refusing it lost the tail instead of showing it (Non-Goals).
  const meSameLine = firstUsableCloser(state, nextLine, afterBegin, openedType, false);
  if (!meSameLine) {
    // `lineText` is a tail for the caller to re-parse, so it is only read when `handled` is false.
    return {
      handled: true,
      stack: [...stack, openedType],
      items: ItemsAddToPrev(items, afterBegin, nextLine),
      lineText: '',
    };
  }
  // Closed on this line, so the stack is handed back untouched: pushing only to pop allocated twice.
  const glue: string = openedType === "lstlisting" ? "\n" : "";
  const endToken: string = afterBegin.slice(meSameLine.index, meSameLine.index + meSameLine.length);
  items = ItemsAddToPrev(items, afterBegin.slice(0, meSameLine.index) + glue + endToken, nextLine);
  const afterSameLineEnd: string = afterBegin.slice(meSameLine.index + meSameLine.length);
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
  items: ParsedListItem[],
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
    return openOpaqueEnv(stack, items, "tabular", lineText.slice(mbTab.index), nextLine, state);
  }
  // A wrapper opens only when its closer is ahead of the `\begin` itself: an `\end{X}` left of it read
  // as reachable and cost the whole list.
  const mbWrapRaw: RegExpExecArray | null = wrapperBeginAt(lineText);
  // Unanchored (-1) declines the wrapper: with no offset to search from, no closer can be shown reachable.
  const wrapAt: number = mbWrapRaw
    ? absoluteOffsetOf(state, nextLine, lineText, mbWrapRaw.index, mbWrapRaw[0])
    : -1;
  const mbWrap: RegExpExecArray | null =
    mbWrapRaw && wrapAt >= 0 && hasCloserAhead(state, wrapAt, mbWrapRaw[1]) ? mbWrapRaw : null;
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
  // A transition in the prefix belongs to the line walk, but only while a list stays open past it: the
  // walk cannot emit a tail after the last closer, and this pass reads it as env content.
  const maskedBefore: string = before.length > 0 ? maskNonStructure(before) : '';
  if (maskedBefore.length > 0
    && nextListEnvMatch(maskedBefore)
    && getOpenListCount() + unclosedEnvsIn(maskedBefore) > 0) {
    return { handled: false, stack, items, lineText };
  }
  const afterBegin: string = lineText.slice(beginIndex);
  if (before.length > 0) {
    if (itemTag.test(before)) {
      items = ItemsListPush(items, before, nextLine + dStart, nextLine + dStart);
    } else {
      items = ItemsAddToPrev(items, before, nextLine);
    }
  }
  return openOpaqueEnv(stack, items, openedType, afterBegin, nextLine, state);
};

/**
 * Detects \end{...} for the current opaque env (stack top).
 * - If not found, appends the full raw line: nothing opens on top of a non-`tabular` top, so there is no tail.
 * - If found, appends up to end marker, pops stack, and returns tail (if any).
 *
 * @returns Updated { handled, stack, items, lineText }.
 */
const handleLstEndInline = (
  lineText: string,
  stack: OpaqueStack,
  items: ParsedListItem[],
  nextLine: number,
  state: StateBlockLike
): LstEndResult => {
  const top: OpaqueEnvType = stack[stack.length - 1];
  if (!top) {
    return { handled: false, stack, items, lineText };
  }
  // Same rule as when the env opened: a closer written in code is content, and the next one still closes.
  const me = firstUsableCloser(state, nextLine, lineText, top, true);
  if (!me) {
    // Raw, to keep the indentation. Safe only because `lineText` is the whole line here: handleLstBeginInline
    // declines any non-tabular top, so nothing has consumed a prefix. Widening that would duplicate the tail.
    const rawLine = state.src.slice(state.bMarks[nextLine], state.eMarks[nextLine]);
    items = ItemsAddToPrev(items, rawLine, nextLine);
    return { handled: true, stack, items, lineText };
  }
  const endIndex: number = me.index;
  const endToken: string = lineText.slice(endIndex, endIndex + me.length);
  const beforeEnd: string = lineText.slice(0, endIndex);
  const afterEnd: string = lineText.slice(endIndex + me.length);
  if (beforeEnd.length > 0) {
    // `lstlisting` keeps its own line breaks, `tabular` does not.
    const glue = top === "lstlisting" ? "\n" : "";
    items = ItemsAddToPrev(items, beforeEnd + glue + endToken, nextLine);
  } else {
    items = ItemsAddToPrev(items, endToken, nextLine);
  }
  stack = stack.slice(0, -1);
  if (!afterEnd?.trim()?.length) {
    return { handled: true, stack, items, lineText: "" };
  }
  return { handled: false, stack, items, lineText: afterEnd };
};

export type OpaqueProcessResult = {
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
export const processOpaqueLine = (
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
    // A shorter tail means a wrapper closed on this line; look again, or a second one beside it reaches
    // the caller as text and keeps the brace that opened it.
    if (lineText.length < remaining) {
      continue;
    }
    return { consumedLine: false, lineText, stack, items };
  }
  // Unreachable today: every branch returns or shrinks the tail. Asserts that, rather than guarding it.
  warnDistinct('opaque-stall:' + stack.join('>'),
    '[list-env] an opaque line stopped shrinking; the tail is taken as text');
  items = ItemsAddToPrev(items, lineText, nextLine);
  return { consumedLine: true, lineText, stack, items };
};
