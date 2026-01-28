"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubTabular = exports.pushSubTabular = exports.ClearSubTableLists = void 0;
var tslib_1 = require("tslib");
var common_1 = require("./common");
var consts_1 = require("../../common/consts");
var sub_cell_1 = require("./sub-cell");
var sub_code_1 = require("./sub-code");
var placeholder_utils_1 = require("./placeholder-utils");
var subTabular = [];
var ClearSubTableLists = function () {
    subTabular = [];
};
exports.ClearSubTableLists = ClearSubTableLists;
/**
 * Extracts child placeholder IDs from a sub-tabular content string.
 * Returns a list of raw placeholder IDs without angle brackets.
 */
var extractChildIds = function (content) {
    var _a, _b;
    var placeholderMatches = (_b = (_a = content.match(consts_1.doubleAngleBracketUuidPattern)) !== null && _a !== void 0 ? _a : content.match(consts_1.singleAngleBracketPattern)) !== null && _b !== void 0 ? _b : [];
    return placeholderMatches
        .map(function (match) { return match.replace(consts_1.ANGLE_BRACKETS_RE, ""); })
        .filter(function (s) { return s.length > 0; });
};
var pushSubTabular = function (str, subTabularContent, subRes, posBegin, posEnd, i, level) {
    var e_1, _a;
    var _b;
    var _c;
    if (subRes === void 0) { subRes = []; }
    if (posBegin === void 0) { posBegin = 0; }
    if (i === void 0) { i = 0; }
    if (level === void 0) { level = 0; }
    var id = (0, common_1.generateUniqueId)();
    var childIds = extractChildIds(subTabularContent);
    var _loop_1 = function (childId) {
        var cIdx = subTabular.findIndex(function (item) { return item.id === childId; });
        if (cIdx >= 0) {
            ((_b = (_c = subTabular[cIdx]).parents) !== null && _b !== void 0 ? _b : (_c.parents = [])).push(id);
        }
    };
    try {
        for (var childIds_1 = tslib_1.__values(childIds), childIds_1_1 = childIds_1.next(); !childIds_1_1.done; childIds_1_1 = childIds_1.next()) {
            var childId = childIds_1_1.value;
            _loop_1(childId);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (childIds_1_1 && !childIds_1_1.done && (_a = childIds_1.return)) _a.call(childIds_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var isBlockLocal = (0, common_1.detectLocalBlock)(subTabularContent);
    var childBlock = childIds.some(function (cid) {
        var cIdx = subTabular.findIndex(function (item) { return item.id === cid; });
        return cIdx >= 0 ? !!subTabular[cIdx].isBlock : false;
    });
    subTabular.push({
        id: id,
        content: subTabularContent,
        parsed: subRes,
        children: childIds,
        isBlock: isBlockLocal || childBlock,
    });
    if (posBegin > 0) {
        return str.slice(i, posBegin) + "<<".concat(id, ">>") + str.slice(posEnd + '\\end{tabular}'.length, str.length);
    }
    else {
        return "<<".concat(id, ">>") + str.slice(posEnd + '\\end{tabular}'.length, str.length);
    }
};
exports.pushSubTabular = pushSubTabular;
/**
 * Expands <...> / <<...>> placeholders inside a tabular cell by replacing them with cached
 * sub-tabular content (or diagbox fallback). If injected content contains a list begin
 * (or other block-ish LaTeX), it may be newline-wrapped to keep downstream block parsing stable.
 */
var getSubTabular = function (sub, i, isCell, forLatex) {
    var _a, _b, _c;
    if (isCell === void 0) { isCell = true; }
    if (forLatex === void 0) { forLatex = false; }
    // first expand any extracted code-block placeholders (may add newlines)
    sub = (0, sub_code_1.getExtractedCodeBlockContent)(sub, 0);
    sub = sub.trim();
    if (isCell) {
        sub = (0, common_1.getContent)(sub);
    }
    // fast path: exact id matches a cached parsed tabular
    var directIndex = subTabular.findIndex(function (item) { return item.id === sub; });
    if (directIndex >= 0 && ((_a = subTabular[directIndex].parsed) === null || _a === void 0 ? void 0 : _a.length)) {
        return subTabular[directIndex].parsed;
    }
    // find placeholders
    var cellM = (0, placeholder_utils_1.findPlaceholders)(sub, i);
    if (!cellM) {
        return null;
    }
    var parents = null;
    var cursor = 0;
    var contentFragments = [];
    var _loop_2 = function (j) {
        var placeholder = cellM[j];
        var id = (0, placeholder_utils_1.placeholderToId)(placeholder);
        if (!id) {
            return "continue";
        }
        var start = sub.indexOf(placeholder, cursor);
        if (start === -1) {
            return "continue";
        }
        var end = start + placeholder.length;
        // prefix text between placeholders
        var prefix = sub.slice(cursor, start);
        // Avoid trimming around list-begin tokens to keep `\begin{itemize}` detectable.
        var idx = subTabular.findIndex(function (item) { return item.id === id; });
        var isBlockRule = false;
        if (idx >= 0) {
            var content = subTabular[idx].content;
            isBlockRule = !!subTabular[idx].isBlock || (0, common_1.detectLocalBlock)(prefix) || (0, common_1.detectLocalBlock)(content);
            if (!isBlockRule || prefix.trim() === "") {
                prefix = prefix.trim();
            }
        }
        else {
            isBlockRule = (0, common_1.detectLocalBlock)(prefix);
            if (!isBlockRule || prefix.trim() === "") {
                prefix = prefix.trim();
            }
        }
        var injected = "";
        if (idx >= 0) {
            parents = subTabular[idx].parents;
            injected = (_b = subTabular[idx].content) !== null && _b !== void 0 ? _b : "";
        }
        else {
            injected = (_c = (0, sub_cell_1.findInDiagboxTable)(id)) !== null && _c !== void 0 ? _c : "";
        }
        // decide wrapping using non-space neighbors around placeholder
        var _d = (0, placeholder_utils_1.getInlineContextAroundSpan)(sub, start, end), beforeNonSpace = _d.beforeNonSpace, afterNonSpace = _d.afterNonSpace;
        // If injected content starts a list env, wrap with newlines so block parsing stays stable
        if (isBlockRule) {
            injected = (0, placeholder_utils_1.wrapWithNewlinesIfInline)(injected, beforeNonSpace, afterNonSpace);
        }
        var st = prefix + injected;
        contentFragments.push(st);
        cursor = end;
    };
    for (var j = 0; j < cellM.length; j++) {
        _loop_2(j);
    }
    if (cursor < sub.length) {
        contentFragments.push(sub.slice(cursor));
    }
    return [
        {
            token: 'inline',
            tag: '',
            n: 0,
            content: contentFragments.join(''),
            type: forLatex ? "inline" : "subTabular",
            parents: parents,
            isSubTabular: true,
        },
    ];
};
exports.getSubTabular = getSubTabular;
//# sourceMappingURL=sub-tabular.js.map