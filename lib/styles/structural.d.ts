/**
 * Layout declarations that carry document structure rather than decoration.
 *
 * Needed twice: in the stylesheet, and inline for targets that take no stylesheet — DOCX and the
 * Canvas LMS profile. One definition keeps the inline copy from drifting from the rule it mirrors.
 * `cssBlock` renders a declaration list the way the stylesheet writes it.
 */
/** The title block and the sections it opens. */
export declare const MAIN_TITLE_STYLE = "text-align: center; line-height: 1.2; margin: 0 auto 1em auto;";
export declare const AUTHOR_STYLE = "text-align: center; margin: 0 auto; display: flex; justify-content: center; flex-wrap: wrap;";
export declare const AUTHOR_COLUMN_STYLE = "min-width: 30%; max-width: 50%; padding: 0 7px;";
export declare const AUTHOR_ITEM_STYLE = "display: block; text-align: center;";
export declare const ABSTRACT_STYLE = "text-align: justify; margin-bottom: 1em;";
export declare const SECTION_TITLE_STYLE = "margin-top: 1.5em;";
export declare const MATH_INLINE_STYLE = "display: inline-flex; max-width: 100%;";
export declare const MATH_BLOCK_STYLE = "align-items: center; page-break-after: auto; page-break-inside: avoid; margin: 0; display: block;";
export declare const FIGURE_IMG_STYLE = "margin-bottom: 0.5em; overflow-x: auto;";
/**
 * A custom marker is set to the left of its item and only holds there as a pair: the item
 * establishes the containing block, the marker is positioned against it.
 */
export declare const LIST_ROOT_PADDING = "padding-inline-start: 40px;";
export declare const LIST_ROOT_MARGIN = "margin: 0 0 1em 0;";
export declare const LIST_ROOT_STYLE: string;
/** Only the margin: the base rule keeps indenting a nested list. */
export declare const NESTED_LIST_STYLE = "margin: 0;";
export declare const LIST_ITEM_STYLE = "position: relative; min-height: 1.4em; margin-bottom: 0;";
export declare const LIST_MARKER_STYLE = "position: absolute; right: 100%; white-space: nowrap; width: max-content; display: flex; justify-content: flex-end; padding-right: 10px; box-sizing: border-box;";
export declare const LIST_ITEM_CUSTOM_STYLE: string;
/** Inline the item is block: the renderer writes that itself, and an inline style beats the class. */
export declare const LIST_ITEM_CUSTOM_INLINE_STYLE: string;
export declare const LIST_ITEM_ENUMERATE_STYLE = "margin-bottom: 0;";
/** A markdown table draws its grid from the stylesheet alone: without one it arrives as bare text. */
export declare const TABLE_STYLE = "display: table; overflow: auto; max-width: 100%; border-collapse: collapse; page-break-inside: avoid; margin-bottom: 1em;";
export declare const TABLE_HEADER_STYLE = "text-align: center; font-weight: bold;";
/** The border colour is themed in the stylesheet; a Canvas page has no theme of ours to read. */
export declare const tableCellStyle: (borderColor: string) => string;
export declare const DEFAULT_BORDER_COLOR = "currentColor";
/** Centres a table by placing the table itself, which `text-align` would not do. */
export declare const TABLE_CENTER_STYLE = "margin-left: auto; margin-right: auto;";
export declare const TABLE_TABULAR_STYLE = "overflow-x: auto; padding: 0 2px 0.5em 2px;";
/** Without it a cell's text sits against its border. */
export declare const TABULAR_CELL_PADDING = "padding: 0.1em 0.5em !important;";
export declare const TABULAR_HEADER_PADDING = "padding: 6px 13px;";
export declare const TABULAR_STYLE = "display: inline-table !important; width: auto; table-layout: auto; border-collapse: collapse; border-spacing: 0; margin: 0 0 1em; font-size: inherit; height: fit-content;";
/** An empty cell has nothing to give it height, so it would collapse. */
export declare const TABULAR_EMPTY_CELL_STYLE = "height: 1.3em;";
/** Renders declarations the way the stylesheet writes them. */
export declare const cssBlock: (style: string) => string;
/** The same declarations as an inline style, in the form a Canvas page keeps. */
export declare const canvasInlineStyle: (style: string) => string;
