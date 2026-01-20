import { RuleInline } from 'markdown-it';
import type StateInline from 'markdown-it/lib/rules_inline/state_inline';
import * as Token from 'markdown-it/lib/token';
import { getSpacesFromLeft, skipBackticks } from "../utils";
import { incrementItemCount } from "./list-state";
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
import { parseListEnvRawToTokens, flushTokensToInline } from "./latex-list-env-engine";
import {
  LATEX_ITEM_COMMAND_RE,
  END_LIST_ENV_RE,
  BEGIN_LIST_ENV_RE,
  LATEX_LIST_BOUNDARY_INLINE_RE,
  reSetCounter,
  BEGIN_LST_INLINE_RE,
  BEGIN_TABULAR_INLINE_RE,
  END_LST_INLINE_RE,
  END_TABULAR_INLINE_RE,
} from "../common/consts"

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
  const rootType: ListType = rootTypeRaw;
  const listStack: ListType[] = [rootType];
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
    const rest: string = src.slice(pos);
    // 2) If inside opaque → only look for END of the current opaque
    if (opaqueStack.length > 0) {
      const top: OpaqueEnvType = opaqueStack[opaqueStack.length - 1];
      const endRe: RegExp = top === "lstlisting" ? END_LST_INLINE_RE : END_TABULAR_INLINE_RE;
      endRe.lastIndex = 0;
      const me: RegExpExecArray = endRe.exec(rest);
      if (!me) {
        // continue scanning char-by-char until we find the end
        pos += 1;
        continue;
      }
      // Found opaque end, pop stack and jump after it
      pos += me.index + me[0].length;
      opaqueStack = opaqueStack.slice(0, -1);
      continue;
    }
    // 3) Nested begin list (must be exactly at pos)
    const mbList: RegExpMatchArray = rest.match(BEGIN_LIST_ENV_RE);
    if (mbList && mbList.index === 0) {
      const tRaw: string = (mbList[1] ?? "").trim();
      if (tRaw && isListType(tRaw)) {
        listStack.push(tRaw);
        pos += mbList[0].length;
        continue;
      }
    }
    // 4) End list (must be exactly at pos)
    const meList: RegExpMatchArray = rest.match(END_LIST_ENV_RE);
    if (meList && meList.index === 0) {
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
    BEGIN_LST_INLINE_RE.lastIndex = 0;
    BEGIN_TABULAR_INLINE_RE.lastIndex = 0;
    const mbLst: RegExpExecArray = BEGIN_LST_INLINE_RE.exec(rest);
    const mbTab: RegExpExecArray = BEGIN_TABULAR_INLINE_RE.exec(rest);
    const mbLst0: RegExpExecArray = mbLst && mbLst.index === 0 ? mbLst : null;
    const mbTab0: RegExpExecArray = mbTab && mbTab.index === 0 ? mbTab : null;
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
    return true;
  }
  // Parse raw env using block logic
  const parsed: ParseListEnvResult = parseListEnvRawToTokens(state.md, env.raw, state.env);
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
  if (!state.env.isBlock) {
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
    const listType: ListType = rawType;
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
  if (!state.env.isBlock) {
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
  if (!state.env.isBlock) {
    return false;
  }
  // Try to match \item[...] command right after '\'
  const itemMatch: RegExpMatchArray | null = state.src
    .slice(startPos)
    .match(LATEX_ITEM_COMMAND_RE);
  if (!itemMatch) {
    return false;
  }
  // Find where this item ends: next \item or begin/end list env
  const boundaryMatch: RegExpMatchArray | null = state.src
    .slice(startPos + itemMatch.index! + itemMatch[0].length)
    .match(LATEX_LIST_BOUNDARY_INLINE_RE);
  const content: string = boundaryMatch && boundaryMatch.index! > 0
    ? state.src.slice(startPos + itemMatch.index! + itemMatch[0].length, startPos + itemMatch.index! + itemMatch[0].length + boundaryMatch.index!)
    : state.src.slice(startPos + itemMatch.index! + itemMatch[0].length);
  if (!silent) {
    // Close previous <li> if needed
    closeOpenListItemIfNeeded(state);
    // Open new list item
    let token: any = state.push("latex_list_item_open", "li", 1);
    incrementItemCount();
    token.parentType = state.parentType;
    token.inlinePos = {
      start_content: startPos + itemMatch.index! + itemMatch[0].length,
    };
    // Skip leading spaces in content for accurate inline range
    token.inlinePos.start_content += getSpacesFromLeft(content);
    token.inlinePos.end_content = token.inlinePos.start_content + content.length;
    // Optional marker: \item[<marker>]
    if (itemMatch[1] !== undefined) {
      token.marker = itemMatch[1] ? itemMatch[1].trim() : "";
      const children: Token[] = [];
      const beforeOptions = {...state.md.options};
      if (state.md.options.forDocx) {
        state.md.options = {
          ...state.md.options,
          outMath: {
            include_svg: true,
            include_mathml_word: false,
          },
        };
      }
      state.md.inline.parse(itemMatch[1], state.md, state.env, children);
      state.md.options = beforeOptions;
      token.markerTokens = children;
    }
    // Inline content inside the list item
    token = state.push("inline", "", 0);
    token.content = content.trim();
    token.children = [];
  }
  // Advance parser position to after this item
  state.pos = startPos + itemMatch.index! + itemMatch[0].length + content.length;
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
  if (!state.env.isBlock) {
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
    const startNumber = parseSetCounterNumber(match);
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
