import {
  mdPluginCollapsible
} from "./mdPluginConfigured";

import mathpixMarkdownPlugin from './mathpix-markdown-plugins';

import { injectRenderRules } from "./rules";
import {MathpixMarkdownModel as MM, TMarkdownItOptions} from '../mathpix-markdown-model'

/** md renderer */
const mdInit = (options: TMarkdownItOptions) => {
  const {htmlTags = false, xhtmlOut = false, width = 1200, breaks = true, typographer = true, linkify = true,
          outMath = {}, mathJax = {}, renderElement = {},
          lineNumbering = false, htmlSanitize = true, smiles = {}} = options;
  const mmdOptions = {
    width: width,
    outMath: outMath,
    mathJax: mathJax,
    renderElement: renderElement,
    smiles: smiles
  };
  return require("markdown-it")({
    html: htmlTags,
    xhtmlOut: xhtmlOut,
    breaks: breaks,
    langPrefix: "language-",
    linkify: linkify,
    typographer: typographer,
    quotes: "“”‘’",
    lineNumbering: lineNumbering,
    htmlSanitize: htmlSanitize
  })
    .use(mathpixMarkdownPlugin, mmdOptions)
    .use(require('markdown-it-multimd-table'), {enableRowspan: true, enableMultilineRows: true})
    .use(require("markdown-it-footnote"))
    .use(require("markdown-it-sub"))
    .use(require("markdown-it-sup"))
    .use(require("markdown-it-deflist"))
    .use(require("markdown-it-mark"))
    .use(require("markdown-it-emoji"))
    .use(mdPluginCollapsible)
    .use(require("markdown-it-ins"));
};

const setOptionForPreview = (mdOption, mmdOptions) => {
  const {width = 1200,  outMath = {}, smiles = {}, mathJax = {}, renderElement = {}, useInlineStyle = true,
    htmlTags=false} = mmdOptions;
  Object.assign(mdOption, smiles);
  Object.assign(mdOption, {
    width: width,
    outMath: outMath,
    mathJax: mathJax,
    renderElement: renderElement,
    useInlineStyle: useInlineStyle
  });
  mdOption.html = htmlTags;
};

export const initMathpixMarkdown = (md, callback) => {
  const { parse, renderer } = md;
  const { render } = renderer;
  md.parse = (markdown, env) => {
    const mmdOptions = callback();
    setOptionForPreview(md.options, mmdOptions);
    return parse.call(md, markdown, env)
  };
  renderer.render = (tokens, options, env) => {
    MM.texReset();
    const html = render.call(renderer, tokens, options, env);
    const style = MM.getMathpixStyle();
    return `<style id="mmd-vscode-style">${style}</style><div id="preview-content">${html}</div>`
  };
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
  return markdownToHtmlPipeline(markdown, options);
}
