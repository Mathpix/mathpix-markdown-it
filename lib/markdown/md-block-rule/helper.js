"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetTokensBlockParse = void 0;
var SetTokensBlockParse = function (state, content, startLine, endLine, isInline, contentPositions) {
    if (isInline === void 0) { isInline = false; }
    if (contentPositions === void 0) { contentPositions = null; }
    var token;
    var children = [];
    state.md.block.parse(content, state.md, state.env, children);
    for (var j = 0; j < children.length; j++) {
        var child = children[j];
        token = state.push(child.type, child.tag, child.nesting);
        token.attrs = child.attrs;
        if (isInline && j === 0 && token.type === "paragraph_open") {
            if (token.attrs) {
                var style = token.attrGet('style');
                if (style) {
                    token.attrSet('style', "display: inline; " + style);
                }
                else {
                    token.attrs.push(['style', "display: inline"]);
                }
            }
            else {
                token.attrSet('style', "display: inline");
            }
            token.attrSet('data-display', 'inline');
        }
        if (startLine && endLine) {
            token.map = [startLine, endLine];
        }
        if ((contentPositions === null || contentPositions === void 0 ? void 0 : contentPositions.hasOwnProperty('startLine')) && child.map) {
            token.map = [contentPositions.startLine + child.map[0], contentPositions.startLine + child.map[1]];
            if (j === 1 && child.type === "inline") {
                token.bMarks = contentPositions.bMarks;
            }
        }
        token.content = child.content;
        token.children = child.children;
    }
};
exports.SetTokensBlockParse = SetTokensBlockParse;
//# sourceMappingURL=helper.js.map