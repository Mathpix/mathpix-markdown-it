import { FootnoteItem, FootnoteMeta } from "./interfaces";

export const addFootnoteToListForFootnote = (state, token, tokens, envText, numbered, isBlock = false) => {
  try {
    let footnoteId = state.env.mmd_footnotes.list.length;

    let listNotNumbered = state.env.mmd_footnotes.list.filter(item =>
      (!(item.hasOwnProperty('numbered') && item.numbered !== undefined) && item.type !== "footnotetext"));
    let lastNumber = listNotNumbered.length;

    token.meta = {
      id: footnoteId,
      numbered: numbered,
      type: 'footnote',
      lastNumber: lastNumber,
      isBlock: isBlock,
      footnoteId: footnoteId
    };

    state.env.mmd_footnotes.list[footnoteId] = {
      id: footnoteId,
      footnoteId: footnoteId,
      content: envText,
      tokens: tokens,
      numbered: numbered,
      type: 'footnote',
      lastNumber: lastNumber,
      isBlock: isBlock
    };
  } catch (err) {
    console.log("[MMD][addFootnoteToListForFootnote] Error=>", err);
  }
};

export const addFootnoteToListForFootnotetext = (state, token, tokens, envText, numbered, isBlock = false) => {
  try {
    let footnoteId = state.env.mmd_footnotes.list.length;
    let listNotNumbered = state.env.mmd_footnotes.list.filter(item =>
      (!(item.hasOwnProperty('numbered') && item.numbered !== undefined) && item.type !== "footnotetext"));
    let lastNumber = listNotNumbered.length;

    let listFootnoteMark = state.env.mmd_footnotes?.list?.length
      ? state.env.mmd_footnotes.list.filter(item => item.type === 'footnotemark')
      : [];
    let lastItem = null;
    if (listFootnoteMark?.length) {
      if (numbered) {
        let numberedList = listFootnoteMark.filter(item => item.numbered === numbered);
        lastItem = numberedList?.length ? numberedList[numberedList.length - 1] : null;
      } else {
        let unNumberedList = listFootnoteMark.filter(item => item.numbered === undefined);
        lastItem = unNumberedList?.length ? unNumberedList[unNumberedList.length - 1] : null;
      }
    }
    token.meta = {
      numbered: numbered,
      isBlock: isBlock
    };
    if (lastItem) {
      if (lastItem.hasContent) {
        state.env.mmd_footnotes.list[lastItem.footnoteId].arrContents.push({
          content: envText,
          tokens: tokens,
          isBlock: isBlock
        });
      } else {
        state.env.mmd_footnotes.list[lastItem.footnoteId].id = lastItem.footnoteId;
        state.env.mmd_footnotes.list[lastItem.footnoteId].content = envText;
        state.env.mmd_footnotes.list[lastItem.footnoteId].tokens = tokens;
        state.env.mmd_footnotes.list[lastItem.footnoteId].hasContent = true;
        state.env.mmd_footnotes.list[lastItem.footnoteId].isBlock = isBlock;
        state.env.mmd_footnotes.list[lastItem.footnoteId].arrContents = [{
          content: envText,
          tokens: tokens,
          isBlock: isBlock
        }];
        token.meta.footnoteId = lastItem.footnoteId;
        token.meta.id = lastItem.footnoteId;
      }
    } else {
      state.env.mmd_footnotes.list[footnoteId] = {
        id: footnoteId,
        content: envText,
        tokens: tokens,
        numbered: numbered,
        type: 'footnotetext',
        footnoteId: -1,
        lastNumber: lastNumber,
        isBlock: isBlock
      };
      token.meta.footnoteId = -1;
      token.meta.id = footnoteId;
    }
  } catch (err) {
    console.log("[MMD][addFootnoteToListForFootnotetext] Error=>", err);
  }
};

export const getFootnoteItem = (env, meta: FootnoteMeta): FootnoteItem => {
  let id = meta.hasOwnProperty('footnoteId')
      && meta.footnoteId !== undefined
      && meta.footnoteId !== -1
    ? meta.footnoteId 
    : meta.id;
  return env?.mmd_footnotes?.list?.length > id 
    ? env.mmd_footnotes.list[id]
    : null;
};
