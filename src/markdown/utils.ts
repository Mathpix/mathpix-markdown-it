export const endTag = (arg: string): RegExp  => {
  return new RegExp('\\\\end\s{0,}\{(' + arg + ')\}')
};

export const getTextWidth = (): number => {
  const el_container = document ? document.getElementById('container-ruller') : null;
  return el_container ? el_container.offsetWidth : 800;
};

export const getWidthFromDocument = (cwidth = 1200) => {
  try {
    const el_container = document.getElementById('container-ruller');
    return el_container ? el_container.offsetWidth : 1200;
  } catch (e) {
    return cwidth;
  }
};

export const isNotBackticked = (str: string, tag: string): boolean => {
  let
    pos = 0,
    max = str.length,
    ch,
    escapes = 0,
    backTicked = false,
    lastBackTick = 0;

  ch  = str.charCodeAt(pos);
  let st = '';
  let st2 = '';
  let isIgnore = false;
  while (pos < max) {
    if (ch === 0x60/* ` */) {
      if (backTicked) {
        backTicked = false;
        lastBackTick = pos;
        if (st.includes(tag)) {
          isIgnore = true;
          st = ''
        }
      } else if (escapes % 2 === 0) {
        backTicked = true;
        lastBackTick = pos;
      }
    } else {
      if (backTicked) {
       // isIgnore = false;
        st += str[pos]
      } else {
        st2 += str[pos]
      }
    }

    if (ch === 0x5c/* \ */
      && (pos + 1 < max && str.charCodeAt(pos + 1) === 0x60)) {
      escapes++;
    } else {
      escapes = 0;
    }

    pos++;

    // If there was an un-closed backtick, go back to just after
    // the last backtick, but as if it was a normal character
    if (pos === max && backTicked) {
      backTicked = false;
      pos = lastBackTick + 1;
    }

    ch = str.charCodeAt(pos);
  }
  return !isIgnore || st2.includes(tag);
};

export const includesSimpleMathTag = (str: string, tag = '$$') => {
  return str.includes(tag) && isNotBackticked(str, tag);
};

export const includesMultiMathBeginTag = (str, tag): RegExp | null => {
  let result: RegExp | null = null;
  if (!tag.test(str)) {
    return result;
  }
  let match;
  for (let i = 0; i < str.length; i++) {
    result = null;
    const str1 = i < str.length ? str.slice(i) : '';
    match = str1 ? str1.match(tag) : null;
    if (!match) {
      break;
    }
    if (isNotBackticked(str, match[0])) {
      result = null;
      if (match[0] === "\\[" || match[0] === "\[") {
        result = /\\\]/;
      } else if (match[0] === "\\(" || match[0] === "\(") {
        result = /\\\)/;
      } else if (match[1]) {
        result = new RegExp(`\end{${match[1]}}`);
      }
      break;
    } else {
      i += match.index + match[0].length - 1;
    }
  }
  return result;
};

export const includesMultiMathTag = (str, tag): boolean => {
  let result = false;
  if (!tag.test(str)) {
    return result;
  }
  let match;
  for (let i = 0; i < str.length; i++) {
    result = false;
    const str1 = i < str.length ? str.slice(i) : '';
    match = str1 ? str1.match(tag) : null;
    if (!match) {
      break;
    }
    if (isNotBackticked(str, match[0])) {
      result = true;
      break;
    } else {
      i += match.index + match[0].length
    }
  }
  return result;
};


export const arraysCompare = (a1, a2) => {
  if (a1.length < 2 || a2.length < 2) {
    return false;
  }
  if (a1.length == a2.length) {
    return  a1.every((v,i)=>v === a2[i])
  } else {
    if (a1.length < a2.length ) {
      return a1.filter((item)=>a2.indexOf(item) === -1).length === 0
    } else {
      return a2.filter((item)=>a1.indexOf(item) === -1).length === 0
      // return a2.every((v,i)=>v === a1[i])
    }
  }
  // return a1.length == a2.length && a1.every((v,i)=>v === a2[i])
};


export const arrayDelElement = (arr, el) => {
  const index = arr.indexOf(el);

  if (index === -1) {
    return arr;
  }

  return arr.splice(index, 1);
};

export const arrayResortFromElement = (arr, el, notReverse = false, nextEl = -1) => {
  const index = arr.indexOf(el);
  const arrN1 = [...arr];
  const arrN2 = [...arr];

  if (index < arrN1.length-1 ){
    if (notReverse) {
      const arr1 = arrN1.splice(0, index);
      const arr2 = arrN2.splice(index+1);
      if (nextEl !== -1) {
        if (arr1.indexOf(nextEl) !== -1) {
          return [el].concat(arr1.reverse(), arr2.reverse())
        }
        if (arr2.indexOf(nextEl) !== -1) {
          return [el].concat(arr2, arr1)
        }
      }
      return [el].concat(arr1.reverse(), arr2.reverse())
      // return [el].concat(arr2, arr1)
    } else {
      const arr1 = arrN1.splice(0, index);
      const arr2 = arrN2.splice(index+1);
      return [el].concat(arr1.reverse(), arr2.reverse())
    }

  } else {
    const arr1 = arrN1.splice(0, index);
    if (notReverse) {
      return [el].concat(arr1)
    } else {
      return [el].concat(arr1.reverse())
    }
  }

};

export const uid = () => {
  return Date.now().toString(36)
    + Math.random().toString(36).substr(2);
};
