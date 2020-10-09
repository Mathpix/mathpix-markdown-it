import { MarkdownIt, RuleBlock } from 'markdown-it';
import { ChemistryDrawer } from './chemisrty-drawer';
import { ISmilesOptionsDef } from "./smiles-drawer/src/Drawer";
import { PREVIEW_LINE_CLASS, PREVIEW_PARAGRAPH_PREFIX } from "../rules";

export interface ISmilesOptions extends ISmilesOptionsDef {
  theme?: string,
}

function injectLineNumbersSmiles(tokens, idx, options, env, slf) {
  let line, endLine, listLine;
  const token = tokens[idx];

  if (token.map && token.level === 0) {
    line = token.map[0];
    endLine = token.map[1];
    listLine = [];
    for (let i = line; i < endLine; i++) {
      listLine.push(i);
    }
    token.attrJoin("class", PREVIEW_PARAGRAPH_PREFIX + String(line)
      + ' ' + PREVIEW_LINE_CLASS + ' ' + listLine.join(' '));
    token.attrJoin("data_line_start", `${String(line)}`);
    token.attrJoin("data_line_end", `${String(endLine-1)}`);
    token.attrJoin("data_line", `${String([line, endLine])}`);
    token.attrJoin("count_line", `${String(endLine-line)}`);
  }
  return slf.renderAttrs(token);
}

const slimesDrawerBlock: RuleBlock = (state, startLine: number, endLine: number, silent) => {
  let pos: number = state.bMarks[startLine] + state.tShift[startLine];
  let max: number = state.eMarks[startLine];
  let haveEndMarker;
  let token;
  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  if (pos + 3 > max) { return false; }

  let marker = state.src.charCodeAt(pos);

  if (marker !== 0x60 /* ` */) {
    return false;
  }

  // scan marker length
  let mem = pos;
  pos = state.skipChars(pos, marker);

  let len = pos - mem;

  if (len < 3) { return false; }

  let markup = state.src.slice(mem, pos);
  let params = state.src.slice(pos, max);

  if (params.indexOf(String.fromCharCode(marker)) >= 0) {
    return false;
  }

  if (params !== 'smiles') {
    return false;
  }
  // Since start is found, we can report success here in validation mode
  if (silent) { return true; }

  // search end of block
  let nextLine = startLine;

  for (;;) {
    nextLine++;
    if (nextLine >= endLine) {
      // unclosed block should be autoclosed by end of document.
      // also block seems to be autoclosed by end of parent
      break;
    }

    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
      // non-empty line with negative indent should stop the list:
      // - ```
      //  test
      break;
    }

    if (state.src.charCodeAt(pos) !== marker) { continue; }

    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      // closing fence should be indented less than 4 spaces
      continue;
    }

    pos = state.skipChars(pos, marker);

    // closing code fence must be at least as long as the opening one
    if (pos - mem < len) { continue; }

    // make sure tail has spaces only
    pos = state.skipSpaces(pos);

    if (pos < max) { continue; }

    haveEndMarker = true;
    // found!
    break;
  }


  // If a fence has heading spaces, they should be removed from its inner block
  len = state.sCount[startLine];

  state.line = nextLine + (haveEndMarker ? 1 : 0);

  token         = state.push('slimes', 'div', 0);
  token.info    = params;
  token.content = state.getLines(startLine + 1, nextLine, len, true);
  token.markup  = markup;
  token.map     = [ startLine, state.line ];

  return true;
};

const renderSlimesDrawerBlock = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  if (!token.content) {
    return '';
  }
  const id = `f${(+new Date).toString(16)}`;

  const resSvg = ChemistryDrawer.drawSvgSync(token.content.trim(), id, options);
  if (!resSvg) {
    return '';
  }

  const attrs = options?.lineNumbering
    ? injectLineNumbersSmiles(tokens, idx, options, env, slf)
    : '';
  if (attrs) {
    return `<div ${attrs}>${resSvg}</div>`
  }
  return `<div>${resSvg}</div>`
};

export default (md: MarkdownIt, options) => {
  Object.assign(md.options, options);

  md.block.ruler.before('fence', 'slimesDrawerBlock', slimesDrawerBlock);

  md.renderer.rules.slimes = (tokens, idx, options, env, slf) => {
    return renderSlimesDrawerBlock(tokens, idx, options, env, slf);
  }
};
