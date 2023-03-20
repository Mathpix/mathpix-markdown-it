module.exports = [
  {
    latex: `\\begin{tabular}{|l|l|}\n\\hline I: & $\\begin{aligned} & \\text { Cancer is essentially a genetic disease caused by } \\\\\n& \\text { multiple mutational events. }\\end{aligned}$ \\\\\n\\hline II: & $\\begin{aligned} & \\text { Cancerous cells are rapidly dividing cells that } \\\\\n& \\text { exhibit contact inhibition. }\\end{aligned}$ \\\\\n\\hline III: & $\\begin{aligned} & \\text { Metstatsis is the most feared complication of any } \\\\\n& \\text { cancer. }\\end{aligned}$ \\\\\n\\hline\n\\end{tabular}`,
    tsv: `I:	" Cancer is essentially a genetic disease caused by 
 multiple mutational events. "
II:	" Cancerous cells are rapidly dividing cells that 
 exhibit contact inhibition. "
III:	" Metstatsis is the most feared complication of any 
 cancer. "`
  },
  {
    latex: "\\begin{tabular}{|l|l|}\n\\hline 1. & The $\\mathrm{N}$ and the $\\mathrm{C}$ terminus of the polypeptide \\\\\n\\hline 2. & The $\\mathrm{C}$ and the $\\mathrm{N}$ terminus of the polypeptide \\\\\n\\hline 3. & $\\begin{aligned} & \\text { The constant and variable regions of the antibody } \\\\\n& \\text { molecule }\\end{aligned}$ \\\\\n\\hline 4. & $\\begin{aligned} & \\text { The variable and constant regions of the antibody } \\\\\n& \\text { molecule }\\end{aligned}$ \\\\\n\\hline\n\\end{tabular}",
    tsv: `1.	The N and the C terminus of the polypeptide
2.	The C and the N terminus of the polypeptide
3.	" The constant and variable regions of the antibody 
 molecule "
4.	" The variable and constant regions of the antibody 
 molecule "`
  },
  {
    latex: "\\begin{tabular}{|c|l|}\n\\hline TRANS. \\# & ACCOUNT TITLES AND EXPLANATION \\\\\n\\hline a) & $\\begin{gathered}\\text { Depreciation Expense-Equipment } \\\\\n\\text { Accumulated Depreciation-Equipment }\\end{gathered}$ \\\\\n\\hline b) & $\\begin{gathered}\\text { Insurance Expense } \\\\\n\\text { Prepaid Insurance }\\end{gathered}$ \\\\\n\\hline c) & $\\begin{gathered}\\text { Supplies Expense } \\\\\n\\text { Supplies }\\end{gathered}$ \\\\\n\\hline d) & $\\begin{gathered}\\text { Unearned Service Revenue } \\\\\n\\text { Service Revenue }\\end{gathered}$ \\\\\n\\hline e) & $\\begin{gathered}\\text { Insurance Expense } \\\\\n\\text { Prepaid Insurance }\\end{gathered}$ \\\\\n\\hline f) & $\\begin{aligned} & \\text { Wages Expense } \\\\\n& \\text { Wages Payable }\\end{aligned}$ \\\\\n\\hline\n\\end{tabular}",
    tsv: `TRANS. #	ACCOUNT TITLES AND EXPLANATION
a)	" Depreciation Expense-Equipment 
 Accumulated Depreciation-Equipment "
b)	" Insurance Expense 
 Prepaid Insurance "
c)	" Supplies Expense 
 Supplies "
d)	" Unearned Service Revenue 
 Service Revenue "
e)	" Insurance Expense 
 Prepaid Insurance "
f)	" Wages Expense 
 Wages Payable "`
  },
  {
    latex: '\\begin{tabular}{|l|r|r|r|}\n\\hline \\multicolumn{1}{|c|}{ Particulars } & \\multicolumn{1}{c|}{$\\begin{gathered}\\text { Planning } \\\\\n\\text { budget }\\end{gathered}$} & \\multicolumn{1}{c|}{$\\begin{gathered}\\text { Flexible } \\\\\n\\text { budget }\\end{gathered}$} & \\multicolumn{1}{c|}{$\\begin{gathered}\\text { Activity } \\\\\n\\text { variance }\\end{gathered}$} \\\\\n\\hline Revenue (a) & $\\mathbf{8 1 , 0 0 0}$ & $\\mathbf{8 0 , 1 0 0}$ & $\\begin{array}{r}\\mathbf{9 0 0} \\\\\n\\text { Unfavorable }\\end{array}$ \\\\\n\\hline Expenses: & & & \\\\\n\\hline Raw materials & 43,200 & 42,720 & 480 Favorable \\\\\n\\hline Wages and salaries & 10,600 & 10,540 & 60 Favorable \\\\\n\\hline Utilities & 3,300 & 3,290 & 10 Favorable \\\\\n\\hline Facility rent & 4300 & 4300 & $-$ \\\\\n\\hline Insurance & 2,300 & 2,300 & $-$ \\\\\n\\hline Miscellaneous & 2,480 & 2,460 & 20 Favorable \\\\\n\\hline Total expense (b) & $\\mathbf{6 6 , 1 8 0}$ & $\\mathbf{6 5 , 6 1 0}$ & 570 favorable \\\\\n\\hline $\\begin{aligned} & \\text { Net operating income } \\\\\n& \\text { (a-b) }\\end{aligned}$ & $\\underline{\\underline{14,320}}$ & $\\underline{\\underline{14,490}}$ & $\\mathbf{3 3 0}$ \\\\\n& $\\underline{2}$ & & Unfavorable \\\\\n\\hline\n\\end{tabular}',
    tsv: `Particulars	" Planning 
 budget "	" Flexible 
 budget "	" Activity 
 variance "
Revenue (a)	81,000	80,100	"900
 Unfavorable "
Expenses:			
Raw materials	43,200	42,720	480 Favorable
Wages and salaries	10,600	10,540	60 Favorable
Utilities	3,300	3,290	10 Favorable
Facility rent	4300	4300	-
Insurance	2,300	2,300	-
Miscellaneous	2,480	2,460	20 Favorable
Total expense (b)	66,180	65,610	570 favorable
" Net operating income 
 (a-b) "	14,320__	14,490__	330
	2_		Unfavorable`
  },
  {
    latex: `\\begin{tabular}{|l|l|}
\\hline \\multicolumn{1}{|c|}{ Metrics } & \\multicolumn{1}{c|}{ Description } \\\\
\\hline $\\begin{aligned} & \\text { Source Line } \\\\
& \\text { of Code }\\end{aligned}$ & $\\begin{aligned} & \\text { SLOC measures the size of a code [13]. A higher } \\\\
& \\text { value of SLOC indicates that an entity is to be } \\\\
& \\text { difficult to test. }\\end{aligned}$ \\\\
\\hline $\\begin{aligned} & \\text { Cyclomatic } \\\\
& \\text { complexity }\\end{aligned}$ & $\\begin{aligned} & \\text { CYC measures the number of independent paths } \\\\
& \\text { through a program unit [14]. The higher this } \\\\
& \\text { metric the more likely an entity is to be difficult }\\end{aligned}$ \\\\
\\hline CountPath & $\\begin{aligned} & \\text { CountPath measures the number of unique } \\\\
& \\text { decision paths. A higher value of the CountPath } \\\\
& \\text { metric represents a more complex code structure } \\\\
& \\text { [13]. }\\end{aligned}$ \\\\
\\hline $\\begin{aligned} & \\text { Nesting } \\\\
& \\text { Degree }\\end{aligned}$ & $\\begin{aligned} & \\text { ND measures the maximum nesting level of } \\\\
& \\text { control structures in a function. The higher this } \\\\
& \\text { metric the more likely an entity is to be difficult } \\\\
& \\text { to test [15]. }\\end{aligned}$ \\\\
\\hline Information & $\\begin{aligned} & \\text { Fan-In measures information flow, which } \\\\
& \\text { represents the number of inputs a function uses. } \\\\
& \\text { Flow }\\end{aligned}$ \\\\
[16]. The more inputs from external sources the \\\\
\\hline Calling & $\\begin{aligned} & \\text { In-Degree measures the number of functions that } \\\\
& \\text { call the function corresponding to the node [17]. } \\\\
& \\text { The more dependent upon a peace of code, the } \\\\
& \\text { higher the chance it has a defect. }\\end{aligned}$ \\\\
\\hline Functions & $\\begin{aligned} & \\text { Out-Degree measures the number of functions } \\\\
& \\text { that the function corresponding to the node calls }\\end{aligned}$ \\\\
\\hline Called by \\\\
Functions & higher the more depends upon other code, the \\\\
\\hline Number of & $\\begin{aligned} & \\text { It measures the number of functions that needed } \\\\
& \\text { to be called before invoking the vulnerable } \\\\
& \\text { function [18]. The higher this metric the more } \\\\
& \\text { difficult to reach the vulnerable code. }\\end{aligned}$ \\\\
\\hline
\\end{tabular}`,
    tsv: `Metrics	Description
" Source Line 
 of Code "	" SLOC measures the size of a code [13]. A higher 
 value of SLOC indicates that an entity is to be 
 difficult to test. "
" Cyclomatic 
 complexity "	" CYC measures the number of independent paths 
 through a program unit [14]. The higher this 
 metric the more likely an entity is to be difficult "
CountPath	" CountPath measures the number of unique 
 decision paths. A higher value of the CountPath 
 metric represents a more complex code structure 
 [13]. "
" Nesting 
 Degree "	" ND measures the maximum nesting level of 
 control structures in a function. The higher this 
 metric the more likely an entity is to be difficult 
 to test [15]. "
Information	" Fan-In measures information flow, which 
 represents the number of inputs a function uses. 
 Flow "
. The more inputs from external sources the	
Calling	" In-Degree measures the number of functions that 
 call the function corresponding to the node [17]. 
 The more dependent upon a peace of code, the 
 higher the chance it has a defect. "
Functions	" Out-Degree measures the number of functions 
 that the function corresponding to the node calls "
Called by	
Functions	higher the more depends upon other code, the
Number of	" It measures the number of functions that needed 
 to be called before invoking the vulnerable 
 function [18]. The higher this metric the more 
 difficult to reach the vulnerable code. "`
  },
  {
    latex: "\\begin{tabular}{|c|l|l|l|}\n\\hline p. & Pleiotropy & I. & $\\begin{aligned} & \\text { Column-II } \\\\\n& \\text { More than two } \\\\\n& \\text { alleles occur at the } \\\\\n& \\text { same locus on } \\\\\n& \\text { homologous } \\\\\n& \\text { chromosomes }\\end{aligned}$ \\\\\n\\hline q. & $\\begin{aligned} & \\text { Multiple } \\\\\n& \\text { alleles }\\end{aligned}$ & II. $\\begin{aligned} & \\text { Expression of both } \\\\\n& \\text { the alleles in } \\\\\n& \\text { heterozygous } \\\\\n& \\text { condition }\\end{aligned}$ \\\\\n\\hline r. & $\\begin{aligned} & \\text { Polygenic } \\\\\n& \\text { inheritance }\\end{aligned}$ & III. & $\\begin{aligned} & \\text { Multiple effect of } \\\\\n& \\text { single gene }\\end{aligned}$ \\\\\n\\hline s. & $\\begin{aligned} & \\text { Co- } \\\\\n& \\text { dominance }\\end{aligned}$ & IV. & $\\begin{aligned} & \\text { Single phenotypic } \\\\\n& \\text { character } \\\\\n& \\text { influenced by more } \\\\\n& \\text { than two genes }\\end{aligned}$ \\\\\n\\hline\n\\end{tabular}",
    tsv: `p.	Pleiotropy	I.	" Column-II 
 More than two 
 alleles occur at the 
 same locus on 
 homologous 
 chromosomes "
q.	" Multiple 
 alleles "	II. " Expression of both 
 the alleles in 
 heterozygous 
 condition "	
r.	" Polygenic 
 inheritance "	III.	" Multiple effect of 
 single gene "
s.	" Co- 
 dominance "	IV.	" Single phenotypic 
 character 
 influenced by more 
 than two genes "`
  },
  {
    latex: "\\begin{tabular}{|l|l|l|l|l|l|}\n\\hline TSR & \\multicolumn{3}{|l|}{ (baseado em V wind e Rot. Speed } & \\\\\n\\hline $\\begin{aligned} & \\text { Rot. } \\\\\n& \\text { Speed }\\end{aligned}$ & 60 & 70 & 80 & 90 & 100 \\\\\n\\hline \\multirow{6}{*}{ V wind } & 7,853982 & 9,162979 & 10,47198 & 11,78097 & 13,08997 \\\\\n\\cline { 2 - 6 } & 6,283185 & 7,330383 & 8,37758 & 9,424778 & 10,47198 \\\\\n\\cline { 2 - 6 } & 5,235988 & 6,108652 & 6,981317 & 7,853982 & 8,726646 \\\\\n\\cline { 2 - 6 } & 4,48799 & 5,235988 & 5,983986 & 6,731984 & 7,479983 \\\\\n\\cline { 2 - 6 } & 3,926991 & 4,581489 & 5,235988 & 5,890486 & 6,544985 \\\\\n\\cline { 2 - 6 } & 3,490659 & 4,072435 & 4,654211 & 5,235988 & 5,817764 \\\\\n\\hline \\multirow{5}{*}{} & 3,141593 & 3,665191 & 4,18879 & 4,712389 & 5,235988 \\\\\n\\hline\n\\end{tabular}",
    tsv: `TSR	(baseado em V wind e Rot. Speed				
" Rot. 
 Speed "	60	70	80	90	100
V wind	7,853982	9,162979	10,47198	11,78097	13,08997
	6,283185	7,330383	8,37758	9,424778	10,47198
	5,235988	6,108652	6,981317	7,853982	8,726646
	4,48799	5,235988	5,983986	6,731984	7,479983
	3,926991	4,581489	5,235988	5,890486	6,544985
	3,490659	4,072435	4,654211	5,235988	5,817764
	3,141593	3,665191	4,18879	4,712389	5,235988`
  },
  // {
  //   latex: ``,
  //   tsv: ``
  // },
  // {
  //   latex: ``,
  //   tsv: ``
  // },
  // {
  //   latex: ``,
  //   tsv: ``
  // }
];
