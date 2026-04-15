let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {
  cwidth: 800,
  htmlTags: true
};


const { JSDOM } = require("jsdom");
const tests = require("./_data/_lists/_data");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('Check Lists:', () => {
  const tests = require('./_data/_lists/_data');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.latex, options);
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.should.equal(test.html);
        done();
      });
     });
  });
});

describe('Check Lists inside tabular:', () => {
  const tests = require('./_data/_lists/_data_lists_inside_tabular');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.mmd, options);
    describe('Latex => ' + test.mmd, () => {
      it('Checking result html', (done) => {
        html.should.equal(test.html);
        done();
      });
    });
  });
});

describe('Check maxNesting option caps deep list nesting:', () => {
  /**
   * Pathological input: "+ + + + + ..." is valid CommonMark and each "+ " is
   * treated as a bullet marker, producing deeply-nested <ul><li><ul><li>...
   * The `maxNesting` option (propagated to markdown-it) limits block-rule
   * recursion depth. Each list level adds 2 to state.level, so:
   *   maxNesting=N  ->  ~floor(N/2) nested <ul> levels.
   */
  const plusInput = '+ + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +';

  const cases = [
    { maxNesting: 3,  expectedUlCount: 2 },
    { maxNesting: 5,  expectedUlCount: 3 },
    { maxNesting: 10, expectedUlCount: 5 },
    { maxNesting: 12, expectedUlCount: 6 },
    { maxNesting: 20, expectedUlCount: 10 },
  ];

  cases.forEach(({ maxNesting, expectedUlCount }) => {
    it(`maxNesting=${maxNesting} should cap nested <ul> count to ${expectedUlCount}`, (done) => {
      const html = MM.markdownToHTML(plusInput, Object.assign({}, options, { maxNesting }));
      const ulCount = (html.match(/<ul>/g) || []).length;
      ulCount.should.equal(expectedUlCount);
      done();
    });
  });

  it('default maxNesting (100) does NOT cap the pathological 32-plus input', (done) => {
    const html = MM.markdownToHTML(plusInput, options);
    const ulCount = (html.match(/<ul>/g) || []).length;
    ulCount.should.equal(32);
    done();
  });

  it('a normal 3-level bullet list still renders correctly with small maxNesting=12', (done) => {
    const realList = '- a\n  - b\n    - c\n- d';
    const html = MM.markdownToHTML(realList, Object.assign({}, options, { maxNesting: 12 }));
    const ulCount = (html.match(/<ul>/g) || []).length;
    ulCount.should.equal(3);
    html.should.contain('<li>a');
    html.should.contain('<li>b');
    html.should.contain('<li>c</li>');
    html.should.contain('<li>d</li>');
    done();
  });
});
