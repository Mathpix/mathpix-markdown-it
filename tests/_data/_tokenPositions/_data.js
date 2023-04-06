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
            "nextPos": 29,
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
            "nextPos": 57,
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
            "nextPos": 64,
            "positions": {
              "start": 91,
              "end": 98
            },
            "content_test_str": "`$...$`"
          },
          {
            "type": "text",
            "children": null,
            "content": " or ",
            "nextPos": 68,
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
            "nextPos": 77,
            "positions": {
              "start": 102,
              "end": 111
            },
            "content_test_str": "`\\(...\\)`"
          },
          {
            "type": "text",
            "children": null,
            "content": " like this ",
            "nextPos": 88,
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
            "nextPos": 115,
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
            "nextPos": 125,
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
            "nextPos": 146,
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
            "nextPos": 147,
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
            "nextPos": 81,
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
            "nextPos": 90,
            "positions": {
              "start": 264,
              "end": 273
            },
            "content_test_str": "`$$...$$`"
          },
          {
            "type": "text",
            "children": null,
            "content": ", ",
            "nextPos": 92,
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
            "nextPos": 101,
            "positions": {
              "start": 275,
              "end": 284
            },
            "content_test_str": "`\\[...\\]`"
          },
          {
            "type": "text",
            "children": null,
            "content": ", ",
            "nextPos": 103,
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
            "nextPos": 140,
            "positions": {
              "start": 286,
              "end": 323
            },
            "content_test_str": "`\\begin{equation*}...\\end{equation*}`"
          },
          {
            "type": "text",
            "children": null,
            "content": ", and ",
            "nextPos": 146,
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
            "nextPos": 177,
            "positions": {
              "start": 329,
              "end": 360
            },
            "content_test_str": "`\\begin{align*}...\\end{align*}`"
          },
          {
            "type": "text",
            "children": null,
            "content": ":",
            "nextPos": 178,
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
            "nextPos": 63,
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
            "nextPos": 98,
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
            "nextPos": 95,
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
            "nextPos": 199,
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
            "nextPos": 77,
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
            "nextPos": 112,
            "positions": {
              "start": 904,
              "end": 939
            },
            "content_test_str": "`\\begin{equation}...\\end{equation}`"
          },
          {
            "type": "text",
            "children": null,
            "content": " and ",
            "nextPos": 117,
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
            "nextPos": 146,
            "positions": {
              "start": 944,
              "end": 973
            },
            "content_test_str": "`\\begin{align}...\\end{align}`"
          },
          {
            "type": "text",
            "children": null,
            "content": ":",
            "nextPos": 147,
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
            "nextPos": 95,
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
            "nextPos": 88,
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
  },
  {
    mmd: '\\title{\n' +
      'XLNet: Generalized Autoregressive Pretraining for Language Understanding\n' +
      '}\n' +
      '\n' +
      '\\author{\n' +
      'Zhilin Yang ${ }^{* 1}$, Zihang Dai ${ }^{* 12}$, Yiming Yang ${ }^{1}$, Jaime Carbonell ${ }^{1}$, \\\\ Ruslan Salakhutdinov ${ }^{1}$, Quoc V. Le $^{2}$ \\\\ ${ }^{1}$ Carnegie Mellon University, ${ }^{2}$ Google Brain \\\\ \\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com\n' +
      '}\n',
    tokens: [
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 82
        },
        "content_test_str": "\\title{\nXLNet: Generalized Autoregressive Pretraining for Language Understanding\n}"
      },
      {
        "type": "title",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "XLNet: Generalized Autoregressive Pretraining for Language Understanding ",
            "nextPos": 73,
            "positions": {
              "start": 8,
              "end": 81
            },
            "content_test_str": "XLNet: Generalized Autoregressive Pretraining for Language Understanding\n"
          }
        ],
        "content": "XLNet: Generalized Autoregressive Pretraining for Language Understanding ",
        "positions": {
          "start": 0,
          "end": 82,
          "start_content": 8,
          "end_content": 81
        },
        "content_test": "XLNet: Generalized Autoregressive Pretraining for Language Understanding\n",
        "content_test_str": "\\title{\nXLNet: Generalized Autoregressive Pretraining for Language Understanding\n}"
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
          "start": 84,
          "end": 385
        },
        "content_test_str": "\\author{\nZhilin Yang ${ }^{* 1}$, Zihang Dai ${ }^{* 12}$, Yiming Yang ${ }^{1}$, Jaime Carbonell ${ }^{1}$, \\\\ Ruslan Salakhutdinov ${ }^{1}$, Quoc V. Le $^{2}$ \\\\ ${ }^{1}$ Carnegie Mellon University, ${ }^{2}$ Google Brain \\\\ \\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com\n}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "author",
            "children": [
              {
                "type": "author_column",
                "content": "Zhilin Yang ${ }^{* 1}$, Zihang Dai ${ }^{* 12}$, Yiming Yang ${ }^{1}$, Jaime Carbonell ${ }^{1}$, \\\\ Ruslan Salakhutdinov ${ }^{1}$, Quoc V. Le $^{2}$ \\\\ ${ }^{1}$ Carnegie Mellon University, ${ }^{2}$ Google Brain \\\\ \\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com",
                "children": [
                  {
                    "type": "author_item",
                    "content": "Zhilin Yang ${ }^{* 1}$, Zihang Dai ${ }^{* 12}$, Yiming Yang ${ }^{1}$, Jaime Carbonell ${ }^{1}$,",
                    "offsetLeft": 1,
                    "nextPos": 103,
                    "children": [
                      {
                        "type": "text",
                        "children": null,
                        "content": "Zhilin Yang ",
                        "nextPos": 12,
                        "positions": {
                          "start": 93,
                          "end": 105
                        },
                        "content_test_str": "Zhilin Yang "
                      },
                      {
                        "type": "inline_math",
                        "children": null,
                        "content": "{ }^{* 1}",
                        "math_env": "",
                        "inlinePos": {
                          "start": 12,
                          "end": 23
                        },
                        "canonicalized": [
                          "{",
                          "}",
                          "^",
                          "{",
                          "*",
                          "1",
                          "}"
                        ],
                        "labels": {},
                        "idLabels": "",
                        "number": 2,
                        "begin_number": 3,
                        "attrNumber": "2",
                        "nextPos": 23,
                        "positions": {
                          "start": 105,
                          "end": 116
                        },
                        "content_test_str": "${ }^{* 1}$"
                      },
                      {
                        "type": "text",
                        "children": null,
                        "content": ", Zihang Dai ",
                        "nextPos": 36,
                        "positions": {
                          "start": 116,
                          "end": 129
                        },
                        "content_test_str": ", Zihang Dai "
                      },
                      {
                        "type": "inline_math",
                        "children": null,
                        "content": "{ }^{* 12}",
                        "math_env": "",
                        "inlinePos": {
                          "start": 36,
                          "end": 48
                        },
                        "canonicalized": [
                          "{",
                          "}",
                          "^",
                          "{",
                          "*",
                          "12",
                          "}"
                        ],
                        "labels": {},
                        "idLabels": "",
                        "number": 2,
                        "begin_number": 3,
                        "attrNumber": "2",
                        "nextPos": 48,
                        "positions": {
                          "start": 129,
                          "end": 141
                        },
                        "content_test_str": "${ }^{* 12}$"
                      },
                      {
                        "type": "text",
                        "children": null,
                        "content": ", Yiming Yang ",
                        "nextPos": 62,
                        "positions": {
                          "start": 141,
                          "end": 155
                        },
                        "content_test_str": ", Yiming Yang "
                      },
                      {
                        "type": "inline_math",
                        "children": null,
                        "content": "{ }^{1}",
                        "math_env": "",
                        "inlinePos": {
                          "start": 62,
                          "end": 71
                        },
                        "canonicalized": [
                          "{",
                          "}",
                          "^",
                          "{",
                          "1",
                          "}"
                        ],
                        "labels": {},
                        "idLabels": "",
                        "number": 2,
                        "begin_number": 3,
                        "attrNumber": "2",
                        "nextPos": 71,
                        "positions": {
                          "start": 155,
                          "end": 164
                        },
                        "content_test_str": "${ }^{1}$"
                      },
                      {
                        "type": "text",
                        "children": null,
                        "content": ", Jaime Carbonell ",
                        "nextPos": 89,
                        "positions": {
                          "start": 164,
                          "end": 182
                        },
                        "content_test_str": ", Jaime Carbonell "
                      },
                      {
                        "type": "inline_math",
                        "children": null,
                        "content": "{ }^{1}",
                        "math_env": "",
                        "inlinePos": {
                          "start": 89,
                          "end": 98
                        },
                        "canonicalized": [
                          "{",
                          "}",
                          "^",
                          "{",
                          "1",
                          "}"
                        ],
                        "labels": {},
                        "idLabels": "",
                        "number": 2,
                        "begin_number": 3,
                        "attrNumber": "2",
                        "nextPos": 98,
                        "positions": {
                          "start": 182,
                          "end": 191
                        },
                        "content_test_str": "${ }^{1}$"
                      },
                      {
                        "type": "text",
                        "children": null,
                        "content": ",",
                        "nextPos": 99,
                        "positions": {
                          "start": 191,
                          "end": 192
                        },
                        "content_test_str": ","
                      }
                    ],
                    "positions": {
                      "start": 92,
                      "end": 195
                    },
                    "content_test_str": "\nZhilin Yang ${ }^{* 1}$, Zihang Dai ${ }^{* 12}$, Yiming Yang ${ }^{1}$, Jaime Carbonell ${ }^{1}$, \\\\"
                  },
                  {
                    "type": "author_item",
                    "content": "Ruslan Salakhutdinov ${ }^{1}$, Quoc V. Le $^{2}$",
                    "offsetLeft": 1,
                    "nextPos": 156,
                    "children": [
                      {
                        "type": "text",
                        "children": null,
                        "content": "Ruslan Salakhutdinov ",
                        "nextPos": 21,
                        "positions": {
                          "start": 196,
                          "end": 217
                        },
                        "content_test_str": "Ruslan Salakhutdinov "
                      },
                      {
                        "type": "inline_math",
                        "children": null,
                        "content": "{ }^{1}",
                        "math_env": "",
                        "inlinePos": {
                          "start": 21,
                          "end": 30
                        },
                        "canonicalized": [
                          "{",
                          "}",
                          "^",
                          "{",
                          "1",
                          "}"
                        ],
                        "labels": {},
                        "idLabels": "",
                        "number": 2,
                        "begin_number": 3,
                        "attrNumber": "2",
                        "nextPos": 30,
                        "positions": {
                          "start": 217,
                          "end": 226
                        },
                        "content_test_str": "${ }^{1}$"
                      },
                      {
                        "type": "text",
                        "children": null,
                        "content": ", Quoc V. Le ",
                        "nextPos": 43,
                        "positions": {
                          "start": 226,
                          "end": 239
                        },
                        "content_test_str": ", Quoc V. Le "
                      },
                      {
                        "type": "inline_math",
                        "children": null,
                        "content": "^{2}",
                        "math_env": "",
                        "inlinePos": {
                          "start": 43,
                          "end": 49
                        },
                        "canonicalized": [
                          "^",
                          "{",
                          "2",
                          "}"
                        ],
                        "labels": {},
                        "idLabels": "",
                        "number": 2,
                        "begin_number": 3,
                        "attrNumber": "2",
                        "nextPos": 49,
                        "positions": {
                          "start": 239,
                          "end": 245
                        },
                        "content_test_str": "$^{2}$"
                      }
                    ],
                    "positions": {
                      "start": 195,
                      "end": 248
                    },
                    "content_test_str": " Ruslan Salakhutdinov ${ }^{1}$, Quoc V. Le $^{2}$ \\\\"
                  },
                  {
                    "type": "author_item",
                    "content": "${ }^{1}$ Carnegie Mellon University, ${ }^{2}$ Google Brain",
                    "offsetLeft": 1,
                    "nextPos": 220,
                    "children": [
                      {
                        "type": "inline_math",
                        "children": null,
                        "content": "{ }^{1}",
                        "math_env": "",
                        "inlinePos": {
                          "start": 0,
                          "end": 9
                        },
                        "canonicalized": [
                          "{",
                          "}",
                          "^",
                          "{",
                          "1",
                          "}"
                        ],
                        "labels": {},
                        "idLabels": "",
                        "number": 2,
                        "begin_number": 3,
                        "attrNumber": "2",
                        "nextPos": 9,
                        "positions": {
                          "start": 249,
                          "end": 258
                        },
                        "content_test_str": "${ }^{1}$"
                      },
                      {
                        "type": "text",
                        "children": null,
                        "content": " Carnegie Mellon University, ",
                        "nextPos": 38,
                        "positions": {
                          "start": 258,
                          "end": 287
                        },
                        "content_test_str": " Carnegie Mellon University, "
                      },
                      {
                        "type": "inline_math",
                        "children": null,
                        "content": "{ }^{2}",
                        "math_env": "",
                        "inlinePos": {
                          "start": 38,
                          "end": 47
                        },
                        "canonicalized": [
                          "{",
                          "}",
                          "^",
                          "{",
                          "2",
                          "}"
                        ],
                        "labels": {},
                        "idLabels": "",
                        "number": 2,
                        "begin_number": 3,
                        "attrNumber": "2",
                        "nextPos": 47,
                        "positions": {
                          "start": 287,
                          "end": 296
                        },
                        "content_test_str": "${ }^{2}$"
                      },
                      {
                        "type": "text",
                        "children": null,
                        "content": " Google Brain",
                        "nextPos": 60,
                        "positions": {
                          "start": 296,
                          "end": 309
                        },
                        "content_test_str": " Google Brain"
                      }
                    ],
                    "positions": {
                      "start": 248,
                      "end": 312
                    },
                    "content_test_str": " ${ }^{1}$ Carnegie Mellon University, ${ }^{2}$ Google Brain \\\\"
                  },
                  {
                    "type": "author_item",
                    "content": "\\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com",
                    "offsetLeft": 1,
                    "nextPos": 292,
                    "children": [
                      {
                        "type": "text",
                        "children": null,
                        "content": "{zhiliny, dzihang, yiming, jgc, rsalakhu}@cs.cmu.edu, qvl@google.com",
                        "nextPos": 70,
                        "positions": {
                          "start": 313,
                          "end": 383
                        },
                        "content_test_str": "\\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com"
                      }
                    ],
                    "positions": {
                      "start": 312,
                      "end": 384
                    },
                    "content_test_str": " \\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com\n"
                  }
                ],
                "nextPos": 292,
                "positions": {
                  "start": 92,
                  "end": 384
                },
                "content_test_str": "\nZhilin Yang ${ }^{* 1}$, Zihang Dai ${ }^{* 12}$, Yiming Yang ${ }^{1}$, Jaime Carbonell ${ }^{1}$, \\\\ Ruslan Salakhutdinov ${ }^{1}$, Quoc V. Le $^{2}$ \\\\ ${ }^{1}$ Carnegie Mellon University, ${ }^{2}$ Google Brain \\\\ \\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com\n"
              }
            ],
            "content": "\nZhilin Yang ${ }^{* 1}$, Zihang Dai ${ }^{* 12}$, Yiming Yang ${ }^{1}$, Jaime Carbonell ${ }^{1}$, \\\\ Ruslan Salakhutdinov ${ }^{1}$, Quoc V. Le $^{2}$ \\\\ ${ }^{1}$ Carnegie Mellon University, ${ }^{2}$ Google Brain \\\\ \\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com\n",
            "inlinePos": {
              "start": 0,
              "end": 301,
              "start_content": 8,
              "end_content": 300
            },
            "nextPos": 301,
            "positions": {
              "start": 84,
              "end": 385,
              "start_content": 92,
              "end_content": 384
            },
            "content_test_str": "\\author{\nZhilin Yang ${ }^{* 1}$, Zihang Dai ${ }^{* 12}$, Yiming Yang ${ }^{1}$, Jaime Carbonell ${ }^{1}$, \\\\ Ruslan Salakhutdinov ${ }^{1}$, Quoc V. Le $^{2}$ \\\\ ${ }^{1}$ Carnegie Mellon University, ${ }^{2}$ Google Brain \\\\ \\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com\n}",
            "content_test": "\nZhilin Yang ${ }^{* 1}$, Zihang Dai ${ }^{* 12}$, Yiming Yang ${ }^{1}$, Jaime Carbonell ${ }^{1}$, \\\\ Ruslan Salakhutdinov ${ }^{1}$, Quoc V. Le $^{2}$ \\\\ ${ }^{1}$ Carnegie Mellon University, ${ }^{2}$ Google Brain \\\\ \\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com\n"
          }
        ],
        "content": "\\author{\nZhilin Yang ${ }^{* 1}$, Zihang Dai ${ }^{* 12}$, Yiming Yang ${ }^{1}$, Jaime Carbonell ${ }^{1}$, \\\\ Ruslan Salakhutdinov ${ }^{1}$, Quoc V. Le $^{2}$ \\\\ ${ }^{1}$ Carnegie Mellon University, ${ }^{2}$ Google Brain \\\\ \\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com\n}",
        "positions": {
          "start": 84,
          "end": 385
        },
        "content_test_str": "\\author{\nZhilin Yang ${ }^{* 1}$, Zihang Dai ${ }^{* 12}$, Yiming Yang ${ }^{1}$, Jaime Carbonell ${ }^{1}$, \\\\ Ruslan Salakhutdinov ${ }^{1}$, Quoc V. Le $^{2}$ \\\\ ${ }^{1}$ Carnegie Mellon University, ${ }^{2}$ Google Brain \\\\ \\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com\n}"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      }
    ]
  },
  /** MD links */
  {
    mmd: '[This is a link to the Mathpix website](http://mathpix.com/)\n' +
      '\n' +
      'a[This is a link to the Mathpix website](http://mathpix.com/)\n' +
      '\n' +
      'the link [This is a link to the Mathpix website](http://mathpix.com/) in text\n' +
      '\n' +
      'the *link* [This is a link to the Mathpix website](http://mathpix.com/) in text\n' +
      '\n' +
      'My favorite search engine is [Duck Duck Go](https://duckduckgo.com).\n' +
      '\n' +
      'My favorite search engine is [Duck Duck Go](https://duckduckgo.com "The best search engine for privacy").\n' +
      '\n' +
      '<https://www.markdownguide.org>\n' +
      '<fake@example.com>\n' +
      '\n' +
      '\n' +
      'I love supporting the **[EFF](https://eff.org)**.\n' +
      'This is the *[Markdown Guide](https://www.markdownguide.org)*.\n' +
      'See the section on [`code`](#code).',
    tokens: [
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 60
        },
        "content_test_str": "[This is a link to the Mathpix website](http://mathpix.com/)"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "link_open",
            "children": null,
            "content": "",
            "positions": {
              "start": 0,
              "end": 60
            },
            "content_test_str": "[This is a link to the Mathpix website](http://mathpix.com/)"
          },
          {
            "type": "text",
            "children": null,
            "content": "This is a link to the Mathpix website",
            "nextPos": 38,
            "positions": {
              "start": 1,
              "end": 38
            },
            "content_test_str": "This is a link to the Mathpix website"
          },
          {
            "type": "link_close",
            "children": null,
            "content": "",
            "nextPos": 60
          }
        ],
        "content": "[This is a link to the Mathpix website](http://mathpix.com/)",
        "positions": {
          "start": 0,
          "end": 60
        },
        "content_test_str": "[This is a link to the Mathpix website](http://mathpix.com/)"
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
          "start": 62,
          "end": 123
        },
        "content_test_str": "a[This is a link to the Mathpix website](http://mathpix.com/)"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "a",
            "nextPos": 1,
            "positions": {
              "start": 62,
              "end": 63
            },
            "content_test_str": "a"
          },
          {
            "type": "link_open",
            "children": null,
            "content": "",
            "positions": {
              "start": 63,
              "end": 123
            },
            "content_test_str": "[This is a link to the Mathpix website](http://mathpix.com/)"
          },
          {
            "type": "text",
            "children": null,
            "content": "This is a link to the Mathpix website",
            "nextPos": 39,
            "positions": {
              "start": 64,
              "end": 101
            },
            "content_test_str": "This is a link to the Mathpix website"
          },
          {
            "type": "link_close",
            "children": null,
            "content": "",
            "nextPos": 61
          }
        ],
        "content": "a[This is a link to the Mathpix website](http://mathpix.com/)",
        "positions": {
          "start": 62,
          "end": 123
        },
        "content_test_str": "a[This is a link to the Mathpix website](http://mathpix.com/)"
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
          "start": 125,
          "end": 202
        },
        "content_test_str": "the link [This is a link to the Mathpix website](http://mathpix.com/) in text"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "the link ",
            "nextPos": 9,
            "positions": {
              "start": 125,
              "end": 134
            },
            "content_test_str": "the link "
          },
          {
            "type": "link_open",
            "children": null,
            "content": "",
            "positions": {
              "start": 134,
              "end": 194
            },
            "content_test_str": "[This is a link to the Mathpix website](http://mathpix.com/)"
          },
          {
            "type": "text",
            "children": null,
            "content": "This is a link to the Mathpix website",
            "nextPos": 47,
            "positions": {
              "start": 135,
              "end": 172
            },
            "content_test_str": "This is a link to the Mathpix website"
          },
          {
            "type": "link_close",
            "children": null,
            "content": "",
            "nextPos": 69
          },
          {
            "type": "text",
            "children": null,
            "content": " in text",
            "nextPos": 77,
            "positions": {
              "start": 194,
              "end": 202
            },
            "content_test_str": " in text"
          }
        ],
        "content": "the link [This is a link to the Mathpix website](http://mathpix.com/) in text",
        "positions": {
          "start": 125,
          "end": 202
        },
        "content_test_str": "the link [This is a link to the Mathpix website](http://mathpix.com/) in text"
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
          "start": 204,
          "end": 283
        },
        "content_test_str": "the *link* [This is a link to the Mathpix website](http://mathpix.com/) in text"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "the ",
            "nextPos": 4,
            "positions": {
              "start": 204,
              "end": 208
            },
            "content_test_str": "the "
          },
          {
            "type": "em_open",
            "children": null,
            "content": "",
            "nextPos": 5,
            "positions": {
              "start": 208,
              "end": 209
            },
            "content_test_str": "*"
          },
          {
            "type": "text",
            "children": null,
            "content": "link",
            "nextPos": 9,
            "positions": {
              "start": 209,
              "end": 213
            },
            "content_test_str": "link"
          },
          {
            "type": "em_close",
            "children": null,
            "content": "",
            "nextPos": 10,
            "positions": {
              "start": 213,
              "end": 214
            },
            "content_test_str": "*"
          },
          {
            "type": "text",
            "children": null,
            "content": " ",
            "nextPos": 11,
            "positions": {
              "start": 214,
              "end": 215
            },
            "content_test_str": " "
          },
          {
            "type": "link_open",
            "children": null,
            "content": "",
            "positions": {
              "start": 215,
              "end": 275
            },
            "content_test_str": "[This is a link to the Mathpix website](http://mathpix.com/)"
          },
          {
            "type": "text",
            "children": null,
            "content": "This is a link to the Mathpix website",
            "nextPos": 49,
            "positions": {
              "start": 216,
              "end": 253
            },
            "content_test_str": "This is a link to the Mathpix website"
          },
          {
            "type": "link_close",
            "children": null,
            "content": "",
            "nextPos": 71
          },
          {
            "type": "text",
            "children": null,
            "content": " in text",
            "nextPos": 79,
            "positions": {
              "start": 275,
              "end": 283
            },
            "content_test_str": " in text"
          }
        ],
        "content": "the *link* [This is a link to the Mathpix website](http://mathpix.com/) in text",
        "positions": {
          "start": 204,
          "end": 283
        },
        "content_test_str": "the *link* [This is a link to the Mathpix website](http://mathpix.com/) in text"
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
          "start": 285,
          "end": 353
        },
        "content_test_str": "My favorite search engine is [Duck Duck Go](https://duckduckgo.com)."
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "My favorite search engine is ",
            "nextPos": 29,
            "positions": {
              "start": 285,
              "end": 314
            },
            "content_test_str": "My favorite search engine is "
          },
          {
            "type": "link_open",
            "children": null,
            "content": "",
            "positions": {
              "start": 314,
              "end": 352
            },
            "content_test_str": "[Duck Duck Go](https://duckduckgo.com)"
          },
          {
            "type": "text",
            "children": null,
            "content": "Duck Duck Go",
            "nextPos": 42,
            "positions": {
              "start": 315,
              "end": 327
            },
            "content_test_str": "Duck Duck Go"
          },
          {
            "type": "link_close",
            "children": null,
            "content": "",
            "nextPos": 67
          },
          {
            "type": "text",
            "children": null,
            "content": ".",
            "nextPos": 68,
            "positions": {
              "start": 352,
              "end": 353
            },
            "content_test_str": "."
          }
        ],
        "content": "My favorite search engine is [Duck Duck Go](https://duckduckgo.com).",
        "positions": {
          "start": 285,
          "end": 353
        },
        "content_test_str": "My favorite search engine is [Duck Duck Go](https://duckduckgo.com)."
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
          "start": 355,
          "end": 460
        },
        "content_test_str": "My favorite search engine is [Duck Duck Go](https://duckduckgo.com \"The best search engine for privacy\")."
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "My favorite search engine is ",
            "nextPos": 29,
            "positions": {
              "start": 355,
              "end": 384
            },
            "content_test_str": "My favorite search engine is "
          },
          {
            "type": "link_open",
            "children": null,
            "content": "",
            "positions": {
              "start": 384,
              "end": 459
            },
            "content_test_str": "[Duck Duck Go](https://duckduckgo.com \"The best search engine for privacy\")"
          },
          {
            "type": "text",
            "children": null,
            "content": "Duck Duck Go",
            "nextPos": 42,
            "positions": {
              "start": 385,
              "end": 397
            },
            "content_test_str": "Duck Duck Go"
          },
          {
            "type": "link_close",
            "children": null,
            "content": "",
            "nextPos": 104
          },
          {
            "type": "text",
            "children": null,
            "content": ".",
            "nextPos": 105,
            "positions": {
              "start": 459,
              "end": 460
            },
            "content_test_str": "."
          }
        ],
        "content": "My favorite search engine is [Duck Duck Go](https://duckduckgo.com \"The best search engine for privacy\").",
        "positions": {
          "start": 355,
          "end": 460
        },
        "content_test_str": "My favorite search engine is [Duck Duck Go](https://duckduckgo.com \"The best search engine for privacy\")."
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
          "start": 462,
          "end": 512
        },
        "content_test_str": "<https://www.markdownguide.org>\n<fake@example.com>"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "link_open",
            "children": null,
            "content": "",
            "positions": {
              "start": 462,
              "end": 493
            },
            "content_test_str": "<https://www.markdownguide.org>"
          },
          {
            "type": "text",
            "children": null,
            "content": "https://www.markdownguide.org",
            "positions": {
              "start": 463,
              "end": 492
            },
            "content_test_str": "https://www.markdownguide.org"
          },
          {
            "type": "link_close",
            "children": null,
            "content": "",
            "nextPos": 31
          },
          {
            "type": "softbreak",
            "children": null,
            "content": "",
            "nextPos": 32,
            "positions": {
              "start": 493,
              "end": 494
            },
            "content_test_str": "\n"
          },
          {
            "type": "link_open",
            "children": null,
            "content": "",
            "positions": {
              "start": 494,
              "end": 512
            },
            "content_test_str": "<fake@example.com>"
          },
          {
            "type": "text",
            "children": null,
            "content": "fake@example.com",
            "positions": {
              "start": 495,
              "end": 511
            },
            "content_test_str": "fake@example.com"
          },
          {
            "type": "link_close",
            "children": null,
            "content": "",
            "nextPos": 50
          }
        ],
        "content": "<https://www.markdownguide.org>\n<fake@example.com>",
        "positions": {
          "start": 462,
          "end": 512
        },
        "content_test_str": "<https://www.markdownguide.org>\n<fake@example.com>"
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
          "start": 515,
          "end": 663
        },
        "content_test_str": "I love supporting the **[EFF](https://eff.org)**.\nThis is the *[Markdown Guide](https://www.markdownguide.org)*.\nSee the section on [`code`](#code)."
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "I love supporting the ",
            "nextPos": 22,
            "positions": {
              "start": 515,
              "end": 537
            },
            "content_test_str": "I love supporting the "
          },
          {
            "type": "strong_open",
            "children": null,
            "content": "",
            "nextPos": 24,
            "positions": {
              "start": 537,
              "end": 539
            },
            "content_test_str": "**"
          },
          {
            "type": "link_open",
            "children": null,
            "content": "",
            "positions": {
              "start": 539,
              "end": 561
            },
            "content_test_str": "[EFF](https://eff.org)"
          },
          {
            "type": "text",
            "children": null,
            "content": "EFF",
            "nextPos": 28,
            "positions": {
              "start": 540,
              "end": 543
            },
            "content_test_str": "EFF"
          },
          {
            "type": "link_close",
            "children": null,
            "content": "",
            "nextPos": 46
          },
          {
            "type": "strong_close",
            "children": null,
            "content": "",
            "positions": {
              "start": 561,
              "end": 563
            },
            "content_test_str": "**"
          },
          {
            "type": "text",
            "children": null,
            "content": ".",
            "nextPos": 49,
            "positions": {
              "start": 563,
              "end": 564
            },
            "content_test_str": "."
          },
          {
            "type": "softbreak",
            "children": null,
            "content": "",
            "nextPos": 50,
            "positions": {
              "start": 564,
              "end": 565
            },
            "content_test_str": "\n"
          },
          {
            "type": "text",
            "children": null,
            "content": "This is the ",
            "nextPos": 62,
            "positions": {
              "start": 565,
              "end": 577
            },
            "content_test_str": "This is the "
          },
          {
            "type": "em_open",
            "children": null,
            "content": "",
            "nextPos": 63,
            "positions": {
              "start": 577,
              "end": 578
            },
            "content_test_str": "*"
          },
          {
            "type": "link_open",
            "children": null,
            "content": "",
            "positions": {
              "start": 578,
              "end": 625
            },
            "content_test_str": "[Markdown Guide](https://www.markdownguide.org)"
          },
          {
            "type": "text",
            "children": null,
            "content": "Markdown Guide",
            "nextPos": 78,
            "positions": {
              "start": 579,
              "end": 593
            },
            "content_test_str": "Markdown Guide"
          },
          {
            "type": "link_close",
            "children": null,
            "content": "",
            "nextPos": 110
          },
          {
            "type": "em_close",
            "children": null,
            "content": "",
            "nextPos": 111,
            "positions": {
              "start": 625,
              "end": 626
            },
            "content_test_str": "*"
          },
          {
            "type": "text",
            "children": null,
            "content": ".",
            "nextPos": 112,
            "positions": {
              "start": 626,
              "end": 627
            },
            "content_test_str": "."
          },
          {
            "type": "softbreak",
            "children": null,
            "content": "",
            "nextPos": 113,
            "positions": {
              "start": 627,
              "end": 628
            },
            "content_test_str": "\n"
          },
          {
            "type": "text",
            "children": null,
            "content": "See the section on ",
            "nextPos": 132,
            "positions": {
              "start": 628,
              "end": 647
            },
            "content_test_str": "See the section on "
          },
          {
            "type": "link_open",
            "children": null,
            "content": "",
            "positions": {
              "start": 647,
              "end": 662
            },
            "content_test_str": "[`code`](#code)"
          },
          {
            "type": "code_inline",
            "children": null,
            "content": "code",
            "nextPos": 139,
            "positions": {
              "start": 648,
              "end": 654
            },
            "content_test_str": "`code`"
          },
          {
            "type": "link_close",
            "children": null,
            "content": "",
            "nextPos": 147
          },
          {
            "type": "text",
            "children": null,
            "content": ".",
            "nextPos": 148,
            "positions": {
              "start": 662,
              "end": 663
            },
            "content_test_str": "."
          }
        ],
        "content": "I love supporting the **[EFF](https://eff.org)**.\nThis is the *[Markdown Guide](https://www.markdownguide.org)*.\nSee the section on [`code`](#code).",
        "positions": {
          "start": 515,
          "end": 663
        },
        "content_test_str": "I love supporting the **[EFF](https://eff.org)**.\nThis is the *[Markdown Guide](https://www.markdownguide.org)*.\nSee the section on [`code`](#code)."
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      }
    ]
  },
  /** sub sup */
  {
    mmd: '- 19^th^\n' +
      '- H~2~O',
    tokens: [
      {
        "type": "bullet_list_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 16
        },
        "content_test_str": "- 19^th^\n- H~2~O"
      },
      {
        "type": "list_item_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 8
        },
        "content_test_str": "- 19^th^"
      },
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 8
        },
        "content_test_str": "- 19^th^"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "19",
            "nextPos": 2,
            "positions": {
              "start": 2,
              "end": 4
            },
            "content_test_str": "19"
          },
          {
            "type": "sup_open",
            "children": null,
            "content": "",
            "positions": {
              "start": 4,
              "end": 5
            },
            "content_test_str": "^"
          },
          {
            "type": "text",
            "children": null,
            "content": "th",
            "positions": {
              "start": 5,
              "end": 7
            },
            "content_test_str": "th"
          },
          {
            "type": "sup_close",
            "children": null,
            "content": "",
            "nextPos": 6,
            "positions": {
              "start": 7,
              "end": 8
            },
            "content_test_str": "^"
          }
        ],
        "content": "19^th^",
        "positions": {
          "start": 2,
          "end": 8
        },
        "content_test_str": "19^th^"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "list_item_close",
        "children": null,
        "content": ""
      },
      {
        "type": "list_item_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 9,
          "end": 16
        },
        "content_test_str": "- H~2~O"
      },
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 9,
          "end": 16
        },
        "content_test_str": "- H~2~O"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "H",
            "nextPos": 1,
            "positions": {
              "start": 11,
              "end": 12
            },
            "content_test_str": "H"
          },
          {
            "type": "sub_open",
            "children": null,
            "content": "",
            "positions": {
              "start": 12,
              "end": 13
            },
            "content_test_str": "~"
          },
          {
            "type": "text",
            "children": null,
            "content": "2",
            "positions": {
              "start": 13,
              "end": 14
            },
            "content_test_str": "2"
          },
          {
            "type": "sub_close",
            "children": null,
            "content": "",
            "nextPos": 4,
            "positions": {
              "start": 14,
              "end": 15
            },
            "content_test_str": "~"
          },
          {
            "type": "text",
            "children": null,
            "content": "O",
            "nextPos": 5,
            "positions": {
              "start": 15,
              "end": 16
            },
            "content_test_str": "O"
          }
        ],
        "content": "H~2~O",
        "positions": {
          "start": 11,
          "end": 16
        },
        "content_test_str": "H~2~O"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "list_item_close",
        "children": null,
        "content": ""
      },
      {
        "type": "bullet_list_close",
        "children": null,
        "content": ""
      }
    ]
  },
  {
    mmd: 'Classic markup: :wink: :cry: :laughing: :yum:',
    tokens: [
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 45
        },
        "content_test_str": "Classic markup: :wink: :cry: :laughing: :yum:"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "Classic markup: :wink: :cry: :laughing: :yum:",
            "nextPos": 45,
            "positions": {
              "start": 0,
              "end": 45
            },
            "content_test_str": "Classic markup: :wink: :cry: :laughing: :yum:"
          }
        ],
        "content": "Classic markup: :wink: :cry: :laughing: :yum:",
        "positions": {
          "start": 0,
          "end": 45
        },
        "content_test_str": "Classic markup: :wink: :cry: :laughing: :yum:"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      }
    ]
  },
  {
    mmd: 'This means that you can use all the standard **Markdown syntax** in addition to some **LaTeX features** that we will list below. \n' +
      '\n' +
      '123 \\pagebreak text\n' +
      '\n' +
      '123\\pagebreak\n' +
      '\n' +
      '\\pagebreak text\n' +
      '\\clearpage\n' +
      '\n' +
      '\\newpage\n' +
      '\n' +
      '\\texttt{f}',
    tokens: [
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 129
        },
        "content_test_str": "This means that you can use all the standard **Markdown syntax** in addition to some **LaTeX features** that we will list below. "
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "This means that you can use all the standard ",
            "nextPos": 45,
            "positions": {
              "start": 0,
              "end": 45
            },
            "content_test_str": "This means that you can use all the standard "
          },
          {
            "type": "strong_open",
            "children": null,
            "content": "",
            "nextPos": 47,
            "positions": {
              "start": 45,
              "end": 47
            },
            "content_test_str": "**"
          },
          {
            "type": "text",
            "children": null,
            "content": "Markdown syntax",
            "nextPos": 62,
            "positions": {
              "start": 47,
              "end": 62
            },
            "content_test_str": "Markdown syntax"
          },
          {
            "type": "strong_close",
            "children": null,
            "content": "",
            "positions": {
              "start": 62,
              "end": 64
            },
            "content_test_str": "**"
          },
          {
            "type": "text",
            "children": null,
            "content": " in addition to some ",
            "nextPos": 85,
            "positions": {
              "start": 64,
              "end": 85
            },
            "content_test_str": " in addition to some "
          },
          {
            "type": "strong_open",
            "children": null,
            "content": "",
            "nextPos": 87,
            "positions": {
              "start": 85,
              "end": 87
            },
            "content_test_str": "**"
          },
          {
            "type": "text",
            "children": null,
            "content": "LaTeX features",
            "nextPos": 101,
            "positions": {
              "start": 87,
              "end": 101
            },
            "content_test_str": "LaTeX features"
          },
          {
            "type": "strong_close",
            "children": null,
            "content": "",
            "positions": {
              "start": 101,
              "end": 103
            },
            "content_test_str": "**"
          },
          {
            "type": "text",
            "children": null,
            "content": " that we will list below.",
            "nextPos": 128,
            "positions": {
              "start": 103,
              "end": 128
            },
            "content_test_str": " that we will list below."
          }
        ],
        "content": "This means that you can use all the standard **Markdown syntax** in addition to some **LaTeX features** that we will list below.",
        "positions": {
          "start": 0,
          "end": 129
        },
        "content_test_str": "This means that you can use all the standard **Markdown syntax** in addition to some **LaTeX features** that we will list below. "
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
          "start": 131,
          "end": 150
        },
        "content_test_str": "123 \\pagebreak text"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "123 ",
            "nextPos": 4,
            "positions": {
              "start": 131,
              "end": 135
            },
            "content_test_str": "123 "
          },
          {
            "type": "pagebreak",
            "children": [],
            "content": "",
            "nextPos": 14,
            "positions": {
              "start": 135,
              "end": 145
            },
            "content_test_str": "\\pagebreak"
          },
          {
            "type": "text",
            "children": null,
            "content": " text",
            "nextPos": 19,
            "positions": {
              "start": 145,
              "end": 150
            },
            "content_test_str": " text"
          }
        ],
        "content": "123 \\pagebreak text",
        "positions": {
          "start": 131,
          "end": 150
        },
        "content_test_str": "123 \\pagebreak text"
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
          "start": 152,
          "end": 165
        },
        "content_test_str": "123\\pagebreak"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "123",
            "nextPos": 3,
            "positions": {
              "start": 152,
              "end": 155
            },
            "content_test_str": "123"
          },
          {
            "type": "pagebreak",
            "children": [],
            "content": "",
            "nextPos": 13,
            "positions": {
              "start": 155,
              "end": 165
            },
            "content_test_str": "\\pagebreak"
          }
        ],
        "content": "123\\pagebreak",
        "positions": {
          "start": 152,
          "end": 165
        },
        "content_test_str": "123\\pagebreak"
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
          "start": 167,
          "end": 182
        },
        "content_test_str": "\\pagebreak text"
      },
      {
        "type": "pagebreak",
        "children": [],
        "content": "",
        "positions": {
          "start": 167,
          "end": 177
        },
        "content_test_str": "\\pagebreak"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": " text",
            "nextPos": 5,
            "positions": {
              "start": 177,
              "end": 182
            },
            "content_test_str": " text"
          }
        ],
        "content": " text",
        "positions": {
          "start": 177,
          "end": 182
        },
        "content_test_str": " text"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "pagebreak",
        "children": [],
        "content": "",
        "positions": {
          "start": 183,
          "end": 193
        },
        "content_test_str": "\\clearpage"
      },
      {
        "type": "pagebreak",
        "children": [],
        "content": "",
        "positions": {
          "start": 195,
          "end": 203
        },
        "content_test_str": "\\newpage"
      },
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 205,
          "end": 215
        },
        "content_test_str": "\\texttt{f}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "texttt_open",
            "children": null,
            "content": "",
            "inlinePos": {
              "start": 0,
              "end": 8
            },
            "nextPos": 8,
            "positions": {
              "start": 205,
              "end": 213
            },
            "content_test_str": "\\texttt{"
          },
          {
            "type": "texttt",
            "children": [
              {
                "type": "text",
                "children": null,
                "content": "f",
                "nextPos": 1,
                "positions": {
                  "start": 213,
                  "end": 214
                },
                "content_test_str": "f"
              }
            ],
            "content": "f",
            "inlinePos": {
              "start": 8,
              "end": 9
            },
            "nextPos": 9,
            "positions": {
              "start": 213,
              "end": 214
            },
            "content_test_str": "f"
          },
          {
            "type": "texttt_close",
            "children": null,
            "content": "",
            "nextPos": 10,
            "positions": {
              "start": 214,
              "end": 215
            },
            "content_test_str": "}"
          }
        ],
        "content": "\\texttt{f}",
        "positions": {
          "start": 205,
          "end": 215
        },
        "content_test_str": "\\texttt{f}"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      }
    ]
  }
];
