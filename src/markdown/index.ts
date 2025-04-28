import { mdPluginCollapsible, mdSetPositionsAndHighlight } from "./mdPluginConfigured";

import { mathpixMarkdownPlugin } from './mathpix-markdown-plugins';

import { injectRenderRules } from "./rules";
import { MathpixMarkdownModel as MM, TMarkdownItOptions, ParserErrors } from '../mathpix-markdown-model';
import { applyRulesToDisableRules, getDisableRuleTypes, getListToDisableByOptions } from "./common/mmdRulesToDisable";
import { eMmdRuleType } from "./common/mmdRules";

/** md renderer */
const mdInit = (options: TMarkdownItOptions) => {
  const {htmlTags = false, htmlDisableTagMatching = false, xhtmlOut = false, width = 1200, breaks = true, typographer = true, linkify = true,
          outMath = {}, mathJax = {}, renderElement = {},
          lineNumbering = false, startLine = 0, htmlSanitize = true, smiles = {},
    forDocx = false, forPptx = false,
    openLinkInNewWindow =  true,
    isDisableEmoji=false,
    isDisableEmojiShortcuts=false,
    maxWidth = '',
    enableFileLinks = false, validateLink = null,
    toc = {},
    accessibility = null,
    nonumbers = false,
    showPageBreaks = false,
    centerImages = true,
    centerTables = true,
    enableCodeBlockRuleForLatexCommands = false,
    addPositionsToTokens = false,
    highlights = [],
    parserErrors = ParserErrors.show,
    codeHighlight = {},
    footnotes = {},
    copyToClipboard = false,
    renderOptions = null,
    previewUuid = "",
    enableSizeCalculation = false
  } = options;
  const mmdOptions = {
    width: width,
    outMath: outMath,
    mathJax: mathJax,
    renderElement: renderElement,
    smiles: smiles,
    forDocx: forDocx,
    forPptx: forPptx,
    maxWidth: maxWidth,
    enableFileLinks: enableFileLinks,
    validateLink: validateLink,
    toc: toc,
    accessibility: accessibility,
    nonumbers: nonumbers,
    showPageBreaks: showPageBreaks,
    centerImages: centerImages,
    centerTables: centerTables,
    enableCodeBlockRuleForLatexCommands: enableCodeBlockRuleForLatexCommands,
    addPositionsToTokens: addPositionsToTokens,
    highlights: highlights,
    parserErrors: parserErrors,
    codeHighlight: codeHighlight,
    footnotes: footnotes,
    copyToClipboard: copyToClipboard,
    renderOptions: renderOptions,
    previewUuid: previewUuid,
    enableSizeCalculation: enableSizeCalculation
  };
  const disableRuleTypes: eMmdRuleType[] = renderOptions ? getDisableRuleTypes(renderOptions) : [];
  let md = require("markdown-it")({
    html: htmlTags && !disableRuleTypes.includes(eMmdRuleType.html),
    htmlDisableTagMatching: htmlDisableTagMatching,
    xhtmlOut: xhtmlOut,
    breaks: breaks,
    langPrefix: "language-",
    linkify: linkify,
    typographer: typographer,
    quotes: "“”‘’",
    lineNumbering: lineNumbering,
    startLine: startLine,
    htmlSanitize: htmlSanitize,
    openLinkInNewWindow: openLinkInNewWindow
  });

  md.use(mathpixMarkdownPlugin, mmdOptions)
    .use(require('markdown-it-multimd-table'), {enableRowspan: true, enableMultilineRows: true})
    .use(require("markdown-it-footnote"))
    .use(require("markdown-it-sub"))
    .use(require("markdown-it-sup"))
    .use(require("markdown-it-deflist"))
    .use(require("markdown-it-mark"))
    .use(mdPluginCollapsible)
    .use(require("markdown-it-ins"));

  if (!isDisableEmoji) {
    if (isDisableEmojiShortcuts) {
      md.use(require("markdown-it-emoji"), { shortcuts: {} })
    } else {
      md.use(require("markdown-it-emoji"))
    }
  }
  if (addPositionsToTokens || highlights?.length) {
    /** SetPositions plugin should be last */
    md.use(mdSetPositionsAndHighlight, mmdOptions);
  }
  const disableRules: string[] = getListToDisableByOptions(md, options);
  if (disableRules?.length) {
    md.disable(disableRules, true);
  }
  return md;
};

export const markdownToHtmlPipelineSegments = (content: string, options: TMarkdownItOptions = {}): Array<{id: number, html: string}> => {
  let md = mdInit(options);
  // inject rules override
  md = injectRenderRules(md);

  if (MM.disableRules && MM.disableRules.length > 0) {
    const disableRules: string[] = applyRulesToDisableRules(md, MM.disableRules, []);
    md.disable(disableRules, true);
  }

  md.renderer.render = function (tokens, options, env) {
    const result = [];
    let line: string = '';
    let waitTag: string = '';
    let waitLevel: number = 0;
    let blockId: number = 0;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      let rendered = '';
      if (token.type === 'inline') {
        rendered = this.renderInline(tokens[i].children, options, env);
      } else if (typeof this.rules[token.type] !== 'undefined') {
        rendered = this.rules[tokens[i].type](tokens, i, options, env, this);
      } else {
        rendered = this.renderToken(tokens, i, options, env);
      }

      if (waitTag) {
        if (token.type === waitTag && waitLevel === token.level) {
          line += rendered;
          // result.push(line);
          result.push({ id: blockId++, html: line });
          line = '';
          waitTag = '';
          waitLevel = 0;
          continue;
        }
        line += rendered;
        continue
      }

      if (token.type.includes('_open')) {
        waitTag = token.type.replace('open', 'close');
        waitLevel = token.level;
        line += rendered;
        continue;
      }

      if (['hr', 'html_block', 'fence', 'code_block'].includes(token.type)) {
        if (line) {
          result.push({ id: blockId++, html: line });
        }
        result.push({ id: blockId++, html: rendered });
        line = '';
        continue;
      }
      line += rendered;
    }
    if (line) result.push({ id: blockId++, html: line });
    return result;
  };

  return md.render(content);
};

/** String transformtion pipeline */
// @ts-ignore
export const markdownToHtmlPipeline = (content: string, options: TMarkdownItOptions = {}) => {
  let md = mdInit(options);

  // inject rules override
  md = injectRenderRules(md);

  if (MM.disableRules && MM.disableRules.length > 0) {
    const disableRules: string[] = applyRulesToDisableRules(md, MM.disableRules, []);
    md.disable(disableRules, true);
  }
  if (options.renderElement && options.renderElement.inLine) {
    return md.renderInline(content);
  } else {
    return md.render(content);
  }
};

export function markdownToHTMLSegments(markdown: string, options: TMarkdownItOptions = {}): Array<{id: number, html: string}>{
  try {
    return markdownToHtmlPipelineSegments(markdown, options);
  } catch (e) {
    console.log("ERROR=>[markdownToHTMLSegments]=>");
    console.error(e);
    return [];
  }
}

/**
 * convert a markdown text to html
 */
export function markdownToHTML(markdown: string, options: TMarkdownItOptions = {}): string {
  try {
    return markdownToHtmlPipeline(markdown, options);
  } catch (e) {
    console.log("ERROR=>[markdownToHTML]=>");
    console.error(e);
    return '';
  }
}
