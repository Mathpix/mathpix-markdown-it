module.exports = [
  {
    mmd: 'List is really easy to create\n' +
      '\n' +
      '\\begin{itemize}\n' +
      '  \\item One entry in the list\n' +
      '  \\item Another entry in the list\n' +
      '\\end{itemize}',
    tokens: [
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 29
        },
        "content_test_str": "List is really easy to create"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "List is really easy to create",
            "nextPos": 29,
            "positions": {
              "start": 0,
              "end": 29
            },
            "content_test_str": "List is really easy to create"
          }
        ],
        "content": "List is really easy to create",
        "positions": {
          "start": 0,
          "end": 29
        },
        "content_test_str": "List is really easy to create"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "itemize_list_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 31,
          "end": 124
        },
        "content_test_str": "\\begin{itemize}\n  \\item One entry in the list\n  \\item Another entry in the list\n\\end{itemize}"
      },
      {
        "type": "latex_list_item_open",
        "children": null,
        "content": "",
        "parentType": "itemize",
        "inlinePos": {
          "start_content": 6,
          "end_content": 28
        },
        "itemizeLevelContents": [
          "\\textbullet",
          "\\textendash",
          "\\textasteriskcentered",
          "\\textperiodcentered"
        ]
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "One entry in the list",
            "nextPos": 21,
            "positions": {
              "start": 55,
              "end": 76
            },
            "content_test_str": "One entry in the list"
          }
        ],
        "content": "",
        "parentType": "itemize",
        "positions": {
          "start": 55,
          "end": 76
        },
        "content_test_str": "One entry in the list"
      },
      {
        "type": "latex_list_item_close",
        "children": null,
        "content": "",
        "nextPos": 27,
        "parentType": "itemize",
        "itemizeLevelContents": [
          "\\textbullet",
          "\\textendash",
          "\\textasteriskcentered",
          "\\textperiodcentered"
        ]
      },
      {
        "type": "latex_list_item_open",
        "children": null,
        "content": "",
        "parentType": "itemize",
        "inlinePos": {
          "start_content": 6,
          "end_content": 32
        },
        "itemizeLevelContents": [
          "\\textbullet",
          "\\textendash",
          "\\textasteriskcentered",
          "\\textperiodcentered"
        ]
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "Another entry in the list",
            "nextPos": 25,
            "positions": {
              "start": 85,
              "end": 110
            },
            "content_test_str": "Another entry in the list"
          }
        ],
        "content": "",
        "parentType": "itemize",
        "positions": {
          "start": 85,
          "end": 110
        },
        "content_test_str": "Another entry in the list"
      },
      {
        "type": "latex_list_item_close",
        "children": null,
        "content": "",
        "nextPos": 31,
        "parentType": "itemize",
        "itemizeLevelContents": [
          "\\textbullet",
          "\\textendash",
          "\\textasteriskcentered",
          "\\textperiodcentered"
        ]
      },
      {
        "type": "itemize_list_close",
        "children": null,
        "content": "",
        "positions": {
          "start": 31,
          "end": 110
        },
        "content_test_str": "\\begin{itemize}\n  \\item One entry in the list\n  \\item Another entry in the list"
      }
    ]
  },
  {
    mmd: '\\begin{itemize} \n' +
      '\\item `\\labelenumi` for Level 1\n' +
      '\\item `\\labelenumii` for Level 2\n' +
      '\\item `\\labelenumiii` for Level 3\n' +
      '\\item `\\labelenumiv` for Level 4\n' +
      '\\end{itemize}',
    tokens: [
      {
        "type": "itemize_list_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 162
        },
        "content_test_str": "\\begin{itemize} \n\\item `\\labelenumi` for Level 1\n\\item `\\labelenumii` for Level 2\n\\item `\\labelenumiii` for Level 3\n\\item `\\labelenumiv` for Level 4\n\\end{itemize}"
      },
      {
        "type": "latex_list_item_open",
        "children": null,
        "content": "",
        "parentType": "itemize",
        "positions": {
          "start": 17,
          "end": 48
        },
        "content_test_str": "\\item `\\labelenumi` for Level 1"
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
            "type": "code_inline",
            "children": null,
            "content": "\\labelenumi",
            "nextPos": 13
          },
          {
            "type": "text",
            "children": null,
            "content": " for Level 1",
            "nextPos": 25
          }
        ],
        "content": "`\\labelenumi` for Level 1"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "latex_list_item_close",
        "children": null,
        "content": ""
      },
      {
        "type": "latex_list_item_open",
        "children": null,
        "content": "",
        "parentType": "itemize",
        "positions": {
          "start": 49,
          "end": 81
        },
        "content_test_str": "\\item `\\labelenumii` for Level 2"
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
            "type": "code_inline",
            "children": null,
            "content": "\\labelenumii",
            "nextPos": 14
          },
          {
            "type": "text",
            "children": null,
            "content": " for Level 2",
            "nextPos": 26
          }
        ],
        "content": "`\\labelenumii` for Level 2"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "latex_list_item_close",
        "children": null,
        "content": ""
      },
      {
        "type": "latex_list_item_open",
        "children": null,
        "content": "",
        "parentType": "itemize",
        "positions": {
          "start": 82,
          "end": 115
        },
        "content_test_str": "\\item `\\labelenumiii` for Level 3"
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
            "type": "code_inline",
            "children": null,
            "content": "\\labelenumiii",
            "nextPos": 15
          },
          {
            "type": "text",
            "children": null,
            "content": " for Level 3",
            "nextPos": 27
          }
        ],
        "content": "`\\labelenumiii` for Level 3"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "latex_list_item_close",
        "children": null,
        "content": ""
      },
      {
        "type": "latex_list_item_open",
        "children": null,
        "content": "",
        "parentType": "itemize",
        "positions": {
          "start": 116,
          "end": 148
        },
        "content_test_str": "\\item `\\labelenumiv` for Level 4"
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
            "type": "code_inline",
            "children": null,
            "content": "\\labelenumiv",
            "nextPos": 14
          },
          {
            "type": "text",
            "children": null,
            "content": " for Level 4",
            "nextPos": 26
          }
        ],
        "content": "`\\labelenumiv` for Level 4"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "latex_list_item_close",
        "children": null,
        "content": ""
      },
      {
        "type": "itemize_list_close",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 148
        },
        "content_test_str": "\\begin{itemize} \n\\item `\\labelenumi` for Level 1\n\\item `\\labelenumii` for Level 2\n\\item `\\labelenumiii` for Level 3\n\\item `\\labelenumiv` for Level 4"
      }
    ]
  },
  {
    mmd: '\\begin{enumerate}\n' +
      '  \\item The labels consist of sequential numbers.\n' +
      '  \\item The numbers start at 1 with every call to the enumerate environment.\n' +
      '\\end{enumerate}',
    tokens: [
      {
        "type": "enumerate_list_open",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 160
        },
        "content_test_str": "\\begin{enumerate}\n  \\item The labels consist of sequential numbers.\n  \\item The numbers start at 1 with every call to the enumerate environment.\n\\end{enumerate}"
      },
      {
        "type": "latex_list_item_open",
        "children": null,
        "content": "",
        "parentType": "enumerate",
        "inlinePos": {
          "start_content": 6,
          "end_content": 48
        },
        "itemizeLevelContents": [
          "\\textbullet",
          "\\textendash",
          "\\textasteriskcentered",
          "\\textperiodcentered"
        ]
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "The labels consist of sequential numbers.",
            "nextPos": 41,
            "positions": {
              "start": 26,
              "end": 67
            },
            "content_test_str": "The labels consist of sequential numbers."
          }
        ],
        "content": "",
        "parentType": "enumerate",
        "positions": {
          "start": 26,
          "end": 67
        },
        "content_test_str": "The labels consist of sequential numbers."
      },
      {
        "type": "latex_list_item_close",
        "children": null,
        "content": "",
        "nextPos": 47,
        "parentType": "enumerate",
        "itemizeLevelContents": [
          "\\textbullet",
          "\\textendash",
          "\\textasteriskcentered",
          "\\textperiodcentered"
        ]
      },
      {
        "type": "latex_list_item_open",
        "children": null,
        "content": "",
        "parentType": "enumerate",
        "inlinePos": {
          "start_content": 6,
          "end_content": 75
        },
        "itemizeLevelContents": [
          "\\textbullet",
          "\\textendash",
          "\\textasteriskcentered",
          "\\textperiodcentered"
        ]
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "The numbers start at 1 with every call to the enumerate environment.",
            "nextPos": 68,
            "positions": {
              "start": 76,
              "end": 144
            },
            "content_test_str": "The numbers start at 1 with every call to the enumerate environment."
          }
        ],
        "content": "",
        "parentType": "enumerate",
        "positions": {
          "start": 76,
          "end": 144
        },
        "content_test_str": "The numbers start at 1 with every call to the enumerate environment."
      },
      {
        "type": "latex_list_item_close",
        "children": null,
        "content": "",
        "nextPos": 74,
        "parentType": "enumerate",
        "itemizeLevelContents": [
          "\\textbullet",
          "\\textendash",
          "\\textasteriskcentered",
          "\\textperiodcentered"
        ]
      },
      {
        "type": "enumerate_list_close",
        "children": null,
        "content": "",
        "positions": {
          "start": 0,
          "end": 144
        },
        "content_test_str": "\\begin{enumerate}\n  \\item The labels consist of sequential numbers.\n  \\item The numbers start at 1 with every call to the enumerate environment."
      }
    ]
  }
];
