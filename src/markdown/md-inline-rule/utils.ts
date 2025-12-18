export const endTag = (arg: string): RegExp  => {
  return new RegExp('\\\\end\s{0,}\{(' + arg + ')\}')
};

export const includegraphicsTag: RegExp = /\\includegraphics\s*(?:\[(.*?)\]\s*)?\{([^}]*)\}/s;
export const includegraphicsTagB: RegExp = /^\\includegraphics\s*(?:\[(.*?)\]\s*)?\{([^}]*)\}/s;
