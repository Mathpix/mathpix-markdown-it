import { Token } from 'markdown-it';
import { inlineDecimalParse } from "../md-block-rule/begin-tabular";

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
  for (let i = 0; i < tokens.length; i++) {
    token = tokens[i];
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
    }
  }
};
