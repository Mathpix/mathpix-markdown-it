import { RuleInline } from 'markdown-it';
import type StateInline from 'markdown-it/lib/rules_inline/state_inline';
import * as Token from 'markdown-it/lib/token';
import { getSpacesFromLeft, skipBackticks } from "../utils";
import { renewCommandSpanEnd, buildInlineCodePositionSet, getInlineCodeListFromString } from "../common";
import { matchPositionsCached, countPositionsAtOrAfter, srcValueCached } from "../common/src-pos-cache";
import {
  incrementItemCount,
  isParsingMarker,
  isListOwnParse,
  getOpenListCount,
  beginMarkerParse,
  endMarkerParse,
} from "./list-state";
import {
  ListType,
  isListType,
  EnvMatch,
  ParseListEnvResult,
  OpaqueEnvType,
  OpaqueStack
} from "./latex-list-types";
import {
  getListTokenTypes,
  applyListOpenState,
  applyListCloseState,
  closeOpenListItemIfNeeded,
  parseSetCounterNumber
} from "./latex-list-common";
import { parseListEnvRawToTokens, flushTokensToInline, warnListRuleFailed } from "./latex-list-env-engine";
import {
  makeItemCommandSticky,
  END_LIST_ENV_RE,
  BEGIN_LIST_ENV_RE,
  LATEX_LIST_BOUNDARY_INLINE_RE,
  reSetCounter,
  BEGIN_LST_INLINE_RE,
  BEGIN_TABULAR_INLINE_RE,
  END_LST_INLINE_RE,
  END_TABULAR_INLINE_RE,
  END_LIST_ENV_INLINE_RE,
} from "../common/consts"

// Sticky-free closer search over the whole src, so the check needs no slice.
const END_LIST_ENV_SEARCH_G: RegExp = new RegExp(END_LIST_ENV_INLINE_RE.source, 'g');
// Same patterns applied at an index instead of to `src.slice(pos)`, which copied the rest of the
// document on every call. Built from the shared sources, so they cannot drift.
const ITEM_COMMAND_AT: RegExp = makeItemCommandSticky();
// The scan needs its own: `lastIndex` is state, and the rule above walks a different position.
const ITEM_COMMAND_IN_SCAN: RegExp = makeItemCommandSticky();
const LIST_BOUNDARY_SEARCH_G: RegExp = new RegExp(LATEX_LIST_BOUNDARY_INLINE_RE.source, 'g');
// Asked at a position instead of of `src.slice(pos)` — a copy of the tail per character. Sticky where
// a match at the position was required (`^` drops: /y is the anchor), global for the opaque search.
const BEGIN_LIST_ENV_AT: RegExp = new RegExp(BEGIN_LIST_ENV_RE.source.replace(/^\^/, ''), 'y');
const END_LIST_ENV_AT: RegExp = new RegExp(END_LIST_ENV_RE.source.replace(/^\^/, ''), 'y');
const BEGIN_LST_AT: RegExp = new RegExp(BEGIN_LST_INLINE_RE.source, 'y');
const BEGIN_TABULAR_AT: RegExp = new RegExp(BEGIN_TABULAR_INLINE_RE.source, 'y');
const END_LST_SEARCH_G: RegExp = new RegExp(END_LST_INLINE_RE.source, 'g');
const END_TABULAR_SEARCH_G: RegExp = new RegExp(END_TABULAR_INLINE_RE.source, 'g');

// Cached per src, and empty for a source without the command: finding the nearest one by scanning
// backwards cost a walk of the prefix per item boundary.
const RENEWCOMMAND_POSITIONS: symbol = Symbol('renewcommand-positions');
const RENEWCOMMAND_SEARCH_G: RegExp = /\\renewcommand\b/g;

// Per source and per command: the reader builds a code-span index over the tail on each ask, and every
// item boundary after one `\renewcommand` asks about the same offset — 758ms at 1600 items against 9ms.
const RENEWCOMMAND_SPANS: symbol = Symbol('renewcommand-spans');
// One index per source too: the memo spares a repeat at the same offset, not the next offset.
const RENEWCOMMAND_CODE_POSITIONS: symbol = Symbol('renewcommand-code-positions');
/** Where the command at `cmdAt` ends, absolute, or -1. */
const renewCommandSpanAt = (state: StateInline, cmdAt: number): number => {
  const cached = state as unknown as Parameters<typeof srcValueCached>[0];
  const spans: Map<number, number> = srcValueCached(cached, RENEWCOMMAND_SPANS,
    () => new Map<number, number>());
  const known: number | undefined = spans.get(cmdAt);
  if (known !== undefined) {
    return known;
  }
  const codeIndex: Set<number> = srcValueCached(cached, RENEWCOMMAND_CODE_POSITIONS,
    (src: string) => buildInlineCodePositionSet(getInlineCodeListFromString(src)));
  const span: number = renewCommandSpanEnd(state.src, cmdAt, codeIndex);
  spans.set(cmdAt, span);
  return span;
};

// Does `at` fall inside the arguments of the nearest `\renewcommand` before it?
const insideRenewCommand = (state: StateInline, at: number): boolean => {
  const positions: readonly number[] =
    matchPositionsCached(state, RENEWCOMMAND_POSITIONS, RENEWCOMMAND_SEARCH_G);
  const before: number = positions.length - countPositionsAtOrAfter(positions, at + 1);
  if (before === 0) {
    return false;
  }
  const cmdAt: number = positions[before - 1];
  const spanEnd: number = renewCommandSpanAt(state, cmdAt);
  return spanEnd > 0 && at < spanEnd;
};

/**
 * Finds the first complete list environment starting at `startPos`.
 * - Tracks nested itemize/enumerate via `listStack`
 * - Treats lstlisting/tabular as opaque (skips their content)
 * - Skips Markdown backtick code spans so `\begin/\end` inside code does not interfere
 */
export const findFirstCompleteListEnv = (src: string, startPos: number): EnvMatch | null => {
  const slice: string = src.slice(startPos);
  const begin: RegExpMatchArray = slice.match(BEGIN_LIST_ENV_RE);
  if (!begin || begin.index !== 0) {
    return null;
  }
  const rootTypeRaw: string = (begin[1] ?? "").trim();
  if (!rootTypeRaw || !isListType(rootTypeRaw)) {
    return null;
  }
  // The only success path is the closer branch below, so no closer ahead means no match. Checked
  // up front because the scan walks char by char and slices the rest at each step.
  END_LIST_ENV_SEARCH_G.lastIndex = startPos;
  if (!END_LIST_ENV_SEARCH_G.exec(src)) {
    return null;
  }
  const rootType: ListType = rootTypeRaw;
  const listStack: ListType[] = [rootType];
  // Once per walk, and only if a macro is met: built per macro it cost 311ms at 4000 of them against 5.
  let codeSpans: Set<number> | null = null;
  const codePositions = (): Set<number> => {
    if (!codeSpans) {
      codeSpans = buildInlineCodePositionSet(getInlineCodeListFromString(src));
    }
    return codeSpans;
  };
  let pos: number = startPos + begin[0].length;
  // Opaque env stack: tabular can nest; lstlisting cannot.
  let opaqueStack: OpaqueStack = [];
  while (pos < src.length) {
    // 1) Skip Markdown code spans starting exactly at pos
    const codePos: number = skipBackticks(src, pos);
    if (codePos !== pos) {
      pos = codePos;
      continue;
    }
    // A closer in a `\renewcommand` body belongs to the macro, as the item scan already reads it.
    if (opaqueStack.length === 0 && src.startsWith('\\renewcommand', pos)) {
      const macroEnd: number = renewCommandSpanEnd(src, pos, codePositions());
      // Past `pos`, not just positive: the answer is absolute, and the walk must move on.
      if (macroEnd > pos) {
        pos = macroEnd;
        continue;
      }
    }
    // The optional marker is an argument: a list command written in it is text, not structure.
    if (opaqueStack.length === 0) {
      ITEM_COMMAND_IN_SCAN.lastIndex = pos;
      const itemAt: RegExpExecArray | null = ITEM_COMMAND_IN_SCAN.exec(src);
      if (itemAt && itemAt[1] !== undefined) {
        pos += itemAt[0].length;
        continue;
      }
    }
    // 2) If inside opaque → only look for END of the current opaque
    if (opaqueStack.length > 0) {
      const top: OpaqueEnvType = opaqueStack[opaqueStack.length - 1];
      const endRe: RegExp = top === "lstlisting" ? END_LST_SEARCH_G : END_TABULAR_SEARCH_G;
      endRe.lastIndex = pos;
      const me: RegExpExecArray = endRe.exec(src);
      if (!me) {
        // No closer ahead, and nothing here pops the stack: every later position answers the same.
        // Walking on was quadratic — 2245ms at 512KB.
        return null;
      }
      // Found opaque end, pop stack and jump after it
      pos = me.index + me[0].length;
      opaqueStack = opaqueStack.slice(0, -1);
      continue;
    }
    // 3) Nested begin list (must be exactly at pos)
    BEGIN_LIST_ENV_AT.lastIndex = pos;
    const mbList: RegExpExecArray = BEGIN_LIST_ENV_AT.exec(src);
    if (mbList) {
      const tRaw: string = (mbList[1] ?? "").trim();
      if (tRaw && isListType(tRaw)) {
        listStack.push(tRaw);
        pos += mbList[0].length;
        continue;
      }
    }
    // 4) End list (must be exactly at pos)
    END_LIST_ENV_AT.lastIndex = pos;
    const meList: RegExpExecArray = END_LIST_ENV_AT.exec(src);
    if (meList) {
      const tRaw: string = (meList[1] ?? "").trim();
      if (!tRaw || !isListType(tRaw)) {
        return null;
      }
      const expected: ListType = listStack[listStack.length - 1];
      if (expected !== tRaw) {
        return null;
      }
      listStack.pop();
      pos += meList[0].length;
      if (listStack.length === 0) {
        return { type: rootType, start: startPos, end: pos, raw: src.slice(startPos, pos) };
      }
      continue;
    }
    // 5) Opaque begin (ONLY if starts exactly at pos)
    BEGIN_LST_AT.lastIndex = pos;
    BEGIN_TABULAR_AT.lastIndex = pos;
    const mbLst0: RegExpExecArray = BEGIN_LST_AT.exec(src);
    const mbTab0: RegExpExecArray = BEGIN_TABULAR_AT.exec(src);
    if (mbLst0 || mbTab0) {
      const opened: OpaqueEnvType = mbLst0 ? "lstlisting" : "tabular";
      opaqueStack = [...opaqueStack, opened];
      pos += (mbLst0 ?? mbTab0)![0].length;
      continue;
    }
    pos += 1;
  }
  return null;
};

/**
 * Inline rule: recognizes a complete `\begin{itemize|enumerate}...\end{...}` sequence at the current
 * cursor, parses it with the block list parser, then injects the resulting tokens into the inline stream.
 * Any token.inlinePos produced by the block parser is shifted to absolute offsets in `state.src`.
 */
export const latexListEnvInline: RuleInline = (
  state: StateInline,
  silent: boolean
): boolean => {
  const startPos: number = state.pos;
  // Must start with '\'
  if (state.src.charCodeAt(startPos) !== 0x5c /* '\' */) {
    return false;
  }
  const begin = state.src.slice(startPos).match(BEGIN_LIST_ENV_RE);
  if (!begin || begin.index !== 0) {
    return false;
  }
  const type: string = (begin[1] ?? "").trim();
  if (!type || !isListType(type)) {
    return false;
  }
  const env: EnvMatch | null = findFirstCompleteListEnv(state.src, startPos);
  if (!env) {
    return false;
  }
  if (silent) {
    state.pos = env.end;
    return true;
  }
  // Parse raw env using block logic. A failure here does not apply the rule, as on the block path;
  // the flush below stays unguarded — its tokens are already in the stream.
  let parsed: ParseListEnvResult;
  try {
    parsed = parseListEnvRawToTokens(state.md, env.raw, state.env);
  } catch (e) {
    warnListRuleFailed(e);
    return false;
  }
  if (!parsed.ok) {
    return false;
  }
  // Flush tokens into inline stream and shift inlinePos by absolute start offset
  flushTokensToInline(state, parsed.tokens, env.start);
  // Advance position
  state.pos = env.end;
  return true;
};

/**
 * Inline rule that parses LaTeX list environment closing commands:
 *
 *   \end{itemize}
 *   \end{enumerate}
 *
 * It:
 *  - checks that we are in block/list context,
 *  - closes any still-open list item (`latex_list_item_close`),
 *  - emits `itemize_list_close` or `enumerate_list_close`,
 *  - updates `state.level` and `state.prentLevel`,
 *  - updates internal list-level state via `leaveListLevel`,
 *  - advances `state.pos` to the end of the `\end{...}` command.
 */
export const listCloseInline: RuleInline = (
  state: StateInline,
  silent: boolean
): boolean => {
  const startPos: number = state.pos;
  // Only handle in block/list context
  if (!state.env?.isBlock || isParsingMarker() || !isListOwnParse(state)) {
    return false;
  }
  // No list open: the closer emitted a bare `</ul>`.
  if (getOpenListCount() === 0) {
    return false;
  }
  // Must start with backslash
  if (state.src.charCodeAt(startPos) !== 0x5c /* '\' */) {
    return false;
  }
  const match: RegExpMatchArray | null = state.src
    .slice(startPos)
    .match(END_LIST_ENV_RE);
  if (!match) {
    return false;
  }
  const rawType: string = match[1].trim();
  if (!isListType(rawType)) {
    return false;
  }
  if (!silent) {
    // What is open, not what the command names: crossed env names made `\end{itemize}` emit `</ul>`
    // over an open `<ol>`, leaving a tag with no opener and the `<ol>` never closed. `env.parentType`
    // is read only while a list is open — the transient the opener wrote, restored after it — and
    // `isListType` drops anything a consumer left under that name.
    const openType = state.types?.[state.types.length - 1] ?? (state.env as any)?.parentType;
    const listType: ListType = isListType(openType) ? openType : rawType;
    closeOpenListItemIfNeeded(state);
    const { closeType, htmlTag } = getListTokenTypes(listType);
    // itemize_list_close or enumerate_list_close
    const token: Token = state.push(closeType, htmlTag, -1);
    applyListCloseState(state, token);
  }
  state.pos = startPos + (match.index ?? 0) + match[0].length;
  return true;
};

/**
 * Inline rule that parses LaTeX list environment openings:
 *
 *   \begin{itemize}
 *   \begin{enumerate}
 *
 * It:
 *  - validates that we are in block/list context,
 *  - emits an `itemize_list_open` or `enumerate_list_open` token,
 *  - updates `state.prentLevel`, `state.parentType` and `state.types`,
 *  - advances `state.pos` to the end of the \begin{...} command,
 *  - registers the new list level in the list-level state.
 */
export const listBeginInline: RuleInline = (
  state: StateInline,
  silent: boolean
): boolean => {
  const startPos: number = state.pos;
  // Only inside block/list context
  if (!state.env?.isBlock || isParsingMarker() || !isListOwnParse(state)) {
    return false;
  }
  // Must start with backslash
  if (state.src.charCodeAt(startPos) !== 0x5c /* '\' */) {
    return false;
  }
  const match: RegExpMatchArray | null = state.src
    .slice(startPos)
    .match(BEGIN_LIST_ENV_RE);
  if (!match) {
    return false;
  }
  const rawType: string = match[1].trim();
  if (!isListType(rawType)) {
    return false;
  }
  if (!silent) {
    const listType: ListType = rawType;
    const { openType, htmlTag } = getListTokenTypes(listType);
    // itemize_list_open or enumerate_list_open
    const token: Token = state.push(openType, htmlTag, 1);
    applyListOpenState(state, listType, token);
  }
  state.pos = startPos + (match.index ?? 0) + match[0].length;
  return true;
};

/**
 * Inline rule that parses a single LaTeX list item:
 *   \item[marker] content...
 *
 * It:
 *  - closes a previously open list item if necessary,
 *  - opens a new `latex_list_item_open` token,
 *  - parses the optional marker into `markerTokens`,
 *  - creates an `inline` token with the item content,
 *  - updates `state.pos` to the end of the current item.
 */
export const listItemInline: RuleInline = (
  state: StateInline,
  silent: boolean
): boolean => {
  let startPos: number = state.pos;
  // Must start with backslash
  if (state.src.charCodeAt(startPos) !== 0x5c /* '\' */) {
    return false;
  }
  // Only handle in block/list context
  if (!state.env?.isBlock || isParsingMarker() || !isListOwnParse(state)) {
    return false;
  }
  // No list open: the `<li>` would have nothing to sit in.
  if (getOpenListCount() === 0) {
    return false;
  }
  // Try to match \item[...] command right after '\'
  ITEM_COMMAND_AT.lastIndex = startPos;
  const itemMatch: RegExpExecArray | null = ITEM_COMMAND_AT.exec(state.src);
  if (!itemMatch) {
    return false;
  }
  // Find where this item ends: next \item or begin/end list env
  const contentStart: number = startPos + itemMatch[0].length;
  LIST_BOUNDARY_SEARCH_G.lastIndex = contentStart;
  let boundaryMatch: RegExpExecArray | null = LIST_BOUNDARY_SEARCH_G.exec(state.src);
  // A closer in a `\renewcommand` body belongs to the macro: taking it emitted a close with no opener.
  while (boundaryMatch && insideRenewCommand(state, boundaryMatch.index)) {
    LIST_BOUNDARY_SEARCH_G.lastIndex = boundaryMatch.index + boundaryMatch[0].length;
    boundaryMatch = LIST_BOUNDARY_SEARCH_G.exec(state.src);
  }
  const content: string = boundaryMatch && boundaryMatch.index > contentStart
    ? state.src.slice(contentStart, boundaryMatch.index)
    : state.src.slice(contentStart);
  if (!silent) {
    // Close previous <li> if needed
    closeOpenListItemIfNeeded(state);
    // Open new list item
    let token: any = state.push("latex_list_item_open", "li", 1);
    incrementItemCount();
    token.parentType = state.parentType;
    token.inlinePos = {
      start_content: contentStart,
    };
    // Skip leading spaces in content for accurate inline range
    token.inlinePos.start_content += getSpacesFromLeft(content);
    token.inlinePos.end_content = token.inlinePos.start_content + content.length;
    // Optional marker: \item[<marker>]
    if (itemMatch[1] !== undefined) {
      // Parse the trimmed marker so markerTokens (used for width and rendering)
      // don't carry edge whitespace that inflates the padding.
      const trimmedMarker: string = itemMatch[1] ? itemMatch[1].trim() : "";
      token.marker = trimmedMarker;
      const children: Token[] = [];
      // Only when they are about to be replaced. Restored in `finally`, or a throw leaves the mutated
      // `outMath` on the md instance for every later render.
      const beforeOptions = state.md.options.forDocx ? {...state.md.options} : null;
      beginMarkerParse();
      try {
        if (beforeOptions) {
          state.md.options = {
            ...state.md.options,
            outMath: {
              include_svg: true,
              include_mathml_word: false,
            },
          };
        }
        state.md.inline.parse(trimmedMarker, state.md, state.env, children);
      } finally {
        endMarkerParse();
        if (beforeOptions) {
          state.md.options = beforeOptions;
        }
      }
      token.markerTokens = children;
    }
    // Inline content inside the list item
    token = state.push("inline", "", 0);
    token.content = content.trim();
    token.children = [];
  }
  // Advance parser position to after this item
  state.pos = contentStart + content.length;
  return true;
};

/**
 * Inline rule that parses LaTeX \setcounter commands inside list environments:
 *
 *   \setcounter{enumi}{3}
 *
 * It:
 *  - validates that we are in block/list context (state.env.isBlock),
 *  - parses the numeric value,
 *  - converts N to N+1 (so the next list item starts from that value),
 *  - emits a `setcounter` token with `content = "<nextNumber>"`,
 *  - optionally attaches the original LaTeX source in `token.latex`
 *    when `md.options.forLatex` is enabled.
 *
 * Example:
 *   \setcounter{enumi}{3}  →  token.type = "setcounter", token.content = "4"
 */
export const listSetCounterInline: RuleInline = (
  state: StateInline,
  silent: boolean
): boolean => {
  // Only handle in block/list context (not in pure inline text)
  if (!state.env?.isBlock || isParsingMarker() || !isListOwnParse(state)) {
    return false;
  }
  const startPos: number = state.pos;
  // Must start with backslash
  if (state.src.charCodeAt(startPos) !== 0x5c /* '\' */) {
    return false;
  }
  const match: RegExpMatchArray | null = state.src
    .slice(startPos)
    .match(reSetCounter);
  if (!match) {
    return false;
  }
  if (!silent) {
    // `?? 1` as the block path does: null comes back for a non-numeric argument like `{zz}`.
    const startNumber: number = parseSetCounterNumber(match) ?? 1;
    const content: string = startNumber.toString();
    const token = state.push("setcounter", "", 0);
    token.content = content;
    if (state.md?.options?.forLatex) {
      const absoluteEnd: number = startPos + (match.index ?? 0) + match[0].length;
      token.latex = state.src.slice(state.pos, absoluteEnd);
    }
  }
  // Advance parser position to just after the \setcounter call
  state.pos = startPos + (match.index ?? 0) + match[0].length;
  return true;
};
