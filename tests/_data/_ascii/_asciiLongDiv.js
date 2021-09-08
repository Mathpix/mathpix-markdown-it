module.exports = [
  {
    latex: `1 2 \\longdiv { 24 }`,
    ascii:     `((12)/(24))`,
    ascii_old: `((24)/(12))`
  },
  {
    latex: `1 2 \\longdiv { 24 }56`,
    ascii: `((12)/(24))56`,
    ascii_old: `---`
  },
  {
    latex: `4 \\enclose{longdiv}{500}`,
    ascii: `((4)/(500))`,
    ascii_old: `---`
  },
  {
    latex: `2\\enclose{longdiv,}{12}{6}`,
    ascii: `((2)/(12))6`,
    ascii_old: `---`
  },
  {
    latex: `\\longdiv{52}`,
    ascii: `(()/(52))`,
    ascii_old: `---`
  },
  {
    latex: `12 \\sin{14} \\longdiv { 24 }`,
    ascii: `((12 sin 14)/(24))`,
    ascii_old: `---`
  },
  {
    latex: `37\\longdiv { 5}`,
    ascii: `((37)/(5))`
  },
  {
    latex: `0.05\\longdiv { 341.5}`,
    ascii: `((0.05)/(341.5))`
  },
  {
    latex: `6 \\longdiv { 84 }`,
    ascii: `((6)/(84))`
  },
  {
    latex: `2 x + 3 \\longdiv { 8 x ^ { 3 } - 4 x + 3 9 }`,
    ascii: `((2x+3)/(8x^(3)-4x+39))`
  },
  {
    latex: `3 \\longdiv { 3 4 5 }`,
    ascii: `((3)/(345))`
  },
  {
    latex: `5 \\longdiv { 90 }`,
    ascii: `((5)/(90))`
  },
  {
    latex: `x + 2\\longdiv { 2x ^ { 3} - x - 11}`,
    ascii: `((x+2)/(2x^(3)-x-11))`
  },
  {
    latex: `3 \\longdiv { 6 3 }`,
    ascii: `((3)/(63))`
  },
  {
    latex: `2 4 \\longdiv { 3 0 }`,
    ascii: `((24)/(30))`
  },
  {
    latex: `11 \\longdiv{11.111}`,
    ascii: `((11)/(11.111))`
  },
  {
    latex: `2 \\longdiv { 1 2 0 }`,
    ascii: `((2)/(120))`
  },
  {
    latex: `4 \\longdiv { 5 6 }`,
    ascii: `((4)/(56))`
  },
  {
    latex: `2 1 \\longdiv { 2 0 5 }`,
    ascii: `((21)/(205))`
  },
  {
    latex: `4 \\longdiv { 43 }`,
    ascii: `((4)/(43))`
  },
  {
    latex: `3 4 \\longdiv { 3 3 1 }`,
    ascii: `((34)/(331))`
  },
  {
    latex: `5 6 \\longdiv {3 0 0 0 0}`,
    ascii: `((56)/(30000))`
  },
  {
    latex: `2 \\longdiv { 4 4 6 }`,
    ascii: `((2)/(446))`
  },
  {
    latex: `6 \\longdiv { 6 7 2 }`,
    ascii: `((6)/(672))`
  },
  {
    latex: `9 \\longdiv { 9 9 }`,
    ascii: `((9)/(99))`
  },
  {
    latex: `2 8 \\longdiv { 3 4 6 }`,
    ascii: `((28)/(346))`
  },
  {
    latex: `x ^ { 2} + x -1 \\longdiv { x ^ { 5} + x ^ { 4} - 2x ^ { 3} + 0+ x + 1 }`,
    ascii: `((x^(2)+x-1)/(x^(5)+x^(4)-2x^(3)+0+x+1))`
  },
  {
    latex: `3x + 2\\longdiv { 6x ^ { 2} - 5x + 4}`,
    ascii: `((3x+2)/(6x^(2)-5x+4))`
  },
  {
    latex: `4 1 \\longdiv { 2 3 0 }`,
    ascii: `((41)/(230))`
  },
  {
    latex: `12\\longdiv { 144}`,
    ascii: `((12)/(144))`
  },
  {
    latex: `x - \\frac { 3 } { 4 } \\longdiv { 8 x ^ { 3 } - 18 x ^ { 2 } - 11 x + 15 }`,
    ascii: `((x-(3)/(4))/(8x^(3)-18x^(2)-11 x+15))`
  },
  {
    latex: `x ^ { 2 } + 1 4 x + 4 9 g + {x ^ { 2 } + 1 4 x + 4 9 \\longdiv { x ^ { 2 } + 1 4 x }}`,
    ascii: `x^(2)+14x+49g+((x^(2)+14x+49)/(x^(2)+14x))`
  },
  {
    latex: `g + {x ^ { 2 } + 1 4 x + 4 9 \\longdiv { x ^ { 2 } + 1 4 x }}`,
    ascii: `g+((x^(2)+14x+49)/(x^(2)+14x))`
  }
];
