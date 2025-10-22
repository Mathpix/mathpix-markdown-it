module.exports = [
  /** Should be vertical math */
  {
    latex: `\\begin{array} { r } 02 \\\\+20 \\\\ \\hline \\end{array}`,
    ascii: `02+20`,
    liner: `02+20`,
  },
  {
    latex: `\\begin{array}{ r } 59 \\\\ - 27 \\\\ \\hline 32 \\end{array}`,
    ascii: `59-27=32`,
    liner: `59−27=32`,
  },
  {
    latex: `\\begin{array} {r} 356 \\\\ + \\quad 299 \\\\ \\hline \\end{array}`,
    ascii: `356+299`,
    liner: `356+299`,
  },
  {
    latex: `\\begin{array} {r}5 x ^ { 2 } - 11 x - 3 \\\\
+ \\quad 7 x ^ { 2 } - 11 x +7 \\\\ \\hline \\end{array}`,
    ascii: `5x^(2)-11 x-3+7x^(2)-11 x+7`,
    liner: `5x²−11 x−3+7x²−11 x+7`,
  },
  {
    latex: `\\begin{array} { r } 2 \\\\ \\times \\quad 42 \\\\ \\hline \\end{array}`,
    ascii: `2xx42`,
    liner: `2×42`,
  },
  {
    latex: `\\begin{array} { r } { 89} \\\\ { \\times 80} \\\\ \\hline \\end{array}`,
    ascii: `89xx80`,
    liner: `89×80`,
  },
  {
    latex: `\\begin{array} { r } {{89}} \\\\ { \\times 80} \\\\ \\hline \\end{array}`,
    ascii: `89xx80`,
    liner: `89×80`,
  },
  {
    latex: `\\begin{array} { r } {{8}{9}} \\\\ { \\times 80} \\\\ \\hline \\end{array} `,
    ascii: `89xx80`,
    liner: `89×80`,
  },
  {
    latex: `\\begin{array} { r } { 0.41 } \\\\ { + \\quad 4.03 } \\\\ \\hline \\end{array} `,
    ascii: `0.41+4.03`,
    liner: `0.41+4.03`,
  },
  {
    latex: `\\begin{array} { r } { 7.45 } \\\\ { + \\quad 3.44 } \\\\ \\hline \\end{array}`,
    ascii: `7.45+3.44`,
    liner: `7.45+3.44`,
  },
  {
    latex: `\\left.\\begin{array} {r} \\frac { 1} { 4} \\\\ + \\frac { 5} { 8} \\\\ \\hline \\end{array} \\right. `,
    ascii: `(1)/(4)+(5)/(8)`,
    liner: `1/4+5/8`,
  },
  {
    latex: `\\left. \\begin{array} { r } { 43 } \\\\ { \\times \\quad 3 } \\end{array} \\right. `,
    ascii: `43xx3`,
    liner: `43×3`,
  },
  {
    latex: `\\begin{array} { r } ( 40 \\times \\frac { 5 } { 18 } ) ^ { 2 } + 2 \\times ( - f \\times 9.81 ) \\\\ \\times 12.2 \\end{array} `,
    ascii: `(40 xx(5)/(18))^(2)+2xx(-f xx9.81)xx12.2`,
    liner: `(40 ×5/(18))²+2×(−f×9.81)×12.2`,
  },
  {
    latex: `\\begin{array} { r } 208,756 \\\\ + \\quad 91,300 \\end{array}`,
    ascii: `208,756+91,300`,
    liner: `208,756+91,300`,
  },
  {
    latex: `\\begin{array}{r}
\\left. \\begin{array} { r } { 3 . 7 5 } \\\\ { \\times 6 . 2 5 } \\\\ \\hline 1 8 7 5\\end{array}\\right.\\\\ 
\\left. \\begin{array} { r } { 7500 } \\\\ { + 225000 } \\\\ \\hline 23.43 7 5\\end{array}\\right. 
\\end{array}`,
    ascii: `{:[3.75xx6.25=1875],[7500+225000=23.4375]:}`,
    liner: `3.75×6.25=1875\n7500+225000=23.4375`,
  },
  {
    latex: `\\begin{array} { r } 3 \\frac { 1 } { 6 } \\\\ + 2 \\frac { 1 } { 3 } \\\\ \\hline \\end{array}`,
    ascii: `3(1)/(6)+2(1)/(3)`,
    liner: `3(1/6)+2(1/3)`,
  },
  {
    latex: `\\begin{array} { r } 4 \\mathrm {~L} 800 \\mathrm {~mL} \\\\ + 4 \\mathrm {~L} 300 \\mathrm {~mL}\\\\\\hline \\end{array}`,
    ascii: `4L800mL+4L300mL`,
    liner: `4L800mL+4L300mL`,
  },
  {
    latex: `\\begin{array} { r } 100000 \\\\ {\\times} 100000 \\\\ \\hline \\end{array} `,
    ascii: `100000xx100000`,
    liner: `100000×100000`,
  },
  {
    latex: `\\begin{array} { r } 100000 \\\\ {\\times 1} 100000 \\\\ \\hline \\end{array}`,
    ascii: `100000xx1100000`,
    liner: `100000×1100000`,
  },
  {
    latex: `u _ { B } \\left( c _ { k } \\right) = \\sqrt {\\begin{array}{r} \\left( \\frac { \\partial c _ { k } } { \\partial c _ { w \\mathrm{H}_{2}\\mathrm{O}} } \\right) ^ { 2 } u _ { B } ^ { 2 } \\left( c _ { w \\mathrm{H}_{2}\\mathrm{O}} \\right) + \\left( \\frac { \\partial c _ { k } } { \\partial m _ { 1\\mathrm{H}_{2}\\mathrm{O}} } \\right) ^ { 2 } u _ { B } ^ { 2 } \\left( m _ { 1 \\mathrm{H}_{2}\\mathrm{O}}\\right) + \\left( \\frac { \\partial c _ { k } } { \\partial m _ { 2 \\mathrm{H}_{2}\\mathrm{O} } } \\right) ^ { 2 } u _ { B } ^ { 2 } \\left( m _ { 2 \\mathrm{H}_{2}\\mathrm{O}} \\right) \\\\+\\left(\\frac{\\partial c_{k}}{\\partial T_{k}}\\right)^{2}u^{2}_{B}(T_{k})+\\left(\\frac{\\partial c_{k}}{\\partial T_{1\\mathrm{H}_{2}\\mathrm{O}}}\\right)^{2}u_{B}^{2}(T_{1\\mathrm{H}_{2}\\mathrm{O}})+\\left(\\frac{\\partial c_{k}}{\\partial T_{2\\mathrm{H}_{2}\\mathrm{O}}}\\right)^{2}u_{B}^{2}(T_{2\\mathrm{H}_{2}\\mathrm{O}})\\end{array}}`,
    ascii: `u_(B)(c_(k))=sqrt(((delc_(k))/(delc_(wH_(2)O)))^(2)u_(B)^(2)(c_(wH_(2)O))+((delc_(k))/(delm_(1H_(2)O)))^(2)u_(B)^(2)(m_(1H_(2)O))+((delc_(k))/(delm_(2H_(2)O)))^(2)u_(B)^(2)(m_(2H_(2)O))+((delc_(k))/(delT_(k)))^(2)u_(B)^(2)(T_(k))+((delc_(k))/(delT_(1H_(2)O)))^(2)u_(B)^(2)(T_(1H_(2)O))+((delc_(k))/(delT_(2H_(2)O)))^(2)u_(B)^(2)(T_(2H_(2)O)))`,
    liner: 'u_B(cₖ)=√(((∂cₖ)/(∂c_(wH₂O)))²u_B²(c_(wH₂O))+((∂cₖ)/(∂m_(1H₂O)))²u_B²(m_(1H₂O))+((∂cₖ)/(∂m_(2H₂O)))²u_B²(m_(2H₂O))+((∂cₖ)/(∂Tₖ))²u_B²(Tₖ)+((∂cₖ)/(∂T_(1H₂O)))²u_B²(T_(1H₂O))+((∂cₖ)/(∂T_(2H₂O)))²u_B²(T_(2H₂O)))',
  },
  {
    latex: `\\begin{array}{r}
4241 \\\\
2067 \\\\
763 \\\\
+\\quad 1529 \\\\
\\hline
\\end{array}`,
    ascii: `4241+2067+763+1529`,
    liner: `4241+2067+763+1529`,
  },
  {
    latex: `\\begin{array} {r}
356 \\\\
123 \\\\
+ \\quad 299 \\\\ \\hline \\end{array}`,
    ascii: `356+123+299`,
    liner: `356+123+299`,
  },
  {
    latex: `\\begin{array} {r}
356 \\\\
- 123 \\\\
+ \\quad 299 \\\\ \\hline \\end{array}`,
    ascii: `356-123+299`,
    liner: `356−123+299`,
  },
  {
    latex: `\\begin{array} { r } 90 \\\\ 80\\\\- \\quad 5 \\\\ \\hline 5 \\end{array}`,
    ascii: `90-80-5=5`,
    liner: `90-80−5=5`,
  },
  {
    latex: `\\begin{array} { r } { 89} \\\\ { \\div 80} \\\\ \\hline \\end{array}`,
    ascii: `89-:80`,
    liner: `89÷80`,
  },
  {
    latex: ``,
    ascii: ``,
    liner: ``,
  },
  /** Can not be vertical math */
  {
    latex: `\\left. \\begin{array} { r } { 4 + 3 = } \\\\ { 4 + - 3 = } \\\\ { - 4 + - 3 = } \\end{array} \\right.`,
    ascii: `{:[4+3=],[4+-3=],[-4+-3=]:}`,
    liner: `4+3=\n4+−3=\n−4+−3=`,
  },
  {
    latex: `\\left.\\begin{array} { r } 4x - y = - 5 \\\\ - 2x + 2y - 3z = 19 \\end{array} \\right.`,
    ascii: `{:[4x-y=-5],[-2x+2y-3z=19]:}`,
    liner: `4x−y=−5\n−2x+2y−3z=19`,
  },
  {
    latex: `\\left. \\begin{array} { r } { + 2 x + 2 y = 8 } \\\\ { 2 x + y = 5 } \\end{array} \\right. `,
    ascii: `{:[+2x+2y=8],[2x+y=5]:}`,
    liner: `+2x+2y=8\n2x+y=5`,
  },
  {
    latex: `\\left(\\begin{array}{c}10 \\\\ 1\\end{array}\\right)`,
    ascii: `([10],[1])`,
    liner: `([10],[1])`,
  },
  {
    latex: `\\left.\\begin{array} { r } { \\mathcal { R } ( \\mathbf { x } ) = \\mathbf { x } } \\\\ { \\frac { d \\mathcal { R } } { d \\mathbf { x } } = - \\mathbf { I } } \\end{array} \\right.`,
    ascii: `{:[R(x)=x],[(dR)/(dx)=-I]:}`,
    liner: `R(x)=x\n(dR)/(dx)=−I`,
  },
  {
    latex: `\\begin{array}{r} 10= 4.50 \\\\ 2= 0.90 \\end{array}`,
    ascii: `{:[10=4.50],[2=0.90]:}`,
    liner: `10=4.50\n2=0.90`,
  },
  {
    latex: `\\left.\\begin{array} { r } { - x - 3y = 6} \\\\ { x + 3y = 6} \\end{array} \\right.`,
    ascii: `{:[-x-3y=6],[x+3y=6]:}`,
    liner: `−x−3y=6\nx+3y=6`,
  },
  {
    latex: `\\begin{array}{r} \\left[ \\begin{array} { ll } - 6 & - 2 \\\\ - 3 & - 4 \\end{array} \\right]^{-1} =\\left[ \\begin{array} { c } - 2 \\\\ 5 \\end{array} \\right] \\\\ (1,-2)\\end{array}`,
    ascii: `{:[[[-6,-2],[-3,-4]]^(-1)=[[-2],[5]]],[(1","-2)]:}`,
    liner: `[[−6,−2],[−3,−4]]⁻¹=[[−2],[5]]\n(1,−2)`,
  },
  {
    latex: `\\begin{array}{r} x + 2 y \\geq 2 \\\\ x - y \\leq 0 \\end{array}`,
    ascii: `{:[x+2y >= 2],[x-y <= 0]:}`,
    liner: `x+2y≥2\nx−y≤0`,
  },
  {
    latex: `\\begin{array}{r} S _ { i } = \\left\\{ b \\in \\{ 0,1 \\} ^ { * } : \\exists \\text { some } c \\in B \\text{ s.t. } cb \\in S_{i-1}\\right\\}\\\\ \\cup \\{b \\in \\{0,1\\}^{*}: \\exists \\text{ some } c \\in S_{i-1} \\text{ s.t. } cb \\in B \\}\\end{array}`,
    ascii: `{:[S_(i)={b in{0,1}^(**):EE" some "c in B" s.t. "cb inS_(i-1)}],[uu{b in{0","1}^(**):EE" some "c inS_(i-1)" s.t. "cb in B}]:}`,
    liner: 'Sᵢ={b∈{0,1}^∗:∃ some c∈B s.t. cb∈Sᵢ₋₁}\n' +
      '∪{b∈{0,1}^∗:∃ some c∈Sᵢ₋₁ s.t. cb∈B}',
  },
  {
    latex: `\\begin{array} { r } \\therefore 2 x < 10 \\\\ \\therefore x < 5 \\end{array}`,
    ascii: `{:[:.2x < 10],[:.x < 5]:}`,
    liner: `∴2x<10\n∴x<5`,
  },
  {
    latex: `\\left.\\begin{array} { r } { \\frac { 6 } { x } + \\frac { 16} { y } = 6} \\\\ { - \\frac { 6} { x } - \\frac { 4} { y } = - 4} \\\\\\hline\\end{array} \\right. `,
    ascii: `{:[(6)/(x)+(16 )/(y)=6],[-(6)/(x)-(4)/(y)=-4]:}`,
    liner: `6/x+(16 )/y=6\n−6/x−4/y=−4`,
  },
  {
    latex: `\\begin{array}{r} 9 \\longdiv { 19 } \\\\18\\\\\\hline1\\end{array}`,
    ascii: `{:[((19)/(9))],[18],[1]:}`,
    liner: `((19)/(9))\n18\n1`,
  },
  {
    latex: `\\left.\\begin{array} { r } 4x - y > - 5 \\\\ - 2x + 2y - 3z < 19 \\end{array} \\right.`,
    ascii: `{:[4x-y > -5],[-2x+2y-3z < 19]:}`,
    liner: `4x−y>−5\n−2x+2y−3z<19`,
  },
  {
    latex: `\\begin{array}{r}-11.644\\\\(2.807)\\end{array}`,
    ascii: `{:[-11.644],[(2.807)]:}`,
    liner: `−11.644\n(2.807)`,
  },
  {
    latex: `\\begin{array}{r}y _ { i } \\geqslant \\theta \\\\ -y _ { i } \\leqslant 0\\\\\\in R \\end{array}`,
    ascii: `{:[y_(i) >= theta],[-y_(i) <= 0],[in R]:}`,
    liner: `yᵢ⩾θ\n−yᵢ⩽0\n∈R`,
  },
  {
    latex: ``,
    ascii: ``,
    liner: ``,
  },
  /** quad */
  {
    latex: `\\begin{array}{r} 3 \\lcm{657 \\quad 1314} \\\\ \\square \\lcm{219 \\quad 438} \\\\ 73 \\lcm{73 \\quad 146} \\\\\\square \\quad \\square \\end{array}`,
    ascii: `{:[((3)/(657quad1314))],[((◻)/(219quad438))],[((73)/(73quad146))],[◻quad◻]:}`,
    liner: `((3)/(657 1314))\n((◻)/(219 438))\n((73)/(73 146))\n◻ ◻`,
  },
  {
    latex: ``,
    ascii: ``,
    liner: ``,
  },
  {
    latex: ``,
    ascii: ``,
    liner: ``,
  },
];
