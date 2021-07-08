import { TTokenTabular } from "./index";
import {addHLineIntoStyle, AddTd, AddTdSubTable } from "./tabular-td";
import {getContent, getRowLines,getCellsAll, getDecimal, TDecimal,
  TAlignData, getVerticallyColumnAlign, getParams, getColumnLines
} from './common';
import { getMathTableContent, getSubMath } from './sub-math';
import { getSubTabular, pushSubTabular } from './sub-tabular';
import { getMultiColumnMultiRow, getCurrentMC, getMC } from './multi-column-row';

export const separateByColumns = (str: string) => {
  const columns = [];
  let index = 0;

  for (let i = 0; i < str.length; i++) {
    let pos = str.indexOf('&', i);
    if (pos === -1) {
      columns.push(str.slice(index));
      break
    }
    if (pos > 0 && str.charCodeAt(pos-1) === 92) {
      i = pos;
      continue;
    }
    columns.push(str.slice(index, pos));
    index = pos + 1;
    i = pos;
  }
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
  return str.split('\\\\');
};

const setTokensTabular = (str: string, align: string = '', options: any = {}): Array<TTokenTabular>|null => {
  let res: Array<TTokenTabular> = [];
  const rows: string[] = getRows(str);

  let cellsAll: string[] = getCellsAll(rows);
  const numCol: number = getNumCol(cellsAll);
  let data = getRowLines(rows, numCol);
  let CellsHLines: Array<Array<string>> = data.cLines;
  let CellsHLSpaces: Array<Array<string>> = data.cSpaces;

  const dataAlign: TAlignData = getVerticallyColumnAlign(align, numCol);
  const cLines: Array<string> = getColumnLines(align, numCol);
  const {cAlign, vAlign, cWidth} = dataAlign;
  const decimal: Array<TDecimal> = getDecimal(cAlign, cellsAll);
  const { forLatex = false, outMath = {} } = options;

  res.push({token:'table_open', type:'table_open', tag: 'table', n: 1,
    attrs: [[ 'id', 'tabular' ]],
    latex: forLatex
      ? align
      : outMath.include_table_markdown
        ? cAlign.join('|')
        : ''
  });
  res.push({token:'tbody_open', type:'tbody_open', tag: 'tbody', n: 1});


  let MR: Array<number> = new Array(numCol).fill(0);
  for (let i = 0; i < rows.length; i++) {
    if (!cellsAll[i] || cellsAll[i].length === 0) {
      if (i < cellsAll.length-1) {
        res.push({token:'tr_open', type:'tr_open', tag: 'tr', n: 1,
          attrs: [[ 'style', 'border-top: none !important; border-bottom: none !important;' ]],
          latex: forLatex && data && data.sLines && data.sLines.length > i ? data.sLines[i] : ''
        });
        for (let k = 0; k < numCol; k++) {
          let cRight = k === numCol-1 ?  cLines[cLines.length-1] :cLines[k+1];
          let cLeft = k === 0 ? cLines[0] : '';
          const data = AddTd('', {h: cAlign[k], v: vAlign[k], w: cWidth[k]},
            {left: cLeft, right: cRight, bottom: CellsHLines[i+1] ? CellsHLines[i+1][k] : 'none',
              top: i === 0 ? CellsHLines[i] ? CellsHLines[i][k] : 'none' : ''},
            CellsHLSpaces[i+1][k]
          );
          res = res.concat(data.res);
        }
        res.push({token:'tr_close', type:'tr_close', tag: 'tr', n: -1});
      }
      continue;
    }
    res.push({token:'tr_open', type:'tr_open', tag: 'tr', n: 1,
      attrs: [[ 'style', 'border-top: none !important; border-bottom: none !important;' ]],
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
            CellsHLSpaces[i+1][k]
          );
          res = res.concat(data.res);
        }
        break;
      }

      let cRight = ic === numCol-1 ?  cLines[cLines.length-1] :cLines[ic+1];
      let cLeft = ic === 0 ? cLines[0] : '';


      if (cells[j] && cells[j].trim().length > 0) {
        const multi = getMultiColumnMultiRow(cells[j], {lLines: cLines[ic], align: cAlign[ic], rLines: cRight});
        if (multi) {
          let mr = multi.mr > rows.length ? rows.length : multi.mr;
          let mc = multi.mc > numCol ? numCol : multi.mc;

          if (mc && mc > 1) {
            let d = ic - mc + 1;
            if (MR[d] && MR[d] > 0) {
              for (let k = 0; k < mc; k++) {
                MR[d+k] = MR[d+k] > 0 ? MR[d+k] - 1 : 0;
                if (MR[d+k] > 0) {
                  mc -= 1;
                }
              }
              if (mc < 1) {
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

            if (mr+i >= rows.length-1) {
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


          if (i === 0){
            multi.attrs = addHLineIntoStyle(multi.attrs, CellsHLines[i] ? CellsHLines[i][ic] : 'none', 'top');
          }
          if (mr && mr > 0) {
            multi.attrs = addHLineIntoStyle(multi.attrs, CellsHLines[mr+i] ? CellsHLines[mr+i][ic] : 'none');
          } else {
            multi.attrs = addHLineIntoStyle(multi.attrs, CellsHLines[i+1] ? CellsHLines[i+1][ic] : 'none');
          }

          res.push({token:'td_open', type:'td_open', tag: 'td', n: 1, attrs: multi.attrs,
            latex: forLatex && multi && multi.latex ? multi.latex : ''});
          if (multi.subTable) {
            res = res.concat(multi.subTable);
          } else {
            if (multi.content) {
              res.push({token:'inline', type:'inline', tag: '', n: 0, content: multi.content});
            }
          }

          res.push({token:'td_close', type:'td_close', tag: 'td', n: -1});
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


        const parseSub = getSubTabular(cells[j], 0);
        if (parseSub && parseSub.length > 0) {
          res = res.concat(AddTdSubTable(parseSub,
            {h: cAlign[ic], v: vAlign[ic], w: cWidth[ic]},
             {left: cLeft, right: cRight, bottom: CellsHLines[i+1] ? CellsHLines[i+1][ic] : 'none',
               top: i === 0 ? CellsHLines[i] ? CellsHLines[i][ic] : 'none' : ''}
            ));
          continue;
        }

        const parseMath = getMathTableContent(cells[j], 0);
        let content = '';
        if (parseMath) {
          content = parseMath
        } else {
          content = getContent(cells[j])
        }
        const data = AddTd(content,
          {h: cAlign[ic], v: vAlign[ic], w: cWidth[ic]},
           {left: cLeft, right: cRight, bottom: CellsHLines[i+1] ? CellsHLines[i+1][ic]: 'none',
             top: i === 0 ? CellsHLines[i] ? CellsHLines[i][ic] : 'none' : ''},
            CellsHLSpaces[i+1][ic], decimal[ic]
          );
        res = res.concat(data.res);
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
            CellsHLSpaces[i+1][ic]
          );
        res = res.concat(data.res);
      }

    }
    res.push({token:'tr_close', type:'tr_close', tag: 'tr', n: -1});
  }
  res.push({token:'tbody_close', type:'tbody_close', tag: 'tbody', n: -1,
    latex: forLatex && data && data.sLines && data.sLines.length ? data.sLines[data.sLines.length-1] : ''
  });
  res.push({token:'table_close', type:'table_close', tag: 'table', n: -1});
  return res;
};

export const ParseTabular = (str: string, i: number, align: string='', options = {}): Array<TTokenTabular> | null => {
  let res: Array<TTokenTabular> = [];
  let posEnd: number = str.indexOf('\\end{tabular}');
  if (posEnd > 0) {
    let posBegin = str.slice(i, posEnd).lastIndexOf('\\begin{tabular}');

    if (posBegin >= 0) {
      let params = getParams(str, posBegin + '\\begin{tabular}'.length);
      if (params) {
        const subT = str.slice(posBegin, posEnd+ '\\end{tabular}'.length);
        str = pushSubTabular(str, subT, posBegin, posEnd, i);
        res = ParseTabular(str, 0, align, options);
      } else {
        let match = str
          .slice(posBegin)
          .match(/(?:\\begin{tabular}\s{0,}\{([^}]*)\})/);

        const subT = str.slice(posBegin, posEnd + '\\end{tabular}'.length);
        str = pushSubTabular(str, subT, posBegin + match.index, posEnd, i);
        res = ParseTabular(str, 0, align, options);
      }
    } else {
      const subT = str.slice(i, posEnd);
      const subRes: Array<TTokenTabular> = setTokensTabular(subT, align, options);
      str = pushSubTabular(str, subRes, 0, posEnd);
      res = ParseTabular(str, 0, align, options);
    }
  } else {
    res = setTokensTabular(str, align, options);
  }
  return res;
};
