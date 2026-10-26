const chai = require('chai');
chai.should();

const {
  countPositionsAtOrAfter,
  matchPositionsCached,
  lastMatchPosCached,
  clearSrcPosCaches,
  srcValueCached,
  resetStateHostedCaches,
} = require('../lib/markdown/common/src-pos-cache');

// Both are binary searches over a boundary, and both decide list structure: the count answers
// whether a sibling list may open and whether the body walk can still close, the first-position
// answers whether a closer sits ahead of a fence. An off-by-one here changes HTML, not a test.
describe('src-pos-cache boundary search:', () => {
  // Several tests here hand in a state with no `env`, so the cache lands on the state — the root hook
  // asserts that no other test does.
  afterEach(() => resetStateHostedCaches());
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
  it('the cache is keyed on state.src, so reassigning it re-sweeps', () => {
    const key = Symbol('test');
    const state = { src: 'a-b-c' };
    matchPositionsCached(state, key, /-/g).should.deep.equal([1, 3]);
    state.src = 'a--b';
    matchPositionsCached(state, key, /-/g).should.deep.equal([1, 2]);
  });
  // Block rules ask through a buffered probe (`Object.create(state)`), whose own properties die with
  // it. Hosting the cache on the shared `env` is what keeps the sweep from rerunning per probe.
  it('a sweep run inside a buffered probe is reused afterwards', () => {
    const key = Symbol('probe');
    const state = { src: '-a-b', env: {} };
    const fromProbe = matchPositionsCached(Object.create(state), key, /-/g);
    fromProbe.should.deep.equal([0, 2]);
    // Marking the stored array shows the next answers come from it rather than from a fresh sweep.
    fromProbe.push(99);
    matchPositionsCached(state, key, /-/g).should.deep.equal([0, 2, 99]);
    matchPositionsCached(Object.create(state), key, /-/g).should.deep.equal([0, 2, 99]);
  });
  // The bucket is capped, and the outer document's entry is the oldest by insertion — evicting by age
  // alone dropped the one source asked over and over, bringing the per-probe sweep back.
  it('the outer entry survives more nested sources than the cap', () => {
    const key = Symbol('outer');
    const env = {};
    const outer = { src: 'a-b-c', env };
    const cached = matchPositionsCached(outer, key, /-/g);
    cached.push(99);                       // marking the stored array shows a re-sweep as a loss
    for (let i = 0; i < 12; i++) {
      matchPositionsCached({ src: `nested${i}-x`, env }, key, /-/g);
      matchPositionsCached(outer, key, /-/g).should.deep.equal([1, 3, 99]);
    }
  });
  it('entries for different sources coexist, so nesting does not evict', () => {
    const key = Symbol('nest');
    const outer = { src: 'a-b-c', env: {} };
    const inner = { src: 'x-y', env: outer.env };
    matchPositionsCached(outer, key, /-/g).should.deep.equal([1, 3]);
    matchPositionsCached(inner, key, /-/g).should.deep.equal([1]);
    matchPositionsCached(outer, key, /-/g).should.deep.equal([1, 3]);
  });
  // A host that hands the same `env` to every render would otherwise keep up to 8 documents' offset
  // arrays alive; the render-time clear drops them without touching the env's shape.
  it('clearing empties the buckets and keeps the env out of dictionary mode', () => {
    const key = Symbol('clear');
    const env = {};
    matchPositionsCached({ src: 'a-b-c', env }, key, /-/g).should.deep.equal([1, 3]);
    env[key].bySrc.size.should.equal(1);
    clearSrcPosCaches(env);
    env[key].bySrc.size.should.equal(0);
    (env[key].hotSrc === null && env[key].hotSlot === null)
      .should.equal(true, 'the hot slot still answers for the old document');
    Object.prototype.hasOwnProperty.call(env, key).should.equal(true, 'the key was deleted, not emptied');
    matchPositionsCached({ src: 'a-b-c', env }, key, /-/g).should.deep.equal([1, 3]);
  });
  // A slot carries presence, so a computed `undefined` is a hit. Read as a miss, its caller recomputed
  // on every block-rule call — a full pass over the source per line of the document.
  it('a value of undefined is computed once, not per ask', () => {
    const env = {};
    const key = Symbol('undef');
    let calls = 0;
    const compute = () => { calls++; return undefined; };
    for (let i = 0; i < 10; i++) {
      (srcValueCached({ src: 'a-b', env }, key, compute) === undefined).should.equal(true);
    }
    calls.should.equal(1);
  });
  // The structural-suffix counts depend on the offsets array as well as on `src`; a stale slot must be
  // rewritten, or every later ask pays the whole walk again.
  it('a stale value is recomputed once and stored', () => {
    const env = {};
    const key = Symbol('stale');
    let calls = 0;
    const state = { src: 'a-b', env };
    let owner = 'first';
    const compute = () => { calls++; return { owner, n: calls }; };
    srcValueCached(state, key, compute, (c) => c.owner === owner).n.should.equal(1);
    owner = 'second';
    srcValueCached(state, key, compute, (c) => c.owner === owner).n.should.equal(2);
    for (let i = 0; i < 5; i++) {
      srcValueCached(state, key, compute, (c) => c.owner === owner).n.should.equal(2);
    }
    calls.should.equal(2, 'the stale slot was not repaired');
  });
  // The recompute path rewrites the slot in place and does not re-insert it. That is only sound while
  // `recall` runs before the freshness check, as it re-inserts and sets the hot slot on any hit —
  // reordering the two would age the recomputed source towards eviction instead.
  it('a recomputed source is the newest entry and the hot one', () => {
    const env = {};
    const key = Symbol('lru');
    const compute = (src) => ({ src });
    srcValueCached({ src: 'aaa', env }, key, compute);
    srcValueCached({ src: 'bb', env }, key, compute);
    srcValueCached({ src: 'aaa', env }, key, compute, () => false);
    const bucket = env[Object.getOwnPropertySymbols(env)[0]];
    [...bucket.bySrc.keys()].should.deep.equal(['bb', 'aaa'], 'the recomputed source did not move');
    bucket.hotSrc.should.equal('aaa');
    bucket.hotSlot.should.equal(bucket.bySrc.get('aaa'), 'the hot slot points at another source');
  });
  it('clearing an env that never held a bucket is a no-op', () => {
    clearSrcPosCaches({});
    clearSrcPosCaches(undefined);
  });
  it('a pattern that can match empty still terminates', () => {
    const state = { src: 'ab' };
    // `x*` matches the empty string at every offset: without the guard the sweep would not advance.
    matchPositionsCached(state, Symbol('empty'), /x*/g).should.be.an('array');
    lastMatchPosCached(state, Symbol('empty2'), /x*/g).should.be.a('number');
  });
});
