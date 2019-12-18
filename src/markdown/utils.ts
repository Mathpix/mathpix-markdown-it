export const endTag = (arg: string): RegExp  => {
  return new RegExp('\\\\end\s{0,}\{(' + arg + ')\}')
};

export const getTextWidth = (): number => {
  const el_container = document ? document.getElementById('container-ruller') : null;
  return el_container ? el_container.offsetWidth : 800;
};
