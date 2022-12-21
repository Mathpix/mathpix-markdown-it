import { RuleInline } from 'markdown-it';
import {
  reNewTheorem,
  reNewTheoremNumbered,
  reNewTheoremNumbered2,
  reNewTheoremUnNumbered,
  reTheoremStyle,
  defTheoremStyle,
  reNewCommandQedSymbol,
  reSetCounter
} from "../common/consts";
import {
  addTheoremEnvironment,
  setCounterTheoremEnvironment,
  addEnvironmentsCounter
} from "./helper";
import {reNumber} from "../md-block-rule/lists";

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
  let useCounter = "";
  let match: RegExpMatchArray = state.src
    .slice(startPos)
    .match(reNewTheoremNumbered);
  if (match) {
    /**
     * \newtheorem{corollary}{Corollary}[theorem]
     * An environment called corollary is created, 
     * the counter of this new environment will be reset every time a new theorem environment is used.
     * */
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
      /**
       * \newtheorem{lemma}[theorem]{Lemma}
       * In this case, the even though a new environment called lemma is created, 
       * it will use the same counter as the theorem environment.
       * */
      envName = match.groups?.name ? match.groups.name : match[1];
      numbered = match.groups?.numbered ? match.groups.numbered : match[2];
      envPrint = match.groups?.print ? match.groups.print : match[3];
      nextPos += match[0].length;
      content = match[0];
      useCounter = numbered;
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
    parents: [],
    useCounter: useCounter,
    style: state.env?.theoremstyle ? state.env?.theoremstyle : defTheoremStyle
  });
  if (isNumbered) {
    addEnvironmentsCounter({
      environment: envName,
      counter: 0
    });
  }
  const token = state.push("newtheorem", "", 0);
  token.content = "";
  token.children = [];
  if (state.md.options.forLatex) {
    token.latex = content;
  }
  state.pos = nextPos;
  return true;
};

export const setCounterTheorem: RuleInline = (state) => {
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  let envName: string = "";
  let numStr: string = "";
  let nextPos: number = startPos;
  let content: string = "";
  let match: RegExpMatchArray = state.src
    .slice(startPos)
    .match(reSetCounter);

  if (!match) {
    return false;
  }
  content = match[0];
  nextPos += match[0].length;
  envName = match.groups?.name ? match.groups.name : match[1];
  if (!envName) {
    return false;
  }
  numStr = match.groups?.number ? match.groups.number : match[2];
  numStr = numStr ? numStr.trim() : '';
  const num = numStr && reNumber.test(numStr)
    ? Number(match[2].trim()) : 0;
  const res: boolean = setCounterTheoremEnvironment(envName, num);
  if (!res) {
    return false;
  }
  const token = state.push("theorem_setcounter", "", 0);
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
    .match(/^\\label\s{0,}\{([^}]*)\}/);
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
