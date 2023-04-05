module.exports = [
  {
    mmd: '\\setcounter{subsubsection}{7}\n' +
      '\n' +
      '\\subsubsection{subsubsection should be 0.0.8}',
    tokens: [
      {
        "type": "paragraph_open",
        "children": [],
        "content": "",
        "positions": {
          "start": 0,
          "end": 29
        },
        "content_test_str": "\\setcounter{subsubsection}{7}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "section_setcounter",
            "children": [],
            "content": "",
            "inlinePos": {
              "start": 0,
              "end": 29
            },
            "positions": {
              "start": 0,
              "end": 29
            },
            "content_test_str": "\\setcounter{subsubsection}{7}"
          }
        ],
        "content": "",
        "positions": {
          "start": 0,
          "end": 29
        },
        "content_test_str": "\\setcounter{subsubsection}{7}"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 31,
          "end": 76
        },
        "content_test_str": "\\subsubsection{subsubsection should be 0.0.8}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection should be 0.0.8",
            "positions": {
              "start": 46,
              "end": 75
            },
            "content_test_str": "subsubsection should be 0.0.8"
          }
        ],
        "content": "subsubsection should be 0.0.8",
        "positions": {
          "start": 31,
          "end": 76,
          "start_content": 46,
          "end_content": 75
        },
        "content_test": "subsubsection should be 0.0.8",
        "content_test_str": "\\subsubsection{subsubsection should be 0.0.8}"
      },
      {
        "type": "heading_close",
        "children": null,
        "content": ""
      }
    ]
    
  },
  {
    mmd: 'Change subsubsection number to 7 `\\setcounter{subsubsection}{7}`\n' +
      '\n' +
      '\\setcounter{subsubsection}{7}\n' +
      '\n' +
      '\\section*{section unnumbered}\n' +
      '\n' +
      '\\subsubsection*{subsubsection unnumbered}\n' +
      '\n' +
      '\\subsubsection{subsubsection number should be 0.0.8}\n' +
      '\n' +
      'Change subsubsection number to 1 `\\setcounter{subsubsection}{1}`\n' +
      '\n' +
      '\\setcounter{subsubsection}{1}\n' +
      '\n' +
      '\\subsubsection{subsubsection number should be 0.0.2}\n' +
      '\n' +
      '\\subsubsection*{subsubsection unnumbered}\n' +
      '\n' +
      '\\subsubsection{subsubsection number should be 0.0.3}\n' +
      '\n' +
      '\\subsubsection{subsubsection number should be 0.0.4}\n' +
      '\n' +
      '\\section{section}\n' +
      '\n' +
      'Change section number to 5 `\\setcounter{section}{5}`\n' +
      '\\setcounter{section}{5}\n' +
      '\n' +
      '\\subsubsection{subsubsection number should be 5.0.1}\n' +
      '\n' +
      '\\subsubsection*{subsubsection unnumbered}\n' +
      '\n' +
      'Change section number to 7 `\\setcounter{section}{7}`\n' +
      '\\setcounter{section}{7}\n' +
      '\\subsubsection{subsubsection number should be 7.0.2}\n' +
      '\n' +
      '\\subsection*{subsection unnumbered}\n' +
      '\n' +
      '\\subsubsection*{subsubsection unnumbered}\n' +
      '\n' +
      '\\subsubsection{subsubsection number should be 7.0.3}\n' +
      '\n' +
      '\\subsubsection{subsubsection number should be 7.0.4}\n' +
      '\n' +
      '\\section*{section unnumbered}\n' +
      '\n' +
      '\\subsubsection*{subsubsection unnumbered}\n' +
      '\n' +
      '\\subsubsection*{subsubsection unnumbered}\n' +
      '\n' +
      '\\section{section}\n' +
      '\n' +
      'Change subsection number to 7 `\\setcounter{subsection}{7}`\n' +
      '\\setcounter{subsection}{7}\n' +
      '\n' +
      '\\subsubsection{subsubsection number should be 8.7.1}\n' +
      '\n' +
      '\\subsubsection*{subsubsection unnumbered}\n' +
      '\n' +
      '\\subsection{subsection}\n' +
      '\n' +
      '\\subsubsection{subsubsection number should be 8.8.1}\n' +
      '\n' +
      '\\subsection*{subsection unnumbered}\n' +
      '\n' +
      '\\subsubsection{subsubsection number should be 8.8.2}\n' +
      '\n' +
      'Change subsubsection number to 7 `\\setcounter{subsubsection}{7}`\n' +
      '\\setcounter{subsubsection}{7}\n' +
      '\n' +
      '\\subsubsection{subsubsection number should be 8.8.8}\n' +
      '\n' +
      '\\subsection{subsection}\n' +
      '\n' +
      '\\subsubsection{subsubsection number should be 8.9.1}\n' +
      '\n' +
      '\\subsubsection*{subsubsection unnumbered}\n' +
      '\n' +
      '\\subsubsection{subsubsection number should be 8.9.2}\n' +
      '\n' +
      '\\subsection*{subsection unnumbered}\n' +
      '\n' +
      '\\section{section}\n' +
      '\n' +
      'Change subsection number to 7 `\\setcounter{subsection}{7}`\n' +
      '\\setcounter{subsection}{7}\n' +
      '\n' +
      '\\subsubsection*{subsubsection unnumbered}\n' +
      '\n' +
      '\\subsection*{subsection unnumbered}\n' +
      '\n' +
      '\\subsubsection{subsubsection number should be 9.7.1}\n' +
      '\n' +
      '\\subsection{subsection}\n' +
      '\n' +
      '\\subsection*{subsection unnumbered}\n' +
      '\n' +
      '\\subsubsection*{subsubsection unnumbered}\n' +
      '\n' +
      '\\subsection*{subsection unnumbered}\n' +
      '\n' +
      '\\subsubsection{subsubsection number should be 9.8.1}\n',
    tokens: [
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 64
        },
        "content_test_str": "Change subsubsection number to 7 `\\setcounter{subsubsection}{7}`"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "Change subsubsection number to 7 ",
            "nextPos": 33,
            "positions": {
              "start": 0,
              "end": 33
            },
            "content_test_str": "Change subsubsection number to 7 "
          },
          {
            "type": "code_inline",
            "children": null,
            "content": "\\setcounter{subsubsection}{7}",
            "nextPos": 64,
            "positions": {
              "start": 33,
              "end": 64
            },
            "content_test_str": "`\\setcounter{subsubsection}{7}`"
          }
        ],
        "content": "Change subsubsection number to 7 `\\setcounter{subsubsection}{7}`",
        "positions": {
          "start": 0,
          "end": 64
        },
        "content_test_str": "Change subsubsection number to 7 `\\setcounter{subsubsection}{7}`"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": [],
        "content": "",
        "positions": {
          "start": 66,
          "end": 95
        },
        "content_test_str": "\\setcounter{subsubsection}{7}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "section_setcounter",
            "children": [],
            "content": "",
            "inlinePos": {
              "start": 0,
              "end": 29
            },
            "nextPos": 29,
            "positions": {
              "start": 66,
              "end": 95
            },
            "content_test_str": "\\setcounter{subsubsection}{7}"
          }
        ],
        "content": "",
        "positions": {
          "start": 66,
          "end": 95
        },
        "content_test_str": "\\setcounter{subsubsection}{7}"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 97,
          "end": 126
        },
        "content_test_str": "\\section*{section unnumbered}"
      },
      {
        "type": "section",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "section unnumbered",
            "nextPos": 18,
            "positions": {
              "start": 107,
              "end": 125
            },
            "content_test_str": "section unnumbered"
          }
        ],
        "content": "section unnumbered",
        "positions": {
          "start": 97,
          "end": 126,
          "start_content": 107,
          "end_content": 125
        },
        "content_test": "section unnumbered",
        "content_test_str": "\\section*{section unnumbered}"
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
          "start": 128,
          "end": 169
        },
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection unnumbered",
            "nextPos": 24,
            "positions": {
              "start": 144,
              "end": 168
            },
            "content_test_str": "subsubsection unnumbered"
          }
        ],
        "content": "subsubsection unnumbered",
        "positions": {
          "start": 128,
          "end": 169,
          "start_content": 144,
          "end_content": 168
        },
        "content_test": "subsubsection unnumbered",
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
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
          "start": 171,
          "end": 223
        },
        "content_test_str": "\\subsubsection{subsubsection number should be 0.0.8}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection number should be 0.0.8",
            "nextPos": 36,
            "positions": {
              "start": 186,
              "end": 222
            },
            "content_test_str": "subsubsection number should be 0.0.8"
          }
        ],
        "content": "subsubsection number should be 0.0.8",
        "positions": {
          "start": 171,
          "end": 223,
          "start_content": 186,
          "end_content": 222
        },
        "content_test": "subsubsection number should be 0.0.8",
        "content_test_str": "\\subsubsection{subsubsection number should be 0.0.8}"
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
          "start": 225,
          "end": 289
        },
        "content_test_str": "Change subsubsection number to 1 `\\setcounter{subsubsection}{1}`"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "Change subsubsection number to 1 ",
            "nextPos": 33,
            "positions": {
              "start": 225,
              "end": 258
            },
            "content_test_str": "Change subsubsection number to 1 "
          },
          {
            "type": "code_inline",
            "children": null,
            "content": "\\setcounter{subsubsection}{1}",
            "nextPos": 64,
            "positions": {
              "start": 258,
              "end": 289
            },
            "content_test_str": "`\\setcounter{subsubsection}{1}`"
          }
        ],
        "content": "Change subsubsection number to 1 `\\setcounter{subsubsection}{1}`",
        "positions": {
          "start": 225,
          "end": 289
        },
        "content_test_str": "Change subsubsection number to 1 `\\setcounter{subsubsection}{1}`"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": [],
        "content": "",
        "positions": {
          "start": 291,
          "end": 320
        },
        "content_test_str": "\\setcounter{subsubsection}{1}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "section_setcounter",
            "children": [],
            "content": "",
            "inlinePos": {
              "start": 0,
              "end": 29
            },
            "nextPos": 29,
            "positions": {
              "start": 291,
              "end": 320
            },
            "content_test_str": "\\setcounter{subsubsection}{1}"
          }
        ],
        "content": "",
        "positions": {
          "start": 291,
          "end": 320
        },
        "content_test_str": "\\setcounter{subsubsection}{1}"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 322,
          "end": 374
        },
        "content_test_str": "\\subsubsection{subsubsection number should be 0.0.2}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection number should be 0.0.2",
            "nextPos": 36,
            "positions": {
              "start": 337,
              "end": 373
            },
            "content_test_str": "subsubsection number should be 0.0.2"
          }
        ],
        "content": "subsubsection number should be 0.0.2",
        "positions": {
          "start": 322,
          "end": 374,
          "start_content": 337,
          "end_content": 373
        },
        "content_test": "subsubsection number should be 0.0.2",
        "content_test_str": "\\subsubsection{subsubsection number should be 0.0.2}"
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
          "start": 376,
          "end": 417
        },
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection unnumbered",
            "nextPos": 24,
            "positions": {
              "start": 392,
              "end": 416
            },
            "content_test_str": "subsubsection unnumbered"
          }
        ],
        "content": "subsubsection unnumbered",
        "positions": {
          "start": 376,
          "end": 417,
          "start_content": 392,
          "end_content": 416
        },
        "content_test": "subsubsection unnumbered",
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
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
          "start": 419,
          "end": 471
        },
        "content_test_str": "\\subsubsection{subsubsection number should be 0.0.3}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection number should be 0.0.3",
            "nextPos": 36,
            "positions": {
              "start": 434,
              "end": 470
            },
            "content_test_str": "subsubsection number should be 0.0.3"
          }
        ],
        "content": "subsubsection number should be 0.0.3",
        "positions": {
          "start": 419,
          "end": 471,
          "start_content": 434,
          "end_content": 470
        },
        "content_test": "subsubsection number should be 0.0.3",
        "content_test_str": "\\subsubsection{subsubsection number should be 0.0.3}"
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
          "start": 473,
          "end": 525
        },
        "content_test_str": "\\subsubsection{subsubsection number should be 0.0.4}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection number should be 0.0.4",
            "nextPos": 36,
            "positions": {
              "start": 488,
              "end": 524
            },
            "content_test_str": "subsubsection number should be 0.0.4"
          }
        ],
        "content": "subsubsection number should be 0.0.4",
        "positions": {
          "start": 473,
          "end": 525,
          "start_content": 488,
          "end_content": 524
        },
        "content_test": "subsubsection number should be 0.0.4",
        "content_test_str": "\\subsubsection{subsubsection number should be 0.0.4}"
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
          "start": 527,
          "end": 544
        },
        "content_test_str": "\\section{section}"
      },
      {
        "type": "section",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "section",
            "nextPos": 7,
            "positions": {
              "start": 536,
              "end": 543
            },
            "content_test_str": "section"
          }
        ],
        "content": "section",
        "positions": {
          "start": 527,
          "end": 544,
          "start_content": 536,
          "end_content": 543
        },
        "content_test": "section",
        "content_test_str": "\\section{section}"
      },
      {
        "type": "heading_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": [],
        "content": "",
        "positions": {
          "start": 546,
          "end": 622
        },
        "content_test_str": "Change section number to 5 `\\setcounter{section}{5}`\n\\setcounter{section}{5}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "Change section number to 5 ",
            "nextPos": 27,
            "positions": {
              "start": 546,
              "end": 573
            },
            "content_test_str": "Change section number to 5 "
          },
          {
            "type": "code_inline",
            "children": null,
            "content": "\\setcounter{section}{5}",
            "nextPos": 52,
            "positions": {
              "start": 573,
              "end": 598
            },
            "content_test_str": "`\\setcounter{section}{5}`"
          },
          {
            "type": "softbreak",
            "children": null,
            "content": "",
            "nextPos": 53,
            "positions": {
              "start": 598,
              "end": 599
            },
            "content_test_str": "\n"
          },
          {
            "type": "section_setcounter",
            "children": [],
            "content": "",
            "inlinePos": {
              "start": 53,
              "end": 76
            },
            "nextPos": 76,
            "positions": {
              "start": 599,
              "end": 622
            },
            "content_test_str": "\\setcounter{section}{5}"
          }
        ],
        "content": "",
        "positions": {
          "start": 546,
          "end": 622
        },
        "content_test_str": "Change section number to 5 `\\setcounter{section}{5}`\n\\setcounter{section}{5}"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 624,
          "end": 676
        },
        "content_test_str": "\\subsubsection{subsubsection number should be 5.0.1}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection number should be 5.0.1",
            "nextPos": 36,
            "positions": {
              "start": 639,
              "end": 675
            },
            "content_test_str": "subsubsection number should be 5.0.1"
          }
        ],
        "content": "subsubsection number should be 5.0.1",
        "positions": {
          "start": 624,
          "end": 676,
          "start_content": 639,
          "end_content": 675
        },
        "content_test": "subsubsection number should be 5.0.1",
        "content_test_str": "\\subsubsection{subsubsection number should be 5.0.1}"
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
          "start": 678,
          "end": 719
        },
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection unnumbered",
            "nextPos": 24,
            "positions": {
              "start": 694,
              "end": 718
            },
            "content_test_str": "subsubsection unnumbered"
          }
        ],
        "content": "subsubsection unnumbered",
        "positions": {
          "start": 678,
          "end": 719,
          "start_content": 694,
          "end_content": 718
        },
        "content_test": "subsubsection unnumbered",
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
      },
      {
        "type": "heading_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": [],
        "content": "",
        "positions": {
          "start": 721,
          "end": 797
        },
        "content_test_str": "Change section number to 7 `\\setcounter{section}{7}`\n\\setcounter{section}{7}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "Change section number to 7 ",
            "nextPos": 27,
            "positions": {
              "start": 721,
              "end": 748
            },
            "content_test_str": "Change section number to 7 "
          },
          {
            "type": "code_inline",
            "children": null,
            "content": "\\setcounter{section}{7}",
            "nextPos": 52,
            "positions": {
              "start": 748,
              "end": 773
            },
            "content_test_str": "`\\setcounter{section}{7}`"
          },
          {
            "type": "softbreak",
            "children": null,
            "content": "",
            "nextPos": 53,
            "positions": {
              "start": 773,
              "end": 774
            },
            "content_test_str": "\n"
          },
          {
            "type": "section_setcounter",
            "children": [],
            "content": "",
            "inlinePos": {
              "start": 53,
              "end": 76
            },
            "nextPos": 76,
            "positions": {
              "start": 774,
              "end": 797
            },
            "content_test_str": "\\setcounter{section}{7}"
          }
        ],
        "content": "",
        "positions": {
          "start": 721,
          "end": 797
        },
        "content_test_str": "Change section number to 7 `\\setcounter{section}{7}`\n\\setcounter{section}{7}"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 798,
          "end": 850
        },
        "content_test_str": "\\subsubsection{subsubsection number should be 7.0.2}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection number should be 7.0.2",
            "nextPos": 36,
            "positions": {
              "start": 813,
              "end": 849
            },
            "content_test_str": "subsubsection number should be 7.0.2"
          }
        ],
        "content": "subsubsection number should be 7.0.2",
        "positions": {
          "start": 798,
          "end": 850,
          "start_content": 813,
          "end_content": 849
        },
        "content_test": "subsubsection number should be 7.0.2",
        "content_test_str": "\\subsubsection{subsubsection number should be 7.0.2}"
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
          "start": 852,
          "end": 887
        },
        "content_test_str": "\\subsection*{subsection unnumbered}"
      },
      {
        "type": "subsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsection unnumbered",
            "nextPos": 21,
            "positions": {
              "start": 865,
              "end": 886
            },
            "content_test_str": "subsection unnumbered"
          }
        ],
        "content": "subsection unnumbered",
        "positions": {
          "start": 852,
          "end": 887,
          "start_content": 865,
          "end_content": 886
        },
        "content_test": "subsection unnumbered",
        "content_test_str": "\\subsection*{subsection unnumbered}"
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
          "start": 889,
          "end": 930
        },
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection unnumbered",
            "nextPos": 24,
            "positions": {
              "start": 905,
              "end": 929
            },
            "content_test_str": "subsubsection unnumbered"
          }
        ],
        "content": "subsubsection unnumbered",
        "positions": {
          "start": 889,
          "end": 930,
          "start_content": 905,
          "end_content": 929
        },
        "content_test": "subsubsection unnumbered",
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
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
          "start": 932,
          "end": 984
        },
        "content_test_str": "\\subsubsection{subsubsection number should be 7.0.3}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection number should be 7.0.3",
            "nextPos": 36,
            "positions": {
              "start": 947,
              "end": 983
            },
            "content_test_str": "subsubsection number should be 7.0.3"
          }
        ],
        "content": "subsubsection number should be 7.0.3",
        "positions": {
          "start": 932,
          "end": 984,
          "start_content": 947,
          "end_content": 983
        },
        "content_test": "subsubsection number should be 7.0.3",
        "content_test_str": "\\subsubsection{subsubsection number should be 7.0.3}"
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
          "start": 986,
          "end": 1038
        },
        "content_test_str": "\\subsubsection{subsubsection number should be 7.0.4}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection number should be 7.0.4",
            "nextPos": 36,
            "positions": {
              "start": 1001,
              "end": 1037
            },
            "content_test_str": "subsubsection number should be 7.0.4"
          }
        ],
        "content": "subsubsection number should be 7.0.4",
        "positions": {
          "start": 986,
          "end": 1038,
          "start_content": 1001,
          "end_content": 1037
        },
        "content_test": "subsubsection number should be 7.0.4",
        "content_test_str": "\\subsubsection{subsubsection number should be 7.0.4}"
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
          "start": 1040,
          "end": 1069
        },
        "content_test_str": "\\section*{section unnumbered}"
      },
      {
        "type": "section",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "section unnumbered",
            "nextPos": 18,
            "positions": {
              "start": 1050,
              "end": 1068
            },
            "content_test_str": "section unnumbered"
          }
        ],
        "content": "section unnumbered",
        "positions": {
          "start": 1040,
          "end": 1069,
          "start_content": 1050,
          "end_content": 1068
        },
        "content_test": "section unnumbered",
        "content_test_str": "\\section*{section unnumbered}"
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
          "start": 1071,
          "end": 1112
        },
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection unnumbered",
            "nextPos": 24,
            "positions": {
              "start": 1087,
              "end": 1111
            },
            "content_test_str": "subsubsection unnumbered"
          }
        ],
        "content": "subsubsection unnumbered",
        "positions": {
          "start": 1071,
          "end": 1112,
          "start_content": 1087,
          "end_content": 1111
        },
        "content_test": "subsubsection unnumbered",
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
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
          "start": 1114,
          "end": 1155
        },
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection unnumbered",
            "nextPos": 24,
            "positions": {
              "start": 1130,
              "end": 1154
            },
            "content_test_str": "subsubsection unnumbered"
          }
        ],
        "content": "subsubsection unnumbered",
        "positions": {
          "start": 1114,
          "end": 1155,
          "start_content": 1130,
          "end_content": 1154
        },
        "content_test": "subsubsection unnumbered",
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
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
          "start": 1157,
          "end": 1174
        },
        "content_test_str": "\\section{section}"
      },
      {
        "type": "section",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "section",
            "nextPos": 7,
            "positions": {
              "start": 1166,
              "end": 1173
            },
            "content_test_str": "section"
          }
        ],
        "content": "section",
        "positions": {
          "start": 1157,
          "end": 1174,
          "start_content": 1166,
          "end_content": 1173
        },
        "content_test": "section",
        "content_test_str": "\\section{section}"
      },
      {
        "type": "heading_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": [],
        "content": "",
        "positions": {
          "start": 1176,
          "end": 1261
        },
        "content_test_str": "Change subsection number to 7 `\\setcounter{subsection}{7}`\n\\setcounter{subsection}{7}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "Change subsection number to 7 ",
            "nextPos": 30,
            "positions": {
              "start": 1176,
              "end": 1206
            },
            "content_test_str": "Change subsection number to 7 "
          },
          {
            "type": "code_inline",
            "children": null,
            "content": "\\setcounter{subsection}{7}",
            "nextPos": 58,
            "positions": {
              "start": 1206,
              "end": 1234
            },
            "content_test_str": "`\\setcounter{subsection}{7}`"
          },
          {
            "type": "softbreak",
            "children": null,
            "content": "",
            "nextPos": 59,
            "positions": {
              "start": 1234,
              "end": 1235
            },
            "content_test_str": "\n"
          },
          {
            "type": "section_setcounter",
            "children": [],
            "content": "",
            "inlinePos": {
              "start": 59,
              "end": 85
            },
            "nextPos": 85,
            "positions": {
              "start": 1235,
              "end": 1261
            },
            "content_test_str": "\\setcounter{subsection}{7}"
          }
        ],
        "content": "",
        "positions": {
          "start": 1176,
          "end": 1261
        },
        "content_test_str": "Change subsection number to 7 `\\setcounter{subsection}{7}`\n\\setcounter{subsection}{7}"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 1263,
          "end": 1315
        },
        "content_test_str": "\\subsubsection{subsubsection number should be 8.7.1}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection number should be 8.7.1",
            "nextPos": 36,
            "positions": {
              "start": 1278,
              "end": 1314
            },
            "content_test_str": "subsubsection number should be 8.7.1"
          }
        ],
        "content": "subsubsection number should be 8.7.1",
        "positions": {
          "start": 1263,
          "end": 1315,
          "start_content": 1278,
          "end_content": 1314
        },
        "content_test": "subsubsection number should be 8.7.1",
        "content_test_str": "\\subsubsection{subsubsection number should be 8.7.1}"
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
          "start": 1317,
          "end": 1358
        },
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection unnumbered",
            "nextPos": 24,
            "positions": {
              "start": 1333,
              "end": 1357
            },
            "content_test_str": "subsubsection unnumbered"
          }
        ],
        "content": "subsubsection unnumbered",
        "positions": {
          "start": 1317,
          "end": 1358,
          "start_content": 1333,
          "end_content": 1357
        },
        "content_test": "subsubsection unnumbered",
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
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
          "start": 1360,
          "end": 1383
        },
        "content_test_str": "\\subsection{subsection}"
      },
      {
        "type": "subsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsection",
            "nextPos": 10,
            "positions": {
              "start": 1372,
              "end": 1382
            },
            "content_test_str": "subsection"
          }
        ],
        "content": "subsection",
        "positions": {
          "start": 1360,
          "end": 1383,
          "start_content": 1372,
          "end_content": 1382
        },
        "content_test": "subsection",
        "content_test_str": "\\subsection{subsection}"
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
          "start": 1385,
          "end": 1437
        },
        "content_test_str": "\\subsubsection{subsubsection number should be 8.8.1}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection number should be 8.8.1",
            "nextPos": 36,
            "positions": {
              "start": 1400,
              "end": 1436
            },
            "content_test_str": "subsubsection number should be 8.8.1"
          }
        ],
        "content": "subsubsection number should be 8.8.1",
        "positions": {
          "start": 1385,
          "end": 1437,
          "start_content": 1400,
          "end_content": 1436
        },
        "content_test": "subsubsection number should be 8.8.1",
        "content_test_str": "\\subsubsection{subsubsection number should be 8.8.1}"
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
          "start": 1439,
          "end": 1474
        },
        "content_test_str": "\\subsection*{subsection unnumbered}"
      },
      {
        "type": "subsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsection unnumbered",
            "nextPos": 21,
            "positions": {
              "start": 1452,
              "end": 1473
            },
            "content_test_str": "subsection unnumbered"
          }
        ],
        "content": "subsection unnumbered",
        "positions": {
          "start": 1439,
          "end": 1474,
          "start_content": 1452,
          "end_content": 1473
        },
        "content_test": "subsection unnumbered",
        "content_test_str": "\\subsection*{subsection unnumbered}"
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
          "start": 1476,
          "end": 1528
        },
        "content_test_str": "\\subsubsection{subsubsection number should be 8.8.2}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection number should be 8.8.2",
            "nextPos": 36,
            "positions": {
              "start": 1491,
              "end": 1527
            },
            "content_test_str": "subsubsection number should be 8.8.2"
          }
        ],
        "content": "subsubsection number should be 8.8.2",
        "positions": {
          "start": 1476,
          "end": 1528,
          "start_content": 1491,
          "end_content": 1527
        },
        "content_test": "subsubsection number should be 8.8.2",
        "content_test_str": "\\subsubsection{subsubsection number should be 8.8.2}"
      },
      {
        "type": "heading_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": [],
        "content": "",
        "positions": {
          "start": 1530,
          "end": 1624
        },
        "content_test_str": "Change subsubsection number to 7 `\\setcounter{subsubsection}{7}`\n\\setcounter{subsubsection}{7}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "Change subsubsection number to 7 ",
            "nextPos": 33,
            "positions": {
              "start": 1530,
              "end": 1563
            },
            "content_test_str": "Change subsubsection number to 7 "
          },
          {
            "type": "code_inline",
            "children": null,
            "content": "\\setcounter{subsubsection}{7}",
            "nextPos": 64,
            "positions": {
              "start": 1563,
              "end": 1594
            },
            "content_test_str": "`\\setcounter{subsubsection}{7}`"
          },
          {
            "type": "softbreak",
            "children": null,
            "content": "",
            "nextPos": 65,
            "positions": {
              "start": 1594,
              "end": 1595
            },
            "content_test_str": "\n"
          },
          {
            "type": "section_setcounter",
            "children": [],
            "content": "",
            "inlinePos": {
              "start": 65,
              "end": 94
            },
            "nextPos": 94,
            "positions": {
              "start": 1595,
              "end": 1624
            },
            "content_test_str": "\\setcounter{subsubsection}{7}"
          }
        ],
        "content": "",
        "positions": {
          "start": 1530,
          "end": 1624
        },
        "content_test_str": "Change subsubsection number to 7 `\\setcounter{subsubsection}{7}`\n\\setcounter{subsubsection}{7}"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 1626,
          "end": 1678
        },
        "content_test_str": "\\subsubsection{subsubsection number should be 8.8.8}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection number should be 8.8.8",
            "nextPos": 36,
            "positions": {
              "start": 1641,
              "end": 1677
            },
            "content_test_str": "subsubsection number should be 8.8.8"
          }
        ],
        "content": "subsubsection number should be 8.8.8",
        "positions": {
          "start": 1626,
          "end": 1678,
          "start_content": 1641,
          "end_content": 1677
        },
        "content_test": "subsubsection number should be 8.8.8",
        "content_test_str": "\\subsubsection{subsubsection number should be 8.8.8}"
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
          "start": 1680,
          "end": 1703
        },
        "content_test_str": "\\subsection{subsection}"
      },
      {
        "type": "subsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsection",
            "nextPos": 10,
            "positions": {
              "start": 1692,
              "end": 1702
            },
            "content_test_str": "subsection"
          }
        ],
        "content": "subsection",
        "positions": {
          "start": 1680,
          "end": 1703,
          "start_content": 1692,
          "end_content": 1702
        },
        "content_test": "subsection",
        "content_test_str": "\\subsection{subsection}"
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
          "start": 1705,
          "end": 1757
        },
        "content_test_str": "\\subsubsection{subsubsection number should be 8.9.1}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection number should be 8.9.1",
            "nextPos": 36,
            "positions": {
              "start": 1720,
              "end": 1756
            },
            "content_test_str": "subsubsection number should be 8.9.1"
          }
        ],
        "content": "subsubsection number should be 8.9.1",
        "positions": {
          "start": 1705,
          "end": 1757,
          "start_content": 1720,
          "end_content": 1756
        },
        "content_test": "subsubsection number should be 8.9.1",
        "content_test_str": "\\subsubsection{subsubsection number should be 8.9.1}"
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
          "start": 1759,
          "end": 1800
        },
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection unnumbered",
            "nextPos": 24,
            "positions": {
              "start": 1775,
              "end": 1799
            },
            "content_test_str": "subsubsection unnumbered"
          }
        ],
        "content": "subsubsection unnumbered",
        "positions": {
          "start": 1759,
          "end": 1800,
          "start_content": 1775,
          "end_content": 1799
        },
        "content_test": "subsubsection unnumbered",
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
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
          "start": 1802,
          "end": 1854
        },
        "content_test_str": "\\subsubsection{subsubsection number should be 8.9.2}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection number should be 8.9.2",
            "nextPos": 36,
            "positions": {
              "start": 1817,
              "end": 1853
            },
            "content_test_str": "subsubsection number should be 8.9.2"
          }
        ],
        "content": "subsubsection number should be 8.9.2",
        "positions": {
          "start": 1802,
          "end": 1854,
          "start_content": 1817,
          "end_content": 1853
        },
        "content_test": "subsubsection number should be 8.9.2",
        "content_test_str": "\\subsubsection{subsubsection number should be 8.9.2}"
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
          "start": 1856,
          "end": 1891
        },
        "content_test_str": "\\subsection*{subsection unnumbered}"
      },
      {
        "type": "subsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsection unnumbered",
            "nextPos": 21,
            "positions": {
              "start": 1869,
              "end": 1890
            },
            "content_test_str": "subsection unnumbered"
          }
        ],
        "content": "subsection unnumbered",
        "positions": {
          "start": 1856,
          "end": 1891,
          "start_content": 1869,
          "end_content": 1890
        },
        "content_test": "subsection unnumbered",
        "content_test_str": "\\subsection*{subsection unnumbered}"
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
          "start": 1893,
          "end": 1910
        },
        "content_test_str": "\\section{section}"
      },
      {
        "type": "section",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "section",
            "nextPos": 7,
            "positions": {
              "start": 1902,
              "end": 1909
            },
            "content_test_str": "section"
          }
        ],
        "content": "section",
        "positions": {
          "start": 1893,
          "end": 1910,
          "start_content": 1902,
          "end_content": 1909
        },
        "content_test": "section",
        "content_test_str": "\\section{section}"
      },
      {
        "type": "heading_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": [],
        "content": "",
        "positions": {
          "start": 1912,
          "end": 1997
        },
        "content_test_str": "Change subsection number to 7 `\\setcounter{subsection}{7}`\n\\setcounter{subsection}{7}"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "Change subsection number to 7 ",
            "nextPos": 30,
            "positions": {
              "start": 1912,
              "end": 1942
            },
            "content_test_str": "Change subsection number to 7 "
          },
          {
            "type": "code_inline",
            "children": null,
            "content": "\\setcounter{subsection}{7}",
            "nextPos": 58,
            "positions": {
              "start": 1942,
              "end": 1970
            },
            "content_test_str": "`\\setcounter{subsection}{7}`"
          },
          {
            "type": "softbreak",
            "children": null,
            "content": "",
            "nextPos": 59,
            "positions": {
              "start": 1970,
              "end": 1971
            },
            "content_test_str": "\n"
          },
          {
            "type": "section_setcounter",
            "children": [],
            "content": "",
            "inlinePos": {
              "start": 59,
              "end": 85
            },
            "nextPos": 85,
            "positions": {
              "start": 1971,
              "end": 1997
            },
            "content_test_str": "\\setcounter{subsection}{7}"
          }
        ],
        "content": "",
        "positions": {
          "start": 1912,
          "end": 1997
        },
        "content_test_str": "Change subsection number to 7 `\\setcounter{subsection}{7}`\n\\setcounter{subsection}{7}"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 1999,
          "end": 2040
        },
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection unnumbered",
            "nextPos": 24,
            "positions": {
              "start": 2015,
              "end": 2039
            },
            "content_test_str": "subsubsection unnumbered"
          }
        ],
        "content": "subsubsection unnumbered",
        "positions": {
          "start": 1999,
          "end": 2040,
          "start_content": 2015,
          "end_content": 2039
        },
        "content_test": "subsubsection unnumbered",
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
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
          "start": 2042,
          "end": 2077
        },
        "content_test_str": "\\subsection*{subsection unnumbered}"
      },
      {
        "type": "subsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsection unnumbered",
            "nextPos": 21,
            "positions": {
              "start": 2055,
              "end": 2076
            },
            "content_test_str": "subsection unnumbered"
          }
        ],
        "content": "subsection unnumbered",
        "positions": {
          "start": 2042,
          "end": 2077,
          "start_content": 2055,
          "end_content": 2076
        },
        "content_test": "subsection unnumbered",
        "content_test_str": "\\subsection*{subsection unnumbered}"
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
          "start": 2079,
          "end": 2131
        },
        "content_test_str": "\\subsubsection{subsubsection number should be 9.7.1}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection number should be 9.7.1",
            "nextPos": 36,
            "positions": {
              "start": 2094,
              "end": 2130
            },
            "content_test_str": "subsubsection number should be 9.7.1"
          }
        ],
        "content": "subsubsection number should be 9.7.1",
        "positions": {
          "start": 2079,
          "end": 2131,
          "start_content": 2094,
          "end_content": 2130
        },
        "content_test": "subsubsection number should be 9.7.1",
        "content_test_str": "\\subsubsection{subsubsection number should be 9.7.1}"
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
          "start": 2133,
          "end": 2156
        },
        "content_test_str": "\\subsection{subsection}"
      },
      {
        "type": "subsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsection",
            "nextPos": 10,
            "positions": {
              "start": 2145,
              "end": 2155
            },
            "content_test_str": "subsection"
          }
        ],
        "content": "subsection",
        "positions": {
          "start": 2133,
          "end": 2156,
          "start_content": 2145,
          "end_content": 2155
        },
        "content_test": "subsection",
        "content_test_str": "\\subsection{subsection}"
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
          "start": 2158,
          "end": 2193
        },
        "content_test_str": "\\subsection*{subsection unnumbered}"
      },
      {
        "type": "subsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsection unnumbered",
            "nextPos": 21,
            "positions": {
              "start": 2171,
              "end": 2192
            },
            "content_test_str": "subsection unnumbered"
          }
        ],
        "content": "subsection unnumbered",
        "positions": {
          "start": 2158,
          "end": 2193,
          "start_content": 2171,
          "end_content": 2192
        },
        "content_test": "subsection unnumbered",
        "content_test_str": "\\subsection*{subsection unnumbered}"
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
          "start": 2195,
          "end": 2236
        },
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection unnumbered",
            "nextPos": 24,
            "positions": {
              "start": 2211,
              "end": 2235
            },
            "content_test_str": "subsubsection unnumbered"
          }
        ],
        "content": "subsubsection unnumbered",
        "positions": {
          "start": 2195,
          "end": 2236,
          "start_content": 2211,
          "end_content": 2235
        },
        "content_test": "subsubsection unnumbered",
        "content_test_str": "\\subsubsection*{subsubsection unnumbered}"
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
          "start": 2238,
          "end": 2273
        },
        "content_test_str": "\\subsection*{subsection unnumbered}"
      },
      {
        "type": "subsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsection unnumbered",
            "nextPos": 21,
            "positions": {
              "start": 2251,
              "end": 2272
            },
            "content_test_str": "subsection unnumbered"
          }
        ],
        "content": "subsection unnumbered",
        "positions": {
          "start": 2238,
          "end": 2273,
          "start_content": 2251,
          "end_content": 2272
        },
        "content_test": "subsection unnumbered",
        "content_test_str": "\\subsection*{subsection unnumbered}"
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
          "start": 2275,
          "end": 2327
        },
        "content_test_str": "\\subsubsection{subsubsection number should be 9.8.1}"
      },
      {
        "type": "subsubsection",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "subsubsection number should be 9.8.1",
            "nextPos": 36,
            "positions": {
              "start": 2290,
              "end": 2326
            },
            "content_test_str": "subsubsection number should be 9.8.1"
          }
        ],
        "content": "subsubsection number should be 9.8.1",
        "positions": {
          "start": 2275,
          "end": 2327,
          "start_content": 2290,
          "end_content": 2326
        },
        "content_test": "subsubsection number should be 9.8.1",
        "content_test_str": "\\subsubsection{subsubsection number should be 9.8.1}"
      },
      {
        "type": "heading_close",
        "children": null,
        "content": ""
      }
    ]

  }
];
