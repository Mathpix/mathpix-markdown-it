const chai = require('chai');
chai.should();

const {
  countPositionsAtOrAfter,
  firstPositionAtOrAfter,
  matchPositionsCached,
  lastMatchPosCached,
} = require('../lib/markdown/common/src-pos-cache');

// Both are binary searches over a boundary, and both decide list structure: the count answers
// whether a sibling list may open and whether the body walk can still close, the first-position
// answers whether a closer sits ahead of a fence. An off-by-one here changes HTML, not a test.
describe('src-pos-cache boundary search:', () => {
  const positions = [10, 20, 20, 30];
  it('countPositionsAtOrAfter is inclusive at the boundary', () => {
    countPositionsAtOrAfter([], 0).should.equal(0);
    countPositionsAtOrAfter(positions, 5).should.equal(4);
    countPositionsAtOrAfter(positions, 10).should.equal(4);
    countPositionsAtOrAfter(positions, 11).should.equal(3);
    // Duplicates count once each, and the search lands before the first of them.
    countPositionsAtOrAfter(positions, 20).should.equal(3);
    countPositionsAtOrAfter(positions, 21).should.equal(1);
    countPositionsAtOrAfter(positions, 30).should.equal(1);
    countPositionsAtOrAfter(positions, 31).should.equal(0);
  });
  it('firstPositionAtOrAfter returns the offset itself, or -1', () => {
    firstPositionAtOrAfter([], 0).should.equal(-1);
    firstPositionAtOrAfter(positions, 5).should.equal(10);
    firstPositionAtOrAfter(positions, 10).should.equal(10);
    firstPositionAtOrAfter(positions, 11).should.equal(20);
    firstPositionAtOrAfter(positions, 20).should.equal(20);
    firstPositionAtOrAfter(positions, 21).should.equal(30);
    firstPositionAtOrAfter(positions, 31).should.equal(-1);
  });
  it('the cache is keyed on state.src, so reassigning it re-sweeps', () => {
    const key = Symbol('test');
    const state = { src: 'a-b-c' };
    matchPositionsCached(state, key, /-/g).should.deep.equal([1, 3]);
    state.src = 'a--b';
    matchPositionsCached(state, key, /-/g).should.deep.equal([1, 2]);
  });
  it('a pattern that can match empty still terminates', () => {
    const state = { src: 'ab' };
    // `x*` matches the empty string at every offset: without the guard the sweep would not advance.
    matchPositionsCached(state, Symbol('empty'), /x*/g).should.be.an('array');
    lastMatchPosCached(state, Symbol('empty2'), /x*/g).should.be.a('number');
  });
});
