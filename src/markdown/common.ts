import { terminatedRules } from './common/consts';
import { findBackTick } from "./utils";

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

export interface InlineCodeItem {
  marker: string,
  posStart: number,
  posEnd: number,
  content: string
}

const getInlineCodeListFromString = (str): Array<InlineCodeItem> => {
  let inlineCodeList: Array<InlineCodeItem> = [];
  if (!str || !str.trim()) {
    return inlineCodeList;
  }
  if (str.indexOf('`') === -1) {
    return inlineCodeList;
  }
  try {
    let pos = 0;
    let beforeCharCode: number = 0;
    let arrLines = str.split('\n\n');
    if (arrLines?.length) {
      for (let i = 0; i < arrLines.length; i++) {
        pos += i > 0 ? 2 : 0;
        let line = arrLines[i];
        if (!line || !line.trim() || line.indexOf('`') === -1) {
          pos += line?.length ? line.length : 0;
          continue;
        }
        for (let j = 0; j < line.length; j++) {
          const ch = line.charCodeAt(j);
          if (ch === 0x60/* ` */ && beforeCharCode !== 0x5c /* \ */) {
            const data = findBackTick(j, line);
            if (data.pending) {
              break;
            }
            inlineCodeList.push({
              marker: data.marker,
              posStart: pos + j,
              posEnd: pos + data.posEnd,
              content: str.slice(pos + j, pos + data.posEnd)
            });
            j = data.posEnd - 1;
          }
          beforeCharCode = ch;
        }
        pos += line?.length ? line.length : 0;
      }
    }
    return inlineCodeList;
  } catch (err) {
    console.log("[MMD]=>ERROR=>[getInlineCodeListFromString]=>", err);
    return inlineCodeList;
  }
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
export const findEndMarker = (str: string, startPos: number = 0, beginMarker: string = "{", endMarker: string = "}", onlyEnd = false, openBracketsBefore = 0) => {
  let content: string = '';
  let nextPos: number = 0;
  if (!str || !str.trim()) {
    return { res: false }
  }
  if (str[startPos] !== beginMarker && !onlyEnd) {
    return { res: false }
  }
  let openBrackets = openBracketsBefore ? openBracketsBefore : 1;
  let beforeCharCode: number = 0;
  let inlineCodeList: Array<InlineCodeItem> = getInlineCodeListFromString(str);
  for (let i = startPos + 1; i < str.length; i++) {
    const chr = str[i];
    nextPos = i;
    /** Found beginMarker and it is not inline code. (and it's not shielded '\{' )
     * We increase the counter of open tags <openBrackets> and continue the search */
    if (chr === beginMarker && beforeCharCode !== 0x5c /* \ */) {
      content += chr;
      let isCode = inlineCodeList?.length 
        ? inlineCodeList.find(item => item.posStart <= i && item.posEnd >= i)
        : null;
      if (!isCode) {
        openBrackets++;
      }
      continue;
    }
    /** Found endMarker and it is not inline code (and it's not shielded '\}' ) */
    if (chr === endMarker && beforeCharCode !== 0x5c /* \ */) {
      let isCode = inlineCodeList?.length  
        ? inlineCodeList.find(item => item.posStart <= i && item.posEnd >= i)
        : null;
      if (!isCode) {
        openBrackets--;
      }
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
      content: content,
      openBrackets: openBrackets
    }
  }
  return {
    res: true,
    content: content,
    nextPos: nextPos + endMarker.length,
    endPos: nextPos
  };
};

export const getTerminatedRules = (rule: string) => {
  if (terminatedRules.hasOwnProperty(rule)) {
    return [...terminatedRules[rule].terminated];
  }
  return [];
};

export const removeCaptionsFromTableAndFigure = (content: string) => {
  const captionTagBegin: RegExp = /\\caption\s{0,}\{/;
  let matchCaptionB = content.match(captionTagBegin);
  if (!matchCaptionB) {
    return {
      content: content,
      isNotCaption: true
    };
  }
  let data = findEndMarker(content, matchCaptionB.index + matchCaptionB[0].length - 1);
  if (!data.res) {
    return {
      content: content,
      isNotCaption: true
    };
  }
  let startCaption = matchCaptionB.index > 0 ? matchCaptionB.index - 1 : matchCaptionB.index;
  while (startCaption > 0) {
    const beforeStartMarker = content.charCodeAt(startCaption);
    if (!(beforeStartMarker  === 0x20 /* space */ || beforeStartMarker  === 0x09 /* \t */ || beforeStartMarker  === 0x0a /* \n */)) {
      startCaption += 1;
      break;
    }
    startCaption--;
  }
  let endCaption = data.nextPos;
  while (endCaption < content.length) {
    const afterEndMarker = content.charCodeAt(endCaption);
    if (!(afterEndMarker  === 0x20 /* space */ || afterEndMarker  === 0x09 /* \t */ || afterEndMarker  === 0x0a /* \n */)) {
      break;
    }
    endCaption++;
  }
  return {
    content: content.slice(0, startCaption) + content.slice(endCaption),
    isNotCaption: false
  };
}