"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToHTMLAsync = exports.markdownToHtmlPipelineAsync = exports.markdownToHTML = exports.markdownToHTMLSegmentsAsync = exports.markdownToHTMLSegments = exports.markdownToHtmlPipeline = exports.markdownToHtmlPipelineSegmentsAsync = exports.markdownToHtmlPipelineSegments = void 0;
var tslib_1 = require("tslib");
var mdPluginConfigured_1 = require("./mdPluginConfigured");
var mathpix_markdown_plugins_1 = require("./mathpix-markdown-plugins");
var rules_1 = require("./rules");
var mathpix_markdown_model_1 = require("../mathpix-markdown-model");
var mmdRulesToDisable_1 = require("./common/mmdRulesToDisable");
var mmdRules_1 = require("./common/mmdRules");
var async_patch_1 = require("./async-patch");
/** md renderer */
var mdInit = function (options, asyncParsing) {
    if (asyncParsing === void 0) { asyncParsing = false; }
    var _a = options.htmlTags, htmlTags = _a === void 0 ? false : _a, _b = options.htmlDisableTagMatching, htmlDisableTagMatching = _b === void 0 ? false : _b, _c = options.xhtmlOut, xhtmlOut = _c === void 0 ? false : _c, _d = options.width, width = _d === void 0 ? 1200 : _d, _e = options.breaks, breaks = _e === void 0 ? true : _e, _f = options.typographer, typographer = _f === void 0 ? true : _f, _g = options.linkify, linkify = _g === void 0 ? true : _g, _h = options.outMath, outMath = _h === void 0 ? {} : _h, _j = options.mathJax, mathJax = _j === void 0 ? {} : _j, _k = options.renderElement, renderElement = _k === void 0 ? {} : _k, _l = options.lineNumbering, lineNumbering = _l === void 0 ? false : _l, _m = options.startLine, startLine = _m === void 0 ? 0 : _m, _o = options.htmlSanitize, htmlSanitize = _o === void 0 ? true : _o, _p = options.smiles, smiles = _p === void 0 ? {} : _p, _q = options.forDocx, forDocx = _q === void 0 ? false : _q, _r = options.forPptx, forPptx = _r === void 0 ? false : _r, _s = options.openLinkInNewWindow, openLinkInNewWindow = _s === void 0 ? true : _s, _t = options.isDisableEmoji, isDisableEmoji = _t === void 0 ? false : _t, _u = options.isDisableEmojiShortcuts, isDisableEmojiShortcuts = _u === void 0 ? false : _u, _v = options.maxWidth, maxWidth = _v === void 0 ? '' : _v, _w = options.enableFileLinks, enableFileLinks = _w === void 0 ? false : _w, _x = options.validateLink, validateLink = _x === void 0 ? null : _x, _y = options.toc, toc = _y === void 0 ? {} : _y, _z = options.accessibility, accessibility = _z === void 0 ? null : _z, _0 = options.nonumbers, nonumbers = _0 === void 0 ? false : _0, _1 = options.showPageBreaks, showPageBreaks = _1 === void 0 ? false : _1, _2 = options.centerImages, centerImages = _2 === void 0 ? true : _2, _3 = options.centerTables, centerTables = _3 === void 0 ? true : _3, _4 = options.enableCodeBlockRuleForLatexCommands, enableCodeBlockRuleForLatexCommands = _4 === void 0 ? false : _4, _5 = options.addPositionsToTokens, addPositionsToTokens = _5 === void 0 ? false : _5, _6 = options.highlights, highlights = _6 === void 0 ? [] : _6, _7 = options.parserErrors, parserErrors = _7 === void 0 ? mathpix_markdown_model_1.ParserErrors.show : _7, _8 = options.codeHighlight, codeHighlight = _8 === void 0 ? {} : _8, _9 = options.footnotes, footnotes = _9 === void 0 ? {} : _9, _10 = options.copyToClipboard, copyToClipboard = _10 === void 0 ? false : _10, _11 = options.renderOptions, renderOptions = _11 === void 0 ? null : _11, _12 = options.previewUuid, previewUuid = _12 === void 0 ? "" : _12, _13 = options.enableSizeCalculation, enableSizeCalculation = _13 === void 0 ? false : _13;
    if (asyncParsing) {
        (0, async_patch_1.applyAsyncPatch)();
    }
    var mmdOptions = {
        width: width,
        outMath: outMath,
        mathJax: mathJax,
        renderElement: renderElement,
        smiles: smiles,
        forDocx: forDocx,
        forPptx: forPptx,
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
        enableSizeCalculation: enableSizeCalculation,
        asyncParsing: asyncParsing
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
/**
 * Attach segmented HTML renderer to a markdown-it instance.
 *
 * It overrides `md.renderer.render` so that rendering returns:
 *   { content: string, map: [number, number][] }
 * instead of a plain HTML string — same behavior for both sync and async flows.
 */
function attachSegmentedRenderer(md) {
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
    return md;
}
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
    attachSegmentedRenderer(md);
    // renderer.render returns { content, map } because we overrode it
    return md.render(content);
};
exports.markdownToHtmlPipelineSegments = markdownToHtmlPipelineSegments;
/**
 * Asynchronously converts Markdown content into segmented HTML with position mapping.
 *
 * This async version mirrors `markdownToHtmlPipelineSegments`, but uses the async
 * markdown-it pipeline (core/block/inline `parseAsync`) to avoid long event-loop
 * blocking on large documents. It installs the same segmented HTML renderer and
 * returns both the concatenated HTML string and a mapping array describing the
 * start/end indices of each segment.
 *
 * Segmentation logic is identical to the synchronous version: HTML is grouped
 * into logical chunks based on markdown token structure, including special
 * handling for block math inside lists.
 *
 * @param {string} content - The Markdown input to convert.
 * @param {TMarkdownItOptions} [options={}] - Parser configuration options.
 * @param {{ sliceMs?: number }} [parseOpts] - Time-slicing options used by the async parser.
 * @returns {Promise<{ content: string; map: [number, number][] }>} Resolves with:
 *   - content: the combined HTML output string,
 *   - map: an array of [start, end] offsets for each HTML segment.
 */
var markdownToHtmlPipelineSegmentsAsync = function (content, options, parseOpts // чтобы можно было пробрасывать sliceMs
) {
    if (options === void 0) { options = {}; }
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var md, disableRules, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    md = mdInit(options, true);
                    // inject rules override
                    md = (0, rules_1.injectRenderRules)(md);
                    if (mathpix_markdown_model_1.MathpixMarkdownModel.disableRules && mathpix_markdown_model_1.MathpixMarkdownModel.disableRules.length > 0) {
                        disableRules = (0, mmdRulesToDisable_1.applyRulesToDisableRules)(md, mathpix_markdown_model_1.MathpixMarkdownModel.disableRules, []);
                        md.disable(disableRules, true);
                    }
                    attachSegmentedRenderer(md);
                    return [4 /*yield*/, md.renderAsync(content, {}, parseOpts)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
exports.markdownToHtmlPipelineSegmentsAsync = markdownToHtmlPipelineSegmentsAsync;
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
var markdownToHTMLSegmentsAsync = function (markdown, options) {
    if (options === void 0) { options = {}; }
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, exports.markdownToHtmlPipelineSegmentsAsync)(markdown, options)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    e_1 = _a.sent();
                    console.log("ERROR=>[markdownToHTMLSegments]=>");
                    console.error(e_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.markdownToHTMLSegmentsAsync = markdownToHTMLSegmentsAsync;
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
var markdownToHtmlPipelineAsync = function (content, options) {
    if (options === void 0) { options = {}; }
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var md, disableRules;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    md = mdInit(options, true);
                    // inject rules override
                    md = (0, rules_1.injectRenderRules)(md);
                    if (mathpix_markdown_model_1.MathpixMarkdownModel.disableRules && mathpix_markdown_model_1.MathpixMarkdownModel.disableRules.length > 0) {
                        disableRules = (0, mmdRulesToDisable_1.applyRulesToDisableRules)(md, mathpix_markdown_model_1.MathpixMarkdownModel.disableRules, []);
                        md.disable(disableRules, true);
                    }
                    return [4 /*yield*/, md.renderAsync(content, {}, {})];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.markdownToHtmlPipelineAsync = markdownToHtmlPipelineAsync;
var markdownToHTMLAsync = function (markdown, options) {
    if (options === void 0) { options = {}; }
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var e_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, exports.markdownToHtmlPipelineAsync)(markdown, options)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    e_2 = _a.sent();
                    console.log("ERROR=>[markdownToHTML]=>");
                    console.error(e_2);
                    return [2 /*return*/, ''];
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.markdownToHTMLAsync = markdownToHTMLAsync;
//# sourceMappingURL=index.js.map