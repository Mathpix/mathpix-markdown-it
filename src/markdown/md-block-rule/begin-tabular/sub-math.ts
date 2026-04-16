import { generateUniqueId, getContent } from './common';
import {findEndMarkerPos} from "../../mdPluginRaw";
import { beginTag, endTag, findOpenCloseTagsMathEnvironment } from "../../utils";
import { addExtractedCodeBlock } from "./sub-code";
import {
  LATEX_BLOCK_ENV,
  doubleCurlyBracketUuidPattern,
  singleCurlyBracketPattern
} from "../../common/consts";

/** Regex to find math opening markers. Uses global flag for iterative scanning. */
const RE_MATH_OPEN = /\\\\\[|\\\[|\\\\\(|\\\(|\$\$|\$|\\begin\{([^}]*)\}|eqref\{([^}]*)\}|ref\{([^}]*)\}/g;

type TSubMath = {
  id: string,
  content: string
}
let mathTable: Map<string, string> = new Map();

export const ClearSubMathLists = (): void => {
  mathTable = new Map();
};

export const mathTablePush = (item: TSubMath) => {
  mathTable.set(item.id, item.content);
}

export const getMathTableContent = (sub: string, i: number): string => {
  let resContent: string = sub;
  sub = sub.trim();
  let cellM: Array<string> = sub.slice(i).match(doubleCurlyBracketUuidPattern);
  cellM = cellM ? cellM : sub.slice(i).match(singleCurlyBracketPattern);
  if (!cellM) {
    return '';
  }
  for (let j = 0; j < cellM.length; j++) {
    const content: string = cellM[j].replace(/\{/g, '').replace(/\}/g, '');
    const mathContent = mathTable.get(content);
    if (mathContent !== undefined) {
      const iB: number = resContent.indexOf(cellM[j]);
      if (iB >= 0) {
        resContent = resContent.slice(0, iB) + mathContent + resContent.slice(iB + cellM[j].length);
      }
    }
  }
  resContent = getContent(resContent);
  return resContent;
};

/** Determine the end marker string for a matched opening marker. */
const getEndMarker = (match: RegExpExecArray): string | undefined => {
  const m = match[0];
  if (m === "\\\\[") {
    return "\\\\]";
  }
  if (m === "\\[") {
    return "\\]";
  }
  if (m === "\\\\(") {
    return "\\\\)";
  }
  if (m === "\\(") {
    return "\\)";
  }
  if (m.includes("eqref") || m.includes("ref")) {
    return "";
  }
  if (m === "$$") {
    return "$$";
  }
  if (m === "$") {
    return "$";
  }
  return undefined;
};

/** Check if a $ or $$ match should be skipped (escaped, whitespace-padded, before digit). */
const shouldSkipDollar = (
  str: string, marker: string, beginMarkerPos: number, endMarkerPos: number
): boolean => {
  const beforeEnd = str.charCodeAt(endMarkerPos - 1);
  // Escaped marker: \$ or \$$
  if (beforeEnd === 0x5c /* \ */ ||
    (beginMarkerPos > 0 && str.charCodeAt(beginMarkerPos - 1) === 0x5c /* \ */)) {
    return true;
  }
  if (marker === "$") {
    const afterStart = str.charCodeAt(beginMarkerPos + 1);
    // Whitespace inside: $ x$ or $x $
    if (beforeEnd === 0x20 || beforeEnd === 0x09 || beforeEnd === 0x0a ||
      afterStart === 0x20 || afterStart === 0x09 || afterStart === 0x0a) {
      return true;
    }
  }
  // Digit after closing marker: $5, $10
  const suffix = str.charCodeAt(endMarkerPos + 1);
  if (suffix >= 0x30 && suffix < 0x3a) {
    return true;
  }
  return false;
};

/**
 * Extract math expressions from a string, replacing them with placeholders.
 * Iterative single-pass implementation: scans the original string once,
 * collects non-math segments and placeholders into an array, joins at the end.
 * Avoids O(N × M) string rebuilds from the recursive version.
 */
export const getSubMath = (str: string): string => {
  RE_MATH_OPEN.lastIndex = 0;
  const parts: string[] = [];
  let lastCopied = 0;
  let match: RegExpExecArray | null;
  while ((match = RE_MATH_OPEN.exec(str)) !== null) {
    const beginMarkerPos = match.index;
    const startMathPos = beginMarkerPos + match[0].length;
    // Determine end marker
    let endMarker = getEndMarker(match);
    let endMarkerPos = -1;
    // \begin{env} — find matching \end{env} via balanced tag search
    if (endMarker === undefined) {
      if (match[1] && match[1] !== 'abstract' && match[1] !== 'tabular') {
        const environment = match[1].trim();
        const openTag: RegExp = beginTag(environment, true);
        const closeTag: RegExp = endTag(environment, true);
        if (closeTag && openTag) {
          const data = findOpenCloseTagsMathEnvironment(
            str.slice(beginMarkerPos), openTag, closeTag
          );
          if (data?.arrClose?.length) {
            endMarkerPos = beginMarkerPos + data.arrClose[data.arrClose.length - 1]?.posStart;
          }
          endMarker = `\\end{${match[1]}}`;
        }
      }
      if (endMarker === undefined) {
        // Unrecognized \begin{abstract} or \begin{tabular} — skip
        continue;
      }
    }
    // Find end marker position
    if (endMarkerPos === -1) {
      endMarkerPos = findEndMarkerPos(str, endMarker, startMathPos);
    }
    if (endMarkerPos === -1) {
      // End marker not found — skip this opener, continue scanning
      RE_MATH_OPEN.lastIndex = startMathPos;
      continue;
    }
    // Dollar-sign specific validation
    if (match[0] === "$" || match[0] === "$$") {
      if (shouldSkipDollar(str, match[0], beginMarkerPos, endMarkerPos)) {
        RE_MATH_OPEN.lastIndex = startMathPos;
        continue;
      }
    }
    // Valid math expression found — extract and replace with placeholder
    const nextPos = endMarkerPos + endMarker.length;
    const content = str.slice(beginMarkerPos, nextPos);
    const id = generateUniqueId();
    const isCodeEnv: boolean = !!(match[1] && LATEX_BLOCK_ENV.has(match[1]));
    if (isCodeEnv) {
      addExtractedCodeBlock({ id, content });
    } else {
      mathTable.set(id, content);
    }
    const placeholder = isCodeEnv ? `<<${id}>>` : `{${id}}`;
    // Collect: text before this match + placeholder
    parts.push(str.slice(lastCopied, beginMarkerPos));
    parts.push(placeholder);
    lastCopied = nextPos;
    // Continue scanning after the replacement (placeholder is shorter than
    // the original content, but we scan the original string — set lastIndex
    // past the consumed region so we don't re-match inside it).
    RE_MATH_OPEN.lastIndex = nextPos;
  }
  // Fast path: no matches found — return original string unchanged
  if (parts.length === 0) {
    return str;
  }
  // Collect remaining text after the last match
  parts.push(str.slice(lastCopied));
  return parts.join('');
};
