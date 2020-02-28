"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mdPluginConfigured_1 = require("./mdPluginConfigured");
var rules_1 = require("./rules");
var mathpix_markdown_model_1 = require("../mathpix-markdown-model");
/** md renderer */
var mdInit = function (options) {
    var _a = options.htmlTags, htmlTags = _a === void 0 ? false : _a, _b = options.xhtmlOut, xhtmlOut = _b === void 0 ? false : _b, _c = options.width, width = _c === void 0 ? 1200 : _c, _d = options.breaks, breaks = _d === void 0 ? true : _d, _e = options.typographer, typographer = _e === void 0 ? true : _e, _f = options.linkify, linkify = _f === void 0 ? true : _f, _g = options.outMath, outMath = _g === void 0 ? {} : _g, _h = options.mathJax, mathJax = _h === void 0 ? {} : _h;
    return require("markdown-it")({
        html: htmlTags,
        xhtmlOut: xhtmlOut,
        breaks: breaks,
        langPrefix: "language-",
        linkify: linkify,
        typographer: typographer,
        quotes: "“”‘’"
    })
        .use(mdPluginConfigured_1.tableTabularPlugin, { width: width, outMath: outMath })
        //   .use(separateForBlockPlugin)
        .use(mdPluginConfigured_1.ConfiguredMathJaxPlugin({ width: width, outMath: outMath, mathJax: mathJax }))
        .use(mdPluginConfigured_1.CustomTagPlugin())
        .use(mdPluginConfigured_1.HighlightPlugin, { auto: false })
        .use(mdPluginConfigured_1.anchorPlugin)
        .use(mdPluginConfigured_1.tocPlugin)
        .use(require('markdown-it-multimd-table'), { enableRowspan: true, enableMultilineRows: true })
        .use(require("markdown-it-footnote"))
        .use(require("markdown-it-sub"))
        .use(require("markdown-it-sup"))
        .use(require("markdown-it-deflist"))
        .use(require("markdown-it-mark"))
        .use(require("markdown-it-emoji"))
        .use(require("markdown-it-ins"));
};
/** String transformtion pipeline */
// @ts-ignore
exports.markdownToHtmlPipeline = function (content, options) {
    if (options === void 0) { options = {}; }
    var _a = options.lineNumbering, lineNumbering = _a === void 0 ? false : _a;
    var md = mdInit(options);
    // inject rules override
    if (lineNumbering) {
        md = rules_1.withLineNumbers(md);
    }
    if (mathpix_markdown_model_1.MathpixMarkdownModel.disableRules && mathpix_markdown_model_1.MathpixMarkdownModel.disableRules.length > 0) {
        md.disable(mathpix_markdown_model_1.MathpixMarkdownModel.disableRules);
    }
    return md.render(content);
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