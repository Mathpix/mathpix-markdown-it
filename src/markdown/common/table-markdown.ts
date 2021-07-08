export const getMdLink = (child, token, j) => {
  if (child.type !== 'link_open') {
    return '';
  }

  let link = '';
  link += '[';
  const linkRef = `(${child.attrGet('href')})`;
  const nextChild = j+1 < token.children.length
    ? token.children[j+1]
    : null;

  if (!nextChild) {
    return '';
  }

  link += nextChild.content;
  link += ']';
  link += linkRef;

  return link;
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

