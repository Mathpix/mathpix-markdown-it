type SetTokensBlockParseOptions = {
  startLine?: number;
  endLine?: number;
  isInline?: boolean;
  contentPositions?: any;
  forPptx?: boolean;
  disableBlockRules?: boolean;
};

/**
 * Parses a block of content with markdown-it and pushes the resulting
 * block tokens into the current state, with optional control over
 * line mapping, inline rendering, PPTX-specific behavior and temporary
 * disabling of selected block rules (list/blockquote/fence/heading).
 */
export const SetTokensBlockParse = (state, content: string, options: SetTokensBlockParseOptions = {} ) => {
  const {
    startLine,
    endLine,
    isInline = false,
    contentPositions = null,
    forPptx = false,
    disableBlockRules = false,
  } = options;
  let token;
  let children = [];

  if (disableBlockRules) {
    const blockRuler: any = state.md.block.ruler;
    const rulesToTouch: string[] = ['list', 'blockquote', 'fence', 'heading'];
    // 1. Let's remember which of these rules were included
    const rulesToReEnable: string[] = [];
    if (blockRuler.__rules__) {
      for (const name of rulesToTouch) {
        const rule = blockRuler.__rules__.find((r) => r.name === name);
        if (rule && rule.enabled) {
          rulesToReEnable.push(name);
        }
      }
    }
    // 2. Temporarily disable only those that were actually enabled.
    blockRuler.disable(rulesToReEnable, true);
    try {
      state.md.block.parse(content, state.md, state.env, children);
    } finally {
      // 3. Only restore what we turned off ourselves.
      blockRuler.enable(rulesToReEnable, true);
    }
  } else {
    state.md.block.parse(content, state.md, state.env, children);
  }
  let isFirst = true;
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
          token.attrs.push(['style', `display: inline;`]);
        }
      } else {
        token.attrSet('style', `display: inline;`);
      }
      token.attrSet('data-display', 'inline');
    }
    if (startLine && endLine) {
      token.map = [startLine, endLine];
    }
    if (contentPositions?.hasOwnProperty('startLine') && child.map) {
      token.map = [contentPositions.startLine + child.map[0], contentPositions.startLine + child.map[1]];
      if (j === 1 && child.type === "inline") {
        token.bMarks = contentPositions.bMarks
      }
    }
    token.content = child.content;
    token.children = child.children;

    if (forPptx && isInline && isFirst && token.type === "paragraph_close") {
      token = state.push('paragraph_close', 'div', -1);
      isFirst = false;
    }
  }
};
