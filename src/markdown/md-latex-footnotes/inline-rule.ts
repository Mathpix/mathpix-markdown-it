import { RuleInline } from 'markdown-it';
import { findEndMarker } from "../common";
const isSpace = require('markdown-it/lib/common/utils').isSpace;
import {
  reFootNote,
  reFootNoteMark,
  reFootNoteText,
  reNumber 
} from "../common/consts";

export const latex_footnote: RuleInline = (state, silent) => {
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  let max = state.posMax;
  let nextPos: number = startPos;
  const match: RegExpMatchArray = state.src
    .slice(startPos)
    .match(reFootNote);

  if (!match) {
    return false;
  }
  let latex = match[0];
  nextPos += match[0].length;
  // \footnote {text}
  //          ^^ skipping these spaces
  for (; nextPos < max; nextPos++) {
    const code = state.src.charCodeAt(nextPos);
    if (!isSpace(code) && code !== 0x0A) { break; }
    latex += state.src[nextPos];
  }
  if (nextPos >= max) {
    return false;
  }
  // \footnote{text} or \footnote[number]{text}
  //          ^^ should be {     ^^ should be [
  if (state.src.charCodeAt(nextPos) !== 123 /* { */
    && state.src.charCodeAt(nextPos) !== 0x5B/* [ */) {
    return false;
  }
  let data = null;
  let envText = '';
  let numbered = undefined;
  if (state.src.charCodeAt(nextPos) === 123 /* { */) {
    latex += state.src[nextPos];
    data = findEndMarker(state.src, nextPos);
  } else {
    data = null;
    let dataNumbered = findEndMarker(state.src, nextPos, "[", "]");
    if (!dataNumbered || !dataNumbered.res) {
      return false; /** can not find end marker */
    }
    numbered = dataNumbered.content;
    if (numbered?.trim() && !reNumber.test(numbered)) {
      return false;
    } 
    nextPos = dataNumbered.nextPos;
    if (nextPos < max) {
      // \footnote[numbered]  {text}
      //                    ^^ skipping these spaces
      for (; nextPos < max; nextPos++) {
        const code = state.src.charCodeAt(nextPos);
        if (!isSpace(code) && code !== 0x0A) { break; }
      }
    }
    if (nextPos < max && state.src.charCodeAt(nextPos) === 123/* { */) {
      // \footnote[numbered]{text}
      //                    ^^ get print
      data = findEndMarker(state.src, nextPos);
      if (!data || !data.res) {
        return false; /** can not find end marker */
      }
    }
  }
  if (!data || !data.res) {
    return false; /** can not find end marker */
  }
  
  nextPos = data.nextPos;
  if (silent) {
    state.pos = nextPos;
    return true;
  }

  envText = data.content;
  if (!state.env.footnotes) { state.env.footnotes = {}; }
  if (!state.env.footnotes.list) { state.env.footnotes.list = []; }
  if (!state.env.footnotes.list_all) { state.env.footnotes.list_all = []; }

  let footnoteId = state.env.footnotes.list.length;
  
  let listNotNumbered = state.env.footnotes.list.filter(item => 
    (!(item.hasOwnProperty('numbered') && item.numbered !== undefined)&& item.type !== "footnotetext"));
  let lastNumber = listNotNumbered.length;

  let tokens = [];
  state.md.inline.parse(
    envText,
    state.md,
    state.env,
    tokens
  );

  const token      = state.push('footnote_ref', '', 0);
  token.latex = latex;
  
  token.meta = {
    id: footnoteId,
    numbered: numbered,
    type: 'footnote',
    lastNumber: lastNumber
  };

  state.env.footnotes.list[footnoteId] = {
    content: envText,
    tokens: tokens,
    numbered: numbered,
    type: 'footnote',
    lastNumber: lastNumber
  };  

  state.pos = nextPos;
  return true;
};


export const latex_footnotemark: RuleInline = (state, silent) => {
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  let max = state.posMax;
  let nextPos: number = startPos;
  const match: RegExpMatchArray = state.src
    .slice(startPos)
    .match(reFootNoteMark);

  if (!match) {
    return false;
  }
  let latex = match[0];
  nextPos += match[0].length;
  // \footnotemark {}
  //              ^^ skipping these spaces
  for (; nextPos < max; nextPos++) {
    const code = state.src.charCodeAt(nextPos);
    if (!isSpace(code) && code !== 0x0A) { break; }
    latex += state.src[nextPos];
  }
  if (nextPos >= max) {
    return false;
  }

  let data = null;
  let numbered = undefined;
  // \footnotemark{text} or \footnotemark[number]{text}
  //              ^^ should be {         ^^ should be [
  if (state.src.charCodeAt(nextPos) === 123 /* { */ || state.src.charCodeAt(nextPos) === 0x5B/* [ */) {
    if (state.src.charCodeAt(nextPos) === 123 /* { */) {
      latex += state.src[nextPos];
      data = findEndMarker(state.src, nextPos);
    } else {
      data = null;
      let dataNumbered = findEndMarker(state.src, nextPos, "[", "]");
      if (!dataNumbered || !dataNumbered.res) {
        return false; /** can not find end marker */
      }
      numbered = dataNumbered.content;
      if (numbered?.trim() && !reNumber.test(numbered)) {
        return false;
      }
      nextPos = dataNumbered.nextPos;
      if (nextPos < max) {
        // \footnotemark[numbered]  {text}
        //                        ^^ skipping these spaces
        for (; nextPos < max; nextPos++) {
          const code = state.src.charCodeAt(nextPos);
          if (!isSpace(code) && code !== 0x0A) { break; }
        }
      }
      if (nextPos < max && state.src.charCodeAt(nextPos) === 123/* { */) {
        // \footnotemark[numbered]{text}
        //                         ^^ get print
        data = findEndMarker(state.src, nextPos);
        if (!data || !data.res) {
          return false; /** can not find end marker */
        }
      }
    }
  }

  if (data?.res) {
    nextPos = data.nextPos;
  }
  if (silent) {
    state.pos = nextPos;
    return true;
  }

  if (!state.env.footnotes) { state.env.footnotes = {}; }
  if (!state.env.footnotes.list) { state.env.footnotes.list = []; }

  let footnoteId = state.env.footnotes.list.length;
  let listNotNumbered = state.env.footnotes.list.filter(item =>
    (!(item.hasOwnProperty('numbered') && item.numbered !== undefined) && item.type !== "footnotetext"));
  let lastNumber = listNotNumbered.length;

  const token      = state.push('footnote_ref', '', 0);
  token.latex = latex;
  token.meta = { 
    id: footnoteId,  
    numbered: numbered,
    type: 'footnotemark',
    lastNumber: lastNumber
  };

  state.env.footnotes.list[footnoteId] = {
    content: '',
    tokens: [],
    numbered: numbered,
    type: 'footnotemark',
    footnoteId: footnoteId,
    lastNumber: lastNumber
  };

  state.pos = nextPos;
  return true;
};

export const latex_footnotetext: RuleInline = (state, silent) => {
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  let max = state.posMax;
  let nextPos: number = startPos;
  const match: RegExpMatchArray = state.src
    .slice(startPos)
    .match(reFootNoteText);

  if (!match) {
    return false;
  }
  nextPos += match[0].length;
  // \footnotetext {}
  //              ^^ skipping these spaces
  for (; nextPos < max; nextPos++) {
    const code = state.src.charCodeAt(nextPos);
    if (!isSpace(code) && code !== 0x0A) { break; }
  }
  if (nextPos >= max) {
    return false;
  }

  // \footnotetext{text} or \footnotetext[number]{text}
  //              ^^ should be {         ^^ should be [
  if (state.src.charCodeAt(nextPos) !== 123 /* { */
    && state.src.charCodeAt(nextPos) !== 0x5B/* [ */) {
    return false;
  }
  let data = null;
  let envText = '';
  let numbered = undefined;
  if (state.src.charCodeAt(nextPos) === 123 /* { */) {
    data = findEndMarker(state.src, nextPos);
  } else {
    data = null;
    let dataNumbered = findEndMarker(state.src, nextPos, "[", "]");
    if (!dataNumbered || !dataNumbered.res) {
      return false; /** can not find end marker */
    }
    numbered = dataNumbered.content;
    if (numbered?.trim() && !reNumber.test(numbered)) {
      return false;
    }
    nextPos = dataNumbered.nextPos;
    if (nextPos < max) {
      // \footnotetext[numbered]  {text}
      //                        ^^ skipping these spaces
      for (; nextPos < max; nextPos++) {
        const code = state.src.charCodeAt(nextPos);
        if (!isSpace(code) && code !== 0x0A) { break; }
      }
    }
    if (nextPos < max && state.src.charCodeAt(nextPos) === 123/* { */) {
      // \footnotetext[numbered]{text}
      //                         ^^ get print
      data = findEndMarker(state.src, nextPos);
      if (!data || !data.res) {
        return false; /** can not find end marker */
      }
    }
  }
  if (!data || !data.res) {
    return false; /** can not find end marker */
  }
  envText = data.content;
  if (silent) {
    state.pos = nextPos;
    return true;
  }

  if (!state.env.footnotes) { state.env.footnotes = {}; }
  if (!state.env.footnotes.list) { state.env.footnotes.list = []; }

  let listNotNumbered = state.env.footnotes.list.filter(item =>
    (!(item.hasOwnProperty('numbered') && item.numbered !== undefined) && item.type !== "footnotetext"));
  let lastNumber = listNotNumbered.length;
  
  let footnoteId = state.env.footnotes.list.length;
  
  let tokens = [];
  state.md.inline.parse(
    envText,
    state.md,
    state.env,
    tokens
  );

  let listFootnoteMark = state.env.footnotes?.list?.length 
    ? state.env.footnotes.list.filter(item => item.type === 'footnotemark')
    : [];
  let lastItem = null;
  if (listFootnoteMark?.length) {
    if (numbered) {
      let numberedList = listFootnoteMark.filter(item => item.numbered === numbered );
      lastItem = numberedList?.length ? numberedList[numberedList.length - 1] : null;
    } else {
      let unNumberedList = listFootnoteMark.filter(item => item.numbered === undefined );
      lastItem = unNumberedList?.length ? unNumberedList[unNumberedList.length - 1] : null;
    }
  }

  const token      = state.push('footnotetext', '', 0);
  token.children = tokens;
  token.content = envText;
  token.meta = {
    numbered: numbered,
  };
  
  if (lastItem) {
    if (lastItem.hasContent) {
      state.env.footnotes.list[lastItem.footnoteId].arrContents.push({
        content: envText,
        tokens: tokens,
      });
    } else {
      state.env.footnotes.list[lastItem.footnoteId].content = envText;
      state.env.footnotes.list[lastItem.footnoteId].tokens = tokens;
      state.env.footnotes.list[lastItem.footnoteId].hasContent = true;
      state.env.footnotes.list[lastItem.footnoteId].arrContents = [{
        content: envText,
        tokens: tokens
      }];
      token.meta.footnoteId = lastItem.footnoteId;
      token.meta.id = lastItem.footnoteId;
    }
  } else {
    state.env.footnotes.list[footnoteId] = {
      content: envText,
      tokens: tokens,
      numbered: numbered,
      type: 'footnotetext',
      footnoteId: -1,
      lastNumber: lastNumber
    };
    token.meta.footnoteId = -1;
    token.meta.id = footnoteId;
  }
  nextPos = data.nextPos;
  state.pos = nextPos;
  return true;
};
