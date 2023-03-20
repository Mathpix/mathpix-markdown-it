import {TTokenTabular} from "./index";
import {getContent} from "./common";

type TSubTabular = {id: string, parsed: Array<TTokenTabular>|string, parents?: Array<string>};
var subTabular: Array<TSubTabular> = [];

export const ClearSubTableLists = (): void => {
  subTabular = [];
};

export const pushSubTabular = (str: string, subRes: Array<TTokenTabular> | string, posBegin: number=0, posEnd: number, i: number=0, level=0): string => {
  const id = `f${(+new Date +  (Math.random()*100000).toFixed()).toString()}`;
  if (typeof subRes === 'string') {
    let match =  subRes.match(/(?:<<([\w]*)>>)/g);
    match =  match ? match : subRes.match(/(?:<([\w]*)>)/g);
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
  subTabular.push({id: id, parsed: subRes});
  if (posBegin > 0) {
    return str.slice(i, posBegin) + `<<${id}>>` + str.slice(posEnd + '\\end{tabular}'.length, str.length);
  }else {
    return `<<${id}>>` + str.slice(posEnd + '\\end{tabular}'.length, str.length);
  }
};

export const getSubTabular = (sub: string, i: number, isCell: boolean = true, forLatex = false): Array<TTokenTabular> | null => {
  let res: Array<TTokenTabular>| any = [];
  let lastIndex: number = 0;
  sub = sub.trim();
  if (isCell) {sub = getContent(sub, true)}

  const index: number = subTabular.findIndex(item => item.id === sub);
  if (index >= 0) {
    res = res.concat(subTabular[index].parsed);
    return res;
  }

  let cellM =  sub.slice(i).match(/(?:<<([\w]*)>>)/g);
  cellM =  cellM ? cellM : sub.slice(i).match(/(?:<([\w]*)>)/g);
  if (!cellM) {
    return null;
  }

  for (let j=0; j < cellM.length; j++) {
    let t = cellM[j].replace(/</g, '').replace(/>/g, '');
    if (!t) { continue }
    const index = subTabular.findIndex(item => item.id === t);
    if (index >= 0) {
      const iB: number = sub.indexOf(cellM[j]);
      const strB: string = sub.slice(0, iB).trim();
      lastIndex = iB + cellM[j].length;

      sub = sub.slice(lastIndex)
      let strE: string = '';
      if (j === cellM.length - 1) {
         strE = sub;
      }
      const st = strB + subTabular[index].parsed + strE;
      if (forLatex) {
        res.push({token: 'inline', tag: '', n: 0, content: st,  id: subTabular[index].id})
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
    }
  }
  return res;
};
