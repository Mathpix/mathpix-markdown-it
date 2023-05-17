const { mathpixMarkdownPlugin } = require('../lib/markdown/mathpix-markdown-plugins');

const mdInit = (options = {}) => {
  const { htmlTags = true, xhtmlOut = false, width = 1200, breaks = true, typographer = false, linkify = true,
    outMath = {}, mathJax = {}, renderElement = {},
    lineNumbering = false, htmlSanitize = true, smiles = {}, forDocx = false, openLinkInNewWindow = true, addPositionsToTokens = true } = options
  const mmdOptions = {
    width: width,
    outMath: outMath,
    mathJax: mathJax,
    renderElement: renderElement,
    smiles: smiles,
    forDocx: forDocx,
    forLatex: false,
    addPositionsToTokens: addPositionsToTokens
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
    htmlSanitize: htmlSanitize,
    openLinkInNewWindow: openLinkInNewWindow
  })
    .use(mathpixMarkdownPlugin, mmdOptions)
    // .use(require('markdown-it-multimd-table'), {enableRowspan: true, enableMultilineRows: true})
    .use(require("markdown-it-footnote"))
    .use(require("markdown-it-sub"))
    .use(require("markdown-it-sup"))
    // .use(require("markdown-it-deflist"))
    .use(require("markdown-it-mark"))
  // .use(mdPluginCollapsible)
  // .use(require("markdown-it-ins"));

};

const md = mdInit({addPositionsToTokens: true});


let mmdString = 'Use \\url{} to insert a link.';

const parseTokens = md.parse(mmdString, {});

console.log("[parseTokens]=>", parseTokens)



