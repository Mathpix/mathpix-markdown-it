import { TsvJoin } from "../common/tsv";
import { CsvJoin } from "../common/csv";
import { tableMarkdownJoin } from "../common/table-markdown";
import { formatSource } from "../../helpers/parse-mmd-element";
import { getStyleFromHighlight } from "../highlight/common";
import { renderTableCellContent } from "../common/render-table-cell-content";

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

export const renderInlineTokenBlock = (tokens, options, env, slf, isSubTable = false, highlight = null) =>{
  let nextToken,
    result = '',
    needLf = false;

  let arrTsv = [];
  let arrCsv = [];
  let arrMd = [];
  let arrSmoothed = [];
  let arrLinerTsv = [];
  let arrRow = [];
  let arrRowCsv = [];
  let arrRowMd = [];
  let arrRowSmoothed = [];
  let arrRowLinerTsv = [];
  let cell = '';
  let cellCsv = '';
  let cellMd= '';
  let cellSmoothed= '';
  let cellLinerTsv= '';
  let align = '';
  let colspan = 0, rowspan = [], mr = 0;
  let numCol = 0;

  for (let idx = 0; idx < tokens.length; idx++) {
    let token = tokens[idx];
    if (token.hidden) {
      return {table: '', tsv: '', tableMd: '', align: ''};
    }

    if ( token.n !== -1 && idx && tokens[idx - 1].hidden) {
      result += '\n';
    }
    if (token.token === 'table_open' || token.token === 'tbody_open') {
      arrTsv = [];
      arrCsv = [];
      arrMd = [];
      arrSmoothed = [];
      arrLinerTsv = [];
      arrRow = [];
      arrRowCsv = [];
      arrRowMd = [];
      arrRowSmoothed = [];
      arrRowLinerTsv = [];
      if (!align) {
        align = token.latex;
      }
    }
    if (token.token === 'tr_open') {
      arrRow = [];
      arrRowCsv = [];
      arrRowMd = [];
      arrRowSmoothed = [];
      arrRowLinerTsv = [];
    }
    if (token.token === 'tr_close') {
      arrTsv.push(arrRow);
      arrCsv.push(arrRowCsv);
      arrMd.push(arrRowMd);
      arrSmoothed.push(arrRowSmoothed);
      arrLinerTsv.push(arrRowLinerTsv);
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
                arrRowLinerTsv.push('');
              }
            } else {
              arrRow.push('');
              arrRowCsv.push('');
              arrRowMd.push('');
              arrRowSmoothed.push('');
              arrRowLinerTsv.push('');
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
      cell = '';
      cellCsv = '';
      cellMd = '';
      cellSmoothed = '';
      cellLinerTsv = '';
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
                arrRowLinerTsv.push('');
              }
            } else {
              arrRow.push('');
              arrRowCsv.push('');
              arrRowMd.push('');
              arrRowSmoothed.push('');
              arrRowLinerTsv.push('');
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
        arrRow.push(cell);
        arrRowCsv.push(cellCsv);
        arrRowMd.push(cellMd);
        arrRowSmoothed.push(cellSmoothed);
        arrRowLinerTsv.push(cellLinerTsv)
      } else {
        arrRow.push(cell);
        arrRowCsv.push(cellCsv);
        arrRowMd.push(cellMd);
        arrRowSmoothed.push(cellSmoothed);
        arrRowLinerTsv.push(cellLinerTsv);
        if (colspan && colspan > 1) {
          for (let i = 0; i < colspan-1; i++) {
            arrRow.push('');
            arrRowCsv.push('');
            arrRowMd.push('');
            arrRowSmoothed.push('');
            arrRowLinerTsv.push('');
          }
        }
        if (mr && mr > 1) {
          rowspan[l] = [mr-1, colspan];
        }
      }
      colspan = 0;
    }
    if (token.token === 'inline') {
      let content: string = '';
      if (token.children) {
        const data = renderTableCellContent(token, true, options, env, slf);
        content += data.content;
        cell += data.tsv;
        cellCsv += data.csv;
        cellMd += data.tableMd;
        cellSmoothed += data.tableSmoothed;
        cellLinerTsv += data.liner_tsv;
      } else {
        content = slf.renderInline([{type: 'text', content: token.content}], options, env);
        cell += content;
        cellCsv += content;
        cellMd += content;
        cellSmoothed += content;
        cellLinerTsv += content;
      }
      result += content;
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
    align: align,
    liner_tsv: arrLinerTsv
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
  token.liner_tsv = data.liner_tsv;
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
