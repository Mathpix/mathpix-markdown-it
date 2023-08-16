import { Token } from 'markdown-it';

const createFootnotesTokens = (state, stateTokens, refTokens, meta, idx,
                               itemLabel, itemCount, itemTokens, itemContent): Array<Token> => {
  // let stateTokens: Array<Token> = [];
  let token: Token = new state.Token('footnote_open', '', 1);
  token.meta = meta;
  stateTokens.push(token);
  let tokens = [];
  let lastParagraph;

  if (itemTokens) {
    tokens = [];

    token          = new state.Token('paragraph_open', 'p', 1);
    token.block    = true;
    tokens.push(token);

    token          = new state.Token('inline', '', 0);
    token.children = itemTokens;
    token.content  = itemContent;
    tokens.push(token);

    token          = new state.Token('paragraph_close', 'p', -1);
    token.block    = true;
    tokens.push(token);

  } else if (itemLabel) {
    tokens = refTokens[':' + itemLabel];
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
    token      = new state.Token('footnote_anchor', '', 0);
    token.meta = { id: idx, subId: j, label: itemLabel };
    stateTokens.push(token);
  }

  if (lastParagraph) {
    stateTokens.push(lastParagraph);
  }

  token = new state.Token('footnote_close', '', -1);
  stateTokens.push(token);
  return stateTokens;
};


// Glue footnote tokens to end of token stream
export const footnote_tail = (state) => {
  let i, l, list, current, currentLabel,
    insideRef = false,
    refTokens = {};
  if (!state.env.footnotes) { return; }
  if (state.env.footnotes?.list?.length) {
    let lastNumber = 0;
    for (let i = 0; i < state.env.footnotes.list.length; i++) {
      let item = state.env.footnotes.list[i];
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
      if (!state.env.footnotes.refsTokens) {
        state.env.footnotes.refsTokens = {};
      }
      state.env.footnotes.refsTokens[':' + currentLabel] = current;
      return Boolean(state.md.options?.forMD);
    }
    if (insideRef) { current.push(tok); }
    if (state.md.options.forMD) return true;
    return !insideRef;
  });

  if (!state.env.footnotes.list) { return; }
  list = state.env.footnotes.list;
  
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
    if (list[i].numbered !== undefined || list[i].type === "footnotetext") {
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
      if (list[i].type === "footnotetext") {
        meta.numbered = counter_footnote;
      }
    }

    if (list[i].hasOwnProperty('arrContents') && list[i].arrContents.length) {
      for (let j = 0; j < list[i].arrContents.length; j++) {
        stateTokens = createFootnotesTokens(state, stateTokens, refTokens, meta, i,
          list[i].label, list[i].count,
          list[i].arrContents[j].tokens, list[i].arrContents[j].content);
      }
    } else {
      stateTokens = createFootnotesTokens(state, stateTokens, refTokens, meta, i,
        list[i].label, list[i].count, list[i].tokens, list[i].content);
    }
  }
  
  if (stateTokens?.length) {
    let token:Token = new state.Token('footnote_block_open', '', 1);
    state.tokens.push(token);
    stateTokens.map(item => {
      state.tokens.push(item);
    });
    token = new state.Token('footnote_block_close', '', -1);
    state.tokens.push(token);
  }
};
