const chai = require('chai');
chai.should();

const MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<body><div id="host"></div></body>');
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;
// One document, reused per input: a JSDOM per document ran the corpus to 4GB and died there.
const host = jsdom.window.document.getElementById('host');

// Seeded fuzz over list shapes. The fixtures pin what known inputs render to; this pins what no input
// may produce — a tag with no partner, a list with no item, an item outside a list. Every defect this
// branch fixed showed up here first, and each one came from a shape nobody thought to write down.
//
// Deterministic: same seed, same documents, same run every time. Raise the count locally to search
// wider (LIST_FUZZ_DOCS=6000 npm test); a failure prints the source, which is enough to reproduce.
const SEED = 987654321;
const DOCS = Number(process.env.LIST_FUZZ_DOCS || 500);
const FENCE = '```';
// Chosen to reach what the list rules read: markers, wrapper envs, verbatim, crossed and unclosed
// envs, and commands whose argument holds list markup.
const FRAGMENTS = [
  '\\begin{itemize}', '\\end{itemize}', '\\begin{enumerate}', '\\end{enumerate}',
  '\\item a', '\\item[x] b', '\\item', 'loose text', '   ', '\\itemsep 1pt',
  '\\renewcommand{\\labelitemi}{Z}', '\\begin{center}', '\\end{center}', '\\begin{center}q\\end{center}',
  '\\begin{table}', '\\end{table}', '\\caption{c}', '\\caption{c \\end{itemize} d}', '\\caption{c',
  '\\begin{tabular}{l}', 'x \\\\', '\\end{tabular}', '\\begin{lstlisting}', '\\end{lstlisting}',
  '$x^2$', '$\\frac{1}{2$', '\\[', '\\]', '{', '}', '\\\\', FENCE, 'code', '`\\end{itemize}`',
  '\\setcounter{enumi}{3}', '\\begin{figure}', '\\end{figure}', 'text', '', 'H~2~O',
  '\\item[' + 'W'.repeat(20) + ']', 'x^2^', '\\begin{itemize}\\begin{itemize}\\end{itemize}\\end{itemize}',
  '\\renewcommand*{\\labelitemi}{Z}', '\\renewcommand*{\\x}{\\end{itemize}}',
  '\\renewcommand{\\x}[1][d]{#1}', '\\renewcommand{\\labelitemi}{\\begin{itemize}}',
  '\\renewcommand{\\labelitemi}{\\item x}', '\\renewcommand{\\labelitemi}[1]{Z}',
  '\\renewcommand{\\x}{oops', '\\renewcommand{\\x}[1{#1}',
  '\\item[\\begin{itemize}]', '\\item[\\item]',
  '`x` \\begin{itemize} `y`', '`\\begin{itemize}` \\end{itemize}', '`p` \\end{itemize} `q`',
];
const SEPARATORS = ['\n', '\n', ' ', ''];
const OPTIONS = {
  plain: { outMath: { include_svg: false } },
  docx: { outMath: { include_svg: false }, forDocx: true },
  lines: { outMath: { include_svg: false }, lineNumbering: true },
};

// xorshift32, not an LCG: multiplying past the exact-integer range degenerates the stream, and a
// corpus that stops building lists tests nothing.
const generator = (seed) => {
  let state = seed >>> 0;
  return (n) => {
    state ^= state << 13; state >>>= 0;
    state ^= state >> 17;
    state ^= state << 5; state >>>= 0;
    return state % n;
  };
};

// No opener, or nothing that could close an item: such a document builds no list, so it proves nothing.
const buildsList = (src) => /\\begin\{(itemize|enumerate)\}/.test(src) && /\\item|\\end\{/.test(src);

const documents = () => {
  const rnd = generator(SEED);
  const docs = [];
  while (docs.length < DOCS) {
    const n = 2 + rnd(7);
    // Per gap, not per document: envs written flush against each other are their own class of shape.
    let src = FRAGMENTS[rnd(FRAGMENTS.length)];
    for (let k = 1; k < n; k++) {
      src += SEPARATORS[rnd(SEPARATORS.length)] + FRAGMENTS[rnd(FRAGMENTS.length)];
    }
    if (buildsList(src)) {
      docs.push(src);
    }
  }
  return docs;
};

// An empty environment renders an empty `<ul></ul>`, as it does on master, so an item-less list is
// not asserted here — that is the one class this corpus still produces, and it is inherited.
const violations = (html) => {
  const bad = [];
  // By DOM, not by regex: an empty list must not read as a wrong child, nor whitespace between tags.
  host.innerHTML = html;
  host.querySelectorAll('ul,ol').forEach((list) => {
    list.childNodes.forEach((node) => {
      if (node.nodeType === 1 && node.tagName.toLowerCase() !== 'li') {
        bad.push('a child of the list that is not <li>: <' + node.tagName.toLowerCase() + '>');
      } else if (node.nodeType === 3) {
        // docx fills an empty list with `&amp;nbsp;` — literal text, which `trim()` keeps. Excluded class.
        const text = node.textContent.trim();
        if (text && text !== '&nbsp;') {
          bad.push('text sitting directly in the list');
        }
      }
    });
  });
  if (/<li[^>]*>(?:[^<]|<(?!\/?li|\/?ul|\/?ol))*<\/(ul|ol)>/.test(html)) {
    bad.push('crossed tags');
  }
  const item = (html.match(/<li[\s>]/g) || []).length;
  const itemEnd = (html.match(/<\/li>/g) || []).length;
  if (item !== itemEnd) {
    bad.push('unbalanced <li>: ' + item + '/' + itemEnd);
  }
  const list = (html.match(/<(ul|ol)[\s>]/g) || []).length;
  const listEnd = (html.match(/<\/(ul|ol)>/g) || []).length;
  if (list !== listEnd) {
    bad.push('unbalanced list: ' + list + '/' + listEnd);
  }
  // A marker holding list markup: the marker parse escaped into the document.
  const markers = html.match(/<span class="li_level"[^>]*>((?:(?!<\/span>)[\s\S])*)<\/span>/g) || [];
  if (markers.some((marker) => /<(ul|ol|li)\b/.test(marker))) {
    bad.push('list markup inside a marker');
  }
  return bad;
};

// Open shapes, each pinned in `_data/_lists/_data_known_quirks.js` with what it renders and why.
// Listed by source, so any other document violating an invariant still fails.
const KNOWN = new Set([
  "\\begin{figure} \\begin{itemize}\n\\renewcommand{\\labelitemi}{\\begin{itemize}}\\renewcommand{\\labelitemi}{\\begin{itemize}}\n\\caption{c\n\\renewcommand*{\\x}{\\end{itemize}} \\end{itemize}",
]);

describe('seeded fuzz over list shapes:', () => {
  const docs = documents();
  Object.keys(OPTIONS).forEach((mode) => {
    it('holds the list invariants under ' + mode + ' options', function () {
      // ~1.2ms per document here, so the default 2s would cap the corpus at a few hundred. The margin
      // is for a slower runner, not for the work: this bounds a hang, nothing else.
      this.timeout(Math.max(10000, DOCS * 20));
      const warn = console.warn;
      console.warn = () => {};
      const failures = [];
      try {
        docs.forEach((src, i) => {
          if (KNOWN.has(src)) {
            return;
          }
          let bad;
          try {
            bad = violations(MM.markdownToHTML(src, OPTIONS[mode]));
          } catch (e) {
            bad = ['threw ' + e.name + ': ' + e.message];
          }
          if (bad.length) {
            failures.push('#' + i + ' ' + bad.join('; ') + ' <- ' + JSON.stringify(src));
          }
        });
      } finally {
        console.warn = warn;
      }
      failures.length.should.equal(0, failures.slice(0, 3).join('\n'));
    });
  });
});
