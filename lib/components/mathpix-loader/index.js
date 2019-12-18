"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var mathpix_markdown_model_1 = require("../../mathpix-markdown-model");
var MathpixLoader = /** @class */ (function (_super) {
    tslib_1.__extends(MathpixLoader, _super);
    function MathpixLoader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** the state of the component */
        _this.state = {
            isReadyToTypeSet: false
        };
        return _this;
    }
    MathpixLoader.prototype.componentDidMount = function () {
        var _a = this.props, _b = _a.notScrolling, notScrolling = _b === void 0 ? false : _b, _c = _a.textAlignJustify, textAlignJustify = _c === void 0 ? false : _c;
        var isLoad = mathpix_markdown_model_1.MathpixMarkdownModel.loadMathJax(notScrolling, textAlignJustify);
        this.setState({ isReadyToTypeSet: isLoad });
    };
    MathpixLoader.prototype.render = function () {
        if (this.state.isReadyToTypeSet) {
            return React.createElement("div", { id: "content" }, this.props.children);
        }
        return React.createElement("div", null, "Loading");
    };
    return MathpixLoader;
}(React.Component));
exports.default = MathpixLoader;
//# sourceMappingURL=index.js.map