import { TsvJoin } from "../common/tsv";
import { CsvJoin } from "../common/csv";
import { tableMarkdownJoin } from "../common/table-markdown";
import { formatSource } from "../../helpers/parse-mmd-element";
import { getStyleFromHighlight } from "../highlight/common";
import {
  renderTableCellContent,
  RenderTableCellContentResult
} from "../common/render-table-cell-content";
import { getItemizePlainMarker } from "../md-latex-lists-env/re-level";

const TABLE_TOKENS = new Set([
  'table_open','table_close','tbody_open','tbody_close','tr_open','tr_close','td_open','td_close',
]);

/**
 * Appends a text chunk to the last line of a string array.
 * If the array is empty, a new line is created.
 */
const appendToLastLine = (lines: string[], chunk: string): void => {
  if (!chunk) {
    return;
  }
  if (lines.length === 0) {
    lines.push(chunk);
    return;
  }
  lines[lines.length - 1] += chunk;
};

/**
 * Ensures there is an empty last line in the lines array.
 * If the current last line contains non-whitespace characters, appends a new empty line.
 *
 * @param lines - Array of lines representing a multi-line cell value.
 */
const ensureTrailingEmptyLine = (lines: string[]): void => {
  if (!lines.length) {
    lines.push('');
    return;
  }
  if (lines[lines.length - 1].trim()) {
    lines.push('');
  }
};

/**
 * Formats TSV cell content from an array of lines.
 *
 * Behavior:
 * - Joins all lines using '\n' by default.
 * - If the resulting text contains a double quote (`"`), falls back to joining lines with spaces
 *   to avoid broken TSV/Excel output.
 * - If `isSubTable` is true, returns the joined text without quoting.
 * - Otherwise, wraps the value in double quotes only when it contains newlines or tabs.
 * @param lines - Cell content split into lines.
 * @param isSubTable - Whether the cell belongs to a nested table context.
 * @returns TSV-ready string for a single table cell.
 */
const formatTsvCell = (lines: string[], isSubTable: boolean): string => {
  const text: string = (lines ?? []).join('\n');
  if (text.includes('"')) {
    return (lines ?? []).join(' ');
  }
  if (isSubTable) {
    return text;
  }
  // Quote if TSV contains characters that should be protected in spreadsheets/parsers.
  const needsQuoting: boolean = /[\n\t]/.test(text);
  if (!needsQuoting) {
    return text;
  }
  return `"${text}"`;
};

/**
 * Formats CSV cell content from an array of lines by joining them with newline characters.
 *
 * @param lines - Cell content split into lines.
 * @returns CSV-ready string for a single table cell.
 */
const formatCsvCell = (lines: string[]): string => {
  return(lines ?? []).join('\n');
};

const tokenAttrGet = (token, name) => {
  if (!name) { return ''}
  if (!token.attrs) {
    return ''
  }
  let index = token.attrs.findIndex(item => item[0] === name);
  if (index < 0) {
    return ''
  }
  return token.attrs[index][1]
};

const tokenAttrSet = (token, name, value) => {
  if (!name) { return }
  if (!token.attrs) {
    token.attrs = [];
    token.attrs.push([name, value]);
    return;
  }
  let index = token.attrs.findIndex(item => item[0] === name);
  if (index < 0) {
    token.attrs.push([name, value]);
    return;
  }
  token.attrs[index][1] = value
};

type CellAccumulators = {
  result: string;
  cellMd: string;
  cellSmoothed: string;
  cellTsvLines: string[];
  cellCsvLines: string[];
};

type RenderCtx = {
  tokens: any[];
  idx: number;
  options: any;
  env: any;
  slf: any;
  highlight?: any;
};

/**
 * Renders a non-table token into the current table-cell accumulators.
 *
 * Handles three cases:
 * - `tabular` blocks via `renderInlineTokenBlock` (nested LaTeX tables).
 * - Composite tokens (with children) via `renderTableCellContent` (recursive cell rendering).
 * - Leaf tokens via `slf.renderInline`, plus list-specific Markdown stitching
 *   (handled by `handleListTokensForCellMarkdown`).
 *
 * @param token - Token to render (expected to be outside the core table token set).
 * @param ctx - Rendering context (renderer/options/env and additional state used by helpers).
 * @param acc - Mutable accumulators for the current cell (HTML/text, TSV/CSV, Markdown, smoothed).
 */
const renderNonTableTokenIntoCell = (
  token: any,
  ctx: RenderCtx,
  acc: CellAccumulators
): void => {
  const { options, env, slf, highlight } = ctx;
  if (token?.type === 'tabular') {
    const data = renderInlineTokenBlock(token.children, options, env, slf, true, highlight);
    acc.result += data.table;
    if (Array.isArray(data.tableMd) && data.tableMd.length) {
      if (acc.cellMd?.trim()) {
        acc.cellMd += '<br>';
      }
      acc.cellMd += data.tableMd.map(item => (typeof item === 'string' ? item : item.join(' '))).join(' <br> ');
    }
    if (data.tsv) {
      ensureTrailingEmptyLine(acc.cellTsvLines);
      appendToLastLine(acc.cellTsvLines, TsvJoin(data.tsv, options));
    }
    if (data.csv) {
      ensureTrailingEmptyLine(acc.cellCsvLines);
      appendToLastLine(acc.cellCsvLines, CsvJoin(data.csv, options, true));
    }
    return;
  }
  if (token?.children?.length) {
    const cellRender: RenderTableCellContentResult = renderTableCellContent(token, true, options, env, slf);
    acc.result += cellRender.content;
    appendToLastLine(acc.cellTsvLines, cellRender.tsv);
    appendToLastLine(acc.cellCsvLines, cellRender.csv);
    acc.cellMd += cellRender.tableMd;
    acc.cellSmoothed += cellRender.tableSmoothed;
    return;
  }
  // Leaf token
  acc.result += slf.renderInline([token], options, env);
  // List-related markdown stitching inside table cells
  handleListTokensForCellMarkdown(token, ctx, acc);
};

/**
 * Applies Markdown/TSV/CSV "stitching" rules for LaTeX list tokens when rendering table cells.
 * This handler does not render the list content itself; it only injects separators (e.g. <br>),
 * indentation, and list markers so that list structure is preserved inside a single table cell.
 *
 * @param token - Current token being processed.
 * @param ctx - Render context containing the token stream, current index, and renderer dependencies.
 * @param acc - Mutable accumulators for the current cell (md/tsv/csv/smoothed).
 */
const handleListTokensForCellMarkdown = (
  token: any,
  ctx: RenderCtx,
  acc: CellAccumulators
): void => {
  const { tokens, idx, options, env, slf } = ctx;
  const prevToken = idx > 0 ? tokens[idx - 1] : null;
  const addBr = (): void => {
    acc.cellMd += '<br>';
  };
  if (token?.type && ["itemize_list_open", "enumerate_list_open"].includes(token.type)) {
    const level = token?.prentLevel ?? 0;
    const prevType = prevToken?.type;
    const prevLevel = prevToken?.prentLevel ?? 0;
    // Add a break after a paragraph boundary.
    if (prevType === 'paragraph_close') {
      addBr();
    }
    // Add a break before nested lists unless we are right after a list item close.
    if (prevToken && prevType !== 'latex_list_item_close' && level > 0) {
      addBr();
    }
    // Add a break between top-level lists.
    const prevIsListClose: boolean = prevType === 'enumerate_list_close' || prevType === 'itemize_list_close';
    if (prevIsListClose && prevLevel === 0) {
      addBr();
    }
    return;
  }
  if (token?.type === "latex_list_item_open") {
    let mdPrefix = '';
    let tsvPrefix = '';
    let csvPrefix = '';
    // Add a break if a list item starts right after a paragraph.
    if (prevToken?.type === 'paragraph_close') {
      mdPrefix += '<br>';
      acc.cellSmoothed += ' ';
    }
    const isEnumerate: boolean = token.parentType === "enumerate";
    // Ensure list items always start on a fresh TSV/CSV line.
    ensureTrailingEmptyLine(acc.cellTsvLines);
    ensureTrailingEmptyLine(acc.cellCsvLines);
    // Indent nested list items using non-breaking spaces (HTML).
    const listLevel = isEnumerate ? token.meta?.enumerateLevel : token.meta?.itemizeLevel;
    for (let i = 1; i < listLevel; i++) {
      mdPrefix += '&#160;&#160;';
      tsvPrefix += '  ';
      csvPrefix += '  ';
    }
    let markerMd: string = '';
    let markerTsv: string = ' ';
    let markerCsv: string = ' ';
    // If the token provides a custom marker, use it; otherwise default to bullet markers.
    if (token.hasOwnProperty('marker')) {
      if (token.markerTokens?.length === 1) {
        // Avoid mutating the original token: render marker tokens via a shallow copy.
        const markerToken = { ...token, children: token.markerTokens };
        const markerRender: RenderTableCellContentResult = renderTableCellContent(markerToken, true, options, env, slf);
        markerMd = markerRender.tableMd ?? '';
        markerTsv += markerRender.tsv ?? '';
        markerCsv += markerRender.csv ?? '';
      } else {
        markerMd = token.marker ?? '';
        markerTsv += token.marker ?? '';
        markerCsv += token.marker ?? '';
      }
    } else {
      const itemizeLevel: number = Math.max(1, listLevel ?? 1);
      const plainMarker: string = getItemizePlainMarker(itemizeLevel);
      markerMd = plainMarker;
      markerTsv += plainMarker;
      markerCsv += plainMarker;
    }
    if (markerMd) {
      mdPrefix += `${markerMd} `;
    }
    if (markerTsv) {
      tsvPrefix += markerTsv + ' ';
    }
    if (markerCsv) {
      csvPrefix += markerCsv + ' ';
    }
    acc.cellMd += mdPrefix;
    appendToLastLine(acc.cellTsvLines, tsvPrefix);
    appendToLastLine(acc.cellCsvLines, csvPrefix);
    acc.cellSmoothed += markerMd ? `${markerMd} ` : '';
    return;
  }
  if (token?.type === "latex_list_item_close") {
    const prevType = prevToken?.type;
    // Add a break between list items unless the list ends immediately after the item.
    const shouldBreak: boolean = prevType !== 'itemize_list_close' && prevType !== 'enumerate_list_close';
    if (shouldBreak) {
      addBr();
    }
    return;
  }
  if (token?.type && ["itemize_list_close", "enumerate_list_close"].includes(token.type)) {
    // No-op: list close is handled by item close logic and surrounding tokens.
    return;
  }
}

type RenderInlineTokenBlockResult = {
  /** Rendered HTML table markup. */
  table: string;
  /** TSV rows: each row is an array of cell strings. */
  tsv: string[][];
  /** CSV rows: each row is an array of cell strings. */
  csv: string[][];
  /** Markdown rows: each row is an array of cell strings. */
  tableMd: string[][];
  /** Smoothed rows: each row is an array of cell strings. */
  tableSmoothed: string[][];
  /** LaTeX column spec / alignment string captured from the token stream, if available. */
  align: string;
};

/**
 * Renders a markdown-it token stream representing an HTML table (or LaTeX tabular)
 * into HTML markup and parallel TSV/CSV/Markdown/"smoothed" table representations.
 * Also handles nested tabular blocks and list tokens inside table cells.
 *
 * @param tokens - Token stream to render.
 * @param options - Renderer options (pptx/docx/xhtml, etc.).
 * @param env - Rendering environment.
 * @param slf - Markdown-it renderer instance.
 * @param isSubTable - Whether the current table is nested inside another table cell.
 * @param highlight - Optional highlight metadata applied to table cells.
 * @returns Rendered table outputs in multiple formats.
 */
export const renderInlineTokenBlock = (
  tokens,
  options,
  env,
  slf,
  isSubTable = false,
  highlight = null
): RenderInlineTokenBlockResult => {
  let nextToken,
    result = '',
    needLf = false;

  let arrTsv = [];
  let arrCsv = [];
  let arrMd = [];
  let arrSmoothed = [];
  let arrRow = [];
  let arrRowCsv = [];
  let arrRowMd = [];
  let arrRowSmoothed = [];
  let cellTsvLines: string[] = [''];
  let cellCsvLines: string[] = [''];
  let cellMd= '';
  let cellSmoothed= '';
  let align = '';
  let colspan = 0, rowspan = [], mr = 0;
  let numCol = 0;

  const ctx: RenderCtx = { tokens, idx: 0, options, env, slf, highlight };
  for (let idx = 0; idx < tokens.length; idx++) {
    ctx.idx = idx;
    let token = tokens[idx];
    if (token.hidden) {
      continue;
    }

    if ( token.n !== -1 && idx && tokens[idx - 1].hidden) {
      result += '\n';
    }
    if (token.token === 'table_open' || token.token === 'tbody_open') {
      arrTsv = [];
      arrCsv = [];
      arrMd = [];
      arrSmoothed = [];
      arrRow = [];
      arrRowCsv = [];
      arrRowMd = [];
      arrRowSmoothed = [];
      if (!align) {
        align = token.latex;
      }
    }
    if (token.token === 'tr_open') {
      arrRow = [];
      arrRowCsv = [];
      arrRowMd = [];
      arrRowSmoothed = [];
    }
    if (token.token === 'tr_close') {
      arrTsv.push(arrRow);
      arrCsv.push(arrRowCsv);
      arrMd.push(arrRowMd);
      arrSmoothed.push(arrRowSmoothed);
      const l = arrRow &&  arrRow.length > 0 ? arrRow.length  : 0;
      const l2 = rowspan &&  rowspan.length > 0 ? rowspan.length  : 0;
      if (l < l2) {
        for (let k = l; k < l2; k++) {
          if (rowspan[k]) {
            if (rowspan[k][1] && rowspan[k][1] > 1) {
              for (let i = 0; i < rowspan[k][1]; i++) {
                arrRow.push('');
                arrRowCsv.push('');
                arrRowMd.push('');
                arrRowSmoothed.push('');
              }
            } else {
              arrRow.push('');
              arrRowCsv.push('');
              arrRowMd.push('');
              arrRowSmoothed.push('');
            }
            rowspan[k][0] -= 1;
          }
        }
      }

    }
    if (token.token === 'td_open') {
      let nextToken = tokens[idx+1];
      let nextToken2 = tokens[idx+2];
      if (
        nextToken2?.token === 'td_close' &&
        nextToken?.children?.length === 1 &&
        ['slashbox', 'backslashbox'].includes(nextToken.children[0].type)
      ) {
        const diagBoxToken = nextToken.children[0];
        diagBoxToken.meta = { ...diagBoxToken.meta, isBlock: true };
        const dir = diagBoxToken.type === 'backslashbox' ? 'left' : 'right';
        let styles = tokenAttrGet(token, 'style');
        styles += 'background-size: 100% 100%;';
        styles += 'vertical-align: middle;';
        styles += `background-image: linear-gradient(to bottom ${dir}, transparent calc(50% - 0.5px), black 50%, black 50%, transparent calc(50% + 0.5px));`;
        tokenAttrSet(token, 'style', styles);
      }
      cellTsvLines = [''];
      cellCsvLines = [''];
      cellMd = '';
      cellSmoothed = '';
      colspan = tokenAttrGet(token, 'colspan');
      colspan = colspan ? Number(colspan) : 0 ;
      mr = tokenAttrGet(token, 'rowspan');
      mr = mr ? Number(mr) : 0 ;
      if (highlight) {
        let styles = tokenAttrGet(token, 'style');
        let dataAttrsStyle = getStyleFromHighlight(highlight);
        tokenAttrSet(token, 'style', dataAttrsStyle + styles);
        tokenAttrSet(token, 'class', 'mmd-highlight');
      }
    }
    if (token.token === 'td_close') {
      let l = arrRow &&  arrRow.length > 0 ? arrRow.length  : 0;
      const l2 = rowspan &&  rowspan.length > 0 ? rowspan.length  : 0;
      if (l < l2) {
        for (let k = l; k < l2; k++) {
          if (rowspan[k] && rowspan[k][0] && rowspan[k][0] > 0) {
            if (rowspan[k] && rowspan[k][1] && rowspan[k][1] > 1) {
              for (let i = 0; i < rowspan[k][1]; i++) {
                arrRow.push('');
                arrRowCsv.push('');
                arrRowMd.push('');
                arrRowSmoothed.push('');
              }
            } else {
              arrRow.push('');
              arrRowCsv.push('');
              arrRowMd.push('');
              arrRowSmoothed.push('');
            }
            if (rowspan[k] && rowspan[k][0]) {
              rowspan[k][0] -= 1;
            }
          } else {
            break
          }
        }
      }
      l = arrRow &&  arrRow.length > 0 ? arrRow.length  : 0;
      if (!mr && rowspan[l] && rowspan[l][0] > 0) {
        arrRow.push(formatTsvCell(cellTsvLines, isSubTable));
        arrRowCsv.push(formatCsvCell(cellCsvLines));
        arrRowMd.push(cellMd);
        arrRowSmoothed.push(cellSmoothed);
      } else {
        arrRow.push(formatTsvCell(cellTsvLines, isSubTable));
        arrRowCsv.push(formatCsvCell(cellCsvLines));
        arrRowMd.push(cellMd);
        arrRowSmoothed.push(cellSmoothed);
        if (colspan && colspan > 1) {
          for (let i = 0; i < colspan-1; i++) {
            arrRow.push('');
            arrRowCsv.push('');
            arrRowMd.push('');
            arrRowSmoothed.push('');
          }
        }
        if (mr && mr > 1) {
          rowspan[l] = [mr-1, colspan];
        }
      }
      colspan = 0;
    }
    if (token.token === 'inline' || token.type === 'inline') {
      let content: string = '';
      if (token.children) {
        const cellRender: RenderTableCellContentResult = renderTableCellContent(token, true, options, env, slf);
        content += cellRender.content;
        appendToLastLine(cellTsvLines, cellRender.tsv);
        appendToLastLine(cellCsvLines, cellRender.csv);
        cellMd += cellRender.tableMd;
        cellSmoothed += cellRender.tableSmoothed;
      } else {
        content = slf.renderInline([{type: 'text', content: token.content}], options, env);
        appendToLastLine(cellTsvLines, content);
        appendToLastLine(cellCsvLines, content);
        cellMd += content;
        cellSmoothed += content;
      }
      result += content;
      continue;
    }
    if (!TABLE_TOKENS.has(token.token) && !TABLE_TOKENS.has(token.type)) {
      const acc: CellAccumulators = {
        result,
        cellMd,
        cellSmoothed,
        cellTsvLines,
        cellCsvLines,
      };
      renderNonTableTokenIntoCell(token, ctx, acc);
      result = acc.result;
      cellMd = acc.cellMd;
      cellSmoothed = acc.cellSmoothed;
      cellTsvLines = acc.cellTsvLines;
      cellCsvLines = acc.cellCsvLines;
      continue;
    }
    let tokenTag = token.tag;
    let sizerTr = '';
    if (options?.forPptx) {
      if (token.tag === 'tbody') {
        numCol = tokenAttrGet(token, 'data_num_col');
        numCol = numCol ? Number(numCol) : 0 ;
        if (numCol) {
          sizerTr += '<tr class="tr-sizer">';
          for (let i = 0; i < numCol; i++) {
            sizerTr += '<td class="td_empty">x</td>';
          }
          sizerTr += '</tr>';
        }
      }
    }
    // Add token name, e.g. `<img`
    result += (token.n === -1 ? '</' : '<') + tokenTag;

    if (options?.forPptx && token.token === 'td_open' && tokens[idx+1]?.token === 'td_close') {
      let className = tokenAttrGet(token, 'class');
      className += className ? ' ' : '';
      className += 'td_empty';
      tokenAttrSet(token, 'class', className);
    }
    // Encode attributes, e.g. `<img src="foo"`
    result += slf.renderAttrs(token);

    // Add a slash for self-closing tags, e.g. `<img src="foo" /`
    if (token.n === 0 && options.xhtmlOut) {
      result += ' /';
    }

    // Check if we need to add a newline after this tag
    needLf = true;

    if (token.n === 1) {
      if (idx + 1 < tokens.length) {
        nextToken = tokens[idx + 1];

        if (nextToken.token === 'inline' || nextToken.hidden) {
          // Block-level tag containing an inline tag.
          //
          needLf = false;

        } else if (nextToken.n === -1 && nextToken.tag === token.tag) {
          // Opening tag + closing tag of the same type. E.g. `<li></li>`.
          //
          needLf = false;
        }
      }
    }

    result += needLf ? '>\n' : '>';
    if (options?.forPptx) {
      if (sizerTr) {
        result += sizerTr;
      }
      if (token.token === 'td_open' && tokens[idx+1]?.token === 'td_close') {
        result += 'x'
      }
    }
  }
  return {
    table: result, 
    tsv:  arrTsv, 
    csv:  arrCsv,
    tableMd: arrMd, 
    tableSmoothed: arrSmoothed,
    align: align
  };
};

export const renderTabularInline = (a, token, options, env, slf) => {
  const {
    include_tsv = false, 
    include_csv = false, 
    include_table_markdown = false, 
    include_table_html = true
  } = options.outMath;
  let tabular = '';
  if (!include_tsv && !include_csv && !include_table_html && !include_table_markdown) {
    return ''
  }
  let highlight = token.highlights?.length ? token.highlights[0] : null;
  const data = renderInlineTokenBlock(token.children, options, env, slf, token.isSubTable, highlight);
  token.tsv = data.tsv;
  token.csv = data.csv;
  token.tableMd = data.tableMd;//tableMarkdownJoin(data.tableMd, data.align);
  token.tableSmoothed = data.tableSmoothed;
  let className = 'inline-tabular';
  className += token.isSubTable ? ' sub-table' : '';

  if (include_table_html) {
    tabular = data.table;
  }
  const tsv = include_tsv && token.tsv
    ? `<tsv style="display: none;">${formatSource(TsvJoin(token.tsv,options), true)}</tsv>`
    : '';
  const tableMd = include_table_markdown && token.tableMd
    ? `<table-markdown style="display: none;">${formatSource(tableMarkdownJoin(data.tableMd, data.align), true)}</table-markdown>`
    : '';
  const csv = include_csv && token.csv
    ? `<csv style="display: none;">${formatSource(CsvJoin(token.csv,options), true)}</csv>`
    : '';
  return `<div class="${className}">${tabular}${tsv}${tableMd}${csv}</div>`
};
