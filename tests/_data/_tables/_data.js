module.exports = [
  {
    latex: `| Tables        | Are           | Cool  |
| :------------ |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |`,
    html: `<table align="center">
<thead>
<tr>
<th style="text-align:left">Tables</th>
<th style="text-align:center">Are</th>
<th style="text-align:right">Cool</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">col 3 is</td>
<td style="text-align:center">right-aligned</td>
<td style="text-align:right">$1600</td>
</tr>
<tr>
<td style="text-align:left">col 2 is</td>
<td style="text-align:center">centered</td>
<td style="text-align:right">$12</td>
</tr>
<tr>
<td style="text-align:left">zebra stripes</td>
<td style="text-align:center">are neat</td>
<td style="text-align:right">$1</td>
</tr>
</tbody>
</table>`,
    html_notCenterTables: `<table>
<thead>
<tr>
<th style="text-align:left">Tables</th>
<th style="text-align:center">Are</th>
<th style="text-align:right">Cool</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">col 3 is</td>
<td style="text-align:center">right-aligned</td>
<td style="text-align:right">$1600</td>
</tr>
<tr>
<td style="text-align:left">col 2 is</td>
<td style="text-align:center">centered</td>
<td style="text-align:right">$12</td>
</tr>
<tr>
<td style="text-align:left">zebra stripes</td>
<td style="text-align:center">are neat</td>
<td style="text-align:right">$1</td>
</tr>
</tbody>
</table>`
  },
  {
    latex: `\\begin{tabular}{ l c r }
  1 & 2 & 3 \\\\
  4 & 5 & 6 \\\\
  7 & 8 & 9 \\\\
\\end{tabular}`,
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left: none !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>
<td style="text-align: right; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left: none !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>
<td style="text-align: right; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left: none !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">8</td>
<td style="text-align: right; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">9</td>
</tr>
</tbody>
</table>
</div></div>`,
    html_notCenterTables: `<div class="table_tabular">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left: none !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>
<td style="text-align: right; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left: none !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>
<td style="text-align: right; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left: none !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">8</td>
<td style="text-align: right; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">9</td>
</tr>
</tbody>
</table>
</div></div>`
  },  
  {
    latex: `\\begin{left}
  \\begin{tabular}{ | l | c | r | }
    \\hline
    1 & 2 & 3 \\\\ \\hline
    4 & 5 & 6 \\\\ \\hline
    7 & 8 & 9 \\\\
    \\hline
  \\end{tabular}
\\end{left}`,
    html: `<div class="center" style="text-align: left">
<div class="table_tabular" style="text-align: left">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">1</td>
<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">2</td>
<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">3</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>
<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>
<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">7</td>
<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">8</td>
<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">9</td>
</tr>
</tbody>
</table>
</div></div>
</div>`,
    html_notCenterTables: `<div class="center" style="text-align: left">
<div class="table_tabular" style="text-align: left">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">1</td>
<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">2</td>
<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">3</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>
<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>
<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">7</td>
<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">8</td>
<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">9</td>
</tr>
</tbody>
</table>
</div></div>
</div>`
  },  
  {
    latex: `\\begin{tabular}{ r|c|c| }
\\multicolumn{1}{r}{}
 &  \\multicolumn{1}{c}{noninteractive}
 & \\multicolumn{1}{c}{interactive} \\\\
\\cline{2-3}
massively multiple & Library & University \\\\
\\cline{2-3}
one-to-one & Book & Tutor \\\\
\\cline{2-3}
\\end{tabular}`,
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: right; border-left: none !important; border-bottom: none !important; border-top: none !important; border-top: none !important; border-bottom: none !important; " colspan="1"></td>
<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; border-top: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="1">noninteractive</td>
<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; border-top: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="1">interactive</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: right; border-left: none !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">massively multiple</td>
<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Library</td>
<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">University</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: right; border-left: none !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">one-to-one</td>
<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Book</td>
<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Tutor</td>
</tr>
</tbody>
</table>
</div></div>`,
    html_notCenterTables: `<div class="table_tabular">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: right; border-left: none !important; border-bottom: none !important; border-top: none !important; border-top: none !important; border-bottom: none !important; " colspan="1"></td>
<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; border-top: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="1">noninteractive</td>
<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; border-top: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="1">interactive</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: right; border-left: none !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">massively multiple</td>
<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Library</td>
<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">University</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: right; border-left: none !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">one-to-one</td>
<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Book</td>
<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Tutor</td>
</tr>
</tbody>
</table>
</div></div>`
  },  
  {
    latex: `\\begin{table}[h!]
\\centering
\\begin{tabular}{||c c c c||}
\\hline
Col1 & Col2 & Col2 & Col3 \\\\ [0.5ex]
\\hline\\hline
1 & 6 & 87837 & 787 \\\\
2 & 7 & 78 & 5415 \\\\
3 & 545 & 778 & 7507 \\\\
4 & 545 & 18744 & 7560 \\\\
5 & 88 & 788 & 6344 \\\\ [1ex]
\\hline
\\end{tabular}
\\end{table}`,
    html: `<div class="table">
<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col1</td>
<td style="text-align: center; border-right: none !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col2</td>
<td style="text-align: center; border-right: none !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col2</td>
<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col3</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">87837</td>
<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">787</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">78</td>
<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">5415</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">545</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">778</td>
<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7507</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">545</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">18744</td>
<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7560</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">5</td>
<td style="text-align: center; border-right: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">88</td>
<td style="text-align: center; border-right: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">788</td>
<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">6344</td>
</tr>
</tbody>
</table>
</div></div>
</div>`,
    html_notCenterTables: `<div class="table">
<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col1</td>
<td style="text-align: center; border-right: none !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col2</td>
<td style="text-align: center; border-right: none !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col2</td>
<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col3</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">87837</td>
<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">787</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">78</td>
<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">5415</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">545</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">778</td>
<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7507</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">545</td>
<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">18744</td>
<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7560</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">5</td>
<td style="text-align: center; border-right: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">88</td>
<td style="text-align: center; border-right: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">788</td>
<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">6344</td>
</tr>
</tbody>
</table>
</div></div>
</div>`
  },
  {
    latex: '**Tipologie di finanziamento mappate:**\n' +
      '\n' +
      '\\begin{table}\n' +
      '\\begin{tabular}{|l|p{9cm}|}\n' +
      '\\hline\n' +
      '\\textbf{Categoria} & \\textbf{Fonti specifiche} \\\\\n' +
      '\\hline\n' +
      'Finanziamenti Pubblici Nazionali & MiC - DG Cinema (sviluppo, produzione, distribuzione), Tax Credit cinema (40\\% costi italiani), Fondi regionali (Calabria Film Commission, altre regioni) \\\\\n' +
      '\\hline\n' +
      'Finanziamenti Pubblici Europei & Creative Europe MEDIA, Eurimages, Programmi bilaterali (es. Italia-Francia) \\\\\n' +
      '\\hline\n' +
      'Broadcaster e Piattaforme & RAI Cinema, Sky Italia, Netflix Italia, Prime Video, Disney+, Mediaset \\\\\n' +
      '\\hline\n' +
      'Fondazioni Private & Fondazioni culturali, fondazioni tematiche (ambiente, sociale), sponsorship corporate \\\\\n' +
      '\\hline\n' +
      'Co-Produzione Internazionale & Produttori esteri con track record, sales agents con advance payments \\\\\n' +
      '\\hline\n' +
      'Equity e Investitori Privati & Angel investors settore audiovisivo, fondi di investimento in contenuti, family offices \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\caption{Mapping delle fonti di finanziamento cinematografico}\n' +
      '\\end{table>\n' +
      '\n' +
      '### 5.2 Attività di Financing realizzate\n' +
      '\n' +
      '**5.2.1 Mappatura Opportunità di Finanziamento**\n' +
      '\n' +
      'INDACO S.R.L. ha condotto una **mappatura sistematica** di tutte le opportunità di finanziamento rilevanti per i progetti DIEGETICA PRODUCTION, creando un database strutturato che include:\n' +
      '\n' +
      '- **200+ bandi e opportunità** pubbliche italiane ed europee\n' +
      '- **50+ broadcaster e piattaforme** con profiling dettagliato (generi preferiti, budget range, decision makers)\n' +
      '- **30+ fondazioni** tematiche con criteri di funding e contatti\n' +
      '- **100+ co-produttori internazionali** segmentati per paese, genere, budget range\n' +
      '\n' +
      '**Output:** Database gestionale con alert automatici su nuove opportunità, deadline, requisiti\n' +
      '\n' +
      '**5.2.2 Preparazione Domande di Contributo**\n' +
      '\n' +
      'Per ciascun progetto, INDACO S.R.L. ha fornito supporto nella preparazione di **grant applications** per finanziamenti pubblici:\n' +
      '\n' +
      '**Progetti per cui sono state preparate domande:**\n' +
      '\n' +
      '\\begin{itemize}\n' +
      '\\item \\textbf{JASTIMARI}: Domanda MiC DG Cinema - Bando Produzione (prep. documentazione 120+ pagine)\n' +
      '\\item \\textbf{COBALTO}: Domanda Creative Europe MEDIA Development (prep. application form inglese + allegati)\n' +
      '\\item \\textbf{LA PREDA}: Domanda MiC DG Cinema - Bando Serie TV (prep. documentazione 150+ pagine con series bible)\n' +
      '\\item \\textbf{VOLEVO LA MIA OASI}: Grant application a 3 fondazioni ambientaliste\n' +
      '\\end{itemize}\n' +
      '\n' +
      '**Componenti standard di grant application:**\n' +
      '\n' +
      '\\begin{enumerate}\n' +
      '\\item \\textbf{Synopsis e Treatment}: Versioni calibrate per application (lunghezza, tone, focus su elementi valutati)\n' +
      '\\item \\textbf{Budget dettagliato}: Formattato secondo requirement specifici del bando\n' +
      '\\item \\textbf{Financing plan}: Dimostrazione sostenibilità finanziaria con altre fonti confermate/previste\n' +
      '\\item \\textbf{Track record}: CV produttori, regista, cast; filmografia aziendale\n' +
      '\\item \\textbf{Distribution strategy}: Piano distributivo credibile con lettere di interesse distributori\n' +
      '\\item \\textbf{Festival strategy}: Target festival con rationale\n' +
      '\\item \\textbf{Impact assessment}: Per bandi che valutano ricadute territoriali/sociali/culturali\n' +
      '\\end{enumerate}\n' +
      '\n' +
      '**Tasso di successo:** Su 8 grant applications preparate con supporto INDACO, 4 hanno ottenuto finanziamento (50% success rate, significativamente sopra media settoriale ~20-25%)\n' +
      '\n' +
      '**5.2.3 Investor Pitch e Presentazioni**\n' +
      '\n' +
      'INDACO S.R.L. ha preparato e affiancato DIEGETICA PRODUCTION in **pitch presentations** per potenziali investitori, broadcaster e co-produttori:\n' +
      '\n' +
      '**Pitch realizzati:**\n' +
      '\n' +
      '- **Pitch a RAI Cinema** per JASTIMARI: Presentazione in presenza presso sede RAI Roma, outcome positivo con lettera di interesse\n' +
      '- **Pitch a Sky Italia** per LA PREDA: Pre-pitch via video call, invito a pitch formale (in programma Q1 2026)\n' +
      '- **Pitch a produttori francesi** per COBALTO: Incontri al Marché du Film Cannes 2024, identification di 2 co-produttori interessati\n' +
      '- **Pitch a fondazioni** per VOLEVO LA MIA OASI: Presentazioni video + Q&A, 1 grant ottenuto\n' +
      '\n' +
      '**Materiali di pitch preparati:**\n' +
      '\n' +
      '\\begin{itemize}\n' +
      '\\item \\textbf{Pitch deck professionali} (30-50 slide): Visual identity coerente, storytelling efficace, dati economici chiari\n' +
      '\\item \\textbf{Teaser trailer} o concept video: Per progetti con materiali visual disponibili\n' +
      '\\item \\textbf{One-pager}: Executive summary di 1 pagina per primo contatto\n' +
      '\\item \\textbf{Leave-behind package}: Documentazione completa da lasciare dopo il pitch\n' +
      '\\end{itemize}\n' +
      '\n' +
      '**Training erogato:**\n' +
      '\n' +
      '- **Workshop "Effective Pitching"** (8 ore): Tecniche di presentazione, storytelling, gestione Q&A\n' +
      '- **Mock pitch sessions** (6 sessioni): Simulazioni con feedback strutturato\n' +
      '- **Pitch coaching individuale** per Anna Giulia Aura e Giovanni Carpanzano (12 ore totali)\n' +
      '\n' +
      '**5.2.4 Networking e Relazioni Industriali**\n' +
      '\n' +
      'INDACO S.R.L. ha facilitato l\'inserimento di DIEGETICA PRODUCTION nelle **reti professionali** del settore cinematografico:\n' +
      '\n' +
      '**Eventi e mercati partecipati con accompagnamento INDACO:**\n' +
      '\n' +
      '\\begin{itemize}\n' +
      '\\item \\textbf{Marché du Film - Cannes 2024}: Accompagnamento in loco, presentazione a 15 produttori/sales agents, organizzazione di 8 meeting pre-programmati\n' +
      '\\item \\textbf{MIA Market - Roma 2024}: Partecipazione congiunta, pitch DIEGETICA projects a operatori italiani\n' +
      '\\item \\textbf{Berlinale Co-Production Market 2025}: Preparazione materiali, coaching pre-mercato (mercato previsto febbraio 2025)\n' +
      '\\end{itemize}\n' +
      '\n' +
      '**Introduzioni strategiche realizzate:**\n' +
      '\n' +
      '- **5 broadcaster italiani**: Introduzione diretta a development executives e acquisitions managers\n' +
      '- **10 co-produttori europei**: Introduzioni calde con email di presentazione INDACO\n' +
      '- **3 sales agents internazionali**: Incontri facilitati per potenziale rappresentanza internazionale progetti DIEGETICA\n' +
      '- **2 fondi di investimento** specializzati in contenuti audiovisivi\n' +
      '\n' +
      '**5.2.5 Contrattualistica e Deal Structuring**\n' +
      '\n' +
      'INDACO S.R.L. ha fornito supporto nella **negoziazione e strutturazione di accordi** con finanziatori e partner:\n' +
      '\n' +
      '**Contratti revisionati e negoziati:**\n' +
      '\n' +
      '- **Accordi di co-produzione**: Review e commento di 3 co-production agreements, supporto in negoziazione di profit sharing e territorial rights\n' +
      '- **Accordi con broadcaster**: Analisi termini proposti da RAI Cinema per JASTIMARI, negoziazione migliorativa su advance payment e profit corridor\n' +
      '- **Accordi con distributori**: Review di distribution agreement per festival/theatrical, tutela diritti digitali per DIEGETICA\n' +
      '\n' +
      '**Consulenza su financing structures:**\n' +
      '\n' +
      '- Strutturazione di **waterfall** (ordine di recupero degli investimenti) per finanziatori multipli\n' +
      '- Definizione di **profit sharing schemes** equi tra co-produttori\n' +
      '- Mappatura della **catena dei diritti** (theatrical, TV, SVOD, AVOD, ancillary) e valorizzazione per territorio\n' +
      '\n' +
      '### 5.3 Risultati quantitativi attività di Financing\n' +
      '\n' +
      '\\begin{table}\n' +
      '\\begin{tabular}{|l|c|}\n' +
      '\\hline\n' +
      '\\textbf{Indicatore} & \\textbf{Risultato} \\\\\n' +
      '\\hline\n' +
      'Grant applications preparate & 8 \\\\\n' +
      '\\hline\n' +
      'Grant applications approvate (funding ottenuto) & 4 (50\\% success rate) \\\\\n' +
      '\\hline\n' +
      'Pitch formali a broadcaster/investitori & 12 \\\\\n' +
      '\\hline\n' +
      'Outcome positivi pitch (lettere interesse/funding) & 6 (50\\% conversion rate) \\\\\n' +
      '\\hline\n' +
      'Introduzioni a operatori industriali facilitati & 30+ \\\\\n' +
      '\\hline\n' +
      'Contratti di co-produzione/distribuzione negoziati & 5 \\\\\n' +
      '\\hline\n' +
      'Ore formazione su financing strategy & 32 \\\\\n' +
      '\\hline\n' +
      'Database finanziatori creato (n. entries) & 380+ \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\caption{Metriche quantitative attività di Financing}\n' +
      '\\end{table}',
    html: '<div><strong>Tipologie di finanziamento mappate:</strong></div>\n' +
      '<div>\\begin{table}</div>\n' +
      '<div class="table_tabular" style="text-align: center">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Categoria</strong></td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: 9cm; vertical-align: top; "><strong>Fonti specifiche</strong></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Finanziamenti Pubblici Nazionali</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: 9cm; vertical-align: top; ">MiC - DG Cinema (sviluppo, produzione, distribuzione), Tax Credit cinema (40% costi italiani), Fondi regionali (Calabria Film Commission, altre regioni)</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Finanziamenti Pubblici Europei</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: 9cm; vertical-align: top; ">Creative Europe MEDIA, Eurimages, Programmi bilaterali (es. Italia-Francia)</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Broadcaster e Piattaforme</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: 9cm; vertical-align: top; ">RAI Cinema, Sky Italia, Netflix Italia, Prime Video, Disney+, Mediaset</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Fondazioni Private</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: 9cm; vertical-align: top; ">Fondazioni culturali, fondazioni tematiche (ambiente, sociale), sponsorship corporate</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Co-Produzione Internazionale</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: 9cm; vertical-align: top; ">Produttori esteri con track record, sales agents con advance payments</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Equity e Investitori Privati</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: 9cm; vertical-align: top; ">Angel investors settore audiovisivo, fondi di investimento in contenuti, family offices</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></div>\n' +
      '<div>\\end{table&gt;</div>\n' +
      '<h3 id="5.2-attivit%C3%A0-di-financing-realizzate">5.2 Attività di Financing realizzate</h3>\n' +
      '<div><strong>5.2.1 Mappatura Opportunità di Finanziamento</strong></div>\n' +
      '<div>INDACO S.R.L. ha condotto una <strong>mappatura sistematica</strong> di tutte le opportunità di finanziamento rilevanti per i progetti DIEGETICA PRODUCTION, creando un database strutturato che include:</div>\n' +
      '<ul>\n' +
      '<li><strong>200+ bandi e opportunità</strong> pubbliche italiane ed europee</li>\n' +
      '<li><strong>50+ broadcaster e piattaforme</strong> con profiling dettagliato (generi preferiti, budget range, decision makers)</li>\n' +
      '<li><strong>30+ fondazioni</strong> tematiche con criteri di funding e contatti</li>\n' +
      '<li><strong>100+ co-produttori internazionali</strong> segmentati per paese, genere, budget range</li>\n' +
      '</ul>\n' +
      '<div><strong>Output:</strong> Database gestionale con alert automatici su nuove opportunità, deadline, requisiti</div>\n' +
      '<div><strong>5.2.2 Preparazione Domande di Contributo</strong></div>\n' +
      '<div>Per ciascun progetto, INDACO S.R.L. ha fornito supporto nella preparazione di <strong>grant applications</strong> per finanziamenti pubblici:</div>\n' +
      '<div><strong>Progetti per cui sono state preparate domande:</strong></div>\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize"><span class="li_level">•</span><strong>JASTIMARI</strong>: Domanda MiC DG Cinema - Bando Produzione (prep. documentazione 120+ pagine)</li><li class="li_itemize"><span class="li_level">•</span><strong>COBALTO</strong>: Domanda Creative Europe MEDIA Development (prep. application form inglese + allegati)</li><li class="li_itemize"><span class="li_level">•</span><strong>LA PREDA</strong>: Domanda MiC DG Cinema - Bando Serie TV (prep. documentazione 150+ pagine con series bible)</li><li class="li_itemize"><span class="li_level">•</span><strong>VOLEVO LA MIA OASI</strong>: Grant application a 3 fondazioni ambientaliste</li></ul><div><strong>Componenti standard di grant application:</strong></div>\n' +
      '<ol class="enumerate decimal" style="list-style-type: decimal"><li class="li_enumerate"><strong>Synopsis e Treatment</strong>: Versioni calibrate per application (lunghezza, tone, focus su elementi valutati)</li><li class="li_enumerate"><strong>Budget dettagliato</strong>: Formattato secondo requirement specifici del bando</li><li class="li_enumerate"><strong>Financing plan</strong>: Dimostrazione sostenibilità finanziaria con altre fonti confermate/previste</li><li class="li_enumerate"><strong>Track record</strong>: CV produttori, regista, cast; filmografia aziendale</li><li class="li_enumerate"><strong>Distribution strategy</strong>: Piano distributivo credibile con lettere di interesse distributori</li><li class="li_enumerate"><strong>Festival strategy</strong>: Target festival con rationale</li><li class="li_enumerate"><strong>Impact assessment</strong>: Per bandi che valutano ricadute territoriali/sociali/culturali</li></ol><div><strong>Tasso di successo:</strong> Su 8 grant applications preparate con supporto INDACO, 4 hanno ottenuto finanziamento (50% success rate, significativamente sopra media settoriale ~20-25%)</div>\n' +
      '<div><strong>5.2.3 Investor Pitch e Presentazioni</strong></div>\n' +
      '<div>INDACO S.R.L. ha preparato e affiancato DIEGETICA PRODUCTION in <strong>pitch presentations</strong> per potenziali investitori, broadcaster e co-produttori:</div>\n' +
      '<div><strong>Pitch realizzati:</strong></div>\n' +
      '<ul>\n' +
      '<li><strong>Pitch a RAI Cinema</strong> per JASTIMARI: Presentazione in presenza presso sede RAI Roma, outcome positivo con lettera di interesse</li>\n' +
      '<li><strong>Pitch a Sky Italia</strong> per LA PREDA: Pre-pitch via video call, invito a pitch formale (in programma Q1 2026)</li>\n' +
      '<li><strong>Pitch a produttori francesi</strong> per COBALTO: Incontri al Marché du Film Cannes 2024, identification di 2 co-produttori interessati</li>\n' +
      '<li><strong>Pitch a fondazioni</strong> per VOLEVO LA MIA OASI: Presentazioni video + Q&amp;A, 1 grant ottenuto</li>\n' +
      '</ul>\n' +
      '<div><strong>Materiali di pitch preparati:</strong></div>\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize"><span class="li_level">•</span><strong>Pitch deck professionali</strong> (30-50 slide): Visual identity coerente, storytelling efficace, dati economici chiari</li><li class="li_itemize"><span class="li_level">•</span><strong>Teaser trailer</strong> o concept video: Per progetti con materiali visual disponibili</li><li class="li_itemize"><span class="li_level">•</span><strong>One-pager</strong>: Executive summary di 1 pagina per primo contatto</li><li class="li_itemize"><span class="li_level">•</span><strong>Leave-behind package</strong>: Documentazione completa da lasciare dopo il pitch</li></ul><div><strong>Training erogato:</strong></div>\n' +
      '<ul>\n' +
      '<li><strong>Workshop “Effective Pitching”</strong> (8 ore): Tecniche di presentazione, storytelling, gestione Q&amp;A</li>\n' +
      '<li><strong>Mock pitch sessions</strong> (6 sessioni): Simulazioni con feedback strutturato</li>\n' +
      '<li><strong>Pitch coaching individuale</strong> per Anna Giulia Aura e Giovanni Carpanzano (12 ore totali)</li>\n' +
      '</ul>\n' +
      '<div><strong>5.2.4 Networking e Relazioni Industriali</strong></div>\n' +
      '<div>INDACO S.R.L. ha facilitato l’inserimento di DIEGETICA PRODUCTION nelle <strong>reti professionali</strong> del settore cinematografico:</div>\n' +
      '<div><strong>Eventi e mercati partecipati con accompagnamento INDACO:</strong></div>\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize"><span class="li_level">•</span><strong>Marché du Film - Cannes 2024</strong>: Accompagnamento in loco, presentazione a 15 produttori/sales agents, organizzazione di 8 meeting pre-programmati</li><li class="li_itemize"><span class="li_level">•</span><strong>MIA Market - Roma 2024</strong>: Partecipazione congiunta, pitch DIEGETICA projects a operatori italiani</li><li class="li_itemize"><span class="li_level">•</span><strong>Berlinale Co-Production Market 2025</strong>: Preparazione materiali, coaching pre-mercato (mercato previsto febbraio 2025)</li></ul><div><strong>Introduzioni strategiche realizzate:</strong></div>\n' +
      '<ul>\n' +
      '<li><strong>5 broadcaster italiani</strong>: Introduzione diretta a development executives e acquisitions managers</li>\n' +
      '<li><strong>10 co-produttori europei</strong>: Introduzioni calde con email di presentazione INDACO</li>\n' +
      '<li><strong>3 sales agents internazionali</strong>: Incontri facilitati per potenziale rappresentanza internazionale progetti DIEGETICA</li>\n' +
      '<li><strong>2 fondi di investimento</strong> specializzati in contenuti audiovisivi</li>\n' +
      '</ul>\n' +
      '<div><strong>5.2.5 Contrattualistica e Deal Structuring</strong></div>\n' +
      '<div>INDACO S.R.L. ha fornito supporto nella <strong>negoziazione e strutturazione di accordi</strong> con finanziatori e partner:</div>\n' +
      '<div><strong>Contratti revisionati e negoziati:</strong></div>\n' +
      '<ul>\n' +
      '<li><strong>Accordi di co-produzione</strong>: Review e commento di 3 co-production agreements, supporto in negoziazione di profit sharing e territorial rights</li>\n' +
      '<li><strong>Accordi con broadcaster</strong>: Analisi termini proposti da RAI Cinema per JASTIMARI, negoziazione migliorativa su advance payment e profit corridor</li>\n' +
      '<li><strong>Accordi con distributori</strong>: Review di distribution agreement per festival/theatrical, tutela diritti digitali per DIEGETICA</li>\n' +
      '</ul>\n' +
      '<div><strong>Consulenza su financing structures:</strong></div>\n' +
      '<ul>\n' +
      '<li>Strutturazione di <strong>waterfall</strong> (ordine di recupero degli investimenti) per finanziatori multipli</li>\n' +
      '<li>Definizione di <strong>profit sharing schemes</strong> equi tra co-produttori</li>\n' +
      '<li>Mappatura della <strong>catena dei diritti</strong> (theatrical, TV, SVOD, AVOD, ancillary) e valorizzazione per territorio</li>\n' +
      '</ul>\n' +
      '<h3 id="5.3-risultati-quantitativi-attivit%C3%A0-di-financing">5.3 Risultati quantitativi attività di Financing</h3>\n' +
      '<div class="table" number="1">\n' +
      '<div class="table_tabular" style="text-align: center">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Indicatore</strong></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Risultato</strong></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Grant applications preparate</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">8</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Grant applications approvate (funding ottenuto)</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4 (50% success rate)</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Pitch formali a broadcaster/investitori</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">12</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Outcome positivi pitch (lettere interesse/funding)</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">6 (50% conversion rate)</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Introduzioni a operatori industriali facilitati</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">30+</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Contratti di co-produzione/distribuzione negoziati</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Ore formazione su financing strategy</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">32</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Database finanziatori creato (n. entries)</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">380+</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></div>\n' +
      '<div class="caption_table">Table 1: Metriche quantitative attività di Financing</div></div>',
    html_notCenterTables: '<div><strong>Tipologie di finanziamento mappate:</strong></div>\n' +
      '<div>\\begin{table}</div>\n' +
      '<div class="table_tabular">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Categoria</strong></td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: 9cm; vertical-align: top; "><strong>Fonti specifiche</strong></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Finanziamenti Pubblici Nazionali</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: 9cm; vertical-align: top; ">MiC - DG Cinema (sviluppo, produzione, distribuzione), Tax Credit cinema (40% costi italiani), Fondi regionali (Calabria Film Commission, altre regioni)</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Finanziamenti Pubblici Europei</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: 9cm; vertical-align: top; ">Creative Europe MEDIA, Eurimages, Programmi bilaterali (es. Italia-Francia)</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Broadcaster e Piattaforme</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: 9cm; vertical-align: top; ">RAI Cinema, Sky Italia, Netflix Italia, Prime Video, Disney+, Mediaset</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Fondazioni Private</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: 9cm; vertical-align: top; ">Fondazioni culturali, fondazioni tematiche (ambiente, sociale), sponsorship corporate</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Co-Produzione Internazionale</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: 9cm; vertical-align: top; ">Produttori esteri con track record, sales agents con advance payments</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Equity e Investitori Privati</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: 9cm; vertical-align: top; ">Angel investors settore audiovisivo, fondi di investimento in contenuti, family offices</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></div>\n' +
      '<div>\\end{table&gt;</div>\n' +
      '<h3 id="5.2-attivit%C3%A0-di-financing-realizzate">5.2 Attività di Financing realizzate</h3>\n' +
      '<div><strong>5.2.1 Mappatura Opportunità di Finanziamento</strong></div>\n' +
      '<div>INDACO S.R.L. ha condotto una <strong>mappatura sistematica</strong> di tutte le opportunità di finanziamento rilevanti per i progetti DIEGETICA PRODUCTION, creando un database strutturato che include:</div>\n' +
      '<ul>\n' +
      '<li><strong>200+ bandi e opportunità</strong> pubbliche italiane ed europee</li>\n' +
      '<li><strong>50+ broadcaster e piattaforme</strong> con profiling dettagliato (generi preferiti, budget range, decision makers)</li>\n' +
      '<li><strong>30+ fondazioni</strong> tematiche con criteri di funding e contatti</li>\n' +
      '<li><strong>100+ co-produttori internazionali</strong> segmentati per paese, genere, budget range</li>\n' +
      '</ul>\n' +
      '<div><strong>Output:</strong> Database gestionale con alert automatici su nuove opportunità, deadline, requisiti</div>\n' +
      '<div><strong>5.2.2 Preparazione Domande di Contributo</strong></div>\n' +
      '<div>Per ciascun progetto, INDACO S.R.L. ha fornito supporto nella preparazione di <strong>grant applications</strong> per finanziamenti pubblici:</div>\n' +
      '<div><strong>Progetti per cui sono state preparate domande:</strong></div>\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize"><span class="li_level">•</span><strong>JASTIMARI</strong>: Domanda MiC DG Cinema - Bando Produzione (prep. documentazione 120+ pagine)</li><li class="li_itemize"><span class="li_level">•</span><strong>COBALTO</strong>: Domanda Creative Europe MEDIA Development (prep. application form inglese + allegati)</li><li class="li_itemize"><span class="li_level">•</span><strong>LA PREDA</strong>: Domanda MiC DG Cinema - Bando Serie TV (prep. documentazione 150+ pagine con series bible)</li><li class="li_itemize"><span class="li_level">•</span><strong>VOLEVO LA MIA OASI</strong>: Grant application a 3 fondazioni ambientaliste</li></ul><div><strong>Componenti standard di grant application:</strong></div>\n' +
      '<ol class="enumerate decimal" style="list-style-type: decimal"><li class="li_enumerate"><strong>Synopsis e Treatment</strong>: Versioni calibrate per application (lunghezza, tone, focus su elementi valutati)</li><li class="li_enumerate"><strong>Budget dettagliato</strong>: Formattato secondo requirement specifici del bando</li><li class="li_enumerate"><strong>Financing plan</strong>: Dimostrazione sostenibilità finanziaria con altre fonti confermate/previste</li><li class="li_enumerate"><strong>Track record</strong>: CV produttori, regista, cast; filmografia aziendale</li><li class="li_enumerate"><strong>Distribution strategy</strong>: Piano distributivo credibile con lettere di interesse distributori</li><li class="li_enumerate"><strong>Festival strategy</strong>: Target festival con rationale</li><li class="li_enumerate"><strong>Impact assessment</strong>: Per bandi che valutano ricadute territoriali/sociali/culturali</li></ol><div><strong>Tasso di successo:</strong> Su 8 grant applications preparate con supporto INDACO, 4 hanno ottenuto finanziamento (50% success rate, significativamente sopra media settoriale ~20-25%)</div>\n' +
      '<div><strong>5.2.3 Investor Pitch e Presentazioni</strong></div>\n' +
      '<div>INDACO S.R.L. ha preparato e affiancato DIEGETICA PRODUCTION in <strong>pitch presentations</strong> per potenziali investitori, broadcaster e co-produttori:</div>\n' +
      '<div><strong>Pitch realizzati:</strong></div>\n' +
      '<ul>\n' +
      '<li><strong>Pitch a RAI Cinema</strong> per JASTIMARI: Presentazione in presenza presso sede RAI Roma, outcome positivo con lettera di interesse</li>\n' +
      '<li><strong>Pitch a Sky Italia</strong> per LA PREDA: Pre-pitch via video call, invito a pitch formale (in programma Q1 2026)</li>\n' +
      '<li><strong>Pitch a produttori francesi</strong> per COBALTO: Incontri al Marché du Film Cannes 2024, identification di 2 co-produttori interessati</li>\n' +
      '<li><strong>Pitch a fondazioni</strong> per VOLEVO LA MIA OASI: Presentazioni video + Q&amp;A, 1 grant ottenuto</li>\n' +
      '</ul>\n' +
      '<div><strong>Materiali di pitch preparati:</strong></div>\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize"><span class="li_level">•</span><strong>Pitch deck professionali</strong> (30-50 slide): Visual identity coerente, storytelling efficace, dati economici chiari</li><li class="li_itemize"><span class="li_level">•</span><strong>Teaser trailer</strong> o concept video: Per progetti con materiali visual disponibili</li><li class="li_itemize"><span class="li_level">•</span><strong>One-pager</strong>: Executive summary di 1 pagina per primo contatto</li><li class="li_itemize"><span class="li_level">•</span><strong>Leave-behind package</strong>: Documentazione completa da lasciare dopo il pitch</li></ul><div><strong>Training erogato:</strong></div>\n' +
      '<ul>\n' +
      '<li><strong>Workshop “Effective Pitching”</strong> (8 ore): Tecniche di presentazione, storytelling, gestione Q&amp;A</li>\n' +
      '<li><strong>Mock pitch sessions</strong> (6 sessioni): Simulazioni con feedback strutturato</li>\n' +
      '<li><strong>Pitch coaching individuale</strong> per Anna Giulia Aura e Giovanni Carpanzano (12 ore totali)</li>\n' +
      '</ul>\n' +
      '<div><strong>5.2.4 Networking e Relazioni Industriali</strong></div>\n' +
      '<div>INDACO S.R.L. ha facilitato l’inserimento di DIEGETICA PRODUCTION nelle <strong>reti professionali</strong> del settore cinematografico:</div>\n' +
      '<div><strong>Eventi e mercati partecipati con accompagnamento INDACO:</strong></div>\n' +
      '<ul class="itemize" style="list-style-type: none"><li class="li_itemize"><span class="li_level">•</span><strong>Marché du Film - Cannes 2024</strong>: Accompagnamento in loco, presentazione a 15 produttori/sales agents, organizzazione di 8 meeting pre-programmati</li><li class="li_itemize"><span class="li_level">•</span><strong>MIA Market - Roma 2024</strong>: Partecipazione congiunta, pitch DIEGETICA projects a operatori italiani</li><li class="li_itemize"><span class="li_level">•</span><strong>Berlinale Co-Production Market 2025</strong>: Preparazione materiali, coaching pre-mercato (mercato previsto febbraio 2025)</li></ul><div><strong>Introduzioni strategiche realizzate:</strong></div>\n' +
      '<ul>\n' +
      '<li><strong>5 broadcaster italiani</strong>: Introduzione diretta a development executives e acquisitions managers</li>\n' +
      '<li><strong>10 co-produttori europei</strong>: Introduzioni calde con email di presentazione INDACO</li>\n' +
      '<li><strong>3 sales agents internazionali</strong>: Incontri facilitati per potenziale rappresentanza internazionale progetti DIEGETICA</li>\n' +
      '<li><strong>2 fondi di investimento</strong> specializzati in contenuti audiovisivi</li>\n' +
      '</ul>\n' +
      '<div><strong>5.2.5 Contrattualistica e Deal Structuring</strong></div>\n' +
      '<div>INDACO S.R.L. ha fornito supporto nella <strong>negoziazione e strutturazione di accordi</strong> con finanziatori e partner:</div>\n' +
      '<div><strong>Contratti revisionati e negoziati:</strong></div>\n' +
      '<ul>\n' +
      '<li><strong>Accordi di co-produzione</strong>: Review e commento di 3 co-production agreements, supporto in negoziazione di profit sharing e territorial rights</li>\n' +
      '<li><strong>Accordi con broadcaster</strong>: Analisi termini proposti da RAI Cinema per JASTIMARI, negoziazione migliorativa su advance payment e profit corridor</li>\n' +
      '<li><strong>Accordi con distributori</strong>: Review di distribution agreement per festival/theatrical, tutela diritti digitali per DIEGETICA</li>\n' +
      '</ul>\n' +
      '<div><strong>Consulenza su financing structures:</strong></div>\n' +
      '<ul>\n' +
      '<li>Strutturazione di <strong>waterfall</strong> (ordine di recupero degli investimenti) per finanziatori multipli</li>\n' +
      '<li>Definizione di <strong>profit sharing schemes</strong> equi tra co-produttori</li>\n' +
      '<li>Mappatura della <strong>catena dei diritti</strong> (theatrical, TV, SVOD, AVOD, ancillary) e valorizzazione per territorio</li>\n' +
      '</ul>\n' +
      '<h3 id="5.3-risultati-quantitativi-attivit%C3%A0-di-financing">5.3 Risultati quantitativi attività di Financing</h3>\n' +
      '<div class="table" number="1">\n' +
      '<div class="table_tabular">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Indicatore</strong></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Risultato</strong></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Grant applications preparate</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">8</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Grant applications approvate (funding ottenuto)</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4 (50% success rate)</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Pitch formali a broadcaster/investitori</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">12</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Outcome positivi pitch (lettere interesse/funding)</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">6 (50% conversion rate)</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Introduzioni a operatori industriali facilitati</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">30+</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Contratti di co-produzione/distribuzione negoziati</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Ore formazione su financing strategy</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">32</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Database finanziatori creato (n. entries)</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">380+</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></div>\n' +
      '<div class="caption_table">Table 1: Metriche quantitative attività di Financing</div></div>'
  }
];
