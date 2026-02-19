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
// Serialize a tag label mtd as Typst content for use inside [...].
// mtext nodes → plain text, math nodes → $typst_math$.
// For simple tags like "(1.2)", returns "1.2" (stripped parens).
// For mixed tags like "($x\sqrt{5}$ 1.3.1)", returns "$x sqrt(5)$ 1.3.1".
var serializeTagContent = function (labelCell, serialize) {
    var e_1, _a;
    try {
        // Walk the children of the label mtd's content.
        // Simple tag: mtd > mtext("(1.2)")
        // Mixed tag: mtd > mrow > [mtext("("), mrow(math), mtext(" 1.3.1)")]
        var parts_1 = [];
        var visitChild_1 = function (child) {
            var e_2, _a, e_3, _b;
            var _c, _d, _f;
            if (!child)
                return;
            if (child.kind === 'mtext') {
                // Text node — emit as plain text
                var text = ((_d = (_c = child.childNodes) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.text) || '';
                if (text) {
                    parts_1.push(text.replace(/\u00A0/g, ' '));
                }
            }
            else if (child.isInferred) {
                // Inferred mrow — always recurse
                if (child.childNodes) {
                    try {
                        for (var _g = tslib_1.__values(child.childNodes), _h = _g.next(); !_h.done; _h = _g.next()) {
                            var c = _h.value;
                            visitChild_1(c);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_h && !_h.done && (_a = _g.return)) _a.call(_g);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
            else if (child.kind === 'mrow' || child.kind === 'TeXAtom') {
                // Check if this group contains any mtext (mixed content) — recurse
                // Otherwise it's a pure math group — serialize as one $...$ block
                var hasMtext = (_f = child.childNodes) === null || _f === void 0 ? void 0 : _f.some(function (c) { var _a; return c && (c.kind === 'mtext' || (c.isInferred && ((_a = c.childNodes) === null || _a === void 0 ? void 0 : _a.some(function (cc) { return (cc === null || cc === void 0 ? void 0 : cc.kind) === 'mtext'; })))); });
                if (hasMtext) {
                    if (child.childNodes) {
                        try {
                            for (var _j = tslib_1.__values(child.childNodes), _k = _j.next(); !_k.done; _k = _j.next()) {
                                var c = _k.value;
                                visitChild_1(c);
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_k && !_k.done && (_b = _j.return)) _b.call(_j);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                    }
                }
                else {
                    // Pure math group — serialize whole thing
                    var data = serialize.visitNode(child, '');
                    var mathStr = data.typst.trim();
                    if (mathStr) {
                        parts_1.push('$' + mathStr + '$');
                    }
                }
            }
            else {
                // Math node — serialize and wrap in $...$
                var data = serialize.visitNode(child, '');
                var mathStr = data.typst.trim();
                if (mathStr) {
                    parts_1.push('$' + mathStr + '$');
                }
            }
        };
        if (labelCell.childNodes) {
            try {
                for (var _b = tslib_1.__values(labelCell.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    visitChild_1(child);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return parts_1.join('').trim();
    }
    catch (_e) {
        return '';
    }
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
            // Any word char or dot at end of previous Typst output needs separation
            return /[\w.]$/.test(prevTypst);
        }
        if (prev.kind === 'mn') {
            return true;
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
        var parentKind = node.parent && node.parent.kind;
        if (parentKind === 'msub' || parentKind === 'msup' || parentKind === 'msubsup'
            || parentKind === 'munderover' || parentKind === 'munder' || parentKind === 'mover') {
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
            // Any word char or dot at start of next Typst output needs separation
            return /^[\w.]/.test(nextTypst);
        }
        if (next && next.kind === 'mn') {
            return true;
        }
        return false;
    }
    catch (e) {
        return false;
    }
};
// Built-in Typst math function names — these are already rendered upright
// and should NOT be wrapped in upright()
var TYPST_MATH_OPERATORS = new Set([
    'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
    'arcsin', 'arccos', 'arctan',
    'sinh', 'cosh', 'tanh', 'coth',
    'exp', 'log', 'ln', 'lg',
    'det', 'dim', 'gcd', 'mod',
    'inf', 'sup', 'lim', 'liminf', 'limsup',
    'max', 'min', 'arg', 'deg', 'hom', 'ker',
    'Pr', 'tr',
]);
// Single uppercase letters that can use doubled-letter shorthand for \mathbb
var BB_SHORTHAND_LETTERS = new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
// --- MI handler: identifiers ---
var mi = function () {
    return function (node, _serialize) {
        var _a;
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
            var isKnownOperator = TYPST_MATH_OPERATORS.has(value);
            var typstValue = (0, typst_symbol_map_1.findTypstSymbol)(value);
            // \operatorname{name}: texClass=OP, multi-char, not built-in
            // Note: don't check !mathvariant — MathJax may set a default (e.g. "normal")
            if (node.texClass === MmlNode_1.TEXCLASS.OP && value.length > 1 && !isKnownOperator) {
                var parentKind = (_a = node.parent) === null || _a === void 0 ? void 0 : _a.kind;
                var isLimits = parentKind === 'munder' || parentKind === 'mover' || parentKind === 'munderover';
                if (isLimits) {
                    typstValue = 'op("' + value + '", limits: #true)';
                }
                else {
                    typstValue = 'op("' + value + '")';
                }
            }
            // \mathrm{d} → dif (differential operator shorthand, single-char d only)
            else if (mathvariant === 'normal' && value === 'd' && !isKnownSymbol) {
                typstValue = 'dif';
            }
            // \mathbb{R} → RR (doubled letter shorthand for single uppercase)
            else if (mathvariant === 'double-struck' && value.length === 1 && BB_SHORTHAND_LETTERS.has(value)) {
                typstValue = value + value;
            }
            // Apply font wrapping if mathvariant is set and not the default italic
            // Skip font wrapping for known symbols (e.g. \infty with mathvariant="normal")
            // Skip font wrapping for built-in Typst math operators (sin, cos, log, etc.)
            else if (mathvariant && mathvariant !== 'italic' && !isKnownSymbol && !isKnownOperator) {
                var fontFn = typst_symbol_map_1.typstFontMap.get(mathvariant);
                if (fontFn) {
                    // Multi-letter text needs quotes in Typst math (e.g. italic("word"), bold("text"))
                    var inner = value.length > 1 ? '"' + value + '"' : typstValue;
                    // \mathbf produces mathvariant="bold" which is upright bold in LaTeX
                    if (mathvariant === 'bold') {
                        typstValue = 'upright(bold(' + inner + '))';
                    }
                    else {
                        typstValue = fontFn + '(' + inner + ')';
                    }
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
                // Prevent Typst from interpreting "symbol(" as a function call
                // (e.g. "lt.eq(x)" would call lt.eq as a function)
                if (!spaceAfter && !inScript) {
                    try {
                        var idx = node.parent.childNodes.findIndex(function (item) { return item === node; });
                        var next = node.parent.childNodes[idx + 1];
                        if (next && next.kind === 'mo') {
                            var nt = getChildrenText(next);
                            if (nt === '(' || nt === '[')
                                spaceAfter = ' ';
                        }
                    }
                    catch (_e) { /* ignore */ }
                }
                res = (0, common_1.addToTypstData)(res, { typst: spaceBefore + typstValue + spaceAfter });
            }
            else if (!inScript && SPACED_OPERATORS.has(value)) {
                // Common binary/relational operators: add spaces
                res = (0, common_1.addToTypstData)(res, { typst: ' ' + typstValue + ' ' });
            }
            else if (!inScript && value === ',') {
                // Commas: add trailing space for readability
                res = (0, common_1.addToTypstData)(res, { typst: ', ' });
            }
            else if (value === '/') {
                // Escape slash: in Typst math, / creates a fraction; \/ is a literal slash
                res = (0, common_1.addToTypstData)(res, { typst: '\\/' });
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
            // Check for font variant (e.g. \mathbb{1})
            var atr = getAttributes(node);
            var mathvariant = (atr === null || atr === void 0 ? void 0 : atr.mathvariant) || '';
            if (mathvariant && mathvariant !== 'normal') {
                var fontFn = typst_symbol_map_1.typstFontMap.get(mathvariant);
                if (fontFn) {
                    res = (0, common_1.addToTypstData)(res, { typst: fontFn + '(' + value + ')' });
                    return res;
                }
            }
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
            // Check if this is a single symbol character with a known Typst mapping
            if (value.length === 1 && typst_symbol_map_1.typstSymbolMap.has(value)) {
                var typstValue = (0, typst_symbol_map_1.findTypstSymbol)(value);
                var spaceBefore = needSpaceBefore(node) ? ' ' : '';
                var spaceAfter = needSpaceAfter(node) ? ' ' : '';
                res = (0, common_1.addToTypstData)(res, { typst: spaceBefore + typstValue + spaceAfter });
                return res;
            }
            // In Typst math, text is wrapped in double quotes
            var textContent = '"' + value + '"';
            // Apply font wrapping if mathvariant is set (e.g. \textbf, \textit)
            var atr = getAttributes(node);
            var mathvariant = (atr === null || atr === void 0 ? void 0 : atr.mathvariant) || '';
            if (mathvariant && mathvariant !== 'normal') {
                var fontFn = typst_symbol_map_1.typstFontMap.get(mathvariant);
                if (fontFn) {
                    textContent = fontFn + '(' + textContent + ')';
                }
            }
            res = (0, common_1.addToTypstData)(res, { typst: textContent });
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
            // Check for linethickness=0 which indicates \binom (\choose)
            var atr = getAttributes(node);
            if (atr && (atr.linethickness === '0' || atr.linethickness === 0)) {
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
// Prime symbol → Typst ' shorthand mapping
var PRIME_SHORTHANDS = new Map([
    ['prime', "'"],
    ['prime.double', "''"],
    ['prime.triple', "'''"],
]);
// --- MSUP handler: superscripts ---
var msup = function () {
    return function (node, serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            var firstChild = node.childNodes[0] || null;
            var secondChild = node.childNodes[1] || null;
            var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
            var dataSecond = secondChild ? serialize.visitNode(secondChild, '') : (0, common_1.initTypstData)();
            var base = dataFirst.typst;
            var sup = dataSecond.typst.trim();
            // Empty base (e.g. LaTeX ^{x} with no preceding base): use empty
            // upright string as placeholder so Typst has a valid base for ^
            res = (0, common_1.addToTypstData)(res, { typst: base.trim() ? base : '""' });
            // Optimize prime symbols to Typst ' shorthand
            var primeShorthand = PRIME_SHORTHANDS.get(sup);
            if (primeShorthand) {
                res = (0, common_1.addToTypstData)(res, { typst: primeShorthand });
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: '^' });
                if ((0, common_1.needsParens)(sup)) {
                    res = (0, common_1.addToTypstData)(res, { typst: '(' + sup + ')' });
                }
                else {
                    res = (0, common_1.addToTypstData)(res, { typst: sup });
                }
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
            var base = dataFirst.typst;
            res = (0, common_1.addToTypstData)(res, { typst: base.trim() ? base : '""' });
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
            var base = dataFirst.typst;
            res = (0, common_1.addToTypstData)(res, { typst: base.trim() ? base : '""' });
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
// Typst symbols/functions that natively support limit placement (above/below).
// These don't need limits() wrapping in mover/munder fallback.
var TYPST_NATIVE_LIMIT_OPS = new Set(tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(TYPST_MATH_OPERATORS), false), [
    // Large operators (from symbol map) — excludes integrals since Typst
    // integrals default to scripts, not limits placement
    'sum', 'product',
    'product.co', 'union.big', 'inter.big',
    'dot.o.big', 'plus.o.big', 'times.o.big',
    'union.plus.big', 'union.sq.big',
    'or.big', 'and.big',
], false));
// Typst accent shorthand functions that can be called as fn(content).
// Accents NOT in this set must use the accent(content, symbol) form.
var TYPST_ACCENT_SHORTHANDS = new Set([
    'hat', 'tilde', 'acute', 'grave', 'macron', 'overline', 'underline',
    'breve', 'dot', 'diaer', 'caron', 'arrow', 'circle',
    'overbrace', 'underbrace', 'overbracket', 'underbracket',
]);
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
                    var content = dataFirst.typst.trim();
                    if (TYPST_ACCENT_SHORTHANDS.has(accentFn)) {
                        // Shorthand accent: fn(content)
                        res = (0, common_1.addToTypstData)(res, { typst: accentFn + '(' + content + ')' });
                    }
                    else {
                        // Non-shorthand accent: accent(content, symbol)
                        res = (0, common_1.addToTypstData)(res, { typst: 'accent(' + content + ', ' + accentFn + ')' });
                    }
                    return res;
                }
            }
            // Fallback: base^(over) or limits(base)^(over)
            // Use limits() for symbols that DON'T natively support limit placement.
            // Skip limits() when:
            // - Base is a known Typst operator/large operator that already places limits above
            // - Base output is from an accent/brace function that already accepts ^ labels
            var base = dataFirst.typst.trim();
            var over = dataSecond.typst.trim();
            if (over) {
                var baseIsNativeLimitOp = TYPST_NATIVE_LIMIT_OPS.has(base);
                var baseIsSpecialFn = /^(overbrace|underbrace|overline|underline|op)\(/.test(base);
                if (baseIsNativeLimitOp || baseIsSpecialFn) {
                    res = (0, common_1.addToTypstData)(res, { typst: base });
                }
                else {
                    res = (0, common_1.addToTypstData)(res, { typst: 'limits(' + base + ')' });
                }
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
                // Flip over-accents to under-accents when used in munder context
                if (accentFn === 'overline') {
                    accentFn = 'underline';
                }
                if (accentFn === 'overbrace') {
                    accentFn = 'underbrace';
                }
                if (accentFn) {
                    var content = dataFirst.typst.trim();
                    if (TYPST_ACCENT_SHORTHANDS.has(accentFn)) {
                        res = (0, common_1.addToTypstData)(res, { typst: accentFn + '(' + content + ')' });
                    }
                    else {
                        res = (0, common_1.addToTypstData)(res, { typst: 'accent(' + content + ', ' + accentFn + ')' });
                    }
                    return res;
                }
            }
            // Fallback: base_(under) or limits(base)_(under)
            var base = dataFirst.typst.trim();
            var under = dataSecond.typst.trim();
            if (under) {
                var baseIsNativeLimitOp = TYPST_NATIVE_LIMIT_OPS.has(base);
                var baseIsSpecialFn = /^(overbrace|underbrace|overline|underline|op)\(/.test(base);
                if (baseIsNativeLimitOp || baseIsSpecialFn) {
                    res = (0, common_1.addToTypstData)(res, { typst: base });
                }
                else {
                    res = (0, common_1.addToTypstData)(res, { typst: 'limits(' + base + ')' });
                }
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
            // Use limits() for non-operator bases (e.g. extensible arrows)
            var baseTrimmed = base.trim();
            var baseIsNativeLimitOp = TYPST_NATIVE_LIMIT_OPS.has(baseTrimmed);
            var baseIsSpecialFn = /^(overbrace|underbrace|overline|underline|op)\(/.test(baseTrimmed);
            if (baseIsNativeLimitOp || baseIsSpecialFn) {
                res = (0, common_1.addToTypstData)(res, { typst: base });
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: 'limits(' + baseTrimmed + ')' });
            }
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
// --- MMULTISCRIPTS handler: pre/post scripts via attach() ---
var mmultiscripts = function () {
    return function (node, serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            if (!node.childNodes || node.childNodes.length === 0)
                return res;
            // Parse mmultiscripts structure:
            // child[0] = base
            // child[1..prescriptsIdx-1] = post-scripts (pairs of sub, sup)
            // child[prescriptsIdx] = mprescripts
            // child[prescriptsIdx+1..] = pre-scripts (pairs of sub, sup)
            var base = node.childNodes[0];
            var baseData = serialize.visitNode(base, '');
            var baseTrimmed = baseData.typst.trim();
            var prescriptsIdx = -1;
            for (var i = 1; i < node.childNodes.length; i++) {
                if (node.childNodes[i].kind === 'mprescripts') {
                    prescriptsIdx = i;
                    break;
                }
            }
            // Collect post-scripts (pairs after base, before mprescripts)
            var postEnd = prescriptsIdx >= 0 ? prescriptsIdx : node.childNodes.length;
            var postSub = '';
            var postSup = '';
            for (var i = 1; i < postEnd; i += 2) {
                var subNode = node.childNodes[i];
                var supNode = node.childNodes[i + 1] || null;
                if (subNode && subNode.kind !== 'none') {
                    var d = serialize.visitNode(subNode, '');
                    if (d.typst.trim())
                        postSub = d.typst.trim();
                }
                if (supNode && supNode.kind !== 'none') {
                    var d = serialize.visitNode(supNode, '');
                    if (d.typst.trim())
                        postSup = d.typst.trim();
                }
            }
            // Collect pre-scripts (pairs after mprescripts)
            var preSub = '';
            var preSup = '';
            if (prescriptsIdx >= 0) {
                for (var i = prescriptsIdx + 1; i < node.childNodes.length; i += 2) {
                    var subNode = node.childNodes[i];
                    var supNode = node.childNodes[i + 1] || null;
                    if (subNode && subNode.kind !== 'none') {
                        var d = serialize.visitNode(subNode, '');
                        if (d.typst.trim())
                            preSub = d.typst.trim();
                    }
                    if (supNode && supNode.kind !== 'none') {
                        var d = serialize.visitNode(supNode, '');
                        if (d.typst.trim())
                            preSup = d.typst.trim();
                    }
                }
            }
            var hasPrescripts = preSub || preSup;
            if (!hasPrescripts) {
                // No prescripts — use simple base_sub^sup syntax
                res = (0, common_1.addToTypstData)(res, { typst: baseTrimmed });
                if (postSub) {
                    res = (0, common_1.addToTypstData)(res, { typst: '_' });
                    if ((0, common_1.needsParens)(postSub)) {
                        res = (0, common_1.addToTypstData)(res, { typst: '(' + postSub + ')' });
                    }
                    else {
                        res = (0, common_1.addToTypstData)(res, { typst: postSub });
                    }
                }
                if (postSup) {
                    res = (0, common_1.addToTypstData)(res, { typst: '^' });
                    if ((0, common_1.needsParens)(postSup)) {
                        res = (0, common_1.addToTypstData)(res, { typst: '(' + postSup + ')' });
                    }
                    else {
                        res = (0, common_1.addToTypstData)(res, { typst: postSup });
                    }
                }
            }
            else {
                // Has prescripts — use attach(base, tl:, bl:, t:, b:)
                var parts = [];
                if (preSup)
                    parts.push('tl: ' + preSup);
                if (preSub)
                    parts.push('bl: ' + preSub);
                if (postSup)
                    parts.push('t: ' + postSup);
                if (postSub)
                    parts.push('b: ' + postSub);
                res = (0, common_1.addToTypstData)(res, {
                    typst: 'attach(' + baseTrimmed + ', ' + parts.join(', ') + ')'
                });
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
        case '\u2016': return '"\u2016"'; // double vertical bar ‖
        case '\u2225': return '"\u2016"'; // parallel → ‖
        default: return '"' + delim + '"';
    }
};
// Check if a node subtree (outside mphantom) contains an mo with the given text
var treeContainsMo = function (node, moText, skipPhantom) {
    var e_4, _a;
    if (skipPhantom === void 0) { skipPhantom = true; }
    if (!node)
        return false;
    if (skipPhantom && node.kind === 'mphantom')
        return false;
    if (node.kind === 'mo') {
        var text = getChildrenText(node);
        if (text === moText)
            return true;
    }
    if (node.childNodes) {
        try {
            for (var _b = tslib_1.__values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if (treeContainsMo(child, moText, skipPhantom))
                    return true;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
    }
    return false;
};
// Serialize all visible content in a node subtree up to (but not including)
// the first mo with the given text. Returns the serialized prefix.
var serializePrefixBeforeMo = function (node, serialize, stopMoText) {
    var e_5, _a;
    // Walk the mtd → inferredMrow → mpadded chain to find the flat math children
    var flatChildren = [];
    var extractFlat = function (n) {
        var e_6, _a;
        if (!n || !n.childNodes)
            return;
        if (n.kind === 'mphantom')
            return;
        if (n.kind === 'mtd' || n.kind === 'mpadded' || n.kind === 'mstyle' || n.isInferred) {
            try {
                for (var _b = tslib_1.__values(n.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    extractFlat(child);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        else {
            flatChildren.push(n);
        }
    };
    extractFlat(node);
    // Serialize children up to the stop mo
    var result = '';
    try {
        for (var flatChildren_1 = tslib_1.__values(flatChildren), flatChildren_1_1 = flatChildren_1.next(); !flatChildren_1_1.done; flatChildren_1_1 = flatChildren_1.next()) {
            var child = flatChildren_1_1.value;
            if (child.kind === 'mo' && getChildrenText(child) === stopMoText) {
                break;
            }
            var data = serialize.visitNode(child, '');
            result += data.typst;
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (flatChildren_1_1 && !flatChildren_1_1.done && (_a = flatChildren_1.return)) _a.call(flatChildren_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return result.trim();
};
// Extract explicit \tag{...} from a condition cell's mtext content.
// Returns the tag content (e.g. "3.12") or null if no \tag found.
var extractTagFromConditionCell = function (cell) {
    var walk = function (n) {
        var e_7, _a;
        var _b, _c;
        if (!n)
            return null;
        if (n.kind === 'mtext') {
            var text = ((_c = (_b = n.childNodes) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.text) || '';
            var match = text.match(/\\tag\{([^}]+)\}/);
            return match ? match[1] : null;
        }
        if (n.childNodes) {
            try {
                for (var _d = tslib_1.__values(n.childNodes), _f = _d.next(); !_f.done; _f = _d.next()) {
                    var child = _f.value;
                    var found = walk(child);
                    if (found)
                        return found;
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
        return null;
    };
    return walk(cell);
};
// Detect numcases/subnumcases pattern:
// - All rows are mlabeledtr with 4 children (label + prefix + value + condition)
// - First row's cell[1] contains a visible '{' mo (inside mpadded, outside mphantom)
var isNumcasesTable = function (node) {
    if (!node.childNodes || node.childNodes.length === 0)
        return false;
    var firstRow = node.childNodes[0];
    if (firstRow.kind !== 'mlabeledtr')
        return false;
    if (firstRow.childNodes.length < 4)
        return false;
    // Check that cell[1] (first data column) contains a '{' brace
    var prefixCell = firstRow.childNodes[1];
    return treeContainsMo(prefixCell, '{');
};
// --- MTABLE handler: matrices and equation arrays ---
var mtable = function () {
    return function (node, serialize) {
        var e_8, _a;
        var _b, _c, _d, _f, _g, _h;
        var res = (0, common_1.initTypstData)();
        try {
            var countRow = node.childNodes.length;
            var envName = node.attributes.get('name');
            // Check for enclosing brackets from \left...\right (mrow parent with open/close)
            var parentMrow = ((_b = node.parent) === null || _b === void 0 ? void 0 : _b.kind) === 'mrow' ? node.parent : null;
            var branchOpen = ((_c = parentMrow === null || parentMrow === void 0 ? void 0 : parentMrow.properties) === null || _c === void 0 ? void 0 : _c.hasOwnProperty('open')) ? parentMrow.properties['open'] : '';
            var branchClose = ((_d = parentMrow === null || parentMrow === void 0 ? void 0 : parentMrow.properties) === null || _d === void 0 ? void 0 : _d.hasOwnProperty('close')) ? parentMrow.properties['close'] : '';
            // Determine if this is a cases environment
            var isCases = envName === 'cases' || (branchOpen === '{' && branchClose === '');
            // Detect numcases/subnumcases pattern
            var isNumcases = isNumcasesTable(node);
            // Determine if this is an equation array (align, gather, split, etc.)
            // Skip eqnArray detection for numcases — it should be treated as cases
            var isEqnArray = !isNumcases && !isCases && node.childNodes.length > 0
                && ((_f = node.childNodes[0].attributes) === null || _f === void 0 ? void 0 : _f.get('displaystyle'));
            if (isNumcases) {
                // numcases/subnumcases: build #grid() with cases + numbering column
                var firstRow = node.childNodes[0];
                var prefixCell = firstRow.childNodes[1]; // cell after label
                var prefix = serializePrefixBeforeMo(prefixCell, serialize, '{');
                // Scan condition cells for explicit \tag{...}
                var rowTags = [];
                for (var i = 0; i < countRow; i++) {
                    var mtrNode = node.childNodes[i];
                    var condCell = mtrNode.childNodes[mtrNode.childNodes.length - 1];
                    rowTags.push(extractTagFromConditionCell(condCell));
                }
                var hasExplicitTags = rowTags.some(function (t) { return t !== null; });
                // Build case rows from cell[2] (value) and cell[3] (condition)
                var caseRows = [];
                for (var i = 0; i < countRow; i++) {
                    var mtrNode = node.childNodes[i];
                    var startCol = mtrNode.kind === 'mlabeledtr' ? 2 : 1; // skip label + prefix
                    var cells = [];
                    for (var j = startCol; j < mtrNode.childNodes.length; j++) {
                        var mtdNode = mtrNode.childNodes[j];
                        var cellData = serialize.visitNode(mtdNode, '');
                        var trimmed = cellData.typst.trim();
                        // Strip \tag{...} from condition column (last column)
                        if (j === mtrNode.childNodes.length - 1 && rowTags[i]) {
                            trimmed = trimmed.replace(/\s*\\tag\{[^}]+\}/g, '');
                            trimmed = trimmed.replace(/\s+"$/g, '"');
                            trimmed = trimmed.trim();
                        }
                        if (trimmed)
                            cells.push(trimmed);
                    }
                    caseRows.push(cells.join(' & '));
                }
                var casesContent = 'cases(' + caseRows.join(', ') + ')';
                var mathContent = prefix ? prefix + ' ' + casesContent : casesContent;
                // Build tag entries for numbering column
                var tagEntries = [];
                for (var i = 0; i < countRow; i++) {
                    if (hasExplicitTags && rowTags[i]) {
                        tagEntries.push('[(' + rowTags[i] + ')]');
                    }
                    else {
                        tagEntries.push('context { counter(math.equation).step(); counter(math.equation).display("(1)") }');
                    }
                }
                // Build grid output
                var lines = [
                    '#grid(',
                    '  columns: (1fr, auto),',
                    '  math.equation(block: true, numbering: none, $ ' + mathContent + ' $),',
                    '  grid(',
                    '    row-gutter: 0.65em,',
                ];
                try {
                    for (var tagEntries_1 = tslib_1.__values(tagEntries), tagEntries_1_1 = tagEntries_1.next(); !tagEntries_1_1.done; tagEntries_1_1 = tagEntries_1.next()) {
                        var entry = tagEntries_1_1.value;
                        lines.push('    ' + entry + ',');
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (tagEntries_1_1 && !tagEntries_1_1.done && (_a = tagEntries_1.return)) _a.call(tagEntries_1);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
                lines.push('  ),');
                lines.push(')');
                res = (0, common_1.addToTypstData)(res, { typst: lines.join('\n') });
                return res;
            }
            // Build rows
            var rows = [];
            for (var i = 0; i < countRow; i++) {
                var mtrNode = node.childNodes[i];
                var countColl = ((_g = mtrNode.childNodes) === null || _g === void 0 ? void 0 : _g.length) || 0;
                // For mlabeledtr (numbered equation rows), the first child is the
                // equation number label — skip it so we only emit the math content
                var startCol = mtrNode.kind === 'mlabeledtr' ? 1 : 0;
                var cells = [];
                for (var j = startCol; j < countColl; j++) {
                    var mtdNode = mtrNode.childNodes[j];
                    var cellData = serialize.visitNode(mtdNode, '');
                    cells.push(cellData.typst.trim());
                }
                if (isEqnArray) {
                    // For equation arrays (align, gather, etc.), join cells with spaces
                    rows.push(cells.join(' '));
                }
                else if (isCases) {
                    // Cases: cells within a row joined with & for alignment
                    rows.push(cells.join(' & '));
                }
                else {
                    rows.push(cells.join(', '));
                }
            }
            if (isEqnArray) {
                // Check if any row has a tag (mlabeledtr)
                var hasAnyTag = node.childNodes.some(function (child) { return child.kind === 'mlabeledtr'; });
                if (hasAnyTag) {
                    // Emit each row as a separate block equation:
                    // - numbered rows → #math.equation(block: true, numbering: ..., $ ... $)
                    // - unnumbered rows → $ ... $
                    var eqnBlocks = [];
                    for (var i = 0; i < countRow; i++) {
                        var mtrNode = node.childNodes[i];
                        var rowContent = rows[i];
                        if (mtrNode.kind === 'mlabeledtr' && mtrNode.childNodes.length > 0) {
                            var labelCell = mtrNode.childNodes[0];
                            var tagContent = serializeTagContent(labelCell, serialize);
                            if (tagContent) {
                                var isAutoNumber = !!((_h = labelCell.properties) === null || _h === void 0 ? void 0 : _h['data-tag-auto']);
                                var numbering = isAutoNumber
                                    ? '"(1)"'
                                    : 'n => [' + tagContent + ']';
                                eqnBlocks.push('#math.equation(block: true, numbering: ' + numbering + ', $ ' + rowContent + ' $)');
                            }
                            else {
                                eqnBlocks.push('$ ' + rowContent + ' $');
                            }
                        }
                        else {
                            eqnBlocks.push('$ ' + rowContent + ' $');
                        }
                    }
                    res = (0, common_1.addToTypstData)(res, { typst: eqnBlocks.join('\n') });
                }
                else {
                    // No tags at all (e.g. align*): emit as single block with \ separators
                    res = (0, common_1.addToTypstData)(res, { typst: rows.join(' \\\n') });
                }
            }
            else if (isCases) {
                // Cases environment
                res = (0, common_1.addToTypstData)(res, { typst: 'cases(' + rows.join(', ') + ')' });
            }
            else {
                // Matrix: mat(delim: ..., a, b; c, d)
                var matContent = rows.join('; ');
                // Parse array line attributes for augment parameter
                var columnlines = node.attributes.isSet('columnlines')
                    ? node.attributes.get('columnlines').split(' ')
                    : [];
                var rowlines = node.attributes.isSet('rowlines')
                    ? node.attributes.get('rowlines').split(' ')
                    : [];
                var frame = node.attributes.isSet('frame')
                    ? node.attributes.get('frame')
                    : '';
                var vlinePositions = [];
                for (var i = 0; i < columnlines.length; i++) {
                    if (columnlines[i] === 'solid' || columnlines[i] === 'dashed') {
                        vlinePositions.push(i + 1);
                    }
                }
                var hlinePositions = [];
                for (var i = 0; i < rowlines.length; i++) {
                    if (rowlines[i] === 'solid' || rowlines[i] === 'dashed') {
                        hlinePositions.push(i + 1);
                    }
                }
                // Build augment string
                var augmentStr = '';
                if (hlinePositions.length > 0 || vlinePositions.length > 0) {
                    var parts = [];
                    if (hlinePositions.length === 1) {
                        parts.push('hline: ' + hlinePositions[0]);
                    }
                    else if (hlinePositions.length > 1) {
                        parts.push('hline: (' + hlinePositions.join(', ') + ')');
                    }
                    if (vlinePositions.length === 1) {
                        parts.push('vline: ' + vlinePositions[0]);
                    }
                    else if (vlinePositions.length > 1) {
                        parts.push('vline: (' + vlinePositions.join(', ') + ')');
                    }
                    augmentStr = 'augment: #(' + parts.join(', ') + '), ';
                }
                // Build mat() parameters
                var params = [];
                var hasDelimiters = branchOpen || branchClose;
                if (hasDelimiters) {
                    if (branchOpen) {
                        params.push('delim: ' + delimiterToTypst(branchOpen));
                    }
                }
                else {
                    // Arrays/matrices without parent delimiters should not have parens
                    params.push('delim: #none');
                }
                if (augmentStr) {
                    params.push(augmentStr.slice(0, -2)); // remove trailing ", "
                }
                var paramStr = params.length > 0 ? params.join(', ') + ', ' : '';
                var matExpr = 'mat(' + paramStr + matContent + ')';
                if (frame === 'solid') {
                    res = (0, common_1.addToTypstData)(res, { typst: '#box(stroke: 0.5pt, inset: 3pt, $ ' + matExpr + ' $)' });
                }
                else {
                    res = (0, common_1.addToTypstData)(res, { typst: matExpr });
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
                // Serialize inner children, skipping the delimiter mo nodes
                // (delimiters are reconstructed from the open/close properties)
                var content = '';
                for (var i = 0; i < node.childNodes.length; i++) {
                    var child = node.childNodes[i];
                    // Skip opening delimiter mo (first child matching open property)
                    if (i === 0 && child.kind === 'mo') {
                        var moText = getChildrenText(child);
                        if (moText === openDelim || (!moText && !openDelim)) {
                            continue;
                        }
                    }
                    // Skip closing delimiter mo (last child matching close property)
                    if (i === node.childNodes.length - 1 && child.kind === 'mo') {
                        var moText = getChildrenText(child);
                        if (moText === closeDelim || (!moText && !closeDelim)) {
                            continue;
                        }
                    }
                    var data = serialize.visitNode(child, '');
                    // Insert space between adjacent word-char tokens to prevent merging
                    if (content && data.typst
                        && /^[\w."]/.test(data.typst)
                        && !/[\s({[,|]$/.test(content)) {
                        content += ' ';
                    }
                    content += data.typst;
                }
                // Map delimiter characters to Typst
                var open_1 = openDelim ? mapDelimiter(openDelim) : '';
                var close_1 = closeDelim ? mapDelimiter(closeDelim) : '';
                var hasVisibleOpen = !!open_1;
                var hasVisibleClose = !!close_1;
                if (hasVisibleOpen && hasVisibleClose) {
                    var trimmedContent = content.trim();
                    // Optimize common delimiter pairs to Typst functions
                    if (openDelim === '|' && closeDelim === '|') {
                        res = (0, common_1.addToTypstData)(res, { typst: 'norm(' + trimmedContent + ')' });
                    }
                    else if (openDelim === '\u230A' && closeDelim === '\u230B') {
                        // ⌊...⌋ → floor()
                        res = (0, common_1.addToTypstData)(res, { typst: 'floor(' + trimmedContent + ')' });
                    }
                    else if (openDelim === '\u2308' && closeDelim === '\u2309') {
                        // ⌈...⌉ → ceil()
                        res = (0, common_1.addToTypstData)(res, { typst: 'ceil(' + trimmedContent + ')' });
                    }
                    else {
                        // General lr() for auto-sizing
                        res = (0, common_1.addToTypstData)(res, { typst: 'lr(' + open_1 + ' ' + trimmedContent + ' ' + close_1 + ')' });
                    }
                }
                else {
                    // One or both delimiters invisible: emit directly without lr()
                    // (lr() requires balanced parens in Typst syntax)
                    var trimmed = content.trim();
                    if (hasVisibleOpen) {
                        res = (0, common_1.addToTypstData)(res, { typst: open_1 + ' ' + trimmed });
                    }
                    else if (hasVisibleClose) {
                        res = (0, common_1.addToTypstData)(res, { typst: trimmed + ' ' + close_1 });
                    }
                    else {
                        res = (0, common_1.addToTypstData)(res, { typst: trimmed });
                    }
                }
            }
            else if (isLeftRight && hasTableChild) {
                // Matrix/cases inside \left...\right: skip delimiter mo children
                // (the mtable handler uses the parent mrow's open/close properties for delimiters)
                for (var i = 0; i < node.childNodes.length; i++) {
                    var child = node.childNodes[i];
                    if (i === 0 && child.kind === 'mo') {
                        var moText = getChildrenText(child);
                        if (moText === openDelim || (!moText && !openDelim)) {
                            continue;
                        }
                    }
                    if (i === node.childNodes.length - 1 && child.kind === 'mo') {
                        var moText = getChildrenText(child);
                        if (moText === closeDelim || (!moText && !closeDelim)) {
                            continue;
                        }
                    }
                    var data = serialize.visitNode(child, '');
                    res = (0, common_1.addToTypstData)(res, data);
                }
            }
            else {
                // Check for OPEN/CLOSE mrow pattern wrapping a binom
                // MathJax represents \binom{n}{k} as mrow(ORD) > [mrow(OPEN), mfrac(linethickness=0), mrow(CLOSE)]
                // Since binom() in Typst already includes parens, skip the delimiter mrows
                if (node.childNodes.length === 3) {
                    var first = node.childNodes[0];
                    var middle = node.childNodes[1];
                    var last = node.childNodes[2];
                    if (middle.kind === 'mfrac') {
                        var midAtr = getAttributes(middle);
                        if (midAtr && (midAtr.linethickness === '0' || midAtr.linethickness === 0)
                            && first.texClass === MmlNode_1.TEXCLASS.OPEN
                            && last.texClass === MmlNode_1.TEXCLASS.CLOSE) {
                            // binom() in Typst already includes parentheses — skip OPEN/CLOSE wrappers
                            var data = serialize.visitNode(middle, '');
                            res = (0, common_1.addToTypstData)(res, data);
                            return res;
                        }
                    }
                }
                // Regular mrow: concatenate children with spacing to prevent merging
                for (var i = 0; i < node.childNodes.length; i++) {
                    var data = serialize.visitNode(node.childNodes[i], '');
                    if (res.typst && data.typst
                        && /^[\w."]/.test(data.typst)
                        && !/[\s({[,|]$/.test(res.typst)) {
                        res.typst += ' ';
                    }
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
// --- MPHANTOM handler: invisible content that preserves space ---
// Typst's hide() is the equivalent of LaTeX \phantom — renders content
// invisibly while preserving its dimensions.
var mphantom = function () {
    return function (node, serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            var data = handlerApi.handleAll(node, serialize);
            var content = data.typst.trim();
            if (content) {
                res = (0, common_1.addToTypstData)(res, { typst: '#hide($' + content + '$)' });
            }
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
            if (notation.indexOf('box') > -1) {
                // \boxed → #box with stroke
                res = (0, common_1.addToTypstData)(res, { typst: '#box(stroke: 0.5pt, inset: 3pt, $' + content + '$)' });
            }
            else if (notation.indexOf('updiagonalstrike') > -1 || notation.indexOf('downdiagonalstrike') > -1) {
                // \cancel uses updiagonalstrike (lower-left to upper-right) → Typst cancel() default
                // \bcancel uses downdiagonalstrike (upper-left to lower-right) → Typst cancel(inverted: true)
                if (notation.indexOf('downdiagonalstrike') > -1 && notation.indexOf('updiagonalstrike') === -1) {
                    res = (0, common_1.addToTypstData)(res, { typst: 'cancel(inverted: #true, ' + content + ')' });
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
    var e_9, _a;
    var res = (0, common_1.initTypstData)();
    try {
        try {
            for (var _b = tslib_1.__values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                var data = serialize.visitNode(child, '');
                res = (0, common_1.addToTypstData)(res, data);
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_9) throw e_9.error; }
        }
        return res;
    }
    catch (e) {
        return res;
    }
};
// --- MSTYLE handler: skip operator-internal spacing, pass through otherwise ---
var mstyle = function () {
    return function (node, serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            // MathJax wraps mstyle children in an inferredMrow.
            // Check if this mstyle only contains mspace nodes
            var children = node.childNodes || [];
            if (children.length === 1 && children[0].isInferred) {
                var innerChildren = children[0].childNodes || [];
                var hasOnlySpaces = innerChildren.length > 0
                    && innerChildren.every(function (child) { return child.kind === 'mspace'; });
                if (hasOnlySpaces) {
                    // Only skip if this is operator-internal spacing (e.g. around \oint)
                    // not explicit user spacing (e.g. \, \quad).
                    // Operator-internal mstyle nodes are nested inside TeXAtom chains;
                    // user spacing sits directly in the top-level inferredMrow.
                    var isOperatorSpacing = false;
                    var p = node.parent;
                    for (var d = 0; d < 10 && p; d++) {
                        if (p.kind === 'math')
                            break;
                        if (p.kind === 'TeXAtom') {
                            isOperatorSpacing = true;
                            break;
                        }
                        p = p.parent;
                    }
                    if (isOperatorSpacing) {
                        return res;
                    }
                }
            }
            // Handle mathcolor attribute (\color{red}{x})
            // Filter out MathJax internal "_inherit_" sentinel value
            var atr = getAttributes(node);
            var rawColor = (atr === null || atr === void 0 ? void 0 : atr.mathcolor) || '';
            var mathcolor = rawColor && rawColor !== '_inherit_' ? rawColor : '';
            var data = handlerApi.handleAll(node, serialize);
            if (mathcolor && data.typst.trim()) {
                res = (0, common_1.addToTypstData)(res, {
                    typst: '#text(fill: ' + mathcolor + ')[' + data.typst.trim() + ']'
                });
                return res;
            }
            return data;
        }
        catch (e) {
            return res;
        }
    };
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
    mmultiscripts: mmultiscripts(),
    mspace: mspace(),
    mtext: mtext(),
    mtable: mtable(),
    mrow: mrow(),
    mtr: mtr(),
    mpadded: mpadded(),
    mroot: mroot(),
    menclose: menclose(),
    mstyle: mstyle(),
    mphantom: mphantom(),
};
//# sourceMappingURL=handlers.js.map