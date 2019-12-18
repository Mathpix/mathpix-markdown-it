export const PREVIEW_PARAGRAPH_PREFIX = "preview-paragraph-";
export const PREVIEW_LINE_CLASS = "preview-line";

const escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;

/** custom rules to inject in the renderer pipeline (aka mini plugin) */

/** inspired from https://github.com/markdown-it/markdown-it.github.io/blob/master/index.js#L9929 */
function injectLineNumbers(tokens, idx, options, env, slf) {
  let line, endLine, listLine;

  if (tokens[idx].map && tokens[idx].level === 0) {
    line = tokens[idx].map[0];
    endLine = tokens[idx].map[1];
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

  }
  return slf.renderToken(tokens, idx, options, env, slf);
}

function html_block_injectLineNumbers(tokens, idx, options, env, slf) {
  let line, endLine, listLine;

  if (tokens[idx].map && tokens[idx].level === 0) {
    line = tokens[idx].map[0];
    endLine = tokens[idx].map[1];
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
  }

  var token = tokens[idx];
  return  '<div' + slf.renderAttrs(token) + '>' +
    tokens[idx].content +
    '</div>\n';
}

function code_block_injectLineNumbers(tokens, idx, options, env, slf) {
    let line, endLine, listLine;
    if (tokens[idx].map && tokens[idx].level === 0) {
        line = tokens[idx].map[0];
        endLine = tokens[idx].map[1];
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
    }

    var token = tokens[idx];
    return  '<pre' + slf.renderAttrs(token) + '><code>' +
        escapeHtml(tokens[idx].content) +
        '</code></pre>\n';
}


/** overwrite paragraph_open and close rule to inject line number */
export function withLineNumbers(renderer) {
  renderer.renderer.rules.paragraph_open
      = renderer.renderer.rules.heading_open
      = renderer.renderer.rules.ordered_list_open
      = renderer.renderer.rules.bullet_list_open
      = renderer.renderer.rules.blockquote_open
      = renderer.renderer.rules.dl_open
      = injectLineNumbers;
    renderer.renderer.rules.html_block  = html_block_injectLineNumbers;
    renderer.renderer.rules.code_block
      = renderer.renderer.rules.fence
      = code_block_injectLineNumbers;
  return renderer;
}
