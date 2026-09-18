/**
 * Layout declarations that carry document structure rather than decoration.
 *
 * Needed twice: in the stylesheet, and inline for targets that take no stylesheet — DOCX and the
 * Canvas LMS profile. One definition keeps the inline copy from drifting from the rule it mirrors.
 * `cssBlock` renders a declaration list the way the stylesheet writes it.
 */

/** The title block and the sections it opens. */
export const MAIN_TITLE_STYLE = 'text-align: center; line-height: 1.2; margin: 0 auto 1em auto;';
export const AUTHOR_STYLE =
  'text-align: center; margin: 0 auto; display: flex; justify-content: center; flex-wrap: wrap;';
export const AUTHOR_COLUMN_STYLE = 'min-width: 30%; max-width: 50%; padding: 0 7px;';
export const AUTHOR_ITEM_STYLE = 'display: block; text-align: center;';
export const ABSTRACT_STYLE = 'text-align: justify; margin-bottom: 1em;';
export const SECTION_TITLE_STYLE = 'margin-top: 1.5em;';

export const MATH_INLINE_STYLE = 'display: inline-flex; max-width: 100%;';
export const MATH_BLOCK_STYLE =
  'align-items: center; page-break-after: auto; page-break-inside: avoid; margin: 0; display: block;';

export const FIGURE_IMG_STYLE = 'margin-bottom: 0.5em; overflow-x: auto;';

/**
 * A custom marker is set to the left of its item and only holds there as a pair: the item
 * establishes the containing block, the marker is positioned against it.
 */
export const LIST_ROOT_PADDING = 'padding-inline-start: 40px;';
export const LIST_ROOT_MARGIN = 'margin: 0 0 1em 0;';
export const LIST_ROOT_STYLE = `${LIST_ROOT_PADDING} ${LIST_ROOT_MARGIN}`;
/** Only the margin: the base rule keeps indenting a nested list. */
export const NESTED_LIST_STYLE = 'margin: 0;';
export const LIST_ITEM_STYLE = 'position: relative; min-height: 1.4em; margin-bottom: 0;';
export const LIST_MARKER_STYLE =
  'position: absolute; right: 100%; white-space: nowrap; width: max-content; display: flex; justify-content: flex-end; padding-right: 10px; box-sizing: border-box;';
const CUSTOM_ITEM_POSITION = 'position: relative;';
const CUSTOM_ITEM_REST = 'list-style-type: none; min-height: 1.4em;';
export const LIST_ITEM_CUSTOM_STYLE =
  `${CUSTOM_ITEM_POSITION} display: inline-block; ${CUSTOM_ITEM_REST}`;
/** Inline the item is block: the renderer writes that itself, and an inline style beats the class. */
export const LIST_ITEM_CUSTOM_INLINE_STYLE =
  `${CUSTOM_ITEM_POSITION} display: block; ${CUSTOM_ITEM_REST}`;
export const LIST_ITEM_ENUMERATE_STYLE = 'margin-bottom: 0;';

/** A markdown table draws its grid from the stylesheet alone: without one it arrives as bare text. */
export const TABLE_STYLE =
  'display: table; overflow: auto; max-width: 100%; border-collapse: collapse; page-break-inside: avoid; margin-bottom: 1em;';
export const TABLE_HEADER_STYLE = 'text-align: center; font-weight: bold;';
/** The border colour is themed in the stylesheet; a Canvas page has no theme of ours to read. */
export const tableCellStyle = (borderColor: string): string =>
  `border: 1px solid ${borderColor}; padding: 6px 13px;`;
export const DEFAULT_BORDER_COLOR = 'currentColor';

/** Centres a table by placing the table itself, which `text-align` would not do. */
export const TABLE_CENTER_STYLE = 'margin-left: auto; margin-right: auto;';

export const TABLE_TABULAR_STYLE = 'overflow-x: auto; padding: 0 2px 0.5em 2px;';
/** Without it a cell's text sits against its border. */
export const TABULAR_CELL_PADDING = 'padding: 0.1em 0.5em !important;';
export const TABULAR_HEADER_PADDING = 'padding: 6px 13px;';
export const TABULAR_STYLE =
  'display: inline-table !important; width: auto; table-layout: auto; border-collapse: collapse; border-spacing: 0; margin: 0 0 1em; font-size: inherit; height: fit-content;';
/** An empty cell has nothing to give it height, so it would collapse. */
export const TABULAR_EMPTY_CELL_STYLE = 'height: 1.3em;';

const DECLARATION_SEPARATOR = ';';
const PROPERTY_SEPARATOR = ':';
/** The stylesheet writes one declaration per line, indented two spaces. */
const BLOCK_SEPARATOR = ';\n  ';
const INLINE_SEPARATOR = '; ';

/** Print hints; a screen target ignores them, so an inline copy only adds a difference. */
const PRINT_ONLY_PROPS = ['page-break-after', 'page-break-inside', 'page-break-before'];

/** Absent from the Canvas allowlist, so they would be stripped on save. */
const REJECTED_BY_CANVAS = ['box-sizing', 'font-weight'];

/** Canvas has no logical properties, so they travel as their physical equivalents. */
const PHYSICAL_PROPERTY: Record<string, string> = {
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
const splitDeclarations = (style: string): string[] =>
  style
    .split(DECLARATION_SEPARATOR)
    .map(declaration => declaration.trim())
    .filter(declaration => declaration.includes(PROPERTY_SEPARATOR));

const propertyOf = (declaration: string): string =>
  declaration.slice(0, declaration.indexOf(PROPERTY_SEPARATOR)).trim();

/** Kept verbatim, so the spacing the constant was written with survives. */
const valuePartOf = (declaration: string): string =>
  declaration.slice(declaration.indexOf(PROPERTY_SEPARATOR) + 1);

const join = (declarations: string[], separator: string): string =>
  declarations.length ? declarations.join(separator) + DECLARATION_SEPARATOR : '';

/** Renders declarations the way the stylesheet writes them. */
export const cssBlock = (style: string): string =>
  join(splitDeclarations(style), BLOCK_SEPARATOR);

/** The same declarations as an inline style, in the form a Canvas page keeps. */
export const canvasInlineStyle = (style: string): string => {
  const kept = splitDeclarations(style)
    .filter(declaration => {
      const prop = propertyOf(declaration);
      return !PRINT_ONLY_PROPS.includes(prop) && !REJECTED_BY_CANVAS.includes(prop);
    })
    .map(declaration => {
      const prop = propertyOf(declaration);
      return (PHYSICAL_PROPERTY[prop] || prop) + PROPERTY_SEPARATOR + valuePartOf(declaration);
    });
  return join(kept, INLINE_SEPARATOR);
};
