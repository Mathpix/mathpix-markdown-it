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

// Per-parse dedup cache for the concatenated style attribute of tabular <td>
// cells. A 16 MB MMD document with 165 tabulars produced ~400K <td> tokens
// whose style strings only had a few hundred unique values — V8 retained ~80 MB
// of duplicate style strings. Interning via this Map collapses them to a
// single shared instance. Cleared at the start of every md.parse() via the
// `reset_tabular_state` core rule (see mdPluginTableTabular).
const columnStyleCache = new Map<string, string>();

export const clearColumnStyleCache = (): void => {
  columnStyleCache.clear();
};

const internStyle = (style: string): string => {
  const cached = columnStyleCache.get(style);
  if (cached !== undefined) return cached;
  columnStyleCache.set(style, style);
  return style;
};

export const setColumnLines = (aligns: TAligns| null, lines: TLines): string[] => {
  const {left = '', right = '', bottom = '', top = ''} = lines;
  if (!aligns) {
    aligns = {h: '', v: '', w: ''}
  }
  const {h = '', v = '', w = ''} = aligns;
  const borderLeft: string = verticalCellLine(left, 'left');
  const borderRight: string = verticalCellLine(right, 'right');
  const borderBottom: string = horizontalCellLine(bottom, 'bottom');
  const borderTop: string = horizontalCellLine(top, 'top');
  const textAlign: string = `text-align: ${h
    ? h ==='decimal' ? 'center' : h
    : 'center'}; `;
  let width: string = '';
  if (w) {
    width = getLatexTextWidth(w, 1200);
    if (!width) {
      width = `width: ${w}; `
    }
  }
  const vAlign: string = v ? `vertical-align: ${v}; ` : '';
  const style: string = textAlign + borderLeft + borderRight + borderBottom + borderTop + width + vAlign;
  return [ 'style', internStyle(style)];
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
  const attrs: Array<TAttrs> = [];
  const slyleLines = setColumnLines(aligns, lines);

  attrs.push(slyleLines);
  if (space && space !== 'none') {
    addStyle(attrs, `padding-bottom: ${space} !important;`)
  }

  if (!content) {
    attrs.push(['class', '_empty'])
  }
  content = content.replace(preserveNewlineUnlessDoubleAngleUuidRegex, ' ');
  content = getExtractedCodeBlockContent(content, 0);
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
  res.push({token:'td_close', type:'td_close', tag: 'td', n: -1});
  return {res: res, content: content};
};

export const AddTdSubTable = (subTable: Array<TTokenTabular>, aligns: TAligns, lines: TLines): Array<TTokenTabular> => {
  let res: Array<TTokenTabular> = [];
  const attrs: Array<TAttrs> = [];
  const slyleLines = setColumnLines(aligns, lines);

  attrs.push(slyleLines);

  res.push({token:'td_open', type:'td_open', tag: 'td', n: 1, attrs: attrs});
  res = res.concat(subTable);
  res.push({token:'td_close', type:'td_close', tag: 'td', n: -1});
  return res;
};
