module.exports = [
  {
    latex: `a = b + c`,
    ascii:     `a=b+c`,
    ascii_old: `a=b+c`
  },
  {
    latex: `[1, 2)`,
    ascii:     `[1,2)`,
    ascii_old: `[1,2)`
  },
  {
    latex: `x^2 + 2`,
    ascii:     `x^(2)+2`,
    ascii_old: `x^(2)+2`
  },
  {
    latex: `\\begin{array}{c}{a1}&{a2}\\\\{b1}&{b2}\\end{array}`,
    ascii:     `{:[a1,a2],[b1,b2]:}`,
    ascii_old: `[a1,a2],[b1,b2]`
  },
  {
    latex: `1 3 5`,
    ascii:     `135`,
    ascii_old: `135`
  },
  {
    latex: `1 , 3 x , 5`,
    ascii:     `1,3x,5`,
    ascii_old: `1,3x,5`
  },
  {
    latex: `before\\mathbb { foo }after`,
    ascii:     `beforefooafter`,
    ascii_old: `beforefooafter`
  },
  {
    latex: `before\\mathbf { bar }after`,
    ascii:     `beforebarafter`,
    ascii_old: `beforebarafter`
  },
  {
    latex: `before\\mathcal { baz }after`,
    ascii:     `beforebazafter`,
    ascii_old: `beforebazafter`
  },
  {
    latex: `\\left\\{\\begin{array}{ l l r } { x - y - z } & { = } & { 2} \\\\ { 2x + y + z } & { = } & { 1} \\\\ { 3x - 2y - z } & { = } & { 5}\\end{array}\\right.`,
    ascii:     `{[x-y-z,=,2],[2x+y+z,=,1],[3x-2y-z,=,5]:}`,
    ascii_old: `{[x-y-z,=,2],[2x+y+z,=,1],[3x-2y-z,=,5]:}`
  },
  {
    latex: `\\operatorname { s i n }`,
    ascii:     `sin`,
    ascii_old: `sin`
  },
  {
    latex: `\\begin{array}{lll}\\operatorname{s i n}&x&y\\\\(x^2)&x&y\\end{array}`,
    ascii:     `{:[sin,x,y],[(x^(2)),x,y]:}`,
    ascii_old: `[sin,x,y],[(x^(2)),x,y]`
  },
  {
    latex: `\\left.\\begin{array}{lll}\\operatorname{s i n}&x&y\\\\(x^2)&x&y\\end{array}\\right.`,
    ascii:     `{:[sin,x,y],[(x^(2)),x,y]:}`,
    ascii_old: `{:[sin,x,y],[(x^(2)),x,y]:}`
  },
  {
    latex: `a \\operatorname { m o d } b`,
    ascii: `a mod b`,
    ascii_old: `a mod b`
  },
  {
    latex: `T _ { x } \\left( \\theta _ { r } \\right) = \\left[ \\begin{array} { l l l l } { 1} & { 0} & { 0} & { 0} \\\\ { 0} & { \\operatorname { c o s } \\theta _ { r } } & { \\operatorname { s i n } \\theta _ { r } } & { 0} \\\\ { 0} & { - \\operatorname { s i n } \\theta _ { r } } & { \\operatorname { c o s } \\theta _ { r } } & { 0} \\\\ { 0} & { 0} & { 0} & { 1} \\end{array} \\right]`,
    ascii: `T_(x)(theta_(r))=[[1,0,0,0],[0,{:cos theta_(r):},{:sin theta_(r):},0],[0,{:-sin theta_(r):},{:cos theta_(r):},0],[0,0,0,1]]`,
    ascii_old: `T_(x)(theta_(r))=[[1,0,0,0],[0,cos theta_(r),sin theta_(r),0],[0,-sin theta_(r),cos theta_(r),0],[0,0,0,1]]`
  },
  {
    latex: `\\operatorname{foo}`,
    ascii:     `foo`,
    ascii_old: `foo`
  },
  {
    latex: `2 . x`,
    ascii:     `2.x`,
    ascii_old: `2.x`
  },
  {
    latex: `\\sqrt [ 2 ] { 2 }`,
    ascii:     `root(2)(2)`,
    ascii_old: `root(2)(2)`
  },
  {
    latex: `\\left.\\begin{array}{r}{a}\\\\{b}\\\\{c}\\\\\\hline\\end{array}\\right.`,
    ascii:     `{:[a],[b],[c],[hline]:}`,
    ascii_old: `{:[a],[b],[c],[hline]:}`
  },
  {
    latex: `\\left\\{\\begin{array}{r}{a}\\\\{b}\\\\{c}\\\\\\hline\\end{array}\\right\\}`,
    ascii:     `{[a],[b],[c],[hline]}`,
    ascii_old: `{[a],[b],[c],[hline]}`
  },
  {
    latex: `\\left.\\begin{array}{ll}{a1}&{a2}\\\\{b1}&{b2}\\end{array}\\right.`,
    ascii:     `{:[a1,a2],[b1,b2]:}`,
    ascii_old: `{:[a1,a2],[b1,b2]:}`
  },
  {
    latex: `\\left\\{\\begin{array}{r}{6x+2y \\leq 12}\\\\{x+y \\leq 5}\\\\{x \\geq 0}\\\\{y \\geq 0}\\end{array}\\right.`,
    ascii:     `{[6x+2y <= 12],[x+y <= 5],[x >= 0],[y >= 0]:}`,
    ascii_old: `{[6x+2y<=12],[x+y<=5],[x>=0],[y>=0]:}`
  },
  {
    latex: `f(x) = \\left\\{\\begin{array}{ll}{-x+3}&{\\text{if}x \\leq -1}\\\\{-3x+1}&{\\text{if}x > -1}\\end{array}\\right.`,
    ascii:     `f(x)={[-x+3,"if"x <= -1],[-3x+1,"if"x > -1]:}`,
    ascii_old: `f(x)={[-x+3,"if"x<=-1],[-3x+1,"if"x>-1]:}`
  },
  {
    latex: `\\left\\{\\begin{array}{rl}{6x+2y}&{ \\leq 12}\\\\{x + y}&{\\leq 5} \\\\ {x} & {\\geq 0} \\\\ {y} & {\\geq 0}\\end{array}\\right.`,
    ascii:     `{[6x+2y, <= 12],[x+y, <= 5],[x, >= 0],[y, >= 0]:}`,
    ascii_old: `{[6x+2y,<=12],[x+y,<=5],[x,>=0],[y,>=0]:}`
  },
  {
    latex: `x - 2y = - 35 \\text{ and } 2x - y = 55`,
    ascii: `x-2y=-35" and "2x-y=55`,
    ascii_old: `x-2y=-35" and "2x-y=55`
  },
  {
    latex: `(5, 2)\\text{ and }(2 , 8)`,
    ascii: `(5,2)" and "(2,8)`,
    ascii_old: `(5,2)" and "(2,8)`
  },
  {
    latex: `f ( x ) = \\left\\{ \\begin{array} { l l } { x ^ { 2} + 1,} & { x > 1} \\\\ { 1,} & { x = 1} \\\\ { x + 1,} & { x < 1} \\end{array} \\right.`,
    ascii:     `f(x)={[x^(2)+1",",x > 1],[1",",x=1],[x+1",",x < 1]:}`,
    ascii_old: `f(x)={[x^(2)+1,,x>1],[1,,x=1],[x+1,,x<1]:}`
  },
  {
    latex: `f(x)= \\left\\{ \\begin{array} {ll} { x e ^ {2x} } & { \\text{ si } } & { x < 0} \\\\ { \\frac { \\operatorname { ln } ( x + 1) } { x + 1} } & { \\text{ si } } & { x \\geq 0} \\end{array} \\right.`,
    ascii: `f(x)={[xe^(2x)," si ",x < 0],[(ln(x+1))/(x+1)," si ",x >= 0]:}`,
    ascii_old: `f(x)={[xe^(2x)," si ",x<0],[(ln(x+1))/(x+1)," si ",x>=0]:}`
  },
  {
    latex: `\\left\\{ \\begin{array} { r } { x \\geq 0,y \\geq 0} \\\\ { 2x + y \\leq 8} \\\\ { x + y \\geq 4} \\end{array} \\right.`,
    ascii:     `{[x >= 0","y >= 0],[2x+y <= 8],[x+y >= 4]:}`,
    ascii_old: `{[x>=0,y>=0],[2x+y<=8],[x+y>=4]:}`
  },
  {
    latex: `f ( x ) = \\left\\{ \\begin{array} { l l } { 2 x + 5 } & { \\text { khi } x < - 1 } \\\\ { x ^ { 2 } + 2 } & { \\text { khi } x \\geq - 1 } \\end{array} \\right.`,
    ascii:     `f(x)={[2x+5," khi "x < -1],[x^(2)+2," khi "x >= -1]:}`,
    ascii_old: `f(x)={[2x+5," khi "x<-1],[x^(2)+2," khi "x>=-1]:}`
  },
  {
    latex: `f ( x ) = \\left\\{ \\begin{array} { l } { 2x + 5\\text{ if } x < 0} \\\\ { x - 1\\text{ if } x > 0} \\end{array} \\right.`,
    ascii: `f(x)={[2x+5" if "x < 0],[x-1" if "x > 0]:}`,
    ascii_old: `f(x)={[2x+5" if "x<0],[x-1" if "x>0]:}`
  },
  {
    latex: `y = x ^ { 2} ,y = x ^ { 2} + \\operatorname{sin} ( x ^ { 3} )`,
    ascii: `y=x^(2),y=x^(2)+sin(x^(3))`,
    ascii_old: `y=x^(2),y=x^(2)+sin(x^(3))`
  },
  {
    latex: `f ( x ) = \\text{ foo } + \\left\\{ \\begin{array} { l } { 2x + 5\\text{ if } x < 0} \\\\ { x - 1\\text{ if } x > 0} \\end{array} \\right.`,
    ascii: `f(x)=" foo "+{[2x+5" if "x < 0],[x-1" if "x > 0]:}`,
    ascii_old: `f(x)=" foo "+{[2x+5" if "x<0],[x-1" if "x>0]:}`
  },
  {
    latex: `\\operatorname{sin}`,
    ascii:     `sin`,
    ascii_old: `sin`
  },
  {
    latex: `(x^2 + 1)`,
    ascii:     `(x^(2)+1)`,
    ascii_old: `(x^(2)+1)`
  },
  {
    latex: `\\{\\frac{1}{2}\\}`,
    ascii:     `{(1)/(2)}`,
    ascii_old: `{(1)/(2)}`
  },
  {
    latex: `\\langle \\frac{1}{2} \\rangle`,
    ascii:     `(:(1)/(2):)`,
    ascii_old: `(:(1)/(2):)`
  },
  {
    latex: `\\lfloor \\frac{1}{2} \\rfloor`,
    ascii:     `|__(1)/(2)__|`,
    ascii_old: `|__(1)/(2)__|`
  },
  {
    latex: `\\lceil \\frac{1}{2} \\rceil`,
    ascii:     `|~(1)/(2)~|`,
    ascii_old: `|~(1)/(2)~|`
  },
  {
    latex: `\\llcorner \\frac{1}{2} \\lrcorner`,
    ascii:     `llcorner(1)/(2)lrcorner`,
    ascii_old: `llcorner(1)/(2)lrcorner`
  },
  {
    latex: `\\ulcorner \\frac{1}{2} \\urcorner`,
    ascii:     `ulcorner(1)/(2)urcorner`,
    ascii_old: `ulcorner(1)/(2)urcorner`
  },
  {
    latex: `\\langle x \\rangle y`,
    ascii:     `(:x:)y`,
    ascii_old: `(:x:)y`
  },
  {
    latex: `\\langle (x) \\rangle (y)`,
    ascii:     `(:(x):)(y)`,
    ascii_old: `(:(x):)(y)`
  },
  {
    latex: `(x^2 + (2x + 1))`,
    ascii:     `(x^(2)+(2x+1))`,
    ascii_old: `(x^(2)+(2x+1))`
  },
  {
    latex: `(x^2) + (2x + 1) + (y^2)`,
    ascii:     `(x^(2))+(2x+1)+(y^(2))`,
    ascii_old: `(x^(2))+(2x+1)+(y^(2))`
  },
  {
    latex: `(1 + (x^2 + 2x))`,
    ascii:     `(1+(x^(2)+2x))`,
    ascii_old: `(1+(x^(2)+2x))`
  },
  {
    latex: `(1+\\{2+\\frac{1}{2}\\}+(3+4))+(5+6)`,
    ascii:     `(1+{2+(1)/(2)}+(3+4))+(5+6)`,
    ascii_old: `(1+{2+(1)/(2)}+(3+4))+(5+6)`
  },
  {
    latex: `(1+\\{2+\\frac{1}{2}\\}+(3+4))+(5+6))`,
    ascii:     `(1+{2+(1)/(2)}+(3+4))+(5+6))`,
    ascii_old: `(1+{2+(1)/(2)}+(3+4))+(5+6))`
  },
  {
    latex: `(1+\\frac{3+(x^2))}{2})`,
    ascii:     `(1+(3+(x^(2))))/(2))`,
    ascii_old: `(1+(3+(x^(2))))/(2))`
  },
  {
    latex: `(1 + \\int x dx) + (\\prod x) + (\\sum y)`,
    ascii:     `(1+int xdx)+(prod x)+(sum y)`,
    ascii_old: `(1+int xdx)+(prod x)+(sum y)`
  },
  {
    latex: `a | x y ^ 3 | ( b | c ^ 3 )`,
    ascii:     `a|xy^(3)|(b|c^(3))`,
    ascii_old: `a|xy^(3)|(b|c^(3))`
  },
  {
    latex: `a | _ b ^ c + a | ^ b _ c + a | _ b + a | ^ c`,
    ascii:     `a|_(b)^(c)+a|_(c)^(b)+a|_(b)+a|^(c)`,
    ascii_old: `a|_(b)^(c)+a|_(c)^(b)+a|_(b)+a|^(c)`
  },
  {
    latex: `a | _ { \\operatorname{s i n} ( \\pi ) }`,
    ascii: `a|_(sin(pi))`,
    ascii_old: `a|_(sin(pi))`
  },
  {
    latex: `a _ {k} | _ { I _ { m } } = : u _ { k } ^ { m } \\in V,`,
    ascii:     `a_(k)|_(I_(m))=:u_(k)^(m)in V,`,
    ascii_old: `a_(k)|_(I_(m))=:u_(k)^(m)in V,`
  },
  {
    latex: `h \\theta ( L ) = - k \\frac { d \\theta } { d x } | _ { x = L }`,
    ascii:     `h theta(L)=-k(d theta)/(dx)|_(x=L)`,
    ascii_old: `h theta(L)=-k(d theta)/(dx)|_(x=L)`
  },
  {
    latex: `f ( a | b ) = x | _ { x _ 0 } ^ { x _ 1 }`,
    ascii:     `f(a|b)=x|_(x_(0))^(x_(1))`,
    ascii_old: `f(a|b)=x|_(x_(0))^(x_(1))`
  },
  {
    latex: `a \\| x y ^ 3 \\| ( b | c ^ 3 )`,
    ascii:     `a||xy^(3)||(b|c^(3))`,
    ascii_old: `a|xy^(3)|(b|c^(3))`
  },
  {
    latex: `\\begin{aligned}{(x^2)}\\end{aligned}`,
    ascii:     `{:(x^(2)):}`,
    ascii_old: `[(x^(2))]`
  },
  {
    latex: `k : [ \\left( \\begin{array} { l } { x } \\\\ { y } \\\\ { z } \\end{array} \\right) - \\left( \\begin{array} { c } { 4 } \\\\ { 8 } \\\\ { - 2 } \\end{array} \\right) ] ^ { 2 } = 5 ^ { 2 }`,
    ascii:     `k:[([x],[y],[z])-([4],[8],[-2])]^(2)=5^(2)`,
    ascii_old: `k:[([x],[y],[z])-([4],[8],[-2])]^(2)=5^(2)`
  },
  {
    latex: `d s ^ { 2} = ( d X ^ { 0} ) ^ { 2} - R ( X ^ { 0} ) ^ { 2} \\sum _ { i = 1} ^ { D - 1} ( d X ^ { i } ) ^ { 2}`,
    ascii:     `ds^(2)=(dX^(0))^(2)-R(X^(0))^(2)sum_(i=1)^(D-1)(dX^(i))^(2)`,
    ascii_old: `ds^(2)=(dX^(0))^(2)-R(X^(0))^(2)sum_(i=1)^(D-1)(dX^(i))^(2)`
  },
  {
    latex: `\\Delta ( W _ { 1} ) ^ { i t } J ( W _ { 2} ) \\Delta ( W _ { 1} ) ^ { - i t } = J ( l ( W _ { 1} ,t ) W _ { 2} )`,
    ascii:     `Delta(W_(1))^(it)J(W_(2))Delta(W_(1))^(-it)=J(l(W_(1),t)W_(2))`,
    ascii_old: `Delta(W_(1))^(it)J(W_(2))Delta(W_(1))^(-it)=J(l(W_(1),t)W_(2))`
  },
  {
    latex: `a + \\int dx`,
    ascii:     `a+int dx`,
    ascii_old: `a+int dx`
  },
  {
    latex: `a + \\int\\int dx`,
    ascii:     `a+int int dx`,
    ascii_old: `a+int int dx`
  },
  {
    latex: `a + \\int \\int\\int dx`,
    ascii:     `a+int int int dx`,
    ascii_old: `a+int int int dx`
  },
  {
    latex: `a + \\int dx +\\int\\int dx+\\int dx`,
    ascii:     `a+int dx+int int dx+int dx`,
    ascii_old: `a+int dx+int int dx+int dx`
  },
  {
    latex: `\\int (x)`,
    ascii:     `int(x)`,
    ascii_old: `int(x)`
  },
  {
    latex: `\\left.\\begin{array}{rl}{(x^\\mathbb{2})}&{\\mathcal{=}y^2}\\end{array}\\right.`,
    ascii:     `{:[(x^(2)),=y^(2)]:}`,
    ascii_old: `{:[(x^(2)),=y^(2)]:}`
  },
  {
    latex: `\\begin{aligned}{(x^\\mathbb{2})}&{\\mathcal{=}y^2}\\end{aligned}`,
    ascii:     `{:(x^(2))=y^(2):}`,
    ascii_old: `[(x^(2)),=y^(2)]`
  },
  {
    latex: `\\left. \\begin{array} { r l } { x + y } & { = 3 } \\\\ { y } & { = x ^ { 2 } - 8 x + 15 } \\end{array} \\right.`,
    ascii:     `{:[x+y,=3],[y,=x^(2)-8x+15]:}`,
    ascii_old: `{:[x+y,=3],[y,=x^(2)-8x+15]:}`
  },
  {
    latex: `\\left\\{\\begin{array}{rl}{x+y}&{=3}\\\\{y} & {=x^{2}-8x+15}\\end{array}\\right\\}`,
    ascii:     `{[x+y,=3],[y,=x^(2)-8x+15]}`,
    ascii_old: `{[x+y,=3],[y,=x^(2)-8x+15]}`
  },
  {
    latex: `\\left.\\begin{array}{l}\\text{above }\\\\x^2\\\\\\text{ below}\\end{array}\\right.`,
    ascii: `{:["above "],[x^(2)],[" below"]:}`,
    ascii_old: `{:["above "],[x^(2)],[" below"]:}`
  },
  {
    latex: `\\left ( \\frac{1}{2} \\right )`,
    ascii:     `((1)/(2))`,
    ascii_old: `((1)/(2))`
  },
  {
    latex: `\\left \\{ \\frac{1}{2} \\right \\}`,
    ascii:     `{(1)/(2)}`,
    ascii_old: `{(1)/(2)}`
  },
  {
    latex: `\\begin{array}{c}{}\\end{array}`,
    ascii:     `{::}`,
    ascii_old: `[]`
  },
  {
    latex: `\\| x + \\left( \\begin{array}{c}{x}\\end{array} \\right) \\|`,
    ascii:     `||x+(x)||`,
    ascii_old: `|x+([x])|`
  },
  {
    latex: `{(}x^2{)}`,
    ascii:     `(x^(2))`,
    ascii_old: `(x^(2))`
  },
  {
    latex: `\\left.\\begin{array}{c}{a1}&{a2}\\\\{b1}&{b2}\\end{array}\\right.`,
    ascii:     `{:[a1,a2],[b1,b2]:}`,
    ascii_old: `{:[a1,a2],[b1,b2]:}`
  },
  {
    latex: `\\left.\\begin{array}{rl}{a1}&{a2}\\\\{b1}&{b2}\\end{array}\\right.`,
    ascii:     `{:[a1,a2],[b1,b2]:}`,
    ascii_old: `{:[a1,a2],[b1,b2]:}`
  },
  {
    latex: `\\left(\\begin{array}{rl}{x+y}&{=3}\\\\{y} & {=x^{2}-8x+15}\\end{array}\\right)`,
    ascii:     `([x+y,=3],[y,=x^(2)-8x+15])`,
    ascii_old: `([x+y,=3],[y,=x^(2)-8x+15])`
  },
  {
    latex: `\\left[\\begin{array}{rl}{x+y}&{=3}\\\\{y} & {=x^{2}-8x+15}\\end{array}\\right]`,
    ascii:     `[[x+y,=3],[y,=x^(2)-8x+15]]`,
    ascii_old: `[[x+y,=3],[y,=x^(2)-8x+15]]`
  },
  {
    latex: `\\begin{array}{l}{\\text{2}^{5}2^{2}+[(b}\\end{array}`,
    ascii:     `{:"2"^(5)2^(2)+[(b:}`,
    ascii_old: `["2"^(5)2^(2)+[(b]`
  },
  {
    latex: `a + \\text {This is }\\text{text} + b`,
    ascii: `a+"This is ""text"+b`,
    ascii_old: `a+"This is ""text"+b`
  },
  {
    latex: `\\text { foo } - 4 ^ { \\text { superscript } } \\text { bar }`,
    ascii: `" foo "-4^(" superscript ")" bar "`,
    ascii_old: `" foo "-4^(" superscript ")" bar "`
  },
  {
    latex: `\\text{The latex for }\\operatorname{sin}(x)\\text{is \\operatorname{sin}(x).}`,
    ascii: `"The latex for "sin(x)"is \\operatorname{sin}(x)."`,
    ascii_old: `"The latex for "sin(x)"is \\operatorname{sin}(x)."`
  },
  {
    latex: `\\left.\\begin{array}{l}\\text{Now is}\\\\\\text{the time}\\end{array}\\right.`,
    ascii:     `{:["Now is"],["the time"]:}`,
    ascii_old: `{:["Now is"],["the time"]:}`
  },
  {
    latex: `\\left.\\begin{array}{l}\\text{Now is}\\\\\\text{the time}\\\\\\text{for all good men}\\\\\\text{to come to the aid}\\end{array}\\right.`,
    ascii:     `{:["Now is"],["the time"],["for all good men"],["to come to the aid"]:}`,
    ascii_old: `{:["Now is"],["the time"],["for all good men"],["to come to the aid"]:}`
  },
  {
    latex: `\\text { Figure } 1.1 : \\text { Relative translational motion }`,
    ascii: `" Figure "1.1:" Relative translational motion "`,
    ascii_old: `" Figure "1.1:" Relative translational motion "`
  },
  {
    latex: `\\text { Under the simple parameterization } ( 4.1 ) \\text { of }`,
    ascii: `" Under the simple parameterization "(4.1)" of "`,
    ascii_old: `" Under the simple parameterization "(4.1)" of "`
  },
  {
    latex: `\\left.\\begin{array}{l}{\\text{foo}} \\\\ { \\theta + C }\\end{array} \\right.`,
    ascii:     `{:["foo"],[theta+C]:}`,
    ascii_old: `{:["foo"],[theta+C]:}`
  },
  {
    latex: `\\begin{array} { l } { \\text { How do we represent tables internally to do } } \\\\ { \\text { recognition? } } \\\\ { \\text { What is our preferred table format for editing in our } } \\\\ { \\text { apps? } } \\end{array}`,
    ascii: `{:[" How do we represent tables internally to do "],[" recognition? "],[" What is our preferred table format for editing in our "],[" apps? "]:}`,
    ascii_old: `[" How do we represent tables internally to do "],[" recognition? "],[" What is our preferred table format for editing in our "],[" apps? "]`
  },
  {
    latex: `\\begin{array} { l } { \\text { A relatively long line of text that ends with a colon: } } \\\\ { \\text { leave the newline } } \\end{array}`,
    ascii: `{:[" A relatively long line of text that ends with a colon: "],[" leave the newline "]:}`,
    ascii_old: `[" A relatively long line of text that ends with a colon: "],[" leave the newline "]`
  },
  {
    latex: `\\begin{array} { l } { \\text { A relatively long line of text that is followed by } } \\\\ { \\text { - a line that looks like a list item } } \\end{array}`,
    ascii: `{:[" A relatively long line of text that is followed by "],[" - a line that looks like a list item "]:}`,
    ascii_old: `[" A relatively long line of text that is followed by "],[" - a line that looks like a list item "]`
  },
  {
    latex: `\\begin{array} { l } { a + b + c + d + e + f + g + h + i + j + k + l + } \\\\ { m + n } \\end{array}`,
    ascii:     `{:[a+b+c+d+e+f+g+h+i+j+k+l+],[m+n]:}`,
    ascii_old: `[a+b+c+d+e+f+g+h+i+j+k+l+],[m+n]`
  },
  {
    latex: `x ^ 2`,
    ascii:     `x^(2)`,
    ascii_old: `x^(2)`
  },
  {
    latex: `\\{ \\begin{array} { l } { 4 x - 3 y = 6 } \\\\ { y = - 3 x + 15 } \\end{array}`,
    ascii:     `{{:[4x-3y=6],[y=-3x+15]:}`,
    ascii_old: `{[4x-3y=6],[y=-3x+15]`
  },
  {
    latex: `10^3`,
    ascii:     `10^(3)`,
    ascii_old: `10^(3)`
  },
  {
    latex: `.3`,
    ascii:     `.3`,
    ascii_old: `.3`
  },
  {
    latex: `\\int_a^b`,
    ascii:     `int_(a)^(b)`,
    ascii_old: `int_(a)^(b)`
  },
  {
    latex: `\\sum_{i=0}^{10}`,
    ascii:     `sum_(i=0)^(10)`,
    ascii_old: `sum_(i=0)^(10)`
  },
  {
    latex: `a\\pm b`,
    ascii:     `a+-b`,
    ascii_old: `a+-b`
  },
  {
    latex: `x\\approx y`,
    ascii:     `x~~y`,
    ascii_old: `x~~y`
  },
  {
    latex: `x\\cdot y`,
    ascii:     `x*y`,
    ascii_old: `x*y`
  },
  {
    latex: `a \\dots b`,
    ascii:     `a dots b`,
    ascii_old: `a dots b`
  },
  {
    latex: `\\frac{n!}{k!(n-k)!}`,
    ascii:     `(n!)/(k!(n-k)!)`,
    ascii_old: `(n!)/(k!(n-k)!)`
  },
  {
    latex: `\\lim_{x\\rightarrow 0}{x^2}`,
    ascii:     `lim_(x rarr0)x^(2)`,
    ascii_old: `lim_(x rarr0)x^(2)`
  },
  {
    latex: `\\operatorname { archyp } \\operatorname { tan } ( x )`,
    ascii: `archyp tan(x)`,
    ascii_old: `archyp tan(x)`
  },

  {
    latex: '\\begin{array}{l}\n' +
      '3 x+2 y=-2 \\\\\n' +
      'x-2 y=-6\n' +
      '\\end{array}',
    ascii: `{:[3x+2y=-2],[x-2y=-6]:}`,
  },
  {
    latex: '\\begin{aligned} \n' +
      'x y &=-24 \\\\ \n' +
      '5 x+4 y &=4 \n' +
      '\\end{aligned}',
    ascii: `{:[xy=-24],[5x+4y=4]:}`,
  },
  {
    latex: 't=\\sqrt{\\frac{(2) 42}{9.8} \\mathrm{~m} / \\mathrm{s}^{2}}',
    ascii: `t=sqrt(((2)42)/(9.8)m//s^(2))`,
  },
  {
    latex: '200 \\mathrm{~V}',
    ascii: `200V`,
  },
];
