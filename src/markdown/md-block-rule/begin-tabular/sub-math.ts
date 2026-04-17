import { generateUniqueId, getContent } from './common';
import {findEndMarkerPos} from "../../mdPluginRaw";
import { beginTag, endTag, findOpenCloseTagsMathEnvironment } from "../../utils";
import { addExtractedCodeBlock } from "./sub-code";
import {
  LATEX_BLOCK_ENV,
  doubleCurlyBracketUuidPattern,
  singleCurlyBracketPattern
} from "../../common/consts";

const RE_MATH_OPEN = /\\\\\[|\\\[|\\\\\(|\\\(|\$\$|\$|\\begin\{([^}]*)\}|eqref\{([^}]*)\}|ref\{([^}]*)\}/;

let mathTable: Map<string, string> = new Map();

export const ClearSubMathLists = (): void => {
  mathTable.clear();
};

export const mathTablePush = (idOrItem: string | { id: string; content: string }, content?: string): void => {
  if (typeof idOrItem === 'string') {
    mathTable.set(idOrItem, content!);
  } else {
    mathTable.set(idOrItem.id, idOrItem.content);
  }
};

/** Replace UUID placeholders with original math content.
 *  Uses trimmed string for regex matching (consistent with getSubMath),
 *  but untrimmed sub for slicing to preserve original whitespace. */
export const getMathTableContent = (sub: string, i: number): string => {
  const tail = sub.trim().slice(i);
  let cellM: Array<string> = tail.match(doubleCurlyBracketUuidPattern);
  cellM = cellM ? cellM : tail.match(singleCurlyBracketPattern);
  if (!cellM) {
    return '';
  }
  const parts: string[] = [];
  let lastIdx = 0;
  for (let j = 0; j < cellM.length; j++) {
    const id: string = cellM[j].replace(/\{/g, '').replace(/\}/g, '');
    const mathContent = mathTable.get(id);
    if (mathContent !== undefined) {
      const iB: number = sub.indexOf(cellM[j], lastIdx);
      if (iB >= 0) {
        parts.push(sub.slice(lastIdx, iB));
        parts.push(mathContent);
        lastIdx = iB + cellM[j].length;
      }
    }
  }
  if (parts.length === 0) {
    return getContent(sub);
  }
  parts.push(sub.slice(lastIdx));
  return getContent(parts.join(''));
};

/**
 * Returns the end marker for a matched opening marker.
 * - string: end marker to search for (e.g. "\\]", "$")
 * - null: self-closing match (eqref/ref) — no end marker needed, content = match itself
 * - undefined: \begin{env} — caller must resolve via balanced tag search
 */
const getEndMarker = (
  matchStr: string, envGroup: string | undefined,
  eqrefGroup: string | undefined, refGroup: string | undefined,
): string | null | undefined => {
  if (matchStr === "\\\\[") return "\\\\]";
  if (matchStr === "\\[") return "\\]";
  if (matchStr === "\\\\(") return "\\\\)";
  if (matchStr === "\\(") return "\\)";
  if (eqrefGroup !== undefined || refGroup !== undefined) return null;
  if (matchStr === "$$") return "$$";
  if (matchStr === "$") return "$";
  return undefined;
};

const shouldSkipDollar = (
  str: string, marker: string, beginMarkerPos: number, endMarkerPos: number
): boolean => {
  const beforeEnd = str.charCodeAt(endMarkerPos - 1);
  if (beforeEnd === 0x5c ||
    (beginMarkerPos > 0 && str.charCodeAt(beginMarkerPos - 1) === 0x5c)) {
    return true;
  }
  if (marker === "$") {
    const afterStart = str.charCodeAt(beginMarkerPos + 1);
    if (beforeEnd === 0x20 || beforeEnd === 0x09 || beforeEnd === 0x0a ||
      afterStart === 0x20 || afterStart === 0x09 || afterStart === 0x0a) {
      return true;
    }
  }
  const suffix = str.charCodeAt(endMarkerPos + 1);
  if (suffix >= 0x30 && suffix < 0x3a) {
    return true;
  }
  return false;
};

/**
 * Extract math expressions from a string, replacing them with placeholders.
 * Iterative single-pass: scans the original string once with a local RegExp,
 * collects non-math segments and placeholders into an array, joins at the end.
 */
export const getSubMath = (str: string): string => {
  const re = new RegExp(RE_MATH_OPEN.source, 'g');
  const parts: string[] = [];
  let lastCopied = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(str)) !== null) {
    const beginMarkerPos = match.index;
    const startMathPos = beginMarkerPos + match[0].length;
    const envGroup = match[1];
    let endMarker = getEndMarker(match[0], envGroup, match[2], match[3]);
    let endMarkerPos = -1;
    if (endMarker === null) {
      endMarkerPos = startMathPos;
      endMarker = '';
    } else if (endMarker === undefined) {
      if (envGroup && envGroup !== 'abstract' && envGroup !== 'tabular') {
        const environment = envGroup.trim();
        const openTag: RegExp = beginTag(environment, true);
        const closeTag: RegExp = endTag(environment, true);
        if (closeTag && openTag) {
          const data = findOpenCloseTagsMathEnvironment(
            str.slice(beginMarkerPos), openTag, closeTag
          );
          const lastClose = data?.arrClose?.length ? data.arrClose[data.arrClose.length - 1] : null;
          if (lastClose && typeof lastClose.posStart === 'number') {
            endMarkerPos = beginMarkerPos + lastClose.posStart;
          }
          endMarker = `\\end{${envGroup}}`;
        }
      }
      if (endMarker === undefined) {
        continue;
      }
    }
    if (endMarkerPos === -1) {
      endMarkerPos = findEndMarkerPos(str, endMarker, startMathPos);
    }
    if (endMarkerPos === -1) {
      re.lastIndex = startMathPos;
      continue;
    }
    if (match[0] === "$" || match[0] === "$$") {
      if (shouldSkipDollar(str, match[0], beginMarkerPos, endMarkerPos)) {
        re.lastIndex = startMathPos;
        continue;
      }
    }
    const nextPos = endMarkerPos + endMarker.length;
    const content = str.slice(beginMarkerPos, nextPos);
    const id = generateUniqueId();
    const isCodeEnv: boolean = !!(envGroup && LATEX_BLOCK_ENV.has(envGroup));
    if (isCodeEnv) {
      addExtractedCodeBlock({ id, content });
    } else {
      mathTable.set(id, content);
    }
    const placeholder = isCodeEnv ? `<<${id}>>` : `{${id}}`;
    parts.push(str.slice(lastCopied, beginMarkerPos));
    parts.push(placeholder);
    lastCopied = nextPos;
    re.lastIndex = nextPos;
  }
  if (parts.length === 0) {
    return str;
  }
  parts.push(str.slice(lastCopied));
  return parts.join('');
};
