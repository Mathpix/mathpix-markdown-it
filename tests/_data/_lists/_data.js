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
                  '<span class="li_level">.</span>' +
                  'Third Level' +
                  '<ul class="itemize" style="list-style-type: none">' +
                    '<li class="li_itemize">' +
                      '<span class="li_level">.</span>' +
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
    latex: '\\begin{itemize}\\item One entry in the list\\item Another entry in the list\\end{itemize}\\renewcommand\\labelitemi{\\textquestiondown}\n' +
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
  }
];
