module.exports = [
  {
    latex: '^{(2)}',
    ascii: '^((2))',
    liner: '^(2)',
  },
  {
    latex: '^{(2+3)}',
    ascii: '^((2+3))',
    liner: '^(2+3)',
  },
  {
    latex: '^{(2+3}',
    ascii: '^((2+3)',
    liner: '^((2+3)',
  },
  {
    latex: '_{(2)}',
    ascii: '_((2))',
    liner: '_(2)',
  },
  {
    latex: '_{(2+3)}',
    ascii: '_((2+3))',
    liner: '_(2+3)',
  },
  {
    latex: '_{(2+3}',
    ascii: '_((2+3)',
    liner: '_((2+3)',
  },
  {
    latex: '4^{(2)}_{(2)}',
    ascii: '4_((2))^((2))',
    liner: '4_(2)^(2)',
  },
  {
    latex: '4^{(2+3)}_{(2+3)}',
    ascii: '4_((2+3))^((2+3))',
    liner: '4_(2+3)^(2+3)',
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
    liner: '(inj lim)_(i=1)^n',
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
    liner: 'T_x(θ_r)=[[1,0,0,0],[0,cos θ_r,sin θ_r,0],[0,−sin θ_r,cos θ_r,0],[0,0,0,1]]',
  },
  {
    latex: '\\xtwoheadrightarrow[du=dx]{u=x+1}',
    ascii: '->>_("du=dx")^("u=x+1")',
    liner: '↠_(du=dx)^(u=x+1)'
  }
]
