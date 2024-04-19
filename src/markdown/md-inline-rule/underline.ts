import { RuleInline } from 'markdown-it';
const isSpace = require('markdown-it/lib/common/utils').isSpace;
import { findEndMarker } from "../common";

export const textUnderline: RuleInline = (state, silent) => {
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src
    .slice(++startPos)
    .match(/^(?:underline|uline|uuline|uwave|dashuline|dotuline)/); // eslint-disable-line
  if (!match) {
    return false;
  }
  startPos += match[0].length;
  let type: string = 'underline';
  let currentPadding = 0;
  switch (match[0]) {
    case "underline":
      type = "underline";
      currentPadding = 3;
      break;
    case "uline":
      type = "underline";
      currentPadding = 3;
      break;    
    case "uuline":
      type = "uuline";
      currentPadding = 6;
      break;
    case "uwave":
      type = "uwave";
      break;    
    case "dashuline":
      type = "dashuline";
      currentPadding = 4;
      break;    
    case "dotuline":
      type = "dotuline";
      currentPadding = 5;
      break;
    default:
      break;
  }
  if (!type || type === '') {
    return false;
  }
  //skipping spaces in begin
  for (; startPos < state.src.length; startPos++) {
    let code = state.src.charCodeAt(startPos);
    if (!isSpace(code) && code !== 0x0A) { break; }
  }
  let {res = false, content = '', nextPos = 0, endPos = 0 } = findEndMarker(state.src, startPos);
  if ( !res ) {
    return false;
  }
  if (!silent) {
    let children = [];
    state.md.inline.parse(content.trim(), state.md, state.env, children);
    let underlineLevel;
    let underlinePadding = 0;
    if (children?.find(item => item.type === "underline")) {
      let childLevel = 0;
      children.map(item => {
        if (item.type === "underline_open" || item.type === "underline_close") {
          item.isSubUnderline = true;
        }
        if (item.type === "underline") {
          if (!item.underlineLevel) {
            item.underlineLevel = 1
          }
          if (item.underlineLevel > childLevel) {
            childLevel = item.underlineLevel;
            underlinePadding = item.underlinePadding ? item.underlinePadding : 0;
          }
        }
      });
      underlineLevel = childLevel + 1;
      if (underlineLevel >= 2) {
        underlinePadding += currentPadding;
      }
    } else {
      underlineLevel = 1;
      if (type === 'uuline') {
        underlinePadding = 3;
      }
    }
    let token = state.push('underline_open', "", 0);
    token.inlinePos = {
      start: state.pos,
      end: startPos + 1
    };
    token.nextPos = startPos + 1;
    token.attrSet('data-underline-level', underlineLevel);
    token.attrSet('data-underline-type', type);
    token.underlineLevel = underlineLevel;
    token.isSubUnderline = false;
    token.underlineType = type;
    token.underlinePadding = underlinePadding;
    token.latex = match[0];

    token = state.push('underline', "", 0);
    if (state.md.options?.forDocx) {
      token.attrSet('data-underline-level', underlineLevel);
      token.attrSet('data-underline-type', type);
    }
    token.content = content;
    token.inlinePos = {
      start: startPos + 1,
      end: endPos,
    };
    token.nextPos = endPos;
    token.children = children;
    token.underlineLevel = underlineLevel;
    token.underlineType = type;
    token.underlinePadding = underlinePadding;

    token = state.push('underline_close', "", 0);
    token.underlineLevel = underlineLevel;
    token.isSubUnderline = false;
    token.underlineType = type;
    token.underlinePadding = underlinePadding;
  }
  state.pos = nextPos;
  state.nextPos = nextPos;
  return true;
};

export const textOut: RuleInline = (state, silent) => {
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src
    .slice(++startPos)
    .match(/^(?:sout|xout)/); // eslint-disable-line
  if (!match) {
    return false;
  }
  startPos += match[0].length;
  let type: string = 'out';
  switch (match[0]) {
    case "sout":
      type = "sout";
      break;
    case "xout":
      type = "xout";
      break;
    default:
      break;
  }
  if (!type || type === '') {
    return false;
  }
  //skipping spaces in begin
  for (; startPos < state.src.length; startPos++) {
    let code = state.src.charCodeAt(startPos);
    if (!isSpace(code) && code !== 0x0A) { break; }
  }
  let {res = false, content = '', nextPos = 0, endPos = 0 } = findEndMarker(state.src, startPos);
  if ( !res ) {
    return false;
  }

  if (!silent) {
    let token = state.push('out_open', "", 0);
    token.inlinePos = {
      start: state.pos,
      end: startPos + 1
    };
    token.nextPos = startPos + 1;
    token.attrSet('data-out-type', type);
    token.underlineType = type;
    token.latex = match[0];

    token = state.push('out', "", 0);
    if (state.md.options?.forDocx) {
      token.attrSet('data-out-type', type);
    }
    token.content = content;
    token.inlinePos = {
      start: startPos + 1,
      end: endPos,
    };
    token.nextPos = endPos;
    token.children = [];

    let children = [];
    state.md.inline.parse(token.content.trim(), state.md, state.env, children);
    token.children = children;
    token.underlineType = type;

    token = state.push('out_close', "", 0);
    token.underlineType = type;
  }
  state.pos = nextPos;
  state.nextPos = nextPos;
  return true;
};
