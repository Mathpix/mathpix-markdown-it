export interface ITypstData {
  typst: string;
  /** Inline-safe variant: same as typst when no block wrappers are used,
   *  otherwise contains pure math expressions without #math.equation() wrappers. */
  typst_inline?: string;
}

export const initTypstData = (): ITypstData => {
  return { typst: '' };
};

export const addToTypstData = (
  dataOutput: ITypstData,
  dataInput: ITypstData
): ITypstData => {
  dataOutput.typst += dataInput.typst;
  // Always propagate inline variant: use explicit typst_inline if set,
  // otherwise fall back to typst (inline == block for most nodes).
  dataOutput.typst_inline = (dataOutput.typst_inline ?? '')
    + (dataInput.typst_inline !== undefined ? dataInput.typst_inline : dataInput.typst);
  return dataOutput;
};

/** Add a separator space to both typst and typst_inline fields. */
export const addSpaceToTypstData = (data: ITypstData): void => {
  data.typst += ' ';
  if (data.typst_inline !== undefined) {
    data.typst_inline += ' ';
  }
};

/** Check if child at index i in a node's childNodes starts a thousand-separator
 *  pattern: mn, mo(,), mn(exactly 3 digits). Returns true if pattern matches. */
export const isThousandSepComma = (node: any, i: number): boolean => {
  try {
    if (i + 2 >= node.childNodes.length) return false;
    const child = node.childNodes[i];
    const comma = node.childNodes[i + 1];
    const next = node.childNodes[i + 2];
    return child?.kind === 'mn'
      && comma?.kind === 'mo' && (comma?.childNodes?.[0] as any)?.text === ','
      && next?.kind === 'mn' && /^\d{3}$/.test((next?.childNodes?.[0] as any)?.text || '');
  } catch (_e) {
    return false;
  }
};

export const needsParens = (s: string): boolean => {
  // In Typst, sub/superscript grouping always uses (): x^(content), x_(content)
  // Even if the content itself starts/ends with () — those are literal, not grouping.
  // e.g. f^{(n)} in LaTeX → f^((n)) in Typst (outer = grouping, inner = literal)
  if (s.length <= 1) {
    return false;
  }
  return true;
};
