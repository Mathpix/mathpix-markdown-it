"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToHTML = exports.markdownToHtmlPipeline = exports.initMathpixMarkdown = void 0;
var mdPluginConfigured_1 = require("./mdPluginConfigured");
var mathpix_markdown_plugins_1 = require("./mathpix-markdown-plugins");
var rules_1 = require("./rules");
var mathpix_markdown_model_1 = require("../mathpix-markdown-model");
/** md renderer */
var mdInit = function (options) {
    var _a = options.htmlTags, htmlTags = _a === void 0 ? false : _a, _b = options.xhtmlOut, xhtmlOut = _b === void 0 ? false : _b, _c = options.width, width = _c === void 0 ? 1200 : _c, _d = options.breaks, breaks = _d === void 0 ? true : _d, _e = options.typographer, typographer = _e === void 0 ? true : _e, _f = options.linkify, linkify = _f === void 0 ? true : _f, _g = options.outMath, outMath = _g === void 0 ? {} : _g, _h = options.mathJax, mathJax = _h === void 0 ? {} : _h, _j = options.renderElement, renderElement = _j === void 0 ? {} : _j, _k = options.lineNumbering, lineNumbering = _k === void 0 ? false : _k, _l = options.htmlSanitize, htmlSanitize = _l === void 0 ? true : _l, _m = options.smiles, smiles = _m === void 0 ? {} : _m;
    var mmdOptions = {
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
        .use(mathpix_markdown_plugins_1.default, mmdOptions)
        .use(require('markdown-it-multimd-table'), { enableRowspan: true, enableMultilineRows: true })
        .use(require("markdown-it-footnote"))
        .use(require("markdown-it-sub"))
        .use(require("markdown-it-sup"))
        .use(require("markdown-it-deflist"))
        .use(require("markdown-it-mark"))
        .use(require("markdown-it-emoji"))
        .use(mdPluginConfigured_1.mdPluginCollapsible)
        .use(require("markdown-it-ins"));
};
var setOptionForPreview = function (mdOption, mmdOptions) {
    var _a = mmdOptions.width, width = _a === void 0 ? 1200 : _a, _b = mmdOptions.outMath, outMath = _b === void 0 ? {} : _b, _c = mmdOptions.smiles, smiles = _c === void 0 ? {} : _c, _d = mmdOptions.mathJax, mathJax = _d === void 0 ? {} : _d, _e = mmdOptions.renderElement, renderElement = _e === void 0 ? {} : _e, _f = mmdOptions.useInlineStyle, useInlineStyle = _f === void 0 ? true : _f, _g = mmdOptions.htmlTags, htmlTags = _g === void 0 ? false : _g;
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
exports.initMathpixMarkdown = function (md, callback) {
    var parse = md.parse, renderer = md.renderer;
    var render = renderer.render;
    md.parse = function (markdown, env) {
        var mmdOptions = callback();
        setOptionForPreview(md.options, mmdOptions);
        return parse.call(md, markdown, env);
    };
    renderer.render = function (tokens, options, env) {
        mathpix_markdown_model_1.MathpixMarkdownModel.texReset();
        var html = render.call(renderer, tokens, options, env);
        var style = mathpix_markdown_model_1.MathpixMarkdownModel.getMathpixMarkdownStyles(false);
        return "<style id=\"mmd-vscode-style\">" + style + "</style><div id=\"preview-content\">" + html + "</div>";
    };
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