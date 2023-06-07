import { getStyleFromHighlight, sortHighlights, highlightText } from "./common";
import { OuterHTML } from "../../mathjax";
const escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;
import { HIGHLIGHT_COLOR, HIGHLIGHT_TEXT_COLOR } from "../common/consts";

export const textHighlight = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  return highlightText(token);
};

export const codeInlineHighlight = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  if (token.highlights?.length) {
    token.highlights.sort(sortHighlights);
    let highlightContent = [];
    for (let i = 0; i < token.highlights.length; i++) {
      let startPos = token.highlights[i].start - token.positions.start - token.markup?.length;
      let endPos = token.highlights[i].end - token.positions.start - token.markup?.length;
      highlightContent.push({
        positions: {
          start: startPos,
          end: endPos
        },
        highlight: token.highlights[i],
        content: token.content.slice(startPos, endPos)
      });
    }
    let textStr = '';
    let textStart = 0;
    let newArr = [];
    /** Filtered */
    for(let i = 0; i < highlightContent.length; i++) {
      let index = newArr?.length
        ? newArr.findIndex(item => item.positions.start >= highlightContent[i].positions.start
          && item.positions.end <= highlightContent[i].positions.end)
        : -1;
      if (index === -1) {
        newArr.push(highlightContent[i]);
        continue;
      }
      newArr.splice(index, 1);
      newArr.push(highlightContent[i]);
    }
    newArr.map(item => {
      textStr += escapeHtml(token.content.slice(textStart, item.positions.start));
      textStr += '<span style="' + getStyleFromHighlight(item.highlight) + '">';
      textStr += item.content;
      textStr += '</span>';
      textStart = item.positions.end;
    });
    textStr += escapeHtml(token.content.slice(textStart));
    return '<code' + slf.renderAttrs(token) + '>' +
      textStr +
      '</code>';
  } else {
    return '<code' + slf.renderAttrs(token) + '>' +
      escapeHtml(tokens[idx].content) +
      '</code>';
  }
};

export const renderTextUrlHighlight = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  return `<a href="#" class="text-url">${highlightText(token)}</a>`
};

export const renderMathHighlight = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const mathEquation = token.hasOwnProperty('mathData')
    ? OuterHTML(token.mathData, options.outMath)
    : token.mathEquation;
  const attrNumber = token.attrNumber;
  const idLabels = token.idLabels;
  let html = '';
  let dataAttrs = '';
  if (token.highlightAll) {
    let dataAttrsStyle = '';
    if (token.highlights?.length && (
      token.highlights[0].hasOwnProperty('highlight_color')
      || token.highlights[0].hasOwnProperty('text_color'))) {
      if (token.highlights[0].highlight_color) {
        dataAttrs += ' data-highlight-color="true"';
        dataAttrsStyle += `--mmd-highlight-color: ${token.highlights[0].highlight_color};`;
      }
      if (token.highlights[0].text_color) {
        dataAttrs += ' data-highlight-text-color="true"';
        dataAttrsStyle += `--mmd-highlight-text-color: ${token.highlights[0].text_color};`;
      }
    } else {
      dataAttrs += ' data-highlight-color="true"';
      dataAttrs += ' data-highlight-text-color="true"';
      dataAttrsStyle += `--mmd-highlight-color: ${HIGHLIGHT_COLOR};`;
      dataAttrsStyle += `--mmd-highlight-text-color: ${HIGHLIGHT_TEXT_COLOR};`;
    }
    dataAttrs += ' style="' + dataAttrsStyle + '"';
  }
  if (token.type === "equation_math") {
    html = idLabels
      ? `<span id="${idLabels}" class="math-block equation-number id=${idLabels}" number="${attrNumber}"${dataAttrs}>${mathEquation}</span>`
      : `<span  class="math-block equation-number " number="${attrNumber}"${dataAttrs}>${mathEquation}</span>`
  } else {
    html = token.type === "inline_math" || token.type === "inline_mathML"
      ? idLabels
        ? `<span id="${idLabels}" class="math-inline id=${idLabels}"${dataAttrs}>${mathEquation}</span>`
        : `<span class="math-inline ${idLabels}"${dataAttrs}>${mathEquation}</span>`
      : idLabels
        ? `<span id="${idLabels}" class="math-block id=${idLabels}"${dataAttrs}>${mathEquation}</span>`
        : `<span class="math-block ${idLabels}"${dataAttrs}>${mathEquation}</span>`;
  }
  return html;
};
