module.exports = [
  {
    mmd: 'Text before\n' +
      '\\footnote{\n' +
      'There \n' +
      'should be \n' +
      'a space between\n' +
      'the text\n' +
      '} \n' +
      'text after',
    html: '<div>Text before <sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> text after</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item"><div>There<br>\n' +
      'should be<br>\n' +
      'a space between<br>\n' +
      'the text <a href="#fnref1" class="footnote-backref">↩︎</a></div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    mmd: 'Text before\n' +
      '\\footnote{\n' +
      'There \n' +
      'should be \n' +
      'a space between\n' +
      'the text\n' +
      '} text after',
    html: '<div>Text before <sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> text after</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item"><div>There<br>\n' +
      'should be<br>\n' +
      'a space between<br>\n' +
      'the text <a href="#fnref1" class="footnote-backref">↩︎</a></div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    mmd: 'Text before\\footnote{\n' +
      'There \n' +
      'should be \n' +
      'no space \n' +
      'between text\n' +
      '}text after',
    html: '<div>Text before<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup>text after</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item"><div>There<br>\n' +
      'should be<br>\n' +
      'no space<br>\n' +
      'between text <a href="#fnref1" class="footnote-backref">↩︎</a></div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    mmd: 'Text before\n' +
      '\n' +
      '\\footnote{\n' +
      'There \n' +
      'should be \n' +
      'a new paragraph\n' +
      'between the text\n' +
      '} text after',
    html: '<div>Text before</div>\n' +
      '<div>\n' +
      '<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> text after</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item"><div>There<br>\n' +
      'should be<br>\n' +
      'a new paragraph<br>\n' +
      'between the text <a href="#fnref1" class="footnote-backref">↩︎</a></div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    mmd: 'Text before\n' +
      '\\footnote{\n' +
      'There \n' +
      'should be \n' +
      'a new paragraph\n' +
      'between the text\n' +
      '}\n' +
      '\n' +
      'text after',
    html: '<div>Text before <sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup></div>\n' +
      '<div>text after</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item"><div>There<br>\n' +
      'should be<br>\n' +
      'a new paragraph<br>\n' +
      'between the text <a href="#fnref1" class="footnote-backref">↩︎</a></div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    mmd: 'Text \n' +
      'before\n' +
      '\n' +
      '\\footnote{\n' +
      'There \n' +
      'should be \n' +
      'a new paragraph\n' +
      'between the text\n' +
      '}\n' +
      '\n' +
      'text \n' +
      'after',
    html: '<div>Text<br>\n' +
      'before</div>\n' +
      '<div>\n' +
      '<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup></div>\n' +
      '<div>text<br>\n' +
      'after</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item"><div>There<br>\n' +
      'should be<br>\n' +
      'a new paragraph<br>\n' +
      'between the text <a href="#fnref1" class="footnote-backref">↩︎</a></div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    mmd: 'Text\n' +
      '`before\n' +
      '\\footnote{\n' +
      'There \n' +
      'should be `\n' +
      'code inline\n' +
      '} text after',
    html: '<div>Text<br>\n' +
      '<code>before \\footnote{ There  should be </code><br>\n' +
      'code inline<br>\n' +
      '} text after</div>'
  },
  {
    mmd: 'Text\n' +
      'before\n' +
      '\\footnote{\n' +
      '\\``{1` ` }`2`not\n' +
      '`\n' +
      'code inline ``\\textit{ee}}\n' +
      'should be next text\n' +
      '} text after\n',
    html: '<div>Text<br>\n' +
      'before <sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> should be next text<br>\n' +
      '} text after</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item"><div>`<code>{1</code> <code> }</code>2<code>not </code><br>\n' +
      'code inline ``<em>ee</em> <a href="#fnref1" class="footnote-backref">↩︎</a></div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    mmd: 'Some text \\footnotemark[1] more text',
    html: '<div>Some text <sup class="footnote-ref">[1]</sup>more text</div>'
  },
  {
    mmd: 'Long paragraph without footnotes\nbut containing \\footnotesize text\nthat should not match the rule.',
    html: '<div>Long paragraph without footnotes<br>\nbut containing \\footnotesize text<br>\nthat should not match the rule.</div>'
  },
  {
    mmd: 'Word \\footnotemark[2] then \\footnotemark[3] then plain text.',
    html: '<div>Word <sup class="footnote-ref">[2]</sup>then <sup class="footnote-ref">[3]</sup>then plain text.</div>'
  },
  {
    // Mixed `\footnotemark` and real `\footnote{}` in the same paragraph.
    // Pre-existing rendering quirk: both display "[1]" — `\footnotemark[1]` echoes the explicit mark
    // while the auto-numbered `\footnote{}` is also numbered 1 (links to #fn2). This fixture pins the
    // current behavior so a fix to the numbering scheme would surface here intentionally.
    mmd: 'Word \\footnotemark[1] then \\footnote{real one} more.',
    html: '<div>Word <sup class="footnote-ref">[1]</sup>then <sup class="footnote-ref"><a href="#fn2" id="fnref2">[1]</a></sup> more.</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="margin-bottom: 0;">\n' +
      '<li id="fn2" class="footnote-item"><div>real one <a href="#fnref2" class="footnote-backref">↩︎</a></div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    // boundary: `\footnote{}` at the very end of source — last position must satisfy `>= bMarks[startLine]`
    mmd: 'Text \\footnote{tail}',
    html: '<div>Text <sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup></div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item"><div>tail <a href="#fnref1" class="footnote-backref">↩︎</a></div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    // tShift invariant: `\footnote{}` after leading whitespace. Cached source position is `bMarks[startLine] + tShift`, never `< bMarks[startLine]`, so the early-exit `<` boundary correctly keeps it in scope.
    mmd: '   \\footnote{indented} text after.',
    html: '<div><sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> text after.</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item"><div>indented <a href="#fnref1" class="footnote-backref">↩︎</a></div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    // Nested `\footnote{}` inside another `\footnote{}` body: outer's body is parsed via `state.md.block.parse(content, …)` which builds a fresh StateBlock; the cache symbol on the outer state must NOT leak into the nested parse (the new state has its own `state.src`).
    mmd: 'Outer text \\footnote{outer body with nested \\footnote{inner} ref} after.',
    html: '<div>Outer text <sup class="footnote-ref"><a href="#fn2" id="fnref2">[2]</a></sup> after.</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item"><div>inner <a href="#fnref1" class="footnote-backref">↩︎</a></div>\n' +
      '</li>\n' +
      '<li id="fn2" class="footnote-item"><div>outer body with nested <sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> ref <a href="#fnref2" class="footnote-backref">↩︎</a></div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
];
