let chai = require('chai');
let should = chai.should();

const markdownIt = require('markdown-it');
const Ruler = require('markdown-it/lib/ruler');
const { mathpixMarkdownPlugin } = require('../lib/index.js');
const MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const {
  snapshotListLevels,
  restoreListLevels,
  getOpenListCount,
  getListDepth,
  resetListState,
} = require('../lib/markdown/md-latex-lists-env/list-state');
const { applyListOpenState } = require('../lib/markdown/md-latex-lists-env/latex-list-common');
const { resetWarnDistinct, warnDistinct } = require('../lib/markdown/common/warn-distinct');
const listEnvEngine = require('../lib/markdown/md-latex-lists-env/latex-list-env-engine');
const {
  LIST_TRANSIENT_ENV_KEYS,
  snapshotEnvAll,
  snapshotEnvForInline,
  releaseEnvSnapshot,
  resetEnvSnapshotPool,
  restoreEnvAll,
  restoreEnvKeysFromAll,
} = require('../lib/markdown/common/env-transient');

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

// The snapshot drain and the degradation counters live in `tests/hooks/root-hooks.js` now: registered
// from here they covered `npm test` alone, and a run of one file is the development loop.

// The list rule moves a line's marks to hand its leftover back, as `blockquote` does for its own range.
// Left moved they would hold for the rest of the phase, and `getLines` reads `bMarks` as the line start.
describe('the block phase leaves the line marks as it found them', () => {
  const shapes = {
    'a leftover after the closer': '\\begin{itemize}\n\\item a\n\\end{itemize} TAIL',
    'a leftover after an eaten prefix':
      '\\begin{itemize}\n\\item a\n\\renewcommand{\\labelitemi}{Z} \\end{itemize} TAIL',
    'a leftover inside a markdown item':
      '- \\begin{itemize}\n  \\item a\n  \\end{itemize} tail text\n- second',
  };
  Object.entries(shapes).forEach(([name, src]) => {
    it(name, () => {
      const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
      const parser = md.block;
      const realTokenize = parser.tokenize.bind(parser);
      let before = null;
      let state = null;
      parser.tokenize = function (blockState, from, to) {
        if (!before) {
          before = { b: Array.from(blockState.bMarks), t: Array.from(blockState.tShift) };
          state = blockState;
        }
        return realTokenize(blockState, from, to);
      };
      const warn = console.warn;
      console.warn = () => {};
      try {
        md.render(src);
      } finally {
        console.warn = warn;
        parser.tokenize = realTokenize;
      }
      before.b.filter((v, i) => v !== state.bMarks[i]).should.have.lengthOf(0, 'bMarks left moved');
      before.t.filter((v, i) => v !== state.tShift[i]).should.have.lengthOf(0, 'tShift left moved');
    });
  });
});

// The host flag decides whether a list gets an `<li>` of its own, and it is cached per token array. Keyed
// by length and end types alone it served one document's flags to another that collided on both, and the
// flags pair the tags: the second render emitted an `<li>` with no close.
describe('the host-flag cache does not outlive its token array', () => {
  const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
  // Same length and end types, and the flags differ at an index the second shape asks about: warming with
  // the first leaves a 0 where the second needs a host item, so its closing `</li>` never comes.
  const hosted = '\\begin{itemize}\n\\begin{itemize}\n\\item[] a0\n\\end{itemize}\n\\item[] z\n\\end{itemize}';
  const plain = '\\begin{itemize}\n\\begin{itemize}\n\\item[] a0\n\\item[] a1\n\\end{itemize}\n\\end{itemize}';
  const quiet = (fn) => {
    const warn = console.warn;
    console.warn = () => {};
    try { return fn(); } finally { console.warn = warn; }
  };
  it('a second walk over a rewritten array reads its own flags', () => {
    const envA = {};
    const envFresh = {};
    const envSwap = {};
    const tokensA = quiet(() => md.parse(hosted, envA));
    const tokensFresh = quiet(() => md.parse(plain, envFresh));
    const tokensSwap = quiet(() => md.parse(plain, envSwap));
    tokensA.should.have.lengthOf(tokensSwap.length, 'the two shapes stopped colliding on length');
    const fresh = quiet(() => md.renderer.render(tokensFresh, md.options, envFresh));
    quiet(() => md.renderer.render(tokensA, md.options, envA));
    for (let i = 0; i < tokensA.length; i++) { tokensA[i] = tokensSwap[i]; }
    const swapped = quiet(() => md.renderer.render(tokensA, md.options, envA));
    (swapped.match(/<li[\s>]/g) || []).should.have.lengthOf((swapped.match(/<\/li>/g) || []).length,
      'the flags left an <li> unclosed');
    swapped.should.equal(fresh, 'the array kept the flags of what it held before');
  });
});

// Private to markdown-it, and read in a dozen places. An upgrade renaming them leaves every guard
// falling back in silence — the footnote terminator cache would simply stop caching.
describe('the private markdown-it internals we read still behave as assumed', () => {
  const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
  it('__find__ answers an index for a known rule and -1 for an unknown one', () => {
    [md.block.ruler, md.inline.ruler, md.core.ruler].forEach((ruler) => {
      (typeof ruler.__find__).should.equal('function');
      ruler.__find__('нет-такого-правила').should.equal(-1);
    });
    md.block.ruler.__find__('paragraph').should.be.at.least(0);
    md.core.ruler.__find__('normalize').should.be.at.least(0);
  });
  it('__rules__ is an array of entries carrying name, enabled and fn', () => {
    const rules = md.block.ruler.__rules__;
    Array.isArray(rules).should.equal(true);
    Object.keys(rules[0]).should.include.members(['name', 'enabled', 'fn']);
  });
  // What the footnote cache keys on: the token is the cache object, and a toggle drops it.
  it('__cache__ is filled by getRules and nulled by a toggle', () => {
    const ruler = md.block.ruler;
    ruler.getRules('');
    (ruler.__cache__ === null).should.equal(false, 'getRules left no cache to key on');
    md.disable('paragraph');
    (ruler.__cache__ === null).should.equal(true, 'a toggle no longer invalidates the cache');
    md.enable('paragraph');
  });
});

// Each sub-plugin (TOC, theorem, labels, footnotes, lists, text counters)
// holds module-level state. If those aren't reset per parse, re-rendering the
// same source on one md instance drifts — extra `-2` slugs, bumped section
// numbers, stale footnote refs.
describe('parse isolation: repeat-render of same source produces identical HTML', () => {
  const mkMd = () => markdownIt({ html: true, breaks: true }).use(mathpixMarkdownPlugin, {
    outMath: { include_svg: true }, mathJax: {}, renderElement: {},
    smiles: {}, forDocx: false, forLatex: false,
  });
  it('TOC with repeated headings does not accumulate slug suffixes', () => {
    const md = mkMd();
    const src = '[[toc]]\n\n# Introduction\n\n## Goals\n';
    const first = md.render(src);
    const second = md.render(src);
    const third = md.render(src);
    second.should.equal(first);
    third.should.equal(first);
  });
  it('section + equation label + footnote: three parses yield identical output', () => {
    const md = mkMd();
    const src =
      '[[toc]]\n\n' +
      '\\section{Intro}\n\n' +
      '\\begin{equation}\\label{E1}x=1\\end{equation}\n\n' +
      'See~\\ref{E1}. Also.\\footnote{note}\n';
    const first = md.render(src);
    const second = md.render(src);
    const third = md.render(src);
    second.should.equal(first);
    third.should.equal(first);
  });
  it('itemize with \\renewcommand{\\labelitemi}: second parse sees the fresh definition', () => {
    const md = mkMd();
    const srcA = '\\renewcommand{\\labelitemi}{*}\n\n' +
      '\\begin{itemize}\n\\item one\n\\item two\n\\end{itemize}\n';
    const srcB = '\\renewcommand{\\labelitemi}{\\dagger}\n\n' +
      '\\begin{itemize}\n\\item one\n\\item two\n\\end{itemize}\n';
    md.render(srcA);
    const second = md.render(srcB);
    // Second parse's marker must come from srcB's \renewcommand, not from
    // srcA's stale cached itemizeLevelTokens.
    second.should.not.include('>*<');
  });
  // The marker definitions are per md instance, not per render: a host rendering one document in
  // chunks has the \renewcommand in an earlier chunk. Only the parsed marker tokens are cleared.
  it('a \\renewcommand marker carries to the next render, a fresh instance starts from the default', () => {
    const marker = (html) => (html.match(/<span class="li_level">([^<]*)<\/span>/) || [])[1];
    const list = '\\begin{itemize}\n\\item a\n\\end{itemize}\n';
    const md = mkMd();
    marker(md.render(list)).should.equal('•');
    md.render('\\renewcommand{\\labelitemi}{*}\n\n' + list);
    marker(md.render(list)).should.equal('*', 'the definition must outlive the render that set it');
    marker(mkMd().render(list)).should.equal('•');
  });
  it('tabular parse error from doc 1 does not leak into doc 2', () => {
    const md = mkMd();
    const broken = '\\begin{tabular}{|c|}\nmissing end\n';
    const clean = '\\begin{tabular}{|c|}\n\\hline\nok \\\\\n\\hline\n\\end{tabular}\n';
    md.render(broken);
    const clean1 = md.render(clean);
    const clean2 = md.render(clean);
    clean2.should.equal(clean1);
  });
  it('math cache on env is released at end of parse', () => {
    const md = mkMd();
    const env = {};
    md.parse('$x^2$ and $x^2$', env);
    (env.__mathpix === null || env.__mathpix === undefined).should.equal(true);
  });
  it('TOC token-tree stash happens only when [[toc]] is used', () => {
    const md = mkMd();
    const envWith = {};
    md.parse('[[toc]]\n\n# H', envWith);
    envWith.should.have.property('__mathpix_toc_tokens');
    const envWithout = {};
    md.parse('# H\n\n## H2', envWithout);
    envWithout.should.not.have.property('__mathpix_toc_tokens');
  });
  // coreInline writes envToInline keys to state.env for block-rule visibility.
  // This test pins the invariant: two tokens with different envToInline objects
  // render correctly; a regression here signals iteration-level leak affecting output.
  it('two section tokens with envToInline render independently', () => {
    const md = mkMd();
    const src = '\\section{First // line}\n\nplain text\n\n\\section{Second // line}\n';
    const first = md.render(src);
    const second = md.render(src);
    second.should.equal(first);
    // doubleSlashToSoftBreak from section envToInline must take effect in BOTH
    // section titles and NOT bleed into the plain paragraph between them.
    first.should.match(/First/);
    first.should.match(/Second/);
  });
});

// The Lists block rule parses speculatively into a buffered state that shares `env`
// by prototype. A silent probe (used by the footnote block rules as a terminator)
// must not leak env mutations into the real state.
describe('silent-mode Lists does not mutate shared env', () => {
  const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, {});
  const listsRule = md.block.ruler.__rules__.find(r => r.name === 'Lists').fn;
  // Full-snapshot check (keys + values) so a leak of any transient env field is caught,
  // for both a closed and an unclosed list.
  // Keys are restored to undefined, not deleted — only defined values count as leaked state.
  const snapshot = (env) =>
    Object.keys(env).filter((k) => env[k] !== undefined).sort().join(',') + '|' + JSON.stringify(env);
  [
    { name: 'closed list', src: '\\begin{itemize}\n\\item a\n\\end{itemize}\n' },
    { name: 'unclosed list', src: '\\begin{itemize}\n\\item a\n' },
    // A float in the body makes begin-table write its env keys — none may survive the probe.
    {
      name: 'list holding a figure',
      src: '\\begin{itemize}\n\\item[a] x\n\\begin{figure}\n\\centering\n\\caption{F}\n\\end{figure}\n\\end{itemize}\n',
    },
    {
      name: 'unclosed list holding a table',
      src: '\\begin{itemize}\n\\item[a] x\n\\begin{table}\n\\caption{T}\n\\begin{tabular}{|l|}\nc\n\\end{tabular}\n\\end{table}\n',
    },
    // One body per env the item content admits, plus the other rules reachable from there. The
    // rollback covers whatever they write, so this list is coverage, not a registry of keys.
    ...[
      ['an align env', '\\begin{align}\na &= b\n\\end{align}'],
      ['a section', '\\section{Head}'],
      ['a label', '\\label{x}'],
      ['a footnote', '\\footnote{n}'],
      ['a tabular', '\\begin{tabular}{|l|}\nq\n\\end{tabular}'],
      ['a fence', '```\ncode\n```'],
      ['display math', '$$x^2$$'],
      ['a centered block', '\\begin{center}\ncentred\n\\end{center}'],
      ['a left block', '\\begin{left}\nleft\n\\end{left}'],
      ['a right block', '\\begin{right}\nright\n\\end{right}'],
      ['an lstlisting', '\\begin{lstlisting}\ncode\n\\end{lstlisting}'],
      ['a proof', '\\begin{proof}\nq\n\\end{proof}'],
      ['a theorem', '\\newtheorem{thm}{Thm}\n\\begin{thm}\nq\n\\end{thm}'],
      ['an array', '\\begin{array}{cc}a & b\\end{array}'],
      ['a cases env', '\\begin{cases}x & y\\end{cases}'],
      ['an includegraphics', '\\includegraphics{img.png}'],
      ['a labelled align', '\\begin{align}x=1\\label{e}\\end{align}'],
    ].map(([what, body]) => ({
      name: 'list holding ' + what,
      src: '\\begin{itemize}\n\\item[a] x\n' + body + '\n\\end{itemize}\n',
    })),
  ].forEach(({ name, src }) => {
    it(`a silent Lists probe over a ${name} leaves state.env unchanged`, () => {
      const env = {};
      const before = snapshot(env);
      const state = new md.block.State(src, md, env, []);
      listsRule(state, 0, state.lineMax, true); // silent probe
      snapshot(state.env).should.equal(before);
    });
  });
  // Snapshots come from a pool, so a shorter one must not answer from the tail of a longer one — the
  // rollback would then restore keys the env never had, leaking the very flag it exists to contain.
  // `envToInline` is replayed onto the shared env, so the four transient list flags must never reach it;
  // every other key does, `undefined` included, as the `{...env}` spread this replaced always did.
  it('the transient flags never reach envToInline, every other key does', () => {
    const replayed = (key) => Object.prototype.hasOwnProperty.call(
      snapshotEnvForInline({ [key]: undefined }), key);
    LIST_TRANSIENT_ENV_KEYS.forEach((key) => {
      replayed(key).should.equal(false, key + ' would wake the inline fallback on the next block');
    });
    ['isInline', 'subTabular', 'tabulare', 'caption', 'envType', 'align', 'number', 'consumerKey']
      .forEach((key) => {
        replayed(key).should.equal(true, key + ' must reach the replay, cleared or not');
      });
    // A live value rides along unchanged, and symbol keys (caches, TOC tokens) keep their reach.
    const marker = Symbol('probe');
    const snap = snapshotEnvForInline({ live: 7, isBlock: true, [marker]: 'kept' });
    snap.live.should.equal(7);
    (snap.isBlock === undefined).should.equal(true);
    snap[marker].should.equal('kept');
  });

  it('releasing a snapshot lets go of the values it held', () => {
    // The pool slot outlives the parse, so a released snapshot must not keep a document's objects.
    const canary = { blob: new Array(1000).fill(0) };
    const snapshot = snapshotEnvAll({ heavy: canary });
    snapshot.length.should.equal(1);
    releaseEnvSnapshot();
    snapshot.length.should.equal(0);
    snapshot.values.indexOf(canary).should.equal(-1);
  });

  // Values are compared by identity, so a key whose object is mutated in place is NOT rolled back.
  // Pinned as a boundary, not a wish: a rule writing inside an object on `env` must undo it itself.
  it('the rollback restores scalars and leaves an in-place mutation alone', () => {
    const env = { ctx: { touched: false }, scalar: 'original' };
    const snapshot = snapshotEnvAll(env);
    env.ctx.touched = true;
    env.scalar = 'written by the parse';
    env.added = 'new key';
    restoreEnvAll(env, snapshot);
    releaseEnvSnapshot();
    env.scalar.should.equal('original');
    (env.added === undefined).should.equal(true);
    env.ctx.touched.should.equal(true, 'in-place mutation is out of the rollback by design');
  });

  // The marker registries sit outside the rollback: a `\renewcommand` in a body that never closes is
  // applied by its own block rule. What must hold is that the answer never depends on when that write
  // lands — the same for a fresh instance, the first render and the next.
  it('a marker command in a body that never closes applies alike on every render', () => {
    const marker = (html) => (html.match(/<span class="li_level">([\s\S]*?)<\/span>/) || [])[1];
    const build = () => markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    const source = (before) => before
      + '\n\\begin{itemize}\n\\renewcommand{\\labelitemi}{ZZZ}\n\\item a\n\n\\begin{itemize}\n\\item b\n\\end{itemize}';
    ['Para \\footnote{n}', 'Para', 'text'].forEach((before) => {
      const warned = [];
      const warn = console.warn;
      console.warn = (...args) => warned.push(String(args[0]));
      const shared = build();
      const first = marker(shared.render(source(before), {}));
      const second = marker(shared.render(source(before), {}));
      const fresh = marker(build().render(source(before), {}));
      console.warn = warn;
      first.should.equal('ZZZ', 'the command in a discarded body did not apply after "' + before + '"');
      second.should.equal(first, 'the second render on the same instance answered differently');
      fresh.should.equal(first, 'a fresh instance answered differently');
      warned.should.have.length(0, 'warned: ' + warned.join(' | '));
    });
  });

  // The level snapshot is structural, not a count: `openItems` decides whether a chunk before the first
  // `\item` gets a marker-less `<li>`, and a count puts back neither it nor a level the parse dropped.
  it('the level rollback restores openItems and a level a parse removed', () => {
    const before = snapshotListLevels();
    try {
      restoreListLevels([{ openItems: 3 }, { openItems: 7 }]);
      const snap = snapshotListLevels();
      restoreListLevels([]);
      getOpenListCount().should.equal(0);
      restoreListLevels(snap);
      getOpenListCount().should.equal(2, 'a dropped level did not come back');
      snapshotListLevels().map((level) => level.openItems).should.deep.equal([3, 7]);
      // The snapshot is a copy, so a later parse counting more items cannot rewrite it.
      const live = snapshotListLevels();
      restoreListLevels([{ openItems: 99 }, { openItems: 7 }]);
      live.map((level) => level.openItems).should.deep.equal([3, 7]);
    } finally {
      restoreListLevels(before);
    }
  });

  // Deleting and adding in one parse take different branches of the restore: the count check alone reads
  // an env of the same size as untouched.
  it('a key the parse deleted comes back, one it added is left present and undefined', () => {
    const env = { kept: 'original', doomed: 'was here' };
    const snapshot = snapshotEnvAll(env);
    delete env.doomed;
    env.fresh = 1;
    restoreEnvAll(env, snapshot);
    releaseEnvSnapshot();
    env.doomed.should.equal('was here');
    env.kept.should.equal('original');
    (env.fresh === undefined).should.equal(true);
    Object.prototype.hasOwnProperty.call(env, 'fresh')
      .should.equal(true, 'the key was deleted, which drops env into dictionary mode');
  });

  // Restoring out of order would blank every key the consumer owns — worse than not restoring at all.
  it('a snapshot that is not the innermost one is not used to restore', () => {
    const env = { a: 'original' };
    const snap = snapshotEnvAll(env);
    snapshotEnvAll({ b: 1 });
    env.a = 'written by the parse';
    env.added = 'new';
    const said = [];
    const warn = console.warn;
    console.warn = (...args) => said.push(String(args[0]));
    try {
      restoreEnvAll(env, snap);
    } finally {
      console.warn = warn;
      releaseEnvSnapshot();
      releaseEnvSnapshot();
    }
    said.join(' ').should.match(/not the innermost one/);
    env.a.should.equal('written by the parse', 'the consumer key was blanked from an emptied snapshot');
    env.added.should.equal('new');
  });

  // A nested parse would hit the reset hook while the outer snapshot is live. Emptying that slot would
  // leave the outer parse unable to put its keys back, so the reset is refused and says so.
  it('a pool reset while a snapshot is live is refused, and the restore still works', () => {
    resetWarnDistinct();                 // the key is deduped per render, and a test above spent it
    const env = { parentType: 'MINE' };
    const snap = snapshotEnvAll(env);
    const said = [];
    const warn = console.warn;
    console.warn = (...args) => said.push(String(args[0]));
    try {
      resetEnvSnapshotPool();
      env.parentType = 'written by the parse';
      restoreEnvKeysFromAll(env, LIST_TRANSIENT_ENV_KEYS, snap);
    } finally {
      console.warn = warn;
      releaseEnvSnapshot();
    }
    said.join(' ').should.match(/pool reset while a snapshot is live/);
    env.parentType.should.equal('MINE', 'the live snapshot must still restore the consumer key');
  });

  // Drift costs slots, not correctness: the next snapshot is still the innermost one and still restores.
  // But the pool reset leaves a live depth alone now, so a leaked slot per throw would never come back.
  it('a getter that throws mid-snapshot leaks no pool slot', () => {
    const hostile = new Proxy({ a: 1, boom: 2 }, {
      get(target, key) {
        if (key === 'boom') {
          throw new Error('getter blew up');
        }
        return target[key];
      },
    });
    const first = snapshotEnvAll({ a: 1 });
    releaseEnvSnapshot();
    for (let i = 0; i < 3; i++) {
      (() => snapshotEnvAll(hostile)).should.throw(/getter blew up/);
    }
    const again = snapshotEnvAll({ a: 1 });
    releaseEnvSnapshot();
    again.should.equal(first, 'each throw kept its slot, so the pool grows per failed snapshot');
  });
  // Blanking is for a key the parse added. A key neither side ever had must stay absent, or a list whose
  // body writes no flags — an empty one — would hand the consumer four own keys holding `undefined`.
  it('a key neither the snapshot nor the parse has is not created', () => {
    const env = { mine: 1 };
    const snap = snapshotEnvAll(env);
    env.isBlock = true;
    try {
      restoreEnvKeysFromAll(env, LIST_TRANSIENT_ENV_KEYS, snap);
    } finally {
      releaseEnvSnapshot();
    }
    Object.keys(env).should.deep.equal(['mine', 'isBlock']);
    (env.isBlock === undefined).should.equal(true, 'the key the parse set is blanked, not left live');
  });
  it('an empty list body leaves the consumer env as it was', () => {
    const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    const env = { mine: 1 };
    md.render('\\begin{itemize}\n\\end{itemize}', env);
    LIST_TRANSIENT_ENV_KEYS.forEach((key) =>
      Object.prototype.hasOwnProperty.call(env, key)
        .should.equal(false, `${key} was created by the restore`));
  });
  it('a snapshot of a smaller env does not see the previous one', () => {
    const rich = snapshotEnvAll({ isBlock: true, inheritedListType: 'itemize', prentLevel: 7, x: 1 });
    rich.length.should.equal(4);
    releaseEnvSnapshot();
    const empty = snapshotEnvAll({});
    empty.length.should.equal(0);
    const target = {};
    restoreEnvKeysFromAll(target, LIST_TRANSIENT_ENV_KEYS, empty);
    releaseEnvSnapshot();
    LIST_TRANSIENT_ENV_KEYS.forEach((key) => {
      (target[key] === undefined).should.equal(true, key + ' came back from a stale snapshot');
    });
  });
});

// Only the caption counters are rolled back; the other global registries written from a list body
// must not drift either. No blank line after `Para` is what fires the paragraph-terminator probe.
describe('a speculative list parse does not advance other global registries', () => {
  const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
  const bothForms = (before, list, after) =>
    ['\n', '\n\n'].map((sep) => md.render(before + sep + list + '\n\n' + after));
  it('a \\label inside a list body resolves to the same number either way', () => {
    const [probed, separated] = bothForms(
      'Para',
      '\\begin{itemize}\n\\item[1.] \\begin{align}x=1\\label{eq:a}\\end{align}\n\\end{itemize}',
      'See \\ref{eq:a}.');
    const refNumber = (html) => (html.match(/>(\d+)<\/a>/) || [])[1];
    refNumber(probed).should.equal(refNumber(separated));
  });
  // No theorem case: a \begin{theorem} inside a list body is not rendered at all, so its counter
  // is unreachable from the speculative parse. See Non-Goals.

  // The probe runs the whole body, so a registry written from inside it would take the entry twice.
  // These three are not rolled back (see LIST_TRANSIENT_ENV_KEYS), so the absence of a double entry is
  // the property to hold, not an assumption.
  it('a heading inside a list body slugs and numbers once', () => {
    const html = md.render('Para\n\\begin{itemize}\n\\item[1.] \\section{Alpha}\n\\end{itemize}\n\n\\section{Beta}');
    (html.match(/id="alpha(-\d+)?"/g) || []).length.should.be.at.most(1, 'the slug was taken twice');
    html.should.not.match(/id="alpha-2"/, 'a second slug means the probe registered one');
    const numbers = (html.match(/class="section-number">([^<]*)</g) || []).map((m) => m.replace(/\D+/g, ''));
    numbers.should.deep.equal([...new Set(numbers)], 'a section number repeated');
  });
  it('a \\label inside a list body registers once, so \\ref resolves', () => {
    const html = md.render('Para\n\\begin{itemize}\n\\item[1.] \\begin{align}x=1\\label{eq:solo}\\end{align}\n'
      + '\\end{itemize}\n\nSee \\ref{eq:solo}.');
    (html.match(/id="eq:solo"/g) || []).length.should.be.at.most(1, 'the label was registered twice');
    html.should.not.match(/\\ref\{eq:solo\}/, 'the ref stayed unresolved');
  });
  it('a footnote inside a list body appears once in the footnote section', () => {
    const html = md.render('Para\n\\begin{itemize}\n\\item[1.] x\\footnote{once}\n\\end{itemize}');
    (html.match(/once/g) || []).length.should.equal(1, 'the footnote body was emitted twice');
    (html.match(/class="footnote-ref"/g) || []).length.should.equal(1);
  });


  // The caption counters are restored on a non-committing exit, which is only safe while no token
  // outside the discarded parse carries a number from it. Pin the observable form: numbers never
  // repeat, whatever the list body holds.
  it('caption numbers keep increasing across a probed list holding a figure', () => {
    const numbers = (src) => (md.render(src).match(/Figure\s*\d+|Table\s*\d+/g) || []);
    const bodies = [
      '\\begin{figure}\n\\caption{A}\n\\end{figure}',
      '\\begin{tabular}{|l|}\n\\begin{figure}\\caption{A}\\end{figure}\n\\end{tabular}',
      '\\begin{table}\n\\caption{A}\n\\end{table}',
    ];
    bodies.forEach((body) => {
      const found = numbers('Para \\footnotetext{f}\n\\begin{itemize}\n\\item[a] x\n' + body +
        '\n\\end{itemize}\n\n\\begin{figure}\n\\caption{B}\n\\end{figure}');
      found.should.have.length.above(0);
      const seen = new Set(found);
      seen.size.should.equal(found.length, 'a caption number repeats: ' + found.join(','));
    });
  });
});

// A discarded parse enters a list level per `\begin` and never leaves it, so the depth is rolled
// back in the rule's finally. Without that the levels grow with the number of probes, and a
// terminator scan probes each list start once per line — quadratic in the document, not linear.
describe('a discarded list parse does not retain list levels', () => {
  const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, {});
  const list = '\\begin{itemize}\n\\item[a] x\n\\begin{itemize}\n\\item[XXXXXXXXXXXX] y\n\\end{itemize}\n\\end{itemize}\n';
  const unclosed = (n) => Array.from({ length: n }, () => '\\begin{itemize}\n\\item stray\n').join('\n');
  [1, 6].forEach((n) => {
    it(`${n} unclosed \\begin{itemize} before a list leave its HTML unchanged`, () => {
      const withPrefix = md.render(unclosed(n) + '\n' + list);
      withPrefix.should.include(md.render(list).trim());
    });
  });
  it('markers and items stay balanced after the discarded parses', () => {
    const html = md.render(unclosed(6) + '\n' + list);
    const count = (re) => (html.match(re) || []).length;
    count(/<ul/g).should.equal(count(/<\/ul>/g));
    count(/<li/g).should.equal(count(/<\/li>/g));
  });
  // The shape that grew the levels: unclosed envs, no blank line (else the scan stops), and a
  // closer later on (else the sweep rejects before a level is entered).
  it('the retained level count does not grow with the number of probes', () => {
    const unit = 'Paragraph text before the list with no blank line separator.\n' +
      '\\begin{itemize}\n\\item[a] x\n';
    const build = (n) => unit.repeat(n) + '\n\\begin{itemize}\n\\item[z] q\n\\end{itemize}\n';
    [10, 60].forEach((n) => {
      md.render(build(n));
      // Every level entered by a discarded parse is unwound, so nothing is retained.
      getOpenListCount().should.equal(0, `levels retained after ${n} units`);
      getListDepth().should.equal(-1);
    });
  });
});

// A rule that fails does not apply, rather than failing the document. The one exception is a failure
// past the commit point: its tokens are already in state, so there is nothing to fall back to.
describe('a failing list rule does not fail the document', () => {
  const src = '\\begin{itemize}\n\\item[a] visible text\n\\end{itemize}';
  const breakAt = (name) => {
    const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    const original = listEnvEngine[name];
    listEnvEngine[name] = function () { throw new Error('rule blew up in ' + name); };
    const warn = console.warn;
    const warnings = [];
    console.warn = (...args) => warnings.push(String(args[0]));
    try {
      return { html: md.render(src), warnings };
    } finally {
      console.warn = warn;
      listEnvEngine[name] = original;
      listEnvEngine.resetListRuleFailures();      // degraded on purpose; the root hook holds the rest
    }
  };
  it('a failure before the commit point keeps the content and warns once', () => {
    const { html, warnings } = breakAt('createBufferedState');
    html.should.include('visible text');
    warnings.should.have.length(1);
    getListDepth().should.equal(-1);
  });
  // The inline path parses the env through the engine, so it needs the same containment: whether the
  // environment sits on its own line decides which path runs, and that must not decide the outcome.
  const inlineShapes = {
    'after text on the same line': 'text \\begin{itemize}\\item[x] visible text\\end{itemize}',
    'inside a markdown table cell': '| h |\n| :-- |\n| \\begin{itemize}\\item[x] visible text\\end{itemize} |',
  };
  Object.entries(inlineShapes).forEach(([where, src]) => {
    it(`a failure on the inline path ${where} keeps the document`, () => {
      const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
      const original = listEnvEngine.parseListEnvRawToTokens;
      listEnvEngine.parseListEnvRawToTokens = function () { throw new Error('inline path blew up'); };
      const warn = console.warn;
      const warnings = [];
      console.warn = (...args) => warnings.push(String(args[0]));
      try {
        const html = md.render(src);
        html.should.include('visible text');
        warnings.should.have.length(1);
      } finally {
        console.warn = warn;
        listEnvEngine.parseListEnvRawToTokens = original;
        listEnvEngine.resetListRuleFailures();
      }
    });
  });
  // An incremental host re-renders one block per keystroke with `renderElement.startLine`, and that
  // path skips the global reset — so the diagnostic reset has to sit outside it, or the second render
  // and every one after it degrade in silence.
  it('a partial re-render warns every time, not once per process', () => {
    const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin,
      { outMath: { include_svg: false }, renderElement: { startLine: 0 } });
    const original = listEnvEngine.createBufferedState;
    listEnvEngine.createBufferedState = function () { throw new Error('same cause every render'); };
    const warn = console.warn;
    const warnings = [];
    console.warn = (...args) => warnings.push(String(args[0]));
    try {
      const src = '\\begin{itemize}\n\\item[a] visible text\n\\end{itemize}';
      md.render(src).should.include('visible text');
      warnings.should.have.length(1);
      md.render(src).should.include('visible text');
      warnings.should.have.length(2, 'the second render degraded without a word');
    } finally {
      console.warn = warn;
      listEnvEngine.createBufferedState = original;
      listEnvEngine.resetListRuleFailures();
    }
  });
  // The opaque loop ends when its tail stops shrinking, not after a step count, so how many envs a
  // line closes decides nothing. A step count of 50 took the tail as text from the 50th pair on.
  it('an opaque line closing many envs is processed whatever their number', () => {
    const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    const nested = (n) => '\\begin{itemize}\n\\item visible text\n' +
      Array.from({ length: n }, () => '\\begin{tabular}{l}').join('\n') + '\ncell\n' +
      Array.from({ length: n }, () => '\\end{tabular}').join(' ') + '\n\\end{itemize}\n';
    [5, 60].forEach((n) => {
      const warn = console.warn;
      const warnings = [];
      console.warn = (...args) => warnings.push(String(args[0]));
      let html;
      try { html = md.render(nested(n), {}); } finally { console.warn = warn; }
      html.should.include('visible text');
      html.should.include('cell');
      (html.match(/<table/g) || []).should.have.length(n, 'tables lost at ' + n + ' nested envs');
      warnings.filter((w) => w.includes('stopped shrinking')).should.have.length(0);
    });
  });

  // The marker parse mutates `md.options` for `forDocx`; a throw there would leave the mutated `outMath`
  // on the instance for every later render, so the restore sits in a `finally`.
  // One macro is parsed once and its tokens are cached frozen; every list reads a copy, so a write
  // into what a consumer holds cannot travel to another list, another parse, or another `env`.
  it('a write into a marker token stays in the copy that took it', () => {
    const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, {});
    const src = '\\renewcommand{\\labelitemi}{$x$}\n\n\\begin{itemize}\n\\item a\n\\end{itemize}\n\n'
      + '\\begin{itemize}\n\\item b\n\\end{itemize}';
    const markersOf = (env) => md.parse(src, env)
      .filter((t) => t.type === 'itemize_list_open')
      .map((t) => t.itemizeLevel && t.itemizeLevel[0] && t.itemizeLevel[0][0]);
    const env = {};
    const first = markersOf(env);
    first.should.have.lengthOf(2);
    first[0].should.not.equal(first[1], 'each list must read its own copy');
    first[0].content.should.equal(first[1].content, 'both copies come from one macro');
    // A copy is writable, and `attrSet` on it must not throw the way it did on the frozen original.
    first[0].attrSet('data-probe', '1');
    const again = markersOf(env);
    (again[0].attrGet('data-probe') === null).should.equal(true, 'the write outlived its parse');
    const fresh = markersOf({});
    (fresh[0].attrGet('data-probe') === null).should.equal(true, 'the write reached another env');
  });
  // Only the `forDocx` path replaces the options, so without it the object a consumer holds — and
  // anything keyed on its identity — must be the same one after the render.
  it('a marker parse leaves md.options the same object when forDocx is off', () => {
    const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    const before = md.options;
    const beforeOutMath = md.options.outMath;
    md.render('text \\begin{itemize}\\item[WIDE] x\\item[$y$] z\\end{itemize} tail', {});
    md.options.should.equal(before, 'md.options was replaced');
    md.options.outMath.should.equal(beforeOutMath, 'outMath was replaced');
  });
  it('a throw while parsing a marker leaves md.options as it was', () => {
    const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin,
      { outMath: { include_svg: false, include_mathml_word: true }, forDocx: true });
    const before = JSON.stringify(md.options.outMath);
    const originalParse = md.inline.parse.bind(md.inline);
    md.inline.parse = function (src, ...rest) {
      if (src === 'boom') { throw new Error('marker parse blew up'); }
      return originalParse(src, ...rest);
    };
    const warn = console.warn;
    console.warn = () => {};
    try {
      md.render('text \\begin{itemize}\\item[boom] x\\end{itemize} tail', {});
    } catch (e) {
      // The rule swallows it; a propagated throw is equally fine for this assertion.
    } finally {
      console.warn = warn;
      md.inline.parse = originalParse;
      listEnvEngine.resetListRuleFailures();
    }
    JSON.stringify(md.options.outMath).should.equal(before, 'outMath stayed mutated after the throw');
    // The flag that switches the list rules off during a marker parse, stuck on, kills every later list.
    md.render('\\begin{itemize}\n\\item a\n\\end{itemize}', {})
      .should.include('<li', 'the list rules stayed off after the throw');
  });

  // Past a cap the diagnostics go quiet, so the log has to say it is truncated — and one flooding family
  // must not take another subsystem's single warning with it.
  it('hitting a cap is reported once, per family and overall', () => {
    resetWarnDistinct();
    const warn = console.warn;
    const warnings = [];
    console.warn = (...args) => warnings.push(String(args[0]));
    try {
      for (let i = 0; i < 260; i++) {
        warnDistinct('cause:' + i, 'cause ' + i);
      }
      warnDistinct('padding-shape', 'a different subsystem still speaks');
      for (let i = 0; i < 60; i++) {
        warnDistinct('other:' + i, 'other ' + i);
      }
    } finally {
      console.warn = warn;
    }
    warnings.filter((line) => /distinct 'cause' diagnostics/.test(line))
      .should.have.length(1, 'the family cap was not reported exactly once');
    warnings.should.include('a different subsystem still speaks');
    warnings.filter((line) => /^cause /.test(line)).should.have.length(40);
    warnings.filter((line) => /^other /.test(line)).should.have.length(40);
  });

  // The two caps interact: the family check runs first, and only a reported key counts toward either —
  // so six families of 40 stay under the global 200 and the 41st of each is silent for its own reason.
  it('the family cap and the global cap each speak for themselves', () => {
    resetWarnDistinct();
    const warn = console.warn;
    const said = [];
    console.warn = (...args) => said.push(String(args[0]));
    try {
      for (let family = 0; family < 6; family++) {
        for (let i = 0; i < 41; i++) {
          warnDistinct('f' + family + ':' + i, 'f' + family + ' ' + i);
        }
      }
    } finally {
      console.warn = warn;
    }
    for (let family = 0; family < 5; family++) {
      said.filter((line) => line.startsWith('f' + family + ' ')).should.have.length(40,
        'family f' + family + ' was cut by something other than its own cap');
    }
    said.filter((line) => /distinct 'f\d' diagnostics/.test(line)).should.have.length(5,
      'each family that reached its own cap must say so once');
    // Five families of 40 fill the global 200, so the sixth is silenced by that cap — with its own message.
    said.filter((line) => line.startsWith('f5 ')).should.have.length(0);
    said.filter((line) => /distinct diagnostics in one render/.test(line)).should.have.length(1);
  });

  it('each distinct cause is reported once, not just each error name', () => {
    // Most internal faults are plain `Error`, so a name-only key would hide every cause but the first.
    resetWarnDistinct();
    const warn = console.warn;
    const warnings = [];
    console.warn = (...args) => warnings.push(String(args[0]));
    try {
      listEnvEngine.warnListRuleFailed(new Error('first cause'));
      listEnvEngine.warnListRuleFailed(new Error('first cause'));
      listEnvEngine.warnListRuleFailed(new Error('second cause'));
      listEnvEngine.warnListRuleFailed(new TypeError('third cause'));
    } finally {
      console.warn = warn;
      listEnvEngine.resetListRuleFailures();
    }
    warnings.should.have.length(3);
  });
  it('a failure past the commit point propagates, and still unwinds the levels', () => {
    (() => breakAt('flushBufferedTokens')).should.throw(/flushBufferedTokens/);
    getListDepth().should.equal(-1);
  });
});

// The rule swallows a throwing probe, so the rollback runs from a `catch` — the path that silently
// skips restore work if someone later moves it out of `finally`.
describe('a probe that throws rolls back exactly like one that does not', () => {
  const src = 'Para \\footnotetext{f}\n\\begin{itemize}\n\\item[a] x\n' +
    '\\begin{figure}\\caption{c}\\end{figure}\n\\end{itemize}';
  const parse = (breakProbe) => {
    const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    const rule = md.block.ruler.__rules__.find((r) => r.name === 'Lists');
    const originalRule = rule.fn;
    let probing = 0;
    rule.fn = function (state, start, end, silent) {
      if (silent) { probing++; }
      try { return originalRule.apply(this, arguments); }
      finally { if (silent) { probing--; } }
    };
    md.block.ruler.__cache__ = null;
    const originalBuffered = listEnvEngine.createBufferedState;
    if (breakProbe) {
      listEnvEngine.createBufferedState = function () {
        if (probing > 0) { throw new Error('probe blew up'); }
        return originalBuffered.apply(this, arguments);
      };
    }
    const warn = console.warn;
    console.warn = () => {};
    const env = {};
    try {
      const html = md.render(src, env);
      return {
        depth: getListDepth(),
        levels: getOpenListCount(),
        transientLive: LIST_TRANSIENT_ENV_KEYS.filter((k) => env[k] !== undefined),
        figure: (html.match(/Figure\s*(\d+)/) || [])[1],
      };
    } finally {
      console.warn = warn;
      listEnvEngine.createBufferedState = originalBuffered;
      rule.fn = originalRule;
      listEnvEngine.resetListRuleFailures();
    }
  };
  it('leaves no level, no live transient flag and no shifted caption number', () => {
    parse(true).should.deep.equal(parse(false));
    parse(true).should.deep.equal({ depth: -1, levels: 0, transientLive: [], figure: '1' });
  });
});

// Rolled-back env keys hold `undefined`, and a token's envToInline is replayed onto the shared
// env — so that `undefined` must not clear a key a later block legitimately set.
describe('a rolled-back env key does not clobber a later live value', () => {
  const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { centerImages: true });
  const alignAfter = (src) => {
    const env = {};
    md.render(src, env);
    return env.align;
  };
  const centered = '\\begin{center}\n\\includegraphics{a.png}\n\\end{center}';
  const listWithTabular = '\\begin{itemize}\n\\item[a] x\n\\begin{tabular}{|l|}\nq\n\\end{tabular}\n\\end{itemize}';
  it('env.align set after a list-with-tabular survives the envToInline replay', () => {
    alignAfter(centered).should.equal('center');
    alignAfter(listWithTabular + '\n\n' + centered).should.equal('center');
  });
});

// Terminator scans probe the same lines repeatedly, so a probe has to be idempotent and its answer
// must depend on the source alone — nothing here is cached, and the answer may not drift.
describe('silent-mode Lists probes', () => {
  const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, {});
  const listsRule = md.block.ruler.__rules__.find(r => r.name === 'Lists').fn;
  const closed = '\\begin{itemize}\n\\item a\n\\end{itemize}\n';
  const unclosed = '\\begin{itemize}\n\\item a\n';
  [
    { name: 'closed list', src: closed, expected: true },
    { name: 'unclosed list', src: unclosed, expected: false },
  ].forEach(({ name, src, expected }) => {
    it(`repeated probes over a ${name} return ${expected}`, () => {
      const state = new md.block.State(src, md, {}, []);
      [1, 2, 3].forEach(() => listsRule(state, 0, state.lineMax, true).should.equal(expected));
    });
  });
  // A probe that has already run must not shift the answer of the next one, whatever else moved on
  // the state in between — the answer is a function of the source, not of the caller's bookkeeping.
  const mutations = [
    ['env.tabulare', (s) => { s.env.tabulare = true; }],
    ['env.subTabular', (s) => { s.env.subTabular = true; }],
    ['env.isInline', (s) => { s.env.isInline = true; }],
    ['env.isBlock', (s) => { s.env.isBlock = true; }],
    ['env.parentType', (s) => { s.env.parentType = 'itemize'; }],
    ['env.prentLevel', (s) => { s.env.prentLevel = 3; }],
    ['state.types', (s) => { s.types = ['itemize']; }],
    ['state.level', (s) => { s.level = 3; }],
    ['state.blkIndent', (s) => { s.blkIndent = 4; }],
    ['state.listIndent', (s) => { s.listIndent = 4; }],
    ['state.sCount', (s) => { s.sCount = s.sCount.map((v) => v + 4); }],
  ];
  [{ name: 'closed', src: closed }, { name: 'unclosed', src: unclosed }].forEach(({ name, src }) => {
    it(`a second probe over a ${name} list answers like a first one, whatever moved between them`, () => {
      mutations.forEach(([field, mutate]) => {
        const usedState = new md.block.State(src, md, {}, []);
        listsRule(usedState, 0, usedState.lineMax, true);
        mutate(usedState);
        const freshState = new md.block.State(src, md, {}, []);
        mutate(freshState);
        listsRule(usedState, 0, usedState.lineMax, true)
          .should.equal(listsRule(freshState, 0, freshState.lineMax, true), 'diverged after ' + field);
      });
    });
  });
  it('two list starts on one state keep separate answers', () => {
    const state = new md.block.State(closed + unclosed, md, {}, []);
    const probe = (line) => listsRule(state, line, state.lineMax, true);
    probe(0).should.equal(true);
    probe(3).should.equal(false);
    probe(0).should.equal(true);
    probe(3).should.equal(false);
  });
  it('a real call after silent probes still emits tokens', () => {
    const state = new md.block.State(closed, md, {}, []);
    listsRule(state, 0, state.lineMax, true);
    listsRule(state, 0, state.lineMax, false).should.equal(true);
    state.tokens.length.should.be.above(0);
  });
  // The closer-offset cache lives on the state and is keyed by src identity, so a reassigned source
  // has to be swept again rather than answered from the old offsets.
  it('reassigning state.src is answered from the new source', () => {
    const state = new md.block.State(closed, md, {}, []);
    listsRule(state, 0, state.lineMax, true).should.equal(true);
    const fresh = new md.block.State(unclosed, md, {}, []);
    state.src = fresh.src;
    state.bMarks = fresh.bMarks;
    state.eMarks = fresh.eMarks;
    state.tShift = fresh.tShift;
    state.lineMax = fresh.lineMax;
    listsRule(state, 0, state.lineMax, true).should.equal(false);
  });
});

// The snapshot pool is module state too: a parse that dies between snapshot and release leaves the
// depth raised, so every later parse takes a deeper slot and the abandoned ones hold its objects.
// A released snapshot is emptied by the release itself, so drifted depth costs slots, never correctness:
// the next snapshot is still the innermost one and still restores.
describe('a snapshot left un-released does not break the renders after it', () => {
  const nested = '\\begin{itemize}\n\\item a\n\\begin{enumerate}\n\\item b\n\\end{enumerate}\n\\end{itemize}';
  [{}, { renderElement: { startLine: 0 } }].forEach((extra, i) => {
    it(`a ${i === 0 ? 'full' : 'partial'} render is unaffected by a drifted depth`, () => {
      const md = markdownIt({ html: true })
        .use(mathpixMarkdownPlugin, Object.assign({ outMath: { include_svg: false } }, extra));
      resetEnvSnapshotPool();
      const clean = md.render(nested, {});
      // Three snapshots that never come back, the last holding a document-sized value.
      snapshotEnvAll({ a: 1 });
      snapshotEnvAll({ b: 2 });
      snapshotEnvAll({ heavy: { blob: new Array(1000).fill(0) } });
      const env = {};
      md.render(nested, env).should.equal(clean);
      (env.isBlock === undefined).should.equal(true, 'the transient flag survived the render');
      const consumer = { parentType: 'MINE' };
      const live = snapshotEnvAll(consumer);
      consumer.parentType = 'written by the parse';
      restoreEnvKeysFromAll(consumer, LIST_TRANSIENT_ENV_KEYS, live);
      consumer.parentType.should.equal('MINE', 'a snapshot taken past the drift still restores');
      for (let k = 0; k < 4; k++) {
        releaseEnvSnapshot();
      }
    });
  });
});

// Render depth is reset per chain, and the in-render guard only heals negative drift — positive drift is
// the reset's job, because a list from a wrapper's inline content also claims top level. Every path that
// goes through the chain is therefore level-correct; a hand-sliced token array rendered directly is not.
describe('render depth stays level-correct on every path through the chain', () => {
  const nested = '\\begin{itemize}\n\\item a\n\\begin{itemize}\n\\item b\n\\end{itemize}\n\\item c\n\\end{itemize}';
  const flat = '\\begin{itemize}\n\\item a\n\\end{itemize}';
  const opts = { outMath: { include_svg: false } };
  const marker = (html) => (html.match(/<span class="li_level">([^<]*)<\/span>/) || [])[1];
  it('segments, a partial render and a full render all leave the next list at level 1', () => {
    for (let i = 0; i < 4; i++) {
      MM.markdownToHTMLSegments(nested, opts);
      marker(MM.markdownToHTML(flat, opts)).should.equal('•', 'drifted after a segments render');
      MM.markdownToHTML(nested, Object.assign({ renderElement: { startLine: 2 } }, opts));
      marker(MM.markdownToHTML(flat, opts)).should.equal('•', 'drifted after a partial render');
    }
  });
  it('an unbalanced token slice rendered straight through the renderer does drift', () => {
    const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, opts);
    const tokens = md.parse(nested, {});
    // Parsed up front: a parse between the drift and the render would reset the depth itself.
    const flatTokens = md.parse(flat, {});
    const half = tokens.slice(0, tokens.findIndex((token) => token.type === 'itemize_list_close'));
    md.renderer.render(half, md.options, {});
    md.renderer.render(half, md.options, {});
    marker(md.renderer.render(flatTokens, md.options, {}))
      .should.not.equal('•', 'healing positive drift here would mis-level a wrapper inline list');
  });
});

// Putting `env` back is ours, and a getter-only key makes that write throw. It used to propagate and
// skip the pool release with it — and since the per-render reset declines while a snapshot is live, the
// slot stayed claimed for the process, warning on every render after.
describe('a consumer env that refuses to be written back costs nothing', () => {
  const src = '\\begin{itemize}\n\\item a\n\\end{itemize}';
  it('the render finishes, the pool is released and later renders are unaffected', () => {
    const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    const env = { mine: 1 };
    let reads = 0;
    Object.defineProperty(env, 'shifty',
      { get() { return ++reads; }, enumerable: true, configurable: true });
    const real = console.warn;
    const said = [];
    console.warn = (...args) => said.push(String(args[0]));
    let html;
    const after = [];
    try {
      html = md.render(src, env);
      for (let i = 0; i < 3; i++) {
        after.push(md.render(src, {}));
      }
    } finally {
      console.warn = real;
    }
    html.should.match(/<li[\s>]/, 'the hostile env cost the document its list');
    said.join(' ').should.match(/could not restore a key/, 'the failure went unreported');
    said.join(' ').should.not.match(/pool reset while a snapshot is live/, 'the pool slot leaked');
    new Set(after).size.should.equal(1, 'later renders drifted');
  });
});

// Reporting must not be what fails: the handler for a failing rule reports through here too, so an
// absent `console.warn` threw from inside the catch and cost the document its whole list.
describe('a missing console.warn does not cost the list', () => {
  const wide = '\\begin{itemize}\n\\item[' + 'W'.repeat(60) + '] x\n\\end{itemize}';
  [['undefined', undefined], ['null', null], ['not a function', 42]].forEach(([name, value]) => {
    it(`renders with console.warn = ${name}`, () => {
      const real = console.warn;
      let html;
      try {
        console.warn = value;
        html = MM.markdownToHTML(wide, { cwidth: 800, htmlTags: true });
      } finally {
        console.warn = real;
      }
      html.should.match(/<li[\s>]/, 'the list was lost');
      html.should.not.match(/\\begin\{itemize\}/);
    });
  });
});

// The dedup set is cleared per parse, so a consumer that only ever calls `md.renderer.render` never
// clears it. Safe while every render-time key is a constant: `padding-shape` is the only one, and a
// variable-suffix key added there would fill the 200-key cap and silence every other subsystem.
describe('the render-only path cannot exhaust the diagnostic cap', () => {
  it('250 renders with distinct bad values warn once and leave the cap free', () => {
    const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    const tokens = md.parse('\\begin{itemize}\n\\item a\n\\end{itemize}', {});
    const open = tokens.find((token) => token.type === 'itemize_list_open');
    const said = [];
    const warn = console.warn;
    console.warn = (...args) => said.push(String(args[0]));
    try {
      for (let i = 0; i < 250; i++) {
        open.attrSet('data-padding-inline-start', i + 'px');
        md.renderer.render(tokens, md.options, {});
      }
      said.should.have.lengthOf(1, 'a render-time key carries a variable suffix');
      warnDistinct('probe-after-renders', 'still speaking');
      said.should.have.lengthOf(2, 'the cap was spent by the render path');
    } finally {
      console.warn = warn;
      resetWarnDistinct();
    }
  });
});

// Two caches ride on markdown-it internals: the footnote terminator list is keyed by `ruler.__cache__`,
// and the release hook is deduped through `Ruler.prototype.__find__`. Both fail silently on an upgrade —
// terminators would walk every rule per block again, and the hook would register twice.
describe('the markdown-it ruler internals these caches ride on', () => {
  const fresh = () => markdownIt({ html: true })
    .use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
  it('__rules__, __cache__ and __find__ are all still there', () => {
    const md = fresh();
    md.render('text\n');
    Array.isArray(md.block.ruler.__rules__).should.equal(true, '__rules__ is gone');
    (typeof Ruler.prototype.__find__).should.equal('function', '__find__ is gone');
    (md.block.ruler.__cache__ == null).should.equal(false, '__cache__ is not compiled after a render');
  });
  it('a toggle nulls __cache__, which is what invalidates the terminator list', () => {
    const md = fresh();
    md.render('text\n');
    md.block.ruler.disable(['fence']);
    (md.block.ruler.__cache__ == null)
      .should.equal(true, 'a toggle no longer invalidates the cache; it would serve stale rules');
    md.block.ruler.enable(['fence']);
  });
  it('applying the plugin twice registers one of each hook, not two', () => {
    const md = fresh().use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    const names = md.core.ruler.__rules__.map((rule) => rule.name);
    names.filter((name) => name === 'release_mmd_src_caches').should.have.length(1);
    names.filter((name) => name === 'reset_mmd_global_state').should.have.length(1);
  });
});

// A consumer calling the reset from its own rule cannot reach the live snapshot window: a pushed block
// or inline rule never runs (earlier rules take the line), and a core one runs past block parsing. The
// guard in the pool covers the window; this pins that the reachable case disturbs nothing.
describe('a pool reset from a consumer rule does not disturb the render', () => {
  it('keeps the list whole and leaves env as the consumer owns it', () => {
    const src = '\\begin{itemize}\n\\item a\n\\end{itemize}\n\nplain paragraph\n';
    const clean = markdownIt({ html: true })
      .use(mathpixMarkdownPlugin, { outMath: { include_svg: false } }).render(src, {});
    const md = markdownIt({ html: true })
      .use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    // A block rule, not a core one: the list's speculative parse tokenizes through the block ruler, so
    // this is the only place a consumer can land inside the live snapshot window.
    md.block.ruler.push('rogue_pool_reset', () => { resetEnvSnapshotPool(); return false; });
    const env = { parentType: 'MINE' };
    const warn = console.warn;
    console.warn = () => {};
    let html;
    try {
      html = md.render(src, env);
    } finally {
      console.warn = warn;
    }
    html.should.equal(clean);
    env.parentType.should.equal('MINE');
    (env.isBlock === undefined).should.equal(true, 'the transient flag outlived the list');
    html.should.not.match(/<li[^>]*><\/li>/);
  });
});

// The sweep caches live on the consumer's `env`, so they have to be let go when the chain ends: cleared
// only on entry, a document's offset arrays stayed reachable until the next render — 260 KB on 29 KB here.
describe('the source caches are released when the render ends', () => {
  const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
  const unit = '\\begin{itemize}\n\\item a\n\\begin{center}\ntext \\end{itemize} here\n'
    + '\\end{center}\n\\item b\n\\end{itemize}';
  it('every bucket is empty and its hot slot dropped', () => {
    const env = {};
    const warn = console.warn;
    console.warn = () => {};
    md.render(Array.from({ length: 40 }, () => unit).join('\n\n'), env);
    console.warn = warn;
    const buckets = Object.getOwnPropertySymbols(env)
      .map((key) => env[key])
      .filter((value) => value && value.bySrc instanceof Map);
    buckets.length.should.be.above(4, 'the caches did not run at all, so this proves nothing');
    buckets.forEach((bucket) => {
      bucket.bySrc.size.should.equal(0, 'a source outlived the render that parsed it');
      (bucket.hotSrc === null).should.equal(true);
      (bucket.hotSlot === null).should.equal(true);
    });
  });
});

// A rolled-back key is left present holding `undefined` rather than deleted, so a host reusing one `env`
// must not see it grow render after render — the whole-env snapshot is linear in the number of keys.
describe('a reused env does not grow across renders', () => {
  const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
  const list = (n) => '\\begin{itemize}\n\\item item ' + n + '\n\\end{itemize}\n\nPara ' + n
    + '\\footnote{n' + n + '}\n\n\\begin{itemize}\n\\item unclosed ' + n + '\n';
  const quiet = (fn) => {
    const warn = console.warn;
    console.warn = () => {};
    try { return fn(); } finally { console.warn = warn; }
  };
  const median = (run, times) => {
    const ms = [];
    for (let i = 0; i < times; i++) {
      const started = Date.now();
      run(i);
      ms.push(Date.now() - started);
    }
    return ms.sort((a, b) => a - b)[ms.length >> 1];
  };
  it('the key count settles', () => {
    const env = {};
    quiet(() => {
      md.render(list(0), env);
      md.render(list(1), env);
      const settled = Object.keys(env).length;
      for (let i = 2; i < 50; i++) {
        md.render(list(i), env);
      }
      Object.keys(env).length.should.equal(settled, 'env grew: ' + Object.keys(env).sort().join(','));
    });
  });
  // A median of five each side and a wide margin: one GC pause must read as load, not as a regression.
  it('the last render is no slower than the second', function () {
    this.retries(2);
    const env = {};
    quiet(() => {
      md.render(list(0), env);
      const earlyMs = median((i) => md.render(list(1 + i), env), 5);
      for (let i = 6; i < 50; i++) {
        md.render(list(i), env);
      }
      const lateMs = median((i) => md.render(list(50 + i), env), 5);
      (lateMs <= Math.max(20, earlyMs * 2))
        .should.equal(true, 'the late renders cost ' + lateMs + 'ms against ' + earlyMs + 'ms early on');
    });
  });
});

// Render depth is module state, so a render that ends with a list still open leaves it high. The
// reset runs before the partial-render bail: behind it, the next top-level list read as nested.
describe('render depth is reset even when the render is partial', () => {
  const list = '\\begin{itemize}\n\\item a\n\\end{itemize}';
  const marker = (html) => (html.match(/<span class="li_level">([^<]*)<\/span>/) || [])[1];
  const build = (options) => markdownIt({ html: true }).use(mathpixMarkdownPlugin, options);
  it('a top-level list keeps its own marker after a drifted render', () => {
    const drifting = build({ outMath: { include_svg: false } });
    // The close rule owns the decrement, so a no-op leaves the counter above zero.
    drifting.renderer.rules.itemize_list_close = () => '</ul>';
    drifting.render(list, {});
    drifting.render(list, {});
    const partial = build({ outMath: { include_svg: false }, renderElement: { startLine: 0 } });
    marker(partial.render(list, {})).should.equal('•');
  });
  // The enumerate branch tests `<= 0` where itemize tests `< 0`: at exactly zero the assignment is a
  // no-op but the counter reset is not, so a top-level list must start its numbering afresh.
  it('a top-level enumerate at depth zero restarts the numbering', () => {
    const md = build({ outMath: { include_svg: false }, lineNumbering: false });
    const numbers = (html) => (html.match(/<li[^>]*value="(\d+)"/g) || []);
    const bumped = '\\begin{enumerate}\n\\setcounter{enumi}{5}\n\\item a\n\\end{enumerate}';
    const plain = '\\begin{enumerate}\n\\item a\n\\item b\n\\end{enumerate}';
    md.render(bumped, {});
    const after = md.render(plain, {});
    // Nothing carried over: the second list numbers from the start, with no explicit `value` on item one.
    after.should.match(/<ol[^>]*class="enumerate decimal/);
    numbers(after).should.deep.equal([], 'the previous list left its counter behind: ' + numbers(after));
  });
});

// The host flag says whether a list needs an `<li>` of its own; it is cached per token array, so an
// entry paired in an earlier render must not answer for one reordered since.
describe('the host-flag cache does not answer across renders:', () => {
  const invalidChild = (html) => {
    const tags = /<(\/?)([a-zA-Z][\w:-]*)\b[^>]*?(\/?)>/g;
    const childless = new Set(['br', 'img', 'hr', 'input', 'meta', 'link']);
    const stack = [];
    let last = 0;
    let match;
    const inList = () => stack.length > 0 && (stack[stack.length - 1] === 'ul' || stack[stack.length - 1] === 'ol');
    while ((match = tags.exec(html)) !== null) {
      const between = html.slice(last, match.index);
      last = match.index + match[0].length;
      if (inList() && between.trim()) { return 'text in a list'; }
      const name = match[2].toLowerCase();
      if (match[1]) {
        const at = stack.lastIndexOf(name);
        if (at >= 0) { stack.length = at; }
        continue;
      }
      if (inList() && name !== 'li') { return '<' + name + '> as a direct child of a list'; }
      if (name === 'li' && !inList()) { return '<li> outside any list'; }
      if (!match[3] && !childless.has(name)) { stack.push(name); }
    }
    return '';
  };
  it('a list moved out of its item is hosted again on the next render', () => {
    const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    const warn = console.warn;
    console.warn = () => {};
    try {
      const tokens = md.parse('\\begin{itemize}\nloose\n\\begin{itemize}\n\\item x\n\\end{itemize}\n\\end{itemize}', {});
      invalidChild(md.renderer.render(tokens, md.options, {})).should.equal('', 'the first render already differs');
      // Same length and end types, so only the order tells the two apart: the sublist now opens
      // directly inside the outer list and needs an `<li>` of its own.
      const closeAt = tokens.map((t) => t.type).lastIndexOf('latex_list_item_close');
      const openAt = tokens.map((t) => t.type).indexOf('itemize_list_open', 1);
      tokens.splice(openAt, 0, tokens.splice(closeAt, 1)[0]);
      md.render('plain text', {});
      invalidChild(md.renderer.render(tokens, md.options, {}))
        .should.equal('', 'the render answered from the entry paired before the edit');
    } finally {
      console.warn = warn;
    }
  });
});

// The level stack and the per-parse token registry answer "is a list open?" separately, and
// leaveListLevel reports when they disagree. It only warns, so without this the disagreement — and
// the unpaired `</ul>` it produced — reaches a consumer with nothing failing.
describe('the two accounts of an open list agree on every fixture:', () => {
  const shapes = require('./_data/_lists/_data').map((t) => t.latex)
    .concat(require('./_data/_lists/_data_known_quirks').map((t) => t.latex));
  it('no fixture reports leaving a list level while outside any list', () => {
    const warn = console.warn;
    const offenders = [];
    shapes.forEach((latex) => {
      let seen = false;
      console.warn = (...args) => {
        if (/leaving a list level/.test(args.join(' '))) {
          seen = true;
        }
      };
      try {
        MM.markdownToHTML(latex, { cwidth: 800, htmlTags: true });
      } finally {
        console.warn = warn;
      }
      if (seen) {
        offenders.push(latex);
      }
    });
    offenders.length.should.equal(0, offenders.slice(0, 2).map((s) => JSON.stringify(s)).join('\n'));
  });
});

// The flag that mutes the inline list rules during a marker parse is per render, like the level
// stack: stuck above zero it would silence them for the rest of the process.
describe('the marker-parse flag does not survive a render:', () => {
  const {
    beginMarkerParse,
    endMarkerParse,
    isParsingMarker,
    resetListState,
  } = require('../lib/markdown/md-latex-lists-env/list-state');
  afterEach(() => resetListState());
  it('a reset clears a flag left set', () => {
    beginMarkerParse();
    isParsingMarker().should.equal(true);
    resetListState();
    isParsingMarker().should.equal(false, 'the flag outlived the render');
  });
  it('an unpaired end does not push the count below zero', () => {
    endMarkerParse();
    beginMarkerParse();
    isParsingMarker().should.equal(true, 'a negative count swallowed the next marker parse');
  });
  it('a list still renders after a reset that follows a set flag', () => {
    beginMarkerParse();
    resetListState();
    MM.markdownToHTML('\\begin{itemize}\n\\item a\n\\end{itemize}', { outMath: { include_svg: false } })
      .should.include('<li', 'the inline list rules stayed off');
  });
});

// No document reaches this: `prentLevel` is this lib's own field and every state that opens a list
// through the rules carries it. It guards the exported helpers against a state built elsewhere.
describe('a state without prentLevel does not turn the depth into NaN:', () => {
  const stub = () => ({ attrSet() {}, attrJoin() {}, meta: {} });
  afterEach(() => resetListState());
  it('an open inside a list starts from zero instead of NaN', () => {
    const state = { parentType: 'itemize', types: ['itemize'], env: {}, push: stub };
    applyListOpenState(state, 'itemize', stub());
    state.prentLevel.should.equal(1, 'the depth came out ' + state.prentLevel);
  });
  it('a top-level open is unaffected', () => {
    const state = { parentType: 'root', types: [], env: {}, push: stub };
    applyListOpenState(state, 'itemize', stub());
    state.prentLevel.should.equal(0);
  });
});
