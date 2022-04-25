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
  
});
