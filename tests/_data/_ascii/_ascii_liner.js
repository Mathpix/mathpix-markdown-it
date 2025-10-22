module.exports = [
  {
    latex: '^{(2)}',
    ascii: '^((2))',
    liner: '⁽²⁾',
  },
  {
    latex: '^{(2+3)}',
    ascii: '^((2+3))',
    liner: '⁽²⁺³⁾',
  },
  {
    latex: '^{(2+3}',
    ascii: '^((2+3)',
    liner: '⁽²⁺³',
  },
  {
    latex: '_{(2)}',
    ascii: '_((2))',
    liner: '₍₂₎',
  },
  {
    latex: '_{(2+3)}',
    ascii: '_((2+3))',
    liner: '₍₂₊₃₎',
  },
  {
    latex: '_{(2+3}',
    ascii: '_((2+3)',
    liner: '₍₂₊₃',
  },
  {
    latex: '4^{(2)}_{(2)}',
    ascii: '4_((2))^((2))',
    liner: '4₍₂₎⁽²⁾',
  },
  {
    latex: '4^{(2+3)}_{(2+3)}',
    ascii: '4_((2+3))^((2+3))',
    liner: '4₍₂₊₃₎⁽²⁺³⁾',
  },
  {
    latex: '\\bigcap_{i=1}^n',
    ascii: 'nnn_(i=1)^(n)',
    liner: '⋂_(i=1)^n',
  },
  {
    latex: '\\inf_{i=1}^n',
    ascii: 'i n f_(i=1)^(n)',
    liner: 'inf_(i=1)^n',
  },
  {
    latex: '\\sup_{i=1}^n',
    ascii: 's u p_(i=1)^(n)',
    liner: 'sup_(i=1)^n',
  },
  {
    latex: '\\injlim_{i=1}^n',
    ascii: 'i n j   l i m_(i=1)^(n)',
    liner: '(inj lim)_(i=1)^n',
  },
  {
    latex: '\\injlim\\nolimits_{i=1}^n',
    ascii: 'inj lim_(i=1)^(n)',
    liner: '(inj lim)ᵢ₌₁ⁿ',
  },
  {
    latex: '\\varinjlim_{i=1}^n',
    ascii: 'lim rarr_(i=1)^(n)',
    liner: 'lim→_(i=1)^n',
  },
  {
    latex: '\\begin{aligned}\n' +
      '2x+3 &= 7 & 2x+3-3 \\\\\n' +
      '2x &= 4 & \\frac{2x}2  \\\\\n' +
      'x &= 2 &\n' +
      '\\end{aligned}',
    ascii: '{:[2x+3=72x+3-3],[2x=4(2x)/(2)],[x=2]:}',
    liner: '2x+3=7 2x+3−3\n2x=4 (2x)/2\nx=2 ',
  },
  {
    latex: 'T_{x}\\left(\\theta_{r}\\right)=\\left[\\begin{array}{cccc}\n' +
      '1 & 0 & 0 & 0 \\\\\n' +
      '0 & \\cos \\theta_{r} & \\sin \\theta_{r} & 0 \\\\\n' +
      '0 & -\\sin \\theta_{r} & \\cos \\theta_{r} & 0 \\\\\n' +
      '0 & 0 & 0 & 1\n' +
      '\\end{array}\\right]',
    ascii: 'T_(x)(theta_(r))=[[1,0,0,0],[0,cos theta_(r),sin theta_(r),0],[0,-sin theta_(r),cos theta_(r),0],[0,0,0,1]]',
    liner: 'Tₓ(θᵣ)=[[1,0,0,0],[0,cos θᵣ,sin θᵣ,0],[0,−sin θᵣ,cos θᵣ,0],[0,0,0,1]]',
  },
  {
    latex: '\\xtwoheadrightarrow[du=dx]{u=x+1}',
    ascii: '->>_("du=dx")^("u=x+1")',
    liner: '↠_(du=dx)^(u=x+1)'
  },
  {
    latex: '\\bar x',
    ascii: 'bar(x)',
    liner: 'x̄'
  },
  {
    latex: '\\bar xy',
    ascii: 'bar(x)y',
    liner: 'x̄y'
  },
  {
    latex: '\\bar{xy}',
    ascii: 'bar(xy)',
    liner: '(xy)¯'
  },
  {
    latex: '\\breve e',
    ascii: 'e^(˘)',
    liner: 'ĕ'
  },
  {
    latex: '62.3^{\\circ}',
    ascii: '62.3^(@)',
    liner: '62.3°'
  },
  {
    latex: '\\theta^{\\prime}',
    ascii: 'theta^(\')',
    liner: 'θ′'
  },
  {
    latex: '\\mathring{A}',
    ascii: 'A^(˚)',
    liner: 'Å'
  },
  {
    latex: '\\overleftrightarrow{AB}',
    ascii: 'AB^(harr)',
    liner: '(AB) ⃡'
  },
  {
    latex: '\\dddot{x}',
    ascii: 'x^(⃛)',
    liner: 'x⃛'
  },
  {
    latex: '{}^{*}',
    ascii: '^(**)',
    liner: '^∗'
  },
  {
    latex: '\\omega^\\star(0)',
    ascii: 'omega^(***)(0)',
    liner: 'ω^⋆(0)'
  },
  {
    latex: '10^6',
    ascii: '10^(6)',
    liner: '10⁶'
  },
  {
    latex: 'x^{(n+1)}',
    ascii: 'x^((n+1))',
    liner: 'x⁽ⁿ⁺¹⁾'
  },
  {
    latex: 'D ^{\\prime \\prime}',
    ascii: 'D^(\'\')',
    liner: 'D′′'
  },
  {
    latex: 'D^{\\prime \\prime \\prime}',
    ascii: 'D^(\'\'\')',
    liner: 'D′′′'
  },
  {
    latex: '\\dot{q}_{c r}^{\\prime \\prime}',
    ascii: 'q^(˙)_(cr)^(\'\')',
    liner: 'q̇_(cr)′′'
  },
  {
    latex: 'P_{\\text {int }}',
    ascii: 'P_("int ")',
    liner: 'Pᵢₙₜ'
  },
  {
    latex: 'x^{-3}',
    ascii: 'x^(-3)',
    liner: 'x⁻³'
  },
  {
    latex: '\\sqrt[n]{abc}',
    ascii: 'root(n)(abc)',
    liner: ' ⁿ√(abc)'
  },
  {
    latex: '\\lim _{x \\rightarrow c}',
    ascii: 'lim_(x rarr c)',
    liner: 'lim_(x→c)'
  },
  {
    latex: '\\lim _{x \\leftarrow c}',
    ascii: 'lim_(x larr c)',
    liner: 'lim_(x←c)'
  },
]
