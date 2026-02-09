"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderMathInElement = void 0;
var tslib_1 = require("tslib");
var mathjax_1 = require("../mathjax");
var sre_browser_1 = require("../sre/sre-browser");
var RE_TEX_DISPLAY_DOLLARS = /^\$\$[\s\S]*\$\$$/;
var RE_TEX_DISPLAY_BRACKETS = /^\\\[[\s\S]*\\\]$/;
var RE_TEX_INLINE_PARENS = /^\\\([\s\S]*\\\)$/;
var RE_TEX_INLINE_DOLLAR = /^\$[\s\S]*\$$/;
var RE_TEX_ENV_WHOLE = /^\\begin\{[^}]+\}[\s\S]*\\end\{[^}]+\}$/;
var defaultConfig = {
    accessibility: {
        assistive_mml: true,
        include_speech: true
    },
    outMath: {
        output_format: "svg",
        include_svg: true,
        include_asciimath: true,
        include_latex: true,
        include_mathml: true,
        include_mathml_word: true,
        include_smiles: true,
        include_speech: true,
        include_table_markdown: true,
        include_tsv: true
    },
    width: 1200
};
/**
 * Returns true if the element appears to be already typeset by Mathpix/MathJax.
 * Used to prevent double-rendering during autorender passes.
 *
 * Heuristics:
 *  - Prefer an explicit marker attribute set by our renderer.
 *  - Otherwise detect common MathJax output containers/markers.
 */
var isAlreadyRenderedMath = function (el) {
    // Fast & explicit: our own marker.
    if (el.hasAttribute('data-mathpix-typeset'))
        return true;
    // Single DOM query for common MathJax output.
    var alreadyRenderedSelector = [
        'mjx-container',
        'mjx-container[jax]',
        'mjx-assistive-mml',
        '[data-mjx-container]',
        '.mjx-container',
        '.MathJax', // common class used by MathJax output
    ].join(',');
    return el.querySelector(alreadyRenderedSelector) !== null;
};
/**
 * Returns true if the element contains exactly one meaningful child node and it is a MathML <math> element.
 * Example accepted structure:
 *   <span class="math-block"><math xmlns="http://www.w3.org/1998/Math/MathML">...</math></span>
 */
var isOnlyMathMLElement = function (el) {
    var children = Array.from(el.childNodes).filter(function (n) { var _a; return !(n.nodeType === Node.TEXT_NODE && !((_a = n.textContent) !== null && _a !== void 0 ? _a : '').trim()); });
    return children.length === 1 &&
        children[0].nodeType === Node.ELEMENT_NODE &&
        children[0].tagName.toLowerCase() === 'math';
};
/**
 * Extracts the MathML markup from the given element and determines
 * whether it should be treated as display (block) math.
 *
 * Display mode is inferred from:
 *  - the MathML `display="block"` attribute, or
 *  - a wrapper element having the `math-block` CSS class.
 */
var getMathMLString = function (el) {
    var mathEl = el.querySelector('math');
    var displayAttr = mathEl === null || mathEl === void 0 ? void 0 : mathEl.getAttribute('display');
    var display = displayAttr === 'block' || el.classList.contains('math-block');
    return { mathml: mathEl.outerHTML, display: display };
};
/**
 * If the input string is entirely wrapped in a single pair of outer TeX math delimiters,
 * strips those outer delimiters and returns the inner TeX plus an inferred display mode.
 * Returns null if the input is not fully wrapped.
 */
var stripOuterMathDelimitersIfWhole = function (raw) {
    var text = (raw !== null && raw !== void 0 ? raw : '').trim();
    if (!text)
        return null;
    // $$...$$
    if (RE_TEX_DISPLAY_DOLLARS.test(text)) {
        return { tex: text.slice(2, -2).trim(), display: true };
    }
    // \[...\]
    if (RE_TEX_DISPLAY_BRACKETS.test(text)) {
        return { tex: text.slice(2, -2).trim(), display: true };
    }
    // \(...\)
    if (RE_TEX_INLINE_PARENS.test(text)) {
        return { tex: text.slice(2, -2).trim(), display: false };
    }
    // $...$ (but not $$...$$)
    if (RE_TEX_INLINE_DOLLAR.test(text) && !(text.startsWith('$$') && text.endsWith('$$'))) {
        return { tex: text.slice(1, -1).trim(), display: false };
    }
    // \begin{...}...\end{...} (whole string)
    if (RE_TEX_ENV_WHOLE.test(text)) {
        return { tex: text, display: true };
    }
    return null;
};
/**
 * Decides whether a given element should be typeset as math.
 * - If the element contains a single MathML node (<math>...</math>) -> returns a MathML target.
 * - If the element already contains rendered math (SVG/MathJax containers) -> returns null.
 * - If the element contains non-trivial child elements (except <br>) -> returns null.
 * - Otherwise, if its text is fully wrapped in TeX math delimiters -> returns a TeX target.
 */
var shouldTypesetNode = function (el) {
    var _a;
    // 0) Pure MathML input (render it)
    if (isOnlyMathMLElement(el)) {
        var _b = getMathMLString(el), mathml = _b.mathml, display = _b.display;
        return {
            kind: 'mathml',
            mathml: mathml,
            display: display
        };
    }
    // 1) Already rendered (svg/mjx-container/etc.) -> skip
    if (isAlreadyRenderedMath(el)) {
        return null;
    }
    // 2) Contains child elements other than <br> -> skip
    var hasNonTrivialChildElements = Array.from(el.childNodes).some(function (node) {
        if (node.nodeType !== Node.ELEMENT_NODE)
            return false;
        return node.tagName.toLowerCase() !== 'br';
    });
    if (hasNonTrivialChildElements) {
        return null;
    }
    // 3) Otherwise, check for fully-wrapped TeX delimiters
    var text = (_a = el.textContent) !== null && _a !== void 0 ? _a : '';
    var match = stripOuterMathDelimitersIfWhole(text);
    if (!match) {
        return null;
    }
    return {
        kind: 'tex',
        tex: match.tex,
        display: match.display
    };
};
/**
 * Resolves accessibility feature flags from user config.
 * Default behavior: if config is missing, both flags are enabled.
 */
var resolveA11yFlags = function (a11y) {
    var cfg = (a11y && typeof a11y === 'object') ? a11y : null;
    if (!cfg) {
        return { assistiveMml: true, includeSpeech: true };
    }
    return {
        // `undefined` -> true, only explicit `false` disables the feature
        assistiveMml: cfg.assistive_mml !== false,
        includeSpeech: cfg.include_speech !== false,
    };
};
/**
 * Builds MathJax accessibility options based on user config.
 * Returns `undefined` if all accessibility features are disabled.
 */
var buildAccessibilityOptions = function (a11y) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a, assistiveMml, includeSpeech, opts, sre;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = resolveA11yFlags(a11y), assistiveMml = _a.assistiveMml, includeSpeech = _a.includeSpeech;
                // If all features are disabled, return undefined to avoid enabling a11y pipeline.
                if (!assistiveMml && !includeSpeech) {
                    return [2 /*return*/, undefined];
                }
                opts = {};
                if (assistiveMml) {
                    opts.assistiveMml = true;
                }
                if (!includeSpeech) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, sre_browser_1.loadSreAsync)()];
            case 1:
                sre = _b.sent();
                if (sre) {
                    opts.sre = sre;
                }
                _b.label = 2;
            case 2: return [2 /*return*/, opts];
        }
    });
}); };
/**
 * Replace element contents with rendered math HTML.
 * Note: this will remove existing child nodes inside `el` (but keeps the element itself).
 */
var setInnerHTML = function (el, html) {
    el.innerHTML = html;
};
/**
 * Typeset MathJax math inside a container element.
 * Searches for `.math-inline` and `.math-block`, detects whether each node contains pure MathML or TeX,
 * and replaces its inner HTML with MathJax output.
 */
var renderMathInElement = function (container, config) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var cfg, outMath, mathNodes, accessibility, mathNodes_1, mathNodes_1_1, mathEl, target, metric, result, isInline, isBlock, width, widthEx;
    var e_1, _a;
    var _b;
    return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                cfg = config !== null && config !== void 0 ? config : {};
                outMath = (_b = cfg.outMath) !== null && _b !== void 0 ? _b : {};
                mathNodes = Array.from(container.querySelectorAll('.math-inline, .math-block'));
                return [4 /*yield*/, buildAccessibilityOptions(cfg.accessibility)];
            case 1:
                accessibility = _c.sent();
                // Start a new "render session" so a11y ids (aria-labelledby) can be generated consistently.
                mathjax_1.MathJax.beginRender();
                mathjax_1.MathJax.Reset();
                try {
                    for (mathNodes_1 = tslib_1.__values(mathNodes), mathNodes_1_1 = mathNodes_1.next(); !mathNodes_1_1.done; mathNodes_1_1 = mathNodes_1.next()) {
                        mathEl = mathNodes_1_1.value;
                        target = shouldTypesetNode(mathEl);
                        if (!target)
                            continue;
                        try {
                            metric = { cwidth: 1200 };
                            result = target.kind === 'mathml'
                                ? mathjax_1.MathJax.TypesetMathML(target.mathml, {
                                    display: target.display,
                                    metric: metric,
                                    outMath: outMath,
                                    accessibility: accessibility,
                                })
                                : mathjax_1.MathJax.Typeset(target.tex, {
                                    display: target.display,
                                    metric: metric,
                                    outMath: outMath,
                                    accessibility: accessibility,
                                });
                            // Replace content with MathJax output.
                            setInnerHTML(mathEl, result.html);
                            // Apply width-related attributes (matching server-side rendering behavior).
                            if (result === null || result === void 0 ? void 0 : result.data) {
                                isInline = mathEl.classList.contains('math-inline');
                                isBlock = mathEl.classList.contains('math-block');
                                width = result.data.width;
                                widthEx = result.data.widthEx;
                                // For block math: data-width="full" when the equation is full-width
                                if (isBlock && width === 'full') {
                                    mathEl.setAttribute('data-width', 'full');
                                }
                                // For inline math: data-overflow="visible" when the equation is very narrow
                                if (isInline && typeof widthEx === 'number' && widthEx < 2) {
                                    mathEl.setAttribute('data-overflow', 'visible');
                                }
                            }
                            // Mark as already typeset to avoid re-processing on future passes.
                            mathEl.setAttribute('data-mathpix-typeset', 'true');
                        }
                        catch (err) {
                            // Do not fail the whole render if one formula is broken.
                            // Consider logging or attaching an error marker if you want debugging visibility.
                            console.error('[renderMathInElement] Failed to typeset node:', err, mathEl);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (mathNodes_1_1 && !mathNodes_1_1.done && (_a = mathNodes_1.return)) _a.call(mathNodes_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return [2 /*return*/];
        }
    });
}); };
exports.renderMathInElement = renderMathInElement;
/**
 * Returns true when running in a browser environment (not SSR / Node).
 */
var isBrowser = function () {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
};
/**
 * Read config from the global `window.MathpixRenderConfig` if provided,
 * otherwise fall back to `defaultConfig`.
 *
 * Note: we intentionally read config at execution time (not module init time)
 * so apps can set `window.MathpixRenderConfig` before DOMContentLoaded.
 */
var getGlobalConfig = function () {
    return window.MathpixRenderConfig || defaultConfig;
};
/**
 * Auto-render math inside a root element (defaults to document.body).
 * This function is meant to be called once on page load.
 */
var autoRender = function () {
    // Prefer rendering inside a narrower scope if the integrator provides it.
    var config = getGlobalConfig();
    (0, exports.renderMathInElement)(document.body, config).catch(function (err) {
        console.error('[MathpixRender] autoRender failed:', err);
    });
};
// Auto-render on DOMContentLoaded (browser only).
if (isBrowser()) {
    // If DOM isn't ready, wait once; otherwise run immediately.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoRender, { once: true });
    }
    else {
        autoRender();
    }
    /**
     * Global API exposed for integrators (optional usage).
     * - `renderMathInElement`: render MathML/LaTeX content to SVG
     */
    window.MathpixRender = {
        renderMathInElement: exports.renderMathInElement
    };
}
//# sourceMappingURL=auto-render.js.map