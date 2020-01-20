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
        var _a = this.props, text = _a.text, _b = _a.alignMathBlock, alignMathBlock = _b === void 0 ? 'center' : _b, _c = _a.display, display = _c === void 0 ? 'block' : _c, _d = _a.isCheckFormula, isCheckFormula = _d === void 0 ? false : _d, _e = _a.showTimeLog, showTimeLog = _e === void 0 ? false : _e, _f = _a.isDisableFancy, isDisableFancy = _f === void 0 ? false : _f, _g = _a.htmlTags, htmlTags = _g === void 0 ? false : _g, _h = _a.width, width = _h === void 0 ? 0 : _h, _j = _a.breaks, breaks = _j === void 0 ? true : _j, _k = _a.typographer, typographer = _k === void 0 ? false : _k, _l = _a.linkify, linkify = _l === void 0 ? false : _l, _m = _a.xhtmlOut, xhtmlOut = _m === void 0 ? false : _m, _o = _a.outMath, outMath = _o === void 0 ? {} : _o;
        var disableRules = isDisableFancy ? mathpix_markdown_model_1.MathpixMarkdownModel.disableFancyArrayDef : this.props.disableRules;
        mathpix_markdown_model_1.MathpixMarkdownModel.setOptions(disableRules, isCheckFormula, showTimeLog);
        return (React.createElement("div", { id: 'preview', style: { justifyContent: alignMathBlock, padding: '10px', overflowY: 'auto', willChange: 'transform' } },
            React.createElement("div", { id: 'container-ruller' }),
            React.createElement("div", { id: 'setText', style: { display: display, justifyContent: 'inherit' }, dangerouslySetInnerHTML: { __html: mathpix_markdown_model_1.MathpixMarkdownModel.convertToHTML(text, { htmlTags: htmlTags, xhtmlOut: xhtmlOut, breaks: breaks, typographer: typographer, linkify: linkify, width: width, outMath: outMath }) } })));
    };
    return MathpixMarkdown;
}(React.Component));
exports.default = MathpixMarkdown;
//# sourceMappingURL=index.js.map