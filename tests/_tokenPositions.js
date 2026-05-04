const { mathpixMarkdownPlugin } = require('../lib/markdown/mathpix-markdown-plugins');

const mdInit = (options = {}) => {
  const { htmlTags = true, xhtmlOut = false, width = 1200, breaks = true, typographer = false, linkify = true,
    outMath = {}, mathJax = {}, renderElement = {},
    lineNumbering = false, htmlSanitize = true, smiles = {}, forDocx = false, openLinkInNewWindow = true, addPositionsToTokens = true } = options
  const mmdOptions = {
    width: width,
    outMath: outMath,
    mathJax: mathJax,
    renderElement: renderElement,
    smiles: smiles,
    forDocx: forDocx,
    forLatex: false,
    addPositionsToTokens: addPositionsToTokens
  };
  return require("markdown-it")({
    html: htmlTags,
    xhtmlOut: xhtmlOut,
    breaks: breaks,
    langPrefix: "language-",
    linkify: linkify,
    typographer: typographer,
    quotes: "“”‘’",
    lineNumbering: lineNumbering,
    htmlSanitize: htmlSanitize,
    openLinkInNewWindow: openLinkInNewWindow
  })
    .use(mathpixMarkdownPlugin, mmdOptions)
    // .use(require('markdown-it-multimd-table'), {enableRowspan: true, enableMultilineRows: true})
    .use(require("markdown-it-footnote"))
    .use(require("markdown-it-sub"))
    .use(require("markdown-it-sup"))
    // .use(require("markdown-it-deflist"))
    .use(require("markdown-it-mark"))
    // .use(mdPluginCollapsible)
    // .use(require("markdown-it-ins"));
  
};



const md = mdInit({addPositionsToTokens: true});

const getTokensTest = (tokens) => {
  const res = [];
  const attrDel = ['attrs', 'block', 'hidden', 'info', 'level', 'map', 'markup', 'meta', 'nesting', 'tag',
    'bMarksContent', 'currentTag', 'eMarks', 'eMarksContent', 'isNewSubSection', 'isUnNumbered', 'section', 'subsection',
    'subsubsection', 'uuid', 'latex', 'is_numerable', 'bMarks', 'isNewSect', 'content_id', 'mathEquation',
    'itemizeLevel', 'enumerateLevel', 'prentLevel', 'parentStart'
  ];
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    if (token.children?.length) {
      const tokensChildren = getTokensTest(token.children);
      token.children = tokensChildren;
    }
    attrDel.map(key => {
      delete tokens[i][key]
    });
    res.push(tokens[i])
  }
  return res;
};

const checkTokens = (parseTokens, parseTokensTest, mmd) => {
  for (let i = 0; i < parseTokens.length; i++) {
    const token = parseTokens[i];
    const tokenTest = parseTokensTest[i];
    if (token.hasOwnProperty('positions')) {
      token.positions.should.have.property('start', tokenTest.positions.start);
      token.positions.should.have.property('end', tokenTest.positions.end);
      const str = mmd.slice(token.positions.start, token.positions.end);
      token.should.have.property('content_test_str', str);
      token.should.have.property('content_test_str', tokenTest.content_test_str);
    }
    if (token.children?.length) {
      for (let j = 0; j < token.children.length; j++) {
        const child = token.children[j];
        const childTest = tokenTest.children[j];
        if (child.hasOwnProperty('positions')) {
          child.positions.should.have.property('start', childTest.positions.start);
          child.positions.should.have.property('end', childTest.positions.end);
          const str = mmd.slice(child.positions.start, child.positions.end);
          child.should.have.property('content_test_str', str);
          child.should.have.property('content_test_str', childTest.content_test_str);
        }
      }
    }
  }
};

describe('Testing positions:', () => {
  const tests = require('./_data/_tokenPositions/_data');
  tests.forEach(function(test, index) {
    it('MMD [' + index + ']=>' + test.mmd, function(done) {
      const parseTokens = md.parse(test.mmd, {});
      // const cleanTokens = getTokensTest(parseTokens);
      // console.log("[cleanTokens]=>" + index + "=>", JSON.stringify(cleanTokens, true, 2));
      parseTokens.should.have.length(test.tokens.length);
      checkTokens(parseTokens, test.tokens, test.mmd);
      done();
    });
  });
});

describe('Testing positions for sections:', () => {
  const tests = require('./_data/_tokenPositions/_data_sections');
  tests.forEach(function(test, index) {
    it('MMD [' + index + ']=>' + test.mmd, function(done) {
      const parseTokens = md.parse(test.mmd, {});
      // const cleanTokens = getTokensTest(parseTokens);
      // console.log("[cleanTokens]=>", JSON.stringify(cleanTokens, true, 2));
      parseTokens.should.have.length(test.tokens.length);
      checkTokens(parseTokens, test.tokens, test.mmd);
      done();
    });
  });
});

describe('Testing positions for author:', () => {
  const tests = require('./_data/_tokenPositions/_data_author');
  tests.forEach(function(test, index) {
    it('MMD [' + index + ']=>' + test.mmd, function(done) {
      const parseTokens = md.parse(test.mmd, {});
      // const cleanTokens = getTokensTest(parseTokens);
      // console.log("[cleanTokens]=>", JSON.stringify(cleanTokens, true, 2));
      parseTokens.should.have.length(test.tokens.length);
      checkTokens(parseTokens, test.tokens, test.mmd);
      done();
    });
  });
});

describe('Testing positions for abstract:', () => {
  const tests = require('./_data/_tokenPositions/_data_abstract');
  tests.forEach(function(test, index) {
    it('MMD [' + index + ']=>' + test.mmd, function(done) {
      const parseTokens = md.parse(test.mmd, {});
      // const cleanTokens = getTokensTest(parseTokens);
      // console.log("[cleanTokens]=>", JSON.stringify(cleanTokens, true, 2));
      parseTokens.should.have.length(test.tokens.length);
      checkTokens(parseTokens, test.tokens, test.mmd);
      done();
    });
  });
});

describe('Testing positions for lists:', () => {
  const tests = require('./_data/_tokenPositions/_data_lists');
  tests.forEach(function(test, index) {
    it('MMD [' + index + ']=>' + test.mmd, function(done) {
      const parseTokens = md.parse(test.mmd, {});
      // const cleanTokens = getTokensTest(parseTokens);
      // console.log("[cleanTokens]=>",index, JSON.stringify(cleanTokens, true, 2));
      parseTokens.should.have.length(test.tokens.length);
      checkTokens(parseTokens, test.tokens, test.mmd);
      done();
    });
  });
});

// Invariant: link_open carries no `start_content`/`end_content` (consistent across strict-triple and span-fallback branches).
describe('link_open positions invariant:', () => {
  const findLinkOpens = (tokens) => {
    const out = [];
    for (const t of tokens) {
      if (t.type === 'link_open') out.push(t);
      if (t.children?.length) out.push(...findLinkOpens(t.children));
    }
    return out;
  };
  const cases = [
    { name: 'strict-triple [text](url)', mmd: 'A [text](http://x.org) B' },
    { name: 'span fallback [**bold**](url)', mmd: 'A [**bold**](http://x.org) B' },
  ];
  cases.forEach(({ name, mmd }) => {
    it(`${name}: link_open.positions has no start_content/end_content`, () => {
      const linkOpens = findLinkOpens(md.parse(mmd, {}));
      linkOpens.length.should.be.greaterThan(0);
      linkOpens.forEach((tok) => {
        if (tok.positions) {
          tok.positions.should.not.have.property('start_content');
          tok.positions.should.not.have.property('end_content');
        }
      });
    });
  });
});

