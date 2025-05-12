import {TAttrs, TMulti, TTokenTabular} from "./index";
import {addStyle, setColumnLines} from "./tabular-td";
import {getSubTabular} from "./sub-tabular";
import {getMathTableContent} from "./sub-math";
import {getContent, getColumnAlign, getColumnLines} from "./common";
import { reMultiRowWithVPos, reMultiRow } from "../../common/consts";

export const getMC = (cell: string): number => {
  cell = cell.trim();
  let match = cell
    .match(/(?:\\multicolumn\s{0,}\{([^}]*)\})/);
  if (match) {
    const mc: number = Number(match[1])
    return mc >= 1 ? mc-1 : 0;
  } else return 0;
};

export const getCurrentMC = (cells: string[], i: number): number => {
  let res: number = 0;
  for (let j = 0; j <= i; j++) {
    if (!cells[j]) {
      res += j > 0 ? 1 : 0;
      continue;
    }
    const cell = cells[j].trim();
    let match = cell
      .match(/(?:\\multicolumn\s{0,}\{([^}]*)\})/);
    if (match) {
      const mc: number = Number(match[1]);
      res += j > 0 ? mc : mc > 1 ? mc-1: 0;
    } else {
      res += j > 0 ? 1 : 0;
    }
  }
  return res;
};

export const getMultiColumnMultiRow = (str: string, params: {lLines: string, align: string, rLines: string}, forLatex = false, forPptx = false): TMulti | null => {
  let attrs: Array<TAttrs> = [];
  let mr: number = 0;
  let mc: number = 0;
  let vpos: string = '', nrows: string = '', width: string = '';

  str = str.trim();
  let matchMC: RegExpMatchArray = str
    .match(/(?:\\multicolumn\s{0,}\{([^}]*)\}\s{0,}\{([^}]*)\})/);
  if (matchMC) {
    str = str.slice(0, matchMC.index) + str.slice(matchMC.index + matchMC[0].length);
  }
  let matchMR: RegExpMatchArray = str
    .match(reMultiRowWithVPos);
  if (matchMR) {
    vpos = matchMR.groups?.vpos ? matchMR.groups.vpos : matchMR[1];
    nrows = matchMR.groups?.nrows ? matchMR.groups.nrows : matchMR[2];
    width = matchMR.groups?.width ? matchMR.groups.width : matchMR[3];
  } else {
    matchMR = str.match(reMultiRow);
    if (matchMR) {
      nrows = matchMR.groups?.nrows ? matchMR.groups.nrows : matchMR[1];
      width = matchMR.groups?.width ? matchMR.groups.width : matchMR[2];
    }
  }
  vpos = vpos ? vpos.trim() : '';

  if (matchMC) {
    mc = Number(matchMC[1]);
    const align = matchMC[2];
    const cLines: Array<string> = getColumnLines(align);
    const cAlign: Array<string> = getColumnAlign(align);
    const cLeft: string = cLines && cLines[0] ? cLines[0] : '';
    const cRight: string = cLines && cLines[1] ? cLines[1] : '';

    attrs.push(setColumnLines({
      h: cAlign ? cAlign[0] : '',
      v: vpos === 't' ? 'top' : vpos === 'b' ? 'bottom' : '',
    }, {left: cLeft,  right: cRight}));
    if (!forPptx || mc > 1) {
      attrs.push(['colspan', mc.toString()]);
    }
  }

  if (matchMR) {
    mr = Number(nrows);
    let w: string = width || '';
    if (!matchMC) {
      attrs.push(setColumnLines(
        {
          h: params.align ? params.align : '',
          v: vpos === 't' ? 'top' : vpos === 'b' ? 'bottom' : '',
        }, 
        {left: params.lLines,  right: params.rLines}))
    }
    if (mr > 0) {
      if (!forPptx || mr > 1) {
        attrs.push(['rowspan', mr.toString()]);
      }
    }

    w = w.trim().replace('*', 'auto');
    if (w && w.length > 0 ) {
      attrs = addStyle(attrs, `width: ${w}; `);
    }
    str = str.slice(0, matchMR.index) + str.slice(matchMR.index + matchMR[0].length);
  }

  if(!matchMC && !matchMR) {
    return null
  }
  let latex = '';
  if (matchMC) {
    latex += matchMC[0].trim()
  }
  if (matchMR) {
    latex += latex
      ? `{${matchMR[0].trim()}}`
      : matchMR[0].trim();
  }
  const parseMath: string = getMathTableContent(str, 0);
  let content: string = parseMath || getContent(str);
  const parseSub: Array<TTokenTabular>  = getSubTabular(content, 0, true, forLatex);
  if (parseSub) {
    return {mr: mr, mc: mc, attrs: attrs, content: '', subTable: parseSub, latex: latex}
  }
  return {mr: mr, mc: mc, attrs: attrs, content: content, subTable: null, latex: latex}
};
