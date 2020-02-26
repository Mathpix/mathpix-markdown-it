var inner_tsv = [];
export const tsvPush = (item: Array<string>) => {
  inner_tsv.push(item);
};

export const getTsv = () => {
  return inner_tsv
};

export const clearTsv = () => {
  inner_tsv = [];
};

const renderColl = (coll, id, children) => {
  try {
    let i = coll.indexOf(id);
    if (i > -1) {
      if (children.length > 0) {
        let str = '';
        children.forEach(item => {
          str += str.length > 0 ? ' ' : '';
          str += item.type === 'tabular_inline' && item.tsvList ? item.tsvList.join(',') : item.content;
        });

        return coll.slice(0, i) + str + coll.slice(i + id.length)
      } else {
        return coll.slice(0, i) + inner_tsv.join(',') + coll.slice(i + id.length)
      }
    } else {
      return coll
    }
  } catch (e) {
    return coll;
  }
};

export const MergeIneerTsvToTsv = (inner_tsv, tsv, id, children) => {
  try {
    return tsv.map(item => {
      return item.map(coll => renderColl(coll, id, children));
    })
  } catch (e) {
    return tsv;
  }
};


export const TsvJoin = (tsv, options): string => {
  const {tsv_separators = {}} = options.outMath;
  const {column = '\t', row = '\n'} = tsv_separators;
  if (!tsv || tsv.length === 0 ) {
    return ''
  }
  return tsv.map(row => row.join(column)).join(row)
};

