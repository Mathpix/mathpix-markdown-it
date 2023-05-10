import { MarkdownIt } from 'markdown-it';
import { MathpixMarkdownModel } from "../mathpix-markdown-model";
import { resetTextCounter } from './mdPluginText';
import { resetTheoremEnvironments } from './md-theorem/helper';

import {
  mdPluginMathJax,
  mdPluginHighlightCode,
  mdPluginText,
  mdPluginTOC,
  mdPluginAnchor,
  mdPluginTableTabular,
  mdPluginList,
  mdPluginSvgToBase64

} from "./mdPluginConfigured";
import { validateLinkEnableFile } from "./mdOptions";
import { injectLabelIdToParagraph } from "./rules";

export const mathpixMarkdownPlugin = (md: MarkdownIt, options) => {
  const {width = 1200,  outMath = {}, smiles = {}, mathJax = {}, renderElement = {}, forDocx = false, forLatex = false,
    maxWidth = '',
    enableFileLinks = false, validateLink = null,
    toc = {},
    accessibility = null,
    nonumbers = false,
    showPageBreaks = false,
    centerImages = true,
    centerTables = true,
    enableCodeBlockRuleForLatexCommands = false
  } = options;
  Object.assign(md.options, smiles);
  Object.assign(md.options, {
    width: width,
    outMath: outMath,
    mathJax: mathJax,
    renderElement: renderElement,
    forDocx: forDocx,
    forLatex: forLatex,
    maxWidth: maxWidth,
    enableFileLinks: enableFileLinks,
    accessibility: accessibility,
    nonumbers: nonumbers,
    showPageBreaks: showPageBreaks,
    centerImages: centerImages,
    centerTables: centerTables,
    enableCodeBlockRuleForLatexCommands: enableCodeBlockRuleForLatexCommands
  });

  md
    .use(mdPluginTableTabular)
    .use(mdPluginList)
    .use(mdPluginMathJax({}))
    .use(mdPluginText())
    .use(mdPluginHighlightCode, { auto: false })
    .use(mdPluginAnchor)
    .use(mdPluginTOC, {toc: toc});

  if ( forDocx ) {
    md.use(mdPluginSvgToBase64);
  }

  if (enableFileLinks || validateLink) {
    md.validateLink = validateLink 
      ? validateLink 
      : validateLinkEnableFile;
  }
  injectLabelIdToParagraph(md);
};

export const setBaseOptionsMd = (baseOption, mmdOptions) => {
  const {
    htmlTags = false, xhtmlOut = false, breaks = true, typographer = true, linkify = true, openLinkInNewWindow = true
  } = mmdOptions;

  baseOption.html = htmlTags;
  baseOption.xhtmlOut = xhtmlOut;
  baseOption.breaks = breaks;
  baseOption.langPrefix = "language-";
  baseOption.linkify = linkify;
  baseOption.typographer = typographer;
  baseOption.quotes = "“”‘’";
  baseOption.openLinkInNewWindow = openLinkInNewWindow;
};

const setOptionForPreview = (mdOption, mmdOptions) => {
  const { width = 1200,  outMath = {}, smiles = {}, mathJax = {}, renderElement = {} } = mmdOptions;

  Object.assign(mdOption, smiles);
  Object.assign(mdOption, {
    width: width,
    outMath: outMath,
    mathJax: mathJax,
    renderElement: renderElement
  });

  setBaseOptionsMd(mdOption, mmdOptions);
};

export const initMathpixMarkdown = (md, callback) => {
  const { parse, renderer } = md;
  const { render } = renderer;

  md.parse = (markdown, env) => {
    resetTheoremEnvironments();
    const mmdOptions = callback();
    setOptionForPreview(md.options, mmdOptions);
    return parse.call(md, markdown, env)
  };

  renderer.render = (tokens, options, env) => {
    MathpixMarkdownModel.texReset();
    resetTextCounter();

    let html = render.call(renderer, tokens, options, env);

    const style = MathpixMarkdownModel.getMathpixMarkdownStyles(false);

    let resHtml: string = `<style id="mmd-vscode-style">${style}</style>`;
    resHtml += '\n';
    resHtml += `<div id="preview-content">${html}</div>`;
    return resHtml;
  };
  return md;
};
