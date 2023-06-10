module.exports = [
  {
    mmd: '\\author{\n' +
      'Zhilin Yang ${ }^{* 1}$, Zihang Dai ${ }^{* 12}$, Yiming Yang ${ }^{1}$, Jaime Carbonell ${ }^{1}$, \\\\ Ruslan Salakhutdinov ${ }^{1}$, Quoc V. Le $^{2}$ \\\\ ${ }^{1}$ Carnegie Mellon University, ${ }^{2}$ Google Brain \\\\ \\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com\n' +
      '}',
    tokens: [
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 301
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
                          "start": 9,
                          "end": 21
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
                        "number": 0,
                        "begin_number": 1,
                        "attrNumber": "0",
                        "nextPos": 23,
                        "positions": {
                          "start": 21,
                          "end": 32
                        },
                        "content_test_str": "${ }^{* 1}$"
                      },
                      {
                        "type": "text",
                        "children": null,
                        "content": ", Zihang Dai ",
                        "nextPos": 36,
                        "positions": {
                          "start": 32,
                          "end": 45
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
                        "number": 0,
                        "begin_number": 1,
                        "attrNumber": "0",
                        "nextPos": 48,
                        "positions": {
                          "start": 45,
                          "end": 57
                        },
                        "content_test_str": "${ }^{* 12}$"
                      },
                      {
                        "type": "text",
                        "children": null,
                        "content": ", Yiming Yang ",
                        "nextPos": 62,
                        "positions": {
                          "start": 57,
                          "end": 71
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
                        "number": 0,
                        "begin_number": 1,
                        "attrNumber": "0",
                        "nextPos": 71,
                        "positions": {
                          "start": 71,
                          "end": 80
                        },
                        "content_test_str": "${ }^{1}$"
                      },
                      {
                        "type": "text",
                        "children": null,
                        "content": ", Jaime Carbonell ",
                        "nextPos": 89,
                        "positions": {
                          "start": 80,
                          "end": 98
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
                        "number": 0,
                        "begin_number": 1,
                        "attrNumber": "0",
                        "nextPos": 98,
                        "positions": {
                          "start": 98,
                          "end": 107
                        },
                        "content_test_str": "${ }^{1}$"
                      },
                      {
                        "type": "text",
                        "children": null,
                        "content": ",",
                        "nextPos": 99,
                        "positions": {
                          "start": 107,
                          "end": 108
                        },
                        "content_test_str": ","
                      }
                    ],
                    "positions": {
                      "start": 8,
                      "end": 111
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
                          "start": 112,
                          "end": 133
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
                        "number": 0,
                        "begin_number": 1,
                        "attrNumber": "0",
                        "nextPos": 30,
                        "positions": {
                          "start": 133,
                          "end": 142
                        },
                        "content_test_str": "${ }^{1}$"
                      },
                      {
                        "type": "text",
                        "children": null,
                        "content": ", Quoc V. Le ",
                        "nextPos": 43,
                        "positions": {
                          "start": 142,
                          "end": 155
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
                        "number": 0,
                        "begin_number": 1,
                        "attrNumber": "0",
                        "nextPos": 49,
                        "positions": {
                          "start": 155,
                          "end": 161
                        },
                        "content_test_str": "$^{2}$"
                      }
                    ],
                    "positions": {
                      "start": 111,
                      "end": 164
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
                        "number": 0,
                        "begin_number": 1,
                        "attrNumber": "0",
                        "nextPos": 9,
                        "positions": {
                          "start": 165,
                          "end": 174
                        },
                        "content_test_str": "${ }^{1}$"
                      },
                      {
                        "type": "text",
                        "children": null,
                        "content": " Carnegie Mellon University, ",
                        "nextPos": 38,
                        "positions": {
                          "start": 174,
                          "end": 203
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
                        "number": 0,
                        "begin_number": 1,
                        "attrNumber": "0",
                        "nextPos": 47,
                        "positions": {
                          "start": 203,
                          "end": 212
                        },
                        "content_test_str": "${ }^{2}$"
                      },
                      {
                        "type": "text",
                        "children": null,
                        "content": " Google Brain",
                        "nextPos": 60,
                        "positions": {
                          "start": 212,
                          "end": 225
                        },
                        "content_test_str": " Google Brain"
                      }
                    ],
                    "positions": {
                      "start": 164,
                      "end": 228
                    },
                    "content_test_str": " ${ }^{1}$ Carnegie Mellon University, ${ }^{2}$ Google Brain \\\\"
                  },
                  {
                    "type": "author_item",
                    "content": "\\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com",
                    "offsetLeft": 1,
                    "nextPos": 294,
                    "children": [
                      {
                        "type": "text",
                        "children": null,
                        "content": "{zhiliny, dzihang, yiming, jgc, rsalakhu}@cs.cmu.edu, qvl@google.com",
                        "nextPos": 70,
                        "positions": {
                          "start": 229,
                          "end": 299
                        },
                        "content_test_str": "\\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com"
                      }
                    ],
                    "positions": {
                      "start": 228,
                      "end": 302
                    },
                    "content_test_str": " \\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com\n}"
                  }
                ],
                "nextPos": 292,
                "positions": {
                  "start": 8,
                  "end": 300
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
              "start": 0,
              "end": 301,
              "start_content": 8,
              "end_content": 300
            },
            "content_test_str": "\\author{\nZhilin Yang ${ }^{* 1}$, Zihang Dai ${ }^{* 12}$, Yiming Yang ${ }^{1}$, Jaime Carbonell ${ }^{1}$, \\\\ Ruslan Salakhutdinov ${ }^{1}$, Quoc V. Le $^{2}$ \\\\ ${ }^{1}$ Carnegie Mellon University, ${ }^{2}$ Google Brain \\\\ \\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com\n}",
            "content_test": "\nZhilin Yang ${ }^{* 1}$, Zihang Dai ${ }^{* 12}$, Yiming Yang ${ }^{1}$, Jaime Carbonell ${ }^{1}$, \\\\ Ruslan Salakhutdinov ${ }^{1}$, Quoc V. Le $^{2}$ \\\\ ${ }^{1}$ Carnegie Mellon University, ${ }^{2}$ Google Brain \\\\ \\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com\n"
          }
        ],
        "content": "\\author{\nZhilin Yang ${ }^{* 1}$, Zihang Dai ${ }^{* 12}$, Yiming Yang ${ }^{1}$, Jaime Carbonell ${ }^{1}$, \\\\ Ruslan Salakhutdinov ${ }^{1}$, Quoc V. Le $^{2}$ \\\\ ${ }^{1}$ Carnegie Mellon University, ${ }^{2}$ Google Brain \\\\ \\{zhiliny, dzihang, yiming, jgc, rsalakhu\\}@cs.cmu.edu, qvl@google.com\n}",
        "positions": {
          "start": 0,
          "end": 301
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
  {
    mmd: '\\author{Author}\n' +
      '\n' +
      '\\author{Author\\\\can also be\\\\multiline}\n' +
      '\n' +
      '\\author{Author \\textit{italic text}}\n' +
      '\n' +
      '\\author{Author \\textbf{bold text}}\n' +
      '\n' +
      '\\author{Author \\textbf{\\textit{bold italic text}}}\n' +
      '\n' +
      '\\author{Author \\texttt{code text}}\n' +
      '\n' +
      '\\author{Author inline math equation $x^u$}',
    tokens: [
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 15
        },
        "content_test_str": "\\author{Author}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "author",
            "children": [
              {
                "type": "author_column",
                "content": "Author",
                "children": [
                  {
                    "type": "author_item",
                    "content": "Author",
                    "offsetLeft": 0,
                    "nextPos": 6,
                    "children": [
                      {
                        "type": "text",
                        "children": null,
                        "content": "Author",
                        "nextPos": 6,
                        "positions": {
                          "start": 8,
                          "end": 14
                        },
                        "content_test_str": "Author"
                      }
                    ],
                    "positions": {
                      "start": 8,
                      "end": 14
                    },
                    "content_test_str": "Author"
                  }
                ],
                "nextPos": 6,
                "positions": {
                  "start": 8,
                  "end": 14
                },
                "content_test_str": "Author"
              }
            ],
            "content": "Author",
            "inlinePos": {
              "start": 0,
              "end": 15,
              "start_content": 8,
              "end_content": 14
            },
            "nextPos": 15,
            "positions": {
              "start": 0,
              "end": 15,
              "start_content": 8,
              "end_content": 14
            },
            "content_test_str": "\\author{Author}",
            "content_test": "Author"
          }
        ],
        "content": "\\author{Author}",
        "positions": {
          "start": 0,
          "end": 15
        },
        "content_test_str": "\\author{Author}"
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
          "start": 17,
          "end": 56
        },
        "content_test_str": "\\author{Author\\\\can also be\\\\multiline}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "author",
            "children": [
              {
                "type": "author_column",
                "content": "Author\\\\can also be\\\\multiline",
                "children": [
                  {
                    "type": "author_item",
                    "content": "Author",
                    "offsetLeft": 0,
                    "nextPos": 8,
                    "children": [
                      {
                        "type": "text",
                        "children": null,
                        "content": "Author",
                        "nextPos": 6,
                        "positions": {
                          "start": 25,
                          "end": 31
                        },
                        "content_test_str": "Author"
                      }
                    ],
                    "positions": {
                      "start": 25,
                      "end": 33
                    },
                    "content_test_str": "Author\\\\"
                  },
                  {
                    "type": "author_item",
                    "content": "can also be",
                    "offsetLeft": 0,
                    "nextPos": 21,
                    "children": [
                      {
                        "type": "text",
                        "children": null,
                        "content": "can also be",
                        "nextPos": 11,
                        "positions": {
                          "start": 33,
                          "end": 44
                        },
                        "content_test_str": "can also be"
                      }
                    ],
                    "positions": {
                      "start": 33,
                      "end": 46
                    },
                    "content_test_str": "can also be\\\\"
                  },
                  {
                    "type": "author_item",
                    "content": "multiline",
                    "offsetLeft": 0,
                    "nextPos": 30,
                    "children": [
                      {
                        "type": "text",
                        "children": null,
                        "content": "multiline",
                        "nextPos": 9,
                        "positions": {
                          "start": 46,
                          "end": 55
                        },
                        "content_test_str": "multiline"
                      }
                    ],
                    "positions": {
                      "start": 46,
                      "end": 55
                    },
                    "content_test_str": "multiline"
                  }
                ],
                "nextPos": 30,
                "positions": {
                  "start": 25,
                  "end": 55
                },
                "content_test_str": "Author\\\\can also be\\\\multiline"
              }
            ],
            "content": "Author\\\\can also be\\\\multiline",
            "inlinePos": {
              "start": 0,
              "end": 39,
              "start_content": 8,
              "end_content": 38
            },
            "nextPos": 39,
            "positions": {
              "start": 17,
              "end": 56,
              "start_content": 25,
              "end_content": 55
            },
            "content_test_str": "\\author{Author\\\\can also be\\\\multiline}",
            "content_test": "Author\\\\can also be\\\\multiline"
          }
        ],
        "content": "\\author{Author\\\\can also be\\\\multiline}",
        "positions": {
          "start": 17,
          "end": 56
        },
        "content_test_str": "\\author{Author\\\\can also be\\\\multiline}"
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
          "start": 58,
          "end": 94
        },
        "content_test_str": "\\author{Author \\textit{italic text}}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "author",
            "children": [
              {
                "type": "author_column",
                "content": "Author \\textit{italic text}",
                "children": [
                  {
                    "type": "author_item",
                    "content": "Author \\textit{italic text}",
                    "offsetLeft": 0,
                    "nextPos": 27,
                    "children": [
                      {
                        "type": "text",
                        "children": null,
                        "content": "Author ",
                        "nextPos": 7,
                        "positions": {
                          "start": 66,
                          "end": 73
                        },
                        "content_test_str": "Author "
                      },
                      {
                        "type": "textit_open",
                        "children": null,
                        "content": "",
                        "inlinePos": {
                          "start": 7,
                          "end": 27
                        },
                        "positions": {
                          "start": 73,
                          "end": 93
                        },
                        "content_test_str": "\\textit{italic text}"
                      },
                      {
                        "type": "textit",
                        "children": [
                          {
                            "type": "text",
                            "children": null,
                            "content": "italic text",
                            "nextPos": 11,
                            "positions": {
                              "start": 81,
                              "end": 92
                            },
                            "content_test_str": "italic text"
                          }
                        ],
                        "content": "italic text",
                        "inlinePos": {
                          "start": 7,
                          "end": 27,
                          "start_content": 15,
                          "end_content": 26
                        },
                        "positions": {
                          "start": 73,
                          "end": 93,
                          "start_content": 81,
                          "end_content": 92
                        },
                        "content_test_str": "\\textit{italic text}",
                        "content_test": "italic text"
                      },
                      {
                        "type": "textit_close",
                        "children": null,
                        "content": "",
                        "nextPos": 27,
                        "positions": {
                          "start": 93,
                          "end": 93
                        },
                        "content_test_str": ""
                      }
                    ],
                    "positions": {
                      "start": 66,
                      "end": 93
                    },
                    "content_test_str": "Author \\textit{italic text}"
                  }
                ],
                "nextPos": 27,
                "positions": {
                  "start": 66,
                  "end": 93
                },
                "content_test_str": "Author \\textit{italic text}"
              }
            ],
            "content": "Author \\textit{italic text}",
            "inlinePos": {
              "start": 0,
              "end": 36,
              "start_content": 8,
              "end_content": 35
            },
            "nextPos": 36,
            "positions": {
              "start": 58,
              "end": 94,
              "start_content": 66,
              "end_content": 93
            },
            "content_test_str": "\\author{Author \\textit{italic text}}",
            "content_test": "Author \\textit{italic text}"
          }
        ],
        "content": "\\author{Author \\textit{italic text}}",
        "positions": {
          "start": 58,
          "end": 94
        },
        "content_test_str": "\\author{Author \\textit{italic text}}"
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
          "start": 96,
          "end": 130
        },
        "content_test_str": "\\author{Author \\textbf{bold text}}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "author",
            "children": [
              {
                "type": "author_column",
                "content": "Author \\textbf{bold text}",
                "children": [
                  {
                    "type": "author_item",
                    "content": "Author \\textbf{bold text}",
                    "offsetLeft": 0,
                    "nextPos": 25,
                    "children": [
                      {
                        "type": "text",
                        "children": null,
                        "content": "Author ",
                        "nextPos": 7,
                        "positions": {
                          "start": 104,
                          "end": 111
                        },
                        "content_test_str": "Author "
                      },
                      {
                        "type": "textbf_open",
                        "children": null,
                        "content": "",
                        "inlinePos": {
                          "start": 7,
                          "end": 25
                        },
                        "positions": {
                          "start": 111,
                          "end": 129
                        },
                        "content_test_str": "\\textbf{bold text}"
                      },
                      {
                        "type": "textbf",
                        "children": [
                          {
                            "type": "text",
                            "children": null,
                            "content": "bold text",
                            "nextPos": 9,
                            "positions": {
                              "start": 119,
                              "end": 128
                            },
                            "content_test_str": "bold text"
                          }
                        ],
                        "content": "bold text",
                        "inlinePos": {
                          "start": 7,
                          "end": 25,
                          "start_content": 15,
                          "end_content": 24
                        },
                        "positions": {
                          "start": 111,
                          "end": 129,
                          "start_content": 119,
                          "end_content": 128
                        },
                        "content_test_str": "\\textbf{bold text}",
                        "content_test": "bold text"
                      },
                      {
                        "type": "textbf_close",
                        "children": null,
                        "content": "",
                        "nextPos": 25,
                        "positions": {
                          "start": 129,
                          "end": 129
                        },
                        "content_test_str": ""
                      }
                    ],
                    "positions": {
                      "start": 104,
                      "end": 129
                    },
                    "content_test_str": "Author \\textbf{bold text}"
                  }
                ],
                "nextPos": 25,
                "positions": {
                  "start": 104,
                  "end": 129
                },
                "content_test_str": "Author \\textbf{bold text}"
              }
            ],
            "content": "Author \\textbf{bold text}",
            "inlinePos": {
              "start": 0,
              "end": 34,
              "start_content": 8,
              "end_content": 33
            },
            "nextPos": 34,
            "positions": {
              "start": 96,
              "end": 130,
              "start_content": 104,
              "end_content": 129
            },
            "content_test_str": "\\author{Author \\textbf{bold text}}",
            "content_test": "Author \\textbf{bold text}"
          }
        ],
        "content": "\\author{Author \\textbf{bold text}}",
        "positions": {
          "start": 96,
          "end": 130
        },
        "content_test_str": "\\author{Author \\textbf{bold text}}"
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
          "start": 132,
          "end": 182
        },
        "content_test_str": "\\author{Author \\textbf{\\textit{bold italic text}}}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "author",
            "children": [
              {
                "type": "author_column",
                "content": "Author \\textbf{\\textit{bold italic text}}",
                "children": [
                  {
                    "type": "author_item",
                    "content": "Author \\textbf{\\textit{bold italic text}}",
                    "offsetLeft": 0,
                    "nextPos": 41,
                    "children": [
                      {
                        "type": "text",
                        "children": null,
                        "content": "Author ",
                        "nextPos": 7,
                        "positions": {
                          "start": 140,
                          "end": 147
                        },
                        "content_test_str": "Author "
                      },
                      {
                        "type": "textbf_open",
                        "children": null,
                        "content": "",
                        "inlinePos": {
                          "start": 7,
                          "end": 41
                        },
                        "positions": {
                          "start": 147,
                          "end": 181
                        },
                        "content_test_str": "\\textbf{\\textit{bold italic text}}"
                      },
                      {
                        "type": "textbf",
                        "children": [
                          {
                            "type": "textit_open",
                            "children": null,
                            "content": "",
                            "inlinePos": {
                              "start": 0,
                              "end": 25
                            },
                            "positions": {
                              "start": 155,
                              "end": 180
                            },
                            "content_test_str": "\\textit{bold italic text}"
                          },
                          {
                            "type": "textit",
                            "children": [
                              {
                                "type": "text",
                                "children": null,
                                "content": "bold italic text",
                                "nextPos": 16,
                                "positions": {
                                  "start": 163,
                                  "end": 179
                                },
                                "content_test_str": "bold italic text"
                              }
                            ],
                            "content": "bold italic text",
                            "inlinePos": {
                              "start": 0,
                              "end": 25,
                              "start_content": 8,
                              "end_content": 24
                            },
                            "positions": {
                              "start": 155,
                              "end": 180,
                              "start_content": 163,
                              "end_content": 179
                            },
                            "content_test_str": "\\textit{bold italic text}",
                            "content_test": "bold italic text"
                          },
                          {
                            "type": "textit_close",
                            "children": null,
                            "content": "",
                            "nextPos": 25,
                            "positions": {
                              "start": 180,
                              "end": 180
                            },
                            "content_test_str": ""
                          }
                        ],
                        "content": "\\textit{bold italic text}",
                        "inlinePos": {
                          "start": 7,
                          "end": 41,
                          "start_content": 15,
                          "end_content": 40
                        },
                        "positions": {
                          "start": 147,
                          "end": 181,
                          "start_content": 155,
                          "end_content": 180
                        },
                        "content_test_str": "\\textbf{\\textit{bold italic text}}",
                        "content_test": "\\textit{bold italic text}"
                      },
                      {
                        "type": "textbf_close",
                        "children": null,
                        "content": "",
                        "nextPos": 41,
                        "positions": {
                          "start": 181,
                          "end": 181
                        },
                        "content_test_str": ""
                      }
                    ],
                    "positions": {
                      "start": 140,
                      "end": 181
                    },
                    "content_test_str": "Author \\textbf{\\textit{bold italic text}}"
                  }
                ],
                "nextPos": 41,
                "positions": {
                  "start": 140,
                  "end": 181
                },
                "content_test_str": "Author \\textbf{\\textit{bold italic text}}"
              }
            ],
            "content": "Author \\textbf{\\textit{bold italic text}}",
            "inlinePos": {
              "start": 0,
              "end": 50,
              "start_content": 8,
              "end_content": 49
            },
            "nextPos": 50,
            "positions": {
              "start": 132,
              "end": 182,
              "start_content": 140,
              "end_content": 181
            },
            "content_test_str": "\\author{Author \\textbf{\\textit{bold italic text}}}",
            "content_test": "Author \\textbf{\\textit{bold italic text}}"
          }
        ],
        "content": "\\author{Author \\textbf{\\textit{bold italic text}}}",
        "positions": {
          "start": 132,
          "end": 182
        },
        "content_test_str": "\\author{Author \\textbf{\\textit{bold italic text}}}"
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
          "start": 184,
          "end": 218
        },
        "content_test_str": "\\author{Author \\texttt{code text}}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "author",
            "children": [
              {
                "type": "author_column",
                "content": "Author \\texttt{code text}",
                "children": [
                  {
                    "type": "author_item",
                    "content": "Author \\texttt{code text}",
                    "offsetLeft": 0,
                    "nextPos": 25,
                    "children": [
                      {
                        "type": "text",
                        "children": null,
                        "content": "Author ",
                        "nextPos": 7,
                        "positions": {
                          "start": 192,
                          "end": 199
                        },
                        "content_test_str": "Author "
                      },
                      {
                        "type": "texttt_open",
                        "children": null,
                        "content": "",
                        "inlinePos": {
                          "start": 7,
                          "end": 25
                        },
                        "positions": {
                          "start": 199,
                          "end": 217
                        },
                        "content_test_str": "\\texttt{code text}"
                      },
                      {
                        "type": "texttt",
                        "children": [
                          {
                            "type": "text",
                            "children": null,
                            "content": "code text",
                            "nextPos": 9,
                            "positions": {
                              "start": 207,
                              "end": 216
                            },
                            "content_test_str": "code text"
                          }
                        ],
                        "content": "code text",
                        "inlinePos": {
                          "start": 7,
                          "end": 25,
                          "start_content": 15,
                          "end_content": 24
                        },
                        "positions": {
                          "start": 199,
                          "end": 217,
                          "start_content": 207,
                          "end_content": 216
                        },
                        "content_test_str": "\\texttt{code text}",
                        "content_test": "code text"
                      },
                      {
                        "type": "texttt_close",
                        "children": null,
                        "content": "",
                        "nextPos": 25,
                        "positions": {
                          "start": 217,
                          "end": 217
                        },
                        "content_test_str": ""
                      }
                    ],
                    "positions": {
                      "start": 192,
                      "end": 217
                    },
                    "content_test_str": "Author \\texttt{code text}"
                  }
                ],
                "nextPos": 25,
                "positions": {
                  "start": 192,
                  "end": 217
                },
                "content_test_str": "Author \\texttt{code text}"
              }
            ],
            "content": "Author \\texttt{code text}",
            "inlinePos": {
              "start": 0,
              "end": 34,
              "start_content": 8,
              "end_content": 33
            },
            "nextPos": 34,
            "positions": {
              "start": 184,
              "end": 218,
              "start_content": 192,
              "end_content": 217
            },
            "content_test_str": "\\author{Author \\texttt{code text}}",
            "content_test": "Author \\texttt{code text}"
          }
        ],
        "content": "\\author{Author \\texttt{code text}}",
        "positions": {
          "start": 184,
          "end": 218
        },
        "content_test_str": "\\author{Author \\texttt{code text}}"
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
          "start": 220,
          "end": 262
        },
        "content_test_str": "\\author{Author inline math equation $x^u$}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "author",
            "children": [
              {
                "type": "author_column",
                "content": "Author inline math equation $x^u$",
                "children": [
                  {
                    "type": "author_item",
                    "content": "Author inline math equation $x^u$",
                    "offsetLeft": 0,
                    "nextPos": 33,
                    "children": [
                      {
                        "type": "text",
                        "children": null,
                        "content": "Author inline math equation ",
                        "nextPos": 28,
                        "positions": {
                          "start": 228,
                          "end": 256
                        },
                        "content_test_str": "Author inline math equation "
                      },
                      {
                        "type": "inline_math",
                        "children": null,
                        "content": "x^u",
                        "math_env": "",
                        "inlinePos": {
                          "start": 28,
                          "end": 33
                        },
                        "canonicalized": [
                          "x",
                          "^",
                          "u"
                        ],
                        "labels": {},
                        "idLabels": "",
                        "number": 0,
                        "begin_number": 1,
                        "attrNumber": "0",
                        "nextPos": 33,
                        "positions": {
                          "start": 256,
                          "end": 261
                        },
                        "content_test_str": "$x^u$"
                      }
                    ],
                    "positions": {
                      "start": 228,
                      "end": 261
                    },
                    "content_test_str": "Author inline math equation $x^u$"
                  }
                ],
                "nextPos": 33,
                "positions": {
                  "start": 228,
                  "end": 261
                },
                "content_test_str": "Author inline math equation $x^u$"
              }
            ],
            "content": "Author inline math equation $x^u$",
            "inlinePos": {
              "start": 0,
              "end": 42,
              "start_content": 8,
              "end_content": 41
            },
            "nextPos": 42,
            "positions": {
              "start": 220,
              "end": 262,
              "start_content": 228,
              "end_content": 261
            },
            "content_test_str": "\\author{Author inline math equation $x^u$}",
            "content_test": "Author inline math equation $x^u$"
          }
        ],
        "content": "\\author{Author inline math equation $x^u$}",
        "positions": {
          "start": 220,
          "end": 262
        },
        "content_test_str": "\\author{Author inline math equation $x^u$}"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      }
    ]
  }
];
