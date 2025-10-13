import { linerTsvJoin, TsvJoin } from "./tsv";
import { CsvJoin } from "./csv";
import { getMdForChild, getMdLink } from "./table-markdown";
import { mathTokenTypes } from "./consts";

export const renderTableCellContent = (token, isSubTable: boolean, options, env, slf) => {
  let content: string = '';
  let tsvCell = '';
  let csvCell = '';
  let mdCell = '';
  let smoothedCell = '';
  let linerCell = '';
  try {
    for (let j = 0; j < token.children.length; j++) {
      const child = token.children[j];
      if (child.type === "tabular_inline" || isSubTable) {
        child.isSubTable = true;
      }
      let rendered = slf.renderInline([child], options, env);
      const smoothedRendered = Array.isArray(child.tableSmoothed)
        ? child.tableSmoothed?.length > 0
          ? child.tableSmoothed.map(item => typeof item === 'string' ? item : item.join(' ')).join(' <br> ')
          : ''
        : rendered;
      smoothedCell += smoothedRendered;
      content += options.forPptx ? smoothedRendered : rendered;

      const ascii = child.ascii_tsv || child.ascii;
      const csvAscii = child.ascii_csv || child.ascii;
      const liner_tsv = child.liner_tsv || child.liner;
      const tsvData = child.tsv ? child.tsv.join(',') : child.content;
      const csvData = child.csv ? child.csv.join(',') : child.content;
      const linerTsvData = child.liner_tsv?.length > 0
        ? child.liner_tsv.map(item => typeof item === 'string' ? item : item.join(' ')).join('\n')
        : child.content;
      if (ascii) {
        tsvCell += ascii;
        csvCell += csvAscii;
        linerCell += liner_tsv;
      } else if (token.type === 'subTabular') {
        if (token.parents?.length) {
          tsvCell += tsvData;
          csvCell += csvData;
          linerCell += linerTsvData;
        } else {
          tsvCell += child.tsv ? `"${TsvJoin(child.tsv, options)}"` : child.content;
          csvCell += child.csv ? CsvJoin(child.csv, options, true) : child.content;
          linerCell += child.liner_tsv ? linerTsvJoin(child.liner_tsv) : child.content;
        }
      } else {
        tsvCell += tsvData;
        csvCell += csvData;
        linerCell += linerTsvData;
      }

      switch (child.type) {
        case 'link_open': {
          const href = child.attrGet('href');
          tsvCell += href;
          csvCell += href;
          linerCell += href;
          let link = getMdLink(child, token, j)
            .replace(/\|/g, '\\|');
          if (link) {
            mdCell += link;
            if (j + 1 < token.children.length) {
              content += slf.renderInline([token.children[++j]], options, env);
              j++;
            }
            if (j + 1 < token.children.length) {
              content += slf.renderInline([token.children[++j]], options, env);
              j++;
            }
          }
          continue;
        }
        case 'text':
          mdCell += child.content.replace(/\|/g, '\\|');
          continue;
        case 'softbreak':
          tsvCell += ' ';
          csvCell += ' ';
          mdCell += ' ';
          linerCell += '\n';
          continue;
        case 'image':
        case 'includegraphics': {
          const src = child.attrGet('src');
          tsvCell += src;
          csvCell += src;
          linerCell += src;
          mdCell += `![${child.attrGet('alt')}](${src})`.replace(/\|/g, '\\|');
          continue;
        }
        case 'code':
        case 'code_inline':
        case 'texttt': {
          mdCell += getMdForChild(child);
          mdCell += child.content;
          mdCell += child.markup;
          continue;
        }
        case 'smiles_inline':
          mdCell += getMdForChild(child);
          mdCell += child.content.replace(/\|/g, '\\|');
          mdCell += '</smiles>';
          continue;
      }

      if (child.tableMd?.length) {
        mdCell += child.tableMd.map(item => (typeof item === 'string' ? item : item.join(' '))).join(' <br> ');
        continue;
      }

      mdCell += getMdForChild(child);
      if (child.latex) {
        const { outMath } = options;
        if (outMath?.table_markdown?.math_as_ascii && ascii) {
          mdCell += child.ascii_md || ascii;
          continue;
        }
        let begin_math_inline_delimiters: string = '$';
        let end_math_inline_delimiters: string = '$';
        if (options.outMath?.table_markdown?.math_inline_delimiters?.length > 1) {
          begin_math_inline_delimiters = options.outMath.table_markdown.math_inline_delimiters[0];
          end_math_inline_delimiters = options.outMath.table_markdown.math_inline_delimiters[1];
        }
        let mdContent = mathTokenTypes.includes(child.type)
          ? begin_math_inline_delimiters + child.content?.trim() + end_math_inline_delimiters
          : child.latex;
        mdCell += mdContent
          .replace(/\|/g, '\\|')
          .replace(/\n/g, ' ');
      } else {
        mdCell += child.content.replace(/\|/g, '\\|');
      }
    }
    return {
      content,
      tsv: tsvCell,
      csv: csvCell,
      tableMd: mdCell,
      tableSmoothed: smoothedCell,
      liner_tsv: linerCell
    };
  } catch (e) {
    return {
      content,
      tsv: tsvCell,
      csv: csvCell,
      tableMd: mdCell,
      tableSmoothed: smoothedCell,
      liner_tsv: linerCell
    };
  }
};
