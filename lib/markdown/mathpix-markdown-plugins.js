"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMathpixMarkdown = exports.setBaseOptionsMd = exports.mathpixMarkdownPlugin = void 0;
var tslib_1 = require("tslib");
var mathpix_markdown_model_1 = require("../mathpix-markdown-model");
var mdPluginText_1 = require("./mdPluginText");
var helper_1 = require("./md-theorem/helper");
var utils_1 = require("./md-latex-footnotes/utils");
var mdPluginConfigured_1 = require("./mdPluginConfigured");
var mdOptions_1 = require("./mdOptions");
var rules_1 = require("./rules");
var mmdRules_1 = require("./common/mmdRules");
var mmdRulesToDisable_1 = require("./common/mmdRulesToDisable");
var mathpixMarkdownPlugin = function (md, options) {
    var _a;
    var _b = options.width, width = _b === void 0 ? 1200 : _b, _c = options.outMath, outMath = _c === void 0 ? {} : _c, _d = options.smiles, smiles = _d === void 0 ? {} : _d, _e = options.mathJax, mathJax = _e === void 0 ? {} : _e, _f = options.renderElement, renderElement = _f === void 0 ? {} : _f, _g = options.forDocx, forDocx = _g === void 0 ? false : _g, _h = options.forLatex, forLatex = _h === void 0 ? false : _h, _j = options.forMD, forMD = _j === void 0 ? false : _j, _k = options.maxWidth, maxWidth = _k === void 0 ? '' : _k, _l = options.enableFileLinks, enableFileLinks = _l === void 0 ? false : _l, _m = options.validateLink, validateLink = _m === void 0 ? null : _m, _o = options.toc, toc = _o === void 0 ? {} : _o, _p = options.accessibility, accessibility = _p === void 0 ? null : _p, _q = options.nonumbers, nonumbers = _q === void 0 ? false : _q, _r = options.showPageBreaks, showPageBreaks = _r === void 0 ? false : _r, _s = options.centerImages, centerImages = _s === void 0 ? true : _s, _t = options.centerTables, centerTables = _t === void 0 ? true : _t, _u = options.enableCodeBlockRuleForLatexCommands, enableCodeBlockRuleForLatexCommands = _u === void 0 ? false : _u, _v = options.addPositionsToTokens, addPositionsToTokens = _v === void 0 ? false : _v, _w = options.highlights, highlights = _w === void 0 ? [] : _w, _x = options.parserErrors, parserErrors = _x === void 0 ? mathpix_markdown_model_1.ParserErrors.show : _x, _y = options.codeHighlight, codeHighlight = _y === void 0 ? {} : _y, _z = options.footnotes, footnotes = _z === void 0 ? {} : _z, _0 = options.copyToClipboard, copyToClipboard = _0 === void 0 ? false : _0, _1 = options.renderOptions, renderOptions = _1 === void 0 ? null : _1;
    Object.assign(md.options, smiles);
    Object.assign(md.options, {
        width: width,
        outMath: outMath,
        mathJax: mathJax,
        renderElement: renderElement,
        forDocx: forDocx,
        forLatex: forLatex,
        forMD: forMD,
        maxWidth: maxWidth,
        enableFileLinks: enableFileLinks,
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
        renderOptions: renderOptions
    });
    md
        .use(mdPluginConfigured_1.mdPluginChemistry, smiles)
        .use(mdPluginConfigured_1.mdPluginTableTabular)
        .use(mdPluginConfigured_1.mdPluginList)
        .use((0, mdPluginConfigured_1.mdPluginMathJax)({}))
        .use((0, mdPluginConfigured_1.mdPluginText)())
        .use(mdPluginConfigured_1.mdLatexFootnotes)
        .use(mdPluginConfigured_1.mdPluginHighlightCode, codeHighlight)
        .use(mdPluginConfigured_1.mdPluginAnchor)
        .use(mdPluginConfigured_1.mdPluginTOC, { toc: toc });
    if (forDocx) {
        md.use(mdPluginConfigured_1.mdPluginSvgToBase64);
    }
    if (enableFileLinks || validateLink) {
        md.validateLink = validateLink
            ? validateLink
            : mdOptions_1.validateLinkEnableFile;
    }
    /**
     * ParserBlock.parse(str, md, env, outTokens)
     *
     * Process input string and push block tokens into `outTokens`
     **/
    if (addPositionsToTokens || ((_a = md.options.highlights) === null || _a === void 0 ? void 0 : _a.length)) {
        md.block.parse = function (src, md, env, outTokens) {
            var state;
            if (!src) {
                return;
            }
            state = new this.State(src, md, env, outTokens);
            if (!env.lines) {
                /** Copy block state lines */
                env.lines = {
                    bMarks: tslib_1.__spreadArray([], tslib_1.__read(state.bMarks), false),
                    eMarks: tslib_1.__spreadArray([], tslib_1.__read(state.eMarks), false),
                    line: tslib_1.__spreadArray([], tslib_1.__read(state.line), false),
                    lineMax: tslib_1.__spreadArray([], tslib_1.__read(state.lineMax), false),
                    sCount: tslib_1.__spreadArray([], tslib_1.__read(state.sCount), false),
                    tShift: tslib_1.__spreadArray([], tslib_1.__read(state.tShift), false),
                };
            }
            this.tokenize(state, state.line, state.lineMax);
        };
        // Generate tokens for input range
        md.inline.tokenize = function (state) {
            var _a;
            var ok, i, rules = this.ruler.getRules(''), len = rules.length, end = state.posMax, maxNesting = state.md.options.maxNesting;
            while (state.pos < end) {
                // Try all possible rules.
                // On success, rule should:
                //
                // - update `state.pos`
                // - update `state.tokens`
                // - return true
                if (state.level < maxNesting) {
                    for (i = 0; i < len; i++) {
                        ok = rules[i](state, false);
                        if (ok) {
                            if (!state.pending && ((_a = state.tokens) === null || _a === void 0 ? void 0 : _a.length)) {
                                var token = state.tokens[state.tokens.length - 1];
                                token.nextPos = state.pos;
                            }
                            break;
                        }
                    }
                }
                if (ok) {
                    if (state.pos >= end) {
                        break;
                    }
                    continue;
                }
                state.pending += state.src[state.pos++];
            }
            if (state.pending) {
                state.pushPending();
            }
        };
        /**
         * ParserInline.parse(str, md, env, outTokens)
         *
         * Process input string and push inline tokens into `outTokens`
         **/
        md.inline.parse = function (str, md, env, outTokens) {
            var i, rules, len;
            var state = new this.State(str, md, env, outTokens);
            state.pushPending = function () {
                var token = new state.Token('text', '', 0);
                token.content = state.pending;
                token.level = state.pendingLevel;
                token.nextPos = state.isPendingBeforeLink ? state.pos - 1 : state.pos;
                state.tokens.push(token);
                state.pending = '';
                return token;
            };
            state.push = function (type, tag, nesting) {
                if (state.pending) {
                    if (type === 'link_open' || type === 'sup_open' || type === 'sub_open') {
                        state.isPendingBeforeLink = true;
                        this.pushPending();
                        state.isPendingBeforeLink = false;
                    }
                    else {
                        this.pushPending();
                    }
                }
                var token = new state.Token(type, tag, nesting);
                if (nesting < 0)
                    state.level--; // closing tag
                token.level = state.level;
                if (nesting > 0)
                    state.level++; // opening tag
                state.pendingLevel = state.level;
                state.tokens.push(token);
                return token;
            };
            this.tokenize(state);
            rules = this.ruler2.getRules('');
            len = rules.length;
            for (i = 0; i < len; i++) {
                rules[i](state);
            }
        };
    }
    (0, rules_1.injectLabelIdToParagraph)(md);
};
exports.mathpixMarkdownPlugin = mathpixMarkdownPlugin;
var setBaseOptionsMd = function (baseOption, mmdOptions) {
    var _a = mmdOptions.htmlTags, htmlTags = _a === void 0 ? false : _a, _b = mmdOptions.xhtmlOut, xhtmlOut = _b === void 0 ? false : _b, _c = mmdOptions.breaks, breaks = _c === void 0 ? true : _c, _d = mmdOptions.typographer, typographer = _d === void 0 ? true : _d, _e = mmdOptions.linkify, linkify = _e === void 0 ? true : _e, _f = mmdOptions.openLinkInNewWindow, openLinkInNewWindow = _f === void 0 ? true : _f;
    var disableRuleTypes = (mmdOptions === null || mmdOptions === void 0 ? void 0 : mmdOptions.renderOptions) ? (0, mmdRulesToDisable_1.getDisableRuleTypes)(mmdOptions.renderOptions) : [];
    baseOption.html = htmlTags && !disableRuleTypes.includes(mmdRules_1.eMmdRuleType.html);
    baseOption.xhtmlOut = xhtmlOut;
    baseOption.breaks = breaks;
    baseOption.langPrefix = "language-";
    baseOption.linkify = linkify;
    baseOption.typographer = typographer;
    baseOption.quotes = "“”‘’";
    baseOption.openLinkInNewWindow = openLinkInNewWindow;
};
exports.setBaseOptionsMd = setBaseOptionsMd;
var setOptionForPreview = function (mdOption, mmdOptions) {
    var _a = mmdOptions.width, width = _a === void 0 ? 1200 : _a, _b = mmdOptions.outMath, outMath = _b === void 0 ? {} : _b, _c = mmdOptions.smiles, smiles = _c === void 0 ? {} : _c, _d = mmdOptions.mathJax, mathJax = _d === void 0 ? {} : _d, _e = mmdOptions.renderElement, renderElement = _e === void 0 ? {} : _e;
    Object.assign(mdOption, smiles);
    Object.assign(mdOption, {
        width: width,
        outMath: outMath,
        mathJax: mathJax,
        renderElement: renderElement
    });
    (0, exports.setBaseOptionsMd)(mdOption, mmdOptions);
};
var initMathpixMarkdown = function (md, callback) {
    var parse = md.parse, renderer = md.renderer;
    var render = renderer.render;
    md.parse = function (markdown, env) {
        (0, helper_1.resetTheoremEnvironments)();
        (0, utils_1.rest_mmd_footnotes_list)();
        var mmdOptions = callback();
        setOptionForPreview(md.options, mmdOptions);
        return parse.call(md, markdown, env);
    };
    renderer.render = function (tokens, options, env) {
        mathpix_markdown_model_1.MathpixMarkdownModel.texReset();
        (0, mdPluginText_1.resetTextCounter)();
        var html = render.call(renderer, tokens, options, env);
        var style = mathpix_markdown_model_1.MathpixMarkdownModel.getMathpixMarkdownStyles(false);
        var resHtml = "<style id=\"mmd-vscode-style\">".concat(style, "</style>");
        resHtml += '\n';
        resHtml += "<div id=\"preview-content\">".concat(html, "</div>");
        return resHtml;
    };
    return md;
};
exports.initMathpixMarkdown = initMathpixMarkdown;
//# sourceMappingURL=mathpix-markdown-plugins.js.map