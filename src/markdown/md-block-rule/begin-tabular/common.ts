import {separateByColumns} from "./parse-tabular";

export type TParselines = {cLines: Array<Array<string>>, cSpaces: Array<Array<string>>, sLines: Array<string>}
const lineSpaceTag: RegExp = /\[(.*?)\]\s{0,}\\hline|\[(.*?)\]\s{0,}\\hhline|\[(.*?)\]\s{0,}\\hdashline|\[(.*?)\]\s{0,}\\cline\s{0,}\{([^}]*)\}|\\hline|\\hhline|\\hdashline|\\cline\s{0,}\{([^}]*)\}|^\[(.*?)\]/g;

export const getContent = (content: string, onlyOne: boolean = false): string => {
  if(!content) { return content}
  content = content.trim();
  if (content[0] === '{' && content[content.length-1] === '}') {
    content  =  content.slice(1, content.length-1);
    if (!onlyOne) {content = getContent(content);}
  }
  return content;
};


export const getColumnLines = (str: string, numCol: number = 0): Array<string> => {
  str = str
    .replace(/\{(.*?)\}/g, '')
    .replace(/[^clrSmpb|:]/g, '').split('').join('');
  let res: Array<string> = [];
  const cLines: Array<string> = str
    .replace(/l/g, ';')
    .replace(/r/g, ';')
    .replace(/c/g, ';')
    .replace(/S/g, ';')
    .replace(/m/g, ';')
    .replace(/p/g, ';')
    .replace(/b/g, ';')
    .split(';');

  numCol = Math.max(numCol, cLines.length);
  if (numCol > 0) {
    res = new Array(numCol).fill('none');
    for (let i = 0; i < cLines.length - 1; i++) {
      if (cLines[i].length === 0) {
        continue;
      }
      if (cLines[i].length > 1) {
        res[i] = 'double';
        continue;
      }
      res[i] = ((cLines[i].replace(/[^|: ]/g, 'none').replace(/:/g, 'dashed')
        .replace(/\|/g, 'solid')).trim());
    }

    if (cLines[cLines.length - 1].length > 1) {
      res[numCol-1] = 'double';
    } else {
      res[numCol-1] = ((cLines[cLines.length - 1].replace(/[^|: ]/g, 'none').replace(/:/g, 'dashed')
        .replace(/\|/g, 'solid')).trim())
    }
    return res;
  }


  for (let i = 0; i < cLines.length; i++) {
    if (cLines[i].length === 0) {
      res.push('none');
      continue;
    }

    if (cLines[i].length > 1) {
      res.push('double');
      continue;
    }

    res.push((cLines[i].replace(/[^|: ]/g, 'none').replace(/:/g, 'dashed')
      .replace(/\|/g, 'solid')).trim())

  }
  return res;
};

export const getColumnAlign = (align: string): string[]|[] => {
  align = align.replace(/[^clrS|:]/g, '').split('').join('');
  align = align.replace(/[^clrS]/g, '').split('').join(' ');
  align = align
    .replace(/l/g, 'left')
    .replace(/r/g, 'right')
    .replace(/c/g, 'center')
    .replace(/S/g, 'decimal');
  return align ? align.split(' ') : [];
};

export type TAlignData = {
  cAlign: Array<string>,
  vAlign: Array<string>,
  cWidth: Array<string>
}

const arrayFillDef = (arr: Array<string>, str: string, num: number): Array<string> => {
  if (arr.length < num) {
    return arr.concat(new Array(num - arr.length).fill(str))
  } else {
    return arr;
  }
};

export const getVerticallyColumnAlign = (align: string, numCol: number): TAlignData => {
  const aH = ['c', 'S', 'r', 'l'];
  const aV = ['m', 'p', 'b'];
  let hAlign: Array<string> = [];
  let vAlign: Array<string> = [];
  let cWidth: Array<string> = [];
  align = align.replace(/ /g, '').trim();

  for (let j = 0; j < align.length; j++) {
    if (aH.indexOf(align[j]) >= 0) {
      switch (align[j]) {
        case 'c':
          hAlign.push('center');
          vAlign.push('middle');
          cWidth.push('auto');
          break;
        case 'S':
          hAlign.push('decimal');
          vAlign.push('middle');
          cWidth.push('auto');
          break;
        case 'r':
          hAlign.push('right');
          vAlign.push('middle');
          cWidth.push('auto');
          break;
        case 'l':
          hAlign.push('left');
          vAlign.push('middle');
          cWidth.push('auto');
          break;
      }
    }
    if (aV.indexOf(align[j]) >= 0) {
      switch (align[j]) {
        case 'm':
          hAlign.push('center');
          vAlign.push('middle');
          break;
        case 'p':
          hAlign.push('left');
          vAlign.push('top');
          break;
        case 'b':
          hAlign.push('center');
          vAlign.push('bottom');
          break;
      }
      if (align[j + 1] === '{') {
        let end = align.indexOf('}', j + 1);
        const w = align.slice(j + 2, end);
        cWidth.push(w);
        j += w.length + 2;
      }
    }
  }
  hAlign = arrayFillDef(hAlign, 'center', numCol);
  vAlign = arrayFillDef(vAlign, 'middle', numCol);
  cWidth = arrayFillDef(cWidth, 'auto', numCol);

  return { cAlign: hAlign, vAlign: vAlign, cWidth: cWidth}
};

export const getParams = (str: string, i: number) => {
  const index = str.indexOf('{', i);
  let res: string = '';
  let ires: number = 0;
  if (index < 0) { return null}
  let iOpen = 1;
  for (let j = index + 1; j < str.length; j++) {
    ires = j;
    if (str[j] === '{') {
      iOpen++;
      res += str[j];
      continue
    }
    if (str[j] === '}') {
      iOpen--;
      if (iOpen === 0) {
        ires +=1;
        break
      }
    }
    res += str[j];
  }
  return {align: res, index: ires};
};

export type TDecimal = {l: number, r: number}
export const getDecimal = (cAlign: Array<string>, cellsAll: Array<string>): Array<TDecimal> => {
  const decimal: Array<TDecimal> = [];
  cAlign.map((item, index)=>{
    if(item === 'decimal') {
      decimal[index] = {l: 0, r: 0}
    }});
  cellsAll.map ((item, i) => {
    let cells = separateByColumns(cellsAll[i]);
    cells.map((cell, j) => {
      if (decimal[j]) {
        let content = getContent(cell);
        if (parseFloat(content)) {
          const arr = content.split('.');
          if (arr[0] && decimal[j].l < arr[0].length) {
            decimal[j].l = arr[0].length;
          }
          if (arr[1] && decimal[j].r < arr[1].length) {
            decimal[j].r = arr[1].length;
          }
        }
      }
    })
  });
  return decimal
};

export const getCellsAll = (rows: string[]): string[]  => {
  let cellsAll: string[] = [];
  for (let i = 0; i < rows.length; i++) {
    cellsAll[i] = rows[i].trim().replace(lineSpaceTag, '').trim();
  }
  return cellsAll;
};

export const getRowLines = (rows: string[], numCol: number): TParselines => {
  const res: Array<Array<string>> = [];
  const resSpace: Array<Array<string>> = [];
  const clineTag: RegExp = /\\cline\s{0,}\{([^}]*)\}/;
  const clineSpaceTag: RegExp = /\[(.*?)\]\s{0,}\\cline\s{0,}\{([^}]*)\}/;
  const sLines = [];
  for (let i = 0; i < rows.length; i++) {
    let matchR = rows[i].split('\n').join('').trim().match(lineSpaceTag);
    if (!matchR) {
      res[i] = new Array(numCol).fill('none');
      resSpace[i] = new Array(numCol).fill('none');
      sLines.push('');
      continue;
    }
    sLines.push(matchR.join(''));
    let str = matchR.join(' ');
    if (!clineTag.test(str)) {
      let mS = str.match(/\[(.*?)\]/);
      if (mS && mS[1]) {
        resSpace[i] = new Array(numCol).fill(mS[1]);
        str = str.replace(/\[(.*?)\]/g,'');
      } else {
        resSpace[i] = new Array(numCol).fill('none');
      }
      str = str.replace('\\n', '').replace(/\\/g, '');
      res[i] = new Array(numCol).fill(str);
      continue;
    }

    res[i] = new Array(numCol).fill('none');
    resSpace[i] = new Array(numCol).fill('none');
    for (let j=0; j< matchR.length; j++) {
      let matchCS = matchR[j].match(clineSpaceTag);
      if (matchCS) {
        if (matchCS[2]) {
          let ic = matchCS[2].trim().replace(/[^\d-]/g, '').split('-');
          ic[0] = (Number(ic[0]) > 0 ? Number(ic[0])-1 : 0).toString();
          let d = Number(ic[1]) - Number(ic[0]);
          if (d > 0) {
            res[i] = res[i].fill('hline', Number(ic[0]), Number(ic[1]));
            if (matchCS[1]) {
              resSpace[i] = resSpace[i].fill(matchCS[1], Number(ic[0]), Number(ic[1]));
            }
          }
        }
      } else {
        let matchC = matchR[j].match(clineTag);
        if (matchC && matchC[1]) {
          let ic = matchC[1].trim().replace(/[^\d-]/g, '').split('-');
          ic[0] = (Number(ic[0]) > 0 ? Number(ic[0])-1 : 0).toString();
          let d = Number(ic[1]) - Number(ic[0]);
          if (d > 0) {
            res[i] = res[i].fill('hline', Number(ic[0]), Number(ic[1]))
          }
        }
      }
    }
  }
  if (rows.length === res.length) {
    res[res.length] = new Array(numCol).fill('none');
  }
  resSpace[resSpace.length] = new Array(numCol).fill('none');
  return {cLines: res, cSpaces: resSpace, sLines: sLines};
};
