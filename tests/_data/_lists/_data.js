module.exports = [
  {
    latex: '\\begin{itemize}\n' +
      '  \\item One entry in the list\n' +
      '  \\item Another entry in the list\n' +
      '\\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize">' +
          '<span class="li_level">•</span>' +
          'One entry in the list' +
        '</li>' +
        '<li class="li_itemize">' +
          '<span class="li_level">•</span>' +
          'Another entry in the list' +
        '</li>' +
      '</ul>',
  },
  {
    latex: '\\begin{itemize}\n' +
      '  \\item The individual entries are indicated with a black dot, a so-called bullet.\n' +
      '  \\item The text in the entries may be of any length.\n' +
      '\\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize">' +
          '<span class="li_level">•</span>' +
          'The individual entries are indicated with a black dot, a so-called bullet.' +
        '</li>' +
        '<li class="li_itemize">' +
          '<span class="li_level">•</span>' +
          'The text in the entries may be of any length.' +
        '</li>' +
      '</ul>',
  },
  {
    latex: '\\begin{enumerate}\n' +
      '   \\item The labels consists of sequential numbers.\n' +
      '   \\begin{itemize}\n' +
      '     \\item The individual entries are indicated with a black dot, a so-called bullet.\n' +
      '     \\item The text in the entries may be of any length.\n' +
      '   \\end{itemize}\n' +
      '   \\item The numbers starts at 1 with every call to the enumerate environment.\n' +
      '\\end{enumerate}',
    html:
      '<ol class="enumerate decimal" style="list-style-type: decimal">' +
        '<li class="li_enumerate">' +
          'The labels consists of sequential numbers.' +
          '<ul class="itemize" style="list-style-type: none">' +
            '<li class="li_itemize">' +
              '<span class="li_level">•</span>' +
              'The individual entries are indicated with a black dot, a so-called bullet.' +
            '</li>' +
            '<li class="li_itemize">' +
              '<span class="li_level">•</span>' +
              'The text in the entries may be of any length.' +
            '</li>' +
          '</ul>' +
        '</li>' +
        '<li class="li_enumerate">' +
          'The numbers starts at 1 with every call to the enumerate environment.' +
        '</li>' +
      '</ol>',
  },
  {
    latex: '\\begin{enumerate}\n' +
      '   \\item First level item\n' +
      '   \\item First level item\n' +
      '   \\begin{enumerate}\n' +
      '     \\item Second level item\n' +
      '     \\item Second level item\n' +
      '     \\begin{enumerate}\n' +
      '       \\item Third level item\n' +
      '       \\item Third level item\n' +
      '       \\begin{enumerate}\n' +
      '         \\item Fourth level item\n' +
      '         \\item Fourth level item\n' +
      '       \\end{enumerate}\n' +
      '     \\end{enumerate}\n' +
      '   \\end{enumerate}\n' +
      ' \\end{enumerate}',
    html:
      '<ol class="enumerate decimal" style="list-style-type: decimal">' +
        '<li class="li_enumerate">' +
          'First level item' +
        '</li>' +
        '<li class="li_enumerate">' +
          'First level item' +
          '<ol class="enumerate lower-alpha" style="list-style-type: lower-alpha">' +
            '<li class="li_enumerate">' +
              'Second level item' +
            '</li>' +
            '<li class="li_enumerate">' +
              'Second level item' +
              '<ol class="enumerate lower-roman" style="list-style-type: lower-roman">' +
                '<li class="li_enumerate">' +
                  'Third level item' +
                '</li>' +
                '<li class="li_enumerate">' +
                  'Third level item' +
                  '<ol class="enumerate upper-alpha" style="list-style-type: upper-alpha">' +
                    '<li class="li_enumerate">' +
                      'Fourth level item' +
                    '</li>' +
                    '<li class="li_enumerate">' +
                      'Fourth level item' +
                    '</li>' +
                  '</ol>' +
                '</li>' +
              '</ol>' +
            '</li>' +
          '</ol>' +
        '</li>' +
      '</ol>',
  },
  {
    latex: '\\begin{itemize}\n' +
      '\\item Arabic number (1, 2, 3, ...) for Level 1\n' +
      '\\item Lowercase letter (a, b, c, ...) for Level 2\n' +
      '\\item Lowercase Roman numeral (i, ii, iii, ...) for Level 3\n' +
      '\\item Uppercase letter (A, B, C, ...) for Level 4.\n' +
      '\\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize">' +
          '<span class="li_level">•</span>' +
          'Arabic number (1, 2, 3, …) for Level 1' +
        '</li>' +
        '<li class="li_itemize">' +
          '<span class="li_level">•</span>' +
          'Lowercase letter (a, b, c, …) for Level 2' +
        '</li>' +
        '<li class="li_itemize">' +
          '<span class="li_level">•</span>' +
          'Lowercase Roman numeral (i, ii, iii, …) for Level 3' +
        '</li>' +
        '<li class="li_itemize">' +
          '<span class="li_level">•</span>' +
          'Uppercase letter (A, B, C, …) for Level 4.' +
        '</li>' +
      '</ul>',
  },
  {
    latex: '\\renewcommand{\\labelenumii}{\\Roman{enumii}}\n' +
      ' \\begin{enumerate}\n' +
      '   \\item First level item\n' +
      '   \\item First level item\n' +
      '   \\begin{enumerate}\n' +
      '     \\item Second level item\n' +
      '     \\item Second level item\n' +
      '     \\begin{enumerate}\n' +
      '       \\item Third level item\n' +
      '       \\item Third level item\n' +
      '       \\begin{enumerate}\n' +
      '         \\item Fourth level item\n' +
      '         \\item Fourth level item\n' +
      '       \\end{enumerate}\n' +
      '     \\end{enumerate}\n' +
      ' \\end{enumerate}\n' +
      ' \\end{enumerate}',
    html: '' +
      '<ol class="enumerate decimal" style="list-style-type: decimal">' +
        '<li class="li_enumerate">' +
          'First level item' +
        '</li>' +
        '<li class="li_enumerate">' +
          'First level item' +
          '<ol class="enumerate upper-roman" style="list-style-type: upper-roman">' +
            '<li class="li_enumerate">' +
              'Second level item' +
            '</li>' +
            '<li class="li_enumerate">' +
              'Second level item' +
              '<ol class="enumerate lower-roman" style="list-style-type: lower-roman">' +
                '<li class="li_enumerate">' +
                  'Third level item' +
                '</li>' +
                '<li class="li_enumerate">' +
                  'Third level item' +
                  '<ol class="enumerate upper-alpha" style="list-style-type: upper-alpha">' +
                    '<li class="li_enumerate">' +
                      'Fourth level item' +
                    '</li>' +
                    '<li class="li_enumerate">' +
                      'Fourth level item' +
                    '</li>' +
                  '</ol>' +
                '</li>' +
              '</ol>' +
            '</li>' +
          '</ol>' +
        '</li>' +
      '</ol>',
  },
  {
    latex: '\\begin{itemize} \n' +
      '\\item `\\labelenumi` for Level 1\n' +
      '\\item `\\labelenumii` for Level 2\n' +
      '\\item `\\labelenumiii` for Level 3\n' +
      '\\item `\\labelenumiv` for Level 4\n' +
      '\\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize block">' +
          '<span class="li_level">•</span>' +
          '<div><code>\\labelenumi</code> for Level 1</div>\n' +
        '</li>' +
        '<li class="li_itemize block">' +
          '<span class="li_level">•</span>' +
          '<div><code>\\labelenumii</code> for Level 2</div>\n' +
        '</li>' +
        '<li class="li_itemize block">' +
          '<span class="li_level">•</span>' +
          '<div><code>\\labelenumiii</code> for Level 3</div>\n' +
        '</li>' +
        '<li class="li_itemize block">' +
          '<span class="li_level">•</span>' +
          '<div><code>\\labelenumiv</code> for Level 4</div>\n' +
        '</li>' +
      '</ul>',
  },
  {
    latex: '\\begin{itemize}\n' +
      '   \\item  First Level\n' +
      '   \\begin{itemize}\n' +
      '     \\item  Second Level\n' +
      '     \\begin{itemize}\n' +
      '       \\item  Third Level\n' +
      '       \\begin{itemize}\n' +
      '         \\item  Fourth Level\n' +
      '       \\end{itemize}\n' +
      '     \\end{itemize}\n' +
      '   \\end{itemize}\n' +
      ' \\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize">' +
          '<span class="li_level">•</span>' +
          'First Level' +
          '<ul class="itemize" style="list-style-type: none">' +
            '<li class="li_itemize">' +
              '<span class="li_level">–</span>' +
              'Second Level' +
              '<ul class="itemize" style="list-style-type: none">' +
                '<li class="li_itemize">' +
                  '<span class="li_level">∗</span>' +
                  'Third Level' +
                  '<ul class="itemize" style="list-style-type: none">' +
                    '<li class="li_itemize">' +
                      '<span class="li_level">·</span>' +
                      'Fourth Level' +
                    '</li>' +
                  '</ul>' +
                '</li>' +
              '</ul>' +
            '</li>' +
          '</ul>' +
        '</li>' +
      '</ul>',
  },
  {
    latex: '\\begin{itemize}\n' +
      '\\item Level 1 is `\\textbullet` (•),\n' +
      '\\item Level 2 is `\\textendash` (–) ,\n' +
      '\\item Level 3 is `\\textasteriskcentered` (*)\n' +
      '\\item Level 4 is `\\textperiodcentered` (·).\n' +
      '\\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize block">' +
          '<span class="li_level">•</span>' +
          '<div>Level 1 is <code>\\textbullet</code> (•),</div>\n' +
        '</li>' +
        '<li class="li_itemize block">' +
          '<span class="li_level">•</span>' +
          '<div>Level 2 is <code>\\textendash</code> (–) ,</div>\n' +
        '</li>' +
        '<li class="li_itemize block">' +
          '<span class="li_level">•</span>' +
          '<div>Level 3 is <code>\\textasteriskcentered</code> (*)</div>\n' +
        '</li>' +
        '<li class="li_itemize block">' +
          '<span class="li_level">•</span>' +
          '<div>Level 4 is <code>\\textperiodcentered</code> (·).</div>\n' +
        '</li>' +
      '</ul>',
  },
  {
    latex: '\\renewcommand{\\labelitemi}{$\\blacksquare$}\n' +
      ' \\renewcommand\\labelitemii{$\\square$}\n' +
      ' \\begin{itemize}\n' +
      '   \\item  First Level\n' +
      '   \\begin{itemize}\n' +
      '     \\item  Second Level\n' +
      '     \\begin{itemize}\n' +
      '       \\item  Third Level\n' +
      '       \\begin{itemize}\n' +
      '         \\item  Fourth Level\n' +
      '       \\end{itemize}\n' +
      '     \\end{itemize}\n' +
      '   \\end{itemize}\n' +
      ' \\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize">' +
          '<span class="li_level">' +
            '<span class="math-inline " data-overflow="visible">\n' +
              '<mjx-container class="MathJax" jax="SVG">' +
                '<svg style="vertical-align: 0;" xmlns="http://www.w3.org/2000/svg" width="1.76ex" height="1.559ex" role="img" focusable="false" viewBox="0 -689 778 689"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="25FC" d="M71 0Q59 4 55 16V346L56 676Q64 686 70 689H709Q719 681 722 674V15Q719 10 709 1L390 0H71Z"></path></g></g></g></svg>' +
              '</mjx-container>' +
            '</span>' +
          '</span>' +
          'First Level' +
          '<ul class="itemize" style="list-style-type: none">' +
            '<li class="li_itemize">' +
              '<span class="li_level">' +
                '<span class="math-inline " data-overflow="visible">\n' +
                  '<mjx-container class="MathJax" jax="SVG">' +
                    '<svg style="vertical-align: 0;" xmlns="http://www.w3.org/2000/svg" width="1.76ex" height="1.559ex" role="img" focusable="false" viewBox="0 -689 778 689"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="25FB" d="M71 0Q59 4 55 16V346L56 676Q64 686 70 689H709Q719 681 722 674V15Q719 10 709 1L390 0H71ZM682 40V649H95V40H682Z"></path></g></g></g></svg>' +
                  '</mjx-container>' +
                '</span>' +
              '</span>' +
              'Second Level' +
              '<ul class="itemize" style="list-style-type: none">' +
                '<li class="li_itemize">' +
                  '<span class="li_level">∗</span>' +
                  'Third Level' +
                  '<ul class="itemize" style="list-style-type: none">' +
                    '<li class="li_itemize">' +
                      '<span class="li_level">·</span>' +
                      'Fourth Level' +
                    '</li>' +
                  '</ul>' +
                '</li>' +
              '</ul>' +
            '</li>' +
          '</ul>' +
        '</li>' +
      '</ul>'
  },
  {
    latex: '\\begin{itemize}\n' +
      '  \\item  Default item label for entry one\n' +
      '  \\item  Default item label for entry two\n' +
      '  \\item[$\\square$]  Custom item label for entry three\n' +
      '\\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize">' +
          '<span class="li_level">•</span>' +
          'Default item label for entry one' +
        '</li>' +
        '<li class="li_itemize">' +
          '<span class="li_level">•</span>' +
          'Default item label for entry two' +
        '</li>' +
        '<li class="li_itemize" data-custom-marker="true">' +
          '<span class="li_level" data-custom-marker="true">' +
          '<span class="math-inline " data-overflow="visible">\n<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0;" xmlns="http://www.w3.org/2000/svg" width="1.76ex" height="1.559ex" role="img" focusable="false" viewBox="0 -689 778 689"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="25FB" d="M71 0Q59 4 55 16V346L56 676Q64 686 70 689H709Q719 681 722 674V15Q719 10 709 1L390 0H71ZM682 40V649H95V40H682Z"></path></g></g></g></svg></mjx-container></span></span>' +
          'Custom item label for entry three' +
        '</li>' +
      '</ul>'
  },
  {
    latex: '\\begin{itemize}\\item One entry in the list\\item Another entry in the list\\end{itemize}\n' +
      '\\renewcommand\\labelitemi{\\textquestiondown}\n' +
      ' \\renewcommand\\labelitemii{$\\square$}\n' +
      '\n' +
      ' \\begin{itemize}\n' +
      '   \\item  First Level\n' +
      '   \\begin{itemize}\n' +
      '     \\item  Second Level\n' +
      '     \\begin{itemize}\n' +
      '       \\item  Third Level\n' +
      '       \\begin{itemize}\n' +
      '         \\item  Fourth Level\\item[$\\square$]  Fourth Level\n' +
      '         \\item  Fourth Levelfffy\n' +
      '       \\end{itemize}\n' +
      '     \\end{itemize}\n' +
      '   \\end{itemize}\n' +
      ' \\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize">' +
          '<span class="li_level">•</span>' +
          'One entry in the list' +
        '</li>' +
        '<li class="li_itemize">' +
          '<span class="li_level">•</span>' +
          'Another entry in the list' +
        '</li>' +
      '</ul>' +
      '' +
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize">' +
          '<span class="li_level">¿</span>' +
          'First Level' +
          '<ul class="itemize" style="list-style-type: none">' +
            '<li class="li_itemize">' +
              '<span class="li_level">' +
                '<span class="math-inline " data-overflow="visible">\n<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0;" xmlns="http://www.w3.org/2000/svg" width="1.76ex" height="1.559ex" role="img" focusable="false" viewBox="0 -689 778 689"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="25FB" d="M71 0Q59 4 55 16V346L56 676Q64 686 70 689H709Q719 681 722 674V15Q719 10 709 1L390 0H71ZM682 40V649H95V40H682Z"></path></g></g></g></svg></mjx-container></span>' +
              '</span>' +
              'Second Level' +
              '<ul class="itemize" style="list-style-type: none">' +
                '<li class="li_itemize">' +
                  '<span class="li_level">∗</span>' +
                  'Third Level' +
                  '<ul class="itemize" style="list-style-type: none">' +
                    '<li class="li_itemize">' +
                      '<span class="li_level">·</span>' +
                      'Fourth Level' +
                    '</li>' +
                    '<li class="li_itemize" data-custom-marker="true">' +
                      '<span class="li_level" data-custom-marker="true">' +
                        '<span class="math-inline " data-overflow="visible">\n<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0;" xmlns="http://www.w3.org/2000/svg" width="1.76ex" height="1.559ex" role="img" focusable="false" viewBox="0 -689 778 689"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="25FB" d="M71 0Q59 4 55 16V346L56 676Q64 686 70 689H709Q719 681 722 674V15Q719 10 709 1L390 0H71ZM682 40V649H95V40H682Z"></path></g></g></g></svg></mjx-container></span>' +
                      '</span>' +
                      'Fourth Level' +
                    '</li>' +
                    '<li class="li_itemize">' +
                      '<span class="li_level">·</span>' +
                      'Fourth Levelfffy' +
                    '</li>' +
                  '</ul>' +
                '</li>' +
              '</ul>' +
            '</li>' +
          '</ul>' +
        '</li>' +
      '</ul>'
  },
  {
    latex: '\\begin{enumerate}\n' +
      '\\setcounter{enumi}{35}\n' +
      '\\item Test\n' +
      '\\end{enumerate}',
    html:
      '<ol class="enumerate decimal" style="list-style-type: decimal">' +
        '<li value="36" class="li_enumerate">' +
          'Test' +
        '</li>' +
      '</ol>'
  },
  {
    latex: '\\begin{enumerate}\n' +
      '  \\setcounter{enumi}{-1}\n' +
      '  \\item Test\n' +
      '\\end{enumerate}',
    html:
      '<ol class="enumerate decimal" style="list-style-type: decimal">' +
        '<li value="0" class="li_enumerate">' +
          'Test' +
        '</li>' +
      '</ol>'
  },
  {
    latex: '\\begin{enumerate}\n' +
      '  \\setcounter{enumi}{A}\n' +
      '  \\item Test\n' +
      '\\end{enumerate}',
    html:
      '<ol class="enumerate decimal" style="list-style-type: decimal">' +
        '<li value="1" class="li_enumerate">' +
          'Test' +
        '</li>' +
      '</ol>'
  },
  {
    latex: '\\begin{enumerate}\n' +
      '\\setcounter{enumi}{-2}\n' +
      '\\item Test\n' +
      '\\end{enumerate}',
    html:
      '<ol class="enumerate decimal" style="list-style-type: decimal">' +
        '<li value="-1" class="li_enumerate">' +
          'Test' +
        '</li>' +
      '</ol>'
  },
  {
    latex: '\\begin{enumerate}\\setcounter{enumi}{-2}\n' +
      '\\item Test\n' +
      '\\end{enumerate}',
    html:
      '<ol class="enumerate decimal" style="list-style-type: decimal">' +
        '<li value="-1" class="li_enumerate">' +
          'Test' +
        '</li>' +
      '</ol>'
  },
  {
    latex: '\\begin{enumerate}\\setcounter{enumi}{35}\n' +
      '\\item Test\n' +
      '\\end{enumerate}',
    html:
      '<ol class="enumerate decimal" style="list-style-type: decimal">' +
        '<li value="36" class="li_enumerate">' +
          'Test' +
        '</li>' +
      '</ol>'
  },
  {
    latex: '\\begin{enumerate}\\setcounter{enumi}{-1}\n' +
      '  \\item Test\n' +
      '\\end{enumerate}',
    html:
      '<ol class="enumerate decimal" style="list-style-type: decimal">' +
        '<li value="0" class="li_enumerate">' +
          'Test' +
        '</li>' +
      '</ol>'
  },
  {
    latex: '\\begin{itemize}\n' +
      '\\item[] - testing 1\n' +
      '\n' +
      '\\item[] - \\textbf{ \\textit{How did this financial product perform compared with the reference benchmark?}}\n' +
      '\\begin{center}\n' +
      '\n' +
      '\\begin{tabular}{|l|l|l|}\n' +
      '\\hline \\textbf{Share Class} & \\textbf{Fund Performance } & \\textbf{Reference} \\\\\n' +
      '\\hline USD Accumulating & 23.87 & 23.75 \\\\\n' +
      '\\hline USD Distributing & 23.87 & 23.75 \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{center}\n' +
      '\n' +
      '\\item[] - testing 2\n' +
      '\\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '- testing 1' +
        '</li>' +
        '<li class="li_itemize block" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '<div>' +
          '- <strong><em>How did this financial product perform compared with the reference benchmark?</em></strong>' +
          '</div>\n' +
          '<div class="center" style="text-align: center">\n' +
            '<div class="table_tabular" style="text-align: center">\n' +
              '<div class="inline-tabular">' +
              '<table class="tabular">\n' +
                '<tbody>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Share Class</strong></td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Fund Performance</strong></td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Reference</strong></td>\n' +
                  '</tr>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">USD Accumulating</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.87</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.75</td>\n' +
                  '</tr>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">USD Distributing</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.87</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.75</td>\n' +
                  '</tr>\n' +
                '</tbody>\n' +
              '</table>\n' +
              '</div>' +
            '</div>\n' +
          '</div>\n' +
        '</li>' +
        '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '- testing 2' +
        '</li>' +
      '</ul>'
  },
  {
    latex: '\\begin{itemize}\n' +
      '\\item[] - testing 1\n' +
      '\n' +
      '\\item[] > \\textbf{ \\textit{How did this financial product perform compared with the reference benchmark?}}\n' +
      '\\begin{center}\n' +
      '\n' +
      '\\begin{tabular}{|l|l|l|}\n' +
      '\\hline \\textbf{Share Class} & \\textbf{Fund Performance } & \\textbf{Reference} \\\\\n' +
      '\\hline USD Accumulating & 23.87 & 23.75 \\\\\n' +
      '\\hline USD Distributing & 23.87 & 23.75 \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{center}\n' +
      '\n' +
      '\\item[] - testing 2\n' +
      '\\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '- testing 1' +
        '</li>' +
        '<li class="li_itemize block" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '<div>&gt; <strong><em>How did this financial product perform compared with the reference benchmark?</em></strong></div>\n' +
          '<div class="center" style="text-align: center">\n' +
            '<div class="table_tabular" style="text-align: center">\n' +
              '<div class="inline-tabular">' +
                '<table class="tabular">\n' +
                  '<tbody>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Share Class</strong></td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Fund Performance</strong></td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Reference</strong></td>\n' +
                  '</tr>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">USD Accumulating</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.87</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.75</td>\n' +
                  '</tr>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">USD Distributing</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.87</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.75</td>\n' +
                  '</tr>\n' +
                  '</tbody>\n' +
                '</table>\n' +
              '</div>' +
            '</div>\n' +
          '</div>\n' +
        '</li>' +
        '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '- testing 2' +
        '</li>' +
      '</ul>'
  },
  {
    latex: '\\begin{itemize}\n' +
      '\\item[] - testing 1\n' +
      '\n' +
      '\\item[] # \\textbf{ \\textit{How did this financial product perform compared with the reference benchmark?}}\n' +
      '\\begin{center}\n' +
      '\n' +
      '\\begin{tabular}{|l|l|l|}\n' +
      '\\hline \\textbf{Share Class} & \\textbf{Fund Performance } & \\textbf{Reference} \\\\\n' +
      '\\hline USD Accumulating & 23.87 & 23.75 \\\\\n' +
      '\\hline USD Distributing & 23.87 & 23.75 \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{center}\n' +
      '\n' +
      '\\item[] - testing 2\n' +
      '\\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '- testing 1' +
        '</li>' +
        '<li class="li_itemize block" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '<div># <strong><em>How did this financial product perform compared with the reference benchmark?</em></strong></div>\n' +
          '<div class="center" style="text-align: center">\n' +
            '<div class="table_tabular" style="text-align: center">\n' +
              '<div class="inline-tabular">' +
                '<table class="tabular">\n' +
                  '<tbody>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Share Class</strong></td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Fund Performance</strong></td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Reference</strong></td>\n' +
                  '</tr>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">USD Accumulating</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.87</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.75</td>\n' +
                  '</tr>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">USD Distributing</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.87</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.75</td>\n' +
                  '</tr>\n' +
                  '</tbody>\n' +
                '</table>\n' +
              '</div>' +
            '</div>\n' +
          '</div>\n' +
        '</li>' +
        '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '- testing 2' +
        '</li>' +
      '</ul>'
  },
  {
    latex: '\\begin{itemize}\n' +
      '\\item[] - testing 1\n' +
      '\n' +
      '\\item[] ~~~ \\textbf{ \\textit{How did this financial product perform compared with the reference benchmark?}}\n' +
      '\\begin{center}\n' +
      '\n' +
      '\\begin{tabular}{|l|l|l|}\n' +
      '\\hline \\textbf{Share Class} & \\textbf{Fund Performance } & \\textbf{Reference} \\\\\n' +
      '\\hline USD Accumulating & 23.87 & 23.75 \\\\\n' +
      '\\hline USD Distributing & 23.87 & 23.75 \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{center}\n' +
      '\n' +
      '\\item[] - testing 2\n' +
      '\\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '- testing 1' +
        '</li>' +
        '<li class="li_itemize block" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '<div>~~~ <strong><em>How did this financial product perform compared with the reference benchmark?</em></strong></div>\n' +
          '<div class="center" style="text-align: center">\n' +
            '<div class="table_tabular" style="text-align: center">\n' +
              '<div class="inline-tabular">' +
                '<table class="tabular">\n' +
                  '<tbody>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Share Class</strong></td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Fund Performance</strong></td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Reference</strong></td>\n' +
                  '</tr>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">USD Accumulating</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.87</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.75</td>\n' +
                  '</tr>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">USD Distributing</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.87</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.75</td>\n' +
                  '</tr>\n' +
                  '</tbody>\n' +
                '</table>\n' +
              '</div>' +
            '</div>\n' +
          '</div>\n' +
        '</li>' +
        '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '- testing 2' +
        '</li>' +
      '</ul>'
  },
  {
    latex: '\\begin{itemize}\n' +
      '\\item[] - testing 1\n' +
      '\n' +
      '\\item[] 1. \\textbf{ \\textit{How did this financial product perform compared with the reference benchmark?}}\n' +
      '\\begin{center}\n' +
      '\n' +
      '\\begin{tabular}{|l|l|l|}\n' +
      '\\hline \\textbf{Share Class} & \\textbf{Fund Performance } & \\textbf{Reference} \\\\\n' +
      '\\hline USD Accumulating & 23.87 & 23.75 \\\\\n' +
      '\\hline USD Distributing & 23.87 & 23.75 \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{center}\n' +
      '\n' +
      '\\item[] - testing 2\n' +
      '\\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '- testing 1' +
        '</li>' +
        '<li class="li_itemize block" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '<div>1. <strong><em>How did this financial product perform compared with the reference benchmark?</em></strong></div>\n' +
          '<div class="center" style="text-align: center">\n' +
            '<div class="table_tabular" style="text-align: center">\n' +
              '<div class="inline-tabular">' +
                '<table class="tabular">\n' +
                  '<tbody>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Share Class</strong></td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Fund Performance</strong></td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Reference</strong></td>\n' +
                  '</tr>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">USD Accumulating</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.87</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.75</td>\n' +
                  '</tr>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">USD Distributing</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.87</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.75</td>\n' +
                  '</tr>\n' +
                  '</tbody>\n' +
                '</table>\n' +
              '</div>' +
            '</div>\n' +
          '</div>\n' +
        '</li>' +
        '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '- testing 2' +
        '</li>' +
      '</ul>'
  },
  {
    latex: '\\begin{enumerate}\n' +
      '\\item[] - testing 1\n' +
      '\n' +
      '\\item[] - \\textbf{ \\textit{How did this financial product perform compared with the reference benchmark?}}\n' +
      '\\begin{center}\n' +
      '\n' +
      '\\begin{tabular}{|l|l|l|}\n' +
      '\\hline \\textbf{Share Class} & \\textbf{Fund Performance } & \\textbf{Reference} \\\\\n' +
      '\\hline USD Accumulating & 23.87 & 23.75 \\\\\n' +
      '\\hline USD Distributing & 23.87 & 23.75 \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{center}\n' +
      '\n' +
      '\\item[] - testing 2\n' +
      '\\end{enumerate}',
    html:
      '<ol class="enumerate decimal" style="list-style-type: decimal">' +
        '<li class="li_enumerate not_number" data-custom-marker="true" data-marker-empty="true" style="display: block">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '- testing 1' +
        '</li>' +
        '<li class="li_enumerate not_number" data-custom-marker="true" data-marker-empty="true" style="display: block">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '<div>- <strong><em>How did this financial product perform compared with the reference benchmark?</em></strong></div>\n' +
          '<div class="center" style="text-align: center">\n' +
            '<div class="table_tabular" style="text-align: center">\n' +
              '<div class="inline-tabular">' +
                '<table class="tabular">\n' +
                  '<tbody>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Share Class</strong></td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Fund Performance</strong></td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Reference</strong></td>\n' +
                  '</tr>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">USD Accumulating</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.87</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.75</td>\n' +
                  '</tr>\n' +
                  '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                  '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">USD Distributing</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.87</td>\n' +
                  '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.75</td>\n' +
                  '</tr>\n' +
                  '</tbody>\n' +
                '</table>\n' +
              '</div>' +
            '</div>\n' +
          '</div>\n' +
        '</li>' +
        '<li class="li_enumerate not_number" data-custom-marker="true" data-marker-empty="true" style="display: block">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '- testing 2' +
        '</li>' +
      '</ol>'
  },
  {
    latex: '\\begin{itemize}\n' +
      '\\begin{itemize}\n' +
      '\\begin{itemize}\n' +
      '\\item[] - Purpose: to test cause and effect relationships (condition x causes outcome y)\n' +
      '\\item[] - Tested through experiments (include independent and dependent variables)\n' +
      '\\item[] - Goal: to determine how changes in x cause changes in y\n' +
      '\\item[] - Must contain a control group (ex. people who are not hungry, a tip jar that has not been salted/already filled)\n' +
      '\\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
          '<ul class="itemize" style="list-style-type: none">' +
            '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
              '<ul class="itemize" style="list-style-type: none">' +
                '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
                  '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
                  '- Purpose: to test cause and effect relationships (condition x causes outcome y)' +
                '</li>' +
                '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
                  '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
                  '- Tested through experiments (include independent and dependent variables)' +
                '</li>' +
                '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
                  '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
                  '- Goal: to determine how changes in x cause changes in y' +
                '</li>' +
                '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
                  '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
                  '- Must contain a control group (ex. people who are not hungry, a tip jar that has not been salted/already filled)' +
                '</li>' +
              '</ul>' +
            '</li>' +
          '</ul>' +
        '</li>' +
      '</ul>'
  },
  {
    latex: '\\begin{enumerate}\n' +
      '\\begin{itemize}\n' +
      '\\begin{itemize}\n' +
      '\\item[] - Item 1\n' +
      '\\item[] - Item 2\n' +
      '\\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\end{enumerate}',
    html:
      '<ol class="enumerate decimal" style="list-style-type: decimal">' +
        '<li class="li_enumerate not_number" data-custom-marker="true" data-marker-empty="true" style="display: block">' +
          '<ul class="itemize" style="list-style-type: none">' +
            '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
              '<ul class="itemize" style="list-style-type: none">' +
                '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
                  '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
                  '- Item 1' +
                '</li>' +
                '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
                  '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
                  '- Item 2' +
                '</li>' +
              '</ul>' +
            '</li>' +
          '</ul>' +
        '</li>' +
      '</ol>'
  },
  {
    latex: '\\begin{itemize}\n' +
      '\\begin{enumerate}\n' +
      '\\begin{enumerate}\n' +
      '\\item[] - Item 1\n' +
      '\\item[] - Item 2\n' +
      '\\end{enumerate}\n' +
      '\\end{enumerate}\n' +
      '\\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
          '<ol class="enumerate decimal" style="list-style-type: decimal">' +
            '<li class="li_enumerate not_number" data-custom-marker="true" data-marker-empty="true" style="display: block">' +
              '<ol class="enumerate lower-alpha" style="list-style-type: lower-alpha">' +
                '<li class="li_enumerate not_number" data-custom-marker="true" data-marker-empty="true" style="display: block">' +
                  '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
                  '- Item 1' +
                '</li>' +
                '<li class="li_enumerate not_number" data-custom-marker="true" data-marker-empty="true" style="display: block">' +
                  '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
                  '- Item 2' +
                '</li>' +
              '</ol>' +
            '</li>' +
          '</ol>' +
        '</li>' +
      '</ul>'
  },
  {
    latex: '\\begin{itemize}\n' +
      '\\item[] 1. The toggle bit for some process \\(q\\) is unchanged between the two snapshots taken by \\(p\\). Since the bit is toggled with each update, this means that an even number of updates to \\(q^{\\prime}s\\) segment occurred during the interval between \\(p\\)’s writes. If this even number is 0, we are happy: no updates means no call to tryHandshake by \\(q\\), which means we don\'t see any change in \\(q\\)’s segment, which is good, because there wasn’t any. If this even number is 2 or more, then we observe that each of these events precedes the following one:\n' +
      '\\begin{itemize}\n' +
      '\\item[] - \\(p\\)’s call to tryHandshake.\n' +
      '\\item[] - \\(p\\)’s first read.\n' +
      '\\item[] - \\(q\\)’s first write.\n' +
      '\\item[] - \\(q\\)’s call to tryHandshake at the start of its second scan.\n' +
      '\\item[] - \\(q\\)’s second write.\n' +
      '\\item[] - \\(p\\)’s second read.\n' +
      '\\item[] - \\(p\\)’s call to checkHandshake.\n' +
      '\\end{itemize}\n' +
      'It follows that \\(q\\) both reads and writes the handshake bits in between \\(p\\)’s calls to tryHandshake and checkHandshake, so \\(p\\) correctly sees that \\(q\\) has updated its segment.\n' +
      '\\item[] 2. The toggle bit for \\(q\\) has changed. Then \\(q\\) did an odd number of updates (i.e., at least one), and \\(p\\) correctly detects this fact.\n' +
      '\\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '1. The toggle bit for some process <span class="math-inline " data-overflow="visible">\n' +
          '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.041ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 460 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45E" d="M33 157Q33 258 109 349T280 441Q340 441 372 389Q373 390 377 395T388 406T404 418Q438 442 450 442Q454 442 457 439T460 434Q460 425 391 149Q320 -135 320 -139Q320 -147 365 -148H390Q396 -156 396 -157T393 -175Q389 -188 383 -194H370Q339 -192 262 -192Q234 -192 211 -192T174 -192T157 -193Q143 -193 143 -185Q143 -182 145 -170Q149 -154 152 -151T172 -148Q220 -148 230 -141Q238 -136 258 -53T279 32Q279 33 272 29Q224 -10 172 -10Q117 -10 75 30T33 157ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g></g></g></svg></mjx-container></span>' +
          ' is unchanged between the two snapshots taken by <span class="math-inline " data-overflow="visible">\n' +
          '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.138ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 503 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45D" d="M23 287Q24 290 25 295T30 317T40 348T55 381T75 411T101 433T134 442Q209 442 230 378L240 387Q302 442 358 442Q423 442 460 395T497 281Q497 173 421 82T249 -10Q227 -10 210 -4Q199 1 187 11T168 28L161 36Q160 35 139 -51T118 -138Q118 -144 126 -145T163 -148H188Q194 -155 194 -157T191 -175Q188 -187 185 -190T172 -194Q170 -194 161 -194T127 -193T65 -192Q-5 -192 -24 -194H-32Q-39 -187 -39 -183Q-37 -156 -26 -148H-6Q28 -147 33 -136Q36 -130 94 103T155 350Q156 355 156 364Q156 405 131 405Q109 405 94 377T71 316T59 280Q57 278 43 278H29Q23 284 23 287ZM178 102Q200 26 252 26Q282 26 310 49T356 107Q374 141 392 215T411 325V331Q411 405 350 405Q339 405 328 402T306 393T286 380T269 365T254 350T243 336T235 326L232 322Q232 321 229 308T218 264T204 212Q178 106 178 102Z"></path></g></g></g></svg></mjx-container></span>. Since the bit is toggled with each update, this means that an even number of updates to <span class="math-inline ">\n' +
          '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="2.844ex" height="2.156ex" role="img" focusable="false" viewBox="0 -759 1257.2 953"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="msup"><g data-mml-node="mi"><path data-c="1D45E" d="M33 157Q33 258 109 349T280 441Q340 441 372 389Q373 390 377 395T388 406T404 418Q438 442 450 442Q454 442 457 439T460 434Q460 425 391 149Q320 -135 320 -139Q320 -147 365 -148H390Q396 -156 396 -157T393 -175Q389 -188 383 -194H370Q339 -192 262 -192Q234 -192 211 -192T174 -192T157 -193Q143 -193 143 -185Q143 -182 145 -170Q149 -154 152 -151T172 -148Q220 -148 230 -141Q238 -136 258 -53T279 32Q279 33 272 29Q224 -10 172 -10Q117 -10 75 30T33 157ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g><g data-mml-node="TeXAtom" transform="translate(543.7,363) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mi"><path data-c="2032" d="M79 43Q73 43 52 49T30 61Q30 68 85 293T146 528Q161 560 198 560Q218 560 240 545T262 501Q262 496 260 486Q259 479 173 263T84 45T79 43Z"></path></g></g></g><g data-mml-node="mi" transform="translate(788.2,0)"><path data-c="1D460" d="M131 289Q131 321 147 354T203 415T300 442Q362 442 390 415T419 355Q419 323 402 308T364 292Q351 292 340 300T328 326Q328 342 337 354T354 372T367 378Q368 378 368 379Q368 382 361 388T336 399T297 405Q249 405 227 379T204 326Q204 301 223 291T278 274T330 259Q396 230 396 163Q396 135 385 107T352 51T289 7T195 -10Q118 -10 86 19T53 87Q53 126 74 143T118 160Q133 160 146 151T160 120Q160 94 142 76T111 58Q109 57 108 57T107 55Q108 52 115 47T146 34T201 27Q237 27 263 38T301 66T318 97T323 122Q323 150 302 164T254 181T195 196T148 231Q131 256 131 289Z"></path></g></g></g></svg></mjx-container></span> segment occurred during the interval between <span class="math-inline " data-overflow="visible">\n' +
          '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.138ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 503 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45D" d="M23 287Q24 290 25 295T30 317T40 348T55 381T75 411T101 433T134 442Q209 442 230 378L240 387Q302 442 358 442Q423 442 460 395T497 281Q497 173 421 82T249 -10Q227 -10 210 -4Q199 1 187 11T168 28L161 36Q160 35 139 -51T118 -138Q118 -144 126 -145T163 -148H188Q194 -155 194 -157T191 -175Q188 -187 185 -190T172 -194Q170 -194 161 -194T127 -193T65 -192Q-5 -192 -24 -194H-32Q-39 -187 -39 -183Q-37 -156 -26 -148H-6Q28 -147 33 -136Q36 -130 94 103T155 350Q156 355 156 364Q156 405 131 405Q109 405 94 377T71 316T59 280Q57 278 43 278H29Q23 284 23 287ZM178 102Q200 26 252 26Q282 26 310 49T356 107Q374 141 392 215T411 325V331Q411 405 350 405Q339 405 328 402T306 393T286 380T269 365T254 350T243 336T235 326L232 322Q232 321 229 308T218 264T204 212Q178 106 178 102Z"></path></g></g></g></svg></mjx-container></span>’s writes. If this even number is 0, we are happy: no updates means no call to tryHandshake by <span class="math-inline " data-overflow="visible">\n' +
          '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.041ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 460 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45E" d="M33 157Q33 258 109 349T280 441Q340 441 372 389Q373 390 377 395T388 406T404 418Q438 442 450 442Q454 442 457 439T460 434Q460 425 391 149Q320 -135 320 -139Q320 -147 365 -148H390Q396 -156 396 -157T393 -175Q389 -188 383 -194H370Q339 -192 262 -192Q234 -192 211 -192T174 -192T157 -193Q143 -193 143 -185Q143 -182 145 -170Q149 -154 152 -151T172 -148Q220 -148 230 -141Q238 -136 258 -53T279 32Q279 33 272 29Q224 -10 172 -10Q117 -10 75 30T33 157ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g></g></g></svg></mjx-container></span>, which means we don’t see any change in <span class="math-inline " data-overflow="visible">\n' +
          '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.041ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 460 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45E" d="M33 157Q33 258 109 349T280 441Q340 441 372 389Q373 390 377 395T388 406T404 418Q438 442 450 442Q454 442 457 439T460 434Q460 425 391 149Q320 -135 320 -139Q320 -147 365 -148H390Q396 -156 396 -157T393 -175Q389 -188 383 -194H370Q339 -192 262 -192Q234 -192 211 -192T174 -192T157 -193Q143 -193 143 -185Q143 -182 145 -170Q149 -154 152 -151T172 -148Q220 -148 230 -141Q238 -136 258 -53T279 32Q279 33 272 29Q224 -10 172 -10Q117 -10 75 30T33 157ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g></g></g></svg></mjx-container></span>’s segment, which is good, because there wasn’t any. If this even number is 2 or more, then we observe that each of these events precedes the following one:' +
          '<ul class="itemize" style="list-style-type: none">' +
            '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
              '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
              '- <span class="math-inline " data-overflow="visible">\n' +
              '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.138ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 503 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45D" d="M23 287Q24 290 25 295T30 317T40 348T55 381T75 411T101 433T134 442Q209 442 230 378L240 387Q302 442 358 442Q423 442 460 395T497 281Q497 173 421 82T249 -10Q227 -10 210 -4Q199 1 187 11T168 28L161 36Q160 35 139 -51T118 -138Q118 -144 126 -145T163 -148H188Q194 -155 194 -157T191 -175Q188 -187 185 -190T172 -194Q170 -194 161 -194T127 -193T65 -192Q-5 -192 -24 -194H-32Q-39 -187 -39 -183Q-37 -156 -26 -148H-6Q28 -147 33 -136Q36 -130 94 103T155 350Q156 355 156 364Q156 405 131 405Q109 405 94 377T71 316T59 280Q57 278 43 278H29Q23 284 23 287ZM178 102Q200 26 252 26Q282 26 310 49T356 107Q374 141 392 215T411 325V331Q411 405 350 405Q339 405 328 402T306 393T286 380T269 365T254 350T243 336T235 326L232 322Q232 321 229 308T218 264T204 212Q178 106 178 102Z"></path></g></g></g></svg></mjx-container></span>’s call to tryHandshake.' +
            '</li>' +
            '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
              '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
              '- <span class="math-inline " data-overflow="visible">\n' +
              '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.138ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 503 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45D" d="M23 287Q24 290 25 295T30 317T40 348T55 381T75 411T101 433T134 442Q209 442 230 378L240 387Q302 442 358 442Q423 442 460 395T497 281Q497 173 421 82T249 -10Q227 -10 210 -4Q199 1 187 11T168 28L161 36Q160 35 139 -51T118 -138Q118 -144 126 -145T163 -148H188Q194 -155 194 -157T191 -175Q188 -187 185 -190T172 -194Q170 -194 161 -194T127 -193T65 -192Q-5 -192 -24 -194H-32Q-39 -187 -39 -183Q-37 -156 -26 -148H-6Q28 -147 33 -136Q36 -130 94 103T155 350Q156 355 156 364Q156 405 131 405Q109 405 94 377T71 316T59 280Q57 278 43 278H29Q23 284 23 287ZM178 102Q200 26 252 26Q282 26 310 49T356 107Q374 141 392 215T411 325V331Q411 405 350 405Q339 405 328 402T306 393T286 380T269 365T254 350T243 336T235 326L232 322Q232 321 229 308T218 264T204 212Q178 106 178 102Z"></path></g></g></g></svg></mjx-container></span>’s first read.' +
            '</li>' +
            '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
              '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
              '- <span class="math-inline " data-overflow="visible">\n' +
              '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.041ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 460 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45E" d="M33 157Q33 258 109 349T280 441Q340 441 372 389Q373 390 377 395T388 406T404 418Q438 442 450 442Q454 442 457 439T460 434Q460 425 391 149Q320 -135 320 -139Q320 -147 365 -148H390Q396 -156 396 -157T393 -175Q389 -188 383 -194H370Q339 -192 262 -192Q234 -192 211 -192T174 -192T157 -193Q143 -193 143 -185Q143 -182 145 -170Q149 -154 152 -151T172 -148Q220 -148 230 -141Q238 -136 258 -53T279 32Q279 33 272 29Q224 -10 172 -10Q117 -10 75 30T33 157ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g></g></g></svg></mjx-container></span>’s first write.' +
            '</li>' +
            '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
              '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
              '- <span class="math-inline " data-overflow="visible">\n' +
              '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.041ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 460 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45E" d="M33 157Q33 258 109 349T280 441Q340 441 372 389Q373 390 377 395T388 406T404 418Q438 442 450 442Q454 442 457 439T460 434Q460 425 391 149Q320 -135 320 -139Q320 -147 365 -148H390Q396 -156 396 -157T393 -175Q389 -188 383 -194H370Q339 -192 262 -192Q234 -192 211 -192T174 -192T157 -193Q143 -193 143 -185Q143 -182 145 -170Q149 -154 152 -151T172 -148Q220 -148 230 -141Q238 -136 258 -53T279 32Q279 33 272 29Q224 -10 172 -10Q117 -10 75 30T33 157ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g></g></g></svg></mjx-container></span>’s call to tryHandshake at the start of its second scan.' +
            '</li>' +
              '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
              '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
              '- <span class="math-inline " data-overflow="visible">\n' +
            '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.041ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 460 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45E" d="M33 157Q33 258 109 349T280 441Q340 441 372 389Q373 390 377 395T388 406T404 418Q438 442 450 442Q454 442 457 439T460 434Q460 425 391 149Q320 -135 320 -139Q320 -147 365 -148H390Q396 -156 396 -157T393 -175Q389 -188 383 -194H370Q339 -192 262 -192Q234 -192 211 -192T174 -192T157 -193Q143 -193 143 -185Q143 -182 145 -170Q149 -154 152 -151T172 -148Q220 -148 230 -141Q238 -136 258 -53T279 32Q279 33 272 29Q224 -10 172 -10Q117 -10 75 30T33 157ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g></g></g></svg></mjx-container></span>’s second write.' +
            '</li>' +
            '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
              '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
              '- <span class="math-inline " data-overflow="visible">\n' +
              '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.138ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 503 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45D" d="M23 287Q24 290 25 295T30 317T40 348T55 381T75 411T101 433T134 442Q209 442 230 378L240 387Q302 442 358 442Q423 442 460 395T497 281Q497 173 421 82T249 -10Q227 -10 210 -4Q199 1 187 11T168 28L161 36Q160 35 139 -51T118 -138Q118 -144 126 -145T163 -148H188Q194 -155 194 -157T191 -175Q188 -187 185 -190T172 -194Q170 -194 161 -194T127 -193T65 -192Q-5 -192 -24 -194H-32Q-39 -187 -39 -183Q-37 -156 -26 -148H-6Q28 -147 33 -136Q36 -130 94 103T155 350Q156 355 156 364Q156 405 131 405Q109 405 94 377T71 316T59 280Q57 278 43 278H29Q23 284 23 287ZM178 102Q200 26 252 26Q282 26 310 49T356 107Q374 141 392 215T411 325V331Q411 405 350 405Q339 405 328 402T306 393T286 380T269 365T254 350T243 336T235 326L232 322Q232 321 229 308T218 264T204 212Q178 106 178 102Z"></path></g></g></g></svg></mjx-container></span>’s second read.' +
            '</li>' +
            '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
              '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
              '- <span class="math-inline " data-overflow="visible">\n' +
              '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.138ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 503 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45D" d="M23 287Q24 290 25 295T30 317T40 348T55 381T75 411T101 433T134 442Q209 442 230 378L240 387Q302 442 358 442Q423 442 460 395T497 281Q497 173 421 82T249 -10Q227 -10 210 -4Q199 1 187 11T168 28L161 36Q160 35 139 -51T118 -138Q118 -144 126 -145T163 -148H188Q194 -155 194 -157T191 -175Q188 -187 185 -190T172 -194Q170 -194 161 -194T127 -193T65 -192Q-5 -192 -24 -194H-32Q-39 -187 -39 -183Q-37 -156 -26 -148H-6Q28 -147 33 -136Q36 -130 94 103T155 350Q156 355 156 364Q156 405 131 405Q109 405 94 377T71 316T59 280Q57 278 43 278H29Q23 284 23 287ZM178 102Q200 26 252 26Q282 26 310 49T356 107Q374 141 392 215T411 325V331Q411 405 350 405Q339 405 328 402T306 393T286 380T269 365T254 350T243 336T235 326L232 322Q232 321 229 308T218 264T204 212Q178 106 178 102Z"></path></g></g></g></svg></mjx-container></span>’s call to checkHandshake.' +
            '</li>' +
          '</ul>' +
          'It follows that <span class="math-inline " data-overflow="visible">\n' +
          '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.041ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 460 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45E" d="M33 157Q33 258 109 349T280 441Q340 441 372 389Q373 390 377 395T388 406T404 418Q438 442 450 442Q454 442 457 439T460 434Q460 425 391 149Q320 -135 320 -139Q320 -147 365 -148H390Q396 -156 396 -157T393 -175Q389 -188 383 -194H370Q339 -192 262 -192Q234 -192 211 -192T174 -192T157 -193Q143 -193 143 -185Q143 -182 145 -170Q149 -154 152 -151T172 -148Q220 -148 230 -141Q238 -136 258 -53T279 32Q279 33 272 29Q224 -10 172 -10Q117 -10 75 30T33 157ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g></g></g></svg></mjx-container></span> both reads and writes the handshake bits in between <span class="math-inline " data-overflow="visible">\n' +
          '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.138ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 503 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45D" d="M23 287Q24 290 25 295T30 317T40 348T55 381T75 411T101 433T134 442Q209 442 230 378L240 387Q302 442 358 442Q423 442 460 395T497 281Q497 173 421 82T249 -10Q227 -10 210 -4Q199 1 187 11T168 28L161 36Q160 35 139 -51T118 -138Q118 -144 126 -145T163 -148H188Q194 -155 194 -157T191 -175Q188 -187 185 -190T172 -194Q170 -194 161 -194T127 -193T65 -192Q-5 -192 -24 -194H-32Q-39 -187 -39 -183Q-37 -156 -26 -148H-6Q28 -147 33 -136Q36 -130 94 103T155 350Q156 355 156 364Q156 405 131 405Q109 405 94 377T71 316T59 280Q57 278 43 278H29Q23 284 23 287ZM178 102Q200 26 252 26Q282 26 310 49T356 107Q374 141 392 215T411 325V331Q411 405 350 405Q339 405 328 402T306 393T286 380T269 365T254 350T243 336T235 326L232 322Q232 321 229 308T218 264T204 212Q178 106 178 102Z"></path></g></g></g></svg></mjx-container></span>’s calls to tryHandshake and checkHandshake, so <span class="math-inline " data-overflow="visible">\n' +
          '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.138ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 503 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45D" d="M23 287Q24 290 25 295T30 317T40 348T55 381T75 411T101 433T134 442Q209 442 230 378L240 387Q302 442 358 442Q423 442 460 395T497 281Q497 173 421 82T249 -10Q227 -10 210 -4Q199 1 187 11T168 28L161 36Q160 35 139 -51T118 -138Q118 -144 126 -145T163 -148H188Q194 -155 194 -157T191 -175Q188 -187 185 -190T172 -194Q170 -194 161 -194T127 -193T65 -192Q-5 -192 -24 -194H-32Q-39 -187 -39 -183Q-37 -156 -26 -148H-6Q28 -147 33 -136Q36 -130 94 103T155 350Q156 355 156 364Q156 405 131 405Q109 405 94 377T71 316T59 280Q57 278 43 278H29Q23 284 23 287ZM178 102Q200 26 252 26Q282 26 310 49T356 107Q374 141 392 215T411 325V331Q411 405 350 405Q339 405 328 402T306 393T286 380T269 365T254 350T243 336T235 326L232 322Q232 321 229 308T218 264T204 212Q178 106 178 102Z"></path></g></g></g></svg></mjx-container></span> correctly sees that <span class="math-inline " data-overflow="visible">\n' +
          '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.041ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 460 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45E" d="M33 157Q33 258 109 349T280 441Q340 441 372 389Q373 390 377 395T388 406T404 418Q438 442 450 442Q454 442 457 439T460 434Q460 425 391 149Q320 -135 320 -139Q320 -147 365 -148H390Q396 -156 396 -157T393 -175Q389 -188 383 -194H370Q339 -192 262 -192Q234 -192 211 -192T174 -192T157 -193Q143 -193 143 -185Q143 -182 145 -170Q149 -154 152 -151T172 -148Q220 -148 230 -141Q238 -136 258 -53T279 32Q279 33 272 29Q224 -10 172 -10Q117 -10 75 30T33 157ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g></g></g></svg></mjx-container></span> has updated its segment.' +
        '</li>' +
        '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '2. The toggle bit for <span class="math-inline " data-overflow="visible">\n' +
          '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.041ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 460 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45E" d="M33 157Q33 258 109 349T280 441Q340 441 372 389Q373 390 377 395T388 406T404 418Q438 442 450 442Q454 442 457 439T460 434Q460 425 391 149Q320 -135 320 -139Q320 -147 365 -148H390Q396 -156 396 -157T393 -175Q389 -188 383 -194H370Q339 -192 262 -192Q234 -192 211 -192T174 -192T157 -193Q143 -193 143 -185Q143 -182 145 -170Q149 -154 152 -151T172 -148Q220 -148 230 -141Q238 -136 258 -53T279 32Q279 33 272 29Q224 -10 172 -10Q117 -10 75 30T33 157ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g></g></g></svg></mjx-container></span> has changed. Then <span class="math-inline " data-overflow="visible">\n' +
          '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.041ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 460 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45E" d="M33 157Q33 258 109 349T280 441Q340 441 372 389Q373 390 377 395T388 406T404 418Q438 442 450 442Q454 442 457 439T460 434Q460 425 391 149Q320 -135 320 -139Q320 -147 365 -148H390Q396 -156 396 -157T393 -175Q389 -188 383 -194H370Q339 -192 262 -192Q234 -192 211 -192T174 -192T157 -193Q143 -193 143 -185Q143 -182 145 -170Q149 -154 152 -151T172 -148Q220 -148 230 -141Q238 -136 258 -53T279 32Q279 33 272 29Q224 -10 172 -10Q117 -10 75 30T33 157ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g></g></g></svg></mjx-container></span> did an odd number of updates (i.e., at least one), and <span class="math-inline " data-overflow="visible">\n' +
          '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex;" xmlns="http://www.w3.org/2000/svg" width="1.138ex" height="1.439ex" role="img" focusable="false" viewBox="0 -442 503 636"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D45D" d="M23 287Q24 290 25 295T30 317T40 348T55 381T75 411T101 433T134 442Q209 442 230 378L240 387Q302 442 358 442Q423 442 460 395T497 281Q497 173 421 82T249 -10Q227 -10 210 -4Q199 1 187 11T168 28L161 36Q160 35 139 -51T118 -138Q118 -144 126 -145T163 -148H188Q194 -155 194 -157T191 -175Q188 -187 185 -190T172 -194Q170 -194 161 -194T127 -193T65 -192Q-5 -192 -24 -194H-32Q-39 -187 -39 -183Q-37 -156 -26 -148H-6Q28 -147 33 -136Q36 -130 94 103T155 350Q156 355 156 364Q156 405 131 405Q109 405 94 377T71 316T59 280Q57 278 43 278H29Q23 284 23 287ZM178 102Q200 26 252 26Q282 26 310 49T356 107Q374 141 392 215T411 325V331Q411 405 350 405Q339 405 328 402T306 393T286 380T269 365T254 350T243 336T235 326L232 322Q232 321 229 308T218 264T204 212Q178 106 178 102Z"></path></g></g></g></svg></mjx-container></span> correctly detects this fact.' +
        '</li>' +
      '</ul>'
  },
  {
    latex: '\\begin{itemize}\n' +
      '\\item[] ○ \\textbf{Nominal GDP:} Measured using \\textbf{current year} prices.\n' +
      '\\item[] ○ Real GDP: Measured using base year prices; adjusted for inflation. It is the true measure of economic growth.\n' +
      '```\n' +
      '$$\\text{Real GDP} = \\frac{\\text{Nominal GDP}}{\\text{GDP Deflator}} \\times 100$$\n' +
      '```\n' +
      '\n' +
      '\\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '○ <strong>Nominal GDP:</strong> Measured using <strong>current year</strong> prices.' +
        '</li>' +
        '<li class="li_itemize block" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '<div>○ Real GDP: Measured using base year prices; adjusted for inflation. It is the true measure of economic growth.</div>\n' +
          '<pre>' +
            '<code class="hljs">$$\\text{Real GDP} = \\frac{\\text{Nominal GDP}}{\\text{GDP Deflator}} \\times 100$$\n' +
            '</code>' +
          '</pre>\n' +
        '</li>' +
      '</ul>'
  },
  {
    // Fenced code in itemize keeps the code indentation (was de-indented; lstlisting already worked).
    latex: "\\begin{itemize}\n\\item[] Recursion example:\n```\npublic int multByFive(int num)\n{\n    int result = 5;\n    if (num > 1)\n        result = 5 + multByFive(num - 1);\n    return result;\n}\n```\n\\item[] next item\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span><div>Recursion example:</div>\n<pre><code class=\"hljs\">public int multByFive(int num)\n{\n    int result = 5;\n    if (num &gt; 1)\n        result = 5 + multByFive(num - 1);\n    return result;\n}\n</code></pre>\n</li><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span>next item</li></ul>"
  },
  {
    // Fence with a language: keeps syntax highlighting and indentation.
    latex: "\\begin{itemize}\n\\item[] code:\n```java\npublic class A {\n    int x = 5;\n}\n```\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span><div>code:</div>\n<pre><code class=\"hljs language-java\"><span class=\"hljs-keyword\">public</span> <span class=\"hljs-keyword\">class</span> <span class=\"hljs-title class_\">A</span> {\n    <span class=\"hljs-type\">int</span> <span class=\"hljs-variable\">x</span> <span class=\"hljs-operator\">=</span> <span class=\"hljs-number\">5</span>;\n}\n</code></pre>\n</li></ul>"
  },
  {
    // Consecutive fenced blocks in one item.
    latex: "\\begin{itemize}\n\\item[] two blocks:\n```\n    a = 1\n```\n```\n    b = 2\n```\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span><div>two blocks:</div>\n<pre><code class=\"hljs\">    a = 1\n</code></pre>\n<pre><code class=\"hljs\">    b = 2\n</code></pre>\n</li></ul>"
  },
  {
    // Blank line inside a fenced block is preserved.
    latex: "\\begin{itemize}\n\\item[] with blank line:\n```\nline 1\n\n    line 3\n```\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span><div>with blank line:</div>\n<pre><code class=\"hljs\">line 1\n\n    line 3\n</code></pre>\n</li></ul>"
  },
  {
    // Tilde (~~~) fence: same handling as backticks.
    latex: "\\begin{itemize}\n\\item[] t:\n~~~\n    indented\n~~~\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span><div>t:</div>\n<pre><code class=\"hljs\">    indented\n</code></pre>\n</li></ul>"
  },
  {
    // Unclosed fence: it never closes, so ``` is treated as ordinary content and the list still renders (items intact).
    latex: "\\begin{itemize}\n\\item[] intro\n```\n    code\n\\item[] after\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span><div>intro</div>\n<pre><code class=\"hljs\">code</code></pre>\n</li><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span>after</li></ul>"
  },
  {
    // Marker collision: \item / \end{itemize} inside a fence stay literal; list closes on the real \end after the fence.
    latex: "\\begin{itemize}\n\\item[] a\n```\n\\item[] not an item\n\\end{itemize} literal\n```\n\\item[] real\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span><div>a</div>\n<pre><code class=\"hljs\">\\item[] not an item\n\\end{itemize} literal\n</code></pre>\n</li><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span>real</li></ul>"
  },
  {
    // Fence inside \begin{enumerate}: numbering kept, code indentation preserved.
    latex: "\\begin{enumerate}\n\\item[] first\n```\n    code\n```\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate not_number\" data-custom-marker=\"true\" data-marker-empty=\"true\" style=\"display: block\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span><div>first</div>\n<pre><code class=\"hljs\">    code\n</code></pre>\n</li></ol>"
  },
  {
    // Fence closed by a longer marker (open ```, close ````).
    latex: "\\begin{itemize}\n\\item[] x\n```\n    code\n````\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span><div>x</div>\n<pre><code class=\"hljs\">    code\n</code></pre>\n</li></ul>"
  },
  {
    // Fence before the first \item (no preceding item): list still renders, no crash.
    latex: "\\begin{itemize}\n```\n    code\n```\n\\item[] first\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><code>    code</code></li><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span>first</li></ul>"
  },
  {
    // Long custom markers must widen the list even when every long-marker item holds
    // block content: block items skip the inline path, so the marker is measured there too.
    latex: "\\begin{itemize}\n\\item[11.33] a\n```\n    code1\n```\n\\item[11.34] b\n```\n    code2\n```\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"3.51em\" class=\"itemize\" style=\"padding-inline-start: 3.51em; list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">11.33</span><div>a</div>\n<pre><code class=\"hljs\">    code1\n</code></pre>\n</li><li class=\"li_itemize block\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">11.34</span><div>b</div>\n<pre><code class=\"hljs\">    code2\n</code></pre>\n</li></ul>"
  },
  {
    // Same regression with \begin{figure} items (the originally reported case): every
    // long-marker item holds a block env, yet the list must still get padding.
    latex: "\\begin{itemize}\n\\item[11.33] a\n\\begin{figure}\n\\includegraphics[alt={Alternative, text},max width=\\textwidth]{https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&width=197&top_left_y=918&top_left_x=694}\n\\captionsetup{labelformat=empty}\n\\caption{Fig. 11-20}\n\\end{figure}\n\\item[11.34] b\n\\begin{figure}\n\\includegraphics[alt={Alternative, text},max width=\\textwidth]{https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&width=197&top_left_y=918&top_left_x=694}\n\\captionsetup{labelformat=empty}\n\\caption{Fig. 11-21}\n\\end{figure}\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"3.51em\" class=\"itemize\" style=\"padding-inline-start: 3.51em; list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">11.33</span><div>a</div>\n<div class=\"table\" number=\"1\">\n<div class=\"figure_img\" style=\"text-align: center;\"><img src=\"https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&width=197&top_left_y=918&top_left_x=694\" alt=\"Alternative, text\" style=\"max-width: 100%;\"/></div><div class=\"caption_figure\">Fig. 11-20</div></div>\n</li><li class=\"li_itemize block\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">11.34</span><div>b</div>\n<div class=\"table\" number=\"2\">\n<div class=\"figure_img\" style=\"text-align: center;\"><img src=\"https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&width=197&top_left_y=918&top_left_x=694\" alt=\"Alternative, text\" style=\"max-width: 100%;\"/></div><div class=\"caption_figure\">Fig. 11-21</div></div>\n</li></ul>"
  },
  {
    // Fullwidth marker (`11．`, U+FF0E full stop) has raw .length 3 but display width 4,
    // so it must clear the padding threshold like its ASCII counterpart would.
    latex: "\\begin{itemize}\n\\item[I] Item 1．\n\\item[11．] Item 11．．\n\\item[I] Item 1．\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"3.07em\" class=\"itemize\" style=\"padding-inline-start: 3.07em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">I</span>Item 1．</li><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">11．</span>Item 11．．</li><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">I</span>Item 1．</li></ul>"
  },
  {
    // Unclosed itemize followed by a tabular must degrade to plain text (like the
    // no-tabular case) instead of a broken partial list. The aborted list parse
    // must not leak env.isBlock, which would otherwise wake the inline list
    // fallback and emit empty `<>` item bodies.
    latex: "\\begin{itemize}\n\\item[(d1)] Asad Ali Khan\n\\item[(d2)] Asad Ali Khan\n\\begin{tabular}{|l|l|}\ncell\n\\end{tabular}\n\\begin{itemize}",
    html: "<div>\\begin{itemize}<br>\n\\item[(d1)] Asad Ali Khan<br>\n\\item[(d2)] Asad Ali Khan</div>\n<div class=\"table_tabular\" style=\"text-align: center\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">cell</td>\n</tr>\n</tbody>\n</table>\n</div></div>\n<div>\\begin{itemize}</div>\n"
  },
  {
    // List after a paragraph (no blank line) with a multiline \footnotetext{} item
    // must still render as a list, not be swallowed as text by the footnotetext block.
    latex: "Intro paragraph text.\n\\begin{itemize}\n\\item[] \\footnotetext{\n1 A footnote note.\n}\n\\end{itemize}",
    html: "<div>Intro paragraph text.</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span></li></ul><hr class=\"footnotes-sep\">\n<section class=\"footnotes\" style=\"margin-bottom: 1em;\">\n<ol class=\"footnotes-list\" style=\"padding-left: 20px; margin-bottom: 0;\">\n<li id=\"fn1\" class=\"footnote-item\" style=\"list-style-type: none;\"><div><br>\n1 A footnote note.<br>\n</div>\n</li>\n</ol>\n</section>\n"
  },
  {
    // Same case with \footnote instead of \footnotetext.
    latex: "Intro paragraph text.\n\\begin{itemize}\n\\item[] \\footnote{\n1 A footnote note.\n}\n\\end{itemize}",
    html: "<div>Intro paragraph text.</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span><sup class=\"footnote-ref\"><a href=\"#fn1\" id=\"fnref1\">[1]</a></sup></li></ul><hr class=\"footnotes-sep\">\n<section class=\"footnotes\" style=\"margin-bottom: 1em;\">\n<ol class=\"footnotes-list\" style=\"margin-bottom: 0;\">\n<li id=\"fn1\" class=\"footnote-item\"><div><br>\n1 A footnote note.<br>\n <a href=\"#fnref1\" class=\"footnote-backref\">↩︎</a></div>\n</li>\n</ol>\n</section>\n"
  },
  {
    name: "marker: short math under threshold (no padding)",
    latex: "\\begin{itemize}\n\\item[$x^2$] a\n\\item[y] b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\"><span class=\"math-inline \">\n<mjx-container class=\"MathJax\" jax=\"SVG\"><svg style=\"vertical-align: -0.025ex;\" xmlns=\"http://www.w3.org/2000/svg\" width=\"2.282ex\" height=\"1.912ex\" role=\"img\" focusable=\"false\" viewBox=\"0 -833.9 1008.6 844.9\"><g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"scale(1,-1)\"><g data-mml-node=\"math\"><g data-mml-node=\"msup\"><g data-mml-node=\"mi\"><path data-c=\"1D465\" d=\"M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z\"></path></g><g data-mml-node=\"mn\" transform=\"translate(605,363) scale(0.707)\"><path data-c=\"32\" d=\"M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z\"></path></g></g></g></g></svg></mjx-container></span></span>a</li><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">y</span>b</li></ul>"
  },
  {
    name: "marker: wide math (widthEx)",
    latex: "\\begin{itemize}\n\\item[$x^4 + x^4$] a\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"4.43em\" class=\"itemize\" style=\"padding-inline-start: 4.43em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\"><span class=\"math-inline \">\n<mjx-container class=\"MathJax\" jax=\"SVG\"><svg style=\"vertical-align: -0.186ex;\" xmlns=\"http://www.w3.org/2000/svg\" width=\"7.329ex\" height=\"2.09ex\" role=\"img\" focusable=\"false\" viewBox=\"0 -841.7 3239.6 923.7\"><g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"scale(1,-1)\"><g data-mml-node=\"math\"><g data-mml-node=\"msup\"><g data-mml-node=\"mi\"><path data-c=\"1D465\" d=\"M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z\"></path></g><g data-mml-node=\"mn\" transform=\"translate(605,363) scale(0.707)\"><path data-c=\"34\" d=\"M462 0Q444 3 333 3Q217 3 199 0H190V46H221Q241 46 248 46T265 48T279 53T286 61Q287 63 287 115V165H28V211L179 442Q332 674 334 675Q336 677 355 677H373L379 671V211H471V165H379V114Q379 73 379 66T385 54Q393 47 442 46H471V0H462ZM293 211V545L74 212L183 211H293Z\"></path></g></g><g data-mml-node=\"mo\" transform=\"translate(1230.8,0)\"><path data-c=\"2B\" d=\"M56 237T56 250T70 270H369V420L370 570Q380 583 389 583Q402 583 409 568V270H707Q722 262 722 250T707 230H409V-68Q401 -82 391 -82H389H387Q375 -82 369 -68V230H70Q56 237 56 250Z\"></path></g><g data-mml-node=\"msup\" transform=\"translate(2231,0)\"><g data-mml-node=\"mi\"><path data-c=\"1D465\" d=\"M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z\"></path></g><g data-mml-node=\"mn\" transform=\"translate(605,363) scale(0.707)\"><path data-c=\"34\" d=\"M462 0Q444 3 333 3Q217 3 199 0H190V46H221Q241 46 248 46T265 48T279 53T286 61Q287 63 287 115V165H28V211L179 442Q332 674 334 675Q336 677 355 677H373L379 671V211H471V165H379V114Q379 73 379 66T385 54Q393 47 442 46H471V0H462ZM293 211V545L74 212L183 211H293Z\"></path></g></g></g></g></svg></mjx-container></span></span>a</li></ul>"
  },
  {
    name: "marker: wide math on block-content path",
    latex: "\\begin{itemize}\n\\item[$x^4 + x^4$] a\n\\begin{figure}\n\\caption{c}\n\\end{figure}\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"4.43em\" class=\"itemize\" style=\"padding-inline-start: 4.43em; list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\"><span class=\"math-inline \">\n<mjx-container class=\"MathJax\" jax=\"SVG\"><svg style=\"vertical-align: -0.186ex;\" xmlns=\"http://www.w3.org/2000/svg\" width=\"7.329ex\" height=\"2.09ex\" role=\"img\" focusable=\"false\" viewBox=\"0 -841.7 3239.6 923.7\"><g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"scale(1,-1)\"><g data-mml-node=\"math\"><g data-mml-node=\"msup\"><g data-mml-node=\"mi\"><path data-c=\"1D465\" d=\"M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z\"></path></g><g data-mml-node=\"mn\" transform=\"translate(605,363) scale(0.707)\"><path data-c=\"34\" d=\"M462 0Q444 3 333 3Q217 3 199 0H190V46H221Q241 46 248 46T265 48T279 53T286 61Q287 63 287 115V165H28V211L179 442Q332 674 334 675Q336 677 355 677H373L379 671V211H471V165H379V114Q379 73 379 66T385 54Q393 47 442 46H471V0H462ZM293 211V545L74 212L183 211H293Z\"></path></g></g><g data-mml-node=\"mo\" transform=\"translate(1230.8,0)\"><path data-c=\"2B\" d=\"M56 237T56 250T70 270H369V420L370 570Q380 583 389 583Q402 583 409 568V270H707Q722 262 722 250T707 230H409V-68Q401 -82 391 -82H389H387Q375 -82 369 -68V230H70Q56 237 56 250Z\"></path></g><g data-mml-node=\"msup\" transform=\"translate(2231,0)\"><g data-mml-node=\"mi\"><path data-c=\"1D465\" d=\"M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z\"></path></g><g data-mml-node=\"mn\" transform=\"translate(605,363) scale(0.707)\"><path data-c=\"34\" d=\"M462 0Q444 3 333 3Q217 3 199 0H190V46H221Q241 46 248 46T265 48T279 53T286 61Q287 63 287 115V165H28V211L179 442Q332 674 334 675Q336 677 355 677H373L379 671V211H471V165H379V114Q379 73 379 66T385 54Q393 47 442 46H471V0H462ZM293 211V545L74 212L183 211H293Z\"></path></g></g></g></g></svg></mjx-container></span></span><div>a</div>\n<div class=\"table\" number=\"1\">\n<div></div>\n<div class=\"caption_figure\">Figure 1: c</div></div>\n</li></ul>"
  },
  {
    name: "marker: edge whitespace trimmed",
    latex: "\\begin{itemize}\n\\item[  wide  ] a\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"3.17em\" class=\"itemize\" style=\"padding-inline-start: 3.17em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">wide</span>a</li></ul>"
  },
  {
    name: "marker: plain wide (control)",
    latex: "\\begin{itemize}\n\\item[wide] a\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"3.17em\" class=\"itemize\" style=\"padding-inline-start: 3.17em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">wide</span>a</li></ul>"
  },
  {
    name: "marker: bold \\textbf children",
    latex: "\\begin{itemize}\n\\item[\\textbf{x^4 + x^4}] a\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"5.77em\" class=\"itemize\" style=\"padding-inline-start: 5.77em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\"><strong>x^4 + x^4</strong></span>a</li></ul>"
  },
  {
    name: "marker: long plain",
    latex: "\\begin{itemize}\n\\item[longtext] a\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"4.93em\" class=\"itemize\" style=\"padding-inline-start: 4.93em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">longtext</span>a</li></ul>"
  },
  {
    name: "marker: wide capitals glyph class",
    latex: "\\begin{itemize}\n\\item[WWWWWWWW] a\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"9.43em\" class=\"itemize\" style=\"padding-inline-start: 9.43em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">WWWWWWWW</span>a</li></ul>"
  },
  {
    name: "marker: code-span",
    latex: "\\begin{itemize}\n\\item[`longtext`] a\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"5.59em\" class=\"itemize\" style=\"padding-inline-start: 5.59em; list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\"><code>longtext</code></span><div>a</div>\n</li></ul>"
  },
  {
    name: "marker: html-tag visible text only",
    latex: "\\begin{itemize}\n\\item[<b>longtext</b>] a\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"4.93em\" class=\"itemize\" style=\"padding-inline-start: 4.93em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\"><b>longtext</b></span>a</li></ul>"
  },
  {
    name: "marker: real long not clamped (22)",
    latex: "\\begin{itemize}\n\\item[aaaaaaaaaaaaaaaaaaaaaa] a\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"14.27em\" class=\"itemize\" style=\"padding-inline-start: 14.27em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">aaaaaaaaaaaaaaaaaaaaaa</span>a</li></ul>"
  },
  {
    name: "marker: pathological clamp (60)",
    latex: "\\begin{itemize}\n\\item[xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] a\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"20em\" class=\"itemize\" style=\"padding-inline-start: 20em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>a</li></ul>"
  },
  {
    name: "marker: mixed text+math",
    latex: "\\begin{itemize}\n\\item[abcd $x^4 + x^4$] a\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"7.31em\" class=\"itemize\" style=\"padding-inline-start: 7.31em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">abcd <span class=\"math-inline \">\n<mjx-container class=\"MathJax\" jax=\"SVG\"><svg style=\"vertical-align: -0.186ex;\" xmlns=\"http://www.w3.org/2000/svg\" width=\"7.329ex\" height=\"2.09ex\" role=\"img\" focusable=\"false\" viewBox=\"0 -841.7 3239.6 923.7\"><g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"scale(1,-1)\"><g data-mml-node=\"math\"><g data-mml-node=\"msup\"><g data-mml-node=\"mi\"><path data-c=\"1D465\" d=\"M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z\"></path></g><g data-mml-node=\"mn\" transform=\"translate(605,363) scale(0.707)\"><path data-c=\"34\" d=\"M462 0Q444 3 333 3Q217 3 199 0H190V46H221Q241 46 248 46T265 48T279 53T286 61Q287 63 287 115V165H28V211L179 442Q332 674 334 675Q336 677 355 677H373L379 671V211H471V165H379V114Q379 73 379 66T385 54Q393 47 442 46H471V0H462ZM293 211V545L74 212L183 211H293Z\"></path></g></g><g data-mml-node=\"mo\" transform=\"translate(1230.8,0)\"><path data-c=\"2B\" d=\"M56 237T56 250T70 270H369V420L370 570Q380 583 389 583Q402 583 409 568V270H707Q722 262 722 250T707 230H409V-68Q401 -82 391 -82H389H387Q375 -82 369 -68V230H70Q56 237 56 250Z\"></path></g><g data-mml-node=\"msup\" transform=\"translate(2231,0)\"><g data-mml-node=\"mi\"><path data-c=\"1D465\" d=\"M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z\"></path></g><g data-mml-node=\"mn\" transform=\"translate(605,363) scale(0.707)\"><path data-c=\"34\" d=\"M462 0Q444 3 333 3Q217 3 199 0H190V46H221Q241 46 248 46T265 48T279 53T286 61Q287 63 287 115V165H28V211L179 442Q332 674 334 675Q336 677 355 677H373L379 671V211H471V165H379V114Q379 73 379 66T385 54Q393 47 442 46H471V0H462ZM293 211V545L74 212L183 211H293Z\"></path></g></g></g></g></svg></mjx-container></span></span>a</li></ul>"
  },
  {
    name: "marker: plain abcd (control for mixed)",
    latex: "\\begin{itemize}\n\\item[abcd] a\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"3.11em\" class=\"itemize\" style=\"padding-inline-start: 3.11em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">abcd</span>a</li></ul>"
  },
  {
    // Emoji are East-Asian Wide, same as a BMP ideograph: 2×1.20+0.625 overflows the 2.5em default.
    name: "marker: astral emoji reserve the CJK width",
    latex: "\\begin{itemize}\n\\item[😀😀] a\n\\item[x] b\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"3.03em\" class=\"itemize\" style=\"padding-inline-start: 3.03em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">😀😀</span>a</li><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">x</span>b</li></ul>"
  },
  {
    name: "marker: short abc keeps default (no attribute)",
    latex: "\\begin{itemize}\n\\item[abc] a\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">abc</span>a</li></ul>"
  },
  {
    name: "B2: deep numbering all default",
    latex: "\\begin{itemize}\n\\item[1.] a\n\\item[2.] b\n\\begin{itemize}\n\\item[3.1] c\n\\begin{itemize}\n\\item[3.1.1.1] d\n\\item[3.1.1.2] e\n\\end{itemize}\n\\end{itemize}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">1.</span>a</li><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">2.</span>b<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">3.1</span>c<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">3.1.1.1</span>d</li><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">3.1.1.2</span>e</li></ul></li></ul></li></ul>"
  },
  {
    name: "B2: overflowing nested shortfall",
    latex: "\\begin{itemize}\n\\item[1.] a\n\\begin{itemize}\n\\item[XXXXXXXXXXXX] b\n\\end{itemize}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">1.</span>a<ul data-padding-inline-start=\"8.93em\" class=\"itemize\" style=\"padding-inline-start: 8.93em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">XXXXXXXXXXXX</span>b</li></ul></li></ul>"
  },
  {
    name: "B2: wider parent absorbs child",
    latex: "\\begin{itemize}\n\\item[11.33] a\n\\begin{itemize}\n\\item[XXXXX] b\n\\end{itemize}\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"3.51em\" class=\"itemize\" style=\"padding-inline-start: 3.51em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">11.33</span>a<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">XXXXX</span>b</li></ul></li></ul>"
  },
  {
    name: "B2: order A nested before wide parent",
    latex: "\\begin{itemize}\n\\item[a] x\n\\begin{itemize}\n\\item[LONGCHILD] y\n\\end{itemize}\n\\item[VERYLONGPARENT] z\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"13.23em\" class=\"itemize\" style=\"padding-inline-start: 13.23em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">a</span>x<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">LONGCHILD</span>y</li></ul></li><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">VERYLONGPARENT</span>z</li></ul>"
  },
  {
    name: "B2: order B wide parent before nested",
    latex: "\\begin{itemize}\n\\item[VERYLONGPARENT] z\n\\item[a] x\n\\begin{itemize}\n\\item[LONGCHILD] y\n\\end{itemize}\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"13.23em\" class=\"itemize\" style=\"padding-inline-start: 13.23em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">VERYLONGPARENT</span>z</li><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">a</span>x<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">LONGCHILD</span>y</li></ul></li></ul>"
  },
  {
    name: "B2: cumulative clamp two 60-char levels",
    latex: "\\begin{itemize}\n\\item[xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] a\n\\begin{itemize}\n\\item[yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy] b\n\\end{itemize}\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"20em\" class=\"itemize\" style=\"padding-inline-start: 20em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>a<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy</span>b</li></ul></li></ul>"
  },
  {
    name: "B2: nested same-line",
    latex: "\\begin{itemize}\n\\item[1.] a \\begin{itemize} \\item[XXXXXXXXXXXX] d \\end{itemize}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">1.</span>a<ul data-padding-inline-start=\"8.93em\" class=\"itemize\" style=\"padding-inline-start: 8.93em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">XXXXXXXXXXXX</span>d</li></ul></li></ul>"
  },
  {
    name: "B2: nested own-line",
    latex: "\\begin{itemize}\n\\item[1.] a\n\\begin{itemize}\n\\item[XXXXXXXXXXXX] d\n\\end{itemize}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">1.</span>a<ul data-padding-inline-start=\"8.93em\" class=\"itemize\" style=\"padding-inline-start: 8.93em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">XXXXXXXXXXXX</span>d</li></ul></li></ul>"
  },
  {
    name: "B2: nested single-line",
    latex: "\\begin{itemize}\\item[1.] a \\begin{itemize}\\item[XXXXXXXXXXXX] d\\end{itemize}\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">1.</span>a<ul data-padding-inline-start=\"8.93em\" class=\"itemize\" style=\"padding-inline-start: 8.93em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">XXXXXXXXXXXX</span>d</li></ul></li></ul>"
  },
  {
    name: "B2: single-line flat wide marker",
    latex: "\\begin{itemize}\\item[XXXXXXXXXXXX] d\\end{itemize}",
    html: "<ul data-padding-inline-start=\"11.43em\" class=\"itemize\" style=\"padding-inline-start: 11.43em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">XXXXXXXXXXXX</span>d</li></ul>"
  },
  {
    name: "B2: wide marker in table cell",
    latex: "| a |\n|---|\n| \\begin{itemize}\\item[XXXXXXXXXXXX] d\\end{itemize} |",
    html: "<table align=\"center\">\n<thead>\n<tr>\n<th>a</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><ul data-padding-inline-start=\"11.43em\" class=\"itemize\" style=\"padding-inline-start: 11.43em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">XXXXXXXXXXXX</span>d</li></ul></td>\n</tr>\n</tbody>\n</table>\n"
  },
  {
    name: "empty<>: figure-list then unclosed tabular-list",
    latex: "\\begin{itemize}\n\\item[11.33] a\n\\begin{figure}\n\\caption{Fig}\n\\end{figure}\n\\end{itemize}\n\n\\begin{itemize}\n\\item[(d1)] b\n\\begin{tabular}{|l|l|}\ncell\n\\end{tabular}\n\\begin{itemize}",
    html: "<ul data-padding-inline-start=\"3.51em\" class=\"itemize\" style=\"padding-inline-start: 3.51em; list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">11.33</span><div>a</div>\n<div class=\"table\" number=\"1\">\n<div></div>\n<div class=\"caption_figure\">Figure 1: Fig</div></div>\n</li></ul><div>\\begin{itemize}<br>\n\\item[(d1)] b</div>\n<div class=\"table_tabular\" style=\"text-align: center\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">cell</td>\n</tr>\n</tbody>\n</table>\n</div></div>\n<div>\\begin{itemize}</div>\n"
  },
  {
    name: "empty<>: tabular-list then unclosed figure-list",
    latex: "\\begin{itemize}\n\\item[a] x\n\\begin{tabular}{|l|l|}\ncell\n\\end{tabular}\n\\end{itemize}\n\n\\begin{itemize}\n\\item[b] y\n\\begin{figure}\n\\caption{Fig}\n\\end{figure}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">a</span><div>x</div>\n<div class=\"table_tabular\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">cell</td>\n</tr>\n</tbody>\n</table>\n</div></div>\n</li></ul><div>\\begin{itemize}<br>\n\\item[b] y</div>\n<div class=\"table\" number=\"1\">\n<div></div>\n<div class=\"caption_figure\">Figure 1: Fig</div></div>\n"
  },
  {
    name: "footnote after heading recognized",
    latex: "# Heading\ntext with \\footnote{a note}",
    html: "<h1 id=\"heading\">Heading</h1>\n<div>text with <sup class=\"footnote-ref\"><a href=\"#fn1\" id=\"fnref1\">[1]</a></sup></div>\n<hr class=\"footnotes-sep\">\n<section class=\"footnotes\" style=\"margin-bottom: 1em;\">\n<ol class=\"footnotes-list\" style=\"margin-bottom: 0;\">\n<li id=\"fn1\" class=\"footnote-item\"><div>a note <a href=\"#fnref1\" class=\"footnote-backref\">↩︎</a></div>\n</li>\n</ol>\n</section>\n"
  },
  {
    name: "footnote after tabular recognized",
    latex: "\\begin{tabular}{|l|}\ncell\n\\end{tabular}\ntext \\footnote{a note}",
    html: "<div class=\"table_tabular\" style=\"text-align: center\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">cell</td>\n</tr>\n</tbody>\n</table>\n</div></div>\n<div>text <sup class=\"footnote-ref\"><a href=\"#fn1\" id=\"fnref1\">[1]</a></sup></div>\n<hr class=\"footnotes-sep\">\n<section class=\"footnotes\" style=\"margin-bottom: 1em;\">\n<ol class=\"footnotes-list\" style=\"margin-bottom: 0;\">\n<li id=\"fn1\" class=\"footnote-item\"><div>a note <a href=\"#fnref1\" class=\"footnote-backref\">↩︎</a></div>\n</li>\n</ol>\n</section>\n"
  },
  {
    name: "core-md list before footnote not swallowed",
    latex: "Para text.\n- item one\n- item two\ntail \\footnote{a note}",
    html: "<div>Para text.</div>\n<ul>\n<li>item one</li>\n<li>item two<br>\ntail <sup class=\"footnote-ref\"><a href=\"#fn1\" id=\"fnref1\">[1]</a></sup></li>\n</ul>\n<hr class=\"footnotes-sep\">\n<section class=\"footnotes\" style=\"margin-bottom: 1em;\">\n<ol class=\"footnotes-list\" style=\"margin-bottom: 0;\">\n<li id=\"fn1\" class=\"footnote-item\"><div>a note <a href=\"#fnref1\" class=\"footnote-backref\">↩︎</a></div>\n</li>\n</ol>\n</section>\n"
  },
  {
    name: "\\item detection: \\itemsep in body no extra item",
    latex: "\\begin{itemize}\n\\item first \\setlength{\\itemsep}{0pt} rest\n\\item second\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>first \\setlength{\\itemsep}{0pt} rest</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>second</li></ul>"
  },
  {
    name: "\\item detection: \\itemindent at start no extra item",
    latex: "\\begin{itemize}\n\\item[] \\itemindent=2em some text\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><span class=\"li_level\" data-custom-marker=\"true\" data-marker-empty=\"true\"></span>\\itemindent=2em some text</li></ul>"
  },
  {
    name: "\\item detection: \\itemsep inline no extra item",
    latex: "\\begin{itemize}\\item a \\itemsep b\\item c\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a \\itemsep b</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>c</li></ul>"
  },
  {
    name: "\\item detection: real \\item still splits",
    latex: "\\begin{itemize}\\item a\\item b\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    // \itemsep mid-line is not a split point, so "tail " stays with item a.
    name: "\\item detection: \\itemsep is not a split point",
    latex: "\\begin{itemize}\n\\item[a] x\ntail \\itemsep pad \\item[b] y\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">a</span>x<br>\ntail \\itemsep pad</li><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">b</span>y</li></ul>"
  },
  {
    // An unsupported command renders as literal text and must not become an item.
    name: "\\item detection: \\itemsep before the first item makes no item",
    latex: "\\begin{itemize}\n\\itemsep 1pt\n\\item[a] x\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">\\itemsep 1pt</li><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">a</span>x</li></ul>"
  },
  {
    // Sibling sublists resolve independently: only the wide one reserves, either order.
    name: "B2: sibling sublists wide then narrow",
    latex: "\\begin{itemize}\n\\item[a] x\n\\begin{itemize}\n\\item[XXXXXXXXXXXX] w\n\\end{itemize}\n\\item[b] y\n\\begin{itemize}\n\\item[n] z\n\\end{itemize}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">a</span>x<ul data-padding-inline-start=\"8.93em\" class=\"itemize\" style=\"padding-inline-start: 8.93em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">XXXXXXXXXXXX</span>w</li></ul></li><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">b</span>y<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">n</span>z</li></ul></li></ul>"
  },
  {
    // 22 capitals want 24.03em; the reserve stops at LIST_MAX_INDENT_EM and stays a valid em value.
    name: "marker wider than the clamp stops at 20em",
    latex: "\\begin{itemize}\n\\item[" + "A".repeat(22) + "] x\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"20em\" class=\"itemize\" style=\"padding-inline-start: 20em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">AAAAAAAAAAAAAAAAAAAAAA</span>x</li></ul>"
  },
  {
    name: "B2: sibling sublists narrow then wide",
    latex: "\\begin{itemize}\n\\item[a] x\n\\begin{itemize}\n\\item[n] z\n\\end{itemize}\n\\item[b] y\n\\begin{itemize}\n\\item[XXXXXXXXXXXX] w\n\\end{itemize}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">a</span>x<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">n</span>z</li></ul></li><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">b</span>y<ul data-padding-inline-start=\"8.93em\" class=\"itemize\" style=\"padding-inline-start: 8.93em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">XXXXXXXXXXXX</span>w</li></ul></li></ul>"
  },
  // Collapsed closers: one line carries several \end, so a single pass per line left the outer
  // list unclosed and the strict bail dropped it as literal text.
  {
    name: "collapsed closers: two levels",
    latex: "\\begin{itemize}\n\\item a\n\\begin{itemize}\n\\item b\\end{itemize}\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>b</li></ul></li></ul>"
  },
  {
    name: "collapsed closers: three levels",
    latex: "\\begin{itemize}\n\\item a\n\\begin{itemize}\n\\item b\n\\begin{itemize}\n\\item c\\end{itemize}\\end{itemize}\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>b<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">∗</span>c</li></ul></li></ul></li></ul>"
  },
  {
    name: "collapsed closers: enumerate",
    latex: "\\begin{enumerate}\n\\item a\n\\begin{enumerate}\n\\item b\\end{enumerate}\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate\">a<ol class=\"enumerate lower-alpha\" style=\"list-style-type: lower-alpha\"><li class=\"li_enumerate\">b</li></ol></li></ol>"
  },
  {
    // Source order, not `\end` first: the second sublist was lost when the closer won the line.
    name: "two sublists on one line",
    latex: "\\begin{itemize}\n\\item a\\begin{itemize}\\item b\\end{itemize}\\begin{itemize}\\item c\\end{itemize}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>b</li></ul><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>c</li></ul></li></ul>"
  },
  {
    // A float after a closed nested list has no `\item` in its chunk, so it used to be inline-parsed:
    // the env leaked as text and the caption was dropped.
    name: "a table float after a nested list keeps its wrapper and caption",
    latex: "\\begin{itemize}\n\\item[-] text 1\n\\begin{itemize}\n\\item[-] text 2\n\\end{itemize}\n\\begin{table}\n\\captionsetup{labelformat=empty}\n\\caption{Cap}\n\\begin{tabular}{|l|}\n\\hline\ncell \\\\\n\\hline\n\\end{tabular}\n\\end{table}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">-</span>text 1<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">-</span>text 2</li></ul><div class=\"table\" number=\"1\">\n<div class=\"caption_table\">Cap</div><div class=\"table_tabular\" style=\"text-align: center\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; \">cell</td>\n</tr>\n</tbody>\n</table>\n</div></div>\n</div>\n</li></ul>"
  },
  // No `\item` to attach to, so it gets a marker-less `<li>` — `<ul>` admits nothing else. The command
  // itself stays visible: unsupported ones are shown, not swallowed.
  {
    name: "\\itemsep before the first item stays visible, in a marker-less <li>",
    latex: "\\begin{itemize}\n\\itemsep 4pt\n\\item a\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">\\itemsep 4pt</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul>"
  },
  {
    name: "\\itemindent before the first item stays visible, in a marker-less <li>",
    latex: "\\begin{itemize}\n\\itemindent 2em\n\\item a\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">\\itemindent 2em</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul>"
  },
  // A wrapper env is opaque: its interior is collected raw, so a list command written inside it —
  // invalid LaTeX, but common in OCR output — is text, not structure. Each of these kept 2 items.
  {
    name: "an \\item inside a caption is caption text, not a marker",
    latex: "\\begin{itemize}\n\\item a\n\\begin{table}\n\\caption{\\item[x]}\n\\begin{tabular}{|l|}\\hline c \\\\ \\hline\\end{tabular}\n\\end{table}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"table\" number=\"1\">\n<div class=\"caption_table\">Table 1: \\item[x]</div><div class=\"table_tabular\" style=\"text-align: center\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; \">c</td>\n</tr>\n</tbody>\n</table>\n</div></div>\n</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "an \\end{itemize} inside a caption does not close the list",
    latex: "\\begin{itemize}\n\\item a\n\\begin{table}\n\\caption{x \\end{itemize} y}\n\\begin{tabular}{|l|}\\hline c \\\\ \\hline\\end{tabular}\n\\end{table}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"table\" number=\"1\">\n<div class=\"caption_table\">Table 1: x \\end{itemize} y</div><div class=\"table_tabular\" style=\"text-align: center\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; \">c</td>\n</tr>\n</tbody>\n</table>\n</div></div>\n</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "an \\item inside a center env is not a marker",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n\\item[x] y\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">\\item[x] y</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    // The guard: opening it opaque would swallow the rest of the list, so it stays as it was.
    name: "a wrapper with no closer leaves the list alone",
    latex: "\\begin{itemize}\n\\item a\n\\begin{table}\n\\caption{C}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div>\\begin{table}<br>\n</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // A closer mid-line can be followed by a sibling list, not only by a nested one.
  {
    name: "sibling list after a collapsed closer",
    latex: "\\begin{itemize}\n\\item a\\end{itemize}\\begin{enumerate}\n\\item b\n\\end{enumerate}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate\">b</li></ol>"
  },
  {
    name: "sibling list closed on the same line",
    latex: "\\begin{itemize}\n\\item a\\end{itemize}\\begin{enumerate}\\item b\\end{enumerate}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate\">b</li></ol>"
  },
  {
    // A sibling is not nested, so it reserves the full marker width — the same `11.43em` the
    // standalone list with this marker gets. Reading as nested cost it one default indent.
    name: "sibling list reserves a wide marker in full",
    latex: "\\begin{itemize}\n\\item a\\end{itemize}\\begin{itemize}\n\\item[XXXXXXXXXXXX] b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><ul data-padding-inline-start=\"11.43em\" class=\"itemize\" style=\"padding-inline-start: 11.43em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">XXXXXXXXXXXX</span>b</li></ul>"
  },
  {
    // One closer against two openings in the tail: counted, so the sibling does not open.
    name: "sibling needing two closers does not open",
    latex: "\\begin{itemize}\n\\item a\\end{itemize}\\begin{enumerate}\\begin{enumerate}\\item b\\end{enumerate}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul>"
  },
  {
    // Guard declines: opening a sibling that cannot close aborts the rule and drops the first list.
    name: "unclosed sibling keeps the first list",
    latex: "\\begin{itemize}\n\\item a\\end{itemize}\\begin{enumerate}\n\\item b",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><div>\\item b</div>\n"
  },
  {
    // The closer sweep is fence-blind, so the sibling check also asks which comes first.
    name: "sibling closer inside a fence stays code",
    latex: "\\begin{itemize}\n\\item a\\end{itemize}\\begin{enumerate}\n\\item b\n\n```\n\\end{enumerate}\n```",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><div>\\item b</div>\n<pre><code class=\"hljs\">\\end{enumerate}\n</code></pre>\n"
  },
  {
    // Text between the two envs is a paragraph in LaTeX and lands between the lists here.
    name: "text between a closer and a sibling opener",
    latex: "\\begin{itemize}\n\\item a\\end{itemize} middle \\begin{enumerate}\n\\item b\n\\end{enumerate}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul>middle<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate\">b</li></ol>"
  },
  // A wrapper that opens and closes on one line: the opaque stack stayed open for good and the
  // whole list printed as literal LaTeX. Every wrapper name, since each picks its own closer.
  {
    name: "a one-line center in a list body",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}x\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">x</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a one-line left in a list body",
    latex: "\\begin{itemize}\n\\item a\n\\begin{left}x\\end{left}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: left\">x</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a one-line figure in a list body",
    latex: "\\begin{itemize}\n\\item a\n\\begin{figure}\\caption{q}\\end{figure}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"table\" number=\"1\">\n<div></div>\n<div class=\"caption_figure\">Figure 1: q</div></div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a one-line table in a list body",
    latex: "\\begin{itemize}\n\\item a\n\\begin{table}\\caption{q}\\end{table}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"table\" number=\"1\">\n<div></div>\n<div class=\"caption_table\">Table 1: q</div></div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a one-line tabular in a list body",
    latex: "\\begin{itemize}\n\\item a\n\\begin{tabular}{l}q\\end{tabular}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"table_tabular\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">q</td>\n</tr>\n</tbody>\n</table>\n</div></div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // The chunk then held a block env and two markers, and only the first was read — `\item b`
  // printed as text. `pdflatex` renders this input, so the second item is owed.
  {
    name: "a marker before a closer on one line, after a one-line wrapper",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}x\\end{center}\n\\item b \\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">x</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // A closer that ends its line is structure, not text: brace depth decides, not the column, or a
  // wrapper reaching a later `\end{figure}` swallows the list. Compare the `\caption{}` fixture above.
  {
    name: "a closer ending its line, a figure following it",
    latex: "\\begin{itemize}\n\\item a\n\\begin{figure}\n\\item b \\end{itemize}\n\\begin{figure}\n\\caption{other}\n\\end{figure}\n",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div>\\begin{figure}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul><div class=\"table\" number=\"1\">\n<div></div>\n<div class=\"caption_figure\">Figure 1: other</div></div>\n"
  },
  {
    name: "a closer ending its line, a lone \\end{center} below",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\nb \\end{itemize}\n\ntext \\end{center} more\n",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div>\\begin{center}<br>\nb</div>\n</li></ul><div>text \\end{center} more</div>\n"
  },
  {
    name: "a closer ending its line, no foreign env",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\nb \\end{itemize}\n",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div>\\begin{center}<br>\nb</div>\n</li></ul>"
  },
  // An unmatched `{` leaves the argument spans unknowable, so the wrapper declines rather than
  // reach a later `\end{figure}` and swallow the list. Braces trusted blindly printed it all as LaTeX.
  {
    name: "an unclosed brace in a wrapper caption, a figure below",
    latex: "\\begin{itemize}\n\\item a\n\\begin{figure}\n\\caption{x\n\\end{itemize}\n\n\\begin{figure}\n\\caption{other}\n\\end{figure}\n",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div>\\begin{figure}<br>\n\\caption{x</div>\n</li></ul><div class=\"table\" number=\"1\">\n<div></div>\n<div class=\"caption_figure\">Figure 1: other</div></div>\n"
  },
  {
    name: "a bare unclosed brace in a wrapper, a figure below",
    latex: "\\begin{itemize}\n\\item a\n\\begin{figure}\n{ x\n\\end{itemize}\n\n\\begin{figure}\n\\caption{other}\n\\end{figure}\n",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div>\\begin{figure}<br>\n{ x</div>\n</li></ul><div class=\"table\" number=\"1\">\n<div></div>\n<div class=\"caption_figure\">Figure 1: other</div></div>\n"
  },
  // Every shape a chunk before the first `\item` can take. `<ul>` admits only `<li>`, so each gets a
  // marker-less one — and a chunk that renders to nothing gets none, having emitted no tokens.
  {
    name: "plain text before the first item",
    latex: "\\begin{itemize}\nloose text\n\\item a\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">loose text</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul>"
  },
  {
    name: "a block env before the first item",
    latex: "\\begin{itemize}\n\\begin{center}q\\end{center}\n\\item a\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\" data-marker-empty=\"true\"><div class=\"center\" style=\"text-align: center\">q</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul>"
  },
  {
    name: "text before the first item of an enumerate",
    latex: "\\begin{enumerate}\nloose text\n\\item a\n\\item b\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate not_number\" data-custom-marker=\"true\" data-marker-empty=\"true\" style=\"display: block\">loose text</li><li class=\"li_enumerate\">a</li><li class=\"li_enumerate\">b</li></ol>"
  },
  {
    name: "the whole list on one line, with text before the item",
    latex: "\\begin{itemize} loose \\item x \\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"> loose </li><li class=\"li_itemize\"><span class=\"li_level\">•</span>x</li></ul>"
  },
  {
    name: "a whitespace-only chunk before the first item",
    latex: "\\begin{itemize}\n   \n\\item a\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul>"
  },
  {
    name: "a \\renewcommand before the first item",
    latex: "\\begin{itemize}\n\\renewcommand{\\labelitemi}{ZZ}\n\\item a\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul>"
  },
  {
    name: "text before the first item of a nested list",
    latex: "\\begin{itemize}\n\\item a\n\\begin{itemize}\nloose\n\\item i\n\\end{itemize}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">loose</li><li class=\"li_itemize\"><span class=\"li_level\">–</span>i</li></ul></li></ul>"
  },
  {
    name: "a list holding text and no item at all",
    latex: "\\begin{itemize}\nonly loose text\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">only loose text</li></ul>"
  },
  // The inline path builds its own state: a token created through it threw there, the rule caught
  // that, and the whole list dropped to literal LaTeX. A leading space alone stays unwrapped.
  {
    name: "a one-line list inside a paragraph, with text before its first item",
    latex: "text before \\begin{itemize} loose \\item a \\end{itemize} after",
    html: "<div>text before <ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"> loose </li><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul> after</div>\n"
  },
  {
    name: "a one-line list in a markdown table cell, with text before its first item",
    latex: "| a |\n|---|\n| \\begin{itemize} loose \\item x \\end{itemize} |",
    html: "<table align=\"center\">\n<thead>\n<tr>\n<th>a</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"> loose </li><li class=\"li_itemize\"><span class=\"li_level\">•</span>x</li></ul></td>\n</tr>\n</tbody>\n</table>\n"
  },
  {
    name: "a one-line list inside a paragraph, its first item straight after \\begin",
    latex: "text before \\begin{itemize} \\item a \\end{itemize} after",
    html: "<div>text before <ul class=\"itemize\" style=\"list-style-type: none\"> <li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul> after</div>\n"
  },
  // A sublist written in such a chunk goes inside its wrapper `<li>`: beside it, the `<ul>` would be
  // a direct child of a `<ul>`. `master` leaves both the text and that `<ul>` bare.
  {
    name: "a chunk holding text and a sublist, the sublist inside its wrapper",
    latex: "\\begin{itemize}\nloose \\begin{itemize}\\item inner\\end{itemize}\n\\item x\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">loose<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>inner</li></ul></li><li class=\"li_itemize\"><span class=\"li_level\">•</span>x</li></ul>"
  },
  {
    name: "the same chunk in an enumerate",
    latex: "\\begin{enumerate}\nloose \\begin{itemize}\\item inner\\end{itemize}\n\\item x\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate not_number\" data-custom-marker=\"true\" data-marker-empty=\"true\" style=\"display: block\">loose<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>inner</li></ul></li><li class=\"li_enumerate\">x</li></ol>"
  },
  {
    name: "a chunk holding text and a sublist on the \\begin line",
    latex: "\\begin{itemize} loose \\begin{itemize}\\item inner\\end{itemize}\n\\item x\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"> loose <ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>inner</li></ul></li><li class=\"li_itemize\"><span class=\"li_level\">•</span>x</li></ul>"
  },
  {
    name: "a chunk holding text and a sublist, with no \\item at all",
    latex: "\\begin{itemize}\nloose \\begin{itemize}\\item inner\\end{itemize}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">loose<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>inner</li></ul></li></ul>"
  },
  {
    name: "a sublist alone before the first \\item, on the \\begin line",
    latex: "\\begin{itemize} \\begin{itemize}\\item inner\\end{itemize}\n\\item x\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"> <ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>inner</li></ul></li><li class=\"li_itemize\"><span class=\"li_level\">•</span>x</li></ul>"
  },
  {
    name: "a chunk holding text and a sublist in a markdown table cell",
    latex: "| h |\n| :-- |\n| \\begin{itemize} loose \\begin{itemize}\\item inner\\end{itemize} \\item x\\end{itemize} |",
    html: "<table align=\"center\">\n<thead>\n<tr>\n<th style=\"text-align:left\">h</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td style=\"text-align:left\"><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"> loose <ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>inner</li></ul> </li><li class=\"li_itemize\"><span class=\"li_level\">•</span>x</li></ul></td>\n</tr>\n</tbody>\n</table>\n"
  },
  // A closer inside a command argument is text whatever the argument's length: spans are paired over
  // the whole source. `master` prints this wrapper as literal LaTeX with an unbalanced `</ul>`.
  {
    name: "a closer inside a long caption inside a wrapper stays text",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \\end{itemize} tail}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> tail}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // Same for a fenced block and an `lstlisting`: their braces are literal, found with the helpers the
  // body walk already uses. Counted as left open, each cost the list its second item.
  {
    name: "a brace in a fenced block inside a wrapper is not a brace left open",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n```\ncode {\n```\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"><code>code {</code><br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a brace in an lstlisting inside a wrapper is not a brace left open",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n\\begin{lstlisting}\n{\n\\end{lstlisting}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"><pre class=\"lstlisting\"><code class=\"hljs lstlisting-code\" style=\"text-align: left;\">{</code></pre>\n<br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // Markdown keeps braces in prose, so a group is an argument only of a command the package parses.
  // Read as one, the braces around the list held its closer, and the list lost its second item.
  {
    name: "braces in prose around the list are prose",
    latex: "opens {\n\\begin{itemize}\n\\item a\n\\begin{center}\\end{itemize}\\end{center}\n\\item b\n\\end{itemize}\ncloses }",
    html: "<div>opens {</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">\\end{itemize}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul><div>closes }</div>\n"
  },
  {
    name: "an unsupported command takes no argument, so its group shields nothing",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n\\foo{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">\\foo{q \\end{itemize} w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // The same pair where the rule decides the output: the sibling list opens only if a closer is left for
  // it, and the only one stands inside a group. Under an unsupported name it counts, under `\caption` it
  // is that caption's text.
  {
    name: "a closer inside an unsupported command's group still opens the sibling list",
    latex: "\\begin{itemize}\n\\item a\n\\end{itemize} \\begin{itemize}\n\\item b\n\\foo{ \\end{itemize} }",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>b<br>\n\\foo{</li></ul><div>}</div>\n"
  },
  // A brace in prose after a command's own argument is prose, not a second argument: taken as one, the
  // closer written in it read as text, and this sibling list lost its item — where the same source
  // without the `\label{L}` before the brace kept it.
  {
    name: "a brace in prose after a command argument does not shield a closer",
    latex: "\\begin{itemize}\n\\item a\n\\end{itemize} \\begin{itemize} \\item b\n\\label{L} {x\n\\end{itemize} y}\n",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>b<br>\n {x</li></ul><div>y}</div>\n"
  },
  {
    name: "the same closer inside a caption does not",
    latex: "\\begin{itemize}\n\\item a\n\\end{itemize} \\begin{itemize}\n\\item b\n\\caption{ \\end{itemize} }",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><div>\\item b<br>\n }</div>\n"
  },
  // Nor inside `\underline`: the underline rules read their argument through the same `findEndMarker`, so
  // every name they match belongs to the list. Left out, they shielded nothing and this list lost its item.
  {
    name: "the same closer inside an underline does not either",
    latex: "\\begin{itemize}\n\\item a\n\\end{itemize} \\begin{itemize}\n\\item b\n\\underline{ \\end{itemize} }",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><div>\\item b<br>\n<span data-underline-level=\"1\" data-underline-type=\"underline\" style=\"border-bottom: 1px solid;background-position: 0 -1px;\">\\end{itemize}</span></div>\n"
  },
  // A brace inside inline code is text, so it opens no argument: counted as left open it made the
  // caption's closer read as structure, and the second item was lost.
  {
    name: "a brace in inline code inside a wrapper is not a brace left open",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n`{` \\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"><code>{</code>  w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // A `{` left open earlier in the document must not reach this list: judged document-wide it made the
  // caption's closer read as structure, and the second item was lost.
  {
    name: "a stray { before a list whose caption holds a closer",
    latex: "text {\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<div>text {</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // Verbatim content is text wherever it sits, and its shape decides nothing: a one-line
  // `lstlisting` (any count of them), a fenced closer, an indented block, `\verb`, an html block and a
  // `tabular` all used to make the caption's closer read as structure, costing the list its item.
  {
    name: "a one-line lstlisting before a list whose caption holds a closer",
    latex: "\\begin{lstlisting}code\\end{lstlisting}\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<div><pre class=\"lstlisting\"><code class=\"hljs lstlisting-code\" style=\"text-align: left;\">code</code></pre>\n</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "three one-line lstlisting before it, an odd count",
    latex: "\\begin{lstlisting}code\\end{lstlisting}\n\n\\begin{lstlisting}code\\end{lstlisting}\n\n\\begin{lstlisting}code\\end{lstlisting}\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<div><pre class=\"lstlisting\"><code class=\"hljs lstlisting-code\" style=\"text-align: left;\">code</code></pre>\n</div>\n<div><pre class=\"lstlisting\"><code class=\"hljs lstlisting-code\" style=\"text-align: left;\">code</code></pre>\n</div>\n<div><pre class=\"lstlisting\"><code class=\"hljs lstlisting-code\" style=\"text-align: left;\">code</code></pre>\n</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a one-line lstlisting inside the list",
    latex: "\\begin{itemize}\n\\item a\n\\begin{lstlisting}code\\end{lstlisting}\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a<br>\n<pre class=\"lstlisting\"><code class=\"hljs lstlisting-code\" style=\"text-align: left;\">code</code></pre>\n</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "sibling lists after a one-line lstlisting",
    latex: "\\begin{lstlisting}code\\end{lstlisting}\n\n\\begin{itemize}\n\\item a\n\\end{itemize} \\begin{itemize}\n\\item b\n\\end{itemize}",
    html: "<div><pre class=\"lstlisting\"><code class=\"hljs lstlisting-code\" style=\"text-align: left;\">code</code></pre>\n</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a \\verb argument holding a brace inside a wrapper",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n\\verb|{|\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">\\verb|{|<br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "an indented code block holding a brace inside a wrapper",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n    code {\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">code {<br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "an html block holding a brace inside a wrapper",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n<div>\ncode {\n</div>\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"><div><br>\ncode {<br>\n</div><br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a tabular holding a brace inside a wrapper",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n\\begin{tabular}{l}\n{\n\\end{tabular}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">\n<div class=\"table_tabular\" style=\"text-align: center\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">{</td>\n</tr>\n</tbody>\n</table>\n</div><br>\n w}</div>\n</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a fenced closer before a list whose caption holds one",
    latex: "```\n\\end{itemize}\n```\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<pre><code class=\"hljs\">\\end{itemize}\n</code></pre>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "inline code holding a brace, with a real closing brace later",
    latex: "text `{` then a real } here\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<div>text <code>{</code> then a real } here</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // Escaping and every verbatim context, each holding what would otherwise read as structure: an escaped
  // brace opens nothing, an escaped backslash leaves the brace real, and inline code, math, display math
  // and an `align` are text. Each of these once cost the list its second item.
  {
    name: "a closer written in inline code inside a wrapper",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n`\\end{itemize}`\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"><code>\\end{itemize}</code><br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "an \\item written in inline code inside a wrapper",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n`\\item fake`\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"><code>\\item fake</code><br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a dollar pair in inline code opens no math",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n`$x$`\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"><code>$x$</code><br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "an escaped brace opens no argument",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\ntext \\{ here\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">text { here<br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "an escaped backslash leaves the brace real",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\ntext \\\\{ here\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">text \\{ here<br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "an escaped dollar opens no math",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\nprice \\$5 here\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">price $5 here<br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a closer in inline code before the list",
    latex: "`\\end{itemize}`\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<div><code>\\end{itemize}</code></div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "math holding a closer inside a wrapper",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n$a \\end{itemize} b$\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"><span class=\"math-inline \"></span><br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "display math holding a brace inside a wrapper",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n$$\n\\frac{1}{2\n$$\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"><span class=\"math-block \"></span><br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "an align env holding a brace inside a wrapper",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n\\begin{align}\nx_{1 &= 2\n\\end{align}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"><span  class=\"math-block equation-number \" number=\"0\"></span><br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // A closer of ours written inside a wrapper is content when the source past the wrapper still closes the
  // open lists and no list starts inside it — how `tabular` always read it, now true of all six. With an
  // opener inside, the wrapper stays transparent: swallowing it would lose that list.
  {
    name: "a real closer inside a center is content, the list still closes",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\ntext \\end{itemize} here\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">text \\end{itemize} here<br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "the same inside a left env",
    latex: "\\begin{itemize}\n\\item a\n\\begin{left}\ntext \\end{itemize} here\n\\end{left}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: left\">text \\end{itemize} here</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "the same inside a right env",
    latex: "\\begin{itemize}\n\\item a\n\\begin{right}\ntext \\end{itemize} here\n\\end{right}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: right\">text \\end{itemize} here</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "the same inside a table",
    latex: "\\begin{itemize}\n\\item a\n\\begin{table}\n\\caption{c}\ntext \\end{itemize} here\n\\begin{tabular}{l}\nq\n\\end{tabular}\n\\end{table}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"table\" number=\"1\">\n<div class=\"caption_table\">Table 1: c</div><div class=\"table_tabular\" style=\"text-align: center\">text \\end{itemize} here<br>\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">q</td>\n</tr>\n</tbody>\n</table>\n</div></div>\n</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "the same inside a figure",
    latex: "\\begin{itemize}\n\\item a\n\\begin{figure}\n\\caption{c}\ntext \\end{itemize} here\n\\end{figure}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"table\" number=\"1\">text \\end{itemize} here<div class=\"caption_figure\">Figure 1: c</div></div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "the same inside a tabular",
    latex: "\\begin{itemize}\n\\item a\n\\begin{tabular}{l}\nq \\end{itemize} r\n\\end{tabular}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"table_tabular\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">q \\end{itemize} r</td>\n</tr>\n</tbody>\n</table>\n</div></div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    // Our closer stands first inside the wrapper, two openers follow it and nothing closes the list after
    // the wrapper: on a tally the closers do not outnumber the openers, the wrapper opens and takes the
    // list start with it. Order decides instead, and the first item survives.
    name: "a closer standing first inside the wrapper is ours, openers after it notwithstanding",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n\\end{itemize}\n\\begin{itemize}\n\\begin{itemize}\n\\item b\n\\end{center}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div>\\begin{center}</div>\n</li></ul><div>\\begin{itemize}</div>\n<div>\\begin{itemize}<br>\n\\item b<br>\n\\end{center}</div>\n"
  },
  {
    name: "a list opened inside the wrapper goes to the wrapper with the rest of its body",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n\\end{itemize}\n\\begin{itemize}\n\\item b\n\\end{center}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">\\end{itemize}<br>\n\\begin{itemize}<br>\n\\item b</div>\n</li></ul>"
  },
  // The same question asked from every distance and every context before the list: a brace left open in a
  // formula or a caption, one between two lists, and a brace held by inline code, a fence or an
  // `lstlisting` — none of them reaches the list, whatever their count.
  {
    name: "a brace left open in a broken formula before the list",
    latex: "text $\\frac{1}{2$ here\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<div>text <span class=\"math-inline \"></span> here</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "an unclosed caption before the list",
    latex: "\\caption{unclosed\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<div>\\caption{unclosed</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a brace left open between two such lists",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}\n\nstray {\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul><div>stray {</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "inline code holding a brace before the list",
    latex: "text `{` here\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<div>text <code>{</code> here</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a fenced block holding a brace before the list",
    latex: "```\ncode {\n```\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<pre><code class=\"hljs\">code {\n</code></pre>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "an lstlisting holding a brace before the list",
    latex: "\\begin{lstlisting}\ncode {\n\\end{lstlisting}\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<pre class=\"lstlisting\"><code class=\"hljs lstlisting-code\" style=\"text-align: left;\">code {</code></pre>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a fenced block holding a brace inside the list, before the wrapper",
    latex: "\\begin{itemize}\n\\item a\n```\ncode {\n```\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<pre><code class=\"hljs\">code {\n</code></pre>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "inline math holding a brace inside a wrapper",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n$x_{1$\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"><span class=\"math-inline \"></span><br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "two one-line lstlisting before the list, an even count",
    latex: "\\begin{lstlisting}code\\end{lstlisting}\n\n\\begin{lstlisting}code\\end{lstlisting}\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<div><pre class=\"lstlisting\"><code class=\"hljs lstlisting-code\" style=\"text-align: left;\">code</code></pre>\n</div>\n<div><pre class=\"lstlisting\"><code class=\"hljs lstlisting-code\" style=\"text-align: left;\">code</code></pre>\n</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "three lists in a row, each with a closer in its caption",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // Math pairs inside one paragraph, as its rules do: a `$` scanned across a blank line marked the list
  // between them verbatim, and the guard then lost an item — while no parser read that as math at all.
  {
    name: "a dollar in one paragraph does not pair with one in another",
    latex: "Open $a\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}\n\nclose b$",
    html: "<div>Open $a</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul><div>close b$</div>\n"
  },
  {
    name: "the same for $$ across a blank line",
    latex: "Open $$a\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}\n\nclose b$$",
    html: "<div>Open $$a</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul><div>close b$$</div>\n"
  },
  {
    name: "the same for \\( across a blank line",
    latex: "Open \\(a\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}\n\nclose b\\)",
    html: "<div>Open (a</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul><div>close b)</div>\n"
  },
  {
    name: "math inside one paragraph is still math",
    latex: "Formula $a+b$ here\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<div>Formula <span class=\"math-inline \">\n<mjx-container class=\"MathJax\" jax=\"SVG\"><svg style=\"vertical-align: -0.186ex;\" xmlns=\"http://www.w3.org/2000/svg\" width=\"4.933ex\" height=\"1.756ex\" role=\"img\" focusable=\"false\" viewBox=\"0 -694 2180.4 776\"><g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"scale(1,-1)\"><g data-mml-node=\"math\"><g data-mml-node=\"mi\"><path data-c=\"1D44E\" d=\"M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z\"></path></g><g data-mml-node=\"mo\" transform=\"translate(751.2,0)\"><path data-c=\"2B\" d=\"M56 237T56 250T70 270H369V420L370 570Q380 583 389 583Q402 583 409 568V270H707Q722 262 722 250T707 230H409V-68Q401 -82 391 -82H389H387Q375 -82 369 -68V230H70Q56 237 56 250Z\"></path></g><g data-mml-node=\"mi\" transform=\"translate(1751.4,0)\"><path data-c=\"1D44F\" d=\"M73 647Q73 657 77 670T89 683Q90 683 161 688T234 694Q246 694 246 685T212 542Q204 508 195 472T180 418L176 399Q176 396 182 402Q231 442 283 442Q345 442 383 396T422 280Q422 169 343 79T173 -11Q123 -11 82 27T40 150V159Q40 180 48 217T97 414Q147 611 147 623T109 637Q104 637 101 637H96Q86 637 83 637T76 640T73 647ZM336 325V331Q336 405 275 405Q258 405 240 397T207 376T181 352T163 330L157 322L136 236Q114 150 114 114Q114 66 138 42Q154 26 178 26Q211 26 245 58Q270 81 285 114T318 219Q336 291 336 325Z\"></path></g></g></g></svg></mjx-container></span> here</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // `\verb`, an indented block, an html block and a `tabular` are not modelled as verbatim: a closer written
  // there survives by the content rule — the source past the wrapper still closes the list.
  {
    name: "a closer inside \\verb keeps both items",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n\\verb|\\end{itemize}|\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">\\verb|\\end{itemize}|<br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a closer inside an indented block keeps both items",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n    \\end{itemize}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">\\end{itemize}<br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a closer inside an html block keeps both items",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n<div>\n\\end{itemize}\n</div>\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"><div><br>\n\\end{itemize}<br>\n</div><br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a closer inside a tabular keeps both items",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n\\begin{tabular}{l}\n\\end{itemize}\n\\end{tabular}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">\n<div class=\"table_tabular\" style=\"text-align: center\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">\\end{itemize}</td>\n</tr>\n</tbody>\n</table>\n</div><br>\n w}</div>\n</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // Inline code opening before a fence and closing after it makes the verbatim sources overlap; the
  // ranges are unioned for that reason, and these two shapes are what a wrong union costs.
  {
    name: "a closer inside a fence nested in inline code does not end the list",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n`x\n```\n\\end{itemize}\n```\ny`\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"><code>x ``` \\end{itemize} ``` y</code><br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "inline code spanning two fenced blocks before a list",
    latex: "a `x\n```\nq\n```\nw\n~~~\ne\n~~~\ny` z\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<div>a `x</div>\n<pre><code class=\"hljs\">q\n</code></pre>\n<div>w</div>\n<pre><code class=\"hljs\">e\n</code></pre>\n<div>y` z</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // A backtick inside a listing opens no code span: the union takes the listing whole, so the span that
  // would have run to the next backtick in the document never forms.
  {
    name: "a lone backtick inside an lstlisting in the wrapper",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n\\begin{lstlisting}\n` \\end{itemize}\n\\end{lstlisting}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"><pre class=\"lstlisting\"><code class=\"hljs lstlisting-code\" style=\"text-align: left;\">` \\end{itemize}</code></pre>\n<br>\n w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a lone backtick and a brace inside an lstlisting before the list",
    latex: "\\begin{lstlisting}\n` {\n\\end{lstlisting}\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<pre class=\"lstlisting\"><code class=\"hljs lstlisting-code\" style=\"text-align: left;\">` {</code></pre>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // A top-level enumerate opening at depth zero clears the numbering the previous one left: the second
  // list starts from one, with no `value` on its first item.
  {
    name: "an independent enumerate after one with a bumped counter starts from one",
    latex: "\\begin{enumerate}\n\\setcounter{enumi}{5}\n\\item a\n\\end{enumerate}\n\n\\begin{enumerate}\n\\item b\n\\item c\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li value=\"6\" class=\"li_enumerate\">a</li></ol><ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate\">b</li><li class=\"li_enumerate\">c</li></ol>"
  },
  // A fence that swallowed the list's closer ends the replay, and the lines after it come out as text —
  // `master` loses them and emits `<li><>` instead.
  {
    name: "lines after an unclosed fence that swallowed the closer",
    latex: "\\begin{itemize}\n\\item a\n```\n\\end{itemize}\n\\item b\ntail\n",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<pre><code class=\"hljs\"></code></pre>\n</li></ul><div>\\item b<br>\ntail</div>\n"
  },
  // A mid-line closer may open a sibling, and whether the closer ahead is real is decided by the inline
  // scanner: it skips a code span but not a command argument. Identical to `master`, pinned per shape.
  {
    name: "a sibling whose only closer sits in a caption argument",
    latex: "\\begin{itemize}\\item a\\end{itemize} \\begin{itemize}\\item b\n\n\\caption{x \\end{itemize} y}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul> <ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>b\\caption{x</li></ul><div>y}</div>\n"
  },
  {
    name: "a sibling whose only closer sits in a code span",
    latex: "\\begin{itemize}\\item a\\end{itemize} \\begin{itemize}\\item b\n\n`\\end{itemize}`",
    html: "<div><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul> \\begin{itemize}\\item b</div>\n<div><code>\\end{itemize}</code></div>\n"
  },
  {
    name: "a sibling with a real closer below",
    latex: "\\begin{itemize}\\item a\\end{itemize} \\begin{itemize}\\item b\n\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul> <ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // A closer inside a code span: the list survives, the code span does not — the wrapper's own block rule
  // truncates its content there. Identical to `master`; the third shape is the control that must stay clean.
  {
    name: "a closer in a code span inside a wrapper, on its own line",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\nx `\\end{center}` y\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">x `</div>\n<div>x `\\end{center}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a closer in a code span inside a one-line wrapper",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center} x `\\end{center}` y \\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> x `</div>\n<div>` y \\end{center}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a code span with no closer inside a wrapper renders whole",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\nx `code` y\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">x <code>code</code> y</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // The unclosed body prints as text, but `\renewcommand` inside it is applied and never printed.
  // Identical to `master`; pinned because rolling it back made one source answer twice.
  {
    name: "a marker command in a body that never closes applies below, footnote above",
    latex: "Para \\footnote{n}\n\\begin{itemize}\n\\renewcommand{\\labelitemi}{ZZZ}\n\\item a\n\n\\begin{itemize}\n\\item b\n\\end{itemize}",
    html: "<div>Para <sup class=\"footnote-ref\"><a href=\"#fn1\" id=\"fnref1\">[1]</a></sup></div>\n<div>\\begin{itemize}<br>\n<br>\n\\item a</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">ZZZ</span>b</li></ul><hr class=\"footnotes-sep\">\n<section class=\"footnotes\" style=\"margin-bottom: 1em;\">\n<ol class=\"footnotes-list\" style=\"margin-bottom: 0;\">\n<li id=\"fn1\" class=\"footnote-item\"><div>n <a href=\"#fnref1\" class=\"footnote-backref\">↩︎</a></div>\n</li>\n</ol>\n</section>\n"
  },
  {
    name: "a marker command in a body that never closes applies below, plain paragraph above",
    latex: "Para\n\\begin{itemize}\n\\renewcommand{\\labelitemi}{ZZZ}\n\\item a\n\n\\begin{itemize}\n\\item b\n\\end{itemize}",
    html: "<div>Para</div>\n<div>\\begin{itemize}<br>\n<br>\n\\item a</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">ZZZ</span>b</li></ul>"
  },
  // A wrapper closer written in code is not its closer — for the guard that opens the wrapper and for the
  // walk that collects its body alike. Reading only the first closer left the wrapper transparent and
  // popped it inside the fence: `master` loses an item and emits `<li><></li>` on three of these four.
  {
    name: "a closer in a fence, the real one below, a caption holding a closer",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n```\n\\end{center}\n```\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">```</div>\n<pre><code class=\"hljs\">\\caption{q \\end{itemize} w}\n\\end{center}</code></pre>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a closer in a fence, the real one below, an \\item inside the wrapper",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n```\n\\end{center}\n```\n\\item[x] y\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">```</div>\n<pre><code class=\"hljs\">\\item[x] y\n\\end{center}</code></pre>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a closer inside an lstlisting, the real one below",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n\\begin{lstlisting}\n\\end{center}\n\\end{lstlisting}\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">\\begin{lstlisting}</div>\n<div>\\end{lstlisting}<br>\n w}<br>\n\\end{center}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "two closers in a fence, the real one below",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n```\n\\end{center}\n\\end{center}\n```\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">```</div>\n<div>\\end{center}</div>\n<pre><code class=\"hljs\">\\caption{q \\end{itemize} w}\n\\end{center}</code></pre>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // A tabular nested on one line inside another: the same-line close is decided in one place now, and the
  // frame it used to leave open took the whole list down to literal LaTeX — as it still does on master.
  {
    name: "a one-line nested tabular in a list body",
    latex: "\\begin{itemize}\n\\item a\n\\begin{tabular}{l}\nA & \\begin{tabular}{l}x\\end{tabular} \\\\\n\\end{tabular}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"table_tabular\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">A</td>\n<td style=\"text-align: center; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \"><div class=\"inline-tabular sub-table\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">x</td>\n</tr>\n</tbody>\n</table>\n</div></td>\n</tr>\n</tbody>\n</table>\n</div></div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // A brace inside inline code, an argument opening right where that code ends: skipping the first one
  // must resume on that offset, not past it, or the argument never pairs and the list loses an item.
  {
    name: "a brace in inline code, an argument opening where it ends, a list inside the wrapper",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n`{`{q \\end{itemize} w}\n\\begin{itemize}\\item z\\end{itemize}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"><code>{</code>{q \\end{itemize} w}<br>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>z</li></ul></div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // A list opening inside the wrapper is the only transition argument spans decide, so it is the shape a
  // brace left open elsewhere in the document can blind. `master` renders two items and leaks a closer.
  {
    name: "a list inside the wrapper survives, and its sibling closer stays content",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\begin{itemize}\\item z\\end{itemize}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}<br>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>z</li></ul></div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "the same shape after an unmatched { renders identically",
    latex: "text {\n\n\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n\\begin{itemize}\\item z\\end{itemize}\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<div>text {</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\"> w}<br>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>z</li></ul></div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // A wrapper that closes on its own line hands back a shorter tail, and the opaque walk looks at it
  // again: the second wrapper beside it used to reach the caller as text, keeping the brace that opened
  // it (`}y`). `master` drops the second one entirely.
  {
    name: "two wrappers on one line in a list body both render",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}x\\end{center} \\begin{center}y\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">x</div>\n<div class=\"center\" style=\"text-align: center\">y</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // Whether a list needs a marker-less `<li>` to sit in is asked of the container it opens in, not of the
  // token before it: a list opening after a sibling closes is a direct child too, and got none. The tags
  // balanced either way, so only the `<li>`-only sweep catches it — hence these two.
  {
    name: "a list opening after a sibling closes gets its own host item",
    latex: "\\begin{itemize}\n\\begin{itemize}\\begin{itemize}\\end{itemize}\\end{itemize}\n\\begin{itemize}\\begin{itemize}\\end{itemize}\\end{itemize}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><ul class=\"itemize\" style=\"list-style-type: none\"></ul></li></ul></li><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><ul class=\"itemize\" style=\"list-style-type: none\"></ul></li></ul></li></ul>"
  },
  {
    name: "the host item takes the class of the list that holds it, not the one it opens",
    latex: "\\begin{enumerate}\n\\begin{itemize}\\end{itemize}\n\\begin{itemize}\\end{itemize}\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate not_number\" data-custom-marker=\"true\" data-marker-empty=\"true\" style=\"display: block\"><ul class=\"itemize\" style=\"list-style-type: none\"></ul></li><li class=\"li_enumerate not_number\" data-custom-marker=\"true\" data-marker-empty=\"true\" style=\"display: block\"><ul class=\"itemize\" style=\"list-style-type: none\"></ul></li></ol>"
  },
  // A nested list hosted by a marker-less `<li>` closes it: the close reads whether its own open emitted
  // one, where it used to guess from the next token and left the item open before a sibling.
  {
    name: "a nested list inside a marker-less item closes that item before its sibling",
    latex: "\\begin{itemize}\n\\begin{itemize}\n`\\end{itemize}`\n`\\end{itemize}`\n\\end{itemize}\n{\n\\begin{center}\n\\end{enumerate}\ntext\n\\end{center}\n",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><code>\\end{itemize}</code></li><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><code>\\end{itemize}</code></li></ul></li><li class=\"li_itemize block\" data-custom-marker=\"true\" data-marker-empty=\"true\"><div>{</div>\n<div>\\begin{center}</div>\n</li></ul><div>text<br>\n\\end{center}</div>\n"
  },
  // Closers a later list claims are not the sibling's: counting them all aborted the rule and took the
  // finished list above into a paragraph with it. The pair differs only in what sits further down.
  {
    name: "an unrelated list further down does not make an unclosed sibling look closable",
    latex: "\\begin{itemize}\n\\item a \\end{itemize} \\begin{itemize}\n\\item b\n\nplain\n\n\\begin{itemize}\n\\item c\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><div>\\item b</div>\n<div>plain</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>c</li></ul>"
  },
  {
    name: "the same tail with nothing below it",
    latex: "\\begin{itemize}\n\\item a \\end{itemize} \\begin{itemize}\n\\item b\n\nplain\n",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><div>\\item b</div>\n<div>plain</div>\n"
  },
  // Whether a sibling can close is counted the way the parse loop consumes transitions, so a closer in
  // a code span is not mistaken for the sibling's own.
  {
    name: "a sibling closed from a later line keeps both lists",
    latex: "\\begin{itemize}\n\\item a\n\\end{itemize} \\begin{itemize} \\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a sibling closer in a code span is skipped for the real one below",
    latex: "\\begin{itemize}\n\\item a\n\\end{itemize} \\begin{itemize} \\item b `\\end{itemize}`\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>b <code>\\end{itemize}</code></div>\n</li></ul>"
  },
  // Blocks with no math are skipped by an offset cursor now; these pin what it must not change.
  {
    name: "a wrapper list followed by prose that holds no math",
    latex: "\\begin{itemize}\n\\item a\n\\begin{center}x\\end{center}\n\\end{itemize}\n\nLorem ipsum dolor sit amet.\n\nLorem ipsum dolor sit amet.",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"center\" style=\"text-align: center\">x</div>\n</li></ul><div>Lorem ipsum dolor sit amet.</div>\n<div>Lorem ipsum dolor sit amet.</div>\n"
  },
  {
    name: "an unpaired $ before a blank line leaves the list below it structural",
    latex: "text $x\n\n\\begin{itemize}\\item a\\end{itemize}\n\ny$ tail",
    html: "<div>text $x</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><div>y$ tail</div>\n"
  },
  // Line numbering is off by default, so these carry their own options: a nested list used to reach the
  // renderer with no `map` at all, and then with a zero-width one that read as `count_line="0"`.
  {
    name: "a nested list carries its own line range",
    options: { lineNumbering: true },
    latex: "\\begin{itemize}\n\\item a\n\\begin{itemize}\n\\item b\n\\end{itemize}\n\\item c\n\\end{itemize}",
    html: "<ul class=\"itemize preview-paragraph-0 preview-line 0 1 2 3 4 5 6\" data_line_start=\"0\" data_line_end=\"6\" data_line=\"0,7\" count_line=\"7\" style=\"list-style-type: none\"><li class=\"li_itemize preview-paragraph-1 preview-line 1\" data_line_start=\"1\" data_line_end=\"1\" data_line=\"1,2\" count_line=\"1\" data_parent_line_start=\"0\"><span class=\"li_level\">•</span>a<ul class=\"itemize preview-paragraph-2 preview-line 2 3 4\" data_line_start=\"2\" data_line_end=\"4\" data_line=\"2,5\" count_line=\"3\" style=\"list-style-type: none\"><li class=\"li_itemize preview-paragraph-3 preview-line 3\" data_line_start=\"3\" data_line_end=\"3\" data_line=\"3,4\" count_line=\"1\" data_parent_line_start=\"0\"><span class=\"li_level\">–</span>b</li></ul></li><li class=\"li_itemize preview-paragraph-5 preview-line 5\" data_line_start=\"5\" data_line_end=\"5\" data_line=\"5,6\" count_line=\"1\" data_parent_line_start=\"0\"><span class=\"li_level\">•</span>c</li></ul>"
  },
  {
    name: "a nested enumerate carries its own line range",
    options: { lineNumbering: true },
    latex: "\\begin{enumerate}\n\\item a\n\\begin{enumerate}\n\\item b\n\\end{enumerate}\n\\item c\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal preview-paragraph-0 preview-line 0 1 2 3 4 5 6\" data_line_start=\"0\" data_line_end=\"6\" data_line=\"0,7\" count_line=\"7\" style=\"list-style-type: decimal\"><li class=\"li_enumerate preview-paragraph-1 preview-line 1\" data_line_start=\"1\" data_line_end=\"1\" data_line=\"1,2\" count_line=\"1\" data_parent_line_start=\"0\">a<ol class=\"enumerate lower-alpha preview-paragraph-2 preview-line 2 3 4\" data_line_start=\"2\" data_line_end=\"4\" data_line=\"2,5\" count_line=\"3\" style=\"list-style-type: lower-alpha\"><li class=\"li_enumerate preview-paragraph-3 preview-line 3\" data_line_start=\"3\" data_line_end=\"3\" data_line=\"3,4\" count_line=\"1\" data_parent_line_start=\"0\">b</li></ol></li><li class=\"li_enumerate preview-paragraph-5 preview-line 5\" data_line_start=\"5\" data_line_end=\"5\" data_line=\"5,6\" count_line=\"1\" data_parent_line_start=\"0\">c</li></ol>"
  },
  {
    name: "two sibling lists each number their own lines",
    options: { lineNumbering: true },
    latex: "\\begin{itemize}\n\\item a\n\\end{itemize}\n\n\\begin{itemize}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize preview-paragraph-0 preview-line 0 1 2\" data_line_start=\"0\" data_line_end=\"2\" data_line=\"0,3\" count_line=\"3\" style=\"list-style-type: none\"><li class=\"li_itemize preview-paragraph-1 preview-line 1\" data_line_start=\"1\" data_line_end=\"1\" data_line=\"1,2\" count_line=\"1\" data_parent_line_start=\"0\"><span class=\"li_level\">•</span>a</li></ul><ul class=\"itemize preview-paragraph-4 preview-line 4 5 6\" data_line_start=\"4\" data_line_end=\"6\" data_line=\"4,7\" count_line=\"3\" style=\"list-style-type: none\"><li class=\"li_itemize preview-paragraph-5 preview-line 5\" data_line_start=\"5\" data_line_end=\"5\" data_line=\"5,6\" count_line=\"1\" data_parent_line_start=\"4\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    // The pair below differs only by the trailing paragraph. Its `$` used to pair with the unpaired one
    // in the item, marking the rest of that paragraph verbatim — the wrapper then leaked and `b` was lost.
    name: "an unpaired $ in the item, no paragraph after it",
    latex: "\\begin{itemize}\n\\item a$x\n\\begin{center}\nhere \\end{itemize} more\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a$x</div>\n<div class=\"center\" style=\"text-align: center\">here \\end{itemize} more</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a later paragraph holding a $ leaves the list alone",
    latex: "\\begin{itemize}\n\\item a$x\n\\begin{center}\nhere \\end{itemize} more\n\\end{center}\n\\item b\n\\end{itemize}\n\ntail b$c",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a$x</div>\n<div class=\"center\" style=\"text-align: center\">here \\end{itemize} more</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul><div>tail b$c</div>\n"
  },
  {
    // The remaining three openers that pair inside one inline token, so the rule holds for every
    // marker `RE_MATH_OPEN` admits rather than the two the fixtures happened to name.
    name: "a later paragraph holding a \\) leaves the list alone",
    latex: "\\begin{itemize}\n\\item a\\(x\n\\begin{center}\nhere \\end{itemize} more\n\\end{center}\n\\item b\n\\end{itemize}\n\ntail b\\) c",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a(x</div>\n<div class=\"center\" style=\"text-align: center\">here \\end{itemize} more</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul><div>tail b) c</div>\n"
  },
  {
    name: "a later paragraph holding a $$ leaves the list alone",
    latex: "\\begin{itemize}\n\\item a$$x\n\\begin{center}\nhere \\end{itemize} more\n\\end{center}\n\\item b\n\\end{itemize}\n\ntail b$$ c",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a$$x</div>\n<div class=\"center\" style=\"text-align: center\">here \\end{itemize} more</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul><div>tail b$$ c</div>\n"
  },
  {
    name: "a later paragraph holding a \\\\] leaves the list alone",
    latex: "\\begin{itemize}\n\\item a\\\\[x\n\\begin{center}\nhere \\end{itemize} more\n\\end{center}\n\\item b\n\\end{itemize}\n\ntail b\\\\] c",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a\\[x</div>\n<div class=\"center\" style=\"text-align: center\">here \\end{itemize} more</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul><div>tail b\\] c</div>\n"
  },
  {
    // The inline path applies the counter when the command precedes the item — `value="8"`.
    name: "\\setcounter before the item in a one-line list",
    latex: "text \\begin{enumerate}\\setcounter{enumi}{7}\\item a\\end{enumerate} tail",
    html: "<div>text <ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li value=\"8\" class=\"li_enumerate\">a</li></ol> tail</div>\n"
  },
  {
    // The same pair for `\[`, which pairs inside one inline token as `$` does and so is dropped, not
    // clipped, when its partner is a paragraph away.
    name: "an unpaired \\[ in the item, no paragraph after it",
    latex: "\\begin{itemize}\n\\item a\\[x\n\\begin{center}\nhere \\end{itemize} more\n\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a[x</div>\n<div class=\"center\" style=\"text-align: center\">here \\end{itemize} more</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    // A chunk's sublist goes inside that chunk's `<li>` at every depth. The absorb used to copy a moved
    // range verbatim, so a wrapper inside it was never moved and level 3 landed in an empty sibling.
    name: "a loose chunk at two levels keeps each sublist in its own item",
    latex: "\\begin{itemize}\nloose A\n\\begin{itemize}\nloose B\n\\begin{itemize}\n\\item x\n\\end{itemize}\n\\end{itemize}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">loose A<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">loose B<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">∗</span>x</li></ul></li></ul></li></ul>"
  },
  {
    // Four levels, because the old shape degraded with depth: it left one empty wrapper per level below
    // the first (15 items at depth 8 against 9), so a depth-2 fixture alone would not hold this.
    name: "a loose chunk at four levels leaves no empty wrapper",
    latex: "\\begin{itemize}\nloose A\n\\begin{itemize}\nloose B\n\\begin{itemize}\nloose C\n\\begin{itemize}\nloose D\n\\item leaf\n\\end{itemize}\n\\end{itemize}\n\\end{itemize}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">loose A<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">loose B<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">loose C<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">loose D</li><li class=\"li_itemize\"><span class=\"li_level\">·</span>leaf</li></ul></li></ul></li></ul></li></ul>"
  },
  {
    name: "the same across itemize and enumerate levels",
    latex: "\\begin{itemize}\nloose A\n\\begin{enumerate}\nloose B\n\\begin{itemize}\n\\item leaf\n\\end{itemize}\n\\end{enumerate}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">loose A<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate not_number\" data-custom-marker=\"true\" data-marker-empty=\"true\" style=\"display: block\">loose B<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>leaf</li></ul></li></ol></li></ul>"
  },
  {
    // The depth-1 control: unchanged by that fix, and it is what made the two shapes disagree.
    name: "a loose chunk at one level keeps its sublist inside its item",
    latex: "\\begin{itemize}\nloose A\n\\begin{itemize}\n\\item x\n\\end{itemize}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">loose A<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>x</li></ul></li></ul>"
  },
  {
    // A one-line `tabular` glued to the closer, which `master` dropped the list over. Named by the
    // glued-line sweep as the one shape left in this class that no fixture held.
    name: "a one-line tabular sharing its line with \\end{itemize}",
    latex: "\\begin{itemize}\n\\item a\n\\begin{tabular}{l}x\\end{tabular}\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"table_tabular\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">x</td>\n</tr>\n</tbody>\n</table>\n</div></div>\n</li></ul>"
  },
  {
    name: "a one-line tabular sharing its line with the next \\item",
    latex: "\\begin{itemize}\n\\item a\n\\begin{tabular}{l}x\\end{tabular}\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a</div>\n<div class=\"table_tabular\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">x</td>\n</tr>\n</tbody>\n</table>\n</div></div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    // A wrapper is opaque, so its line is consumed before the counter branch runs — the counter has to
    // be read ahead of that. One per wrapper env: the five behave alike and each takes its own path.
    name: "\\setcounter left of \\begin{center}",
    latex: "\\begin{enumerate}\n\\item a\n\\setcounter{enumi}{3}\\begin{center}\nc\n\\end{center}\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li value=\"4\" class=\"li_enumerate block\"><div>a</div>\n<div class=\"center\" style=\"text-align: center\">c</div>\n</li></ol>"
  },
  {
    name: "\\setcounter left of \\begin{left}",
    latex: "\\begin{enumerate}\n\\item a\n\\setcounter{enumi}{3}\\begin{left}\nc\n\\end{left}\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li value=\"4\" class=\"li_enumerate block\"><div>a</div>\n<div class=\"center\" style=\"text-align: left\">c</div>\n</li></ol>"
  },
  {
    name: "\\setcounter left of \\begin{right}",
    latex: "\\begin{enumerate}\n\\item a\n\\setcounter{enumi}{3}\\begin{right}\nc\n\\end{right}\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li value=\"4\" class=\"li_enumerate block\"><div>a</div>\n<div class=\"center\" style=\"text-align: right\">c</div>\n</li></ol>"
  },
  {
    name: "\\setcounter left of \\begin{table}",
    latex: "\\begin{enumerate}\n\\item a\n\\setcounter{enumi}{3}\\begin{table}\nc\n\\end{table}\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li value=\"4\" class=\"li_enumerate block\"><div>a</div>\n<div class=\"table\">\n<div>c</div>\n</div>\n</li></ol>"
  },
  {
    // `tabular` takes the same opaque path as the five wrappers, and so does `lstlisting`.
    name: "\\setcounter left of \\begin{tabular}",
    latex: "\\begin{enumerate}\n\\item a\n\\setcounter{enumi}{3}\\begin{tabular}{l}q\\end{tabular}\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li value=\"4\" class=\"li_enumerate block\"><div>a</div>\n<div class=\"table_tabular\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">q</td>\n</tr>\n</tbody>\n</table>\n</div></div>\n</li></ol>"
  },
  {
    name: "\\setcounter left of \\begin{figure}",
    latex: "\\begin{enumerate}\n\\item a\n\\setcounter{enumi}{3}\\begin{figure}\nc\n\\end{figure}\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li value=\"4\" class=\"li_enumerate block\"><div>a</div>\n<div class=\"table\">c</div>\n</li></ol>"
  },
  {
    // `\setcounter` keeps its effect (`value="4"`) while the closer sharing its line still reaches the
    // walk. Both were lost before: the remainder went into the item above and the list was dropped.
    name: "\\setcounter sharing its line with \\end{enumerate}",
    latex: "\\begin{enumerate}\n\\item a\n\\setcounter{enumi}{3}\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li value=\"4\" class=\"li_enumerate\">a</li></ol>"
  },
  {
    name: "\\setcounter sharing its line with the next \\item",
    latex: "\\begin{enumerate}\n\\item a\n\\setcounter{enumi}{3}\\item b\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li value=\"4\" class=\"li_enumerate\">a</li><li class=\"li_enumerate\">b</li></ol>"
  },
  {
    // A closer inside a code span is not one: the walk sees it escaped and the span stays content.
    name: "\\setcounter then a closer written in a code span",
    latex: "\\begin{enumerate}\n\\item a\n\\setcounter{enumi}{3}`\\end{enumerate}`\n\\item b\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li value=\"4\" class=\"li_enumerate\">a<code>\\end{enumerate}</code></li><li class=\"li_enumerate\">b</li></ol>"
  },
  {
    // Spaces between the command and the closer: the remainder handed on keeps them, so the offsets
    // the walk anchors on the line's end still hold.
    name: "\\setcounter, spaces, then \\end{enumerate}",
    latex: "\\begin{enumerate}\n\\item a\n\\setcounter{enumi}{3}   \\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li value=\"4\" class=\"li_enumerate\">a</li></ol>"
  },
  {
    name: "\\setcounter, text, then \\end{enumerate}",
    latex: "\\begin{enumerate}\n\\item a\n\\setcounter{enumi}{3} tail \\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li value=\"4\" class=\"li_enumerate\">a<br>\ntail</li></ol>"
  },
  {
    name: "\\setcounter sharing its line with a nested \\begin{enumerate}",
    latex: "\\begin{enumerate}\n\\item a\n\\setcounter{enumi}{3}\\begin{enumerate}\n\\item b\n\\end{enumerate}\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li value=\"4\" class=\"li_enumerate\">a<ol class=\"enumerate lower-alpha\" style=\"list-style-type: lower-alpha\"><li class=\"li_enumerate\">b</li></ol></li></ol>"
  },
  {
    // A `\renewcommand` renders to nothing, but it must not take the rest of its line with it: the
    // structure sharing the line has to reach the walk, or the list finds no closer and is dropped.
    // The command renders to nothing on every shape, glued or alone: it is measured by its own span,
    // so what follows is read on its own and no line break survives.
    name: "\\renewcommand sharing its line with \\end{itemize}",
    latex: "\\begin{itemize}\n\\item a\n\\renewcommand{\\labelitemi}{Z}\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul>"
  },
  {
    name: "\\renewcommand sharing its line with \\end{enumerate}",
    latex: "\\begin{enumerate}\n\\item a\n\\renewcommand{\\labelenumi}{Z}\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate\">a</li></ol>"
  },
  {
    // The line numbers the editors sync on: `b` gets line 2, its own, not the range of the item above.
    // Only a `lineNumbering` variant can see this — the plain HTML was already right.
    name: "\\renewcommand glued with \\item attributes its own line",
    options: { lineNumbering: true },
    latex: "\\begin{itemize}\n\\item a\n\\renewcommand{\\x}{y}\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize preview-paragraph-0 preview-line 0 1 2 3\" data_line_start=\"0\" data_line_end=\"3\" data_line=\"0,4\" count_line=\"4\" style=\"list-style-type: none\"><li class=\"li_itemize preview-paragraph-1 preview-line 1 2\" data_line_start=\"1\" data_line_end=\"2\" data_line=\"1,3\" count_line=\"2\" data_parent_line_start=\"0\"><span class=\"li_level\">•</span>a</li><li class=\"li_itemize preview-paragraph-2 preview-line 2\" data_line_start=\"2\" data_line_end=\"2\" data_line=\"2,3\" count_line=\"1\" data_parent_line_start=\"0\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    // Nested braces in the body: `\Roman{enumii}` must be measured whole, or the stray `}` reaches
    // the walk. A regex without brace pairing gets this one wrong.
    name: "\\renewcommand with nested braces, then \\item",
    latex: "\\begin{enumerate}\n\\item a\n\\renewcommand{\\labelenumii}{\\Roman{enumii}}\\item b\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate\">a</li><li class=\"li_enumerate\">b</li></ol>"
  },
  {
    // The second form: a bare command name as the first argument.
    name: "\\renewcommand\\name{body}, then \\item",
    latex: "\\begin{itemize}\n\\item a\n\\renewcommand\\labelitemii{Q}\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    // Arguments that never close: the span is unknown, so the whole line takes the old path.
    name: "\\renewcommand whose braces do not close on the line",
    latex: "\\begin{itemize}\n\\item a\n\\renewcommand{\\labelitemi}{Z\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    // No `<br>` from the command: only a closer sharing the line has to reach the walk, so the gate
    // asks about that alone. Testing for `\item` too sent this shape to the walk and left the break.
    name: "\\renewcommand sharing its line with the next \\item",
    latex: "\\begin{itemize}\n\\item a\n\\renewcommand{\\labelitemi}{Z}\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "\\renewcommand sharing its line with the next \\item, enumerate",
    latex: "\\begin{enumerate}\n\\item a\n\\renewcommand{\\labelenumi}{Z}\\item b\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate\">a</li><li class=\"li_enumerate\">b</li></ol>"
  },
  {
    // A closer in the macro body used to end the item and emit a close with no opener: `</ul>` landed
    // early, a stray `}` and an `<li>` came out of any list. The three bodies behave alike now.
    name: "\\renewcommand whose body is \\end{itemize}",
    latex: "\\begin{itemize}\n\\item a\n\\renewcommand{\\x}{\\end{itemize}}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "\\renewcommand whose body is \\end{enumerate}",
    latex: "\\begin{enumerate}\n\\item a\n\\renewcommand{\\x}{\\end{enumerate}}\n\\item b\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate\">a</li><li class=\"li_enumerate\">b</li></ol>"
  },
  {
    name: "\\renewcommand whose body is \\begin{itemize}",
    latex: "\\begin{itemize}\n\\item a\n\\renewcommand{\\x}{\\begin{itemize}}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    // `\item` inside the macro body is part of the macro on both paths, so no third item made of the
    // leftover `}` — `master` and the earlier branch state both emitted one.
    name: "\\renewcommand whose body holds \\item, alone on its line",
    latex: "\\begin{itemize}\n\\item a\n\\renewcommand{\\x}{\\item}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "\\renewcommand sharing its line with a nested \\begin{itemize}",
    latex: "\\begin{itemize}\n\\item a\n\\renewcommand{\\labelitemi}{Z}\\begin{itemize}\n\\item b\n\\end{itemize}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>b</li></ul></li></ul>"
  },
  {
    // The inline path: the whole list, the command included, on one line inside a paragraph.
    name: "\\renewcommand inside a one-line list",
    latex: "text \\begin{itemize}\\item a\\renewcommand{\\x}{y}\\end{itemize} tail",
    html: "<div>text <ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul> tail</div>\n"
  },
  {
    // Opener in a span, closer outside it: judging the line by the first match deferred that closer
    // into item content, where it closed a second list and left a stray `</ul>`.
    name: "an opener in a code span does not carry the closer beside it into the item",
    latex: "\\begin{itemize}\n\\item[\\begin{itemize}] k\n\\begin{itemize}\n\\end{enumerate}\n`\\begin{itemize}` \\end{itemize}\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"9.33em\" class=\"itemize\" style=\"padding-inline-start: 9.33em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">\\begin{itemize}</span>k<ul class=\"itemize\" style=\"list-style-type: none\"></ul><code>\\begin{itemize}</code></li></ul><div>\\end{itemize}</div>\n"
  },
  {
    // Between two closed spans, not inside one: structure. Read as text, the tags crossed.
    name: "an opener between two code spans opens a sublist",
    latex: "\\begin{itemize}\n\\item a\n`x` \\begin{itemize} `y`\n\\item inner\n\\end{itemize}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a<br>\n<code>x</code></div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><code>y</code></li><li class=\"li_itemize\"><span class=\"li_level\">–</span>inner</li></ul></li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "a closer between two code spans closes the list",
    latex: "\\begin{itemize}\n\\item a\n`p` \\end{itemize} `q`\n\\item b",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a<br>\n<code>p</code></div>\n</li></ul><div><code>q</code><br>\n\\item b</div>\n"
  },
  {
    // The converse the same predicate must keep answering.
    name: "a closer inside a code span leaves the list alone",
    latex: "\\begin{itemize}\n\\item a\n`\\end{itemize}`\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a<code>\\end{itemize}</code></li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    // The marker is an argument, so the opener written there is its text. Counted as structure, it
    // cost the whole list: 3.0.1 printed the source and left `] a` bare inside the `<ul>`.
    name: "\\item[\\begin{itemize}] keeps the list, marker as text",
    latex: "\\begin{itemize}\n\\item[\\begin{itemize}] a\n\\item b\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"9.33em\" class=\"itemize\" style=\"padding-inline-start: 9.33em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">\\begin{itemize}</span>a</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    // The scan skips the optional marker, so the opener written there is the marker's text and the
    // list keeps both items. The block path still loses it — pinned above.
    name: "\\item[\\begin{itemize}] keeps the list, marker as text, on the inline path",
    latex: "text \\begin{itemize}\\item[\\begin{itemize}] a\\item b\\end{itemize} tail",
    html: "<div>text <ul data-padding-inline-start=\"9.33em\" class=\"itemize\" style=\"padding-inline-start: 9.33em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">\\begin{itemize}</span>a</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul> tail</div>\n"
  },
  {
    // Same for a closer: it used to end the list before the marker was read, leaving `[` as the item
    // text and printing the rest literally.
    name: "\\item[\\end{itemize}] keeps the list, marker as text",
    latex: "\\begin{itemize}\n\\item[\\end{itemize}] a\n\\item b\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"8.31em\" class=\"itemize\" style=\"padding-inline-start: 8.31em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">\\end{itemize}</span>a</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    // A custom marker is a second entrance to the same marker parse: structure written there is
    // text, or the `<li>` it opened landed inside `<span class="li_level">`.
    name: "\\item[\\item] keeps the marker as text, on the block path",
    latex: "\\begin{itemize}\n\\item[\\item] a\n\\item b\n\\end{itemize}",
    html: "<ul data-padding-inline-start=\"3.57em\" class=\"itemize\" style=\"padding-inline-start: 3.57em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">\\item</span>a</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "\\item[\\item] keeps the marker as text, on the inline path",
    latex: "text \\begin{itemize}\\item[\\item] a\\item b\\end{itemize} tail",
    html: "<div>text <ul data-padding-inline-start=\"3.57em\" class=\"itemize\" style=\"padding-inline-start: 3.57em; list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">\\item</span>a</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul> tail</div>\n"
  },
  {
    // The two container pairs the loose-chunk host was not pinned for. The host `<li>` follows the
    // list that holds it, and the sublist keeps its own nesting level.
    name: "a sublist after a loose chunk, enumerate inside enumerate",
    latex: "\\begin{enumerate}\nloose\n\\begin{enumerate}\n\\item x\n\\end{enumerate}\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate not_number\" data-custom-marker=\"true\" data-marker-empty=\"true\" style=\"display: block\">loose<ol class=\"enumerate lower-alpha\" style=\"list-style-type: lower-alpha\"><li class=\"li_enumerate\">x</li></ol></li></ol>"
  },
  {
    name: "a sublist after a loose chunk, enumerate inside itemize",
    latex: "\\begin{itemize}\nloose\n\\begin{enumerate}\n\\item x\n\\end{enumerate}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">loose<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate\">x</li></ol></li></ul>"
  },
  {
    // A closer anywhere in the raw chunk dropped it whole, so the text vanished with no warning and
    // an empty `<ul>` was left. The drop reads the masked text now.
    name: "a chunk holding a closer in a code span keeps its text",
    latex: "\\begin{itemize}\nkeep `\\end{itemize}` me \\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">keep <code>\\end{itemize}</code> me</li></ul>"
  },
  {
    name: "the same in an enumerate",
    latex: "\\begin{enumerate}\nkeep `\\end{enumerate}` me \\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate not_number\" data-custom-marker=\"true\" data-marker-empty=\"true\" style=\"display: block\">keep <code>\\end{enumerate}</code> me</li></ol>"
  },
  {
    name: "the same with the span holding the other list's closer",
    latex: "\\begin{enumerate}\nkeep `\\end{itemize}` me \\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate not_number\" data-custom-marker=\"true\" data-marker-empty=\"true\" style=\"display: block\">keep <code>\\end{itemize}</code> me</li></ol>"
  },
  {
    // The control the drop exists for: a chunk that is a closer and nothing else takes no `<li>`.
    name: "a chunk that is only a closer is still dropped",
    latex: "\\begin{itemize}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"></ul>"
  },
  {
    // A closer past the last open list has nothing to close and stays text: it used to emit a bare
    // `</ul>`. The list below it is unaffected.
    name: "a second closer on the opening line stays text",
    latex: "\\begin{itemize} \\end{itemize} \\end{itemize}\n\\begin{enumerate}\n\\item a\n\\end{enumerate}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"> </ul> \\end{itemize}<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate\">a</li></ol>"
  },
  {
    // Every command on this line fires with no list open, so the whole line stays literal where it
    // used to leave a stray `</ul>`, an unclosed `<li>` and an unclosed `<ol>`.
    name: "\\item and \\end with no list open leave the line literal",
    latex: "\\begin{itemize} \\item[X] b \\end{enumerate} \\end{itemize} \\item a \\begin{enumerate}",
    html: "<div>\\begin{itemize} \\item[X] b \\end{enumerate} \\end{itemize} \\item a \\begin{enumerate}</div>\n"
  },
  {
    // An `\item` past the closer has no list to sit in, so it stays text: it used to emit an `<li>`
    // outside any list, which left the markup unusable.
    name: "an \\item after \\end{itemize} on one line stays text",
    latex: "\\begin{itemize} \\item a \\end{itemize} \\item[X] b",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"> <li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul> \\item[X] b"
  },
  {
    // A marker body is parsed with the block flag still set, so the list written here opened a real
    // one inside the `<span>` and left the markup crossed.
    name: "a list written in a marker body stays text in the marker",
    latex: "\\begin{itemize}\n\\item a\n\\begin{enumerate}\n\\renewcommand{\\labelitemi}{\\begin{itemize}}\\end{itemize}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">\\begin{itemize}</span>a<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"></ol></li></ul>"
  },
  {
    name: "\\item written in a marker body stays text in the marker",
    latex: "\\renewcommand{\\labelitemi}{\\item x}\n\n\\begin{itemize}\n\\item a\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">\\item x</span>a</li></ul>"
  },
  {
    // The span reader measures `[1]`, so the rule applying the command has to skip it too — it used
    // to take `[1]{Z` for the marker.
    name: "a marker command with an optional argument",
    latex: "\\renewcommand{\\labelitemi}[1]{Z}\n\n\\begin{itemize}\n\\item a\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">Z</span>a</li></ul>"
  },
  // Space before that argument is legal LaTeX, and the span reader already measured these — the rule
  // applying the command took `[1]{Z` for the marker, so the two readers of one syntax disagreed.
  {
    name: "the same with a space before the optional argument",
    latex: "\\renewcommand{\\labelitemi} [1]{Z}\n\n\\begin{itemize}\n\\item a\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">Z</span>a</li></ul>"
  },
  {
    name: "the same with a tab before it",
    latex: "\\renewcommand{\\labelitemi}\t[1]{Z}\n\n\\begin{itemize}\n\\item a\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">Z</span>a</li></ul>"
  },
  {
    // Bare command name: the brace opening the body was not counted, so the argument ended at the
    // first inner `}` and the rest of it joined the item above.
    name: "\\renewcommand with a bare name and a nested brace in its body",
    latex: "\\begin{itemize}\n\\item a\n\\renewcommand\\x{p{q}r}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    // Both scanners read a macro body the same way now: the inline one used to end the list on the
    // closer written there, which dropped every item after it.
    name: "a closer in a \\renewcommand body does not end a one-line list",
    latex: "text \\begin{itemize}\\item a\\renewcommand{\\x}{\\end{itemize}}\\item b\\end{itemize} tail",
    html: "<div>text <ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul> tail</div>\n"
  },
  {
    // A list whose only closer sits in a macro body is unterminated, so it stays literal LaTeX —
    // the same answer a list with no closer at all gets.
    name: "a list whose only closer is inside a \\renewcommand body stays literal",
    latex: "\\begin{itemize}\n\\item a\n\\renewcommand{\\x}{\\end{itemize}}",
    html: "<div>\\begin{itemize}<br>\n\\item a<br>\n</div>\n"
  },
  {
    // The star is part of the command, not of its name: read as a name it left the definition
    // unconsumed, and the closer in its body escaped the list as a stray `</ul>`.
    name: "\\renewcommand* whose body holds a closer, after a loose chunk",
    latex: "\\begin{itemize}\nloose\n\\renewcommand*{\\x}{\\end{itemize}}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">loose</li></ul>"
  },
  {
    name: "\\renewcommand* whose body holds a closer, after an item",
    latex: "\\begin{itemize}\n\\item a\n\\renewcommand*{\\x}{\\end{itemize}}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  {
    name: "\\renewcommand* whose body holds a closer, in an enumerate",
    latex: "\\begin{enumerate}\nloose\n\\renewcommand*{\\x}{\\end{enumerate}}\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate not_number\" data-custom-marker=\"true\" data-marker-empty=\"true\" style=\"display: block\">loose</li></ol>"
  },
  {
    // Item-less list: the same empty `<ol>` the bare and the unstarred forms give. The starred one
    // used to leave its definition behind as a fake item.
    name: "\\renewcommand* alone in a list leaves it item-less",
    latex: "\\begin{enumerate}\n\\renewcommand*{\\labelitemi}{Z}\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"></ol>"
  },
  {
    name: "\\renewcommand* switches the marker, like the unstarred form",
    latex: "\\renewcommand*{\\labelitemi}{Z}\n\n\\begin{itemize}\n\\item a\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">Z</span>a</li></ul>"
  },
  {
    name: "\\renewcommand* inside a one-line list",
    latex: "text \\begin{itemize}\\item a\\renewcommand*{\\x}{y}\\end{itemize} tail",
    html: "<div>text <ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul> tail</div>\n"
  },
  {
    // LaTeX allows two optional arguments here. Measuring one left the span unknown, and the line was
    // then swallowed whole — the closer on it with it, so the list stayed open.
    name: "\\renewcommand with two optional arguments, closer on its line",
    latex: "\\begin{itemize}\n\\item a\n\\renewcommand{\\x}[1][d]{#1}\\end{itemize}\n\\end{enumerate}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><div>\\end{enumerate}</div>\n"
  },
  {
    name: "\\renewcommand with two optional arguments, cross-named closer",
    latex: "\\begin{enumerate}\n\\renewcommand{\\labelitemi}{Z}\\begin{itemize}\n\\renewcommand{\\x}[1][d]{#1}\\end{itemize}\n\\end{itemize}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate not_number\" data-custom-marker=\"true\" data-marker-empty=\"true\" style=\"display: block\"><ul class=\"itemize\" style=\"list-style-type: none\"></ul></li></ol>"
  },
  {
    // A span that cannot be measured leaves the body's end unknown, so the line goes to the walk and
    // keeps its `<br>`: losing the closer would leave the list open, which is the worse trade.
    name: "\\renewcommand with an unclosed brace, closer on its line",
    latex: "\\begin{itemize}\n\\item a\n\\renewcommand{\\x}{oops\\end{itemize}\n\\end{enumerate}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a<br>\n</li></ul><div>\\end{enumerate}</div>\n"
  },
  {
    name: "\\renewcommand with an unclosed bracket, closer on its line",
    latex: "\\begin{itemize}\n\\item a\n\\renewcommand{\\x}[1{#1}\\end{itemize}\n\\end{enumerate}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a<br>\n</li></ul><div>\\end{enumerate}</div>\n"
  },
  {
    name: "a nested list opened flush wraps its loose content in an <li>",
    latex: "\\begin{enumerate}\\begin{itemize}```\n\\end{itemize}\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate not_number\" data-custom-marker=\"true\" data-marker-empty=\"true\" style=\"display: block\"><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">```</li></ul></li></ol>"
  },
  {
    name: "the same with plain text, not a fence",
    latex: "\\begin{enumerate}\\begin{itemize}text\n\\end{itemize}\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate not_number\" data-custom-marker=\"true\" data-marker-empty=\"true\" style=\"display: block\"><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">text</li></ul></li></ol>"
  },
  {
    // A net count of closers ahead let the unclosed list below subtract the one the sibling reaches
    // first, and both lists fell out as literal LaTeX. The unclosed tail stays literal, as it must.
    name: "a sibling list is built even with an unclosed list below it",
    latex: "\\begin{itemize}\n\\item a\n\\end{itemize} \\begin{itemize}\n\\item b\n\\end{itemize}\n\\begin{itemize}\n\\item c\n",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul><div>\\begin{itemize}<br>\n\\item c</div>\n"
  },
  {
    // The word `item` inside a continuation line used to make it a new chunk, so the two lines were
    // joined with nothing between them (`asome item text`). It is a line like any other now.
    name: "a continuation line holding the word item keeps its break",
    latex: "\\begin{itemize}\n\\item a\nsome item text\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a<br>\nsome item text</li></ul>"
  },
  {
    // `encodeURI` throws on a lone surrogate, and the throw used to take the whole render with it.
    name: "a lone surrogate in a marker empties its docx attribute, not the document",
    options: { forDocx: true },
    latex: "\\begin{itemize}\n\\item[x\ud800y] a\n\\item[ok] b\n\\end{itemize}",
    html: "<ul class=\"itemize\" data-custom-marker-type=\"text\" data-custom-marker-content=\"%E2%80%A2\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-custom-marker-type=\"text\" data-custom-marker-content=\"\"><span class=\"li_level\" data-custom-marker=\"true\" data-custom-marker-type=\"text\" data-custom-marker-content=\"\">x\ud800y</span>a</li><li class=\"li_itemize\" data-custom-marker=\"true\" data-custom-marker-type=\"text\" data-custom-marker-content=\"ok\"><span class=\"li_level\" data-custom-marker=\"true\" data-custom-marker-type=\"text\" data-custom-marker-content=\"ok\">ok</span>b</li></ul>"
  },
  {
    name: "a list closed by an inline \\end in the body gets no second closing tag",
    latex: "\\begin{itemize}\n\\caption{c\n\\renewcommand{\\x}{\\end{itemize}}\n\\caption{\\end{itemize}}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\">{</li></ul>}<br>\n\\caption{<div>}</div>\n"
  },
  {
    name: "an opener in a code span in the tail is not a sibling, and the closer after it emits no tag",
    latex: "\\begin{enumerate}\n\\item[W] \\end{enumerate} `\\begin{itemize}` \\end{itemize}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate not_number\" data-custom-marker=\"true\" style=\"display: block\"><span class=\"li_level\" data-custom-marker=\"true\">W</span></li></ol>"
  },
  // An opener written mid-paragraph: the env spans the paragraph's own lines, so the paragraph must not
  // end inside it — cut there, half of the env went to a block below and the rest printed as LaTeX.
  // The second shape is the control: a list on its own line after a paragraph is still its own block.
  {
    name: "a list opened mid-paragraph keeps its levels",
    latex: "text \\begin{itemize}\\item a\n\\begin{itemize}\\item b\\end{itemize} \\begin{center}x\\end{center}\n\\end{itemize} tail",
    html: "<div>text <ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>b</li></ul><div class=\"center\" style=\"text-align: center\">x</div></li></ul> tail</div>\n"
  },
  {
    // The fence opens where it is written — right after the closer — because the leftover of that line is
    // handed back to the block phase, so `q` is its content and the list's outer closer stays text. Read
    // from the line below instead, the fence started late and swallowed that closer.
    name: "a fence written after the closer opens where it stands",
    latex: "text \\begin{itemize}\n\\item i0\n\\begin{itemize}\n\\item i1\n\\end{itemize} ```\nq\n```\n\\end{itemize}\n",
    html: "<div>text \\begin{itemize}<br>\n\\item i0</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>i1</li></ul><pre><code class=\"hljs\">q\n</code></pre>\n<div>\\end{itemize}</div>\n"
  },
  {
    // A backtick run with no partner is text, so nothing after it is code — read as code to the end of
    // the source, it hid this list's own `\end` from the inline scanner and the whole env was text.
    name: "an unmatched backtick run does not hide the closer from the inline scanner",
    latex: "text \\begin{itemize}\n\\item i0\n\\begin{itemize}\n\\item i1\n\\end{itemize} ```\nq\n\\end{itemize}",
    html: "<div>text <ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>i0<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>i1</li></ul>```<br>\nq</li></ul></div>\n"
  },
  {
    name: "a list after a paragraph stays a block of its own",
    latex: "para text\n\\begin{itemize}\n\\item a\n\\end{itemize}",
    html: "<div>para text</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul>"
  },
  // Text after the outermost closer is handed back to the block phase by offset, so it renders instead of
  // being dropped. The line keeps its `sCount`, which names the container: zeroed, the leftover read as
  // dedented and left its markdown item, breaking that list in two — hence the nested shapes here.
  {
    name: "text after the closer renders instead of being dropped",
    latex: "\\begin{itemize}\n\\item a\n\\end{itemize} tail text",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><div>tail text</div>\n"
  },
  {
    // The control for the one-level form pinned as a quirk: two closers for two levels leave a leftover
    // the walk can hand back, where an extra closer over one level makes the whole chunk read as
    // end-of-list commands and drops it.
    name: "collapsed closers for two levels keep the text beside them",
    latex: "\\begin{itemize}\n\\item a\n\\begin{itemize}\n\\item b\n\\end{itemize}\\end{itemize} trailing\n",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>b</li></ul></li></ul><div>trailing</div>\n"
  },
  {
    name: "the same inside a markdown item stays in that item",
    latex: "- \\begin{itemize}\n  \\item a\n  \\end{itemize} tail text\n- second",
    html: "<ul>\n<li>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul>tail text</li>\n<li>second</li>\n</ul>\n"
  },
  {
    name: "the same inside a blockquote stays in the quote",
    latex: "> \\begin{itemize}\n> \\item a\n> \\end{itemize} tail text\n> after",
    html: "<blockquote>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><div>tail text<br>\nafter</div>\n</blockquote>\n"
  },
  // A closer sharing its line with the env after it: the opaque pass read the whole line first and took
  // the closer into the item body, so the level went missing and the rest came out as literal LaTeX.
  // Valid LaTeX, and the tags balanced either way, so only these pin it. The last two render a level
  // `master` loses as well.
  {
    name: "a closer followed by a wrapper on one line keeps its level",
    latex: "\\begin{itemize}\n\\item a\n\\begin{itemize}\n\\item b\n\\end{itemize} \\begin{center}x\\end{center}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>b</li></ul><div class=\"center\" style=\"text-align: center\">x</div>\n</li></ul>"
  },
  {
    name: "an item before that closer is still an item",
    latex: "\\begin{itemize}\n\\item a\n\\begin{itemize}\n\\item b\n\\item c \\end{itemize} \\begin{center}x\\end{center}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>b</li><li class=\"li_itemize\"><span class=\"li_level\">–</span>c</li></ul><div class=\"center\" style=\"text-align: center\">x</div>\n</li></ul>"
  },
  {
    name: "the same for an enumerate, which keeps its numbering depth",
    latex: "\\begin{enumerate}\n\\item a\n\\begin{enumerate}\n\\item b\n\\end{enumerate} \\begin{center}x\\end{center}\n\\end{enumerate}",
    html: "<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate\">a<ol class=\"enumerate lower-alpha\" style=\"list-style-type: lower-alpha\"><li class=\"li_enumerate\">b</li></ol><div class=\"center\" style=\"text-align: center\">x</div>\n</li></ol>"
  },
  {
    name: "a closer followed by a tabular on one line keeps its level",
    latex: "\\begin{itemize}\n\\item a\n\\begin{itemize}\n\\item b\n\\end{itemize} \\begin{tabular}{l}q\\end{tabular}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>b</li></ul><div class=\"table_tabular\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">q</td>\n</tr>\n</tbody>\n</table>\n</div></div>\n</li></ul>"
  },
  {
    name: "two closers and a wrapper on one line keep all three levels",
    latex: "\\begin{itemize}\n\\item a\n\\begin{itemize}\n\\item b\n\\begin{itemize}\n\\item c\n\\end{itemize}\\end{itemize} \\begin{center}x\\end{center}\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">–</span>b<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">∗</span>c</li></ul></li></ul><div class=\"center\" style=\"text-align: center\">x</div>\n</li></ul>"
  },
  {
    // Three branches of the `[...]` reader, each deciding whether the sibling's closer is an argument.
    name: "a sibling closer inside a command argument does not open it",
    latex: "\\begin{itemize}\n\\item a\\end{itemize}\\begin{enumerate}\n\\item b\n\\caption[o]{\\end{enumerate}}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><div>\\item b<br>\n\\caption[o]{\\end{enumerate}}</div>\n"
  },
  {
    name: "an option with no ] leaves the group after it an argument of nothing",
    latex: "\\begin{itemize}\n\\item a\\end{itemize}\\begin{enumerate}\n\\item b\n\\caption[o {\\end{enumerate}}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate\">b<br>\n\\caption[o {</li></ol><div>}</div>\n"
  },
  {
    name: "an option closing a line below is text, and the sibling opens",
    latex: "\\begin{itemize}\n\\item a\\end{itemize}\\begin{enumerate}\n\\item b\n\\caption[o\nq]{\\end{enumerate}}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul><ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate\">b<br>\n\\caption[o<br>\nq]{</li></ol><div>}</div>\n"
  },
  {
    name: "a later paragraph holding a \\] leaves the list alone",
    latex: "\\begin{itemize}\n\\item a\\[x\n\\begin{center}\nhere \\end{itemize} more\n\\end{center}\n\\item b\n\\end{itemize}\n\ntail b\\] c",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\"><span class=\"li_level\">•</span><div>a[x</div>\n<div class=\"center\" style=\"text-align: center\">here \\end{itemize} more</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul><div>tail b] c</div>\n"
  },
];
