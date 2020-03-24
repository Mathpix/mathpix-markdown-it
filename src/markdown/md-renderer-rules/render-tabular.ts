import {TsvJoin} from "../common/tsv";

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

const renderInlineTokenBlock = (tokens, options, env, slf) =>{
  let nextToken,
    result = '',
    needLf = false;

  let arrTsv = [];
  let arrRow = [];
  let cell = '';
  let colspan = 0, rowspan = [], mr = 0;

  for (let idx = 0; idx < tokens.length; idx++) {
    let token = tokens[idx];
    if (token.hidden) {
      return {table: '', tsv: ''};
    }

    if ( token.n !== -1 && idx && tokens[idx - 1].hidden) {
      result += '\n';
    }
    if (token.token === 'table_open' || token.token === 'tbody_open') {
      arrTsv = [];
      arrRow = []
    }
    if (token.token === 'tr_open') {
      arrRow = []
    }
    if (token.token === 'tr_close') {
      arrTsv.push(arrRow);
    }
    if (token.token === 'td_open') {
      cell = '';
      colspan = tokenAttrGet(token, 'colspan');
      colspan = colspan ? Number(colspan) : 0 ;
      mr = tokenAttrGet(token, 'rowspan');
      mr = mr ? Number(mr) : 0 ;
    }
    if (token.token === 'td_close') {
      const l = arrRow &&  arrRow.length > 0 ? arrRow.length  : 0;
      if (!mr && rowspan[l] && rowspan[l][0] > 0) {
        if (rowspan[l][1] && rowspan[l][1] > 1) {
          for (let i = 0; i < rowspan[l][1]; i++) {
            arrRow.push('');
          }
        } else {
          arrRow.push('');
        }
        rowspan[l][0] -= 1;
        arrRow.push(cell);
      } else {
        arrRow.push(cell);
        if (colspan && colspan > 1) {
          for (let i = 0; i < colspan-1; i++) {
            arrRow.push('');
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
        token.children.forEach(child => {
          content += slf.renderInline([child], options);
          if (child.ascii) {
            cell += child.ascii
          } else {
            cell += child.tsv ? child.tsv.join(',') : child.content;
          }
        })
      } else {
        content = slf.renderInline([{type: 'text', content: token.content}], options);
        cell += content;
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
  return {table: result, tsv:  arrTsv};
};

export const renderTabularInline = (a, token, options, env, slf) => {
  const {include_tsv = false, include_table_html = true} = options.outMath;
  let tabular = '';
  if (!include_tsv && !include_table_html) {
    return ''
  }
  const data = renderInlineTokenBlock(token.children, options, env, slf);
  token.tsv = data.tsv;

  if (include_table_html) {
    tabular = data.table;
  }
  const tsv = include_tsv && token.tsv
    ? `<tsv style="display: none">${TsvJoin(token.tsv,options)}</tsv>`
    : '';
  return `<div class="inline-tabular">${tabular}${tsv}</div>`
};
