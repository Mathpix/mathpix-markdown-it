"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaxWidthStyle = void 0;
var getMaxWidthStyle = function (maxWidth, isHideScroll) {
    if (maxWidth === void 0) { maxWidth = ''; }
    if (isHideScroll === void 0) { isHideScroll = false; }
    if (!maxWidth) {
        return '';
    }
    var hideScroll = function () {
        var selectors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            selectors[_i] = arguments[_i];
        }
        return isHideScroll
            ? selectors.map(function (s) { return "".concat(s, "::-webkit-scrollbar"); }).join(',\n') + ' { display: none; }'
            : '';
    };
    return "\n#setText {\n  max-width: ".concat(maxWidth, ";\n}\n#setText > div {\n  overflow-x: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.math-block,\n#preview-content .math-block, #setText .math-block {\n  min-width: unset;\n  overflow-x: auto;\n  -webkit-overflow-scrolling: touch;\n}\n").concat(hideScroll('#setText > div', '#setText > blockquote', '#setText > h1', '#setText > h2', '#setText > h3', '#setText > h4', '#setText > h5', '#setText > h6'), "\n").concat(hideScroll('.table_tabular', '#preview-content .table_tabular', '#setText .table_tabular'), "\nmjx-container[jax=\"SVG\"] > svg {\n  overflow-x: auto;\n}\n").concat(hideScroll('mjx-container'), "\n").concat(hideScroll('mjx-container[jax="SVG"] > svg'), "\n.smiles-inline, .smiles,\n#preview-content .smiles-inline, #setText .smiles-inline,\n#preview-content .smiles, #setText .smiles {\n  max-width: ").concat(maxWidth, ";\n  overflow-x: auto;\n}\n").concat(hideScroll('.smiles', '.smiles-inline'), "\n");
};
exports.getMaxWidthStyle = getMaxWidthStyle;
//# sourceMappingURL=helpers.js.map