export const endTag = (arg: string): RegExp  => {
  return new RegExp('\\\\end\s{0,}\{(' + arg + ')\}')
};

export const includegraphicsTag: RegExp = /\\includegraphics\s{0,}\[?([^}]*)\]?\s{0,}\{([^}]*)\}/;
