import { MarkdownIt, RuleBlock, RuleInline } from 'markdown-it';
import { ChemistryDrawer } from './chemistry-drawer';
import { ISmilesOptionsDef } from "./smiles-drawer/src/Drawer";
import { PREVIEW_LINE_CLASS, PREVIEW_PARAGRAPH_PREFIX } from "../rules";
import { uid } from '../utils';
import convertSvgToBase64 from "../md-svg-to-base64/convert-scv-to-base64";
import { reOpenTagSmiles } from "../common/consts";

export interface ISmilesOptions extends ISmilesOptionsDef {
  theme?: string,
  stretch?: boolean,
  scale?: number,
  fontSize?: number,
  disableColors?: boolean,
  disableGradient?: boolean,
  autoScale?: boolean,
  isTesting?: boolean,
  useCurrentColor?: boolean,
  supportSvg1?: boolean
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

const smilesDrawerBlock: RuleBlock = (state, startLine: number, endLine: number, silent) => {
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

  token         = state.push('smiles', 'div', 0);
  token.info    = params;
  let content = state.getLines(startLine + 1, nextLine, len, true);
  content = content.trim();
  content = content.replace(/\r|\n|\s+/g, '');
  token.content = content;
  token.markup  = markup;
  token.map     = [ startLine, state.line ];

  return true;
};

const smilesDrawerInline: RuleInline = (state) => {
  let startPos = state.pos;
  let beginMarker: RegExp = reOpenTagSmiles;
  let endMarker: string = '</smiles>';

  if (state.src.charCodeAt(startPos) !== 0x3C /* < */) {
    return false;
  }

  if (!beginMarker.test(state.src.slice(startPos))) {
    return false;
  }

  const match = state.src
    .slice(startPos)
    .match(beginMarker);

  if (!match) {
    return false;
  }

  startPos += match[0].length;
  const endPos = state.src.indexOf(endMarker, startPos);

  if (endPos === -1) { return false; }
  const nextPos = endPos + endMarker.length;
  let content = state.src.slice(startPos, endPos);
  content = content.trim();
  content = content.replace(/\s+/g, '');

  const token = state.push('smiles_inline', "", 0);

  token.content = content.trim();
  state.pos = nextPos;

  return true;
};

const renderSmilesDrawerBlock = (tokens, idx, options, env, slf) => {
  const { outMath = {} } = options;
  const { include_smiles = false, include_svg = true  } = outMath;
  const token = tokens[idx];
  if (!token.content) {
    return '';
  }
  const id = !options.isTesting
    ? uid()
    : '';

  let resSvg = include_svg || options.forDocx
    ? ChemistryDrawer.drawSvgSync(token.content.trim(), id, options)
    : '';


  if ( resSvg && (options.forDocx || options.forLatex ) ) {
    const imgId = options.forLatex ? id : '';
    resSvg = convertSvgToBase64(resSvg, imgId);
  }

  const attrs = options?.lineNumbering
    ? injectLineNumbersSmiles(tokens, idx, options, env, slf)
    : '';
  const outputSmiles = include_smiles
    ? '<smiles style="display: none">' + token.content.trim() + '</smiles>'
    : '';

  const maxWidth = options.maxWidth ? ` max-width: ${options.maxWidth}; overflow-x: auto;` : '';
  if (attrs) {
    return maxWidth
      ? `<div ${attrs}><div class="smiles" style="${maxWidth}">${outputSmiles}${resSvg}</div></div>`
      : `<div ${attrs}><div class="smiles">${outputSmiles}${resSvg}</div></div>`
  }
  return maxWidth
    ? `<div><div class="smiles" style="${maxWidth}">${outputSmiles}${resSvg}</div></div>`
    : `<div><div class="smiles">${outputSmiles}${resSvg}</div></div>`
};

const renderSmilesDrawerInline = (tokens, idx, options, env, slf) => {
  const { outMath = {} } = options;
  const { include_smiles = false, include_svg = true } = outMath;
  const token = tokens[idx];
  if (!token.content) {
    return '';
  }
  const id = !options.isTesting
    ? uid()
    : '';

  let resSvg = include_svg || options.forDocx
    ? ChemistryDrawer.drawSvgSync(token.content.trim(), id, options)
    : '';

  if ( resSvg && (options.forDocx || options.forLatex ) ) {
    const imgId = options.forLatex ? id : '';
    resSvg = convertSvgToBase64(resSvg, imgId);
  }

  const outputSmiles = include_smiles
    ? '<smiles style="display: none">' + token.content.trim() + '</smiles>'
    : '';

  const maxWidth = options.maxWidth ? ` max-width: ${options.maxWidth}; overflow-x: auto;` : '';
  return maxWidth
    ? `<div class="smiles-inline" style="display: inline-block;${maxWidth}">${outputSmiles}${resSvg}</div>`
    : `<div class="smiles-inline" style="display: inline-block">${outputSmiles}${resSvg}</div>`;
};

export default (md: MarkdownIt, options) => {
  Object.assign(md.options, options);

  md.block.ruler.before('fence', 'smilesDrawerBlock', smilesDrawerBlock, {
    alt: ["paragraph", "reference", "blockquote", "list"]
  });

  md.inline.ruler.before('html_inline', 'smilesDrawerInline', smilesDrawerInline);

  md.renderer.rules.smiles = (tokens, idx, options, env, slf) => {
    return renderSmilesDrawerBlock(tokens, idx, options, env, slf);
  };
  md.renderer.rules.smiles_inline = (tokens, idx, options, env, slf) => {
    return renderSmilesDrawerInline(tokens, idx, options, env, slf);
  }
};
