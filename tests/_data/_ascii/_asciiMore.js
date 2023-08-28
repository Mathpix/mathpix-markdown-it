module.exports = [
  {
    latex: `\\begin{aligned}\\frac{\\partial f}{\\partial \\boldsymbol{A}}: \\boldsymbol{T} &=\\left.\\frac{d}{d \\alpha}\\left[\\alpha^{3} \\operatorname{det}(\\boldsymbol{A})\\left(\\frac{1}{\\alpha^{3}}+I_{1}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\frac{1}{\\alpha^{2}}+I_{2}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\frac{1}{\\alpha}+I_{3}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right)\\right)\\right]\\right|_{0} \\\\&=\\left.\\operatorname{det}(\\boldsymbol{A}) \\frac{d}{d \\alpha}\\left[1+I_{1}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha+I_{2}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha^{2}+I_{3}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha^{3}\\right]\\right|_{a-0} \\\\&=\\left.\\operatorname{det}(\\boldsymbol{A})\\left[I_{1}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right)+2 I_{2}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha+3 I_{3}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha^{2}\\right]\\right|_{\\alpha=0} \\\\&=\\operatorname{det}(\\boldsymbol{A}) I_{1}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right)\\end{aligned}`,
    ascii:  `{:[(del f)/(del A):T=(d)/(d alpha)[alpha^(3)det(A)((1)/(alpha^(3))+I_(1)(A^(-1)*T)(1)/(alpha^(2))+I_(2)(A^(-1)*T)(1)/(alpha)+I_(3)(A^(-1)*T))]|_(0)],[=det(A)(d)/(d alpha)[1+I_(1)(A^(-1)*T)alpha+I_(2)(A^(-1)*T)alpha^(2)+I_(3)(A^(-1)*T)alpha^(3)]|_(a-0)],[=det(A)[I_(1)(A^(-1)*T)+2I_(2)(A^(-1)*T)alpha+3I_(3)(A^(-1)*T)alpha^(2)]|_(alpha=0)],[=det(A)I_(1)(A^(-1)*T)]:}`,
    ascii1: `[(del f)/(del A):T,={:(d)/(d alpha)[alpha^(3)det⁡(A)((1)/(alpha^(3))+I_(1)(A^(-1)*T)(1)/(alpha^(2))+I_(2)(A^(-1)*T)(1)/(alpha)+I_(3)(A^(-1)*T))]|_(0)],[,={: det⁡(A)(d)/(d alpha)[1+I_(1)(A^(-1)*T)alpha+I_(2)(A^(-1)*T)alpha^(2)+I_(3)(A^(-1)*T)alpha^(3)]|_(a-0)],[,={: det⁡(A)[I_(1)(A^(-1)*T)+2I_(2)(A^(-1)*T)alpha+3I_(3)(A^(-1)*T)alpha^(2)]|_(alpha=0)],[,=det⁡(A)I_(1)(A^(-1)*T)]`,
  },
  {
    latex: `\\begin{aligned}\\left\\langle U_{T_{*}}^{n} 1,1\\right\\rangle &=\\prod_{n \\in \\mathbb{Z}} \\int_{\\mathbb{Z}_{+}} \\sqrt{\\frac{d \\kappa_{k-n}}{d \\kappa_{k}}\\left(y_{k}\\right)} d \\kappa_{k}\\left(y_{k}\\right) \\\\ &=\\prod_{n \\in \\mathbb{Z}}\\left(1-H^{2}\\left(\\kappa_{k-n}, \\kappa_{k}\\right)\\right) \\\\ & \\leq \\prod_{n \\in \\mathbb{Z}}\\left(1-H^{2}\\left(\\kappa_{k-n}, \\kappa_{k}\\right)\\right) \\\\ &=\\prod_{\\frac{n}{3}<k<\\frac{2 n}{3}}^{\\frac{n}{3}<k<\\frac{2 n}{3}} \\\\ &<\\left(1-\\delta^{2}\\right)^{n / 3} \\end{aligned}`,
    ascii:  `{:[(:U_(T_(**))^(n)1,1:)=prod_(n in Z)int_(Z_(+))sqrt((d kappa_(k-n))/(d kappa_(k))(y_(k)))d kappa_(k)(y_(k))],[=prod_(n in Z)(1-H^(2)(kappa_(k-n),kappa_(k)))],[ <= prod_(n in Z)(1-H^(2)(kappa_(k-n),kappa_(k)))],[=prod_((n)/(3) < k < (2n)/(3))^((n)/(3) < k < (2n)/(3))],[ < (1-delta^(2))^(n//3)]:}`,
    ascii1: `[(:U_(T_(**))^(n)1,1:),=prod_(n inZ)int_(Z_(+))sqrt(sqrt(((dkappa_(k-n))/(dkappa_(k))(y_(k))))dkappa_(k)(y_(k))],[,=prod_(n inZ)(1-H^(2)(kappa_(k-n),kappa_(k)))],[,<=prod_(n inZ)(1-H^(2)(kappa_(k-n),kappa_(k)))],[,=prod_((n)/(3)<k<(2n)/(3))^((n)/(3)<k<(2n)/(3))],[,<(1-delta^(2))^(n//3)]`,
  },
  {
    latex: '\\frac{\\sqrt[4]{32 z^{6} y^{3}}}{\\sqrt[4]{2 z^{2} y^{11}}}',
    ascii: '(root(4)(32z^(6)y^(3)))/(root(4)(2z^(2)y^(11)))'
  },
  {
    latex: 'a \\operatorname { \\lambda mod} b',
    ascii: 'a lambda mod b'
  },
  {
    latex: 'a \\operatorname { \\lambda mod } b',
    ascii: 'a lambda mod b'
  },
  {
    latex: 'a \\operatorname{mod} b',
    ascii: 'a mod b'
  },
  {
    latex: 'a \\operatorname { m o d } b',
    ascii: 'a mod b'
  },
  {
    latex: 'a \\operatorname{m} b',
    ascii: 'a m b'
  },
  {
    latex: 'a \\operatorname{m} \\operatorname{o} \\operatorname{d}b',
    ascii: 'a m o d b'
  },
  {
    latex: 'a \\operatorname{m}2 b',
    ascii: 'a m 2b'
  },
  {
    latex: 'a \\operatorname{m1} b',
    ascii: 'a m1 b'
  },
  // {
  //   latex: '',
  //   ascii: ''
  // }
];
