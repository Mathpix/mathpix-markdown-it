module.exports = [
  {
    latex: `\\operatorname{unknown} \\left\\{\\begin{array}{ll}{-x+3}&{\\text{if}x \\leq -1}\\\\{-3x+1}&{\\text{if}x > -1}\\end{array}\\right. \\operatorname{unknown}`,
    ascii:    `unknown{[-x+3,"if"x <= -1],[-3x+1,"if"x > -1]:}unknown`,
    ascii_old: `unknown{[-x+3,"if"x<=-1],[-3x+1,"if"x>-1]:}unknown`
  },
  {
    latex: `\\left. \\begin{array} { r l } { \\hat { V } _ { L } } & { = \\sum _ { \\mathbf { m } , \\mathbf { n } } \\sum _ { l , m _ { l } } v _ { l } ( k _ { m ^ { 2 } } , k _ { n ^ { 2 } } ) Y _ { l m _ { l } } ^ { * } ( \\hat { \\mathbf { m } } ) Y _ { l m _ { l } } ( \\hat { \\mathbf { n } } ) | \\mathbf { m } \\rangle \\langle \\mathbf { n } | } \\\\ { } & { = \\sum _ { m ^ { 2 } , n ^ { 2 } } \\sum _ { l } v _ { l } ( k _ { m ^ { 2 } } , k _ { n ^ { 2 } } ) \\sum _ { m _ { l } } ( \\sum _ { \\mathbf { m } } Y _ { l m _ { l } } ^ { * } ( \\hat { \\mathbf { m } } ) | \\mathbf { m } \\rangle ) ( \\sum _ { \\hat { \\mathbf { n } } } Y _ { l m _ { l } } ( \\hat { \\mathbf { n } } ) \\langle \\mathbf { n } | ) } \\end{array} \\right.`,
    ascii:    `{:[ hat(V)_(L),{:=sum_(m,n)sum_(l,m_(l))v_(l)(k_(m^(2))","k_(n^(2)))Y_(lm_(l))^(**)( hat(m))Y_(lm_(l))( hat(n))|m:)(:n|:}],[,{:=sum_(m^(2),n^(2))sum_(l)v_(l)(k_(m^(2))","k_(n^(2)))sum_(m_(l))(sum_(m)Y_(lm_(l))^(**)( hat(m))|m:))(sum_( hat(n))Y_(lm_(l))( hat(n))(:n|):}]:}`,
    ascii_old: `{:[hat V_(L),=sum_(m,n)sum_(l,m_(l))v_(l)(k_(m^(2)),k_(n^(2)))Y_(lm_(l))^(*)(hat m)Y_(lm_(l))(hat n)|m:)(:n|],[,=sum_(m^(2),n^(2))sum_(l)v_(l)(k_(m^(2)),k_(n^(2)))sum_(m_(l))(sum_(m)Y_(lm_(l))^(*)(hat m)|m:))(sum_(hat n)Y_(lm_(l))(hat n)(:n|)]:}`,
  },
  {
    latex: `1+\\int_{vR}^{v}(\\frac{\\epsilon(bu-F(u)-I))}{(F(u)-W(u)+I)^{2}})\\frac{\\partial W(u)}{\\partial w_{0}}du`,
    ascii:    `1+int_(vR)^(v)((epsilon(bu-F(u)-I)))/((F(u)-W(u)+I)^(2)))(del W(u))/(delw_(0))du`,
    ascii_old: `1+int_(vR)^(v)((epsilon(bu-F(u)-I)))/((F(u)-W(u)+I)^(2)))(del W(u))/(del w_(0))du`
  },
  {
    latex: `\\bigoplus\\bigcup\\bigcap\\geqq\\leqq\\longrightarrow\\top\\longleftrightarrow\\Longrightarrow\\longrightarrow\\longleftarrow\\Longleftarrow\\Longleftrightarrow\\longmapsto\\widetilde{x}\\widehat{x}`,
    ascii:    `bigoplus uuu nnn >=   <=  longrightarrow TT longleftrightarrow Longrightarrow longrightarrow longleftarrow Longleftarrow Longleftrightarrow longmapsto widetilde(x) widehat(x)`,
    ascii_old: `bigoplus uuu nnn>=<=longrightarrow TT longleftrightarrow Longrightarrow longrightarrow longleftarrow Longleftarrow Longleftrightarrow longmapsto widetilde x widehat x`,
  },
  {
    latex: `W ( R ,\\gamma ) = \\operatorname { Tr } _ { R } \\mathcal { P } { \\exp ( i \\oint _ { \\gamma } \\mathbf { A } _ { \\mu } d x ^ { \\mu } ) } \\equiv \\chi _ { R } ( U _ { \\gamma } )`,
    ascii:    `W(R,gamma)=Tr_(R)Pexp(ioint_(gamma)A_(mu)dx^(mu))-=chi_(R)(U_(gamma))`,
    ascii_old: `W(R,gamma)=Tr_(R)P exp(i oint_(gamma)A_(mu)dx^(mu))-=chi_(R)(U_(gamma))`,
  },
  {
    latex: `1 6 \\int _ { 0 } ^ { 3 } [ \\frac { 1 } { 2 } \\theta + \\frac { 1 } { 4 } \\operatorname { s i n } ( 2 \\theta ) + \\operatorname { c o s } ( \\theta ) - \\frac { 1 } { 3 } \\operatorname { c o s } ^ { 3 } ( \\theta ) ] | _ { 0 } ^ { 2 \\pi } d z`,
    ascii:    `16int_(0)^(3)[(1)/(2)theta+(1)/(4)sin(2theta)+cos(theta)-(1)/(3)cos^(3)(theta)]|_(0)^(2pi)dz`,
    ascii_old: `16int_(0)^(3)[(1)/(2)theta+(1)/(4)sin(2 theta)+cos(theta)-(1)/(3)cos^(3)(theta)]|_(0)^(2 pi)dz`,
  },
  {
    latex: `\\operatorname { Pr }\\left(\\text { test error } \\leqslant \\text { training error }+\\sqrt{\\frac{1}{N}\\left[D\\left(\\log \\left(\\frac{2 N}{D}\\right)+1\\right)-\\log \\left(\\frac{\\eta}{4}\\right)\\right]}\\right)=1-\\eta`,
    ascii:    `Pr(" test error "leqslant" training error "+sqrt((1)/(N)[D(log((2N)/(D))+1)-log((eta)/(4))]))=1-eta`,
    ascii_old: `Pr(" test error "leqslant" training error "+sqrt((1)/(N)[D(log((2N)/(D))+1)-log((eta)/(4))]))=1-eta`,
  },
  {
    latex: `\\vec{a}`,
    ascii: `vec(a)`,
    ascii_old: `vec a`
  },
  {
    latex: `\\vec{ab}`,
    ascii: `vec(ab)`,
    ascii_old: `vec ab`
  },
  {
    latex: `\\vec{ab_1}`,
    ascii: `vec(ab_(1))`,
    ascii_old: `vec ab_(1)`
  },
  {
    latex: `\\vec{\\theta}`,
    ascii: `vec(theta)`,
    ascii_old: `vec theta`
  },
  {
    latex: `\\text { Supposons que } u _ { 0 } \\in ] 0 , 1 [ \\text { . }`,
    ascii:    `" Supposons que "u_(0)in]0,1[" . "`,
    ascii_old: `" Supposons que "u_(0)in]0,1[" ."`
  },
  {
    latex: `\\begin{array}{rlrl}{-i x_{+} \\cdot \\tilde{\\sigma} \\tau_{+}} & {=2 \\overline{\\theta}_{b} p_{+}} & {} & {p \\prec 0} \\\\ {2 \\theta^{a} \\tau_{+}} & {=\\delta_{b}^{a} p_{+}} & {} & {p \\succ 0}\\end{array}`,
    ascii:    `{:[{:-ix_(+)* tilde(sigma)tau_(+):},{:=2 bar(theta)_(b)p_(+):},,p-<0],[{:2theta^(a)tau_(+):},{:=delta_(b)^(a)p_(+):},,p>-0]:}`,
    ascii_old: `[-ix_(+)*tilde sigma tau_(+),=2bar(theta)_(b)p_(+),,p-<0],[2 theta^(a)tau_(+),=delta_(b)^(a)p_(+),,p>-0]`,
  },
  {
    latex: `\\left.\\begin{array} { l } \\text{This is one of the best things I have seen in a while.} \\\\ \\text{They use the same pink dye that they use on bank} \\\\ \\text{notes. This makes the Ivory unsellable and it can't} \\\\ \\text{be consumed. (the animals are not harmed and it is} \\end{array} \\right.`,
    ascii:    `{:["This is one of the best things I have seen in a while."],["They use the same pink dye that they use on bank"],["notes. This makes the Ivory unsellable and it can't"],["be consumed. (the animals are not harmed and it is"]:}`,
    ascii_old: `{:["This is one of the best things I have seen in a while."],["They use the same pink dye that they use on bank"],["notes.This makes the Ivory unsellable and it can't"],["be consumed.(the animals are not harmed and it is"]:}`,
  },
  {
    latex: `\\begin{array} { l } { \\text { This } } \\\\ { \\qquad x + y } \\\\ { \\text { and this is cool } } \\\\ { \\qquad \\operatorname { s i n } ( x ) } \\end{array}`,
    ascii:    `{:[" This "],[qquad x+y],[" and this is cool "],[qquad sin(x)]:}`,
    ascii_old: `[" This "],[qquad x+y],[" and this is cool "],[qquad sin(x)]`,
  },
  {
    latex: `\\begin{array} { l } { \\text { A relatively long line of text that is followed by } } \\\\ { \\text { 3.2 a line that looks like an enumerated list item } } \\end{array}`,
    ascii:    `{:[" A relatively long line of text that is followed by "],[" 3.2 a line that looks like an enumerated list item "]:}`,
    ascii_old: `[" A relatively long line of text that is followed by "],[" 3.2a line that looks like an enumerated list item "]`,
  },
  {
    latex: `\\overline{xyz}`,
    ascii: `bar(xyz)`,
    ascii_old: `bar(xyz)`,
  },
];
