"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = exports.getAttributes = exports.FindSymbolToAM = exports.FindSymbolReplace = exports.SymbolToAM = exports.getSymbolType = exports.needFirstSpace = exports.needLastSpaceAfterTeXAtom = exports.needFirstSpaceBeforeTeXAtom = void 0;
var tslib_1 = require("tslib");
var MmlNode_1 = require("mathjax-full/js/core/MmlTree/MmlNode");
var helperA_1 = require("./helperA");
var consts_1 = require("../../helpers/consts");
var common_1 = require("./common");
var regW = /^\w/;
var isFirstChild = function (node) {
    return node.parent && node.parent.childNodes[0] && node.parent.childNodes[0] === node;
};
var isLastChild = function (node) {
    return node.parent && node.parent.childNodes && node.parent.childNodes[node.parent.childNodes.length - 1] === node;
};
var needFirstSpaceBeforeTeXAtom = function (node) {
    var _a;
    if (isFirstChild(node)) {
        return false;
    }
    if (node.kind === 'TeXAtom' && ((_a = node.properties) === null || _a === void 0 ? void 0 : _a.texClass) === MmlNode_1.TEXCLASS.OP) {
        var index = node.parent.childNodes.findIndex(function (item) { return item === node; });
        var prev = node.parent.childNodes[index - 1];
        if (prev.kind !== 'mi') {
            return false;
        }
        return true;
    }
    return false;
};
exports.needFirstSpaceBeforeTeXAtom = needFirstSpaceBeforeTeXAtom;
var needLastSpaceAfterTeXAtom = function (node) {
    var _a;
    if (isLastChild(node)) {
        return false;
    }
    if (node.kind === 'TeXAtom' && ((_a = node.properties) === null || _a === void 0 ? void 0 : _a.texClass) === MmlNode_1.TEXCLASS.OP) {
        var index = node.parent.childNodes.findIndex(function (item) { return item === node; });
        var next = node.parent.childNodes[index + 1];
        if (next.kind !== 'mi' && next.kind !== 'msub') {
            return false;
        }
        return true;
    }
    return false;
};
exports.needLastSpaceAfterTeXAtom = needLastSpaceAfterTeXAtom;
var needFirstSpace = function (node) {
    try {
        if (isFirstChild(node)) {
            return false;
        }
        else {
            var index = node.parent.childNodes.findIndex(function (item) { return item === node; });
            var prev = node.parent.childNodes[index - 1];
            var hasLastSpace = prev.attributes.get('hasLastSpace');
            if (hasLastSpace) {
                return false;
            }
            if (prev.kind === 'mi' || prev.kind === 'mo') {
                var text = prev.childNodes[0] ? prev.childNodes[0].text : '';
                return regW.test(text[0]);
            }
            else {
                return false;
            }
        }
    }
    catch (e) {
        return false;
    }
};
exports.needFirstSpace = needFirstSpace;
var needLastSpace = function (node, isFunction) {
    var _a;
    if (isFunction === void 0) { isFunction = false; }
    var haveSpace = false;
    try {
        if (node.parent.kind === "msubsup") {
            return false;
        }
        if (isLastChild(node)) {
            return false;
        }
        else {
            var index = node.parent.childNodes.findIndex(function (item) { return item === node; });
            var next = node.parent.childNodes[index + 1];
            if (next.childNodes[0].kind === 'text' && next.childNodes[0].text === '\u2061' && !isLastChild(next)) {
                next = node.parent.childNodes[index + 2];
                haveSpace = true;
            }
            if (next.kind === 'TeXAtom' && ((_a = next.properties) === null || _a === void 0 ? void 0 : _a.texClass) === MmlNode_1.TEXCLASS.OP) {
                return true;
            }
            if (isFunction && next.kind === 'mfrac') {
                return false;
            }
            if (next.kind === 'mi' || next.kind === 'mo') {
                var text = next.childNodes[0] ? next.childNodes[0].text : '';
                if (next.childNodes[0] && next.childNodes[0].kind === 'text' && next.childNodes[0].text === '\u2061') {
                    return true;
                }
                var abs = (0, exports.SymbolToAM)(next.kind, text);
                return regW.test(abs);
            }
            else {
                if (next.kind === 'mrow') {
                    return false;
                }
                return haveSpace;
            }
        }
    }
    catch (e) {
        return haveSpace;
    }
};
var getSymbolType = function (tag, output) {
    var tags = helperA_1.AMsymbols.find(function (item) { return (item.tag === tag && item.output === output); });
    return tags ? tags.symbolType : '';
};
exports.getSymbolType = getSymbolType;
var SymbolToAM = function (tag, output, atr, showStyle) {
    var e_1, _a;
    if (atr === void 0) { atr = null; }
    if (showStyle === void 0) { showStyle = false; }
    var tags = null;
    var atrsNames = atr ? Object.getOwnPropertyNames(atr) : [];
    output = tag !== 'mtext' ? output.split(' ').join('') : output;
    if (showStyle && atr && atrsNames.length > 0) {
        var _loop_1 = function (atname, atval) {
            tags = helperA_1.AMsymbols.find(function (item) { return (item.tag === "mstyle" && item.atname === atname && item.atval === atval); });
            if (tags) {
                return "break";
            }
        };
        try {
            for (var _b = tslib_1.__values(Object.entries(atr)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = tslib_1.__read(_c.value, 2), atname = _d[0], atval = _d[1];
                var state_1 = _loop_1(atname, atval);
                if (state_1 === "break")
                    break;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (tags && tags.input) {
            return tags.input + '(' + output + ')';
        }
    }
    if (!tags) {
        tags = helperA_1.AMsymbols.find(function (item) {
            if (tag === 'mo' || tag === 'mi') {
                return (item.tag === 'mo' || item.tag === 'mi') && item.output === output;
            }
            else {
                return item.tag === tag && item.output === output;
            }
        });
    }
    //need split
    if (!tags && atr && atrsNames.length > 0 && Object.getOwnPropertyNames(atr) && atr.stretchy === false) {
        var sp_1 = output.split('');
        var res = '';
        var _loop_2 = function (i) {
            var tags_1 = helperA_1.AMsymbols.find(function (item) {
                if (tag === 'mo' || tag === 'mi') {
                    return (item.tag === 'mo' || item.tag === 'mi') && item.output === sp_1[i];
                }
                else {
                    return item.tag === tag && item.output === sp_1[i];
                }
            });
            res += i > 0 ? ' ' : '';
            res += tags_1 && tags_1.input ? tags_1.input : sp_1[i];
        };
        for (var i = 0; i < sp_1.length; i++) {
            _loop_2(i);
        }
        return res;
    }
    return tags ? tags.input : output;
};
exports.SymbolToAM = SymbolToAM;
var FindSymbolReplace = function (str) {
    return str.replace(/\u00A0/g, ' ');
};
exports.FindSymbolReplace = FindSymbolReplace;
var FindSymbolToAM = function (tag, output, atr) {
    if (atr === void 0) { atr = null; }
    output = output.split(' ').join('');
    var tags = null;
    if (atr && atr.stretchy) {
        tags = helperA_1.AMsymbols.find(function (item) {
            if (tag === 'mo' || tag === 'mi') {
                return (item.tag === 'mo' || item.tag === 'mi') && item.output === output && item.stretchy;
            }
            else {
                return item.tag === tag && item.output === output && item.stretchy;
            }
        });
    }
    if (!tags) {
        tags = helperA_1.AMsymbols.find(function (item) {
            if (tag === 'mo' || tag === 'mi') {
                return (item.tag === 'mo' || item.tag === 'mi') && item.output === output;
            }
            else {
                return item.tag === tag && item.output === output;
            }
        });
    }
    return tags ? tags.input : '';
};
exports.FindSymbolToAM = FindSymbolToAM;
var getChildrenText = function (node) {
    var text = '';
    try {
        node.childNodes.forEach(function (child) {
            text += child.text;
        });
        return text;
    }
    catch (e) {
        return text;
    }
};
var defHandle = function (node, serialize) {
    return handlerApi.handleAll(node, serialize);
};
var getAttributes = function (node) {
    return node.attributes.getAllAttributes();
};
exports.getAttributes = getAttributes;
var menclose = function (handlerApi) {
    return function (node, serialize) {
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: '',
        };
        try {
            var atr = (0, exports.getAttributes)(node);
            var isLeft = false;
            var isRight = false;
            if (atr && atr.notation) {
                isLeft = atr.notation.toString().indexOf('left') > -1;
                isRight = atr.notation.toString().indexOf('right') > -1;
            }
            res = (0, common_1.AddToAsciiData)(res, [isLeft ? '[' : '']);
            var data = handlerApi.handleAll(node, serialize);
            res = (0, common_1.AddToAsciiData)(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
            if (atr && atr.lcm) {
                res = (0, common_1.AddToAsciiData)(res, ['']);
            }
            res = (0, common_1.AddToAsciiData)(res, [isRight ? ']' : '']);
            return res;
        }
        catch (e) {
            console.error('mml => menclose =>', e);
            return res;
        }
    };
};
var getNodeFromRow = function (node) {
    if (node.childNodes.length === 1 && (node.childNodes[0].isKind('inferredMrow') || node.childNodes[0].isKind('TeXAtom'))) {
        node = getNodeFromRow(node.childNodes[0]);
    }
    return node;
};
var getDataForVerticalMath = function (serialize, node, rowNumber) {
    var mtdNode = getNodeFromRow(node);
    var res = {
        collChildrenCanBeVerticalMath: true,
        startedFromMathOperation: false,
        mmlCollVerticalMath: '',
        mathOperation: ''
    };
    for (var k = 0; k < mtdNode.childNodes.length; k++) {
        var child = mtdNode.childNodes[k];
        /** The element is wrapped in curly braces:
         *  e.g. {\times 1}*/
        if (child.isKind('inferredMrow') || child.isKind('TeXAtom')) {
            var data_1 = getDataForVerticalMath(serialize, child, rowNumber);
            if (!data_1.collChildrenCanBeVerticalMath) {
                res.collChildrenCanBeVerticalMath = false;
            }
            if (data_1.startedFromMathOperation) {
                res.startedFromMathOperation = true;
            }
            if (data_1.mathOperation) {
                res.mathOperation = data_1.mathOperation;
            }
            res.mmlCollVerticalMath += data_1.mmlCollVerticalMath;
            continue;
        }
        var data = serialize.visitNode(child, '');
        var text = getChildrenText(child);
        if (child.kind === 'mo') {
            var symbolType = (0, exports.getSymbolType)('mo', text);
            if (symbolType === helperA_1.eSymbolType.logical
                || symbolType === helperA_1.eSymbolType.relation
                || symbolType === helperA_1.eSymbolType.arrow) {
                res.collChildrenCanBeVerticalMath = false;
            }
        }
        if (!child.isKind('mstyle')) {
            if (k === 0 && child.kind === 'mo' && rowNumber > 0) {
                var text_1 = getChildrenText(child);
                if (text_1 === '+' || text_1 === '-'
                    || text_1 === '\u2212' //"-"
                    || text_1 === '\u00D7' //times
                    || text_1 === '\u00F7' //div
                ) {
                    res.mathOperation = data.ascii;
                    res.startedFromMathOperation = true;
                }
            }
            res.mmlCollVerticalMath += data.ascii === '","' ? ',' : data.ascii;
        }
    }
    return res;
};
var mtable = function () {
    return function (node, serialize) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        var mml = '';
        var mml_tsv = '';
        var mml_csv = '';
        var mml_md = '';
        try {
            /** MathJax: <mrow> came from \left...\right
             *   so treat as subexpression (TeX class INNER). */
            var isSubExpression = node.prevClass === MmlNode_1.TEXCLASS.INNER;
            var parentIsMenclose = ((_a = node.Parent) === null || _a === void 0 ? void 0 : _a.kind) === 'menclose';
            var countRow = node.childNodes.length;
            var toTsv = serialize.options.tableToTsv && !serialize.options.isSubTable
                && (((_b = node.Parent) === null || _b === void 0 ? void 0 : _b.kind) === 'math' || (parentIsMenclose && ((_c = node.Parent.Parent) === null || _c === void 0 ? void 0 : _c.kind) === 'math'));
            var toCsv = serialize.options.tableToCsv && !serialize.options.isSubTable
                && (((_d = node.Parent) === null || _d === void 0 ? void 0 : _d.kind) === 'math' || (parentIsMenclose && ((_e = node.Parent.Parent) === null || _e === void 0 ? void 0 : _e.kind) === 'math'));
            var toMd = serialize.options.tableToMd && !serialize.options.isSubTable
                && (((_f = node.Parent) === null || _f === void 0 ? void 0 : _f.kind) === 'math' || (parentIsMenclose && ((_g = node.Parent.Parent) === null || _g === void 0 ? void 0 : _g.kind) === 'math'));
            node.attributes.setInherited('toTsv', toTsv);
            node.attributes.setInherited('toCsv', toCsv);
            node.attributes.setInherited('toMd', toMd);
            var columnAlign = node.attributes.get('columnalign');
            var arrRowLines = node.attributes.isSet('rowlines') ? node.attributes.get('rowlines').split(' ') : [];
            var envName = node.attributes.get('name');
            /** Check if a table is enclosed in brackets */
            var isHasBranchOpen = node.parent && node.parent.kind === 'mrow' && ((_h = node.parent.properties) === null || _h === void 0 ? void 0 : _h.hasOwnProperty('open'));
            var isHasBranchClose = node.parent && node.parent.kind === 'mrow' && ((_j = node.parent.properties) === null || _j === void 0 ? void 0 : _j.hasOwnProperty('close'));
            var thereAreBracketsIn_parent = (isHasBranchOpen && node.parent.properties['open'])
                || (isHasBranchClose && node.parent.properties['close']);
            var thereAreBracketsIn_Parent = parentIsMenclose && ((_k = node.Parent.Parent) === null || _k === void 0 ? void 0 : _k.isKind('mrow'))
                && ((((_l = node.Parent.Parent.properties) === null || _l === void 0 ? void 0 : _l.hasOwnProperty('open')) && node.Parent.Parent.properties['open'])
                    || (((_m = node.Parent.Parent.properties) === null || _m === void 0 ? void 0 : _m.hasOwnProperty('close')) && node.Parent.Parent.properties['close']));
            /** It is a matrix or system of equations with brackets */
            var isMatrixOrSystemOfEquations = thereAreBracketsIn_parent || thereAreBracketsIn_Parent;
            var itShouldBeFlatten = consts_1.envArraysShouldBeFlattenInTSV.includes(envName)
                && !isHasBranchOpen && !isHasBranchClose && !parentIsMenclose;
            /** Vertical math:
             * \begin{array}{r} and it should not be a matrix and not a system of equations */
            var isVerticalMath = columnAlign === 'right' && !isMatrixOrSystemOfEquations;
            var arrRows = [];
            var startedFromMathOperation = false;
            for (var i = 0; i < countRow; i++) {
                var mtrNode = node.childNodes[i];
                mtrNode.attributes.setInherited('toTsv', toTsv);
                mtrNode.attributes.setInherited('toCsv', toCsv);
                mtrNode.attributes.setInherited('toMd', toMd);
                mtrNode.attributes.setInherited('itShouldBeFlatten', itShouldBeFlatten);
                var mmlRow = '';
                var mmlRow_tsv = '';
                var mmlRow_csv = '';
                var mmlRow_md = '';
                var mmlRowVerticalMath = '';
                var mathOperation = '';
                var countColl = (_o = mtrNode.childNodes) === null || _o === void 0 ? void 0 : _o.length;
                /** It's EqnArray or AmsEqnArray or AlignAt.
                 *  eqnarray*, align, align*, split, gather, gather*, aligned, gathered, alignat, alignat*, alignedat */
                var isEqnArrayRow = mtrNode.attributes.get('displaystyle');
                for (var j = 0; j < countColl; j++) {
                    if (j > 0 && !isEqnArrayRow) {
                        mmlRow += ',';
                        mmlRow_tsv += toTsv ? ((_p = serialize.options.tsv_separators) === null || _p === void 0 ? void 0 : _p.column) || '\t' : itShouldBeFlatten ? ', ' : ',';
                        mmlRow_csv += toCsv ? ((_q = serialize.options.csv_separators) === null || _q === void 0 ? void 0 : _q.column) || ',' : itShouldBeFlatten ? ', ' : ',';
                        mmlRow_md += toMd ? ((_r = serialize.options.md_separators) === null || _r === void 0 ? void 0 : _r.column) || ' ' : itShouldBeFlatten ? ', ' : ',';
                    }
                    var mtdNode = mtrNode.childNodes[j];
                    var _0 = serialize.visitNode(mtdNode, ''), _1 = _0.ascii, ascii = _1 === void 0 ? '' : _1, _2 = _0.ascii_tsv, ascii_tsv = _2 === void 0 ? '' : _2, _3 = _0.ascii_csv, ascii_csv = _3 === void 0 ? '' : _3, _4 = _0.ascii_md, ascii_md = _4 === void 0 ? '' : _4;
                    var mmlCollVerticalMath = '';
                    if (isVerticalMath) {
                        var dataColl = getDataForVerticalMath(serialize, mtdNode, i);
                        mmlCollVerticalMath = dataColl.mmlCollVerticalMath;
                        if (dataColl.startedFromMathOperation) {
                            startedFromMathOperation = true;
                            mathOperation = dataColl.mathOperation;
                        }
                        if (!dataColl.collChildrenCanBeVerticalMath) {
                            isVerticalMath = false;
                        }
                    }
                    mmlRow += ascii;
                    mmlRow_tsv += !toTsv && itShouldBeFlatten ? ascii_tsv.trimEnd() : ascii_tsv;
                    mmlRow_csv += !toCsv && itShouldBeFlatten ? ascii_csv.trimEnd() : ascii_csv;
                    mmlRow_md += !toMd && itShouldBeFlatten ? ascii_md.trimEnd() : ascii_md;
                    mmlRowVerticalMath += mmlCollVerticalMath;
                }
                /** For vertical math, if the horizontal line is in front of the answer, then replace it with an equals sign */
                if (isVerticalMath &&
                    (arrRowLines === null || arrRowLines === void 0 ? void 0 : arrRowLines.length) && (arrRowLines === null || arrRowLines === void 0 ? void 0 : arrRowLines.length) > i && arrRowLines[i] !== 'none') {
                    mmlRowVerticalMath += '=';
                }
                /** It's EqnArray or AmsEqnArray or AlignAt.
                 *  eqnarray*, align, align*, split, gather, gather*, aligned, gathered, alignat, alignat*, alignedat */
                var isEqnArray = (_s = mtrNode.attributes) === null || _s === void 0 ? void 0 : _s.get('displaystyle');
                arrRows.push({
                    mmlRow: mmlRow,
                    mmlRow_tsv: mmlRow_tsv,
                    mmlRow_csv: mmlRow_csv,
                    mmlRow_md: mmlRow_md,
                    mmlRowVerticalMath: mmlRowVerticalMath,
                    mathOperation: mathOperation,
                    encloseToSquareBrackets: countRow > 1 || isSubExpression || (countColl > 1 && !isEqnArray),
                    toTsv: toTsv,
                    toCsv: toCsv,
                    toMd: toMd,
                    itShouldBeFlatten: itShouldBeFlatten
                });
            }
            /** If none of the row starts with math operation (+, -, times)
             * then it can't be vertical math */
            if (!startedFromMathOperation) {
                isVerticalMath = false;
            }
            /** Check for the need to set mathematical operations before each line */
            if (isVerticalMath && arrRows.length > 2) {
                var mathOperation = '';
                for (var i = arrRows.length - 1; i >= 0; i--) {
                    if (arrRows[i].mathOperation) {
                        mathOperation = arrRows[i].mathOperation;
                        continue;
                    }
                    if (mathOperation && i > 0) {
                        arrRows[i].mmlRowVerticalMath = mathOperation + arrRows[i].mmlRowVerticalMath;
                    }
                }
            }
            var mmlTableContent = '';
            var mmlTableContent_tsv = '';
            var mmlTableContent_csv = '';
            var mmlTableContent_md = '';
            for (var i = 0; i < arrRows.length; i++) {
                if (i > 0 && !isVerticalMath) {
                    mmlTableContent += ',';
                    mmlTableContent_tsv += toTsv
                        ? ((_t = serialize.options.tsv_separators) === null || _t === void 0 ? void 0 : _t.row) || '\n'
                        : itShouldBeFlatten ? ', ' : ',';
                    mmlTableContent_csv += toCsv
                        ? ((_u = serialize.options.csv_separators) === null || _u === void 0 ? void 0 : _u.row) || '\n'
                        : itShouldBeFlatten ? ', ' : ',';
                    mmlTableContent_md += toMd
                        ? ((_v = serialize.options.md_separators) === null || _v === void 0 ? void 0 : _v.row) || ' <br> '
                        : itShouldBeFlatten ? ', ' : ',';
                }
                var mmlRow = isVerticalMath ? arrRows[i].mmlRowVerticalMath : arrRows[i].mmlRow;
                var mmlRow_tsv = isVerticalMath ? arrRows[i].mmlRowVerticalMath : arrRows[i].mmlRow_tsv;
                var mmlRow_csv = isVerticalMath ? arrRows[i].mmlRowVerticalMath : arrRows[i].mmlRow_csv;
                var mmlRow_md = isVerticalMath ? arrRows[i].mmlRowVerticalMath : arrRows[i].mmlRow_md;
                mmlTableContent += arrRows[i].encloseToSquareBrackets && !isVerticalMath
                    ? '[' + mmlRow + ']'
                    : mmlRow;
                mmlTableContent_tsv += arrRows[i].encloseToSquareBrackets
                    && !arrRows[i].itShouldBeFlatten && !arrRows[i].toTsv && !isVerticalMath
                    ? '[' + mmlRow_tsv + ']'
                    : mmlRow_tsv;
                mmlTableContent_csv += arrRows[i].encloseToSquareBrackets
                    && !arrRows[i].itShouldBeFlatten && !arrRows[i].toCsv && !isVerticalMath
                    ? '[' + mmlRow_csv + ']'
                    : mmlRow_csv;
                mmlTableContent_md += arrRows[i].encloseToSquareBrackets
                    && !arrRows[i].itShouldBeFlatten && !arrRows[i].toMd && !isVerticalMath
                    ? '[' + mmlRow_md + ']'
                    : mmlRow_md;
            }
            if (isVerticalMath) {
                if ((_w = node.Parent) === null || _w === void 0 ? void 0 : _w.isKind('mrow')) {
                    node.Parent.attributes.setInherited('isVerticalMath', true);
                }
                if (((_x = node.Parent) === null || _x === void 0 ? void 0 : _x.isKind('menclose')) && ((_z = (_y = node.Parent) === null || _y === void 0 ? void 0 : _y.Parent) === null || _z === void 0 ? void 0 : _z.isKind('mrow'))) {
                    node.Parent.Parent.attributes.setInherited('isVerticalMath', true);
                }
            }
            if (toTsv) {
                mml_tsv += '"' + mmlTableContent_tsv + '"';
            }
            else {
                if (itShouldBeFlatten || isVerticalMath) {
                    mml_tsv += mmlTableContent_tsv;
                }
                else {
                    mml_tsv += isHasBranchOpen || parentIsMenclose ? '' : '{:';
                    mml_tsv += mmlTableContent_tsv;
                    mml_tsv += isHasBranchClose || parentIsMenclose ? '' : ':}';
                }
            }
            if (toCsv) {
                mml_csv += mmlTableContent_csv;
            }
            else {
                if (itShouldBeFlatten || isVerticalMath) {
                    mml_csv += mmlTableContent_csv;
                }
                else {
                    mml_csv += isHasBranchOpen || parentIsMenclose ? '' : '{:';
                    mml_csv += mmlTableContent_csv;
                    mml_csv += isHasBranchClose || parentIsMenclose ? '' : ':}';
                }
            }
            if (toMd) {
                mml_md += mmlTableContent_md;
            }
            else {
                if (itShouldBeFlatten || isVerticalMath) {
                    mml_md += mmlTableContent_md;
                }
                else {
                    mml_md += isHasBranchOpen || parentIsMenclose ? '' : '{:';
                    mml_md += mmlTableContent_md;
                    mml_md += isHasBranchClose || parentIsMenclose ? '' : ':}';
                }
            }
            if (isVerticalMath) {
                mml += mmlTableContent;
            }
            else {
                mml += isHasBranchOpen || parentIsMenclose ? '' : '{:';
                mml += mmlTableContent;
                mml += isHasBranchClose || parentIsMenclose ? '' : ':}';
            }
            return {
                ascii: mml,
                ascii_tsv: mml_tsv,
                ascii_csv: mml_csv,
                ascii_md: mml_md,
            };
        }
        catch (e) {
            console.error('mml => mtable =>', e);
            return {
                ascii: mml,
                ascii_tsv: mml_tsv,
                ascii_csv: mml_csv,
                ascii_md: mml_md,
            };
        }
    };
};
var mrow = function () {
    return function (node, serialize) {
        try {
            var isTexClass7 = node.properties && node.properties.texClass === MmlNode_1.TEXCLASS.INNER
                && node.parent && node.parent.kind === 'inferredMrow';
            var needBranchOpen = node.properties
                && node.properties.hasOwnProperty('open') && node.properties.open === '';
            var needBranchClose = node.properties
                && node.properties.hasOwnProperty('close') && node.properties.close === '';
            var mmlContent = '';
            var mmlContent_tsv = '';
            var mmlContent_csv = '';
            var mmlContent_md = '';
            var beforeAscii = '';
            var childBefore = null;
            var parenthesisOpen = false;
            for (var i = 0; i < node.childNodes.length; i++) {
                var data = serialize.visitNode(node.childNodes[i], '');
                if (parenthesisOpen) {
                    var text = (0, common_1.getFunctionNameFromAscii)(data.ascii, node.childNodes[i]);
                    if (!text || helperA_1.regExpIsFunction.test(text)) {
                        mmlContent += ')';
                        mmlContent_tsv += ')';
                        mmlContent_csv += ')';
                        mmlContent_md += ')';
                        parenthesisOpen = false;
                    }
                }
                if (node.childNodes[i].kind === "mfrac" && (beforeAscii === null || beforeAscii === void 0 ? void 0 : beforeAscii.trim())) {
                    if (helperA_1.regExpIsFunction.test(beforeAscii.trim()) || ((childBefore === null || childBefore === void 0 ? void 0 : childBefore.kind) === 'mo' && (childBefore === null || childBefore === void 0 ? void 0 : childBefore.texClass) === -1)) {
                        mmlContent += '(';
                        mmlContent_tsv += '(';
                        mmlContent_csv += '(';
                        mmlContent_md += '(';
                        parenthesisOpen = true;
                    }
                }
                mmlContent += data.ascii;
                mmlContent_tsv += data.ascii_tsv;
                mmlContent_csv += data.ascii_csv;
                mmlContent_md += data.ascii_md;
                beforeAscii = mmlContent;
                childBefore = node.childNodes[i];
            }
            if (parenthesisOpen) {
                mmlContent += ')';
                mmlContent_tsv += ')';
                mmlContent_csv += ')';
                mmlContent_md += ')';
            }
            var isVerticalMath = node.attributes.get('isVerticalMath');
            var open_1 = isTexClass7 && needBranchOpen && !isVerticalMath ? '{:' : '';
            var close_1 = isTexClass7 && needBranchClose && !isVerticalMath ? ':}' : '';
            return {
                ascii: open_1 + mmlContent + close_1,
                ascii_tsv: open_1 + mmlContent_tsv + close_1,
                ascii_csv: open_1 + mmlContent_csv + close_1,
                ascii_md: open_1 + mmlContent_md + close_1,
            };
        }
        catch (e) {
            console.error('mml => mrow =>', e);
            return {
                ascii: '',
                ascii_tsv: '',
                ascii_csv: '',
                ascii_md: '',
            };
        }
    };
};
var mtr = function () {
    return function (node, serialize) {
        var _a, _b, _c;
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: '',
        };
        try {
            /** It's EqnArray or AmsEqnArray or AlignAt.
             *  eqnarray*, align, align*, split, gather, gather*, aligned, gathered, alignat, alignat*, alignedat */
            var isEqnArray = node.attributes.get('displaystyle');
            var toTsv = node.attributes.get('toTsv');
            var toCsv = node.attributes.get('toCsv');
            var toMd = node.attributes.get('toMd');
            var itShouldBeFlatten = node.attributes.get('itShouldBeFlatten');
            for (var i = 0; i < node.childNodes.length; i++) {
                if (i > 0 && !isEqnArray) {
                    res = (0, common_1.AddToAsciiData)(res, [
                        ',',
                        toTsv ? ((_a = serialize.options.tsv_separators) === null || _a === void 0 ? void 0 : _a.column) || '\t' : itShouldBeFlatten ? ', ' : ',',
                        toCsv ? ((_b = serialize.options.csv_separators) === null || _b === void 0 ? void 0 : _b.column) || ',' : itShouldBeFlatten ? ', ' : ',',
                        toMd ? ((_c = serialize.options.md_separators) === null || _c === void 0 ? void 0 : _c.column) || ' ' : itShouldBeFlatten ? ', ' : ',',
                    ]);
                }
                var _d = serialize.visitNode(node.childNodes[i], ''), _e = _d.ascii, ascii = _e === void 0 ? '' : _e, _f = _d.ascii_tsv, ascii_tsv = _f === void 0 ? '' : _f, _g = _d.ascii_csv, ascii_csv = _g === void 0 ? '' : _g, _h = _d.ascii_md, ascii_md = _h === void 0 ? '' : _h;
                res = (0, common_1.AddToAsciiData)(res, [
                    ascii,
                    !toTsv && itShouldBeFlatten ? ascii_tsv === null || ascii_tsv === void 0 ? void 0 : ascii_tsv.trimEnd() : ascii_tsv,
                    !toCsv && itShouldBeFlatten ? ascii_csv === null || ascii_csv === void 0 ? void 0 : ascii_csv.trimEnd() : ascii_csv,
                    !toMd && itShouldBeFlatten ? ascii_md === null || ascii_md === void 0 ? void 0 : ascii_md.trimEnd() : ascii_md,
                ]);
            }
            return res;
        }
        catch (e) {
            console.error('mml => mtr =>', e);
            return res;
        }
    };
};
var mpadded = function (handlerApi) {
    return function (node, serialize) {
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            var mmlAdd = handlerApi.handleAll(node, serialize);
            if (node.Parent && node.Parent.kind === "menclose") {
                var atr = (0, exports.getAttributes)(node.Parent);
                if (atr && atr.notation === 'bottom' && atr.lcm) {
                    if (!mmlAdd || !mmlAdd.ascii) {
                        return res;
                    }
                }
            }
            /** For tsv/csv:
             * Omit the " in nested arrays
             * */
            res = (0, common_1.AddToAsciiData)(res, [
                '"',
                serialize.options.tableToTsv ? '' : '"',
                '',
                ''
            ]);
            res = (0, common_1.AddToAsciiData)(res, [mmlAdd.ascii, mmlAdd.ascii_tsv, mmlAdd.ascii_csv, mmlAdd.ascii_md]);
            res = (0, common_1.AddToAsciiData)(res, [
                '"',
                serialize.options.tableToTsv ? '' : '"',
                '',
                ''
            ]);
            return res;
        }
        catch (e) {
            console.error('mml => mpadded =>', e);
            return res;
        }
    };
};
var mover = function (handlerApi) {
    return function (node, serialize) {
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : '';
            var secondChild = node.childNodes[1] ? node.childNodes[1] : '';
            var dataFirstChild = firstChild ? serialize.visitNode(firstChild, '') : null;
            var dataSecondChild = secondChild ? serialize.visitNode(secondChild, '') : null;
            if (secondChild && secondChild.kind === 'mo') {
                var t = dataSecondChild.ascii;
                var asc = (0, exports.FindSymbolToAM)('mover', t, (0, exports.getAttributes)(secondChild));
                if (asc) {
                    res = (0, common_1.AddToAsciiData)(res, [' ' + asc + '(']);
                    res = (0, common_1.AddToAsciiData)(res, [
                        dataFirstChild ? dataFirstChild.ascii ? dataFirstChild.ascii.trim() : dataFirstChild.ascii : '',
                        dataFirstChild ? dataFirstChild.ascii_tsv ? dataFirstChild.ascii_tsv.trim() : dataFirstChild.ascii_tsv : '',
                        dataFirstChild ? dataFirstChild.ascii_csv ? dataFirstChild.ascii_csv.trim() : dataFirstChild.ascii_csv : '',
                        dataFirstChild ? dataFirstChild.ascii_md ? dataFirstChild.ascii_md.trim() : dataFirstChild.ascii_md : '',
                    ]);
                    res = (0, common_1.AddToAsciiData)(res, [')']);
                }
                else {
                    res = (0, common_1.AddToAsciiData)(res, [
                        dataFirstChild ? dataFirstChild.ascii : '',
                        dataFirstChild ? dataFirstChild.ascii_tsv : '',
                        dataFirstChild ? dataFirstChild.ascii_csv : '',
                        dataFirstChild ? dataFirstChild.ascii_md : ''
                    ]);
                    res = (0, common_1.AddToAsciiData)(res, ['^']);
                    res = (0, common_1.AddToAsciiData)(res, [serialize.options.extraBrackets ? '(' : '']);
                    res = (0, common_1.AddToAsciiData)(res, [
                        dataSecondChild ? dataSecondChild.ascii : '',
                        dataSecondChild ? dataSecondChild.ascii_tsv : '',
                        dataSecondChild ? dataSecondChild.ascii_csv : '',
                        dataSecondChild ? dataSecondChild.ascii_md : ''
                    ]);
                    res = (0, common_1.AddToAsciiData)(res, [serialize.options.extraBrackets ? ')' : '']);
                }
            }
            else {
                var data = handlerApi.handleAll(node, serialize);
                res = (0, common_1.AddToAsciiData)(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
            }
            return res;
        }
        catch (e) {
            console.error('mml => mover =>', e);
            return res;
        }
    };
};
var munder = function (handlerApi) {
    return function (node, serialize) {
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : null;
            var secondChild = node.childNodes[1] ? node.childNodes[1] : null;
            var dataFirstChild = firstChild ? serialize.visitNode(firstChild, '') : null;
            var dataSecondChild = secondChild ? serialize.visitNode(secondChild, '') : null;
            if (secondChild && secondChild.kind === 'mo') {
                var t = dataSecondChild.ascii;
                var asc = (0, exports.FindSymbolToAM)(node.kind, t);
                if (asc) {
                    res = (0, common_1.AddToAsciiData)(res, [asc + '(']);
                    res = (0, common_1.AddToAsciiData)(res, [
                        dataFirstChild ? dataFirstChild.ascii : '',
                        dataFirstChild ? dataFirstChild.ascii_tsv : '',
                        dataFirstChild ? dataFirstChild.ascii_csv : '',
                        dataFirstChild ? dataFirstChild.ascii_md : ''
                    ]);
                    res = (0, common_1.AddToAsciiData)(res, [asc + ')']);
                }
                else {
                    var data = handlerApi.handleAll(node, serialize);
                    res = (0, common_1.AddToAsciiData)(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
                }
            }
            else {
                res = (0, common_1.AddToAsciiData)(res, [
                    dataFirstChild ? dataFirstChild.ascii : '',
                    dataFirstChild ? dataFirstChild.ascii_tsv : '',
                    dataFirstChild ? dataFirstChild.ascii_csv : '',
                    dataFirstChild ? dataFirstChild.ascii_md : ''
                ]);
                res = (0, common_1.AddToAsciiData)(res, ['_']);
                res = (0, common_1.AddToAsciiData)(res, [serialize.options.extraBrackets ? '(' : '']);
                res = (0, common_1.AddToAsciiData)(res, [
                    dataSecondChild ? dataSecondChild.ascii : '',
                    dataSecondChild ? dataSecondChild.ascii_tsv : '',
                    dataSecondChild ? dataSecondChild.ascii_csv : '',
                    dataSecondChild ? dataSecondChild.ascii_md : ''
                ]);
                res = (0, common_1.AddToAsciiData)(res, [serialize.options.extraBrackets ? ')' : '']);
            }
            return res;
        }
        catch (e) {
            console.error('mml => munder =>', e);
            return res;
        }
    };
};
var munderover = function () {
    return function (node, serialize) {
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : null;
            var secondChild = node.childNodes[1] ? node.childNodes[1] : null;
            var thirdChild = node.childNodes[2] ? node.childNodes[2] : null;
            var dataFirstChild = firstChild ? serialize.visitNode(firstChild, '') : null;
            var dataSecondChild = secondChild ? serialize.visitNode(secondChild, '') : null;
            var dataThirdChild = thirdChild ? serialize.visitNode(thirdChild, '') : null;
            res = (0, common_1.AddToAsciiData)(res, [
                dataFirstChild.ascii ? dataFirstChild.ascii : '',
                dataFirstChild.ascii_tsv ? dataFirstChild.ascii_tsv : '',
                dataFirstChild.ascii_csv ? dataFirstChild.ascii_csv : '',
                dataFirstChild.ascii_md ? dataFirstChild.ascii_md : ''
            ]);
            res = (0, common_1.AddToAsciiData)(res, ['_']);
            res = (0, common_1.AddToAsciiData)(res, [serialize.options.extraBrackets ? '(' : '']);
            res = (0, common_1.AddToAsciiData)(res, [
                dataSecondChild.ascii ? dataSecondChild.ascii : '',
                dataSecondChild.ascii_tsv ? dataSecondChild.ascii_tsv : '',
                dataSecondChild.ascii_csv ? dataSecondChild.ascii_csv : '',
                dataSecondChild.ascii_md ? dataSecondChild.ascii_md : ''
            ]);
            res = (0, common_1.AddToAsciiData)(res, [serialize.options.extraBrackets ? ')' : '']);
            res = (0, common_1.AddToAsciiData)(res, ['^']);
            res = (0, common_1.AddToAsciiData)(res, [serialize.options.extraBrackets ? '(' : '']);
            res = (0, common_1.AddToAsciiData)(res, [
                dataThirdChild.ascii ? dataThirdChild.ascii : '',
                dataThirdChild.ascii_tsv ? dataThirdChild.ascii_tsv : '',
                dataThirdChild.ascii_csv ? dataThirdChild.ascii_csv : '',
                dataThirdChild.ascii_md ? dataThirdChild.ascii_md : ''
            ]);
            res = (0, common_1.AddToAsciiData)(res, [serialize.options.extraBrackets ? ')' : '']);
            return res;
        }
        catch (e) {
            console.error('mml => munderover =>', e);
            return res;
        }
    };
};
var msub = function () {
    return function (node, serialize) {
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : null;
            var secondChild = node.childNodes[1] ? node.childNodes[1] : null;
            var dataFirstChild = firstChild ? serialize.visitNode(firstChild, '') : null;
            var dataSecondChild = secondChild ? serialize.visitNode(secondChild, '') : null;
            res = (0, common_1.AddToAsciiData)(res, [
                dataFirstChild ? dataFirstChild.ascii : '',
                dataFirstChild ? dataFirstChild.ascii_tsv : '',
                dataFirstChild ? dataFirstChild.ascii_csv : '',
                dataFirstChild ? dataFirstChild.ascii_md : ''
            ]);
            res = (0, common_1.AddToAsciiData)(res, ['_']);
            res = (0, common_1.AddToAsciiData)(res, [serialize.options.extraBrackets ? '(' : '']);
            res = (0, common_1.AddToAsciiData)(res, [
                dataSecondChild ? dataSecondChild.ascii : '',
                dataSecondChild ? dataSecondChild.ascii_tsv : '',
                dataSecondChild ? dataSecondChild.ascii_csv : '',
                dataSecondChild ? dataSecondChild.ascii_md : ''
            ]);
            res = (0, common_1.AddToAsciiData)(res, [serialize.options.extraBrackets ? ')' : '']);
            return res;
        }
        catch (e) {
            console.error('mml => msub =>', e);
            return res;
        }
    };
};
var msup = function () {
    return function (node, serialize) {
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : null;
            var secondChild = node.childNodes[1] ? node.childNodes[1] : null;
            var flattenSup = (0, common_1.hasOnlyOneMoNode)(secondChild);
            secondChild.attributes.setInherited('flattenSup', flattenSup);
            var dataFirstChild = firstChild ? serialize.visitNode(firstChild, '') : null;
            var dataSecondChild = secondChild ? serialize.visitNode(secondChild, '') : null;
            res = (0, common_1.AddToAsciiData)(res, [
                dataFirstChild ? dataFirstChild.ascii : '',
                dataFirstChild ? dataFirstChild.ascii_tsv : '',
                dataFirstChild ? dataFirstChild.ascii_csv : '',
                dataFirstChild ? dataFirstChild.ascii_md : ''
            ]);
            res = (0, common_1.AddToAsciiData)(res, ['^']);
            var ignoreBrackets = node.attributes.get('ignoreBrackets');
            if (ignoreBrackets && !dataSecondChild.ascii) {
                return res;
            }
            res = (0, common_1.AddToAsciiData)(res, [serialize.options.extraBrackets ? '(' : '']);
            res = (0, common_1.AddToAsciiData)(res, [
                dataSecondChild ? dataSecondChild.ascii : '',
                dataSecondChild ? dataSecondChild.ascii_tsv : '',
                dataSecondChild ? dataSecondChild.ascii_csv : '',
                dataSecondChild ? dataSecondChild.ascii_md : ''
            ]);
            res = (0, common_1.AddToAsciiData)(res, [serialize.options.extraBrackets ? ')' : '']);
            return res;
        }
        catch (e) {
            console.error('mml => msup =>', e);
            return res;
        }
    };
};
var msubsup = function () {
    return function (node, serialize) {
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : null;
            var secondChild = node.childNodes[1] ? node.childNodes[1] : null;
            var thirdChild = node.childNodes[2] ? node.childNodes[2] : null;
            var dataFirstChild = firstChild ? serialize.visitNode(firstChild, '') : null;
            var dataSecondChild = secondChild ? serialize.visitNode(secondChild, '') : null;
            var dataThirdChild = thirdChild ? serialize.visitNode(thirdChild, '') : null;
            res = (0, common_1.AddToAsciiData)(res, [
                dataFirstChild ? dataFirstChild.ascii : '',
                dataFirstChild ? dataFirstChild.ascii_tsv : '',
                dataFirstChild ? dataFirstChild.ascii_csv : '',
                dataFirstChild ? dataFirstChild.ascii_md : ''
            ]);
            res = (0, common_1.AddToAsciiData)(res, ['_']);
            res = (0, common_1.AddToAsciiData)(res, ['(']);
            res = (0, common_1.AddToAsciiData)(res, [
                dataSecondChild ? dataSecondChild.ascii : '',
                dataSecondChild ? dataSecondChild.ascii_tsv : '',
                dataSecondChild ? dataSecondChild.ascii_csv : '',
                dataSecondChild ? dataSecondChild.ascii_md : ''
            ]);
            res = (0, common_1.AddToAsciiData)(res, [')']);
            res = (0, common_1.AddToAsciiData)(res, ['^']);
            res = (0, common_1.AddToAsciiData)(res, ['(']);
            res = (0, common_1.AddToAsciiData)(res, [
                dataThirdChild ? dataThirdChild.ascii : '',
                dataThirdChild ? dataThirdChild.ascii_tsv : '',
                dataThirdChild ? dataThirdChild.ascii_csv : '',
                dataThirdChild ? dataThirdChild.ascii_md : ''
            ]);
            res = (0, common_1.AddToAsciiData)(res, [')']);
            return res;
        }
        catch (e) {
            console.error('mml => msubsup =>', e);
            return res;
        }
    };
};
var msqrt = function () {
    return function (node, serialize) {
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : null;
            var dataFirstChild = firstChild ? serialize.visitNode(firstChild, '') : null;
            res = (0, common_1.AddToAsciiData)(res, ['sqrt']);
            res = (0, common_1.AddToAsciiData)(res, [
                dataFirstChild ? dataFirstChild.ascii : '',
                dataFirstChild ? dataFirstChild.ascii_tsv : '',
                dataFirstChild ? dataFirstChild.ascii_csv : '',
                dataFirstChild ? dataFirstChild.ascii_md : ''
            ]);
            return res;
        }
        catch (e) {
            console.error('mml => msqrt =>', e);
            return res;
        }
    };
};
var mroot = function () {
    return function (node, serialize) {
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : null;
            var secondChild = node.childNodes[1] ? node.childNodes[1] : null;
            var dataSecondChild = secondChild ? serialize.visitNode(secondChild, '') : null;
            var dataFirstChild = firstChild ? serialize.visitNode(firstChild, '') : null;
            res = (0, common_1.AddToAsciiData)(res, ['root']);
            res = (0, common_1.AddToAsciiData)(res, [secondChild ? '(' : '']);
            res = (0, common_1.AddToAsciiData)(res, [
                dataSecondChild ? dataSecondChild.ascii : '',
                dataSecondChild ? dataSecondChild.ascii_tsv : '',
                dataSecondChild ? dataSecondChild.ascii_csv : '',
                dataSecondChild ? dataSecondChild.ascii_md : ''
            ]);
            res = (0, common_1.AddToAsciiData)(res, [secondChild ? ')' : '']);
            res = (0, common_1.AddToAsciiData)(res, [firstChild ? '(' : '']);
            res = (0, common_1.AddToAsciiData)(res, [
                dataFirstChild ? dataFirstChild.ascii : '',
                dataFirstChild ? dataFirstChild.ascii_tsv : '',
                dataFirstChild ? dataFirstChild.ascii_csv : '',
                dataFirstChild ? dataFirstChild.ascii_md : ''
            ]);
            res = (0, common_1.AddToAsciiData)(res, [firstChild ? ')' : '']);
            return res;
        }
        catch (e) {
            console.error('mml => mroot =>', e);
            return res;
        }
    };
};
var mfrac = function () {
    return function (node, serialize) {
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : null;
            var secondChild = node.childNodes[1] ? node.childNodes[1] : null;
            var dataFirstChild = firstChild ? serialize.visitNode(firstChild, '') : null;
            var dataSecondChild = secondChild ? serialize.visitNode(secondChild, '') : null;
            if ((firstChild && firstChild.kind === "mrow" && firstChild.childNodes.length > 1) || serialize.options.extraBrackets) {
                res = (0, common_1.AddToAsciiData)(res, ['(']);
                res = (0, common_1.AddToAsciiData)(res, [
                    dataFirstChild ? dataFirstChild.ascii : '',
                    dataFirstChild ? dataFirstChild.ascii_tsv : '',
                    dataFirstChild ? dataFirstChild.ascii_csv : '',
                    dataFirstChild ? dataFirstChild.ascii_md : ''
                ]);
                res = (0, common_1.AddToAsciiData)(res, [')']);
            }
            else {
                res = (0, common_1.AddToAsciiData)(res, [
                    dataFirstChild ? dataFirstChild.ascii : '',
                    dataFirstChild ? dataFirstChild.ascii_tsv : '',
                    dataFirstChild ? dataFirstChild.ascii_csv : '',
                    dataFirstChild ? dataFirstChild.ascii_md : ''
                ]);
            }
            res = (0, common_1.AddToAsciiData)(res, ['/']);
            if ((secondChild && secondChild.kind === "mrow" && secondChild.childNodes.length > 1) || serialize.options.extraBrackets) {
                res = (0, common_1.AddToAsciiData)(res, ['(']);
                res = (0, common_1.AddToAsciiData)(res, [
                    dataSecondChild ? dataSecondChild.ascii : '',
                    dataSecondChild ? dataSecondChild.ascii_tsv : '',
                    dataSecondChild ? dataSecondChild.ascii_csv : '',
                    dataSecondChild ? dataSecondChild.ascii_md : ''
                ]);
                res = (0, common_1.AddToAsciiData)(res, [')']);
            }
            else {
                res = (0, common_1.AddToAsciiData)(res, [
                    dataSecondChild ? dataSecondChild.ascii : '',
                    dataSecondChild ? dataSecondChild.ascii_tsv : '',
                    dataSecondChild ? dataSecondChild.ascii_csv : '',
                    dataSecondChild ? dataSecondChild.ascii_md : ''
                ]);
            }
            return res;
        }
        catch (e) {
            console.error('mml => mfrac =>', e);
            return res;
        }
    };
};
var mtext = function () {
    return function (node, serialize) {
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            if (!node.childNodes || node.childNodes.length === 0) {
                return res;
            }
            var firstChild = node.childNodes[0];
            var value = (0, exports.FindSymbolReplace)(firstChild.text);
            var asc = (0, exports.FindSymbolToAM)(node.kind, value);
            if (asc) {
                res = (0, common_1.AddToAsciiData)(res, [asc]);
                return res;
            }
            var toTsv = node.attributes.get('toTsv');
            var toCsv = node.attributes.get('toCsv');
            var toMd = node.attributes.get('toMd');
            if (value[0] === '(' || toTsv || toCsv || toMd) {
                res = (0, common_1.AddToAsciiData)(res, [
                    value[0] === '(' ? value.replace(/"/g, '') : value,
                    toTsv ? value.replace(/"/g, '') : value,
                    toCsv ? value.replace(/"/g, '') : value,
                    value
                ]);
            }
            else {
                if (!value || (value && !value.trim())) {
                    res = (0, common_1.AddToAsciiData)(res, ['']);
                }
                else {
                    /** For tsv/csv:
                     * Omit the " in nested arrays */
                    res = (0, common_1.AddToAsciiData)(res, [
                        '"' + value + '"',
                        serialize.options.tableToTsv
                            ? value.replace(/"/g, '')
                            : '"' + value + '"',
                        serialize.options.tableToCsv
                            ? value.replace(/"/g, '')
                            : value,
                        value
                    ]);
                }
            }
            return res;
        }
        catch (e) {
            console.error('mml => mtext =>', e);
            return res;
        }
    };
};
var mi = function () {
    return function (node, serialize) {
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            if (!node.childNodes || node.childNodes.length === 0) {
                return res;
            }
            var firstChild = node.childNodes[0];
            var value = firstChild.text;
            var atr = serialize.options.showStyle
                ? (0, exports.getAttributes)(node)
                : null;
            var abs = (0, exports.SymbolToAM)(node.kind, value, atr);
            if (abs && abs.length > 1 && regW.test(abs[0])) {
                var isFunction = helperA_1.regExpIsFunction.test(abs.trim());
                if (isFunction) {
                    node.Parent.attributes.setInherited('isFunction', isFunction);
                }
                res = (0, common_1.AddToAsciiData)(res, [(0, exports.needFirstSpace)(node) ? ' ' : '']);
                res = (0, common_1.AddToAsciiData)(res, [abs]);
                var hasLastSpace = needLastSpace(node, isFunction);
                node.attributes.setInherited('hasLastSpace', hasLastSpace);
                res = (0, common_1.AddToAsciiData)(res, [hasLastSpace ? ' ' : '']);
            }
            else {
                res = (0, common_1.AddToAsciiData)(res, [abs]);
            }
            return res;
        }
        catch (e) {
            console.error('mml => mi =>', e);
            return res;
        }
    };
};
var mo = function () {
    return function (node, serialize) {
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            var value = getChildrenText(node);
            var flattenSup = node.attributes.get('flattenSup');
            if (flattenSup && value === '\u2227' /*wedge*/) {
                node.Parent.attributes.setInherited('ignoreBrackets', true);
                return res;
            }
            if (value === '\u2061') {
                return res;
            }
            var atr = (0, exports.getAttributes)(node);
            var abs = (0, exports.SymbolToAM)(node.kind, value, atr, serialize.options.showStyle);
            if (abs && abs.length > 1) {
                res = (0, common_1.AddToAsciiData)(res, [regW.test(abs[0]) && (0, exports.needFirstSpace)(node) ? ' ' : '']);
                res = (0, common_1.AddToAsciiData)(res, [abs]);
                var hasLastSpace = regW.test(abs[abs.length - 1]) && needLastSpace(node);
                node.attributes.setInherited('hasLastSpace', hasLastSpace);
                res = (0, common_1.AddToAsciiData)(res, [hasLastSpace ? ' ' : '']);
            }
            else {
                if (abs === "―" && node.Parent.kind === "munder") {
                    abs = "_";
                }
                if (abs === ',' && (node.Parent.kind === 'mtd' || (node.Parent.kind === 'TeXAtom' && node.Parent.Parent.kind === 'mtd'))) {
                    /** For tsv/csv:
                     * Omit the " in nested arrays */
                    res = (0, common_1.AddToAsciiData)(res, [
                        '"' + abs + '"',
                        "".concat(serialize.options.tableToTsv ? abs : '"' + abs + '"'),
                        abs,
                        abs
                    ]);
                }
                else {
                    res = (0, common_1.AddToAsciiData)(res, [
                        abs,
                        abs === '"' ? '' : abs,
                        abs === '"' ? '' : abs,
                        abs
                    ]);
                }
            }
            if (node.Parent && node.Parent.kind === "mpadded" && node.Parent.Parent && node.Parent.Parent.kind === "menclose") {
                var atr_1 = (0, exports.getAttributes)(node.Parent.Parent);
                if (atr_1.notation && atr_1.notation.toString().indexOf("bottom") !== -1) {
                    node.Parent.Parent.attributes.attributes.lcm = true;
                    return {
                        ascii: '',
                        ascii_tsv: '',
                        ascii_csv: '',
                        ascii_md: ''
                    };
                }
            }
            return res;
        }
        catch (e) {
            console.error('mml => mo =>', e);
            return res;
        }
    };
};
var mspace = function (handlerApi) {
    return function (node, serialize) {
        var _a, _b;
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            var atr = (0, exports.getAttributes)(node);
            if (atr && atr.width === "2em") {
                res = (0, common_1.AddToAsciiData)(res, [node.parent.parent && (0, exports.needFirstSpace)(node.parent.parent) ? ' ' : '']);
                res = (0, common_1.AddToAsciiData)(res, ['qquad']);
                if ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.parent) {
                    var hasLastSpace = needLastSpace(node.parent.parent);
                    node.parent.parent.attributes.setInherited('hasLastSpace', hasLastSpace);
                    res = (0, common_1.AddToAsciiData)(res, [hasLastSpace ? ' ' : '']);
                }
                return res;
            }
            if (atr && atr.width === "1em") {
                res = (0, common_1.AddToAsciiData)(res, [node.parent.parent && (0, exports.needFirstSpace)(node.parent.parent) ? ' ' : '']);
                res = (0, common_1.AddToAsciiData)(res, ['quad']);
                if ((_b = node.parent) === null || _b === void 0 ? void 0 : _b.parent) {
                    var hasLastSpace = needLastSpace(node.parent.parent);
                    node.parent.parent.attributes.setInherited('hasLastSpace', hasLastSpace);
                    res = (0, common_1.AddToAsciiData)(res, [hasLastSpace ? ' ' : '']);
                }
                return res;
            }
            var data = handlerApi.handleAll(node, serialize);
            res = (0, common_1.AddToAsciiData)(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
            return res;
        }
        catch (e) {
            console.error('mml => mspace =>', e);
            return res;
        }
    };
};
var handle = function (node, serialize) {
    var handler = handlers[node.kind] || defHandle;
    return handler(node, serialize);
};
exports.handle = handle;
var handleAll = function (node, serialize) {
    var e_2, _a;
    var res = {
        ascii: '',
        ascii_tsv: '',
        ascii_csv: '',
        ascii_md: ''
    };
    try {
        try {
            for (var _b = tslib_1.__values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                var data = serialize.visitNode(child, '');
                res = (0, common_1.AddToAsciiData)(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return res;
    }
    catch (e) {
        console.error('mml => handleAll =>', e);
        return res;
    }
};
var handlerApi = {
    handle: exports.handle,
    handleAll: handleAll
};
var handlers = {
    mi: mi(),
    mo: mo(),
    mn: mo(),
    mfrac: mfrac(),
    msup: msup(),
    msub: msub(),
    msubsup: msubsup(),
    msqrt: msqrt(),
    mover: mover(handlerApi),
    munder: munder(handlerApi),
    munderover: munderover(),
    mspace: mspace(handlerApi),
    mtext: mtext(),
    mtable: mtable(),
    mrow: mrow(),
    mtr: mtr(),
    mpadded: mpadded(handlerApi),
    mroot: mroot(),
    menclose: menclose(handlerApi),
};
//# sourceMappingURL=handlers.js.map