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
  canCloseAfter,
  hasCloserAhead,
  firstUsableCloser,
  unclosedEnvsIn,
  nextListEnvMatch,
  splitInlineListEnv,
  maskNonStructure,
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

describe('list source model: can the tail close what a sibling leaves open', () => {
  // Order, not balance: the sibling takes the closers it reaches first, so an env opened below it —
  // unclosed, or closed later — cannot subtract one. Counting the net cost the sibling its list.
  const cases = [
    { name: 'one closer ahead closes one level', needed: 1, expect: true,
      src: '\\begin{itemize}\n\\item a\n\\end{itemize}\n' },
    { name: 'an unclosed env below does not take it', needed: 1, expect: true,
      src: '\\begin{itemize}\n\\item a\n\\end{itemize}\n\\begin{itemize}\n\\item b\n' },
    { name: 'two levels need two closers, and the order gives them', needed: 2, expect: true,
      src: '\\begin{itemize}\n\\begin{itemize}\n\\item a\n\\end{itemize}\n\\end{itemize}\n' },
    { name: 'a closer that a list opened first has claimed is not reached', needed: 1, expect: false,
      src: '\\begin{itemize}\n\\item a\n\\begin{itemize}\n\\item b\n\\end{itemize}\n' },
    { name: 'nothing ahead closes nothing', needed: 1, expect: false,
      src: '\\begin{itemize}\n\\item a\n' },
    { name: 'nothing to close is answered without a walk', needed: 0, expect: true,
      src: '\\begin{itemize}\n\\item a\n' },
  ];
  cases.forEach(({ name, src, needed, expect }) => {
    it(name, () => {
      canCloseAfter(stateOf(src), at(src, '\\item'), needed).should.equal(expect);
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
  // Mirrors the implementation: matches come from the masked text, the tail is cut in step with it.
  const walk = (text) => {
    let depth = 0;
    let masked = maskNonStructure(text);
    let tail = text;
    let env = nextListEnvMatch(masked);
    while (env) {
      depth += env.isEnd ? -1 : 1;
      const cut = env.match.index + env.match[0].length;
      tail = splitInlineListEnv(tail, env.match).sE;
      masked = masked.slice(cut).trim();
      env = nextListEnvMatch(masked);
    }
    return depth;
  };
  it('agrees with a step-by-step walk over 5000 random tails', () => {
    const parts = ['\\begin{itemize}', '\\end{itemize}', '\\begin{enumerate}', '\\end{enumerate}',
      '`', 'text', ' ', '\\item a'];
    // xorshift32: the plain LCG below it degenerated — three of the eight parts ever appeared, and a
    // backtick was never one of them.
    let seed = 424242 >>> 0;
    const rnd = (n) => {
      seed ^= seed << 13; seed >>>= 0;
      seed ^= seed >> 17;
      seed ^= seed << 5; seed >>>= 0;
      return seed % n;
    };
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

// The four guards below are unreachable from LaTeX: over every list fixture, dropping any one of them
// changes no rendered document. They hold against a hand-built stream instead, which is what a caller
// passing tokens straight in can produce.
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

  // A wrapper inside a range that was itself moved: copying the range verbatim left this one behind,
  // so the shape differed between the first level and the ones under it.
  it('moves a wrapper that sits inside a range it already moved', () => {
    const inner = [tok('enumerate_list_open'), itemOpen(true), tok('latex_list_item_close'),
      tok('itemize_list_open'), itemOpen(false), tok('latex_list_item_close'),
      tok('itemize_list_close'), tok('enumerate_list_close')];
    const tokens = [tok('itemize_list_open'), itemOpen(true), tok('latex_list_item_close')]
      .concat(inner, [tok('itemize_list_close')]);
    absorbSublistIntoWrapper(tokens, 1);
    // Both wrappers keep their sublist: neither item close sits before the list it wraps.
    types(tokens).should.equal('itemize_list_open,latex_list_item_open,' +
      'enumerate_list_open,latex_list_item_open,' +
      'itemize_list_open,latex_list_item_open,latex_list_item_close,itemize_list_close,' +
      'latex_list_item_close,enumerate_list_close,' +
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

// Two readers act on the -1 this returns — one takes the closer as structure, the other opens no
// wrapper — so the suffix invariant its callers keep is pinned here rather than left to a comment.
describe('list source model: the offset anchor answers only for a suffix of its own line', () => {
  const { absoluteOffsetOf, resetUnanchoredOffsets } =
    require('../lib/markdown/md-latex-lists-env/list-source-model');
  const src = '\\begin{itemize}\n\\item a \\end{itemize} tail\n';
  const state = stateOf(src);
  const line = 1;
  const whole = '\\item a \\end{itemize} tail';
  it('a whole line resolves to the offset the source holds', () => {
    const at = absoluteOffsetOf(state, line, whole, whole.indexOf('\\end'), '\\end{itemize}');
    at.should.be.above(0, 'the anchor missed on the line itself');
    src.substr(at, 13).should.equal('\\end{itemize}');
  });
  it('a suffix of it resolves to the same offset', () => {
    const suffix = whole.slice(8);
    const at = absoluteOffsetOf(state, line, suffix, suffix.indexOf('\\end'), '\\end{itemize}');
    at.should.equal(src.indexOf('\\end{itemize}', 1), 'a suffix must anchor like the line');
  });
  it('a middle slice answers -1 rather than a shifted offset', () => {
    const middle = whole.slice(0, whole.length - 5);
    absoluteOffsetOf(state, line, middle, middle.indexOf('\\end'), '\\end{itemize}')
      .should.equal(-1, 'a shifted anchor passed as a real offset');
    resetUnanchoredOffsets();      // broke the invariant on purpose; the root hook holds the rest
  });
});

// The count is read in source order, `\end` first on a tie, and it walks with two cursors instead of
// re-matching a shorter copy per transition — slicing made a line of openers quadratic.
describe('unclosedEnvsIn counts transitions in order, at any length:', () => {
  it('counts what the line leaves open', () => {
    unclosedEnvsIn('\\begin{itemize}').should.equal(1);
    unclosedEnvsIn('\\begin{itemize}\\begin{enumerate}').should.equal(2);
    unclosedEnvsIn('\\end{itemize} \\begin{itemize}').should.equal(0);
    unclosedEnvsIn('\\begin{itemize} \\end{itemize} \\begin{enumerate}').should.equal(1);
    unclosedEnvsIn('plain text').should.equal(0);
  });
  it('an opener written as text is not a transition', () => {
    unclosedEnvsIn('`\\begin{itemize}`').should.equal(0, 'a code span counted');
    unclosedEnvsIn('\\item[\\begin{itemize}]').should.equal(0, 'a marker counted');
    unclosedEnvsIn('`\\begin{itemize}` \\begin{enumerate}').should.equal(1);
  });
  it('and it is idempotent on already masked text', () => {
    const line = '\\begin{itemize} `\\end{itemize}` \\begin{enumerate}';
    unclosedEnvsIn(maskNonStructure(line)).should.equal(unclosedEnvsIn(line));
  });
  it('scales with the transitions, not with their square', function () {
    this.timeout(60000);
    const line = (n) => Array.from({ length: n }, () => '\\begin{itemize}').join(' ');
    const median = (text) => {
      for (let i = 0; i < 3; i++) { unclosedEnvsIn(text); }
      const runs = [];
      for (let i = 0; i < 5; i++) {
        const started = process.hrtime.bigint();
        unclosedEnvsIn(text);
        runs.push(Number(process.hrtime.bigint() - started) / 1e6);
      }
      return Math.max(runs.sort((a, b) => a - b)[2], 0.001);
    };
    // Both sides clear of the clock: at 800 the small side measured 0.0 ms and the floor below turned
    // noise into a ratio of hundreds. ×8 of the input reads 5.7 here, 64 with the slicing walk.
    const growth = median(line(25600)) / median(line(3200));
    growth.should.be.below(24, 'grows like the square of the transitions: ×' + growth.toFixed(1));
  });
});
