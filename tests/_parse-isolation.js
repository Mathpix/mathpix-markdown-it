let chai = require('chai');
let should = chai.should();

const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');
const { snapshotListLevels, getListDepth } = require('../lib/markdown/md-latex-lists-env/list-state');

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

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
    // Any rule reachable from a list body may write a new env key; cover the ones that do.
    ...[
      ['an align env', '\\begin{align}\na &= b\n\\end{align}'],
      ['a section', '\\section{Head}'],
      ['a label', '\\label{x}'],
      ['a footnote', '\\footnote{n}'],
      ['a tabular', '\\begin{tabular}{|l|}\nq\n\\end{tabular}'],
      ['a fence', '```\ncode\n```'],
      ['display math', '$$x^2$$'],
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

  // LIST_SPECULATIVE_ENV_KEYS is hand-written, so a rule that starts writing a new env key inside a
  // list body would leak it silently. Structural guard: every key a probed list parse leaves must be
  // known here — a new one fails this test instead of waiting for someone to notice the drift.
  it('a probed list body writes no env key outside the known set', () => {
    const { LIST_TRANSIENT_ENV_KEYS, LIST_SPECULATIVE_ENV_KEYS } =
      require('../lib/markdown/common/env-transient');
    // Read from the source of truth, so an unregistered list key fails below.
    const listKeys = new Set([...LIST_TRANSIENT_ENV_KEYS, ...LIST_SPECULATIVE_ENV_KEYS]);
    // Parser-wide registries, not list state. Keep closed: widening it hides the drift.
    const ignoredParserKeys = new Set(['__mathpix', 'currentTag', 'footnotes', 'mmd_footnotes']);
    // One body per env LATEX_BLOCK_ENV_OPEN_RE admits inside an item, plus the other rules
    // reachable from there. A rule left out of this list could leak its key unnoticed.
    const bodies = [
      '\\begin{figure}\n\\caption{c}\n\\end{figure}',
      '\\begin{table}\n\\caption{t}\n\\begin{tabular}{|l|}\nq\n\\end{tabular}\n\\end{table}',
      '\\begin{tabular}{|l|}\nq\n\\end{tabular}',
      '\\begin{center}\ncentred\n\\end{center}',
      '\\begin{left}\nleft\n\\end{left}',
      '\\begin{right}\nright\n\\end{right}',
      '\\begin{lstlisting}\ncode\n\\end{lstlisting}',
      '\\begin{align}\nx=1\n\\end{align}',
      '\\begin{proof}\nq\n\\end{proof}',
      '\\newtheorem{thm}{Thm}\n\\begin{thm}\nq\n\\end{thm}',
      '\\section{Head}',
      '```\ncode\n```',
      '\\begin{align}x=1\\label{e}\\end{align}',
      '$$x^2$$',
      '\\footnote{n}',
      '\\begin{array}{cc}a & b\\end{array}',
      '\\begin{cases}x & y\\end{cases}',
      '\\includegraphics{img.png}',
    ];
    // \footnotetext with no blank line makes the terminator scan probe every line.
    const probeBody = (instance, body) => {
      const env = {};
      instance.render('Para \\footnotetext{f}\n\\begin{itemize}\n\\item[a] x\n' + body + '\n\\end{itemize}', env);
      Object.keys(env).forEach((key) => {
        if (ignoredParserKeys.has(key)) {
          return;
        }
        listKeys.has(key).should.equal(true,
          'env key after a probed list is neither a registered list key nor a known parser key: ' + key);
      });
    };
    bodies.forEach((body) => probeBody(md, body));
    // centerImages routes an image through a different renderer branch.
    const centred = markdownIt({ html: true })
      .use(mathpixMarkdownPlugin, { outMath: { include_svg: false }, centerImages: true });
    probeBody(centred, '\\includegraphics{img.png}');
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
      snapshotListLevels().should.equal(0, `levels retained after ${n} units`);
      getListDepth().should.equal(-1);
    });
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

// The silent probe answer is memoized per state, so terminator scans don't re-parse the same
// list. The memo must not change the answer, nor short-circuit a real (non-silent) call.
describe('silent-mode Lists probe memo', () => {
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
  // Two groups, one assertion: a cached answer must equal what an unmemoized parse says under the
  // same mutation. For the fields the key omits that pins they are really irrelevant; for the ones
  // it carries (the env flags a body parse reaches) it pins that the entry is invalidated, not stale.
  [
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
  ].forEach(([field, mutate]) => {
    [{ name: 'closed', src: closed }, { name: 'unclosed', src: unclosed }].forEach(({ name, src }) => {
      it(`a cached answer for a ${name} list survives a change to ${field}`, () => {
        const cachedState = new md.block.State(src, md, {}, []);
        listsRule(cachedState, 0, cachedState.lineMax, true); // fills the memo
        mutate(cachedState);
        const cached = listsRule(cachedState, 0, cachedState.lineMax, true);
        const freshState = new md.block.State(src, md, {}, []);
        mutate(freshState);
        cached.should.equal(listsRule(freshState, 0, freshState.lineMax, true));
      });
    });
  });
  // The other half: the fields the key does carry must separate the entries, so one call site
  // never answers from another's. Both lists live on one state, so both share one memo.
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
  it('reassigning state.src invalidates the memo', () => {
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
