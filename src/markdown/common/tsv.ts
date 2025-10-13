import { tsvSeparatorsDef } from './consts';

export const TsvJoin = (tsv, options): string => {
  const {tsv_separators = {...tsvSeparatorsDef}} = options.outMath;
  const {column, row} = tsv_separators;
  if (!tsv || tsv.length === 0 ) {
    return ''
  }
  return tsv.map(row => row.join(column)).join(row)
};

export const linerTsvJoin = (tsv): string => {
  if (!tsv || tsv.length === 0 ) {
    return '';
  }
  return tsv.map(row => Array.isArray(row) ? row.join(' ') : row).join('\n');
};
