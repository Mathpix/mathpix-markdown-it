import { Token } from 'markdown-it';
import { includegraphicsTag } from "./utils";

const parseParams = (str: string, align: string=''): {attr: Array<Array<string>>, align: string} |null => {
  if(!str) { return null}
  let params = [];
  let style: string = '';
  const res = [];
  str = str.replace(/ /g, '');
  if (str) {
    params = str.split(',')
  }
  for (let i = 0; i < params.length; i++) {
    const param = params[i].split('=');
    if ( ['left', 'right', 'center'].indexOf(param[0]) >= 0) {
      align = param[0];
    }
    switch (param[0]) {
      case 'width':
        style += `${param[0]}: ${param[1]};`;
        res.push(['width', param[1]]);
        break;
      case 'height':
        style += `${param[0]}: ${param[1]};`;
        res.push(['height', param[1]]);
        break;
      default:
        break;
    }
  }
  if (align) {
    res.push(['align', align]);
  }
  res.push(['style', style]);
  return style ? {attr: res,  align: align}: null;
};

const getAttrIncludeGraphics = (match: RegExpMatchArray, align: string) =>  {
  const href = match[2];
  const params = match[1] ? match[1].replace(/\]|\[/g, ''): '';

  const styles: {attr:Array<Array<string>>, align:string} = parseParams(params, align);
  let attrs = [[ 'src', href ], [ 'alt', '' ]];
  if (styles) {
    attrs = attrs.concat(styles.attr);
  }
  return { attrs, latex: params };
};

export const ParseIncludeGraphics = (str: string, i: number, align: string='') => {
  let res = [];

  let posB: number = 0;
  for (let i = 0; i< str.length; i++) {
    let match: RegExpMatchArray = str
      .slice(posB)
      .match(includegraphicsTag);
    if (!match) {
      if (str.slice(posB) && str.slice(posB).trim().length > 0) {
        res.push({token: 'inline', tag: '', n: 0,  content: str, pos: posB + str.length});
      }
      break
    }
    if (match.index > 0) {
      res.push({token: 'inline', tag: '', n: 0,  content: str.slice(posB, posB + match.index), pos: posB + match.index});
    }

    const { attrs, latex } = getAttrIncludeGraphics(match, align);

    posB += match.index + match[0].length;
    i = posB;
    res.push({token: 'includegraphics', tag: 'img', n: 0, attrs: attrs, content: '', pos: posB, latex: latex});
  }
  return res;
};

export const StatePushIncludeGraphics = (state, startLine: number, nextLine: number, content: string, align: string): boolean => {
  let token: Token;
  const res = ParseIncludeGraphics(content, 0, align);
  if (!res || res.length === 0) {
    return false;
  }
  if (nextLine >=0) {
    state.line = nextLine;
  }

  for (let j = 0; j < res.length; j++) {
    token          = state.push(res[j].token, res[j].tag, res[j].n);
    if (res[j].attrs) {
      token.attrs  = [].concat(res[j].attrs);
    }
    if (res[j].content) {
      token.content  = res[j].content;
      token.children = [];
    }
    if (state.md.options.forLatex && res[j].latex) {
      token.latex = res[j].latex;
    }
  }
  return true;
};

export const InlineIncludeGraphics = (state, silent) => {
 let startMathPos = state.pos;
  if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
    return false;
  }

  let match: RegExpMatchArray = state.src
    .slice(startMathPos)
    .match(includegraphicsTag);
  if (!match) {
    return false
  }


  const { attrs, latex } = getAttrIncludeGraphics(match, '');

  if (!silent) {
    const token = state.push( "includegraphics", "img", 0);
    token.attrs = attrs;
    token.content = '';
    if (state.md.options.forLatex) {
      token.latex = latex;
    }
  }
  state.pos = startMathPos + match.index + match[0].length;
  return true;
};
