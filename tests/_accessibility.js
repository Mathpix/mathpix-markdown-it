let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { loadSreAsync } = require('../lib/sre/sre-node');

describe('Accessibility math:', () => {

  const tests = require('./_data/_accessibility/_data');

  tests.forEach(function(test) {
    describe('mmd => ' + test.mmd, () => {

      describe('[markdownToHTML] set options by default. ', () => {
        it('(sync) Checking result html. Should be not includes <mjx-assistive-mml>...</mjx-assistive-mml>:', () => {
          MM.texReset(); /** Resetting the numbering of equations, tables, figures */
          const html = MM.markdownToHTML(test.mmd);
          html.trim().should.equal(test.html);
        });
        it('(async) Checking result html. Should be not includes <mjx-assistive-mml>...</mjx-assistive-mml>:', async () => {
          MM.texReset(); /** Resetting the numbering of equations, tables, figures */
          const html = await MM.markdownToHTMLAsync(test.mmd);
          html.trim().should.equal(test.html);
        });
        it('(async segments) Checking result html. Should be not includes <mjx-assistive-mml>...</mjx-assistive-mml>:', async () => {
          MM.texReset(); /** Resetting the numbering of equations, tables, figures */
          const { content } = await MM.markdownToHTMLSegmentsAsync(test.mmd);
          content.trim().should.equal(test.html);
        });
      });


      describe('[markdownToHTML] set options {accessibility: { assistiveMml: true}}. ', () => {
        const options = {
          accessibility: {
            assistiveMml: true
          }
        };
        it('(sync) Checking result html. Should be includes <mjx-assistive-mml>...</mjx-assistive-mml>:', () => {
          MM.texReset(); /** Resetting the numbering of equations, tables, figures */
          const html = MM.markdownToHTML(test.mmd, options);
          html.trim().should.equal(test.htmlA);
        });
        it('(async) Checking result html. Should be includes <mjx-assistive-mml>...</mjx-assistive-mml>:', async () => {
          MM.texReset(); /** Resetting the numbering of equations, tables, figures */
          const html = await MM.markdownToHTMLAsync(test.mmd, options);
          html.trim().should.equal(test.htmlA);
        });
        it('(async segments) Checking result html. Should be includes <mjx-assistive-mml>...</mjx-assistive-mml>:', async () => {
          MM.texReset(); /** Resetting the numbering of equations, tables, figures */
          const { content } = await MM.markdownToHTMLSegmentsAsync(test.mmd, options);
          content.trim().should.equal(test.htmlA);
        });
      });

      describe('[markdownToHTML] set options {accessibility: { assistiveMml: true, sre: await loadSreAsync()}, outMath: {include_speech: true}}. ', () => {
        it('Checking result html. Should be includes <speech>...</speech> and <mjx-assistive-mml>...</mjx-assistive-mml>:', async () => {
          const options = {
            outMath: {
              include_svg: true,
              include_speech: true,
            },
            accessibility: {
              assistiveMml: true,
              sre: await loadSreAsync()
            }
          };
          MM.texReset(); /** Resetting the numbering of equations, tables, figures */
          let html = MM.markdownToHTML(test.mmd, options);
          html.trim().should.equal(test.htmlS);
          MM.texReset(); /** Resetting the numbering of equations, tables, figures */
          html = await MM.markdownToHTMLAsync(test.mmd, options);
          html.trim().should.equal(test.htmlS);
          MM.texReset(); /** Resetting the numbering of equations, tables, figures */
          let { content } = await MM.markdownToHTMLSegmentsAsync(test.mmd, options);
          content.trim().should.equal(test.htmlS);
        });
      });

      describe('[markdownToHTML] set options {accessibility: { assistiveMml: true, sre: await loadSreAsync()}, outMath: {include_speech: true}}. ', () => {
        it('Checking result html. Should be includes <speech>...</speech> and <mjx-assistive-mml>...</mjx-assistive-mml>:', async () => {
          const options= {
            outMath: {
              include_svg: true,
              include_speech: true,
            },
            accessibility: {
              assistiveMml: true,
              sre: await loadSreAsync()
            }
          };
          MM.texReset(); /** Resetting the numbering of equations, tables, figures */
          let html = MM.markdownToHTML(test.mmd, options);
          html.trim().should.equal(test.htmlS);
          MM.texReset(); /** Resetting the numbering of equations, tables, figures */
          html = await MM.markdownToHTMLAsync(test.mmd, options);
          html.trim().should.equal(test.htmlS);
          MM.texReset(); /** Resetting the numbering of equations, tables, figures */
          let { content } = await MM.markdownToHTMLSegmentsAsync(test.mmd, options);
          content.trim().should.equal(test.htmlS);
        });
      });
    });
  });
  
});
