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
  {
    mmd: '© LPC Buddy\n' +
      '\n' +
      '\\textbf{Conflicts of Interest}\n' +
      '\\begin{itemize}\n' +
      '\\item[] - \\textit{Legal Foundations,} Chapter 13\n' +
      '\n' +
      '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\begin{tabular}{l}\n' +
      '\\textbf{OWN INTEREST} \\textbf{CONFLICTS} \\\\\n' +
      '\\textit{Legal Foundations} \\textit{13.5} \\\\\n' +
      'Para 6.1 CFS & CFF\n' +
      '\\end{tabular} & \\begin{tabular}{l}\n' +
      '\\begin{itemize}\n' +
      '\\item[] - Para 6.1 CFS & CFF:\n' +
      '\\begin{itemize}\n' +
      '\\item[] - \\textbf{Do not act} if there is:\n' +
      '\\begin{itemize}\n' +
      '\\item[] - An \\textbf{own interest conflict} or\n' +
      '\\item[] - A significant risk of an own interest conflict.\n' +
      '\\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\item[] - \\textbf{Absolute. No exceptions.}\n' +
      '\\item[] - \\textbf{Own interest =} a conflict with the solicitor’s personal interests. \\\\\n' +
      '\\item[] - “Own interest conflict” is defined in the SRA glossary as \\textit{“any situation where your} \\textit{\\textbf{duty to act in the best interests} of any client in relation to a matter \\textbf{conflicts,} or} \\textit{there is a \\textbf{significant risk} that it may conflict, with \\textbf{your own interests..."}}\n' +
      '\\end{itemize}\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\n' +
      '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\begin{tabular}{l}\n' +
      '\\textbf{CONFLICTS OF} \\textbf{INTEREST} \\textbf{BETWEEN} \\textbf{CLIENTS}\\( { }^{\\mathbf{1}} \\) \\\\\n' +
      '\\textit{Legal Foundations} \\textit{13.3-13.4} \\\\\n' +
      'Para 6.2 CFS & CFF\n' +
      '\\end{tabular} & \\begin{tabular}{l}\n' +
      '\\begin{itemize}\n' +
      '\\item[] - Para 6.2 CFS & CFF:\n' +
      '\\begin{itemize}\n' +
      '\\item[] - \\textbf{You do not act where there is}\n' +
      '\\begin{itemize}\n' +
      '\\item[] - \\textbf{A conflict of interest or}\n' +
      '\\item[] - \\textbf{A significant risk of such a conflict}\n' +
      '\\end{itemize}\n' +
      '\\item[] - \\textbf{UNLESS an exception under para 6.2(afi or 6.2(bfi applies.}\n' +
      '\\end{itemize} \\\\\n' +
      '\\item[] - Conflict of interest = \\textit{where you owe separate \\textbf{duties to act in the best interests of}} \\textbf{\\textit{two or more clients in relation to the same or a related matters conflict}} (SRA \\\\\n' +
      'Glossary). \\\\\n' +
      '\\item[] - A conflict of interest can only arise between two \\textbf{\\textit{current}} clients. \\\\\n' +
      '\\begin{itemize}\n' +
      '\\item[] - A firm no longer owes a duty to act in a client’s best interests after their retainer has been terminated. \\\\\n' +
      '\\item[] - \\textbf{HOWEVER}, acting for a new client in a matter which conflicts with the matter of a previous client may \\textbf{breach a solicitor’s duty of confidentiality} under Part 6 of the CFS /CFF.\n' +
      '\\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\textbf{Conflict Risk} \\textbf{Factors} \\& \\begin{tabular}{l}\n' +
      '\\begin{itemize}\n' +
      '\\item[] - \\textbf{Consider:} \\\\\n' +
      '\\begin{itemize}\n' +
      '\\item[] - Do the clients’ interests directly conflict; e.g., claimant and defendant in litigation? \\\\\n' +
      '\\item[] - Is there a risk that you may need to negotiate on matters of substance between the clients? \\\\\n' +
      '\\item[] - Is there a risk of an inequality of bargaining power between the clients? \\\\\n' +
      '\\item[] - Is there a conflict concerning a particular aspect of a matter rather than the matter as a whole?\n' +
      '\\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{tabular}\n' +
      '\\\\\n' +
      '\\hline \\textbf{EXCEPTIONS} & - Where there is a conflict of interest \\textit{BETWEEN CLIENTS}: \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{itemize}\n' +
      '\\( { }^{1} \\) Introduction to Professional Practice, Professional Conduct Workshop 1, Prep Task 3, Question 2\n' +
      '\n' +
      '© LPC Buddy',
    html: '<div>© LPC Buddy</div>\n' +
      '<div><strong>Conflicts of Interest</strong></div>\n' +
      '<ul class="itemize" style="list-style-type: none">' +
      '<li class="li_itemize block" data-custom-marker="true" data-marker-empty="true">' +
      '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
      '<div>- <em>Legal Foundations,</em> Chapter 13</div>\n' +
      '<div class="table_tabular">\n' +
      '<div class="inline-tabular">' +
      '<table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><strong>OWN INTEREST</strong> <strong>CONFLICTS</strong></td>\n' +
      '<td style="text-align: center; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><em>Legal Foundations</em> <em>13.5</em></td>\n' +
      '<td style="text-align: center; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Para 6.1 CFS</td>\n' +
      '<td style="text-align: center; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">CFF</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">\n' +
      '<div class="table_tabular">\n' +
      '<table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- Para 6.1 CFS &amp; CFF:<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- <strong>Do not act</strong> if there is:<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- An <strong>own interest conflict</strong> or</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- A significant risk of an own interest conflict.</li></ul></li></ul></li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- <strong>Absolute. No exceptions.</strong></li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- <strong>Own interest =</strong> a conflict with the solicitor’s personal interests. \\</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- “Own interest conflict” is defined in the SRA glossary as <em>“any situation where your</em> <em><strong>duty to act in the best interests</strong> of any client in relation to a matter <strong>conflicts,</strong> or</em> <em>there is a <strong>significant risk</strong> that it may conflict, with <strong>your own interests...&quot;</strong></em></li></ul></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div>\n' +
      '</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></div>\n' +
      '<div class="table_tabular">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><strong>CONFLICTS OF</strong> <strong>INTEREST</strong> <strong>BETWEEN</strong> <strong>CLIENTS</strong><span class="math-inline " data-overflow="visible">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0;" xmlns="http://www.w3.org/2000/svg" width="1.108ex" height="1.869ex" role="img" focusable="false" viewBox="0 -826.2 489.6 826.2"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="msup"><g data-mml-node="TeXAtom" data-mjx-texclass="ORD"></g><g data-mml-node="TeXAtom" transform="translate(33,363) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="TeXAtom" data-mjx-texclass="ORD"><g data-mml-node="mn"><path data-c="1D7CF" d="M481 0L294 3Q136 3 109 0H96V62H227V304Q227 546 225 546Q169 529 97 529H80V591H97Q231 591 308 647L319 655H333Q355 655 359 644Q361 640 361 351V62H494V0H481Z"></path></g></g></g></g></g></g></svg></mjx-container></span></td>\n' +
      '<td style="text-align: center; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><em>Legal Foundations</em> <em>13.3-13.4</em></td>\n' +
      '<td style="text-align: center; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Para 6.2 CFS</td>\n' +
      '<td style="text-align: center; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">CFF</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">\n' +
      '<div class="table_tabular">\n' +
      '<table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- Para 6.2 CFS &amp; CFF:<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- <strong>You do not act where there is</strong><ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- <strong>A conflict of interest or</strong></li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- <strong>A significant risk of such a conflict</strong></li></ul></li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- <strong>UNLESS an exception under para 6.2(afi or 6.2(bfi applies.</strong></li></ul>\\</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- Conflict of interest = <em>where you owe separate <strong>duties to act in the best interests of</strong></em> <strong><em>two or more clients in relation to the same or a related matters conflict</em></strong> (SRA \\<br>\n' +
      'Glossary). \\</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- A conflict of interest can only arise between two <strong><em>current</em></strong> clients. \\<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- A firm no longer owes a duty to act in a client’s best interests after their retainer has been terminated. \\</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- <strong>HOWEVER</strong>, acting for a new client in a matter which conflicts with the matter of a previous client may <strong>breach a solicitor’s duty of confidentiality</strong> under Part 6 of the CFS /CFF.</li></ul></li></ul><div class="table_tabular">\n' +
      '<table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">\n' +
      '<div>\n' +
      '<strong>Conflict Risk</strong> <strong>Factors</strong> &amp;</div>\n' +
      '<div class="table_tabular">\n' +
      '<table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- <strong>Consider:</strong> \\<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- Do the clients’ interests directly conflict; e.g., claimant and defendant in litigation? \\</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- Is there a risk that you may need to negotiate on matters of substance between the clients? \\</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- Is there a risk of an inequality of bargaining power between the clients? \\</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- Is there a conflict concerning a particular aspect of a matter rather than the matter as a whole?</li></ul></li></ul></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div>\n' +
      '</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div>\n' +
      '</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div>\n' +
      '</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><strong>EXCEPTIONS</strong></td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">- Where there is a conflict of interest <em>BETWEEN CLIENTS</em>:</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></div>\n' +
      '</ul><div><span class="math-inline " data-overflow="visible">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0;" xmlns="http://www.w3.org/2000/svg" width="0.988ex" height="1.887ex" role="img" focusable="false" viewBox="0 -833.9 436.6 833.9"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="msup"><g data-mml-node="TeXAtom" data-mjx-texclass="ORD"></g><g data-mml-node="TeXAtom" transform="translate(33,363) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mn"><path data-c="31" d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z"></path></g></g></g></g></g></svg></mjx-container></span> Introduction to Professional Practice, Professional Conduct Workshop 1, Prep Task 3, Question 2</div>\n' +
      '<div>© LPC Buddy</div>\n'
  },
  {
    mmd: '\\begin{tabular}{|l|l|}\n' +
      '\\hline cell & \n' +
      '\\begin{tabular}{l}\n' +
      '\\begin{itemize}\n' +
      '\\item[] - item 1.1\n' +
      '\\begin{itemize}\n' +
      '\\item[] - item 2.1\n' +
      '\\end{itemize}\n' +
      '\\begin{tabular}{|l|l|}\n' +
      '\\hline text & y\n' +
      '\\\\\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{itemize}\n' +
      '\\end{tabular}\n' +
      '\\\\\\hline\n' +
      't1 & t2 \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n',
    html:
      '<div class="table_tabular" style="text-align: center">\n' +
        '<div class="inline-tabular">' +
          '<table class="tabular">\n' +
            '<tbody>\n' +
              '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">' +
                  'cell' +
                '</td>\n' +
                '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">\n' +
                  '<div class="table_tabular">\n' +
                    '<table class="tabular">\n' +
                      '<tbody>\n' +
                        '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                          '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
                            '<ul class="itemize" style="list-style-type: none">' +
                              '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
                                '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
                                '- item 1.1' +
                                '<ul class="itemize" style="list-style-type: none">' +
                                  '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
                                    '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
                                    '- item 2.1' +
                                  '</li>' +
                                '</ul>' +
                                '<table class="tabular">\n' +
                                  '<tbody>\n' +
                                    '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                                      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">' +
                                        'text' +
                                      '</td>\n' +
                                      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">' +
                                        'y' +
                                      '</td>\n' +
                                    '</tr>\n' +
                                  '</tbody>\n' +
                                '</table>\n' +
                              '</li>' +
                            '</ul>' +
                          '</td>\n' +
                        '</tr>\n' +
                      '</tbody>\n' +
                    '</table>\n' +
                  '</div>\n' +
                '</td>\n' +
              '</tr>\n' +
              '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
                '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">' +
                  't1' +
                '</td>\n' +
                '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">' +
                  't2' +
                '</td>\n' +
              '</tr>\n' +
            '</tbody>\n' +
          '</table>\n' +
        '</div>' +
      '</div>\n'
  },
  {
    mmd: '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\textbf{Conflict Risk} \\textbf{Factors} \\& \\begin{tabular}{l}\n' +
      '\\begin{itemize}\n' +
      '\\item[] - \\textbf{Consider:} \\\\\n' +
      '\\begin{itemize}\n' +
      '\\item[] - Do the clients’ interests directly conflict; e.g., claimant and defendant in litigation? \\\\\n' +
      '\\item[] - Is there a risk that you may need to negotiate on matters of substance between the clients? \\\\\n' +
      '\\item[] - Is there a risk of an inequality of bargaining power between the clients? \\\\\n' +
      '\\item[] - Is there a conflict concerning a particular aspect of a matter rather than the matter as a whole?\n' +
      '\\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\end{tabular}\n' +
      '\\\\\\hline\n' +
      '\\end{tabular}',
    html: '' +
      '<div class="table_tabular" style="text-align: center">\n' +
      '<div class="inline-tabular">' +
      '<table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">\n' +
      '<div>\n' +
      '<strong>Conflict Risk</strong> <strong>Factors</strong> &amp;</div>\n' +
      '<div class="table_tabular">\n' +
      '<table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- <strong>Consider:</strong> \\<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- Do the clients’ interests directly conflict; e.g., claimant and defendant in litigation? \\</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- Is there a risk that you may need to negotiate on matters of substance between the clients? \\</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- Is there a risk of an inequality of bargaining power between the clients? \\</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- Is there a conflict concerning a particular aspect of a matter rather than the matter as a whole?</li></ul></li></ul></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div>\n' +
      '</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div>' +
      '</div>\n'
  },
  {
    mmd: 'Contents of Form PA1A\n' +
      '\\begin{itemize}\n' +
      '\\item[] □ Legal Foundations, 30.11\n' +
      '\\item[] □ Form PA1A is completed where the deceased died without a valid will and so is totally intestate.\n' +
      '\n' +
      '\\begin{tabular}{|l|l|}\n' +
      '\\hline Content & Details \\\\\n' +
      '\\hline \\begin{tabular}{l}\n' +
      'Identification of the Applicants - Section A \\\\\n' +
      'Legal Foundations, 30.9.1\n' +
      '\\end{tabular} & \\begin{tabular}{l}\n' +
      '\\begin{itemize}\n' +
      '\\item[] □ The applicant(s) must provide the following personal details:\n' +
      '\\begin{itemize}\n' +
      '\\item[] □ 1.1: Full name\n' +
      '\\item[] □ 1.2: Address\n' +
      '\\item[] □ 1.3 - 1.4: Home and mobile phone number(s)\n' +
      '\\item[] □ 1.5: Email address\n' +
      '\\end{itemize}\n' +
      '\\item[] □ The form has space for up to four applicants to provide their details (1.6-1.14). \\\\\n' +
      '\\item[] □ Where there is more than one applicant, the Probate Service will treat the first applicant as nominated to apply on all of the other applicants\' behalf and all correspondence will be sent to them.\n' +
      '\\end{itemize}\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline \\begin{tabular}{l}\n' +
      'Details of Deceased - Section B, Question 2 \\\\\n' +
      'Legal Foundations 30.9.2\n' +
      '\\end{tabular} & \\begin{tabular}{l}\n' +
      '\\begin{itemize}\n' +
      '\\item[] □ Must provide full details of the deceased:\n' +
      '\\begin{itemize}\n' +
      '\\item[] □ 2.10-2.2 : Full name.\n' +
      '\\item[] □ 2.3: Address\n' +
      '\\item[] □ 2.4: Date of Birth\n' +
      '\\item[] □ 2.5: Date of Death \\\\\n' +
      '\\item[] □ 2.6-2.7: Confirmation of whether the deceased held assets in any other name other than the legal name they died with.\n' +
      '\\item[] □ 2.8: Domicile\n' +
      '\\item[] □ 2.9-2.10: Details of adopted relatives.\n' +
      '\\item[] □ 2.11: Marital status\n' +
      '\\item[] □ 2.13: Details of any foreign assets.\n' +
      '\\item[] □ 2.14: Details of any "settled land". \\\\\n' +
      '\\begin{itemize}\n' +
      '\\item[] □ Rare - since the Trusts of Land and Appointment of Trustees Act 1996, no new Settled Land Act settlement can be created. \\\\\n' +
      '\\item[] □ Normally such land devolves not to the general personal representatives but to the trustees of the settlement who must take out a special grant of representation limited to the settled land.\n' +
      '\\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline Relatives of the Person who Died - Section B, Question 3 & \n' +
      '\\begin{itemize}\n' +
      '\\item[] □ Details of surviving relatives have to be provided in Section 3 of the Form.\n' +
      '\\end{itemize}\n' +
      '\\begin{tabular}{|l|l|}\n' +
      '\\hline Clearing Off & \n' +
      '\\begin{itemize}\n' +
      '\\item[] □ Unless the applicant is a spouse/civil partner, on applying for the grant, the applicant must "clear off", i.e., explain why nobody in a higher category is able to apply (they must "clear off" the higher- ranking categories).\n' +
      '\\end{itemize}\\\\\n' +
      '\\hline\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{itemize}\n' +
      '© LPC Buddy',
    html: '<div>Contents of Form PA1A</div>\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ Legal Foundations, 30.11</li><li class="li_itemize block" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span><div>□ Form PA1A is completed where the deceased died without a valid will and so is totally intestate.</div>\n' +
      '<div class="table_tabular">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">Content</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">Details</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Identification of the Applicants - Section A</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Legal Foundations, 30.9.1</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
      '<div class="table_tabular">\n' +
      '<table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ The applicant(s) must provide the following personal details:<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ 1.1: Full name</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ 1.2: Address</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ 1.3 - 1.4: Home and mobile phone number(s)</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ 1.5: Email address</li></ul></li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ The form has space for up to four applicants to provide their details (1.6-1.14). \\</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ Where there is more than one applicant, the Probate Service will treat the first applicant as nominated to apply on all of the other applicants\' behalf and all correspondence will be sent to them.</li></ul></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div>\n' +
      '</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Details of Deceased - Section B, Question 2</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Legal Foundations 30.9.2</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
      '<div class="table_tabular">\n' +
      '<table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ Must provide full details of the deceased:<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ 2.10-2.2 : Full name.</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ 2.3: Address</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ 2.4: Date of Birth</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ 2.5: Date of Death \\</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ 2.6-2.7: Confirmation of whether the deceased held assets in any other name other than the legal name they died with.</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ 2.8: Domicile</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ 2.9-2.10: Details of adopted relatives.</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ 2.11: Marital status</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ 2.13: Details of any foreign assets.</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ 2.14: Details of any &quot;settled land&quot;. \\<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ Rare - since the Trusts of Land and Appointment of Trustees Act 1996, no new Settled Land Act settlement can be created. \\</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ Normally such land devolves not to the general personal representatives but to the trustees of the settlement who must take out a special grant of representation limited to the settled land.</li></ul></li></ul></li></ul></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div>\n' +
      '</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Relatives of the Person who Died - Section B, Question 3</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ Details of surviving relatives have to be provided in Section 3 of the Form.</li></ul><div class="table_tabular">\n' +
      '<table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">Clearing Off</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>□ Unless the applicant is a spouse/civil partner, on applying for the grant, the applicant must &quot;clear off&quot;, i.e., explain why nobody in a higher category is able to apply (they must &quot;clear off&quot; the higher- ranking categories).</li></ul></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div>\n' +
      '</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></div>\n' +
      '</ul><div>© LPC Buddy</div>\n'
  },
  {
    mmd: '\\begin{itemize}\n' +
      '\\item[] Here is some code:\n' +
      '\\begin{lstlisting}\n' +
      'const x = 10; \n' +
      '\n' +
      'const y = 20;\\end{lstlisting}\n' +
      '\\item[] Next item\n' +
      '\\end{itemize}',
    html:
      '<ul class="itemize" style="list-style-type: none">' +
        '<li class="li_itemize block" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          '<div>Here is some code:</div>\n' +
          '<pre class="lstlisting">' +
            '<code class="hljs lstlisting-code" style="text-align: left;">' +
              'const x = 10; \n' +
              '\n' +
              'const y = 20;' +
            '</code>' +
          '</pre>\n' +
        '</li>' +
        '<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">' +
          '<span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>' +
          'Next item' +
        '</li>' +
      '</ul>'
  },
  {
    mmd: '\\textbf{Qualified One-Way Costs Shifting (QOCS)}\n' +
      '\n' +
      '\\icon{unknown} \\textit{Personal Injury & Clinical negligence Litigation. 9.3}\n' +
      '\n' +
      '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\textbf{QOCS} & \\begin{tabular}{l}\n' +
      '\\begin{itemize}\n' +
      '\\item[] - In personal injury and clinical negligence claims, a Defendant \\textbf{will NOT generally recover} \\textbf{costs} from their opponent EVEN if they successfully defend the claim (CPR 44.13-44.17). \\\\\n' +
      '\\item[] - This is known as “Qualified One Way Costs Shifting” (QOCS).\n' +
      '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\begin{tabular}{l}\n' +
      '\\textbf{When does} \\textbf{QOCS apply?} \\\\\n' +
      'CPR 44.13(1)\n' +
      '\\end{tabular} \\& \n' +
      '\\begin{itemize}\n' +
      '\\item[] - QOCS applies to claims for damages for:\n' +
      '\\begin{itemize}\n' +
      '\\item[] - Personal Injuries\n' +
      '\\item[] - Under the Fatal Accidents 1976\n' +
      '\\item[] - Under S1(1) Law Reform (Miscellaneous Provisions) Act 1934\n' +
      '\\end{itemize}\n' +
      '\\end{itemize} \\\\\n' +
      '\\hline \\begin{tabular}{l}\n' +
      '\\textbf{What is its} \\textbf{effect?} \\\\\n' +
      'CPR 44.14\n' +
      '\\end{tabular} \\& \\begin{tabular}{l}\n' +
      '\\begin{itemize}\n' +
      '\\item[] - The intention of QOCS is to make ATE/AEI insurance \\textbf{unnecessary for PI} \\textbf{actions,} as the \\textbf{claimant will not be liable for the defendant’ costs if} \\textbf{the claim fails.} \\\\\n' +
      '\\item[] \\icon{unknown} Where QOCS applies, costs orders can be made against claimants but \\textbf{ONLY} to the extent that \\textbf{those costs do not exceed the total damages} \\textbf{the claimant recovers.} \\\\\n' +
      '\\item[] - So, if a Claimant loses, they will obtain no damages, and therefore a Defendant will not be able to recover any costs.\n' +
      '\\end{itemize}\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline \\textbf{Exceptions} \\& \\begin{itemize}\n' +
      '\\item[] - QOCS will \\textbf{NOT} apply if, per CPR 44.15 and CPR 44.16:\n' +
      '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\textbf{The claim is} \\textbf{“fundamentally} \\textbf{dishonest”:} \\& \\begin{itemize}\n' +
      '\\item[] - I.e., if the claimant brings a claim for a sham accident or exaggerates the extent of their injuries (\\textit{Gosling v Screwfix and another}\n' +
      '\\end{itemize}\\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{itemize}\\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{itemize}\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    html: '<div><strong>Qualified One-Way Costs Shifting (QOCS)</strong></div>\n' +
      '<div><span >�</span> <em>Personal Injury &amp; Clinical negligence Litigation. 9.3</em></div>\n' +
      '<div class="table_tabular" style="text-align: center">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>QOCS</strong></td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">\n' +
      '<div class="table_tabular">\n' +
      '<table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- In personal injury and clinical negligence claims, a Defendant <strong>will NOT generally recover</strong> <strong>costs</strong> from their opponent EVEN if they successfully defend the claim (CPR 44.13-44.17). \\</li><li class="li_itemize block" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span><div>\n' +
      '- This is known as “Qualified One Way Costs Shifting” (QOCS).</div>\n' +
      '<div class="table_tabular">\n' +
      '<table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">\n' +
      '<div class="table_tabular">\n' +
      '<table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><strong>When does</strong> <strong>QOCS apply?</strong></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">CPR 44.13(1)</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      ' &amp; </div>\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- QOCS applies to claims for damages for:<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- Personal Injuries</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- Under the Fatal Accidents 1976</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- Under S1(1) Law Reform (Miscellaneous Provisions) Act 1934</li></ul></li></ul></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
      '<div class="table_tabular">\n' +
      '<table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><strong>What is its</strong> <strong>effect?</strong></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">CPR 44.14</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      ' &amp; </div>\n' +
      '<div class="table_tabular">\n' +
      '<table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- The intention of QOCS is to make ATE/AEI insurance <strong>unnecessary for PI</strong> <strong>actions,</strong> as the <strong>claimant will not be liable for the defendant’ costs if</strong> <strong>the claim fails.</strong> \\</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span><span >�</span> Where QOCS applies, costs orders can be made against claimants but <strong>ONLY</strong> to the extent that <strong>those costs do not exceed the total damages</strong> <strong>the claimant recovers.</strong> \\</li><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- So, if a Claimant loses, they will obtain no damages, and therefore a Defendant will not be able to recover any costs.</li></ul></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div>\n' +
      '</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">\n' +
      '<div>\n' +
      '<strong>Exceptions</strong> &amp;</div>\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize block" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span><div>\n' +
      '- QOCS will <strong>NOT</strong> apply if, per CPR 44.15 and CPR 44.16:</div>\n' +
      '<div class="table_tabular">\n' +
      '<table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">\n' +
      '<div>\n' +
      '<strong>The claim is</strong> <strong>“fundamentally</strong> <strong>dishonest”:</strong> &amp;</div>\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize" data-custom-marker="true" data-marker-empty="true"><span class="li_level" data-custom-marker="true" data-marker-empty="true"></span>- I.e., if the claimant brings a claim for a sham accident or exaggerates the extent of their injuries (<em>Gosling v Screwfix and another</em></li></ul></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div>\n' +
      '</ul></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div>\n' +
      '</li></ul></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div>\n' +
      '</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></div>\n'
  },
  // {
  //   mmd: '',
  //   html: ''
  // },
]
