import { FootnoteItem } from "./interfaces";

export const grab_footnote_ref = (state) => {
  if (!state.tokens?.length) {
    return;
  }
  for (let k = 0; k < state.tokens?.length; k++) {
    let token = state.tokens[k];
    if (k > 0 && state.tokens[k-1]) {
      if (token.type === 'footnotetext' && state.tokens[k-1].type === 'softbreak') {
        token.hidden = true;
        if (!state.tokens[k-1].hidden) {
          state.tokens[k-1].hidden = true;
        }
      }
      if (token.type === 'softbreak' && state.tokens[k-1].type === 'footnotetext') {
        token.hidden = true;
        if (!state.tokens[k-1].hidden) {
          state.tokens[k-1].hidden = true;
        }
      }
    }
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
