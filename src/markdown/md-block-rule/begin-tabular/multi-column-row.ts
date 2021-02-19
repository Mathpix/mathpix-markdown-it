import {TAttrs, TMulti, TTokenTabular} from "./index";
import {addStyle, setColumnLines} from "./tabular-td";
import {getSubTabular} from "./sub-tabular";
import {getMathTableContent} from "./sub-math";
import {getContent, getColumnAlign, getColumnLines} from "./common";

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

export const getMultiColumnMultiRow = (str: string, params: {lLines: string, align: string, rLines: string}): TMulti | null => {
  let attrs: Array<TAttrs> = [];
  let content: string = '';
  let mr: number = 0;
  let mc: number = 0;

  str = str.trim();
  let matchMC: RegExpMatchArray = str
    .match(/(?:\\multicolumn\s{0,}\{([^}]*)\}\s{0,}\{([^}]*)\})/);
  if (matchMC) {
    mc = Number(matchMC[1]);
    const align = matchMC[2];
    const cLines: Array<string> = getColumnLines(align);
    const cAlign: Array<string> = getColumnAlign(align);
    const cLeft: string = cLines && cLines[0] ? cLines[0] : '';
    const cRight: string = cLines && cLines[1] ? cLines[1] : '';

    attrs.push(setColumnLines({h: cAlign ? cAlign[0] : ''}, {left: cLeft,  right: cRight}));
    attrs.push(['colspan', mc.toString()]);

    str = str.slice(0, matchMC.index) + str.slice(matchMC.index + matchMC[0].length);
  }

  let matchMR: RegExpMatchArray = str
    .match(/(?:\\multirow\s{0,}\{([^}]*)\}\s{0,}\{([^}]*)\})/);
  if (matchMR) {
    mr = Number(matchMR[1]);
    let w: string = matchMR[2] || '';
    if (!matchMC) {
      attrs.push(setColumnLines({h: params.align ? params.align : ''}, {left: params.lLines,  right: params.rLines}))
    }
    if (mr > 0) {
      attrs.push(['rowspan', mr.toString()]);
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
  const parseSub: Array<TTokenTabular>  = getSubTabular(str, 0);
  if (parseSub) {
    return {mr: mr, mc: mc, attrs: attrs, content: '', subTable: parseSub, latex: latex}
  }

  const parseMath: string = getMathTableContent(str, 0);

  if (parseMath && parseMath.length > 0) {
    content = parseMath;
  } else {
    content = getContent(str)
  }
  return {mr: mr, mc: mc, attrs: attrs, content: content, subTable: null, latex: latex}
};
