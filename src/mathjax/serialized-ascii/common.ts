export interface IAsciiData {
  ascii: string,
  ascii_tsv: string,
  ascii_csv: string,
  ascii_md: string,
}

export const AddToAsciiData = (data: IAsciiData, arr: Array<string>): IAsciiData => {
  if (arr?.length > 3) {
    data.ascii += arr[0];
    data.ascii_tsv += arr[1];
    data.ascii_csv += arr[2];
    data.ascii_md += arr[3];
    return data;
  }
  data.ascii += arr[0];
  data.ascii_tsv += arr[0];
  data.ascii_csv += arr[0];
  data.ascii_md += arr[0];
  return data;
};

export const getFunctionNameFromAscii = (ascii: string, node): string => {
  if (!ascii?.trim()) {
    return '';
  }
  ascii = ascii.trim();
  let text: string = '';
  switch (node.kind) {
    case 'mi':
      text = ascii;
      break;
    case 'msub':
    case 'msubsup': {
      let match: RegExpMatchArray = ascii.match(/^.*?(?=_)/);
      text = match[0].trim();
      break;
    }
    case 'msup': {
      let match: RegExpMatchArray = ascii.trim()?.match(/^.*?(?=\^)/);
      text = match[0].trim();
      break;
    }
  }
  return text;
}