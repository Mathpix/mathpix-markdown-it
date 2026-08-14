const chai = require('chai');
chai.should();

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');
const { buildBlockStateFromRaw } = require('../lib/markdown/md-latex-lists-env/latex-list-env-engine');
const {
  closersLeftAfter,
  hasCloserAhead,
  firstUsableCloser,
  unclosedEnvsIn,
  nextListEnvMatch,
  splitInlineListEnv,
} = require('../lib/markdown/md-latex-lists-env/list-source-model');
const { absorbSublistIntoWrapper } = require('../lib/markdown/md-latex-lists-env/latex-list-tokens');
const { processOpaqueLine } = require('../lib/markdown/md-latex-lists-env/latex-list-opaque');

const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
// A real StateBlockLike from a source string: the model reads `src`, the line marks and `env`, and the
// engine builds exactly that. Asking these functions directly says which one is wrong, where a fixture
// diff only says the HTML changed.
const stateOf = (src) => buildBlockStateFromRaw(md, src, {});
const at = (src, needle, nth = 0) => {
  let pos = -1;
  for (let i = 0; i <= nth; i++) {
    pos = src.indexOf(needle, pos + 1);
  }
  return pos;
};

describe('list source model: closers a sibling may use', () => {
  // The decision that aborted the rule over an unrelated list further down: a closer already claimed by
  // a list opened after `at` is not free, so the count is closers minus openers, not closers.
  const cases = [
    { name: 'one free closer ahead',
      src: '\\begin{itemize}\n\\item a\n\\end{itemize}\n', from: '\\item', expect: 1 },
    { name: 'a whole list below claims its own closer',
      src: '\\begin{itemize}\n\\item a\n\\end{itemize}\n\n\\begin{itemize}\n\\item b\n\\end{itemize}\n',
      from: '\\item', expect: 1 },
    { name: 'two lists below claim both of theirs',
      src: '\\item a\n\\begin{itemize}\n\\end{itemize}\n\\begin{itemize}\n\\end{itemize}\n',
      from: '\\item', expect: 0 },
    { name: 'nothing ahead',
      src: '\\begin{itemize}\n\\item a\n', from: '\\item', expect: 0 },
  ];
  cases.forEach(({ name, src, from, expect }) => {
    it(name, () => {
      closersLeftAfter(stateOf(src), at(src, from)).should.equal(expect);
    });
  });
});

describe('list source model: a wrapper reaching its own closer', () => {
  it('skips a closer written inside a command argument and takes the real one below', () => {
    const src = '\\begin{center}\n\\caption{x \\end{center} y}\nreal text\n\\end{center}\n';
    hasCloserAhead(stateOf(src), at(src, '\\begin{center}'), 'center')
      .should.equal(true, 'the closer in the argument hid the real one');
  });
  it('finds none when the only closer is written in a fence', () => {
    const src = '\\begin{center}\n```\n\\end{center}\n```\n';
    hasCloserAhead(stateOf(src), at(src, '\\begin{center}'), 'center').should.equal(false);
  });
  it('answers false for a name it does not sweep', () => {
    const src = '\\begin{center}\n\\end{center}\n';
    hasCloserAhead(stateOf(src), 0, 'itemize').should.equal(false);
  });
});

describe('list source model: the first closer that is not written as text', () => {
  const src = '\\begin{center}\ntext `\\end{center}` and \\end{center}\n';
  const line = 1;
  const text = src.split('\n')[line];
  it('passes over the one in a code span', () => {
    const found = firstUsableCloser(stateOf(src), line, text, 'center', true);
    (found === null).should.equal(false);
    text.slice(0, found.index).should.match(/`\\end\{center\}` and $/,
      'took the closer inside the code span');
  });
  it('takes the first one when the check is off', () => {
    const found = firstUsableCloser(stateOf(src), line, text, 'center', false);
    found.index.should.equal(text.indexOf('\\end{center}'));
  });
});

describe('list source model: an opaque line hands its tail back', () => {
  it('closes the open tabular, opens the next one and keeps both parts', () => {
    const src = '\\begin{tabular}{l}\na \\end{tabular} & \\begin{tabular}{l}\nb\n';
    const state = stateOf(src);
    const result = processOpaqueLine({
      lineText: 'a \\end{tabular} & \\begin{tabular}{l}',
      stack: ['tabular'], items: [], nextLine: 1, state, renderStart: 0,
    });
    result.stack.should.deep.equal(['tabular'], 'the inner closed and the next opened');
    result.consumedLine.should.equal(true);
    JSON.stringify(result.items).should.match(/tabular/, 'the line never reached the items');
  });
  it('leaves a line with no opaque env alone', () => {
    const src = '\\item a\n';
    const result = processOpaqueLine({
      lineText: '\\item a', stack: [], items: [], nextLine: 0, state: stateOf(src), renderStart: 0,
    });
    result.consumedLine.should.equal(false);
    result.lineText.should.equal('\\item a');
    result.stack.should.deep.equal([]);
  });
});

// The parse loop counts what a tail leaves open, and consumes transitions by its own rule. The comment
// beside it claims the two walk alike; a claim about an invariant belongs in a test.
describe('list source model: the open-env count walks the tail as the parse loop does', () => {
  const walk = (text) => {
    let depth = 0;
    let tail = text;
    let env = nextListEnvMatch(tail);
    while (env) {
      const split = splitInlineListEnv(tail, env.match);
      if (split.isBacktickEscapedPair) {
        break;
      }
      depth += env.isEnd ? -1 : 1;
      tail = split.sE;
      env = nextListEnvMatch(tail);
    }
    return depth;
  };
  it('agrees with a step-by-step walk over 5000 random tails', () => {
    const parts = ['\\begin{itemize}', '\\end{itemize}', '\\begin{enumerate}', '\\end{enumerate}',
      '`', 'text', ' ', '\\item a'];
    let seed = 424242;
    const rnd = (n) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; };
    for (let i = 0; i < 5000; i++) {
      const count = rnd(6);
      let text = '';
      for (let k = 0; k < count; k++) {
        text += parts[rnd(parts.length)] + (rnd(2) ? ' ' : '');
      }
      unclosedEnvsIn(text).should.equal(walk(text), 'disagree on ' + JSON.stringify(text));
    }
  });
});

// The four guards below are unreachable from LaTeX: over every list fixture plus 160 generated shapes
// of a list opening inside a list, dropping any one of them changes no rendered document. They hold
// against a hand-built stream instead, which is what a caller passing tokens straight in can produce.
describe('absorbSublistIntoWrapper: what the guards refuse to move', () => {
  const tok = (type, meta) => {
    const t = { type: type, tag: '', nesting: 0, meta: meta, attrs: null, content: '' };
    return t;
  };
  const itemOpen = (markerEmpty) => tok('latex_list_item_open', markerEmpty ? { markerEmpty: true } : {});
  const types = (tokens) => tokens.map((t) => t.type).join(',');

  it('moves a sublist that follows a marker-less item close', () => {
    const tokens = [tok('itemize_list_open'), itemOpen(true), tok('latex_list_item_close'),
      tok('itemize_list_open'), itemOpen(false), tok('latex_list_item_close'), tok('itemize_list_close'),
      tok('itemize_list_close')];
    absorbSublistIntoWrapper(tokens, 1);
    types(tokens).should.equal('itemize_list_open,latex_list_item_open,itemize_list_open,' +
      'latex_list_item_open,latex_list_item_close,itemize_list_close,latex_list_item_close,itemize_list_close');
  });

  it('moves the second sublist into the close already moved, not past the first sublist', () => {
    const sub = () => [tok('enumerate_list_open'), itemOpen(false), tok('latex_list_item_close'),
      tok('enumerate_list_close')];
    const tokens = [tok('itemize_list_open'), itemOpen(true), tok('latex_list_item_close')]
      .concat(sub(), sub(), [tok('itemize_list_close')]);
    absorbSublistIntoWrapper(tokens, 1);
    // Both sublists sit in the one `<li>`, so its close lands after the second, not between them.
    types(tokens).should.equal('itemize_list_open,latex_list_item_open,' +
      'enumerate_list_open,latex_list_item_open,latex_list_item_close,enumerate_list_close,' +
      'enumerate_list_open,latex_list_item_open,latex_list_item_close,enumerate_list_close,' +
      'latex_list_item_close,itemize_list_close');
  });

  it('leaves a sublist after an item close that carries a marker', () => {
    const tokens = [tok('itemize_list_open'), itemOpen(false), tok('latex_list_item_close'),
      tok('itemize_list_open'), itemOpen(false), tok('latex_list_item_close'), tok('itemize_list_close'),
      tok('itemize_list_close')];
    const before = types(tokens);
    absorbSublistIntoWrapper(tokens, 1);
    types(tokens).should.equal(before);
  });

  it('leaves a sublist that never closes', () => {
    const tokens = [tok('itemize_list_open'), itemOpen(true), tok('latex_list_item_close'),
      tok('itemize_list_open'), itemOpen(false), tok('latex_list_item_close')];
    const before = types(tokens);
    absorbSublistIntoWrapper(tokens, 1);
    types(tokens).should.equal(before);
  });

  it('moves nothing at index 0, where no item close can precede the list', () => {
    const tokens = [tok('itemize_list_open'), itemOpen(true), tok('latex_list_item_close'),
      tok('itemize_list_close')];
    const before = types(tokens);
    absorbSublistIntoWrapper(tokens, 0);
    types(tokens).should.equal(before);
  });
});
