export const TsvJoin = (tsv, options): string => {
  const {tsv_separators = {}} = options.outMath;
  const {column = '\t', row = '\n'} = tsv_separators;
  if (!tsv || tsv.length === 0 ) {
    return ''
  }
  return tsv.map(row => row.join(column)).join(row)
};

