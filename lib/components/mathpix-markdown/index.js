"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var mathpix_markdown_model_1 = require("../../mathpix-markdown-model");
var MathpixMarkdown = /** @class */ (function (_super) {
    tslib_1.__extends(MathpixMarkdown, _super);
    function MathpixMarkdown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MathpixMarkdown.prototype.render = function () {
        var _a = this.props, text = _a.text, _b = _a.alignMathBlock, alignMathBlock = _b === void 0 ? 'center' : _b, _c = _a.display, display = _c === void 0 ? 'block' : _c, _d = _a.isCheckFormula, isCheckFormula = _d === void 0 ? false : _d, _e = _a.showTimeLog, showTimeLog = _e === void 0 ? false : _e, _f = _a.isDisableFancy, isDisableFancy = _f === void 0 ? false : _f, _g = _a.isDisableEmoji, isDisableEmoji = _g === void 0 ? false : _g, _h = _a.isDisableEmojiShortcuts, isDisableEmojiShortcuts = _h === void 0 ? false : _h, _j = _a.htmlTags, htmlTags = _j === void 0 ? false : _j, _k = _a.width, width = _k === void 0 ? 0 : _k, _l = _a.breaks, breaks = _l === void 0 ? true : _l, _m = _a.typographer, typographer = _m === void 0 ? false : _m, _o = _a.linkify, linkify = _o === void 0 ? false : _o, _p = _a.xhtmlOut, xhtmlOut = _p === void 0 ? false : _p, _q = _a.outMath, outMath = _q === void 0 ? {} : _q, _r = _a.mathJax, mathJax = _r === void 0 ? {} : _r, _s = _a.htmlSanitize, htmlSanitize = _s === void 0 ? {} : _s, _t = _a.smiles, smiles = _t === void 0 ? {} : _t, _u = _a.openLinkInNewWindow, openLinkInNewWindow = _u === void 0 ? true : _u, _v = _a.enableFileLinks, enableFileLinks = _v === void 0 ? false : _v, _w = _a.validateLink, validateLink = _w === void 0 ? null : _w, _x = _a.accessibility, accessibility = _x === void 0 ? null : _x, _y = _a.nonumbers, nonumbers = _y === void 0 ? false : _y, _z = _a.showPageBreaks, showPageBreaks = _z === void 0 ? false : _z, _0 = _a.centerImages, centerImages = _0 === void 0 ? true : _0, _1 = _a.centerTables, centerTables = _1 === void 0 ? true : _1, _2 = _a.enableCodeBlockRuleForLatexCommands, enableCodeBlockRuleForLatexCommands = _2 === void 0 ? false : _2, _3 = _a.addPositionsToTokens, addPositionsToTokens = _3 === void 0 ? false : _3, _4 = _a.highlights, highlights = _4 === void 0 ? [] : _4;
        var disableRules = isDisableFancy ? mathpix_markdown_model_1.MathpixMarkdownModel.disableFancyArrayDef : this.props.disableRules || [];
        var markdownItOptions = {
            isDisableFancy: isDisableFancy,
            isDisableEmoji: isDisableEmoji,
            isDisableEmojiShortcuts: isDisableEmojiShortcuts,
            disableRules: disableRules,
            htmlTags: htmlTags,
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
            highlights: highlights
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