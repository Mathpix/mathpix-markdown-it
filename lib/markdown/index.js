"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToHTML = exports.markdownToHtmlPipeline = void 0;
var mdPluginConfigured_1 = require("./mdPluginConfigured");
var mathpix_markdown_plugins_1 = require("./mathpix-markdown-plugins");
var rules_1 = require("./rules");
var mathpix_markdown_model_1 = require("../mathpix-markdown-model");
/** md renderer */
var mdInit = function (options) {
    var _a = options.htmlTags, htmlTags = _a === void 0 ? false : _a, _b = options.xhtmlOut, xhtmlOut = _b === void 0 ? false : _b, _c = options.width, width = _c === void 0 ? 1200 : _c, _d = options.breaks, breaks = _d === void 0 ? true : _d, _e = options.typographer, typographer = _e === void 0 ? true : _e, _f = options.linkify, linkify = _f === void 0 ? true : _f, _g = options.outMath, outMath = _g === void 0 ? {} : _g, _h = options.mathJax, mathJax = _h === void 0 ? {} : _h, _j = options.renderElement, renderElement = _j === void 0 ? {} : _j, _k = options.lineNumbering, lineNumbering = _k === void 0 ? false : _k, _l = options.startLine, startLine = _l === void 0 ? 0 : _l, _m = options.htmlSanitize, htmlSanitize = _m === void 0 ? true : _m, _o = options.smiles, smiles = _o === void 0 ? {} : _o, _p = options.forDocx, forDocx = _p === void 0 ? false : _p, _q = options.openLinkInNewWindow, openLinkInNewWindow = _q === void 0 ? true : _q, _r = options.isDisableEmoji, isDisableEmoji = _r === void 0 ? false : _r, _s = options.isDisableEmojiShortcuts, isDisableEmojiShortcuts = _s === void 0 ? false : _s, _t = options.maxWidth, maxWidth = _t === void 0 ? '' : _t, _u = options.enableFileLinks, enableFileLinks = _u === void 0 ? false : _u, _v = options.toc, toc = _v === void 0 ? {} : _v, _w = options.accessibility, accessibility = _w === void 0 ? null : _w;
    var mmdOptions = {
        width: width,
        outMath: outMath,
        mathJax: mathJax,
        renderElement: renderElement,
        smiles: smiles,
        forDocx: forDocx,
        maxWidth: maxWidth,
        enableFileLinks: enableFileLinks,
        toc: toc,
        accessibility: accessibility
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
    return md;
};
/** String transformtion pipeline */
// @ts-ignore
exports.markdownToHtmlPipeline = function (content, options) {
    if (options === void 0) { options = {}; }
    var md = mdInit(options);
    // inject rules override
    md = rules_1.injectRenderRules(md);
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
/**
 * convert a markdown text to html
 */
function markdownToHTML(markdown, options) {
    if (options === void 0) { options = {}; }
    return exports.markdownToHtmlPipeline(markdown, options);
}
exports.markdownToHTML = markdownToHTML;
//# sourceMappingURL=index.js.map