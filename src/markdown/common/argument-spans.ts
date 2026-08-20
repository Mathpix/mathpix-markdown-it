import { isInsideRanges } from "./verbatim-ranges";
import { isAsciiLetter, skipOptionalArg } from "../common";
import { LATEX_BRACE_ARG_COMMANDS } from "./consts";

// Where a command's argument begins and ends, for readers that must tell a written `\end{itemize}` from
// one that ends a list. Markdown is not LaTeX: braces stand in prose, unbalanced ones included, so only
// a group that follows a command name is an argument. Verbatim ranges — inline code, fences, math,
// `lstlisting` — are handed in by the caller and take precedence: a brace there is neither.

// Built from the supported names, so the sweep cannot drift from what the package parses.
const COMMAND_SWEEP_G: RegExp =
  new RegExp('\\\\(?:' + LATEX_BRACE_ARG_COMMANDS.join('|') + ')(?![a-zA-Z])', 'g');

/** Where each balanced `{` closes. One pass: asking per brace rescanned the tail, `n^1.9` on a run of
 *  unmatched `{`. A brace inside `verbatim`, or escaped, opens and closes nothing. */
export const braceMatches = (
  text: string,
  verbatim: Array<[number, number]>
): Map<number, number> => {
  const closeOf: Map<number, number> = new Map();
  const open: number[] = [];
  let range: number = 0;
  for (let i = 0; i < text.length; i++) {
    const chr: string = text[i];
    if (chr !== '{' && chr !== '}' && chr !== '\\') {
      continue;
    }
    // Before the escape check: a `\` ending a verbatim range must not escape past its end.
    while (range < verbatim.length && verbatim[range][1] <= i) {
      range++;
    }
    if (range < verbatim.length && i >= verbatim[range][0]) {
      i = verbatim[range][1] - 1;
      continue;
    }
    if (chr === '\\') {
      i++;
      continue;
    }
    if (chr === '{') {
      open.push(i);
      continue;
    }
    const from: number | undefined = open.pop();
    if (from !== undefined) {
      // Every pair, not depth 1 alone: a stray `{` above must not hide the pairs under it.
      closeOf.set(from, i);
    }
  }
  return closeOf;
};

/** Past a command name: a star, `[...]` options, a bare name as in `\renewcommand\qedsymbol{Q}`, and the
 *  spaces between when `skipSpace`. Options do not span lines, so a `]` on another line is text. */
const afterCommandOptions = (text: string, from: number, skipSpace: boolean = true): number => {
  let at: number = from;
  for (;;) {
    while (skipSpace && at < text.length && (text[at] === ' ' || text[at] === '\t')) {
      at++;
    }
    if (text[at] === '*') {
      at++;
      continue;
    }
    if (text[at] === '\\' && isAsciiLetter(text.charCodeAt(at + 1))) {
      at++;
      while (at < text.length && isAsciiLetter(text.charCodeAt(at))) {
        at++;
      }
      continue;
    }
    if (text[at] === '[') {
      // An option that does not close on this line is text, and the group after it is not an argument.
      const past: number = skipOptionalArg(text, at, true);
      if (past < 0) {
        return at;
      }
      at = past;
      continue;
    }
    return at;
  }
};

/** Outermost command-argument spans, ascending, `[openBrace, closeBrace]` **inclusive** — `isInsideRanges`
 *  is half-open, so the closing brace's own offset reads as outside. Harmless for the readers there are,
 *  which ask about a backslash, always strictly inside; a reader asking about that brace needs `close + 1`.
 *  Read forward from the commands: a group with no command before it — `opens {` … `closes }` — is not one. */
export const commandArgumentSpans = (
  text: string,
  verbatim: Array<[number, number]>
): Array<[number, number]> => {
  const closeOf: Map<number, number> = braceMatches(text, verbatim);
  const spans: Array<[number, number]> = [];
  COMMAND_SWEEP_G.lastIndex = 0;
  let command: RegExpExecArray | null;
  while ((command = COMMAND_SWEEP_G.exec(text)) !== null) {
    // A command written in code or math is text, and so are the braces after it.
    if (isInsideRanges(verbatim, command.index)) {
      continue;
    }
    let at: number = afterCommandOptions(text, command.index + command[0].length);
    // `\renewcommand{\x}{y}`: a further group counts only with no space before it. Skipping space took
    // `\textbf{x} {prose}` as two arguments, hiding a closer written in that prose.
    while (text[at] === '{') {
      const close: number | undefined = closeOf.get(at);
      if (close === undefined) {
        break;                      // an argument left open marks nothing
      }
      spans.push([at, close]);
      at = afterCommandOptions(text, close + 1, false);
    }
  }
  // Keep the outermost; ascending, so a search over them stays a binary one.
  spans.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  const outer: Array<[number, number]> = [];
  let reach = -1;
  for (const span of spans) {
    if (span[1] > reach) {
      outer.push(span);
      reach = span[1];
    }
  }
  return outer;
};
