import {
  doubleAngleBracketUuidPattern,
  singleAngleBracketPattern,
  BLOCK_LATEX_RE
} from "../../common/consts";

export const isNewlineChar = (ch: string | null) => ch === "\n" || ch === "\r";

export const findPlaceholders = (s: string, from = 0): RegExpMatchArray | null => {
  let m: RegExpMatchArray | null = s.slice(from).match(doubleAngleBracketUuidPattern);
  if (!m) {
    m = s.slice(from).match(singleAngleBracketPattern);
  }
  return m;
};

export const placeholderToId = (placeholder: string): string =>
  placeholder.replace(/</g, "").replace(/>/g, "");

export const getPrevNonSpaceChar = (s: string, idx: number): string | null => {
  for (let k = idx; k >= 0; k--) {
    const ch: string = s[k];
    if (ch !== " " && ch !== "\t") {
      return ch;
    }
  }
  return null;
};

export const getNextNonSpaceChar = (s: string, idx: number): string | null => {
  for (let k = idx; k < s.length; k++) {
    const ch: string = s[k];
    if (ch !== " " && ch !== "\t") {
      return ch;
    }
  }
  return null;
};

/**
 * Returns non-whitespace neighbors around [start,end) span of a placeholder.
 * Useful to decide whether injected "block-ish" content must be surrounded by newlines.
 */
export const getInlineContextAroundSpan = (
  s: string,
  start: number,
  end: number
): { beforeNonSpace: string | null; afterNonSpace: string | null } => {
  const beforeNonSpace: string | null = getPrevNonSpaceChar(s, start - 1);
  const afterNonSpace: string | null = getNextNonSpaceChar(s, end);
  return { beforeNonSpace, afterNonSpace };
};

/**
 * Wraps injected content with leading/trailing '\n' if:
 *  - injected matches `blockRe`, AND
 *  - placeholder is embedded inline (neighbors are not newlines),
 *  - and injected isn't already newline-wrapped on that side.
 *
 * Note: `blockRe` might be BEGIN_LIST_ENV_INLINE_RE (strict) or BLOCK_LATEX_RE (broader).
 */
export const wrapWithNewlinesIfInline = (
  injected: string,
  beforeNonSpace: string | null,
  afterNonSpace: string | null
): string => {
  if (!injected) {
    return injected;
  }
  BLOCK_LATEX_RE.lastIndex = 0;
  if (!BLOCK_LATEX_RE.test(injected)) {
    return injected;
  }
  let out: string = injected;
  const needLeading: boolean = beforeNonSpace != null && !isNewlineChar(beforeNonSpace) && !out.startsWith("\n");
  const needTrailing: boolean = afterNonSpace != null && !isNewlineChar(afterNonSpace) && !out.endsWith("\n");
  if (needLeading) out = "\n" + out;
  if (needTrailing) out = out + "\n";
  return out;
};
