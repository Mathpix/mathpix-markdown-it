export const render_footnote_anchor_name = (tokens, idx, options, env/*, slf*/) => {
  let n = Number(tokens[idx].meta.id + 1).toString();
  let prefix = '';

  if (typeof env.docId === 'string') {
    prefix = '-' + env.docId + '-';
  }

  return prefix + n;
};

export const render_footnote_caption = (tokens, idx, options, env, slf) => {
  let n = Number(tokens[idx].meta.id + 1).toString();
  if (tokens[idx].meta.numbered !== undefined) {
    n = Number(tokens[idx].meta.numbered).toString()
  } else {
    if (tokens[idx].meta.hasOwnProperty('lastNumber')) {
      n = Number(tokens[idx].meta.lastNumber + 1).toString()
    } else {
      if (env.footnotes?.list?.length && env.footnotes?.list[tokens[idx].meta.id]?.lastNumber) {
        n = Number(env.footnotes.list[tokens[idx].meta.id].lastNumber + 1).toString();
      }
    }
  }
  if (tokens[idx].meta.subId > 0) {
    n += ':' + tokens[idx].meta.subId;
  }

  return '[' + n + ']';
};

export const render_footnote_ref = (tokens, idx, options, env, slf) => {
  try {
    let notFootnoteText = env.footnotes?.list?.length > tokens[idx].meta.id
      && !Boolean(env.footnotes?.list[tokens[idx].meta.id].hasContent)
      && env.footnotes?.list[tokens[idx].meta.id].type === "footnotemark";

    const id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
    const caption = slf.rules.footnote_caption(tokens, idx, options, env, slf);
    let refid = id;
    if (tokens[idx].meta.subId > 0) {
      refid += ':' + tokens[idx].meta.subId;
    }

    return notFootnoteText
      ? '<sup class="footnote-ref">' + caption + '</sup>'
      : options.forDocx
        ? '<a href="#fn' + id + '" id="fnref' + refid + '"><sup class="footnote-ref">' + caption + '</sup></a>'
        : '<sup class="footnote-ref"><a href="#fn' + id + '" id="fnref' + refid + '">' + caption + '</a></sup>';
  } catch (e) {
    return tokens[idx].content;
  }
};

export const render_footnote_block_open = (tokens, idx, options) => {
  return (options.xhtmlOut ? '<hr class="footnotes-sep" />\n' : '<hr class="footnotes-sep">\n') +
    '<section class="footnotes">\n' +
    '<ol class="footnotes-list">\n';
};

export const render_footnote_block_close = () => {
  return '</ol>\n</section>\n';
};

export const render_footnote_open = (tokens, idx, options, env, slf) => {
  let id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);

  if (tokens[idx].meta.subId > 0) {
    id += ':' + tokens[idx].meta.subId;
  }

  if (tokens[idx].meta.numbered !== undefined) {
    return '<li id="fn' + id + '" class="footnote-item" value="' + tokens[idx].meta.numbered + '">';
  }
  return '<li id="fn' + id + '" class="footnote-item">';
};

export const render_footnote_close = () => {
  return '</li>\n';
};

export const render_footnote_anchor = (tokens, idx, options, env, slf) => {
  let notFootnoteMarker = env.footnotes?.list?.length > tokens[idx].meta.id
    && Boolean(env.footnotes?.list[tokens[idx].meta.id].footnoteId === -1)
    && env.footnotes?.list[tokens[idx].meta.id].type === "footnotetext";
  if (notFootnoteMarker) {
    return '';
  }
  
  let id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);

  if (tokens[idx].meta.subId > 0) {
    id += ':' + tokens[idx].meta.subId;
  }

  /* ↩ with escape code to prevent display as Apple Emoji on iOS */
  return ' <a href="#fnref' + id + '" class="footnote-backref">\u21a9\uFE0E</a>';
};

export const render_footnotetext = () => {
  return ''
};
