"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaxWidthStyle = void 0;
exports.getMaxWidthStyle = function (maxWidth, isHideScroll) {
    if (maxWidth === void 0) { maxWidth = ''; }
    if (isHideScroll === void 0) { isHideScroll = false; }
    if (!maxWidth) {
        return '';
    }
    return "\n    #setText {\n      " + ('max-width:' + maxWidth + ';') + "\n    }\n    #setText > div {\n      overflow-x: auto; \n      -webkit-overflow-scrolling: touch;\n    }\n    \n    .math-block {\n      min-width: unset;\n      overflow-x: auto; \n      -webkit-overflow-scrolling: touch;\n    }\n    \n    " + (isHideScroll ? '#setText > div::-webkit-scrollbar {  display: none; }' : '') + "\n    \n    " + (isHideScroll ? '#setText > blockquote::-webkit-scrollbar {  display: none; }' : '') + "\n    " + (isHideScroll ? '#setText > h1::-webkit-scrollbar {  display: none; }' : '') + "\n    " + (isHideScroll ? '#setText > h2::-webkit-scrollbar {  display: none; }' : '') + "\n    " + (isHideScroll ? '#setText > h3::-webkit-scrollbar {  display: none; }' : '') + "\n    " + (isHideScroll ? '#setText > h4::-webkit-scrollbar {  display: none; }' : '') + "\n    " + (isHideScroll ? '#setText > h5::-webkit-scrollbar {  display: none; }' : '') + "\n    " + (isHideScroll ? '#setText > h6::-webkit-scrollbar {  display: none; }' : '') + "\n    \n    " + (isHideScroll ? '.table_tabular::-webkit-scrollbar {  display: none; }' : '') + "\n        \n    " + (isHideScroll ? 'mjx-container::-webkit-scrollbar {  display: none; }' : '') + "\n    \n    mjx-container[jax=\"SVG\"] > svg { \n      overflow-x: auto; \n    }\n    \n    " + (isHideScroll ? 'mjx-container[jax="SVG"] > svg::-webkit-scrollbar {  display: none; }' : '') + "\n    \n    .smiles-inline, .smiles {\n      " + ('max-width:' + maxWidth + ';') + "\n      overflow-x: auto;\n    }\n    \n    " + (isHideScroll ? '.smiles::-webkit-scrollbar {  display: none; }' : '') + "\n    " + (isHideScroll ? '.smiles-inline::-webkit-scrollbar {  display: none; }' : '') + "\n  ";
};
//# sourceMappingURL=halpers.js.map