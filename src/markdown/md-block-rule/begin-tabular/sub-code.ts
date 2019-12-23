import { mathTablePush, getMathTableContent } from './sub-math';


export const codeInlineContent = (res, type: string = 'inline') => {
  res
    .filter(item => item.type === type)
    .map(item => {
      item.content = getMathTableContent(item.content, 0)
      return item
    });
  return res;
};

const getSubCodeBlock = (str: string): string  => {
  const match = str.match(/(?:```([^```]*)```)/);
  if (match) {
    const id: string = `f${(+new Date +  (Math.random()*100000).toFixed()).toString()}`;
    mathTablePush({id: id, content: match[0]});
    str = str.slice(0, match.index) + `{${id}}` + str.slice( match.index + match[0].length)
    str = getSubCodeBlock(str)
    return str
  } else {
    return str
  }
}

export const getSubCode = (str: string): string => {
  let c = '';
  let str2 = '';
  str = getSubCodeBlock(str);


  for (let ii = 0; ii< str.length; ii++) {
    if (str.charCodeAt(ii) === 0x60) {
      if (str.charCodeAt(ii+1) === 0x60) {
        ii += 1;
      }
      if (c.length === 0) {
        c += str[ii]
      } else {
        c += str[ii]
        const id: string = `f${(+new Date +  (Math.random()*100000).toFixed()).toString()}`;
        mathTablePush({id: id, content: c})
        str2 += `{${id}}`;
        c = ''
      }
    }
    if (c && str.charCodeAt(ii) !== 0x60) {
      c += str[ii]
    }
    if (c.length === 0 && str.charCodeAt(ii) !== 0x60) {
      str2 += str[ii];
    }
  }
  str2 += c;
  return str2;
};
