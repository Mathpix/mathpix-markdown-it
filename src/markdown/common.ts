const hasProp = Object.prototype.hasOwnProperty;

export const tocRegexp = /^\[\[toc\]\]/im;

export const isSpace = (code) => {
    switch (code) {
        case 0x09:
        case 0x20:
            return true;
    }
    return false;
}

export const slugify = (s: string) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'));

export const uniqueSlug = (slug: string, slugs) => {
    let uniq: string = slug;
    let i: number = 2;
    while (hasProp.call(slugs, uniq)) uniq = `${slug}-${i++}`;
    slugs[uniq] = true;
    return uniq;
};

export const findEndMarker = (str: string, startPos: number = 0, beginMarker: string = "{", endMarker: string = "}", onlyEnd = false) => {
  let content: string = '';
  let nextPos: number = 0;
  if ( str[startPos] !== beginMarker && !onlyEnd ) {
    return { res: false }
  }
  let openBrackets = 1;
  let openCode = 0;

  for (let i = startPos + 1; i < str.length; i++) {
    const chr = str[i];
    nextPos = i;

    if ( chr === '`') {
      if (openCode > 0) {
        openCode--;
      } else {
        openCode++;
      }
    }

    if ( chr === beginMarker && openCode === 0) {
      content += chr;
      openBrackets++;
      continue;
    }

    if ( chr === endMarker && openCode === 0) {
      openBrackets--;
      if (openBrackets > 0) {
        content += chr;
        continue;
      }
      break;
    }

    content += chr;
  }
  if ( openBrackets > 0 ) {
    return {
      res: false,
      content: content
    }
  }

  return {
    res: true,
    content: content,
    nextPos: nextPos + endMarker.length
  };
};
