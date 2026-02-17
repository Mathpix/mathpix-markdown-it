"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
var tslib_1 = require("tslib");
var MmlNode_1 = require("mathjax-full/js/core/MmlTree/MmlNode");
var common_1 = require("./common");
var typst_symbol_map_1 = require("./typst-symbol-map");
var node_utils_1 = require("./node-utils");
var INVISIBLE_CHARS = new Set([
    '\u2061',
    '\u2062',
    '\u2063',
    '\u2064', // invisible plus
]);
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
var getAttributes = function (node) {
    return node.attributes.getAllAttributes();
};
var defHandle = function (node, serialize) {
    return handlerApi.handleAll(node, serialize);
};
// Spacing helper: check if previous sibling ends with a word character
// and current node starts with a word character, requiring a space separator
var needSpaceBefore = function (node) {
    var _a;
    try {
        if ((0, node_utils_1.isFirstChild)(node)) {
            return false;
        }
        var index = node.parent.childNodes.findIndex(function (item) { return item === node; });
        var prev = node.parent.childNodes[index - 1];
        if (prev.kind === 'mi' || prev.kind === 'mo') {
            var text = ((_a = prev.childNodes[0]) === null || _a === void 0 ? void 0 : _a.text) || '';
            var prevTypst = (0, typst_symbol_map_1.findTypstSymbol)(text);
            return /\w$/.test(prevTypst);
        }
        return false;
    }
    catch (e) {
        return false;
    }
};
var needSpaceAfter = function (node) {
    var _a, _b;
    try {
        if ((0, node_utils_1.isLastChild)(node)) {
            return false;
        }
        if (node.parent && node.parent.kind === 'msubsup') {
            return false;
        }
        var index = node.parent.childNodes.findIndex(function (item) { return item === node; });
        var next = node.parent.childNodes[index + 1];
        // Skip invisible function application
        if (next && ((_a = next.childNodes[0]) === null || _a === void 0 ? void 0 : _a.text) === '\u2061' && !(0, node_utils_1.isLastChild)(next)) {
            next = node.parent.childNodes[index + 2];
        }
        if (next && (next.kind === 'mi' || next.kind === 'mo')) {
            var text = ((_b = next.childNodes[0]) === null || _b === void 0 ? void 0 : _b.text) || '';
            var nextTypst = (0, typst_symbol_map_1.findTypstSymbol)(text);
            return /^\w/.test(nextTypst);
        }
        return false;
    }
    catch (e) {
        return false;
    }
};
// --- MI handler: identifiers ---
var mi = function () {
    return function (node, _serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            if (!node.childNodes || node.childNodes.length === 0) {
                return res;
            }
            var firstChild = node.childNodes[0];
            var value = firstChild.text;
            if (!value) {
                return res;
            }
            var atr = getAttributes(node);
            var mathvariant = (atr === null || atr === void 0 ? void 0 : atr.mathvariant) || '';
            var isKnownSymbol = typst_symbol_map_1.typstSymbolMap.has(value);
            var typstValue = (0, typst_symbol_map_1.findTypstSymbol)(value);
            // Apply font wrapping if mathvariant is set and not the default italic
            // Skip font wrapping for known symbols (e.g. \infty with mathvariant="normal")
            if (mathvariant && mathvariant !== 'italic' && !isKnownSymbol) {
                var fontFn = typst_symbol_map_1.typstFontMap.get(mathvariant);
                if (fontFn) {
                    typstValue = fontFn + '(' + typstValue + ')';
                }
            }
            // Add spacing around multi-character Typst symbol names
            if (typstValue.length > 1 && /^\w/.test(typstValue)) {
                var spaceBefore = needSpaceBefore(node) ? ' ' : '';
                var spaceAfter = needSpaceAfter(node) ? ' ' : '';
                res = (0, common_1.addToTypstData)(res, { typst: spaceBefore + typstValue + spaceAfter });
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: typstValue });
            }
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// Operators that should have spaces around them for readability
var SPACED_OPERATORS = new Set([
    '+', '-', '=', '<', '>', '\u2212',
    '\u00B1',
    '\u2213', // ∓
]);
// --- MO handler: operators ---
var mo = function () {
    return function (node, _serialize) {
        var _a;
        var res = (0, common_1.initTypstData)();
        try {
            var value = getChildrenText(node);
            // Skip invisible operators
            if (INVISIBLE_CHARS.has(value)) {
                return res;
            }
            var typstValue = (0, typst_symbol_map_1.findTypstSymbol)(value);
            // Check if this operator is inside sub/sup/munderover — no spacing there
            var parentKind = (_a = node.parent) === null || _a === void 0 ? void 0 : _a.kind;
            var inScript = parentKind === 'msub' || parentKind === 'msup'
                || parentKind === 'msubsup' || parentKind === 'munderover';
            // Add spacing around operators for readability
            if (typstValue.length > 1 && /^\w/.test(typstValue)) {
                // Multi-char Typst symbol names: "times", "lt.eq", etc.
                var spaceBefore = needSpaceBefore(node) ? ' ' : '';
                var spaceAfter = needSpaceAfter(node) ? ' ' : '';
                res = (0, common_1.addToTypstData)(res, { typst: spaceBefore + typstValue + spaceAfter });
            }
            else if (!inScript && SPACED_OPERATORS.has(value)) {
                // Common binary/relational operators: add spaces
                res = (0, common_1.addToTypstData)(res, { typst: ' ' + typstValue + ' ' });
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: typstValue });
            }
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// --- MN handler: numbers ---
var mn = function () {
    return function (node, _serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            var value = getChildrenText(node);
            res = (0, common_1.addToTypstData)(res, { typst: value });
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// --- MTEXT handler: text content ---
var mtext = function () {
    return function (node, _serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            if (!node.childNodes || node.childNodes.length === 0) {
                return res;
            }
            var firstChild = node.childNodes[0];
            var value = firstChild.text;
            if (!value || !value.trim()) {
                return res;
            }
            // Replace non-breaking spaces with regular spaces
            value = value.replace(/\u00A0/g, ' ');
            // In Typst math, text is wrapped in double quotes
            res = (0, common_1.addToTypstData)(res, { typst: '"' + value + '"' });
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// --- MFRAC handler: fractions ---
var mfrac = function () {
    return function (node, serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            var firstChild = node.childNodes[0] || null;
            var secondChild = node.childNodes[1] || null;
            var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
            var dataSecond = secondChild ? serialize.visitNode(secondChild, '') : (0, common_1.initTypstData)();
            // Check for linethickness="0" which indicates \binom
            var atr = getAttributes(node);
            if (atr && atr.linethickness === '0') {
                res = (0, common_1.addToTypstData)(res, { typst: 'binom(' + dataFirst.typst.trim() + ', ' + dataSecond.typst.trim() + ')' });
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: 'frac(' + dataFirst.typst.trim() + ', ' + dataSecond.typst.trim() + ')' });
            }
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// --- MSUP handler: superscripts ---
var msup = function () {
    return function (node, serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            var firstChild = node.childNodes[0] || null;
            var secondChild = node.childNodes[1] || null;
            var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
            var dataSecond = secondChild ? serialize.visitNode(secondChild, '') : (0, common_1.initTypstData)();
            var sup = dataSecond.typst.trim();
            res = (0, common_1.addToTypstData)(res, { typst: dataFirst.typst });
            res = (0, common_1.addToTypstData)(res, { typst: '^' });
            if ((0, common_1.needsParens)(sup)) {
                res = (0, common_1.addToTypstData)(res, { typst: '(' + sup + ')' });
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: sup });
            }
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// --- MSUB handler: subscripts ---
var msub = function () {
    return function (node, serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            var firstChild = node.childNodes[0] || null;
            var secondChild = node.childNodes[1] || null;
            var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
            var dataSecond = secondChild ? serialize.visitNode(secondChild, '') : (0, common_1.initTypstData)();
            var sub = dataSecond.typst.trim();
            res = (0, common_1.addToTypstData)(res, { typst: dataFirst.typst });
            res = (0, common_1.addToTypstData)(res, { typst: '_' });
            if ((0, common_1.needsParens)(sub)) {
                res = (0, common_1.addToTypstData)(res, { typst: '(' + sub + ')' });
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: sub });
            }
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// --- MSUBSUP handler: combined subscript+superscript ---
var msubsup = function () {
    return function (node, serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            var firstChild = node.childNodes[0] || null;
            var secondChild = node.childNodes[1] || null;
            var thirdChild = node.childNodes[2] || null;
            var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
            var dataSecond = secondChild ? serialize.visitNode(secondChild, '') : (0, common_1.initTypstData)();
            var dataThird = thirdChild ? serialize.visitNode(thirdChild, '') : (0, common_1.initTypstData)();
            var sub = dataSecond.typst.trim();
            var sup = dataThird.typst.trim();
            res = (0, common_1.addToTypstData)(res, { typst: dataFirst.typst });
            res = (0, common_1.addToTypstData)(res, { typst: '_' });
            if ((0, common_1.needsParens)(sub)) {
                res = (0, common_1.addToTypstData)(res, { typst: '(' + sub + ')' });
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: sub });
            }
            res = (0, common_1.addToTypstData)(res, { typst: '^' });
            if ((0, common_1.needsParens)(sup)) {
                res = (0, common_1.addToTypstData)(res, { typst: '(' + sup + ')' });
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: sup });
            }
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// --- MSQRT handler: square root ---
var msqrt = function () {
    return function (node, serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            var firstChild = node.childNodes[0] || null;
            var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
            res = (0, common_1.addToTypstData)(res, { typst: 'sqrt(' + dataFirst.typst.trim() + ')' });
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// --- MROOT handler: nth root ---
var mroot = function () {
    return function (node, serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            // MathML mroot: child[0] = radicand, child[1] = index
            var radicand = node.childNodes[0] || null;
            var index = node.childNodes[1] || null;
            var dataRadicand = radicand ? serialize.visitNode(radicand, '') : (0, common_1.initTypstData)();
            var dataIndex = index ? serialize.visitNode(index, '') : (0, common_1.initTypstData)();
            // Typst root: root(index, radicand)
            res = (0, common_1.addToTypstData)(res, {
                typst: 'root(' + dataIndex.typst.trim() + ', ' + dataRadicand.typst.trim() + ')'
            });
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// --- MOVER handler: accents and overbrace ---
var mover = function () {
    return function (node, serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            var firstChild = node.childNodes[0] || null;
            var secondChild = node.childNodes[1] || null;
            var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
            var dataSecond = secondChild ? serialize.visitNode(secondChild, '') : (0, common_1.initTypstData)();
            if (secondChild && secondChild.kind === 'mo') {
                var accentChar = getChildrenText(secondChild);
                var accentFn = typst_symbol_map_1.typstAccentMap.get(accentChar);
                if (accentFn) {
                    // Known accent: use Typst accent function
                    res = (0, common_1.addToTypstData)(res, {
                        typst: accentFn + '(' + dataFirst.typst.trim() + ')'
                    });
                    return res;
                }
            }
            // Fallback: base^(over) — e.g. for stackrel/overset
            var base = dataFirst.typst.trim();
            var over = dataSecond.typst.trim();
            if (over) {
                res = (0, common_1.addToTypstData)(res, { typst: base });
                res = (0, common_1.addToTypstData)(res, { typst: '^' });
                if ((0, common_1.needsParens)(over)) {
                    res = (0, common_1.addToTypstData)(res, { typst: '(' + over + ')' });
                }
                else {
                    res = (0, common_1.addToTypstData)(res, { typst: over });
                }
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: base });
            }
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// --- MUNDER handler: under-accents and underbrace ---
var munder = function () {
    return function (node, serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            var firstChild = node.childNodes[0] || null;
            var secondChild = node.childNodes[1] || null;
            var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
            var dataSecond = secondChild ? serialize.visitNode(secondChild, '') : (0, common_1.initTypstData)();
            if (secondChild && secondChild.kind === 'mo') {
                var accentChar = getChildrenText(secondChild);
                var accentFn = typst_symbol_map_1.typstAccentMap.get(accentChar);
                if (accentFn) {
                    res = (0, common_1.addToTypstData)(res, {
                        typst: accentFn + '(' + dataFirst.typst.trim() + ')'
                    });
                    return res;
                }
            }
            // Fallback: base_(under)
            var base = dataFirst.typst.trim();
            var under = dataSecond.typst.trim();
            if (under) {
                res = (0, common_1.addToTypstData)(res, { typst: base });
                res = (0, common_1.addToTypstData)(res, { typst: '_' });
                if ((0, common_1.needsParens)(under)) {
                    res = (0, common_1.addToTypstData)(res, { typst: '(' + under + ')' });
                }
                else {
                    res = (0, common_1.addToTypstData)(res, { typst: under });
                }
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: base });
            }
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// --- MUNDEROVER handler: combined under+over (e.g. sum with limits) ---
var munderover = function () {
    return function (node, serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            var firstChild = node.childNodes[0] || null;
            var secondChild = node.childNodes[1] || null;
            var thirdChild = node.childNodes[2] || null;
            var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
            var dataSecond = secondChild ? serialize.visitNode(secondChild, '') : (0, common_1.initTypstData)();
            var dataThird = thirdChild ? serialize.visitNode(thirdChild, '') : (0, common_1.initTypstData)();
            var base = dataFirst.typst;
            var under = dataSecond.typst.trim();
            var over = dataThird.typst.trim();
            // Emit: base_(under)^(over)
            res = (0, common_1.addToTypstData)(res, { typst: base });
            if (under) {
                res = (0, common_1.addToTypstData)(res, { typst: '_' });
                if ((0, common_1.needsParens)(under)) {
                    res = (0, common_1.addToTypstData)(res, { typst: '(' + under + ')' });
                }
                else {
                    res = (0, common_1.addToTypstData)(res, { typst: under });
                }
            }
            if (over) {
                res = (0, common_1.addToTypstData)(res, { typst: '^' });
                if ((0, common_1.needsParens)(over)) {
                    res = (0, common_1.addToTypstData)(res, { typst: '(' + over + ')' });
                }
                else {
                    res = (0, common_1.addToTypstData)(res, { typst: over });
                }
            }
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// --- MSPACE handler: spacing commands ---
var mspace = function () {
    return function (node, _serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            var atr = getAttributes(node);
            if (!atr || !atr.width) {
                return res;
            }
            var width = atr.width.toString();
            // Map common MathML spacing widths to Typst spacing keywords
            if (width === '2em') {
                res = (0, common_1.addToTypstData)(res, { typst: ' wide ' });
            }
            else if (width === '1em') {
                res = (0, common_1.addToTypstData)(res, { typst: ' quad ' });
            }
            else if (width === '0.2778em' || width === '0.278em') {
                // \; or \: → medmathspace
                res = (0, common_1.addToTypstData)(res, { typst: ' med ' });
            }
            else if (width === '0.1667em' || width === '0.167em') {
                // \, → thinmathspace
                res = (0, common_1.addToTypstData)(res, { typst: ' thin ' });
            }
            else if (width === '-0.1667em' || width === '-0.167em') {
                // \! → negative thin space
                res = (0, common_1.addToTypstData)(res, { typst: ' negthin ' });
            }
            else if (width === '0.2222em' || width === '0.222em') {
                // \: → mediummathspace
                res = (0, common_1.addToTypstData)(res, { typst: ' med ' });
            }
            else {
                // Generic space fallback
                res = (0, common_1.addToTypstData)(res, { typst: ' ' });
            }
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// Delimiter mapping for matrix environments
var delimiterToTypst = function (delim) {
    switch (delim) {
        case '(': return '"("';
        case ')': return '")"';
        case '[': return '"["';
        case ']': return '"]"';
        case '{': return '"{"';
        case '}': return '"}"';
        case '|': return '"|"';
        case '\u2016': return '"‖"'; // double vertical bar
        case '\u2225': return '"‖"'; // parallel
        default: return '"' + delim + '"';
    }
};
// --- MTABLE handler: matrices and equation arrays ---
var mtable = function () {
    return function (node, serialize) {
        var _a, _b, _c, _d, _e;
        var res = (0, common_1.initTypstData)();
        try {
            var countRow = node.childNodes.length;
            var envName = node.attributes.get('name');
            // Check for enclosing brackets from \left...\right (mrow parent with open/close)
            var parentMrow = ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.kind) === 'mrow' ? node.parent : null;
            var branchOpen = ((_b = parentMrow === null || parentMrow === void 0 ? void 0 : parentMrow.properties) === null || _b === void 0 ? void 0 : _b.hasOwnProperty('open')) ? parentMrow.properties['open'] : '';
            var branchClose = ((_c = parentMrow === null || parentMrow === void 0 ? void 0 : parentMrow.properties) === null || _c === void 0 ? void 0 : _c.hasOwnProperty('close')) ? parentMrow.properties['close'] : '';
            // Determine if this is a cases environment
            var isCases = envName === 'cases' || (branchOpen === '{' && branchClose === '');
            // Determine if this is an equation array (align, gather, split, etc.)
            var isEqnArray = node.childNodes.length > 0
                && ((_d = node.childNodes[0].attributes) === null || _d === void 0 ? void 0 : _d.get('displaystyle'));
            // Build rows
            var rows = [];
            for (var i = 0; i < countRow; i++) {
                var mtrNode = node.childNodes[i];
                var countColl = ((_e = mtrNode.childNodes) === null || _e === void 0 ? void 0 : _e.length) || 0;
                var cells = [];
                for (var j = 0; j < countColl; j++) {
                    var mtdNode = mtrNode.childNodes[j];
                    var cellData = serialize.visitNode(mtdNode, '');
                    cells.push(cellData.typst.trim());
                }
                if (isEqnArray) {
                    // For equation arrays (align, gather, etc.), join cells with spaces
                    rows.push(cells.join(' '));
                }
                else {
                    rows.push(cells.join(', '));
                }
            }
            if (isEqnArray) {
                // Equation arrays: emit rows separated by newlines (\ in Typst math)
                res = (0, common_1.addToTypstData)(res, { typst: rows.join(' \\\n') });
            }
            else if (isCases) {
                // Cases environment
                res = (0, common_1.addToTypstData)(res, { typst: 'cases(' + rows.join(', ') + ')' });
            }
            else {
                // Matrix: mat(delim: ..., a, b; c, d)
                var matContent = rows.join('; ');
                if (branchOpen || branchClose) {
                    var delimStr = branchOpen ? 'delim: ' + delimiterToTypst(branchOpen) + ', ' : '';
                    res = (0, common_1.addToTypstData)(res, { typst: 'mat(' + delimStr + matContent + ')' });
                }
                else {
                    res = (0, common_1.addToTypstData)(res, { typst: 'mat(' + matContent + ')' });
                }
            }
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// --- MROW handler: grouped content, lr() for \left...\right ---
var mrow = function () {
    return function (node, serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            var props = node.properties || {};
            var hasOpen = props.hasOwnProperty('open');
            var hasClose = props.hasOwnProperty('close');
            var openDelim = hasOpen ? props['open'] : '';
            var closeDelim = hasClose ? props['close'] : '';
            // Check if this mrow has \left...\right delimiters
            var isLeftRight = (hasOpen || hasClose)
                && props.texClass === MmlNode_1.TEXCLASS.INNER;
            // If this mrow wraps a matrix, let mtable handle the delimiters
            var hasTableChild = node.childNodes.some(function (child) { return child.kind === 'mtable'; });
            if (isLeftRight && !hasTableChild) {
                // Use lr() for auto-sizing delimiters
                var content = '';
                for (var i = 0; i < node.childNodes.length; i++) {
                    var data = serialize.visitNode(node.childNodes[i], '');
                    content += data.typst;
                }
                // Map delimiter characters to Typst
                var open_1 = openDelim || '';
                var close_1 = closeDelim || '';
                // Handle invisible delimiters (empty string from \left. or \right.)
                if (hasOpen && !openDelim) {
                    open_1 = '#none';
                }
                if (hasClose && !closeDelim) {
                    close_1 = '#none';
                }
                // Map Unicode delimiters
                if (open_1) {
                    open_1 = mapDelimiter(open_1);
                }
                if (close_1) {
                    close_1 = mapDelimiter(close_1);
                }
                res = (0, common_1.addToTypstData)(res, { typst: 'lr(' + open_1 + ' ' + content.trim() + ' ' + close_1 + ')' });
            }
            else {
                // Regular mrow: just concatenate children
                for (var i = 0; i < node.childNodes.length; i++) {
                    var data = serialize.visitNode(node.childNodes[i], '');
                    res = (0, common_1.addToTypstData)(res, data);
                }
            }
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// Map delimiter characters to Typst representation
var mapDelimiter = function (delim) {
    var mapped = typst_symbol_map_1.typstSymbolMap.get(delim);
    if (mapped) {
        return mapped;
    }
    return delim;
};
// --- MTR handler: table row ---
var mtr = function () {
    return function (node, serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            for (var i = 0; i < node.childNodes.length; i++) {
                if (i > 0) {
                    res = (0, common_1.addToTypstData)(res, { typst: ', ' });
                }
                var data = serialize.visitNode(node.childNodes[i], '');
                res = (0, common_1.addToTypstData)(res, data);
            }
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// --- MPADDED handler: strip padding, emit content ---
var mpadded = function () {
    return function (node, serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            var data = handlerApi.handleAll(node, serialize);
            res = (0, common_1.addToTypstData)(res, data);
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// --- MENCLOSE handler: cancel, strikethrough ---
var menclose = function () {
    return function (node, serialize) {
        var _a;
        var res = (0, common_1.initTypstData)();
        try {
            var atr = getAttributes(node);
            var notation = ((_a = atr === null || atr === void 0 ? void 0 : atr.notation) === null || _a === void 0 ? void 0 : _a.toString()) || '';
            var data = handlerApi.handleAll(node, serialize);
            var content = data.typst.trim();
            if (notation.indexOf('updiagonalstrike') > -1 || notation.indexOf('downdiagonalstrike') > -1) {
                // \bcancel uses updiagonalstrike, \cancel uses downdiagonalstrike
                // In Typst: cancel(x) for \cancel, cancel(inverted: true, x) for \bcancel
                if (notation.indexOf('updiagonalstrike') > -1 && notation.indexOf('downdiagonalstrike') === -1) {
                    res = (0, common_1.addToTypstData)(res, { typst: 'cancel(inverted: true, ' + content + ')' });
                }
                else {
                    res = (0, common_1.addToTypstData)(res, { typst: 'cancel(' + content + ')' });
                }
            }
            else if (notation.indexOf('horizontalstrike') > -1) {
                res = (0, common_1.addToTypstData)(res, { typst: 'cancel(' + content + ')' });
            }
            else {
                // Unknown notation: pass through content
                res = (0, common_1.addToTypstData)(res, data);
            }
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// --- Handler dispatch ---
var handle = function (node, serialize) {
    var handler = handlers[node.kind] || defHandle;
    return handler(node, serialize);
};
exports.handle = handle;
var handleAll = function (node, serialize) {
    var e_1, _a;
    var res = (0, common_1.initTypstData)();
    try {
        try {
            for (var _b = tslib_1.__values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                var data = serialize.visitNode(child, '');
                res = (0, common_1.addToTypstData)(res, data);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return res;
    }
    catch (e) {
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
    mn: mn(),
    mfrac: mfrac(),
    msup: msup(),
    msub: msub(),
    msubsup: msubsup(),
    msqrt: msqrt(),
    mover: mover(),
    munder: munder(),
    munderover: munderover(),
    mspace: mspace(),
    mtext: mtext(),
    mtable: mtable(),
    mrow: mrow(),
    mtr: mtr(),
    mpadded: mpadded(),
    mroot: mroot(),
    menclose: menclose(),
};
//# sourceMappingURL=handlers.js.map