"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var mathpix_markdown_model_1 = require("../../mathpix-markdown-model");
var mmdRules_1 = require("../../markdown/common/mmdRules");
var mmdRulesToDisable_1 = require("../../markdown/common/mmdRulesToDisable");
var MathpixMarkdown = /** @class */ (function (_super) {
    tslib_1.__extends(MathpixMarkdown, _super);
    function MathpixMarkdown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MathpixMarkdown.prototype.render = function () {
        var _a = this.props, text = _a.text, _b = _a.alignMathBlock, alignMathBlock = _b === void 0 ? 'center' : _b, _c = _a.display, display = _c === void 0 ? 'block' : _c, _d = _a.isCheckFormula, isCheckFormula = _d === void 0 ? false : _d, _e = _a.showTimeLog, showTimeLog = _e === void 0 ? false : _e, _f = _a.isDisableFancy, isDisableFancy = _f === void 0 ? false : _f, _g = _a.isDisableEmoji, isDisableEmoji = _g === void 0 ? false : _g, _h = _a.isDisableEmojiShortcuts, isDisableEmojiShortcuts = _h === void 0 ? false : _h, _j = _a.isDisableRefs, isDisableRefs = _j === void 0 ? false : _j, _k = _a.isDisableFootnotes, isDisableFootnotes = _k === void 0 ? false : _k, _l = _a.htmlTags, htmlTags = _l === void 0 ? false : _l, _m = _a.width, width = _m === void 0 ? 0 : _m, _o = _a.breaks, breaks = _o === void 0 ? true : _o, _p = _a.typographer, typographer = _p === void 0 ? false : _p, _q = _a.linkify, linkify = _q === void 0 ? false : _q, _r = _a.xhtmlOut, xhtmlOut = _r === void 0 ? false : _r, _s = _a.outMath, outMath = _s === void 0 ? {} : _s, _t = _a.mathJax, mathJax = _t === void 0 ? {} : _t, _u = _a.htmlSanitize, htmlSanitize = _u === void 0 ? {} : _u, _v = _a.smiles, smiles = _v === void 0 ? {} : _v, _w = _a.openLinkInNewWindow, openLinkInNewWindow = _w === void 0 ? true : _w, _x = _a.enableFileLinks, enableFileLinks = _x === void 0 ? false : _x, _y = _a.validateLink, validateLink = _y === void 0 ? null : _y, _z = _a.accessibility, accessibility = _z === void 0 ? null : _z, _0 = _a.nonumbers, nonumbers = _0 === void 0 ? false : _0, _1 = _a.showPageBreaks, showPageBreaks = _1 === void 0 ? false : _1, _2 = _a.centerImages, centerImages = _2 === void 0 ? true : _2, _3 = _a.centerTables, centerTables = _3 === void 0 ? true : _3, _4 = _a.enableCodeBlockRuleForLatexCommands, enableCodeBlockRuleForLatexCommands = _4 === void 0 ? false : _4, _5 = _a.addPositionsToTokens, addPositionsToTokens = _5 === void 0 ? false : _5, _6 = _a.highlights, highlights = _6 === void 0 ? [] : _6, _7 = _a.parserErrors, parserErrors = _7 === void 0 ? mathpix_markdown_model_1.ParserErrors.show : _7, _8 = _a.codeHighlight, codeHighlight = _8 === void 0 ? {} : _8, _9 = _a.footnotes, footnotes = _9 === void 0 ? {} : _9, _10 = _a.copyToClipboard, copyToClipboard = _10 === void 0 ? false : _10, _11 = _a.renderOptions, renderOptions = _11 === void 0 ? null : _11, _12 = _a.previewUuid, previewUuid = _12 === void 0 ? "" : _12;
        var disableRules = isDisableFancy ? mathpix_markdown_model_1.MathpixMarkdownModel.disableFancyArrayDef : this.props.disableRules || [];
        var disableRuleTypes = renderOptions ? (0, mmdRulesToDisable_1.getDisableRuleTypes)(renderOptions) : [];
        var markdownItOptions = {
            isDisableFancy: isDisableFancy,
            isDisableEmoji: isDisableEmoji,
            isDisableEmojiShortcuts: isDisableEmojiShortcuts,
            isDisableRefs: isDisableRefs,
            isDisableFootnotes: isDisableFootnotes,
            disableRules: disableRules,
            htmlTags: htmlTags && !disableRuleTypes.includes(mmdRules_1.eMmdRuleType.html),
            xhtmlOut: xhtmlOut,
            breaks: breaks,
            typographer: typographer,
            linkify: linkify,
            width: width,
            outMath: outMath,
            mathJax: mathJax,
            htmlSanitize: htmlSanitize,
            smiles: smiles,
            openLinkInNewWindow: openLinkInNewWindow,
            enableFileLinks: enableFileLinks,
            validateLink: validateLink,
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
            previewUuid: previewUuid
        };
        mathpix_markdown_model_1.MathpixMarkdownModel.setOptions(disableRules, isCheckFormula, showTimeLog);
        return (React.createElement("div", { id: 'preview', style: { justifyContent: alignMathBlock, padding: '10px', overflowY: 'auto', willChange: 'transform' } },
            React.createElement("div", { id: 'container-ruller' }),
            React.createElement("div", { id: 'setText', style: { display: display, justifyContent: 'inherit' }, dangerouslySetInnerHTML: { __html: mathpix_markdown_model_1.MathpixMarkdownModel.convertToHTML(text, markdownItOptions) } })));
    };
    return MathpixMarkdown;
}(React.Component));
exports.default = MathpixMarkdown;
//# sourceMappingURL=index.js.map