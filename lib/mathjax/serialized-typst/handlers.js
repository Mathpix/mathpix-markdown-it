"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = exports.markUnpairedBrackets = void 0;
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
/** Extract the original \label{} key from an mlabeledtr label cell.
 *  MathJax stores the id as "mjx-eqn:<label_key>" when useLabelIds is true. */
var getLabelKey = function (labelCell) {
    var _a;
    var key = (_a = labelCell === null || labelCell === void 0 ? void 0 : labelCell.properties) === null || _a === void 0 ? void 0 : _a['data-label-key'];
    return key ? String(key) : null;
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
            // Don't add limits: #true here — parent handler (munderover/munder/mover) decides placement.
            if (node.texClass === MmlNode_1.TEXCLASS.OP && value.length > 1 && !isKnownOperator) {
                typstValue = 'op("' + value + '")';
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
            // Skip font wrapping for known symbols with non-bold variants (e.g. \infty with mathvariant="normal")
            // Skip font wrapping for built-in Typst math operators (sin, cos, log, etc.)
            // Allow bold wrapping for known symbols (e.g. \boldsymbol{\alpha} → bold(alpha))
            // Skip font wrapping for escape-form symbols (\#, \$, \/, \√, \") — they break inside upright()
            else if (mathvariant && mathvariant !== 'italic' && !isKnownOperator
                && (!isKnownSymbol || mathvariant === 'bold' || mathvariant === 'bold-italic')
                && !(isKnownSymbol && typstValue.startsWith('\\'))) {
                var fontFn = typst_symbol_map_1.typstFontMap.get(mathvariant);
                if (fontFn) {
                    // Multi-letter text needs quotes in Typst math (e.g. italic("word"), bold("text"))
                    var inner = value.length > 1 && !isKnownSymbol ? '"' + value + '"' : typstValue;
                    // \mathbf produces mathvariant="bold" which is upright bold in LaTeX
                    if (mathvariant === 'bold' && !isKnownSymbol) {
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
        var _a, _b;
        var res = (0, common_1.initTypstData)();
        try {
            var value = getChildrenText(node);
            // EARLY: unpaired bracket → emit escaped delimiter
            var unpairedDir = (_a = node.properties) === null || _a === void 0 ? void 0 : _a['data-unpaired-bracket'];
            if (unpairedDir && UNPAIRED_BRACKET_TYPST[value]) {
                var spaceBefore = needSpaceBefore(node) ? ' ' : '';
                var spaceAfter = needSpaceAfter(node) ? ' ' : '';
                res = (0, common_1.addToTypstData)(res, { typst: spaceBefore + UNPAIRED_BRACKET_TYPST[value] + spaceAfter });
                return res;
            }
            // Skip invisible operators
            if (INVISIBLE_CHARS.has(value)) {
                return res;
            }
            var typstValue = (0, typst_symbol_map_1.findTypstSymbol)(value);
            // Map multi-word MathJax operator names to Typst built-in equivalents
            // (e.g. \limsup → "lim⁠sup" with thin space → "limsup")
            var normalizedValue = value.replace(/[\u2006\u2005\u2004\u2009\u200A\u00A0]/g, ' ');
            var mappedOp = MATHJAX_MULTIWORD_OPS.get(normalizedValue);
            if (mappedOp) {
                var spaceBefore = needSpaceBefore(node) ? ' ' : '';
                var spaceAfter = needSpaceAfter(node) ? ' ' : '';
                res = (0, common_1.addToTypstData)(res, { typst: spaceBefore + mappedOp + spaceAfter });
                return res;
            }
            // Detect custom named operators (e.g. \injlim → "inj lim", \projlim → "proj lim")
            // Don't add limits: #true here — parent handler (munderover/munder/mover) decides placement
            if (value.length > 1 && /^\w/.test(value) && !typst_symbol_map_1.typstSymbolMap.has(value) && !TYPST_MATH_OPERATORS.has(value)) {
                var opName = normalizedValue;
                res = (0, common_1.addToTypstData)(res, { typst: 'op("' + opName + '")' });
                return res;
            }
            // Check if this operator is inside sub/sup/munderover — no spacing there
            var parentKind = (_b = node.parent) === null || _b === void 0 ? void 0 : _b.kind;
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
                    var content = value || '""';
                    res = (0, common_1.addToTypstData)(res, { typst: fontFn + '(' + content + ')' });
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
            var num = dataFirst.typst.trim() || '""';
            var den = dataSecond.typst.trim() || '""';
            // Check for linethickness=0 which indicates \binom (\choose)
            var atr = getAttributes(node);
            if (atr && (atr.linethickness === '0' || atr.linethickness === 0)) {
                res = (0, common_1.addToTypstData)(res, { typst: 'binom(' + num + ', ' + den + ')' });
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: 'frac(' + num + ', ' + den + ')' });
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
// Regex to detect overbrace/overbracket/underbrace/underbracket as outermost call
var BRACE_ANNOTATION_RE = /^(overbrace|overbracket|underbrace|underbracket)\((.+)\)$/s;
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
            var baseTrimmed = base.trim();
            // overbrace/overbracket annotation: insert as second argument instead of ^
            if (sup) {
                var braceMatch = BRACE_ANNOTATION_RE.exec(baseTrimmed);
                if (braceMatch && (braceMatch[1] === 'overbrace' || braceMatch[1] === 'overbracket')) {
                    // braceMatch[2] already processed by accent handler — don't re-escape
                    res = (0, common_1.addToTypstData)(res, { typst: braceMatch[1] + '(' + braceMatch[2] + ', ' + escapeContentSeparators(sup) + ')' });
                    return res;
                }
            }
            // \nolimits: wrap known limit-type operators in scripts() to force side placement
            if (baseTrimmed && needsScriptsWrapper(baseTrimmed)) {
                res = (0, common_1.addToTypstData)(res, { typst: 'scripts(' + escapeContentSeparators(baseTrimmed) + ')' });
            }
            else {
                // Empty base (e.g. LaTeX ^{x} with no preceding base): use empty placeholder
                res = (0, common_1.addToTypstData)(res, { typst: baseTrimmed ? base : '""' });
            }
            // Skip empty superscript (e.g. LaTeX m^{} → just "m")
            if (sup) {
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
            var baseTrimmed = base.trim();
            // underbrace/underbracket annotation: insert as second argument instead of _
            if (sub) {
                var braceMatch = BRACE_ANNOTATION_RE.exec(baseTrimmed);
                if (braceMatch && (braceMatch[1] === 'underbrace' || braceMatch[1] === 'underbracket')) {
                    // braceMatch[2] already processed by accent handler — don't re-escape
                    res = (0, common_1.addToTypstData)(res, { typst: braceMatch[1] + '(' + braceMatch[2] + ', ' + escapeContentSeparators(sub) + ')' });
                    return res;
                }
            }
            // \nolimits: wrap known limit-type operators in scripts() to force side placement
            if (baseTrimmed && needsScriptsWrapper(baseTrimmed)) {
                res = (0, common_1.addToTypstData)(res, { typst: 'scripts(' + escapeContentSeparators(baseTrimmed) + ')' });
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: baseTrimmed ? base : '""' });
            }
            // Skip empty subscript (e.g. LaTeX m_{} → just "m")
            if (sub) {
                res = (0, common_1.addToTypstData)(res, { typst: '_' });
                if ((0, common_1.needsParens)(sub)) {
                    res = (0, common_1.addToTypstData)(res, { typst: '(' + sub + ')' });
                }
                else {
                    res = (0, common_1.addToTypstData)(res, { typst: sub });
                }
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
            var baseTrimmed = base.trim();
            // \nolimits: wrap known limit-type operators in scripts() to force side placement
            if (baseTrimmed && needsScriptsWrapper(baseTrimmed)) {
                res = (0, common_1.addToTypstData)(res, { typst: 'scripts(' + baseTrimmed + ')' });
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: baseTrimmed ? base : '""' });
            }
            // Skip empty subscript/superscript (e.g. LaTeX m_{}^{x} → just "m^x")
            if (sub) {
                res = (0, common_1.addToTypstData)(res, { typst: '_' });
                if ((0, common_1.needsParens)(sub)) {
                    res = (0, common_1.addToTypstData)(res, { typst: '(' + sub + ')' });
                }
                else {
                    res = (0, common_1.addToTypstData)(res, { typst: sub });
                }
            }
            if (sup) {
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
// --- MSQRT handler: square root ---
var msqrt = function () {
    return function (node, serialize) {
        var res = (0, common_1.initTypstData)();
        try {
            var firstChild = node.childNodes[0] || null;
            var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
            var content = escapeContentSeparators(dataFirst.typst.trim()) || '""';
            res = (0, common_1.addToTypstData)(res, { typst: 'sqrt(' + content + ')' });
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
            var radicandContent = escapeContentSeparators(dataRadicand.typst.trim()) || '""';
            // Typst root: root(index, radicand)
            res = (0, common_1.addToTypstData)(res, {
                typst: 'root(' + escapeContentSeparators(dataIndex.typst.trim()) + ', ' + radicandContent + ')'
            });
            return res;
        }
        catch (e) {
            return res;
        }
    };
};
// Multi-word MathJax operator names → Typst built-in operator names.
// MathJax uses thin space (U+2006) between words; we normalize before lookup.
var MATHJAX_MULTIWORD_OPS = new Map([
    ['lim sup', 'limsup'],
    ['lim inf', 'liminf'],
]);
// Operators that Typst places below/above in display mode by default.
// Used to detect \nolimits (when these appear in msubsup/msub/msup instead of munderover).
var TYPST_DISPLAY_LIMIT_OPS = new Set([
    // Named function operators with limits placement
    'lim', 'limsup', 'liminf', 'max', 'min', 'inf', 'sup',
    'det', 'gcd', 'Pr',
    // Large operators
    'sum', 'product', 'product.co',
    'union.big', 'inter.big',
    'dot.o.big', 'plus.o.big', 'times.o.big',
    'union.plus.big', 'union.sq.big',
    'or.big', 'and.big',
]);
/** Get movablelimits attribute from a node (typically the base mo of munderover) */
var getMovablelimits = function (node) {
    if (!node || node.kind !== 'mo')
        return undefined;
    try {
        var atr = getAttributes(node);
        return atr === null || atr === void 0 ? void 0 : atr.movablelimits;
    }
    catch (e) {
        return undefined;
    }
};
/** Build limit-placement base for munderover/munder/mover handlers.
 *  Returns ITypstData with potentially different block/inline bases for movablelimits. */
/**
 * Symbols that should use stretch() instead of limits() when used as the base
 * of mover/munder/munderover — extensible arrows, harpoons, and equal sign.
 * stretch() makes the symbol grow to fit its annotations, matching LaTeX's
 * \xrightarrow, \xleftarrow, \xlongequal, etc.
 */
var STRETCH_BASE_SYMBOLS = new Set([
    'arrow.r', 'arrow.l', 'arrow.l.r',
    'arrow.r.twohead', 'arrow.l.twohead',
    'arrow.r.bar',
    'arrow.r.hook', 'arrow.l.hook',
    'arrow.r.double', 'arrow.l.double', 'arrow.l.r.double',
    'harpoon.rt', 'harpoon.lb',
    'harpoons.rtlb', 'harpoons.ltrb',
    'arrows.rr',
    '=', // \xlongequal
]);
var buildLimitBase = function (firstChild, baseTrimmed, base) {
    var _a;
    var movablelimits = getMovablelimits(firstChild);
    var baseIsCustomOp = /^op\(/.test(baseTrimmed);
    // Extensible arrows/symbols: MathJax sets stretchy=true on the base mo.
    // Use stretch() for these (e.g. \xrightarrow), limits() for stacking (\stackrel, \overset).
    var isStretchy = false;
    if (STRETCH_BASE_SYMBOLS.has(baseTrimmed)) {
        // Find the inner mo node — MathJax may wrap in mstyle/inferredMrow
        var moNode = firstChild;
        for (var i = 0; i < 5 && moNode && moNode.kind !== 'mo'; i++) {
            if (((_a = moNode.childNodes) === null || _a === void 0 ? void 0 : _a.length) === 1) {
                moNode = moNode.childNodes[0];
            }
            else {
                break;
            }
        }
        if ((moNode === null || moNode === void 0 ? void 0 : moNode.kind) === 'mo') {
            try {
                var atr = getAttributes(moNode);
                isStretchy = (atr === null || atr === void 0 ? void 0 : atr.stretchy) === true;
            }
            catch (e) { /* ignore */ }
        }
    }
    var wrapper = isStretchy ? 'stretch' : 'limits';
    if (movablelimits === true) {
        // Default placement — above/below in display, side in inline.
        if (baseIsCustomOp) {
            // Custom op: display uses limits: #true for above/below; inline omits it for side placement
            return { typst: baseTrimmed.replace(/\)$/, ', limits: #true)'), typst_inline: base };
        }
        // Check if Typst operator natively places limits above/below in display mode.
        // If yes (e.g. sum), Typst already handles movablelimits — same for both modes.
        if (TYPST_DISPLAY_LIMIT_OPS.has(baseTrimmed)) {
            return { typst: base };
        }
        // Operator doesn't natively place limits above/below (e.g. \intop → integral).
        // Block: limits()/stretch() to force above/below; inline: bare operator for side placement.
        return { typst: wrapper + '(' + escapeContentSeparators(baseTrimmed) + ')', typst_inline: base };
    }
    else if (movablelimits === false) {
        // Explicit \limits — force below/above placement in both modes
        return { typst: wrapper + '(' + escapeContentSeparators(baseTrimmed) + ')' };
    }
    else {
        // Non-mo base (mrow, etc.) — use existing logic
        var baseIsNativeLimitOp = TYPST_DISPLAY_LIMIT_OPS.has(baseTrimmed);
        // OP-class base with op() output — two cases:
        if (/^op\(/.test(baseTrimmed) && (firstChild === null || firstChild === void 0 ? void 0 : firstChild.texClass) === MmlNode_1.TEXCLASS.OP) {
            if ((firstChild === null || firstChild === void 0 ? void 0 : firstChild.kind) === 'TeXAtom') {
                // TeXAtom(OP): \varinjlim, \varliminf, etc. — same as movablelimits custom op
                return { typst: baseTrimmed.replace(/\)$/, ', limits: #true)'), typst_inline: base };
            }
            // mi(OP): \operatorname*{name} — add limits: #true inside op()
            return { typst: baseTrimmed.replace(/\)$/, ', limits: #true)') };
        }
        var baseIsSpecialFn = /^(overbrace|underbrace|overline|underline|op)\(/.test(baseTrimmed);
        if (baseIsNativeLimitOp || baseIsSpecialFn) {
            return { typst: base };
        }
        return { typst: wrapper + '(' + escapeContentSeparators(baseTrimmed) + ')' };
    }
};
/** Check if base should use scripts() wrapper (\nolimits in display mode) */
var needsScriptsWrapper = function (baseTrimmed) {
    return TYPST_DISPLAY_LIMIT_OPS.has(baseTrimmed);
};
// Accent functions that have no under-variant in Typst.
// In munder context, these use attach(base, b: symbol) instead of accent function.
var MUNDER_ATTACH_SYMBOLS = new Map([
    ['arrow', 'arrow.r'],
    ['arrow.l', 'arrow.l'],
    ['arrow.l.r', 'arrow.l.r'],
    ['harpoon', 'harpoon'],
    ['harpoon.lt', 'harpoon.lt'], // ↼ below
]);
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
            // Detect \varlimsup pattern: mover(mi("lim"), mo("―")) → op(overline(lim))
            if ((firstChild === null || firstChild === void 0 ? void 0 : firstChild.kind) === 'mi' && (secondChild === null || secondChild === void 0 ? void 0 : secondChild.kind) === 'mo') {
                var baseText = getChildrenText(firstChild);
                var overChar = getChildrenText(secondChild);
                if (baseText === 'lim' && overChar === '\u2015') {
                    res = (0, common_1.addToTypstData)(res, { typst: 'op(overline(lim))' });
                    return res;
                }
            }
            if (secondChild && secondChild.kind === 'mo') {
                var accentChar = getChildrenText(secondChild);
                var accentFn = typst_symbol_map_1.typstAccentMap.get(accentChar);
                if (accentFn) {
                    var content = escapeContentSeparators(dataFirst.typst.trim()) || '""';
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
            // Fallback: base^(over) — uses movablelimits to decide limits() wrapping
            var baseTrimmed = dataFirst.typst.trim() || '""';
            var over = dataSecond.typst.trim();
            if (over) {
                // overbrace/overbracket annotation: insert as second argument
                var braceMatch = BRACE_ANNOTATION_RE.exec(baseTrimmed);
                if (braceMatch && (braceMatch[1] === 'overbrace' || braceMatch[1] === 'overbracket')) {
                    // braceMatch[2] already processed by accent handler — don't re-escape
                    res = (0, common_1.addToTypstData)(res, { typst: braceMatch[1] + '(' + braceMatch[2] + ', ' + escapeContentSeparators(over) + ')' });
                    return res;
                }
                var baseData = buildLimitBase(firstChild, baseTrimmed, dataFirst.typst);
                res = (0, common_1.addToTypstData)(res, baseData);
                res = (0, common_1.addToTypstData)(res, { typst: '^' });
                if ((0, common_1.needsParens)(over)) {
                    res = (0, common_1.addToTypstData)(res, { typst: '(' + over + ')' });
                }
                else {
                    res = (0, common_1.addToTypstData)(res, { typst: over });
                }
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: baseTrimmed });
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
            // Detect \varinjlim / \varprojlim / \varliminf patterns: munder(mi("lim"), mo(...))
            // Map to equivalent Typst operators (losing the visual decoration).
            if ((firstChild === null || firstChild === void 0 ? void 0 : firstChild.kind) === 'mi' && (secondChild === null || secondChild === void 0 ? void 0 : secondChild.kind) === 'mo') {
                var baseText = getChildrenText(firstChild);
                var underChar = getChildrenText(secondChild);
                if (baseText === 'lim' && underChar === '\u2192') { // → below lim
                    res = (0, common_1.addToTypstData)(res, { typst: 'op("inj lim")' });
                    return res;
                }
                if (baseText === 'lim' && underChar === '\u2190') { // ← below lim
                    res = (0, common_1.addToTypstData)(res, { typst: 'op("proj lim")' });
                    return res;
                }
                if (baseText === 'lim' && underChar === '\u2015') { // ― below lim (\varliminf)
                    res = (0, common_1.addToTypstData)(res, { typst: 'op(underline(lim))' });
                    return res;
                }
            }
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
                    var content = escapeContentSeparators(dataFirst.typst.trim()) || '""';
                    // Arrows/harpoons have no under-variant in Typst — use attach(base, b: symbol)
                    var underSymbol = MUNDER_ATTACH_SYMBOLS.get(accentFn);
                    if (underSymbol) {
                        res = (0, common_1.addToTypstData)(res, { typst: 'attach(' + content + ', b: ' + underSymbol + ')' });
                        return res;
                    }
                    if (TYPST_ACCENT_SHORTHANDS.has(accentFn)) {
                        res = (0, common_1.addToTypstData)(res, { typst: accentFn + '(' + content + ')' });
                    }
                    else {
                        res = (0, common_1.addToTypstData)(res, { typst: 'accent(' + content + ', ' + accentFn + ')' });
                    }
                    return res;
                }
            }
            // Fallback: base_(under) — uses movablelimits to decide limits() wrapping
            var baseTrimmed = dataFirst.typst.trim() || '""';
            var under = dataSecond.typst.trim();
            if (under) {
                // underbrace/underbracket annotation: insert as second argument
                var braceMatch = BRACE_ANNOTATION_RE.exec(baseTrimmed);
                if (braceMatch && (braceMatch[1] === 'underbrace' || braceMatch[1] === 'underbracket')) {
                    // braceMatch[2] already processed by accent handler — don't re-escape
                    res = (0, common_1.addToTypstData)(res, { typst: braceMatch[1] + '(' + braceMatch[2] + ', ' + escapeContentSeparators(under) + ')' });
                    return res;
                }
                var baseData = buildLimitBase(firstChild, baseTrimmed, dataFirst.typst);
                res = (0, common_1.addToTypstData)(res, baseData);
                res = (0, common_1.addToTypstData)(res, { typst: '_' });
                if ((0, common_1.needsParens)(under)) {
                    res = (0, common_1.addToTypstData)(res, { typst: '(' + under + ')' });
                }
                else {
                    res = (0, common_1.addToTypstData)(res, { typst: under });
                }
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: baseTrimmed });
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
            var under = dataSecond.typst.trim();
            var over = dataThird.typst.trim();
            // Use movablelimits to decide between default placement and limits() wrapping
            var baseTrimmed = dataFirst.typst.trim() || '""';
            var baseData = buildLimitBase(firstChild, baseTrimmed, dataFirst.typst);
            res = (0, common_1.addToTypstData)(res, baseData);
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
            var baseTrimmed = baseData.typst.trim() || '""';
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
                    typst: 'attach(' + escapeContentSeparators(baseTrimmed) + ', ' + parts.join(', ') + ')'
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
                // \! → negative thin space — skip (Typst has no negthin; this is a LaTeX spacing hack)
                return res;
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
// Escape top-level commas, semicolons, and colons in a Typst expression for use inside cases()/mat().
// Replaces at depth 0: commas → ",", semicolons → ";", colons → ":"
// (Typst text strings) so they render visually but aren't parsed as
// cases()/mat() argument separators, row separators, or named-argument syntax.
// Characters inside function calls like lr((...)) are left as-is.
/** Check if the separator at position i is already escaped as "X" (surrounded by quotes). */
var isAlreadyEscaped = function (expr, i) {
    return i > 0 && i + 1 < expr.length && expr[i - 1] === '"' && expr[i + 1] === '"';
};
/** Escape , and ; at parenthesis depth 0 in content placed inside any Typst function call.
 *  Prevents commas/semicolons from being parsed as argument/row separators.
 *  Skips already-escaped separators ("," / ";") to avoid double-escaping. */
var escapeContentSeparators = function (expr) {
    var depth = 0;
    var result = '';
    for (var i = 0; i < expr.length; i++) {
        var ch = expr[i];
        if (ch === '(' || ch === '[' || ch === '{') {
            depth++;
            result += ch;
        }
        else if ((ch === ')' || ch === ']' || ch === '}') && depth > 0) {
            depth--;
            result += ch;
        }
        else if (ch === ',' && depth === 0 && !isAlreadyEscaped(expr, i)) {
            result += '","';
        }
        else if (ch === ';' && depth === 0 && !isAlreadyEscaped(expr, i)) {
            result += '";"';
        }
        else {
            result += ch;
        }
    }
    return result;
};
/** Escape , ; and : at depth 0 — for mat()/cases() cells where : is also a named-argument marker.
 *  Skips already-escaped separators to avoid double-escaping. */
var escapeCasesSeparators = function (expr) {
    var depth = 0;
    var result = '';
    for (var i = 0; i < expr.length; i++) {
        var ch = expr[i];
        if (ch === '(' || ch === '[' || ch === '{') {
            depth++;
            result += ch;
        }
        else if ((ch === ')' || ch === ']' || ch === '}') && depth > 0) {
            depth--;
            result += ch;
        }
        else if (ch === ',' && depth === 0 && !isAlreadyEscaped(expr, i)) {
            result += '","';
        }
        else if (ch === ';' && depth === 0 && !isAlreadyEscaped(expr, i)) {
            result += '";"';
        }
        else if (ch === ':' && depth === 0 && !isAlreadyEscaped(expr, i)) {
            result += '":"';
        }
        else {
            result += ch;
        }
    }
    return result;
};
/** Check whether a Typst expression contains `,` or `;` at parenthesis depth 0. */
var hasTopLevelSeparators = function (expr) {
    var depth = 0;
    for (var i = 0; i < expr.length; i++) {
        var ch = expr[i];
        if (ch === '(' || ch === '[' || ch === '{') {
            depth++;
        }
        else if ((ch === ')' || ch === ']' || ch === '}') && depth > 0) {
            depth--;
        }
        else if ((ch === ',' || ch === ';') && depth === 0) {
            return true;
        }
    }
    return false;
};
/** Escape top-level `;` → `";"` inside lr() content (commas are safe in lr). */
var escapeLrSemicolons = function (expr) {
    var depth = 0;
    var result = '';
    for (var i = 0; i < expr.length; i++) {
        var ch = expr[i];
        if (ch === '(' || ch === '[' || ch === '{') {
            depth++;
            result += ch;
        }
        else if ((ch === ')' || ch === ']' || ch === '}') && depth > 0) {
            depth--;
            result += ch;
        }
        else if (ch === ';' && depth === 0) {
            result += '";"';
        }
        else {
            result += ch;
        }
    }
    return result;
};
/**
 * Escape unbalanced closing parentheses in content that will be wrapped
 * in a function call like `func(content)`, to prevent premature closure.
 * E.g. content `) 24` becomes `")" 24` so `underline(")" 24)` is valid.
 */
var escapeUnbalancedParens = function (content) {
    var depth = 0;
    var result = '';
    for (var i = 0; i < content.length; i++) {
        var ch = content[i];
        if (ch === '(') {
            depth++;
            result += ch;
        }
        else if (ch === ')') {
            if (depth > 0) {
                depth--;
                result += ch;
            }
            else {
                result += '")"';
            }
        }
        else {
            result += ch;
        }
    }
    return result;
};
var BRACKET_SYMBOL_MAP = {
    '[': 'bracket.l',
    ']': 'bracket.r',
    '(': 'paren.l',
    ')': 'paren.r',
    '{': 'brace.l',
    '}': 'brace.r',
};
// Replace unpaired brackets in a matrix/cases cell with Typst symbol names.
// Brackets that have a matching open/close pair in the same cell are kept as-is.
// Escaped brackets (\[), brackets inside quoted strings ("..."), and brackets
// inside function-call parens (e.g. frac(...)) are ignored.
var replaceUnpairedBrackets = function (expr) {
    var e_7, _a, e_8, _b, e_9, _c;
    // Quick exit if no bracket characters present
    if (!/[\[\](){}]/.test(expr))
        return expr;
    var brackets = [];
    for (var i = 0; i < expr.length; i++) {
        var ch = expr[i];
        // Skip backslash-escaped characters
        if (ch === '\\') {
            i++; // skip next char
            continue;
        }
        // Skip quoted strings
        if (ch === '"') {
            i++;
            while (i < expr.length && expr[i] !== '"') {
                if (expr[i] === '\\')
                    i++; // skip escaped char in string
                i++;
            }
            continue;
        }
        // Check if this is a bracket character
        if ('[](){}'.includes(ch)) {
            // Check if ( is a function-call paren (preceded by word char or .)
            // If so, skip the entire function call content
            if (ch === '(' && i > 0 && /[\w.]/.test(expr[i - 1])) {
                var depth = 1;
                i++;
                while (i < expr.length && depth > 0) {
                    if (expr[i] === '\\') {
                        i++;
                    }
                    else if (expr[i] === '"') {
                        i++;
                        while (i < expr.length && expr[i] !== '"') {
                            if (expr[i] === '\\')
                                i++;
                            i++;
                        }
                    }
                    else if (expr[i] === '(')
                        depth++;
                    else if (expr[i] === ')')
                        depth--;
                    if (depth > 0)
                        i++;
                }
                // i now points to the closing ), skip it
                continue;
            }
            brackets.push({ char: ch, pos: i });
        }
    }
    // Pair brackets using stacks for each bracket type
    var BRACKET_PAIRS = { '[': ']', '(': ')', '{': '}' };
    var unmatched = new Set();
    try {
        for (var _d = tslib_1.__values(Object.entries(BRACKET_PAIRS)), _f = _d.next(); !_f.done; _f = _d.next()) {
            var _g = tslib_1.__read(_f.value, 2), open_1 = _g[0], close_1 = _g[1];
            var stack = [];
            try {
                for (var brackets_1 = (e_8 = void 0, tslib_1.__values(brackets)), brackets_1_1 = brackets_1.next(); !brackets_1_1.done; brackets_1_1 = brackets_1.next()) {
                    var b = brackets_1_1.value;
                    if (b.char === open_1) {
                        stack.push(b.pos);
                    }
                    else if (b.char === close_1) {
                        if (stack.length > 0) {
                            stack.pop(); // matched
                        }
                        else {
                            unmatched.add(b.pos); // unmatched close
                        }
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (brackets_1_1 && !brackets_1_1.done && (_b = brackets_1.return)) _b.call(brackets_1);
                }
                finally { if (e_8) throw e_8.error; }
            }
            try {
                // Any remaining in stack are unmatched opens
                for (var stack_1 = (e_9 = void 0, tslib_1.__values(stack)), stack_1_1 = stack_1.next(); !stack_1_1.done; stack_1_1 = stack_1.next()) {
                    var pos = stack_1_1.value;
                    unmatched.add(pos);
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (stack_1_1 && !stack_1_1.done && (_c = stack_1.return)) _c.call(stack_1);
                }
                finally { if (e_9) throw e_9.error; }
            }
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_a = _d.return)) _a.call(_d);
        }
        finally { if (e_7) throw e_7.error; }
    }
    if (unmatched.size === 0)
        return expr;
    // Replace unmatched brackets with symbol names, adding spaces where needed
    var result = '';
    for (var i = 0; i < expr.length; i++) {
        if (unmatched.has(i)) {
            var sym = BRACKET_SYMBOL_MAP[expr[i]];
            // Add space before if preceded by word char or dot
            if (result.length > 0 && /[\w.]/.test(result[result.length - 1])) {
                result += ' ';
            }
            result += sym;
            // Add space after if followed by word char
            if (i + 1 < expr.length && /\w/.test(expr[i + 1])) {
                result += ' ';
            }
        }
        else {
            result += expr[i];
        }
    }
    return result;
};
// --- Pre-serialization tree walk: mark unpaired ASCII brackets ---
var OPEN_BRACKETS = {
    '(': ')', '[': ']', '{': '}',
};
var CLOSE_BRACKETS = {
    ')': '(', ']': '[', '}': '{',
};
// Typst escaped-delimiter output for unpaired brackets (math-mode safe)
var UNPAIRED_BRACKET_TYPST = {
    '(': '\\(', ')': '\\)', '[': '\\[', ']': '\\]', '{': '\\{', '}': '\\}',
};
var markUnpairedBrackets = function (root) {
    var bracketNodes = [];
    // DFS — always recurse into childNodes (even for mo)
    var walk = function (node) {
        var e_10, _a;
        if (!node)
            return;
        if (node.kind === 'mo') {
            var text = getChildrenText(node);
            if (text && (OPEN_BRACKETS[text] || CLOSE_BRACKETS[text])) {
                // Collect all bracket mo nodes — no skip conditions.
                // Fence delimiters (\left...\right) are skipped by the mrow handler
                // (via `continue`) so any unpaired mark on them is harmless.
                bracketNodes.push({ node: node, char: text });
            }
        }
        if (node.childNodes) {
            try {
                for (var _b = tslib_1.__values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    walk(child);
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_10) throw e_10.error; }
            }
        }
    };
    walk(root);
    // STRICT stack pairing: closing bracket matches ONLY the top of the stack
    var stack = [];
    var paired = new Set();
    for (var i = 0; i < bracketNodes.length; i++) {
        var ch = bracketNodes[i].char;
        if (OPEN_BRACKETS[ch]) {
            stack.push(i);
        }
        else if (CLOSE_BRACKETS[ch]) {
            if (stack.length > 0) {
                var topIdx = stack[stack.length - 1];
                if (bracketNodes[topIdx].char === CLOSE_BRACKETS[ch]) {
                    paired.add(topIdx);
                    paired.add(i);
                    stack.pop();
                }
                // Top doesn't match → do NOT search deeper, leave both unpaired
            }
        }
    }
    // Mark unpaired nodes with direction metadata
    for (var i = 0; i < bracketNodes.length; i++) {
        if (!paired.has(i)) {
            var ch = bracketNodes[i].char;
            bracketNodes[i].node.properties['data-unpaired-bracket'] =
                OPEN_BRACKETS[ch] ? 'open' : 'close';
        }
    }
};
exports.markUnpairedBrackets = markUnpairedBrackets;
// Extract explicit \tag{...} from a condition cell's mtext content.
// Returns the tag content (e.g. "3.12") or null if no \tag found.
var extractTagFromConditionCell = function (cell) {
    var walk = function (n) {
        var e_11, _a;
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
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_11) throw e_11.error; }
            }
        }
        return null;
    };
    return walk(cell);
};
// Detect numcases/subnumcases pattern:
// - First row is mlabeledtr with 3+ children (label + prefix + content [+ condition])
//   3 children: empty prefix or no & separator → label + prefix_with_brace + content
//   4 children: non-empty prefix with & separator → label + prefix + value + condition
// - First row's cell[1] contains a visible '{' mo (inside mpadded, outside mphantom)
var isNumcasesTable = function (node) {
    if (!node.childNodes || node.childNodes.length === 0)
        return false;
    var firstRow = node.childNodes[0];
    if (firstRow.kind !== 'mlabeledtr')
        return false;
    if (firstRow.childNodes.length < 3)
        return false;
    // Check that cell[1] (first data column) contains a '{' brace
    var prefixCell = firstRow.childNodes[1];
    return treeContainsMo(prefixCell, '{');
};
// Check if a node is inside a non-eqnArray mtable (mat()/cases() function call syntax)
// where bare ASCII delimiters like [ { ( would break parsing.
// --- MTABLE handler: matrices and equation arrays ---
var mtable = function () {
    return function (node, serialize) {
        var e_12, _a;
        var _b, _c, _d, _f, _g, _h, _j;
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
                // Determine tag source for each row:
                // 1. Condition-embedded \tag{...} in mtext (MathJax leaves it as literal text)
                // 2. Label cell explicit tag (MathJax processed \tag, data-tag-auto is false)
                // 3. Auto-numbered (data-tag-auto is true)
                var autoTagEntry = '{ counter(math.equation).step(); context counter(math.equation).display("(1)") }';
                var rowTagSources = [];
                for (var i = 0; i < countRow; i++) {
                    var mtrNode = node.childNodes[i];
                    var labelCell = (mtrNode.kind === 'mlabeledtr' && mtrNode.childNodes.length > 0) ? mtrNode.childNodes[0] : null;
                    var labelKey = labelCell ? getLabelKey(labelCell) : null;
                    // Check condition cell for embedded \tag{...} in mtext
                    var condCell = mtrNode.childNodes[mtrNode.childNodes.length - 1];
                    var condTag = extractTagFromConditionCell(condCell);
                    if (condTag) {
                        rowTagSources.push({ source: 'condition', content: condTag, labelKey: labelKey });
                    }
                    else if (labelCell) {
                        var isAutoNumber = !!((_g = labelCell.properties) === null || _g === void 0 ? void 0 : _g['data-tag-auto']);
                        if (!isAutoNumber) {
                            var tagContent = serializeTagContent(labelCell, serialize);
                            rowTagSources.push({ source: 'label', content: tagContent, labelKey: labelKey });
                        }
                        else {
                            rowTagSources.push({ source: 'auto', content: '', labelKey: labelKey });
                        }
                    }
                    else {
                        rowTagSources.push({ source: 'auto', content: '', labelKey: null });
                    }
                }
                // Build case rows from content columns (after label + prefix)
                var caseRows = [];
                for (var i = 0; i < countRow; i++) {
                    var mtrNode = node.childNodes[i];
                    var startCol = mtrNode.kind === 'mlabeledtr' ? 2 : 1; // skip label + prefix
                    var cells = [];
                    for (var j = startCol; j < mtrNode.childNodes.length; j++) {
                        var mtdNode = mtrNode.childNodes[j];
                        var cellData = serialize.visitNode(mtdNode, '');
                        var trimmed = cellData.typst.trim();
                        // Strip \tag{...} from condition column if tag was extracted from there
                        if (j === mtrNode.childNodes.length - 1 && rowTagSources[i].source === 'condition') {
                            trimmed = trimmed.replace(/\s*\\tag\{[^}]+\}/g, '');
                            trimmed = trimmed.replace(/\s+"$/g, '"');
                            trimmed = trimmed.trim();
                        }
                        if (trimmed)
                            cells.push(trimmed);
                    }
                    if (cells.length === 1) {
                        // Single cell (no & separator): escape top-level commas
                        // to prevent them being parsed as cases() argument separators
                        caseRows.push(escapeCasesSeparators(replaceUnpairedBrackets(cells[0])));
                    }
                    else {
                        caseRows.push(cells.map(function (c) { return escapeCasesSeparators(replaceUnpairedBrackets(c)); }).join(' & '));
                    }
                }
                var casesContent = void 0;
                if (caseRows.length >= 2) {
                    casesContent = 'cases(\n  ' + caseRows.join(',\n  ') + ',\n)';
                }
                else {
                    casesContent = 'cases(' + caseRows.join(', ') + ')';
                }
                var mathContent = prefix ? prefix + ' ' + casesContent : casesContent;
                // Build tag entries for numbering column
                var tagEntries = [];
                for (var i = 0; i < countRow; i++) {
                    var info = rowTagSources[i];
                    var tagText = '';
                    if (info.source === 'condition') {
                        tagText = '(' + info.content + ')';
                    }
                    else if (info.source === 'label' && info.content) {
                        tagText = info.content;
                    }
                    if (tagText && info.labelKey) {
                        // Explicit tag with label — wrap in #figure() so the label is referenceable
                        tagEntries.push('[#figure(kind: "eq-tag", supplement: none, numbering: n => [' + tagText + '], [' + tagText + ']) <' + info.labelKey + '>]');
                    }
                    else if (tagText) {
                        tagEntries.push('[' + tagText + ']');
                    }
                    else if (info.labelKey) {
                        // Auto-numbered with label — step counter outside context, wrap in #figure() for referenceability
                        tagEntries.push('{ counter(math.equation).step(); context { let n = numbering("(1)", ..counter(math.equation).get()); [#figure(kind: "eq-tag", supplement: none, numbering: _ => n, [#n]) <' + info.labelKey + '>] } }');
                    }
                    else {
                        tagEntries.push(autoTagEntry);
                    }
                }
                // Build grid output
                var lines = [
                    '#grid(',
                    '  columns: (1fr, auto),',
                    '  align: (left, right + horizon),',
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
                catch (e_12_1) { e_12 = { error: e_12_1 }; }
                finally {
                    try {
                        if (tagEntries_1_1 && !tagEntries_1_1.done && (_a = tagEntries_1.return)) _a.call(tagEntries_1);
                    }
                    finally { if (e_12) throw e_12.error; }
                }
                lines.push('  ),');
                lines.push(')');
                res = (0, common_1.addToTypstData)(res, { typst: lines.join('\n') });
                // Inline variant: pure math content without #grid wrapper
                res.typst_inline = mathContent;
                return res;
            }
            // Build rows
            var rows = [];
            for (var i = 0; i < countRow; i++) {
                var mtrNode = node.childNodes[i];
                var countColl = ((_h = mtrNode.childNodes) === null || _h === void 0 ? void 0 : _h.length) || 0;
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
                    // Join cells with & alignment markers.
                    // Within each column pair (right-left): &
                    // Between column pairs: &quad for visual spacing.
                    var pairs = [];
                    for (var k = 0; k < cells.length; k += 2) {
                        if (k + 1 < cells.length) {
                            pairs.push(cells[k] + ' &' + cells[k + 1]);
                        }
                        else {
                            pairs.push(cells[k]);
                        }
                    }
                    rows.push(pairs.join(' &quad '));
                }
                else if (isCases) {
                    // Cases: escape top-level commas in each cell to prevent them
                    // being parsed as cases() argument separators, then join with &
                    rows.push(cells.map(function (c) { return escapeCasesSeparators(replaceUnpairedBrackets(c)); }).join(' & '));
                }
                else {
                    // Matrix: escape top-level commas and semicolons in each cell
                    // to prevent them being parsed as mat() cell/row separators
                    rows.push(cells.map(function (c) { return escapeCasesSeparators(replaceUnpairedBrackets(c)); }).join(', '));
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
                                var isAutoNumber = !!((_j = labelCell.properties) === null || _j === void 0 ? void 0 : _j['data-tag-auto']);
                                var numbering = isAutoNumber
                                    ? '"(1)"'
                                    : 'n => [' + tagContent + ']';
                                var labelKey = getLabelKey(labelCell);
                                var labelSuffix = labelKey ? ' <' + labelKey + '>' : '';
                                var supplementPart = labelKey ? ', supplement: none' : '';
                                eqnBlocks.push('#math.equation(block: true' + supplementPart + ', numbering: ' + numbering + ', $ ' + rowContent + ' $)' + labelSuffix);
                                // Explicit \tag{} does not consume a number in LaTeX, but
                                // math.equation always steps the counter in Typst — undo it.
                                if (!isAutoNumber) {
                                    eqnBlocks.push('#counter(math.equation).update(n => n - 1)');
                                }
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
                    // Inline variant: pure math content without #math.equation wrappers
                    res.typst_inline = rows.join(' \\\n');
                }
                else {
                    // No tags at all (e.g. align*): emit as single block with \ separators
                    res = (0, common_1.addToTypstData)(res, { typst: rows.join(' \\\n') });
                }
            }
            else if (isCases) {
                // Cases environment
                var casesBody = void 0;
                if (rows.length >= 2) {
                    casesBody = 'cases(\n  ' + rows.join(',\n  ') + ',\n)';
                }
                else {
                    casesBody = 'cases(' + rows.join(', ') + ')';
                }
                res = (0, common_1.addToTypstData)(res, { typst: casesBody });
            }
            else {
                // Matrix: mat(delim: ..., a, b; c, d)
                var matContent = void 0;
                if (rows.length >= 2) {
                    matContent = '\n  ' + rows.join(';\n  ') + ',\n';
                }
                else {
                    matContent = rows.join('; ');
                }
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
                // Extract column alignment
                var columnAlign = node.attributes.get('columnalign');
                var alignArr = columnAlign ? columnAlign.trim().split(/\s+/) : [];
                var uniqueAligns = tslib_1.__spreadArray([], tslib_1.__read(new Set(alignArr)), false);
                var matAlign = (uniqueAligns.length === 1 && uniqueAligns[0] !== 'center')
                    ? uniqueAligns[0] // 'left' or 'right'
                    : '';
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
                if (matAlign) {
                    params.push('align: #' + matAlign);
                }
                if (augmentStr) {
                    params.push(augmentStr.slice(0, -2)); // remove trailing ", "
                }
                var paramStr = params.length > 0 ? params.join(', ') + ', ' : '';
                var matExpr = 'mat(' + paramStr + matContent + ')';
                if (frame === 'solid') {
                    res = (0, common_1.addToTypstData)(res, { typst: '#box(stroke: 0.5pt, inset: 3pt, $ ' + matExpr + ' $)', typst_inline: matExpr });
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
                    if ((0, common_1.needsTokenSeparator)(content, data.typst)) {
                        content += ' ';
                    }
                    content += data.typst;
                }
                // Map delimiter characters to Typst
                var open_2 = openDelim ? mapDelimiter(openDelim) : '';
                var close_2 = closeDelim ? mapDelimiter(closeDelim) : '';
                var hasVisibleOpen = !!open_2;
                var hasVisibleClose = !!close_2;
                if (hasVisibleOpen && hasVisibleClose) {
                    var trimmedContent = content.trim();
                    // Optimize common delimiter pairs to Typst shorthand functions,
                    // but fall back to lr() when content has top-level , or ;
                    // (these would be parsed as argument/row separators inside a function call).
                    var hasSep = hasTopLevelSeparators(trimmedContent);
                    if (openDelim === '|' && closeDelim === '|') {
                        res = (0, common_1.addToTypstData)(res, { typst: hasSep
                                ? 'lr(| ' + escapeLrSemicolons(trimmedContent) + ' |)'
                                : 'abs(' + trimmedContent + ')' });
                    }
                    else if (openDelim === '\u2016' && closeDelim === '\u2016') {
                        // ‖...‖ → norm() or lr(‖ ... ‖)
                        res = (0, common_1.addToTypstData)(res, { typst: hasSep
                                ? 'lr(‖ ' + escapeLrSemicolons(trimmedContent) + ' ‖)'
                                : 'norm(' + trimmedContent + ')' });
                    }
                    else if (openDelim === '\u230A' && closeDelim === '\u230B') {
                        // ⌊...⌋ → floor() or lr(⌊ ... ⌋)
                        res = (0, common_1.addToTypstData)(res, { typst: hasSep
                                ? 'lr(⌊ ' + escapeLrSemicolons(trimmedContent) + ' ⌋)'
                                : 'floor(' + trimmedContent + ')' });
                    }
                    else if (openDelim === '\u2308' && closeDelim === '\u2309') {
                        // ⌈...⌉ → ceil() or lr(⌈ ... ⌉)
                        res = (0, common_1.addToTypstData)(res, { typst: hasSep
                                ? 'lr(⌈ ' + escapeLrSemicolons(trimmedContent) + ' ⌉)'
                                : 'ceil(' + trimmedContent + ')' });
                    }
                    else {
                        // General lr() for auto-sizing — escape semicolons
                        res = (0, common_1.addToTypstData)(res, { typst: 'lr(' + open_2 + ' ' + escapeLrSemicolons(trimmedContent) + ' ' + close_2 + ')' });
                    }
                }
                else {
                    // One or both delimiters invisible: wrap visible side in lr()
                    // with escaped delimiters so bare ASCII chars don't break parsing
                    // and auto-sizing from \left/\right is preserved.
                    var trimmed = content.trim();
                    var openEsc = openDelim ? escapeDelimiterForLr(openDelim) : '';
                    var closeEsc = closeDelim ? escapeDelimiterForLr(closeDelim) : '';
                    if (openEsc) {
                        res = (0, common_1.addToTypstData)(res, { typst: 'lr(' + openEsc + ' ' + escapeLrSemicolons(trimmed) + ')' });
                    }
                    else if (closeEsc) {
                        res = (0, common_1.addToTypstData)(res, { typst: 'lr(' + escapeLrSemicolons(trimmed) + ' ' + closeEsc + ')' });
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
                    // Thousand-separator: mn, mo(,), mn(3 digits) → merge as 120","000
                    if ((0, common_1.isThousandSepComma)(node, i)) {
                        var numData = serialize.visitNode(node.childNodes[i], '');
                        if ((0, common_1.needsTokenSeparator)(res.typst, numData.typst)) {
                            (0, common_1.addSpaceToTypstData)(res);
                        }
                        var nextData = serialize.visitNode(node.childNodes[i + 2], '');
                        res = (0, common_1.addToTypstData)(res, { typst: numData.typst + '","' + nextData.typst });
                        i += 2;
                        continue;
                    }
                    var data = serialize.visitNode(node.childNodes[i], '');
                    if ((0, common_1.needsTokenSeparator)(res.typst, data.typst)) {
                        (0, common_1.addSpaceToTypstData)(res);
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
// Escape ASCII delimiters for use inside lr() within mat()/cases() context.
// Bare [ { ( break Typst function-call parsing; backslash-escaping makes them
// literal math delimiters that lr() can auto-size.
var delimiterEscapeMap = {
    '[': '\\[',
    ']': '\\]',
    '(': '\\(',
    ')': '\\)',
    '{': '\\{',
    '}': '\\}',
};
var escapeDelimiterForLr = function (delim) {
    if (delimiterEscapeMap[delim])
        return delimiterEscapeMap[delim];
    var mapped = typst_symbol_map_1.typstSymbolMap.get(delim);
    if (mapped)
        return mapped;
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
            var content = data.typst.trim();
            // Handle mathbackground attribute (\colorbox{color}{...})
            var atr = getAttributes(node);
            var rawBg = (atr === null || atr === void 0 ? void 0 : atr.mathbackground) || '';
            var mathbg = rawBg && rawBg !== '_inherit_' ? rawBg : '';
            if (mathbg && content) {
                var fillValue = mathbg.startsWith('#')
                    ? 'rgb("' + mathbg + '")'
                    : mathbg;
                res = (0, common_1.addToTypstData)(res, {
                    typst: '#highlight(fill: ' + fillValue + ')[$' + content + '$]',
                    typst_inline: content
                });
                return res;
            }
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
            var content = data.typst.trim() || '""';
            if (notation.indexOf('box') > -1) {
                // \boxed → #box with stroke
                res = (0, common_1.addToTypstData)(res, { typst: '#box(stroke: 0.5pt, inset: 3pt, $' + content + '$)', typst_inline: content });
            }
            else if (notation.indexOf('updiagonalstrike') > -1 || notation.indexOf('downdiagonalstrike') > -1) {
                // \cancel uses updiagonalstrike (lower-left to upper-right) → Typst cancel() default
                // \bcancel uses downdiagonalstrike (upper-left to lower-right) → Typst cancel(inverted: true)
                if (notation.indexOf('downdiagonalstrike') > -1 && notation.indexOf('updiagonalstrike') === -1) {
                    res = (0, common_1.addToTypstData)(res, { typst: 'cancel(inverted: #true, ' + escapeContentSeparators(content) + ')' });
                }
                else {
                    res = (0, common_1.addToTypstData)(res, { typst: 'cancel(' + escapeContentSeparators(content) + ')' });
                }
            }
            else if (notation.indexOf('horizontalstrike') > -1) {
                res = (0, common_1.addToTypstData)(res, { typst: 'cancel(' + escapeContentSeparators(content) + ')' });
            }
            else if (notation.indexOf('longdiv') > -1) {
                // \longdiv / \enclose{longdiv} → overline(")" content)
                res = (0, common_1.addToTypstData)(res, { typst: 'overline(")"' + escapeContentSeparators(escapeUnbalancedParens(content)) + ')' });
            }
            else if (notation.indexOf('circle') > -1) {
                // \enclose{circle} → #circle with inset
                res = (0, common_1.addToTypstData)(res, { typst: '#circle(inset: 3pt, $' + content + '$)', typst_inline: content });
            }
            else if (notation.indexOf('radical') > -1) {
                // \enclose{radical} → sqrt()
                res = (0, common_1.addToTypstData)(res, { typst: 'sqrt(' + escapeContentSeparators(escapeUnbalancedParens(content)) + ')' });
            }
            else if (notation.indexOf('top') > -1) {
                // \enclose{top} → overline()
                res = (0, common_1.addToTypstData)(res, { typst: 'overline(' + escapeContentSeparators(escapeUnbalancedParens(content)) + ')' });
            }
            else if (notation.indexOf('bottom') > -1) {
                // \enclose{bottom} → underline()
                // Detect \smash{)} prefix (used in \lcm macro): strip leading ) or \), trailing spacing, no space
                if (content.startsWith(')') || content.startsWith('\\)')) {
                    var skip = content.startsWith('\\)') ? 2 : 1;
                    var inner = content.slice(skip).trim().replace(/\s+(?:med|thin|thick|quad)$/, '');
                    res = (0, common_1.addToTypstData)(res, { typst: 'underline(")"' + escapeContentSeparators(inner) + ')' });
                }
                else {
                    res = (0, common_1.addToTypstData)(res, { typst: 'underline(' + escapeContentSeparators(escapeUnbalancedParens(content)) + ')' });
                }
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
    var e_13, _a;
    var res = (0, common_1.initTypstData)();
    try {
        try {
            for (var _b = tslib_1.__values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                var data = serialize.visitNode(child, '');
                res = (0, common_1.addToTypstData)(res, data);
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_13) throw e_13.error; }
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
                // Hex colors (#D61F06) need rgb("...") wrapper; named colors (red) pass through
                var fillValue = mathcolor.startsWith('#')
                    ? 'rgb("' + mathcolor + '")'
                    : mathcolor;
                res = (0, common_1.addToTypstData)(res, {
                    typst: '#text(fill: ' + fillValue + ')[' + data.typst.trim() + ']'
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