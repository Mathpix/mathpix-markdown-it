import { sanitize } from './sanitize';
import { injectInlineStyles } from './inline-styles';
import {getLabelByUuidFromLabelsList, ILabel} from "./common/labels";
import { attrSetToBegin } from "./utils";
import { codeHighlightDef, svgRegex } from "./common/consts";
import { eMmdRuleType } from "./common/mmdRules";
import { getDisableRuleTypes } from "./common/mmdRulesToDisable";

export const PREVIEW_PARAGRAPH_PREFIX = "preview-paragraph-";
export const PREVIEW_LINE_CLASS = "preview-line";

const escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;

/** custom rules to inject in the renderer pipeline (aka mini plugin) */

/** inspired from https://github.com/markdown-it/markdown-it.github.io/blob/master/index.js#L9929 */
function injectLineNumbers(tokens, idx, options, env, slf) {
  let line, endLine, listLine;
  const disableRuleTypes: eMmdRuleType[] = options?.renderOptions ? getDisableRuleTypes(options.renderOptions) : [];
  let className: string = "";
  if (options?.html
    && !disableRuleTypes.includes(eMmdRuleType.html)
    && tokens[idx+1]?.content && svgRegex.test(tokens[idx+1].content)) {
    className = "svg-container";
  }
  if (tokens[idx].uuid) {
    const label: ILabel = getLabelByUuidFromLabelsList(tokens[idx].uuid);
    if (label) {
      attrSetToBegin(tokens[idx].attrs, 'number', label.tag);
      attrSetToBegin(tokens[idx].attrs, 'class', `${label.type} ` + label.id);
      attrSetToBegin(tokens[idx].attrs, 'id', label.id);
    }
  }
  if (tokens[idx].map && tokens[idx].level === 0 && !tokens[idx].notInjectLineNumber) {
    line = options.startLine + tokens[idx].map[0];
    endLine = options.startLine + tokens[idx].map[1];
    listLine = [];
    for (let i = line; i < endLine; i++) {
        listLine.push(i);
    }
    className += className ? " " : "";
    className += PREVIEW_PARAGRAPH_PREFIX + String(line)
      + ' ' + PREVIEW_LINE_CLASS + ' ' + listLine.join(' ');
    tokens[idx].attrJoin("class", className);
    tokens[idx].attrJoin("data_line_start", `${String(line)}`);
    tokens[idx].attrJoin("data_line_end", `${String(endLine-1)}`);
    tokens[idx].attrJoin("data_line", `${String([line, endLine])}`);
    tokens[idx].attrJoin("count_line", `${String(endLine-line)}`);
  } else {
    if (className) {
      tokens[idx].attrJoin("class", className);
    }
  }
  return slf.renderToken(tokens, idx, options, env, slf);
}

function injectLabelIdToParagraphOPen(tokens, idx, options, env, slf) {
  const disableRuleTypes: eMmdRuleType[] = options?.renderOptions ? getDisableRuleTypes(options.renderOptions) : [];
  let className = "";
  if (options?.html
    && !disableRuleTypes.includes(eMmdRuleType.html)
    && tokens[idx+1]?.content && svgRegex.test(tokens[idx+1].content)) {
    className = "svg-container";
  }
  if (tokens[idx].uuid) {
    const label: ILabel = getLabelByUuidFromLabelsList(tokens[idx].uuid);
    if (label) {
      className += className ? " " : "";
      className += `${label.type} ` + label.id;
      attrSetToBegin(tokens[idx].attrs, 'number', label.tag);
      attrSetToBegin(tokens[idx].attrs, 'id', label.id);
    }
  }
  if (className) {
    attrSetToBegin(tokens[idx].attrs, 'class', className);
  }
  return slf.renderToken(tokens, idx, options, env, slf);
}

function injectCenterTables(tokens, idx, options, env, slf) {
  const token = tokens[idx];
  if (token.level === 0) {
    token.attrJoin("align", "center");
  }
  return slf.renderToken(tokens, idx, options, env, slf);
}

function html_block_injectLineNumbers(tokens, idx, options, env, slf) {
  const { htmlSanitize = {}, enableFileLinks } = options;
  let line, endLine, listLine;
  let className: string = "";
  if (tokens[idx]?.content && svgRegex.test(tokens[idx].content.trim())) {
    className = "svg-container";
  }
  if (htmlSanitize !== false) {
    if (tokens[idx] && tokens[idx].content) {
      const optionsSanitize = {
        enableFileLinks: enableFileLinks
      };
      tokens[idx].content = sanitize(tokens[idx].content, Object.assign({}, optionsSanitize, htmlSanitize));
    }
  }

  if (tokens[idx].map && tokens[idx].level === 0) {
    line = options.startLine + tokens[idx].map[0];
    endLine = options.startLine + tokens[idx].map[1];
    listLine = [];
    for (let i = line; i < endLine; i++) {
      listLine.push(i);
    }
    className += className ? " " : "";
    className += PREVIEW_PARAGRAPH_PREFIX + String(line)
      + ' ' + PREVIEW_LINE_CLASS + ' ' + listLine.join(' ');
    tokens[idx].attrJoin("class", className);
    tokens[idx].attrJoin("data_line_start", `${String(line)}`);
    tokens[idx].attrJoin("data_line_end", `${String(endLine-1)}`);
    tokens[idx].attrJoin("data_line", `${String([line, endLine])}`);
    tokens[idx].attrJoin("count_line", `${String(endLine-line)}`);
  } else {
    if (className) {
      tokens[idx].attrJoin("class", className);
    }
  }
  var token = tokens[idx];
  return  '<div' + slf.renderAttrs(token) + '>' +
    tokens[idx].content +
    '</div>\n';
}

function html_block_Sanitize (tokens, idx, options, env, slf) {
  const { htmlSanitize = {}, enableFileLinks = false } = options;
  if (!tokens[idx].content) {
    return '';
  }
  const optionsSanitize = {
    enableFileLinks: enableFileLinks
  };
  if (tokens[idx]?.content && svgRegex.test(tokens[idx].content.trim())) {
    return '<div class="svg-container">'
        + sanitize(tokens[idx].content, Object.assign({}, optionsSanitize, htmlSanitize))
        + '</div>\n';
  }
  return sanitize(tokens[idx].content, Object.assign({}, optionsSanitize, htmlSanitize));
}

function html_block_injectStyleForSvg (tokens, idx, options, env, slf) {
  if (!tokens[idx].content) {
    return '';
  }
  if (tokens[idx]?.content && svgRegex.test(tokens[idx].content.trim())) {
    return  '<div class="svg-container">'
        + tokens[idx].content
        + '</div>\n';
  }
  return tokens[idx].content;
}

function html_inline_Sanitize (tokens, idx, options) {
  const { htmlSanitize = {}, enableFileLinks = false } = options;
  if (!tokens[idx].content) {
    return '';
  }
  const hasNotCloseTag = tokens[idx].content.indexOf('/>') === -1;

  const optionsSanitize = {
    skipCloseTag: hasNotCloseTag && !tokens[idx].isSvg,
    enableFileLinks: enableFileLinks
  };
  return  htmlSanitize && Object.keys(htmlSanitize).length > 0
    ? sanitize(tokens[idx].content, Object.assign({}, optionsSanitize, htmlSanitize))
    : sanitize(tokens[idx].content, optionsSanitize);
}

export function code_block_injectLineNumbers(tokens, idx, options, env, slf) {
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
    }

    var token = tokens[idx];
    let { codeHighlight = {}} = options;
    codeHighlight = Object.assign({}, codeHighlightDef, codeHighlight);
    const { code = true } = codeHighlight;
    let highlighted = code && options.highlight
      ? options.highlight(token.content, '') || escapeHtml(token.content)
      : escapeHtml(token.content);
    return  '<pre' + slf.renderAttrs(token) + '><code>' +
      highlighted +
      '</code></pre>\n';
}

/** overwrite paragraph_open and close rule to inject line number */
export function withLineNumbers(renderer) {
  renderer.renderer.rules.paragraph_open
      = renderer.renderer.rules.heading_open
      = renderer.renderer.rules.addcontentsline_open
      = renderer.renderer.rules.ordered_list_open
      = renderer.renderer.rules.bullet_list_open
      = renderer.renderer.rules.blockquote_open
      = renderer.renderer.rules.dl_open
      = injectLineNumbers;
  let { codeHighlight = {}} = renderer.options;
  codeHighlight = Object.assign({}, codeHighlightDef, codeHighlight);
  const { code = true } = codeHighlight;
  if (!code) {
    renderer.renderer.rules.code_block = code_block_injectLineNumbers;
  }
  return renderer;
}

export function injectLabelIdToParagraph(renderer) {
  renderer.renderer.rules.paragraph_open
    = injectLabelIdToParagraphOPen;
  return renderer;
}

export const injectRenderRules = (renderer) => {
  const { lineNumbering = false, htmlSanitize = {}, html = false, forDocx = false, centerTables = true, renderOptions = null } = renderer.options;
  const disableRuleTypes: eMmdRuleType[] = renderOptions ? getDisableRuleTypes(renderOptions) : [];
  if (centerTables) {
    renderer.renderer.rules.table_open = injectCenterTables;
  }
  if (forDocx) {
    injectInlineStyles(renderer);
  }
  if (lineNumbering) {
    withLineNumbers(renderer);
    if (html && !disableRuleTypes.includes(eMmdRuleType.html)) {
      renderer.renderer.rules.html_block = html_block_injectLineNumbers;
      if (htmlSanitize !== false) {
        renderer.renderer.rules.html_inline  = html_inline_Sanitize;
      }
    }
  } else {
    injectLabelIdToParagraph(renderer);
    if (html && !disableRuleTypes.includes(eMmdRuleType.html)) {
      if (htmlSanitize !== false) {
        renderer.renderer.rules.html_block = html_block_Sanitize;
        renderer.renderer.rules.html_inline  = html_inline_Sanitize;
      } else {
        renderer.renderer.rules.html_block = html_block_injectStyleForSvg;
      }
    }
  }
  return renderer;
};
