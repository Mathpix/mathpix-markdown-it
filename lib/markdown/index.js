"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mdPluginConfigured_1 = require("./mdPluginConfigured");
var rules_1 = require("./rules");
var mathpix_markdown_model_1 = require("../mathpix-markdown-model");
/** md renderer */
var mdInit = function (options) {
    var _a = options.htmlTags, htmlTags = _a === void 0 ? false : _a, _b = options.width, width = _b === void 0 ? 1200 : _b, _c = options.breaks, breaks = _c === void 0 ? true : _c, _d = options.typographer, typographer = _d === void 0 ? true : _d, _e = options.linkify, linkify = _e === void 0 ? true : _e;
    return require("markdown-it")({
        html: htmlTags,
        xhtmlOut: false,
        breaks: breaks,
        langPrefix: "language-",
        linkify: linkify,
        typographer: typographer,
        quotes: "“”‘’"
    })
        .use(mdPluginConfigured_1.tableTabularPlugin, { width: width })
        .use(mdPluginConfigured_1.separateForBlockPlugin)
        .use(mdPluginConfigured_1.ConfiguredMathJaxPlugin({ width: width }))
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
    return exports.markdownToHtmlPipeline(markdown, options);
}
exports.markdownToHTML = markdownToHTML;
//# sourceMappingURL=index.js.map