import { RuleInline } from 'markdown-it';
import {
  reNewTheorem,
  reNewTheoremNumbered,
  reNewTheoremNumbered2,
  reNewTheoremUnNumbered,
  reTheoremStyle,
  defTheoremStyle,
  reNewCommandQedSymbol,
  labelTag
} from "../common/consts";
import { addTheoremEnvironment } from "./helper";

/**
 * \theoremstyle{definition} | \theoremstyle{plain} | \theoremstyle{remark}
 * The command \theoremstyle{ } sets the styling for the numbered environment defined right below it
 *   {definition} - boldface title, Roman body. Commonly used in definitions, conditions, problems and examples.
 *   {plain} - boldface title, italicized body. Commonly used in theorems, lemmas, corollaries, propositions and conjectures.
 *   {remark} - italicized title, Roman body. Commonly used in remarks, notes, annotations, claims, cases, acknowledgments and conclusions.
 * */
export const theoremStyle: RuleInline = (state) => {
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  let nextPos: number = startPos;
  let content: string = "";
  let latex: string = "";
  const match: RegExpMatchArray = state.src
    .slice(startPos)
    .match(reTheoremStyle);
  if (!match) {
    return false;
  }
  latex = match[0];
  content = match[1];
  nextPos += match[0].length;
  state.env.theoremstyle = content;
  const token = state.push("theoremstyle", "", 0);
  token.content = "";
  token.children = [];
  if (state.md.options.forLatex) {
    token.latex = latex;
  }
  state.pos = nextPos;
  return true;
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
  let isNumbered: boolean = true;
  let match: RegExpMatchArray = state.src
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
        match = state.src
          .slice(startPos)
          .match(reNewTheoremUnNumbered);
        if (match) {
          envName = match.groups?.name ? match.groups.name : match[1];
          envPrint = match.groups?.print ? match.groups.print : match[2];
          nextPos += match[0].length;
          content = match[0];
          isNumbered = false;
        } else {
          return false;
        }
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
    isNumbered: isNumbered,
    counterName: numbered,
    style: state.env?.theoremstyle ? state.env?.theoremstyle : defTheoremStyle
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

/**
 * \renewcommand\qedsymbol{$\blacksquare$}
 * \renewcommand\qedsymbol{QED}
 */
export const newCommandQedSymbol: RuleInline = (state) => {
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  let nextPos: number = startPos;
  let content: string = "";
  let latex: string = "";
  let match: RegExpMatchArray = state.src
    .slice(startPos)
    .match(reNewCommandQedSymbol);
  if (!match) {
    return false;
  }
  latex = match[0];
  content = match[1];
  nextPos += match[0].length;
  state.env.qedsymbol = content;
  const token = state.push("renewcommand_qedsymbol", "", 0);
  token.content = "";
  token.children = [];
  if (state.md.options.forLatex) {
    token.latex = latex;
  }
  state.pos = nextPos;
  return true;
};

export const labelLatex: RuleInline = (state) => {
  if (!state.md.options.forLatex) {
    return false;
  }
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  let nextPos: number = startPos;
  let latex: string = "";
  let match: RegExpMatchArray =  state.src
    .slice(startPos)
    .match(labelTag);
  if (!match) {
    return false;
  }
  latex = match[0];
  nextPos += match[0].length;
  const token = state.push("label", "", 0);
  token.content = "";
  token.children = [];
  token.latex = latex;
  state.pos = nextPos;
  return true;
}