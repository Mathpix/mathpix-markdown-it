import { TTokenTabular } from "./index";
import {
  addHLineIntoStyle, AddTd, AddTdSubTable,
  getSharedTableOpenAttrs, getSharedTbodyOpenAttrs, getSharedTrOpenAttrs,
  SHARED_TD_CLOSE, SHARED_TR_CLOSE, SHARED_TABLE_CLOSE, SHARED_TBODY_CLOSE,
} from "./tabular-td";
import {
  getContent, getRowLines, getCellsAll, getDecimal, TDecimal,
  TAlignData, getVerticallyColumnAlign, getParams, getColumnLines, shouldRewriteColSpec,
  detectLocalBlock, normalizeDefaultCellVerticalAlign, bracketToVAlign, TVerticalPos, TTdMeta
} from './common';
import { getMathTableContent, getSubMath } from './sub-math';
import { getSubTabular, pushSubTabular, getSubTabularBracket } from './sub-tabular';
import { getMultiColumnMultiRow, getCurrentMC, getMC } from './multi-column-row';
import { getSubDiagbox } from "./sub-cell";
import { isEscapedAt } from "../../utils";
import { BEGIN_TABULAR_BRACKET_RE, doubleAngleBracketUuidPattern } from "../../common/consts";

// Column spec letters that carry explicit vertical alignment.
const EXPLICIT_V_COL_SPEC = 'mpb';
// Shared td_open meta per bracket; frozen — AddTd/AddTdSubTable assign directly.
const TD_META_BY_BRACKET: Record<TVerticalPos, TTdMeta> = {
  t: Object.freeze({parentBracket: 't'}) as TTdMeta,
  c: Object.freeze({parentBracket: 'c'}) as TTdMeta,
  b: Object.freeze({parentBracket: 'b'}) as TTdMeta,
};

/**
 * Splits a tabular row into columns by unescaped '&' characters.
 * Escaped '\&' is treated as a literal '&' and does not split columns.
 */
export const separateByColumns = (str: string): string[] => {
  // Fast path: no column separators at all
  if (str.indexOf('&') === -1) {
    return [str];
  }
  const columns: string[] = [];
  let index: number = 0;

  for (let i = 0; i < str.length; i++) {
    let pos: number = str.indexOf('&', i);
    // No more separators found
    if (pos === -1) {
      break;
    }
    // Skip escaped '&' (e.g. '\&')
    if (isEscapedAt(str, pos)) {
      i = pos;
      continue;
    }
    // Unescaped '&' splits the column
    columns.push(str.slice(index, pos));
    index = pos + 1;
    i = pos;
  }
  // Always push the remaining tail (may be empty if string ends with '&')
  columns.push(str.slice(index));
  return columns;
};

const getNumCol = (cells: string[]): number => {
  let res: number = 0;
  for (let i = 0; i < cells.length; i++) {
    const columns = separateByColumns(cells[i]);
    let col: number = columns.length;
    for(let j=0; j < columns.length; j++) {
      col += getMC(columns[j])
    }
    res = col > res ? col : res;
  }
  return res;
};

const getRows = (str: string): string[] => {
  str = getSubMath(str);
  str = getSubDiagbox(str);
  return str.split('\\\\');
};

/**
 * Marks a table column as requiring fixed width if the cell content
 * contains an inline list environment.
 */
const markColIfHasList = (
  colsToFixWidth: Set<number>,
  colIndex: number,
  content?: string
): void => {
  if (!content) {
    return;
  }
  if (!detectLocalBlock(content)) {
    return;
  }
  colsToFixWidth.add(colIndex);
};

const setTokensTabular = (str: string, align: string = '', options: any = {}, isSubTabular: boolean = false, bracket?: TVerticalPos): Array<TTokenTabular>|null => {
  let res: Array<TTokenTabular> = [];
  const rows: string[] = getRows(str);

  let cellsAll: string[] = getCellsAll(rows);
  const numCol: number = getNumCol(cellsAll);
  let data = getRowLines(rows, numCol);
  let CellsHLines: Array<Array<string>> = data.cLines;
  let CellsHLSpaces: Array<Array<string>> = data.cSpaces;
  const colsToFixWidth: Set<number> = new Set();

  const optionBracket: TVerticalPos | undefined = normalizeDefaultCellVerticalAlign(options?.defaultCellVerticalAlign);
  // For HTML rendering: source bracket OR option (incl. 'c').
  const effectiveBracket: TVerticalPos | undefined = bracket ?? optionBracket;
  const dataAlign: TAlignData = getVerticallyColumnAlign(align, numCol, effectiveBracket);
  const cLines: Array<string> = getColumnLines(align, numCol);
  const {cAlign, vAlign, cWidth, colSpec} = dataAlign;
  const decimal: Array<TDecimal> = getDecimal(cAlign, cellsAll);
  const { forLatex = false, outMath = {} } = options;
  const skipVisual = !!options?.forMD || !!forLatex;

  // For forLatex round-trip: source bracket OR option ('t'/'b' only — 'c' skipped to preserve round-trip).
  const latexBracket: TVerticalPos | undefined = bracket ?? (optionBracket === 'c' ? undefined : optionBracket);
  // Parent bracket attached to every td_open under forLatex.
  const tdMeta: TTdMeta | undefined = forLatex && latexBracket ? TD_META_BY_BRACKET[latexBracket] : undefined;

  res.push({token:'table_open', type:'table_open', tag: 'table', n: 1,
    attrs: getSharedTableOpenAttrs(undefined, skipVisual),
    latex: forLatex
      ? align
      : outMath.include_table_markdown
        ? cAlign.join('|')
        : ''
  });
  const tableOpen: TTokenTabular = res[0];
  if (options?.forPptx) {
    res.push({token:'tbody_open', type:'tbody_open', tag: 'tbody', n: 1, attrs: getSharedTbodyOpenAttrs(numCol)});
  } else {
    res.push({token:'tbody_open', type:'tbody_open', tag: 'tbody', n: 1});
  }

  let MR: Array<number> = new Array(numCol).fill(0);
  for (let i = 0; i < rows.length; i++) {
    if (!cellsAll[i] || cellsAll[i].length === 0) {
      if (i < cellsAll.length-1) {
        res.push({token:'tr_open', type:'tr_open', tag: 'tr', n: 1,
          attrs: getSharedTrOpenAttrs(skipVisual),
          latex: forLatex && data && data.sLines && data.sLines.length > i ? data.sLines[i] : ''
        });
        for (let k = 0; k < numCol; k++) {
          if (options?.forPptx && MR[k] && MR[k] > 0) {
            MR[k] = MR[k] > 0 ? MR[k] - 1 : 0;
            continue;
          }
          let cRight = k === numCol-1 ?  cLines[cLines.length-1] :cLines[k+1];
          let cLeft = k === 0 ? cLines[0] : '';
          const data = AddTd('', {h: cAlign[k], v: vAlign[k], w: cWidth[k]},
            {left: cLeft, right: cRight, bottom: CellsHLines[i+1] ? CellsHLines[i+1][k] : 'none',
              top: i === 0 ? CellsHLines[i] ? CellsHLines[i][k] : 'none' : ''},
            CellsHLSpaces[i+1][k], null, skipVisual, tdMeta
          );
          markColIfHasList(colsToFixWidth, k, data.content);
          for (const t of data.res) {
            res.push(t);
          }
        }
        res.push(SHARED_TR_CLOSE);
      }
      continue;
    }
    res.push({token:'tr_open', type:'tr_open', tag: 'tr', n: 1,
      attrs: getSharedTrOpenAttrs(skipVisual),
      latex: forLatex && data && data.sLines && data.sLines.length > i ? data.sLines[i] : ''
    });

    let cells = separateByColumns(cellsAll[i]);
    for (let j = 0; j < numCol; j++) {
      let ic: number = getCurrentMC(cells, j);
      if (ic >= numCol) {
        break;
      }
      if (j >= (cells.length) && ic < numCol) {
        for (let k = ic; k < numCol; k++) {
          if (MR[k] && MR[k] > 0) {
            MR[k] = MR[k] > 0 ? MR[k] - 1 : 0;
            continue
          }
          let cRight = k === numCol-1 ?  cLines[cLines.length-1] :cLines[k+1];
          let cLeft = k === 0 ? cLines[0] : '';
          const data = AddTd('', {h: cAlign[k], v: vAlign[k], w: cWidth[k]},
            {left: cLeft, right: cRight, bottom: CellsHLines[i+1] ? CellsHLines[i+1][k] : 'none',
              top: i === 0 ? CellsHLines[i] ? CellsHLines[i][k] : 'none' : ''},
            CellsHLSpaces[i+1][k], null, skipVisual, tdMeta
          );
          markColIfHasList(colsToFixWidth, k, data.content);
          for (const t of data.res) {
            res.push(t);
          }
        }
        break;
      }

      let cRight = ic === numCol-1 ?  cLines[cLines.length-1] :cLines[ic+1];
      let cLeft = ic === 0 ? cLines[0] : '';


      if (cells[j] && cells[j].trim().length > 0) {
        // Multicol inherits only non-default brackets (option 'middle' stays no-op).
        const multi = getMultiColumnMultiRow(cells[j], {lLines: cLines[ic], align: cAlign[ic], rLines: cRight, bracketDefault: latexBracket}, forLatex, options?.forPptx, skipVisual);
        if (multi) {
          let mr = multi.mr > rows.length ? rows.length : multi.mr;
          let mc = multi.mc > numCol ? numCol : multi.mc;

          if (mc && mc > 1) {
            let d = ic - mc + 1;
            if (MR[d] && MR[d] > 0) {
              let maxK = mc;
              for (let k = 0; k < maxK; k++) {
                MR[d+k] = MR[d+k] > 0 ? MR[d+k] - 1 : 0;
                if (MR[d+k] > 0) {
                  mc -= 1;
                }
              }
              if (mc < 1) {
                if (forLatex && multi.latex) {
                  res.push({token:'td_skip', type:'td_skip', tag: 'td', n: -1,
                    latex: multi.latex});
                }
                continue
              }
            } else {
              MR[ic] = MR[ic] > 0 ? MR[ic] - 1 : 0;
            }

          } else {
            MR[ic] = MR[ic] > 0 ? MR[ic] - 1 : 0;
            if (MR[ic] && MR[ic] > 0) {
              if (forLatex) {
                res.push({token:'td_skip', type:'td_skip', tag: 'td', n: -1,
                  latex: multi && multi.latex ? multi.latex : ''});
              }
              continue
            }
          }

          MR[ic] = MR[ic] > 0 ? MR[ic] - 1 : 0;

          if (mr && mr > 0) {
            if (mc && mc > 1) {
              let d = ic - mc + 1;
              for (let k = 0; k < mc; k++) {
                MR[ d+k ] = mr;
              }
            } else {
              MR[ic] = mr;
            }

            if (mr+i >= rows.length-1 && !skipVisual) {
              multi.attrs = addHLineIntoStyle(multi.attrs, CellsHLines[mr+i] ? CellsHLines[mr+i][ic] : 'none');
            }

          } else {
            if (mc && mc > 1) {
              let d = ic - mc + 1;
              for (let k = 0; k < mc; k++) {
                MR[d+k] = MR[d+k] > 0 ? MR[d+k] - 1 : 0;
              }
              ic = d
            } else {
              MR[ic] = MR[ic] > 0 ? MR[ic] - 1 : 0;
            }

            if (MR[ic] && MR[ic] > 0) {
              if (forLatex) {
                res.push({token:'td_skip', type:'td_skip', tag: 'td', n: -1,
                  latex: multi && multi.latex ? multi.latex : ''});
              }
              continue
            }

          }


          if (!skipVisual) {
            if (i === 0){
              multi.attrs = addHLineIntoStyle(multi.attrs, CellsHLines[i] ? CellsHLines[i][ic] : 'none', 'top');
            }
            if (mr && mr > 0) {
              multi.attrs = addHLineIntoStyle(multi.attrs, CellsHLines[mr+i] ? CellsHLines[mr+i][ic] : 'none');
            } else {
              multi.attrs = addHLineIntoStyle(multi.attrs, CellsHLines[i+1] ? CellsHLines[i+1][ic] : 'none');
            }
          }

          const tdOpen: TTokenTabular = {
            token:'td_open',
            type:'td_open',
            tag: 'td',
            n: 1,
            attrs: multi.attrs,
            latex: forLatex && multi && multi.latex ? multi.latex : ''
          }
          res.push(tdOpen);
          if (forLatex) {
            tdOpen.meta = {
              ...tdMeta,
              multi: multi.multi,
              colCount: numCol,
              colSpecs: colSpec,
              currentColIndex: ic,
              isSubTabular,
            }
          }
          if (multi.subTable) {
            if (multi.subTable.some((item: TTokenTabular) => detectLocalBlock(item.content))) {
              colsToFixWidth.add(ic);
              if (forLatex) {
                tdOpen.meta.forceMultiFixedWidth = true;
              }
            }
            for (const t of multi.subTable) {
              res.push(t);
            }
          } else {
            if (multi.content) {
              if (detectLocalBlock(multi.content)) {
                colsToFixWidth.add(ic);
                if (forLatex) {
                  tdOpen.meta.forceMultiFixedWidth = true;
                }
              }
              res.push({token:'inline', type:'inline', tag: '', n: 0, content: multi.content});
            }
          }
          res.push(SHARED_TD_CLOSE);
          continue;
        }

        MR[ic] = MR[ic] > 0 ? MR[ic] - 1 : 0;

        if (MR[ic] && MR[ic] > 0) {
          if (forLatex) {
            res.push({token:'td_skip', type:'td_skip', tag: 'td', n: -1,
              latex: multi && multi.latex ? multi.latex : ''});
          }
          continue
        }

        const parseMath = getMathTableContent(cells[j], 0);
        let content = parseMath || getContent(cells[j]);

        const handleSubTable = (subTable: Array<TTokenTabular>, vOverride: string) => {
          if (!colsToFixWidth.has(ic)
            && subTable.some((item: TTokenTabular) => detectLocalBlock(item.content))) {
            colsToFixWidth.add(ic);
          }
          return AddTdSubTable(subTable,
            { h: cAlign[ic], v: vOverride, w: cWidth[ic] },
            {
              left: cLeft,
              right: cRight,
              bottom: CellsHLines[i + 1] ? CellsHLines[i + 1][ic] : 'none',
              top: i === 0 ? (CellsHLines[i] ? CellsHLines[i][ic] : 'none') : ''
            },
            skipVisual,
            tdMeta
          );
        }
        const parseSub = getSubTabular(content, 0, true, forLatex);
        if (parseSub && parseSub.length > 0) {
          let cellV: string = vAlign[ic];
          // Diagbox: skip parser emit — render-tabular adds vertical-align: middle once.
          if (parseSub[0]?.hasDiagbox) {
            cellV = '';
          } else if (!EXPLICIT_V_COL_SPEC.includes(colSpec[ic]?.[0] || '')) {
            const placeholder = content.match(doubleAngleBracketUuidPattern)?.[0];
            const cellBracket = placeholder ? getSubTabularBracket(placeholder) : undefined;
            if (cellBracket) cellV = bracketToVAlign(cellBracket);
          }
          for (const t of handleSubTable(parseSub, cellV)) {
            res.push(t);
          }
          continue;
        }
        const data = AddTd(content,
          {h: cAlign[ic], v: vAlign[ic], w: cWidth[ic]},
           {left: cLeft, right: cRight, bottom: CellsHLines[i+1] ? CellsHLines[i+1][ic]: 'none',
             top: i === 0 ? CellsHLines[i] ? CellsHLines[i][ic] : 'none' : ''},
            CellsHLSpaces[i+1][ic], decimal[ic], skipVisual, tdMeta
          );
        markColIfHasList(colsToFixWidth, ic, data.content);
        for (const t of data.res) {
          res.push(t);
        }
      } else {
        MR[ic] = MR[ic] > 0 ? MR[ic] - 1 : 0;
        if (MR[ic] && MR[ic] > 0) {
          if (forLatex) {
            res.push({token:'td_skip', type:'td_skip', tag: 'td', n: -1});
          }
          continue
        }
        const data = AddTd('',
          {h: cAlign[ic], v: vAlign[ic], w: cWidth[ic]},
           {left: cLeft, right: cRight, bottom: CellsHLines[i+1] ? CellsHLines[i+1][ic] : 'none',
             top: i === 0 ? CellsHLines[i] ? CellsHLines[i][ic] : 'none' : ''},
            CellsHLSpaces[i+1][ic], null, skipVisual, tdMeta
          );
        markColIfHasList(colsToFixWidth, ic, data.content);
        for (const t of data.res) {
          res.push(t);
        }
      }

    }
    res.push(SHARED_TR_CLOSE);
  }
  if (forLatex) {
    res.push({token:'tbody_close', type:'tbody_close', tag: 'tbody', n: -1,
      latex: data && data.sLines && data.sLines.length ? data.sLines[data.sLines.length-1] : ''
    });
  } else {
    res.push(SHARED_TBODY_CLOSE);
  }
  res.push(SHARED_TABLE_CLOSE);
  if (forLatex) {
    const colsToFixWidthArr = Array.from(colsToFixWidth);
    tableOpen.meta = {
      colsToFixWidth: colsToFixWidthArr,
      colSpecs: colSpec,
      colCount: numCol,
      isSubTabular,
      vLineSpec: cLines
    }
    if (latexBracket) {
      tableOpen.meta.bracket = latexBracket;
    }
    if (colsToFixWidthArr.length) {
      tableOpen.meta.shouldRewriteColSpec = shouldRewriteColSpec(colsToFixWidthArr, colSpec);
    }
  }
  return res;
};

export const ParseTabular = (str: string, i: number, align: string='', options = {}, isSubTabular: boolean = false, bracket?: TVerticalPos): Array<TTokenTabular> | null => {
  let res: Array<TTokenTabular> = [];
  let posEnd: number = str.indexOf('\\end{tabular}');
  if (posEnd > 0) {
    let posBegin = str.slice(i, posEnd).lastIndexOf('\\begin{tabular}');

    if (posBegin >= 0) {
      // params.bracket unused here — inner bracket is read later via inline rule.
      let params = getParams(str, posBegin + '\\begin{tabular}'.length);
      if (params) {
        const subT: string = str.slice(posBegin, posEnd+ '\\end{tabular}'.length);
        str = pushSubTabular(str, subT, [], posBegin, posEnd, i);
        res = ParseTabular(str, 0, align, options, isSubTabular, bracket);
      } else {
        let match = str
          .slice(posBegin)
          .match(BEGIN_TABULAR_BRACKET_RE);

        const subT: string = str.slice(posBegin, posEnd + '\\end{tabular}'.length);
        str = pushSubTabular(str, subT, [], posBegin + match.index, posEnd, i);
        res = ParseTabular(str, 0, align, options, isSubTabular, bracket);
      }
    } else {
      const subT: string = str.slice(i, posEnd);
      const subRes: Array<TTokenTabular> = setTokensTabular(subT, align, options, false, bracket);
      str = pushSubTabular(str, subT, subRes, 0, posEnd);
      res = ParseTabular(str, 0, align, options, isSubTabular, bracket);
    }
  } else {
    res = setTokensTabular(str, align, options, isSubTabular, bracket);
  }
  return res;
};
