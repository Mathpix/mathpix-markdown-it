import {PREVIEW_LINE_CLASS, PREVIEW_PARAGRAPH_PREFIX} from "../rules";
import { GetItemizeLevelTokens, GetEnumerateLevel } from "../md-block-rule/lists/re-level";
import { renderTabularInline } from "./render-tabular";

var level_itemize = 0;
var level_enumerate = 0;


const list_injectLineNumbers = (tokens, idx, className = '') => {
  let line, endLine, listLine;
  if (tokens[idx].map) {
    line = tokens[idx].map[0];
    endLine = tokens[idx].map[1];
    listLine = [];
    for (let i = line; i < endLine; i++) {
      listLine.push(i);
    }
    tokens[idx].attrJoin("class", className + ' ' + PREVIEW_PARAGRAPH_PREFIX + String(line)
      + ' ' + PREVIEW_LINE_CLASS + ' ' + listLine.join(' '));
    tokens[idx].attrJoin("data_line_start", `${String(line)}`);
    tokens[idx].attrJoin("data_line_end", `${String(endLine-1)}`);
    tokens[idx].attrJoin("data_line", `${String([line, endLine])}`);
    tokens[idx].attrJoin("count_line", `${String(endLine-line)}`);
    if (tokens[idx].hasOwnProperty('parentStart')) {
      tokens[idx].attrJoin("data_parent_line_start", `${String(tokens[idx].parentStart)}`);
    }

  } else {
    tokens[idx].attrJoin("class", className );
  }
};

export const render_itemize_list_open = (tokens, index, renderer) => {
  if (tokens[index].level === 0) {
    level_itemize = 0
  }
  level_itemize++;
  list_injectLineNumbers(tokens, index, "itemize");
  return `<ul${renderer.renderAttrs(tokens[index])} style="list-style-type: none">`;
};

export const render_enumerate_list_open = (tokens, index, renderer) => {
  if (tokens[index].level === 0) {
    level_enumerate = 0
  }
  level_enumerate++;
  const itLevel = GetEnumerateLevel(tokens[index].enumerateLevel);
  const str = itLevel.length >= level_enumerate ? itLevel[level_enumerate-1] : 'decimal';
  list_injectLineNumbers(tokens, index, `enumerate ${str}`);
  return `<ol${renderer.renderAttrs(tokens[index])} style=" list-style-type: ${str}">`;
};

export const render_item_inline = (tokens, index, options, env, slf) => {
  const token = tokens[index];
  let sContent = '';
  let content = '';
  for (let i = 0; i < token.children.length; i++) {
    const tok = token.children[i]
    if (tok.children) {
      if (tok.type = "tabular_inline") {
        content = renderTabularInline(token.children, tok, options, env, slf)
      } else {
        content = slf.renderInline(tok.children, options);
      }
    } else {
      content = slf.renderInline([tok], options);
    }
    sContent +=  content
  }
  if (token.parentType !== "itemize" && token.parentType !== "enumerate") {
    return `<li>${sContent}</li>`;
  }

  if (token.parentType === "enumerate") {
    list_injectLineNumbers(tokens, index, `li_enumerate`);
    return `<li${slf.renderAttrs(token)}>${sContent}</li>`;
  } else {
    const itemizeLevelTokens = GetItemizeLevelTokens(token.itemizeLevel);

    let span = '.';
    if (token.marker && token.markerTokens) {
      span = slf.renderInline(token.markerTokens, options)
    } else {
      span = level_itemize > 0 && itemizeLevelTokens.length >= level_itemize
        ? slf.renderInline(itemizeLevelTokens[level_itemize-1], options)
        : '.';
    }
    list_injectLineNumbers(tokens, index, `li_itemize`);
    return `<li${slf.renderAttrs(token)}><span class="li_level">${span}</span>${sContent}</li>`;
  }
};

export const render_latex_list_item_open = (tokens, index, options, env, slf) => {
  const token = tokens[index];
  if (token.parentType !== "itemize" && token.parentType !== "enumerate") {
    return `<li>`;
  }

  if (token.parentType === "enumerate") {
    list_injectLineNumbers(tokens, index, `li_enumerate block`);
    return `<li${slf.renderAttrs(token)}>`;
  } else {
    const itemizeLevelTokens = GetItemizeLevelTokens(token.itemizeLevel);

    let span = '.';
    if (token.marker && token.markerTokens) {
      span = slf.renderInline(token.markerTokens, options)
    } else {
      span = level_itemize > 0 && itemizeLevelTokens.length >= level_itemize
        ? slf.renderInline(itemizeLevelTokens[level_itemize-1], options)
        : '.';
    }
    list_injectLineNumbers(tokens, index, `li_itemize block`);
    return `<li${slf.renderAttrs(token)}><span class="li_level">${span}</span>`;
  }
};

export const render_latex_list_item_close = () => {
  return `</li>`;
};
export const render_itemize_list_close = () => {
  level_itemize--;
  return `</ul>`;
};

export const render_enumerate_list_close = () => {
  level_enumerate--;
  return `</ol>`;
};
