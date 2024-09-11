import { HTML_OPEN_TAG_RE, HTML_CLOSE_TAG_RE, selfClosingTags } from "../common/html-re";
export const mmdHtmlInline2 = (state) => {
  if (!state.tokens?.length) {
    return;
  };

  const stack = [];
  const closeStack = [];

  for (let i = 0; i < state.tokens?.length; i++) {
    let token = state.tokens[i];
    if (token.type === 'html_inline') {
      const matchOpen = token.content.match(HTML_OPEN_TAG_RE);
      if (matchOpen) {
        let tag = matchOpen.length > 1 ? matchOpen[1] : '';
        let isClose = matchOpen.length > 2 && matchOpen[2] === '/';
        if (tag && !selfClosingTags.includes(tag) && !isClose && !token.isSvg) {
          stack.push({
            token: token,
            content: token.content,
            tag: matchOpen[1]
          });
        }
        continue;
      }
      const matchClose = token.content.match(HTML_CLOSE_TAG_RE);
      if (matchClose) {
        if (stack.length === 0) {
          console.log(`Mismatched closing tag: </${matchClose[1]}>`);
          closeStack.push({
            token: token,
            content: token.content,
            tag: matchClose[1]
          });
          continue;
        }
        const beforeTag = stack.length ? stack[stack.length - 1].tag : '';
        if (beforeTag === matchClose[1]) {
          stack.pop();
          continue;
        }
        if (selfClosingTags.includes(beforeTag)) {
          stack.pop();
          continue;
        }
        console.log(`Mismatched closing tag: </${matchClose[1]}>`);
        closeStack.push({
          token: token,
          content: token.content,
          tag: matchClose[1]
        });
      }
    }
  }
  if (stack?.length) {
    for (let i = 0; i < stack.length; i++) {
      let token = stack[i].token;
      token.type = 'text';
    }
  }
  if (closeStack?.length) {
    for (let i = 0; i < closeStack.length; i++) {
      let token = closeStack[i].token;
      token.type = 'text';
    }
  }
}
