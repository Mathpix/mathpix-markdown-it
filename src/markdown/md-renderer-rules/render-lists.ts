import {PREVIEW_LINE_CLASS, PREVIEW_PARAGRAPH_PREFIX} from "../rules";
import { GetItemizeLevelTokens, GetEnumerateLevel, GetItemizeLevel } from "../md-block-rule/lists/re-level";
import { renderTabularInline } from "./render-tabular";
import { needToHighlightAll, highlightText } from "../highlight/common";
import convertSvgToBase64 from "../md-svg-to-base64/convert-scv-to-base64";
import { mathTokenTypes } from "../common/consts";

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

export const render_itemize_list_open = (tokens, index, options, env, renderer) => {
  if (tokens[index].level === 0) {
    level_itemize = 0
  }
  level_itemize++;
  let dataAttr = '';
  list_injectLineNumbers(tokens, index, "itemize");
  let dataPaddingInlineStart = tokens[index].attrGet('data-padding-inline-start');
  dataPaddingInlineStart = dataPaddingInlineStart 
    ? `padding-inline-start: ${dataPaddingInlineStart}px; `
    : '';
  if (options.forDocx) {
    const itemizeLevelTokens = GetItemizeLevelTokens(tokens[index].itemizeLevel);
    if (level_itemize > 0 && itemizeLevelTokens.length >= level_itemize) {
      let data = isTextMarkerTokens(itemizeLevelTokens[level_itemize-1], renderer, options, env);
      let itemizeLevel = GetItemizeLevel(tokens[index].itemizeLevelContents);
      if (itemizeLevel.length >= level_itemize) {
        dataAttr += ` data-custom-marker-type="${data.markerType}"`;
        if (data.markerType === 'text') {
          dataAttr += ` data-custom-marker-content="${encodeURI(data.textContent)}"`;
        } else {
          dataAttr += ` data-custom-marker-content="${encodeURI(itemizeLevel[level_itemize-1])}"`;
        }
      }
    }
  }
  if (level_itemize > 1) {
    return `<li><ul${renderer.renderAttrs(tokens[index])}${dataAttr} style="list-style-type: none">`;
  }
  return `<ul${renderer.renderAttrs(tokens[index])}${dataAttr} style="${dataPaddingInlineStart}list-style-type: none">`;
};

export const render_enumerate_list_open = (tokens, index, options, env, renderer) => {
  if (tokens[index].level === 0) {
    level_enumerate = 0
  }
  level_enumerate++;
  let dataAttr = '';
  const itLevel = GetEnumerateLevel(tokens[index].enumerateLevel);
  const str = itLevel.length >= level_enumerate ? itLevel[level_enumerate-1] : 'decimal';
  list_injectLineNumbers(tokens, index, `enumerate ${str}`);
  let dataPaddingInlineStart = tokens[index].attrGet('data-padding-inline-start');
  dataPaddingInlineStart = dataPaddingInlineStart
    ? `padding-inline-start: ${dataPaddingInlineStart}px; `
    : '';
  if (options.forDocx) {
    dataAttr = ` data-list-style-type="${str}"`
  }
  if (level_enumerate > 1) {
    return `<ol${renderer.renderAttrs(tokens[index])}${dataAttr} style=" list-style-type: ${str}">`;
  }
  return `<ol${renderer.renderAttrs(tokens[index])}${dataAttr} style="${dataPaddingInlineStart} list-style-type: ${str}">`;
};

const generateHtmlForMarkerTokens = (markerTokens, slf, options, env): {htmlMarker: string, markerType: string, textContent: string} => {
  let htmlMarker = '';
  let markerType = 'text';
  let textContent = '';
  if (markerTokens.length === 1 && mathTokenTypes.includes(markerTokens[0].type)) {
    markerType = 'math';
    if (markerTokens[0].mathEquation) {
      try {
        let svg = '';
        let svgStart = markerTokens[0].mathEquation.indexOf('<svg');
        let svgEnd = markerTokens[0].mathEquation.indexOf('</mjx-container>');
        svg = svgStart >= 0 && svgEnd > 0 ? markerTokens[0].mathEquation.slice(svgStart, svgEnd) : '';
        let resSvg = convertSvgToBase64(svg);
        htmlMarker += resSvg;
      } catch (e) {
        htmlMarker += markerTokens[0].mathEquation
      }
    } else {
      htmlMarker += slf.renderInline([markerTokens[0]], options, env);
    }
    return {
      htmlMarker: htmlMarker,
      markerType: markerType,
      textContent: ''
    };
  }
  for (let j = 0; j < markerTokens.length; j++) {
    if (markerTokens[j].type !== 'text') {
      markerType = 'multi';
    }
    if (markerTokens[j].mathEquation) {
      try {
        let svg = '';
        let svgStart = markerTokens[j].mathEquation.indexOf('<svg');
        let svgEnd = markerTokens[j].mathEquation.indexOf('</mjx-container>');
        svg = svgStart >= 0 && svgEnd > 0 ? markerTokens[j].mathEquation.slice(svgStart, svgEnd) : '';
        let resSvg = convertSvgToBase64(svg);
        htmlMarker += resSvg;
      } catch (e) {
        htmlMarker += markerTokens[j].mathEquation
      }
      continue;
    }
    let renderdToken = slf.renderInline([markerTokens[j]], options, env);
    if (markerType === 'text') {
      textContent += renderdToken
    } else {
      textContent = '';
    }
    htmlMarker += renderdToken
  }
  return {
    htmlMarker: htmlMarker,
    markerType: markerType,
    textContent: textContent
  };
};

const isTextMarkerTokens = (markerTokens, slf, options, env): {markerType: string, textContent: string} => {
  let markerType = 'text';
  if (markerTokens.length === 1 && mathTokenTypes.includes(markerTokens[0].type)) {
    markerType = 'math';
    return {
      markerType: markerType,
      textContent: ''
    };
  }
  let textContent = '';
  for (let j = 0; j < markerTokens.length; j++) {
    if (markerTokens[j].type !== 'text') {
      markerType = 'multi';
      break
    }
    textContent += slf.renderInline([markerTokens[j]], options, env);
  }
  return {
    markerType: markerType,
    textContent: textContent
  };
};

const generateHtmlForCustomMarker = (token, options, slf, env): {htmlMarker: string, markerType: string, textContent: string} => {
  let htmlMarker = '';
  let markerType = 'text';
  let textContent = '';
  if (options.forDocx) {
    let data = generateHtmlForMarkerTokens(token.markerTokens, slf, options, env);
    htmlMarker = data.htmlMarker;
    markerType = data.markerType;
    textContent = data.textContent;
  } else {
    htmlMarker = token.marker && token.markerTokens.length
      ? slf.renderInline(token.markerTokens, options, env) : '';
  }
  return {
    htmlMarker: htmlMarker,
    markerType: markerType,
    textContent: textContent
  };
};

export const render_item_inline = (tokens, index, options, env, slf) => {
  const token = tokens[index];
  let sContent = '';
  let content = '';
  for (let i = 0; i < token.children.length; i++) {
    const tok = token.children[i]
    if (tok.children) {
      if (tok.type === "tabular_inline") {
        content = renderTabularInline(token.children, tok, options, env, slf)
      } else {
        content = slf.renderInline(tok.children, options, env);
      }
    } else {
      content = slf.renderInline([tok], options, env);
    }
    sContent +=  content
  }

  if (token.highlights?.length) {
    if (needToHighlightAll(token)) {
      sContent = highlightText(token, sContent);
    }
  }
  
  if (token.parentType !== "itemize" && token.parentType !== "enumerate") {
    return `<li>${sContent}</li>`;
  }
  if (!sContent) {
    sContent = '&nbsp';
  }
  let dataAttr = '';
  let htmlMarker = '';
  if (token.parentType === "enumerate") {
    if (token.hasOwnProperty('marker') && token.markerTokens) {
      list_injectLineNumbers(tokens, index, `li_enumerate not_number`);
      dataAttr += ' data-custom-marker="true"';
      let data = generateHtmlForCustomMarker (token, options, slf, env);
      htmlMarker = data.htmlMarker;
      if (options.forDocx) {
        dataAttr += ` data-custom-marker-type="${data.markerType}"`;
        if (data.markerType === 'text') {
          dataAttr += ` data-custom-marker-content="${encodeURI(data.textContent)}"`;
        } else {
          dataAttr += ` data-custom-marker-content="${encodeURI(token.marker)}"`;
        }
      }
      return `<li${slf.renderAttrs(token)}${dataAttr} style="display: block"><span class="li_level"${dataAttr}>${htmlMarker}</span>${sContent}</li>`;
    }
    list_injectLineNumbers(tokens, index, `li_enumerate`);
    return `<li${slf.renderAttrs(token)}>${sContent}</li>`;
  } else {
    const itemizeLevelTokens = GetItemizeLevelTokens(token.itemizeLevel);
    if (token.hasOwnProperty('marker')  && token.markerTokens) {
      dataAttr += ' data-custom-marker="true"';
      let data = generateHtmlForCustomMarker (token, options, slf, env);
      htmlMarker = data.htmlMarker;
      if (options.forDocx) {
        dataAttr += ` data-custom-marker-type="${data.markerType}"`;
        if (data.markerType === 'text') {
          dataAttr += ` data-custom-marker-content="${encodeURI(data.textContent)}"`;
        } else {
          dataAttr += ` data-custom-marker-content="${encodeURI(token.marker)}"`;
        }
      }
    } else {
      if (level_itemize > 0 && itemizeLevelTokens.length >= level_itemize) {
        if (options.forDocx) {
          let data = generateHtmlForMarkerTokens(itemizeLevelTokens[level_itemize-1], slf, options, env);
          htmlMarker = data.htmlMarker;
          if (data.markerType === 'math') {
            let itemizeLevel = GetItemizeLevel(tokens[index].itemizeLevelContents);
            if (itemizeLevel.length >= level_itemize) {
              dataAttr += ` data-custom-marker-content="${encodeURI(itemizeLevel[level_itemize-1])}"`;
            }
            dataAttr += ' data-custom-marker="true"';
            dataAttr += ` data-custom-marker-type="${data.markerType}"`;
          }
        } else {
          htmlMarker = slf.renderInline(itemizeLevelTokens[level_itemize-1], options, env);
        }
      } else {
        htmlMarker = '.';
      }
    }
    list_injectLineNumbers(tokens, index, `li_itemize`);
    return `<li${slf.renderAttrs(token)}${dataAttr}><span class="li_level"${dataAttr}>${htmlMarker}</span>${sContent}</li>`;
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
      span = slf.renderInline(token.markerTokens, options, env)
    } else {
      span = level_itemize > 0 && itemizeLevelTokens.length >= level_itemize
        ? slf.renderInline(itemizeLevelTokens[level_itemize-1], options, env)
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
  if ( level_itemize > 0) {
    return `</ul></li>`
  }
  return `</ul>`;
};

export const render_enumerate_list_close = () => {
  level_enumerate--;
  return `</ol>`;
};
