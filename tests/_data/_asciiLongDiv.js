module.exports = [
  {
    latex: `1 2 \\longdiv { 24 }`,
    ascii:     `1((2)/(24))`,
    ascii_old: `((24)/(12))`
  },
  {
    latex: `1 2 \\longdiv { 24 }56`,
    ascii: `1((2)/(24))56`,
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
    ascii: `12 sin ⁡((14)/(24))`,
    ascii_old: `---`
  }
];
