import {TTokenTabular} from "./index";
import { generateUniqueId, getContent } from "./common";
import { BEGIN_LIST_ENV_INLINE_RE, doubleAngleBracketUuidPattern, singleAngleBracketPattern } from "../../common/consts";
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
  parents?: Array<string>
};
var subTabular: Array<TSubTabular> = [];

export const ClearSubTableLists = (): void => {
  subTabular = [];
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
  const id = generateUniqueId();
  if (!subRes?.length) {
    let match =  subTabularContent.match(doubleAngleBracketUuidPattern);
    match =  match ? match : subTabularContent.match(singleAngleBracketPattern);
    if (match) {
      for (let j = 0; j < match.length; j++) {
        let idSubTable = match[j].replace(/</g, '').replace(/>/g, '');
        if (!idSubTable) { continue }
        const index = subTabular.findIndex(item => item.id === idSubTable);
        if (index < 0) {
          continue;
        }
        if (subTabular[index].parents) {
          subTabular[index].parents.push(id)
        } else {
          subTabular[index].parents = [id]
        }
      }
    }
  }
  subTabular.push({id: id, content: subTabularContent, parsed: subRes});
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
      isBlockRule = BEGIN_LIST_ENV_INLINE_RE.test(content) || BEGIN_LIST_ENV_INLINE_RE.test(prefix);
      if (!isBlockRule || prefix.trim() === "") {
        prefix = prefix.trim();
      }
    } else {
      isBlockRule = BEGIN_LIST_ENV_INLINE_RE.test(prefix);
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
