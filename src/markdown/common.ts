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

/** The function finds the position of the end marker in the specified string 
 * and returns that position and the content between the start and end markers.
 * 
 * In this case, if the line contains nested markers, 
 * then these layouts will be ignored and the search will continue until the end marker is found.
 *   For example, for the expression \section{Second $x+sqrt{4}$ Section $x$ \textbf{f} text}
 *     Need to find end marker } in line {Second $x+sqrt{4}$ Section $x$ \textbf{f} text}
 *     Here:
 *         {Second $x+sqrt{4}$ Section $x$ \textbf{f} text}
 *                        ^nested end markers {...} will be ignored
 *         {Second $x+sqrt{4}$ Section $x$ \textbf{f} text}
 *                                                        ^and the search will continue until it is found
 * The function returns an object containing the information:
 *     res: boolean, - Contains false if the end marker could not be found
 *     content?: string, - Contains content between start and end markers
 *     nextPos?: number - Contains the position of the end marker in the string
 * */
export const findEndMarker = (str: string, startPos: number = 0, beginMarker: string = "{", endMarker: string = "}", onlyEnd = false) => {
  let content: string = '';
  let nextPos: number = 0;
  if (str[startPos] !== beginMarker && !onlyEnd) {
    return { res: false }
  }
  let openBrackets = 1;
  let openCode = 0;
  let beforeCharCode: number = 0;
  for (let i = startPos + 1; i < str.length; i++) {
    const chr = str[i];
    nextPos = i;
    /** Inline code opening/closing marker (and it's not shielded '\`' )
     * beginMarker and endMarker will be ignored if they are inline code. */  
    if (chr === '`' && beforeCharCode !== 0x5c /* \ */) {
      if (openCode > 0) {
        openCode--;
      } else {
        openCode++;
      }
    }
    /** Found beginMarker and it is not inline code. (and it's not shielded '\{' )
     * We increase the counter of open tags <openBrackets> and continue the search */  
    if (chr === beginMarker && openCode === 0 && beforeCharCode !== 0x5c /* \ */) {
      content += chr;
      openBrackets++;
      continue;
    }
    /** Found endMarker and it is not inline code (and it's not shielded '\}' ) */
    if (chr === endMarker && openCode === 0 && beforeCharCode !== 0x5c /* \ */) {
      openBrackets--;
      if (openBrackets > 0) {
        /** Continue searching if not all open tags <openBrackets> have been closed */
        content += chr;
        continue;
      }
      break;
    }
    content += chr;
    beforeCharCode = str.charCodeAt(i);
  }
  if (openBrackets > 0) {
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
