"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mmdHtmlInline2 = void 0;
var html_re_1 = require("../common/html-re");
var mmdHtmlInline2 = function (state) {
    var _a, _b;
    if (!((_a = state.tokens) === null || _a === void 0 ? void 0 : _a.length)) {
        return;
    }
    ;
    var stack = [];
    var closeStack = [];
    for (var i = 0; i < ((_b = state.tokens) === null || _b === void 0 ? void 0 : _b.length); i++) {
        var token = state.tokens[i];
        if (token.type === 'html_inline') {
            var matchOpen = token.content.match(html_re_1.HTML_OPEN_TAG_RE);
            if (matchOpen) {
                var tag = matchOpen.length > 1 ? matchOpen[1] : '';
                var isClose = matchOpen.length > 2 && matchOpen[2] === '/';
                if (tag && !html_re_1.selfClosingTags.includes(tag) && !isClose && !token.isSvg) {
                    stack.push({
                        token: token,
                        content: token.content,
                        tag: matchOpen[1]
                    });
                }
                continue;
            }
            var matchClose = token.content.match(html_re_1.HTML_CLOSE_TAG_RE);
            if (matchClose) {
                if (stack.length === 0) {
                    console.log("Mismatched closing tag: </".concat(matchClose[1], ">"));
                    closeStack.push({
                        token: token,
                        content: token.content,
                        tag: matchClose[1]
                    });
                    continue;
                }
                var beforeTag = stack.length ? stack[stack.length - 1].tag : '';
                if (beforeTag === matchClose[1]) {
                    stack.pop();
                    continue;
                }
                if (html_re_1.selfClosingTags.includes(beforeTag)) {
                    stack.pop();
                    continue;
                }
                console.log("Mismatched closing tag: </".concat(matchClose[1], ">"));
                closeStack.push({
                    token: token,
                    content: token.content,
                    tag: matchClose[1]
                });
            }
        }
    }
    if (stack === null || stack === void 0 ? void 0 : stack.length) {
        for (var i = 0; i < stack.length; i++) {
            var token = stack[i].token;
            token.type = 'text';
        }
    }
    if (closeStack === null || closeStack === void 0 ? void 0 : closeStack.length) {
        for (var i = 0; i < closeStack.length; i++) {
            var token = closeStack[i].token;
            token.type = 'text';
        }
    }
};
exports.mmdHtmlInline2 = mmdHtmlInline2;
//# sourceMappingURL=mmd-html_inline2.js.map