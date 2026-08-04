import { mathTokenTypes } from "./consts";

const MATH_TOKEN_TYPES = new Set<string>(mathTokenTypes);
// Used with `replace` only, so the /g lastIndex is reset by the call and cannot leak between them.
const LINE_BREAKS_RE: RegExp = /[\r\n]+/g;
const HREF_NEEDS_ANGLES_RE: RegExp = /[\s<>]/;
const HREF_ANGLE_ESCAPE_RE: RegExp = /([<>\\])/g;
// Everything that can end or re-cut a label: the closing bracket, an opening one (which
// re-pairs with it), and a backslash (which would escape whatever we add after it).
const LABEL_ESCAPE_RE: RegExp = /([\\\[\]])/g;

const escapeLabel = (s: string): string => s.replace(LABEL_ESCAPE_RE, '\\$1');

// A bare destination ends at the first unbalanced `)`, so such an href needs the `<…>` form.
const hasUnbalancedParens = (href: string): boolean => {
  let depth = 0;
  for (let i = 0; i < href.length; i++) {
    if (href[i] === '(') { depth++; }
    if (href[i] === ')' && --depth < 0) { return true; }
  }
  return depth !== 0;
};

const mdHref = (href: string): string => {
  if (!href) {
    return '';
  }
  // A line break is invalid in a destination in either form, so drop it before deciding.
  const flat: string = href.replace(LINE_BREAKS_RE, '');
  return HREF_NEEDS_ANGLES_RE.test(flat) || hasUnbalancedParens(flat)
    // `\` too: a trailing one would escape the closing `>` and leave the destination open.
    ? '<' + flat.replace(HREF_ANGLE_ESCAPE_RE, '\\$1') + '>'
    : flat;
};

export const getMdLink = (child, token, j) => {
  if (child.type !== 'link_open') {
    return '';
  }

  if (j + 1 >= token.children.length) {
    return '';
  }
  // Read the whole link, not just the next token: formatted link text (`[**b** x](url)`) spans
  // several tokens, and taking only the first yielded an empty label.
  let text = '';
  let depth = 1;
  for (let i = j + 1; i < token.children.length; i++) {
    const inner = token.children[i];
    // No nested links in CommonMark; counted so a stitched stream can't end the label early.
    if (inner.type === 'link_open') {
      depth++;
    } else if (inner.type === 'link_close') {
      depth--;
      if (depth === 0) {
        break;
      }
    }
    if (inner.type === 'text') {
      text += escapeLabel(inner.content);
    } else if (inner.type === 'code_inline') {
      // Self-closing: same shape as the main cell loop — open marker, content, close marker.
      text += getMdForChild(inner) + inner.content + inner.markup;
    } else if (inner.type === 'smiles_inline') {
      // The other self-closing type getMdForChild gives a marker for; its closer is not in markup.
      text += getMdForChild(inner) + inner.content + '</smiles>';
    } else if (inner.type === 'link_open' || inner.type === 'link_close') {
      // Contributes nothing: a nested link has no Markdown form, and getMdForChild would hand
      // back a literal `<a>`.
    } else if (inner.type && MATH_TOKEN_TYPES.has(inner.type)) {
      // Verbatim, delimiters restored by type: escaping would turn every `\frac` into a LaTeX line
      // break. The `$` also shields an unbalanced `]` inside math, as long as the reader has a math
      // rule — a balanced pair (`\sqrt[3]{x}`) needs no shield, CommonMark pairs it itself.
      const mathDelimiter: string = inner.type === 'inline_math' ? '$' : '$$';
      text += mathDelimiter + (inner.content ?? '') + mathDelimiter;
    } else if (inner.type === 'image' || inner.type === 'includegraphics') {
      // Alt text as written, so a `]` in it already carries its backslash.
      text += inner.content ?? '';
    } else {
      // Raw markup and anything else: escaped, or a `]` truncates the label downstream.
      text += escapeLabel(getMdForChild(inner) || (inner.content ?? ''));
    }
  }
  return `[${text}](${mdHref(child.attrGet('href'))})`;
};

export const getMdForChild = (child): string => {
  let res = '';
  if (!child.tag) {
    switch (child.type) {
      case 'textbf_open':
      case 'textbf_close':
        res = '**';
        break;
      case 'textit_open':
      case 'textit_close':
        res = '*';
        break;
      case 'texttt_open':
      case 'texttt_close':
        res = '`';
        break;
      case 'smiles_inline':
        res = '<smiles>';
        break;
      case 'link_open':
        res = '<a>';
        break;
      case 'link_close':
        res = '</a>';
        break;
    }
    return res;
  }
  switch (child.tag) {
    case 'em':
    case 's':
    case 'strong':
    case 'mark':
    case 'code':
    // Else a label flattens `H~2~O` to `H2O`.
    case 'sub':
    case 'sup':
    case 'ins':
      res = child.markup;
      break;

  }

  return res;
};

export const tableMarkdownJoin = (tableMd, align = ''): string => {
  if (!tableMd || tableMd.length === 0 ) {
    return ''
  }

  const table = [];
  const alignArr = align.split('|');

  for (let i = 0; i < tableMd.length; i++) {
    const row = tableMd[i];
    const rowStr = '| ' + row.join(' | ') + ' |';
    table.push(rowStr);
    if (i === 0) {
      let header = '|';
      for (let j = 0; j < alignArr.length; j++) {
        const itemAlign = alignArr[j];
        switch (itemAlign) {
          case 'left':
            header += ' :--- |';
            break;
          case 'right':
            header += ' ---: |';
            break;
          case 'center':
            header += ' :---: |';
            break;
          default:
            header += ' --- |';
            break;
        }
      }
      table.push(header);
    }
  }
  return table.join("\n")
};

