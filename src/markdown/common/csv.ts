import { csvSeparatorsDef } from './consts';

export const CsvJoin = (csv, options, isSub?): string => {
  const {csv_separators = {...csvSeparatorsDef}} = options.outMath;
  const {
    column = csvSeparatorsDef.column, 
    row = csvSeparatorsDef.row
  } = csv_separators;
  if (!csv || csv.length === 0 ) {
    return ''
  }
  if (typeof csv === "string") {
    return csv;
  }
  if (isSub) {
    return csv.map(row => Array.isArray(row) ? row.join(column) : row).join(row)
  } else {
    return csv.map(row => {
      row = Array.isArray(row)
        ? row.map(cell => escapesCsvField(cell, options))
        : escapesCsvField(row, options);
      return Array.isArray(row) ? row.join(column) : row
    }).join(row)
  }
};

export const escapesCsvField = (cell: string, options): string => {
  const { csv_separators = {...csvSeparatorsDef} } = options.outMath;
  const { toQuoteAllFields = false } = csv_separators;
  const regExpDoubleQuotes = /(")/g;
  const regExpSymbolsShouldBeEnclosed = /("|,|\r\n|\n|\r)/g;
  if (!cell) {
    return '';
  }
  if (regExpSymbolsShouldBeEnclosed.test(cell)) {
    cell = cell.replace(regExpDoubleQuotes, '""');
    return '"' + cell + '"'
  }
  return toQuoteAllFields ? '"' + cell + '"' : cell;
};
