import { Token } from 'markdown-it';
import * as parseLinkDestination from 'markdown-it/lib/helpers/parse_link_destination';
import { includegraphicsTag, includegraphicsTagB } from "./utils";
import { normalizeLink } from "../../helpers/normalize-link";

const parseParams = (str: string, align: string = ''): { attr: Array<[string, string]>, align: string } | null => {
  if (!str || !str.trim()) return null;
  const res: Array<[string, string]> = [];
  let style: string = '';
  let alt: string = '';
  // 1. Split the parameters by commas, taking into account the depth of the curly braces
  const parts: string[] = [];
  let buf: string = '';
  let depth: number = 0;
  for (let i = 0; i < str.length; i++) {
    const ch: string = str[i];
    if (ch === '{') {
      depth++;
      buf += ch;
    } else if (ch === '}') {
      depth = Math.max(0, depth - 1);
      buf += ch;
    } else if (ch === ',' && depth === 0) {
      if (buf.trim()) parts.push(buf.trim());
      buf = '';
    } else {
      buf += ch;
    }
  }
  if (buf.trim()) {
    parts.push(buf.trim());
  }
  // 2. For each parameter, look for the first '=' outside the brackets
  for (const part of parts) {
    let key: string = '';
    let value: string = '';
    depth = 0;
    let eqIndex: number = -1;
    for (let i = 0; i < part.length; i++) {
      const ch: string = part[i];
      if (ch === '{') {
        depth++;
      } else if (ch === '}') {
        depth = Math.max(0, depth - 1);
      } else if (ch === '=' && depth === 0) {
        eqIndex = i;
        break;
      }
    }
    if (eqIndex === -1) {
      // Parameter without '=' can be interpreted as a flag (e.g. align)
      key = part.trim();
      value = '';
    } else {
      key = part.slice(0, eqIndex).trim();
      value = part.slice(eqIndex + 1).trim();
    }
    // remove outer { } around value:
    if (value.startsWith('{') && value.endsWith('}')) {
      value = value.slice(1, -1);
    }
    if (['left', 'right', 'center'].includes(key)) {
      align = key;
    }
    switch (key) {
      case 'width':
        style += `width: ${value};`;
        res.push(['width', value]);
        break;
      case 'max width':
        style += `max-width: ${value};`;
        res.push(['max width', value]);
        break;
      case 'height':
        style += `height: ${value};`;
        res.push(['height', value]);
        break;
      case 'alt':
        res.push(['alt', value]);
        alt = value;
        break;
      default:
        break;
    }
  }
  if (align) {
    res.push(['align', align]);
  }
  if (!alt) {
    res.push(['alt', '']);
  }
  res.push(['style', style]);
  return { attr: res, align };
};

const getAttrIncludeGraphics = (match: RegExpMatchArray, align: string) =>  {
  let href = match[2];
  const res = href ? parseLinkDestination(href, 0, href.length) : null;
  if (res?.ok) {
    href = res.str;
    href = normalizeLink(href)
  }
  const params = match[1] ? match[1].replace(/\]|\[/g, ''): '';

  const styles: {attr:Array<Array<string>>, align:string} = parseParams(params, align);
  let attrs = [[ 'src', href ]];
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
      let content = str.slice(posB);
      if (content && content.trim().length > 0) {
        res.push({token: 'inline', tag: '', n: 0,  content: content, pos: posB + content.length});
      }
      break
    }
    if (match.index > 0) {
      res.push({token: 'inline', tag: '', n: 0,  content: str.slice(posB, posB + match.index), pos: posB + match.index});
    }

    const { attrs, latex } = getAttrIncludeGraphics(match, align);
    let inlinePos = {
      start: posB + match.index,
      end: posB
    };
    posB += match.index + match[0].length;
    i = posB;
    inlinePos.end = i;
    res.push({token: 'includegraphics', tag: 'img', n: 0, attrs: attrs, content: '', pos: posB, latex: latex, inlinePos: inlinePos});
  }
  return res;
};

export const StatePushIncludeGraphics = (state, startLine: number, nextLine: number, content: string, align: string): boolean => {
  let token: Token;
  if (!align && state.md.options.centerImages) {
    align = 'center';
  }
  const res = ParseIncludeGraphics(content, 0, align);
  if (!res || res.length === 0) {
    return false;
  }
  if (nextLine >=0) {
    state.line = nextLine;
  }

  for (let j = 0; j < res.length; j++) {
    token          = state.push(res[j].token, res[j].tag, res[j].n);
    token.map = [startLine, nextLine];
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
    if (res[j].inlinePos) {
      token.inlinePos = res[j].inlinePos;
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
    .match(includegraphicsTagB);
  if (!match) {
    return false
  }


  const { attrs, latex } = getAttrIncludeGraphics(match, '');

  if (!silent) {
    const token = state.push( "includegraphics", "img", 0);
    token.attrs = attrs;
    if (state.md.options.centerImages && state.env.align) {
      token.attrSet('data-align', state.env.align);
    }
    token.content = '';
    if (state.md.options.forLatex) {
      token.latex = latex;
    }
    token.inlinePos = {
      start: match.index,
      end: match.index + match[0].length
    }
  }
  state.pos = startMathPos + match.index + match[0].length;
  return true;
};
