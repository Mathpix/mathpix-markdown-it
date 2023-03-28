export const setPositions = (state) => {
  const lines = state.env?.lines ? {...state.env?.lines} : null;
  let offsetContent = 0;
  for (let i = 0; i < state.tokens.length; i++) {
    let token = state.tokens[i];
    if (token.block) {
      /** Set positions for block tokens */
      if (token.map) {
        const line = token.map[0];
        const endLine = token.map[1] > token.map[0] 
          ? token.map[1] - 1 
          : token.map[1];
        
        let startPos = lines.bMarks[line] + lines.tShift[line];
        let endPos = lines.eMarks[endLine];
        let content_test = state.src.slice(startPos, endPos);

        if (token.hasOwnProperty('bMarks')) {
          startPos += token.bMarks;
          if (token.eMarks && endLine -1 >= 0
          ) {
            endPos = lines.eMarks[endLine-1] + token.eMarks;
            endPos += endLine - token.map[0] === 0 ? 1 : 0;
          }
        } else {
          if (token.type === "inline") {
            if (token.content?.length && token.content?.length < content_test?.length) {
              const index = content_test.indexOf(token.content);
              startPos += index !== -1 ? index : 0;
            }
          }
        }
        
        token.positions = {
          start: startPos,
          end: endPos,
        };
        if (token.hasOwnProperty('bMarksContent')) {
          token.positions.start_content = token.positions.start + token.bMarksContent;
          if (endLine-1 >= 0 ) {
            token.positions.end_content = lines.eMarks[endLine-1] + token.eMarksContent;
            token.positions.end_content += endLine - token.map[0] === 0 ? 1 : 0;
          } else {
            token.positions.end_content = token.eMarksContent
          }
          token.content_test = state.src.slice(token.positions.start_content, token.positions.end_content);
        }
        token.content_test_str = state.src.slice(token.positions.start, token.positions.end);
        
        /** Skip set positions for theorems */
        if (token.type === "theorem_open") {
          i++;
          while (state.tokens[i]?.type !== "theorem_close" && i < state.tokens.length) {
            i++;
          }
          continue;
        }        
        if (token.type === "proof_open") {
          i++;
          while (state.tokens[i]?.type !== "proof_close" && i < state.tokens.length) {
            i++;
          }
          continue;
        }
      }
      /** Ignore set positions for children.
       * Since the content may not match the original string. Line breaks can be removed*/
      if (['tabular'].includes(token.type)) {
        continue;
      }
      if (token.children?.length && token.positions) {
        let pos = token.positions.hasOwnProperty('start_content') 
          ? token.positions.start_content 
          : token.positions?.start ? token.positions.start : 0;
        pos += offsetContent;
        let start_content = pos;
        for (let i = 0; i < token.children.length; i++) {
          if (token.children[i].inlinePos?.hasOwnProperty('start')
          ) {
            pos = start_content + token.children[i].inlinePos.start;
          }
          if (token.children[i].type ==="code_inline") {
            pos += token.children[i]?.markup?.length
              ? token.children[i]?.markup?.length
              : 0;
          }
          const startPos = pos;

          if (token.children[i].inlinePos?.end) {
            pos += token.children[i].inlinePos.end - token.children[i].inlinePos.start;
          } else {
            pos += token.children[i]?.content?.length
              ? token.children[i]?.content?.length
              : token.children[i]?.markup?.length
                ? token.children[i]?.markup?.length
                : 0;
          }
          if (token.children[i].type === 'softbreak') {
            pos++;
          }
          token.children[i].positions = {
            start: startPos,
            end: pos
          };
          if (token.children[i]?.inlinePos?.hasOwnProperty('start_content') && token.children[i].inlinePos?.hasOwnProperty('end_content')) {
            token.children[i].positions.start_content = token.children[i].positions.start + token.children[i].inlinePos.start_content;
            token.children[i].positions.end_content = token.children[i].positions.start + token.children[i].inlinePos.end_content;
          }

          token.children[i].content_test_str = state.src.slice(token.children[i].positions.start, token.children[i].positions.end);
          if (token.children[i]?.positions.start_content) {
            token.children[i].content_test = state.src.slice(
              token.children[i].positions.start_content, 
              token.children[i].positions.end_content
            );
          }
          if (token.children[i].type ==="code_inline") {
            pos += token.children[i]?.markup?.length
              ? token.children[i]?.markup?.length
              : 0;
          }
        }
      }
    }
  }
  // console.log("[MMD]=>[state.tokens]=>", state.tokens)
};
