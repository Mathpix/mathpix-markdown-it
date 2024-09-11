import { HTML_OPEN_TAG_RE, HTML_CLOSE_TAG_RE, selfClosingTags } from "../common/html-re";

export const mmdHtmlInline2 = (state) => {
  if (!state.tokens?.length) {
    return;
  }

  const stack = [];
  const closeStack = [];

  // Helper function to hide soft breaks before a token
  const hideSoftBreakBefore = (tokens, index) => {
    const tokenBefore = index > 0 ? tokens[index - 1] : null;
    const tokenBefore2 = index > 1 ? tokens[index - 2] : null;
    if (tokenBefore?.type === 'softbreak' && tokenBefore2?.type === 'html_inline') {
      tokens[index - 1].hidden = true;
      tokens[index - 1].showLineBreak = true;
    }
  };

  for (let i = 0; i < state.tokens.length; i++) {
    const token = state.tokens[i];

    if (token.type === 'html_inline') {
      const matchOpen = token.content.match(HTML_OPEN_TAG_RE);

      if (matchOpen) {
        const tag = matchOpen[1] || '';
        const isClose = matchOpen[2] === '/';

        if (tag && !selfClosingTags.includes(tag) && !isClose && !token.isSvg) {
          stack.push({
            token: token,
            content: token.content,
            tag: tag,
            idx: i,
          });
        }
        continue;
      }

      const matchClose = token.content.match(HTML_CLOSE_TAG_RE);

      if (matchClose) {
        const closeTag = matchClose[1];

        if (stack.length === 0) {
          console.log(`Mismatched closing tag: </${closeTag}>`);
          closeStack.push({ token: token, content: token.content, tag: closeTag });
          continue;
        }

        const lastOpenTag = stack[stack.length - 1].tag;

        if (lastOpenTag === closeTag || selfClosingTags.includes(lastOpenTag)) {
          // stack.pop();
          const pStack = stack.pop();
          hideSoftBreakBefore(state.tokens, pStack.idx);
          hideSoftBreakBefore(state.tokens, i);
          continue;
        }

        console.log(`Mismatched closing tag: </${closeTag}>`);
        closeStack.push({ token: token, content: token.content, tag: closeTag });
      }
    }
  }

  // Convert unmatched opening and closing tags to text type
  const convertToTextType = (tokens) => {
    for (const item of tokens) {
      item.token.type = 'text';
    }
  };

  if (stack.length) {
    convertToTextType(stack);
  }

  if (closeStack.length) {
    convertToTextType(closeStack);
  }
};
