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
  // {
  //   mmd: '',
  //   html: ''
  // },
  // {
  //   mmd: '',
  //   html: ''
  // },
]
