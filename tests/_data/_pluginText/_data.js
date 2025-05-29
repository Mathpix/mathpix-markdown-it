module.exports = [
  {
    latex: '\\begin{abstract} \n' +
      'Some text\n' +
      '\\end{abstract}',
    svg: '<div class="abstract" style="width: 80%; margin: 0 auto 1em auto; font-size: .9em;">\n' +
      '<h4 id="abstract_head" class="abstract_head" style="text-align: center;">\n' +
      'Abstract</h4>\n' +
      '<p style="text-indent: 1em;">Some text</p>\n' +
      '</div>'
  },
  {
    latex: '\\begin{abstract} \n' +
      'Some text\n' +
      '\n' +
      'Some text\n' +
      '\n' +
      'Some text\n' +
      '\\end{abstract}',
    svg: '<div class="abstract" style="width: 80%; margin: 0 auto 1em auto; font-size: .9em;">\n' +
      '<h4 id="abstract_head" class="abstract_head" style="text-align: center;">\n' +
      'Abstract</h4>\n' +
      '<p style="text-indent: 1em;">Some text</p>\n' +
      '<p style="text-indent: 1em;">Some text</p>\n' +
      '<p style="text-indent: 1em;">Some text</p>\n' +
      '</div>'
  },
  {
    latex: 'sized by an optical-mechanical technique ~\\textit{Langle}-\n' +
      '\n' +
      '[\\pagebreak\n' +
      '\n' +
      'Summary [\\dotfill \n' +
      '\n' +
      '[www.test.com\n' +
      '\n' +
      '[\\author{Author[^1]}\n' +
      '\n' +
      '[<smiles>C</smiles>\n' +
      '\n' +
      '\n' +
      '[\\setcounter{section}{4}\n' +
      '\n' +
      '\\section{test}\n' +
      '\n' +
      '[\\underline{underline}\n' +
      '\n' +
      '[\\sout{sout}\n' +
      '\n' +
      '[\\theoremstyle{remark}\n' +
      '\\newtheorem*{remark}{Remark}\n' +
      '\n' +
      '\n' +
      '\\section{Introduction}\n' +
      'Unnumbered theorem-like environments are also possible.\n' +
      '\n' +
      '\\begin{remark}This statement is true, I guess.\n' +
      '\\end{remark}\n' +
      '\n' +
      '[\\renewcommand\\qedsymbol{QED}\n' +
      '\n' +
      '\\begin{proof}\n' +
      '[\\label{proof}\n' +
      'To prove it by contradiction try and assume that the statement is false,\n' +
      'proceed from there and at some point you will arrive to a contradiction.\n' +
      '\\end{proof}\n' +
      '\n' +
      '\n' +
      '[\\ref{proof}',
    svg: '<div>sized by an optical-mechanical technique ~<em>Langle</em>-</div>\n' +
      '<div>[</div>\n' +
      '<div data-has-dotfill="true">Summary [&nbsp;<span class="dotfill" aria-hidden="true"></span></div>\n' +
      '<div>[<a href="http://www.test.com" target="_blank" rel="noopener" style="display: inline-block">www.test.com</a></div>\n' +
      '<div>[<div class="author">\n' +
      '          <p><span>Author[^1]</span></p>\n' +
      '        </div></div>\n' +
      '<div>[<div class="smiles-inline" style="display: inline-block;"><svg id="smiles-" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 56.099999999999994" style="width: 112.19999999999999px; overflow: visible;"><defs></defs><mask id="text-mask"><rect x="0" y="0" width="100%" height="100%" fill="white"></rect><circle cx="56.099999999999994" cy="28.049999999999997" r="10.518749999999999" fill="black"></circle></mask><style>\n' +
      '                .element {\n' +
      '                    font: 18.7px Helvetica, Arial, sans-serif;\n' +
      '                    alignment-baseline: \'middle\';\n' +
      '                }\n' +
      '                .sub {\n' +
      '                    font: 11.219999999999999px Helvetica, Arial, sans-serif;\n' +
      '                }\n' +
      '            </style><g mask="url(#text-mask)"></g><g><text x="56.099999999999994" y="17.53125" class="element" fill="currentColor" style="\n' +
      '                text-anchor: start;\n' +
      '                writing-mode: vertical-rl;\n' +
      '                text-orientation: upright;\n' +
      '                letter-spacing: -1px;\n' +
      '                direction: ltr;\n' +
      '            "><tspan>C</tspan><tspan style="unicode-bidi: plaintext;">H<tspan baseline-shift="sub" class="sub">4</tspan></tspan></text><text x="56.099999999999994" y="28.049999999999997" class="debug" fill="#ff0000" style="\n' +
      '                font: 5px Droid Sans, sans-serif;\n' +
      '            "></text></g></svg></div></div>\n' +
      '<div style="margin-top: 0; margin-bottom: 1rem;">[</div>\n' +
      '<h2 type="section" class="section-title" id="test">\n' +
      '<span class="section-number">5. </span>test</h2>\n' +
      '<div>[<span data-underline-level="1" data-underline-type="underline" style="border-bottom: 1px solid;background-position: 0 -1px;">underline</span></div>\n' +
      '<div>[<span data-out-type="sout" style="text-decoration: line-through; text-decoration-thickness: from-font;">sout</span></div>\n' +
      '<div style="margin-top: 0; margin-bottom: 1rem;">[</div>\n' +
      '<h2 type="section" class="section-title" id="introduction">\n' +
      '<span class="section-number">6. </span>Introduction</h2>\n' +
      '<div>Unnumbered theorem-like environments are also possible.</div>\n' +
      '<div class="theorem_block">\n' +
      '<div class="theorem" style="font-style: normal; padding: 10px 0;"><span style="font-style: italic;" class="theorem-title">Remark.</span><span style="margin-right: 16px"></span><div style="display: inline;" data-display="inline">This statement is true, I guess.</div>\n' +
      '</div></div>\n' +
      '<div style="margin-top: 0; margin-bottom: 1rem;">[</div>\n' +
      '<div class="proof_block">\n' +
      '<div id="proof" class="proof" style="font-style: normal; padding: 10px 0;"><span style="font-style: italic;">Proof.</span><span style="margin-right: 10px"></span><div style="display: inline;" data-display="inline">[To prove it by contradiction try and assume that the statement is false,<br>\n' +
      'proceed from there and at some point you will arrive to a contradiction.<span style="float: right;">QED</span></div>\n' +
      '</div></div>\n' +
      '<div>[<a href="#proof" style="cursor: pointer; text-decoration: none;" class="clickable-link" value="proof" data-parentheses="false">1</a></div>'
  },
  {
    latex: '96\n' +
      '第 3 章 TCP/IP 网络通信技术实践\n' +
      '```\n' +
      'BOOL CInterface::Ini()\n' +
      '{\n' +
      '    if(m_blni) ///\n' +
      '    {\n' +
      '        TRACE("You have ini the talk model.\\n");\n' +
      '        return FALSE;\n' +
      '    }\n' +
      '    if(!m_sopListen->Create (TALK_COM_PORT))\n' +
      '    {\n' +
      '        goto Exit;\n' +
      '    }\n' +
      '    if(!m_pRec\n' +
      '    {\n' +
      '        goto Exit1;\n' +
      '    }\n' +
      '    if(!m_pUdp->Ini ())\n' +
      '    {\n' +
      '        goto Exit2;\n' +
      '    }\n' +
      '    if(!g_pOut->StartPlay ()) //4\n' +
      '    {\n' +
      '        goto Exit3;\n' +
      '    };\n' +
      '    {\n' +
      '        goto Exit4;\n' +
      '    };\n' +
      '    m_bIni = TRUE;\n' +
      '    goto Exit;\n' +
      'Exit4:\n' +
      '    g_pOut->StopPlay ();\n' +
      '```\n',
    svg: '<div>96<br>\n' +
      '第 3 章 TCP/IP 网络通信技术实践</div>\n' +
      '<div  style="overflow: auto; position: relative;"><pre><code class="hljs">BOOL CInterface::Ini()\n' +
      '{\n' +
      '    if(m_blni) ///\n' +
      '    {\n' +
      '        TRACE(&quot;You have ini the talk model.\\n&quot;);\n' +
      '        return FALSE;\n' +
      '    }\n' +
      '    if(!m_sopListen-&gt;Create (TALK_COM_PORT))\n' +
      '    {\n' +
      '        goto Exit;\n' +
      '    }\n' +
      '    if(!m_pRec\n' +
      '    {\n' +
      '        goto Exit1;\n' +
      '    }\n' +
      '    if(!m_pUdp-&gt;Ini ())\n' +
      '    {\n' +
      '        goto Exit2;\n' +
      '    }\n' +
      '    if(!g_pOut-&gt;StartPlay ()) //4\n' +
      '    {\n' +
      '        goto Exit3;\n' +
      '    };\n' +
      '    {\n' +
      '        goto Exit4;\n' +
      '    };\n' +
      '    m_bIni = TRUE;\n' +
      '    goto Exit;\n' +
      'Exit4:\n' +
      '    g_pOut-&gt;StopPlay ();\n' +
      '</code></pre>\n' +
      '<div class="mmd-clipboard-copy-container" style="right: 0; top: 0; position: absolute;"><clipboard-copy aria-label="Copy" class="ClipboardButton mmd-tooltipped-no-delay" tabindex="0" role="button" value="BOOL CInterface::Ini()\n' +
      '{\n' +
      '    if(m_blni) ///\n' +
      '    {\n' +
      '        TRACE(&quot;You have ini the talk model.\\n&quot;);\n' +
      '        return FALSE;\n' +
      '    }\n' +
      '    if(!m_sopListen-&gt;Create (TALK_COM_PORT))\n' +
      '    {\n' +
      '        goto Exit;\n' +
      '    }\n' +
      '    if(!m_pRec\n' +
      '    {\n' +
      '        goto Exit1;\n' +
      '    }\n' +
      '    if(!m_pUdp-&gt;Ini ())\n' +
      '    {\n' +
      '        goto Exit2;\n' +
      '    }\n' +
      '    if(!g_pOut-&gt;StartPlay ()) //4\n' +
      '    {\n' +
      '        goto Exit3;\n' +
      '    };\n' +
      '    {\n' +
      '        goto Exit4;\n' +
      '    };\n' +
      '    m_bIni = TRUE;\n' +
      '    goto Exit;\n' +
      'Exit4:\n' +
      '    g_pOut-&gt;StopPlay ();\n' +
      '"><svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="mmd-clipboard-icon mmd-clipboard-copy-icon" style="margin: 0.5rem;">\n' +
      '    <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>\n' +
      '</svg><svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="mmd-clipboard-icon mmd-clipboard-check-icon" style="display: none; margin: 0.5rem;">\n' +
      '    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>\n' +
      '</svg></clipboard-copy></div></div>'
  }
];
