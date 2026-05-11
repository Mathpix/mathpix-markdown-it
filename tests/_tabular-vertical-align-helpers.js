const chai = require('chai');
chai.should();
const {
  parseTabularPos,
  normalizeDefaultCellVerticalAlign,
  bracketToVAlign,
} = require('../lib/markdown/md-block-rule/begin-tabular/common');
const {
  pushSubTabular,
  getSubTabularBracket,
  ClearSubTableLists,
} = require('../lib/markdown/md-block-rule/begin-tabular/sub-tabular');

describe('parseTabularPos', () => {
  it("returns 't'/'c'/'b' for matching single letters", () => {
    parseTabularPos('t').should.equal('t');
    parseTabularPos('c').should.equal('c');
    parseTabularPos('b').should.equal('b');
  });
  it('trims surrounding whitespace', () => {
    parseTabularPos(' t ').should.equal('t');
    parseTabularPos('\tc\n').should.equal('c');
  });
  it('returns undefined for null, undefined, empty', () => {
    chai.expect(parseTabularPos(undefined)).to.be.undefined;
    chai.expect(parseTabularPos(null)).to.be.undefined;
    chai.expect(parseTabularPos('')).to.be.undefined;
    chai.expect(parseTabularPos('   ')).to.be.undefined;
  });
  it('returns undefined for unknown / multi-char / uppercase', () => {
    chai.expect(parseTabularPos('x')).to.be.undefined;
    chai.expect(parseTabularPos('tt')).to.be.undefined;
    chai.expect(parseTabularPos('T')).to.be.undefined;
    chai.expect(parseTabularPos('top')).to.be.undefined;
  });
});

describe('normalizeDefaultCellVerticalAlign', () => {
  it('maps option strings to internal bracket form', () => {
    normalizeDefaultCellVerticalAlign('top').should.equal('t');
    normalizeDefaultCellVerticalAlign('middle').should.equal('c');
    normalizeDefaultCellVerticalAlign('bottom').should.equal('b');
  });
  it('trims surrounding whitespace', () => {
    normalizeDefaultCellVerticalAlign(' top ').should.equal('t');
  });
  it('returns undefined for null, undefined, empty', () => {
    chai.expect(normalizeDefaultCellVerticalAlign(undefined)).to.be.undefined;
    chai.expect(normalizeDefaultCellVerticalAlign(null)).to.be.undefined;
    chai.expect(normalizeDefaultCellVerticalAlign('')).to.be.undefined;
  });
  it('is case-sensitive — uppercase is unknown', () => {
    chai.expect(normalizeDefaultCellVerticalAlign('TOP')).to.be.undefined;
    chai.expect(normalizeDefaultCellVerticalAlign('Middle')).to.be.undefined;
  });
  it('returns undefined for unknown values', () => {
    chai.expect(normalizeDefaultCellVerticalAlign('center')).to.be.undefined;
    chai.expect(normalizeDefaultCellVerticalAlign('t')).to.be.undefined;
  });
});

describe('bracketToVAlign', () => {
  it("maps 't' to 'top' and 'b' to 'bottom'", () => {
    bracketToVAlign('t').should.equal('top');
    bracketToVAlign('b').should.equal('bottom');
  });
  it("maps 'c' and undefined to 'middle' (default branch)", () => {
    bracketToVAlign('c').should.equal('middle');
    bracketToVAlign(undefined).should.equal('middle');
  });
});

describe('getSubTabularBracket', () => {
  beforeEach(() => ClearSubTableLists());
  const idFromPlaceholder = (s) => s.match(/<<([^>]+)>>/)[1];
  it("returns the bracket stored on the entry — accepts both '<<id>>' and bare id", () => {
    const out = pushSubTabular(
      '\\begin{tabular}[t]{l}x\\end{tabular}',
      '\\begin{tabular}[t]{l}x\\end{tabular}',
      [],
      0,
      '\\begin{tabular}[t]{l}x'.length,
      0,
      0,
      't'
    );
    const id = idFromPlaceholder(out);
    getSubTabularBracket(id).should.equal('t');
    getSubTabularBracket(`<<${id}>>`).should.equal('t');
  });
  it('returns undefined when no bracket was passed at insert', () => {
    const out = pushSubTabular(
      '\\begin{tabular}{l}x\\end{tabular}',
      '\\begin{tabular}{l}x\\end{tabular}',
      [],
      0,
      '\\begin{tabular}{l}x'.length
    );
    const id = idFromPlaceholder(out);
    chai.expect(getSubTabularBracket(id)).to.be.undefined;
  });
  it('returns undefined for an unknown id', () => {
    chai.expect(getSubTabularBracket('nonexistent-id')).to.be.undefined;
    chai.expect(getSubTabularBracket('<<nonexistent-id>>')).to.be.undefined;
  });
});
