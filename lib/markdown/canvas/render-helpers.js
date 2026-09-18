"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smilesSourceForCanvas = exports.skipEmptyMarker = exports.canvasListStyles = exports.canvasListRootStyle = void 0;
/**
 * What the render rules need for the Canvas profile: the rules that describe an element by its
 * ancestors, which the profile cannot express because it sees one element at a time.
 *
 * Kept apart from `./index` so a render rule does not pull the sanitizer in with it.
 */
var structural_1 = require("../../styles/structural");
var escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;
var EMPTY_MARKER_ATTR = 'data-marker-empty';
var NO_LIST_STYLES = { marker: '', item: '', itemCustom: '' };
/** Canvas takes no stylesheet, so a list carries its own indentation and spacing. */
var canvasListRootStyle = function (options, paddingInlineStyle, nested) {
    if (!(options === null || options === void 0 ? void 0 : options.forCanvas)) {
        return paddingInlineStyle;
    }
    /** The base rule indents every list; the nested one only overrides the margin. */
    if (nested) {
        return (0, structural_1.canvasInlineStyle)(structural_1.LIST_ROOT_PADDING + structural_1.NESTED_LIST_STYLE) + ' ';
    }
    var base = paddingInlineStyle
        ? "".concat(paddingInlineStyle, " ").concat(structural_1.LIST_ROOT_MARGIN)
        : structural_1.LIST_ROOT_STYLE;
    return (0, structural_1.canvasInlineStyle)(base) + ' ';
};
exports.canvasListRootStyle = canvasListRootStyle;
/** A custom marker only stays put if its item positions it, so both carry a style. */
var canvasListStyles = function (options) {
    if (!(options === null || options === void 0 ? void 0 : options.forCanvas)) {
        return NO_LIST_STYLES;
    }
    return {
        marker: (0, structural_1.canvasInlineStyle)(structural_1.LIST_MARKER_STYLE),
        item: (0, structural_1.canvasInlineStyle)(structural_1.LIST_ITEM_STYLE),
        itemCustom: (0, structural_1.canvasInlineStyle)(structural_1.LIST_ITEM_CUSTOM_INLINE_STYLE),
    };
};
exports.canvasListStyles = canvasListStyles;
/** An empty marker span is a placeholder TinyMCE removes on save, so Canvas gets none. */
var skipEmptyMarker = function (options, dataAttr) {
    return !!(options === null || options === void 0 ? void 0 : options.forCanvas) && dataAttr.includes(EMPTY_MARKER_ATTR);
};
exports.skipEmptyMarker = skipEmptyMarker;
/** Canvas deletes <svg> with its contents, so a structure is carried as its source instead. */
var smilesSourceForCanvas = function (smiles) {
    return '<code class="smiles-source">' + escapeHtml(smiles) + '</code>';
};
exports.smilesSourceForCanvas = smilesSourceForCanvas;
//# sourceMappingURL=render-helpers.js.map