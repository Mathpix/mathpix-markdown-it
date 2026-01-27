import {TTokenTabular} from "./index";
import { generateUniqueId, getContent, detectLocalBlock } from "./common";
import { doubleAngleBracketUuidPattern, singleAngleBracketPattern, ANGLE_BRACKETS_RE } from "../../common/consts";
import { findInDiagboxTable } from "./sub-cell";
import { getExtractedCodeBlockContent } from "./sub-code";
import {
  wrapWithNewlinesIfInline,
  findPlaceholders,
  placeholderToId,
  getInlineContextAroundSpan
} from "./placeholder-utils";

type TSubTabular = {
  id: string,
  content: string,
  parsed?: Array<TTokenTabular>,
  parents?: Array<string>,
  isBlock?: boolean,
  children?: Array<string>
};
var subTabular: Array<TSubTabular> = [];

export const ClearSubTableLists = (): void => {
  subTabular = [];
};

/**
 * Extracts child placeholder IDs from a sub-tabular content string.
 * Returns a list of raw placeholder IDs without angle brackets.
 */
const extractChildIds = (content: string): string[] => {
  const placeholderMatches: string[] =
    content.match(doubleAngleBracketUuidPattern) ??
    content.match(singleAngleBracketPattern) ??
    [];
  return placeholderMatches
    .map(match => match.replace(ANGLE_BRACKETS_RE, ""))
    .filter(s => s.length > 0);
};

export const pushSubTabular = (
    str: string,
    subTabularContent: string,
    subRes: Array<TTokenTabular> = [],
    posBegin: number=0,
    posEnd: number,
    i: number=0,
    level=0
): string => {
  const id: string = generateUniqueId();
  const childIds: string[] = extractChildIds(subTabularContent);
  for (const childId of childIds) {
    const cIdx: number = subTabular.findIndex((item: TSubTabular) => item.id === childId);
    if (cIdx >= 0) {
      (subTabular[cIdx].parents ??= []).push(id);
    }
  }
  const isBlockLocal: boolean = detectLocalBlock(subTabularContent);
  const childBlock: boolean = childIds.some(cid => {
    const cIdx: number = subTabular.findIndex(item => item.id === cid);
    return cIdx >= 0 ? !!subTabular[cIdx].isBlock : false;
  });
  subTabular.push({
    id,
    content: subTabularContent,
    parsed: subRes,
    children: childIds,
    isBlock: isBlockLocal || childBlock,
  });
  if (posBegin > 0) {
    return str.slice(i, posBegin) + `<<${id}>>` + str.slice(posEnd + '\\end{tabular}'.length, str.length);
  }else {
    return `<<${id}>>` + str.slice(posEnd + '\\end{tabular}'.length, str.length);
  }
};

/**
 * Expands <...> / <<...>> placeholders inside a tabular cell by replacing them with cached
 * sub-tabular content (or diagbox fallback). If injected content contains a list begin
 * (or other block-ish LaTeX), it may be newline-wrapped to keep downstream block parsing stable.
 */
export const getSubTabular = (
  sub: string,
  i: number,
  isCell: boolean = true,
  forLatex: boolean = false
): Array<TTokenTabular> | null => {
  // first expand any extracted code-block placeholders (may add newlines)
  sub = getExtractedCodeBlockContent(sub, 0);
  sub = sub.trim();
  if (isCell) {
    sub = getContent(sub);
  }
  // fast path: exact id matches a cached parsed tabular
  const directIndex: number = subTabular.findIndex((item: TSubTabular) => item.id === sub);
  if (directIndex >= 0 && subTabular[directIndex].parsed?.length) {
    return subTabular[directIndex].parsed!;
  }
  // find placeholders
  const cellM: RegExpMatchArray = findPlaceholders(sub, i);
  if (!cellM) {
    return null;
  }
  let parents: any = null;
  let cursor: number = 0;
  let contentFragments: string[] = [];
  for (let j = 0; j < cellM.length; j++) {
    const placeholder: string = cellM[j];
    const id: string = placeholderToId(placeholder);
    if (!id) {
      continue;
    }
    const start: number = sub.indexOf(placeholder, cursor);
    if (start === -1) {
      continue;
    }
    const end: number = start + placeholder.length;
    // prefix text between placeholders
    let prefix: string = sub.slice(cursor, start);
    // Avoid trimming around list-begin tokens to keep `\begin{itemize}` detectable.
    const idx: number = subTabular.findIndex((item: TSubTabular) => item.id === id);
    let isBlockRule: boolean = false;
    if (idx >= 0) {
      const content = subTabular[idx].content;
      isBlockRule = !!subTabular[idx].isBlock || detectLocalBlock(prefix) || detectLocalBlock(content);
      if (!isBlockRule || prefix.trim() === "") {
        prefix = prefix.trim();
      }
    } else {
      isBlockRule = detectLocalBlock(prefix);
      if (!isBlockRule || prefix.trim() === "") {
        prefix = prefix.trim();
      }
    }
    let injected: string = "";
    if (idx >= 0) {
      parents = subTabular[idx].parents;
      injected = subTabular[idx].content ?? "";
    } else {
      injected = findInDiagboxTable(id) ?? "";
    }
    // decide wrapping using non-space neighbors around placeholder
    const { beforeNonSpace, afterNonSpace } = getInlineContextAroundSpan(sub, start, end);
    // If injected content starts a list env, wrap with newlines so block parsing stays stable
    if (isBlockRule) {
      injected = wrapWithNewlinesIfInline(injected, beforeNonSpace, afterNonSpace);
    }
    const st: string = prefix + injected;
    contentFragments.push(st);
    cursor = end;
  }
  if (cursor < sub.length) {
    contentFragments.push(sub.slice(cursor));
  }
  return [
    {
      token: 'inline',
      tag: '',
      n: 0,
      content: contentFragments.join(''),
      type: forLatex ? "inline" : "subTabular",
      parents,
      isSubTabular: true,
    },
  ];
};
