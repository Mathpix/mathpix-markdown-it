"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mmdRuleList = exports.eRule = exports.eMmdRuleType = void 0;
var eMmdRuleType;
(function (eMmdRuleType) {
    eMmdRuleType["markdown"] = "markdown";
    eMmdRuleType["latex"] = "latex";
    eMmdRuleType["chem"] = "chem";
    eMmdRuleType["html"] = "html";
    eMmdRuleType["common"] = "common";
    eMmdRuleType["asciiMath"] = "asciiMath";
    eMmdRuleType["math"] = "math";
    eMmdRuleType["mathML"] = "mathML";
    eMmdRuleType["simpleMath"] = "simpleMath"; //$...$, $$...$$
})(eMmdRuleType = exports.eMmdRuleType || (exports.eMmdRuleType = {}));
var eRule;
(function (eRule) {
    eRule["block"] = "block";
    eRule["inline"] = "inline";
    eRule["inline2"] = "inline2";
    eRule["core"] = "core";
})(eRule = exports.eRule || (exports.eRule = {}));
exports.mmdRuleList = [
    {
        name: "table",
        description: "GFM table",
        type: eMmdRuleType.markdown,
        rule: eRule.block
    },
    {
        name: "code",
        type: eMmdRuleType.markdown,
        rule: eRule.block
    },
    {
        name: "smilesDrawerBlock",
        description: "block smiles",
        type: eMmdRuleType.chem,
        rule: eRule.block
    },
    {
        name: "collapsible",
        description: "collapsible",
        type: eMmdRuleType.markdown,
        rule: eRule.block
    },
    {
        name: "fence",
        description: "Code block with markers ~ or ` ",
        type: eMmdRuleType.markdown,
        rule: eRule.block
    },
    {
        name: "BeginTable",
        description: "Latex table \\begin{table}...\\end{table}",
        type: eMmdRuleType.latex,
        rule: eRule.block
    },
    {
        name: "BeginAlign",
        description: "Latex align \\begin{left}...\\end{left}",
        type: eMmdRuleType.latex,
        rule: eRule.block
    },
    {
        name: "BeginTabular",
        description: "Latex tabular \\begin{tabular}...\\end{tabular}",
        type: eMmdRuleType.latex,
        rule: eRule.block
    },
    {
        name: "BeginProof",
        description: "Latex proof \\begin{proof}...\\end{proof}",
        type: eMmdRuleType.latex,
        rule: eRule.block
    },
    {
        name: "BeginTheorem",
        description: "Latex theorem \\begin{theorem}...\\end{theorem}",
        type: eMmdRuleType.latex,
        rule: eRule.block
    },
    {
        name: "blockquote",
        description: "blockquote",
        type: eMmdRuleType.markdown,
        rule: eRule.block
    },
    {
        name: "hr",
        description: "Horizontal rule",
        type: eMmdRuleType.markdown,
        rule: eRule.block
    },
    {
        name: "list",
        description: "Markdown list",
        type: eMmdRuleType.markdown,
        rule: eRule.block
    },
    {
        name: "newTheoremBlock",
        type: eMmdRuleType.latex,
        rule: eRule.block
    },
    {
        name: "ReNewCommand",
        type: eMmdRuleType.latex,
        rule: eRule.block
    },
    {
        name: "Lists",
        description: "Latex list",
        type: eMmdRuleType.latex,
        rule: eRule.block
    },
    {
        name: "footnote_def",
        type: eMmdRuleType.markdown,
        rule: eRule.block
    },
    {
        name: "reference",
        type: eMmdRuleType.markdown,
        rule: eRule.block
    },
    {
        name: "separatingSpan",
        type: eMmdRuleType.html,
        rule: eRule.block
    },
    {
        name: "headingSection",
        description: "Latex title, section",
        type: eMmdRuleType.latex,
        rule: eRule.block
    },
    {
        name: "addContentsLineBlock",
        description: "\\addcontentsline{toc}{section}{Unnumbered Section}",
        type: eMmdRuleType.latex,
        rule: eRule.block
    },
    {
        name: "heading",
        description: "heading (#, ##, ...)",
        type: eMmdRuleType.markdown,
        rule: eRule.block
    },
    {
        name: "lheading",
        description: "lheading (---, ===)",
        type: eMmdRuleType.markdown,
        rule: eRule.block
    },
    {
        name: "svg_block",
        type: eMmdRuleType.html,
        rule: eRule.block
    },
    {
        name: "mathMLBlock",
        type: eMmdRuleType.mathML,
        rule: eRule.block
    },
    {
        name: "html_block",
        type: eMmdRuleType.html,
        rule: eRule.block
    },
    {
        name: "abstractBlock",
        description: "\\begin{abstract}",
        type: eMmdRuleType.latex,
        rule: eRule.block
    },
    {
        name: "pageBreaksBlock",
        description: "\\pagebreak \\clearpage \\newpage",
        type: eMmdRuleType.latex,
        rule: eRule.block
    },
    {
        name: "latex_footnote_block",
        type: eMmdRuleType.latex,
        rule: eRule.block
    },
    {
        name: "latex_footnotetext_block",
        type: eMmdRuleType.latex,
        rule: eRule.block
    },
    {
        name: "paragraphDiv",
        type: eMmdRuleType.common,
        rule: eRule.block
    },
    {
        name: "deflist",
        type: eMmdRuleType.markdown,
        rule: eRule.block
    },
    {
        name: "paragraph",
        type: eMmdRuleType.common,
        rule: eRule.block
    },
    //Inline rules
    {
        name: "text",
        type: eMmdRuleType.common,
        rule: eRule.inline
    },
    {
        name: "newlineToSpace",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "newline",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "InlineIncludeGraphics",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "newCommandQedSymbol",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "renewcommand_inline",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "list_begin_inline",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "list_item_inline",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "textMode",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "list_close_inline",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "list_setcounter_inline",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "usepackage",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "refsInline",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "inlineTabular",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "labelLatex",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "captionLatex",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "centeringLatex",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "theoremStyle",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "newTheorem",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "setCounterSection",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "setCounterTheorem",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "refs",
        // type: eMmdRuleType.latex //refInsideMathDelimiter
        type: eMmdRuleType.math,
        rule: eRule.inline
    },
    {
        name: "backtickAsAsciiMath",
        type: eMmdRuleType.asciiMath,
        rule: eRule.inline
    },
    {
        name: "asciiMath",
        type: eMmdRuleType.asciiMath,
        rule: eRule.inline
    },
    {
        name: "textAuthor",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "linkifyURL",
        type: eMmdRuleType.markdown,
        rule: eRule.inline
    },
    {
        name: "pageBreaks",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "doubleSlashToSoftBreak",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "textUnderline",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "textOut",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "dotfill",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "textTypes",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "multiMath",
        type: eMmdRuleType.math,
        rule: eRule.inline
    },
    {
        name: "latex_footnote",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "latex_footnotemark",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "latex_footnotetext",
        type: eMmdRuleType.latex,
        rule: eRule.inline
    },
    {
        name: "escape",
        description: "\\!\"#$%&\'()*+,./:;<=>?@[]^_`{|}~-",
        type: eMmdRuleType.markdown,
        rule: eRule.inline
    },
    {
        name: "backticks",
        description: "Parse backticks `...`",
        type: eMmdRuleType.markdown,
        rule: eRule.inline
    },
    {
        name: "strikethrough",
        type: eMmdRuleType.markdown,
        rule: eRule.inline
    },
    {
        name: "mark",
        description: "==marked text==",
        type: eMmdRuleType.markdown,
        rule: eRule.inline
    },
    {
        name: "ins",
        description: "++inserted++",
        type: eMmdRuleType.markdown,
        rule: eRule.inline
    },
    {
        name: "emphasis",
        description: "// Process *this* and _that_",
        type: eMmdRuleType.markdown,
        rule: eRule.inline
    },
    {
        name: "sup",
        type: eMmdRuleType.markdown,
        rule: eRule.inline
    },
    {
        name: "sub",
        type: eMmdRuleType.markdown,
        rule: eRule.inline
    },
    {
        name: "toc",
        type: eMmdRuleType.markdown,
        rule: eRule.inline
    },
    {
        name: "link",
        type: eMmdRuleType.markdown,
        rule: eRule.inline
    },
    {
        name: "image",
        type: eMmdRuleType.markdown,
        rule: eRule.inline
    },
    {
        name: "footnote_inline",
        type: eMmdRuleType.markdown,
        rule: eRule.inline
    },
    {
        name: "footnote_ref",
        type: eMmdRuleType.markdown,
        rule: eRule.inline
    },
    {
        name: "autolink",
        type: eMmdRuleType.markdown,
        rule: eRule.inline
    },
    {
        name: "smilesDrawerInline",
        type: eMmdRuleType.chem,
        rule: eRule.inline
    },
    {
        name: "mathML",
        type: eMmdRuleType.mathML,
        rule: eRule.inline
    },
    {
        name: "html_inline",
        type: eMmdRuleType.html,
        rule: eRule.inline
    },
    {
        name: "entity",
        description: "Process html entity - &#123;, &#xAF;, &quot;, ...",
        type: eMmdRuleType.markdown,
        rule: eRule.inline
    },
    {
        name: "simpleMath",
        type: eMmdRuleType.simpleMath,
        rule: eRule.inline
    },
    {
        name: "tocHide",
        type: eMmdRuleType.markdown,
        rule: eRule.inline
    },
    //Inline ruler post process
    {
        name: "balance_pairs",
        description: "For each opening emphasis-like marker find a matching closing one",
        type: eMmdRuleType.markdown,
        rule: eRule.inline2
    },
    {
        name: "strikethrough",
        description: "Walk through delimiter list and replace text tokens with tags",
        type: eMmdRuleType.markdown,
        rule: eRule.inline2
    },
    {
        name: "mark",
        description: "postProcess, Walk through delimiter list and replace text tokens with tags",
        type: eMmdRuleType.markdown,
        rule: eRule.inline2
    },
    {
        name: "ins",
        type: eMmdRuleType.markdown,
        rule: eRule.inline2
    },
    {
        name: "emphasis",
        type: eMmdRuleType.markdown,
        rule: eRule.inline2
    },
    {
        name: "text_collapse",
        description: "Clean up tokens after emphasis and strikethrough postprocessing:" +
            " merge adjacent text nodes into one and re-calculate all token levels",
        type: eMmdRuleType.markdown,
        rule: eRule.inline2
    },
    {
        name: "grab_footnote_ref",
        type: eMmdRuleType.latex,
        rule: eRule.inline2
    },
    //Core rules
    {
        name: "normalize",
        description: "Normalize input string. Replace /\\r\\n?|\\n/g to \n and replace /\\0/g to \uFFFD",
        type: eMmdRuleType.markdown,
        rule: eRule.core
    },
    {
        name: "block",
        type: eMmdRuleType.common,
        rule: eRule.core
    },
    {
        name: "inline",
        type: eMmdRuleType.common,
        rule: eRule.core
    },
    {
        name: "footnote_tail",
        type: eMmdRuleType.markdown,
        rule: eRule.core
    },
    {
        name: "mmd_footnote_tail",
        type: eMmdRuleType.latex,
        rule: eRule.core
    },
    {
        name: "linkify",
        type: eMmdRuleType.markdown,
        rule: eRule.core
    },
    {
        name: "replacements",
        description: "Simple typographic replacements. (c) (C) → ©, (c) (C) → ©, (r) (R) → ®, +- → ±, (p) (P) -> §, ... → … (also ?.... → ?.., !.... → !..)",
        type: eMmdRuleType.markdown,
        rule: eRule.core
    },
    {
        name: "smartquotes",
        description: "Convert straight quotation marks to typographic ones",
        type: eMmdRuleType.markdown,
        rule: eRule.core
    },
    {
        name: "anchor",
        description: "Add anchor for title, section",
        type: eMmdRuleType.latex,
        rule: eRule.core
    },
    {
        name: "grab_state",
        description: "Copy state",
        type: eMmdRuleType.common,
        rule: eRule.core
    },
    {
        name: "emoji",
        type: eMmdRuleType.markdown,
        rule: eRule.core
    }
];
//# sourceMappingURL=mmdRules.js.map