import { renderTabularInline } from "./render-tabular";

const htmlUnderlineOpen = (underlineLevel): string => {
  let cssBackground = "background: linear-gradient(0deg, currentcolor 1px, transparent 1px, transparent 1px);";
  let cssLineHeight = "";
  let cssBackgroundPosition = '';
  let cssPaddingBottom = '';
  if (underlineLevel >= 1) {
    switch (underlineLevel) {
      case 1:
        cssBackgroundPosition = "background-position: 0 -1px;";
        break;
      case 2:
        cssPaddingBottom = "padding-bottom: 2px;";
        break;
      default:
        let lineHeight = underlineLevel >= 3 ? (underlineLevel - 2) * 4 + 1 : 5;
        let paddingBottom = underlineLevel >= 3 ? (underlineLevel - 2) * 3 + 2 : 5;
        cssPaddingBottom = `padding-bottom: ${paddingBottom}px;`;
        cssLineHeight = `line-height: ${28 + lineHeight}px;`;
        break;
    }
  } else {
    cssBackgroundPosition = "background-position: 0 -1px;";
  }
  let html = `<span data-underline="${underlineLevel}" style="`;
  html += cssBackground ? cssBackground : '';
  html += cssBackgroundPosition ? cssBackgroundPosition : '';
  html += cssPaddingBottom ? cssPaddingBottom : '';
  html += cssLineHeight ? cssLineHeight : '';
  html += '">';
  return html;
};

export const renderUnderlineText = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  let sContent = '';
  let content = '';
  token.underlineParentLevel = token.underlineParentLevel 
    ? token.underlineParentLevel + 1 : 1;
  if (token.children && token.children.length) {
    for (let i = 0; i < token.children.length; i++) {
      const tok = token.children[i];
      if (tok.type === 'underline') {
        tok.underlineParentLevel = token.underlineParentLevel;
        content = slf.renderInline([tok], options, env);
      } else {
        if (tok.children && tok.children.length > 1) {
          if (tok.type === "tabular_inline") {
            content = renderTabularInline(token.children, tok, options, env, slf)
          } else {
            content = slf.renderInline(tok.children, options, env);
          }
        } else {
          content = slf.renderInline([tok], options, env);
        }
      }
      sContent += content
    }
  } else {
    sContent = token.content;
  };
  return sContent;
};

export const renderUnderlineOpen = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  return htmlUnderlineOpen(token.underlineLevel);
};

export const renderUnderlineClose = (tokens, idx, options, env, slf) => {
  return '</span>';
};
