import { Token } from 'markdown-it';
import { inlineDecimalParse } from "../md-block-rule/begin-tabular";
import {
  addFootnoteToListForFootnote,
  addFootnoteToListForFootnotetext,
  addFootnoteToListForBlFootnotetext
} from "../md-latex-footnotes/utils";
import { addAttributesToParentToken, applyAttrToInlineMath } from "../utils";
import { setSizeCounter } from "../common/counters";
import { getTextWidthByTokens, ISizeEx } from "../common/textWidthByTokens";

const INLINE_LIKE_TYPES = new Set([
  'inline',
  'title', 'section', 'subsection', 'subsubsection',
  'addcontentsline', 'item_inline', 'caption_table'
]);

function isInlineLike(tok: any): boolean {
  const t = tok?.type;
  const tk = tok?.token;
  return INLINE_LIKE_TYPES.has(t) || INLINE_LIKE_TYPES.has(tk);
}

/**
  * Recursively walk tokens and parse any inline-like tokens deeply.
  *
  * Important:
  * - respects tok.envToInline stacking (deepest overrides)
  * - supports tok.token vs tok.type (tabular children use tok.token)
  * - preserves td_open attribute injection behavior
  */
const walkInlineInTokens = (
  list: any[],
  state: any,
  getCurrentTag: () => any,
  getRootEnvToInline: () => any,
  envStack: any[] = [],
  parentList?: any[]
): void => {
  if (!list?.length) return;
  // base env for this level is: (root envToInline) then stack overrides
  const baseEnv = Object.assign({}, getRootEnvToInline(), ...envStack);
  for (let i = 0; i < list.length; i++) {
    let tok: any = list[i];
    if (tok?.token === "inline_decimal") {
      inlineDecimalParse(tok);
      continue;
    }
    const nextStack = tok?.envToInline ? [...envStack, tok.envToInline] : envStack;
    const mergedEnvToInline = tok?.envToInline ? Object.assign({}, baseEnv, tok.envToInline) : baseEnv;
    if (isInlineLike(tok)) {
      state.env = Object.assign({}, { ...state.env }, {
        currentTag: getCurrentTag(),
      }, mergedEnvToInline);
      if (!tok.children?.length) {
        state.md.inline.parse(tok.content, state.md, state.env, tok.children);
      }
      if (tok.meta?.isMathInText && tok.children?.length) {
        applyAttrToInlineMath(tok, "data-math-in-text", "true");
      }
      if (state.md.options?.enableSizeCalculation) {
        if ((tok.type === 'inline' || tok.token === 'inline') && tok.children?.length) {
          let data: ISizeEx = getTextWidthByTokens(tok.children);
          if (data) {
            tok.widthEx = data.widthEx;
            tok.heightEx = data.heightEx;
            setSizeCounter(data.widthEx, data.heightEx);
          }
        }
      }
      if ((tok.type === 'inline' || tok.token === 'inline') && tok.children?.length) {
        if (tok.lastBreakToSpace && tok.children[tok.children.length - 1]?.type === 'softbreak') {
          tok.children[tok.children.length - 1].hidden = true;
          tok.children[tok.children.length - 1].showSpace = true;
        }
        if (tok.firstBreakToSpace && tok.children[0]?.type === 'softbreak') {
          tok.children[0].hidden = true;
          tok.children[0].showSpace = true;
        }
      }
      if (i > 0 && list[i - 1]?.type === 'td_open') {
        addAttributesToParentToken(list[i - 1], tok);
      }
    }
    // recurse to children (tabular nesting can be arbitrary)
    if (tok?.children?.length) {
      walkInlineInTokens(tok.children, state, getCurrentTag, getRootEnvToInline, nextStack, list);
    }
  }
}

/** Top-level inline rule executor 
 * Replace inline core rule
 * 
 * By default the state.env that is passed to the inline parser only has the latest values.
 * We add this rule to be able to pass the current variables (obtained during block parsing) to the inline parser.
 * This is necessary to match labels with the current block.
 * */
export const coreInline = (state) => {
  const tokens: Token[] = state.tokens;
  let token: Token;
  let currentTag = {};
  let envToInline = {};
  // Parse inlines
  if (!state.env.footnotes) { state.env.footnotes = {}; }
  state.env.mmd_footnotes = {...state.env.footnotes};

  if (!state.env.mmd_footnotes.list) { state.env.mmd_footnotes.list = []}
  for (let i = 0; i < tokens.length; i++) {
    token = tokens[i];
    if (token.type === 'footnote_latex' || token.type === 'footnotetext_latex' || token.type === 'blfootnotetext_latex') {
      if (token.children?.length) {
        // preserve notInjectLineNumber behavior
        for (let j = 0; j < token.children.length; j++) {
          if (token.children[j].type === "paragraph_open") {
            (token.children[j] as any).notInjectLineNumber = true;
          }
        }
        // deep-walk all inlines/tabular nesting inside footnote token
        walkInlineInTokens(token.children as any, state, () => currentTag, () => envToInline);
      }
      if (!state.env.footnotes.list) { state.env.footnotes.list = []; }
      if (!state.env.mmd_footnotes.list) { state.env.mmd_footnotes.list = []; }

      if (token.type === 'footnotetext_latex') {
        addFootnoteToListForFootnotetext(state, token, token.children, token.content, token.numbered, true);
        continue;
      }
      if (token.type === 'blfootnotetext_latex') {
        addFootnoteToListForBlFootnotetext(state, token, token.children, token.content, true);
        continue;
      }
      addFootnoteToListForFootnote(state, token, token.children, token.content, token.numbered, true);
      continue;
    }
    if (token.currentTag) {
      currentTag = token.currentTag;
    }
    if (token.envToInline) {
      envToInline = token.envToInline;
    }
    if (token.type === 'tabular' && token.children?.length) {
      // deep-walk tabular of any depth
      walkInlineInTokens(token.children as any, state, () => currentTag, () => envToInline);
      continue;
    }
    if (token.type === 'inline' 
      || ['title', 'section', 'subsection', 'subsubsection', 'addcontentsline',
        'item_inline', 'caption_table'
      ].includes(token.type)) {
      state.env = Object.assign({}, {...state.env}, {
        currentTag: currentTag,
      }, {...envToInline});
      if (!token.children?.length) {
        state.md.inline.parse(token.content, state.md, state.env, token.children);
      }
      if (token.meta?.isMathInText && token.children?.length) {
        applyAttrToInlineMath(token.children, "data-math-in-text", "true");
      }
      if (state.md.options?.enableSizeCalculation) {
        if (token.type === 'inline' && token.children?.length) {
          let data: ISizeEx = getTextWidthByTokens(token.children);
          if (data) {
            token.widthEx = data.widthEx;
            token.heightEx = data.heightEx;
            setSizeCounter(data.widthEx, data.heightEx);
          }
        }
      }
      if (token.type === 'inline' && token.children?.length) {
        if (token.lastBreakToSpace && token.children[token.children.length-1].type === 'softbreak') {
          token.children[token.children.length-1].hidden = true;
          token.children[token.children.length-1].showSpace = true;
        }        
        if (token.firstBreakToSpace && token.children[0].type === 'softbreak') {
          token.children[0].hidden = true;
          token.children[0].showSpace = true;
        }
        if (i > 0) {
          addAttributesToParentToken(tokens[i-1], token);
        }
      }
    }
  }
  state.env.footnotes = null;
};
