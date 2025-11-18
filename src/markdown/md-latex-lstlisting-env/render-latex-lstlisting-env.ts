import { MarkdownIt, Token, Renderer } from "markdown-it";
const escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;

const renderCodeWithMathHighlighted = (
  children: Token[],
  md: MarkdownIt,
  langName: string,
  options = {},
  env = {}
): string => {
  let html: string = '';
  for (const ch of children) {
    if (ch.type === 'text') {
      html += (md.options?.highlight && typeof md.options.highlight === 'function')
        ? (md.options.highlight(ch.content, langName) || escapeHtml(ch.content))  // <-- raw code в highlight
        : escapeHtml(ch.content);
    } else {
      html += md.renderer.renderInline([ch], options, env);
    }
  }
  return html;
};
export const makeLatexLstlistingEnvRendererWithMd = (md: MarkdownIt, className = 'lstlisting') => {
  return (
    tokens: Token[],
    idx: number,
    options: Record<string, any> = {},
    env: Record<string, any> = {},
    slf: Renderer
  ): string => {
    const token: Token = tokens[idx];
    const langName: string = token.meta?.language?.hlName ?? '';
    const hasMath = token.children && token.children.length > 0;
    let highlighted: string = '';
    if (hasMath) {
      highlighted = renderCodeWithMathHighlighted(token.children, md, langName, options, env);
    } else {
      highlighted = (md.options?.highlight && typeof md.options.highlight === 'function')
        ? (md.options.highlight(token.content, langName) || escapeHtml(token.content))  // <-- raw code в highlight
        : escapeHtml(token.content);
    }
    if (highlighted.indexOf('<pre') === 0) {
      return highlighted + '\n';
    }

    // If language exists, inject class gently, without modifying original token.
    // May be, one day we will add .clone() for token and simplify this part, but
    // now we prefer to keep things local.
    if (langName) {
      let tmpToken: Token;
      let tmpAttrs = [];
      let i = token.attrIndex('class');
      tmpAttrs = token.attrs ? token.attrs.slice() : [];
      if (i < 0) {
        tmpAttrs.push([ 'class', options.langPrefix + langName ]);
      } else {
        tmpAttrs[i][1] += ' ' + options.langPrefix + langName;
      }
      // Fake token just to render attributes
      tmpToken = {
        attrs: tmpAttrs
      };
      return  '<pre><code' + slf.renderAttrs(tmpToken) + '>'
        + highlighted
        + '</code></pre>\n';
    }
    return  '<pre><code' + slf.renderAttrs(token) + '>'
      + highlighted
      + '</code></pre>\n';
  };
}
