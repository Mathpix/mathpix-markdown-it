module.exports = [
  /** Basic Operations */
  {
    latex: `a + b`,
    ascii:     `a+b`,
    wolfram: `a + b`
  },
  {
    latex: `a - b`,
    ascii:     `a-b`,
    wolfram: `a - b`
  },  
  {
    latex: `a * b`,
    ascii:     `a**b`,
    wolfram: `a * b`
  },  
  {
    latex: `a \\ast b`,
    ascii:     `a**b`,
    wolfram: `a * b`
  },
  {
    latex: `a \\cdot b`,
    ascii:     `a*b`,
    wolfram: `a×b`
  },
  {
    latex: `a / b`,
    ascii:     `a/b`,
    wolfram: `a/b`
  },
  {
    latex: `a ^ b`,
    ascii:     `a^b`,
    wolfram: `a^b`
  },
  {
    latex: `a = b + c`,
    ascii:     `a=b+c`,
    wolfram: `a = b + c`
  },

  {
    latex: `[1, 2)`,
    ascii:     `[1,2)`,
    wolfram: `[1, 2)`
  },
  {
    latex: `x^2 + 2`,
    ascii:     `x^(2)+2`,
    wolfram: `x^2 + 2`,
  },
  {
    latex: `1 3 5`,
    ascii:     `135`,
    wolfram: `135`
  },
  {
    latex: `1 , 3 x , 5`,
    ascii:     `1,3x,5`,
    wolfram: `1, 3 x, 5`
  },
  {
    latex: `\\operatorname { s i n }`,
    ascii:     `sin`,
    wolfram: `sin`,
  },
  {
    latex: `a \\operatorname { m o d } b`,
    ascii: `a mod b`,
    wolfram: `a mod b`
  },
  //TODO: Check space after 5
  {
    latex: `5 \\operatorname { m o d } 4`,
    ascii: `5mod 4`,
    wolfram: `5 mod 4`
  },
  {
    latex: `\\operatorname{foo}`,
    ascii:     `foo`,
    wolfram: `foo`
  },
  {
    latex: `2 . x`,
    ascii:     `2.x`,
    wolfram: `2.x`
  },
  //sqrt
  {
    latex: `\\sqrt{x+1}`,
    ascii:     `sqrt(x+1)`,
    wolfram: `sqrt(x + 1)`
  },
  {
    latex: `\\sqrt{7}`,
    ascii:     `sqrt7`,
    wolfram: `sqrt(7)`
  },
  {
    latex: `\\sqrt { - 7 }`,
    ascii:     `sqrt(-7)`,
    wolfram: `sqrt(-7)`,
  },
  {
    latex: `\\sqrt { 1 - 8 }`,
    ascii:     `sqrt(1-8)`,
    wolfram: `sqrt(1 - 8)`,
  },
  {
    latex: `\\sqrt { b ^ { 2 } - 4 a c }`,
    ascii:     `sqrt(b^(2)-4ac)`,
    wolfram: `sqrt(b^2 - 4 ac)`,
    wolfram_: `sqrt(b^2 - 4 a c)`,
  },
  {
    latex: `\\sqrt[]{x+y}`,
    ascii:     `sqrt(x+y)`,
    wolfram: `sqrt(x + y)`
  },
  {
    latex: `\\sqrt[n]{x}`,
    ascii:     `root(n)(x)`,
    wolfram: `(x)^(1/n)`
  },
  {
    latex: `\\sqrt[n+i]{x+y}`,
    ascii:     `root(n+i)(x+y)`,
    wolfram: `(x+y)^(1/(n+i))`
  },
  {
    latex: `\\sqrt [ 2 ] { 2 }`,
    ascii:     `root(2)(2)`,
    wolfram: `sqrt(2)`
  },
  {
    latex: `\\frac { ( L - x ) } { \\sqrt { x } }`,
    ascii:     `((L-x))/(sqrtx)`,
    wolfram: `((L-x))/sqrt(x)`,
    wolfram_plain_text: `((L-x))/sqrt(x)`
  },
  {
    latex: `\\frac{4}{\\sqrt{\\cos\\sqrt{t}}}+c`,
    ascii:     `(4)/(sqrt(cos sqrtt))+c`,
    wolfram: `4/sqrt(cos(sqrt(t))) + c`,
  },
  {
    latex: `\\frac{4}{\\sqrt{\\cosh\\sqrt{t}}}+c`,
    ascii:     `(4)/(sqrt(cosh sqrtt))+c`,
    wolfram: `4/sqrt(cosh(sqrt(t))) + c`,
  },
  {
    latex: `\\frac{4}{\\sqrt{\\sin\\sqrt{t}}}+c`,
    ascii:     `(4)/(sqrt(sin sqrtt))+c`,
    wolfram: `4/sqrt(sin(sqrt(t))) + c`,
  },
  {
    latex: `\\frac{4}{\\sqrt{\\sinh\\sqrt{t}}}+c`,
    ascii:     `(4)/(sqrt(sinh sqrtt))+c`,
    wolfram: `4/sqrt(sinh(sqrt(t))) + c`,
  },
  {
    latex: `\\frac{4}{\\sqrt{\\tan\\sqrt{t}}}+c`,
    ascii:     `(4)/(sqrt(tan sqrtt))+c`,
    wolfram: `4/sqrt(tan(sqrt(t))) + c`,
  },
  {
    latex: `\\frac{4}{\\sqrt{\\tanh\\sqrt{t}}}+c`,
    ascii:     `(4)/(sqrt(tanh sqrtt))+c`,
    wolfram: `4/sqrt(tanh(sqrt(t))) + c`,
  },
  {
    latex: `\\frac{4}{\\sqrt{\\cot\\sqrt{t}}}+c`,
    ascii:     `(4)/(sqrt(cot sqrtt))+c`,
    wolfram: `4/sqrt(cot(sqrt(t))) + c`,
  },
  {
    latex: `\\frac{4}{\\sqrt{\\coth\\sqrt{t}}}+c`,
    ascii:     `(4)/(sqrt(coth sqrtt))+c`,
    wolfram: `4/sqrt(coth(sqrt(t))) + c`,
  },
  {
    latex: `\\frac{4}{\\sqrt{\\sec\\sqrt{t}}}+c`,
    ascii:     `(4)/(sqrt(sec sqrtt))+c`,
    wolfram: `4/sqrt(sec(sqrt(t))) + c`,
  },
  {
    latex: `\\frac{4}{\\sqrt{\\csc\\sqrt{t}}}+c`,
    ascii:     `(4)/(sqrt(csc sqrtt))+c`,
    wolfram: `4/sqrt(csc(sqrt(t))) + c`,
  },

  {
    latex: `\\frac{4}{\\sqrt{\\arcsin\\sqrt{t}}}+c`,
    ascii:     `(4)/(sqrt(arcsin sqrtt))+c`,
    wolfram: `4/sqrt(arcsin(sqrt(t))) + c`,
  },  
  {
    latex: `\\sin ( 1 + x ) + \\sin ( 1 + x )`,
    ascii:     `sin(1+x)+sin(1+x)`,
    wolfram: `sin(1 + x) + sin(1 + x)`
  },  
  {
    latex: `\\sin 23 + \\sin 58`,
    ascii:     `sin 23+sin 58`,
    wolfram: `sin(23) + sin(58)`,
  },  
  {
    latex: `\\sin 5+ \\sin6`,
    ascii:     `sin 5+sin 6`,
    wolfram: `sin(5) + sin(6)`,
  },  
  {
    latex: `\\sin 5y+ \\sin6`,
    ascii:     `sin 5y+sin 6`,
    wolfram: `sin(5 y) + sin(6)`,
  },  
  {
    latex: `\\sin5y\\sin6`,
    ascii:     `sin 5y sin 6`,
    wolfram: `sin(5 y sin(6))`
  },  
  {
    latex: `\\sin5y+6`,
    ascii:     `sin 5y+6`,
    wolfram: `sin(5 y) + 6`
  },
  {
    latex: `\\log ( 1 + x )`,
    ascii:     `log(1+x)`,
    wolfram: `log(1 + x)`,
  },
  /** /ln => log */
  {
    latex: `\\ln ( R ) = \\ln ( P ) + \\ln ( Q )`,
    ascii:     `ln(R)=ln(P)+ln(Q)`,
    wolfram: `log(R) = log(P) + log(Q)`,
  },
  {
    latex: `(x^2 + 1)`,
    ascii:     `(x^(2)+1)`,
    wolfram: `(x^2 + 1)`,
  },
  {
    latex: `\\frac{1}{2}`,
    ascii:     `(1)/(2)`,
    wolfram: `1/2`,
    wolfram_plain_text: `1/2`
  },
  {
    latex: `\\frac{x}{y}`,
    ascii:     `(x)/(y)`,
    wolfram: `x/y`,
    wolfram_plain_text: `x/y`
  },
  {
    latex: `\\frac{x+i}{y+j}`,
    ascii:     `(x+i)/(y+j)`,
    wolfram: `(x+i)/(y+j)`,
    wolfram_plain_text: `(x+i)/(y+j)`
  },
  {
    latex: `(x^2 + (2x + 1))`,
    ascii:     `(x^(2)+(2x+1))`,
    wolfram: `(x^2 + (2 x + 1))`,
  },
  {
    latex: `(x^2) + (2x + 1) + (y^2)`,
    ascii:     `(x^(2))+(2x+1)+(y^(2))`,
    wolfram: `(x^2) + (2 x + 1) + (y^2)`,
  },
  {
    latex: `(1 + (x^2 + 2x))`,
    ascii:     `(1+(x^(2)+2x))`,
    wolfram: `(1 + (x^2 + 2 x))`
  },
  {
    latex: `(1+\\{2+\\frac{1}{2}\\}+(3+4))+(5+6)`,
    ascii:     `(1+{2+(1)/(2)}+(3+4))+(5+6)`,
    wolfram: `(1 + {2 + 1/2} + (3 + 4)) + (5 + 6)`
  },
  {
    latex: `(1+\\frac{3+(x^2)}{2})`,
    ascii:     `(1+(3+(x^(2)))/(2))`,
    wolfram: `(1 + (3+(x^2))/2)`,
  },
  /** /cdot */
  {
    latex: ` 4 \\cdot 3 \\sqrt { 3 }`,
    ascii:     `4*3sqrt3`,
    wolfram: `4×3 sqrt(3)`
  },
  /** \dot x
   * x'[t] 
   * dx/dt
   * */
  {
    latex: `\\dot x`,
    ascii:     `x^(˙)`,
    wolfram: `(d/dt)x`,
  },  
  {
    latex: `\\dot { \\gamma } _ { 0}`,
    ascii:     `gamma^(˙)_(0)`,
    wolfram: `(d(gamma_0)/dt)`,
    wolfram_u: `(d(γ_0)/dt)`,
  },   
  
  {
    latex: `\\dot { v } _ { i j }`,
    ascii:     `v^(˙)_(ij)`,
    wolfram: `(d(v_(ij))/dt)`,
    wolfram_: `(d(v_(i j))/dt)`,
  },   
  {
    latex: `\\dot { n } _ { i 0 }`,
    ascii:     `n^(˙)_(i0)`,
    wolfram: `(d(n_(i0))/dt)`,
  },   
  {
    latex: `\\dot { n } _ { i }`,
    ascii:     `n^(˙)_(i)`,
    wolfram: `(d(n_i)/dt)`,
  },  
  
  {
    latex: `x_n`,
    ascii:     `x_(n)`,
    wolfram: `x_(n)`,
  },  
  {
    latex: `x_2`,
    ascii:     `x_(2)`,
    wolfram: `x_2`,
  },   
  {
    latex: `x _ { i } ^ { 2 }`,
    ascii:     `x_(i)^(2)`,
    wolfram: `x_i^(2)`,
  },
  {
    latex: `Y = 2+ 0.5Z + X + Z X + \\epsilon .`,
    ascii:     `Y=2+0.5 Z+X+ZX+epsilon.`,
    wolfram: `Y = 2 + 0.5 Z + X + ZX + epsilon.`,
    wolfram_: `Y = 2 + 0.5 Z + X + Z X + epsilon.`,
    wolfram_u: `Y = 2 + 0.5 Z + X + ZX + ϵ.`,
    wolfram_u_: `Y = 2 + 0.5 Z + X + Z X + ϵ.`,
  },
  {
    latex: `\\iota ^ { n }`,
    ascii: `iota^(n)`,
    wolfram: `iota^n`,
    wolfram_u: `(ι)^n`,
  },
  {
    latex: `D e ^ { - \\kappa a / 2 }  = A e ^ { i k a / 2 } + B e ^ { - i k a / 2 }`,
    ascii:  `De^(-kappa a//2)=Ae^(ika//2)+Be^(-ika//2)`,
    wolfram: `De^(-kappa a/2) = Ae^(ika/2) + Be^(-ika/2)`,
    wolfram_: `De^(-kappa a/2) = Ae^(i k a/2) + Be^(-i k a/2)`,
    wolfram_u: `De^(-κa/2) = Ae^(ika/2) + Be^(-ika/2)`,
    wolfram_u_: `De^(-κ a/2) = Ae^(i k a/2) + Be^(-i k a/2)`,
  }, 
  
  {
    latex: `\\beta _ { 0 } = \\frac { 2 \\lambda D } { a }`,
    ascii:  `beta_(0)=(2lambda D)/(a)`,
    wolfram: `beta_(0) = (2lambda D)/a`,
    wolfram_u: `β_0 = (2λD)/a`,
  },    
  {
    latex: `\\Lambda = a + b`,
    ascii: `Lambda=a+b`,
    wolfram: `Λ = a + b`,
  },
  {
    latex: `( x - \\mu ) ^ { 2 }`,
    ascii:     `(x-mu)^(2)`,
    wolfram: `(x - μ)^2`,
    wolfram_u: `(x - μ)^2`,
  },
  {
    latex: `x = e \\cos \\theta \\sin \\phi`,
    ascii: `x=e cos theta sin phi`,
    wolfram: `x = e cos(theta sin(phi))`,
    wolfram_u: `x = e cos(θsin(φ))`,
    wolfram_u_: `x = e cos(θ sin(φ))`,
  },
  {
    latex: `V ( \\Omega ) = \\sqrt { \\mathrm { e } ^ { 2 \\pi \\nu ( \\Omega )} - 1 } \\mathrm { e } ^ { - 2 i \\xi ( \\Omega ) + i \\left( k ( \\Omega ) - k _ { 0 } \\right) L + i \\varphi _ { A } } `,
    ascii: `V(Omega)=sqrt(e^(2pi nu(Omega))-1)e^(-2i xi(Omega)+i(k(Omega)-k_(0))L+ivarphi_(A))`,
    wolfram: `V(Ω) = sqrt(e^(2 pi nu(Ω)) - 1)e^(-2 iξ(Ω) + i(k(Ω)-k_0)L + iphi_(A))`,
    wolfram_: `V(Ω) = sqrt(e^(2 pi nu(Ω)) - 1)e^(-2 i ξ(Ω) + i(k(Ω)-k_0)L + i phi_(A))`,
    wolfram_u: `V(Ω) = sqrt(e^(2 πν(Ω)) - 1)e^(-2 iξ(Ω) + i(k(Ω)-k_0)L + iφ_(A))`,
    wolfram_u_: `V(Ω) = sqrt(e^(2 π ν(Ω)) - 1)e^(-2 i ξ(Ω) + i(k(Ω)-k_0)L + i φ_(A))`,
  },
  {
    latex: `\\frac { \\eta _ { 2} } { \\eta _ { 1} } = \\sqrt { \\frac { \\varepsilon _ { 1} } { \\varepsilon _ { 2} } } = \\frac { n _ { 1} } { n _ { 2} } `,
    ascii:     `(eta_(2))/(eta_(1))=sqrt((epsi_(1))/(epsi_(2)))=(n_(1))/(n_(2))`,
    wolfram: `eta_(2)/eta_(1) = sqrt(epsilon_(1)/epsilon_(2)) = n_(1)/n_(2)`,
    wolfram_u: `η_(2)/η_(1) = sqrt(ε_(1)/ε_(2)) = n_(1)/n_(2)`,
  },  
  {
    latex: `\\xi _ { \\mathrm{j} }`,
    ascii:     `xi_(j)`,
    wolfram: `ξ_j`,
  },  
  {
    latex: `\\frac { \\partial \\ell } { \\partial \\mu} = 5`,
    ascii:     `(delℓ)/(del mu)=5`,
    wolfram: `(∂ℓ)/(∂μ) = 5`,
  },
  {
    latex: `\\Gamma (2 n ) = \\frac { 2 ^ { 2 n - 1 } } { \\sqrt { \\pi } } \\Gamma ( n ) \\Gamma ( n + \\frac { 1 } { 2 } ) .`,
    ascii:     `Gamma(2n)=(2^(2n-1))/(sqrtpi)Gamma(n)Gamma(n+(1)/(2)).`,
    wolfram: `Γ(2 n) = 2^(2 n - 1)/sqrt(pi)Γ(n)Γ(n + 1/2).`,
    wolfram_: `Γ(2 n) = 2^(2 n - 1)/sqrt(π)Γ(n)Γ(n + 1/2).`,
  },  
  {
    latex: `\\frac { \\Gamma ( \\beta + r ) \\cdot \\Gamma ( \\gamma - \\beta ) } { \\Gamma ( \\gamma + r ) }`,
    ascii:     `(Gamma(beta+r)*Gamma(gamma-beta))/(Gamma(gamma+r))`,
    wolfram: `(Γ(beta+r)×Γ(gamma-beta))/(Γ(gamma+r))`,
    wolfram_u: `(Γ(β+r)×Γ(γ-β))/(Γ(γ+r))`,
  },  

  {
    latex: `0^ { \\circ }`,
    ascii:     `0^(@)`,
    wolfram: `0 °`,
  },
  {
    latex: `\\Delta t_{1} = 5 ^ { \\circ } \\mathrm { C } `,
    ascii:     `Deltat_(1)=5^(@)C`,
    wolfram: `Δ t_1 = 5 ° C`,
  },
  {
    latex: `\\Delta t _ { 2 } = 25 ^ { \\circ } \\mathrm { C }`,
    ascii:     `Deltat_(2)=25^(@)C`,
    wolfram: `Δ t_2 = 25 ° C`,
  },
  {
    latex: `\\tan(19.293^{\\circ})=\\frac{y}{10}`,
    ascii:     `tan(19.293^(@))=(y)/( 10)`,
    wolfram: `tan(19.293 °) = y/10`,
  },
  //   {
  //   latex: ``,
  //   ascii:     ``,
  //   wolfram: ``,
  // },
  //array
  {
    latex: `\\begin{array} { l } { x ^ { 3 } + 5 x ^ { 2 } + 4 } \\\\ { \\frac { 1 2 x ^ { n } + 1 8 } { x ^ { n } + 3 } } \\end{array}`,
    ascii: `{:[x^(3)+5x^(2)+4],[(12x^(n)+18)/(x^(n)+3)]:}`,
    wolfram: `{{x^3 + 5x^2 + 4}, {(12x^n +18)/(x^n +3)}}`,
  },
    {
    latex: `( x - 1 ) ( x + 3 ) \\cdot ( x - 3 )`,
    ascii:     `(x-1)(x+3)*(x-3)`,
    wolfram: `(x - 1)(x + 3)×(x - 3)`,
  },
 {
    latex: `u _ { x x } + u _ { y y } = 0`,
    ascii:     `u_(xx)+u_(yy)=0`,
    wolfram: `u_(xx) + u_(yy) = 0`,
    wolfram_: `u_(x x) + u_(y y) = 0`,
  },  
  {
    latex: `( \\frac { 5 + ( - 1 ) } { 2 } , \\frac { - 3 + 3 } { 2 } )`,
    ascii: `((5+(-1))/(2),(-3+3)/(2))`,
    wolfram: `((5+(-1))/2, (-3+3)/2)`,
  },  
  {
    latex: `7 8 0 \\operatorname { m e t } 5 \\% =`,
    ascii:  `780met 5%=`,
    wolfram: `780 met 5 % =`,
  },  
  {
    latex: `\\mathrm { b } \\text { of the hyperbola described in the equation? } \\mathrm { x } ^ { 2 } - 4 \\mathrm { y } ^ { 2 } - 6 \\mathrm { x } + 5 = 0`,
    ascii: `b" of the hyperbola described in the equation? "x^(2)-4y^(2)-6x+5=0`,
    wolfram: `b of the hyperbola described in the equation? x^2 - 4y^2 - 6x + 5 = 0`,
  },  
  {
    latex: `\\operatorname { s i n } \\widehat { A P E } = \\frac { \\frac { 1 2 \\sqrt { 1 5 } } { 5 } } { 3 \\sqrt { 1 0 } } = \\frac { 1 2 \\sqrt { 1 5 } } { 1 5 \\sqrt { 1 0 } } = \\frac { 4 \\sqrt { 3 } } { 5 \\sqrt { 2 } } = \\frac { 2 \\sqrt { 6 } } { 5 } .`,
    ascii:  `sin  widehat(APE)=((12sqrt(15))/(5))/(3sqrt(10))=(12sqrt(15))/(15sqrt(10))=(4sqrt3)/(5sqrt2)=(2sqrt6)/(5).`,
    wolfram: `sin(widehat(APE)) = (12sqrt(15))/5/(3sqrt(10)) = (12sqrt(15))/(15sqrt(10)) = (4sqrt(3))/(5sqrt(2)) = (2sqrt(6))/5.`,
  },      
  {
    latex: `\\operatorname { l i m } _ { x \\rightarrow 0 } \\frac { 1 } { x } =`,
    ascii: `lim_(x rarr0)(1)/(x)=`,
    wolfram: `lim_(x -> 0)1/x =`,
  },  
   {
    latex: `\\sqrt [ 5 ] { 2 \\cdot \\sqrt [ 3 ] { 2 \\cdot \\sqrt [ 4 ] { 2 } } } =`,
    ascii: `root(5)(2*root(3)(2*root(4)(2)))=`,
    wolfram: `(2×(2×(2)^(1/4))^(1/3))^(1/5) =`,
  },  
   {
    latex: `\\text { 12) } f ( x ) = \\frac { 1 3 } { | x | + x ^ { 2 } }`,
    ascii: `" 12) "f(x)=(13)/(|x|+x^(2))`,
    wolfram: `12) f(x) = (13)/(|x|+x^2)`,
  },  
   {
    latex: `x \\in A`,
    ascii: `x in A`,
    wolfram: `x element A`,
  },  
   {
    latex: `x \\notin A`,
    ascii:  `x!in A`,
    wolfram: `x not element A`,
  },  
   {
    latex: `\\frac { x } { 1 - x ^ { 2 } } \\geqslant \\frac { 1 - x } { 1 + x }`,
    ascii: `(x)/(1-x^(2))⩾(1-x)/(1+x)`,
    wolfram: `x/(1-x^2) >= (1-x)/(1+x)`,
  },    
  {
    latex: `\\frac { x } { 1 - x ^ { 2 } } \\leqslant \\frac { 1 - x } { 1 + x }`,
    ascii: `(x)/(1-x^(2))⩾(1-x)/(1+x)`,
    wolfram: `x/(1-x^2) <= (1-x)/(1+x)`,
  },  
  
  //logic
   {
    latex: `p \\wedge [ ( p ^ { \\prime } \\Rightarrow q ) \\Rightarrow p ^ { \\prime } ]`,
    ascii: `p^^[(p^(')=>q)=>p^(')]`,
    wolfram: `p and [(p' implies q) implies p' ]`, ///!!!!
    wolfram_: `p and [((p)' implies q) implies (p)']`, ///!!!!
  },  
  {
    latex: `p \\rightarrow(p \\vee q)`,
    ascii:  `p rarr(p vv q)`,
    wolfram: `p implies (p or q)`,
  },
  {
    latex: `q \\wedge ( p \\vee q ) ^ { \\prime }`,
    ascii:  `q^^(p vv q)^(')`,
    wolfram: `q and (p or q)'`,
  },
  {
    latex: `A \\cup B`,
    ascii: `A uu B`,
    wolfram: `A ∪ B`,
  },
  {
    latex: `( - 1 , 0 ) \\cup ( 1 , + \\infty ) `,
    ascii: `(-1,0)uu(1,+oo)`,
    wolfram: `(- 1, 0) ∪ (1, + inf)`,
    wolfram_u: `(- 1, 0) ∪ (1, + ∞)`,
  },
  {
    latex: `( - \\infty , - 4 ] \\cup [ 4 , \\infty )`,
    ascii: `(-oo,-4]uu[4,oo)`,
    wolfram: `(- inf, - 4] ∪ [4, inf)`,
    wolfram_u: `(- ∞, - 4] ∪ [4, ∞)`,
  },
  {
    latex: `A \\cap ( B \\cup C )`,
    ascii: `A nn(B uu C)`,
    wolfram: `A ∩ (B ∪ C)`,
  },  
  {
    latex: `[ p \\rightarrow ( q \\rightarrow r ) ] \\leftrightarrow [ ( p \\vee q ) \\rightarrow r ]`,
    ascii: `[p rarr(q rarr r)]harr[(p vv q)rarr r]`,
    wolfram: `[p implies (q implies r)] <=> [(p or q) implies r]`,
  },
  //--------
  {
    latex: `2 ^ { \\operatorname { l o g } _ { 2 } x } + \\operatorname { l o g } _ { 3 } 3 ^ { 4 x } = 2 5`,
    ascii: `2^(log_(2)x)+log_(3)3^(4x)=25`,
    wolfram: `2^(log_2 x) + log_3 3^(4 x) = 25`,
  },
  {
    latex: `4 \\div 2 =`,
    ascii: `4-:2=`,
    wolfram: `4/2 =`,
  },  
  {
    latex: `\\sqrt [ 6 ] { \\frac { x ^ { 6 } y ^ { 5 } } { x ^ { 2 } } }`,
    ascii: `root(6)((x^(6)y^(5))/(x^(2)))`,
    wolfram: `((x^6 y^5)/x^2)^(1/6)`,
  }, 
  {
    latex: `2 - \\sqrt [ 6 ] { \\frac { x ^ { 6 } y ^ { 5 } } { x ^ { 2 } } } \\times \\sqrt [ 6 ] { \\frac { x ^ { 3 } y ^ { 5 } } { x y ^ { 4 } } }`,
    ascii: `2-root(6)((x^(6)y^(5))/(x^(2)))xxroot(6)((x^(3)y^(5))/(xy^(4)))`,
    wolfram: `2 - ((x^6 y^5)/x^2)^(1/6)×((x^3 y^5)/(xy^4))^(1/6)`,
  },  
  
  // Matrices
  {
    latex: "\\left(\\begin{array}{cc}\n" +
      "6 & -7 \\\\\n" +
      "0 & 3\n" +
      "\\end{array}\\right)",
    ascii: `([6,-7],[0,3])`,
    wolfram: `({{6, -7}, {0, 3}})`,
  },  
  {
    latex: "\\left(\\begin{array}{ccc}\n" +
      "1 & -5 & 8 \\\\\n" +
      "1 & -2 & 1 \\\\\n" +
      "2 & -1 & -5\n" +
      "\\end{array}\\right)",
    ascii: `([1,-5,8],[1,-2,1],[2,-1,-5])`,
    wolfram: `({{1, -5, 8}, {1, -2, 1}, {2, -1, -5}})`,
  },  
  {
    latex: "\\left(\\begin{array}{ll}\n" +
      "1 & 2 \\\\\n" +
      "3 & 4\n" +
      "\\end{array}\\right)+\\left(\\begin{array}{cc}\n" +
      "2 & -1 \\\\\n" +
      "-1 & 2\n" +
      "\\end{array}\\right)",
    ascii: `([1,2],[3,4])+([2,-1],[-1,2])`,
    wolfram: `({{1, 2}, {3, 4}}) + ({{2, -1}, {-1, 2}})`,
  },  
  {
    latex: `\\left(\\begin{array}{cc}
2 & -1 \\\\
1 & 3
\\end{array}\\right) \\cdot\\left(\\begin{array}{cc}
1 & 2 \\\\
3 & 4
\\end{array}\\right)`,
    ascii: `([2,-1],[1,3])*([1,2],[3,4])`,
    wolfram: `({{2, -1}, {1, 3}})×({{1, 2}, {3, 4}})`,
  },  
  {
    latex: `\\left(\\begin{array}{lll}
2 & -1 & 1 \\\\
0 & -2 & 1 \\\\
1 & -2 & 0
\\end{array}\\right) \\cdot\\{x, y, z\\}`,
    ascii: `([2,-1,1],[0,-2,1],[1,-2,0])*{x,y,z}`,
    wolfram: `({{2, -1, 1}, {0, -2, 1}, {1, -2, 0}})× {x, y, z}`,
  },
  {
    latex: `y = 2 \\pm (5 + 7 + 9)`,
    ascii: `y=2+-(5+7+9)`,
    wolfram: `y = 2 ± (5 + 7 + 9)`,
  },
  {
    latex: `0,1,2 , \\ldots , 9`,
    ascii: `0,1,2,dots,9`,
    wolfram: `0, 1, 2, ..., 9`,
  },
  {
    latex: ` 1 + 2 + 2 ^ { 2 } + \\cdots + 2 ^ { n } = 2 ^ { n + 2 }`,
    ascii: `1+2+2^(2)+cdots+2^(n)=2^(n+2)`,
    wolfram: `1 + 2 + 2^2 + ... + 2^n = 2^(n + 2)`,
  },
  {
    latex: `( x - \\lfloor x \\rfloor ) ( x - \\lfloor x \\rfloor - 1 ) `,
    ascii: `(x-|__ x __|)(x-|__ x __|-1)`,
    wolfram: `(x - ⌊ x ⌋)(x - ⌊ x ⌋ - 1)`,
  },  
  
  {
    latex: `\\|\\{12,-5\\}\\|`,
    ascii: `||{12,-5}||`,
    wolfram: `||{12, - 5}||`,
  },  
  {
    latex: `\\left\\| \\mathbf { r } ^ { ( k ) } \\right\\| / \\left\\| \\mathbf { s } ^ { ( m ) } \\right\\| < 10 ^ { - 6 }`,
    ascii: `||r^((k))||//||s^((m))|| < 10^(-6)`,
    wolfram: `||r^((k))||/||s^((m))||< 10^(-6)`,
  },  
  {
    latex: `\\left\\lfloor \\frac { 1 } { 2 } \\left( \\sqrt { 1 + \\frac { 2 } { 3 c } } - 3 \\right) \\right\\rfloor .`,
    ascii: `|__(1)/(2)(sqrt(1+(2)/(3c))-3)__|.`,
    wolfram: `⌊1/2(sqrt(1 + 2/(3c))-3)⌋.`,
  },  
  {
    latex: `2 ^ { \\left\\lfloor \\log _ { 2 } \\left( \\begin{array} { l } N _ { t } \\\\ N _ { p } \\end{array} \\right) \\right\\rfloor}`,
    ascii: `2^(|__log_(2)([N_(t)],[N_(p)])__|)`,
    wolfram: `2^(⌊log_2 ({{N_(t)}, {N_(p)}})⌋)`,
  },  
  {
    latex: `\\sum _ { k = 0 } ^ { 31 } \\left\\lfloor \\frac { 63 } { 2 k + 1 } \\right\\rfloor \\bmod 2`,
    ascii: `sum_(k=0)^(31)|__(63)/(2k+1)__|mod2`,
    wolfram: `sum_(k = 0)^31 ⌊63/(2k+1)⌋ mod 2`,
  },  
  {
    latex: "\\left[ \\begin{array} { l l l l l l l } 1 & 2 & 3 & 4 & 5 & 6 & 7 \\\\ 1 & 2 & 3 & 4 & 1 & 1 & 1 \\\\ 1 & 1 & 1 & 1 & 1 & 1 & 1 \\\\ \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & \\vdots \\\\ 1 & 2 & 1 & 2 & 1 & 2 & 1 \\\\ 0 & 1 & 1 & 0 & 1 & 1 & 1 \\\\ 1 & 2 & 3 & 4 & 5 & 6 & 7 \\end{array} \\right] ",
    ascii: `[[1,2,3,4,5,6,7],[1,2,3,4,1,1,1],[1,1,1,1,1,1,1],[vdots,vdots,vdots,vdots,vdots,vdots,vdots],[1,2,1,2,1,2,1],[0,1,1,0,1,1,1],[1,2,3,4,5,6,7]]`,
    wolfram: `[{{1, 2, 3, 4, 5, 6, 7}, {1, 2, 3, 4, 1, 1, 1}, {1, 1, 1, 1, 1, 1, 1}, {..., ..., ..., ..., ..., ..., ...}, {1, 2, 1, 2, 1, 2, 1}, {0, 1, 1, 0, 1, 1, 1}, {1, 2, 3, 4, 5, 6, 7}}]`,
  },
  {
    latex: `\\lim_{x\\rightarrow 0}{x^2}`,
    ascii: `lim_(x rarr0)x^(2)`,
    wolfram: `lim_(x -> 0)x^2`,
  }, 
  /** ignore \hline in the wolfram*/
  {
    latex: `\\left.\\begin{array}{r}{a}\\\\{b}\\\\{c}\\\\\\hline\\end{array}\\right.`,
    ascii: `{:[a],[b],[c],[hline]:}`,
    wolfram: `{{a}, {b}, {c}}`,
  },
  {
    latex: `\\left\\{\\begin{array}{r}{a}\\\\{b}\\\\{c}\\\\\\hline\\end{array}\\right\\}`,
    ascii: `{[a],[b],[c],[hline]}`,
    wolfram: `{{a}, {b}, {c}}`,
  },
  {
    latex: `\\begin{array}{c}{a1}&{a2}\\\\{b1}&{b2}\\end{array}`,
    ascii: `{:[a1,a2],[b1,b2]:}`,
    wolfram: `{{a1, a2}, {b1, b2}}`,
  },  
  {
    latex: `1 3 5`,
    ascii: `135`,
    wolfram: `135`,
  },  
  {
    latex: `1 , 3 x , 5`,
    ascii: `1,3x,5`,
    wolfram: `1, 3 x, 5`,
  },  
  {
    latex: `before\\mathbb { foo }after`,
    ascii: `beforefooafter`,
    wolfram: `beforefooafter`,
  },  
  {
    latex: `before\\mathbf { bar }after`,
    ascii: `beforebarafter`,
    wolfram: `beforebarafter`,
  },  
  {
    latex: `before\\mathcal { baz }after`,
    ascii: `beforebazafter`,
    wolfram: `beforebazafter`,
  },
  {
    latex: `\\left\\{\\begin{array}{ l l r } { x - y - z } & { = } & { 2} \\\\ { 2x + y + z } & { = } & { 1} \\\\ { 3x - 2y - z } & { = } & { 5}\\end{array}\\right.`,
    ascii: `{[x-y-z,=,2],[2x+y+z,=,1],[3x-2y-z,=,5]:}`,
    wolfram: `{x - y - z=2, 2 x + y + z=1, 3 x - 2 y - z=5}`,
  },  
  {
    latex: `\\begin{array}{lll}\\operatorname{s i n}&x&y\\\\(x^2)&x&y\\end{array}`,
    ascii: `{:[sin,x,y],[(x^(2)),x,y]:}`,
    wolfram: `{{sin, x, y}, {(x^2), x, y}}`,
  },
  {
    latex: `T _ { x } \\left( \\theta _ { r } \\right) = \\left[ \\begin{array} { l l l l } { 1} & { 0} & { 0} & { 0} \\\\ { 0} & { \\operatorname { c o s } \\theta _ { r } } & { \\operatorname { s i n } \\theta _ { r } } & { 0} \\\\ { 0} & { - \\operatorname { s i n } \\theta _ { r } } & { \\operatorname { c o s } \\theta _ { r } } & { 0} \\\\ { 0} & { 0} & { 0} & { 1} \\end{array} \\right]`,
    ascii: `T_(x)(theta_(r))=[[1,0,0,0],[0,{:cos theta_(r):},{:sin theta_(r):},0],[0,{:-sin theta_(r):},{:cos theta_(r):},0],[0,0,0,1]]`,
    wolfram: `T_(x)(theta_(r)) = [{{1, 0, 0, 0}, {0, {cos(theta_(r))}, {sin(theta_(r))}, 0}, {0, {-sin(theta_(r))}, {cos(theta_(r))}, 0}, {0, 0, 0, 1}}]`,
    wolfram_u: `T_(x)(θ_(r)) = [{{1, 0, 0, 0}, {0, {cos(θ_(r))}, {sin(θ_(r))}, 0}, {0, {-sin(θ_(r))}, {cos(θ_(r))}, 0}, {0, 0, 0, 1}}]`
  },
  {
    latex: `\\left.\\begin{array}{ll}{a1}&{a2}\\\\{b1}&{b2}\\end{array}\\right.`,
    ascii:     `{:[a1,a2],[b1,b2]:}`,
    wolfram: `{{a1, a2}, {b1, b2}}`
  },
  {
    latex: `\\left\\{\\begin{array}{r}{6x+2y \\leq 12}\\\\{x+y \\leq 5}\\\\{x \\geq 0}\\\\{y \\geq 0}\\end{array}\\right.`,
    ascii:     `{[6x+2y <= 12],[x+y <= 5],[x >= 0],[y >= 0]:}`,
    wolfram: `{6 x + 2 y <= 12, x + y <= 5, x >= 0, y >= 0}`
  },
  {
    latex: `f(x) = \\left\\{\\begin{array}{ll}{-x+3}&{\\text{if}x \\leq -1}\\\\{-3x+1}&{\\text{if}x > -1}\\end{array}\\right.`,
    ascii:     `f(x)={[-x+3,"if"x <= -1],[-3x+1,"if"x > -1]:}`,
    wolfram: `f(x) = {-x + 3, ifx <= - 1, -3 x + 1, ifx > - 1}`
  },
  {
    latex: `x - 2y = - 35 \\text{ and } 2x - y = 55`,
    ascii: `x-2y=-35" and "2x-y=55`,
    wolfram: `x - 2 y = - 35 and 2 x - y = 55`
  },
  {
    latex: `(5, 2)\\text{ and }(2 , 8)`,
    ascii: `(5,2)" and "(2,8)`,
    wolfram: `(5, 2) and (2, 8)`
  },
  {
    latex: `f ( x ) = \\left\\{ \\begin{array} { l l } { x ^ { 2} + 1,} & { x > 1} \\\\ { 1,} & { x = 1} \\\\ { x + 1,} & { x < 1} \\end{array} \\right.`,
    ascii:     `f(x)={[x^(2)+1",",x > 1],[1",",x=1],[x+1",",x < 1]:}`,
    wolfram: `f(x) = {x^2 + 1, x > 1, 1, x = 1, x + 1, x < 1}`
  },
  {
    latex: `f(x)= \\left\\{ \\begin{array} {ll} { x e ^ {2x} } & { \\text{ si } } & { x < 0} \\\\ { \\frac { \\operatorname { ln } ( x + 1) } { x + 1} } & { \\text{ si } } & { x \\geq 0} \\end{array} \\right.`,
    ascii: `f(x)={[xe^(2x)," si ",x < 0],[(ln(x+1))/(x+1)," si ",x >= 0]:}`,
    wolfram: `f(x) = {xe^(2 x), si, x < 0, (log(x+1))/(x+1), si, x >= 0}`,
    wolfram_u: `f(x) = {xe^(2 x), si, x < 0, (log(x+1))/(x+1), si, x >= 0}`,
  },
  {
    latex: `\\left\\{ \\begin{array} { r } { x \\geq 0,y \\geq 0} \\\\ { 2x + y \\leq 8} \\\\ { x + y \\geq 4} \\end{array} \\right.`,
    ascii:     `{[x >= 0","y >= 0],[2x+y <= 8],[x+y >= 4]:}`,
    wolfram: `{x >= 0, y >= 0, 2 x + y <= 8, x + y >= 4}`
  },
  {
    latex: `f ( x ) = \\left\\{ \\begin{array} { l l } { 2 x + 5 } & { \\text { khi } x < - 1 } \\\\ { x ^ { 2 } + 2 } & { \\text { khi } x \\geq - 1 } \\end{array} \\right.`,
    ascii:     `f(x)={[2x+5," khi "x < -1],[x^(2)+2," khi "x >= -1]:}`,
    wolfram: `f(x) = {2 x + 5, khi x < - 1, x^2 + 2, khi x >= - 1}`
  },
  {
    latex: `f ( x ) = \\left\\{ \\begin{array} { l } { 2x + 5\\text{ if } x < 0} \\\\ { x - 1\\text{ if } x > 0} \\end{array} \\right.`,
    ascii: `f(x)={[2x+5" if "x < 0],[x-1" if "x > 0]:}`,
    wolfram: `f(x) = {2 x + 5 if x < 0, x - 1 if x > 0}`
  },
  {
    latex: `y = x ^ { 2} ,y = x ^ { 2} + \\operatorname{sin} ( x ^ { 3} )`,
    ascii: `y=x^(2),y=x^(2)+sin(x^(3))`,
    wolfram: `y = x^2, y = x^2 + sin(x^3)`
  },
  {
    latex: `f ( x ) = \\text{ foo } + \\left\\{ \\begin{array} { l } { 2x + 5\\text{ if } x < 0} \\\\ { x - 1\\text{ if } x > 0} \\end{array} \\right.`,
    ascii: `f(x)=" foo "+{[2x+5" if "x < 0],[x-1" if "x > 0]:}`,
    wolfram: `f(x) = foo + {2 x + 5 if x < 0, x - 1 if x > 0}`
  },
  {
    latex: `\\langle \\frac{1}{2} \\rangle`,
    ascii:     `(:(1)/(2):)`,
    wolfram: `⟨1/2 ⟩`
  },
  {
    latex: `\\lfloor \\frac{1}{2} \\rfloor`,
    ascii:     `|__(1)/(2)__|`,
    wolfram: `⌊1/2 ⌋`
  },
  {
    latex: `\\lceil \\frac{1}{2} \\rceil`,
    ascii:     `|~(1)/(2)~|`,
    wolfram: `⌈1/2 ⌉`
  },
  {
    latex: `\\llcorner \\frac{1}{2} \\lrcorner`,
    ascii:     `llcorner(1)/(2)lrcorner`,
    wolfram: `⌞1/2 ⌟`
  },
  {
    latex: `\\ulcorner \\frac{1}{2} \\urcorner`,
    ascii:     `ulcorner(1)/(2)urcorner`,
    wolfram: `⌜1/2 ⌝`
  },
  {
    latex: `a | x y ^ 3 | ( b | c ^ 3 )`,
    ascii:     `a|xy^(3)|(b|c^(3))`,
    wolfram: `a|xy^3|(b|c^3)`
  },
  {
    latex: `a | _ b ^ c + a | ^ b _ c + a | _ b + a | ^ c`,
    ascii:     `a|_(b)^(c)+a|_(c)^(b)+a|_(b)+a|^(c)`,
    wolfram: `a|_(b)^(c) + a|_(c)^(b) + a|_(b) + a|^c`
  },
  // {
  //   latex: `a | _ { \\operatorname{s i n} ( \\pi ) }`,
  //   ascii: `a|_(sin(pi))`,
  //   wolfram: `a|_(sin(pi))`
  // },
  // {
  //   latex: `a _ {k} | _ { I _ { m } } = : u _ { k } ^ { m } \\in V,`,
  //   ascii:     `a_(k)|_(I_(m))=:u_(k)^(m)in V,`,
  //   wolfram: `a_(k)|_(I_(m))=:u_(k)^(m)in V,`
  // },
  // {
  //   latex: `h \\theta ( L ) = - k \\frac { d \\theta } { d x } | _ { x = L }`,
  //   ascii:     `h theta(L)=-k(d theta)/(dx)|_(x=L)`,
  //   wolfram: `h theta(L)=-k(d theta)/(dx)|_(x=L)`
  // },
  // {
  //   latex: `f ( a | b ) = x | _ { x _ 0 } ^ { x _ 1 }`,
  //   ascii:     `f(a|b)=x|_(x_(0))^(x_(1))`,
  //   wolfram: `f(a|b)=x|_(x_(0))^(x_(1))`
  // },

  {
    latex: `a \\| x y ^ 3 \\| ( b | c ^ 3 )`,
    ascii:     `a||xy^(3)||(b|c^(3))`,
    wolfram: `a||xy^3||(b|c^3)`
  },
  {
    latex: `\\begin{aligned}{(x^2)}\\end{aligned}`,
    ascii:     `{:(x^(2)):}`,
    wolfram: `{(x^2)}`
  },
  {
    latex: `k : [ \\left( \\begin{array} { l } { x } \\\\ { y } \\\\ { z } \\end{array} \\right) - \\left( \\begin{array} { c } { 4 } \\\\ { 8 } \\\\ { - 2 } \\end{array} \\right) ] ^ { 2 } = 5 ^ { 2 }`,
    ascii:     `k:[([x],[y],[z])-([4],[8],[-2])]^(2)=5^(2)`,
    wolfram: `k : [({{x}, {y}, {z}}) - ({{4}, {8}, {-2}})]^2 = 5^2`
  },
  {
    latex: `d s ^ { 2} = ( d X ^ { 0} ) ^ { 2} - R ( X ^ { 0} ) ^ { 2} \\sum _ { i = 1} ^ { D - 1} ( d X ^ { i } ) ^ { 2}`,
    ascii:     `ds^(2)=(dX^(0))^(2)-R(X^(0))^(2)sum_(i=1)^(D-1)(dX^(i))^(2)`,
    wolfram: `ds^2 = (dX^0)^2 - R(X^0)^2 sum_(i = 1)^(D - 1) (dX^i)^2`
  },
  {
    latex: `\\Delta ( W _ { 1} ) ^ { i t } J ( W _ { 2} ) \\Delta ( W _ { 1} ) ^ { - i t } = J ( l ( W _ { 1} ,t ) W _ { 2} )`,
    ascii:     `Delta(W_(1))^(it)J(W_(2))Delta(W_(1))^(-it)=J(l(W_(1),t)W_(2))`,
    wolfram: `Δ(W_1)^(it) J(W_2) Δ(W_1)^(-it) = J(l(W_1, t)W_2)`
  },
  {
    latex: `\\left.\\begin{array}{rl}{(x^\\mathbb{2})}&{\\mathcal{=}y^2}\\end{array}\\right.`,
    ascii:     `{:[(x^(2)),=y^(2)]:}`,
    wolfram: `{(x^2)=y^2}`
  },
  {
    latex: `\\begin{aligned}{(x^\\mathbb{2})}&{\\mathcal{=}y^2}\\end{aligned}`,
    ascii:     `{:(x^(2))=y^(2):}`,
    wolfram: `{(x^2)=y^2}`
  },
  {
    latex: `\\left. \\begin{array} { r l } { x + y } & { = 3 } \\\\ { y } & { = x ^ { 2 } - 8 x + 15 } \\end{array} \\right.`,
    ascii:     `{:[x+y,=3],[y,=x^(2)-8x+15]:}`,
    wolfram: `{x + y=3, y=x^2 - 8 x + 15}`
  },
  {
    latex: `\\left\\{\\begin{array}{rl}{x+y}&{=3}\\\\{y} & {=x^{2}-8x+15}\\end{array}\\right\\}`,
    ascii:     `{[x+y,=3],[y,=x^(2)-8x+15]}`,
    wolfram: `{x + y=3, y=x^2 - 8 x + 15}`
  },
  {
    latex: `\\left.\\begin{array}{l}\\text{above }\\\\x^2\\\\\\text{ below}\\end{array}\\right.`,
    ascii: `{:["above "],[x^(2)],[" below"]:}`,
    wolfram: `{{above}, {x^2}, {below}}`
  },
  {
    latex: `\\left ( \\frac{1}{2} \\right )`,
    ascii:     `((1)/(2))`,
    wolfram: `(1/2)`
  },
  {
    latex: `\\left \\{ \\frac{1}{2} \\right \\}`,
    ascii:     `{(1)/(2)}`,
    wolfram: `{1/2}`
  },
  {
    latex: `\\begin{array}{c}{}\\end{array}`,
    ascii:     `{::}`,
    wolfram: `{}`
  },
  {
    latex: `\\| x + \\left( \\begin{array}{c}{x}\\end{array} \\right) \\|`,
    ascii:     `||x+(x)||`,
    wolfram: `||x + ({x})||`
  },
  {
    latex: `{(}x^2{)}`,
    ascii:     `(x^(2))`,
    wolfram: `(x^2)`
  },
  {
    latex: `\\left.\\begin{array}{c}{a1}&{a2}\\\\{b1}&{b2}\\end{array}\\right.`,
    ascii:     `{:[a1,a2],[b1,b2]:}`,
    wolfram: `{{a1, a2}, {b1, b2}}`
  },
  {
    latex: `\\left.\\begin{array}{rl}{a1}&{a2}\\\\{b1}&{b2}\\end{array}\\right.`,
    ascii:     `{:[a1,a2],[b1,b2]:}`,
    wolfram: `{{a1, a2}, {b1, b2}}`
  },
  {
    latex: `\\left(\\begin{array}{rl}{x+y}&{=3}\\\\{y} & {=x^{2}-8x+15}\\end{array}\\right)`,
    ascii:     `([x+y,=3],[y,=x^(2)-8x+15])`,
    wolfram: `({x + y=3, y=x^2 - 8 x + 15})`
  },
  {
    latex: `\\left[\\begin{array}{rl}{x+y}&{=3}\\\\{y} & {=x^{2}-8x+15}\\end{array}\\right]`,
    ascii:     `[[x+y,=3],[y,=x^(2)-8x+15]]`,
    wolfram: `[{x + y=3, y=x^2 - 8 x + 15}]`
  },
  {
    latex: `\\begin{array}{l}{\\text{2}^{5}2^{2}+[(b}\\end{array}`,
    ascii:     `{:"2"^(5)2^(2)+[(b:}`,
    wolfram: `{2^5 2^2 + [(b}`
  },
  {
    latex: `a + \\text {This is }\\text{text} + b`,
    ascii: `a+"This is ""text"+b`,
    wolfram: `a + This is text + b`
  },
  // {
  //   latex: `\\text { foo } - 4 ^ { \\text { superscript } } \\text { bar }`,
  //   ascii: `" foo "-4^(" superscript ")" bar "`,
  //   ascii_old: `foo - 4^ superscript  bar`
  // },
  {
    latex: `\\text{The latex for }\\operatorname{sin}(x)\\text{is \\operatorname{sin}(x).}`,
    ascii: `"The latex for "sin(x)"is \\operatorname{sin}(x)."`,
    wolfram: `The latex for sin(x)is \\operatorname{sin}(x).`
  },
  {
    latex: `\\left.\\begin{array}{l}\\text{Now is}\\\\\\text{the time}\\end{array}\\right.`,
    ascii:     `{:["Now is"],["the time"]:}`,
    wolfram: `{{Now is}, {the time}}`
  },
  {
    latex: `\\left.\\begin{array}{l}\\text{Now is}\\\\\\text{the time}\\\\\\text{for all good men}\\\\\\text{to come to the aid}\\end{array}\\right.`,
    ascii:     `{:["Now is"],["the time"],["for all good men"],["to come to the aid"]:}`,
    wolfram: `{{Now is}, {the time}, {for all good men}, {to come to the aid}}`
  },
  {
    latex: `\\text { Figure } 1.1 : \\text { Relative translational motion }`,
    ascii: `" Figure "1.1:" Relative translational motion "`,
    wolfram: `Figure 1.1 : Relative translational motion`
  },
  {
    latex: `\\text { Under the simple parameterization } ( 4.1 ) \\text { of }`,
    ascii: `" Under the simple parameterization "(4.1)" of "`,
    wolfram: `Under the simple parameterization (4.1) of`
  },
  {
    latex: `\\left.\\begin{array}{l}{\\text{foo}} \\\\ { \\theta + C }\\end{array} \\right.`,
    ascii:     `{:["foo"],[theta+C]:}`,
    wolfram: `{{foo}, {theta + C}}`
  },
  {
    latex: `\\begin{array} { l } { \\text { How do we represent tables internally to do } } \\\\ { \\text { recognition? } } \\\\ { \\text { What is our preferred table format for editing in our } } \\\\ { \\text { apps? } } \\end{array}`,
    ascii: `{:[" How do we represent tables internally to do "],[" recognition? "],[" What is our preferred table format for editing in our "],[" apps? "]:}`,
    wolfram: `{{How do we represent tables internally to do}, {recognition?}, {What is our preferred table format for editing in our}, {apps?}}`
  },
  // {
  //   latex: `\\begin{array} { l } { \\text { A relatively long line of text that ends with a colon: } } \\\\ { \\text { leave the newline } } \\end{array}`,
  //   ascii: `{:[" A relatively long line of text that ends with a colon: "],[" leave the newline "]:}`,
  //   ascii_old: `[" A relatively long line of text that ends with a colon: "],[" leave the newline "]`
  // },
  // {
  //   latex: `\\begin{array} { l } { \\text { A relatively long line of text that is followed by } } \\\\ { \\text { - a line that looks like a list item } } \\end{array}`,
  //   ascii: `{:[" A relatively long line of text that is followed by "],[" - a line that looks like a list item "]:}`,
  //   ascii_old: `[" A relatively long line of text that is followed by "],[" - a line that looks like a list item "]`
  // },
  {
    latex: `\\begin{array} { l } { a + b + c + d + e + f + g + h + i + j + k + l + } \\\\ { m + n } \\end{array}`,
    ascii:     `{:[a+b+c+d+e+f+g+h+i+j+k+l+],[m+n]:}`,
    wolfram: `{{a + b + c + d + e + f + g + h + i + j + k + l +}, {m + n}}`
  },
  {
    latex: `\\{ \\begin{array} { l } { 4 x - 3 y = 6 } \\\\ { y = - 3 x + 15 } \\end{array}`,
    ascii:     `{{:[4x-3y=6],[y=-3x+15]:}`,
    wolfram: `{4 x - 3 y = 6, y = - 3 x + 15}`
  },
  {
    latex: `a\\pm b`,
    ascii:     `a+-b`,
    wolfram: `a ± b`
  },
  {
    latex: `x\\approx y`,
    ascii:     `x~~y`,
    wolfram: `x ≈ y`
  },
  {
    latex: `x\\cdot y`,
    ascii:     `x*y`,
    wolfram: `x×y`
  },
  {
    latex: `a, \\dots, b`,
    ascii:     `a,dots,b`,
    wolfram: `a, ..., b`
  },
  {
    latex: `\\frac{n!}{k!(n-k)!}`,
    ascii:     `(n!)/(k!(n-k)!)`,
    wolfram: `(n!)/(k!(n-k)!)`
  },
  {
    latex: `\\lim_{x\\rightarrow 0}{x^2}`,
    ascii:     `lim_(x rarr0)x^(2)`,
    wolfram: `lim_(x -> 0)x^2`
  },
  {
    latex: `\\operatorname { archyp } \\operatorname { tan } ( x )`,
    ascii: `archyp tan(x)`,
    wolfram: `archyp tan(x)`
  },
  {
    latex: '\\begin{array}{l}\n' +
      '3 x+2 y=-2 \\\\\n' +
      'x-2 y=-6\n' +
      '\\end{array}',
    ascii: `{:[3x+2y=-2],[x-2y=-6]:}`,
    wolfram: `{{3 x + 2 y = - 2}, {x - 2 y = - 6}}`,
  },
  {
    latex: '\\begin{aligned} \n' +
      'x y &=-24 \\\\ \n' +
      '5 x+4 y &=4 \n' +
      '\\end{aligned}',
    ascii: `{:[xy=-24],[5x+4y=4]:}`,
    wolfram: `{xy = - 24, 5 x + 4 y = 4}`,
  },
  {
    latex: 't=\\sqrt{\\frac{(2) 42}{9.8} \\mathrm{~m} / \\mathrm{s}^{2}}',
    ascii: `t=sqrt(((2)42)/(9.8)m//s^(2))`,
    wolfram: `t = sqrt(((2)42)/9.8m/s^2)`,
  },
  {
    latex: '200 \\mathrm{~V}',
    ascii: `200V`,
    wolfram: `200V`,
  },
  {
    latex: `\\frac{\\sqrt[4]{32 z^{6} y^{3}}}{\\sqrt[4]{2 z^{2} y^{11}}}'`,
    ascii: '(root(4)(32z^(6)y^(3)))/(root(4)(2z^(2)y^(11)))',
    wolfram: `((32z^6 y^3)^(1/4)/(2z^2 y^11)^(1/4))'`,
  },
  {
    latex: `\\{ d \\} = \\left\\{ \\begin{array} { l } u \\\\ v \\end{array} \\right\\} = \\left[ \\begin{array} { l l l l l l } 1 & x & y & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 1 & x & y \\end{array} \\right] \\left\\{ \\begin{array} { l } \\alpha _ { 1 } \\\\ \\alpha _ { 2 } \\\\ \\alpha _ { 3 } \\\\ \\alpha _ { 4 } \\\\ \\alpha _ { 5 } \\\\ \\alpha _ { 6 } \\end{array} \\right\\} = [ S ] \\{ \\alpha \\}`,
    ascii: `{d}={[u],[v]}=[[1,x,y,0,0,0],[0,0,0,1,x,y]]{[alpha_(1)],[alpha_(2)],[alpha_(3)],[alpha_(4)],[alpha_(5)],[alpha_(6)]}=[S]{alpha}`,
    wolfram: `{d} = {{u}, {v}} = [{{1, x, y, 0, 0, 0}, {0, 0, 0, 1, x, y}}]{{alpha_(1)}, {alpha_(2)}, {alpha_(3)}, {alpha_(4)}, {alpha_(5)}, {alpha_(6)}} = [S] {alpha}`,
  },  
  {
    latex: `[ c ] ^ { - 1 } = \\frac { 1 } { 2 A } \\left[ \\begin{array} { c c c c c c } a _ { i } & 0 & a _ { j } & 0 & a _ { k } & 0 \\\\ b _ { i } & 0 & b _ { j } & 0 & b _ { k } & 0 \\\\ c _ { i } & 0 & c _ { j } & 0 & c _ { k } & 0 \\\\ 0 & a _ { i } & 0 & a _ { j } & 0 & a _ { k } \\\\ 0 & b _ { i } & 0 & b _ { j } & 0 & b _ { k } \\\\ 0 & c _ { i } & 0 & c _ { j } & 0 & c _ { k } \\end{array} \\right]`,
    ascii: `[c]^(-1)=(1)/(2A)[[a_(i),0,a_(j),0,a_(k),0],[b_(i),0,b_(j),0,b_(k),0],[c_(i),0,c_(j),0,c_(k),0],[0,a_(i),0,a_(j),0,a_(k)],[0,b_(i),0,b_(j),0,b_(k)],[0,c_(i),0,c_(j),0,c_(k)]]`,
    wolfram: `[c]^(-1) = 1/(2A)[{{a_i, 0, a_j, 0, a_(k), 0}, {b_i, 0, b_j, 0, b_(k), 0}, {c_i, 0, c_j, 0, c_(k), 0}, {0, a_i, 0, a_j, 0, a_(k)}, {0, b_i, 0, b_j, 0, b_(k)}, {0, c_i, 0, c_j, 0, c_(k)}}]`,
  },  
  {
    latex: `2 A = \\left| \\begin{array} { l l l } 1 & x _ { i } & y _ { i } \\\\ 1 & x _ { j } & y _ { j } \\\\ 1 & x _ { k } & y _ { k } \\end{array} \\right| = \\left( x _ { i } - x _ { j } \\right) \\left( y _ { k } - y _ { j } \\right) - \\left( x _ { k } - x _ { j } \\right) \\left( y _ { j } - y _ { k } \\right)`,
    ascii: `2A=|[1,x_(i),y_(i)],[1,x_(j),y_(j)],[1,x_(k),y_(k)]|=(x_(i)-x_(j))(y_(k)-y_(j))-(x_(k)-x_(j))(y_(j)-y_(k))`,
    wolfram: `2 A = det({{1, x_i, y_i}, {1, x_j, y_j}, {1, x_(k), y_(k)}}) = (x_i -x_j)(y_(k)-y_j) - (x_(k)-x_j)(y_j -y_(k))`,
  },  
  {
    latex: ``,
    ascii: ``,
    wolfram: ``,
  },
];
