import { RuleInline } from 'markdown-it';
const isSpace = require('markdown-it/lib/common/utils').isSpace;
import { findEndMarker } from "../common";

export const textUnderline: RuleInline = (state) => {
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src
    .slice(++startPos)
    .match(/^(?:underline)/); // eslint-disable-line
  if (!match) {
    return false;
  }
  startPos += match[0].length;
  let type: string = 'underline';
  //skipping spaces in begin
  for (; startPos < state.src.length; startPos++) {
    let code = state.src.charCodeAt(startPos);
    if (!isSpace(code) && code !== 0x0A) { break; }
  }
  let {res = false, content = '', nextPos = 0, endPos = 0 } = findEndMarker(state.src, startPos);
  if ( !res ) {
    return false;
  }
  let children = [];
  state.md.inline.parse(content.trim(), state.md, state.env, children);
  let underlineType = 'inline';
  let underlineLevel;
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
        }
      }
    });
    underlineLevel = childLevel + 1;
  } else {
    underlineLevel = 1;
  }
  let token = state.push(type + '_open', "", 0);
  token.inlinePos = {
    start: state.pos,
    end: startPos + 1
  };
  token.nextPos = startPos + 1;
  token.attrSet('data-underline', underlineLevel);
  token.underlineLevel = underlineLevel;
  token.isSubUnderline = false;
  token.underlineType = underlineType;

  token = state.push(type, "", 0);
  if (state.md.options?.forDocx) {
    token.attrSet('data-underline', underlineLevel);
  }
  token.content = content;
  token.inlinePos = {
    start: startPos + 1,
    end: endPos,
  };
  token.nextPos = endPos;
  token.children = children;
  token.underlineLevel = underlineLevel;
  token.underlineType = underlineType;
  
  token = state.push(type + '_close', "", 0);
  token.underlineLevel = underlineLevel;
  token.isSubUnderline = false;
  token.underlineType = underlineType;
  state.pos = nextPos;
  state.nextPos = nextPos;
  return true;
};
