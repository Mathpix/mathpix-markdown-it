let chai = require('chai');
let should = chai.should();

const { MathpixMarkdownModel } = require('../lib/index.js');

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

const TAGS = [
  'div', 'span', 'p', 'a',
  'ul', 'ol', 'li',
  'table', 'tbody', 'thead', 'tfoot', 'tr', 'td', 'th',
  'section', 'article', 'header', 'footer', 'nav',
  'details', 'summary',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'pre', 'code',
];

const segmentImbalances = (content, map) => {
  const issues = [];
  map.forEach(([start, end], idx) => {
    const seg = content.slice(start, end);
    for (const tag of TAGS) {
      const open = (seg.match(new RegExp('<' + tag + '\\b', 'g')) || []).length;
      const close = (seg.match(new RegExp('</' + tag + '>', 'g')) || []).length;
      if (open !== close) {
        issues.push(`seg${idx} ${tag}(${open}/${close})`);
      }
    }
  });
  return issues;
};

const render = (src) => MathpixMarkdownModel.markdownToHTMLSegments(src, {});

describe('markdownToHTMLSegments — segment balance:', () => {
  // Every segment must be a self-contained HTML fragment: each tag opened
  // in a segment must be closed in the same segment. Covers all block-level
  // open/close pairs emitted by our custom render rules.

  it('theorem block stays inside a single segment', () => {
    const src = '\\newtheorem{thm}{Theorem}\n\n' +
      '\\begin{thm}\nFirst theorem.\n\\end{thm}\n\n' +
      'Between.\n\n' +
      '\\begin{thm}\nSecond theorem.\n\\end{thm}';
    const { content, map } = render(src);
    segmentImbalances(content, map).should.deep.equal([]);
  });

  it('proof + theorem + list + table do not cross segments', () => {
    const src = '\\newtheorem{thm}{T}\n\n' +
      '\\begin{thm}\nStatement.\n\\end{thm}\n\n' +
      '\\begin{proof}\nProof body.\n\\end{proof}\n\n' +
      '- a\n- b\n\n' +
      '| c1 | c2 |\n|---|---|\n| x | y |';
    const { content, map } = render(src);
    segmentImbalances(content, map).should.deep.equal([]);
  });

  it('TOC + headings + theorem stay balanced', () => {
    const src = '[[toc]]\n\n# One\n\n## Two\n\n' +
      '\\newtheorem{thm}{T}\n\n\\begin{thm}\nBody.\n\\end{thm}\n\n### Three';
    const { content, map } = render(src);
    segmentImbalances(content, map).should.deep.equal([]);
  });

  it('footnotes do not break segment balance', () => {
    const src = 'Para.\\footnote{note}\n\nAnother para.\\footnote{n2}';
    const { content, map } = render(src);
    segmentImbalances(content, map).should.deep.equal([]);
  });

  it('nested lists (list_item_open) stay balanced', () => {
    const src = '- top\n  - nested\n    - deeper\n- back';
    const { content, map } = render(src);
    segmentImbalances(content, map).should.deep.equal([]);
  });

  it('code block between paragraphs emits isolated segment', () => {
    const src = 'Before.\n\n```\ncode\nblock\n```\n\nAfter.';
    const { content, map } = render(src);
    map.length.should.be.at.least(3);
    segmentImbalances(content, map).should.deep.equal([]);
  });

  it('raw html_block is balanced', () => {
    const src = '<div><p>raw html</p></div>\n\nAfter.';
    const { content, map } = render(src);
    segmentImbalances(content, map).should.deep.equal([]);
  });

  it('tabular between paragraphs stays balanced', () => {
    const src = 'Before.\n\n\\begin{tabular}{|c|c|}\\hline a & b \\\\\\hline\\end{tabular}\n\nAfter.';
    const { content, map } = render(src);
    segmentImbalances(content, map).should.deep.equal([]);
  });

  it('display math + equation stay balanced', () => {
    const src = 'Before.\n\n$$x = 1$$\n\n\\begin{equation}a = b\\end{equation}\n\nAfter.';
    const { content, map } = render(src);
    segmentImbalances(content, map).should.deep.equal([]);
  });

  it('addcontentsline (unnumbered section) stays balanced', () => {
    const src = '[[toc]]\n\n\\addcontentsline{toc}{section}{Unnumbered}\n\nPara.';
    const { content, map } = render(src);
    segmentImbalances(content, map).should.deep.equal([]);
  });

  it('horizontal rule emits isolated segment', () => {
    const src = 'Before.\n\n---\n\nAfter.';
    const { content, map } = render(src);
    map.length.should.be.at.least(3);
    segmentImbalances(content, map).should.deep.equal([]);
  });

  it('inline link inside paragraph stays balanced', () => {
    const src = 'Para with [a link](http://example.com) inline.\n\nNext para.';
    const { content, map } = render(src);
    segmentImbalances(content, map).should.deep.equal([]);
  });

  it('underline inline element balanced', () => {
    const src = '\\underline{underlined text} in a para.\n\nNext.';
    const { content, map } = render(src);
    segmentImbalances(content, map).should.deep.equal([]);
  });

  it('proof with qedsymbol balanced', () => {
    const src = '\\newtheorem{thm}{T}\n\n\\begin{proof}\nProof body.\n\\end{proof}';
    const { content, map } = render(src);
    segmentImbalances(content, map).should.deep.equal([]);
  });

  it('theorem with description balanced', () => {
    const src = '\\newtheorem{thm}{Theorem}\n\n\\begin{thm}[Named theorem]\nBody.\n\\end{thm}';
    const { content, map } = render(src);
    segmentImbalances(content, map).should.deep.equal([]);
  });

  // Loop over rule-specific scenarios (one source per block rule). Any
  // segment with imbalanced open/close tags fails the entire case.
  const blockRuleScenarios = {
    'blockquote': '> Quoted text\n>\n> Second line.\n\nAfter.',
    'indented code block': '    line1\n    line2\n\nAfter.',
    'lheading h1': 'Heading one\n===\n\nPara.',
    'lheading h2': 'Heading two\n---\n\nPara.',
    'deflist': 'Term\n:   Definition body.\n\nAfter.',
    'reference definition': '[ref]: http://example.com\n\n[link][ref]\n\nAfter.',
    'footnote_def (markdown)': 'Para.[^1]\n\n[^1]: Footnote body.',
    'latex itemize': '\\begin{itemize}\n\\item one\n\\item two\n\\end{itemize}\n\nAfter.',
    'latex enumerate': '\\begin{enumerate}\n\\item first\n\\item second\n\\end{enumerate}\n\nAfter.',
    'latex align': '\\begin{align}\na &= b\\\\ c &= d\n\\end{align}\n\nAfter.',
    'latex table env': '\\begin{table}\n\\begin{tabular}{|c|}\\hline x \\\\\\hline\\end{tabular}\n\\end{table}\n\nAfter.',
    'latex abstract': '\\begin{abstract}\nAbstract body.\n\\end{abstract}\n\nAfter.',
    'latex lstlisting': '\\begin{lstlisting}\nsome code\n\\end{lstlisting}\n\nAfter.',
    'pagebreak': 'Before.\n\n\\pagebreak\n\nAfter.',
    'latex section + subsection': '\\section{One}\n\n\\subsection{Two}\n\nBody.',
    'LaTeX footnote block': 'Text.\\footnote{block footnote}\n\nAfter.',
    'raw svg_block': '<svg width="10" height="10"><rect width="10" height="10"/></svg>\n\nAfter.',
    'raw mathml block': '<math><mi>x</mi></math>\n\nAfter.',
    'image markdown + block': '![alt](http://example.com/img.png)\n\nAfter.',
    'collapsible (markdown-it)': '+++\nhidden content\n+++\n\nAfter.',
    'renewcommand': '\\renewcommand{\\labelitemi}{*}\n\n\\begin{itemize}\n\\item item\n\\end{itemize}',
    'newtheorem + setcounter': '\\newtheorem{thm}{Theorem}\n\\setcounter{thm}{5}\n\n\\begin{thm}\nBody.\n\\end{thm}',
  };

  Object.entries(blockRuleScenarios).forEach(([name, src]) => {
    it(`balanced segments: ${name}`, () => {
      const { content, map } = render(src);
      segmentImbalances(content, map).should.deep.equal([]);
    });
  });

  it('mixed kitchen-sink scenario', () => {
    const src = '[[toc]]\n\n# Header\n\n' +
      '\\newtheorem{thm}{T}\n\n' +
      'Para.\\footnote{note}\n\n' +
      '\\begin{thm}\nWith inline $x^2$ math.\\footnote{n2}\n\\end{thm}\n\n' +
      '\\begin{proof}\nQED.\n\\end{proof}\n\n' +
      '- list a\n- list b\n  - nested\n\n' +
      '| col1 | col2 |\n|---|---|\n| data1 | data2 |\n\n' +
      '```\ncode fence\n```\n\n' +
      '\\begin{tabular}{|c|}\\hline single \\\\\\hline\\end{tabular}';
    const { content, map } = render(src);
    segmentImbalances(content, map).should.deep.equal([]);
  });
});
