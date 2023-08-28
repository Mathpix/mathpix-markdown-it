"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeginTabular = exports.StatePushTabularBlock = exports.StatePushDiv = exports.StatePushTabulars = exports.inlineDecimalParse = exports.parseInlineTabular = exports.closeTag = exports.openTagG = exports.openTag = void 0;
var tslib_1 = require("tslib");
var parse_tabular_1 = require("./parse-tabular");
var parse_error_1 = require("../parse-error");
var common_1 = require("./common");
var includegraphics_1 = require("../../md-inline-rule/includegraphics");
var sub_code_1 = require("./sub-code");
var utils_1 = require("../../utils");
var consts_1 = require("../../common/consts");
exports.openTag = /(?:\\begin\s{0,}{tabular}\s{0,}\{([^}]*)\})/;
exports.openTagG = /(?:\\begin\s{0,}{tabular}\s{0,}\{([^}]*)\})/g;
exports.closeTag = /(?:\\end\s{0,}{tabular})/;
var closeTagG = /(?:\\end\s{0,}{tabular})/g;
var addContentToList = function (str) {
    var res = [];
    var match = str.match(/(?:\\begin\s{0,}{tabular})/);
    if (match) {
        var params = (0, common_1.getParams)(str, match.index + match[0].length);
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
var parseInlineTabular = function (str) {
    str = (0, sub_code_1.getSubCode)(str);
    var mB = str.match(exports.openTagG);
    var mE = str.match(closeTagG);
    if (!mB || !mE) {
        if (mB && !mE) {
            (0, parse_error_1.pushError)('Not found end{tabular}!');
        }
        if (!mB && mE) {
            (0, parse_error_1.pushError)('Not found begin{tabular}!');
        }
        return null;
    }
    if (mB.length !== mE.length) {
        (0, parse_error_1.pushError)('Open and close tags mismatch!');
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
    res = (0, sub_code_1.codeInlineContent)(res, 'inline');
    return res;
};
exports.parseInlineTabular = parseInlineTabular;
var StatePushParagraphOpen = function (state, startLine, align, centerTables) {
    if (centerTables === void 0) { centerTables = false; }
    var token;
    token = state.push('paragraph_open', 'div', 1);
    token.attrs = [['class', 'table_tabular ']];
    token.parentType = 'table_tabular';
    if (align) {
        token.attrs.push(['style', "text-align: ".concat(align)]);
    }
    else {
        if (centerTables) {
            token.attrs.push(['style', "text-align: center}"]);
        }
    }
    if (centerTables && state.md.options.forLatex) {
        token.attrs.push(['data-align', align]);
    }
    token.map = [startLine, state.line];
};
var StatePushParagraphClose = function (state) {
    var token;
    token = state.push('paragraph_close', 'div', -1);
    token.parentType = 'table_tabular';
};
var inlineDecimalParse = function (tok) {
    tok.token = 'inline';
    tok.tag = '';
    tok.children = [];
    tok.children.push({
        type: "inline_decimal",
        content: tok.content,
        block: false,
        ascii: tok.ascii,
        ascii_tsv: tok.ascii_tsv,
        ascii_csv: tok.ascii_csv,
        ascii_md: tok.ascii_md,
        latex: tok.ascii
    });
    return tok;
};
exports.inlineDecimalParse = inlineDecimalParse;
var StatePushTabulars = function (state, cTabular, align, startLine) {
    var token;
    for (var i = 0; i < cTabular.length; i++) {
        if (cTabular[i].type === 'inline') {
            if (!(0, includegraphics_1.StatePushIncludeGraphics)(state, -1, -1, cTabular[i].content, align)) {
                token = state.push('inline', '', 0);
                token.children = [];
                token.content = cTabular[i].content;
            }
            continue;
        }
        token = state.push("tabular", "", 0);
        token.content = cTabular[i].content;
        token.children = [];
        token.map = [startLine, state.line];
        token.bMarks = 0;
        var res = (0, parse_tabular_1.ParseTabular)(cTabular[i].content, 0, cTabular[i].align, state.md.options);
        if (!res || res.length === 0) {
            continue;
        }
        for (var j = 0; j < res.length; j++) {
            var tok = res[j];
            if (res[j].token === 'inline') {
                tok.block = true;
                tok.envToInline = {};
                if (res[j].content) {
                    state.env.tabulare = state.md.options.outMath.include_tsv
                        || state.md.options.outMath.include_csv
                        || (state.md.options.outMath.include_table_markdown
                            && state.md.options.outMath.table_markdown && state.md.options.outMath.table_markdown.math_as_ascii);
                    state.env.subTabular = res[j].type === 'subTabular';
                    tok.envToInline = tslib_1.__assign({}, state.env);
                    state.env.tabulare = false;
                    tok.content = res[j].content;
                    tok.children = [];
                }
            }
            else {
                if (res[j].token !== 'inline_decimal') {
                    tok.content = res[j].content;
                    tok.children = [];
                }
            }
            token.children.push(tok);
        }
    }
};
exports.StatePushTabulars = StatePushTabulars;
var StatePushDiv = function (state, startLine, nextLine, content) {
    var token;
    state.line = nextLine;
    token = state.push('paragraph_open', 'div', 1);
    token.map = [startLine, state.line];
    token = state.push('inline', '', 0);
    token.children = [];
    token.content = content;
    state.push('paragraph_close', 'div', -1);
};
exports.StatePushDiv = StatePushDiv;
var StatePushTabularBlock = function (state, startLine, nextLine, content, align, centerTables) {
    if (centerTables === void 0) { centerTables = false; }
    var cTabular = (0, exports.parseInlineTabular)(content);
    if (!cTabular || cTabular.length === 0) {
        return (0, parse_error_1.CheckParseError)(state, startLine, nextLine, content);
    }
    state.line = nextLine;
    StatePushParagraphOpen(state, startLine, align, centerTables);
    (0, exports.StatePushTabulars)(state, cTabular, align, startLine);
    StatePushParagraphClose(state);
    return true;
};
exports.StatePushTabularBlock = StatePushTabularBlock;
var BeginTabular = function (state, startLine, endLine, silent) {
    var _a, _b, _c, _d;
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var nextLine = startLine + 1;
    var lineText = state.src.slice(pos, max);
    if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
        return false;
    }
    var isCloseTagExist = false;
    var dataTags = (0, utils_1.findOpenCloseTags)(lineText, consts_1.openTagTabular, consts_1.closeTagTabular);
    var pending = (dataTags === null || dataTags === void 0 ? void 0 : dataTags.pending) ? dataTags.pending : '';
    if (!((_a = dataTags === null || dataTags === void 0 ? void 0 : dataTags.arrOpen) === null || _a === void 0 ? void 0 : _a.length)) {
        return false;
    }
    var iOpen = dataTags.arrOpen.length;
    var resString = lineText;
    if ((_b = dataTags === null || dataTags === void 0 ? void 0 : dataTags.arrClose) === null || _b === void 0 ? void 0 : _b.length) {
        iOpen -= dataTags.arrClose.length;
        isCloseTagExist = true;
    }
    /** For validation mode we can terminate immediately */
    if (silent) {
        return true;
    }
    for (; nextLine <= endLine; nextLine++) {
        dataTags = null;
        if (state.isEmpty(nextLine)) {
            break;
        }
        if (lineText === '') {
            if (iOpen === 0) {
                break;
            }
            else {
                if (pending) {
                    break;
                }
            }
        }
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        if (iOpen > 0) {
            dataTags = (0, utils_1.findOpenCloseTags)(lineText, consts_1.openTagTabular, consts_1.closeTagTabular, pending);
            pending = dataTags === null || dataTags === void 0 ? void 0 : dataTags.pending;
            if ((_c = dataTags === null || dataTags === void 0 ? void 0 : dataTags.arrOpen) === null || _c === void 0 ? void 0 : _c.length) {
                iOpen += dataTags.arrOpen.length;
            }
            if ((_d = dataTags === null || dataTags === void 0 ? void 0 : dataTags.arrClose) === null || _d === void 0 ? void 0 : _d.length) {
                iOpen -= dataTags.arrClose.length;
                isCloseTagExist = true;
            }
        }
        else {
            lineText += '\n';
            break;
            //if (state.isEmpty(nextLine)) { break }
        }
        resString += '\n' + lineText;
        if (state.sCount[nextLine] - state.blkIndent > 3) {
            continue;
        }
        // quirk for blockquotes, this line should already be checked by that rule
        if (state.sCount[nextLine] < 0) {
            continue;
        }
    }
    if (!isCloseTagExist) {
        return false;
    }
    if (state.md.options.centerTables) {
        return (0, exports.StatePushTabularBlock)(state, startLine, nextLine, resString, 'center', true);
    }
    else {
        return (0, exports.StatePushTabularBlock)(state, startLine, nextLine, resString, '');
    }
};
exports.BeginTabular = BeginTabular;
//# sourceMappingURL=index.js.map