import type Token from 'markdown-it/lib/token';

type SetTokensBlockParseOptions = {
  startLine?: number;
  endLine?: number;
  isInline?: boolean;
  contentPositions?: any;
  forPptx?: boolean;
  disableBlockRules?: boolean;
};

// Matches leading markdown block markers on the first line:
//   - up to 3 spaces + "#" heading
//   - or one/many ">" blockquote markers with arbitrary spaces between
//   - or fenced code block (```... or ~~~...)
const MD_BLOCK_LEADING_RE: RegExp =
  /^(\s{0,3})(#{1,6}(?=\s|$)|>[\s>]*|(`{3,}|~{3,})[^\n]*)/;

/**
 * If the first line looks like a markdown block (heading, quote, fence),
 * escape the first block marker character (prepend "\") so markdown-it's
 * block rules do not trigger on it. Used only inside SetTokensBlockParse.
 */
const escapeLeadingMarkdownBlockLine = (content: string): string => {
  const lines: string[] = content.split('\n');
  if (lines.length === 0) return content;
  const first = lines[0];
  const m: RegExpMatchArray = first.match(MD_BLOCK_LEADING_RE);
  if (!m) {
    return content;
  }
  const indent: string = m[1] ?? '';               // leading spaces (0–3)
  const rest: string = first.slice(indent.length); // starts with '#', '>', ``` or ~~~
  if (!rest.length) {
    return content;
  }
  // Escape the very first marker character:
  //   "# ..."       -> "\# ..."
  //   "> > > foo"   -> "\> > > foo"
  //   "```code"     -> "\```code"
  //   "~~~code"     -> "\~~~code"
  const escapedRest = '\\' + rest[0] + rest.slice(1);
  lines[0] = indent + escapedRest;
  return lines.join('\n');
}


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
  let children = [];
  const envIsInline: boolean = !!state.env.isInline;
  state.env.isInline = disableBlockRules;
  // When block rules are disabled, neutralize leading markdown block markers
  // on the first line so markdown-it does not treat them as real block syntax.
  const safeContent: string = disableBlockRules
      ? escapeLeadingMarkdownBlockLine(content)
      : content;
  if (disableBlockRules) {
    const blockRuler: any = state.md.block.ruler;
    const rulesToTouch: string[] = ['list'];
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
      state.md.block.parse(safeContent, state.md, state.env, children);
    } finally {
      // 3. Only restore what we turned off ourselves.
      blockRuler.enable(rulesToReEnable, true);
    }
  } else {
    state.md.block.parse(safeContent, state.md, state.env, children);
  }
  state.env.isInline = envIsInline;
  let isFirst = true;
  for (let j = 0; j < children.length; j++) {
    const child = children[j];
    // Push token to state
    state.tokens.push(child);
    const token: Token = child;
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

    if (forPptx && isInline && isFirst && token.type === "paragraph_close") {
      state.push('paragraph_close', 'div', -1);
      isFirst = false;
    }
  }
};
