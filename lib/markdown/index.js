"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToHTML = exports.markdownToHTMLSegments = exports.markdownToHtmlPipeline = exports.markdownToHtmlPipelineSegments = void 0;
var mdPluginConfigured_1 = require("./mdPluginConfigured");
var mathpix_markdown_plugins_1 = require("./mathpix-markdown-plugins");
var rules_1 = require("./rules");
var mathpix_markdown_model_1 = require("../mathpix-markdown-model");
var mmdRulesToDisable_1 = require("./common/mmdRulesToDisable");
var mmdRules_1 = require("./common/mmdRules");
/** md renderer */
var mdInit = function (options) {
    var _a = options.htmlTags, htmlTags = _a === void 0 ? false : _a, _b = options.htmlDisableTagMatching, htmlDisableTagMatching = _b === void 0 ? false : _b, _c = options.xhtmlOut, xhtmlOut = _c === void 0 ? false : _c, _d = options.width, width = _d === void 0 ? 1200 : _d, _e = options.breaks, breaks = _e === void 0 ? true : _e, _f = options.typographer, typographer = _f === void 0 ? true : _f, _g = options.linkify, linkify = _g === void 0 ? true : _g, _h = options.maxNesting, maxNesting = _h === void 0 ? 100 : _h, _j = options.outMath, outMath = _j === void 0 ? {} : _j, _k = options.mathJax, mathJax = _k === void 0 ? {} : _k, _l = options.renderElement, renderElement = _l === void 0 ? {} : _l, _m = options.lineNumbering, lineNumbering = _m === void 0 ? false : _m, _o = options.startLine, startLine = _o === void 0 ? 0 : _o, _p = options.htmlSanitize, htmlSanitize = _p === void 0 ? true : _p, _q = options.smiles, smiles = _q === void 0 ? {} : _q, _r = options.forDocx, forDocx = _r === void 0 ? false : _r, _s = options.forPptx, forPptx = _s === void 0 ? false : _s, _t = options.openLinkInNewWindow, openLinkInNewWindow = _t === void 0 ? true : _t, _u = options.isDisableEmoji, isDisableEmoji = _u === void 0 ? false : _u, _v = options.isDisableEmojiShortcuts, isDisableEmojiShortcuts = _v === void 0 ? false : _v, _w = options.maxWidth, maxWidth = _w === void 0 ? '' : _w, _x = options.enableFileLinks, enableFileLinks = _x === void 0 ? false : _x, _y = options.validateLink, validateLink = _y === void 0 ? null : _y, _z = options.toc, toc = _z === void 0 ? {} : _z, _0 = options.accessibility, accessibility = _0 === void 0 ? null : _0, _1 = options.nonumbers, nonumbers = _1 === void 0 ? false : _1, _2 = options.showPageBreaks, showPageBreaks = _2 === void 0 ? false : _2, _3 = options.centerImages, centerImages = _3 === void 0 ? true : _3, _4 = options.centerTables, centerTables = _4 === void 0 ? true : _4, _5 = options.enableCodeBlockRuleForLatexCommands, enableCodeBlockRuleForLatexCommands = _5 === void 0 ? false : _5, _6 = options.addPositionsToTokens, addPositionsToTokens = _6 === void 0 ? false : _6, _7 = options.highlights, highlights = _7 === void 0 ? [] : _7, _8 = options.parserErrors, parserErrors = _8 === void 0 ? mathpix_markdown_model_1.ParserErrors.show : _8, _9 = options.codeHighlight, codeHighlight = _9 === void 0 ? {} : _9, _10 = options.footnotes, footnotes = _10 === void 0 ? {} : _10, _11 = options.copyToClipboard, copyToClipboard = _11 === void 0 ? false : _11, _12 = options.renderOptions, renderOptions = _12 === void 0 ? null : _12, _13 = options.previewUuid, previewUuid = _13 === void 0 ? "" : _13, _14 = options.enableSizeCalculation, enableSizeCalculation = _14 === void 0 ? false : _14;
    var mmdOptions = {
        width: width,
        outMath: outMath,
        mathJax: mathJax,
        renderElement: renderElement,
        smiles: smiles,
        forDocx: forDocx,
        forPptx: forPptx,
        maxWidth: maxWidth,
        maxNesting: maxNesting,
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
        maxNesting: maxNesting,
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
/**
 * Converts Markdown content to segmented HTML with position mapping.
 *
 * This function initializes a markdown-it parser with custom options and injected rendering rules,
 * then overrides the renderer's render method to produce HTML content in segments. Each segment
 * corresponds to a continuous chunk of HTML generated from one or more markdown tokens. It also
 * returns a map of tuples indicating the start and end indices of each HTML segment within the
 * combined output string.
 *
 * The segmentation logic groups tokens until a closing tag of an opened block is found or certain
 * block tokens (like hr, fence, code_block, html_block) appear, splitting the content accordingly.
 * Special handling is included for first block math tokens inside lists.
 *
 * @param {string} content - The Markdown source content to convert.
 * @param {TMarkdownItOptions} [options={}] - Optional configuration options for the markdown-it parser.
 * @returns {{ content: string, map: [number, number][] }} An object containing:
 *   - content: the concatenated HTML string from all segments.
 *   - map: an array of tuples, each tuple [start, end] marks the indices of each HTML segment within the content.
 */
var markdownToHtmlPipelineSegments = function (content, options) {
    if (options === void 0) { options = {}; }
    var md = mdInit(options);
    // inject rules override
    md = (0, rules_1.injectRenderRules)(md);
    if (mathpix_markdown_model_1.MathpixMarkdownModel.disableRules && mathpix_markdown_model_1.MathpixMarkdownModel.disableRules.length > 0) {
        var disableRules = (0, mmdRulesToDisable_1.applyRulesToDisableRules)(md, mathpix_markdown_model_1.MathpixMarkdownModel.disableRules, []);
        md.disable(disableRules, true);
    }
    md.renderer.render = function (tokens, options, env) {
        var content = '';
        var map = [];
        var line = '';
        var pendingCloseTag = '';
        var pendingLevel = 0;
        var isFirstBlockMathInList = function (current, prev, next) {
            var _a, _b;
            if (current.type !== 'paragraph_open' || (prev === null || prev === void 0 ? void 0 : prev.type) !== 'list_item_open')
                return false;
            var firstChildType = (next === null || next === void 0 ? void 0 : next.type) === 'inline' ? (_b = (_a = next.children) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.type : null;
            return ['equation_math', 'equation_math_not_number', 'display_math'].includes(firstChildType);
        };
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var prevToken = tokens[i - 1];
            var nextToken = tokens[i + 1];
            var rendered = '';
            if (token.type === 'inline') {
                rendered = this.renderInline(token.children, options, env);
            }
            else if (typeof this.rules[token.type] !== 'undefined') {
                rendered = this.rules[token.type](tokens, i, options, env, this);
                if (isFirstBlockMathInList(token, prevToken, nextToken)) {
                    rendered = '<span>&nbsp</span>';
                }
            }
            else {
                rendered = this.renderToken(tokens, i, options, env);
            }
            if (pendingCloseTag) {
                if (token.type === pendingCloseTag && pendingLevel === token.level) {
                    line += rendered;
                    var start = content.length;
                    content += line;
                    map.push([start, content.length]);
                    line = '';
                    pendingCloseTag = '';
                    pendingLevel = 0;
                    continue;
                }
                line += rendered;
                continue;
            }
            if (token.type.endsWith('_open')) {
                pendingCloseTag = token.type.replace('open', 'close');
                pendingLevel = token.level;
                line += rendered;
                continue;
            }
            if (['hr', 'html_block', 'fence', 'code_block'].includes(token.type)) {
                if (line) {
                    var start_1 = content.length;
                    content += line;
                    map.push([start_1, content.length]);
                    line = '';
                }
                var start = content.length;
                content += rendered;
                map.push([start, content.length]);
                continue;
            }
            line += rendered;
        }
        if (line) {
            var start = content.length;
            content += line;
            map.push([start, content.length]);
        }
        return { content: content, map: map };
    };
    return md.render(content);
};
exports.markdownToHtmlPipelineSegments = markdownToHtmlPipelineSegments;
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
function markdownToHTMLSegments(markdown, options) {
    if (options === void 0) { options = {}; }
    try {
        return (0, exports.markdownToHtmlPipelineSegments)(markdown, options);
    }
    catch (e) {
        console.log("ERROR=>[markdownToHTMLSegments]=>");
        console.error(e);
        return null;
    }
}
exports.markdownToHTMLSegments = markdownToHTMLSegments;
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