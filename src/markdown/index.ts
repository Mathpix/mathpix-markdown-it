import { mdPluginCollapsible, mdSetPositionsAndHighlight } from "./mdPluginConfigured";

import { mathpixMarkdownPlugin } from './mathpix-markdown-plugins';

import { injectRenderRules } from "./rules";
import { MathpixMarkdownModel as MM, TMarkdownItOptions, ParserErrors, TextDirection } from '../mathpix-markdown-model';
import { applyRulesToDisableRules, getDisableRuleTypes, getListToDisableByOptions } from "./common/mmdRulesToDisable";
import { eMmdRuleType } from "./common/mmdRules";
import { injectTextDirection } from "./common/injectTextDirection";

/** md renderer */
const mdInit = (options: TMarkdownItOptions) => {
  const {htmlTags = false, xhtmlOut = false, width = 1200, breaks = true, typographer = true, linkify = true,
          outMath = {}, mathJax = {}, renderElement = {},
          lineNumbering = false, startLine = 0, htmlSanitize = true, smiles = {}, forDocx = false, openLinkInNewWindow =  true,
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
    textDirection = TextDirection.unset
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
    footnotes: footnotes,
    copyToClipboard: copyToClipboard,
    renderOptions: renderOptions,
    previewUuid: previewUuid,
    textDirection: textDirection
  };
  const disableRuleTypes: eMmdRuleType[] = renderOptions ? getDisableRuleTypes(renderOptions) : [];
  let md = require("markdown-it")({
    html: htmlTags && !disableRuleTypes.includes(eMmdRuleType.html),
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
    const { textDirection = TextDirection.unset } = options;
    if (textDirection !== TextDirection.unset) {
      injectTextDirection(md, textDirection);
    }
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
