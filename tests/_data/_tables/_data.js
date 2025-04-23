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
    html: `<div class="table_tabular " style="text-align: center">
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
    html_notCenterTables: `<div class="table_tabular ">
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
<div class="table_tabular " style="text-align: left">
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
<div class="table_tabular " style="text-align: left">
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
    html: `<div class="table_tabular " style="text-align: center">
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
    html_notCenterTables: `<div class="table_tabular ">
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
    html: `<div class="table " style="text-align: center">
<div class="table_tabular " style="text-align: center">
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
    html_notCenterTables: `<div class="table " style="text-align: center">
<div class="table_tabular " style="text-align: center">
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
];
