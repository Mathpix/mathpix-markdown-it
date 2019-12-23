const renderInlineTokenBlock = (tokens, options, renderer) =>{
  let _renderer = Object.getPrototypeOf(renderer);
  _renderer.rules = renderer.rules;

  let nextToken,
    result = '',
    needLf = false;

  for (let idx = 0; idx < tokens.length; idx++) {
    let token = tokens[idx];
    if (token.hidden) {
      return '';
    }

    if ( token.n !== -1 && idx && tokens[idx - 1].hidden) {
      result += '\n';
    }

    if (token.token === 'inline') {
      let content: string = '';
      if (token.children) {
        content = _renderer.renderInline(token.children, options);
      } else {
        content = _renderer.renderInline([{type: 'text', content: token.content}], options);
      }

      result += content;
      continue;
    }

    // Add token name, e.g. `<img`
    result += (token.n === -1 ? '</' : '<') + token.tag;

    // Encode attributes, e.g. `<img src="foo"`
    result += _renderer.renderAttrs(token);

    // Add a slash for self-closing tags, e.g. `<img src="foo" /`
    if (token.n === 0 && options.xhtmlOut) {
      result += ' /';
    }

    // Check if we need to add a newline after this tag
    needLf = true;

    if (token.n === 1) {
      if (idx + 1 < tokens.length) {
        nextToken = tokens[idx + 1];

        if (nextToken.token === 'inline' || nextToken.hidden) {
          // Block-level tag containing an inline tag.
          //
          needLf = false;

        } else if (nextToken.n === -1 && nextToken.tag === token.tag) {
          // Opening tag + closing tag of the same type. E.g. `<li></li>`.
          //
          needLf = false;
        }
      }
    }

    result += needLf ? '>\n' : '>';
  }

  return result;
};

export const renderTabulare = (a, token, options, renderer) => {
  const tabulare = renderInlineTokenBlock(token.children, options, renderer);
  return `<div class="inline-tabulare">${tabulare}</div>`
};
