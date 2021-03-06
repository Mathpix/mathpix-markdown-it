const escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;
const isSpace = require('markdown-it/lib/common/utils').isSpace;

function rendererRuleInlineStyle(tokens, idx, options, env, slf) {
  const token = tokens[idx];
  let style = '';

  switch (token.tag) {
    case  "blockquote":
      style = 'margin-top: 0; margin-right: 0; margin-bottom: 1em; margin-left: 0; ';
      style += 'page-break-inside: avoid; color: #666; padding-left: 3em; border-left: .5em solid #eee;';
      break;
    default:
      break;
  }

  if ( style ) {
    token.attrJoin("style", style);
  }
  return slf.renderToken(tokens, idx, options, env, slf);
}

function rendererRuleText(tokens, idx) {
  const ch = tokens[idx].content.charCodeAt(0);
  if (isSpace(ch)) {
    return escapeHtml(`&nbsp;` + tokens[idx].content.slice(1));
  } else {
    return escapeHtml(tokens[idx].content);
  }
}

export function injectInlineStyles(renderer) {
  renderer.renderer.rules.paragraph_open
    = renderer.renderer.rules.heading_open
    = renderer.renderer.rules.ordered_list_open
    = renderer.renderer.rules.bullet_list_open
    = renderer.renderer.rules.blockquote_open
    = renderer.renderer.rules.dl_open
    = rendererRuleInlineStyle;

  renderer.renderer.rules.text = rendererRuleText;
  return renderer;
}
