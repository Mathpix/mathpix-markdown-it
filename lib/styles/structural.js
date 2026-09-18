"use strict";
/**
 * Layout declarations that carry document structure rather than decoration.
 *
 * Needed twice: in the stylesheet, and inline for targets that take no stylesheet — DOCX and the
 * Canvas LMS profile. One definition keeps the inline copy from drifting from the rule it mirrors.
 * `cssBlock` renders a declaration list the way the stylesheet writes it.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.canvasInlineStyle = exports.cssBlock = exports.TABULAR_EMPTY_CELL_STYLE = exports.TABULAR_STYLE = exports.TABULAR_HEADER_PADDING = exports.TABULAR_CELL_PADDING = exports.TABLE_TABULAR_STYLE = exports.TABLE_CENTER_STYLE = exports.DEFAULT_BORDER_COLOR = exports.tableCellStyle = exports.TABLE_HEADER_STYLE = exports.TABLE_STYLE = exports.LIST_ITEM_ENUMERATE_STYLE = exports.LIST_ITEM_CUSTOM_INLINE_STYLE = exports.LIST_ITEM_CUSTOM_STYLE = exports.LIST_MARKER_STYLE = exports.LIST_ITEM_STYLE = exports.NESTED_LIST_STYLE = exports.LIST_ROOT_STYLE = exports.LIST_ROOT_MARGIN = exports.LIST_ROOT_PADDING = exports.FIGURE_IMG_STYLE = exports.MATH_BLOCK_STYLE = exports.MATH_INLINE_STYLE = exports.SECTION_TITLE_STYLE = exports.ABSTRACT_STYLE = exports.AUTHOR_ITEM_STYLE = exports.AUTHOR_COLUMN_STYLE = exports.AUTHOR_STYLE = exports.MAIN_TITLE_STYLE = void 0;
/** The title block and the sections it opens. */
exports.MAIN_TITLE_STYLE = 'text-align: center; line-height: 1.2; margin: 0 auto 1em auto;';
exports.AUTHOR_STYLE = 'text-align: center; margin: 0 auto; display: flex; justify-content: center; flex-wrap: wrap;';
exports.AUTHOR_COLUMN_STYLE = 'min-width: 30%; max-width: 50%; padding: 0 7px;';
exports.AUTHOR_ITEM_STYLE = 'display: block; text-align: center;';
exports.ABSTRACT_STYLE = 'text-align: justify; margin-bottom: 1em;';
exports.SECTION_TITLE_STYLE = 'margin-top: 1.5em;';
exports.MATH_INLINE_STYLE = 'display: inline-flex; max-width: 100%;';
exports.MATH_BLOCK_STYLE = 'align-items: center; page-break-after: auto; page-break-inside: avoid; margin: 0; display: block;';
exports.FIGURE_IMG_STYLE = 'margin-bottom: 0.5em; overflow-x: auto;';
/**
 * A custom marker is set to the left of its item and only holds there as a pair: the item
 * establishes the containing block, the marker is positioned against it.
 */
exports.LIST_ROOT_PADDING = 'padding-inline-start: 40px;';
exports.LIST_ROOT_MARGIN = 'margin: 0 0 1em 0;';
exports.LIST_ROOT_STYLE = "".concat(exports.LIST_ROOT_PADDING, " ").concat(exports.LIST_ROOT_MARGIN);
/** Only the margin: the base rule keeps indenting a nested list. */
exports.NESTED_LIST_STYLE = 'margin: 0;';
exports.LIST_ITEM_STYLE = 'position: relative; min-height: 1.4em; margin-bottom: 0;';
exports.LIST_MARKER_STYLE = 'position: absolute; right: 100%; white-space: nowrap; width: max-content; display: flex; justify-content: flex-end; padding-right: 10px; box-sizing: border-box;';
var CUSTOM_ITEM_POSITION = 'position: relative;';
var CUSTOM_ITEM_REST = 'list-style-type: none; min-height: 1.4em;';
exports.LIST_ITEM_CUSTOM_STYLE = "".concat(CUSTOM_ITEM_POSITION, " display: inline-block; ").concat(CUSTOM_ITEM_REST);
/** Inline the item is block: the renderer writes that itself, and an inline style beats the class. */
exports.LIST_ITEM_CUSTOM_INLINE_STYLE = "".concat(CUSTOM_ITEM_POSITION, " display: block; ").concat(CUSTOM_ITEM_REST);
exports.LIST_ITEM_ENUMERATE_STYLE = 'margin-bottom: 0;';
/** A markdown table draws its grid from the stylesheet alone: without one it arrives as bare text. */
exports.TABLE_STYLE = 'display: table; overflow: auto; max-width: 100%; border-collapse: collapse; page-break-inside: avoid; margin-bottom: 1em;';
exports.TABLE_HEADER_STYLE = 'text-align: center; font-weight: bold;';
/** The border colour is themed in the stylesheet; a Canvas page has no theme of ours to read. */
var tableCellStyle = function (borderColor) {
    return "border: 1px solid ".concat(borderColor, "; padding: 6px 13px;");
};
exports.tableCellStyle = tableCellStyle;
exports.DEFAULT_BORDER_COLOR = 'currentColor';
/** Centres a table by placing the table itself, which `text-align` would not do. */
exports.TABLE_CENTER_STYLE = 'margin-left: auto; margin-right: auto;';
exports.TABLE_TABULAR_STYLE = 'overflow-x: auto; padding: 0 2px 0.5em 2px;';
/** Without it a cell's text sits against its border. */
exports.TABULAR_CELL_PADDING = 'padding: 0.1em 0.5em !important;';
exports.TABULAR_HEADER_PADDING = 'padding: 6px 13px;';
exports.TABULAR_STYLE = 'display: inline-table !important; width: auto; table-layout: auto; border-collapse: collapse; border-spacing: 0; margin: 0 0 1em; font-size: inherit; height: fit-content;';
/** An empty cell has nothing to give it height, so it would collapse. */
exports.TABULAR_EMPTY_CELL_STYLE = 'height: 1.3em;';
var DECLARATION_SEPARATOR = ';';
var PROPERTY_SEPARATOR = ':';
/** The stylesheet writes one declaration per line, indented two spaces. */
var BLOCK_SEPARATOR = ';\n  ';
var INLINE_SEPARATOR = '; ';
/** Print hints; a screen target ignores them, so an inline copy only adds a difference. */
var PRINT_ONLY_PROPS = ['page-break-after', 'page-break-inside', 'page-break-before'];
/** Absent from the Canvas allowlist, so they would be stripped on save. */
var REJECTED_BY_CANVAS = ['box-sizing', 'font-weight'];
/** Canvas has no logical properties, so they travel as their physical equivalents. */
var PHYSICAL_PROPERTY = {
    'padding-inline-start': 'padding-left',
    'padding-inline-end': 'padding-right',
    'margin-inline-start': 'margin-left',
    'margin-inline-end': 'margin-right',
};
/**
 * Splits the constants above, which are literals written in this file — no value here carries a
 * separator of its own. Arbitrary CSS is parsed by postcss instead, in the Canvas profile.
 * Anything without a property separator is not a declaration and is left out.
 */
var splitDeclarations = function (style) {
    return style
        .split(DECLARATION_SEPARATOR)
        .map(function (declaration) { return declaration.trim(); })
        .filter(function (declaration) { return declaration.includes(PROPERTY_SEPARATOR); });
};
var propertyOf = function (declaration) {
    return declaration.slice(0, declaration.indexOf(PROPERTY_SEPARATOR)).trim();
};
/** Kept verbatim, so the spacing the constant was written with survives. */
var valuePartOf = function (declaration) {
    return declaration.slice(declaration.indexOf(PROPERTY_SEPARATOR) + 1);
};
var join = function (declarations, separator) {
    return declarations.length ? declarations.join(separator) + DECLARATION_SEPARATOR : '';
};
/** Renders declarations the way the stylesheet writes them. */
var cssBlock = function (style) {
    return join(splitDeclarations(style), BLOCK_SEPARATOR);
};
exports.cssBlock = cssBlock;
/** The same declarations as an inline style, in the form a Canvas page keeps. */
var canvasInlineStyle = function (style) {
    var kept = splitDeclarations(style)
        .filter(function (declaration) {
        var prop = propertyOf(declaration);
        return !PRINT_ONLY_PROPS.includes(prop) && !REJECTED_BY_CANVAS.includes(prop);
    })
        .map(function (declaration) {
        var prop = propertyOf(declaration);
        return (PHYSICAL_PROPERTY[prop] || prop) + PROPERTY_SEPARATOR + valuePartOf(declaration);
    });
    return join(kept, INLINE_SEPARATOR);
};
exports.canvasInlineStyle = canvasInlineStyle;
//# sourceMappingURL=structural.js.map