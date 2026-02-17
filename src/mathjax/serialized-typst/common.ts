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
  if (s.length <= 1) {
    return false;
  }
  if (/^\(.*\)$/.test(s) || /^\{.*\}$/.test(s) || /^\[.*\]$/.test(s)) {
    return false;
  }
  return true;
};
