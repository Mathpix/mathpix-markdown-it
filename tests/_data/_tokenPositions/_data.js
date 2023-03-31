module.exports = [
  {
    mmd: '# Hello, world!\n\nThis is some **bold** and _italic_ text.',
    tokens: [
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 15
        },
        "content_test_str": "# Hello, world!"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "Hello, world!",
            "positions": {
              "start": 2,
              "end": 15
            },
            "content_test_str": "Hello, world!"
          }
        ],
        "content": "Hello, world!",
        "positions": {
          "start": 2,
          "end": 15
        },
        "content_test_str": "Hello, world!"
      },
      {
        "type": "heading_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 17,
          "end": 57
        },
        "content_test_str": "This is some **bold** and _italic_ text."
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "This is some ",
            "positions": {
              "start": 17,
              "end": 30
            },
            "content_test_str": "This is some "
          },
          {
            "type": "strong_open",
            "children": null,
            "content": "",
            "positions": {
              "start": 30,
              "end": 32
            },
            "content_test_str": "**"
          },
          {
            "type": "text",
            "children": null,
            "content": "bold",
            "positions": {
              "start": 32,
              "end": 36
            },
            "content_test_str": "bold"
          },
          {
            "type": "strong_close",
            "children": null,
            "content": "",
            "positions": {
              "start": 36,
              "end": 38
            },
            "content_test_str": "**"
          },
          {
            "type": "text",
            "children": null,
            "content": " and ",
            "positions": {
              "start": 38,
              "end": 43
            },
            "content_test_str": " and "
          },
          {
            "type": "em_open",
            "children": null,
            "content": "",
            "positions": {
              "start": 43,
              "end": 44
            },
            "content_test_str": "_"
          },
          {
            "type": "text",
            "children": null,
            "content": "italic",
            "positions": {
              "start": 44,
              "end": 50
            },
            "content_test_str": "italic"
          },
          {
            "type": "em_close",
            "children": null,
            "content": "",
            "positions": {
              "start": 50,
              "end": 51
            },
            "content_test_str": "_"
          },
          {
            "type": "text",
            "children": null,
            "content": " text.",
            "positions": {
              "start": 51,
              "end": 57
            },
            "content_test_str": " text."
          }
        ],
        "content": "This is some **bold** and _italic_ text.",
        "positions": {
          "start": 17,
          "end": 57
        },
        "content_test_str": "This is some **bold** and _italic_ text."
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      }
    ]
  },
  {
    mmd: `\\title{Title 
with 
line 
break}


\\title{Title \\\\ can be 
\\\\ multiline}

\\title{ Title 
with 
math $x^y$
break }
`,
    tokens: [
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 32
        },
        "content_test_str": "\\title{Title \nwith \nline \nbreak}"
      },
      {
        "type": "title",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "Title  with  line  break",
            "positions": {
              "start": 7,
              "end": 31
            },
            "content_test_str": "Title \nwith \nline \nbreak"
          }
        ],
        "content": "Title  with  line  break",
        "positions": {
          "start": 0,
          "end": 32,
          "start_content": 7,
          "end_content": 31
        },
        "content_test": "Title \nwith \nline \nbreak",
        "content_test_str": "\\title{Title \nwith \nline \nbreak}"
      },
      {
        "type": "heading_close",
        "children": null,
        "content": ""
      },
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 35,
          "end": 72
        },
        "content_test_str": "\\title{Title \\\\ can be \n\\\\ multiline}"
      },
      {
        "type": "title",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "Title ",
            "positions": {
              "start": 42,
              "end": 48
            },
            "content_test_str": "Title "
          },
          {
            "type": "softbreak",
            "children": null,
            "content": "",
            "inlinePos": {
              "start": 6,
              "end": 7
            },
            "positions": {
              "start": 48,
              "end": 50
            },
            "content_test_str": "\\\\"
          },
          {
            "type": "text",
            "children": null,
            "content": " can be  ",
            "positions": {
              "start": 50,
              "end": 59
            },
            "content_test_str": " can be \n"
          },
          {
            "type": "softbreak",
            "children": null,
            "content": "",
            "inlinePos": {
              "start": 17,
              "end": 18
            },
            "positions": {
              "start": 59,
              "end": 61
            },
            "content_test_str": "\\\\"
          },
          {
            "type": "text",
            "children": null,
            "content": " multiline",
            "positions": {
              "start": 61,
              "end": 71
            },
            "content_test_str": " multiline"
          }
        ],
        "content": "Title \\\\ can be  \\\\ multiline",
        "positions": {
          "start": 35,
          "end": 72,
          "start_content": 42,
          "end_content": 71
        },
        "content_test": "Title \\\\ can be \n\\\\ multiline",
        "content_test_str": "\\title{Title \\\\ can be \n\\\\ multiline}"
      },
      {
        "type": "heading_close",
        "children": null,
        "content": ""
      },
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 74,
          "end": 113
        },
        "content_test_str": "\\title{ Title \nwith \nmath $x^y$\nbreak }"
      },
      {
        "type": "title",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": " Title  with  math ",
            "positions": {
              "start": 81,
              "end": 100
            },
            "content_test_str": " Title \nwith \nmath "
          },
          {
            "type": "inline_math",
            "children": null,
            "content": "x^y",
            "math_env": "",
            "inlinePos": {
              "start": 19,
              "end": 24
            },
            "canonicalized": [
              "x",
              "^",
              "y"
            ],
            "labels": {},
            "idLabels": "",
            "number": 0,
            "begin_number": 1,
            "attrNumber": "0",
            "positions": {
              "start": 100,
              "end": 105
            },
            "content_test_str": "$x^y$"
          },
          {
            "type": "text",
            "children": null,
            "content": " break ",
            "positions": {
              "start": 105,
              "end": 112
            },
            "content_test_str": "\nbreak "
          }
        ],
        "content": " Title  with  math $x^y$ break ",
        "positions": {
          "start": 74,
          "end": 113,
          "start_content": 81,
          "end_content": 112
        },
        "content_test": " Title \nwith \nmath $x^y$\nbreak ",
        "content_test_str": "\\title{ Title \nwith \nmath $x^y$\nbreak }"
      },
      {
        "type": "heading_close",
        "children": null,
        "content": ""
      }
    ]
  },
  {
    mmd: '## Using Math mode LaTeX in Snip\n' +
      '\n' +
      'You can insert inline mathematics using LaTeX delimiters `$...$` or `\\(...\\)` like this $\\vec { F } = m \\vec { a }$ and this \\(ax^2 + bx + c = 0\\).\n' +
      '\n' +
      'You can insert non-numbered block mode mathematics by using the LaTeX delimiters `$$...$$`, `\\[...\\]`, `\\begin{equation*}...\\end{equation*}`, and `\\begin{align*}...\\end{align*}`:\n' +
      '\n' +
      '$$\n' +
      'x = \\frac { - b \\pm \\sqrt { b ^ { 2 } - 4 a c } } { 2 a }\n' +
      '$$\n' +
      '\n' +
      '\\[\n' +
      'y = \\frac { \\sum _ { i } w _ { i } y _ { i } } { \\sum _ { i } w _ { i } } , i = 1,2 \\ldots k\n' +
      '\\]\n' +
      '\n' +
      '\\begin{equation*}\n' +
      'l ( \\theta ) = \\sum _ { i = 1 } ^ { m } \\log p ( x , \\theta )\n' +
      '\\end{equation*}\n' +
      '\n' +
      '\\begin{align*}\n' +
      't _ { 1 } + t _ { 2 } = \\frac { ( 2 L / c ) \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } } { 1 - u ^ { 2 } / c ^ { 2 } } = \\frac { 2 L / c } { \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } }\n' +
      '\\end{align*}\n' +
      '\n' +
      '\n' +
      'You can insert numbered block mode mathematics by using the LaTeX delimiters `\\begin{equation}...\\end{equation}` and `\\begin{align}...\\end{align}`:\n' +
      '\n' +
      '\\begin{equation}\n' +
      'm = \\frac { m _ { 0 } } { \\sqrt { 1 - v ^ { 2 } / c ^ { 2 } } }\n' +
      '\\end{equation}\n' +
      '\n' +
      '\\begin{align}\n' +
      '^{|\\alpha|} \\sqrt{x^{\\alpha}} \\leq(x \\bullet \\alpha) /|\\alpha|\n' +
      '\\end{align}',
    tokens: [
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 32
        },
        "content_test_str": "## Using Math mode LaTeX in Snip"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "Using Math mode LaTeX in Snip",
            "positions": {
              "start": 3,
              "end": 32
            },
            "content_test_str": "Using Math mode LaTeX in Snip"
          }
        ],
        "content": "Using Math mode LaTeX in Snip",
        "positions": {
          "start": 3,
          "end": 32
        },
        "content_test_str": "Using Math mode LaTeX in Snip"
      },
      {
        "type": "heading_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 34,
          "end": 181
        },
        "content_test_str": "You can insert inline mathematics using LaTeX delimiters `$...$` or `\\(...\\)` like this $\\vec { F } = m \\vec { a }$ and this \\(ax^2 + bx + c = 0\\)."
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "You can insert inline mathematics using LaTeX delimiters ",
            "positions": {
              "start": 34,
              "end": 91
            },
            "content_test_str": "You can insert inline mathematics using LaTeX delimiters "
          },
          {
            "type": "code_inline",
            "children": null,
            "content": "$...$",
            "positions": {
              "start": 92,
              "end": 97
            },
            "content_test_str": "$...$"
          },
          {
            "type": "text",
            "children": null,
            "content": " or ",
            "positions": {
              "start": 98,
              "end": 102
            },
            "content_test_str": " or "
          },
          {
            "type": "code_inline",
            "children": null,
            "content": "\\(...\\)",
            "positions": {
              "start": 103,
              "end": 110
            },
            "content_test_str": "\\(...\\)"
          },
          {
            "type": "text",
            "children": null,
            "content": " like this ",
            "positions": {
              "start": 111,
              "end": 122
            },
            "content_test_str": " like this "
          },
          {
            "type": "inline_math",
            "children": null,
            "content": "\\vec { F } = m \\vec { a }",
            "math_env": "",
            "inlinePos": {
              "start": 88,
              "end": 115
            },
            "canonicalized": [
              "\\vec",
              "{",
              "F",
              "}",
              "=",
              "m",
              "\\vec",
              "{",
              "a",
              "}"
            ],
            "labels": {},
            "idLabels": "",
            "number": 0,
            "begin_number": 1,
            "attrNumber": "0",
            "positions": {
              "start": 122,
              "end": 149
            },
            "content_test_str": "$\\vec { F } = m \\vec { a }$"
          },
          {
            "type": "text",
            "children": null,
            "content": " and this ",
            "positions": {
              "start": 149,
              "end": 159
            },
            "content_test_str": " and this "
          },
          {
            "type": "inline_math",
            "children": null,
            "content": "ax^2 + bx + c = 0",
            "math_env": "",
            "inlinePos": {
              "start": 125,
              "end": 146
            },
            "canonicalized": [
              "ax",
              "^",
              "2",
              "+",
              "bx",
              "+",
              "c",
              "=",
              "0"
            ],
            "labels": {},
            "idLabels": "",
            "number": 0,
            "begin_number": 1,
            "attrNumber": "0",
            "positions": {
              "start": 159,
              "end": 180
            },
            "content_test_str": "\\(ax^2 + bx + c = 0\\)"
          },
          {
            "type": "text",
            "children": null,
            "content": ".",
            "positions": {
              "start": 180,
              "end": 181
            },
            "content_test_str": "."
          }
        ],
        "content": "You can insert inline mathematics using LaTeX delimiters `$...$` or `\\(...\\)` like this $\\vec { F } = m \\vec { a }$ and this \\(ax^2 + bx + c = 0\\).",
        "positions": {
          "start": 34,
          "end": 181
        },
        "content_test_str": "You can insert inline mathematics using LaTeX delimiters `$...$` or `\\(...\\)` like this $\\vec { F } = m \\vec { a }$ and this \\(ax^2 + bx + c = 0\\)."
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 183,
          "end": 361
        },
        "content_test_str": "You can insert non-numbered block mode mathematics by using the LaTeX delimiters `$$...$$`, `\\[...\\]`, `\\begin{equation*}...\\end{equation*}`, and `\\begin{align*}...\\end{align*}`:"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "You can insert non-numbered block mode mathematics by using the LaTeX delimiters ",
            "positions": {
              "start": 183,
              "end": 264
            },
            "content_test_str": "You can insert non-numbered block mode mathematics by using the LaTeX delimiters "
          },
          {
            "type": "code_inline",
            "children": null,
            "content": "$$...$$",
            "positions": {
              "start": 265,
              "end": 272
            },
            "content_test_str": "$$...$$"
          },
          {
            "type": "text",
            "children": null,
            "content": ", ",
            "positions": {
              "start": 273,
              "end": 275
            },
            "content_test_str": ", "
          },
          {
            "type": "code_inline",
            "children": null,
            "content": "\\[...\\]",
            "positions": {
              "start": 276,
              "end": 283
            },
            "content_test_str": "\\[...\\]"
          },
          {
            "type": "text",
            "children": null,
            "content": ", ",
            "positions": {
              "start": 284,
              "end": 286
            },
            "content_test_str": ", "
          },
          {
            "type": "code_inline",
            "children": null,
            "content": "\\begin{equation*}...\\end{equation*}",
            "positions": {
              "start": 287,
              "end": 322
            },
            "content_test_str": "\\begin{equation*}...\\end{equation*}"
          },
          {
            "type": "text",
            "children": null,
            "content": ", and ",
            "positions": {
              "start": 323,
              "end": 329
            },
            "content_test_str": ", and "
          },
          {
            "type": "code_inline",
            "children": null,
            "content": "\\begin{align*}...\\end{align*}",
            "positions": {
              "start": 330,
              "end": 359
            },
            "content_test_str": "\\begin{align*}...\\end{align*}"
          },
          {
            "type": "text",
            "children": null,
            "content": ":",
            "positions": {
              "start": 360,
              "end": 361
            },
            "content_test_str": ":"
          }
        ],
        "content": "You can insert non-numbered block mode mathematics by using the LaTeX delimiters `$$...$$`, `\\[...\\]`, `\\begin{equation*}...\\end{equation*}`, and `\\begin{align*}...\\end{align*}`:",
        "positions": {
          "start": 183,
          "end": 361
        },
        "content_test_str": "You can insert non-numbered block mode mathematics by using the LaTeX delimiters `$$...$$`, `\\[...\\]`, `\\begin{equation*}...\\end{equation*}`, and `\\begin{align*}...\\end{align*}`:"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 363,
          "end": 426
        },
        "content_test_str": "$$\nx = \\frac { - b \\pm \\sqrt { b ^ { 2 } - 4 a c } } { 2 a }\n$$"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "display_math",
            "children": null,
            "content": "\nx = \\frac { - b \\pm \\sqrt { b ^ { 2 } - 4 a c } } { 2 a }\n",
            "math_env": "",
            "inlinePos": {
              "start": 0,
              "end": 63
            },
            "canonicalized": [
              "x",
              "=",
              "\\frac",
              "{",
              "-",
              "b",
              "\\pm",
              "\\sqrt",
              "{",
              "b",
              "^",
              "{",
              "2",
              "}",
              "-",
              "4",
              "a",
              "c",
              "}",
              "}",
              "{",
              "2",
              "a",
              "}",
              ""
            ],
            "labels": {},
            "idLabels": "",
            "number": 0,
            "begin_number": 1,
            "attrNumber": "0",
            "positions": {
              "start": 363,
              "end": 426
            },
            "content_test_str": "$$\nx = \\frac { - b \\pm \\sqrt { b ^ { 2 } - 4 a c } } { 2 a }\n$$"
          }
        ],
        "content": "$$\nx = \\frac { - b \\pm \\sqrt { b ^ { 2 } - 4 a c } } { 2 a }\n$$",
        "positions": {
          "start": 363,
          "end": 426
        },
        "content_test_str": "$$\nx = \\frac { - b \\pm \\sqrt { b ^ { 2 } - 4 a c } } { 2 a }\n$$"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 428,
          "end": 526
        },
        "content_test_str": "\\[\ny = \\frac { \\sum _ { i } w _ { i } y _ { i } } { \\sum _ { i } w _ { i } } , i = 1,2 \\ldots k\n\\]"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "display_math",
            "children": null,
            "content": "\ny = \\frac { \\sum _ { i } w _ { i } y _ { i } } { \\sum _ { i } w _ { i } } , i = 1,2 \\ldots k\n",
            "math_env": "",
            "inlinePos": {
              "start": 0,
              "end": 98
            },
            "canonicalized": [
              "y",
              "=",
              "\\frac",
              "{",
              "\\sum",
              "_",
              "{",
              "i",
              "}",
              "w",
              "_",
              "{",
              "i",
              "}",
              "y",
              "_",
              "{",
              "i",
              "}",
              "}",
              "{",
              "\\sum",
              "_",
              "{",
              "i",
              "}",
              "w",
              "_",
              "{",
              "i",
              "}",
              "}",
              ",",
              "i",
              "=",
              "1,2",
              "\\ldots",
              "k",
              ""
            ],
            "labels": {},
            "idLabels": "",
            "number": 0,
            "begin_number": 1,
            "attrNumber": "0",
            "positions": {
              "start": 428,
              "end": 526
            },
            "content_test_str": "\\[\ny = \\frac { \\sum _ { i } w _ { i } y _ { i } } { \\sum _ { i } w _ { i } } , i = 1,2 \\ldots k\n\\]"
          }
        ],
        "content": "\\[\ny = \\frac { \\sum _ { i } w _ { i } y _ { i } } { \\sum _ { i } w _ { i } } , i = 1,2 \\ldots k\n\\]",
        "positions": {
          "start": 428,
          "end": 526
        },
        "content_test_str": "\\[\ny = \\frac { \\sum _ { i } w _ { i } y _ { i } } { \\sum _ { i } w _ { i } } , i = 1,2 \\ldots k\n\\]"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 528,
          "end": 623
        },
        "content_test_str": "\\begin{equation*}\nl ( \\theta ) = \\sum _ { i = 1 } ^ { m } \\log p ( x , \\theta )\n\\end{equation*}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "equation_math_not_number",
            "children": null,
            "content": "\\begin{equation*}\nl ( \\theta ) = \\sum _ { i = 1 } ^ { m } \\log p ( x , \\theta )\n\\end{equation*}",
            "math_env": "equation*",
            "inlinePos": {
              "start": 0,
              "end": 95
            },
            "canonicalized": [
              "\\begin",
              "{",
              "equation",
              "*",
              "}",
              "l",
              "(",
              "\\theta",
              ")",
              "=",
              "\\sum",
              "_",
              "{",
              "i",
              "=",
              "1",
              "}",
              "^",
              "{",
              "m",
              "}",
              "\\log",
              "p",
              "(",
              "x",
              ",",
              "\\theta",
              ")",
              "\\end",
              "{",
              "equation",
              "*",
              "}"
            ],
            "labels": {},
            "idLabels": "",
            "number": 0,
            "begin_number": 1,
            "attrNumber": "0",
            "positions": {
              "start": 528,
              "end": 623
            },
            "content_test_str": "\\begin{equation*}\nl ( \\theta ) = \\sum _ { i = 1 } ^ { m } \\log p ( x , \\theta )\n\\end{equation*}"
          }
        ],
        "content": "\\begin{equation*}\nl ( \\theta ) = \\sum _ { i = 1 } ^ { m } \\log p ( x , \\theta )\n\\end{equation*}",
        "positions": {
          "start": 528,
          "end": 623
        },
        "content_test_str": "\\begin{equation*}\nl ( \\theta ) = \\sum _ { i = 1 } ^ { m } \\log p ( x , \\theta )\n\\end{equation*}"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 625,
          "end": 824
        },
        "content_test_str": "\\begin{align*}\nt _ { 1 } + t _ { 2 } = \\frac { ( 2 L / c ) \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } } { 1 - u ^ { 2 } / c ^ { 2 } } = \\frac { 2 L / c } { \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } }\n\\end{align*}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "equation_math_not_number",
            "children": null,
            "content": "\\begin{align*}\nt _ { 1 } + t _ { 2 } = \\frac { ( 2 L / c ) \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } } { 1 - u ^ { 2 } / c ^ { 2 } } = \\frac { 2 L / c } { \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } }\n\\end{align*}",
            "math_env": "align*",
            "inlinePos": {
              "start": 0,
              "end": 199
            },
            "canonicalized": [
              "\\begin",
              "{",
              "align",
              "*",
              "}",
              "t",
              "_",
              "{",
              "1",
              "}",
              "+",
              "t",
              "_",
              "{",
              "2",
              "}",
              "=",
              "\\frac",
              "{",
              "(",
              "2",
              "L",
              "/",
              "c",
              ")",
              "\\sqrt",
              "{",
              "1",
              "-",
              "u",
              "^",
              "{",
              "2",
              "}",
              "/",
              "c",
              "^",
              "{",
              "2",
              "}",
              "}",
              "}",
              "{",
              "1",
              "-",
              "u",
              "^",
              "{",
              "2",
              "}",
              "/",
              "c",
              "^",
              "{",
              "2",
              "}",
              "}",
              "=",
              "\\frac",
              "{",
              "2",
              "L",
              "/",
              "c",
              "}",
              "{",
              "\\sqrt",
              "{",
              "1",
              "-",
              "u",
              "^",
              "{",
              "2",
              "}",
              "/",
              "c",
              "^",
              "{",
              "2",
              "}",
              "}",
              "}",
              "\\end",
              "{",
              "align",
              "*",
              "}"
            ],
            "labels": {},
            "idLabels": "",
            "number": 0,
            "begin_number": 1,
            "attrNumber": "0",
            "positions": {
              "start": 625,
              "end": 824
            },
            "content_test_str": "\\begin{align*}\nt _ { 1 } + t _ { 2 } = \\frac { ( 2 L / c ) \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } } { 1 - u ^ { 2 } / c ^ { 2 } } = \\frac { 2 L / c } { \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } }\n\\end{align*}"
          }
        ],
        "content": "\\begin{align*}\nt _ { 1 } + t _ { 2 } = \\frac { ( 2 L / c ) \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } } { 1 - u ^ { 2 } / c ^ { 2 } } = \\frac { 2 L / c } { \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } }\n\\end{align*}",
        "positions": {
          "start": 625,
          "end": 824
        },
        "content_test_str": "\\begin{align*}\nt _ { 1 } + t _ { 2 } = \\frac { ( 2 L / c ) \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } } { 1 - u ^ { 2 } / c ^ { 2 } } = \\frac { 2 L / c } { \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } }\n\\end{align*}"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 827,
          "end": 974
        },
        "content_test_str": "You can insert numbered block mode mathematics by using the LaTeX delimiters `\\begin{equation}...\\end{equation}` and `\\begin{align}...\\end{align}`:"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "You can insert numbered block mode mathematics by using the LaTeX delimiters ",
            "positions": {
              "start": 827,
              "end": 904
            },
            "content_test_str": "You can insert numbered block mode mathematics by using the LaTeX delimiters "
          },
          {
            "type": "code_inline",
            "children": null,
            "content": "\\begin{equation}...\\end{equation}",
            "positions": {
              "start": 905,
              "end": 938
            },
            "content_test_str": "\\begin{equation}...\\end{equation}"
          },
          {
            "type": "text",
            "children": null,
            "content": " and ",
            "positions": {
              "start": 939,
              "end": 944
            },
            "content_test_str": " and "
          },
          {
            "type": "code_inline",
            "children": null,
            "content": "\\begin{align}...\\end{align}",
            "positions": {
              "start": 945,
              "end": 972
            },
            "content_test_str": "\\begin{align}...\\end{align}"
          },
          {
            "type": "text",
            "children": null,
            "content": ":",
            "positions": {
              "start": 973,
              "end": 974
            },
            "content_test_str": ":"
          }
        ],
        "content": "You can insert numbered block mode mathematics by using the LaTeX delimiters `\\begin{equation}...\\end{equation}` and `\\begin{align}...\\end{align}`:",
        "positions": {
          "start": 827,
          "end": 974
        },
        "content_test_str": "You can insert numbered block mode mathematics by using the LaTeX delimiters `\\begin{equation}...\\end{equation}` and `\\begin{align}...\\end{align}`:"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 976,
          "end": 1071
        },
        "content_test_str": "\\begin{equation}\nm = \\frac { m _ { 0 } } { \\sqrt { 1 - v ^ { 2 } / c ^ { 2 } } }\n\\end{equation}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "equation_math",
            "children": null,
            "content": "\\begin{equation}\nm = \\frac { m _ { 0 } } { \\sqrt { 1 - v ^ { 2 } / c ^ { 2 } } }\n\\end{equation}",
            "math_env": "equation",
            "inlinePos": {
              "start": 0,
              "end": 95
            },
            "canonicalized": [
              "\\begin",
              "{",
              "equation",
              "}",
              "m",
              "=",
              "\\frac",
              "{",
              "m",
              "_",
              "{",
              "0",
              "}",
              "}",
              "{",
              "\\sqrt",
              "{",
              "1",
              "-",
              "v",
              "^",
              "{",
              "2",
              "}",
              "/",
              "c",
              "^",
              "{",
              "2",
              "}",
              "}",
              "}",
              "\\end",
              "{",
              "equation",
              "}"
            ],
            "labels": {},
            "idLabels": "",
            "number": 1,
            "begin_number": 1,
            "attrNumber": "1",
            "positions": {
              "start": 976,
              "end": 1071
            },
            "content_test_str": "\\begin{equation}\nm = \\frac { m _ { 0 } } { \\sqrt { 1 - v ^ { 2 } / c ^ { 2 } } }\n\\end{equation}"
          }
        ],
        "content": "\\begin{equation}\nm = \\frac { m _ { 0 } } { \\sqrt { 1 - v ^ { 2 } / c ^ { 2 } } }\n\\end{equation}",
        "positions": {
          "start": 976,
          "end": 1071
        },
        "content_test_str": "\\begin{equation}\nm = \\frac { m _ { 0 } } { \\sqrt { 1 - v ^ { 2 } / c ^ { 2 } } }\n\\end{equation}"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 1073,
          "end": 1161
        },
        "content_test_str": "\\begin{align}\n^{|\\alpha|} \\sqrt{x^{\\alpha}} \\leq(x \\bullet \\alpha) /|\\alpha|\n\\end{align}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "equation_math",
            "children": null,
            "content": "\\begin{align}\n^{|\\alpha|} \\sqrt{x^{\\alpha}} \\leq(x \\bullet \\alpha) /|\\alpha|\n\\end{align}",
            "math_env": "align",
            "inlinePos": {
              "start": 0,
              "end": 88
            },
            "canonicalized": [
              "\\begin",
              "{",
              "align",
              "}",
              "^",
              "{",
              "|",
              "\\alpha",
              "|",
              "}",
              "\\sqrt",
              "{",
              "x",
              "^",
              "{",
              "\\alpha",
              "}",
              "}",
              "\\leq",
              "(",
              "x",
              "\\bullet",
              "\\alpha",
              ")",
              "/",
              "|",
              "\\alpha",
              "|",
              "\\end",
              "{",
              "align",
              "}"
            ],
            "labels": {},
            "idLabels": "",
            "number": 2,
            "begin_number": 2,
            "attrNumber": "2",
            "positions": {
              "start": 1073,
              "end": 1161
            },
            "content_test_str": "\\begin{align}\n^{|\\alpha|} \\sqrt{x^{\\alpha}} \\leq(x \\bullet \\alpha) /|\\alpha|\n\\end{align}"
          }
        ],
        "content": "\\begin{align}\n^{|\\alpha|} \\sqrt{x^{\\alpha}} \\leq(x \\bullet \\alpha) /|\\alpha|\n\\end{align}",
        "positions": {
          "start": 1073,
          "end": 1161
        },
        "content_test_str": "\\begin{align}\n^{|\\alpha|} \\sqrt{x^{\\alpha}} \\leq(x \\bullet \\alpha) /|\\alpha|\n\\end{align}"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      }
    ]
  }
];
