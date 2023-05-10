import { TsvJoin } from "../common/tsv";
import { CsvJoin } from "../common/csv";
import { tableMarkdownJoin, getMdForChild, getMdLink } from "../common/table-markdown";
import { mathTokenTypes } from "../common/consts";

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

export const renderInlineTokenBlock = (tokens, options, env, slf, isSubTable = false) =>{
  let nextToken,
    result = '',
    needLf = false;

  let arrTsv = [];
  let arrCsv = [];
  let arrMd = [];
  let arrRow = [];
  let arrRowCsv = [];
  let arrRowMd = [];
  let cell = '';
  let cellCsv = '';
  let cellMd= '';
  let align = '';
  let colspan = 0, rowspan = [], mr = 0;

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
      arrRow = [];
      arrRowCsv = [];
      arrRowMd = [];
      if (!align) {
        align = token.latex;
      }

    }
    if (token.token === 'tr_open') {
      arrRow = [];
      arrRowCsv = [];
      arrRowMd = [];
    }
    if (token.token === 'tr_close') {
      arrTsv.push(arrRow);
      arrCsv.push(arrRowCsv);
      arrMd.push(arrRowMd);
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
              }
            } else {
              arrRow.push('');
              arrRowCsv.push('');
              arrRowMd.push('');
            }
            rowspan[k][0] -= 1;
          }
        }
      }

    }
    if (token.token === 'td_open') {
      cell = '';
      cellCsv = '';
      cellMd = '';
      colspan = tokenAttrGet(token, 'colspan');
      colspan = colspan ? Number(colspan) : 0 ;
      mr = tokenAttrGet(token, 'rowspan');
      mr = mr ? Number(mr) : 0 ;
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
              }
            } else {
              arrRow.push('');
              arrRowCsv.push('');
              arrRowMd.push('');
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
      } else {
        arrRow.push(cell);
        arrRowCsv.push(cellCsv);
        arrRowMd.push(cellMd);
        if (colspan && colspan > 1) {
          for (let i = 0; i < colspan-1; i++) {
            arrRow.push('');
            arrRowCsv.push('');
            arrRowMd.push('');
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

        for (let j = 0; j < token.children.length; j++) {
          const child = token.children[j];
          if (child.type === "tabular_inline" || isSubTable) {
            child.isSubTable = true;
          }
          content += slf.renderInline([child], options);
          if (child.ascii) {
            cell += child.ascii_tsv ? child.ascii_tsv : child.ascii;
            cellCsv += child.ascii_csv ? child.ascii_csv : child.ascii;
          } else {
            if (token.type === 'subTabular') {
              if (token.parents?.length) {
                cell += child.tsv ? child.tsv.join(',') : child.content;
                cellCsv += child.csv ? child.csv.join(',') : child.content;
              } else {
                cell += child.tsv 
                  ? '"' + TsvJoin(child.tsv, options) + '"' 
                  : child.content;
                cellCsv += child.csv 
                  ? CsvJoin(child.csv, options, true)
                  : child.content;
              }
            } else {
              cell += child.tsv ? child.tsv.join(',') : child.content;
              cellCsv += child.csv ? child.csv.join(',') : child.content;
            }
          }


          if (child.type === 'link_open') {
            cell += child.attrGet('href');
            cellCsv += child.attrGet('href');
            let link = getMdLink(child, token, j);
            link = link.replace(/\|/, '\\|');
            if (link) {
              cellMd += link;
              if ((j + 1) < token.children.length) {
                content += slf.renderInline([token.children[j+1]], options);
                j++;
              }
              if ((j + 2) < token.children.length) {
                content += slf.renderInline([token.children[j+2]], options);
                j++;
              }
              continue;
            }
          }

          if (child.type === 'text') {
            let text = child.content;
            text = text.replace(/\|/, '\\|');
            cellMd += text;
            continue;
          }

          cellMd += getMdForChild(child);
          if (child.latex) {
            if (options.outMath && options.outMath.table_markdown && options.outMath.table_markdown.math_as_ascii) {
              if (child.ascii) {
                cellMd += child.ascii_md ? child.ascii_md : child.ascii;
                continue;
              }
            }
            const begin_math_inline_delimiters = options.outMath?.table_markdown?.math_inline_delimiters?.length > 1 
              ? options.outMath?.table_markdown?.math_inline_delimiters[0] : '$';            
            const end_math_inline_delimiters = options.outMath?.table_markdown?.math_inline_delimiters?.length > 1 
              ? options.outMath?.table_markdown?.math_inline_delimiters[1] : '$';
            let mdContent = mathTokenTypes.includes(child.type)
              ? begin_math_inline_delimiters + child.content?.trim() + end_math_inline_delimiters
              : child.latex;
            cellMd += mdContent                
              .replace(/\|/g, '\\|')
              .replace(/\n/g, ' ');
          } else {
            if (child.type === 'image' || child.type === 'includegraphics') {
              const src = child.attrGet('src');
              cell += src;
              cellCsv += src;
              let img = `![${child.attrGet('alt')}](${src})`;
              img = img.replace(/\|/, '\\|');
              cellMd += img;
            } else {
              let subTable = child.content.replace(/\|/, '\\|');
              if (child.tableMd && child.tableMd.length) {
                subTable = child.tableMd.map(item => (item.join(' '))).join(' <br> ');
              }
              cellMd += subTable;
            }
          }
          if (child.tag === 'code') {
            cellMd += child.markup;
            continue;
          }
          if (child.type === 'smiles_inline') {
            cellMd += '</smiles>';
          }

        }
      } else {
        content = slf.renderInline([{type: 'text', content: token.content}], options);
        cell += content;
        cellCsv += content;
        cellMd += content;
      }
      result += content;
      continue;
    }
    // Add token name, e.g. `<img`
    result += (token.n === -1 ? '</' : '<') + token.tag;

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
  }
  return {
    table: result, 
    tsv:  arrTsv, 
    csv:  arrCsv,
    tableMd: arrMd, 
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
  const data = renderInlineTokenBlock(token.children, options, env, slf, token.isSubTable);
  token.tsv = data.tsv;
  token.csv = data.csv;
  token.tableMd = data.tableMd;//tableMarkdownJoin(data.tableMd, data.align);

  if (include_table_html) {
    tabular = data.table;
  }
  const tsv = include_tsv && token.tsv
    ? `<tsv style="display: none">${TsvJoin(token.tsv,options)}</tsv>`
    : '';
  const tableMd = include_table_markdown && token.tableMd
    ? `<table-markdown style="display: none">${tableMarkdownJoin(data.tableMd, data.align)}</table-markdown>`
    : '';
  const csv = include_csv && token.csv
    ? `<csv style="display: none">${CsvJoin(token.csv,options)}</csv>`
    : '';
  return `<div class="inline-tabular">${tabular}${tsv}${tableMd}${csv}</div>`
};
