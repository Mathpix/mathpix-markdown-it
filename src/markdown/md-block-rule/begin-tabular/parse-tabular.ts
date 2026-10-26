import { TTokenTabular, TMulti, TAttrs } from "./index";
import {
  addHLineIntoStyle, AddTd, AddTdSubTable,
  getSharedTableOpenAttrs, getSharedTbodyOpenAttrs, getSharedTrOpenAttrs,
  SHARED_TD_CLOSE, SHARED_TR_CLOSE, SHARED_TABLE_CLOSE, SHARED_TBODY_CLOSE,
} from "./tabular-td";
import {
  getContent, getRowLines, getCellsAll, getDecimal, TDecimal,
  TAlignData, getVerticallyColumnAlign, getParams, getColumnLines, shouldRewriteColSpec,
  detectLocalBlock, normalizeDefaultCellVerticalAlign, bracketToVAlign, parseTabularPos, TVerticalPos, TTdMeta
} from './common';
import { getMathTableContent, getSubMath } from './sub-math';
import { getSubTabular, pushSubTabular, getSubTabularBracket } from './sub-tabular';
import { getMultiColumnMultiRow, getCurrentMC, getMC } from './multi-column-row';
import { getSubDiagbox } from "./sub-cell";
import { isEscapedAt } from "../../utils";
import { AnalysedCell, AnalysedRow, PlannedRow, buildTabularGrid } from "./grid-model";
import { BEGIN_TABULAR_BRACKET_RE, doubleAngleBracketUuidPattern } from "../../common/consts";

// Column spec letters that carry explicit vertical alignment.
const EXPLICIT_V_COL_SPEC = 'mpb';
// Frozen: shared by all td_open in a tabular — extend via spread, not in-place.
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

// Vertical rule to the right of column `col`.
const ruleRightOf = (cLines: string[], col: number, numCol: number): string =>
  col === numCol - 1 ? cLines[cLines.length - 1] : cLines[col + 1];

// A row as the parse leaves it: what the plan reads, plus what the emitter writes it out with.
type ParsedRow = AnalysedRow & {
  // Index in `rows`, for the horizontal rules and the `.tex` line.
  line: number;
  // Cell text as split, and the `\multicolumn`/`\multirow` parsed out of it.
  raw: string[];
  multi: Array<TMulti | null>;
};

/** Every row parsed before anything is placed: a span reaches rows a row-at-a-time walk has not seen.
 *  A cell is parsed once and only where the emitter used to reach it, so nested tabular ids keep their
 *  order. */
const parseTabularRows = (
  rows: string[],
  cellsAll: string[],
  numCol: number,
  spec: {cLines: string[]; cAlign: string[]; bracket?: TVerticalPos},
  flags: {forLatex: boolean; forPptx: boolean; skipVisual: boolean},
): ParsedRow[] => {
  const {cLines, cAlign, bracket} = spec;
  const parsedRows: ParsedRow[] = [];
  for (let i = 0; i < rows.length; i++) {
    if (!cellsAll[i] || cellsAll[i].length === 0) {
      // A trailing line without cells is not a row.
      if (i < cellsAll.length - 1) {
        parsedRows.push({line: i, raw: [], multi: [], cells: null, targets: null});
      }
      continue;
    }
    const raw: string[] = separateByColumns(cellsAll[i]);
    // One past the last cell is where padding starts, and nothing reads further: `getCurrentMC` walks
    // the row's cells for every index it is asked about.
    const targets: number[] = [];
    for (let j = 0; j < numCol && j <= raw.length; j++) {
      targets[j] = getCurrentMC(raw, j);
    }
    const multi: Array<TMulti | null> = [];
    const cells: AnalysedCell[] = [];
    for (let j = 0; j < numCol; j++) {
      const col: number = targets[j];
      if (col >= numCol || j >= raw.length) {
        break;
      }
      if (!raw[j] || !raw[j].trim().length) {
        cells[j] = {mc: 0, mr: 0, prints: false};
        continue;
      }
      const parsedCell: TMulti | null = getMultiColumnMultiRow(raw[j],
        {lLines: cLines[col], align: cAlign[col], rLines: ruleRightOf(cLines, col, numCol), bracketDefault: bracket},
        flags.forLatex, flags.forPptx, flags.skipVisual);
      multi[j] = parsedCell;
      // `\multirow{2}{*}{}` is a placeholder for a row the serializer has nothing for: non-empty as
      // text, empty once parsed. A nested tabular leaves the content empty and fills `subTable`.
      const prints: boolean = parsedCell
        ? !!parsedCell.content?.trim().length || !!parsedCell.subTable?.length
        : true;
      cells[j] = {mc: parsedCell ? parsedCell.mc : 0, mr: parsedCell ? parsedCell.mr : 0, prints};
    }
    parsedRows.push({line: i, raw, multi, cells, targets});
  }
  return parsedRows;
};

const setTokensTabular = (str: string, {
  align = '',
  options = {},
  isSubTabular = false,
  bracket,
}: { align?: string; options?: any; isSubTabular?: boolean; bracket?: TVerticalPos } = {}): Array<TTokenTabular>|null => {
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

  // Option fallback only at top level — nested keeps source bracket (round-trip).
  const latexBracket: TVerticalPos | undefined = bracket ?? (isSubTabular ? undefined : (optionBracket === 'c' ? undefined : optionBracket));
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

  const parsedRows: ParsedRow[] = parseTabularRows(rows, cellsAll, numCol,
    {cLines, cAlign, bracket: latexBracket},
    {forLatex, forPptx: !!options?.forPptx, skipVisual});
  // `strict` reconciles the grid, which rewrites the source; a `.tex` round-trip must not.
  const plannedRows: PlannedRow[] = buildTabularGrid(numCol, parsedRows, {
    strict: options?.tabularGridMode === 'strict' && !forLatex,
    lines: rows.length,
    skipHeldOnBareLine: !!options?.forPptx,
  });
  // `forPptx` writes no span of one.
  const writesSpan = (span: number): boolean => span > 1 || (span === 1 && !options?.forPptx);
  // Puts the planned span over the one parsed from the source, or removes it.
  const setSpanAttr = (attrs: Array<TAttrs>, name: string, span: number): void => {
    const at: number = attrs.findIndex((attr) => attr[0] === name);
    if (at < 0) {
      return;
    }
    if (writesSpan(span)) {
      attrs[at][1] = span.toString();
    } else {
      attrs.splice(at, 1);
    }
  };
  // The rule above `line` in column `col`.
  const hLine = (line: number, col: number): string => CellsHLines[line] ? CellsHLines[line][col] : 'none';
  for (let r = 0; r < plannedRows.length; r++) {
    const plan: PlannedRow = plannedRows[r];
    if (plan.collapsed) {
      continue;
    }
    const row: ParsedRow = parsedRows[r];
    const line: number = row.line;
    res.push({token:'tr_open', type:'tr_open', tag: 'tr', n: 1,
      attrs: getSharedTrOpenAttrs(skipVisual),
      latex: forLatex && data && data.sLines && data.sLines.length > line ? data.sLines[line] : ''
    });
    for (const cell of plan.cells) {
      const multi: TMulti | null = cell.index >= 0 ? (row.multi[cell.index] ?? null) : null;
      if (cell.dropped) {
        // A `.tex` round-trip gets the command back, not the body: the writer reads a cell's body from
        // the token after `td_skip`, and putting one there swallows the `&` it writes between cells.
        if (forLatex && (cell.dropped === 'covered' || (multi && multi.latex))) {
          res.push({token:'td_skip', type:'td_skip', tag: 'td', n: -1,
            latex: multi && multi.latex ? multi.latex : ''});
        }
        continue;
      }
      // A `\multirow` is styled by the last column of its span, every other cell by its own.
      const styleCol: number = cell.claimed > 0 && cell.covers > 1 ? cell.col + cell.covers - 1 : cell.col;

      if (multi) {
        // The attributes were built from the source, before the grid was known.
        setSpanAttr(multi.attrs, 'colspan', cell.colspan);
        setSpanAttr(multi.attrs, 'rowspan', cell.rowspan);
        if (!skipVisual) {
          // The rule under the cell sits where the span claimed to end, not where `strict` left it.
          const under: number = cell.claimed > 0 ? cell.claimed + line : line + 1;
          // Legacy: a span reaching the last rows gets its bottom rule twice; kept for identical output.
          if (cell.claimed > 0 && under >= rows.length - 1) {
            multi.attrs = addHLineIntoStyle(multi.attrs, hLine(under, styleCol));
          }
          if (line === 0) {
            multi.attrs = addHLineIntoStyle(multi.attrs, hLine(line, styleCol), 'top');
          }
          multi.attrs = addHLineIntoStyle(multi.attrs, hLine(under, styleCol));
        }

        const tdOpen: TTokenTabular = {
          token:'td_open',
          type:'td_open',
          tag: 'td',
          n: 1,
          attrs: multi.attrs,
          latex: forLatex && multi.latex ? multi.latex : ''
        }
        res.push(tdOpen);
        if (forLatex) {
          tdOpen.meta = {
            ...tdMeta,
            multi: multi.multi,
            colCount: numCol,
            colSpecs: colSpec,
            currentColIndex: styleCol,
            isSubTabular,
          }
        }
        // A list inside fixes the column width.
        const hasLocalBlock: boolean = multi.subTable
          ? multi.subTable.some((item: TTokenTabular) => detectLocalBlock(item.content))
          : !!multi.content && detectLocalBlock(multi.content);
        if (hasLocalBlock) {
          colsToFixWidth.add(styleCol);
          if (forLatex) {
            tdOpen.meta.forceMultiFixedWidth = true;
          }
        }
        if (multi.subTable) {
          for (const t of multi.subTable) {
            res.push(t);
          }
        } else if (multi.content) {
          res.push({token:'inline', type:'inline', tag: '', n: 0, content: multi.content});
        }
        res.push(SHARED_TD_CLOSE);
        continue;
      }

      const aligns = {h: cAlign[styleCol], v: vAlign[styleCol], w: cWidth[styleCol]};
      const borders = {left: styleCol === 0 ? cLines[0] : '', right: ruleRightOf(cLines, styleCol, numCol),
        bottom: hLine(line + 1, styleCol), top: line === 0 ? hLine(line, styleCol) : ''};
      const cellText: string = cell.index >= 0 ? row.raw[cell.index] : '';
      const hasText: boolean = !!cellText && cellText.trim().length > 0;
      const content: string = hasText ? getMathTableContent(cellText, 0) || getContent(cellText) : '';
      if (hasText) {
        const parseSub = getSubTabular(content, 0, true, forLatex);
        if (parseSub && parseSub.length > 0) {
          let cellV: string = vAlign[styleCol];
          // Diagbox always centers, ignoring outer bracket.
          // getSubTabular returns a single wrapper; hasDiagbox is OR'd across all placeholders.
          if (parseSub[0]?.hasDiagbox) {
            cellV = 'middle';
          // colSpec may be 'p{2cm}'.
          } else if (!EXPLICIT_V_COL_SPEC.includes(colSpec[styleCol]?.[0] || '')) {
            // First nested tabular wins if a cell contains several.
            const placeholder = content.match(doubleAngleBracketUuidPattern)?.[0];
            const cellBracket = placeholder ? getSubTabularBracket(placeholder) : undefined;
            if (cellBracket) cellV = bracketToVAlign(cellBracket);
          }
          if (parseSub.some((item: TTokenTabular) => detectLocalBlock(item.content))) {
            colsToFixWidth.add(styleCol);
          }
          for (const t of AddTdSubTable(parseSub, {...aligns, v: cellV}, borders, skipVisual, tdMeta)) {
            res.push(t);
          }
          continue;
        }
      }
      // Plain text, or empty for a blank cell or a column the row has no cell for.
      const addedTd = AddTd(content, aligns, borders, CellsHLSpaces[line+1][styleCol],
        hasText ? decimal[styleCol] : null, skipVisual, tdMeta);
      markColIfHasList(colsToFixWidth, styleCol, addedTd.content);
      for (const t of addedTd.res) {
        res.push(t);
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
      let params = getParams(str, posBegin + '\\begin{tabular}'.length);
      if (params) {
        const subT: string = str.slice(posBegin, posEnd+ '\\end{tabular}'.length);
        str = pushSubTabular(str, subT, [], posBegin, posEnd, i, 0, params.bracket);
        res = ParseTabular(str, 0, align, options, isSubTabular, bracket);
      } else {
        let match = str
          .slice(posBegin)
          .match(BEGIN_TABULAR_BRACKET_RE);

        const subT: string = str.slice(posBegin, posEnd + '\\end{tabular}'.length);
        str = pushSubTabular(str, subT, [], posBegin + match.index, posEnd, i, 0, parseTabularPos(match?.[1]));
        res = ParseTabular(str, 0, align, options, isSubTabular, bracket);
      }
    } else {
      const subT: string = str.slice(i, posEnd);
      const subRes: Array<TTokenTabular> = setTokensTabular(subT, { align, options, isSubTabular: false, bracket });
      str = pushSubTabular(str, subT, subRes, 0, posEnd);
      res = ParseTabular(str, 0, align, options, isSubTabular, bracket);
    }
  } else {
    res = setTokensTabular(str, { align, options, isSubTabular, bracket });
  }
  return res;
};
