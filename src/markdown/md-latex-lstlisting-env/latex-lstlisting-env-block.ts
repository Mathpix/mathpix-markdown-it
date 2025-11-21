import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import type Token from 'markdown-it/lib/token';
import { applyLstListingOptionsToToken } from "./lstlisting-options";
import {
  BEGIN_LST_FAST_RE,
  END_LST_RE,
  BEGIN_LST_RE
} from "../common/consts";

/**
 * Try to read a whole lstlisting block starting at `startLine`.
 * Returns { opts, content, endLine } or null if not matched/closed.
 */
const readLstlistingBlock = (state: StateBlock, startLine: number) => {
  const start = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.eMarks[startLine];
  const firstLine = state.src.slice(start, max);

  if (!BEGIN_LST_FAST_RE.test(firstLine)) return null;

  const match = firstLine.match(BEGIN_LST_RE);
  if (!match) return null;

  const optsRaw = (match[1] || '').trim();

  // Collect lines until \end{lstlisting}
  const lines: string[] = [];
  let nextLine = startLine + 1;

  for (; nextLine < state.lineMax; nextLine++) {
    const s = state.bMarks[nextLine] + state.tShift[nextLine];
    const e = state.eMarks[nextLine];
    const line = state.src.slice(s, e);
    if (END_LST_RE.test(line)) {
      // stop BEFORE end-line; `nextLine` now points to end
      break;
    }
    // keep original slice (without trimming), preserve exact content
    lines.push(state.src.slice(state.bMarks[nextLine], state.eMarks[nextLine]));
  }

  if (nextLine >= state.lineMax) {
    // no closing \end{lstlisting}
    return null;
  }

  return {
    opts: optsRaw,
    content: lines.join('\n'),
    endLine: nextLine + 1, // move parser AFTER the end line
  };
}

/**
 * Block rule: parse LaTeX \begin{lstlisting}[...]\end{lstlisting} as a code block token.
 * - Supports optional [mathescape] in options: math is parsed into children (text + math tokens).
 */
export const latexLstlistingEnvBlockRule = (
  state: StateBlock,
  startLine: number,
  _endLine: number,
  silent: boolean
): boolean => {
  // don't start mid-paragraph
  if (state.tShift[startLine] < 0) return false;
  const res = readLstlistingBlock(state, startLine);
  if (!res) return false;

  if (silent) return true;

  const { opts, content, endLine } = res;

  const token: Token = state.push('latex_lstlisting_env', 'pre', 0);
  token.block = true;
  token.map = [startLine, endLine];
  token.markup = 'lstlisting';
  token.content = content;    // raw text
  token.info = opts;          // raw options

  if (opts) {
    applyLstListingOptionsToToken(token, content, opts, state);
  }

  state.line = endLine;
  return true;
};
