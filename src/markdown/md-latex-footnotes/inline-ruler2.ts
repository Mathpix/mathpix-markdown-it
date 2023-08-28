import { FootnoteItem } from "./interfaces";

export const grab_footnote_ref = (state) => {
  if (!state.tokens?.length) {
    return;
  }
  for (let k = 0; k < state.tokens?.length; k++) {
    let token = state.tokens[k];
    if (token.type === "footnote_ref") {
      let footnote: FootnoteItem = state.env.footnotes?.list?.length > token.meta.id
        ? state.env.footnotes?.list[token.meta.id] : null;
      if (footnote) {
        if (footnote.hasOwnProperty('footnoteId')) {
          let footnoteId = footnote.footnoteId;
          state.env.mmd_footnotes.list[footnoteId].count = footnote.count;
          token.meta.footnoteId = footnoteId;
        } else {
          let footnoteId = state.env.mmd_footnotes.list.length;
          state.env.mmd_footnotes.list[footnoteId] = {...footnote};
          state.env.mmd_footnotes.list[footnoteId].footnoteId = footnoteId;
          footnote.footnoteId = footnoteId;
          token.meta.footnoteId = footnoteId;
        }
      }
      token.type = "mmd_footnote_ref"
    }
  }
};
