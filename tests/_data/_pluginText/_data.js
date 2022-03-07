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
  }
];
