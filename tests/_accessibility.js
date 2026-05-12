let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { loadSreAsync } = require('../lib/sre/sre-node');

describe('Accessibility math:', () => {

  const tests = require('./_data/_accessibility/_data');

  tests.forEach(function(test) {
    describe('mmd => ' + test.mmd, () => {

      describe('[markdownToHTML] set options by default. ', () => {
        it('Checking result html. Should be not includes <mjx-assistive-mml>...</mjx-assistive-mml>:', (done) => {
          const html = MM.markdownToHTML(test.mmd);
          html.trim().should.equal(test.html);
          done();
        });
      });


      describe('[markdownToHTML] set options {accessibility: { assistiveMml: true}}. ', () => {
        it('Checking result html. Should be includes <mjx-assistive-mml>...</mjx-assistive-mml>:', (done) => {
          const html = MM.markdownToHTML(test.mmd,  {
            previewUuid: 'test-render',
            accessibility: {
              assistiveMml: true
            }
          });

          html.trim().should.equal(test.htmlA);
          done();
        });
      });

      describe('[markdownToHTML] set options {accessibility: { assistiveMml: true, sre: await loadSreAsync()}}. ', () => {
        it('Checking result html. Should be includes "aria-label" for "mjx-containerand" and includes <mjx-assistive-mml>...</mjx-assistive-mml>:', async () => {

          const html = MM.markdownToHTML(test.mmd, {
            accessibility: {
              assistiveMml: true,
              sre: await loadSreAsync()
            }
          });
          html.trim().should.equal(test.htmlAL);
        });
      });

      describe('[markdownToHTML] set options {accessibility: { assistiveMml: true, sre: await loadSreAsync()}, outMath: {include_speech: true}}. ', () => {
        it('Checking result html. Should be includes <speech>...</speech> and <mjx-assistive-mml>...</mjx-assistive-mml>:', async () => {

          const html = MM.markdownToHTML(test.mmd, {
            outMath: {
              include_svg: true,
              include_speech: true,
            },
            accessibility: {
              assistiveMml: true,
              sre: await loadSreAsync()
            }
          });
          
          html.trim().should.equal(test.htmlS);
        });
      });
      
      
    });
  });

  describe('Cache + accessibility: duplicate formulas get unique IDs', () => {
    it('assistiveMml: duplicate $x^2$ produces unique mjx-mml IDs', (done) => {
      const html = MM.markdownToHTML('$x^2$ and $x^2$ and $x^2$', {
        previewUuid: 'cache-a11y-test',
        accessibility: { assistiveMml: true }
      });
      const ids = [...html.matchAll(/<mjx-assistive-mml[^>]*\bid="([^"]+)"/g)].map(m => m[1]);
      ids.length.should.be.greaterThanOrEqual(3);
      new Set(ids).size.should.equal(ids.length);
      done();
    });
    it('assistiveMml: aria-labelledby matches corresponding id', (done) => {
      const html = MM.markdownToHTML('$a$ and $a$', {
        previewUuid: 'cache-a11y-pair',
        accessibility: { assistiveMml: true }
      });
      const ids = [...html.matchAll(/<mjx-assistive-mml[^>]*\bid="([^"]+)"/g)].map(m => m[1]);
      const labels = [...html.matchAll(/aria-labelledby="([^"]+)"/g)].map(m => m[1]);
      ids.length.should.equal(labels.length);
      for (let i = 0; i < ids.length; i++) {
        ids[i].should.equal(labels[i]);
      }
      done();
    });
    it('no accessibility: duplicate $x^2$ produces no assistive-mml IDs', (done) => {
      const html = MM.markdownToHTML('$x^2$ and $x^2$ and $x^2$');
      const ids = [...html.matchAll(/<mjx-assistive-mml[^>]*\bid="([^"]+)"/g)];
      ids.length.should.equal(0);
      done();
    });
  });

});
