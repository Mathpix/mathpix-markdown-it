module.exports = [
  {
    "mmd": "\\begin{tabular} { l }\nA \\\\ \\hline B\n\\end{tabular}",
    "tokens": [
      {
        "type": "paragraph_open",
        "children": null,
        "content": ""
      },
      {
        "type": "tabular",
        "children": [
          {
            "type": "table_open"
          },
          {
            "type": "tbody_open"
          },
          {
            "type": "tr_open"
          },
          {
            "type": "td_open"
          },
          {
            "type": "inline",
            "content": "A",
            "children": [
              {
                "type": "text",
                "children": null,
                "content": "A",
                "nextPos": 1
              }
            ]
          },
          {
            "token": "td_close",
            "type": "td_close",
            "tag": "td",
            "n": -1
          },
          {
            "token": "tr_close",
            "type": "tr_close",
            "tag": "tr",
            "n": -1
          },
          {
            "type": "tr_open"
          },
          {
            "type": "td_open"
          },
          {
            "type": "inline",
            "content": "B",
            "children": [
              {
                "type": "text",
                "children": null,
                "content": "B",
                "nextPos": 1
              }
            ]
          },
          {
            "token": "td_close",
            "type": "td_close",
            "tag": "td",
            "n": -1
          },
          {
            "token": "tr_close",
            "type": "tr_close",
            "tag": "tr",
            "n": -1
          },
          {
            "token": "tbody_close",
            "type": "tbody_close",
            "tag": "tbody",
            "n": -1
          },
          {
            "token": "table_close",
            "type": "table_close",
            "tag": "table",
            "n": -1
          }
        ],
        "content": "\nA \\\\ \\hline B\n"
      },
      {
        "type": "inline",
        "children": [],
        "content": ""
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      }
    ]
  },
  {
    "mmd": "\\begin{tabular} { l }  \\( \\qquad \\)  \\begin{tabular} { | l | } \\hline 1 \\end{tabular} \\\\ \\hline 4 \\end{tabular}",
    "tokens": [
      {
        "type": "paragraph_open",
        "children": null,
        "content": ""
      },
      {
        "type": "tabular",
        "children": [
          {
            "type": "table_open"
          },
          {
            "type": "tbody_open"
          },
          {
            "type": "tr_open"
          },
          {
            "type": "td_open"
          },
          {
            "content": "\\( \\qquad \\)\\begin{tabular} { | l | } \\hline 1 \\end{tabular}",
            "type": "subTabular",
            "children": [
              {
                "type": "inline_math",
                "children": null,
                "content": " \\qquad ",
                "inlinePos": {
                  "start": 0,
                  "end": 12,
                  "start_content": 2,
                  "end_content": 10
                },
                "nextPos": 12
              },
              {
                "type": "tabular_inline",
                "children": [
                  {
                    "type": "table_open"
                  },
                  {
                    "type": "tbody_open"
                  },
                  {
                    "type": "tr_open"
                  },
                  {
                    "type": "td_open"
                  },
                  {
                    "type": "inline",
                    "content": "1",
                    "children": [
                      {
                        "type": "text",
                        "children": null,
                        "content": "1",
                        "nextPos": 1
                      }
                    ]
                  },
                  {
                    "token": "td_close",
                    "type": "td_close",
                    "tag": "td",
                    "n": -1
                  },
                  {
                    "token": "tr_close",
                    "type": "tr_close",
                    "tag": "tr",
                    "n": -1
                  },
                  {
                    "token": "tbody_close",
                    "type": "tbody_close",
                    "tag": "tbody",
                    "n": -1
                  },
                  {
                    "token": "table_close",
                    "type": "table_close",
                    "tag": "table",
                    "n": -1
                  }
                ],
                "content": "\\begin{tabular} { | l | } \\hline 1 \\end{tabular}",
                "nextPos": 60
              }
            ]
          },
          {
            "token": "td_close",
            "type": "td_close",
            "tag": "td",
            "n": -1
          },
          {
            "token": "tr_close",
            "type": "tr_close",
            "tag": "tr",
            "n": -1
          },
          {
            "type": "tr_open"
          },
          {
            "type": "td_open"
          },
          {
            "type": "inline",
            "content": "4",
            "children": [
              {
                "type": "text",
                "children": null,
                "content": "4",
                "nextPos": 1
              }
            ]
          },
          {
            "token": "td_close",
            "type": "td_close",
            "tag": "td",
            "n": -1
          },
          {
            "token": "tr_close",
            "type": "tr_close",
            "tag": "tr",
            "n": -1
          },
          {
            "token": "tbody_close",
            "type": "tbody_close",
            "tag": "tbody",
            "n": -1
          },
          {
            "token": "table_close",
            "type": "table_close",
            "tag": "table",
            "n": -1
          }
        ],
        "content": "  \\( \\qquad \\)  \\begin{tabular} { | l | } \\hline 1 \\end{tabular} \\\\ \\hline 4 "
      },
      {
        "type": "inline",
        "children": [],
        "content": ""
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      }
    ]
  },
  {
    "mmd": "Paragraph before.\n\n\\begin{tabular} { c } X \\end{tabular}\n\nParagraph after.",
    "tokens": [
      {
        "type": "paragraph_open",
        "children": null,
        "content": ""
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "Paragraph before.",
            "nextPos": 17
          }
        ],
        "content": "Paragraph before."
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": null,
        "content": ""
      },
      {
        "type": "tabular",
        "children": [
          {
            "type": "table_open"
          },
          {
            "type": "tbody_open"
          },
          {
            "type": "tr_open"
          },
          {
            "type": "td_open"
          },
          {
            "type": "inline",
            "content": "X",
            "children": [
              {
                "type": "text",
                "children": null,
                "content": "X",
                "nextPos": 1
              }
            ]
          },
          {
            "token": "td_close",
            "type": "td_close",
            "tag": "td",
            "n": -1
          },
          {
            "token": "tr_close",
            "type": "tr_close",
            "tag": "tr",
            "n": -1
          },
          {
            "token": "tbody_close",
            "type": "tbody_close",
            "tag": "tbody",
            "n": -1
          },
          {
            "token": "table_close",
            "type": "table_close",
            "tag": "table",
            "n": -1
          }
        ],
        "content": " X "
      },
      {
        "type": "inline",
        "children": [],
        "content": ""
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_open",
        "children": null,
        "content": ""
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "Paragraph after.",
            "nextPos": 16
          }
        ],
        "content": "Paragraph after."
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      }
    ]
  }
];
