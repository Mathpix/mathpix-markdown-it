import {PREVIEW_LINE_CLASS, PREVIEW_PARAGRAPH_PREFIX} from "../rules";
import { GetItemizeLevelTokens, GetEnumerateLevel, GetItemizeLevel } from "../md-block-rule/lists/re-level";
import { renderTabularInline } from "./render-tabular";
import { needToHighlightAll, highlightText } from "../highlight/common";
import convertSvgToBase64 from "../md-svg-to-base64/convert-scv-to-base64";
import { mathTokenTypes } from "../common/consts";
import { isMathInText } from "../utils";

var level_itemize = 0;
var level_enumerate = 0;

type MarkerInfo = {
  htmlMarker: string;
  dataAttr: string;
};

type ListItemRenderMode = 'open' | 'full';

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

/**
 * Builds HTML marker information for list items that define a custom marker.
 *
 * Extracts the rendered marker (HTML) and assembles the corresponding
 * `data-*` attributes used for HTML and DOCX export.
 */
const buildCustomMarkerInfo = (token, options, slf, env): MarkerInfo => {
  let dataAttrs: string[] = ['data-custom-marker="true"'];
  const data = generateHtmlForCustomMarker(token, options, slf, env);
  let htmlMarker = data.htmlMarker;
  if (options.forDocx) {
    dataAttrs.push(`data-custom-marker-type="${data.markerType}"`);
    const content = data.markerType === 'text'
      ? data.textContent
      : token.marker;
    dataAttrs.push(`data-custom-marker-content="${encodeURI(content)}"`);
  }
  const dataAttr: string = dataAttrs.length ? ' ' + dataAttrs.join(' ') : '';
  return { htmlMarker, dataAttr };
}

/**
 * Builds marker information for LaTeX-style itemize list items.
 *
 * If the token defines a custom marker, delegates to `buildCustomMarkerInfo`.
 * Otherwise, derives the marker from the itemize level tokens and, when
 * exporting to DOCX, attaches appropriate `data-*` attributes (including
 * math markers and their raw LaTeX content).
 */
const buildItemizeMarkerInfo = (token, options, env, slf, level_itemize: number): MarkerInfo => {
  const itemizeLevelTokens = GetItemizeLevelTokens(token.itemizeLevel);
  let dataAttr: string = '';
  let htmlMarker: string = '.';
  if (token.hasOwnProperty('marker') && token.markerTokens) {
    return buildCustomMarkerInfo(token, options, slf, env);
  }
  if (level_itemize > 0 && itemizeLevelTokens.length >= level_itemize) {
    if (options.forDocx) {
      const data = generateHtmlForMarkerTokens(itemizeLevelTokens[level_itemize - 1], slf, options, env);
      htmlMarker = data.htmlMarker;
      if (data.markerType === 'math') {
        const itemizeLevel = GetItemizeLevel(token.itemizeLevelContents);
        if (itemizeLevel.length >= level_itemize) {
          dataAttr += ` data-custom-marker-content="${encodeURI(itemizeLevel[level_itemize - 1])}"`;
        }
        dataAttr += ' data-custom-marker="true"';
        dataAttr += ` data-custom-marker-type="${data.markerType}"`;
      }
    } else {
      htmlMarker = slf.renderInline(itemizeLevelTokens[level_itemize - 1], options, env);
    }
  }
  return { htmlMarker, dataAttr };
}

/**
 * Renders the core HTML for a LaTeX-style list item (`<li>`), handling both
 * `enumerate` and `itemize` environments.
 *
 * Applies custom markers, DOCX-related `data-*` attributes, and line number
 * injection, and can either return an "open" `<li>...` prefix (no content)
 * or a fully closed `<li>...</li>` element depending on the mode.
 */
const renderLatexListItemCore = (tokens, index, options, env, slf, sContent: string | null, mode: ListItemRenderMode): string => {
  const token = tokens[index];
  // if not a latex list at all
  if (token.parentType !== 'itemize' && token.parentType !== 'enumerate') {
    return mode === 'open' ? '<li>' : `<li>${sContent}</li>`;
  }
  let dataAttr: string = '';
  let htmlMarker: string = '';
  const isEnumerate: boolean = token.parentType === 'enumerate';
  // ENUMERATE
  if (isEnumerate) {
    const hasCustomMarker = token.hasOwnProperty('marker') && token.markerTokens;
    if (hasCustomMarker) {
      // line numbers
      list_injectLineNumbers(tokens, index, 'li_enumerate not_number');
      const markerInfo: MarkerInfo = buildCustomMarkerInfo(token, options, slf, env);
      dataAttr += markerInfo.dataAttr;
      htmlMarker = markerInfo.htmlMarker;
      const prefix: string = `<li${slf.renderAttrs(token)}${dataAttr} style="display: block">` +
        `<span class="li_level"${dataAttr}>${htmlMarker}</span>`;
      if (mode === 'open') {
        return prefix;
      }
      return `${prefix}${sContent}</li>`;
    }
    // regular numbered element
    list_injectLineNumbers(tokens, index, mode === 'open' ? 'li_enumerate block' : 'li_enumerate');
    const prefix = `<li${slf.renderAttrs(token)}>`;
    if (mode === 'open') {
      return prefix;
    }
    return `${prefix}${sContent}</li>`;
  }
  // ITEMIZE
  const { htmlMarker: itemizeMarker, dataAttr: itemizeDataAttr } =
    buildItemizeMarkerInfo(token, options, env, slf, level_itemize);
  htmlMarker = itemizeMarker;
  dataAttr += itemizeDataAttr || '';
  list_injectLineNumbers(tokens, index, mode === 'open' ? 'li_itemize block' : 'li_itemize');
  const prefix =
    `<li${slf.renderAttrs(token)}${dataAttr}>` +
    `<span class="li_level"${dataAttr}>${htmlMarker}</span>`;
  if (mode === 'open') {
    return prefix;
  }
  return `${prefix}${sContent}</li>`;
}

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
      if (isMathInText(token.children, i, options)) {
        tok.attrSet('data-math-in-text', "true");
      }
      content = slf.renderInline([tok], options, env);
      if (options?.forPptx && i === 0 && ['equation_math', 'equation_math_not_number', 'display_math'].includes(tok.type)) {
        content = '<span>&nbsp</span>' + content;
      }
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
  return renderLatexListItemCore(tokens, index, options, env, slf, sContent, 'full');
};

export const render_latex_list_item_open = (tokens, index, options, env, slf) => {
  return renderLatexListItemCore(tokens, index, options, env, slf, null, 'open');
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
