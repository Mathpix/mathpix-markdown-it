"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathJaxConfigure = exports.asciimath = exports.svg = exports.mml = void 0;
var tslib_1 = require("tslib");
var mathjax_js_1 = require("mathjax-full/js/mathjax.js");
var tex_js_1 = require("mathjax-full/js/input/tex.js");
var Tags_js_1 = require("mathjax-full/js/input/tex/Tags.js");
var mathml_js_1 = require("mathjax-full/js/input/mathml.js");
var svg_js_1 = require("mathjax-full/js/output/svg.js");
var asciimath_js_1 = require("mathjax-full/js/input/asciimath.js");
var html_js_1 = require("mathjax-full/js/handlers/html.js");
var browserAdaptor_js_1 = require("mathjax-full/js/adaptors/browserAdaptor.js");
var liteAdaptor_js_1 = require("mathjax-full/js/adaptors/liteAdaptor.js");
require("mathjax-full/js/input/tex/AllPackages.js");
/** Load configuration for additional package array */
require("./helpers/array/ArrayConfiguration");
var assistive_mml_js_1 = require("mathjax-full/js/a11y/assistive-mml.js");
var mathJaxConfig_1 = require("./mathJaxConfig");
require("./my-BaseMappings");
var BaseConfiguration_js_1 = require("mathjax-full/js/input/tex/base/BaseConfiguration.js");
BaseConfiguration_js_1.BaseConfiguration.handler.macro.push('wasysym-mathchar0mo');
//wasysym-macros
BaseConfiguration_js_1.BaseConfiguration.handler.macro.push('wasysym-macros');
/** Strange bug with using \tag. In MathJax 3.0.1 https://github.com/mathjax/MathJax/issues/2643#issuecomment-800576687
 * The tag information was not being reset when the equation was being re-rendered.
 * That left an extra tagging information object on the stack, and that ended up being the initial state for the next equation (instead of a blank one)
 *
 * It was fixed in MathJax 3.1 -
 * We can opt out of this when upgrading to version 3.1 and higher */
var startEquation = Tags_js_1.AbstractTags.prototype.startEquation;
Tags_js_1.AbstractTags.prototype.startEquation = function (math) {
    this['history'] = [];
    this['stack'] = [];
    this.clearTag();
    this.currentTag = new Tags_js_1.TagInfo('', undefined, undefined);
    startEquation.call(this, math);
};
var texConfig = Object.assign({}, mathJaxConfig_1.default.TeX || {});
/** for TSV/CSV, add the array package, which will add an additional name attribute that points to the environment */
var texTSVConfig = Object.assign({}, texConfig, {
    packages: [].concat(texConfig['packages'], ['array'])
});
var mmlConfig = Object.assign({}, mathJaxConfig_1.default.MathML || {});
var svgConfig = Object.assign({}, mathJaxConfig_1.default.SVG || {});
// @ts-ignore
var MTeX = /** @class */ (function (_super) {
    tslib_1.__extends(MTeX, _super);
    function MTeX() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MTeX.prototype.formatError = function (error) {
        throw Error('TeX error: ' + error.message);
    };
    return MTeX;
}(tex_js_1.TeX));
// @ts-ignore
exports.mml = new mathml_js_1.MathML(mmlConfig);
exports.svg = new svg_js_1.SVG(svgConfig);
exports.asciimath = new asciimath_js_1.AsciiMath({});
var MathJaxConfigure = /** @class */ (function () {
    function MathJaxConfigure() {
        var _this = this;
        this.chooseAdaptor = function () {
            try {
                document;
                if (document.getElementsByTagName('div').length > 0) {
                    _this.adaptor = (0, browserAdaptor_js_1.browserAdaptor)();
                    _this.domNode = document;
                }
                else {
                    _this.adaptor = (0, liteAdaptor_js_1.liteAdaptor)();
                    _this.domNode = '<html></html>';
                }
            }
            catch (e) {
                _this.adaptor = (0, liteAdaptor_js_1.liteAdaptor)();
                _this.domNode = '<html></html>';
            }
        };
        this.initTex = function (nonumbers) {
            if (nonumbers === void 0) { nonumbers = false; }
            if (nonumbers) {
                // @ts-ignore
                _this.mTex = new MTeX(Object.assign({}, texConfig, { tags: "none" }));
                _this.tex = new tex_js_1.TeX(Object.assign({}, texConfig, { tags: "none" }));
                _this.texTSV = new tex_js_1.TeX(Object.assign({}, texTSVConfig, { tags: "none" }));
            }
            else {
                // @ts-ignore
                _this.mTex = new MTeX(texConfig);
                _this.tex = new tex_js_1.TeX(texConfig);
                _this.texTSV = new tex_js_1.TeX(texTSVConfig);
            }
        };
        this.setHandler = function (acssistiveMml, nonumbers) {
            if (acssistiveMml === void 0) { acssistiveMml = false; }
            if (nonumbers === void 0) { nonumbers = false; }
            _this.initTex(nonumbers);
            _this.handler = (0, html_js_1.RegisterHTMLHandler)(_this.adaptor);
            if (acssistiveMml) {
                (0, assistive_mml_js_1.AssistiveMmlHandler)(_this.handler);
            }
            _this.docTeX = mathjax_js_1.mathjax.document(_this.domNode, {
                InputJax: _this.tex,
                OutputJax: exports.svg
            });
            _this.docTeXTSV = mathjax_js_1.mathjax.document(_this.domNode, {
                InputJax: _this.texTSV,
                OutputJax: exports.svg
            });
            _this.mDocTeX = mathjax_js_1.mathjax.document(_this.domNode, {
                InputJax: _this.mTex,
                OutputJax: exports.svg
            });
            _this.docMathML = mathjax_js_1.mathjax.document(_this.domNode, {
                InputJax: exports.mml,
                OutputJax: exports.svg
            });
            _this.docAsciiMath = mathjax_js_1.mathjax.document(_this.domNode, {
                InputJax: exports.asciimath,
                OutputJax: exports.svg
            });
        };
        this.changeHandler = function (acssistiveMml, nonumbers) {
            if (acssistiveMml === void 0) { acssistiveMml = false; }
            if (nonumbers === void 0) { nonumbers = false; }
            if (_this.handler) {
                mathjax_js_1.mathjax.handlers.unregister(_this.handler);
            }
            _this.setHandler(acssistiveMml, nonumbers);
        };
        this.initTex();
        this.chooseAdaptor();
        this.setHandler(true);
    }
    return MathJaxConfigure;
}());
exports.MathJaxConfigure = MathJaxConfigure;
//# sourceMappingURL=mathjax.js.map