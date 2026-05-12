let chai = require('chai');
let should = chai.should();
let MathJax = require('../lib/mathjax/index.js').MathJax;
let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('MathML to Typst math format:', () => {
  const tests = [
    {
      mathml: '<math><mfrac><mi>a</mi><mi>b</mi></mfrac></math>',
      typst: 'frac(a, b)',
    },
    {
      mathml: '<math><msqrt><mi>x</mi></msqrt></math>',
      typst: 'sqrt(x)',
    },
    {
      mathml: '<math><msubsup><mi>x</mi><mi>i</mi><mn>2</mn></msubsup></math>',
      typst: 'x_i^2',
    },
    {
      mathml: '<math><mrow><mi>sin</mi><mo>&#x2061;</mo><mi>x</mi></mrow></math>',
      typst: 'sin x',
    },
    {
      mathml: '<math><mrow><mo>&#x230A;</mo><mi>x</mi><mo>&#x230B;</mo></mrow></math>',
      typst: 'floor.l x floor.r',
    },
    {
      mathml: '<math><mrow><mo>(</mo><mfrac><mi>a</mi><mi>b</mi></mfrac><mo>)</mo></mrow></math>',
      typst: '(frac(a, b))',
    },
  ];

  tests.forEach(function(t) {
    it('MathML => ' + t.typst, function() {
      const data = MathJax.MathMLConvertToTypstData(t.mathml);
      data.typstmath.should.be.a('string');
      data.typstmath.should.equal(t.typst);
    });
  });
});

describe('TypesetMathML with include_typst:', () => {
  it('should include typstmath in data when include_typst is true', function() {
    const mathml = '<math><mfrac><mi>a</mi><mi>b</mi></mfrac></math>';
    const result = MathJax.TypesetMathML(mathml, {
      outMath: { include_typst: true, include_svg: false }
    });
    result.data.should.have.property('typstmath');
    result.data.typstmath.should.equal('frac(a, b)');
    result.data.should.have.property('typstmath_inline');
    result.data.typstmath_inline.should.equal('frac(a, b)');
  });

  it('should not include typstmath when include_typst is false', function() {
    const mathml = '<math><mfrac><mi>a</mi><mi>b</mi></mfrac></math>';
    const result = MathJax.TypesetMathML(mathml, {
      outMath: { include_typst: false, include_svg: false }
    });
    should.not.exist(result.data.typstmath);
    should.not.exist(result.data.typstmath_inline);
  });
});

describe('TypesetAsciiMath with include_typst:', () => {
  it('should include typstmath in data when include_typst is true', function() {
    const result = MathJax.TypesetAsciiMath('x^2 + y^2', {
      outMath: { include_typst: true, include_svg: false }
    });
    result.should.have.property('data');
    result.should.have.property('html');
    result.data.should.have.property('typstmath');
    result.data.typstmath.should.be.a('string');
    result.data.typstmath.length.should.be.greaterThan(0);
    result.data.should.have.property('typstmath_inline');
    result.data.typstmath_inline.should.be.a('string');
  });

  it('should not include typstmath when include_typst is false', function() {
    const result = MathJax.TypesetAsciiMath('x^2', {
      outMath: { include_typst: false, include_svg: false }
    });
    result.should.have.property('data');
    should.not.exist(result.data.typstmath);
    should.not.exist(result.data.typstmath_inline);
  });

  it('should convert frac ascii to typst frac()', function() {
    const result = MathJax.TypesetAsciiMath('a/b', {
      outMath: { include_typst: true, include_svg: false }
    });
    result.data.typstmath.should.equal('frac(a, b)');
  });

});

describe('Full pipeline: markdownToHTML → parseMarkdownByHTML with include_typst:', () => {
  const options = {
    outMath: {
      include_typst: true,
      include_asciimath: false,
      include_mathml: false,
      include_latex: false,
      include_svg: true,
    }
  };

  it('should include typst and typst_inline for LaTeX math', function() {
    const html = MM.markdownToHTML('$\\frac{a}{b}$', options);
    const parsed = MM.parseMarkdownByHTML(html);
    const typst = parsed.find(item => item.type === 'typst');
    const typstInline = parsed.find(item => item.type === 'typst_inline');
    should.exist(typst, 'typst format should be present');
    typst.value.should.equal('frac(a, b)');
    should.exist(typstInline, 'typst_inline format should be present');
    typstInline.value.should.equal('frac(a, b)');
  });

  it('should include typst for display math', function() {
    const html = MM.markdownToHTML('$$\\sqrt{x}$$', options);
    const parsed = MM.parseMarkdownByHTML(html);
    const typst = parsed.find(item => item.type === 'typst');
    should.exist(typst, 'typst format should be present');
    typst.value.should.equal('sqrt(x)');
  });

  it('should not include typst when include_typst is false', function() {
    const html = MM.markdownToHTML('$x^2$', {
      outMath: { include_typst: false, include_svg: true }
    });
    const parsed = MM.parseMarkdownByHTML(html);
    const typst = parsed.find(item => item.type === 'typst');
    should.not.exist(typst, 'typst format should not be present');
  });

  it('should include typst for ascii math via <ascii> tags', function() {
    const html = MM.markdownToHTML('<ascii>a/b</ascii>', {
      outMath: { include_typst: true, include_svg: true }
    });
    const parsed = MM.parseMarkdownByHTML(html);
    const typst = parsed.find(item => item.type === 'typst');
    should.exist(typst, 'typst format should be present for ascii math');
    typst.value.should.equal('frac(a, b)');
  });
});
