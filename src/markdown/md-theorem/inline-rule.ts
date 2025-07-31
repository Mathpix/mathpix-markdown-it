import { RuleInline } from 'markdown-it';
const isSpace = require('markdown-it/lib/common/utils').isSpace;
import {
  reNewTheoremInit,
  reNewTheoremUnNumberedInit,
  reTheoremStyle,
  defTheoremStyle,
  reNewCommandQedSymbol,
  reSetCounter, RE_CAPTION_SETUP
} from "../common/consts";
import {
  addTheoremEnvironment,
  setCounterTheoremEnvironment,
  addEnvironmentsCounter
} from "./helper";
import {reNumber} from "../md-block-rule/lists";
import { findEndMarker } from "../common";
import { ILabel, addIntoLabelsList } from "../common/labels";

/**
 * \theoremstyle{definition} | \theoremstyle{plain} | \theoremstyle{remark}
 * The command \theoremstyle{ } sets the styling for the numbered environment defined right below it
 *   {definition} - boldface title, Roman body. Commonly used in definitions, conditions, problems and examples.
 *   {plain} - boldface title, italicized body. Commonly used in theorems, lemmas, corollaries, propositions and conjectures.
 *   {remark} - italicized title, Roman body. Commonly used in remarks, notes, annotations, claims, cases, acknowledgments and conclusions.
 * */
export const theoremStyle: RuleInline = (state, silent) => {
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
  if (!silent) {
    state.env.theoremstyle = content;
    const token = state.push("theoremstyle", "", 0);
    token.content = "";
    token.children = [];
    token.hidden = true;
    token.inlinePos = {
      start: state.pos,
      end: nextPos
    };
    if (state.md.options.forLatex) {
      token.latex = latex;
      token.hidden = false;
    }
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
export const newTheorem: RuleInline = (state, silent) => {
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  let max = state.posMax;
  let envName: string = "";
  let envPrint: string = "";
  let numbered: string = "";
  let nextPos: number = startPos;
  let content: string = "";
  let isNumbered: boolean = true;
  let useCounter = "";
  /** \newtheorem{name} - numbered theorem */
  let match: RegExpMatchArray = state.src
    .slice(startPos)
    .match(reNewTheoremInit);
  if (!match) {
    isNumbered = false;
    /** \newtheorem*{name} - unnumbered theorem */
    match = state.src
      .slice(startPos)
      .match(reNewTheoremUnNumberedInit);
  }
  if (!match) {
    return false;
  }
  envName = match.groups?.name ? match.groups.name : match[1];
  if (!envName) {
    return false;
  }
  nextPos += match[0].length;
  // \newtheorem{name}  {print}[numbered]
  //                  ^^ skipping these spaces
  for (; nextPos < max; nextPos++) {
    const code = state.src.charCodeAt(nextPos);
    if (!isSpace(code) && code !== 0x0A) { break; }
  }
  if (nextPos >= max) { 
    return false; 
  }
  // \newtheorem*{name}{print}
  //                  ^^ should be { 
  if (!isNumbered && state.src.charCodeAt(nextPos) !== 123 /* { */) {
    return false;
  }
  // \newtheorem{name}{print}[numbered] or \newtheorem{name}[numbered]{print}
  //                  ^^ should be {                        ^^ should be [
  if (state.src.charCodeAt(nextPos) !== 123 /* { */ && state.src.charCodeAt(nextPos) !== 0x5B/* [ */) {
    return false;
  }
  let data = null;
  let dataNumbered = null;
  /**
   * \newtheorem{corollary}{Corollary}[theorem]
   * An environment called corollary is created,
   * the counter of this new environment will be reset every time a new theorem environment is used.
   * */
  if (state.src.charCodeAt(nextPos) === 123  /* { */) {
    data = findEndMarker(state.src, nextPos);
    if (!data || !data.res) {
      return false; /** can not find end marker */
    }
    envPrint = data.content;
    nextPos = data.nextPos;
    if (nextPos < max) {
      // \newtheorem{name}{print}  [numbered]
      //                         ^^ skipping these spaces
      for (; nextPos < max; nextPos++) {
        const code = state.src.charCodeAt(nextPos);
        if (!isSpace(code) && code !== 0x0A) { break; }
      }
    }
    if (nextPos < max && state.src.charCodeAt(nextPos) === 0x5B/* [ */) {
      // \newtheorem{name}{print}[numbered]
      //                         ^^ get numbered
      dataNumbered = findEndMarker(state.src, nextPos, "[", "]");
      if (!dataNumbered || !dataNumbered.res) {
        return false; /** can not find end marker */
      }
      numbered = dataNumbered.content;
      nextPos = dataNumbered.nextPos;
    }
  } else {
    /**
     * \newtheorem{lemma}[theorem]{Lemma}
     * In this case, the even though a new environment called lemma is created,
     * it will use the same counter as the theorem environment.
     * */
    if (state.src.charCodeAt(nextPos) === 0x5B/* [ */) {
      dataNumbered = findEndMarker(state.src, nextPos, "[", "]");
      if (!dataNumbered || !dataNumbered.res) {
        return false; /** can not find end marker */
      }
      numbered = dataNumbered.content;
      nextPos = dataNumbered.nextPos;
      useCounter = numbered;
      if (nextPos < max) {
        // \newtheorem{name}[numbered]  {print}
        //                            ^^ skipping these spaces
        for (; nextPos < max; nextPos++) {
          const code = state.src.charCodeAt(nextPos);
          if (!isSpace(code) && code !== 0x0A) { break; }
        }
      }
      if (nextPos < max && state.src.charCodeAt(nextPos) === 123/* { */) {
        // \newtheorem{name}[numbered]{print}
        //                            ^^ get print
        data = findEndMarker(state.src, nextPos);
        if (!data || !data.res) {
          return false; /** can not find end marker */
        }
        envPrint = data.content;
        nextPos = data.nextPos;
      }
    }
  }
  content = state.src.slice(startPos, nextPos);

  if (!silent) {
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
    token.hidden = true;
    token.inlinePos = {
      start: state.pos,
      end: nextPos
    };
    if (state.md.options.forLatex) {
      token.latex = content;
      token.hidden = false;
    }
  }
  state.pos = nextPos;
  return true;
};

export const setCounterTheorem: RuleInline = (state, silent) => {
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
  if (!silent) {
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
    token.hidden = true;
    token.inlinePos = {
      start: state.pos,
      end: nextPos
    };
    if (state.md.options.forLatex) {
      token.latex = content;
      token.hidden = false;
    }
  }
  state.pos = nextPos;
  return true;
};

/**
 * \renewcommand\qedsymbol{$\blacksquare$}
 * \renewcommand\qedsymbol{QED}
 */
export const newCommandQedSymbol: RuleInline = (state, silent) => {
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
  if (!silent) {
    state.env.qedsymbol = content;
    const token = state.push("renewcommand_qedsymbol", "", 0);
    token.content = "";
    token.children = [];
    token.hidden = true;
    token.inlinePos = {
      start: state.pos,
      end: nextPos
    };
    if (state.md.options.forLatex) {
      token.latex = latex;
      token.hidden = false;
    }
  }
  state.pos = nextPos;
  return true;
};

export const labelLatex: RuleInline = (state, silent) => {
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  let nextPos: number = startPos;
  let match: RegExpMatchArray =  state.src
    .slice(startPos)
    .match(/^\\label\s{0,}\{([^}]*)\}/);
  if (!match) {
    return false;
  }
  let labelKey = match[1];
  let label: ILabel = null;
  nextPos += match[0].length;

  if (!silent) {
    /** Add a reference to the theorem to the global labelsList */
    if (state.env.currentTag) {
      label = {
        key: labelKey,
        id: encodeURIComponent(labelKey),
        tag: state.env.currentTag.number,
        type: state.env.currentTag.type,
        tokenUuidInParentBlock: state.env.currentTag.tokenUuidInParentBlock
      };
      addIntoLabelsList(label);
    }
    const latex = match[0];
    const token = state.push("label", "", 0);
    token.content = labelKey;
    token.children = [];
    token.latex = latex;
    token.currentTag = state.env?.currentTag ? {...state.env.currentTag} : {};
    token.hidden = true; /** Ignore this element when rendering to HTML */
  }
  state.pos = nextPos;
  return true;
};

export const captionLatex: RuleInline = (state, silent) => {
  const captionTag: RegExp = /^\\caption\s{0,}\{([^}]*)\}/;
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  let nextPos: number = startPos;
  let match: RegExpMatchArray =  state.src
    .slice(startPos)
    .match(captionTag);
  if (!match) {
    return false;
  }
  const latex = match[0];
  nextPos += match[0].length;
  if (!silent) {
    const token = state.push("caption", "", 0);
    token.content = match[1]
    token.children = [];
    token.latex = latex;
    token.currentTag = state.env?.currentTag ? {...state.env.currentTag} : {};
    token.hidden = true; /** Ignore this element when rendering to HTML */
  }
  state.pos = nextPos;
  return true;
};

export const captionSetupLatex: RuleInline = (state, silent) => {
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  let nextPos: number = startPos;
  let match: RegExpMatchArray =  state.src
    .slice(startPos)
    .match(RE_CAPTION_SETUP);
  if (!match) {
    return false;
  }
  const latex = match[0];
  nextPos += match[0].length;
  if (!silent) {
    const token = state.push("captionsetup", "", 0);
    token.content = match[1]
    token.children = [];
    token.latex = latex;
    token.hidden = true; /** Ignore this element when rendering to HTML */
  }
  state.pos = nextPos;
  return true;
};

export const centeringLatex: RuleInline = (state, silent) => {
  const alignTagG: RegExp = /^\\centering/;
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  let nextPos: number = startPos;
  let match: RegExpMatchArray =  state.src
    .slice(startPos)
    .match(alignTagG);
  if (!match) {
    return false;
  }
  const latex = match[0];
  nextPos += match[0].length;
  if (!silent) {
    const token = state.push("centering", "", 0);
    token.content = '';
    token.children = [];
    token.latex = latex;
    token.currentTag = state.env?.currentTag ? {...state.env.currentTag} : {};
    token.hidden = true; /** Ignore this element when rendering to HTML */
  }
  state.pos = nextPos;
  return true;
};

