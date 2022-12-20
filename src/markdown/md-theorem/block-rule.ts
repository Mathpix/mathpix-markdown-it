import { RuleBlock } from 'markdown-it';
import { SetTokensBlockParse } from"../md-block-rule/helper";
import { endTag } from '../utils';
import {
  labelTag,
  labelTagG,
  latexEnvironments,
  mathEnvironments,
  openTag,
  openTagDescription,
  openTagProof,
  reNewCommandQedSymbolG,
  defQED,
  reTheoremStyleG,
  reSetCounterG
} from "../common/consts";
import {
  theoremEnvironments,
  envNumbers,
  getTheoremEnvironmentIndex,
  getTheoremNumber,
  getNextCounterProof
} from "./helper";

export const newTheoremBlock: RuleBlock = (state, startLine: number) => {
  let nextLine: number = startLine + 1;
  let endLine = state.lineMax;
  let terminate, i, l;
  let terminatorRules = state.md.block.ruler.getRules('paragraph')

  let content = '';
  let oldParentType = state.parentType;
  state.parentType = 'paragraph';

  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    if (state.sCount[nextLine] - state.blkIndent > 3) { continue; }
    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) { continue; }

    // Some tags can terminate paragraph without empty line.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }
  }

  content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

  const testNewTheorem = /\\newtheorem([^}]*)\s{0,}\{(?<name>[^}]*)\}/;
  if (!testNewTheorem.test(content) 
    && !reNewCommandQedSymbolG.test(content)
    && !reTheoremStyleG.test(content)
    && !reSetCounterG.test(content)
  ) {
    return false;
  }

  const children = [];
  state.md.inline.parse(content, state.md, state.env, children);

  let token;
  const newTheoremIndex = children?.length
    ? children.findIndex(item => (
      item.type === "newtheorem" 
      || item.type === "theoremstyle" 
      || item.type === "renewcommand_qedsymbol"
      || item.type === "theorem_setcounter" ))
    : -1;

  if (newTheoremIndex === -1) {
    return false;
  }

  const childrenFiltered = children.filter(
    item => (
      item.type !== "newtheorem"
      && item.type !== "theoremstyle"
      && item.type !== "softbreak"
      && item.type !== "renewcommand_qedsymbol"
      && item.type !== "theorem_setcounter"
    ));
  state.line = nextLine;
  token = state.push('paragraph_open', 'div', 1);
  if (childrenFiltered.length) {
    token.attrSet('style', 'margin-top: 0; margin-bottom: 1rem;');
  } else {
    token.attrSet('style', 'margin-top: 0; margin-bottom: 0;');
  }
  token.map = [startLine, state.line];
  token.children = [];
  token = state.push('inline', '', 0);
  token.content = "";
  token.children = [];

  let itemBefore = null;
  for (let j = 0; j < children.length; j++) {
    const item = children[j];
    if (item.type === "newtheorem" || item.type === "theoremstyle" 
      || item.type === "renewcommand_qedsymbol" || item.type === "theorem_setcounter") {
      itemBefore = item;
      if (state.md.options.forLatex) {
        token.children.push(item);
      }
      continue;
    }

    if ((itemBefore?.type === "newtheorem" || itemBefore?.type === "theoremstyle" 
      || itemBefore?.type === "renewcommand_qedsymbol" || itemBefore?.type === "theorem_setcounter")
      && item.type === "softbreak") {
      itemBefore = item;
      if (state.md.options.forLatex) {
        token.children.push(item);
      }
      continue;
    }
    token.children.push(item);
    itemBefore = item;
  }

  token = state.push('paragraph_close', 'div', -1);
  state.parentType = oldParentType;
  return true;
};

export const BeginTheorem: RuleBlock = (state, startLine, endLine) => {
  let pos: number = state.bMarks[startLine] + state.tShift[startLine];
  let max: number = state.eMarks[startLine];
  let token;

  let nextLine: number = startLine + 1;
  let lineText: string = state.src.slice(pos, max);
  let strBefore: string = "";

  let match: RegExpMatchArray = lineText.match(openTagDescription);
  if (!match) {
    match = lineText.match(openTag);
  }
  if (!match) {
    return false;
  }
  let envName = match.groups?.name ? match.groups.name : match[1];
  envName = envName ? envName.trim() : '';
  let envDescription = match.groups?.description
    ? match.groups.description
    : match[2] ? match[2] : '';
  envDescription = envDescription ? envDescription.trim() : '';

  if (!envName) {
    return false;
  }

  if (latexEnvironments.includes(envName) || mathEnvironments.includes(envName)) {
    /** Ignore already defined LaTeX environments */
    return false;
  }

  /** Inline content before theorem block */
  strBefore = match.index > 0 ? lineText.slice(0, match.index) : '';


  const closeTag = endTag(envName);

  // let content: string = '';
  let resText: string = '';
  let isCloseTagExist = false;

  if (closeTag.test(lineText)) {
    /**TODO: inline rule*/
    // if (InlineBlockBeginTable(state, startLine)) {
    //   return true;
    // }
  }

  if (match.index + match[0].length < lineText.trim().length) {
    resText = lineText.slice(match.index + match[0].length)
  }

  let latexBegin: string = match[0];
  let latexEnd: string = "";
  for (; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);

    if (closeTag.test(lineText)) {
      isCloseTagExist = true;
      lineText += '\n';
      break
    }
    if (resText && lineText) {
      resText += '\n' + lineText;
    } else {
      resText += lineText;
    }


    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) {
      continue;
    }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) {
      continue;
    }
  }

  if (!isCloseTagExist) {
    return false;
  }

  let matchE: RegExpMatchArray = lineText.match(closeTag);
  if (matchE) {
    resText += lineText.slice(0, matchE.index);
    latexEnd = matchE[0];
    // pE = matchE.index
  }
  
  state.line = nextLine + 1;
  token = state.push('paragraph_open', 'div', 1);
  token.map = [startLine, state.line];

  if (strBefore && strBefore?.trim()) {
    token = state.push('inline', '', 0);
    token.children = [];
    token.content = strBefore;
  }

  /** Get label from theorem content */
  let label = "";
  match = resText.match(labelTag);
  if (match) {
    label = match[1];
    if (!state.md.options.forLatex) {
      resText = resText.replace(labelTagG, '')
    }
  }

  const envIndex = envName
    ? getTheoremEnvironmentIndex(envName)
    : -1;
  if (envIndex === -1) {
    return false
  }
  const theoremNumber: string = getTheoremNumber(envIndex, state.env);
  token = state.push('theorem_open', 'div', 1);
  token.environment = envName;
  token.envDescription = envDescription;
  token.envLabel = label;
  token.envNumber = theoremNumber;

  const envItem = theoremEnvironments[envIndex];
  token.envStyle = envItem.style;
  
  if (state.md.options.forLatex) {
    token.latex = latexBegin;
  }

  if (!state.md.options.forLatex) {
    token = state.push("theorem_print_open", "", 0);
    token.envStyle = envItem.style;
    token.latex = envItem.print;
    token.content = "";
    token.children = [];
    token = state.push("inline", "", 0);
    token.content = envItem.print;
    token.children = [];
    token = state.push("theorem_print_close", "", 0);
    token.envNumber = theoremNumber;
    token.envStyle = envItem.style;
    token.envDescription = envDescription;
    token.environment = envName;
    token.content = "";
    token.children = [];
    
    if (envDescription) {
      token = state.push("theorem_description_open", "", 0);
      token.envStyle = envItem.style;
      token.envDescription = envDescription;
      token.latex = envDescription;
      token.content = "";
      token.children = [];
      token = state.push("inline", "", 0);
      token.content = envDescription;
      token.children = [];
      token = state.push("theorem_description_close", "", 0);
      token.envStyle = envItem.style;
      token.envDescription = envDescription;
      token.content = "";
      token.children = [];
    }
  }


  if (label) {
    const index = envNumbers.findIndex(item => item.label === label);
    if (index === -1) {
      envNumbers.push({
        label: label,
        number: theoremNumber
      })
    }
  }

  SetTokensBlockParse(state, resText, 0, 0, true);

  token = state.push('theorem_close', 'div', -1);
  if (state.md.options.forLatex) {
    token.latex = latexEnd;
  }
  token = state.push('paragraph_close', 'div', -1);
  return true;
};

export const BeginProof: RuleBlock = (state, startLine, endLine) => {
  let pos: number = state.bMarks[startLine] + state.tShift[startLine];
  let max: number = state.eMarks[startLine];
  let token;

  let nextLine: number = startLine + 1;
  let lineText: string = state.src.slice(pos, max);
  let strBefore: string = "";

  let match: RegExpMatchArray = lineText.match(openTagProof);
  if (!match) {
    return false;
  }
  let envName = match[1] ? match[1].trim() : '';
  if (!envName) {
    return false;
  }
  
  /** Inline content before proof block */
  strBefore = match.index > 0 ? lineText.slice(0, match.index) : '';
  const closeTag = endTag(envName);

  // let content: string = '';
  let resText: string = '';
  let isCloseTagExist = false;

  if (closeTag.test(lineText)) {
    /**TODO: inline rule*/
    // if (InlineBlockBeginTable(state, startLine)) {
    //   return true;
    // }
  }

  if (match.index + match[0].length < lineText.trim().length) {
    resText = lineText.slice(match.index + match[0].length)
  }

  let latexBegin: string = match[0];
  let latexEnd: string = "";
  for (; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);

    if (closeTag.test(lineText)) {
      isCloseTagExist = true;
      lineText += '\n';
      break
    }
    if (resText && lineText) {
      resText += '\n' + lineText;
    } else {
      resText += state.isEmpty(nextLine) ? '\n' :lineText;
    }


    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) {
      continue;
    }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) {
      continue;
    }
  }

  if (!isCloseTagExist) {
    return false;
  }

  let matchE: RegExpMatchArray = lineText.match(closeTag);
  if (matchE) {
    resText += lineText.slice(0, matchE.index);
    latexEnd = matchE[0];
    // pE = matchE.index
  }
  
  state.line = nextLine + 1;
  token = state.push('paragraph_open', 'div', 1);
  token.map = [startLine, state.line];

  if (strBefore && strBefore?.trim()) {
    token = state.push('inline', '', 0);
    token.children = [];
    token.content = strBefore;
  }

  /** Get label from proof content */
  let label = "";
  match = resText.match(labelTag);
  if (match) {
    label = match[1];
    resText = resText.replace(labelTagG, '')
  }
  
  const proofNumber: number = getNextCounterProof();
  token = state.push('proof_open', 'div', 1);
  token.envLabel = label;
  token.envNumber = proofNumber;
  if (state.md.options.forLatex) {
    token.latex = latexBegin;
  }

  if (label) {
    const index = envNumbers.findIndex(item => item.label === label);
    if (index === -1) {
      envNumbers.push({
        label: label,
        number: proofNumber.toString()
      })
    }
  }

  const contentQED = state.env.qedsymbol ? state.env.qedsymbol : defQED;
  
  let children = [];
  state.md.block.parse(resText, state.md, state.env, children);

  for (let j = 0; j < children.length; j++) {
    const child = children[j];
    
    if ((j === children.length - 1) && !state.md.options.forLatex) {
      token = state.push("qedsymbol_open", "", 0);
      token.content = "";
      token.children = [];      
      token = state.push("inline", "", 0);
      token.content = contentQED;
      token.children = [];
      token = state.push("qedsymbol_close", "", 0);
      token.content = "";
      token.children = [];
    }
    
    token = state.push(child.type, child.tag, child.nesting);
    token.attrs = child.attrs;
    if ( j === 0 && token.type === "paragraph_open") {
      if (token.attrs) {
        const style = token.attrGet('style');
        if (style) {
          token.attrSet('style', `display: inline; ` + style);
        } else {
          token.attrs.push(['style', `display: inline`]);
        }
      } else {
        token.attrSet('style', `display: inline`);
      }
      token.attrSet('data-display', 'inline');
    }
    if (startLine && endLine) {
      token.map = [startLine, endLine];
    }
    token.content = child.content;
    token.children = child.children;
  }
  
  token = state.push('proof_close', 'div', -1);
  if (state.md.options.forLatex) {
    token.latex = latexEnd;
  }
  token = state.push('paragraph_close', 'div', -1);
  return true;
};
