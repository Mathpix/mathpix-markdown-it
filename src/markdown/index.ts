import { mdPluginCollapsible, mdSetPositionsAndHighlight } from "./mdPluginConfigured";

import { mathpixMarkdownPlugin } from './mathpix-markdown-plugins';

import { injectRenderRules } from "./rules";
import { MathpixMarkdownModel as MM, TMarkdownItOptions, ParserErrors } from '../mathpix-markdown-model';

/** md renderer */
const mdInit = (options: TMarkdownItOptions) => {
  const {htmlTags = false, xhtmlOut = false, width = 1200, breaks = true, typographer = true, linkify = true,
          outMath = {}, mathJax = {}, renderElement = {},
          lineNumbering = false, startLine = 0, htmlSanitize = true, smiles = {}, forDocx = false, openLinkInNewWindow =  true,
    isDisableEmoji=false,
    isDisableEmojiShortcuts=false,
    isDisableRefs = false,
    isDisableFootnotes = false,
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
    addSeparateTagIntoResultHtml = {}
  } = options;
  const mmdOptions = {
    width: width,
    outMath: outMath,
    mathJax: mathJax,
    renderElement: renderElement,
    smiles: smiles,
    forDocx: forDocx,
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
    addSeparateTagIntoResultHtml: addSeparateTagIntoResultHtml
  };
  let md = require("markdown-it")({
    html: htmlTags,
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
  if (isDisableRefs) {
    md.disable(['refs', 'refsInline'])
  }  
  if (isDisableFootnotes) {
    md.disable([
      'mmd_footnote_tail',
      'latex_footnote_block',
      'latex_footnotetext_block',
      'latex_footnote',
      'latex_footnotemark',
      'latex_footnotetext',
      'grab_footnote_ref',
      'footnote_tail',
      'footnote_def',
      'footnote_inline',
      'footnote_ref'
    ])
  }
  if (addPositionsToTokens || highlights?.length) {
    /** SetPositions plugin should be last */
    md.use(mdSetPositionsAndHighlight, mmdOptions);
  }
  return md;
};

/** String transformtion pipeline */
// @ts-ignore
export const markdownToHtmlPipeline = (content: string, options: TMarkdownItOptions = {}) => {
  let md = mdInit(options);

  // inject rules override
  md = injectRenderRules(md);

  if (MM.disableRules && MM.disableRules.length > 0) {
      md.disable(MM.disableRules);
  }
  if (options.renderElement && options.renderElement.inLine) {
    return md.renderInline(content);
  } else {
    return md.render(content);
  }
};

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
