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
    wolfram: `sqrt(b^2 - 4 a c)`,
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
    wolfram: `(d(v_(i j))/dt)`,
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
    wolfram: `Y = 2 + 0.5 Z + X + Z X + epsilon.`,
    wolfram_u: `Y = 2 + 0.5 Z + X + Z X + ϵ.`,
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
    wolfram: `De^(-kappa a/2) = Ae^(i k a/2) + Be^(-i k a/2)`,
    wolfram_u: `De^(-κ a/2) = Ae^(i k a/2) + Be^(-i k a/2)`,
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
    wolfram_u: `x = e cos(θ sin(φ))`,
  },
  {
    latex: `V ( \\Omega ) = \\sqrt { \\mathrm { e } ^ { 2 \\pi \\nu ( \\Omega )} - 1 } \\mathrm { e } ^ { - 2 i \\xi ( \\Omega ) + i \\left( k ( \\Omega ) - k _ { 0 } \\right) L + i \\varphi _ { A } } `,
    ascii: `V(Omega)=sqrt(e^(2pi nu(Omega))-1)e^(-2i xi(Omega)+i(k(Omega)-k_(0))L+ivarphi_(A))`,
    wolfram: `V(Ω) = sqrt(e^(2 pi nu(Ω)) - 1)e^(-2 i ξ(Ω) + i(k(Ω)-k_0)L + i phi_(A))`,
    wolfram_u: `V(Ω) = sqrt(e^(2 π ν(Ω)) - 1)e^(-2 i ξ(Ω) + i(k(Ω)-k_0)L + i φ_(A))`,
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
    wolfram: `{{x^3 + 5x^2 + 4},{(12x^n +18)/(x^n +3)}}`,
  },
    {
    latex: `( x - 1 ) ( x + 3 ) \\cdot ( x - 3 )`,
    ascii:     `(x-1)(x+3)*(x-3)`,
    wolfram: `(x - 1)(x + 3)×(x - 3)`,
  },
 {
    latex: `u _ { x x } + u _ { y y } = 0`,
    ascii:     `u_(xx)+u_(yy)=0`,
    wolfram: `u_(x x) + u_(y y) = 0`,
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
    wolfram: `sin( widehat(APE)) = (12sqrt(15))/5/(3sqrt(10)) = (12sqrt(15))/(15sqrt(10)) = (4sqrt(3))/(5sqrt(2)) = (2sqrt(6))/5.`,
  },      
  {
    latex: `\\operatorname { l i m } _ { x \\rightarrow 0 } \\frac { 1 } { x } =`,
    ascii: `lim_(x rarr0)(1)/(x)=`,
    wolfram: `lim_(x to 0)1/x =`,
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
    wolfram: `( - 1, 0) ∪ (1, + inf)`,
    wolfram_u: `( - 1, 0) ∪ (1, + ∞)`,
  },
  {
    latex: `( - \\infty , - 4 ] \\cup [ 4 , \\infty )`,
    ascii: `(-oo,-4]uu[4,oo)`,
    wolfram: `( - inf, - 4] ∪ [4, inf)`,
    wolfram_u: `( - ∞, - 4] ∪ [4, ∞)`,
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
  
  // --- integrals ---
  {
    latex: `\\int x^2 \\sin ^3(x) d x=`,
    ascii: `intx^(2)sin^(3)(x)dx=`,
    wolfram: `int x^2 sin^3 (x)dx =`,
  },  
  {
    latex: `\\int_0^\\pi \\sin (x) d x`,
    ascii: `int_(0)^(pi)sin(x)dx`,
    wolfram: `int_0^pi sin(x)dx`,
    wolfram_: `int_0^π sin(x)dx`,
  },  
  {
    latex: `\\int x^5 d x`,
    ascii: `intx^(5)dx`,
    wolfram: `int x^5 dx`,
  },  
  {
    latex: `\\int e^t \\sin(5t) dt`,
    ascii: `inte^(t)sin(5t)dt`,
    wolfram: `int e^t sin(5 t)dt`,
  },
  {
    latex: `\\int \\frac{1}{\\sqrt{1-u^4}}`,
    ascii: `int(1)/(sqrt(1-u^(4)))`,
    wolfram: `int 1/sqrt(1 - u^4)`,
  },
 {
    latex: `\\int_0^ae^{-at}`,
    ascii: `int_(0)^(a)e^(-at)`,
    wolfram: `int_0^a e^(-a t)`,
  },
 {
    latex: `\\int_0^{\\pi} (\\sin^2(x) + 2 \\sin^4(2 x)) dx`,
    ascii: `int_(0)^(pi)(sin^(2)(x)+2sin^(4)(2x))dx`,
    wolfram: `int_0^pi (sin^2 (x) + 2sin^4 (2 x))dx`,
    wolfram_: `int_0^π (sin^2 (x) + 2sin^4 (2 x))dx`,
  },
  {
    latex: `\\int_{-\\infty}^{\\infty} \\exp\\left(-t^2\\right) dt`,
    ascii: `int_(-oo)^(oo)exp(-t^(2))dt`,
    wolfram: `int_(-inf)^inf exp(-t^2)dt`,
    wolfram_u: `int_(-∞)^∞ exp(-t^2)dt`,
  },
  //Multiple Integrals
  {
    latex: `\\int_0^\\pi \\int_0^1 x^2 \\sin (y) d x d y`,
    ascii: `int_(0)^(pi)int_(0)^(1)x^(2)sin(y)dxdy`,
    wolfram: `int_0^pi int_0^1 x^2 sin(y)dx dy`,
    wolfram_u: `int_0^π int_0^1 x^2 sin(y)dx dy`,
  },  
  {
    latex: `\\int_{-2}^2 \\int_{-2}^2\\left(x^2 y^2+x y^3\\right) d x d y`,
    ascii: `int_(-2)^(2)int_(-2)^(2)(x^(2)y^(2)+xy^(3))dxdy`,
    wolfram: `int_(-2)^2 int_(-2)^2 (x^2 y^2 +xy^3)dx dy`,
  },  
  {
    latex: `\\int_0^\\pi \\int_0^1 \\int_0^\\pi\\left(\\sin ^2(x)+y \\sin (z)\\right) d x d y d z`,
    ascii: `int_(0)^(pi)int_(0)^(1)int_(0)^(pi)(sin^(2)(x)+y sin(z))dxdydz`,
    wolfram: `int_0^pi int_0^1 int_0^pi (sin^2 (x)+y sin(z))dx dy dz`,
    wolfram_u: `int_0^π int_0^1 int_0^π (sin^2 (x)+y sin(z))dx dy dz`,
  },  
  {
    latex: `\\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} e^{-\\left(x^2+y^2\\right)} d x d y`,
    ascii: `int_(-oo)^(oo)int_(-oo)^(oo)e^(-(x^(2)+y^(2)))dxdy`,
    wolfram: `int_(-inf)^inf int_(-inf)^inf e^(-(x^2 +y^2)) dx dy`,
    wolfram_u: `int_(-∞)^∞ int_(-∞)^∞ e^(-(x^2 +y^2)) dx dy`,
  },  
  /** TODO: \\oint, \\iint */
  // {
  //   latex: ``,
  //   ascii: ``,
  //   wolfram: ``,
  // },  
  
  // Matrices
  {
    latex: "\\left(\\begin{array}{cc}\n" +
      "6 & -7 \\\\\n" +
      "0 & 3\n" +
      "\\end{array}\\right)",
    ascii: `([6,-7],[0,3])`,
    wolfram: `({6,-7},{0,3})`,
  },  
  {
    latex: "\\left(\\begin{array}{ccc}\n" +
      "1 & -5 & 8 \\\\\n" +
      "1 & -2 & 1 \\\\\n" +
      "2 & -1 & -5\n" +
      "\\end{array}\\right)",
    ascii: `([1,-5,8],[1,-2,1],[2,-1,-5])`,
    wolfram: `({1,-5,8},{1,-2,1},{2,-1,-5})`,
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
    wolfram: `({1,2},{3,4}) + ({2,-1},{-1,2})`,
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
    wolfram: `({2,-1},{1,3})×({1,2},{3,4})`,
  },  
  {
    latex: `\\left(\\begin{array}{lll}
2 & -1 & 1 \\\\
0 & -2 & 1 \\\\
1 & -2 & 0
\\end{array}\\right) \\cdot\\{x, y, z\\}`,
    ascii: `([2,-1,1],[0,-2,1],[1,-2,0])*{x,y,z}`,
    wolfram: `({2,-1,1},{0,-2,1},{1,-2,0})× {x, y, z}`,
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
];
