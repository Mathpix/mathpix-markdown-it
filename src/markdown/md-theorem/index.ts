import { MarkdownIt, RuleBlock, RuleInline } from 'markdown-it';
import { SetTokensBlockParse } from"../md-block-rule/helper";
import { labelTag, labelTagG, latexEnvironments, mathEnvironments } from "../common/consts";
import { uid, endTag } from '../utils';

export interface ITheoremEnvironment {
  name: string,
  print: string,
  counter: number,
  counterName: string,
  isNumbered: boolean,
  lastNumber?: string,
  parentNumber?: string, 
}

let theoremEnvironments: Array<ITheoremEnvironment>  = [];
export let envNumbers = [];
export let theorems = [];
  
const reNewTheorem: RegExp = /\\newtheorem\s{0,}\{(?<name>[\w\s]+)\}\s{0,}\{(?<print>[\w\s]+)\}/;
const reNewTheoremNumbered: RegExp = /\\newtheorem\s{0,}\{(?<name>[\w\s]+)\}\s{0,}\{(?<print>[\w\s]+)\}\s{0,}\[(?<numbered>[\w\s]+)\]/;
const reNewTheoremNumbered2: RegExp = /\\newtheorem\s{0,}\{(?<name>[\w\s]+)\}\s{0,}\[(?<numbered>[\w\s]+)\]\s{0,}\{(?<print>[\w\s]+)\}/;

export const openTag: RegExp = /\\begin\s{0,}\{(?<name>[\w\s]+)\}/;
export const openTagDescription: RegExp = /\\begin\s{0,}\{(?<name>[\w\s]+)\}\s{0,}\[(?<description>[\w\s]+)\]/;


export const addTheoremEnvironment = (data: ITheoremEnvironment) => {
  const index = theoremEnvironments.findIndex(item => item.name === data.name);
  if (index === -1) {
    theoremEnvironments.push(data)
  }
};

export const getTheoremEnvironment = (name: string) => {
  return theoremEnvironments?.length 
    ? theoremEnvironments.find(item => item.name === name)
    : null;
};

export const getTheoremEnvironmentIndex = (name: string) => {
  return theoremEnvironments?.length 
    ? theoremEnvironments.findIndex(item => item.name === name)
    : -1;
};

export const resetTheoremEnvironments = () => {
  theoremEnvironments = [];
};

export const getTheoremNumberByLabel = (envLabel: string) => {
  const index = envNumbers.findIndex(item => item.label === envLabel);
  if (index === -1) {
    return '';
  }
  return envNumbers[index].number;
};

export const newTheoremBlock: RuleBlock = (state, startLine: number) => {
  let pos: number = state.bMarks[startLine] + state.tShift[startLine];
  let max: number = state.eMarks[startLine];
  let nextLine: number = startLine + 1;
  let endLine = state.lineMax;

  let lineText: string = state.src.slice(pos, max);
  
  const testNewTheorem = /\\newtheorem\s{0,}\{(?<name>[\w\s]+)\}/;
  if (!testNewTheorem.test(lineText)) {
    if (state.isEmpty(nextLine)) {
      return false;
    }
  } else {
    /** Get current rule */
    const children = [];
    state.md.inline.parse(lineText, state.md, state.env, children);
  }

  for (; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);
    
    if (!testNewTheorem.test(lineText)) {
      if (nextLine + 1 === endLine || state.isEmpty(nextLine + 1)) {
        break;
      }
    } else {
      /** Get current rule */
      const children = [];
      state.md.inline.parse(lineText, state.md, state.env, children);
    }
  }
  return false;
};

/**
 * \newtheorem{name}{print}[numbered]
 *   {name} - is the name of the environment
 *   {print} is the word to be shown in the document
 *   [numbered] - is the sectional unit based on which the environments is to be numbered (this is optional
 * */
export const newTheorem: RuleInline = (state) => {
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  let envName: string = "";
  let envPrint: string = "";
  let numbered: string = "";
  let nextPos: number = startPos;
  let content: string = "";

  let match = state.src
    .slice(startPos)
    .match(reNewTheoremNumbered);
  if (match) {
    envName = match.groups?.name ? match.groups.name : match[1];
    envPrint = match.groups?.print ? match.groups.print : match[2];
    numbered = match.groups?.numbered ? match.groups.numbered : match[3];
    nextPos += match[0].length;
    content = match[0];
  } else {
    match = state.src
      .slice(startPos)
      .match(reNewTheoremNumbered2);
    if (match) {
      envName = match.groups?.name ? match.groups.name : match[1];
      numbered = match.groups?.numbered ? match.groups.numbered : match[2];
      envPrint = match.groups?.print ? match.groups.print : match[3];
      nextPos += match[0].length;
      content = match[0];
    } else {
      match = state.src
        .slice(startPos)
        .match(reNewTheorem);
      if (match) {
        envName = match.groups?.name ? match.groups.name : match[1];
        envPrint = match.groups?.print ? match.groups.print : match[2];
        nextPos += match[0].length;
        content = match[0];
      } else {
        return false;
      }
    }
  }
  
  if (!envName || !envPrint) {
    return false;
  }

  addTheoremEnvironment({
    name: envName,
    print: envPrint,
    counter: 0,
    isNumbered: true,
    counterName: numbered
  });

  const token = state.push("newtheorem", "", 0);
  token.content = "";
  token.children = [];
  if (state.md.options.forLatex) {
    token.latex = content;
  }

  state.pos = nextPos;
  return true;
};

export const BeginEnvironmentBlock: RuleBlock = (state, startLine, endLine) => {
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
    resText = resText.replace(labelTagG, '')
  }

  const envIndex = envName
    ? getTheoremEnvironmentIndex(envName)
    : -1;
  const number = getTheoremNumber(envIndex, state.env);
  token = state.push('theorem_open', 'div', 1);
  token.environment = envName;
  token.envDescription = envDescription;
  token.envLabel = label;
  token.envNumber = number;
  state.env.theorem = {
    name: envName,
    label: label,
    number: number
  };

  theorems.push({
    id: uid(),
    name: envName,
    description: envDescription,
    label: label,
    number: number
  });

  if (label) {
    const index = envNumbers.findIndex(item => item.label === label);
    if (index === -1) {
      envNumbers.push({
        label: label,
        number: number
      })
    }
  }
  
  SetTokensBlockParse(state, resText, 0, 0, true);

  // token = state.push('inline', '', 0);
  // token.content = resText;
  // token.map = [startLine, state.line];
  // token.children = [];

  token = state.push('theorem_close', 'div', -1);
  token = state.push('paragraph_close', 'div', -1);
  return true;
};

const getTheoremNumber = (envIndex: number, env) => {
  const envItem = theoremEnvironments[envIndex];
  if (envItem.counterName) {
    let parentNum = "";
    switch (envItem.counterName) {
      case "section":
        parentNum = env?.section ? env.section.toString() : "0";
        break;      
      case "subsection":
        parentNum = env?.section ? env.section.toString() : "0";
        parentNum += ".";
        parentNum += env?.subsection ? env.subsection.toString() : "0";
        break;      
      case "subsubsection":
        parentNum = env?.section ? env.section.toString() : "0";
        parentNum += ".";
        parentNum += env?.subsection ? env.subsection.toString() : "0";        
        parentNum += ".";
        parentNum += env?.subsubsection ? env.subsubsection.toString() : "0";
        break;
    }
    if (!parentNum) {
      /** Find new env */
      const counterItem = getTheoremEnvironment(envItem.counterName);
      if (counterItem) {
        parentNum = counterItem.lastNumber;
      }
    }
    if (parentNum) {
      if (envItem.parentNumber !== parentNum) {
        envItem.parentNumber = parentNum;
        envItem.counter = 1;
      } else {
        envItem.counter += 1;
      }
      envItem.lastNumber = envItem.parentNumber + '.' + envItem.counter.toString();
      return envItem.lastNumber;
    } 
  }
  envItem.counter += 1;
  envItem.lastNumber = envItem.counter.toString();
  return envItem.counter
};

const renderTheoremOpen = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const envName = token.environment;
  const envDescription = token.envDescription;
  const envLabel = token.envLabel;
  const envNumber = token.envNumber;
  const envIndex = envName 
    ? getTheoremEnvironmentIndex(envName) 
    : -1;
  
  if (envIndex !== -1) {
    const envItem = theoremEnvironments[envIndex];
    const labelRef = envLabel ? encodeURIComponent(envLabel) : '';
    const description = envDescription 
      ? `<span style="font-weight: 600; font-style: normal; margin-right: 10px">(${envDescription})</span>`
      : '';
    const print = envItem.isNumbered 
      ? `<span style="font-weight: 600; font-style: normal; margin-right: ${description?"6px":"10px"}">${envItem.print} ${envNumber}</span>`
      : `<span style="font-weight: 600; font-style: normal; margin-right: ${description?"6px":"10px"}">${envItem.print}</span>`;
    return labelRef 
      ? `<div id="${labelRef}" class="theorem" style="font-style: italic;">` + print + description
      : '<div class="theorem" style="font-style: italic;">' + print + description;
  }
  return `<div class="theorem" style="font-style: italic;">`;
};

export const mappingTheorems = {
  newtheorem: "newtheorem",
  theorem_open: "theorem_open",
  theorem_close: "theorem_close"
};

export const renderTheorems = (md: MarkdownIt) => {
  Object.keys(mappingTheorems).forEach(key => {
    md.renderer.rules[key] = (tokens, idx, options, env = {}, slf) => {
      switch (tokens[idx].type) {
        case "newtheorem":
          return '';
        case "theorem_open":
          return renderTheoremOpen(tokens, idx, options, env, slf);        
        case "theorem_close":
          return "</div>";
        default:
          return '';
      }
    }
  })
};
