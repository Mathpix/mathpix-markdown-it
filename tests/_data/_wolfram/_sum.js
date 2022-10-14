module.exports = [
  {
    latex: `\\sum _ { i = 1 } ^ { 4 } ( - 1 ) ^ { i } \\frac { 1 } { ( 2 ) ^ { i } }`,
    ascii:     `sum_(i=1)^(4)(-1)^(i)(1)/((2)^(i))`,
    wolfram: `sum_(i = 1)^4 ( - 1)^i 1/((2)^i)`,
    wolfram_: `sum_(i=1)^4(-1)^i1/((2)^i)`,
  },
  {
    latex: `\\sum_{i=1}^n c=c n`,
    ascii:     `sum_(i=1)^(n)c=cn`,
    wolfram: `sum_(i = 1)^n c = c n`,
    wolfram_: `sum_(i=1)^nc=cn`,
  },
  {
    latex: `\\sum_{k=0}^{\\infty} a r^k=\\frac{a}{1-r}`,
    ascii:     `sum_(k=0)^(oo)ar^(k)=(a)/(1-r)`,
    wolfram: `sum_(k = 0)^inf ar^k = a/(1-r)`,
    wolfram_u: `sum_(k = 0)^∞ ar^k = a/(1-r)`,
  },
  {
    latex: `\\sum f`,
    ascii:     `sum f`,
    wolfram: `sum f`,
  },
  {
    latex: `\\chi^{2}=\\sum_{i=1}^{6}\\chi_{i}^{2}`,
    ascii:     `chi^(2)=sum_(i=1)^(6)chi_(i)^(2)`,
    wolfram: `chi^2 = sum_(i = 1)^6 chi_i^(2)`,
    wolfram_u: `(χ)^2 = sum_(i = 1)^6 χ_i^(2)`,
  },
  {
    latex: `\\sum_{j=1}^{100} j^2`,
    ascii: `sum_(j=1)^(100)j^(2)`,
    wolfram: `sum_(j = 1)^100 j^2`,
  },
  {
    latex: `\\sum_{j=0}^{a s}\\left(8-j^{2}\\right)`,
    ascii: `sum_(j=0)^(as)(8-j^(2))`,
    wolfram: `sum_(j = 0)^(a s) (8-j^2)`,
  },

  {
    latex: `\\sum_{k=1}^{\\infty} \\frac{1}{k^{3} \\sqrt{k}}`,
    ascii: `sum_(k=1)^(oo)(1)/(k^(3)sqrtk)`,
    wolfram: `sum_(k = 1)^inf 1/(k^3 sqrt(k))`,
    wolfram_u: `sum_(k = 1)^∞ 1/(k^3 sqrt(k))`,
  },

  {
    latex: `\\sum _ { j = 1 } ^ { m } \\sum _ { j = 1 } ^ { n } a _ { i j } x _ { i } y _ { j }`,
    ascii: `sum_(j=1)^(m)sum_(j=1)^(n)a_(ij)x_(i)y_(j)`,
    wolfram: `sum_(j = 1)^m sum_(j = 1)^n a_(i j)x_i y_j`,
  },
  
  /** Alternatively, index and bounds of summation are sometimes omitted from the definition of summation
   * if the context is sufficiently clear. This applies particularly when the index runs from 1 to n.
   * For example, one might write that:
   *
   * \sum a_i^2
   * \sum_{i=1}^n a_i^2
   * */
  {
    latex: `\\sum_j y`,
    ascii: `sum _(j)y`,
    wolfram: `sum_(j=1)^n y`,
  },
  {
    latex: `\\dot { n } _ { i } = \\dot { n } _ { i 0 } + \\sum _ { j } \\dot { v } _ { i j } \\xi _ { \\mathrm{j} }`,
    ascii: `n^(˙)_(i)=n^(˙)_(i0)+sum_(j)v^(˙)_(ij)xi_(j)`,
    wolfram: `(d(n_i)/dt) = (d(n_(i0))/dt) + sum_(j=1)^n (d(v_(i j))/dt)ξ_j`,
  },
  {
    latex: `\\sum _ { i } w _ { i } y _ { i } `,
    ascii: `sum_(i)w_(i)y_(i)`,
    wolfram: `sum_(i=1)^n w_i y_i`,
  },
];
