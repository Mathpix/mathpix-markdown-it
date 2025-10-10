export interface IAsciiData {
  ascii: string,
  liner: string,
  ascii_tsv?: string,
  ascii_csv?: string,
  ascii_md?: string
}

export const initAsciiData = (): IAsciiData => {
  return {
    ascii: '',
    liner: '',
    ascii_tsv: '',
    ascii_csv: '',
    ascii_md: '',
  }
}

export const AddToAsciiData = (
  dataOutput: IAsciiData,
  dataInput: IAsciiData
): IAsciiData => {
  dataOutput.ascii += dataInput.ascii;
  dataOutput.liner += dataInput.hasOwnProperty('liner')
    ? dataInput.liner
    : dataInput.ascii;
  dataOutput.ascii_tsv += dataInput.hasOwnProperty('ascii_tsv')
      ? dataInput.ascii_tsv
      : dataInput.ascii;
  dataOutput.ascii_csv += dataInput.hasOwnProperty('ascii_csv')
    ? dataInput.ascii_csv
    : dataInput.ascii;
  dataOutput.ascii_md += dataInput.hasOwnProperty('ascii_md')
    ? dataInput.ascii_md
    : dataInput.ascii;
  return dataOutput;
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

export const hasOnlyOneMoNode = (node): boolean => {
  if (node?.kind === 'mo') {
    return node.childNodes?.length === 1
  }
  if (node.kind === 'inferredMrow' && node?.childNodes?.length === 1) {
    return hasOnlyOneMoNode(node.childNodes[0])
  }
  if (node.kind === 'TeXAtom' && node?.childNodes?.length === 1) {
    return hasOnlyOneMoNode(node.childNodes[0])
  }
  return false;
}
