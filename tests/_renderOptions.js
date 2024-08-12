let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { getLabelsList } = require('../lib/index');

let options = {
  cwidth: 800,
  smiles: {
    isTesting: true,
    shortBondLength: 0.85,
    dCircle: 4,
    useCurrentColor: false
  }
};

const { JSDOM } = require("jsdom");
const mmdContent = require("./_data/_renderOprions/_mmd");
const htmlContent = require("./_data/_renderOprions/_html");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe("Check renderOptions:", () => {
  describe("By default. All rules should be followed", () => {
    const mmdContent = require("./_data/_renderOprions/_mmd");
    const htmlContent = require("./_data/_renderOprions/_html");
    const html = MM.markdownToHTML(mmdContent, options);
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });
  describe("Set only {enable_markdown: true}. All rules should be followed", () => {
    const mmdContent = require("./_data/_renderOprions/_mmd");
    const htmlContent = require("./_data/_renderOprions/_html");
    const html = MM.markdownToHTML(mmdContent, Object.assign({}, options, {
      renderOptions: {
        enable_markdown: true
      }
    }));
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });
  describe("Set only {enable_markdown: true, enable_latex: true}. All rules should be followed", () => {
    const mmdContent = require("./_data/_renderOprions/_mmd");
    const htmlContent = require("./_data/_renderOprions/_html");
    const html = MM.markdownToHTML(mmdContent, Object.assign({}, options, {
      renderOptions: {
        enable_markdown: true,
        enable_latex: true
      }
    }));
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });
  describe("Set {enable_markdown: true, enable_latex: true, enable_markdown_mmd_extensions: true}. All rules should be followed", () => {
    const mmdContent = require("./_data/_renderOprions/_mmd");
    const htmlContent = require("./_data/_renderOprions/_html");
    const html = MM.markdownToHTML(mmdContent, Object.assign({}, options, {
      renderOptions: {
        enable_markdown: true,
        enable_latex: true,
        enable_markdown_mmd_extensions: true
      }
    }));
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });

  describe("Should be disable all markdown rules. {enable_markdown: false}", () => {
    const mmdContent = require("./_data/_renderOprions/_mmd");
    const htmlContent = require("./_data/_renderOprions/_html_disable_markdown");
    const html = MM.markdownToHTML(mmdContent, Object.assign({}, options, {
      renderOptions: {
        enable_markdown: false
      }
    }));
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });
  describe("Should be disable <smiles>...</smiles>, <ascii>...</ascii>, mathML rules. {enable_markdown_mmd_extensions: false}", () => {
    const mmdContent = require("./_data/_renderOprions/_mmd");
    const htmlContent = require("./_data/_renderOprions/_html_disable_markdown_mmd_extensions");
    const html = MM.markdownToHTML(mmdContent, Object.assign({}, options, {
      renderOptions: {
        enable_markdown_mmd_extensions: false
      }
    }));
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });
  describe("Should be disable latex and math rules. {enable_latex: false}", () => {
    const mmdContent = require("./_data/_renderOprions/_mmd");
    const htmlContent = require("./_data/_renderOprions/_html_disable_latex");
    const html = MM.markdownToHTML(mmdContent, Object.assign({}, options, {
      renderOptions: {
        enable_latex: false
      }
    }));
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });
  describe("Should be disable all rules. {enable_markdown: false, enable_latex: false, enable_markdown_mmd_extensions: false}", () => {
    const mmdContent = require("./_data/_renderOprions/_mmd");
    const htmlContent = require("./_data/_renderOprions/_html_disable_all_rules");
    const html = MM.markdownToHTML(mmdContent, Object.assign({}, options, {
      renderOptions: {
        enable_markdown: false,
        enable_latex: false,
        enable_markdown_mmd_extensions: false
      }
    }));
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });
})
