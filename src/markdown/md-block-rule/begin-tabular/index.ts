import { RuleBlock, Token } from 'markdown-it';
import { ParseTabular } from './parse-tabular';
import { pushError, CheckParseError } from '../parse-error';
import { getParams } from './common';
import {StatePushIncludeGraphics} from "../../md-inline-rule/includegraphics";
import { getSubCode, codeInlineContent } from "./sub-code";
import { findOpenCloseTags } from "../../utils";
import { openTagTabular, closeTagTabular } from "../../common/consts";

export const openTag: RegExp = /(?:\\begin\s{0,}{tabular}\s{0,}\{([^}]*)\})/;
export const openTagG: RegExp = /(?:\\begin\s{0,}{tabular}\s{0,}\{([^}]*)\})/g;
export const closeTag: RegExp = /(?:\\end\s{0,}{tabular})/;
const closeTagG: RegExp = /(?:\\end\s{0,}{tabular})/g;

type TTypeContent = {type?: string, content?: string, align?: string}
type TTypeContentList = Array<TTypeContent>;
export type TAttrs = string[];
export type TTokenTabular = {token: string, type: string, tag: string, n: number, content?: string,
  attrs?: Array<TAttrs>, children?: Token, id?: string, ascii?: string, ascii_tsv?: string, ascii_csv?: string, ascii_md?: string, latex?: string};


export type TMulti = {mr?: number, mc?: number, attrs: Array<TAttrs>, content?: string, subTable?: Array<TTokenTabular>, latex: string}

const addContentToList = (str: string): TTypeContentList => {
  let res: TTypeContentList = [];
  const match: RegExpMatchArray = str.match(/(?:\\begin\s{0,}{tabular})/);
  if (match) {
    let params = getParams(str, match.index + match[0].length);
    if (params) {
      if (match.index > 0) {
        res.push({type: 'inline', content: str.slice( 0, match.index), align: ''});
      }
      res.push({type: 'tabular', content: str.slice( params.index), align: params.align});
    } else {
      let mB: RegExpMatchArray = str
        .match(openTag);
      if (mB) {
        if (mB.index > 0) {
          res.push({type: 'inline', content: str.slice( 0, mB.index), align:''});
        }
        res.push({type: 'tabular', content: str.slice( mB.index + mB[0].length), align: mB[1]});
      } else {
        res.push({type: 'inline', content: str, align:''});
      }
    }
  } else {
    res.push({type: 'inline', content: str, align:''});
  }
  return res;
};

export const parseInlineTabular = (str: string): TTypeContentList | null => {
  str = getSubCode(str);
  let mB: RegExpMatchArray = str.match(openTagG);
  let mE: RegExpMatchArray = str.match(closeTagG);
  if (!mB || !mE) {
    if (mB && !mE) {
      pushError('Not found end{tabular}!')
    }
    if (!mB && mE) {
      pushError('Not found begin{tabular}!')
    }
    return null;
  }
  if (mB.length !== mE.length) {
    pushError('Open and close tags mismatch!');
    return null;
  }

  let res:TTypeContentList = [];
  let pos: number = 0;
  let posB: number = 0;
  let posE: number = 0;
  for (let i = 0; i< str.length; i++) {
    const matchB = str
      .slice(posB)
      .match(openTag);

    const matchE = str
      .slice(posE)
      .match(closeTag);

    if (!matchB) {
      if (!matchE) {
        res.push({type: 'inline', content: str.slice(posE)});
        break;
      }
      res.push({type: 'tabular', content: str.slice(pos, matchE.index), align: ''});
      break;
    } else {
      if (!matchE) {
        res = res.concat(addContentToList(str.slice( posB, posB + matchB.index+matchB[0].length)));
        break;
      }
    }

    if (posB + matchB.index > posE + matchE.index ) {
      res = res.concat(addContentToList(str.slice(pos, pos + matchE.index)));
      posB += matchE.index + matchE[0].length;
      pos += matchE.index + matchE[0].length;
      i = posB;
      posE = posB;
    } else {
      posB += matchB.index + matchB[0].length;
      if (openTag.test(str.slice(posB, posE + matchE.index + matchE[0].length))) {
        posE += matchE.index + matchE[0].length;
      } else {
        res = res.concat(addContentToList(str.slice(pos, posE + matchE.index)));
        posE = posE + matchE.index + matchE[0].length;
        pos = posE;
        posB = posE;
      }
    }
  }
  res = codeInlineContent(res, 'inline');
  return res;
};

const StatePushParagraphOpen = (state, startLine: number, align: string, centerTables = false) => {
  let token: Token;
  token = state.push('paragraph_open', 'div', 1);
  token.attrs = [['class', 'table_tabular ']];
  token.parentType = 'table_tabular';
  if (align) {
    token.attrs.push(['style', `text-align: ${align}`]);
  } else {
    if (centerTables) {
      token.attrs.push(['style', `text-align: center}`]);
    }
  }
  if (centerTables && state.md.options.forLatex) {
    token.attrs.push(['data-align', align])
  }
  token.map = [startLine, state.line];
};

const StatePushParagraphClose = (state) => {
  let token: Token;
  token = state.push('paragraph_close', 'div', -1);
  token.parentType = 'table_tabular';
};

export const inlineDecimalParse = (tok: TTokenTabular) => {
  tok.token = 'inline';
  tok.tag = '';
  tok.children = [];
  tok.children.push({
    type: "inline_decimal",
    content: tok.content,
    block: false,
    ascii: tok.ascii,
    ascii_tsv: tok.ascii_tsv,
    ascii_csv: tok.ascii_csv,
    ascii_md: tok.ascii_md,
    latex: tok.ascii
  });
  return tok;
};

export const StatePushTabulars = (state, cTabular: TTypeContentList, align: string, startLine: number) => {
  let token: Token;
  for (let i = 0; i < cTabular.length; i++) {
    if (cTabular[i].type === 'inline') {
      if (!StatePushIncludeGraphics(state, -1, -1, cTabular[i].content, align)) {
        token = state.push('inline', '', 0);
        token.children = [];
        token.content = cTabular[i].content;
      }
      continue;
    }

    token = state.push("tabular", "", 0);
    token.content = cTabular[i].content;
    token.children = [];
    token.map = [startLine, state.line];
    token.bMarks = 0;

    const res: Array<TTokenTabular> | null = ParseTabular(cTabular[i].content, 0, cTabular[i].align, state.md.options);
    if (!res || res.length === 0) {
      continue;
    }

    for (let j = 0; j < res.length; j++) {
      let tok:Token = res[j];
      if (res[j].token === 'inline') {
        tok.block = true;
        if (res[j].content) {
          let children = [];
          state.env.tabulare = state.md.options.outMath.include_tsv
            || state.md.options.outMath.include_csv
            || (state.md.options.outMath.include_table_markdown
              && state.md.options.outMath.table_markdown && state.md.options.outMath.table_markdown.math_as_ascii);
          state.env.subTabular = res[j].type === 'subTabular';
          state.md.inline.parse(tok.content, state.md, state.env, children);
          state.env.tabulare = false;
          if (children.length > 0) {
            tok.content  = '';
            tok.children = children;
          } else {
            tok.content  = res[j].content;
            tok.children = [];
          }
        }
      } else {
          if (res[j].token === 'inline_decimal') {
            tok = inlineDecimalParse(tok);
          } else {
            tok.content  = res[j].content;
            tok.children = [];
          }
      }
      token.children.push(tok)
    }
  }
};


export const StatePushDiv = (state, startLine: number, nextLine: number, content: string) => {
  let token: Token;
  state.line = nextLine;
  token = state.push('paragraph_open', 'div', 1);
  token.map = [startLine, state.line];
  token = state.push('inline', '', 0);
  token.children = [];
  token.content = content;
  state.push('paragraph_close', 'div', -1);
};

export const StatePushTabularBlock = (state, startLine: number, nextLine: number, content: string, align: string, centerTables = false): boolean => {
  const cTabular = parseInlineTabular(content);
  if (!cTabular || cTabular.length === 0) {
    return CheckParseError(state, startLine, nextLine, content)
  }
  state.line = nextLine;
  StatePushParagraphOpen(state, startLine, align, centerTables);
  StatePushTabulars(state, cTabular, align, startLine);
  StatePushParagraphClose(state);
  return true;
};

export const BeginTabular: RuleBlock = (state, startLine: number, endLine: number, silent) => {
  let pos: number = state.bMarks[startLine] + state.tShift[startLine];
  let max: number = state.eMarks[startLine];
  let nextLine: number = startLine + 1;

  let lineText: string = state.src.slice(pos, max);
  if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
    return false;
  }
  let dataTags = findOpenCloseTags(lineText, openTagTabular, closeTagTabular);
  let pending = dataTags?.pending ? dataTags.pending : '';
  if (!dataTags?.arrOpen?.length) {
    return false;
  }
  let iOpen: number = dataTags.arrOpen.length;
  let resString: string = lineText;
  if (dataTags?.arrClose?.length) {
    iOpen -= dataTags.arrClose.length;
  }
  /** For validation mode we can terminate immediately */
  if (silent) {
    return true;
  }
  for (; nextLine <= endLine; nextLine++) {
    dataTags = null;
    if (lineText === '') {
      if (iOpen === 0) {
        break;
      } 
      else {
        if (pending) {
          break;
        }
      }
    }
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);

    if (iOpen > 0) {
      dataTags = findOpenCloseTags(lineText, openTagTabular, closeTagTabular, pending);
      pending = dataTags?.pending;
      if (dataTags?.arrOpen?.length) {
        iOpen += dataTags.arrOpen.length;
      }      
      if (dataTags?.arrClose?.length) {
        iOpen -= dataTags.arrClose.length;
      }
    } else {
      lineText += '\n';
      break
      //if (state.isEmpty(nextLine)) { break }
    }

    resString += '\n' + lineText;
    if (state.sCount[nextLine] - state.blkIndent > 3) { continue; }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) { continue; }
  }
  if (state.md.options.centerTables) {
    return StatePushTabularBlock(state, startLine, nextLine, resString, 'center', true);
  } else {
    return StatePushTabularBlock(state, startLine, nextLine, resString, '');
  }
};
