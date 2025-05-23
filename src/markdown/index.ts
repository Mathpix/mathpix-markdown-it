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

/**
 * Converts Markdown content to segmented HTML with position mapping.
 *
 * This function initializes a markdown-it parser with custom options and injected rendering rules,
 * then overrides the renderer's render method to produce HTML content in segments. Each segment
 * corresponds to a continuous chunk of HTML generated from one or more markdown tokens. It also
 * returns a map of tuples indicating the start and end indices of each HTML segment within the
 * combined output string.
 *
 * The segmentation logic groups tokens until a closing tag of an opened block is found or certain
 * block tokens (like hr, fence, code_block, html_block) appear, splitting the content accordingly.
 * Special handling is included for first block math tokens inside lists.
 *
 * @param {string} content - The Markdown source content to convert.
 * @param {TMarkdownItOptions} [options={}] - Optional configuration options for the markdown-it parser.
 * @returns {{ content: string, map: [number, number][] }} An object containing:
 *   - content: the concatenated HTML string from all segments.
 *   - map: an array of tuples, each tuple [start, end] marks the indices of each HTML segment within the content.
 */
export const markdownToHtmlPipelineSegments = (content: string, options: TMarkdownItOptions = {}): {content: string, map: [number, number][]} => {
  let md = mdInit(options);
  // inject rules override
  md = injectRenderRules(md);

  if (MM.disableRules && MM.disableRules.length > 0) {
    const disableRules: string[] = applyRulesToDisableRules(md, MM.disableRules, []);
    md.disable(disableRules, true);
  }

  md.renderer.render = function (tokens, options, env): {content: string, map: [number, number][]} {
    let content: string = '';
    const map: [number, number][] = [];
    let line: string = '';
    let pendingCloseTag: string = '';
    let pendingLevel: number = 0;

    const isFirstBlockMathInList = (current: any, prev: any, next: any) => {
      if (current.type !== 'paragraph_open' || prev?.type !== 'list_item_open') return false;
      const firstChildType = next?.type === 'inline' ? next.children?.[0]?.type : null;
      return ['equation_math', 'equation_math_not_number', 'display_math'].includes(firstChildType);
    };

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const prevToken = tokens[i - 1];
      const nextToken = tokens[i + 1];

      let rendered: string = '';
      if (token.type === 'inline') {
        rendered = this.renderInline(token.children, options, env);
      } else if (typeof this.rules[token.type] !== 'undefined') {
        rendered = this.rules[token.type](tokens, i, options, env, this);
        if (isFirstBlockMathInList(token, prevToken, nextToken)) {
          rendered = '<span>&nbsp</span>';
        }
      } else {
        rendered = this.renderToken(tokens, i, options, env);
      }

      if (pendingCloseTag) {
        if (token.type === pendingCloseTag && pendingLevel === token.level) {
          line += rendered;
          const start: number = content.length;
          content += line;
          map.push([start, content.length]);
          line = '';
          pendingCloseTag = '';
          pendingLevel = 0;
          continue;
        }
        line += rendered;
        continue;
      }

      if (token.type.endsWith('_open')) {
        pendingCloseTag = token.type.replace('open', 'close');
        pendingLevel = token.level;
        line += rendered;
        continue;
      }

      if (['hr', 'html_block', 'fence', 'code_block'].includes(token.type)) {
        if (line) {
          const start: number = content.length;
          content += line;
          map.push([start, content.length]);
          line = '';
        }
        const start: number = content.length;
        content += rendered;
        map.push([start, content.length]);
        continue;
      }
      line += rendered;
    }

    if (line) {
      const start: number = content.length;
      content += line;
      map.push([start, content.length]);
    }
    return { content, map };
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

export function markdownToHTMLSegments(markdown: string, options: TMarkdownItOptions = {}): {content: string, map: [number, number][]}{
  try {
    return markdownToHtmlPipelineSegments(markdown, options);
  } catch (e) {
    console.log("ERROR=>[markdownToHTMLSegments]=>");
    console.error(e);
    return null;
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
