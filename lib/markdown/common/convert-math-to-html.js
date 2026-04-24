"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMathToHtml = exports.endCacheBypass = exports.beginCacheBypass = exports.cleanupMathCache = exports.initMathCache = void 0;
var tslib_1 = require("tslib");
var mathjax_1 = require("../../mathjax/");
var utils_1 = require("../utils");
var labels_1 = require("./labels");
var consts_1 = require("../../helpers/consts");
var utils_2 = require("../../helpers/utils");
var consts_2 = require("./consts");
var parse_mmd_element_1 = require("../../helpers/parse-mmd-element");
var RE_MJX_ASSISTIVE_ID = /<mjx-assistive-mml[^>]*\bid="([^"]+)"/;
var MATHPIX_ENV_KEY = '__mathpix';
/** Called from init_math_cache hook at the start of every md.parse(). */
var initMathCache = function (state) {
    if (!state.env)
        state.env = {};
    state.env[MATHPIX_ENV_KEY] = {
        inlineCache: new Map(),
        displayCache: new Map(),
        cacheBypass: 0,
    };
};
exports.initMathCache = initMathCache;
/** Called from cleanup_math_cache hook at the end of every md.parse().
 *  The cache is for within-parse dedup only; after parse it's dead weight
 *  on env (holds MathJax html/svg strings for every unique expression). */
var cleanupMathCache = function (state) {
    var _a;
    var mx = (_a = state === null || state === void 0 ? void 0 : state.env) === null || _a === void 0 ? void 0 : _a[MATHPIX_ENV_KEY];
    if (!mx) {
        return;
    }
    mx.inlineCache.clear();
    mx.displayCache.clear();
    state.env[MATHPIX_ENV_KEY] = null;
};
exports.cleanupMathCache = cleanupMathCache;
var getMathpixEnv = function (state) { var _a; return ((_a = state === null || state === void 0 ? void 0 : state.env) === null || _a === void 0 ? void 0 : _a[MATHPIX_ENV_KEY]) || null; };
/** Begin a section where cache must not be used (options.outMath is temporarily mutated). */
var beginCacheBypass = function (state) {
    var mx = getMathpixEnv(state);
    if (mx)
        mx.cacheBypass++;
};
exports.beginCacheBypass = beginCacheBypass;
/** End a cache-bypass section. */
var endCacheBypass = function (state) {
    var mx = getMathpixEnv(state);
    if (mx && mx.cacheBypass > 0)
        mx.cacheBypass--;
};
exports.endCacheBypass = endCacheBypass;
/**
 * Returns true when token already contains MathML input (display or inline).
 * These tokens use a separate MathJax path: TypesetMathML().
 */
var isMathMLToken = function (token) {
    return token.type === 'display_mathML' || token.type === 'inline_mathML';
};
// Memoized per-outMath spread used by skipMathToHtml path — avoid 49K clones in hot path.
var skipSvgOutMathCache = new WeakMap();
var getOutMathWithSvgOff = function (outMath) {
    var cached = skipSvgOutMathCache.get(outMath);
    if (cached)
        return cached;
    var fresh = tslib_1.__assign(tslib_1.__assign({}, outMath), { include_svg: false });
    skipSvgOutMathCache.set(outMath, fresh);
    return fresh;
};
/**
 * Applies typesetting output to a token in place.
 * Invariant: mathData.svg is dropped at parse time unless `options.highlights`
 * is non-empty — mutating `options.highlights` between parse and render will
 * NOT re-populate it. Highlight render path re-computes svg in convertMathToHtmlWithHighlight.
 */
var applyTypesetResultToToken = function (token, res, options) {
    var _a, _b;
    var skipMathEquation = !!((_a = options === null || options === void 0 ? void 0 : options.outMath) === null || _a === void 0 ? void 0 : _a.skipMathToHtml);
    if (res.html != null && !skipMathEquation) {
        token.mathEquation = res.html;
    }
    if (res.data != null) {
        var keepSvgInMathData = !!((_b = options === null || options === void 0 ? void 0 : options.highlights) === null || _b === void 0 ? void 0 : _b.length);
        if (keepSvgInMathData || res.data.svg == null) {
            token.mathData = res.data;
        }
        else {
            var _c = res.data, svg = _c.svg, rest = tslib_1.__rest(_c, ["svg"]);
            token.mathData = rest;
        }
        token.widthEx = res.data.widthEx;
        token.heightEx = res.data.heightEx;
    }
    // Optional fields (present only when requested via outMath options)
    if (res.ascii != null) {
        token.ascii = res.ascii;
    }
    if (res.linear != null) {
        token.linear = res.linear;
    }
    if (res.ascii_tsv != null) {
        token.ascii_tsv = res.ascii_tsv;
    }
    if (res.ascii_csv != null) {
        token.ascii_csv = res.ascii_csv;
    }
    if (res.ascii_md != null) {
        token.ascii_md = res.ascii_md;
    }
    if (res.labels != null) {
        token.labels = res.labels;
    }
};
/**
 * Builds outMath options for AsciiMath/TSV/CSV/Markdown extraction.
 * Note: "tableTo*" options are enabled only for specific environments.
 */
var buildAsciiOutMath = function (outMath, token) {
    var shouldFlatten = consts_1.envArraysShouldBeFlattenInTSV.includes(token.math_env);
    return Object.assign({}, outMath, {
        optionAscii: {
            showStyle: false,
            extraBrackets: true,
            // We flatten arrays only for specific environments; otherwise output is noisy/unusable.
            tableToTsv: (outMath === null || outMath === void 0 ? void 0 : outMath.include_tsv) && shouldFlatten,
            tableToCsv: (outMath === null || outMath === void 0 ? void 0 : outMath.include_csv) && shouldFlatten,
            tableToMd: (outMath === null || outMath === void 0 ? void 0 : outMath.include_table_markdown) && shouldFlatten,
            isSubTable: token.isSubTable,
            // keep these defaults centralized in ./consts
            tsv_separators: tslib_1.__assign({}, consts_2.tsvSeparatorsDef),
            csv_separators: tslib_1.__assign({}, consts_2.csvSeparatorsDef),
            md_separators: tslib_1.__assign({}, consts_2.mdSeparatorsDef),
        },
    });
};
/**
 * Returns { html, data } for the requested output_format.
 * - output_format === 'latex': return original latex string (not MathJax HTML)
 * - output_format === 'mathml': we typically don't need extra SVG metrics
 * - default: return MathJax HTML + data (metrics)
 */
var buildFormatOutputs = function (params) {
    var outputFormat = params.outputFormat, inputLatex = params.inputLatex, renderedHtml = params.renderedHtml, renderedData = params.renderedData;
    var html = outputFormat === 'latex'
        ? (0, parse_mmd_element_1.formatSource)(inputLatex !== null && inputLatex !== void 0 ? inputLatex : '')
        : renderedHtml;
    var data = (outputFormat === 'latex' || outputFormat === 'mathml')
        ? null
        : renderedData;
    return { html: html, data: data };
};
/**
 * Typesets a single token according to its type and options:
 * - MathML tokens -> TypesetMathML()
 * - tokens requesting Ascii extraction -> TypesetSvgAndAscii()
 * - default -> Typeset()
 *
 * Performance note: for 'mathml' and 'latex' output formats, MathJax still runs
 * the full SVG rendering pipeline internally (the SVG is discarded by renderByFormat).
 * A future optimization could add a fast path that skips SVG generation for these formats.
 */
var typesetMathForToken = function (params) {
    var _a, _b, _c, _d, _e;
    var state = params.state, token = params.token, math = params.math, isBlock = params.isBlock, beginNumber = params.beginNumber, containerWidth = params.containerWidth, options = params.options;
    var outputFormat = (_a = options.outMath) === null || _a === void 0 ? void 0 : _a.output_format;
    // 1) MathML tokens: MathJax input is MathML (not TeX).
    if (isMathMLToken(token)) {
        var typeset_1 = mathjax_1.MathJax.TypesetMathML(math, {
            display: true,
            metric: { cwidth: containerWidth },
            outMath: options.outMath,
            accessibility: options.accessibility,
            renderingErrors: options.renderingErrors,
        });
        return {
            html: typeset_1.html,
            // For mathml output, SVG metrics are irrelevant — null out data.
            data: outputFormat === 'mathml' ? null : typeset_1.data,
        };
    }
    mathjax_1.MathJax.Reset(beginNumber); // Reset is important for equation numbering stability across tokens.
    // 2) Per-parse cache lookup for simple inline/display math.
    //    Numbered equations (equation_math*) are never cached — they advance the equation counter.
    //    Ascii-extraction tokens have side-effect options and are also excluded.
    //    Cache is bypassed when options.outMath is temporarily mutated (e.g. SetItemizeLevelTokens).
    var mx = getMathpixEnv(state);
    var cache = mx && mx.cacheBypass === 0
        ? (isBlock ? mx.displayCache : mx.inlineCache)
        : null;
    var isCacheable = !token.return_asciimath
        && (token.type === 'inline_math' || token.type === 'display_math');
    if (isCacheable && cache) {
        var cached = cache.get(math);
        if (cached) {
            var hitHtml = cached.html || '';
            var hitSvg = (_b = cached.data) === null || _b === void 0 ? void 0 : _b.svg;
            if (cached._mjxId) {
                var freshId = mathjax_1.MathJax.nextAssistiveId();
                hitHtml = hitHtml.split(cached._mjxId).join(freshId);
                if (hitSvg)
                    hitSvg = hitSvg.split(cached._mjxId).join(freshId);
            }
            var hitData = cached.data ? tslib_1.__assign(tslib_1.__assign({}, cached.data), { svg: hitSvg }) : cached.data;
            var _mjxId = cached._mjxId, rest = tslib_1.__rest(cached, ["_mjxId"]);
            var fmt_1 = buildFormatOutputs({
                outputFormat: outputFormat,
                inputLatex: token.inputLatex,
                renderedHtml: hitHtml, renderedData: hitData,
            });
            return tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, rest), { html: hitHtml, data: hitData }), fmt_1), { _labelsRegistered: true });
        }
    }
    // 3) AsciiMath extraction requested
    if (token.return_asciimath) {
        var typeset_2 = mathjax_1.MathJax.TypesetSvgAndAscii(math, {
            display: isBlock,
            metric: { cwidth: containerWidth },
            outMath: buildAsciiOutMath(options.outMath, token),
            mathJax: options.mathJax,
            accessibility: options.accessibility,
            renderingErrors: options.renderingErrors,
        });
        var fmt_2 = buildFormatOutputs({
            outputFormat: outputFormat,
            inputLatex: token.inputLatex,
            renderedHtml: typeset_2.html,
            renderedData: typeset_2.data,
        });
        return tslib_1.__assign(tslib_1.__assign({}, fmt_2), { ascii: typeset_2.ascii, linear: typeset_2.linear, ascii_tsv: typeset_2.ascii_tsv, ascii_csv: typeset_2.ascii_csv, ascii_md: typeset_2.ascii_md, labels: typeset_2.labels });
    }
    // 4) Default TeX typesetting. skipMathToHtml → force include_svg off; memoized clone keeps hot path allocation-free.
    var outMathForTypeset = ((_c = options.outMath) === null || _c === void 0 ? void 0 : _c.skipMathToHtml) && ((_d = options.outMath) === null || _d === void 0 ? void 0 : _d.include_svg) !== false
        ? getOutMathWithSvgOff(options.outMath)
        : options.outMath;
    var typeset = mathjax_1.MathJax.Typeset(math, {
        display: isBlock,
        metric: { cwidth: containerWidth },
        outMath: outMathForTypeset,
        mathJax: options.mathJax,
        forDocx: options.forDocx,
        forPptx: options.forPptx,
        accessibility: options.accessibility,
        nonumbers: options.nonumbers,
        renderingErrors: options.renderingErrors,
    });
    var rawResult = {
        html: typeset.html,
        data: typeset.data,
        ascii: typeset.ascii,
        linear: typeset.linear,
        ascii_tsv: typeset.ascii_tsv,
        ascii_csv: typeset.ascii_csv,
        ascii_md: typeset.ascii_md,
        labels: typeset.labels,
    };
    if (isCacheable && cache) {
        var mjxIdMatch = (_e = rawResult.html) === null || _e === void 0 ? void 0 : _e.match(RE_MJX_ASSISTIVE_ID);
        var entry = tslib_1.__assign(tslib_1.__assign({}, rawResult), { data: rawResult.data ? tslib_1.__assign({}, rawResult.data) : rawResult.data, labels: rawResult.labels ? tslib_1.__assign({}, rawResult.labels) : rawResult.labels });
        if (mjxIdMatch && mjxIdMatch[1])
            entry._mjxId = mjxIdMatch[1];
        cache.set(math, entry);
    }
    var fmt = buildFormatOutputs({
        outputFormat: outputFormat,
        inputLatex: token.inputLatex,
        renderedHtml: rawResult.html || '', renderedData: rawResult.data,
    });
    return tslib_1.__assign(tslib_1.__assign({}, rawResult), fmt);
};
/**
 * Converts a math token into HTML and attaches MathJax metadata to the token.
 * Also extracts equation labels and stores them in the shared labels list.
 */
var convertMathToHtml = function (state, token, options) {
    var math = token.content;
    var beginNumber = mathjax_1.MathJax.GetLastEquationNumber() + 1;
    try {
        var containerWidth = (options === null || options === void 0 ? void 0 : options.width) && options.width > 0
            ? options.width
            : (0, utils_1.getWidthFromDocument)(1200);
        var res = typesetMathForToken({
            state: state,
            token: token,
            math: math,
            isBlock: token.type !== 'inline_math',
            beginNumber: beginNumber,
            containerWidth: containerWidth,
            options: options,
        });
        applyTypesetResultToToken(token, res, options);
        // After typesetting, equation counter may have advanced.
        var number = mathjax_1.MathJax.GetLastEquationNumber();
        // Collect labels (e.g. \label{...}) so we can resolve refs later.
        // On cache hit the labels were already parsed & registered on first miss;
        // re-running inline.parse + addIntoLabelsList is idempotent for the same
        // key+content, so we skip the loop and only recompute idLabels.
        var idLabels = '';
        if (token.labels) {
            var labelKeys = Object.keys(token.labels);
            idLabels = labelKeys.length
                ? encodeURIComponent(labelKeys.join('_'))
                : '';
            if (!res._labelsRegistered) {
                for (var key in token.labels) {
                    var tagContent = token.labels[key].tag;
                    // Parse label content as inline markdown-it tokens
                    // so we can render it consistently in UI.
                    var tagChildrenTokens = [];
                    state.md.inline.parse(tagContent, state.md, state.env, tagChildrenTokens);
                    (0, labels_1.addIntoLabelsList)({
                        key: key,
                        id: idLabels,
                        tag: tagContent,
                        tagId: token.labels[key].id,
                        tagChildrenTokens: tagChildrenTokens,
                        type: labels_1.eLabelType.equation
                    });
                }
            }
        }
        token.idLabels = idLabels;
        token.number = number;
        token.begin_number = beginNumber;
        // attrNumber is "current equation number range" used by render rules
        token.attrNumber = beginNumber >= number
            ? number.toString()
            : "".concat(beginNumber, ",").concat(number);
        return token;
    }
    catch (e) {
        console.error('ERROR [convertMathToHtml] MathJax =>', e.message, e);
        (0, utils_2.formatMathJaxError)(e, math, 'convertMathToHtml');
        token.error = { message: e.message, error: e };
        return token;
    }
};
exports.convertMathToHtml = convertMathToHtml;
//# sourceMappingURL=convert-math-to-html.js.map