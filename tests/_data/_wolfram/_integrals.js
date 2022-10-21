module.exports = [
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
    wolfram: `int_0^a e^(-at)`,
    wolfram_: `int_0^a e^(-a t)`,
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
    wolfram: `int_0^pi int_0^1 x^2 sin(y)dxdy`,
    wolfram_: `int_0^pi int_0^1 x^2 sin(y)dx dy`,
    wolfram_u: `int_0^π int_0^1 x^2 sin(y)dxdy`,
    wolfram_u_: `int_0^π int_0^1 x^2 sin(y)dx dy`,
  },
  {
    latex: `\\int_{-2}^2 \\int_{-2}^2\\left(x^2 y^2+x y^3\\right) d x d y`,
    ascii: `int_(-2)^(2)int_(-2)^(2)(x^(2)y^(2)+xy^(3))dxdy`,
    wolfram: `int_(-2)^2 int_(-2)^2 (x^2 y^2 +xy^3)dxdy`,
    wolfram_: `int_(-2)^2 int_(-2)^2 (x^2 y^2 +xy^3)dx dy`,
  },
  {
    latex: `\\int_0^\\pi \\int_0^1 \\int_0^\\pi\\left(\\sin ^2(x)+y \\sin (z)\\right) d x d y d z`,
    ascii: `int_(0)^(pi)int_(0)^(1)int_(0)^(pi)(sin^(2)(x)+y sin(z))dxdydz`,
    wolfram: `int_0^pi int_0^1 int_0^pi (sin^2 (x)+y sin(z))dxdydz`,
    wolfram_: `int_0^pi int_0^1 int_0^pi (sin^2 (x)+y sin(z))dx dy dz`,
    wolfram_u: `int_0^π int_0^1 int_0^π (sin^2 (x)+y sin(z))dxdydz`,
    wolfram_u_: `int_0^π int_0^1 int_0^π (sin^2 (x)+y sin(z))dx dy dz`,
  },
  {
    latex: `\\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} e^{-\\left(x^2+y^2\\right)} d x d y`,
    ascii: `int_(-oo)^(oo)int_(-oo)^(oo)e^(-(x^(2)+y^(2)))dxdy`,
    wolfram: `int_(-inf)^inf int_(-inf)^inf e^(-(x^2 +y^2)) dxdy`,
    wolfram_: `int_(-inf)^inf int_(-inf)^inf e^(-(x^2 +y^2)) dx dy`,
    wolfram_u: `int_(-∞)^∞ int_(-∞)^∞ e^(-(x^2 +y^2)) dxdy`,
    wolfram_u_: `int_(-∞)^∞ int_(-∞)^∞ e^(-(x^2 +y^2)) dx dy`,
  },
  /** \iint and \iiint */
  {
    latex: `\\iint \\sqrt { \\frac { 1 - x ^ { 2 } - y ^ { 2 } } { 1 + x ^ { 2 } + y ^ { 2 } } } d x d y`,
    ascii: `∬sqrt((1-x^(2)-y^(2))/(1+x^(2)+y^(2)))dxdy`,
    wolfram: `int int sqrt((1-x^2 -y^2)/(1+x^2 +y^2))dxdy`,
    wolfram_: `int int sqrt((1-x^2 -y^2)/(1+x^2 +y^2))dx dy`,
  },
  {
    latex: `I_{1} = \\rho \\iiint (\\surd y + \\surd z) dx dy dz`,
    ascii: `I_(1)=rho∭(√y+√z)dxdydz`,
    wolfram: `I_1 = ρ int int int (√y + √z)dxdydz`,
    wolfram_: `I_1 = ρ int int int (√y + √z)dx dy dz`,
  },
  
  /** TODO: \\oint, \\iint */
  // {
  //   latex: ``,
  //   ascii: ``,
  //   wolfram: ``,
  // },  
];
