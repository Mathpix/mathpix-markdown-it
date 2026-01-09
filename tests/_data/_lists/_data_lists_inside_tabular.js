module.exports = [
  {
    mmd: '\\begin{tabular}{l}\n' +
      '\\begin{itemize}\n' +
      '\\item[] item 1;\n' +
      '\\item[] item 2,\n' +
      '\\item[] item 3.\n' +
      '\\end{itemize}\n' +
      '\\end{tabular}',
    html:
      '<div class="table_tabular" style="text-align: center">\n' +
        '<div class="inline-tabular">' +
          '<table class="tabular">\n' +
            '<tbody>\n' +
              '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
                  '<ul class="itemize" style="list-style-type: none">' +
                    '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
                      '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
                      'item 1;' +
                    '</li>' +
                    '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
                      '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
                      'item 2,' +
                    '</li>' +
                    '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
                      '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
                      'item 3.' +
                    '</li>' +
                  '</ul>' +
                '</td>\n' +
              '</tr>\n' +
            '</tbody>\n' +
          '</table>\n' +
        '</div>' +
      '</div>\n'
  },
  {
    mmd: '\\begin{tabular}{l}\n' +
      '\\begin{itemize}\n' +
      '\\item item 1;\n' +
      '\\item item 2,\n' +
      '\\item item 3.\n' +
      '\\end{itemize}\n' +
      '\\end{tabular}',
    html:
      '<div class="table_tabular" style="text-align: center">\n' +
        '<div class="inline-tabular">' +
          '<table class="tabular">\n' +
            '<tbody>\n' +
              '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
                  '<ul class="itemize" style="list-style-type: none">' +
                    '<li class="li_itemize">' +
                      '<span class="li_level">•</span>' +
                      'item 1;' +
                    '</li>' +
                    '<li class="li_itemize">' +
                      '<span class="li_level">•</span>' +
                      'item 2,' +
                    '</li>' +
                    '<li class="li_itemize">' +
                      '<span class="li_level">•</span>' +
                      'item 3.' +
                    '</li>' +
                  '</ul>' +
                '</td>\n' +
              '</tr>\n' +
            '</tbody>\n' +
          '</table>\n' +
        '</div>' +
      '</div>\n'
  },
  {
    mmd: '\\begin{tabular}{l}\n' +
      '\\begin{itemize}\n' +
      '\\item[□] item 1;\n' +
      '\\item[□] item 2,\n' +
      '\\item[□] item 3.\n' +
      '\\end{itemize}\n' +
      '\\end{tabular}',
    html:
      '<div class="table_tabular" style="text-align: center">\n' +
        '<div class="inline-tabular">' +
          '<table class="tabular">\n' +
            '<tbody>\n' +
              '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
                  '<ul class="itemize" style="list-style-type: none">' +
                    '<li class="li_itemize" data-custom-marker="true">' +
                      '<span class="li_level" data-custom-marker="true">□</span>' +
                      'item 1;' +
                    '</li>' +
                    '<li class="li_itemize" data-custom-marker="true">' +
                      '<span class="li_level" data-custom-marker="true">□</span>' +
                      'item 2,' +
                    '</li>' +
                    '<li class="li_itemize" data-custom-marker="true">' +
                      '<span class="li_level" data-custom-marker="true">□</span>' +
                      'item 3.' +
                    '</li>' +
                  '</ul>' +
                '</td>\n' +
              '</tr>\n' +
            '</tbody>\n' +
          '</table>\n' +
        '</div>' +
      '</div>\n'
  },
  {
    mmd: '1\\begin{itemize}\n' +
      '\\item item\n' +
      '\\end{itemize}',
    html:
      '<div>' +
        '1' +
        '<ul class="itemize" style="list-style-type: none">' +
          '<li class="li_itemize">' +
            '<span class="li_level">•</span>' +
            'item' +
          '</li>' +
        '</ul>' +
      '</div>\n'
  },
  {
    mmd: '\\begin{tabular}{|p{0.7\\textwidth}|}\n' +
      '\\hline\n' +
      '\\textbf{Input (nested lists + nested tables)} \\\\\n' +
      '\\hline\n' +
      '\\begin{itemize}\n' +
      '  \\item \\textbf{Source formats supported}\n' +
      '    \\begin{itemize}\n' +
      '      \\item LaTeX source document\n' +
      '      \\item HTML source page\n' +
      '    \\end{itemize}\n' +
      '  \\item \\textbf{Example: Table embedded inside a list item}\n' +
      '    \\begin{tabular}{|l|}\n' +
      '      \\hline\n' +
      '      \\textbf{Embedded table header} \\\\\n' +
      '      \\hline\n' +
      '      \\begin{itemize}\n' +
      '        \\item First bullet inside the table\n' +
      '        \\item Second bullet inside the table\n' +
      '      \\end{itemize}\n' +
      '      \\\\\n' +
      '      \\hline\n' +
      '    \\end{tabular}\n' +
      '  \\item \\textbf{Example: Nested list inside list item}\n' +
      '    \\begin{itemize}\n' +
      '      \\item Image export (PNG / JPG)\n' +
      '      \\item PDF export\n' +
      '      \\item DOCX export\n' +
      '    \\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\\\\n' +
      '\\hline\n' +
      '\\textbf{Example: Table after list (same cell)} \\\\\n' +
      '\\begin{tabular}{|l|}\n' +
      '  \\hline\n' +
      '  \\textbf{Second embedded table} \\\\\n' +
      '  \\hline\n' +
      '  Plain text row content \\\\\n' +
      '  \\hline\n' +
      '\\end{tabular}\n' +
      '\\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n',
    html:
      '<div class="table_tabular" style="text-align: center">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: 840px; vertical-align: top; "><strong>Input (nested lists + nested tables)</strong></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: 840px; vertical-align: top; ">\n' +
      '<ul class="itemize" style="list-style-type: none">' +
      '<li class="li_itemize">' +
      '<span class="li_level">•</span>' +
      '<strong>Source formats supported</strong>' +
      '<ul class="itemize" style="list-style-type: none">' +
      '<li class="li_itemize">' +
      '<span class="li_level">–</span>' +
      'LaTeX source document' +
      '</li>' +
      '<li class="li_itemize">' +
      '<span class="li_level">–</span>' +
      'HTML source page' +
      '</li>' +
      '</ul>' +
      '</li>' +
      '<li class="li_itemize block">' +
      '<span class="li_level">•</span>' +
      '<div>\n' +
      '<strong>Example: Table embedded inside a list item</strong>' +
      '</div>\n' +
      '<div class="table_tabular">\n' +
      '<table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Embedded table header</strong></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
      '<ul class="itemize" style="list-style-type: none">' +
      '<li class="li_itemize">' +
      '<span class="li_level">–</span>' +
      'First bullet inside the table' +
      '</li>' +
      '<li class="li_itemize">' +
      '<span class="li_level">–</span>' +
      'Second bullet inside the table' +
      '</li>' +
      '</ul>' +
      '</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div>\n' +
      '<li class="li_itemize">' +
      '<span class="li_level">•</span>' +
      '<strong>Example: Nested list inside list item</strong>' +
      '<ul class="itemize" style="list-style-type: none">' +
      '<li class="li_itemize">' +
      '<span class="li_level">–</span>' +
      'Image export (PNG / JPG)' +
      '</li>' +
      '<li class="li_itemize">' +
      '<span class="li_level">–</span>' +
      'PDF export' +
      '</li>' +
      '<li class="li_itemize">' +
      '<span class="li_level">–</span>' +
      'DOCX export' +
      '</li>' +
      '</ul>' +
      '</li>' +
      '</ul>' +
      '</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: 840px; vertical-align: top; "><strong>Example: Table after list (same cell)</strong></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: 840px; vertical-align: top; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Second embedded table</strong></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Plain text row content</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div>' +
      '</div>\n'
  },
  // {
  //   mmd: '',
  //   html: ''
  // },
]
