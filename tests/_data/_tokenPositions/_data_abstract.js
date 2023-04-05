module.exports = [
  {
    mmd: '\\begin{abstract} \n' +
      '      Some text\n' +
      '    \\end{abstract}\n' +
      '\n' +
      '\\begin{abstract} \n' +
      'Some text1\n' +
      'Some text2\n' +
      'Some text3\n' +
      'Some text4\n' +
      '\\end{abstract}\n' +
      '\n' +
      'October 10, 2008\n' +
      '\n' +
      '\\begin{abstract}\n' +
      'A vector-valued random variable \\(X=\\left[\\begin{array}{lll}X_{1} & \\cdots X_{n}\\end{array}\\right]^{T}\\) is said to have a multivariate normal (or Gaussian) distribution with mean \\(\\mu \\in \\mathbf{R}^{n}\\) and covariance matrix \\(\\Sigma \\in \\mathbf{S}_{++}^{n}{ }^{1}\\) if its probability density function \\({ }^{2}\\) is given by\n' +
      '\n' +
      'We write this as \\(X \\sim \\mathcal{N}(\\mu, \\Sigma)\\). In these notes, we describe multivariate Gaussians and some of their basic properties.\n' +
      '\\end{abstract}\n' +
      '\n' +
      '\\begin{abstract}\n' +
      'With the capability of modeling bidirectional contexts, denoising autoencoding based pretraining like BERT achieves better performance than pretraining approaches based on autoregressive language modeling. However, relying on corrupting the input with masks, BERT neglects dependency between the masked positions and suffers from a pretrain-finetune discrepancy. In light of these pros and cons, we propose XLNet, a generalized autoregressive pretraining method that (1) enables learning bidirectional contexts by maximizing the expected likelihood over all permutations of the factorization order and (2) overcomes the limitations of BERT thanks to its autoregressive formulation. Furthermore, XLNet integrates ideas from Transformer-XL, the state-of-the-art autoregressive model, into pretraining. Empirically, XLNet outperforms BERT on 20 tasks, often by a large margin, and achieves state-of-the-art results on 18 tasks including question answering, natural language inference, sentiment analysis, and document ranking $\\bigsqcup^{1}$\n' +
      '\\end{abstract}\n',
    tokens: [
      {
        "type": "paragraph_open",
        "children": null,
        "content": "",
        "mmd_type": "abstract",
        "positions": {
          "start": 0,
          "end": 52
        },
        "content_test_str": "\\begin{abstract} \n      Some text\n    \\end{abstract}"
      },
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "mmd_type": "abstract_title"
      },
      {
        "type": "text",
        "children": [],
        "content": "Abstract"
      },
      {
        "type": "heading_close",
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
            "content": "Some text",
            "nextPos": 9,
            "positions": {
              "start": 24,
              "end": 33
            },
            "content_test_str": "Some text"
          }
        ],
        "content": "Some text",
        "mmd_type": "abstract_content",
        "positions": {
          "start": 24,
          "end": 34
        },
        "content_test_str": "Some text\n"
      },
      {
        "type": "paragraph_close",
        "children": null,
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
        "content": "",
        "mmd_type": "abstract",
        "positions": {
          "start": 54,
          "end": 130
        },
        "content_test_str": "\\begin{abstract} \nSome text1\nSome text2\nSome text3\nSome text4\n\\end{abstract}"
      },
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "mmd_type": "abstract_title"
      },
      {
        "type": "text",
        "children": [],
        "content": "Abstract"
      },
      {
        "type": "heading_close",
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
            "content": "Some text1 Some text2 Some text3 Some text4",
            "nextPos": 43,
            "positions": {
              "start": 72,
              "end": 115
            },
            "content_test_str": "Some text1\nSome text2\nSome text3\nSome text4"
          }
        ],
        "content": "Some text1 Some text2 Some text3 Some text4",
        "mmd_type": "abstract_content",
        "positions": {
          "start": 72,
          "end": 115
        },
        "content_test_str": "Some text1\nSome text2\nSome text3\nSome text4"
      },
      {
        "type": "paragraph_close",
        "children": null,
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
        "content": "",
        "positions": {
          "start": 132,
          "end": 148
        },
        "content_test_str": "October 10, 2008"
      },
      {
        "type": "inline",
        "children": [
          {
            "type": "text",
            "children": null,
            "content": "October 10, 2008",
            "nextPos": 16,
            "positions": {
              "start": 132,
              "end": 148
            },
            "content_test_str": "October 10, 2008"
          }
        ],
        "content": "October 10, 2008",
        "positions": {
          "start": 132,
          "end": 148
        },
        "content_test_str": "October 10, 2008"
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
        "mmd_type": "abstract",
        "positions": {
          "start": 150,
          "end": 654
        },
        "content_test_str": "\\begin{abstract}\nA vector-valued random variable \\(X=\\left[\\begin{array}{lll}X_{1} & \\cdots X_{n}\\end{array}\\right]^{T}\\) is said to have a multivariate normal (or Gaussian) distribution with mean \\(\\mu \\in \\mathbf{R}^{n}\\) and covariance matrix \\(\\Sigma \\in \\mathbf{S}_{++}^{n}{ }^{1}\\) if its probability density function \\({ }^{2}\\) is given by\n\nWe write this as \\(X \\sim \\mathcal{N}(\\mu, \\Sigma)\\). In these notes, we describe multivariate Gaussians and some of their basic properties.\n\\end{abstract}"
      },
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "mmd_type": "abstract_title"
      },
      {
        "type": "text",
        "children": [],
        "content": "Abstract"
      },
      {
        "type": "heading_close",
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
            "content": "A vector-valued random variable ",
            "nextPos": 32,
            "positions": {
              "start": 167,
              "end": 199
            },
            "content_test_str": "A vector-valued random variable "
          },
          {
            "type": "inline_math",
            "children": null,
            "content": "X=\\left[\\begin{array}{lll}X_{1} & \\cdots X_{n}\\end{array}\\right]^{T}",
            "math_env": "",
            "inlinePos": {
              "start": 32,
              "end": 104
            },
            "canonicalized": [
              "X",
              "=",
              "\\left",
              "[",
              "\\begin",
              "{",
              "array",
              "}",
              "{",
              "lll",
              "}",
              "X",
              "_",
              "{",
              "1",
              "}",
              "&",
              "\\cdots",
              "X",
              "_",
              "{",
              "n",
              "}",
              "\\end",
              "{",
              "array",
              "}",
              "\\right",
              "]",
              "^",
              "{",
              "T",
              "}"
            ],
            "labels": {},
            "idLabels": "",
            "number": 0,
            "begin_number": 1,
            "attrNumber": "0",
            "nextPos": 104,
            "positions": {
              "start": 199,
              "end": 271
            },
            "content_test_str": "\\(X=\\left[\\begin{array}{lll}X_{1} & \\cdots X_{n}\\end{array}\\right]^{T}\\)"
          },
          {
            "type": "text",
            "children": null,
            "content": " is said to have a multivariate normal (or Gaussian) distribution with mean ",
            "nextPos": 180,
            "positions": {
              "start": 271,
              "end": 347
            },
            "content_test_str": " is said to have a multivariate normal (or Gaussian) distribution with mean "
          },
          {
            "type": "inline_math",
            "children": null,
            "content": "\\mu \\in \\mathbf{R}^{n}",
            "math_env": "",
            "inlinePos": {
              "start": 180,
              "end": 206
            },
            "canonicalized": [
              "\\mu",
              "\\in",
              "\\mathbf",
              "{",
              "R",
              "}",
              "^",
              "{",
              "n",
              "}"
            ],
            "labels": {},
            "idLabels": "",
            "number": 0,
            "begin_number": 1,
            "attrNumber": "0",
            "nextPos": 206,
            "positions": {
              "start": 347,
              "end": 373
            },
            "content_test_str": "\\(\\mu \\in \\mathbf{R}^{n}\\)"
          },
          {
            "type": "text",
            "children": null,
            "content": " and covariance matrix ",
            "nextPos": 229,
            "positions": {
              "start": 373,
              "end": 396
            },
            "content_test_str": " and covariance matrix "
          },
          {
            "type": "inline_math",
            "children": null,
            "content": "\\Sigma \\in \\mathbf{S}_{++}^{n}{ }^{1}",
            "math_env": "",
            "inlinePos": {
              "start": 229,
              "end": 270
            },
            "canonicalized": [
              "\\Sigma",
              "\\in",
              "\\mathbf",
              "{",
              "S",
              "}",
              "_",
              "{",
              "+",
              "+",
              "}",
              "^",
              "{",
              "n",
              "}",
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
            "nextPos": 270,
            "positions": {
              "start": 396,
              "end": 437
            },
            "content_test_str": "\\(\\Sigma \\in \\mathbf{S}_{++}^{n}{ }^{1}\\)"
          },
          {
            "type": "text",
            "children": null,
            "content": " if its probability density function ",
            "nextPos": 307,
            "positions": {
              "start": 437,
              "end": 474
            },
            "content_test_str": " if its probability density function "
          },
          {
            "type": "inline_math",
            "children": null,
            "content": "{ }^{2}",
            "math_env": "",
            "inlinePos": {
              "start": 307,
              "end": 318
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
            "nextPos": 318,
            "positions": {
              "start": 474,
              "end": 485
            },
            "content_test_str": "\\({ }^{2}\\)"
          },
          {
            "type": "text",
            "children": null,
            "content": " is given by",
            "nextPos": 330,
            "positions": {
              "start": 485,
              "end": 497
            },
            "content_test_str": " is given by"
          }
        ],
        "content": "A vector-valued random variable \\(X=\\left[\\begin{array}{lll}X_{1} & \\cdots X_{n}\\end{array}\\right]^{T}\\) is said to have a multivariate normal (or Gaussian) distribution with mean \\(\\mu \\in \\mathbf{R}^{n}\\) and covariance matrix \\(\\Sigma \\in \\mathbf{S}_{++}^{n}{ }^{1}\\) if its probability density function \\({ }^{2}\\) is given by",
        "mmd_type": "abstract_content",
        "positions": {
          "start": 167,
          "end": 497
        },
        "content_test_str": "A vector-valued random variable \\(X=\\left[\\begin{array}{lll}X_{1} & \\cdots X_{n}\\end{array}\\right]^{T}\\) is said to have a multivariate normal (or Gaussian) distribution with mean \\(\\mu \\in \\mathbf{R}^{n}\\) and covariance matrix \\(\\Sigma \\in \\mathbf{S}_{++}^{n}{ }^{1}\\) if its probability density function \\({ }^{2}\\) is given by"
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
            "content": "We write this as ",
            "nextPos": 17,
            "positions": {
              "start": 499,
              "end": 516
            },
            "content_test_str": "We write this as "
          },
          {
            "type": "inline_math",
            "children": null,
            "content": "X \\sim \\mathcal{N}(\\mu, \\Sigma)",
            "math_env": "",
            "inlinePos": {
              "start": 17,
              "end": 52
            },
            "canonicalized": [
              "X",
              "\\sim",
              "\\mathcal",
              "{",
              "N",
              "}",
              "(",
              "\\mu",
              ",",
              "\\Sigma",
              ")"
            ],
            "labels": {},
            "idLabels": "",
            "number": 0,
            "begin_number": 1,
            "attrNumber": "0",
            "nextPos": 52,
            "positions": {
              "start": 516,
              "end": 551
            },
            "content_test_str": "\\(X \\sim \\mathcal{N}(\\mu, \\Sigma)\\)"
          },
          {
            "type": "text",
            "children": null,
            "content": ". In these notes, we describe multivariate Gaussians and some of their basic properties.",
            "nextPos": 140,
            "positions": {
              "start": 551,
              "end": 639
            },
            "content_test_str": ". In these notes, we describe multivariate Gaussians and some of their basic properties."
          }
        ],
        "content": "We write this as \\(X \\sim \\mathcal{N}(\\mu, \\Sigma)\\). In these notes, we describe multivariate Gaussians and some of their basic properties.",
        "mmd_type": "abstract_content",
        "positions": {
          "start": 499,
          "end": 640
        },
        "content_test_str": "We write this as \\(X \\sim \\mathcal{N}(\\mu, \\Sigma)\\). In these notes, we describe multivariate Gaussians and some of their basic properties.\n"
      },
      {
        "type": "paragraph_close",
        "children": null,
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
        "content": "",
        "mmd_type": "abstract",
        "positions": {
          "start": 656,
          "end": 1726
        },
        "content_test_str": "\\begin{abstract}\nWith the capability of modeling bidirectional contexts, denoising autoencoding based pretraining like BERT achieves better performance than pretraining approaches based on autoregressive language modeling. However, relying on corrupting the input with masks, BERT neglects dependency between the masked positions and suffers from a pretrain-finetune discrepancy. In light of these pros and cons, we propose XLNet, a generalized autoregressive pretraining method that (1) enables learning bidirectional contexts by maximizing the expected likelihood over all permutations of the factorization order and (2) overcomes the limitations of BERT thanks to its autoregressive formulation. Furthermore, XLNet integrates ideas from Transformer-XL, the state-of-the-art autoregressive model, into pretraining. Empirically, XLNet outperforms BERT on 20 tasks, often by a large margin, and achieves state-of-the-art results on 18 tasks including question answering, natural language inference, sentiment analysis, and document ranking $\\bigsqcup^{1}$\n\\end{abstract}"
      },
      {
        "type": "heading_open",
        "children": null,
        "content": "",
        "mmd_type": "abstract_title"
      },
      {
        "type": "text",
        "children": [],
        "content": "Abstract"
      },
      {
        "type": "heading_close",
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
            "content": "With the capability of modeling bidirectional contexts, denoising autoencoding based pretraining like BERT achieves better performance than pretraining approaches based on autoregressive language modeling. However, relying on corrupting the input with masks, BERT neglects dependency between the masked positions and suffers from a pretrain-finetune discrepancy. In light of these pros and cons, we propose XLNet, a generalized autoregressive pretraining method that (1) enables learning bidirectional contexts by maximizing the expected likelihood over all permutations of the factorization order and (2) overcomes the limitations of BERT thanks to its autoregressive formulation. Furthermore, XLNet integrates ideas from Transformer-XL, the state-of-the-art autoregressive model, into pretraining. Empirically, XLNet outperforms BERT on 20 tasks, often by a large margin, and achieves state-of-the-art results on 18 tasks including question answering, natural language inference, sentiment analysis, and document ranking ",
            "nextPos": 1023,
            "positions": {
              "start": 673,
              "end": 1696
            },
            "content_test_str": "With the capability of modeling bidirectional contexts, denoising autoencoding based pretraining like BERT achieves better performance than pretraining approaches based on autoregressive language modeling. However, relying on corrupting the input with masks, BERT neglects dependency between the masked positions and suffers from a pretrain-finetune discrepancy. In light of these pros and cons, we propose XLNet, a generalized autoregressive pretraining method that (1) enables learning bidirectional contexts by maximizing the expected likelihood over all permutations of the factorization order and (2) overcomes the limitations of BERT thanks to its autoregressive formulation. Furthermore, XLNet integrates ideas from Transformer-XL, the state-of-the-art autoregressive model, into pretraining. Empirically, XLNet outperforms BERT on 20 tasks, often by a large margin, and achieves state-of-the-art results on 18 tasks including question answering, natural language inference, sentiment analysis, and document ranking "
          },
          {
            "type": "inline_math",
            "children": null,
            "content": "\\bigsqcup^{1}",
            "math_env": "",
            "inlinePos": {
              "start": 1023,
              "end": 1038
            },
            "canonicalized": [
              "\\bigsqcup",
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
            "nextPos": 1038,
            "positions": {
              "start": 1696,
              "end": 1711
            },
            "content_test_str": "$\\bigsqcup^{1}$"
          }
        ],
        "content": "With the capability of modeling bidirectional contexts, denoising autoencoding based pretraining like BERT achieves better performance than pretraining approaches based on autoregressive language modeling. However, relying on corrupting the input with masks, BERT neglects dependency between the masked positions and suffers from a pretrain-finetune discrepancy. In light of these pros and cons, we propose XLNet, a generalized autoregressive pretraining method that (1) enables learning bidirectional contexts by maximizing the expected likelihood over all permutations of the factorization order and (2) overcomes the limitations of BERT thanks to its autoregressive formulation. Furthermore, XLNet integrates ideas from Transformer-XL, the state-of-the-art autoregressive model, into pretraining. Empirically, XLNet outperforms BERT on 20 tasks, often by a large margin, and achieves state-of-the-art results on 18 tasks including question answering, natural language inference, sentiment analysis, and document ranking $\\bigsqcup^{1}$",
        "mmd_type": "abstract_content",
        "positions": {
          "start": 673,
          "end": 1712
        },
        "content_test_str": "With the capability of modeling bidirectional contexts, denoising autoencoding based pretraining like BERT achieves better performance than pretraining approaches based on autoregressive language modeling. However, relying on corrupting the input with masks, BERT neglects dependency between the masked positions and suffers from a pretrain-finetune discrepancy. In light of these pros and cons, we propose XLNet, a generalized autoregressive pretraining method that (1) enables learning bidirectional contexts by maximizing the expected likelihood over all permutations of the factorization order and (2) overcomes the limitations of BERT thanks to its autoregressive formulation. Furthermore, XLNet integrates ideas from Transformer-XL, the state-of-the-art autoregressive model, into pretraining. Empirically, XLNet outperforms BERT on 20 tasks, often by a large margin, and achieves state-of-the-art results on 18 tasks including question answering, natural language inference, sentiment analysis, and document ranking $\\bigsqcup^{1}$\n"
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      },
      {
        "type": "paragraph_close",
        "children": null,
        "content": ""
      }
    ]
  }
]
