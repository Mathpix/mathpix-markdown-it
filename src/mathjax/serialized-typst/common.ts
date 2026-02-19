export interface ITypstData {
  typst: string;
}

export const initTypstData = (): ITypstData => {
  return { typst: '' };
};

export const addToTypstData = (
  dataOutput: ITypstData,
  dataInput: ITypstData
): ITypstData => {
  dataOutput.typst += dataInput.typst;
  return dataOutput;
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
