import { FootnoteItem } from "./interfaces";
import { getFootnoteItem } from "./utils";

export const render_footnote_anchor_name = (tokens, idx, options, env/*, slf*/) => {
  let n = tokens[idx].meta.hasOwnProperty('footnoteId') && tokens[idx].meta.footnoteId !== undefined
    ? Number(tokens[idx].meta.footnoteId + 1).toString()
    : Number(tokens[idx].meta.id + 1).toString();
  let prefix = '';

  if (typeof env.docId === 'string') {
    prefix = '-' + env.docId + '-';
  }

  return prefix + n;
};

export const render_footnote_caption = (tokens, idx, options, env, slf) => {
  let id: number = tokens[idx].meta.hasOwnProperty('footnoteId') && tokens[idx].meta.footnoteId !== undefined
    ? tokens[idx].meta.footnoteId
    : tokens[idx].meta.id;
  let n = Number(id + 1).toString();
  let footnote: FootnoteItem = getFootnoteItem(env, tokens[idx].meta);
  
  if (footnote) {
    if (footnote.numbered !== undefined) {
      n = Number(footnote.numbered).toString();
    } else {
      if (footnote.hasOwnProperty('counter_footnote') && footnote.counter_footnote !== undefined) {
        n = Number(footnote.counter_footnote).toString()
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
    let footnote: FootnoteItem = getFootnoteItem(env, tokens[idx].meta);
    let notFootnoteText = tokens[idx].meta.type === "footnotemark" 
      && !Boolean(footnote?.hasContent);
    const id = slf.rules.mmd_footnote_anchor_name(tokens, idx, options, env, slf);
    const caption = slf.rules.mmd_footnote_caption(tokens, idx, options, env, slf);
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
  let id = slf.rules.mmd_footnote_anchor_name(tokens, idx, options, env, slf);

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
  let footnote: FootnoteItem = getFootnoteItem(env, tokens[idx].meta);
  let notFootnoteMarker = tokens[idx].meta.type === "footnotetext"
    && Boolean(footnote?.footnoteId === -1);
  if (notFootnoteMarker) {
    return '';
  }
  
  let id = slf.rules.mmd_footnote_anchor_name(tokens, idx, options, env, slf);

  if (tokens[idx].meta.subId > 0) {
    id += ':' + tokens[idx].meta.subId;
  }

  /* ↩ with escape code to prevent display as Apple Emoji on iOS */
  return ' <a href="#fnref' + id + '" class="footnote-backref">\u21a9\uFE0E</a>';
};

export const render_footnotetext = () => {
  return ''
};
