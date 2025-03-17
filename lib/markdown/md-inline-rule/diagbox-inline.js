"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inlineDiagbox = void 0;
var tslib_1 = require("tslib");
var sub_cell_1 = require("../md-block-rule/begin-tabular/sub-cell");
var sub_tabular_1 = require("../md-block-rule/begin-tabular/sub-tabular");
var sub_math_1 = require("../md-block-rule/begin-tabular/sub-math");
var common_1 = require("../md-block-rule/begin-tabular/common");
var consts_1 = require("../common/consts");
var parseAttributes = function (str) {
    var result = {};
    try {
        str.split(",").forEach(function (pair) {
            var _a = tslib_1.__read(pair.split("=").map(function (s) { return s.trim(); }), 2), key = _a[0], value = _a[1];
            result[key] = value || true;
        });
        return result;
    }
    catch (err) {
        console.error("[ERROR]=>[parseAttributes]=>", err);
        return result;
    }
};
var processContent = function (content) {
    try {
        var parseMath = (0, sub_math_1.getMathTableContent)(content, 0);
        var processedContent = parseMath || (0, common_1.getContent)(content);
        var data = (0, sub_tabular_1.getSubTabular)(processedContent, 0, true);
        if (data && data.length) {
            return data.map(function (item) { return item.content; }).join('');
        }
        else {
            return processedContent;
        }
    }
    catch (err) {
        console.error("[ERROR]=>[processContent]=>", err);
        return content;
    }
};
var createDiagboxItemToken = function (state, content) {
    var token = new state.Token('diagbox_item', '', 0);
    token.content = content;
    var tokens = [];
    state.md.inline.parse(content, state.md, state.env, tokens);
    token.children = tokens;
    return token;
};
var inlineDiagbox = function (state, silent) {
    try {
        var pos = state.pos, src = state.src;
        var match = void 0;
        if (src.charCodeAt(pos) !== 0x5c /* \ */) {
            return false;
        }
        var str = src.slice(pos);
        match = consts_1.reDiagbox.exec(str);
        if (!match)
            return false;
        if (silent)
            return true;
        var index = match.index;
        var options = match[2] || '';
        var isSW = false;
        if (match[1] === 'slashbox') {
            isSW = true;
        }
        var attributes = parseAttributes(options);
        if ((attributes === null || attributes === void 0 ? void 0 : attributes.dir) === 'SW' || (attributes === null || attributes === void 0 ? void 0 : attributes.dir) === 'NE') {
            isSW = true;
        }
        var _a = tslib_1.__read((0, sub_cell_1.extractNextBraceContent)(str, index + match[0].length), 2), left = _a[0], newIndex = _a[1];
        var _b = tslib_1.__read((0, sub_cell_1.extractNextBraceContent)(str, newIndex), 2), right = _b[0], endIndex = _b[1];
        left = (0, sub_math_1.getSubMath)(left);
        right = (0, sub_math_1.getSubMath)(right);
        left = left.split('\\\\').join('\n');
        right = right.split('\\\\').join('\n');
        var token = isSW ? state.push('slashbox', '', 0) : state.push('backslashbox', '', 0);
        token.attrJoin('class', "diagonal-cell");
        token.attrJoin('style', 'grid-template-columns: repeat(2, 1fr); padding: 0;');
        token.content = '';
        token.latex = match[0];
        token.children = [];
        var leftContent = processContent(left);
        var rightContent = processContent(right);
        var tokenLeft = createDiagboxItemToken(state, leftContent);
        var tokenRight = createDiagboxItemToken(state, rightContent);
        if (isSW) {
            tokenLeft.attrJoin('class', "diagonal-cell-topLeft");
            var styleTopLeft = ['grid-row-start: 1;', 'grid-column-start: 1;', 'text-align: left; white-space: nowrap;'];
            tokenLeft.attrJoin('style', styleTopLeft.join(' '));
            token.children.push(tokenLeft);
            tokenRight.attrJoin('class', "diagonal-cell-bottomRight");
            var styleBottomRight = ['grid-row-start: 2;', 'grid-column-start: 2;', 'text-align: right; white-space: nowrap;'];
            tokenRight.attrJoin('style', styleBottomRight.join(' '));
            token.children.push(tokenRight);
        }
        else {
            tokenRight.attrJoin('class', "diagonal-cell-topRight");
            var styleTopRight = ['grid-row-start: 1;', 'grid-column-start: 2;', 'text-align: right; white-space: nowrap;'];
            tokenRight.attrJoin('style', styleTopRight.join(' '));
            token.children.push(tokenRight);
            tokenLeft.attrJoin('class', "diagonal-cell-bottomLeft");
            var styleBottomLeft = ['grid-row-start: 2;', 'grid-column-start: 1;', 'text-align: left; white-space: nowrap;'];
            tokenLeft.attrJoin('style', styleBottomLeft.join(' '));
            token.children.push(tokenLeft);
        }
        state.pos += endIndex;
        return true;
    }
    catch (err) {
        console.error("[ERROR]=>[inlineDiagbox]=>", err);
        return false;
    }
};
exports.inlineDiagbox = inlineDiagbox;
//# sourceMappingURL=diagbox-inline.js.map