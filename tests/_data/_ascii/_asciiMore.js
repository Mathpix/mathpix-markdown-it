module.exports = [
  {
    latex: `\\begin{aligned}\\frac{\\partial f}{\\partial \\boldsymbol{A}}: \\boldsymbol{T} &=\\left.\\frac{d}{d \\alpha}\\left[\\alpha^{3} \\operatorname{det}(\\boldsymbol{A})\\left(\\frac{1}{\\alpha^{3}}+I_{1}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\frac{1}{\\alpha^{2}}+I_{2}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\frac{1}{\\alpha}+I_{3}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right)\\right)\\right]\\right|_{0} \\\\&=\\left.\\operatorname{det}(\\boldsymbol{A}) \\frac{d}{d \\alpha}\\left[1+I_{1}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha+I_{2}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha^{2}+I_{3}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha^{3}\\right]\\right|_{a-0} \\\\&=\\left.\\operatorname{det}(\\boldsymbol{A})\\left[I_{1}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right)+2 I_{2}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha+3 I_{3}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha^{2}\\right]\\right|_{\\alpha=0} \\\\&=\\operatorname{det}(\\boldsymbol{A}) I_{1}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right)\\end{aligned}`,
    ascii:  `{:[(del f)/(del A):T=(d)/(d alpha)[alpha^(3)det(A)((1)/(alpha^(3))+I_(1)(A^(-1)*T)(1)/(alpha^(2))+I_(2)(A^(-1)*T)(1)/(alpha)+I_(3)(A^(-1)*T))]|_(0)],[= det(A)(d)/(d alpha)[1+I_(1)(A^(-1)*T)alpha+I_(2)(A^(-1)*T)alpha^(2)+I_(3)(A^(-1)*T)alpha^(3)]|_(a-0)],[= det(A)[I_(1)(A^(-1)*T)+2I_(2)(A^(-1)*T)alpha+3I_(3)(A^(-1)*T)alpha^(2)]|_(alpha=0)],[=det(A)I_(1)(A^(-1)*T)]:}`,
    liner:  '(∂ f)/(∂ A):T=d/(d α)[α^3det(A)(1/(α^3)+I_1(A^(−1)⋅T)1/(α^2)+I_2(A^(−1)⋅T)1/α+I_3(A^(−1)⋅T))]|_0 \n' +
      '=det(A)d/(d α)[1+I_1(A^(−1)⋅T)α+I_2(A^(−1)⋅T)α^2+I_3(A^(−1)⋅T)α^3]|_(a−0) \n' +
      '=det(A)[I_1(A^(−1)⋅T)+2I_2(A^(−1)⋅T)α+3I_3(A^(−1)⋅T)α^2]|_(α=0) \n' +
      '=det(A)I_1(A^(−1)⋅T)',
    ascii1: `[(del f)/(del A):T,={:(d)/(d alpha)[alpha^(3)det⁡(A)((1)/(alpha^(3))+I_(1)(A^(-1)*T)(1)/(alpha^(2))+I_(2)(A^(-1)*T)(1)/(alpha)+I_(3)(A^(-1)*T))]|_(0)],[,={: det⁡(A)(d)/(d alpha)[1+I_(1)(A^(-1)*T)alpha+I_(2)(A^(-1)*T)alpha^(2)+I_(3)(A^(-1)*T)alpha^(3)]|_(a-0)],[,={: det⁡(A)[I_(1)(A^(-1)*T)+2I_(2)(A^(-1)*T)alpha+3I_(3)(A^(-1)*T)alpha^(2)]|_(alpha=0)],[,=det⁡(A)I_(1)(A^(-1)*T)]`,
  },
  {
    latex: `\\begin{aligned}\\left\\langle U_{T_{*}}^{n} 1,1\\right\\rangle &=\\prod_{n \\in \\mathbb{Z}} \\int_{\\mathbb{Z}_{+}} \\sqrt{\\frac{d \\kappa_{k-n}}{d \\kappa_{k}}\\left(y_{k}\\right)} d \\kappa_{k}\\left(y_{k}\\right) \\\\ &=\\prod_{n \\in \\mathbb{Z}}\\left(1-H^{2}\\left(\\kappa_{k-n}, \\kappa_{k}\\right)\\right) \\\\ & \\leq \\prod_{n \\in \\mathbb{Z}}\\left(1-H^{2}\\left(\\kappa_{k-n}, \\kappa_{k}\\right)\\right) \\\\ &=\\prod_{\\frac{n}{3}<k<\\frac{2 n}{3}}^{\\frac{n}{3}<k<\\frac{2 n}{3}} \\\\ &<\\left(1-\\delta^{2}\\right)^{n / 3} \\end{aligned}`,
    ascii:  `{:[(:U_(T_(**))^(n)1,1:)=prod_(n inZ)int_(Z_(+))sqrt((dkappa_(k-n))/(dkappa_(k))(y_(k)))dkappa_(k)(y_(k))],[=prod_(n inZ)(1-H^(2)(kappa_(k-n),kappa_(k)))],[ <= prod_(n inZ)(1-H^(2)(kappa_(k-n),kappa_(k)))],[=prod_((n)/(3) < k < (2n)/(3))^((n)/(3) < k < (2n)/(3))],[ < (1-delta^(2))^(n//3)]:}`,
    liner:  '⟨U_(T_∗)^n1,1⟩=∏_(n ∈Z)∫_(Z_+)√(((dκ_(k−n))/(dκ_k))(y_k))dκ_k(y_k) \n' +
      '=∏_(n ∈Z)(1−H^2(κ_(k−n),κ_k)) \n' +
      '≤∏_(n ∈Z)(1−H^2(κ_(k−n),κ_k)) \n' +
      '=∏_(n/3<k<(2n)/3)^(n/3<k<(2n)/3) \n' +
      '<(1−δ^2)^(n/3)',
    ascii1: `[(:U_(T_(**))^(n)1,1:),=prod_(n inZ)int_(Z_(+))sqrt(sqrt(((dkappa_(k-n))/(dkappa_(k))(y_(k))))dkappa_(k)(y_(k))],[,=prod_(n inZ)(1-H^(2)(kappa_(k-n),kappa_(k)))],[,<=prod_(n inZ)(1-H^(2)(kappa_(k-n),kappa_(k)))],[,=prod_((n)/(3)<k<(2n)/(3))^((n)/(3)<k<(2n)/(3))],[,<(1-delta^(2))^(n//3)]`,
  },
  {
    latex: '\\frac{\\sqrt[4]{32 z^{6} y^{3}}}{\\sqrt[4]{2 z^{2} y^{11}}}',
    ascii: '(root(4)(32z^(6)y^(3)))/(root(4)(2z^(2)y^(11)))',
    liner: '(∜(32z^6y^3))/(∜(2z^2y^(11)))',
  }
];
