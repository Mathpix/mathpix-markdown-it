module.exports = [
  {
    latex: '\\begin{itemize}\n' +
      '  \\item One entry in the list\n' +
      '  \\item Another entry in the list\n' +
      '\\end{itemize}',
    html: `<ul class="itemize preview-paragraph-0 preview-line 0 1 2 3" data_line_start="0" data_line_end="3" data_line="0,4" count_line="4" style="list-style-type: none"><li class="li_itemize preview-paragraph-1 preview-line 1" data_line_start="1" data_line_end="1" data_line="1,2" count_line="1" data_parent_line_start="0"><span class="li_level">•</span>One entry in the list</li><li class="li_itemize preview-paragraph-2 preview-line 2" data_line_start="2" data_line_end="2" data_line="2,3" count_line="1" data_parent_line_start="0"><span class="li_level">•</span>Another entry in the list</li></ul>`,
  },
  {
    latex: '\\begin{itemize}\n' +
      '  \\item The individual entries are indicated with a black dot, a so-called bullet.\n' +
      '  \\item The text in the entries may be of any length.\n' +
      '\\end{itemize}',
    html: `<ul class="itemize preview-paragraph-0 preview-line 0 1 2 3" data_line_start="0" data_line_end="3" data_line="0,4" count_line="4" style="list-style-type: none"><li class="li_itemize preview-paragraph-1 preview-line 1" data_line_start="1" data_line_end="1" data_line="1,2" count_line="1" data_parent_line_start="0"><span class="li_level">•</span>The individual entries are indicated with a black dot, a so-called bullet.</li><li class="li_itemize preview-paragraph-2 preview-line 2" data_line_start="2" data_line_end="2" data_line="2,3" count_line="1" data_parent_line_start="0"><span class="li_level">•</span>The text in the entries may be of any length.</li></ul>`,
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
    html: `<ol class="enumerate decimal preview-paragraph-0 preview-line 0 1 2 3 4 5 6 7" data_line_start="0" data_line_end="7" data_line="0,8" count_line="8" style=" list-style-type: decimal"><li class="li_enumerate preview-paragraph-1 preview-line 1" data_line_start="1" data_line_end="1" data_line="1,2" count_line="1" data_parent_line_start="0">The labels consists of sequential numbers.</li><ul class="itemize" style="list-style-type: none"><li class="li_itemize preview-paragraph-3 preview-line 3" data_line_start="3" data_line_end="3" data_line="3,4" count_line="1" data_parent_line_start="0"><span class="li_level">•</span>The individual entries are indicated with a black dot, a so-called bullet.</li><li class="li_itemize preview-paragraph-4 preview-line 4" data_line_start="4" data_line_end="4" data_line="4,5" count_line="1" data_parent_line_start="0"><span class="li_level">•</span>The text in the entries may be of any length.</li></ul><li class="li_enumerate preview-paragraph-6 preview-line 6" data_line_start="6" data_line_end="6" data_line="6,7" count_line="1" data_parent_line_start="0">The numbers starts at 1 with every call to the enumerate environment.</li></ol>`,
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
    html: `<ol class="enumerate decimal preview-paragraph-0 preview-line 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15" data_line_start="0" data_line_end="15" data_line="0,16" count_line="16" style=" list-style-type: decimal"><li class="li_enumerate preview-paragraph-1 preview-line 1" data_line_start="1" data_line_end="1" data_line="1,2" count_line="1" data_parent_line_start="0">First level item</li><li class="li_enumerate preview-paragraph-2 preview-line 2" data_line_start="2" data_line_end="2" data_line="2,3" count_line="1" data_parent_line_start="0">First level item</li><ol class="enumerate lower-alpha" style=" list-style-type: lower-alpha"><li class="li_enumerate preview-paragraph-4 preview-line 4" data_line_start="4" data_line_end="4" data_line="4,5" count_line="1" data_parent_line_start="0">Second level item</li><li class="li_enumerate preview-paragraph-5 preview-line 5" data_line_start="5" data_line_end="5" data_line="5,6" count_line="1" data_parent_line_start="0">Second level item</li><ol class="enumerate lower-roman" style=" list-style-type: lower-roman"><li class="li_enumerate preview-paragraph-7 preview-line 7" data_line_start="7" data_line_end="7" data_line="7,8" count_line="1" data_parent_line_start="0">Third level item</li><li class="li_enumerate preview-paragraph-8 preview-line 8" data_line_start="8" data_line_end="8" data_line="8,9" count_line="1" data_parent_line_start="0">Third level item</li><ol class="enumerate upper-alpha" style=" list-style-type: upper-alpha"><li class="li_enumerate preview-paragraph-10 preview-line 10" data_line_start="10" data_line_end="10" data_line="10,11" count_line="1" data_parent_line_start="0">Fourth level item</li><li class="li_enumerate preview-paragraph-11 preview-line 11" data_line_start="11" data_line_end="11" data_line="11,12" count_line="1" data_parent_line_start="0">Fourth level item</li></ol></ol></ol></ol>`,
  },
  {
    latex: '\\begin{itemize}\n' +
      '\\item Arabic number (1, 2, 3, ...) for Level 1\n' +
      '\\item Lowercase letter (a, b, c, ...) for Level 2\n' +
      '\\item Lowercase Roman numeral (i, ii, iii, ...) for Level 3\n' +
      '\\item Uppercase letter (A, B, C, ...) for Level 4.\n' +
      '\\end{itemize}',
    html: `<ul class="itemize preview-paragraph-0 preview-line 0 1 2 3 4 5" data_line_start="0" data_line_end="5" data_line="0,6" count_line="6" style="list-style-type: none"><li class="li_itemize preview-paragraph-1 preview-line 1" data_line_start="1" data_line_end="1" data_line="1,2" count_line="1" data_parent_line_start="0"><span class="li_level">•</span>Arabic number (1, 2, 3, ...) for Level 1</li><li class="li_itemize preview-paragraph-2 preview-line 2" data_line_start="2" data_line_end="2" data_line="2,3" count_line="1" data_parent_line_start="0"><span class="li_level">•</span>Lowercase letter (a, b, c, ...) for Level 2</li><li class="li_itemize preview-paragraph-3 preview-line 3" data_line_start="3" data_line_end="3" data_line="3,4" count_line="1" data_parent_line_start="0"><span class="li_level">•</span>Lowercase Roman numeral (i, ii, iii, ...) for Level 3</li><li class="li_itemize preview-paragraph-4 preview-line 4" data_line_start="4" data_line_end="4" data_line="4,5" count_line="1" data_parent_line_start="0"><span class="li_level">•</span>Uppercase letter (A, B, C, ...) for Level 4.</li></ul>`,
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
    html: `<ol class="enumerate decimal preview-paragraph-1 preview-line 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16" data_line_start="1" data_line_end="16" data_line="1,17" count_line="16" style=" list-style-type: decimal"><li class="li_enumerate preview-paragraph-2 preview-line 2" data_line_start="2" data_line_end="2" data_line="2,3" count_line="1" data_parent_line_start="1">First level item</li><li class="li_enumerate preview-paragraph-3 preview-line 3" data_line_start="3" data_line_end="3" data_line="3,4" count_line="1" data_parent_line_start="1">First level item</li><ol class="enumerate upper-roman" style=" list-style-type: upper-roman"><li class="li_enumerate preview-paragraph-5 preview-line 5" data_line_start="5" data_line_end="5" data_line="5,6" count_line="1" data_parent_line_start="1">Second level item</li><li class="li_enumerate preview-paragraph-6 preview-line 6" data_line_start="6" data_line_end="6" data_line="6,7" count_line="1" data_parent_line_start="1">Second level item</li><ol class="enumerate lower-roman" style=" list-style-type: lower-roman"><li class="li_enumerate preview-paragraph-8 preview-line 8" data_line_start="8" data_line_end="8" data_line="8,9" count_line="1" data_parent_line_start="1">Third level item</li><li class="li_enumerate preview-paragraph-9 preview-line 9" data_line_start="9" data_line_end="9" data_line="9,10" count_line="1" data_parent_line_start="1">Third level item</li><ol class="enumerate upper-alpha" style=" list-style-type: upper-alpha"><li class="li_enumerate preview-paragraph-11 preview-line 11" data_line_start="11" data_line_end="11" data_line="11,12" count_line="1" data_parent_line_start="1">Fourth level item</li><li class="li_enumerate preview-paragraph-12 preview-line 12" data_line_start="12" data_line_end="12" data_line="12,13" count_line="1" data_parent_line_start="1">Fourth level item</li></ol></ol></ol></ol>`,
  },
  {
    latex: '\\begin{itemize} \n' +
      '\\item `\\labelenumi` for Level 1\n' +
      '\\item `\\labelenumii` for Level 2\n' +
      '\\item `\\labelenumiii` for Level 3\n' +
      '\\item `\\labelenumiv` for Level 4\n' +
      '\\end{itemize}',
    html: `<ul class="itemize preview-paragraph-0 preview-line 0 1 2 3 4 5" data_line_start="0" data_line_end="5" data_line="0,6" count_line="6" style="list-style-type: none"><li class="li_itemize block preview-paragraph-1 preview-line 1" data_line_start="1" data_line_end="1" data_line="1,2" count_line="1" data_parent_line_start="0"><span class="li_level">•</span><div><code>\\labelenumi</code> for Level 1</div>
</li><li class="li_itemize block preview-paragraph-2 preview-line 2" data_line_start="2" data_line_end="2" data_line="2,3" count_line="1" data_parent_line_start="0"><span class="li_level">•</span><div><code>\\labelenumii</code> for Level 2</div>
</li><li class="li_itemize block preview-paragraph-3 preview-line 3" data_line_start="3" data_line_end="3" data_line="3,4" count_line="1" data_parent_line_start="0"><span class="li_level">•</span><div><code>\\labelenumiii</code> for Level 3</div>
</li><li class="li_itemize block preview-paragraph-4 preview-line 4" data_line_start="4" data_line_end="4" data_line="4,5" count_line="1" data_parent_line_start="0"><span class="li_level">•</span><div><code>\\labelenumiv</code> for Level 4</div>
</li></ul>`,
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
    html: `<ul class="itemize preview-paragraph-0 preview-line 0 1 2 3 4 5 6 7 8 9 10 11" data_line_start="0" data_line_end="11" data_line="0,12" count_line="12" style="list-style-type: none"><li class="li_itemize preview-paragraph-1 preview-line 1" data_line_start="1" data_line_end="1" data_line="1,2" count_line="1" data_parent_line_start="0"><span class="li_level">•</span>First Level</li><ul class="itemize" style="list-style-type: none"><li class="li_itemize preview-paragraph-3 preview-line 3" data_line_start="3" data_line_end="3" data_line="3,4" count_line="1" data_parent_line_start="0"><span class="li_level">–</span>Second Level</li><ul class="itemize" style="list-style-type: none"><li class="li_itemize preview-paragraph-5 preview-line 5" data_line_start="5" data_line_end="5" data_line="5,6" count_line="1" data_parent_line_start="0"><span class="li_level">∗</span>Third Level</li><ul class="itemize" style="list-style-type: none"><li class="li_itemize preview-paragraph-7 preview-line 7" data_line_start="7" data_line_end="7" data_line="7,8" count_line="1" data_parent_line_start="0"><span class="li_level">·</span>Fourth Level</li></ul></ul></ul></ul>`,
  },
  {
    latex: '\\begin{itemize}\n' +
      '\\item Level 1 is `\\textbullet` (•),\n' +
      '\\item Level 2 is `\\textendash` (–) ,\n' +
      '\\item Level 3 is `\\textasteriskcentered` (*)\n' +
      '\\item Level 4 is `\\textperiodcentered` (·).\n' +
      '\\end{itemize}',
    html: `<ul class="itemize preview-paragraph-0 preview-line 0 1 2 3 4 5" data_line_start="0" data_line_end="5" data_line="0,6" count_line="6" style="list-style-type: none"><li class="li_itemize block preview-paragraph-1 preview-line 1" data_line_start="1" data_line_end="1" data_line="1,2" count_line="1" data_parent_line_start="0"><span class="li_level">•</span><div>Level 1 is <code>\\textbullet</code> (•),</div>
</li><li class="li_itemize block preview-paragraph-2 preview-line 2" data_line_start="2" data_line_end="2" data_line="2,3" count_line="1" data_parent_line_start="0"><span class="li_level">•</span><div>Level 2 is <code>\\textendash</code> (–) ,</div>
</li><li class="li_itemize block preview-paragraph-3 preview-line 3" data_line_start="3" data_line_end="3" data_line="3,4" count_line="1" data_parent_line_start="0"><span class="li_level">•</span><div>Level 3 is <code>\\textasteriskcentered</code> (*)</div>
</li><li class="li_itemize block preview-paragraph-4 preview-line 4" data_line_start="4" data_line_end="4" data_line="4,5" count_line="1" data_parent_line_start="0"><span class="li_level">•</span><div>Level 4 is <code>\\textperiodcentered</code> (·).</div>
</li></ul>`,
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
    html: `<ul class="itemize preview-paragraph-2 preview-line 2 3 4 5 6 7 8 9 10 11 12 13" data_line_start="2" data_line_end="13" data_line="2,14" count_line="12" style="list-style-type: none"><li class="li_itemize preview-paragraph-3 preview-line 3" data_line_start="3" data_line_end="3" data_line="3,4" count_line="1" data_parent_line_start="2"><span class="li_level"><span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0" xmlns="http://www.w3.org/2000/svg" width="1.76ex" height="1.559ex" role="img" focusable="false" viewBox="0 -689 778 689"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="25FC" d="M71 0Q59 4 55 16V346L56 676Q64 686 70 689H709Q719 681 722 674V15Q719 10 709 1L390 0H71Z"></path></g></g></g></svg></mjx-container></span></span>First Level</li><ul class="itemize" style="list-style-type: none"><li class="li_itemize preview-paragraph-5 preview-line 5" data_line_start="5" data_line_end="5" data_line="5,6" count_line="1" data_parent_line_start="2"><span class="li_level"><span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0" xmlns="http://www.w3.org/2000/svg" width="1.76ex" height="1.559ex" role="img" focusable="false" viewBox="0 -689 778 689"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="25FB" d="M71 0Q59 4 55 16V346L56 676Q64 686 70 689H709Q719 681 722 674V15Q719 10 709 1L390 0H71ZM682 40V649H95V40H682Z"></path></g></g></g></svg></mjx-container></span></span>Second Level</li><ul class="itemize" style="list-style-type: none"><li class="li_itemize preview-paragraph-7 preview-line 7" data_line_start="7" data_line_end="7" data_line="7,8" count_line="1" data_parent_line_start="2"><span class="li_level">.</span>Third Level</li><ul class="itemize" style="list-style-type: none"><li class="li_itemize preview-paragraph-9 preview-line 9" data_line_start="9" data_line_end="9" data_line="9,10" count_line="1" data_parent_line_start="2"><span class="li_level">.</span>Fourth Level</li></ul></ul></ul></ul>`,
  },
  {
    latex: '\\begin{itemize}\n' +
      '  \\item  Default item label for entry one\n' +
      '  \\item  Default item label for entry two\n' +
      '  \\item[$\\square$]  Custom item label for entry three\n' +
      '\\end{itemize}',
    html: `<ul class="itemize preview-paragraph-0 preview-line 0 1 2 3 4" data_line_start="0" data_line_end="4" data_line="0,5" count_line="5" style="list-style-type: none"><li class="li_itemize preview-paragraph-1 preview-line 1" data_line_start="1" data_line_end="1" data_line="1,2" count_line="1" data_parent_line_start="0"><span class="li_level">•</span>Default item label for entry one</li><li class="li_itemize preview-paragraph-2 preview-line 2" data_line_start="2" data_line_end="2" data_line="2,3" count_line="1" data_parent_line_start="0"><span class="li_level">•</span>Default item label for entry two</li><li class="li_itemize preview-paragraph-3 preview-line 3" data_line_start="3" data_line_end="3" data_line="3,4" count_line="1" data_parent_line_start="0"><span class="li_level"><span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0" xmlns="http://www.w3.org/2000/svg" width="1.76ex" height="1.559ex" role="img" focusable="false" viewBox="0 -689 778 689"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="25FB" d="M71 0Q59 4 55 16V346L56 676Q64 686 70 689H709Q719 681 722 674V15Q719 10 709 1L390 0H71ZM682 40V649H95V40H682Z"></path></g></g></g></svg></mjx-container></span></span>Custom item label for entry three</li></ul>`,
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
    html: `<ul class="itemize preview-paragraph-0 preview-line 0" data_line_start="0" data_line_end="0" data_line="0,1" count_line="1" style="list-style-type: none"><li class="li_itemize preview-paragraph-0 preview-line " data_line_start="0" data_line_end="-1" data_line="0,0" count_line="0" data_parent_line_start="0"><span class="li_level">•</span>One entry in the list</li><li class="li_itemize preview-paragraph-0 preview-line " data_line_start="0" data_line_end="-1" data_line="0,0" count_line="0" data_parent_line_start="0"><span class="li_level">•</span>Another entry in the list</li></ul><ul class="itemize preview-paragraph-3 preview-line 3 4 5 6 7 8 9 10 11 12 13 14 15" data_line_start="3" data_line_end="15" data_line="3,16" count_line="13" style="list-style-type: none"><li class="li_itemize preview-paragraph-4 preview-line 4" data_line_start="4" data_line_end="4" data_line="4,5" count_line="1" data_parent_line_start="3"><span class="li_level">¿</span>First Level</li><ul class="itemize" style="list-style-type: none"><li class="li_itemize preview-paragraph-6 preview-line 6" data_line_start="6" data_line_end="6" data_line="6,7" count_line="1" data_parent_line_start="3"><span class="li_level"><span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0" xmlns="http://www.w3.org/2000/svg" width="1.76ex" height="1.559ex" role="img" focusable="false" viewBox="0 -689 778 689"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="25FB" d="M71 0Q59 4 55 16V346L56 676Q64 686 70 689H709Q719 681 722 674V15Q719 10 709 1L390 0H71ZM682 40V649H95V40H682Z"></path></g></g></g></svg></mjx-container></span></span>Second Level</li><ul class="itemize" style="list-style-type: none"><li class="li_itemize preview-paragraph-8 preview-line 8" data_line_start="8" data_line_end="8" data_line="8,9" count_line="1" data_parent_line_start="3"><span class="li_level">∗</span>Third Level</li><ul class="itemize" style="list-style-type: none"><li class="li_itemize preview-paragraph-10 preview-line 10" data_line_start="10" data_line_end="10" data_line="10,11" count_line="1" data_parent_line_start="3"><span class="li_level">·</span>Fourth Level</li><li class="li_itemize preview-paragraph-10 preview-line 10" data_line_start="10" data_line_end="10" data_line="10,11" count_line="1" data_parent_line_start="3"><span class="li_level"><span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0" xmlns="http://www.w3.org/2000/svg" width="1.76ex" height="1.559ex" role="img" focusable="false" viewBox="0 -689 778 689"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="25FB" d="M71 0Q59 4 55 16V346L56 676Q64 686 70 689H709Q719 681 722 674V15Q719 10 709 1L390 0H71ZM682 40V649H95V40H682Z"></path></g></g></g></svg></mjx-container></span></span>Fourth Level</li><li class="li_itemize preview-paragraph-11 preview-line 11" data_line_start="11" data_line_end="11" data_line="11,12" count_line="1" data_parent_line_start="3"><span class="li_level">·</span>Fourth Levelfffy</li></ul></ul></ul></ul>`,
  }

];
