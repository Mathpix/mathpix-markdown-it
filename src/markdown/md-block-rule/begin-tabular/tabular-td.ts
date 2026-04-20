import { TAttrs, TTokenTabular } from './index';
import { TDecimal } from "./common";
import { getLatexTextWidth } from "../../utils";
import { getExtractedCodeBlockContent } from "./sub-code";
import { preserveNewlineUnlessDoubleAngleUuidRegex } from "../../common/consts";

type TLines = {left?: string, right?: string, bottom?: string, top?: string};
type TAligns = {h?: string, v?: string, w?: string};

// Interned cell-border style strings. `verticalCellLine`/`horizontalCellLine`
// are invoked once per border per <td> — for large tabulars this is millions
// of calls with only ~8 unique return values per orientation. Pre-building the
// strings lets V8 share a single instance instead of re-allocating identical
// ~70-byte strings for every cell (heap-snapshot on a 16 MB MMD showed the
// top retainer was 395 125 copies of one such string = 96 MB).
const V_LEFT_NONE = 'border-left: none !important; ';
const V_LEFT_SOLID = 'border-left-style: solid !important; border-left-width: 1px !important; ';
const V_LEFT_DOUBLE = 'border-left-style: double !important; border-left-width: 3px !important; ';
const V_LEFT_DASHED = 'border-left-style: dashed !important; border-left-width: 1px !important; ';
const V_RIGHT_NONE = 'border-right: none !important; ';
const V_RIGHT_SOLID = 'border-right-style: solid !important; border-right-width: 1px !important; ';
const V_RIGHT_DOUBLE = 'border-right-style: double !important; border-right-width: 3px !important; ';
const V_RIGHT_DASHED = 'border-right-style: dashed !important; border-right-width: 1px !important; ';

const H_TOP_NONE = 'border-top: none !important; ';
const H_TOP_SOLID = 'border-top-style: solid !important; border-top-width: 1px !important; ';
const H_TOP_DOUBLE = 'border-top-style: double !important; border-top-width: 3px !important; ';
const H_TOP_DASHED = 'border-top-style: dashed !important; border-top-width: 1px !important; ';
const H_BOTTOM_NONE = 'border-bottom: none !important; ';
const H_BOTTOM_SOLID = 'border-bottom-style: solid !important; border-bottom-width: 1px !important; ';
const H_BOTTOM_DOUBLE = 'border-bottom-style: double !important; border-bottom-width: 3px !important; ';
const H_BOTTOM_DASHED = 'border-bottom-style: dashed !important; border-bottom-width: 1px !important; ';

const verticalCellLine = (line: string, pos: string = 'left'): string => {
  const lines = line.split(' ');
  const isLeft = pos === 'left';
  if (lines.length > 1) {
    return isLeft ? V_LEFT_DOUBLE : V_RIGHT_DOUBLE;
  }
  switch (lines[0]) {
    case '':
      return '';
    case 'none':
      return isLeft ? V_LEFT_NONE : V_RIGHT_NONE;
    case 'solid':
      return isLeft ? V_LEFT_SOLID : V_RIGHT_SOLID;
    case 'double':
      return isLeft ? V_LEFT_DOUBLE : V_RIGHT_DOUBLE;
    case 'dashed':
      return isLeft ? V_LEFT_DASHED : V_RIGHT_DASHED;
    default:
      return isLeft ? V_LEFT_SOLID : V_RIGHT_SOLID;
  }
};

const horizontalCellLine = (line: string, pos: string = 'bottom'): string => {
  const lines = line.split(' ');
  const isTop = pos === 'top';
  if (lines.length > 1) {
    return isTop ? H_TOP_DOUBLE : H_BOTTOM_DOUBLE;
  }
  switch (lines[0]) {
    case 'none':
      return isTop ? H_TOP_NONE : H_BOTTOM_NONE;
    case 'hline':
      return isTop ? H_TOP_SOLID : H_BOTTOM_SOLID;
    case 'hhline':
      return isTop ? H_TOP_DOUBLE : H_BOTTOM_DOUBLE;
    case 'hdashline':
      return isTop ? H_TOP_DASHED : H_BOTTOM_DASHED;
    default:
      return isTop ? H_TOP_NONE : H_BOTTOM_NONE;
  }
};

// Per-parse intern cache for tabular-cell style strings and for the whole
// attrs array attached to `td_open` tokens.
//
// On a 16 MB MMD document the 479K AddTd() calls produced only ~38 distinct
// style strings — the top one alone was used 393K times. Each call still
// allocated its own outer attrs array `[['style', X]]`, inner tuple, and two
// array-backing stores. `attrsSharedMarker`/`cellAttrsCache` dedupe the whole
// attrs structure so cells with identical (style + isEmpty + latex?) share
// one attrs instance, saving ~1M array allocations on this doc.
//
// Shared attrs must be treated as read-only. `tokenAttrSet` /
// `tokenAttrGet` in `md-renderer-rules/render-tabular.ts` clone attrs on
// first write via the `attrsSharedMarker` property.
const columnStyleCache = new Map<string, string>();
const cellAttrsCache = new Map<string, TAttrs[]>();

/**
 * Non-enumerable marker set on cached shared `attrs` arrays so that code
 * paths that mutate attrs (highlight, diagbox overlays) can detach a private
 * copy instead of corrupting every cell that shares the instance.
 *
 * Consumers check the marker via `(attrs as any)[attrsSharedMarker] === true`.
 * The marker is defined with `configurable: true` so the clone can clear it.
 */
export const attrsSharedMarker = Symbol.for('mathpix.tabular.attrsShared');

const markAttrsShared = (attrs: TAttrs[]): TAttrs[] => {
  Object.defineProperty(attrs, attrsSharedMarker, {
    value: true, enumerable: false, configurable: true, writable: true,
  });
  return attrs;
};

export const clearColumnStyleCache = (): void => {
  columnStyleCache.clear();
  cellAttrsCache.clear();
  TABLE_OPEN_ATTRS_CACHE.clear();
  TBODY_OPEN_ATTRS_CACHE.clear();
  TR_OPEN_ATTRS_SHARED = null;
};

const internStyle = (style: string): string => {
  const cached = columnStyleCache.get(style);
  if (cached !== undefined) return cached;
  columnStyleCache.set(style, style);
  return style;
};

/**
 * Builds the final style string for a tabular cell from the aligns/lines
 * descriptor and optional padding-bottom space. Returned string is interned
 * per-parse.
 */
const composeCellStyle = (aligns: TAligns | null, lines: TLines, space: string): string => {
  const {left = '', right = '', bottom = '', top = ''} = lines;
  if (!aligns) aligns = {h: '', v: '', w: ''};
  const {h = '', v = '', w = ''} = aligns;
  const borderLeft: string = verticalCellLine(left, 'left');
  const borderRight: string = verticalCellLine(right, 'right');
  const borderBottom: string = horizontalCellLine(bottom, 'bottom');
  const borderTop: string = horizontalCellLine(top, 'top');
  const textAlign: string = `text-align: ${h
    ? h === 'decimal' ? 'center' : h
    : 'center'}; `;
  let width: string = '';
  if (w) {
    width = getLatexTextWidth(w, 1200);
    if (!width) width = `width: ${w}; `;
  }
  const vAlign: string = v ? `vertical-align: ${v}; ` : '';
  const padding: string = space && space !== 'none' ? `padding-bottom: ${space} !important;` : '';
  const style = textAlign + borderLeft + borderRight + borderBottom + borderTop + width + vAlign + padding;
  return internStyle(style);
};

/**
 * Returns a read-only shared attrs array for a `<td>` cell. Tokens with the
 * same (style, isEmpty) pair reuse the same instance. Mutation paths must
 * clone first — see `attrsSharedMarker`.
 */
const getSharedCellAttrs = (style: string, isEmpty: boolean): TAttrs[] => {
  const key = isEmpty ? style + '\0E' : style;
  const cached = cellAttrsCache.get(key);
  if (cached) return cached;
  const attrs: TAttrs[] = isEmpty
    ? [['style', style], ['class', '_empty']]
    : [['style', style]];
  markAttrsShared(attrs);
  cellAttrsCache.set(key, attrs);
  return attrs;
};

// Shared attrs for the other tabular structural tokens. All of these are
// identical across thousands of tokens in a large document and were
// previously allocated fresh at each row/table — a 16 MB MMD produced 112K
// `tr_open` and 13K `table_open`/`tbody_open` tokens with duplicate attrs.
const TABLE_OPEN_ATTRS_CACHE = new Map<string, TAttrs[]>();
const TBODY_OPEN_ATTRS_CACHE = new Map<string, TAttrs[]>();
let TR_OPEN_ATTRS_SHARED: TAttrs[] | null = null;

const TR_OPEN_STYLE = 'border-top: none !important; border-bottom: none !important;';

export const getSharedTableOpenAttrs = (extraClass?: string): TAttrs[] => {
  const key = extraClass || '';
  const cached = TABLE_OPEN_ATTRS_CACHE.get(key);
  if (cached) return cached;
  const attrs: TAttrs[] = extraClass
    ? [['class', 'tabular'], ['data-type', extraClass]]
    : [['class', 'tabular']];
  markAttrsShared(attrs);
  TABLE_OPEN_ATTRS_CACHE.set(key, attrs);
  return attrs;
};

export const getSharedTbodyOpenAttrs = (numCol: number): TAttrs[] => {
  const key = numCol.toString();
  const cached = TBODY_OPEN_ATTRS_CACHE.get(key);
  if (cached) return cached;
  const attrs: TAttrs[] = [['data_num_col', key]];
  markAttrsShared(attrs);
  TBODY_OPEN_ATTRS_CACHE.set(key, attrs);
  return attrs;
};

export const getSharedTrOpenAttrs = (): TAttrs[] => {
  if (TR_OPEN_ATTRS_SHARED) return TR_OPEN_ATTRS_SHARED;
  const attrs: TAttrs[] = [['style', TR_OPEN_STYLE]];
  markAttrsShared(attrs);
  TR_OPEN_ATTRS_SHARED = attrs;
  return attrs;
};

// Shared close-token instances. `td_close` / `tr_close` / `table_close` carry
// no variable data (only the fixed `token`/`type`/`tag`/`n` shape) and are
// only read-accessed across the entire codebase — no mutation paths exist
// (verified by grep for `.token === 'td_close' =`, `.attrs.push`, etc.).
// Sharing a single frozen instance per kind saves ~670K plain-Object
// allocations on a 16 MB MMD document.
//
// NOTE: `tbody_close` is NOT shared because it carries a per-table `latex`
// payload (set from the last `\\hline` row when `forLatex: true`).
export const SHARED_TD_CLOSE: TTokenTabular = Object.freeze({
  token: 'td_close', type: 'td_close', tag: 'td', n: -1,
}) as TTokenTabular;
export const SHARED_TR_CLOSE: TTokenTabular = Object.freeze({
  token: 'tr_close', type: 'tr_close', tag: 'tr', n: -1,
}) as TTokenTabular;
export const SHARED_TABLE_CLOSE: TTokenTabular = Object.freeze({
  token: 'table_close', type: 'table_close', tag: 'table', n: -1,
}) as TTokenTabular;

/**
 * Backward-compatible helper: returns a single `['style', X]` tuple.
 * Kept for callers (AddTdSubTable, other code paths) that still build
 * non-shared attrs arrays; prefer `composeCellStyle` + `getSharedCellAttrs`
 * for hot paths.
 */
export const setColumnLines = (aligns: TAligns| null, lines: TLines): string[] => {
  const style = composeCellStyle(aligns, lines, '');
  return ['style', style];
};

export const addStyle = (attrs: any[], style: string): Array<TAttrs> => {
  let index: number = attrs.findIndex(item => item[0]==='style');
  if (index >= 0) {
    attrs[index][1] += style;
  } else {
    attrs.push([ 'style', style]);
  }
  return attrs;
};

export const addHLineIntoStyle = (attrs: any[], line: string = '', pos: string = 'bottom'): Array<TAttrs> => {
  const style: string = horizontalCellLine(line, pos);
  return addStyle(attrs, style);
};

export const AddTd = (content: string, aligns: TAligns| null, lines: TLines, space: string, decimal: TDecimal|null = null): {res: Array<TTokenTabular>, content: string} => {
  let res: Array<TTokenTabular> = [];
  const style = composeCellStyle(aligns, lines, space);
  content = content.replace(preserveNewlineUnlessDoubleAngleUuidRegex, ' ');
  content = getExtractedCodeBlockContent(content, 0);
  const attrs = getSharedCellAttrs(style, !content);
  res.push({token:'td_open', type:'td_open', tag: 'td', n: 1, attrs: attrs});
  if (content) {
    if (decimal && parseFloat(content)) {
      let arr = content.split('.');
      let fr: string = (arr[1] ? new Array(decimal.r- arr[1].length).fill(0) : new Array(decimal.r).fill(0)).join('');
      let fl: string = (arr[0] ? new Array(decimal.l- arr[0].length).fill(0) : new Array(decimal.l).fill(0)).join('');
      if (arr[1]) {
        res.push({token:'inline_decimal', type:'inline_decimal', tag: '', n: 0, content: `${fl};${content};${fr}`,
          ascii: content,
          ascii_tsv: content,
          ascii_csv: content,
          ascii_md: content,
          latex: content});
      } else {
        res.push({token:'inline_decimal', type:'inline_decimal', tag: '', n: 0, content: `${fl};${content};.${fr}`, 
          ascii: content, 
          ascii_tsv: content,
          ascii_csv: content,
          ascii_md: content,
          latex: content});
      }
    } else {
      res.push({token:'inline', type:'inline', tag: '', n: 0, content: content});
    }
  }
  res.push(SHARED_TD_CLOSE);
  return {res: res, content: content};
};

export const AddTdSubTable = (subTable: Array<TTokenTabular>, aligns: TAligns, lines: TLines): Array<TTokenTabular> => {
  let res: Array<TTokenTabular> = [];
  const attrs: Array<TAttrs> = [];
  const slyleLines = setColumnLines(aligns, lines);

  attrs.push(slyleLines);

  res.push({token:'td_open', type:'td_open', tag: 'td', n: 1, attrs: attrs});
  res = res.concat(subTable);
  res.push(SHARED_TD_CLOSE);
  return res;
};
