import { Token } from 'markdown-it';

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
  // Parse inlines
  for (let i = 0; i < tokens.length; i++) {
    token = tokens[i];
    if (token.currentTag) {
      currentTag = token.currentTag;
    }
    if (token.type === 'inline') {
      state.md.inline.parse(token.content, state.md,
        Object.assign({}, {...state.env}, {
          currentTag: currentTag,
        }), token.children
      );
    }
  }
};
