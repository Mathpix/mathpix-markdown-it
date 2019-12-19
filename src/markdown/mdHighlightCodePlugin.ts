import * as hljs from 'highlight.js';

const maybe = f => {
  try {
    return f()
  } catch (e) {
    return false
  }
}

// Highlight with given language.
const highlight = (code, lang) => {
  if(lang.toLowerCase() === 'latex') lang = 'tex';
  if (!lang) return '';
  return maybe(() => hljs.highlight(lang, code, true).value) || ''
};

// Highlight with given language or automatically.
const highlightAuto = (code, lang) => (
  lang
    ? highlight(code, lang)
    : maybe(() => hljs.highlightAuto(code).value) || ''
);

// Wrap a render function to add `hljs` class to code blocks.
const wrap = render => (...args) => (
  render.apply(render, args)
      .replace('<code class="', '<code class="hljs ')
      .replace('<code>', '<code class="hljs">')
)

const highlightjs = (md, opts) => {
  opts = Object.assign({}, highlightjs.defaults, opts)
  md.options.highlight = opts.auto ? highlightAuto : highlight
  md.renderer.rules.fence = wrap(md.renderer.rules.fence)

  if (opts.code) {
    md.renderer.rules.code_block = wrap(md.renderer.rules.code_block)
  }
}

highlightjs.defaults = {
  auto: true,
  code: true
}

export default highlightjs;
