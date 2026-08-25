const chai = require('chai');
chai.should();

const listEnvEngine = require('../../lib/markdown/md-latex-lists-env/latex-list-env-engine');
const listSourceModel = require('../../lib/markdown/md-latex-lists-env/list-source-model');
const {
  envSnapshotDepth,
  releaseEnvSnapshot,
  resetEnvSnapshotPool,
} = require('../../lib/markdown/common/env-transient');

// Root hook plugins, required through the `mocha` key in `package.json`, so they run whichever files
// mocha is given: registered from a test file they covered `npm test` alone, and a run of one file is
// the development loop. Outside `tests/*.js`, so the glob cannot load this a second time.
const snapshotLeaks = [];
const degraded = [];
const unanchored = [];

// The snapshot depth is module state: a test that dies before its release leaves it raised, and from then
// on `resetEnvSnapshotPool` declines and the restores decline with it — so one failure showed up as four
// in tests that do nothing wrong. Drained here, reported at the end; throwing would abort the rest.
const drainSnapshots = function () {
  const leaked = envSnapshotDepth();
  if (leaked === 0) {
    return;
  }
  for (let i = 0; i < leaked; i++) {
    releaseEnvSnapshot();
  }
  resetEnvSnapshotPool();
  snapshotLeaks.push(this.currentTest.fullTitle() + ' left ' + leaked);
};

// A failed rule renders literal LaTeX, and an offset that failed its anchor declines a wrapper: both are
// valid output, which every other net reads as passing. A test degrading on purpose resets the counter.
const countDegradations = function () {
  if (listEnvEngine.listRuleFailureCount() > 0) {
    degraded.push(this.currentTest.fullTitle());
    listEnvEngine.resetListRuleFailures();
  }
  if (listSourceModel.unanchoredOffsetCount() > 0) {
    unanchored.push(this.currentTest.fullTitle());
    listSourceModel.resetUnanchoredOffsets();
  }
};

const report = () => {
  snapshotLeaks.should.deep.equal([], 'a test left a snapshot un-released');
  degraded.should.deep.equal([], 'the list rule failed and fell back to literal LaTeX');
  unanchored.should.deep.equal([], 'absoluteOffsetOf could not anchor a line it was handed');
};

exports.mochaHooks = {
  afterEach: [drainSnapshots, countDegradations],
  afterAll: [report],
};
