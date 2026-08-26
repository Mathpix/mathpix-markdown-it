const chai = require('chai');
chai.should();

const MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');
const LIST_OPEN = new Set(['itemize_list_open', 'enumerate_list_open']);
const LIST_CLOSE = new Set(['itemize_list_close', 'enumerate_list_close']);
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
// Deterministic: same seed, same documents, same run every time, and a failure prints the source.
// The default is what the suite carries; `npm run test:fuzz` searches 25000, where the last defect
// sat at document 24057 — no default catches everything, so the deep sweep is its own script.
const SEED = 987654321;
const DEFAULT_DOCS = 2000;
// What `test:fuzz` searches: the zone the default leaves untouched, reported below when it was not run.
const DEEP_DOCS = 25000;
// Falls back: a non-numeric value read as `NaN`, built no documents and passed all three tests in 2ms.
const DOCS = Number(process.env.LIST_FUZZ_DOCS) || DEFAULT_DOCS;
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
  // Arguments re-parsed by their own rule: a closer in there took the list's level from inside the
  // nested parse, which `\caption` above cannot reach — its rule eats the argument first.
  '\\footnote{f \\end{itemize} g}', '\\footnotetext{f \\end{itemize} g}',
  '\\footnote{\\begin{itemize}\\item n\\end{itemize}}', '\\text{f \\end{itemize} g}',
  '\\textbf{f \\end{enumerate} g}', '\\footnote{note}',
  // Arguments paired against one code index per source, and the rule ends at an absolute offset.
  '\\diagbox{a}{b}', '\\diagbox{a`}{b}', '\\diagbox{a \\end{itemize}}{b}', '\\diagbox{a',
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
  // Per tag, and in order: counting `ul` and `ol` together let `<ul>…</ol>` pass as balanced, which is
  // the shape the crossed-name fix is about — `\end{itemize}` over an open `<ol>` used to emit `</ul>`.
  const stack = [];
  let crossed = '';
  [...html.matchAll(/<(\/?)(ul|ol)[\s>]/g)].forEach((m) => {
    if (m[1]) {
      const open = stack.pop();
      if (open !== m[2] && !crossed) {
        crossed = '</' + m[2] + '> closes <' + (open || 'nothing') + '>';
      }
    } else {
      stack.push(m[2]);
    }
  });
  if (crossed) {
    bad.push('crossed list tags: ' + crossed);
  }
  if (stack.length) {
    bad.push('list left open: <' + stack.join('><') + '>');
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
// Empty: the one entry left when the command-argument fragments joined the alphabet — measured, that
// shape now balances on its own, so the exclusion went away rather than going quiet.
const KNOWN = new Set([]);

// The stream, not the HTML: a closer taken inside a nested parse leaves the open token unpaired, and
// a consumer walking tokens sees it before any tag does. Own level only — a list built inside a
// command's argument is that argument's, and its pair sits in the children.
const tokenViolations = (src, options) => {
  const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, options);
  let depth = 0;
  let crossed = '';
  const stack = [];
  md.parse(src, {}).forEach((token) => {
    if (LIST_OPEN.has(token.type)) {
      depth++;
      stack.push(token.type.split('_')[0]);
    } else if (LIST_CLOSE.has(token.type)) {
      depth--;
      const open = stack.pop();
      const name = token.type.split('_')[0];
      if (open !== name && !crossed) {
        crossed = name + ' closes ' + (open || 'nothing');
      }
    }
  });
  const bad = [];
  if (depth !== 0) {
    bad.push('unbalanced list tokens: depth ' + depth);
  }
  if (crossed) {
    bad.push('crossed list tokens: ' + crossed);
  }
  return bad;
};

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
      // An entry is an exact source: a changed seed or fragment list makes it stop matching, and the
      // exclusion would go quiet instead of going away.
      const matched = new Set();
      try {
        docs.forEach((src, i) => {
          if (KNOWN.has(src)) {
            matched.add(src);
            return;
          }
          let bad;
          try {
            bad = violations(MM.markdownToHTML(src, OPTIONS[mode]));
            bad = bad.concat(tokenViolations(src, OPTIONS[mode]));
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
      // Full corpus only: a shortened one misses entries harmlessly, and the check read that as stale.
      if (DOCS >= DEFAULT_DOCS) {
        [...KNOWN].filter((src) => !matched.has(src))
          .should.deep.equal([], 'a KNOWN entry matched no document of the corpus');
      }
    });
  });
  // Pending, not silent: the last defect sat at document 24057, which a default run never reaches.
  it(`reaches past document ${DEEP_DOCS}: run \`npm run test:fuzz\``, function () {
    if (DOCS < DEEP_DOCS) {
      this.skip();
    }
    docs.length.should.equal(DOCS, 'the deep run built a shorter corpus than it asked for');
  });
});
