import {TTokenTabular} from "./index";
import { generateUniqueId, getContent } from "./common";
import { BEGIN_LIST_ENV_INLINE_RE, doubleAngleBracketUuidPattern, singleAngleBracketPattern } from "../../common/consts";
import { findInDiagboxTable } from "./sub-cell";
import { getExtractedCodeBlockContent } from "./sub-code";

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

export const getSubTabular = (sub: string, i: number, isCell: boolean = true, forLatex = false): Array<TTokenTabular> | null => {
  let res: Array<TTokenTabular> = [];
  let contentFragments: string[] = [];
  let lastIndex: number = 0;
  sub = getExtractedCodeBlockContent(sub, 0);
  sub = sub.trim();
  if (isCell) {sub = getContent(sub)}

  const index: number = subTabular.findIndex(item => item.id === sub);
  if (index >= 0 && subTabular[index].parsed?.length) {
    res = res.concat(subTabular[index].parsed);
    return res;
  }

  let cellM =  sub.slice(i).match(doubleAngleBracketUuidPattern);
  cellM =  cellM ? cellM : sub.slice(i).match(singleAngleBracketPattern);
  if (!cellM) {
    return null;
  }
  let parents = null;
  for (let j=0; j < cellM.length; j++) {
    let t = cellM[j].replace(/</g, '').replace(/>/g, '');
    if (!t) { continue }
    const index = subTabular.findIndex(item => item.id === t);
    if (index >= 0) {
      parents = subTabular[index].parents;
      const iB: number = sub.indexOf(cellM[j]);
      let strB: string = '';
      if (iB > 0) {
        strB = sub.slice(0, iB);
      }
      if (!BEGIN_LIST_ENV_INLINE_RE.test(subTabular[index].content) || strB.trim() === '') {
        strB = strB.trim();
      }
      lastIndex = iB + cellM[j].length;

      sub = sub.slice(lastIndex)
      let strE: string = '';
      if (j === cellM.length - 1) {
         strE = sub;
      }
      const st = strB + subTabular[index].content + strE;
      contentFragments.push(st);
      if (forLatex) {
        res.push({
          token: 'inline',
          tag: '',
          n: 0,
          content: st,
          id: subTabular[index].id})
      } else {
        res.push({
          token: 'inline',
          tag: '',
          n: 0,
          content: st,
          id: subTabular[index].id,
          parents: subTabular[index].parents,
          type: 'subTabular'
        })
      }
    } else {
      let subContent = findInDiagboxTable(t);
      const iB: number = sub.indexOf(cellM[j]);
      const strB: string = sub.slice(0, iB).trim();
      lastIndex = iB + cellM[j].length;

      sub = sub.slice(lastIndex)
      let strE: string = '';
      if (j === cellM.length - 1) {
        strE = sub;
      }
      const st = strB + subContent + strE;
      if (subContent) {
        res.push({
          token: 'inline',
          tag: '',
          n: 0,
          content: st
        })
      }
      contentFragments.push(st);
    }
  }
  return [{
    token: 'inline',
    tag: '',
    n: 0,
    content: contentFragments.join(''),
    type: forLatex ? 'inline' : 'subTabular',
    parents,
    isSubTabular: true
  }]
};
