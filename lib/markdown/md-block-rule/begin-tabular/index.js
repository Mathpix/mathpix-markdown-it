"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var inner_tsv = [];
exports.tsvPush = function (item) {
    inner_tsv.push(item);
};
exports.getTsv = function () {
    return inner_tsv;
};
exports.StatePushTabulars = function (state, cTabular, align) {
    var token;
    var res_tsv = [];
    var _loop_1 = function (i) {
        if (cTabular[i].type === 'inline') {
            if (!includegraphics_1.StatePushIncludeGraphics(state, -1, -1, cTabular[i].content, align)) {
                token = state.push('inline', '', 0);
                token.children = [];
                token.content = cTabular[i].content;
            }
            return "continue";
        }
        inner_tsv = [];
        var res = parse_tabular_1.ParseTabular(cTabular[i].content, 0, cTabular[i].align);
        var tsv = [].concat(inner_tsv);
        if (!res || res.length === 0) {
            return "continue";
        }
        var _loop_2 = function (j) {
            token = state.push(res[j].token, res[j].tag, res[j].n);
            if (res[j].attrs) {
                token.attrs = [].concat(res[j].attrs);
            }
            if (res[j].token === 'inline') {
                if (res[j].content) {
                    var children = [];
                    inner_tsv = [];
                    state.md.inline.parse(res[j].content, state.md, state.env, children);
                    if (children.length > 0) {
                        token.content = '';
                        token.children = children;
                    }
                    else {
                        token.content = res[j].content;
                        token.children = [];
                    }
                    if (res[j].id && inner_tsv.length > 0) {
                        tsv.map(function (item) {
                            var i = item.indexOf(res[j].id);
                            if (i !== -1) {
                                item[i] = inner_tsv;
                            }
                        });
                    }
                }
            }
            else {
                token.content = res[j].content;
                token.children = [];
            }
        };
        for (var j = 0; j < res.length; j++) {
            _loop_2(j);
        }
        res_tsv.push(tsv);
        tsv = [];
    };
    for (var i = 0; i < cTabular.length; i++) {
        _loop_1(i);
    }
    StatePushTSVTable(state, res_tsv);
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
exports.TsvJoin = function (tsv, options) {
    var _a = options.outMath.tsv_separators, tsv_separators = _a === void 0 ? {} : _a;
    var _b = tsv_separators.column, column = _b === void 0 ? '\t' : _b, _c = tsv_separators.row, row = _c === void 0 ? '\n' : _c;
    if (!tsv || tsv.length === 0) {
        return '';
    }
    return tsv.map(function (row) { return row.join(column); }).join(row);
};
var StatePushTSVTable = function (state, tsvList) {
    if (!tsvList || tsvList.length === 0) {
        return;
    }
    for (var i = 0; i < tsvList.length; i++) {
        var tsv = tsvList[i];
        var content = exports.TsvJoin(tsv, state.md.options);
        var token = void 0;
        token = state.push('tsv', '', 0);
        token.content = content;
    }
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