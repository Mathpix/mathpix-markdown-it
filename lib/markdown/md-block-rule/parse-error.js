"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckParseError = exports.ClearParseErrorList = exports.ClearParseError = exports.pushParseErrorList = exports.pushError = exports.ParseError = exports.ParseErrorList = void 0;
exports.ParseErrorList = [];
exports.ParseError = [];
exports.pushError = function (messages) {
    exports.ParseError.push(messages);
};
exports.pushParseErrorList = function (messages, ln) {
    exports.ParseErrorList[ln] = messages;
};
exports.ClearParseError = function () {
    exports.ParseError = [];
};
exports.ClearParseErrorList = function () {
    exports.ParseErrorList = [];
};
var StatePushDivError = function (state, startLine, nextLine, content, ParseError, title) {
    var token;
    state.line = nextLine;
    token = state.push('paragraph_open', 'div', 1);
    token.attrs = [['class', 'math-error ']];
    token.map = [startLine, state.line];
    token = state.push('inline', '', 0);
    token.children = [];
    token.content = title + ParseError.concat('\n');
    token = state.push('text', '', 0);
    token.children = [];
    token.content = content;
    state.push('paragraph_close', 'div', -1);
    exports.ClearParseError();
};
exports.CheckParseError = function (state, startLine, nextLine, content) {
    if (exports.ParseError && exports.ParseError.length > 0) {
        StatePushDivError(state, startLine, nextLine, content, exports.ParseError, 'Tabular parse error: ');
        exports.pushParseErrorList(exports.ParseError, startLine);
        return true;
    }
    return false;
};
//# sourceMappingURL=parse-error.js.map