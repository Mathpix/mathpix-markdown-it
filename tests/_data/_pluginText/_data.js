module.exports = [
  {
    latex: '\\begin{abstract} \n' +
      'Some text\n' +
      '\\end{abstract}',
    svg: '<div class="abstract" style="width: 80%; margin: 0 auto; margin-bottom: 1em; font-size: .9em;">\n' +
      '<h4 id="abstract_head" class="abstract_head" style="text-align: center;">\n' +
      'Abstract</h4>\n' +
      '<p style="text-indent: 1em;">Some text</p>\n' +
      '</div>'
  },
  {
    latex: '\\begin{abstract} \n' +
      'Some text\n' +
      '\n' +
      'Some text\n' +
      '\n' +
      'Some text\n' +
      '\\end{abstract}',
    svg: '<div class="abstract" style="width: 80%; margin: 0 auto; margin-bottom: 1em; font-size: .9em;">\n' +
      '<h4 id="abstract_head" class="abstract_head" style="text-align: center;">\n' +
      'Abstract</h4>\n' +
      '<p style="text-indent: 1em;">Some text</p>\n' +
      '<p style="text-indent: 1em;">Some text</p>\n' +
      '<p style="text-indent: 1em;">Some text</p>\n' +
      '</div>'
  },
  {
    latex: 'sized by an optical-mechanical technique ~\\textit{Langle}-\n' +
      '\n' +
      '[\\pagebreak\n' +
      '\n' +
      'Summary [\\dotfill \n' +
      '\n' +
      '[www.test.com\n' +
      '\n' +
      '[\\author{Author[^1]}\n' +
      '\n' +
      '[<smiles>C</smiles>\n' +
      '\n' +
      '\n' +
      '[\\setcounter{section}{4}\n' +
      '\n' +
      '\\section{test}\n' +
      '\n' +
      '[\\underline{underline}\n' +
      '\n' +
      '[\\sout{sout}\n' +
      '\n' +
      '[\\theoremstyle{remark}\n' +
      '\\newtheorem*{remark}{Remark}\n' +
      '\n' +
      '\n' +
      '\\section{Introduction}\n' +
      'Unnumbered theorem-like environments are also possible.\n' +
      '\n' +
      '\\begin{remark}This statement is true, I guess.\n' +
      '\\end{remark}\n' +
      '\n' +
      '[\\renewcommand\\qedsymbol{QED}\n' +
      '\n' +
      '\\begin{proof}\n' +
      '[\\label{proof}\n' +
      'To prove it by contradiction try and assume that the statement is false,\n' +
      'proceed from there and at some point you will arrive to a contradiction.\n' +
      '\\end{proof}\n' +
      '\n' +
      '\n' +
      '[\\ref{proof}',
    svg: '<div>sized by an optical-mechanical technique ~<em>Langle</em>-</div>\n' +
      '<div>[</div>\n' +
      '<div data-has-dotfill="true">Summary [&nbsp;<span class="dotfill" aria-hidden="true"></span></div>\n' +
      '<div>[<a href="http://www.test.com" target="_blank" rel="noopener" style="display: inline-block">www.test.com</a></div>\n' +
      '<div>[<div class="author">\n' +
      '          <p><span>Author[^1]</span></p>\n' +
      '        </div></div>\n' +
      '<div>[<div class="smiles-inline" style="display: inline-block"><svg id="smiles-" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 56.099999999999994" style="width: 112.19999999999999px; overflow: visible;"><defs></defs><mask id="text-mask"><rect x="0" y="0" width="100%" height="100%" fill="white"></rect><circle cx="56.099999999999994" cy="28.049999999999997" r="10.518749999999999" fill="black"></circle></mask><style>\n' +
      '                .element {\n' +
      '                    font: 18.7px Helvetica, Arial, sans-serif;\n' +
      '                    alignment-baseline: \'middle\';\n' +
      '                }\n' +
      '                .sub {\n' +
      '                    font: 11.219999999999999px Helvetica, Arial, sans-serif;\n' +
      '                }\n' +
      '            </style><g mask="url(#text-mask)"></g><g><text x="56.099999999999994" y="17.53125" class="element" fill="currentColor" style="\n' +
      '                text-anchor: start;\n' +
      '                writing-mode: vertical-rl;\n' +
      '                text-orientation: upright;\n' +
      '                letter-spacing: -1px;\n' +
      '                direction: ltr;\n' +
      '            "><tspan>C</tspan><tspan style="unicode-bidi: plaintext;">H<tspan baseline-shift="sub" class="sub">4</tspan></tspan></text><text x="56.099999999999994" y="28.049999999999997" class="debug" fill="#ff0000" style="\n' +
      '                font: 5px Droid Sans, sans-serif;\n' +
      '            "></text></g></svg></div></div>\n' +
      '<div style="margin-top: 0; margin-bottom: 1rem;">[</div>\n' +
      '<h2 type="section" class="section-title" id="test">\n' +
      '<span class="section-number">5. </span>test</h2>\n' +
      '<div>[<span data-underline-level="1" data-underline-type="underline" style="border-bottom: 1px solid;background-position: 0 -1px;">underline</span></div>\n' +
      '<div>[<span data-out-type="sout" style="text-decoration: line-through; text-decoration-thickness: from-font;">sout</span></div>\n' +
      '<div style="margin-top: 0; margin-bottom: 1rem;">[</div>\n' +
      '<h2 type="section" class="section-title" id="introduction">\n' +
      '<span class="section-number">6. </span>Introduction</h2>\n' +
      '<div>Unnumbered theorem-like environments are also possible.</div>\n' +
      '<div class="theorem_block">\n' +
      '<div class="theorem" style="font-style: normal; padding: 10px 0;"><span style="font-style: italic;" class="theorem-title">Remark.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">This statement is true, I guess.</div>\n' +
      '</div></div>\n' +
      '<div style="margin-top: 0; margin-bottom: 1rem;">[</div>\n' +
      '<div class="proof_block">\n' +
      '<div id="proof" class="proof" style="font-style: normal; padding: 10px 0;"><span style="font-style: italic;">Proof.</span><span style="margin-right: 10px"></span><div style="display: inline" data-display="inline">[To prove it by contradiction try and assume that the statement is false,<br>\n' +
      'proceed from there and at some point you will arrive to a contradiction.<span style="float: right">QED</span></div>\n' +
      '</div></div>\n' +
      '<div>[<a href="#proof" style="cursor: pointer; text-decoration: none;" class="clickable-link" value="proof" data-parentheses="false">1</a></div>'
  }
];
