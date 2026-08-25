"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render_enumerate_list_close = exports.render_itemize_list_close = exports.render_latex_list_item_close = exports.render_latex_list_item_open = exports.render_item_inline = exports.render_enumerate_list_open = exports.render_itemize_list_open = exports.resetListRenderDepth = void 0;
var tslib_1 = require("tslib");
var rules_1 = require("../rules");
var re_level_1 = require("./re-level");
var latex_list_tokens_1 = require("./latex-list-tokens");
var render_tabular_1 = require("../md-renderer-rules/render-tabular");
var common_1 = require("../highlight/common");
var convert_scv_to_base64_1 = require("../md-svg-to-base64/convert-scv-to-base64");
var consts_1 = require("../common/consts");
var utils_1 = require("../utils");
var warn_distinct_1 = require("../common/warn-distinct");
// data-padding-inline-start holds a machine-generated `Nem` (sole writer: list-items).
// Validate the shape before inlining, so only a bare em value can ever reach the style.
var PADDING_EM_RE = /^\d+(\.\d+)?em$/;
var markerPaddingStyle = function (padAttr) {
    if (!padAttr) {
        return "";
    }
    if (!PADDING_EM_RE.test(padAttr)) {
        // Dropped silently before, so an attribute a consumer set by hand read as no indent at all.
        (0, warn_distinct_1.warnDistinct)('padding-shape', '[list] data-padding-inline-start is not a bare em value, ignored', { value: padAttr });
        return "";
    }
    return "padding-inline-start: ".concat(padAttr, "; ");
};
var level_itemize = 0;
var level_enumerate = 0;
// Bumped per render, so a cache entry paired in an earlier one is not reused.
var renderEpoch = 0;
/** Render-time list state, module-level like the marker registries — zeroed per render. */
var resetListRenderDepth = function () {
    level_itemize = 0;
    level_enumerate = 0;
    resetAllEnumerateCounters();
    renderEpoch++;
};
exports.resetListRenderDepth = resetListRenderDepth;
// A lone surrogate makes `encodeURI` throw, and that took the whole document down.
var encodedMarker = function (content) {
    try {
        return encodeURI(content !== null && content !== void 0 ? content : '');
    }
    catch (e) {
        return '';
    }
};
// The host flag both list rules read, paired once per token array. Derived from the array rather than
// carried between calls, so an unbalanced slice has no opener to pair with and its close stays bare.
// Keyed by array identity, render epoch, and length plus the two end types. Reordering one in place
// and re-rendering it within the same render keeps the old answer, as `attrJoin` keeps old classes.
// The signature is O(1) by necessity: a checksum over the tokens would cost per query what this saves —
// 3200 queries over 9600 tokens at 800 lists.
var hostFlagsFor = new WeakMap();
var signatureOf = function (tokens) { var _a, _b, _c, _d; return tokens.length + ':' + ((_b = (_a = tokens[0]) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : '') + ':' + ((_d = (_c = tokens[tokens.length - 1]) === null || _c === void 0 ? void 0 : _c.type) !== null && _d !== void 0 ? _d : ''); };
var hostFlag = function (tokens, idx) {
    var sig = signatureOf(tokens);
    var cached = hostFlagsFor.get(tokens);
    if (!cached || cached.epoch !== renderEpoch || cached.sig !== sig) {
        cached = { epoch: renderEpoch, sig: sig, flags: (0, latex_list_tokens_1.listHostFlags)(tokens) };
        hostFlagsFor.set(tokens, cached);
    }
    return cached.flags[idx];
};
// The `<li>` a hosted list sits in. Its class follows the list that holds it, not the one it opens.
var hostItemOpen = function (flag) { return (flag === 1
    ? '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">'
    : '<li class="li_enumerate not_number" data-custom-marker="true" data-marker-empty="true" style="display: block">'); };
var listState = {
    enumerateCounters: [],
};
/**
 * Resets enumerate counters at the given nesting level.
 * Ensures the counters array is large enough, truncates deeper levels,
 * and sets the counter for `level` to zero (start of a new list at that level).
 *
 * @param level - Enumerate nesting level (1-based).
 */
var resetEnumerateCountersFromLevel = function (level) {
    var safeLevel = Math.max(1, level);
    var counters = listState.enumerateCounters;
    while (counters.length < safeLevel) {
        counters.push(0);
    }
    // Drop counters for deeper levels when a new list starts at this level.
    counters.length = safeLevel;
    counters[safeLevel - 1] = 0;
};
/**
 * Increments and returns the next enumerate index for the given nesting level.
 * Ensures the counters array is large enough and truncates deeper levels
 * (so returning to a higher level resets deeper numbering).
 *
 * @param level - Enumerate nesting level (1-based).
 * @returns The next 1-based item index for this enumerate level.
 */
var nextEnumerateIndex = function (level) {
    var _a;
    var safeLevel = Math.max(1, level);
    var counters = listState.enumerateCounters;
    while (counters.length < safeLevel) {
        counters.push(0);
    }
    // Drop deeper levels when we emit an item at this level.
    counters.length = safeLevel;
    counters[safeLevel - 1] = ((_a = counters[safeLevel - 1]) !== null && _a !== void 0 ? _a : 0) + 1;
    return counters[safeLevel - 1];
};
/**
 * Clears all enumerate counters for all nesting levels.
 * Useful when starting a fresh top-level enumerate list.
 */
var resetAllEnumerateCounters = function () {
    listState.enumerateCounters.length = 0;
};
var list_injectLineNumbers = function (tokens, idx, className) {
    if (className === void 0) { className = ''; }
    var line, endLine, listLine;
    if (tokens[idx].map) {
        line = tokens[idx].map[0];
        endLine = tokens[idx].map[1];
        listLine = [];
        for (var i = line; i < endLine; i++) {
            listLine.push(i);
        }
        tokens[idx].attrJoin("class", className + ' ' + rules_1.PREVIEW_PARAGRAPH_PREFIX + String(line)
            + ' ' + rules_1.PREVIEW_LINE_CLASS + ' ' + listLine.join(' '));
        tokens[idx].attrJoin("data_line_start", "".concat(String(line)));
        tokens[idx].attrJoin("data_line_end", "".concat(String(endLine - 1)));
        tokens[idx].attrJoin("data_line", "".concat(String([line, endLine])));
        tokens[idx].attrJoin("count_line", "".concat(String(endLine - line)));
        if (tokens[idx].hasOwnProperty('parentStart')) {
            tokens[idx].attrJoin("data_parent_line_start", "".concat(String(tokens[idx].parentStart)));
        }
    }
    else {
        tokens[idx].attrJoin("class", className);
    }
};
/**
 * Renderer for opening an itemize list (`itemize_list_open`).
 *
 * Responsibilities:
 *  - Tracks nested itemize depth with `level_itemize`.
 *  - Adds a base "itemize" class and optional line-numbering attributes.
 *  - For DOCX output (`options.forDocx`), computes custom bullet metadata
 *    (`data-custom-marker-type`, `data-custom-marker-content`) based on
 *    precomputed `itemizeLevel` and `itemizeLevelContents`.
 *  - Emits:
 *      - `<ul ... style="list-style-type: none">` for nested lists,
 *      - optionally wraps nested `<ul>` in `<li>` when a list is directly
 *        nested under another `itemize_list_open`.
 *  - Respects `data-padding-inline-start` (top-level and nested)
 *    (translating it into inline CSS `padding-inline-start`).
 */
var render_itemize_list_open = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    // Drift at or below zero; a positive level is the per-render reset's job. A list from a wrapper's
    // inline content claims top level, and resetting for it gave that list a level-1 marker.
    if (token.isTopLevelList && level_itemize <= 0) {
        level_itemize = 0;
    }
    level_itemize++;
    var dataAttr = "";
    var className = "itemize";
    // Attach line-numbering or basic class
    if (options === null || options === void 0 ? void 0 : options.lineNumbering) {
        list_injectLineNumbers(tokens, idx, className);
    }
    else {
        token.attrJoin("class", className);
    }
    // Translate data-padding-inline-start into inline style (top-level and nested).
    var paddingInlineStyle = markerPaddingStyle(token.attrGet("data-padding-inline-start"));
    // DOCX-specific: compute custom bullet metadata
    if (options.forDocx) {
        var itemizeLevelTokens = (0, re_level_1.GetItemizeLevelTokens)(token.itemizeLevel);
        if (level_itemize > 0 && itemizeLevelTokens.length >= level_itemize) {
            var itemizeLevelContents = (0, re_level_1.GetItemizeLevel)(token.itemizeLevelContents);
            if (itemizeLevelContents.length >= level_itemize) {
                var levelIndex = level_itemize - 1;
                var markerInfo = isTextMarkerTokens(itemizeLevelTokens[levelIndex], slf, options, env);
                dataAttr += " data-custom-marker-type=\"".concat(markerInfo.markerType, "\"");
                if (markerInfo.markerType === 'text') {
                    dataAttr += " data-custom-marker-content=\"".concat(encodedMarker(markerInfo.textContent), "\"");
                }
                else {
                    dataAttr += " data-custom-marker-content=\"".concat(encodedMarker(itemizeLevelContents[levelIndex]), "\"");
                }
            }
        }
    }
    var attrs = slf.renderAttrs(token) + dataAttr;
    // paddingInlineStyle is emitted per level (empty unless this list has a wide marker), so a
    // nested list reserves for its own markers instead of overflowing the container.
    var style = "".concat(paddingInlineStyle, "list-style-type: none");
    var ulOpen = "<ul".concat(attrs, " style=\"").concat(style, "\">");
    var host = hostFlag(tokens, idx);
    return host ? hostItemOpen(host) + ulOpen : ulOpen;
};
exports.render_itemize_list_open = render_itemize_list_open;
/**
 * Renderer for opening an enumerate list (`enumerate_list_open`).
 *
 * Responsibilities:
 *  - Tracks nested enumerate depth via `level_enumerate`.
 *  - Resolves the current list-style type (e.g. `decimal`, `lower-alpha`)
 *    from `token.enumerateLevel` with a fallback to `"decimal"`.
 *  - Adds CSS class `enumerate <style>` (e.g. `enumerate decimal`).
 *  - Injects line-numbering attributes when `options.lineNumbering` is enabled.
 *  - For DOCX (`options.forDocx`), adds `data-list-style-type="<style>"`.
 *  - Respects `data-padding-inline-start` (top-level and nested)
 *    and converts it into inline `padding-inline-start` CSS.
 */
var render_enumerate_list_open = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    // Same threshold as the itemize branch. The reset here is belt-and-braces: the per-level reset
    // below runs on every open and already clears what a previous list left.
    if (token.isTopLevelList && level_enumerate <= 0) {
        level_enumerate = 0;
        resetAllEnumerateCounters();
    }
    level_enumerate++;
    resetEnumerateCountersFromLevel(level_enumerate);
    var dataAttr = '';
    // Determine current enumerate style (e.g. decimal, lower-alpha, ...)
    var enumerateLevels = (0, re_level_1.GetEnumerateLevel)(token.enumerateLevel);
    var currentStyle = enumerateLevels.length >= level_enumerate
        ? enumerateLevels[level_enumerate - 1]
        : "decimal";
    var className = "enumerate ".concat(currentStyle);
    // Line numbering or basic class
    if (options === null || options === void 0 ? void 0 : options.lineNumbering) {
        list_injectLineNumbers(tokens, idx, className);
    }
    else {
        token.attrJoin("class", className);
    }
    // Map data-padding-inline-start → inline CSS (top-level and nested)
    var paddingInlineStyle = markerPaddingStyle(token.attrGet("data-padding-inline-start"));
    // DOCX: pass style type to consumer
    if (options.forDocx) {
        dataAttr = " data-list-style-type=\"".concat(currentStyle, "\"");
    }
    var attrs = slf.renderAttrs(token) + dataAttr;
    var style = "".concat(paddingInlineStyle, "list-style-type: ").concat(currentStyle);
    var olOpen = "<ol".concat(attrs, " style=\"").concat(style, "\">");
    var host = hostFlag(tokens, idx);
    return host ? hostItemOpen(host) + olOpen : olOpen;
};
exports.render_enumerate_list_open = render_enumerate_list_open;
var generateHtmlForMarkerTokens = function (markerTokens, slf, options, env) {
    var htmlMarker = '';
    var markerType = 'text';
    var textContent = '';
    if (markerTokens.length === 1 && consts_1.mathTokenTypes.includes(markerTokens[0].type)) {
        markerType = 'math';
        if (markerTokens[0].mathEquation) {
            try {
                var svg = '';
                var svgStart = markerTokens[0].mathEquation.indexOf('<svg');
                var svgEnd = markerTokens[0].mathEquation.indexOf('</mjx-container>');
                svg = svgStart >= 0 && svgEnd > 0 ? markerTokens[0].mathEquation.slice(svgStart, svgEnd) : '';
                var resSvg = (0, convert_scv_to_base64_1.default)(svg);
                htmlMarker += resSvg;
            }
            catch (e) {
                htmlMarker += markerTokens[0].mathEquation;
            }
        }
        else {
            htmlMarker += slf.renderInline([markerTokens[0]], options, env);
        }
        return {
            htmlMarker: htmlMarker,
            markerType: markerType,
            textContent: ''
        };
    }
    for (var j = 0; j < markerTokens.length; j++) {
        if (markerTokens[j].type !== 'text') {
            markerType = 'multi';
        }
        if (markerTokens[j].mathEquation) {
            try {
                var svg = '';
                var svgStart = markerTokens[j].mathEquation.indexOf('<svg');
                var svgEnd = markerTokens[j].mathEquation.indexOf('</mjx-container>');
                svg = svgStart >= 0 && svgEnd > 0 ? markerTokens[j].mathEquation.slice(svgStart, svgEnd) : '';
                var resSvg = (0, convert_scv_to_base64_1.default)(svg);
                htmlMarker += resSvg;
            }
            catch (e) {
                htmlMarker += markerTokens[j].mathEquation;
            }
            continue;
        }
        var renderdToken = slf.renderInline([markerTokens[j]], options, env);
        if (markerType === 'text') {
            textContent += renderdToken;
        }
        else {
            textContent = '';
        }
        htmlMarker += renderdToken;
    }
    return {
        htmlMarker: htmlMarker,
        markerType: markerType,
        textContent: textContent
    };
};
var isTextMarkerTokens = function (markerTokens, slf, options, env) {
    var markerType = 'text';
    if (markerTokens.length === 1 && consts_1.mathTokenTypes.includes(markerTokens[0].type)) {
        markerType = 'math';
        return {
            markerType: markerType,
            textContent: ''
        };
    }
    var textContent = '';
    for (var j = 0; j < markerTokens.length; j++) {
        if (markerTokens[j].type !== 'text') {
            markerType = 'multi';
            break;
        }
        textContent += slf.renderInline([markerTokens[j]], options, env);
    }
    return {
        markerType: markerType,
        textContent: textContent
    };
};
/**
 * Builds HTML for a custom \item[...] marker and reports whether the marker is empty.
 * "Empty" means: marker is present but contains only whitespace / no visible content.
 */
var generateHtmlForCustomMarker = function (token, options, slf, env) {
    var _a, _b, _c, _d, _e;
    var rawMarker = token.marker;
    var markerTokens = (_a = token.markerTokens) !== null && _a !== void 0 ? _a : [];
    // Marker is considered "present" only if \item[...] was used.
    var markerProvided = Object.prototype.hasOwnProperty.call(token, "marker");
    // Fast path: if we have raw marker string, use it to detect empty marker reliably.
    var hasNonEmptyMarker = markerProvided
        ? Boolean(rawMarker && rawMarker.trim().length > 0)
        : false;
    if (!markerProvided) {
        return { htmlMarker: "", markerType: "text", textContent: "", isMarkerEmpty: false };
    }
    if (options.forDocx) {
        var data = generateHtmlForMarkerTokens(markerTokens, slf, options, env);
        // Fallback empty check: if raw marker is missing, use extracted textContent
        var isEmpty = rawMarker != null
            ? rawMarker.trim().length === 0
            : ((_b = data.textContent) !== null && _b !== void 0 ? _b : "").trim().length === 0;
        return {
            htmlMarker: (_c = data.htmlMarker) !== null && _c !== void 0 ? _c : "",
            markerType: (_d = data.markerType) !== null && _d !== void 0 ? _d : "text",
            textContent: (_e = data.textContent) !== null && _e !== void 0 ? _e : "",
            isMarkerEmpty: isEmpty,
        };
    }
    // Non-DOCX path: render inline marker tokens if marker is non-empty.
    var htmlMarker = hasNonEmptyMarker
        ? slf.renderInline(markerTokens, options, env)
        : "";
    return {
        htmlMarker: htmlMarker,
        markerType: "text",
        textContent: "",
        isMarkerEmpty: !hasNonEmptyMarker,
    };
};
/**
 * Builds HTML marker information for list items that define a custom marker.
 *
 * Extracts the rendered marker (HTML) and assembles the corresponding
 * `data-*` attributes used for HTML and DOCX export.
 */
var buildCustomMarkerInfo = function (token, options, slf, env) {
    var dataAttrs = ['data-custom-marker="true"'];
    var data = generateHtmlForCustomMarker(token, options, slf, env);
    if (data === null || data === void 0 ? void 0 : data.isMarkerEmpty) {
        dataAttrs.push('data-marker-empty="true"');
    }
    var htmlMarker = data.htmlMarker;
    if (options.forDocx) {
        dataAttrs.push("data-custom-marker-type=\"".concat(data.markerType, "\""));
        var content = data.markerType === 'text'
            ? data.textContent
            : token.marker;
        dataAttrs.push("data-custom-marker-content=\"".concat(encodedMarker(content), "\""));
    }
    var dataAttr = dataAttrs.length ? ' ' + dataAttrs.join(' ') : '';
    return { htmlMarker: htmlMarker, dataAttr: dataAttr };
};
/**
 * Builds marker information for LaTeX-style itemize list items.
 *
 * If the token defines a custom marker, delegates to `buildCustomMarkerInfo`.
 * Otherwise, derives the marker from the itemize level tokens and, when
 * exporting to DOCX, attaches appropriate `data-*` attributes (including
 * math markers and their raw LaTeX content).
 */
var buildItemizeMarkerInfo = function (token, options, env, slf, level_itemize) {
    var itemizeLevelTokens = (0, re_level_1.GetItemizeLevelTokens)(token.itemizeLevel);
    var dataAttr = '';
    var htmlMarker = '·';
    if (token.hasOwnProperty('marker') && token.markerTokens) {
        return buildCustomMarkerInfo(token, options, slf, env);
    }
    if (level_itemize > 0 && itemizeLevelTokens.length >= level_itemize) {
        if (options.forDocx) {
            var data = generateHtmlForMarkerTokens(itemizeLevelTokens[level_itemize - 1], slf, options, env);
            htmlMarker = data.htmlMarker;
            if (data.markerType === 'math') {
                var itemizeLevel = (0, re_level_1.GetItemizeLevel)(token.itemizeLevelContents);
                if (itemizeLevel.length >= level_itemize) {
                    dataAttr += " data-custom-marker-content=\"".concat(encodedMarker(itemizeLevel[level_itemize - 1]), "\"");
                }
                dataAttr += ' data-custom-marker="true"';
                dataAttr += " data-custom-marker-type=\"".concat(data.markerType, "\"");
            }
        }
        else {
            htmlMarker = slf.renderInline(itemizeLevelTokens[level_itemize - 1], options, env);
        }
    }
    return { htmlMarker: htmlMarker, dataAttr: dataAttr };
};
// The `<li>` open tag every item branch builds: class through the line-numbering path when it is on,
// then the token's own attributes plus whatever the branch adds.
var openItemTag = function (tokens, index, options, slf, className, extra) {
    if (extra === void 0) { extra = ""; }
    if (options === null || options === void 0 ? void 0 : options.lineNumbering) {
        list_injectLineNumbers(tokens, index, className);
    }
    else {
        tokens[index].attrJoin("class", className);
    }
    return "<li".concat(slf.renderAttrs(tokens[index])).concat(extra, ">");
};
/**
 * Core renderer for LaTeX list items (both `enumerate` and `itemize`).
 *
 * Responsibilities:
 *  - Decide whether the current <li> belongs to LaTeX list context
 *    (`parentType` is "itemize" or "enumerate") or is just a plain HTML list.
 *  - Build the correct <li> markup for:
 *      - numbered lists (`enumerate`) with optional custom markers;
 *      - bulleted lists (`itemize`) with level-dependent markers;
 *  - Inject line-numbering classes when `options.lineNumbering` is enabled;
 *  - Add a leading non-breaking space for PPTX when the item begins
 *    with a math-only inline token;
 *  - Support two modes:
 *      - "open" — return only the opening part (no content, no closing </li>);
 *      - "full" — return opening tag, `content`, and closing </li>.
 */
var renderLatexListItemCore = function (tokens, index, options, env, slf, sContent, mode) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var token = tokens[index];
    var isOpen = mode === "open";
    var content = sContent !== null && sContent !== void 0 ? sContent : "";
    // Helper: should we insert an extra &nbsp; at the start for PPTX/math-only items?
    var needsPptxLeadingSpace = function () {
        var _a;
        if (!(options === null || options === void 0 ? void 0 : options.forPptx))
            return false;
        var next = tokens[index + 1];
        if ((next === null || next === void 0 ? void 0 : next.type) !== "inline" || !((_a = next.children) === null || _a === void 0 ? void 0 : _a.length))
            return false;
        var firstChild = next.children[0];
        return ["equation_math", "equation_math_not_number", "display_math"].includes(firstChild.type);
    };
    // Not in LaTeX list context at all → render a normal <li>
    if (token.parentType !== "itemize" && token.parentType !== "enumerate") {
        return isOpen ? "<li>" : "<li>".concat(content, "</li>");
    }
    var isEnumerate = token.parentType === "enumerate";
    // A chunk with no `\item` of its own: `<ul>` admits only `<li>`, but no marker and no number.
    // Inside `<ol>` that takes the same shape as a custom marker, or the browser counts it as an item.
    if ((_a = token.meta) === null || _a === void 0 ? void 0 : _a.markerEmpty) {
        // Same attribute pair the nested-list wrapper uses, so a consumer reading either tells this
        // apart from a written item; line numbering is attached like every other `<li>`.
        var base = isEnumerate ? 'li_enumerate not_number' : 'li_itemize';
        var marks = ' data-custom-marker="true" data-marker-empty="true"'
            + (isEnumerate ? ' style="display: block"' : '');
        var emptyOpen = openItemTag(tokens, index, options, slf, ((_b = token.meta) === null || _b === void 0 ? void 0 : _b.isBlock) ? "".concat(base, " block") : base, marks);
        return isOpen ? emptyOpen : "".concat(emptyOpen).concat(content, "</li>");
    }
    var dataAttr = "";
    var htmlMarker = "";
    // ENUMERATE
    if (isEnumerate) {
        var hasCustomMarker = token.hasOwnProperty('marker') && token.markerTokens;
        var enumerateLevel = Math.max(1, (_e = (_d = (_c = token.meta) === null || _c === void 0 ? void 0 : _c.enumerateLevel) !== null && _d !== void 0 ? _d : level_enumerate) !== null && _e !== void 0 ? _e : 1);
        var enumerateIndex = nextEnumerateIndex(enumerateLevel);
        token.meta = tslib_1.__assign(tslib_1.__assign({}, ((_f = token.meta) !== null && _f !== void 0 ? _f : {})), { enumerateLevel: enumerateLevel, enumerateIndex: enumerateIndex });
        // Case 1: custom marker (e.g. \item[foo])
        if (hasCustomMarker) {
            var markerInfo = buildCustomMarkerInfo(token, options, slf, env);
            dataAttr += markerInfo.dataAttr;
            htmlMarker = markerInfo.htmlMarker;
            var prefix_1 = openItemTag(tokens, index, options, slf, 'li_enumerate not_number', "".concat(dataAttr, " style=\"display: block\""))
                + "<span class=\"li_level\"".concat(dataAttr, ">").concat(htmlMarker, "</span>");
            if (isOpen) {
                return prefix_1;
            }
            return "".concat(prefix_1).concat(sContent, "</li>");
        }
        // Case 2: regular numbered enumerate element
        var prefix_2 = openItemTag(tokens, index, options, slf, ((_g = token.meta) === null || _g === void 0 ? void 0 : _g.isBlock) ? 'li_enumerate block' : 'li_enumerate');
        if (isOpen) {
            if (needsPptxLeadingSpace()) {
                return prefix_2 + "<span>&nbsp;</span>";
            }
            return prefix_2;
        }
        return "".concat(prefix_2).concat(sContent, "</li>");
    }
    // ITEMIZE
    var itemizeInfo = buildItemizeMarkerInfo(token, options, env, slf, level_itemize);
    token.meta = tslib_1.__assign(tslib_1.__assign({}, ((_h = token.meta) !== null && _h !== void 0 ? _h : {})), { itemizeLevel: level_itemize });
    htmlMarker = itemizeInfo.htmlMarker;
    dataAttr += itemizeInfo.dataAttr || "";
    var prefix = openItemTag(tokens, index, options, slf, ((_j = token.meta) === null || _j === void 0 ? void 0 : _j.isBlock) ? 'li_itemize block' : 'li_itemize', dataAttr)
        + "<span class=\"li_level\"".concat(dataAttr, ">").concat(htmlMarker, "</span>");
    if (isOpen) {
        if (needsPptxLeadingSpace()) {
            return prefix + "<span>&nbsp;</span>";
        }
        return prefix;
    }
    return "".concat(prefix).concat(sContent, "</li>");
};
/**
 * Renders the content of a LaTeX list item (`latex_list_item_open`).
 *
 * Responsibilities:
 *  - Renders child tokens (including nested inline/tabular content).
 *  - Marks math fragments with `data-math-in-text` when needed.
 *  - Applies highlight wrappers when `token.highlights` is present.
 *  - Adds a dummy `&nbsp;` for empty list items (to keep bullet visible).
 *  - Delegates final <li> markup to `renderLatexListItemCore`
 *    for plain / nested list cases.
 */
var render_item_inline = function (tokens, idx, options, env, slf) {
    var _a, _b, _c;
    var token = tokens[idx];
    var renderedContent = '';
    var children = (_a = token.children) !== null && _a !== void 0 ? _a : null;
    if (children && children.length > 0) {
        var content = "";
        for (var i = 0; i < children.length; i++) {
            var childToken = children[i];
            if (((_b = childToken === null || childToken === void 0 ? void 0 : childToken.children) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                // Nested inline content or special inline structures
                if (childToken.type === "tabular_inline") {
                    content = (0, render_tabular_1.renderTabularInline)(token.children, childToken, options, env, slf);
                }
                else {
                    content = slf.renderInline(childToken.children, options, env);
                }
            }
            else {
                if ((0, utils_1.isMathInText)(token.children, i, options)) {
                    childToken.attrSet('data-math-in-text', "true");
                }
                content = slf.renderInline([childToken], options, env);
                // For PPTX we prepend a non-breaking space before math-only first item
                if ((options === null || options === void 0 ? void 0 : options.forPptx)
                    && i === 0
                    && ['equation_math', 'equation_math_not_number', 'display_math'].includes(childToken.type)) {
                    content = '<span>&nbsp</span>' + content;
                }
            }
            renderedContent += content;
        }
    }
    // Apply highlighting if requested
    if (((_c = token.highlights) === null || _c === void 0 ? void 0 : _c.length) && (0, common_1.needToHighlightAll)(token)) {
        renderedContent = (0, common_1.highlightText)(token, renderedContent);
    }
    // If this <li> is not inside LaTeX itemize/enumerate → render simple <li>
    if (token.parentType !== "itemize" && token.parentType !== "enumerate") {
        return "<li>".concat(renderedContent, "</li>");
    }
    // Keep bullet visible for empty list items
    if (!renderedContent) {
        renderedContent = '&nbsp';
    }
    var nextToken = tokens[idx + 1];
    // Either kind: a sublist of either sort belongs inside the item. Equivalent today — no shape reaching
    // here opens an `enumerate`.
    if (nextToken && latex_list_tokens_1.LIST_OPEN_TYPES.has(nextToken.type)) {
        return renderLatexListItemCore(tokens, idx, options, env, slf, renderedContent, 'open');
    }
    return renderLatexListItemCore(tokens, idx, options, env, slf, renderedContent, 'full');
};
exports.render_item_inline = render_item_inline;
var render_latex_list_item_open = function (tokens, idx, options, env, slf) {
    if (options === void 0) { options = {}; }
    if (env === void 0) { env = {}; }
    return renderLatexListItemCore(tokens, idx, options, env, slf, null, 'open');
};
exports.render_latex_list_item_open = render_latex_list_item_open;
var render_latex_list_item_close = function () {
    return "</li>";
};
exports.render_latex_list_item_close = render_latex_list_item_close;
/**
 * Renderer for closing an itemize list (`itemize_list_close`).
 *
 * Decreases nested itemize depth and, when another `itemize_list_close`
 * follows immediately and we are still in nested context, outputs
 * `</ul></li>` to close both the nested list and its `<li>`.
 */
var render_itemize_list_close = function (tokens, idx, options, env, slf) {
    if (options === void 0) { options = {}; }
    if (env === void 0) { env = {}; }
    level_itemize--;
    return hostFlag(tokens, idx) ? "</ul></li>" : "</ul>";
};
exports.render_itemize_list_close = render_itemize_list_close;
var render_enumerate_list_close = function (tokens, idx, options, env, slf) {
    if (options === void 0) { options = {}; }
    if (env === void 0) { env = {}; }
    level_enumerate--;
    return hostFlag(tokens, idx) ? "</ol></li>" : "</ol>";
};
exports.render_enumerate_list_close = render_enumerate_list_close;
//# sourceMappingURL=render-latex-list-env.js.map