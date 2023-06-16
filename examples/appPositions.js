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

mmdString = '\\begin{abstract} \n' +
  '\n' +
  'A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution. Digital signatures provide part of the solution, but the main benefits are lost if a trusted third party is still required to prevent double-spending. We propose a solution to the double-spending problem using a peer-to-peer network. The network timestamps transactions by hashing them into an ongoing chain of hash-based proof-of-work, forming a record that cannot be changed without redoing the proof-of-work. The longest chain not only serves as proof of the sequence of events witnessed, but proof that it came from the largest pool of CPU power. As long as a majority of CPU power is controlled by nodes that are not cooperating to attack the network, they\'ll generate the longest chain and outpace attackers. The network itself requires minimal structure. Messages are broadcast on a best effort basis, and nodes can leave and rejoin the network at will, accepting the longest proof-of-work chain as proof of what happened while they were gone.\n' +
  '\n' +
  '\\end{abstract}'

const parseTokens = md.parse(mmdString, {});

console.log("[parseTokens]=>", parseTokens)



