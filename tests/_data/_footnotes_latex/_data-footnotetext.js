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
  // Pre-gate regression: `\blfootnotetext` doesn't contain `\footnote` substring (`\` before `b`).
  // Pre-gate must probe `\blfootnote` separately, else `\blfootnotetext`-only docs skip the rule.
  {
    mmd: '\\blfootnotetext{Body line 1\nBody line 2}',
    html: '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="padding-left: 20px; margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item" style="list-style-type: none;"><div>Body line 1<br>\n' +
      'Body line 2</div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  // Mixed `\footnotetext` + `\blfootnotetext` in one document — both pre-gate prefixes must work together.
  {
    mmd: '\\footnotetext[1]{First}\n\n\\blfootnotetext{Second}',
    html: '<div></div>\n' +
      '<div></div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item" value="1"><div>First</div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '<ol class="footnotes-list" style="padding-left: 20px; margin-bottom: 0;">\n' +
      '<li id="fn2" class="footnote-item" style="list-style-type: none;"><div>Second</div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    name: "item-word body: inside the item.",
    mmd: "Intro paragraph text.\n\\begin{itemize}\n\\item[] \\footnotetext{\nA footnote note that spans\ninside the item.\n}\n\\end{itemize}",
    html: "<div>Intro paragraph text.</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span></li></ul><hr class=\"footnotes-sep\">\n<section class=\"footnotes\" style=\"margin-bottom: 1em;\">\n<ol class=\"footnotes-list\" style=\"padding-left: 20px; margin-bottom: 0;\">\n<li id=\"fn1\" class=\"footnote-item\" style=\"list-style-type: none;\"><div><br>\nA footnote note that spans<br>\ninside the item.<br>\n</div>\n</li>\n</ol>\n</section>"
  },
  {
    name: "item-word body: several items here.",
    mmd: "Intro paragraph text.\n\\begin{itemize}\n\\item[] \\footnotetext{\nA footnote note that spans\nseveral items here.\n}\n\\end{itemize}",
    html: "<div>Intro paragraph text.</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span></li></ul><hr class=\"footnotes-sep\">\n<section class=\"footnotes\" style=\"margin-bottom: 1em;\">\n<ol class=\"footnotes-list\" style=\"padding-left: 20px; margin-bottom: 0;\">\n<li id=\"fn1\" class=\"footnote-item\" style=\"list-style-type: none;\"><div><br>\nA footnote note that spans<br>\nseveral items here.<br>\n</div>\n</li>\n</ol>\n</section>"
  },
  {
    name: "list before the note: the note still spans lines and the list keeps its marker",
    mmd: "\\begin{itemize}\n\\item Earlier list item\n\\end{itemize}\n\nIntro paragraph text.\n\\footnotetext{\nA footnote note that spans\ntwo lines.\n}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>Earlier list item</li></ul><div>Intro paragraph text. </div>\n<hr class=\"footnotes-sep\">\n<section class=\"footnotes\" style=\"margin-bottom: 1em;\">\n<ol class=\"footnotes-list\" style=\"padding-left: 20px; margin-bottom: 0;\">\n<li id=\"fn1\" class=\"footnote-item\" style=\"list-style-type: none;\"><div>A footnote note that spans<br>\ntwo lines.</div>\n</li>\n</ol>\n</section>"
  },
  {
    name: "item-word body: the itemize word here.",
    mmd: "Intro paragraph text.\n\\begin{itemize}\n\\item[] \\footnotetext{\nA footnote note that spans\nthe itemize word here.\n}\n\\end{itemize}",
    html: "<div>Intro paragraph text.</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span></li></ul><hr class=\"footnotes-sep\">\n<section class=\"footnotes\" style=\"margin-bottom: 1em;\">\n<ol class=\"footnotes-list\" style=\"padding-left: 20px; margin-bottom: 0;\">\n<li id=\"fn1\" class=\"footnote-item\" style=\"list-style-type: none;\"><div><br>\nA footnote note that spans<br>\nthe itemize word here.<br>\n</div>\n</li>\n</ol>\n</section>"
  },
];
