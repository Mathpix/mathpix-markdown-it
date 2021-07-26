"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeginTabular = exports.StatePushTabularBlock = exports.StatePushDiv = exports.StatePushTabulars = exports.inlineDecimalParse = exports.parseInlineTabular = exports.closeTag = exports.openTagG = exports.openTag = void 0;
var parse_tabular_1 = require("./parse-tabular");
var parse_error_1 = require("../parse-error");
var common_1 = require("./common");
var includegraphics_1 = require("../../md-inline-rule/includegraphics");
var sub_code_1 = require("./sub-code");
exports.openTag = /(?:\\begin\s{0,}{tabular}\s{0,}\{([^}]*)\})/;
exports.openTagG = /(?:\\begin\s{0,}{tabular}\s{0,}\{([^}]*)\})/g;
exports.closeTag = /(?:\\end\s{0,}{tabular})/;
var closeTagG = /(?:\\end\s{0,}{tabular})/g;
var addContentToList = function (str) {
    var res = [];
    var match = str.match(/(?:\\begin\s{0,}{tabular})/);
    if (match) {
        var params = common_1.getParams(str, match.index + match[0].length);
        if (params) {
            if (match.index > 0) {
                res.push({ type: 'inline', content: str.slice(0, match.index), align: '' });
            }
            res.push({ type: 'tabular', content: str.slice(params.index), align: params.align });
        }
        else {
            var mB = str
                .match(exports.openTag);
            if (mB) {
                if (mB.index > 0) {
                    res.push({ type: 'inline', content: str.slice(0, mB.index), align: '' });
                }
                res.push({ type: 'tabular', content: str.slice(mB.index + mB[0].length), align: mB[1] });
            }
            else {
                res.push({ type: 'inline', content: str, align: '' });
            }
        }
    }
    else {
        res.push({ type: 'inline', content: str, align: '' });
    }
    return res;
};
exports.parseInlineTabular = function (str) {
    str = sub_code_1.getSubCode(str);
    var mB = str.match(exports.openTagG);
    var mE = str.match(closeTagG);
    if (!mB || !mE) {
        if (mB && !mE) {
            parse_error_1.pushError('Not found end{tabular}!');
        }
        if (!mB && mE) {
            parse_error_1.pushError('Not found begin{tabular}!');
        }
        return null;
    }
    if (mB.length !== mE.length) {
        parse_error_1.pushError('Open and close tags mismatch!');
        return null;
    }
    var res = [];
    var pos = 0;
    var posB = 0;
    var posE = 0;
    for (var i = 0; i < str.length; i++) {
        var matchB = str
            .slice(posB)
            .match(exports.openTag);
        var matchE = str
            .slice(posE)
            .match(exports.closeTag);
        if (!matchB) {
            if (!matchE) {
                res.push({ type: 'inline', content: str.slice(posE) });
                break;
            }
            res.push({ type: 'tabular', content: str.slice(pos, matchE.index), align: '' });
            break;
        }
        else {
            if (!matchE) {
                res = res.concat(addContentToList(str.slice(posB, posB + matchB.index + matchB[0].length)));
                break;
            }
        }
        if (posB + matchB.index > posE + matchE.index) {
            res = res.concat(addContentToList(str.slice(pos, pos + matchE.index)));
            posB += matchE.index + matchE[0].length;
            pos += matchE.index + matchE[0].length;
            i = posB;
            posE = posB;
        }
        else {
            posB += matchB.index + matchB[0].length;
            if (exports.openTag.test(str.slice(posB, posE + matchE.index + matchE[0].length))) {
                posE += matchE.index + matchE[0].length;
            }
            else {
                res = res.concat(addContentToList(str.slice(pos, posE + matchE.index)));
                posE = posE + matchE.index + matchE[0].length;
                pos = posE;
                posB = posE;
            }
        }
    }
    res = sub_code_1.codeInlineContent(res, 'inline');
    return res;
};
var StatePushParagraphOpen = function (state, startLine, align) {
    var token;
    token = state.push('paragraph_open', 'div', 1);
    token.attrs = [['class', 'table_tabular ']];
    token.attrs.push(['style', "text-align: " + (align ? align : 'center')]);
    token.map = [startLine, state.line];
};
var StatePushParagraphClose = function (state) {
    state.push('paragraph_close', 'div', -1);
};
exports.inlineDecimalParse = function (tok) {
    tok.token = 'inline';
    tok.tag = '';
    tok.children = [];
    tok.children.push({
        type: "inline_decimal",
        content: tok.content,
        block: false,
        ascii: tok.ascii,
        latex: tok.ascii
    });
    return tok;
};
exports.StatePushTabulars = function (state, cTabular, align) {
    var token;
    for (var i = 0; i < cTabular.length; i++) {
        if (cTabular[i].type === 'inline') {
            if (!includegraphics_1.StatePushIncludeGraphics(state, -1, -1, cTabular[i].content, align)) {
                token = state.push('inline', '', 0);
                token.children = [];
                token.content = cTabular[i].content;
            }
            continue;
        }
        token = state.push("tabular", "", 0);
        token.content = cTabular[i].content;
        token.children = [];
        var res = parse_tabular_1.ParseTabular(cTabular[i].content, 0, cTabular[i].align, state.md.options);
        if (!res || res.length === 0) {
            continue;
        }
        for (var j = 0; j < res.length; j++) {
            var tok = res[j];
            if (res[j].token === 'inline') {
                if (res[j].content) {
                    var children = [];
                    state.env.tabulare = state.md.options.outMath.include_tsv
                        || (state.md.options.outMath.include_table_markdown
                            && state.md.options.outMath.table_markdown && state.md.options.outMath.table_markdown.math_as_ascii);
                    state.md.inline.parse(tok.content, state.md, state.env, children);
                    state.env.tabulare = false;
                    if (children.length > 0) {
                        tok.content = '';
                        tok.children = children;
                    }
                    else {
                        tok.content = res[j].content;
                        tok.children = [];
                    }
                }
            }
            else {
                if (res[j].token === 'inline_decimal') {
                    tok = exports.inlineDecimalParse(tok);
                }
                else {
                    tok.content = res[j].content;
                    tok.children = [];
                }
            }
            token.children.push(tok);
        }
    }
};
exports.StatePushDiv = function (state, startLine, nextLine, content) {
    var token;
    state.line = nextLine;
    token = state.push('paragraph_open', 'div', 1);
    token.map = [startLine, state.line];
    token = state.push('inline', '', 0);
    token.children = [];
    token.content = content;
    state.push('paragraph_close', 'div', -1);
};
exports.StatePushTabularBlock = function (state, startLine, nextLine, content, align) {
    var cTabular = exports.parseInlineTabular(content);
    if (!cTabular || cTabular.length === 0) {
        return parse_error_1.CheckParseError(state, startLine, nextLine, content);
    }
    state.line = nextLine;
    StatePushParagraphOpen(state, startLine, align);
    exports.StatePushTabulars(state, cTabular, align);
    StatePushParagraphClose(state);
    return true;
};
exports.BeginTabular = function (state, startLine, endLine) {
    var openTag = /\\begin\s{0,}{tabular}/;
    var closeTag = /\\end\s{0,}{tabular}/;
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var nextLine = startLine + 1;
    var lineText = state.src.slice(pos, max);
    if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
        return false;
    }
    var resString = '';
    var iOpen = openTag.test(lineText) ? 1 : 0;
    if (!iOpen)
        return false;
    if (iOpen > 0) {
        var match = lineText.match(/(?:\\begin\s{0,}{tabular})/);
        if (match) {
            resString += lineText;
            if (match.index > 0 && lineText.charCodeAt(match.index - 1) === 0x60) {
                return false;
            }
        }
        if (closeTag.test(lineText)) {
            if (lineText.match(exports.openTagG).length === lineText.match(closeTagG).length) {
                iOpen--;
            }
        }
    }
    for (; nextLine <= endLine; nextLine++) {
        if (lineText === '') {
            if (iOpen === 0) {
                break;
            }
        }
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        if (iOpen > 0) {
            if (closeTag.test(lineText)) {
                iOpen--;
            }
        }
        else {
            lineText += '\n';
            break;
            //if (state.isEmpty(nextLine)) { break }
        }
        resString += '\n' + lineText;
        if (openTag.test(lineText)) {
            iOpen++;
        }
        // this would be a code block normally, but after paragraph
        // it's considered a lazy continuation regardless of what's there
        if (state.sCount[nextLine] - state.blkIndent > 3) {
            continue;
        }
        // quirk for blockquotes, this line should already be checked by that rule
        if (state.sCount[nextLine] < 0) {
            continue;
        }
    }
    return exports.StatePushTabularBlock(state, startLine, nextLine, resString, 'center');
};
//# sourceMappingURL=index.js.map