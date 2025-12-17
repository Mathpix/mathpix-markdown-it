import type StateInline from 'markdown-it/lib/rules_inline/state_inline';
import type Token from 'markdown-it/lib/token';
import { applyLstListingOptionsToToken } from "./lstlisting-options";
import {
  BEGIN_LST_FAST_RE,
  BEGIN_LST_WITH_TRAIL_WS_NL_RE
} from "../common/consts";

/** Does the \end{...} start at the very beginning of its line (only spaces/tabs before)? */
const endStartsAtLineStart = (src: string, endPos: number): boolean => {
  const prevNL = src.lastIndexOf('\n', endPos - 1);
  const lineStart = prevNL === -1 ? 0 : prevNL + 1;
  for (let i = lineStart; i < endPos; i++) {
    const ch = src.charCodeAt(i);
    if (ch !== 0x20 /* space */ && ch !== 0x09 /* tab */) return false;
  }
  return true;
}

/** Normalize tail: remove exactly one trailing \n iff \end{...} is on a fresh line with no text to the left */
const normalizeContentByEndPosition = (raw: string, src: string, endPos: number): string => {
  let s: string = raw.replace(/\r\n?/g, '\n');
  return endStartsAtLineStart(src, endPos) && s.endsWith('\n') ? s.slice(0, -1) : s;
}

/** Find matching \end{lstlisting} (no cross-env nesting needed here) */
const findEndOfLstlisting = (src: string, from: number): number => {
  return src.indexOf('\\end{lstlisting}', from);
}

/** Parse \begin{lstlisting}[opts] at given pos; return { opts, after } or null */
const parseBeginLstlistingAt = (src: string, pos: number): { opts: string; after: number } | null => {
  const tail: string = src.slice(pos);
  if (!BEGIN_LST_FAST_RE.test(tail)) return null;
  const match: RegExpMatchArray = tail.match(BEGIN_LST_WITH_TRAIL_WS_NL_RE);
  if (!match) return null;
  const opts = (match[1] || '').trim();
  return { opts, after: pos + match[0].length };
}

/**
 * Inline rule: parse \begin{lstlisting}[...]\end{lstlisting} in inline stream.
 * - Emits 'latex_lstlisting_env' token (block=false), so renderer can output <pre><code>...</code></pre>.
 * - If [mathescape] present, children are math-only tokens (text + inline/display math),
 *   everything else stays plain text.
 */
export const latexLstlistingEnvInlineRule = (state: StateInline, silent: boolean): boolean => {
  const { src } = state;
  const pos = state.pos;
  // must start with '\' and literally '\begin{...}' here
  if (src.charCodeAt(pos) !== 0x5c /* \ */) return false;
  if (!src.startsWith('\\begin{', pos)) return false;
  const begin = parseBeginLstlistingAt(src, pos);
  if (!begin) return false;
  // find \end{lstlisting}
  const endBegin = begin.after;
  const endPos = findEndOfLstlisting(src, endBegin);
  if (endPos === -1) return false;
  const endTagLen = '\\end{lstlisting}'.length;
  const endTagEnd = endPos + endTagLen;
  if (!silent) {
    const raw = src.slice(endBegin, endPos);
    const content = normalizeContentByEndPosition(raw, src, endPos);
    const token: Token = state.push('latex_lstlisting_env', 'pre', 0);
    token.block = false;                // remain in the inline flow
    token.content = content;
    token.info = begin.opts; // raw options
    if (begin.opts) {
      applyLstListingOptionsToToken(token, content, begin.opts, state);
    }
  }
  state.pos = endTagEnd; // advance cursor past the end tag
  return true;
};
