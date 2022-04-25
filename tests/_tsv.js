//Require the dev-dependencies
let chai = require('chai');
let should = chai.should();


let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {outMath: {
    include_asciimath: false,
    include_mathml: false,
    include_latex: false,
    include_svg: false,
    include_tsv: true
  }};



const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('TSV:', () => {
  const tests = require('./_data/_tsv/_data');
  tests.forEach(function(test) {
    const options = {
      outMath: {
        include_tsv: true,
        include_table_html: true
      }
    };
    describe('Set: include_tsv=true and include_table_html=true. \n Latex => ' + test.latex, () => {
      const html = MM.render(test.latex, options);
      const data = MM.parseMarkdownByHTML(html, false);

      it('Should be parser.length = 2', function(done) {
        data.should.have.length(2);
        done();
      });
      it('Should be have type: "html"', function(done) {
        data[0].should.have.property('type', 'html');
        if (test.html) {
          data[0].should.have.property('value', test.html);
        }
        done();
      });
      it('Should be have type: "tsv"', function(done) {
        data[1].should.have.property('type', 'tsv');
        data[1].should.have.property('value', test.tsv);
        done();
      });
    });

    options.outMath.include_tsv = false;
    options.outMath.include_table_html = true;
    describe('Set: include_tsv=false and include_table_html=true. \n Latex => ' + test.latex, () => {
      const html = MM.render(test.latex, options);
      const data = MM.parseMarkdownByHTML(html, false);

      it('Should be parser.length = 1', function(done) {
        data.should.have.length(1);
        done();
      });
      it('Should be have type: "html"', function(done) {
        data[0].should.have.property('type', 'html');
        if (test.html_not_tsv) {
          data[0].should.have.property('value', test.html_not_tsv);
        } else {
          if (test.html) {
            data[0].should.have.property('value', test.html);
          }
        }
        done();
      });
    });

    describe('Default Options. \n Latex => ' + test.latex, () => {
      const html = MM.render(test.latex);
      const data = MM.parseMarkdownByHTML(html, false);

      it('Should be parser.length = 1', function(done) {
        data.should.have.length(1);
        done();
      });
      it('Should be have type: "html"', function(done) {
        data[0].should.have.property('type', 'html');
        if (test.html_not_tsv) {
          data[0].should.have.property('value', test.html_not_tsv);
        } else {
          if (test.html) {
            data[0].should.have.property('value', test.html);
          }
        }
        done();
      });
    });

    options.outMath.include_tsv = true;
    options.outMath.include_table_html = false;
    describe('Set: include_tsv=false and include_table_html=true. \n Latex => ' + test.latex, () => {
      const html = MM.render(test.latex, options);
      const data = MM.parseMarkdownByHTML(html, false);

      it('Should be parser.length = 1', function(done) {
        data.should.have.length(1);
        done();
      });
      it('Should be have type: "tsv"', function(done) {
        data[0].should.have.property('type', 'tsv');
        data[0].should.have.property('value', test.tsv);
        done();
      });
    });
  });

  describe('Check Formats', () => {
    const tests = require('./_data/_tsv/_dataFormats');
    const test = tests[0];
    it('Should be not tsv: Latex =>' + test.latex, function(done) {
        const html = MM.render(test.latex, {outMath: {
            include_asciimath: false,
            include_mathml: false,
            include_latex: false,
            include_svg: false,
            include_tsv: false,
            include_table_html: true
          }
        });
        const data = MM.parseMarkdownByHTML(html);
        data.should.have.length(1);
        data[0].should.have.property('type', 'html');
        done();
    });

    it('Should be not tsv: Latex =>' + tests[1].latex, function(done) {
      const html = MM.render(tests[1].latex, {outMath: {
          include_asciimath: false,
          include_mathml: false,
          include_latex: false,
          include_svg: false,
          include_tsv: false,
          include_table_html: false
        }
      });
      const data = MM.parseMarkdownByHTML(html);
      data.findIndex(item => item.type === 'tsv').should.equal(-1);
      done();
    });

    it('Should be not tsv: Latex =>' + tests[2].latex, function(done) {
      const html = MM.render(tests[2].latex, {outMath: {
          include_asciimath: false,
          include_mathml: false,
          include_latex: false,
          include_svg: false,
          include_tsv: false
        }
      });
      const data = MM.parseMarkdownByHTML(html);
      data.findIndex(item => item.type === 'tsv').should.equal(-1);
      done();
    });

    it('Should be not include sub Latex =>' + tests[2].latex, function(done) {
      const html = MM.render(tests[2].latex, {outMath: {
          include_asciimath: true,
          include_mathml: true,
          include_latex: true,
          include_svg: true,
          include_tsv: true,
          include_table_html: true
        }
      });
      const data = MM.parseMarkdownByHTML(html, false);
      data.findIndex(item => item.type === 'asciimath').should.equal(-1);
      data.findIndex(item => item.type === 'mathm').should.equal(-1);
      data.findIndex(item => item.type === 'latex').should.equal(-1);
      data.should.have.length(2);
      data[0].should.have.property('type', 'html');
      data[1].should.have.property('type', 'tsv');
      data[1].should.have.property('value', tests[2].tsv);
      done();
    });

    it('Should be include sub Latex =>' + tests[2].latex, function(done) {
      const html = MM.render(tests[2].latex, {outMath: {
          include_asciimath: true,
          include_mathml: true,
          include_latex: true,
          include_svg: true,
          include_tsv: true,
          include_table_html: true
        }
      });
      const data = MM.parseMarkdownByHTML(html);
      data.should.have.length(22);
      data[0].should.have.property('type', 'html');
      data[1].should.have.property('type', 'tsv');
      data[1].should.have.property('value', tests[2].tsv);
      data.findIndex(item => item.type === 'asciimath').should.equal(3);
      data.findIndex(item => item.type === 'mathml').should.equal(2);
      data.findIndex(item => item.type === 'latex').should.equal(4);
      done();
    });

    it('Should be not include sub Latex =>' + tests[3].latex, function(done) {
      const html = MM.render(tests[3].latex, {outMath: {
          include_asciimath: true,
          include_mathml: true,
          include_latex: true,
          include_svg: true,
          include_tsv: true,
          include_table_html: true
        }
      });
      const data = MM.parseMarkdownByHTML(html, false);
      data.findIndex(item => item.type === 'asciimath').should.equal(-1);
      data.findIndex(item => item.type === 'mathm').should.equal(-1);
      data.findIndex(item => item.type === 'latex').should.equal(-1);
      data.should.have.length(2);
      data[0].should.have.property('type', 'html');
      data[1].should.have.property('type', 'tsv');
      data[1].should.have.property('value', tests[3].tsv);
      done();
    });

    it('Should be not include sub Latex =>' + tests[3].latex, function(done) {
      const html = MM.render(tests[3].latex, {outMath: {
          include_asciimath: true,
          include_mathml: true,
          include_latex: true,
          include_svg: true,
          include_tsv: true,
          include_table_html: true
        }
      });
      const data = MM.parseMarkdownByHTML(html);
      data.should.have.length(28);
      data[0].should.have.property('type', 'html');
      data[1].should.have.property('type', 'tsv');
      data[1].should.have.property('value', tests[3].tsv);
      data.findIndex(item => item.type === 'asciimath').should.equal(3);
      data.findIndex(item => item.type === 'mathml').should.equal(2);
      data.findIndex(item => item.type === 'latex').should.equal(4);
      done();
    });

  });
});
