import { Token } from 'markdown-it';
import { set_mmd_footnotes_list } from './utils';

const createFootnotesTokens = (state, stateTokens, refTokens, meta, idx,
                               itemLabel, itemCount, itemTokens, itemContent, isBlock = false): Array<Token> => {
  let token: Token = new state.Token('mmd_footnote_open', '', 1);
  token.meta = meta;
  stateTokens.push(token);
  let tokens = [];
  let lastParagraph;

  if (isBlock) {
    tokens = itemTokens
  } else {
    if (itemTokens) {
      tokens = [];

      token          = new state.Token('paragraph_open', 'div', 1);
      token.block    = true;
      tokens.push(token);

      token          = new state.Token('inline', '', 0);
      token.children = itemTokens;
      token.content  = itemContent;
      tokens.push(token);

      token          = new state.Token('paragraph_close', 'div', -1);
      token.block    = true;
      tokens.push(token);

    } else if (itemLabel) {
      tokens = refTokens[':' + itemLabel];
    }
  }

  if (tokens) {
    stateTokens = stateTokens.concat(tokens);
  }
  if (stateTokens[stateTokens.length - 1].type === 'paragraph_close') {
    lastParagraph = stateTokens.pop();
  } else {
    lastParagraph = null;
  }

  let t = itemCount > 0 ? itemCount : 1;
  for (let j = 0; j < t; j++) {
    token      = new state.Token('mmd_footnote_anchor', '', 0);
    token.meta = { id: idx, subId: j, label: itemLabel };
    let footnote = state.env.mmd_footnotes?.list?.length > token.meta.id
      ? state.env.mmd_footnotes?.list[token.meta.id] : null;
    if (footnote) {
      token.meta.footnoteId = footnote.footnoteId;
      token.meta.type = footnote.type;
    }
    stateTokens.push(token);
  }

  if (lastParagraph) {
    stateTokens.push(lastParagraph);
  }

  token = new state.Token('mmd_footnote_close', '', -1);
  stateTokens.push(token);
  return stateTokens;
};

// Glue footnote tokens to end of token stream
export const mmd_footnote_tail = (state) => {
  try {
    let i, l, list, current, currentLabel,
      insideRef = false,
      refTokens = {};
    if (!state.env.mmd_footnotes) { return; }
    if (state.env.mmd_footnotes?.list?.length) {
      let lastNumber = 0;
      for (let i = 0; i < state.env.mmd_footnotes.list.length; i++) {
        let item = state.env.mmd_footnotes.list[i];
        if (item.hasOwnProperty('lastNumber')) {
          lastNumber = item.numbered 
            ? item.lastNumber 
            : item.lastNumber + 1;
          continue;
        }
        item.lastNumber = lastNumber;
        lastNumber += 1;
      }
    }
  
    state.tokens = state.tokens.filter(function (tok) {
      if (tok.type === 'footnote_reference_open') {
        insideRef = true;
        current = [];
        currentLabel = tok.meta.label;
        return Boolean(state.md.options?.forMD);
      }
      if (tok.type === 'footnote_reference_close') {
        insideRef = false;
        // prepend ':' to avoid conflict with Object.prototype members
        refTokens[':' + currentLabel] = current;
        if (!state.env.mmd_footnotes.refsTokens) {
          state.env.mmd_footnotes.refsTokens = {};
        }
        state.env.mmd_footnotes.refsTokens[':' + currentLabel] = current;
        return Boolean(state.md.options?.forMD);
      }
      if (insideRef) { current.push(tok); }
      if (state.md.options.forMD) return true;
      return !insideRef;
    });
  
    if (!state.env.mmd_footnotes.list) { return; }
    list = state.env.mmd_footnotes.list;
    
    let notIncrementNumber = false;
    let incrementNumber = false;
    let counter_footnote = 0;
    
    let createFootnoteOpen = true;
    let stateTokens: Array<Token> = [];
    for (i = 0, l = list.length; i < l; i++) {
      createFootnoteOpen = true;
      if (list[i].hasOwnProperty('type')) {
        switch (list[i].type ) {
          case 'footnotetext':
          case 'blfootnotetext':
            break;        
          case 'footnotemark':
            if (list[i].numbered === undefined) {
              counter_footnote++;
            }
            if (!list[i].hasContent) {
              if (list[i].numbered === undefined) {
                incrementNumber = true;
              }
              /** If a footnotemark does not have a description, then it is not included in the list of footnotes. */
              createFootnoteOpen = false;
            }
            break;        
          case 'footnote':
            if (list[i].numbered === undefined) {
              counter_footnote++;
            }
            if (state.md.options.forLatex) {
              createFootnoteOpen = false;
            }
            break;
        }
      } else {
        counter_footnote++;
      }
      list[i].counter_footnote = counter_footnote;
      if (!createFootnoteOpen || state.md.options.forMD) {
        continue;
      }
      let meta = { 
        id: i, 
        label: list[i].label,
        numbered: list[i].numbered,
        type: list[i].type,
        counter_footnote: counter_footnote
      };
      if (list[i].numbered !== undefined || list[i].type === "footnotetext" || list[i].type === "blfootnotetext") {
        notIncrementNumber = true
      } else {
        if (notIncrementNumber) {
          meta.numbered = counter_footnote;
          notIncrementNumber = false;
        }
      }
      if (list[i].numbered === undefined) {
        if (list[i].type === "footnote" || list[i].type === "footnotemark") {
          if (incrementNumber) {
            meta.numbered = counter_footnote;
            incrementNumber = false;
          }
        }
        if (list[i].type === "footnotetext" || list[i].type === "blfootnotetext") {
          meta.numbered = counter_footnote;
        }
      }
      
      if (list[i].hasOwnProperty('arrContents') && list[i].arrContents.length) {
        for (let j = 0; j < list[i].arrContents.length; j++) {
          stateTokens = createFootnotesTokens(state, stateTokens, refTokens, meta, i,
            list[i].label, list[i].count,
            list[i].arrContents[j].tokens, list[i].arrContents[j].content, list[i].isBlock);
        }
      } else {
        stateTokens = createFootnotesTokens(state, stateTokens, refTokens, meta, i,
          list[i].label, list[i].count, list[i].tokens, list[i].content, list[i].isBlock);
      }
    }

    if (stateTokens?.length) {
      let token:Token = new state.Token('mmd_footnote_block_open', '', 1);
      state.tokens.push(token);
      let isNotMarkerList = false;
      for (let i = 0; i < stateTokens.length; i++) {
        let item = stateTokens[i];
        if (item.type === "mmd_footnote_open") {
          if (i === 0) {
            token = new state.Token('mmd_footnote_list_open', '', 1);
            token.meta = item.meta;
            state.tokens.push(token);
          } else {
            if (item.meta.type === 'blfootnotetext') {
              if (!isNotMarkerList) {
                isNotMarkerList = true;
                token = new state.Token('mmd_footnote_list_close', '', -1);
                state.tokens.push(token);
                token = new state.Token('mmd_footnote_list_open', '', 1);
                token.meta = item.meta;
                state.tokens.push(token);
              }
            } else {
              if (isNotMarkerList) {
                isNotMarkerList = false;
                token = new state.Token('mmd_footnote_list_close', '', -1);
                state.tokens.push(token);
                token = new state.Token('mmd_footnote_list_open', '', 1);
                token.meta = item.meta;
                state.tokens.push(token);
              }
            }
          }
        }
        state.tokens.push(item);
      }
      token = new state.Token('mmd_footnote_list_close', '', -1);
      state.tokens.push(token);      
      token = new state.Token('mmd_footnote_block_close', '', -1);
      state.tokens.push(token);
    }
    state.env.footnotes = null;
    set_mmd_footnotes_list(state.env.mmd_footnotes.list);
  } catch (err) {
    console.log("[MMD][footnote_tail] Error=>", err);
    return;
  }
};
