import { tsvSeparatorsDef } from './consts';

export const TsvJoin = (tsv, options): string => {
  if (typeof tsv === "string") {
    return tsv;
  }
  const {tsv_separators = {...tsvSeparatorsDef}} = options.outMath;
  const {column, row} = tsv_separators;
  if (!tsv || tsv.length === 0 ) {
    return ''
  }
  return tsv.map(row => Array.isArray(row) ? row.join(column) : row).join(row)
};
