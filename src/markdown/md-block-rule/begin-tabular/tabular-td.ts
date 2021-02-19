import { TAttrs, TTokenTabular } from './index';
import {TDecimal} from "./common";

type TLines = {left?: string, right?: string, bottom?: string, top?: string};
type TAligns = {h?: string, v?: string, w?: string};

const verticalCellLine = (line: string, pos: string='left'): string => {
  let lines = line.split(' ');
  if (lines.length > 1) {
    return `border-${pos}-style: double !important; border-${pos}-width: 3px !important; `;
  } else {
    switch (lines[0]) {
      case '':
        return ``;
        //return `border-${pos}: none !important; `;
      case 'none':
        return `border-${pos}: none !important; `;
      case 'solid':
        return `border-${pos}-style: solid !important; border-${pos}-width: 1px !important; `;
      case 'double':
        return `border-${pos}-style: double !important; border-${pos}-width: 3px !important; `;
      case 'dashed':
        return `border-${pos}-style: dashed !important; border-${pos}-width: 1px !important; `;
      default:
        return `border-${pos}-style: solid !important; border-${pos}-width: 1px !important; `;
    }
  }
};

const horizontalCellLine = (line: string, pos: string='bottom'): string => {
  let lines = line.split(' ');
  if (lines.length > 1) {
    return `border-${pos}-style: double !important; border-${pos}-width: 3px !important; `;
  } else {
    switch (lines[0]) {
      case 'none':
        return `border-${pos}: none !important; `;
      case 'hline':
        return `border-${pos}-style: solid !important; border-${pos}-width: 1px !important; `;
      case 'hhline':
        return `border-${pos}-style: double !important; border-${pos}-width: 3px !important; `;
      case 'hdashline':
        return `border-${pos}-style: dashed !important; border-${pos}-width: 1px !important; `;
      default:
        return `border-${pos}: none !important; `;
    }
  }
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
  const width: string = w ? `width: ${w}; ` : '';
  const vAlign: string = v ? `vertical-align: ${v}; ` : '';
  return [ 'style', textAlign + borderLeft + borderRight + borderBottom + borderTop + width + vAlign];
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
  content = content.split('\n').join(' ');
  res.push({token:'td_open', type:'td_open', tag: 'td', n: 1, attrs: attrs});
  if (content) {
    if (decimal && parseFloat(content)) {
      let arr = content.split('.');
      let fr: string = (arr[1] ? new Array(decimal.r- arr[1].length).fill(0) : new Array(decimal.r).fill(0)).join('');
      let fl: string = (arr[0] ? new Array(decimal.l- arr[0].length).fill(0) : new Array(decimal.l).fill(0)).join('');
      if (arr[1]) {
        res.push({token:'inline_decimal', type:'inline_decimal', tag: '', n: 0, content: `${fl};${content};${fr}`,
          ascii: content,
          latex: content});
      } else {
        res.push({token:'inline_decimal', type:'inline_decimal', tag: '', n: 0, content: `${fl};${content};.${fr}`, ascii: content,
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
