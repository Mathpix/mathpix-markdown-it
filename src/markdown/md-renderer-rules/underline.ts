import { renderTabularInline } from "./render-tabular";
import { renderInlineContent } from "../mdPluginText";
import { isMathInText } from "../utils";

const htmlUnderlineOpen = (underlineLevel, underlineType = 'underline', underlinePadding = 0): string => {
  if (underlineType === 'uwave') {
    let html = `<span data-underline-level="${underlineLevel}" `;
    html += `data-underline-type="${underlineType}" `;
    html += 'style="';
    html += 'text-decoration: underline; text-decoration-style: wavy;';
    html += '">';
    return html;
  }
  let cssBackground = "border-bottom: 1px solid;";
  switch (underlineType) {
    case 'dashuline':
      cssBackground = "background-position: bottom; " +
        "background-size: 12px 1px; " +
        "background-repeat: repeat-x; " +
        "background-image: radial-gradient(circle, currentcolor 3px, transparent 1px);";
      break;    
    case 'dotuline':
      cssBackground = "background-position: bottom; " +
        "background-size: 10px 2px; " +
        "background-repeat: repeat-x; " +
        "background-image: radial-gradient(circle, currentcolor 1px, transparent 1px);";
      break;
  }
  let cssLineHeight = "";
  let cssBackgroundPosition = '';
  let cssPaddingBottom = '';
  if (underlineLevel >= 1) {
    switch (underlineLevel) {
      case 1:
        cssBackgroundPosition = underlineType !== 'dotuline' && underlineType !== 'dashuline' 
          ? "background-position: 0 -1px;" : '';
        break;
      case 2:
        cssPaddingBottom = `padding-bottom: ${underlinePadding}px;`;
        break;
      default:
        let lineHeight = underlineLevel >= 3 ? (underlineLevel - 2) * 4 + 1 : 5;
        cssPaddingBottom = `padding-bottom: ${underlinePadding}px;`;
        cssLineHeight = `line-height: ${28 + lineHeight}px;`;
        break;
    }
  } else {
    cssBackgroundPosition = "background-position: 0 -1px;";
  }
  let html = '<span ';
  html += `data-underline-level="${underlineLevel}" `;
  html += `data-underline-type="${underlineType}" `;
  html += `style="`;
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
        if (isMathInText(token.children, i, options)) {
          tok.attrSet('data-math-in-text', "true");
        }
        content = slf.renderInline([tok], options, env);
      } else {
        if (tok.children && tok.children.length > 1) {
          if (tok.type === "tabular_inline") {
            content = renderTabularInline(token.children, tok, options, env, slf)
          } else {
            content = slf.renderInline(tok.children, options, env);
          }
        } else {
          if (isMathInText(token.children, i, options)) {
            tok.attrSet('data-math-in-text', "true");
          }
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
  if (token.underlineType === 'uuline'){
    return htmlUnderlineOpen(token.underlineLevel + 1, token.underlineType, token.underlinePadding) 
      + htmlUnderlineOpen(token.underlineLevel, token.underlineType, 
        token.underlinePadding > 3 ? token.underlinePadding - 3 : token.underlinePadding)
  }
  return htmlUnderlineOpen(token.underlineLevel, token.underlineType, token.underlinePadding);
};

export const renderUnderlineClose = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  let html = '</span>';
  if (token.underlineType === 'uuline') {
    html += '</span>';
  }
  if (!token.isSubUnderline && token.underlineLevel >= 3) {
    let lineHeight = token.underlineLevel >= 3 ? (token.underlineLevel - 2) * 4 + 1 : 5;
    /** zero-width space */
    return html + `<span style="height: ${28 + lineHeight}px; display: inline-block;">&#8203;</span>`;
  }
  return html;
};

export const renderOutOpen = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  let html = `<span `;
  html += `data-out-type="${token.underlineType}" `;
  html += 'style="';
  html += token.underlineType === 'xout' 
    ? 'background: repeating-linear-gradient(-60deg, currentcolor, currentcolor, transparent 1px, transparent 6px);'
    : 'text-decoration: line-through; text-decoration-thickness: from-font;';
  html += '">';
  return html;
};

export const renderOutText = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  return renderInlineContent(token, options, env, slf);
};
