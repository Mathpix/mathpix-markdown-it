import { TsvJoin } from "./tsv";
import { CsvJoin } from "./csv";
import { getMdForChild, getMdLink } from "./table-markdown";
import { mathTokenTypes } from "./consts";
import { isWhitespace } from "../common";
const escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;

export type RenderTableCellContentResult = {
  /** Rendered HTML (or text) for the cell, depending on renderer/options. */
  content: string;
  /** TSV-safe representation of the cell. */
  tsv: string;
  /** CSV-safe representation of the cell. */
  csv: string;
  /** Markdown representation of the cell for table output. */
  tableMd: string;
  /** "Smoothed" representation used for PPTX/DOCX or other layout-sensitive outputs. */
  tableSmoothed: string;
};

/**
 * Renders a table cell token into multiple parallel representations:
 * HTML/text (`content`), TSV, CSV, Markdown (`tableMd`), and a "smoothed" variant
 * used for DOCX/PPTX where line wrapping and block-like inline tokens matter.
 *
 * This function is recursive: inline children may contain nested tabular content.
 *
 * @param token - Cell token (or inline token) whose children form the cell content.
 * @param isSubTable - True if the current token is being rendered inside a nested table context.
 * @param options - Rendering options (DOCX/PPTX/markdown math settings).
 * @param env - Markdown-it rendering environment.
 * @param slf - Markdown-it renderer instance (must support renderInline).
 * @returns Combined render outputs for this cell.
 */
export const renderTableCellContent = (
  token,
  isSubTable: boolean,
  options,
  env,
  slf
): RenderTableCellContentResult => {
  let content: string = '';
  let tsvCell = '';
  let csvCell = '';
  let mdCell = '';
  let smoothedCell = '';
  try {
    for (let j = 0; j < token.children.length; j++) {
      const child = token.children[j];
      if (child.type === "tabular_inline" || isSubTable) {
        child.isSubTable = true;
      }
      let childType = child.token || child.type;
      if (childType && ['inline', 'underline', 'out'].includes(childType)) {
        const cellRender: RenderTableCellContentResult = renderTableCellContent(child, true, options, env, slf);
        if (cellRender) {
          content += cellRender.content;
          tsvCell += cellRender.tsv;
          csvCell += cellRender.csv;
          mdCell += cellRender.tableMd;
          smoothedCell += cellRender.tableSmoothed;
        }
        continue;
      }
      if ((options.forDocx || options.forPptx) &&
        child.type === 'text' && isWhitespace(child.content)) {
        const prev = token.children[j - 1];
        const next = token.children[j + 1];
        if (prev?.type === 'latex_lstlisting_env' && next?.type === 'latex_lstlisting_env') {
          content += slf.renderInline([{type: 'softbreak', tag: 'br', nesting: 0}], options, env);
          continue;
        }
      }
      if (options?.forMD) {
        child.meta = { ...(child.meta ?? {}), isTableCell: true };
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
      const tsvData = child.tsv ? child.tsv.join(',') : child.content;
      const csvData = child.csv ? child.csv.join(',') : child.content;
      if (ascii) {
        tsvCell += ascii;
        csvCell += csvAscii;
      } else if (token.type === 'subTabular') {
        if (token.parents?.length || ["backslashbox", "slashbox"].includes(child.type)) {
          tsvCell += tsvData;
          csvCell += csvData;
        } else {
          tsvCell += child.tsv ? `"${TsvJoin(child.tsv, options)}"` : child.content;
          csvCell += child.csv ? CsvJoin(child.csv, options, true) : child.content;
        }
      } else {
        tsvCell += tsvData;
        csvCell += csvData;
      }

      switch (child.type) {
        case 'link_open': {
          const href = child.attrGet('href');
          tsvCell += href;
          csvCell += href;
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
          const prev = token.children[j - 1];
          const next = token.children[j + 1];
          mdCell += prev?.type === 'latex_lstlisting_env' && next?.type === 'latex_lstlisting_env'
            ? ''
            : ' ';
          continue;
        case 'image':
        case 'includegraphics': {
          const src = child.attrGet('src');
          tsvCell += src;
          csvCell += src;
          mdCell += options?.forMD
            ? rendered
            : `![${child.attrGet('alt') ?? ''}](${src})`.replace(/\|/g, '\\|');
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
        case "latex_lstlisting_env": {
          let escape = escapeHtml(child.content);
          let mdContent = escape.split('\n').join('<br>');
          mdContent = mdContent.replace(/\|/g, '&#124');
          mdCell += `<pre><code>${mdContent}</code></pre>`;
          continue;
        }
        case 'underline_open':
        case 'underline_close':
        case 'out_open':
        case 'out_close':
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
        mdCell += child?.content ? child.content.replace(/\|/g, '\\|') : '';
      }
    }
    return {
      content,
      tsv: tsvCell,
      csv: csvCell,
      tableMd: mdCell,
      tableSmoothed: smoothedCell,
    };
  } catch (e) {
    return {
      content,
      tsv: tsvCell,
      csv: csvCell,
      tableMd: mdCell,
      tableSmoothed: smoothedCell,
    };
  }
};
