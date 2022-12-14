export const SetTokensBlockParse = (state, content, startLine?, endLine?, isInline = false) => {
  let token;
  let children = [];
  state.md.block.parse(content, state.md, state.env, children);

  for (let j = 0; j < children.length; j++) {
    const child = children[j];
    token = state.push(child.type, child.tag, child.nesting);
    token.attrs = child.attrs;
    if (isInline && j === 0 && token.type === "paragraph_open") {
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
};
