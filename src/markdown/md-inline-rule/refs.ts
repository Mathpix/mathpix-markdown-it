import { RuleInline } from 'markdown-it';
const isSpace = require('markdown-it/lib/common/utils').isSpace;

export const refsInline: RuleInline = (state, silent) => {
  let startMathPos = state.pos;
  if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src
    .slice(++startMathPos)
    .match(/^(?:eqref\{(?<eqref>[^}]*)\}|ref\{(?<ref>[^}]*)\})/); // eslint-disable-line
  if (!match) {
    return false;
  }
  let type: string = 'reference_note';
  /** add parentheses so that instead of printing a plain number as 5, it will print (5). */
  let addParentheses: boolean = match[0].includes("eqref");
  let endMarker = '}';
  let endMarkerPos = state.src.indexOf(endMarker, startMathPos);
  if (endMarkerPos === -1) {
    return false;
  }
  const nextPos = endMarkerPos + endMarker.length;
  if (silent) {
    return true;
  }

  const token = state.push(type, "", 0);
  if (state.env.subTabular) {
    token.isSubTable = true;
  }
  if (state.md.options.forLatex) {
    token.markup = match[0];
  }
  token.content = match?.groups 
    ? match.groups.eqref || match.groups.ref 
    : "";
  token.attrSet("data-parentheses", addParentheses.toString());
  token.inputLatex = state.src.slice(state.pos, nextPos);
  token.inlinePos = {
    start: state.pos,
    end: nextPos,
    start_content: startMathPos,
    end_content: endMarkerPos
  };
  state.pos = nextPos;
  return true;
};

export const refInsideMathDelimiter: RuleInline = (state, silent) => {
  let startMathPos = state.pos;
  if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */
    && state.src.charCodeAt(startMathPos) !== 0x24 /* $ */) {
    return false;
  }
  const match = state.src
    .slice(startMathPos)
    .match(/^(?:\\\[|\[|\\\(|\(|\$\$|\$)/); // eslint-disable-line
  if (!match) {
    return false;
  }
  startMathPos += match[0].length;
  let type, endMarker; // eslint-disable-line
  if (match[0] === "\\[") {
    type = "display_math";
    endMarker = "\\]";
  } else if (match[0] === "\[") {
    type = "display_math";
    endMarker = "\\]";
  } else if (match[0] === "$$") {
    type = "display_math";
    endMarker = "$$";
  } else if (match[0] === "\\(") {
    type = "inline_math";
    endMarker = "\\)";
  } else if (match[0] === "\(") {
    type = "inline_math";
    endMarker = "\\)";
  } else if (match[0] === "$") {
    type = "inline_math";
    endMarker = "$";
  }
  const endMarkerPos = state.src.indexOf(endMarker, startMathPos);
  if (endMarkerPos === -1) {
    return false;
  }

  const nextPos = endMarkerPos + endMarker.length;
  let pos = startMathPos;
  for (; pos < endMarkerPos; pos++) {
    let code = state.src.charCodeAt(pos);
    if (!isSpace(code) && code !== 0x0A) { break; }
  }
  if (state.src.charCodeAt(pos) !== 0x5c /* \ */) {
    return false;
  }
  pos += 1;

  let refContent = state.src.slice(pos, endMarkerPos);
  const matchRef = refContent
    .match(/^(?:ref\{([^}]*)\})/);

  if (!matchRef) {
    return false;
  }
  
  let contentAfter = state.src.slice(pos+matchRef[0].length, endMarkerPos);
  if (contentAfter?.trim()?.length) {
    return false;
  }
  
  if (silent) {
    return true;
  }

  if (type === "display_math") {
    type = "reference_note_block";
  } else {
    type = "reference_note";
  }

  const token = state.push(type, "", 0);
  token.content = matchRef ? matchRef[1] : "";
  let children = [];
  state.md.inline.parse(token.content.trim(), state.md, state.env, children);
  token.children = children;
  token.inlinePos = {
    start: state.pos,
    end: nextPos
  };

  state.pos = nextPos;
  return true;
};
