module.exports = [
  {
    mmd: 'Text befote\n' +
      '\\footnotetext{\n' +
      'There \n' +
      'should be \n' +
      'a space between\n' +
      'the text\n' +
      '} \n' +
      'text after',
    html: '<div>Text befote  text after</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="padding-left: 20px; margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item" style="list-style-type: none;"><div>There<br>\n' +
      'should be<br>\n' +
      'a space between<br>\n' +
      'the text</div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    mmd: 'Text befote\n' +
      '\\footnotetext{\n' +
      'There \n' +
      'should be \n' +
      'a space between\n' +
      'the text\n' +
      '} text after',
    html: '<div>Text befote  text after</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="padding-left: 20px; margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item" style="list-style-type: none;"><div>There<br>\n' +
      'should be<br>\n' +
      'a space between<br>\n' +
      'the text</div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    mmd: 'Text befote\\footnotetext{\n' +
      'There \n' +
      'should be \n' +
      'no space \n' +
      'between text\n' +
      '}text after',
    html: '<div>Text befotetext after</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="padding-left: 20px; margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item" style="list-style-type: none;"><div>There<br>\n' +
      'should be<br>\n' +
      'no space<br>\n' +
      'between text</div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    mmd: 'Text befote\n' +
      '\n' +
      '\\footnotetext{\n' +
      'There \n' +
      'should be \n' +
      'a new paragraph\n' +
      'between the text\n' +
      '} text after',
    html: '<div>Text befote</div>\n' +
      '<div>\n' +
      ' text after</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="padding-left: 20px; margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item" style="list-style-type: none;"><div>There<br>\n' +
      'should be<br>\n' +
      'a new paragraph<br>\n' +
      'between the text</div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    mmd: 'Text befote\n' +
      '\\footnotetext{\n' +
      'There \n' +
      'should be \n' +
      'a new paragraph\n' +
      'between the text\n' +
      '}\n' +
      '\n' +
      'text after',
    html: '<div>Text befote </div>\n' +
      '<div>text after</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="padding-left: 20px; margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item" style="list-style-type: none;"><div>There<br>\n' +
      'should be<br>\n' +
      'a new paragraph<br>\n' +
      'between the text</div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    mmd: 'Text \n' +
      'befote\n' +
      '\n' +
      '\\footnotetext{\n' +
      'There \n' +
      'should be \n' +
      'a new paragraph\n' +
      'between the text\n' +
      '}\n' +
      '\n' +
      'text \n' +
      'after',
    html: '<div>Text<br>\n' +
      'befote</div>\n' +
      '<div>text<br>\n' +
      'after</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="padding-left: 20px; margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item" style="list-style-type: none;"><div>There<br>\n' +
      'should be<br>\n' +
      'a new paragraph<br>\n' +
      'between the text</div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    mmd: 'Text\n' +
      '`before\n' +
      '\\footnotetext{\n' +
      'There \n' +
      'should be `\n' +
      'code inline\n' +
      '} text after',
    html: '<div>Text<br>\n' +
      '<code>before \\footnotetext{ There  should be </code><br>\n' +
      'code inline<br>\n' +
      '} text after</div>'
  },
  {
    mmd: 'Text\n' +
      'before\n' +
      '\\footnotetext{\n' +
      '\\``{1` ` }`2`not\n' +
      '`\n' +
      'code inline ``\\textit{ee}}\n' +
      'should be next text\n' +
      '} text after',
    html: '<div>Text<br>\n' +
      'before  should be next text<br>\n' +
      '} text after</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="padding-left: 20px; margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item" style="list-style-type: none;"><div>`<code>{1</code> <code> }</code>2<code>not </code><br>\n' +
      'code inline ``<em>ee</em></div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  // {
  //   mmd: '',
  //   html: ''
  // },
];
