let chai = require('chai');
let should = chai.should();
let { getSubMath, ClearSubMathLists, getMathTableContent } = require('../lib/markdown/md-block-rule/begin-tabular/sub-math');

describe('getSubMath — iterative math extraction:', () => {
  beforeEach(() => { ClearSubMathLists(); });
  it('no math returns string unchanged', () => {
    getSubMath('hello world').should.equal('hello world');
  });
  it('empty string returns empty', () => {
    getSubMath('').should.equal('');
  });
  it('single $...$ is replaced with placeholder', () => {
    const result = getSubMath('a $x^2$ b');
    result.should.not.include('$');
    result.should.include('a ');
    result.should.include(' b');
    result.should.match(/\{[a-z0-9-]+\}/);
  });
  it('$$...$$ is replaced with placeholder', () => {
    const result = getSubMath('a $$x^2$$ b');
    result.should.not.include('$$');
    result.should.match(/\{[a-z0-9-]+\}/);
  });
  it('\\[...\\] is replaced with placeholder', () => {
    const result = getSubMath('a \\[x\\] b');
    result.should.not.include('\\[');
    result.should.match(/\{[a-z0-9-]+\}/);
  });
  it('\\(...\\) is replaced with placeholder', () => {
    const result = getSubMath('a \\(x\\) b');
    result.should.not.include('\\(');
    result.should.match(/\{[a-z0-9-]+\}/);
  });
  it('\\\\[...\\\\] is replaced with placeholder', () => {
    const result = getSubMath('a \\\\[x\\\\] b');
    result.should.not.include('\\\\[');
    result.should.match(/\{[a-z0-9-]+\}/);
  });
  it('escaped \\$ is not treated as math delimiter', () => {
    const result = getSubMath('price is \\$5');
    result.should.equal('price is \\$5');
  });
  it('$ with leading space inside is skipped: $ x$', () => {
    const result = getSubMath('a $ x$ b');
    result.should.equal('a $ x$ b');
  });
  it('$ with trailing space inside is skipped: $x $', () => {
    const result = getSubMath('a $x $ b');
    result.should.equal('a $x $ b');
  });
  it('$ followed by digit is skipped: $5', () => {
    const result = getSubMath('costs $5 or $10');
    result.should.equal('costs $5 or $10');
  });
  it('multiple math expressions get separate placeholders', () => {
    const result = getSubMath('$a$ and $b$');
    const matches = result.match(/\{[a-z0-9-]+\}/g);
    should.exist(matches);
    matches.length.should.equal(2);
    matches[0].should.not.equal(matches[1]);
  });
  it('\\begin{equation}...\\end{equation} is replaced', () => {
    const result = getSubMath('a \\begin{equation}x=1\\end{equation} b');
    result.should.not.include('\\begin{equation}');
    result.should.match(/\{[a-z0-9-]+\}/);
  });
  it('\\begin{abstract} is skipped (not math)', () => {
    const result = getSubMath('\\begin{abstract}text\\end{abstract}');
    result.should.include('\\begin{abstract}');
  });
  it('\\begin{tabular} is skipped (not math)', () => {
    const input = '\\begin{tabular}{ll}\na & b \\\\\nc & d\n\\end{tabular}';
    getSubMath(input).should.equal(input);
  });
  it('eqref{...} is replaced with placeholder', () => {
    const result = getSubMath('see eqref{eq1}');
    result.should.match(/\{[a-z0-9-]+\}/);
  });
  it('ref{...} is replaced with placeholder', () => {
    const result = getSubMath('see ref{fig1}');
    result.should.match(/\{[a-z0-9-]+\}/);
  });
  it('math inside \\begin{abstract} is still extracted', () => {
    const result = getSubMath('\\begin{abstract}$x^2$\\end{abstract}');
    result.should.include('\\begin{abstract}');
    result.should.match(/\{[a-z0-9-]+\}/);
  });
  it('unclosed $ is left unchanged', () => {
    getSubMath('a $b c').should.equal('a $b c');
  });
  it('trailing unclosed $ after valid math is preserved', () => {
    const result = getSubMath('a $b$ c $d');
    result.should.include('c $d');
    result.should.match(/\{[a-z0-9-]+\}/);
  });
  it('preserves text around multiple replacements', () => {
    const result = getSubMath('start $a$ mid \\(b\\) end');
    result.should.match(/^start .+ mid .+ end$/);
  });
  it('\\begin{referral} is not treated as ref (no false positive on substring)', () => {
    const result = getSubMath('\\begin{referral}text\\end{referral}');
    result.should.not.equal('\\begin{referral}text\\end{referral}');
    result.should.match(/\{[a-z0-9-]+\}/);
  });
  it('sequential calls replace different content with different placeholders', () => {
    ClearSubMathLists();
    const r1 = getSubMath('$x$');
    const placeholder1 = r1.match(/\{([a-z0-9-]+)\}/)[1];
    ClearSubMathLists();
    const r2 = getSubMath('$y$');
    const placeholder2 = r2.match(/\{([a-z0-9-]+)\}/)[1];
    placeholder1.should.not.equal(placeholder2);
  });
  it('unclosed \\begin{array} does not hang', () => {
    const result = getSubMath('a \\begin{array}{c} x');
    result.should.be.a('string');
  });
  it('getMathTableContent with no matching placeholders returns empty', () => {
    ClearSubMathLists();
    getMathTableContent('text without placeholders', 0).should.equal('');
  });
  it('getMathTableContent with real placeholder but no mathTable entry preserves it', () => {
    ClearSubMathLists();
    const r = getSubMath('a $x$ b');
    const placeholder = r.match(/\{([a-z0-9-]+)\}/)[0];
    ClearSubMathLists();
    const result = getMathTableContent(r, 0);
    result.should.include(placeholder);
  });
  it('round-trip: getSubMath then getMathTableContent restores original', () => {
    ClearSubMathLists();
    const original = 'text $x^2$ more $y$ end';
    const withPlaceholders = getSubMath(original);
    withPlaceholders.should.not.include('$');
    const restored = getMathTableContent(withPlaceholders, 0);
    restored.should.equal(original);
  });
  it('startPos parameter skips leading content before scanning', () => {
    ClearSubMathLists();
    const str = '$a$ middle $b$ end';
    const offset = str.indexOf('middle');
    const result = getSubMath(str, offset);
    result.startsWith('$a$ middle').should.equal(true);
    result.should.match(/\{[a-z0-9-]+\} end$/);
  });
});
