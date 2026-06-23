/**
 * lstlisting [mathescape=true]: an escaped \$ renders as a literal $ glyph, while a bare $
 * still toggles math. Plain lstlisting (no mathescape) carries a verbatim $ — no change.
 */
const chai = require('chai');
const should = chai.should();
const MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const MarkdownIt = require('markdown-it');
const pluginLatexCodeEnvs = require('../lib/markdown/md-latex-lstlisting-env/index').default;

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
globalThis.window = jsdom.window;
globalThis.document = jsdom.window.document;
globalThis.DOMParser = jsdom.window.DOMParser;

const isMath = (html) => html.includes('mjx-container');
const mathescape = (body) => '\\begin{lstlisting}[mathescape=true]\n' + body + '\n\\end{lstlisting}';
const plain = (body) => '\\begin{lstlisting}\n' + body + '\n\\end{lstlisting}';
const bareMathescape = (body) => '\\begin{lstlisting}[mathescape]\n' + body + '\n\\end{lstlisting}';

describe('lstlisting mathescape — \\$ renders as literal $:', () => {
  it('\\$x\\$ -> literal $x$, not math', () => {
    const html = MM.markdownToHTML(mathescape('\\$x\\$'));
    isMath(html).should.equal(false);
    html.should.include('$x$');
    html.should.not.include('\\$');
  });
  it('bare $x$ still renders as math', () => {
    isMath(MM.markdownToHTML(mathescape('$x$'))).should.equal(true);
  });
  it('mixed \\$a\\$ and $b$ -> literal $a$ + math', () => {
    const html = MM.markdownToHTML(mathescape('\\$a\\$ $b$'));
    isMath(html).should.equal(true);
    html.should.include('$a$');
    html.should.not.include('\\$');
  });
  it('plain lstlisting: \\$x\\$ stays verbatim with backslash (change is mathescape-only)', () => {
    const html = MM.markdownToHTML(plain('\\$x\\$'));
    isMath(html).should.equal(false);
    html.should.include('\\$');
  });
});

describe('lstlisting mathescape — \\$ edge cases:', () => {
  it('bare [mathescape] (no =true): \\$x\\$ -> literal $x$', () => {
    const html = MM.markdownToHTML(bareMathescape('\\$x\\$'));
    isMath(html).should.equal(false);
    html.should.include('$x$');
    html.should.not.include('\\$');
  });
  it('\\\\$ -> \\$ (run before $ drops one backslash, $ literal)', () => {
    const html = MM.markdownToHTML(mathescape('\\\\$'));
    isMath(html).should.equal(false);
    html.should.include('\\$');
  });
  it('\\\\$conf_a\\\\$ -> \\$conf_a\\$ (each run drops one backslash)', () => {
    const html = MM.markdownToHTML(mathescape('\\\\$conf_a\\\\$'));
    isMath(html).should.equal(false);
    html.should.include('\\$conf_a\\$');
  });
  it('\\\\\\$ -> \\\\$ (three backslashes drop one)', () => {
    const html = MM.markdownToHTML(mathescape('\\\\\\$'));
    isMath(html).should.equal(false);
    html.should.include('\\\\$');
  });
  it('\\\\$x$ -> \\$x$ literal (one backslash dropped, trailing $ unmatched), not math', () => {
    const html = MM.markdownToHTML(mathescape('\\\\$x$'));
    isMath(html).should.equal(false);
    html.should.include('\\$x');
  });
  it('\\$\\$ -> literal $$ (two escaped dollars), not display math', () => {
    const html = MM.markdownToHTML(mathescape('\\$\\$'));
    isMath(html).should.equal(false);
    html.should.include('$$');
  });
  it('trailing backslash renders without error', () => {
    isMath(MM.markdownToHTML(mathescape('abc\\'))).should.equal(false);
  });
  it('\\$x\\$ is literal under legacy too (mode-independent)', () => {
    const html = MM.markdownToHTML(mathescape('\\$x\\$'), { mathDelimiterMode: 'legacy' });
    isMath(html).should.equal(false);
    html.should.include('$x$');
  });
});

describe('lstlisting mathescape — copy/codeText:', () => {
  it('clipboard copies un-escaped literal + verbatim math (codeText), not raw \\$', () => {
    const html = MM.markdownToHTML(mathescape('\\$conf_a\\$ $conf_a$ \\(g^2\\)'), { copyToClipboard: true });
    const m = html.match(/value="([^"]*)"/);
    should.exist(m);
    m[1].should.equal('$conf_a$ $conf_a$ \\(g^2\\)');
  });
  it('clipboard value HTML-escapes " and < from code', () => {
    const html = MM.markdownToHTML(mathescape('\\$x\\$ if a < b "s"'), { copyToClipboard: true });
    const m = html.match(/value="([^"]*)"/);
    should.exist(m);
    m[1].should.equal('$x$ if a &lt; b &quot;s&quot;');
  });
});

describe('lstlisting mathescape — token.meta.codeText (no copyToClipboard):', () => {
  const parseListingToken = (src) => {
    const md = new MarkdownIt({ outMath: {} }); // outMath avoids math-render noise during parse
    md.use(pluginLatexCodeEnvs);
    return md.parse(src, {}).find((token) => token.type === 'latex_lstlisting_env');
  };
  it('codeText set: un-escaped literal + verbatim math (original delimiters)', () => {
    const listingToken = parseListingToken(mathescape('\\$conf_a\\$ $conf_a$ \\(g^2\\)'));
    listingToken.meta.hasMathescape.should.equal(true);
    listingToken.meta.codeText.should.equal('$conf_a$ $conf_a$ \\(g^2\\)');
  });
  it('codeText preserves newlines and indentation', () => {
    const listingToken = parseListingToken(mathescape('  if \\$d\\$\n    return $x$'));
    listingToken.meta.codeText.should.equal('  if $d$\n    return $x$');
  });
  it('plain listing (no mathescape) has no codeText', () => {
    const listingToken = parseListingToken(plain('\\$x\\$'));
    should.not.exist(listingToken.meta && listingToken.meta.codeText);
  });
});

describe('lstlisting mathescape — \\$ inside a table cell (table-markdown):', () => {
  const table = '\\begin{tabular}{|l|l|}\n\\hline\nprice & '
    + '\\begin{lstlisting}[mathescape=true]\n\\$conf_a\\$ $conf_a$\n\\end{lstlisting}'
    + ' \\\\\\hline\n\\end{tabular}';
  it('cell markdown un-escapes \\$ via codeText, not raw \\$conf_a\\$', () => {
    const html = MM.markdownToHTML(table, { outMath: { include_table_markdown: true } });
    html.should.include('&lt;pre&gt;&lt;code&gt;$conf_a$ $conf_a$&lt;/code&gt;&lt;/pre&gt;');
    html.should.not.include('\\$conf_a\\$');
  });
});
