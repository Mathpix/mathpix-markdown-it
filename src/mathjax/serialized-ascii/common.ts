import { TEXCLASS } from "mathjax-full/js/core/MmlTree/MmlNode";

export interface IAsciiData {
  ascii: string,
  ascii_tsv: string,
  ascii_csv: string,
  ascii_md: string,
}

export const regLetter: RegExp = /^[a-zA-Z]/;
export const regW: RegExp = /^\w/;

export const AddToAsciiData = (data: IAsciiData, arr: Array<string>, serialize, node = null): IAsciiData => {
  if (arr?.length > 3) {
    data.ascii += arr[0];
    data.ascii_tsv += arr[1];
    data.ascii_csv += arr[2];
    data.ascii_md += arr[3];
    pushToSerializedStack(serialize, {
      ascii: arr[0],
      ascii_tsv: arr[1],
      ascii_csv: arr[2],
      ascii_md: arr[3],
    }, node);
    return data;
  }
  data.ascii += arr[0];
  data.ascii_tsv += arr[0];
  data.ascii_csv += arr[0];
  data.ascii_md += arr[0];
  pushToSerializedStack(serialize, {
    ascii: arr[0],
    ascii_tsv: arr[0],
    ascii_csv: arr[0],
    ascii_md: arr[0],
  }, node);
  return data;
};

export const pushToSerializedStack = (serialize, data, node = null) => {
  if (serialize.notApplyToSerializedStack) {
    return;
  }
  if (!data.ascii && !data.ascii_tsv && !data.ascii_csv && !data.ascii_md) {
    return;
  }
  if (serialize.isSerializeChildStack) {
    if (serialize.serializedChildStack?.length) {
      let lastItem = serialize.serializedChildStack[serialize.serializedChildStack.length - 1];
      if (lastItem.ascii === data.ascii
        && lastItem.ascii_tsv === data.ascii_tsv
        && lastItem.ascii_csv === data.ascii_csv
        && lastItem.ascii_md === data.ascii_md
        && (!node 
          || lastItem.texClass === node.texClass
          || lastItem.kind === node.kind
        )
      ) {
        return;
      } else {
        serialize.serializedChildStack.push({...data,
          kind: node?.kind ? node?.kind : '',
          texClass: node ? node?.texClass : -1,
        })
      }
    } else {
      serialize.serializedChildStack.push({...data,
        kind: node?.kind ? node?.kind : '',
        texClass: node ? node?.texClass : -1,
      })
    }
  } else {
    if (serialize.serializedStack?.length) {
      let lastItem = serialize.serializedStack[serialize.serializedStack.length - 1];
      if (lastItem.ascii === data.ascii
        && lastItem.ascii_tsv === data.ascii_tsv
        && lastItem.ascii_csv === data.ascii_csv
        && lastItem.ascii_md === data.ascii_md
        && (!node
          || lastItem.texClass === node.texClass
          || lastItem.kind === node.kind
        )
      ) {
        return;
      } else {
        serialize.serializedStack.push({...data, 
          kind: node?.kind ? node?.kind : '',
          texClass: node ? node?.texClass : -1,
        })
      }
    } else {
      serialize.serializedStack.push({...data,
        kind: node?.kind ? node?.kind : '',
        texClass: node ? node?.texClass : -1,
      })
    }
  }
};

export const clearSerializedChildStack = (serialize) => {
  serialize.serializedChildStack = [];
};

export const getLastSymbolFromSerializedStack = (serialize): string => {
  let lastResAscii = null;
  if (serialize.isSerializeChildStack) {
    lastResAscii = serialize.serializedChildStack?.length
      ? serialize.serializedChildStack[serialize.serializedChildStack.length-1]
      : null;
  } else {
    lastResAscii = serialize.serializedStack?.length
      ? serialize.serializedStack[serialize.serializedStack.length-1]
      : null;
  }
  return lastResAscii && lastResAscii.ascii?.length
    ? lastResAscii.ascii[lastResAscii.ascii.length - 1]
    : '';
};

export const getLastItemFromSerializedStack = (serialize) => {
  let lastResAscii = null;
  if (serialize.isSerializeChildStack) {
    lastResAscii = serialize.serializedChildStack?.length
      ? serialize.serializedChildStack[serialize.serializedChildStack.length-1]
      : null;
  } else {
    lastResAscii = serialize.serializedStack?.length
      ? serialize.serializedStack[serialize.serializedStack.length-1]
      : null;
  }
  return lastResAscii;
};

export const needFirstSpaceBeforeLetter = (node, currentText, serialize) => {
  try {
    let lastResAscii = getLastItemFromSerializedStack(serialize);
    let lastSymbol = lastResAscii && lastResAscii.ascii?.length
      ? lastResAscii.ascii[lastResAscii.ascii.length - 1]
      : '';
    if (!regW.test(lastSymbol) || lastResAscii.kind === 'inferredMrow' || lastResAscii.kind === 'mtd') {
      return false;
    }
    if (lastResAscii.texClass === TEXCLASS.OP && regW.test(currentText[0])) {
      return true;
    }
    if (lastResAscii.kind === 'TeXAtom' && lastResAscii.texClass !== TEXCLASS.OP) {
      return false
    }
    if (regLetter.test(lastSymbol)) {
      return currentText?.length && regLetter.test(currentText[0]) 
        && (currentText?.length > 1 || lastResAscii.ascii?.trim()?.length > 1)
    } else {
      if (['mi', 'mo', 'mn'].includes(lastResAscii.kind)) {
        return currentText?.length > 1 && regLetter.test(currentText[0])
          && ((node.texClass === TEXCLASS.OP && node.kind === 'mi') 
            || (node.texClass === TEXCLASS.INNER && node.kind === 'mo'))
      } else {
        return currentText?.length > 1
          && regLetter.test(currentText[0])
      }
    }
  } catch (e) {
    return false
  }
};

export const needSpaceBetweenLetters = (strBefore: string, strAfter: string): boolean => {
  if (strBefore?.length && strAfter?.length) {
    return regLetter.test(strBefore[strBefore.length - 1])
      && regLetter.test(strAfter[0])
  }
  return false;
};

export const needFirstSpaceBeforeCurrentNode = (node, serialize) => {
  try {
    let isOperation = false;
    if (node.hasOwnProperty('texClass')) {
      isOperation = node.texClass === TEXCLASS.OP;
    } else {
      isOperation = node.parent?.texClass === TEXCLASS.OP;
    }
    let lastSymbol = getLastSymbolFromSerializedStack(serialize);
    return isOperation && regLetter.test(lastSymbol);
  } catch (e) {
    return false
  }
};
