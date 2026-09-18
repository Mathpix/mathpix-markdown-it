/**
 * What the render rules need for the Canvas profile: the rules that describe an element by its
 * ancestors, which the profile cannot express because it sees one element at a time.
 *
 * Kept apart from `./index` so a render rule does not pull the sanitizer in with it.
 */
import {
  canvasInlineStyle, LIST_ROOT_STYLE, LIST_ROOT_PADDING, LIST_ROOT_MARGIN, NESTED_LIST_STYLE,
  LIST_ITEM_STYLE, LIST_MARKER_STYLE, LIST_ITEM_CUSTOM_INLINE_STYLE,
} from '../../styles/structural';

const escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;

const EMPTY_MARKER_ATTR = 'data-marker-empty';
const NO_LIST_STYLES = { marker: '', item: '', itemCustom: '' };

export interface ICanvasListStyles {
  marker: string;
  item: string;
  itemCustom: string;
}

/** Canvas takes no stylesheet, so a list carries its own indentation and spacing. */
export const canvasListRootStyle = (
  options: any,
  paddingInlineStyle: string,
  nested: boolean
): string => {
  if (!options?.forCanvas) {
    return paddingInlineStyle;
  }
  /** The base rule indents every list; the nested one only overrides the margin. */
  if (nested) {
    return canvasInlineStyle(LIST_ROOT_PADDING + NESTED_LIST_STYLE) + ' ';
  }
  const base = paddingInlineStyle
    ? `${paddingInlineStyle} ${LIST_ROOT_MARGIN}`
    : LIST_ROOT_STYLE;
  return canvasInlineStyle(base) + ' ';
};

/** A custom marker only stays put if its item positions it, so both carry a style. */
export const canvasListStyles = (options: any): ICanvasListStyles => {
  if (!options?.forCanvas) {
    return NO_LIST_STYLES;
  }
  return {
    marker: canvasInlineStyle(LIST_MARKER_STYLE),
    item: canvasInlineStyle(LIST_ITEM_STYLE),
    itemCustom: canvasInlineStyle(LIST_ITEM_CUSTOM_INLINE_STYLE),
  };
};

/** An empty marker span is a placeholder TinyMCE removes on save, so Canvas gets none. */
export const skipEmptyMarker = (options: any, dataAttr: string): boolean =>
  !!options?.forCanvas && dataAttr.includes(EMPTY_MARKER_ATTR);

/** Canvas deletes <svg> with its contents, so a structure is carried as its source instead. */
export const smilesSourceForCanvas = (smiles: string): string =>
  '<code class="smiles-source">' + escapeHtml(smiles) + '</code>';
