"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToHTML = exports.markdownToHtmlPipeline = void 0;
var mdPluginConfigured_1 = require("./mdPluginConfigured");
var mathpix_markdown_plugins_1 = require("./mathpix-markdown-plugins");
var rules_1 = require("./rules");
var mathpix_markdown_model_1 = require("../mathpix-markdown-model");
var mmdRulesToDisable_1 = require("./common/mmdRulesToDisable");
var mmdRules_1 = require("./common/mmdRules");
/** md renderer */
var mdInit = function (options) {
    var _a = options.htmlTags, htmlTags = _a === void 0 ? false : _a, _b = options.htmlDisableTagMatching, htmlDisableTagMatching = _b === void 0 ? false : _b, _c = options.xhtmlOut, xhtmlOut = _c === void 0 ? false : _c, _d = options.width, width = _d === void 0 ? 1200 : _d, _e = options.breaks, breaks = _e === void 0 ? true : _e, _f = options.typographer, typographer = _f === void 0 ? true : _f, _g = options.linkify, linkify = _g === void 0 ? true : _g, _h = options.outMath, outMath = _h === void 0 ? {} : _h, _j = options.mathJax, mathJax = _j === void 0 ? {} : _j, _k = options.renderElement, renderElement = _k === void 0 ? {} : _k, _l = options.lineNumbering, lineNumbering = _l === void 0 ? false : _l, _m = options.startLine, startLine = _m === void 0 ? 0 : _m, _o = options.htmlSanitize, htmlSanitize = _o === void 0 ? true : _o, _p = options.smiles, smiles = _p === void 0 ? {} : _p, _q = options.forDocx, forDocx = _q === void 0 ? false : _q, _r = options.openLinkInNewWindow, openLinkInNewWindow = _r === void 0 ? true : _r, _s = options.isDisableEmoji, isDisableEmoji = _s === void 0 ? false : _s, _t = options.isDisableEmojiShortcuts, isDisableEmojiShortcuts = _t === void 0 ? false : _t, _u = options.maxWidth, maxWidth = _u === void 0 ? '' : _u, _v = options.enableFileLinks, enableFileLinks = _v === void 0 ? false : _v, _w = options.validateLink, validateLink = _w === void 0 ? null : _w, _x = options.toc, toc = _x === void 0 ? {} : _x, _y = options.accessibility, accessibility = _y === void 0 ? null : _y, _z = options.nonumbers, nonumbers = _z === void 0 ? false : _z, _0 = options.showPageBreaks, showPageBreaks = _0 === void 0 ? false : _0, _1 = options.centerImages, centerImages = _1 === void 0 ? true : _1, _2 = options.centerTables, centerTables = _2 === void 0 ? true : _2, _3 = options.enableCodeBlockRuleForLatexCommands, enableCodeBlockRuleForLatexCommands = _3 === void 0 ? false : _3, _4 = options.addPositionsToTokens, addPositionsToTokens = _4 === void 0 ? false : _4, _5 = options.highlights, highlights = _5 === void 0 ? [] : _5, _6 = options.parserErrors, parserErrors = _6 === void 0 ? mathpix_markdown_model_1.ParserErrors.show : _6, _7 = options.codeHighlight, codeHighlight = _7 === void 0 ? {} : _7, _8 = options.footnotes, footnotes = _8 === void 0 ? {} : _8, _9 = options.copyToClipboard, copyToClipboard = _9 === void 0 ? false : _9, _10 = options.renderOptions, renderOptions = _10 === void 0 ? null : _10, _11 = options.previewUuid, previewUuid = _11 === void 0 ? "" : _11, _12 = options.enableSizeCalculation, enableSizeCalculation = _12 === void 0 ? false : _12;
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
        codeHighlight: codeHighlight,
        footnotes: footnotes,
        copyToClipboard: copyToClipboard,
        renderOptions: renderOptions,
        previewUuid: previewUuid,
        enableSizeCalculation: enableSizeCalculation
    };
    var disableRuleTypes = renderOptions ? (0, mmdRulesToDisable_1.getDisableRuleTypes)(renderOptions) : [];
    var md = require("markdown-it")({
        html: htmlTags && !disableRuleTypes.includes(mmdRules_1.eMmdRuleType.html),
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
    if (addPositionsToTokens || (highlights === null || highlights === void 0 ? void 0 : highlights.length)) {
        /** SetPositions plugin should be last */
        md.use(mdPluginConfigured_1.mdSetPositionsAndHighlight, mmdOptions);
    }
    var disableRules = (0, mmdRulesToDisable_1.getListToDisableByOptions)(md, options);
    if (disableRules === null || disableRules === void 0 ? void 0 : disableRules.length) {
        md.disable(disableRules, true);
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
        var disableRules = (0, mmdRulesToDisable_1.applyRulesToDisableRules)(md, mathpix_markdown_model_1.MathpixMarkdownModel.disableRules, []);
        md.disable(disableRules, true);
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