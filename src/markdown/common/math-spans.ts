import { findEndMarkerPos } from "../common";
import { beginTag, endTag, findOpenCloseTagsMathEnvironment } from "../utils";
import { mathEnvironments } from "./consts";

/**
 * Where math sits in a string. One scanner for every caller: the tabular path extracts math with it,
 * the list guard asks it whether an `\end{itemize}` is inside math rather than structure. Openers, end
 * markers and the `$` guards live here alone — a second copy is what makes the two disagree.
 *
 * Markers are mirrored, scope is not: the owning rules pair math inside one inline token, so a caller
 * reading raw source must bound the scan by paragraph.
 */

const MATH_ENV_NAMES: ReadonlySet<string> = new Set(mathEnvironments);

export const RE_MATH_OPEN = /\\\\\[|\\\[|\\\\\(|\\\(|\$\$|\$|\\begin\{([^}]*)\}|eqref\{([^}]*)\}|ref\{([^}]*)\}/;

// One `/g` instance per caller: `lastIndex` is state, and the two scans below can interleave.
export const RE_MATH_OPEN_G = new RegExp(RE_MATH_OPEN.source, 'g');
const RE_MATH_SPAN_G = new RegExp(RE_MATH_OPEN.source, 'g');

/**
 * End marker for a matched opening marker.
 * - string: marker to search for (e.g. "\\]", "$")
 * - null: self-closing match (eqref/ref) — content is the match itself
 * - undefined: `\begin{env}` — the caller resolves it by balanced tag search
 */
export const getEndMarker = (
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

/** Is this `$`/`$$` pair not math after all? Escaped either side, whitespace inside a `$` pair, or a
 *  digit right after the closer, which reads as a price rather than a formula. */
export const shouldSkipDollar = (
  str: string, marker: string, beginMarkerPos: number, endMarkerPos: number
): boolean => {
  const beforeEnd = str.charCodeAt(endMarkerPos - 1);
  if (beforeEnd === 0x5c ||
    (beginMarkerPos > 0 && str.charCodeAt(beginMarkerPos - 1) === 0x5c)) {
    return true;
  }
  // Single `$` only: a digit right after it reads as currency, `$5`. For `$$` the pair is unambiguous, so
  // `$$x$$5` stays math — and `endMarkerPos + 1` pointed at the second `$` there, never at a digit anyway.
  if (marker === "$") {
    const afterStart = str.charCodeAt(beginMarkerPos + 1);
    if (beforeEnd === 0x20 || beforeEnd === 0x09 || beforeEnd === 0x0a ||
      afterStart === 0x20 || afterStart === 0x09 || afterStart === 0x0a) {
      return true;
    }
    const suffix = str.charCodeAt(endMarkerPos + 1);
    if (suffix >= 0x30 && suffix < 0x3a) {
      return true;
    }
  }
  return false;
};

/**
 * First math span at or after `from`, or null. Same openers, end markers and `$` guards the extraction
 * uses, with nothing extracted and no state touched.
 */
export const nextMathSpan = (
  str: string,
  from: number,
  mathEnvsOnly = false,
  until: number = str.length,
): { start: number; end: number } | null => {
  RE_MATH_SPAN_G.lastIndex = from > 0 ? from : 0;
  let match: RegExpExecArray | null;
  while ((match = RE_MATH_SPAN_G.exec(str)) !== null) {
    // Past what the caller asked about: scanning on would walk the whole tail for every block.
    if (match.index >= until) {
      return null;
    }
    const beginMarkerPos: number = match.index;
    const startMathPos: number = beginMarkerPos + match[0].length;
    const envGroup: string | undefined = match[1];
    // Extraction takes any env and sorts them later; a reader that wants math only must not take `itemize`.
    if (mathEnvsOnly && envGroup && !MATH_ENV_NAMES.has(envGroup.trim())) {
      RE_MATH_SPAN_G.lastIndex = startMathPos;
      continue;
    }
    let endMarker: string | null | undefined = getEndMarker(match[0], envGroup, match[2], match[3]);
    let endMarkerPos = -1;
    if (endMarker === null) {
      endMarkerPos = startMathPos;
      endMarker = '';
    } else if (endMarker === undefined) {
      if (envGroup && envGroup !== 'abstract' && envGroup !== 'tabular') {
        const environment: string = envGroup.trim();
        const openTag: RegExp = beginTag(environment, true);
        const closeTag: RegExp = endTag(environment, true);
        if (closeTag && openTag) {
          const data = findOpenCloseTagsMathEnvironment(str.slice(beginMarkerPos), openTag, closeTag);
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
      RE_MATH_SPAN_G.lastIndex = startMathPos;
      continue;
    }
    if ((match[0] === "$" || match[0] === "$$")
      && shouldSkipDollar(str, match[0], beginMarkerPos, endMarkerPos)) {
      RE_MATH_SPAN_G.lastIndex = startMathPos;
      continue;
    }
    return { start: beginMarkerPos, end: endMarkerPos + endMarker.length };
  }
  return null;
};
