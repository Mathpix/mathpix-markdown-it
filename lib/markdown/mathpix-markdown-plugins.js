"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMathpixMarkdown = exports.setBaseOptionsMd = exports.mathpixMarkdownPlugin = void 0;
var mathpix_markdown_model_1 = require("../mathpix-markdown-model");
var mdPluginText_1 = require("./mdPluginText");
var mdPluginConfigured_1 = require("./mdPluginConfigured");
var mdOptions_1 = require("./mdOptions");
exports.mathpixMarkdownPlugin = function (md, options) {
    var _a = options.width, width = _a === void 0 ? 1200 : _a, _b = options.outMath, outMath = _b === void 0 ? {} : _b, _c = options.smiles, smiles = _c === void 0 ? {} : _c, _d = options.mathJax, mathJax = _d === void 0 ? {} : _d, _e = options.renderElement, renderElement = _e === void 0 ? {} : _e, _f = options.forDocx, forDocx = _f === void 0 ? false : _f, _g = options.forLatex, forLatex = _g === void 0 ? false : _g, _h = options.maxWidth, maxWidth = _h === void 0 ? '' : _h, _j = options.enableFileLinks, enableFileLinks = _j === void 0 ? false : _j, _k = options.toc, toc = _k === void 0 ? {} : _k, _l = options.accessibility, accessibility = _l === void 0 ? null : _l;
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
        accessibility: accessibility
    });
    md
        .use(mdPluginConfigured_1.mdPluginChemistry, smiles)
        .use(mdPluginConfigured_1.mdPluginTableTabular)
        .use(mdPluginConfigured_1.mdPluginList)
        .use(mdPluginConfigured_1.mdPluginMathJax({}))
        .use(mdPluginConfigured_1.mdPluginText())
        .use(mdPluginConfigured_1.mdPluginHighlightCode, { auto: false })
        .use(mdPluginConfigured_1.mdPluginAnchor)
        .use(mdPluginConfigured_1.mdPluginTOC, { toc: toc });
    if (forDocx) {
        md.use(mdPluginConfigured_1.mdPluginSvgToBase64);
    }
    if (enableFileLinks) {
        md.validateLink = mdOptions_1.validateLinkEnableFile;
    }
};
exports.setBaseOptionsMd = function (baseOption, mmdOptions) {
    var _a = mmdOptions.htmlTags, htmlTags = _a === void 0 ? false : _a, _b = mmdOptions.xhtmlOut, xhtmlOut = _b === void 0 ? false : _b, _c = mmdOptions.breaks, breaks = _c === void 0 ? true : _c, _d = mmdOptions.typographer, typographer = _d === void 0 ? true : _d, _e = mmdOptions.linkify, linkify = _e === void 0 ? true : _e, _f = mmdOptions.openLinkInNewWindow, openLinkInNewWindow = _f === void 0 ? true : _f;
    baseOption.html = htmlTags;
    baseOption.xhtmlOut = xhtmlOut;
    baseOption.breaks = breaks;
    baseOption.langPrefix = "language-";
    baseOption.linkify = linkify;
    baseOption.typographer = typographer;
    baseOption.quotes = "“”‘’";
    baseOption.openLinkInNewWindow = openLinkInNewWindow;
};
var setOptionForPreview = function (mdOption, mmdOptions) {
    var _a = mmdOptions.width, width = _a === void 0 ? 1200 : _a, _b = mmdOptions.outMath, outMath = _b === void 0 ? {} : _b, _c = mmdOptions.smiles, smiles = _c === void 0 ? {} : _c, _d = mmdOptions.mathJax, mathJax = _d === void 0 ? {} : _d, _e = mmdOptions.renderElement, renderElement = _e === void 0 ? {} : _e;
    Object.assign(mdOption, smiles);
    Object.assign(mdOption, {
        width: width,
        outMath: outMath,
        mathJax: mathJax,
        renderElement: renderElement
    });
    exports.setBaseOptionsMd(mdOption, mmdOptions);
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
        mdPluginText_1.resetTextCounter();
        var html = render.call(renderer, tokens, options, env);
        var style = mathpix_markdown_model_1.MathpixMarkdownModel.getMathpixMarkdownStyles(false);
        var resHtml = "<style id=\"mmd-vscode-style\">" + style + "</style>";
        resHtml += '\n';
        resHtml += "<div id=\"preview-content\">" + html + "</div>";
        return resHtml;
    };
    return md;
};
//# sourceMappingURL=mathpix-markdown-plugins.js.map