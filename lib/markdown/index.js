"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToHTML = exports.markdownToHtmlPipeline = void 0;
var mdPluginConfigured_1 = require("./mdPluginConfigured");
var mathpix_markdown_plugins_1 = require("./mathpix-markdown-plugins");
var rules_1 = require("./rules");
var mathpix_markdown_model_1 = require("../mathpix-markdown-model");
/** md renderer */
var mdInit = function (options) {
    var _a = options.htmlTags, htmlTags = _a === void 0 ? false : _a, _b = options.xhtmlOut, xhtmlOut = _b === void 0 ? false : _b, _c = options.width, width = _c === void 0 ? 1200 : _c, _d = options.breaks, breaks = _d === void 0 ? true : _d, _e = options.typographer, typographer = _e === void 0 ? true : _e, _f = options.linkify, linkify = _f === void 0 ? true : _f, _g = options.outMath, outMath = _g === void 0 ? {} : _g, _h = options.mathJax, mathJax = _h === void 0 ? {} : _h, _j = options.renderElement, renderElement = _j === void 0 ? {} : _j, _k = options.lineNumbering, lineNumbering = _k === void 0 ? false : _k, _l = options.startLine, startLine = _l === void 0 ? 0 : _l, _m = options.htmlSanitize, htmlSanitize = _m === void 0 ? true : _m, _o = options.smiles, smiles = _o === void 0 ? {} : _o, _p = options.forDocx, forDocx = _p === void 0 ? false : _p, _q = options.openLinkInNewWindow, openLinkInNewWindow = _q === void 0 ? true : _q, _r = options.isDisableEmoji, isDisableEmoji = _r === void 0 ? false : _r, _s = options.isDisableEmojiShortcuts, isDisableEmojiShortcuts = _s === void 0 ? false : _s, _t = options.isDisableRefs, isDisableRefs = _t === void 0 ? false : _t, _u = options.isDisableFootnotes, isDisableFootnotes = _u === void 0 ? false : _u, _v = options.maxWidth, maxWidth = _v === void 0 ? '' : _v, _w = options.enableFileLinks, enableFileLinks = _w === void 0 ? false : _w, _x = options.validateLink, validateLink = _x === void 0 ? null : _x, _y = options.toc, toc = _y === void 0 ? {} : _y, _z = options.accessibility, accessibility = _z === void 0 ? null : _z, _0 = options.nonumbers, nonumbers = _0 === void 0 ? false : _0, _1 = options.showPageBreaks, showPageBreaks = _1 === void 0 ? false : _1, _2 = options.centerImages, centerImages = _2 === void 0 ? true : _2, _3 = options.centerTables, centerTables = _3 === void 0 ? true : _3, _4 = options.enableCodeBlockRuleForLatexCommands, enableCodeBlockRuleForLatexCommands = _4 === void 0 ? false : _4, _5 = options.addPositionsToTokens, addPositionsToTokens = _5 === void 0 ? false : _5, _6 = options.highlights, highlights = _6 === void 0 ? [] : _6, _7 = options.parserErrors, parserErrors = _7 === void 0 ? mathpix_markdown_model_1.ParserErrors.show : _7, _8 = options.codeHighlight, codeHighlight = _8 === void 0 ? {} : _8;
    var mmdOptions = {
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
        codeHighlight: codeHighlight
    };
    var md = require("markdown-it")({
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
    md.use(mathpix_markdown_plugins_1.mathpixMarkdownPlugin, mmdOptions)
        .use(require('markdown-it-multimd-table'), { enableRowspan: true, enableMultilineRows: true })
        .use(require("markdown-it-footnote"))
        .use(require("markdown-it-sub"))
        .use(require("markdown-it-sup"))
        .use(require("markdown-it-deflist"))
        .use(require("markdown-it-mark"))
        .use(mdPluginConfigured_1.mdPluginCollapsible)
        .use(require("markdown-it-ins"));
    if (!isDisableEmoji) {
        if (isDisableEmojiShortcuts) {
            md.use(require("markdown-it-emoji"), { shortcuts: {} });
        }
        else {
            md.use(require("markdown-it-emoji"));
        }
    }
    if (isDisableRefs) {
        md.disable(['refs', 'refsInline']);
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
        ]);
    }
    if (addPositionsToTokens || (highlights === null || highlights === void 0 ? void 0 : highlights.length)) {
        /** SetPositions plugin should be last */
        md.use(mdPluginConfigured_1.mdSetPositionsAndHighlight, mmdOptions);
    }
    return md;
};
/** String transformtion pipeline */
// @ts-ignore
var markdownToHtmlPipeline = function (content, options) {
    if (options === void 0) { options = {}; }
    var md = mdInit(options);
    // inject rules override
    md = (0, rules_1.injectRenderRules)(md);
    if (mathpix_markdown_model_1.MathpixMarkdownModel.disableRules && mathpix_markdown_model_1.MathpixMarkdownModel.disableRules.length > 0) {
        md.disable(mathpix_markdown_model_1.MathpixMarkdownModel.disableRules);
    }
    if (options.renderElement && options.renderElement.inLine) {
        return md.renderInline(content);
    }
    else {
        return md.render(content);
    }
};
exports.markdownToHtmlPipeline = markdownToHtmlPipeline;
/**
 * convert a markdown text to html
 */
function markdownToHTML(markdown, options) {
    if (options === void 0) { options = {}; }
    try {
        return (0, exports.markdownToHtmlPipeline)(markdown, options);
    }
    catch (e) {
        console.log("ERROR=>[markdownToHTML]=>");
        console.error(e);
        return '';
    }
}
exports.markdownToHTML = markdownToHTML;
//# sourceMappingURL=index.js.map