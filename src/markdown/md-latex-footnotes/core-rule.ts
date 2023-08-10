// Glue footnote tokens to end of token stream
export const footnote_tail = (state) => {
  var i, l, j, t, lastParagraph, list, token, tokens, current, currentLabel,
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
    // /** sort by last number */
    // state.env.footnotes.list.sort((a,b) => {
    //   return a.lastNumber > b.lastNumber ? 1 : -1
    // })
  }
  
  // if ()

  
  /** Filter */
  
  let footnote_block_open = state.tokens.filter((token) => {
    return token.type === 'footnote_block_open'
  });
  
  if (footnote_block_open?.length) {
    let footnote_open = state.tokens.filter((token) => {
      return token.type === 'footnote_open'
    });
    for (let i = 0; i < footnote_open.length; i++) {
      footnote_open[i].meta.numbered =
        state.env.footnotes.list[footnote_open[i].meta.id].numbered
    }
    return;
  }

  state.tokens = state.tokens.filter(function (tok) {
    if (tok.type === 'footnote_reference_open') {
      insideRef = true;
      current = [];
      currentLabel = tok.meta.label;
      return false;
    }
    if (tok.type === 'footnote_reference_close') {
      insideRef = false;
      // prepend ':' to avoid conflict with Object.prototype members
      refTokens[':' + currentLabel] = current;
      return false;
    }
    if (insideRef) { current.push(tok); }
    return !insideRef;
  });

  if (!state.env.footnotes.list) { return; }
  list = state.env.footnotes.list;

  token = new state.Token('footnote_block_open', '', 1);
  state.tokens.push(token);

  let notIncrementNumber = false;
  let lastNumber = 0;
  for (i = 0, l = list.length; i < l; i++) {
    if (list[i].type === "footnotemark" && !list[i].hasContent) {
      if (list[i].numbered === undefined) {
        lastNumber += 1;
      }
      continue
    }
    token      = new state.Token('footnote_open', '', 1);
    token.meta = { 
      id: i, 
      label: list[i].label,
      numbered: list[i].numbered,
    };
    if (!notIncrementNumber && list[i].numbered === undefined && list[i].type !== "footnotetext") {
      // lastNumber = i + 1;
      lastNumber += 1;
    }
    if (list[i].numbered !== undefined || list[i].type === "footnotetext") {
      notIncrementNumber = true
    } else {
      if (notIncrementNumber) {
        token.meta.numbered = lastNumber + 1;
        notIncrementNumber = false;
      }
    }
    
    if (list[i].type === "footnotetext" && list[i].numbered === undefined) {
      token.meta.numbered = list[i].lastNumber;
      lastNumber = list[i].lastNumber;
    }
    state.tokens.push(token);

    if (list[i].tokens) {
      tokens = [];

      token          = new state.Token('paragraph_open', 'p', 1);
      token.block    = true;
      tokens.push(token);

      token          = new state.Token('inline', '', 0);
      token.children = list[i].tokens;
      token.content  = list[i].content;
      tokens.push(token);

      token          = new state.Token('paragraph_close', 'p', -1);
      token.block    = true;
      tokens.push(token);

    } else if (list[i].label) {
      tokens = refTokens[':' + list[i].label];
    }

    if (tokens) state.tokens = state.tokens.concat(tokens);
    if (state.tokens[state.tokens.length - 1].type === 'paragraph_close') {
      lastParagraph = state.tokens.pop();
    } else {
      lastParagraph = null;
    }

    t = list[i].count > 0 ? list[i].count : 1;
    for (j = 0; j < t; j++) {
      token      = new state.Token('footnote_anchor', '', 0);
      token.meta = { id: i, subId: j, label: list[i].label };
      state.tokens.push(token);
    }

    if (lastParagraph) {
      state.tokens.push(lastParagraph);
    }

    token = new state.Token('footnote_close', '', -1);
    state.tokens.push(token);
  }

  token = new state.Token('footnote_block_close', '', -1);
  state.tokens.push(token);
}
