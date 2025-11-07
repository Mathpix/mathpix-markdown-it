module.exports = [
  {
    latex: `a = b + c`,
    asciimath:     `a=b+c`,
    linearmath:     `a=b+c`,
    asciimath_old: `a=b+c`
  },
  {
    latex: `[1, 2)`,
    asciimath:     `[1,2)`,
    linearmath:     `[1,2)`,
    asciimath_old: `[1,2)`
  },
  {
    latex: `x^2 + 2`,
    asciimath:     `x^(2)+2`,
    linearmath:     `x²+2`,
    asciimath_old: `x^(2)+2`
  },
  {
    latex: `\\begin{array}{c}{a1}&{a2}\\\\{b1}&{b2}\\end{array}`,
    asciimath:     `{:[a1,a2],[b1,b2]:}`,
    linearmath:     `a1 a2\nb1 b2`,
    asciimath_old: `[a1,a2],[b1,b2]`
  },
  {
    latex: `1 3 5`,
    asciimath:     `135`,
    linearmath:     `135`,
    asciimath_old: `135`
  },
  {
    latex: `1 , 3 x , 5`,
    asciimath:     `1,3x,5`,
    linearmath:     `1,3x,5`,
    asciimath_old: `1,3x,5`
  },
  {
    latex: `before\\mathbb { foo }after`,
    asciimath:     `beforefooafter`,
    linearmath:     `beforefooafter`,
    asciimath_old: `beforefooafter`
  },
  {
    latex: `before\\mathbf { bar }after`,
    asciimath:     `beforebarafter`,
    linearmath:     `beforebarafter`,
    asciimath_old: `beforebarafter`
  },
  {
    latex: `before\\mathcal { baz }after`,
    asciimath:     `beforebazafter`,
    linearmath:     `beforebazafter`,
    asciimath_old: `beforebazafter`
  },
  {
    latex: `\\left\\{\\begin{array}{ l l r } { x - y - z } & { = } & { 2} \\\\ { 2x + y + z } & { = } & { 1} \\\\ { 3x - 2y - z } & { = } & { 5}\\end{array}\\right.`,
    asciimath:     `{[x-y-z,=,2],[2x+y+z,=,1],[3x-2y-z,=,5]:}`,
    linearmath:     `{x−y−z = 2\n2x+y+z = 1\n3x−2y−z = 5`,
    asciimath_old: `{[x-y-z,=,2],[2x+y+z,=,1],[3x-2y-z,=,5]:}`
  },
  {
    latex: `\\operatorname { s i n }`,
    asciimath:     `sin`,
    linearmath:     `sin`,
    asciimath_old: `sin`
  },
  {
    latex: `\\begin{array}{lll}\\operatorname{s i n}&x&y\\\\(x^2)&x&y\\end{array}`,
    asciimath:     `{:[sin,x,y],[(x^(2)),x,y]:}`,
    linearmath:     `sin x y\n(x²) x y`,
    asciimath_old: `[sin,x,y],[(x^(2)),x,y]`
  },
  {
    latex: `\\left.\\begin{array}{lll}\\operatorname{s i n}&x&y\\\\(x^2)&x&y\\end{array}\\right.`,
    asciimath:     `{:[sin,x,y],[(x^(2)),x,y]:}`,
    linearmath:     `sin x y\n(x²) x y`,
    asciimath_old: `{:[sin,x,y],[(x^(2)),x,y]:}`
  },
  {
    latex: `a \\operatorname { m o d } b`,
    asciimath: `a mod b`,
    linearmath: `a mod b`,
    asciimath_old: `a mod b`
  },
  {
    latex: `T _ { x } \\left( \\theta _ { r } \\right) = \\left[ \\begin{array} { l l l l } { 1} & { 0} & { 0} & { 0} \\\\ { 0} & { \\operatorname { c o s } \\theta _ { r } } & { \\operatorname { s i n } \\theta _ { r } } & { 0} \\\\ { 0} & { - \\operatorname { s i n } \\theta _ { r } } & { \\operatorname { c o s } \\theta _ { r } } & { 0} \\\\ { 0} & { 0} & { 0} & { 1} \\end{array} \\right]`,
    asciimath: `T_(x)(theta_(r))=[[1,0,0,0],[0,{:cos theta_(r):},{:sin theta_(r):},0],[0,{:-sin theta_(r):},{:cos theta_(r):},0],[0,0,0,1]]`,
    linearmath: `Tₓ(θᵣ)=[[1,0,0,0],[0,cos θᵣ,sin θᵣ,0],[0,−sin θᵣ,cos θᵣ,0],[0,0,0,1]]`,
    asciimath_old: `T_(x)(theta_(r))=[[1,0,0,0],[0,cos theta_(r),sin theta_(r),0],[0,-sin theta_(r),cos theta_(r),0],[0,0,0,1]]`
  },
  {
    latex: `\\operatorname{foo}`,
    asciimath:     `foo`,
    linearmath:     `foo`,
    asciimath_old: `foo`
  },
  {
    latex: `2 . x`,
    asciimath:     `2.x`,
    linearmath:     `2.x`,
    asciimath_old: `2.x`
  },
  {
    latex: `\\sqrt [ 2 ] { 2 }`,
    asciimath:     `root(2)(2)`,
    linearmath:     `√2`,
    asciimath_old: `root(2)(2)`
  },
  {
    latex: `\\left.\\begin{array}{r}{a}\\\\{b}\\\\{c}\\\\\\hline\\end{array}\\right.`,
    asciimath:     `{:[a],[b],[c]:}`,
    linearmath:     `a\nb\nc`,
    asciimath_old: `{:[a],[b],[c]:}`
  },
  {
    latex: `\\left\\{\\begin{array}{r}{a}\\\\{b}\\\\{c}\\\\\\hline\\end{array}\\right\\}`,
    asciimath:     `{[a],[b],[c]}`,
    linearmath:     `{a\nb\nc}`,
    asciimath_old: `{[a],[b],[c]}`
  },
  {
    latex: `\\left.\\begin{array}{ll}{a1}&{a2}\\\\{b1}&{b2}\\end{array}\\right.`,
    asciimath:     `{:[a1,a2],[b1,b2]:}`,
    linearmath:     `a1 a2\nb1 b2`,
    asciimath_old: `{:[a1,a2],[b1,b2]:}`
  },
  {
    latex: `\\left\\{\\begin{array}{r}{6x+2y \\leq 12}\\\\{x+y \\leq 5}\\\\{x \\geq 0}\\\\{y \\geq 0}\\end{array}\\right.`,
    asciimath:     `{[6x+2y <= 12],[x+y <= 5],[x >= 0],[y >= 0]:}`,
    linearmath:     `{6x+2y≤12\nx+y≤5\nx≥0\ny≥0`,
    asciimath_old: `{[6x+2y<=12],[x+y<=5],[x>=0],[y>=0]:}`
  },
  {
    latex: `f(x) = \\left\\{\\begin{array}{ll}{-x+3}&{\\text{if}x \\leq -1}\\\\{-3x+1}&{\\text{if}x > -1}\\end{array}\\right.`,
    asciimath:     `f(x)={[-x+3,"if"x <= -1],[-3x+1,"if"x > -1]:}`,
    linearmath:     `f(x)={−x+3 ifx≤−1\n−3x+1 ifx>−1`,
    asciimath_old: `f(x)={[-x+3,"if"x<=-1],[-3x+1,"if"x>-1]:}`
  },
  {
    latex: `\\left\\{\\begin{array}{rl}{6x+2y}&{ \\leq 12}\\\\{x + y}&{\\leq 5} \\\\ {x} & {\\geq 0} \\\\ {y} & {\\geq 0}\\end{array}\\right.`,
    asciimath:     `{[6x+2y, <= 12],[x+y, <= 5],[x, >= 0],[y, >= 0]:}`,
    linearmath:     `{6x+2y ≤12\nx+y ≤5\nx ≥0\ny ≥0`,
    asciimath_old: `{[6x+2y,<=12],[x+y,<=5],[x,>=0],[y,>=0]:}`
  },
  {
    latex: `x - 2y = - 35 \\text{ and } 2x - y = 55`,
    asciimath: `x-2y=-35" and "2x-y=55`,
    linearmath: `x−2y=−35 and 2x−y=55`,
    asciimath_old: `x-2y=-35" and "2x-y=55`
  },
  {
    latex: `(5, 2)\\text{ and }(2 , 8)`,
    asciimath: `(5,2)" and "(2,8)`,
    linearmath: `(5,2) and (2,8)`,
    asciimath_old: `(5,2)" and "(2,8)`
  },
  {
    latex: `f ( x ) = \\left\\{ \\begin{array} { l l } { x ^ { 2} + 1,} & { x > 1} \\\\ { 1,} & { x = 1} \\\\ { x + 1,} & { x < 1} \\end{array} \\right.`,
    asciimath:     `f(x)={[x^(2)+1",",x > 1],[1",",x=1],[x+1",",x < 1]:}`,
    linearmath:     `f(x)={x²+1, x>1\n1, x=1\nx+1, x<1`,
    asciimath_old: `f(x)={[x^(2)+1,,x>1],[1,,x=1],[x+1,,x<1]:}`
  },
  {
    latex: `f(x)= \\left\\{ \\begin{array} {ll} { x e ^ {2x} } & { \\text{ si } } & { x < 0} \\\\ { \\frac { \\operatorname { ln } ( x + 1) } { x + 1} } & { \\text{ si } } & { x \\geq 0} \\end{array} \\right.`,
    asciimath: `f(x)={[xe^(2x)," si ",x < 0],[(ln(x+1))/(x+1)," si ",x >= 0]:}`,
    linearmath: `f(x)={xe²ˣ  si  x<0\n(ln(x+1))/(x+1)  si  x≥0`,
    asciimath_old: `f(x)={[xe^(2x)," si ",x<0],[(ln(x+1))/(x+1)," si ",x>=0]:}`
  },
  {
    latex: `\\left\\{ \\begin{array} { r } { x \\geq 0,y \\geq 0} \\\\ { 2x + y \\leq 8} \\\\ { x + y \\geq 4} \\end{array} \\right.`,
    asciimath:     `{[x >= 0","y >= 0],[2x+y <= 8],[x+y >= 4]:}`,
    linearmath:     `{x≥0,y≥0\n2x+y≤8\nx+y≥4`,
    asciimath_old: `{[x>=0,y>=0],[2x+y<=8],[x+y>=4]:}`
  },
  {
    latex: `f ( x ) = \\left\\{ \\begin{array} { l l } { 2 x + 5 } & { \\text { khi } x < - 1 } \\\\ { x ^ { 2 } + 2 } & { \\text { khi } x \\geq - 1 } \\end{array} \\right.`,
    asciimath:     `f(x)={[2x+5," khi "x < -1],[x^(2)+2," khi "x >= -1]:}`,
    linearmath:     `f(x)={2x+5  khi x<−1\nx²+2  khi x≥−1`,
    asciimath_old: `f(x)={[2x+5," khi "x<-1],[x^(2)+2," khi "x>=-1]:}`
  },
  {
    latex: `f ( x ) = \\left\\{ \\begin{array} { l } { 2x + 5\\text{ if } x < 0} \\\\ { x - 1\\text{ if } x > 0} \\end{array} \\right.`,
    asciimath: `f(x)={[2x+5" if "x < 0],[x-1" if "x > 0]:}`,
    linearmath: `f(x)={2x+5 if x<0\nx−1 if x>0`,
    asciimath_old: `f(x)={[2x+5" if "x<0],[x-1" if "x>0]:}`
  },
  {
    latex: `y = x ^ { 2} ,y = x ^ { 2} + \\operatorname{sin} ( x ^ { 3} )`,
    asciimath: `y=x^(2),y=x^(2)+sin(x^(3))`,
    linearmath: `y=x²,y=x²+sin(x³)`,
    asciimath_old: `y=x^(2),y=x^(2)+sin(x^(3))`
  },
  {
    latex: `f ( x ) = \\text{ foo } + \\left\\{ \\begin{array} { l } { 2x + 5\\text{ if } x < 0} \\\\ { x - 1\\text{ if } x > 0} \\end{array} \\right.`,
    asciimath: `f(x)=" foo "+{[2x+5" if "x < 0],[x-1" if "x > 0]:}`,
    linearmath: `f(x)= foo +{2x+5 if x<0\nx−1 if x>0`,
    asciimath_old: `f(x)=" foo "+{[2x+5" if "x<0],[x-1" if "x>0]:}`
  },
  {
    latex: `\\operatorname{sin}`,
    asciimath:     `sin`,
    linearmath:     `sin`,
    asciimath_old: `sin`
  },
  {
    latex: `(x^2 + 1)`,
    asciimath:     `(x^(2)+1)`,
    linearmath:     `(x²+1)`,
    asciimath_old: `(x^(2)+1)`
  },
  {
    latex: `\\{\\frac{1}{2}\\}`,
    asciimath:     `{(1)/(2)}`,
    linearmath:     `{1/2}`,
    asciimath_old: `{(1)/(2)}`
  },
  {
    latex: `\\langle \\frac{1}{2} \\rangle`,
    asciimath:     `(:(1)/(2):)`,
    linearmath:     `⟨1/2⟩`,
    asciimath_old: `(:(1)/(2):)`
  },
  {
    latex: `\\lfloor \\frac{1}{2} \\rfloor`,
    asciimath:     `|__(1)/(2)__|`,
    linearmath:     `⌊1/2⌋`,
    asciimath_old: `|__(1)/(2)__|`
  },
  {
    latex: `\\lceil \\frac{1}{2} \\rceil`,
    asciimath:     `|~(1)/(2)~|`,
    linearmath:     `⌈1/2⌉`,
    asciimath_old: `|~(1)/(2)~|`
  },
  {
    latex: `\\llcorner \\frac{1}{2} \\lrcorner`,
    asciimath:     `llcorner(1)/(2)lrcorner`,
    linearmath:     `⌞1/2⌟`,
    asciimath_old: `llcorner(1)/(2)lrcorner`
  },
  {
    latex: `\\ulcorner \\frac{1}{2} \\urcorner`,
    asciimath:     `ulcorner(1)/(2)urcorner`,
    linearmath:     `⌜1/2⌝`,
    asciimath_old: `ulcorner(1)/(2)urcorner`
  },
  {
    latex: `\\langle x \\rangle y`,
    asciimath:     `(:x:)y`,
    linearmath:     `⟨x⟩y`,
    asciimath_old: `(:x:)y`
  },
  {
    latex: `\\langle (x) \\rangle (y)`,
    asciimath:     `(:(x):)(y)`,
    linearmath:     `⟨(x)⟩(y)`,
    asciimath_old: `(:(x):)(y)`
  },
  {
    latex: `(x^2 + (2x + 1))`,
    asciimath:     `(x^(2)+(2x+1))`,
    linearmath:     `(x²+(2x+1))`,
    asciimath_old: `(x^(2)+(2x+1))`
  },
  {
    latex: `(x^2) + (2x + 1) + (y^2)`,
    asciimath:     `(x^(2))+(2x+1)+(y^(2))`,
    linearmath:     `(x²)+(2x+1)+(y²)`,
    asciimath_old: `(x^(2))+(2x+1)+(y^(2))`
  },
  {
    latex: `(1 + (x^2 + 2x))`,
    asciimath:     `(1+(x^(2)+2x))`,
    linearmath:     `(1+(x²+2x))`,
    asciimath_old: `(1+(x^(2)+2x))`
  },
  {
    latex: `(1+\\{2+\\frac{1}{2}\\}+(3+4))+(5+6)`,
    asciimath:     `(1+{2+(1)/(2)}+(3+4))+(5+6)`,
    linearmath:     `(1+{2+1/2}+(3+4))+(5+6)`,
    asciimath_old: `(1+{2+(1)/(2)}+(3+4))+(5+6)`
  },
  {
    latex: `(1+\\{2+\\frac{1}{2}\\}+(3+4))+(5+6))`,
    asciimath:     `(1+{2+(1)/(2)}+(3+4))+(5+6))`,
    linearmath:     `(1+{2+1/2}+(3+4))+(5+6))`,
    asciimath_old: `(1+{2+(1)/(2)}+(3+4))+(5+6))`
  },
  {
    latex: `(1+\\frac{3+(x^2))}{2})`,
    asciimath:     `(1+(3+(x^(2))))/(2))`,
    linearmath:     `(1+(3+(x²)))/2)`,
    asciimath_old: `(1+(3+(x^(2))))/(2))`
  },
  {
    latex: `(1 + \\int x dx) + (\\prod x) + (\\sum y)`,
    asciimath:     `(1+int xdx)+(prod x)+(sum y)`,
    linearmath:     `(1+∫xdx)+(∏x)+(∑y)`,
    asciimath_old: `(1+int xdx)+(prod x)+(sum y)`
  },
  {
    latex: `a | x y ^ 3 | ( b | c ^ 3 )`,
    asciimath:     `a|xy^(3)|(b|c^(3))`,
    linearmath:     `a|xy³|(b|c³)`,
    asciimath_old: `a|xy^(3)|(b|c^(3))`
  },
  {
    latex: `a | _ b ^ c + a | ^ b _ c + a | _ b + a | ^ c`,
    asciimath:     `a|_(b)^(c)+a|_(c)^(b)+a|_(b)+a|^(c)`,
    linearmath:     `a|_bᶜ+a|_cᵇ+a|_b+a|ᶜ`,
    asciimath_old: `a|_(b)^(c)+a|_(c)^(b)+a|_(b)+a|ᶜ`
  },
  {
    latex: `a | _ { \\operatorname{s i n} ( \\pi ) }`,
    asciimath: `a|_(sin(pi))`,
    linearmath: `a|_(sin(π))`,
    asciimath_old: `a|_(sin(pi))`
  },
  {
    latex: `a _ {k} | _ { I _ { m } } = : u _ { k } ^ { m } \\in V,`,
    asciimath:     `a_(k)|_(I_(m))=:u_(k)^(m)in V,`,
    linearmath:     `aₖ|_(Iₘ)=:uₖᵐ∈V,`,
    asciimath_old: `a_(k)|_(I_(m))=:u_(k)^(m)in V,`
  },
  {
    latex: `h \\theta ( L ) = - k \\frac { d \\theta } { d x } | _ { x = L }`,
    asciimath:     `h theta(L)=-k(d theta)/(dx)|_(x=L)`,
    linearmath:     `h θ(L)=−k((d θ)/(dx))|_(x=L)`,
    asciimath_old: `h theta(L)=-k(d theta)/(dx)|_(x=L)`
  },
  {
    latex: `f ( a | b ) = x | _ { x _ 0 } ^ { x _ 1 }`,
    asciimath:     `f(a|b)=x|_(x_(0))^(x_(1))`,
    linearmath:     `f(a|b)=x|_(x₀)^(x₁)`,
    asciimath_old: `f(a|b)=x|_(x_(0))^(x_(1))`
  },
  {
    latex: `a \\| x y ^ 3 \\| ( b | c ^ 3 )`,
    asciimath:     `a||xy^(3)||(b|c^(3))`,
    linearmath:     `a‖xy³‖(b|c³)`,
    asciimath_old: `a|xy^(3)|(b|c^(3))`
  },
  {
    latex: `\\begin{aligned}{(x^2)}\\end{aligned}`,
    asciimath:     `{:(x^(2)):}`,
    linearmath:     `(x²)`,
    asciimath_old: `[(x^(2))]`
  },
  {
    latex: `k : [ \\left( \\begin{array} { l } { x } \\\\ { y } \\\\ { z } \\end{array} \\right) - \\left( \\begin{array} { c } { 4 } \\\\ { 8 } \\\\ { - 2 } \\end{array} \\right) ] ^ { 2 } = 5 ^ { 2 }`,
    asciimath:     `k:[([x],[y],[z])-([4],[8],[-2])]^(2)=5^(2)`,
    linearmath:     `k:[([x],[y],[z])−([4],[8],[−2])]²=5²`,
    asciimath_old: `k:[([x],[y],[z])-([4],[8],[-2])]^(2)=5^(2)`
  },
  {
    latex: `d s ^ { 2} = ( d X ^ { 0} ) ^ { 2} - R ( X ^ { 0} ) ^ { 2} \\sum _ { i = 1} ^ { D - 1} ( d X ^ { i } ) ^ { 2}`,
    asciimath:     `ds^(2)=(dX^(0))^(2)-R(X^(0))^(2)sum_(i=1)^(D-1)(dX^(i))^(2)`,
    linearmath:     `ds²=(dX⁰)²−R(X⁰)²∑_(i=1)^(D−1)(dXⁱ)²`,
    asciimath_old: `ds^(2)=(dX^(0))^(2)-R(X^(0))^(2)sum_(i=1)^(D-1)(dX^(i))^(2)`
  },
  {
    latex: `\\Delta ( W _ { 1} ) ^ { i t } J ( W _ { 2} ) \\Delta ( W _ { 1} ) ^ { - i t } = J ( l ( W _ { 1} ,t ) W _ { 2} )`,
    asciimath:     `Delta(W_(1))^(it)J(W_(2))Delta(W_(1))^(-it)=J(l(W_(1),t)W_(2))`,
    linearmath:     `Δ(W₁)ⁱᵗJ(W₂)Δ(W₁)⁻ⁱᵗ=J(l(W₁,t)W₂)`,
    asciimath_old: `Delta(W_(1))^(it)J(W_(2))Delta(W_(1))^(-it)=J(l(W_(1),t)W_(2))`
  },
  {
    latex: `a + \\int dx`,
    asciimath:     `a+int dx`,
    linearmath:     `a+∫dx`,
    asciimath_old: `a+int dx`
  },
  {
    latex: `a + \\int\\int dx`,
    asciimath:     `a+int int dx`,
    linearmath:     `a+∫∫dx`,
    asciimath_old: `a+int int dx`
  },
  {
    latex: `a + \\int \\int\\int dx`,
    asciimath:     `a+int int int dx`,
    linearmath:     `a+∫∫∫dx`,
    asciimath_old: `a+int int int dx`
  },
  {
    latex: `a + \\int dx +\\int\\int dx+\\int dx`,
    asciimath:     `a+int dx+int int dx+int dx`,
    linearmath:     `a+∫dx+∫∫dx+∫dx`,
    asciimath_old: `a+int dx+int int dx+int dx`
  },
  {
    latex: `\\int (x)`,
    asciimath:     `int(x)`,
    linearmath:     `∫(x)`,
    asciimath_old: `int(x)`
  },
  {
    latex: `\\left.\\begin{array}{rl}{(x^\\mathbb{2})}&{\\mathcal{=}y^2}\\end{array}\\right.`,
    asciimath:     `{:[(x^(2)),=y^(2)]:}`,
    linearmath:     `(x²) =y²`,
    asciimath_old: `{:[(x^(2)),=y^(2)]:}`
  },
  {
    latex: `\\begin{aligned}{(x^\\mathbb{2})}&{\\mathcal{=}y^2}\\end{aligned}`,
    asciimath:     `{:(x^(2))=y^(2):}`,
    linearmath:     `(x²)=y²`,
    asciimath_old: `[(x^(2)),=y^(2)]`
  },
  {
    latex: `\\left. \\begin{array} { r l } { x + y } & { = 3 } \\\\ { y } & { = x ^ { 2 } - 8 x + 15 } \\end{array} \\right.`,
    asciimath:     `{:[x+y,=3],[y,=x^(2)-8x+15]:}`,
    linearmath:     `x+y =3\ny =x²−8x+15`,
    asciimath_old: `{:[x+y,=3],[y,=x^(2)-8x+15]:}`
  },
  {
    latex: `\\left\\{\\begin{array}{rl}{x+y}&{=3}\\\\{y} & {=x^{2}-8x+15}\\end{array}\\right\\}`,
    asciimath:     `{[x+y,=3],[y,=x^(2)-8x+15]}`,
    linearmath:     `{[x+y,=3],[y,=x²−8x+15]}`,
    asciimath_old: `{[x+y,=3],[y,=x^(2)-8x+15]}`
  },
  {
    latex: `\\left.\\begin{array}{l}\\text{above }\\\\x^2\\\\\\text{ below}\\end{array}\\right.`,
    asciimath: `{:["above "],[x^(2)],[" below"]:}`,
    linearmath: `above \nx²\n below`,
    asciimath_old: `{:["above "],[x^(2)],[" below"]:}`
  },
  {
    latex: `\\left ( \\frac{1}{2} \\right )`,
    asciimath:     `((1)/(2))`,
    linearmath:     `(1/2)`,
    asciimath_old: `((1)/(2))`
  },
  {
    latex: `\\left \\{ \\frac{1}{2} \\right \\}`,
    asciimath:     `{(1)/(2)}`,
    linearmath:     `{1/2}`,
    asciimath_old: `{(1)/(2)}`
  },
  {
    latex: `\\begin{array}{c}{}\\end{array}`,
    asciimath:     `{::}`,
    linearmath:     ``,
    asciimath_old: `[]`
  },
  {
    latex: `\\| x + \\left( \\begin{array}{c}{x}\\end{array} \\right) \\|`,
    asciimath:     `||x+(x)||`,
    linearmath:     `‖x+(x)‖`,
    asciimath_old: `|x+([x])|`
  },
  {
    latex: `{(}x^2{)}`,
    asciimath:     `(x^(2))`,
    linearmath:     `(x²)`,
    asciimath_old: `(x^(2))`
  },
  {
    latex: `\\left.\\begin{array}{c}{a1}&{a2}\\\\{b1}&{b2}\\end{array}\\right.`,
    asciimath:     `{:[a1,a2],[b1,b2]:}`,
    linearmath:     `a1 a2\nb1 b2`,
    asciimath_old: `{:[a1,a2],[b1,b2]:}`
  },
  {
    latex: `\\left.\\begin{array}{rl}{a1}&{a2}\\\\{b1}&{b2}\\end{array}\\right.`,
    asciimath:     `{:[a1,a2],[b1,b2]:}`,
    linearmath:     `a1 a2\nb1 b2`,
    asciimath_old: `{:[a1,a2],[b1,b2]:}`
  },
  {
    latex: `\\left(\\begin{array}{rl}{x+y}&{=3}\\\\{y} & {=x^{2}-8x+15}\\end{array}\\right)`,
    asciimath:     `([x+y,=3],[y,=x^(2)-8x+15])`,
    linearmath:     `([x+y,=3],[y,=x²−8x+15])`,
    asciimath_old: `([x+y,=3],[y,=x^(2)-8x+15])`
  },
  {
    latex: `\\left[\\begin{array}{rl}{x+y}&{=3}\\\\{y} & {=x^{2}-8x+15}\\end{array}\\right]`,
    asciimath:     `[[x+y,=3],[y,=x^(2)-8x+15]]`,
    linearmath:     `[[x+y,=3],[y,=x²−8x+15]]`,
    asciimath_old: `[[x+y,=3],[y,=x^(2)-8x+15]]`
  },
  {
    latex: `\\begin{array}{l}{\\text{2}^{5}2^{2}+[(b}\\end{array}`,
    asciimath:     `{:"2"^(5)2^(2)+[(b:}`,
    linearmath:     `2⁵2²+[(b`,
    asciimath_old: `["2"^(5)2^(2)+[(b]`
  },
  {
    latex: `a + \\text {This is }\\text{text} + b`,
    asciimath: `a+"This is ""text"+b`,
    linearmath: `a+This is text+b`,
    asciimath_old: `a+"This is ""text"+b`
  },
  {
    latex: `\\text { foo } - 4 ^ { \\text { superscript } } \\text { bar }`,
    asciimath: `" foo "-4^(" superscript ")" bar "`,
    linearmath: ` foo −4ˢᵘᵖᵉʳˢᶜʳⁱᵖᵗ bar `,
    asciimath_old: `" foo "-4^(" superscript ")" bar "`
  },
  {
    latex: `\\text{The latex for }\\operatorname{sin}(x)\\text{is \\operatorname{sin}(x).}`,
    asciimath: `"The latex for "sin(x)"is \\operatorname{sin}(x)."`,
    linearmath: `The latex for sin(x)is \\operatorname{sin}(x).`,
    asciimath_old: `"The latex for "sin(x)"is \\operatorname{sin}(x)."`
  },
  {
    latex: `\\left.\\begin{array}{l}\\text{Now is}\\\\\\text{the time}\\end{array}\\right.`,
    asciimath:     `{:["Now is"],["the time"]:}`,
    linearmath:     `Now is\nthe time`,
    asciimath_old: `{:["Now is"],["the time"]:}`
  },
  {
    latex: `\\left.\\begin{array}{l}\\text{Now is}\\\\\\text{the time}\\\\\\text{for all good men}\\\\\\text{to come to the aid}\\end{array}\\right.`,
    asciimath:     `{:["Now is"],["the time"],["for all good men"],["to come to the aid"]:}`,
    linearmath:     `Now is\nthe time\nfor all good men\nto come to the aid`,
    asciimath_old: `{:["Now is"],["the time"],["for all good men"],["to come to the aid"]:}`
  },
  {
    latex: `\\text { Figure } 1.1 : \\text { Relative translational motion }`,
    asciimath: `" Figure "1.1:" Relative translational motion "`,
    linearmath: ` Figure 1.1: Relative translational motion `,
    asciimath_old: `" Figure "1.1:" Relative translational motion "`
  },
  {
    latex: `\\text { Under the simple parameterization } ( 4.1 ) \\text { of }`,
    asciimath: `" Under the simple parameterization "(4.1)" of "`,
    linearmath: ` Under the simple parameterization (4.1) of `,
    asciimath_old: `" Under the simple parameterization "(4.1)" of "`
  },
  {
    latex: `\\left.\\begin{array}{l}{\\text{foo}} \\\\ { \\theta + C }\\end{array} \\right.`,
    asciimath:     `{:["foo"],[theta+C]:}`,
    linearmath:     `foo\nθ+C`,
    asciimath_old: `{:["foo"],[theta+C]:}`
  },
  {
    latex: `\\begin{array} { l } { \\text { How do we represent tables internally to do } } \\\\ { \\text { recognition? } } \\\\ { \\text { What is our preferred table format for editing in our } } \\\\ { \\text { apps? } } \\end{array}`,
    asciimath: `{:[" How do we represent tables internally to do "],[" recognition? "],[" What is our preferred table format for editing in our "],[" apps? "]:}`,
    linearmath: ' How do we represent tables internally to do \n' +
      ' recognition? \n' +
      ' What is our preferred table format for editing in our \n' +
      ' apps? ',
    asciimath_old: `[" How do we represent tables internally to do "],[" recognition? "],[" What is our preferred table format for editing in our "],[" apps? "]`
  },
  {
    latex: `\\begin{array} { l } { \\text { A relatively long line of text that ends with a colon: } } \\\\ { \\text { leave the newline } } \\end{array}`,
    asciimath: `{:[" A relatively long line of text that ends with a colon: "],[" leave the newline "]:}`,
    linearmath: ' A relatively long line of text that ends with a colon: \n' +
      ' leave the newline ',
    asciimath_old: `[" A relatively long line of text that ends with a colon: "],[" leave the newline "]`
  },
  {
    latex: `\\begin{array} { l } { \\text { A relatively long line of text that is followed by } } \\\\ { \\text { - a line that looks like a list item } } \\end{array}`,
    asciimath: `{:[" A relatively long line of text that is followed by "],[" - a line that looks like a list item "]:}`,
    linearmath: ' A relatively long line of text that is followed by \n' +
      ' - a line that looks like a list item ',
    asciimath_old: `[" A relatively long line of text that is followed by "],[" - a line that looks like a list item "]`
  },
  {
    latex: `\\begin{array} { l } { a + b + c + d + e + f + g + h + i + j + k + l + } \\\\ { m + n } \\end{array}`,
    asciimath:     `{:[a+b+c+d+e+f+g+h+i+j+k+l+],[m+n]:}`,
    linearmath:     `a+b+c+d+e+f+g+h+i+j+k+l+\nm+n`,
    asciimath_old: `[a+b+c+d+e+f+g+h+i+j+k+l+],[m+n]`
  },
  {
    latex: `x ^ 2`,
    asciimath:     `x^(2)`,
    linearmath:     `x²`,
    asciimath_old: `x^(2)`
  },
  {
    latex: `\\{ \\begin{array} { l } { 4 x - 3 y = 6 } \\\\ { y = - 3 x + 15 } \\end{array}`,
    asciimath:     `{{:[4x-3y=6],[y=-3x+15]:}`,
    linearmath:     `{4x−3y=6\ny=−3x+15`,
    asciimath_old: `{[4x-3y=6],[y=-3x+15]`
  },
  {
    latex: `10^3`,
    asciimath:     `10^(3)`,
    linearmath:     `10³`,
    asciimath_old: `10^(3)`
  },
  {
    latex: `.3`,
    asciimath:     `.3`,
    linearmath:     `.3`,
    asciimath_old: `.3`
  },
  {
    latex: `\\int_a^b`,
    asciimath:     `int_(a)^(b)`,
    linearmath:     `∫ₐᵇ`,
    asciimath_old: `int_(a)^(b)`
  },
  {
    latex: `\\sum_{i=0}^{10}`,
    asciimath:     `sum_(i=0)^(10)`,
    linearmath:     `∑_(i=0)^(10)`,
    asciimath_old: `sum_(i=0)^(10)`
  },
  {
    latex: `a\\pm b`,
    asciimath:     `a+-b`,
    linearmath:     `a±b`,
    asciimath_old: `a+-b`
  },
  {
    latex: `x\\approx y`,
    asciimath:     `x~~y`,
    linearmath:     `x≈y`,
    asciimath_old: `x~~y`
  },
  {
    latex: `x\\cdot y`,
    asciimath:     `x*y`,
    linearmath:     `x⋅y`,
    asciimath_old: `x*y`
  },
  {
    latex: `a \\dots b`,
    asciimath:     `a dots b`,
    linearmath:     `a…b`,
    asciimath_old: `a dots b`
  },
  {
    latex: `\\frac{n!}{k!(n-k)!}`,
    asciimath:     `(n!)/(k!(n-k)!)`,
    linearmath:     `(n!)/(k!(n−k)!)`,
    asciimath_old: `(n!)/(k!(n-k)!)`
  },
  {
    latex: `\\lim_{x\\rightarrow 0}{x^2}`,
    asciimath:     `lim_(x rarr0)x^(2)`,
    linearmath:     `lim_(x→0)x²`,
    asciimath_old: `lim_(x rarr0)x^(2)`
  },
  {
    latex: `\\operatorname { archyp } \\operatorname { tan } ( x )`,
    asciimath: `archyp tan(x)`,
    linearmath: `archyp tan(x)`,
    asciimath_old: `archyp tan(x)`
  },

  {
    latex: '\\begin{array}{l}\n' +
      '3 x+2 y=-2 \\\\\n' +
      'x-2 y=-6\n' +
      '\\end{array}',
    asciimath: `{:[3x+2y=-2],[x-2y=-6]:}`,
    linearmath: `3x+2y=−2\nx−2y=−6`,
  },
  {
    latex: '\\begin{aligned} \n' +
      'x y &=-24 \\\\ \n' +
      '5 x+4 y &=4 \n' +
      '\\end{aligned}',
    asciimath: `{:[xy=-24],[5x+4y=4]:}`,
    linearmath: `xy=−24\n5x+4y=4`,
  },
  {
    latex: 't=\\sqrt{\\frac{(2) 42}{9.8} \\mathrm{~m} / \\mathrm{s}^{2}}',
    asciimath: `t=sqrt(((2)42)/(9.8)m//s^(2))`,
    linearmath: `t=√((((2)42)/(9.8))m/s²)`,
  },
  {
    latex: '200 \\mathrm{~V}',
    asciimath: `200V`,
    linearmath: `200V`,
  },
];
