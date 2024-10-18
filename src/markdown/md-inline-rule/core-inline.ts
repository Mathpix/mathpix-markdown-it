import { Token } from 'markdown-it';
import { inlineDecimalParse } from "../md-block-rule/begin-tabular";
import {
  addFootnoteToListForFootnote,
  addFootnoteToListForFootnotetext,
  addFootnoteToListForBlFootnotetext
} from "../md-latex-footnotes/utils";
import { addAttributesToParentToken } from "../utils";
import { setSizeCounter } from "../common/counters";
import { getTextWidthByTokens, ISizeEx } from "../common/textWidthByTokens";

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
        for (let j = 0; j < token.children?.length; j++) {
          if (token.children[j].type === "paragraph_open") {
            token.children[j].notInjectLineNumber = true;
          }
          if (token.children[j].type === 'inline'
            || ['title', 'section', 'subsection', 'subsubsection', 'addcontentsline',
              'item_inline', 'caption_table'
            ].includes(token.children[j].type)
          ) {
            state.env = Object.assign({}, {...state.env}, {
              currentTag: currentTag,
            }, {...envToInline});
            state.md.inline.parse(token.children[j].content, state.md, state.env, token.children[j].children);
            if (i > 0) {
              addAttributesToParentToken(tokens[i-1], token);
            }
          }
          if (token.children[j].type === 'tabular' && token.children[j].children?.length) {
            for (let k = 0; k < token.children[j].children.length; k++){
              let tok = token.children[j].children[k];
              if (tok.token === "inline_decimal") {
                tok = inlineDecimalParse(tok);
                continue;
              }
              if (tok.token === "inline") {
                if (tok.envToInline) {
                  envToInline = tok.envToInline;
                }
                state.env = Object.assign({}, {...state.env}, {
                  currentTag: currentTag,
                }, {...envToInline});
                state.md.inline.parse(tok.content, state.md, state.env, tok.children);
                if (j > 0 && token.children[j-1].type === 'td_open') {
                  addAttributesToParentToken(token.children[j-1], tok);
                }
              }
            }
          }
        }
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
    if(token.type === 'tabular' && token.children?.length) {
      for (let j = 0; j < token.children.length; j++){
        let tok = token.children[j];
        if (tok.token === "inline_decimal") {
          tok = inlineDecimalParse(tok);
          continue;
        }
        if (tok.token === "inline") {
          if (tok.envToInline) {
            envToInline = tok.envToInline;
          }
          state.env = Object.assign({}, {...state.env}, {
            currentTag: currentTag,
          }, {...envToInline});
          state.md.inline.parse(tok.content, state.md, state.env, tok.children);
          if (j > 0 && token.children[j-1].type === 'td_open') {
              addAttributesToParentToken(token.children[j-1], tok);
          }
        } 
      }
      continue;
    }
    if (token.type === 'inline' 
      || ['title', 'section', 'subsection', 'subsubsection', 'addcontentsline',
        'item_inline', 'caption_table'
      ].includes(token.type)) {
      state.env = Object.assign({}, {...state.env}, {
        currentTag: currentTag,
      }, {...envToInline});
      state.md.inline.parse(token.content, state.md, state.env, token.children);
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
