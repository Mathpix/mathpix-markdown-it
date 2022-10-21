/** Notation for differentiation */
module.exports = [
  {
    latex: `u'  + 4 ( 1 + E) u = 0`,
    ascii: `u^(')+4(1+E)u=0`,
    wolfram: `u' + 4(1 + E)u = 0`
  },   
  {
    latex: `u''  + 4 ( 1 + E) u = 0`,
    ascii: `u^(″)+4(1+E)u=0`,
    wolfram: `u'' + 4(1 + E)u = 0`
  },    
  {
    latex: `u'''  + 4 ( 1 + E) u = 0`,
    ascii: `u^(‴)+4(1+E)u=0`,
    wolfram: `u''' + 4(1 + E)u = 0`
  },    
  {
    latex: `u''''  + 4 ( 1 + E) u = 0`,
    ascii: `u^(⁗)+4(1+E)u=0`,
    wolfram: `u'''' + 4(1 + E)u = 0`
  },   
  {
    latex: `u'''''  + 4 ( 1 + E) u = 0`,
    ascii: `u^(′′′′′)+4(1+E)u=0`,
    wolfram: `u''''' + 4(1 + E)u = 0`
  },   
  {
    latex: `F = \\left( x ^ { \\prime } y ^ { \\prime } + z ^ { \\prime } \\right) ^ { \\prime } + z + x y + wz`,
    ascii: `F=(x^(')y^(')+z^('))^(')+z+xy+wz`,
    wolfram: `F = (x' y' +z')' + z + xy + wz`,
    wolfram_: `F = (x' y' +z')' + z + x y + w z`,
  },   
  {
    latex: `u ^ { \\prime \\prime } + 4 ( 1 + E) u = 0 `,
    ascii: `u^('')+4(1+E)u=0`,
    wolfram: `u'' + 4(1 + E)u = 0`
  },  
  {
    latex: `u ^ { \\prime \\prime \\prime \\prime} + 4 ( 1 + E) u = 0`,
    ascii: `u^('''')+4(1+E)u=0`,
    wolfram: `u'''' + 4(1 + E)u = 0`
  }, 
  /** \dot */
  {
    latex: `\\dot{y}`,
    ascii: `y^(˙)`,
    wolfram: `(d/dt)y`
  },  
  {
    latex: `\\ddot{y}`,
    ascii: `y^(¨)`,
    wolfram: `(d^2/dt^2)y`
  },  
  {
    latex: `\\dddot{y}`,
    wolfram: `(d^3/dt^3)y`
  },    
  {
    latex: `\\ddddot{y}`,
    wolfram: `(d^4/dt^4)y`
  },  
  {
    latex: `\\dot{\\ddot{y}}`,
    ascii: `y^(¨)^(˙)`,
    wolfram: `(d/dt)((d^2/dt^2)y)`
  },  
  {
    latex: `\\ddddot{ y } + 5 \\dddot { y } + 4 \\ddot { y } + \\dot { y } + y = \\dot { u }`,
    wolfram: `(d^4/dt^4)y + 5(d^3/dt^3)y + 4(d^2/dt^2)y + (d/dt)y + y = (d/dt)u`
  },  
  
  {
    latex: `1-\\cos\\dddot{x} = \\sqrt{1-\\sqrt{4\\cos^{2}\\ddot{x}-7\\cos^{4}\\ddddot{x}}}`,
    wolfram: `1 - cos(d^3/dt^3)x = sqrt(1 - sqrt(4cos^2 (d^2/dt^2)x - 7cos^4 (d^4/dt^4)x))`
  },  
  {
    latex: ``,
    ascii: ``,
    wolfram: ``
  },
];
