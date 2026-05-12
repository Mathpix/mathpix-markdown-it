let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { getLabelsList } = require('../lib/index');
const {
  labelsList,
  clearLabelsList,
  addIntoLabelsList,
} = require('../lib/markdown/common/labels.js');

const options = {
  cwidth: 800
};


const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('Check Theorem environments:', () => {
  const tests = require('./_data/_labels/_data');
  tests.forEach(function(test, index) {
    const html = MM.markdownToHTML(test.latex, options);
    const labelsList = getLabelsList();
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.html);
        done();
      });
      it('Checking labelsList', (done) => {
        JSON.stringify(labelsList).should.equal(JSON.stringify(test.labels));
        done();
      });
    });
  });
  MM.texReset();
});

// `labelsList` is a deprecated Proxy view over the internal Map; these tests
// pin down the contract (iteration, Array methods, live snapshot) that
// deep-import consumers rely on.
describe('labelsList deprecated export (deep-import compat):', () => {
  beforeEach(() => clearLabelsList());
  it('is iterable via for..of and exposes .length', () => {
    addIntoLabelsList({ key: 'a', id: '1', tag: '1', type: 'equation' });
    addIntoLabelsList({ key: 'b', id: '2', tag: '2', type: 'equation' });
    labelsList.length.should.equal(2);
    const keys = [];
    for (const l of labelsList) keys.push(l.key);
    keys.should.deep.equal(['a', 'b']);
  });
  it('supports Array methods (.find, .map, .filter)', () => {
    addIntoLabelsList({ key: 'x', id: '1', tag: 'T', type: 'equation' });
    addIntoLabelsList({ key: 'y', id: '2', tag: 'U', type: 'equation' });
    labelsList.find(l => l.key === 'y').tag.should.equal('U');
    labelsList.map(l => l.key).should.deep.equal(['x', 'y']);
    labelsList.filter(l => l.tag === 'T').length.should.equal(1);
  });
  it('reflects live changes (each access returns a fresh snapshot)', () => {
    labelsList.length.should.equal(0);
    addIntoLabelsList({ key: 'z', id: '1', tag: '1', type: 'equation' });
    labelsList.length.should.equal(1);
    clearLabelsList();
    labelsList.length.should.equal(0);
  });
});
