export enum eMmdRuleType {
  markdown = "markdown",
  latex = "latex",
  chem = "chem",
  html = "html",
  common = "common",
  asciiMath = "asciiMath",
  math = "math",
  mathML = "mathML",
  toc = "toc"
}

export const mmdBlockRulesList = [
  {
    name: "table",
    description: "GFM table",
    type: eMmdRuleType.markdown
  },
  {
    name: "code",
    type: eMmdRuleType.markdown
  },
  {
    name: "smilesDrawerBlock",
    description: "block smiles",
    type: eMmdRuleType.chem
  },
  {
    name: "collapsible",
    description: "collapsible",
    type: eMmdRuleType.markdown
  },
  {
    name: "fence",
    description: "Code block with markers ~ or ` ",
    type: eMmdRuleType.markdown
  },
  {
    name: "BeginTable",
    description: "Latex table \\begin{table}...\\end{table}",
    type: eMmdRuleType.latex
  },
  {
    name: "BeginAlign",
    description: "Latex align \\begin{left}...\\end{left}",
    type: eMmdRuleType.latex
  },
  {
    name: "BeginTabular",
    description: "Latex tabular \\begin{tabular}...\\end{tabular}",
    type: eMmdRuleType.latex
  },
  {
    name: "BeginProof",
    description: "Latex proof \\begin{proof}...\\end{proof}",
    type: eMmdRuleType.latex
  },
  {
    name: "BeginTheorem",
    description: "Latex theorem \\begin{theorem}...\\end{theorem}",
    type: eMmdRuleType.latex
  },
  {
    name: "blockquote",
    description: "blockquote",
    type: eMmdRuleType.markdown
  },
  {
    name: "hr",
    description: "Horizontal rule",
    type: eMmdRuleType.markdown
  },
  {
    name: "list",
    description: "Markdown list",
    type: eMmdRuleType.markdown
  },
  {
    name: "newTheoremBlock",
    type: eMmdRuleType.latex
  },
  {
    name: "ReNewCommand",
    type: eMmdRuleType.latex,
  },
  {
    name: "Lists",
    description: "Latex list",
    type: eMmdRuleType.latex,
  },
  {
    name: "footnote_def",
    type: eMmdRuleType.markdown
  },
  {
    name: "reference",
    type: eMmdRuleType.markdown
  },
  {
    name: "separatingSpan",
    type: eMmdRuleType.html
  },
  {
    name: "headingSection",
    description: "Latex title, section",
    type: eMmdRuleType.latex
  },
  {
    name: "addContentsLineBlock",
    description: "\\addcontentsline{toc}{section}{Unnumbered Section}",
    type: eMmdRuleType.latex
  },
  {
    name: "heading",
    description: "heading (#, ##, ...)",
    type: eMmdRuleType.markdown
  },
  {
    name: "lheading",
    description: "lheading (---, ===)",
    type: eMmdRuleType.markdown
  },
  {
    name: "svg_block",
    type: eMmdRuleType.html
  },
  {
    name: "mathMLBlock",
    type: eMmdRuleType.mathML
  },
  {
    name: "html_block",
    type: eMmdRuleType.html
  },
  {
    name: "abstractBlock",
    description: "\\begin{abstract}",
    type: eMmdRuleType.latex
  },
  {
    name: "pageBreaksBlock",
    description: "\\pagebreak \\clearpage \\newpage",
    type: eMmdRuleType.latex
  },
  {
    name: "latex_footnote_block",
    type: eMmdRuleType.latex
  },
  {
    name: "latex_footnotetext_block",
    type: eMmdRuleType.latex
  },
  {
    name: "paragraphDiv",
    type: eMmdRuleType.common
  },
  {
    name: "deflist",
    type: eMmdRuleType.markdown
  },
  {
    name: "paragraph",
    type: eMmdRuleType.common
  }
];

export const mmdInlineRuleList = [
  {
    name: "text",
    type: eMmdRuleType.common
  },
  {
    name: "newlineToSpace",
    type: eMmdRuleType.latex
  },
  {
    name: "newline",
    type: eMmdRuleType.latex
  },
  {
    name: "InlineIncludeGraphics",
    type: eMmdRuleType.latex
  },
  {
    name: "newCommandQedSymbol",
    type: eMmdRuleType.latex
  },
  {
    name: "renewcommand_inline",
    type: eMmdRuleType.latex
  },
  {
    name: "list_begin_inline",
    type: eMmdRuleType.latex
  },
  {
    name: "list_item_inline",
    type: eMmdRuleType.latex
  },
  {
    name: "textMode",
    type: eMmdRuleType.latex
  },
  {
    name: "list_close_inline",
    type: eMmdRuleType.latex
  },
  {
    name: "list_setcounter_inline",
    type: eMmdRuleType.latex
  },
  {
    name: "usepackage",
    type: eMmdRuleType.latex
  },
  {
    name: "refsInline",
    type: eMmdRuleType.latex
  },
  {
    name: "inlineTabular",
    type: eMmdRuleType.latex
  },
  {
    name: "labelLatex",
    type: eMmdRuleType.latex
  },
  {
    name: "captionLatex",
    type: eMmdRuleType.latex
  },
  {
    name: "centeringLatex",
    type: eMmdRuleType.latex
  },
  {
    name: "theoremStyle",
    type: eMmdRuleType.latex
  },
  {
    name: "newTheorem",
    type: eMmdRuleType.latex
  },
  {
    name: "setCounterSection",
    type: eMmdRuleType.latex
  },
  {
    name: "setCounterTheorem",
    type: eMmdRuleType.latex
  },
  {
    name: "refs",
    // type: eMmdRuleType.latex //refInsideMathDelimiter
    type: eMmdRuleType.math
  },
  {
    name: "backtickAsAsciiMath",
    type: eMmdRuleType.asciiMath
  },
  {
    name: "asciiMath",
    type: eMmdRuleType.asciiMath
  },
  {
    name: "textAuthor",
    type: eMmdRuleType.latex
  },
  {
    name: "linkifyURL",
    type: eMmdRuleType.markdown
    //????
  },
  {
    name: "pageBreaks",
    type: eMmdRuleType.latex
  },
  {
    name: "doubleSlashToSoftBreak",
    type: eMmdRuleType.latex
  },
  {
    name: "textUnderline",
    type: eMmdRuleType.latex
  },
  {
    name: "textOut",
    type: eMmdRuleType.latex
  },
  {
    name: "dotfill",
    type: eMmdRuleType.latex
  },
  {
    name: "textTypes",
    type: eMmdRuleType.latex
  },
  {
    name: "multiMath",
    type: eMmdRuleType.math
  },
  {
    name: "latex_footnote",
    type: eMmdRuleType.latex
  },
  {
    name: "latex_footnotemark",
    type: eMmdRuleType.latex
  },
  {
    name: "latex_footnotetext",
    type: eMmdRuleType.latex
  },
  {
    name: "escape",
    description: "\\!\"#$%&\'()*+,./:;<=>?@[]^_`{|}~-",
    type: eMmdRuleType.markdown
  },
  {
    name: "backticks",
    description: "Parse backticks `...`",
    type: eMmdRuleType.markdown
  },
  {
    name: "strikethrough",
    type: eMmdRuleType.markdown
  },
  {
    name: "mark",
    description: "==marked text==",
    type: eMmdRuleType.markdown
  },
  {
    name: "ins",
    description: "++inserted++",
    type: eMmdRuleType.markdown
  },
  {
    name: "emphasis",
    description: "// Process *this* and _that_",
    type: eMmdRuleType.markdown
  },
  {
    name: "sup",
    type: eMmdRuleType.markdown
  },
  {
    name: "sub",
    type: eMmdRuleType.markdown
  },
  {
    name: "toc",
    type: eMmdRuleType.toc
  },
  {
    name: "link",
    type: eMmdRuleType.markdown
  },
  {
    name: "image",
    type: eMmdRuleType.markdown
  },
  {
    name: "footnote_inline",
    type: eMmdRuleType.markdown
  },
  {
    name: "footnote_ref",
    type: eMmdRuleType.markdown
  },
  {
    name: "autolink",
    type: eMmdRuleType.markdown
  },
  {
    name: "smilesDrawerInline",
    type: eMmdRuleType.chem
  },
  {
    name: "mathML", //inlineMathML
    type: eMmdRuleType.mathML
  },
  {
    name: "html_inline",
    type: eMmdRuleType.html
  },
  {
    name: "entity",
    description: "Process html entity - &#123;, &#xAF;, &quot;, ...",
    type: eMmdRuleType.markdown
  },
  {
    name: "simpleMath",
    type: eMmdRuleType.math
  },
  {
    name: "tocHide",
    type: eMmdRuleType.toc
  }
];

export const mmdInlineRule2List = [
  {
    name: "balance_pairs",
    description: "For each opening emphasis-like marker find a matching closing one",
    type: eMmdRuleType.markdown
  },
  {
    name: "strikethrough",
    description: "Walk through delimiter list and replace text tokens with tags",
    type: eMmdRuleType.markdown
  },
  {
    name: "mark",
    description: "postProcess, Walk through delimiter list and replace text tokens with tags",
    type: eMmdRuleType.markdown
  },
  {
    name: "ins",
    type: eMmdRuleType.markdown
  },
  {
    name: "emphasis",
    type: eMmdRuleType.markdown
  },
  {
    name: "text_collapse",
    description: "Clean up tokens after emphasis and strikethrough postprocessing:" +
      " merge adjacent text nodes into one and re-calculate all token levels",
    type: eMmdRuleType.markdown
  },
  {
    name: "grab_footnote_ref",
    type: eMmdRuleType.latex
  }
];

export const mmdCoreRuleList = [
  {
    name: "normalize",
    description: "Normalize input string. Replace /\\r\\n?|\\n/g to \n and replace /\\0/g to \uFFFD",
    type: eMmdRuleType.markdown
  },
  {
    name: "block",
    type: eMmdRuleType.common
  },
  {
    name: "inline",
    type: eMmdRuleType.common
  },
  {
    name: "footnote_tail",
    type: eMmdRuleType.markdown
  },
  {
    name: "mmd_footnote_tail",
    type: eMmdRuleType.latex
  },
  {
    name: "linkify",
    type: eMmdRuleType.markdown
  },
  {
    name: "replacements",
    description: "Simple typographic replacements. (c) (C) → ©, (c) (C) → ©, (r) (R) → ®, +- → ±, (p) (P) -> §, ... → … (also ?.... → ?.., !.... → !..)",
    type: eMmdRuleType.markdown
  },
  {
    name: "smartquotes",
    description: "Convert straight quotation marks to typographic ones",
    type: eMmdRuleType.markdown
  },
  {
    name: "anchor",
    description: "Add anchor for title, section",
    type: eMmdRuleType.latex
  },
  {
    name: "grab_state",
    description: "Copy state",
    type: eMmdRuleType.common
  },
  {
    name: "emoji",
    type: eMmdRuleType.markdown
  }
];