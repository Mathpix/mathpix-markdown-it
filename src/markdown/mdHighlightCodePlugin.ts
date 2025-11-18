import hljs from 'highlight.js';
const escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;
import { PREVIEW_LINE_CLASS, PREVIEW_PARAGRAPH_PREFIX, code_block_injectLineNumbers } from "./rules";
import { codeHighlightDef } from "./common/consts";
import { clipboardCopyElement } from "../copy-to-clipboard/clipboard-copy-element";
import { getHtmlSeparatingSpanContainer } from "./common/separating-span";

const maybe = f => {
  try {
    return f()
  } catch (e) {
    return false
  }
};

// Highlight with given language.
const highlight = (code: string, lang: string, originalHighlight?) => {
  // Looks up a language by name or alias.
  // Returns the language object if found, undefined otherwise.
  let langObj = hljs.getLanguage(lang);
  if (langObj === undefined) {
    return typeof originalHighlight === 'function' ? originalHighlight(code, lang) : '';
  }
  if (!lang) return '';
  if (lang.toLowerCase() === 'latex') lang = 'tex';
  return maybe(() => hljs.highlight(code, {language: lang, ignoreIllegals: true}).value) || ''
};

// Highlight with given language or automatically.
const highlightAuto = (code: string, lang: string, originalHighlight?) => {
  // Looks up a language by name or alias.
  // Returns the language object if found, undefined otherwise.
  let langObj = hljs.getLanguage(lang);
  if (lang && langObj === undefined) {
    return typeof originalHighlight === 'function' ? originalHighlight(code, lang) : '';
  }
  if (lang?.toLowerCase() === 'latex') lang = 'tex';
  return lang
    ? highlight(code, lang)
    : maybe(() => hljs.highlightAuto(code).value) || ''
};

// Wrap a render function to add `hljs` class to code blocks.
// const wrap = render => (...args) => {
const wrapFence = render => (tokens, idx, options, env, slf) => {
  let html = render.apply(render, [tokens, idx, options, env, slf]);
  html = html
    .replace('<code class="', '<code class="hljs ')
    .replace('<code>', '<code class="hljs">')
  let htmlMol: string = '';
  if (tokens[idx].info === "mol" && options?.outMath?.include_mol) {
    htmlMol = '<mol style="display: none;">' + tokens[idx].content + '</mol>';
    html = html
        .replace('</pre>', htmlMol + '</pre>')
  }

  if (options?.lineNumbering) {
    let line, endLine, listLine;
    if (tokens[idx].map && tokens[idx].level === 0) {
      line = options.startLine + tokens[idx].map[0];
      endLine = options.startLine + tokens[idx].map[1];
      listLine = [];
      for (let i = line; i < endLine; i++) {
        listLine.push(i);
      }
      tokens[idx].attrJoin("class", PREVIEW_PARAGRAPH_PREFIX + String(line)
        + ' ' + PREVIEW_LINE_CLASS + ' ' + listLine.join(' '));
      tokens[idx].attrJoin("data_line_start", `${String(line)}`);
      tokens[idx].attrJoin("data_line_end", `${String(endLine-1)}`);
      tokens[idx].attrJoin("data_line", `${String([line, endLine])}`);
      tokens[idx].attrJoin("count_line", `${String(endLine-line)}`);
      if (options.copyToClipboard) {
        tokens[idx].attrJoin("style", `overflow: auto; position: relative;`);
        let htmlClipboardCopy = clipboardCopyElement(tokens[idx].content);
        html = '<div ' + slf.renderAttrs(tokens[idx]) + '>' + html + htmlClipboardCopy + '</div>';
      } else {
        html = html.replace('<pre>', '<pre' + slf.renderAttrs(tokens[idx]) + '>')
      }
      return html;
    }
  }
  if (options.copyToClipboard || options.previewUuid) {
    tokens[idx].attrJoin("style", `overflow: auto; position: relative;`);
    let htmlClipboardCopy: string = options.copyToClipboard
      ? clipboardCopyElement(tokens[idx].content)
      : "";
    let htmlSeparatingSpan: string = options.previewUuid && tokens[idx].contentSpan
      ? getHtmlSeparatingSpanContainer(tokens[idx].contentSpan)
      : "";
    html = '<div ' + slf.renderAttrs(tokens[idx]) + '>'
      + html
      + htmlSeparatingSpan
      + htmlClipboardCopy
      + '</div>';
  }
  return html;
};

// Wrap a render function to add `hljs` class to code blocks.
// const wrap = render => (...args) => {
const wrapLatexCodeEnv = render => (tokens, idx, options, env, slf) => {
  let html = render.apply(render, [tokens, idx, options, env, slf]);
  html = html
    .replace('<code class="', '<code class="hljs ')
    .replace('<code>', '<code class="hljs">')

  if (options?.lineNumbering) {
    let line, endLine, listLine;
    if (tokens[idx].map && tokens[idx].level === 0) {
      line = options.startLine + tokens[idx].map[0];
      endLine = options.startLine + tokens[idx].map[1];
      listLine = [];
      for (let i = line; i < endLine; i++) {
        listLine.push(i);
      }
      tokens[idx].attrJoin("class", PREVIEW_PARAGRAPH_PREFIX + String(line)
        + ' ' + PREVIEW_LINE_CLASS + ' ' + listLine.join(' '));
      tokens[idx].attrJoin("data_line_start", `${String(line)}`);
      tokens[idx].attrJoin("data_line_end", `${String(endLine-1)}`);
      tokens[idx].attrJoin("data_line", `${String([line, endLine])}`);
      tokens[idx].attrJoin("count_line", `${String(endLine-line)}`);
      if (options.copyToClipboard) {
        tokens[idx].attrJoin("style", `overflow: auto; position: relative;`);
        let htmlClipboardCopy = clipboardCopyElement(tokens[idx].content);
        html = '<div ' + slf.renderAttrs(tokens[idx]) + '>' + html + htmlClipboardCopy + '</div>';
      } else {
        html = html.replace('<pre>', '<pre' + slf.renderAttrs(tokens[idx]) + '>')
      }
      return html;
    }
  }
  if (options.copyToClipboard || options.previewUuid) {
    tokens[idx].attrJoin("style", `overflow: auto; position: relative;`);
    let htmlClipboardCopy: string = options.copyToClipboard
      ? clipboardCopyElement(tokens[idx].content)
      : "";
    let htmlSeparatingSpan: string = options.previewUuid && tokens[idx].contentSpan
      ? getHtmlSeparatingSpanContainer(tokens[idx].contentSpan)
      : "";
    html = '<div ' + slf.renderAttrs(tokens[idx]) + '>'
      + html
      + htmlSeparatingSpan
      + htmlClipboardCopy
      + '</div>';
  }
  return html;
};

const highlight_code_block = (tokens, idx, options, env, slf) => {
  let token = tokens[idx];
  let { codeHighlight = {}} = options;
  codeHighlight = Object.assign({}, codeHighlightDef, codeHighlight);
  const { code = true } = codeHighlight;
  let highlighted = code && options.highlight
    ? options.highlight(token.content, '') || escapeHtml(token.content)
    : escapeHtml(token.content);
  return  '<pre' + slf.renderAttrs(token) + '><code>' +
    highlighted +
    '</code></pre>\n';
};

const wrap = render => (tokens, idx, options, env, slf) => (
  render.apply(render, [tokens, idx, options, env, slf])
    .replace('<code class="', '<code class="hljs ')
    .replace('<code>', '<code class="hljs">')
);

const highlightjs = (md, opts) => {
  opts = Object.assign({}, codeHighlightDef, opts);
  const originalHighlight = md.options.highlight;
  md.options.highlight = (code: string, lang: string) => opts.auto
    ? highlightAuto(code, lang, originalHighlight)
    : highlight(code, lang, originalHighlight);

  md.renderer.rules.fence = wrapFence(md.renderer.rules.fence);
  md.renderer.rules.latex_lstlisting_env = wrapLatexCodeEnv(md.renderer.rules.latex_lstlisting_env);

  if (opts.code) {
    md.renderer.rules.code_block = md.options?.lineNumbering 
      ? wrap(code_block_injectLineNumbers) 
      : wrap(highlight_code_block)
  }
}

export default highlightjs;
