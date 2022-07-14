module.exports = [
  {
    latex: `1 2 \\longdiv { 24 }`,
    ascii:     `((24)/(12))`,
    ascii_old: `((24)/(12))`
  },
  {
    latex: `1 2 \\longdiv { 24 }56`,
    ascii: `((24)/(12))56`,
    ascii_old: `---`
  },
  {
    latex: `4 \\enclose{longdiv}{500}`,
    ascii: `((500)/(4))`,
    ascii_old: `---`
  },
  {
    latex: `2\\enclose{longdiv,}{12}{6}`,
    ascii: `((12)/(2))6`,
    ascii_old: `---`
  },
  {
    latex: `\\longdiv{52}`,
    ascii: `((52)/())`,
    ascii_old: `---`
  },
  {
    latex: `12 \\sin{14} \\longdiv { 24 }`,
    ascii: `((24)/(12 sin 14))`,
    ascii_old: `---`
  },
  {
    latex: `37\\longdiv { 5}`,
    ascii: `((5)/(37))`
  },
  {
    latex: `0.05\\longdiv { 341.5}`,
    ascii: `((341.5)/(0.05))`
  },
  {
    latex: `6 \\longdiv { 84 }`,
    ascii: `((84)/(6))`
  },
  {
    latex: `2 x + 3 \\longdiv { 8 x ^ { 3 } - 4 x + 3 9 }`,
    ascii: `((8x^(3)-4x+39)/(2x+3))`
  },
  {
    latex: `3 \\longdiv { 3 4 5 }`,
    ascii: `((345)/(3))`
  },
  {
    latex: `5 \\longdiv { 90 }`,
    ascii: `((90)/(5))`
  },
  {
    latex: `x + 2\\longdiv { 2x ^ { 3} - x - 11}`,
    ascii: `((2x^(3)-x-11)/(x+2))`
  },
  {
    latex: `3 \\longdiv { 6 3 }`,
    ascii: `((63)/(3))`
  },
  {
    latex: `2 4 \\longdiv { 3 0 }`,
    ascii: `((30)/(24))`
  },
  {
    latex: `11 \\longdiv{11.111}`,
    ascii: `((11.111)/(11))`
  },
  {
    latex: `2 \\longdiv { 1 2 0 }`,
    ascii: `((120)/(2))`
  },
  {
    latex: `4 \\longdiv { 5 6 }`,
    ascii: `((56)/(4))`
  },
  {
    latex: `2 1 \\longdiv { 2 0 5 }`,
    ascii: `((205)/(21))`
  },
  {
    latex: `4 \\longdiv { 43 }`,
    ascii: `((43)/(4))`
  },
  {
    latex: `3 4 \\longdiv { 3 3 1 }`,
    ascii: `((331)/(34))`
  },
  {
    latex: `5 6 \\longdiv {3 0 0 0 0}`,
    ascii: `((30000)/(56))`
  },
  {
    latex: `2 \\longdiv { 4 4 6 }`,
    ascii: `((446)/(2))`
  },
  {
    latex: `6 \\longdiv { 6 7 2 }`,
    ascii: `((672)/(6))`
  },
  {
    latex: `9 \\longdiv { 9 9 }`,
    ascii: `((99)/(9))`
  },
  {
    latex: `2 8 \\longdiv { 3 4 6 }`,
    ascii: `((346)/(28))`
  },
  {
    latex: `x ^ { 2} + x -1 \\longdiv { x ^ { 5} + x ^ { 4} - 2x ^ { 3} + 0+ x + 1 }`,
    ascii: `((x^(5)+x^(4)-2x^(3)+0+x+1)/(x^(2)+x-1))`
  },
  {
    latex: `3x + 2\\longdiv { 6x ^ { 2} - 5x + 4}`,
    ascii: `((6x^(2)-5x+4)/(3x+2))`
  },
  {
    latex: `4 1 \\longdiv { 2 3 0 }`,
    ascii: `((230)/(41))`
  },
  {
    latex: `12\\longdiv { 144}`,
    ascii: `((144)/(12))`
  },
  {
    latex: `x - \\frac { 3 } { 4 } \\longdiv { 8 x ^ { 3 } - 18 x ^ { 2 } - 11 x + 15 }`,
    ascii: `((8x^(3)-18x^(2)-11 x+15)/(x-(3)/(4)))`
  },
  {
    latex: `x ^ { 2 } + 1 4 x + 4 9 g + {x ^ { 2 } + 1 4 x + 4 9 \\longdiv { x ^ { 2 } + 1 4 x }}`,
    ascii: `x^(2)+14x+49g+((x^(2)+14x)/(x^(2)+14x+49))`
  },
  {
    latex: `g + {x ^ { 2 } + 1 4 x + 4 9 \\longdiv { x ^ { 2 } + 1 4 x }}`,
    ascii: `g+((x^(2)+14x)/(x^(2)+14x+49))`
  }
];
