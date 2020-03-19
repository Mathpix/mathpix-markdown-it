import { RuleInline, Token } from 'markdown-it';
import { TBegin, bItemTag } from "../md-block-rule/lists";

export const listCloseInline: RuleInline = (state, silent) => {
  let token: Token;
  let match: RegExpExecArray;
  let startMathPos: number = state.pos;
  const closeTag: RegExp = /^(?:end\s{0,}\{(itemize|enumerate)\})/;
  if (!state.env.isBlock ) {
    return false;
  }
  if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */ ) {
    return false;
  }
  if (silent) {
    return false;
  }
  match = state.src
    .slice(++startMathPos)
    .match(closeTag);
  if (!match){ return false}

  const type = match[1].trim() in TBegin ? match[1].trim() : null;
  if (!type) {
    return false;
  }

  if (type === TBegin.itemize) {
    token        = state.push('itemize_list_close', 'ul', -1);
  } else {
    token        = state.push('enumerate_list_close', 'ol', -1);
  }
  token.level -= 1;
  state.level -= 1;
  state.prentLevel = state.prentLevel > 0 ? state.prentLevel - 1 : 0;
  token.prentLevel = state.prentLevel;

  state.pos = startMathPos + match.index + match[0].length;
  return true
};

export const listBeginInline: RuleInline = (state, silent) => {
  let token: Token;
  let match: RegExpExecArray;
  let startMathPos: number = state.pos;
  const openTag: RegExp = /^(?:begin\s{0,}\{(itemize|enumerate)\})/;
  if (!state.env.isBlock ) {
    return false;
  }
  if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */ ) {
    return false;
  }
  if (silent) {
    return false;
  }
  match = state.src
    .slice(++startMathPos)
    .match(openTag);
  if (!match){ return false}

  const type = match[1].trim() in TBegin ? match[1].trim() : null;
  if (!type) {
    return false;
  }

  if (type === TBegin.itemize) {
    token        = state.push('itemize_list_open', 'ul', 1);
    state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
    state.parentType = 'itemize';
    state.types = ['itemize'];

  } else {
    token        = state.push('enumerate_list_open', 'ol', 1);
    state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
    state.parentType = 'enumerate';
    state.types = ['enumerate'];
  }
  token.prentLevel = state.prentLevel;
  state.pos = startMathPos + match.index + match[0].length;// + content.length;
  return true
};

export const listItemInline: RuleInline = (state, silent) => {
  let token: Token;
  let match: RegExpExecArray;
  let startMathPos: number = state.pos;
  const endItem: RegExp = /\\begin\s{0,}\{(itemize|enumerate)\}|\\end\s{0,}\{(itemize|enumerate)\}|\\item/;

  if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */ ) {
    return false;
  }
  if (silent) {
    return false;
  }

  match = state.src
    .slice(++startMathPos)
    .match(bItemTag);
  if (!match){ return false}

  const matchEnd = state.src
    .slice(startMathPos + match.index + match[0].length)
    .match(endItem);
  let content = matchEnd && matchEnd.index > 0
    ? state.src.slice(startMathPos + match.index + match[0].length, matchEnd.index+startMathPos + match.index + match[0].length)
    : state.src.slice(startMathPos + match.index + match[0].length)
  token        = state.push('item_inline', 'li', 0);
  token.parentType = state.parentType;
  let children = [];
  state.md.inline.parse(content.trim(), state.md, state.env, children);
  token.children = children;
  if (match[1]) {
    token.marker = match[1];
    let children = [];
    state.md.inline.parse(match[1], state.md, state.env, children);
    token.markerTokens = children;
  }
  state.pos = startMathPos + match.index + match[0].length + content.length;
  return true
};

export const listSetCounterInline: RuleInline = (state, silent) => {
  let token: Token;
  let match: RegExpExecArray;
  let startMathPos: number = state.pos;
  let content = '';
  const setcounterTag: RegExp = /^(?:setcounter\s{0,}\{([^}]*)\}\s{0,}\{([^}]*)\})/;
  if (!state.env.isBlock ) {
    return false;
  }
  if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */ ) {
    return false;
  }
  if (silent) {
    return false;
  }
  match = state.src
    .slice(++startMathPos)
    .match(setcounterTag);
  if (!match){ return false}

  if (match && match[2]) {
    content =  match[2];
  } else {
    return false;
  }

  token        = state.push('setcounter', '', 0);
  token.content = content;
  state.pos = startMathPos + match.index + match[0].length;
  return true
};
