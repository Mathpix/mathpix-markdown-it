module.exports = [
  {
    latex: "[[toc]]\n" +
      "\n" +
      "\\title{Sections and Chapters}\n" +
      "\n" +
      "\\section{Introduction}\n" +
      "\n" +
      "This is the first section.\n" +
      "\n" +
      "\\subsection{Subsection}\n" +
      "\n" +
      "This is the first subsection.\n" +
      "\n" +
      "\\subsection{Second Subsection}\n" +
      "\n" +
      "This is the second subsection.\n" +
      "\n" +
      "\\subsubsection{Subsubsection}\n" +
      "\n" +
      "This is the first subsubsection.\n" +
      "\n" +
      "\\subsubsection{Second Subsubsection}\n" +
      "\n" +
      "This is the second subsubsection.\n" +
      "\n" +
      "\\section{Second Section}\n" +
      "This is the second section\n" +
      "\n" +
      "\\subsection{Subsection}\n" +
      "\n" +
      "This is the first subsection.\n" +
      "\n" +
      "\\subsection{Second Subsection}\n" +
      "\n" +
      "This is the second subsection.\n" +
      "\n" +
      "\\subsubsection{Subsubsection}\n" +
      "\n" +
      "This is the first subsubsection.\n" +
      "\n" +
      "\\subsubsection{Second Subsubsection}\n" +
      "\n" +
      "This is the second subsubsection.",
    html: `<div><div class="table-of-contents" style="display: none"><ul><li class="toc-title-1"><a href="#sections-and-chapters" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters">Sections and Chapters</a><ul><li class="toc-title-2"><a href="#introduction" style="cursor: pointer; text-decoration: none;" class="toc-link" value="introduction">Introduction</a><ul><li class="toc-title-3"><a href="#subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection">Subsection</a></li><li class="toc-title-3"><a href="#second-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsection">Second Subsection</a><ul><li class="toc-title-4"><a href="#subsubsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection">Subsubsection</a></li><li class="toc-title-4"><a href="#second-subsubsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsubsection">Second Subsubsection</a></li></ul></li></ul></li><li class="toc-title-2"><a href="#second-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-section">Second Section</a><ul><li class="toc-title-3"><a href="#subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection-2">Subsection</a></li><li class="toc-title-3"><a href="#second-subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsection-2">Second Subsection</a><ul><li class="toc-title-4"><a href="#subsubsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-2">Subsubsection</a></li><li class="toc-title-4"><a href="#second-subsubsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsubsection-2">Second Subsubsection</a></li></ul></li></ul></li></ul></li></ul></div></div>
<h1 type="title" class="main-title" id="sections-and-chapters">
Sections and Chapters</h1>
<h2 type="section" class="section-title" id="introduction">
<span class="section-number">1. </span>Introduction</h2>
<div>This is the first section.</div>
<h3 type="subsection" class="sub_section-title" id="subsection">
<span class="section-number">1.</span><span class="sub_section-number">1.</span> Subsection</h3>
<div>This is the first subsection.</div>
<h3 type="subsection" class="sub_section-title" id="second-subsection">
<span class="section-number">1.</span><span class="sub_section-number">2.</span> Second Subsection</h3>
<div>This is the second subsection.</div>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection">
<span class="section-number">1.</span><span class="sub_section-number">2.1.</span> Subsubsection</h4>
<div>This is the first subsubsection.</div>
<h4 type="subsubsection" class="sub_sub_section-title" id="second-subsubsection">
<span class="section-number">1.</span><span class="sub_section-number">2.2.</span> Second Subsubsection</h4>
<div>This is the second subsubsection.</div>
<h2 type="section" class="section-title" id="second-section">
<span class="section-number">2. </span>Second Section</h2>
<div>This is the second section</div>
<h3 type="subsection" class="sub_section-title" id="subsection-2">
<span class="section-number">2.</span><span class="sub_section-number">1.</span> Subsection</h3>
<div>This is the first subsection.</div>
<h3 type="subsection" class="sub_section-title" id="second-subsection-2">
<span class="section-number">2.</span><span class="sub_section-number">2.</span> Second Subsection</h3>
<div>This is the second subsection.</div>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-2">
<span class="section-number">2.</span><span class="sub_section-number">2.1.</span> Subsubsection</h4>
<div>This is the first subsubsection.</div>
<h4 type="subsubsection" class="sub_sub_section-title" id="second-subsubsection-2">
<span class="section-number">2.</span><span class="sub_section-number">2.2.</span> Second Subsubsection</h4>
<div>This is the second subsubsection.</div>`,
    tocHtml: `<div id="toc_container"><ul><li class="toc-title-1"><a href="#sections-and-chapters" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters">Sections and Chapters</a><ul><li class="toc-title-2"><a href="#introduction" style="cursor: pointer; text-decoration: none;" class="toc-link" value="introduction">Introduction</a><ul><li class="toc-title-3"><a href="#subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection">Subsection</a></li><li class="toc-title-3"><a href="#second-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsection">Second Subsection</a><ul><li class="toc-title-4"><a href="#subsubsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection">Subsubsection</a></li><li class="toc-title-4"><a href="#second-subsubsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsubsection">Second Subsubsection</a></li></ul></li></ul></li><li class="toc-title-2"><a href="#second-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-section">Second Section</a><ul><li class="toc-title-3"><a href="#subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection-2">Subsection</a></li><li class="toc-title-3"><a href="#second-subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsection-2">Second Subsection</a><ul><li class="toc-title-4"><a href="#subsubsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-2">Subsubsection</a></li><li class="toc-title-4"><a href="#second-subsubsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsubsection-2">Second Subsubsection</a></li></ul></li></ul></li></ul></li></ul></div>`,
    tocHtmlSummary: `<div id="toc_container"><ul><li class="toc-title-1"><details><summary><a href="#sections-and-chapters" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters">Sections and Chapters</a></summary><ul><li class="toc-title-2"><details><summary><a href="#introduction" style="cursor: pointer; text-decoration: none;" class="toc-link" value="introduction">Introduction</a></summary><ul><li class="toc-title-3"><a href="#subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection">Subsection</a></li><li class="toc-title-3"><details><summary><a href="#second-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsection">Second Subsection</a></summary><ul><li class="toc-title-4"><a href="#subsubsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection">Subsubsection</a></li><li class="toc-title-4"><a href="#second-subsubsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsubsection">Second Subsubsection</a></li></ul></details></li></ul></details></li><li class="toc-title-2"><details><summary><a href="#second-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-section">Second Section</a></summary><ul><li class="toc-title-3"><a href="#subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection-2">Subsection</a></li><li class="toc-title-3"><details><summary><a href="#second-subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsection-2">Second Subsection</a></summary><ul><li class="toc-title-4"><a href="#subsubsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-2">Subsubsection</a></li><li class="toc-title-4"><a href="#second-subsubsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsubsection-2">Second Subsubsection</a></li></ul></details></li></ul></details></li></ul></details></li></ul></div>`,
  },
  {
    latex: "[[toc]]\n" +
      "\n" +
      "\\title{Sections and Chapters}\n" +
      "\n" +
      "\\section*{Introduction}\n" +
      "\n" +
      "This is the first section.\n" +
      "\n" +
      "\\section*{Second Section}\n" +
      "This is the second section",
    html: `<div><div class="table-of-contents" style="display: none"><ul><li class="toc-title-1"><a href="#sections-and-chapters" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters">Sections and Chapters</a></li></ul></div></div>
<h1 type="title" class="main-title" id="sections-and-chapters">
Sections and Chapters</h1>
<h2 type="section" data-unnumbered="true" class="section-title" id="introduction">
Introduction</h2>
<div>This is the first section.</div>
<h2 type="section" data-unnumbered="true" class="section-title" id="second-section">
Second Section</h2>
<div>This is the second section</div>`,
    tocHtml: `<div id="toc_container"><ul><li class="toc-title-1"><a href="#sections-and-chapters" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters">Sections and Chapters</a></li></ul></div>`,
    tocHtmlSummary: `<div id="toc_container"><ul><li class="toc-title-1"><a href="#sections-and-chapters" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters">Sections and Chapters</a></li></ul></div>`,
  },  
  {
    latex: "[[toc]]\n" +
      "\\title{Sections and Chapters}\n" +
      "\n" +
      "\\section{Introduction}\n" +
      "This is the first section (numbered).\n" +
      "\n" +
      "\\addcontentsline{toc}{section}{Unnumbered Section}\n" +
      "\\section*{Unnumbered Section}\n" +
      "An unnumbered section\n" +
      "\n" +
      "\\section{Second section}\n" +
      "The second numbered section.\n",
    html: `<div><div class="table-of-contents" style="display: none"><ul><li class="toc-title-1"><a href="#sections-and-chapters" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters">Sections and Chapters</a><ul><li class="toc-title-2"><a href="#introduction" style="cursor: pointer; text-decoration: none;" class="toc-link" value="introduction">Introduction</a></li><li class="toc-title-2"><a href="#unnumbered-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-section">Unnumbered Section</a></li><li class="toc-title-2"><a href="#second-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-section">Second section</a></li></ul></li></ul></div></div>
<h1 type="title" class="main-title" id="sections-and-chapters">
Sections and Chapters</h1>
<h2 type="section" class="section-title" id="introduction">
<span class="section-number">1. </span>Introduction</h2>
<div>This is the first section (numbered).</div>
<div class="addcontentsline" style="margin-top: 0; margin-bottom: 0;">
</div>
<h2 type="section" data-unnumbered="true" class="section-title" id="unnumbered-section">
Unnumbered Section</h2>
<div>An unnumbered section</div>
<h2 type="section" class="section-title" id="second-section">
<span class="section-number">2. </span>Second section</h2>
<div>The second numbered section.</div>`,
    tocHtml: `<div id="toc_container"><ul><li class="toc-title-1"><a href="#sections-and-chapters" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters">Sections and Chapters</a><ul><li class="toc-title-2"><a href="#introduction" style="cursor: pointer; text-decoration: none;" class="toc-link" value="introduction">Introduction</a></li><li class="toc-title-2"><a href="#unnumbered-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-section">Unnumbered Section</a></li><li class="toc-title-2"><a href="#second-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-section">Second section</a></li></ul></li></ul></div>`,
    tocHtmlSummary: `<div id="toc_container"><ul><li class="toc-title-1"><details><summary><a href="#sections-and-chapters" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters">Sections and Chapters</a></summary><ul><li class="toc-title-2"><a href="#introduction" style="cursor: pointer; text-decoration: none;" class="toc-link" value="introduction">Introduction</a></li><li class="toc-title-2"><a href="#unnumbered-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-section">Unnumbered Section</a></li><li class="toc-title-2"><a href="#second-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-section">Second section</a></li></ul></details></li></ul></div>`,
  },  
  {
    latex: "[[toc]]\n" +
      "\\title{Sections and Chapters}\n" +
      "\n" +
      "\\section{Introduction}\n" +
      "\n" +
      "This is the first section.\n" +
      "\n" +
      "\\subsection{Subsection}\n" +
      "\n" +
      "\\addcontentsline{toc}{section}{Unnumbered first Section}\n" +
      "\\section*{Unnumbered first Section}\n" +
      "\n" +
      "\\addcontentsline{toc}{subsection}{Unnumbered first Subsection}\n" +
      "\\addcontentsline{toc}{subsection}{Unnumbered second Subsection}\n" +
      "\\subsection*{Unnumbered first Subsection}\n" +
      "\\addcontentsline{toc}{subsection}{Unnumbered first Subsection}\n" +
      "\\subsection*{Unnumbered first Subsection}\n" +
      "\n" +
      "\\subsection{second Subsection}\n" +
      "\n" +
      "\\subsection*{Unnumbered second Subsection}\n" +
      "\n" +
      "\\title{Sections and Chapters}\n" +
      "\n" +
      "\\section{Second Section}\n" +
      "\n" +
      "\\subsection{Subsection}\n" +
      "\n" +
      "\\addcontentsline{toc}{section}{Unnumbered second Section}\n" +
      "\\section*{Unnumbered second Section}\n" +
      "\n" +
      "\\addcontentsline{toc}{subsection}{Unnumbered first Subsection}\n" +
      "\\subsection*{Unnumbered first Subsection}\n" +
      "\n" +
      "\\addcontentsline{toc}{subsection}{Unnumbered second Subsection}\n" +
      "\\subsection*{Unnumbered second Subsection}\n" +
      "\n" +
      "\\subsection{second Subsection}\n",
    html: `<div><div class="table-of-contents" style="display: none"><ul><li class="toc-title-1"><a href="#sections-and-chapters" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters">Sections and Chapters</a><ul><li class="toc-title-2"><a href="#introduction" style="cursor: pointer; text-decoration: none;" class="toc-link" value="introduction">Introduction</a><ul><li class="toc-title-3"><a href="#subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection">Subsection</a></li></ul></li><li class="toc-title-2"><a href="#unnumbered-first-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-first-section">Unnumbered first Section</a><ul><li class="toc-title-3"><a href="#unnumbered-first-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-first-subsection">Unnumbered first Subsection</a></li><li class="toc-title-3"><a href="#unnumbered-second-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-second-subsection">Unnumbered second Subsection</a></li><li class="toc-title-3"><a href="#unnumbered-first-subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-first-subsection-2">Unnumbered first Subsection</a></li><li class="toc-title-3"><a href="#second-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsection">second Subsection</a></li></ul></li></ul></li><li class="toc-title-1"><a href="#sections-and-chapters-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters-2">Sections and Chapters</a><ul><li class="toc-title-2"><a href="#second-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-section">Second Section</a><ul><li class="toc-title-3"><a href="#subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection-2">Subsection</a></li></ul></li><li class="toc-title-2"><a href="#unnumbered-second-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-second-section">Unnumbered second Section</a><ul><li class="toc-title-3"><a href="#unnumbered-first-subsection-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-first-subsection-3">Unnumbered first Subsection</a></li><li class="toc-title-3"><a href="#unnumbered-second-subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-second-subsection-2">Unnumbered second Subsection</a></li><li class="toc-title-3"><a href="#second-subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsection-2">second Subsection</a></li></ul></li></ul></li></ul></div></div>
<h1 type="title" class="main-title" id="sections-and-chapters">
Sections and Chapters</h1>
<h2 type="section" class="section-title" id="introduction">
<span class="section-number">1. </span>Introduction</h2>
<div>This is the first section.</div>
<h3 type="subsection" class="sub_section-title" id="subsection">
<span class="section-number">1.</span><span class="sub_section-number">1.</span> Subsection</h3>
<div class="addcontentsline" style="margin-top: 0; margin-bottom: 0;">
</div>
<h2 type="section" data-unnumbered="true" class="section-title" id="unnumbered-first-section">
Unnumbered first Section</h2>
<div class="addcontentsline" style="margin-top: 0; margin-bottom: 0;">
</div>
<div class="addcontentsline" style="margin-top: 0; margin-bottom: 0;">
</div>
<h3 type="subsection" data-unnumbered="true" class="sub_section-title" id="unnumbered-first-subsection">
Unnumbered first Subsection</h3>
<div class="addcontentsline" style="margin-top: 0; margin-bottom: 0;">
</div>
<h3 type="subsection" data-unnumbered="true" class="sub_section-title" id="unnumbered-first-subsection-2">
Unnumbered first Subsection</h3>
<h3 type="subsection" class="sub_section-title" id="second-subsection">
<span class="section-number">1.</span><span class="sub_section-number">2.</span> second Subsection</h3>
<h3 type="subsection" data-unnumbered="true" class="sub_section-title" id="unnumbered-second-subsection">
Unnumbered second Subsection</h3>
<h1 type="title" class="main-title" id="sections-and-chapters-2">
Sections and Chapters</h1>
<h2 type="section" class="section-title" id="second-section">
<span class="section-number">2. </span>Second Section</h2>
<h3 type="subsection" class="sub_section-title" id="subsection-2">
<span class="section-number">2.</span><span class="sub_section-number">1.</span> Subsection</h3>
<div class="addcontentsline" style="margin-top: 0; margin-bottom: 0;">
</div>
<h2 type="section" data-unnumbered="true" class="section-title" id="unnumbered-second-section">
Unnumbered second Section</h2>
<div class="addcontentsline" style="margin-top: 0; margin-bottom: 0;">
</div>
<h3 type="subsection" data-unnumbered="true" class="sub_section-title" id="unnumbered-first-subsection-3">
Unnumbered first Subsection</h3>
<div class="addcontentsline" style="margin-top: 0; margin-bottom: 0;">
</div>
<h3 type="subsection" data-unnumbered="true" class="sub_section-title" id="unnumbered-second-subsection-2">
Unnumbered second Subsection</h3>
<h3 type="subsection" class="sub_section-title" id="second-subsection-2">
<span class="section-number">2.</span><span class="sub_section-number">2.</span> second Subsection</h3>`,
    tocHtml: `<div id="toc_container"><ul><li class="toc-title-1"><a href="#sections-and-chapters" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters">Sections and Chapters</a><ul><li class="toc-title-2"><a href="#introduction" style="cursor: pointer; text-decoration: none;" class="toc-link" value="introduction">Introduction</a><ul><li class="toc-title-3"><a href="#subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection">Subsection</a></li></ul></li><li class="toc-title-2"><a href="#unnumbered-first-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-first-section">Unnumbered first Section</a><ul><li class="toc-title-3"><a href="#unnumbered-first-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-first-subsection">Unnumbered first Subsection</a></li><li class="toc-title-3"><a href="#unnumbered-second-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-second-subsection">Unnumbered second Subsection</a></li><li class="toc-title-3"><a href="#unnumbered-first-subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-first-subsection-2">Unnumbered first Subsection</a></li><li class="toc-title-3"><a href="#second-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsection">second Subsection</a></li></ul></li></ul></li><li class="toc-title-1"><a href="#sections-and-chapters-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters-2">Sections and Chapters</a><ul><li class="toc-title-2"><a href="#second-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-section">Second Section</a><ul><li class="toc-title-3"><a href="#subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection-2">Subsection</a></li></ul></li><li class="toc-title-2"><a href="#unnumbered-second-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-second-section">Unnumbered second Section</a><ul><li class="toc-title-3"><a href="#unnumbered-first-subsection-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-first-subsection-3">Unnumbered first Subsection</a></li><li class="toc-title-3"><a href="#unnumbered-second-subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-second-subsection-2">Unnumbered second Subsection</a></li><li class="toc-title-3"><a href="#second-subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsection-2">second Subsection</a></li></ul></li></ul></li></ul></div>`,
    tocHtmlSummary: `<div id="toc_container"><ul><li class="toc-title-1"><details><summary><a href="#sections-and-chapters" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters">Sections and Chapters</a></summary><ul><li class="toc-title-2"><details><summary><a href="#introduction" style="cursor: pointer; text-decoration: none;" class="toc-link" value="introduction">Introduction</a></summary><ul><li class="toc-title-3"><a href="#subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection">Subsection</a></li></ul></details></li><li class="toc-title-2"><details><summary><a href="#unnumbered-first-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-first-section">Unnumbered first Section</a></summary><ul><li class="toc-title-3"><a href="#unnumbered-first-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-first-subsection">Unnumbered first Subsection</a></li><li class="toc-title-3"><a href="#unnumbered-second-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-second-subsection">Unnumbered second Subsection</a></li><li class="toc-title-3"><a href="#unnumbered-first-subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-first-subsection-2">Unnumbered first Subsection</a></li><li class="toc-title-3"><a href="#second-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsection">second Subsection</a></li></ul></details></li></ul></details></li><li class="toc-title-1"><details><summary><a href="#sections-and-chapters-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters-2">Sections and Chapters</a></summary><ul><li class="toc-title-2"><details><summary><a href="#second-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-section">Second Section</a></summary><ul><li class="toc-title-3"><a href="#subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection-2">Subsection</a></li></ul></details></li><li class="toc-title-2"><details><summary><a href="#unnumbered-second-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-second-section">Unnumbered second Section</a></summary><ul><li class="toc-title-3"><a href="#unnumbered-first-subsection-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-first-subsection-3">Unnumbered first Subsection</a></li><li class="toc-title-3"><a href="#unnumbered-second-subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-second-subsection-2">Unnumbered second Subsection</a></li><li class="toc-title-3"><a href="#second-subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsection-2">second Subsection</a></li></ul></details></li></ul></details></li></ul></div>`,
  },  
  {
    latex: "[[toc]]\n" +
      "\n" +
      "\\title{Sections and Chapters}\n" +
      "\n" +
      "\\section{Introduction}\n" +
      "This is the first section (numbered).\n" +
      "\n" +
      "\\addcontentsline{toc}{section}{Unnumbered Section}\n" +
      "\\section*{Unnumbered Section}\n" +
      "An unnumbered section\n" +
      "\n" +
      "\n" +
      "\\section{Second section}\n" +
      "The second numbered section.\n",
    html: `<div><div class="table-of-contents" style="display: none"><ul><li class="toc-title-1"><a href="#sections-and-chapters" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters">Sections and Chapters</a><ul><li class="toc-title-2"><a href="#introduction" style="cursor: pointer; text-decoration: none;" class="toc-link" value="introduction">Introduction</a></li><li class="toc-title-2"><a href="#unnumbered-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-section">Unnumbered Section</a></li><li class="toc-title-2"><a href="#second-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-section">Second section</a></li></ul></li></ul></div></div>
<h1 type="title" class="main-title" id="sections-and-chapters">
Sections and Chapters</h1>
<h2 type="section" class="section-title" id="introduction">
<span class="section-number">1. </span>Introduction</h2>
<div>This is the first section (numbered).</div>
<div class="addcontentsline" style="margin-top: 0; margin-bottom: 0;">
</div>
<h2 type="section" data-unnumbered="true" class="section-title" id="unnumbered-section">
Unnumbered Section</h2>
<div>An unnumbered section</div>
<h2 type="section" class="section-title" id="second-section">
<span class="section-number">2. </span>Second section</h2>
<div>The second numbered section.</div>`,
    tocHtml: `<div id="toc_container"><ul><li class="toc-title-1"><a href="#sections-and-chapters" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters">Sections and Chapters</a><ul><li class="toc-title-2"><a href="#introduction" style="cursor: pointer; text-decoration: none;" class="toc-link" value="introduction">Introduction</a></li><li class="toc-title-2"><a href="#unnumbered-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-section">Unnumbered Section</a></li><li class="toc-title-2"><a href="#second-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-section">Second section</a></li></ul></li></ul></div>`,
    tocHtmlSummary: `<div id="toc_container"><ul><li class="toc-title-1"><details><summary><a href="#sections-and-chapters" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections-and-chapters">Sections and Chapters</a></summary><ul><li class="toc-title-2"><a href="#introduction" style="cursor: pointer; text-decoration: none;" class="toc-link" value="introduction">Introduction</a></li><li class="toc-title-2"><a href="#unnumbered-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-section">Unnumbered Section</a></li><li class="toc-title-2"><a href="#second-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-section">Second section</a></li></ul></details></li></ul></div>`,
  },  
  {
    latex: "\\title{Sections}\n" +
      "\n" +
      "[[toc]]\n" +
      "\n" +
      "\\section{First section}\n" +
      "\n" +
      "This is the first section.\n" +
      "\n" +
      "\\newtheorem{theorem} {Theorem $x\\sqrt{4}$ \\textit{italic} text}\n" +
      "\n" +
      "\\begin{theorem}\n" +
      "Text theorem. Theorem print can include  LaTeX commands\n" +
      "\\end{theorem}\n" +
      "\n" +
      "\\subsection{First subsection}\n" +
      "\n" +
      "\\setcounter{section}{5}\n" +
      "\n" +
      "\\subsection{Second subsection $x\\sqrt{4}$ \\textit{new section number 5}}\n" +
      "\n" +
      "\\section{Second section  \\textit{new number 6}}\n" +
      "This is the second section\n" +
      "\n" +
      "\\subsubsection{Subsubsection with link [v3/text $math$](https://docs.mathpix.com/#process-an-image)}\n" +
      "\n" +
      "\\section*{Unnumbered first section}\n" +
      "\n" +
      "\\subsubsection{Subsubsection}\n" +
      "This is the first section.\n" +
      "\n" +
      "\n" +
      "\\section*{Unnumbered second Section}\n" +
      "This is the second section\n" +
      "\n" +
      "\\subsection*{Unnumbered first Subsection}\n" +
      "\n" +
      "\\addcontentsline{toc}{subsection}{Unnumbered second Subsection}\n" +
      "\\subsection*{Unnumbered second Subsection}\n" +
      "\n" +
      "# Header 1\n" +
      "\n" +
      "# Header 1",
    html: `<h1 type="title" class="main-title" id="sections">
Sections</h1>
<div><div class="table-of-contents" style="display: none"><ul><li class="toc-title-1"><a href="#sections" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections">Sections</a><ul><li class="toc-title-2"><a href="#first-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="first-section">First section</a><ul><li class="toc-title-3"><a href="#first-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="first-subsection">First subsection</a></li><li class="toc-title-3"><a href="#second-subsection-%24x%5Csqrt%7B4%7D%24-%5Ctextit%7Bnew-section-number-5%7D" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsection-%24x%5Csqrt%7B4%7D%24-%5Ctextit%7Bnew-section-number-5%7D">Second subsection <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.213ex" xmlns="http://www.w3.org/2000/svg" width="4.355ex" height="2.398ex" role="img" focusable="false" viewBox="0 -966 1925 1060"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="78" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="msqrt" transform="translate(572, 0)"><g transform="translate(853, 0)"><g data-mml-node="mn"><path data-c="34" d="M462 0Q444 3 333 3Q217 3 199 0H190V46H221Q241 46 248 46T265 48T279 53T286 61Q287 63 287 115V165H28V211L179 442Q332 674 334 675Q336 677 355 677H373L379 671V211H471V165H379V114Q379 73 379 66T385 54Q393 47 442 46H471V0H462ZM293 211V545L74 212L183 211H293Z"></path></g></g><g data-mml-node="mo" transform="translate(0, 106)"><path data-c="221A" d="M95 178Q89 178 81 186T72 200T103 230T169 280T207 309Q209 311 212 311H213Q219 311 227 294T281 177Q300 134 312 108L397 -77Q398 -77 501 136T707 565T814 786Q820 800 834 800Q841 800 846 794T853 782V776L620 293L385 -193Q381 -200 366 -200Q357 -200 354 -197Q352 -195 256 15L160 225L144 214Q129 202 113 190T95 178Z"></path></g><rect width="500" height="60" x="853" y="846"></rect></g></g></g></svg></mjx-container></span> <em>new section number 5</em></a></li></ul></li><li class="toc-title-2"><a href="#second-section-%5Ctextit%7Bnew-number-6%7D" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-section-%5Ctextit%7Bnew-number-6%7D">Second section  <em>new number 6</em></a><ul><li class="toc-title-4"><a href="#subsubsection-with-link-%5Bv3%2Ftext-%24math%24%5D(https%3A%2F%2Fdocs.mathpix.com%2F%23process-an-image)" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-with-link-%5Bv3%2Ftext-%24math%24%5D(https%3A%2F%2Fdocs.mathpix.com%2F%23process-an-image)">Subsubsection with link <span>v3/text <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="5.303ex" height="1.595ex" role="img" focusable="false" viewBox="0 -694 2344 705"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="6D" d="M21 287Q22 293 24 303T36 341T56 388T88 425T132 442T175 435T205 417T221 395T229 376L231 369Q231 367 232 367L243 378Q303 442 384 442Q401 442 415 440T441 433T460 423T475 411T485 398T493 385T497 373T500 364T502 357L510 367Q573 442 659 442Q713 442 746 415T780 336Q780 285 742 178T704 50Q705 36 709 31T724 26Q752 26 776 56T815 138Q818 149 821 151T837 153Q857 153 857 145Q857 144 853 130Q845 101 831 73T785 17T716 -10Q669 -10 648 17T627 73Q627 92 663 193T700 345Q700 404 656 404H651Q565 404 506 303L499 291L466 157Q433 26 428 16Q415 -11 385 -11Q372 -11 364 -4T353 8T350 18Q350 29 384 161L420 307Q423 322 423 345Q423 404 379 404H374Q288 404 229 303L222 291L189 157Q156 26 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 112 181Q151 335 151 342Q154 357 154 369Q154 405 129 405Q107 405 92 377T69 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g><g data-mml-node="mi" transform="translate(878, 0)"><path data-c="61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path></g><g data-mml-node="mi" transform="translate(1407, 0)"><path data-c="74" d="M26 385Q19 392 19 395Q19 399 22 411T27 425Q29 430 36 430T87 431H140L159 511Q162 522 166 540T173 566T179 586T187 603T197 615T211 624T229 626Q247 625 254 615T261 596Q261 589 252 549T232 470L222 433Q222 431 272 431H323Q330 424 330 420Q330 398 317 385H210L174 240Q135 80 135 68Q135 26 162 26Q197 26 230 60T283 144Q285 150 288 151T303 153H307Q322 153 322 145Q322 142 319 133Q314 117 301 95T267 48T216 6T155 -11Q125 -11 98 4T59 56Q57 64 57 83V101L92 241Q127 382 128 383Q128 385 77 385H26Z"></path></g><g data-mml-node="mi" transform="translate(1768, 0)"><path data-c="68" d="M137 683Q138 683 209 688T282 694Q294 694 294 685Q294 674 258 534Q220 386 220 383Q220 381 227 388Q288 442 357 442Q411 442 444 415T478 336Q478 285 440 178T402 50Q403 36 407 31T422 26Q450 26 474 56T513 138Q516 149 519 151T535 153Q555 153 555 145Q555 144 551 130Q535 71 500 33Q466 -10 419 -10H414Q367 -10 346 17T325 74Q325 90 361 192T398 345Q398 404 354 404H349Q266 404 205 306L198 293L164 158Q132 28 127 16Q114 -11 83 -11Q69 -11 59 -2T48 16Q48 30 121 320L195 616Q195 629 188 632T149 637H128Q122 643 122 645T124 664Q129 683 137 683Z"></path></g></g></g></svg></mjx-container></span></span></a></li><li class="toc-title-4"><a href="#subsubsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection">Subsubsection</a></li><li class="toc-title-3"><a href="#unnumbered-second-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-second-subsection">Unnumbered second Subsection</a></li></ul></li></ul></li><li class="toc-title-1"><a href="#header-1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-1">Header 1</a></li><li class="toc-title-1"><a href="#header-1-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-1-2">Header 1</a></li></ul></div></div>
<h2 type="section" class="section-title" id="first-section">
<span class="section-number">1. </span>First section</h2>
<div>This is the first section.</div>
<div style="margin-top: 0; margin-bottom: 0;"></div>
<div class="theorem_block">
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Theorem <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.213ex" xmlns="http://www.w3.org/2000/svg" width="4.355ex" height="2.398ex" role="img" focusable="false" viewBox="0 -966 1925 1060"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="78" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="msqrt" transform="translate(572, 0)"><g transform="translate(853, 0)"><g data-mml-node="mn"><path data-c="34" d="M462 0Q444 3 333 3Q217 3 199 0H190V46H221Q241 46 248 46T265 48T279 53T286 61Q287 63 287 115V165H28V211L179 442Q332 674 334 675Q336 677 355 677H373L379 671V211H471V165H379V114Q379 73 379 66T385 54Q393 47 442 46H471V0H462ZM293 211V545L74 212L183 211H293Z"></path></g></g><g data-mml-node="mo" transform="translate(0, 106)"><path data-c="221A" d="M95 178Q89 178 81 186T72 200T103 230T169 280T207 309Q209 311 212 311H213Q219 311 227 294T281 177Q300 134 312 108L397 -77Q398 -77 501 136T707 565T814 786Q820 800 834 800Q841 800 846 794T853 782V776L620 293L385 -193Q381 -200 366 -200Q357 -200 354 -197Q352 -195 256 15L160 225L144 214Q129 202 113 190T95 178Z"></path></g><rect width="500" height="60" x="853" y="846"></rect></g></g></g></svg></mjx-container></span> <em>italic</em> text 1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Text theorem. Theorem print can include  LaTeX commands</div>
</div></div>
<h3 type="subsection" class="sub_section-title" id="first-subsection">
<span class="section-number">1.</span><span class="sub_section-number">1.</span> First subsection</h3>
<div style="margin-top: 0; margin-bottom: 0;"></div>
<h3 type="subsection" class="sub_section-title" id="second-subsection-%24x%5Csqrt%7B4%7D%24-%5Ctextit%7Bnew-section-number-5%7D">
<span class="section-number">5.</span><span class="sub_section-number">2.</span> Second subsection <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.213ex" xmlns="http://www.w3.org/2000/svg" width="4.355ex" height="2.398ex" role="img" focusable="false" viewBox="0 -966 1925 1060"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="78" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="msqrt" transform="translate(572, 0)"><g transform="translate(853, 0)"><g data-mml-node="mn"><path data-c="34" d="M462 0Q444 3 333 3Q217 3 199 0H190V46H221Q241 46 248 46T265 48T279 53T286 61Q287 63 287 115V165H28V211L179 442Q332 674 334 675Q336 677 355 677H373L379 671V211H471V165H379V114Q379 73 379 66T385 54Q393 47 442 46H471V0H462ZM293 211V545L74 212L183 211H293Z"></path></g></g><g data-mml-node="mo" transform="translate(0, 106)"><path data-c="221A" d="M95 178Q89 178 81 186T72 200T103 230T169 280T207 309Q209 311 212 311H213Q219 311 227 294T281 177Q300 134 312 108L397 -77Q398 -77 501 136T707 565T814 786Q820 800 834 800Q841 800 846 794T853 782V776L620 293L385 -193Q381 -200 366 -200Q357 -200 354 -197Q352 -195 256 15L160 225L144 214Q129 202 113 190T95 178Z"></path></g><rect width="500" height="60" x="853" y="846"></rect></g></g></g></svg></mjx-container></span> <em>new section number 5</em></h3>
<h2 type="section" class="section-title" id="second-section-%5Ctextit%7Bnew-number-6%7D">
<span class="section-number">6. </span>Second section  <em>new number 6</em></h2>
<div>This is the second section</div>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-with-link-%5Bv3%2Ftext-%24math%24%5D(https%3A%2F%2Fdocs.mathpix.com%2F%23process-an-image)">
<span class="section-number">6.</span><span class="sub_section-number">0.1.</span> Subsubsection with link <a href="https://docs.mathpix.com/#process-an-image" target="_blank" rel="noopener" style="word-break: break-word">v3/text <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="5.303ex" height="1.595ex" role="img" focusable="false" viewBox="0 -694 2344 705"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="6D" d="M21 287Q22 293 24 303T36 341T56 388T88 425T132 442T175 435T205 417T221 395T229 376L231 369Q231 367 232 367L243 378Q303 442 384 442Q401 442 415 440T441 433T460 423T475 411T485 398T493 385T497 373T500 364T502 357L510 367Q573 442 659 442Q713 442 746 415T780 336Q780 285 742 178T704 50Q705 36 709 31T724 26Q752 26 776 56T815 138Q818 149 821 151T837 153Q857 153 857 145Q857 144 853 130Q845 101 831 73T785 17T716 -10Q669 -10 648 17T627 73Q627 92 663 193T700 345Q700 404 656 404H651Q565 404 506 303L499 291L466 157Q433 26 428 16Q415 -11 385 -11Q372 -11 364 -4T353 8T350 18Q350 29 384 161L420 307Q423 322 423 345Q423 404 379 404H374Q288 404 229 303L222 291L189 157Q156 26 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 112 181Q151 335 151 342Q154 357 154 369Q154 405 129 405Q107 405 92 377T69 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g><g data-mml-node="mi" transform="translate(878, 0)"><path data-c="61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path></g><g data-mml-node="mi" transform="translate(1407, 0)"><path data-c="74" d="M26 385Q19 392 19 395Q19 399 22 411T27 425Q29 430 36 430T87 431H140L159 511Q162 522 166 540T173 566T179 586T187 603T197 615T211 624T229 626Q247 625 254 615T261 596Q261 589 252 549T232 470L222 433Q222 431 272 431H323Q330 424 330 420Q330 398 317 385H210L174 240Q135 80 135 68Q135 26 162 26Q197 26 230 60T283 144Q285 150 288 151T303 153H307Q322 153 322 145Q322 142 319 133Q314 117 301 95T267 48T216 6T155 -11Q125 -11 98 4T59 56Q57 64 57 83V101L92 241Q127 382 128 383Q128 385 77 385H26Z"></path></g><g data-mml-node="mi" transform="translate(1768, 0)"><path data-c="68" d="M137 683Q138 683 209 688T282 694Q294 694 294 685Q294 674 258 534Q220 386 220 383Q220 381 227 388Q288 442 357 442Q411 442 444 415T478 336Q478 285 440 178T402 50Q403 36 407 31T422 26Q450 26 474 56T513 138Q516 149 519 151T535 153Q555 153 555 145Q555 144 551 130Q535 71 500 33Q466 -10 419 -10H414Q367 -10 346 17T325 74Q325 90 361 192T398 345Q398 404 354 404H349Q266 404 205 306L198 293L164 158Q132 28 127 16Q114 -11 83 -11Q69 -11 59 -2T48 16Q48 30 121 320L195 616Q195 629 188 632T149 637H128Q122 643 122 645T124 664Q129 683 137 683Z"></path></g></g></g></svg></mjx-container></span></a></h4>
<h2 type="section" data-unnumbered="true" class="section-title" id="unnumbered-first-section">
Unnumbered first section</h2>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection">
<span class="section-number">6.</span><span class="sub_section-number">0.2.</span> Subsubsection</h4>
<div>This is the first section.</div>
<h2 type="section" data-unnumbered="true" class="section-title" id="unnumbered-second-section">
Unnumbered second Section</h2>
<div>This is the second section</div>
<h3 type="subsection" data-unnumbered="true" class="sub_section-title" id="unnumbered-first-subsection">
Unnumbered first Subsection</h3>
<div class="addcontentsline" style="margin-top: 0; margin-bottom: 0;">
</div>
<h3 type="subsection" data-unnumbered="true" class="sub_section-title" id="unnumbered-second-subsection">
Unnumbered second Subsection</h3>
<h1 id="header-1">Header 1</h1>
<h1 id="header-1-2">Header 1</h1>`,
    tocHtml: `<div id="toc_container"><ul><li class="toc-title-1"><a href="#sections" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections">Sections</a><ul><li class="toc-title-2"><a href="#first-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="first-section">First section</a><ul><li class="toc-title-3"><a href="#first-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="first-subsection">First subsection</a></li><li class="toc-title-3"><a href="#second-subsection-%24x%5Csqrt%7B4%7D%24-%5Ctextit%7Bnew-section-number-5%7D" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsection-%24x%5Csqrt%7B4%7D%24-%5Ctextit%7Bnew-section-number-5%7D">Second subsection <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.213ex" xmlns="http://www.w3.org/2000/svg" width="4.355ex" height="2.398ex" role="img" focusable="false" viewBox="0 -966 1925 1060"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="78" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="msqrt" transform="translate(572, 0)"><g transform="translate(853, 0)"><g data-mml-node="mn"><path data-c="34" d="M462 0Q444 3 333 3Q217 3 199 0H190V46H221Q241 46 248 46T265 48T279 53T286 61Q287 63 287 115V165H28V211L179 442Q332 674 334 675Q336 677 355 677H373L379 671V211H471V165H379V114Q379 73 379 66T385 54Q393 47 442 46H471V0H462ZM293 211V545L74 212L183 211H293Z"></path></g></g><g data-mml-node="mo" transform="translate(0, 106)"><path data-c="221A" d="M95 178Q89 178 81 186T72 200T103 230T169 280T207 309Q209 311 212 311H213Q219 311 227 294T281 177Q300 134 312 108L397 -77Q398 -77 501 136T707 565T814 786Q820 800 834 800Q841 800 846 794T853 782V776L620 293L385 -193Q381 -200 366 -200Q357 -200 354 -197Q352 -195 256 15L160 225L144 214Q129 202 113 190T95 178Z"></path></g><rect width="500" height="60" x="853" y="846"></rect></g></g></g></svg></mjx-container></span> <em>new section number 5</em></a></li></ul></li><li class="toc-title-2"><a href="#second-section-%5Ctextit%7Bnew-number-6%7D" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-section-%5Ctextit%7Bnew-number-6%7D">Second section  <em>new number 6</em></a><ul><li class="toc-title-4"><a href="#subsubsection-with-link-%5Bv3%2Ftext-%24math%24%5D(https%3A%2F%2Fdocs.mathpix.com%2F%23process-an-image)" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-with-link-%5Bv3%2Ftext-%24math%24%5D(https%3A%2F%2Fdocs.mathpix.com%2F%23process-an-image)">Subsubsection with link <span>v3/text <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="5.303ex" height="1.595ex" role="img" focusable="false" viewBox="0 -694 2344 705"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="6D" d="M21 287Q22 293 24 303T36 341T56 388T88 425T132 442T175 435T205 417T221 395T229 376L231 369Q231 367 232 367L243 378Q303 442 384 442Q401 442 415 440T441 433T460 423T475 411T485 398T493 385T497 373T500 364T502 357L510 367Q573 442 659 442Q713 442 746 415T780 336Q780 285 742 178T704 50Q705 36 709 31T724 26Q752 26 776 56T815 138Q818 149 821 151T837 153Q857 153 857 145Q857 144 853 130Q845 101 831 73T785 17T716 -10Q669 -10 648 17T627 73Q627 92 663 193T700 345Q700 404 656 404H651Q565 404 506 303L499 291L466 157Q433 26 428 16Q415 -11 385 -11Q372 -11 364 -4T353 8T350 18Q350 29 384 161L420 307Q423 322 423 345Q423 404 379 404H374Q288 404 229 303L222 291L189 157Q156 26 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 112 181Q151 335 151 342Q154 357 154 369Q154 405 129 405Q107 405 92 377T69 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g><g data-mml-node="mi" transform="translate(878, 0)"><path data-c="61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path></g><g data-mml-node="mi" transform="translate(1407, 0)"><path data-c="74" d="M26 385Q19 392 19 395Q19 399 22 411T27 425Q29 430 36 430T87 431H140L159 511Q162 522 166 540T173 566T179 586T187 603T197 615T211 624T229 626Q247 625 254 615T261 596Q261 589 252 549T232 470L222 433Q222 431 272 431H323Q330 424 330 420Q330 398 317 385H210L174 240Q135 80 135 68Q135 26 162 26Q197 26 230 60T283 144Q285 150 288 151T303 153H307Q322 153 322 145Q322 142 319 133Q314 117 301 95T267 48T216 6T155 -11Q125 -11 98 4T59 56Q57 64 57 83V101L92 241Q127 382 128 383Q128 385 77 385H26Z"></path></g><g data-mml-node="mi" transform="translate(1768, 0)"><path data-c="68" d="M137 683Q138 683 209 688T282 694Q294 694 294 685Q294 674 258 534Q220 386 220 383Q220 381 227 388Q288 442 357 442Q411 442 444 415T478 336Q478 285 440 178T402 50Q403 36 407 31T422 26Q450 26 474 56T513 138Q516 149 519 151T535 153Q555 153 555 145Q555 144 551 130Q535 71 500 33Q466 -10 419 -10H414Q367 -10 346 17T325 74Q325 90 361 192T398 345Q398 404 354 404H349Q266 404 205 306L198 293L164 158Q132 28 127 16Q114 -11 83 -11Q69 -11 59 -2T48 16Q48 30 121 320L195 616Q195 629 188 632T149 637H128Q122 643 122 645T124 664Q129 683 137 683Z"></path></g></g></g></svg></mjx-container></span></span></a></li><li class="toc-title-4"><a href="#subsubsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection">Subsubsection</a></li><li class="toc-title-3"><a href="#unnumbered-second-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-second-subsection">Unnumbered second Subsection</a></li></ul></li></ul></li><li class="toc-title-1"><a href="#header-1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-1">Header 1</a></li><li class="toc-title-1"><a href="#header-1-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-1-2">Header 1</a></li></ul></div>`,
    tocHtmlSummary: `<div id="toc_container"><ul><li class="toc-title-1"><details><summary><a href="#sections" style="cursor: pointer; text-decoration: none;" class="toc-link" value="sections">Sections</a></summary><ul><li class="toc-title-2"><details><summary><a href="#first-section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="first-section">First section</a></summary><ul><li class="toc-title-3"><a href="#first-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="first-subsection">First subsection</a></li><li class="toc-title-3"><a href="#second-subsection-%24x%5Csqrt%7B4%7D%24-%5Ctextit%7Bnew-section-number-5%7D" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-subsection-%24x%5Csqrt%7B4%7D%24-%5Ctextit%7Bnew-section-number-5%7D">Second subsection <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.213ex" xmlns="http://www.w3.org/2000/svg" width="4.355ex" height="2.398ex" role="img" focusable="false" viewBox="0 -966 1925 1060"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="78" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="msqrt" transform="translate(572, 0)"><g transform="translate(853, 0)"><g data-mml-node="mn"><path data-c="34" d="M462 0Q444 3 333 3Q217 3 199 0H190V46H221Q241 46 248 46T265 48T279 53T286 61Q287 63 287 115V165H28V211L179 442Q332 674 334 675Q336 677 355 677H373L379 671V211H471V165H379V114Q379 73 379 66T385 54Q393 47 442 46H471V0H462ZM293 211V545L74 212L183 211H293Z"></path></g></g><g data-mml-node="mo" transform="translate(0, 106)"><path data-c="221A" d="M95 178Q89 178 81 186T72 200T103 230T169 280T207 309Q209 311 212 311H213Q219 311 227 294T281 177Q300 134 312 108L397 -77Q398 -77 501 136T707 565T814 786Q820 800 834 800Q841 800 846 794T853 782V776L620 293L385 -193Q381 -200 366 -200Q357 -200 354 -197Q352 -195 256 15L160 225L144 214Q129 202 113 190T95 178Z"></path></g><rect width="500" height="60" x="853" y="846"></rect></g></g></g></svg></mjx-container></span> <em>new section number 5</em></a></li></ul></details></li><li class="toc-title-2"><details><summary><a href="#second-section-%5Ctextit%7Bnew-number-6%7D" style="cursor: pointer; text-decoration: none;" class="toc-link" value="second-section-%5Ctextit%7Bnew-number-6%7D">Second section  <em>new number 6</em></a></summary><ul><li class="toc-title-4"><a href="#subsubsection-with-link-%5Bv3%2Ftext-%24math%24%5D(https%3A%2F%2Fdocs.mathpix.com%2F%23process-an-image)" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-with-link-%5Bv3%2Ftext-%24math%24%5D(https%3A%2F%2Fdocs.mathpix.com%2F%23process-an-image)">Subsubsection with link <span>v3/text <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="5.303ex" height="1.595ex" role="img" focusable="false" viewBox="0 -694 2344 705"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="6D" d="M21 287Q22 293 24 303T36 341T56 388T88 425T132 442T175 435T205 417T221 395T229 376L231 369Q231 367 232 367L243 378Q303 442 384 442Q401 442 415 440T441 433T460 423T475 411T485 398T493 385T497 373T500 364T502 357L510 367Q573 442 659 442Q713 442 746 415T780 336Q780 285 742 178T704 50Q705 36 709 31T724 26Q752 26 776 56T815 138Q818 149 821 151T837 153Q857 153 857 145Q857 144 853 130Q845 101 831 73T785 17T716 -10Q669 -10 648 17T627 73Q627 92 663 193T700 345Q700 404 656 404H651Q565 404 506 303L499 291L466 157Q433 26 428 16Q415 -11 385 -11Q372 -11 364 -4T353 8T350 18Q350 29 384 161L420 307Q423 322 423 345Q423 404 379 404H374Q288 404 229 303L222 291L189 157Q156 26 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 112 181Q151 335 151 342Q154 357 154 369Q154 405 129 405Q107 405 92 377T69 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g><g data-mml-node="mi" transform="translate(878, 0)"><path data-c="61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path></g><g data-mml-node="mi" transform="translate(1407, 0)"><path data-c="74" d="M26 385Q19 392 19 395Q19 399 22 411T27 425Q29 430 36 430T87 431H140L159 511Q162 522 166 540T173 566T179 586T187 603T197 615T211 624T229 626Q247 625 254 615T261 596Q261 589 252 549T232 470L222 433Q222 431 272 431H323Q330 424 330 420Q330 398 317 385H210L174 240Q135 80 135 68Q135 26 162 26Q197 26 230 60T283 144Q285 150 288 151T303 153H307Q322 153 322 145Q322 142 319 133Q314 117 301 95T267 48T216 6T155 -11Q125 -11 98 4T59 56Q57 64 57 83V101L92 241Q127 382 128 383Q128 385 77 385H26Z"></path></g><g data-mml-node="mi" transform="translate(1768, 0)"><path data-c="68" d="M137 683Q138 683 209 688T282 694Q294 694 294 685Q294 674 258 534Q220 386 220 383Q220 381 227 388Q288 442 357 442Q411 442 444 415T478 336Q478 285 440 178T402 50Q403 36 407 31T422 26Q450 26 474 56T513 138Q516 149 519 151T535 153Q555 153 555 145Q555 144 551 130Q535 71 500 33Q466 -10 419 -10H414Q367 -10 346 17T325 74Q325 90 361 192T398 345Q398 404 354 404H349Q266 404 205 306L198 293L164 158Q132 28 127 16Q114 -11 83 -11Q69 -11 59 -2T48 16Q48 30 121 320L195 616Q195 629 188 632T149 637H128Q122 643 122 645T124 664Q129 683 137 683Z"></path></g></g></g></svg></mjx-container></span></span></a></li><li class="toc-title-4"><a href="#subsubsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection">Subsubsection</a></li><li class="toc-title-3"><a href="#unnumbered-second-subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="unnumbered-second-subsection">Unnumbered second Subsection</a></li></ul></details></li></ul></details></li><li class="toc-title-1"><a href="#header-1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-1">Header 1</a></li><li class="toc-title-1"><a href="#header-1-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-1-2">Header 1</a></li></ul></div>`,
  },  
  {
    latex: "[[toc]]\n" +
    "\n" +
    "\\subsubsection{subsubsection number should be 0.0.1}\n" +
    "\n" +
    "\\subsubsection{subsubsection number should be 0.0.2}\n" +
    "\n" +
    "\\subsubsection{subsubsection number should be 0.0.3}\n" +
    "\n" +
    "\\subsubsection{subsubsection number should be 0.0.4}\n" +
    "\n" +
    "\\section{section}\n" +
    "\n" +
    "\\subsubsection{subsubsection number should be 1.0.1}\n" +
    "\n" +
    "\\subsubsection{subsubsection number should be 1.0.2}\n" +
    "\n" +
    "\\subsubsection{subsubsection number should be 1.0.3}\n" +
    "\n" +
    "\\subsubsection{subsubsection number should be 1.0.4}\n" +
    "\n" +
    "\\section{section}\n" +
    "\n" +
    "\\subsubsection{subsubsection number should be 2.0.1}\n" +
    "\n" +
    "\\subsubsection{subsubsection number should be 2.0.2}\n" +
    "\n" +
    "\\subsubsection{subsubsection number should be 2.0.3}\n" +
    "\n" +
    "\\subsubsection{subsubsection number should be 2.0.4}\n" +
    "\n" +
    "\\subsection{subsection}\n" +
    "\n" +
    "\\subsubsection{subsubsection number should be 2.1.1}\n" +
    "\n" +
    "\\subsubsection{subsubsection number should be 2.1.2}\n" +
    "\n" +
    "\\section{section}\n" +
    "\n" +
    "\\subsubsection{subsubsection number should be 3.0.1}\n" +
    "\n" +
    "\\subsubsection{subsubsection number should be 3.0.2}",
    html: `<div><div class="table-of-contents" style="display: none"><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.1">subsubsection number should be 0.0.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.2">subsubsection number should be 0.0.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.3">subsubsection number should be 0.0.3</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.4">subsubsection number should be 0.0.4</a></li><li class="toc-title-2"><a href="#section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section">section</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-1.0.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-1.0.1">subsubsection number should be 1.0.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-1.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-1.0.2">subsubsection number should be 1.0.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-1.0.3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-1.0.3">subsubsection number should be 1.0.3</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-1.0.4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-1.0.4">subsubsection number should be 1.0.4</a></li></ul></li><li class="toc-title-2"><a href="#section-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section-2">section</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.0.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.0.1">subsubsection number should be 2.0.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.0.2">subsubsection number should be 2.0.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.0.3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.0.3">subsubsection number should be 2.0.3</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.0.4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.0.4">subsubsection number should be 2.0.4</a></li><li class="toc-title-3"><a href="#subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection">subsection</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.1.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.1.1">subsubsection number should be 2.1.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.1.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.1.2">subsubsection number should be 2.1.2</a></li></ul></li></ul></li><li class="toc-title-2"><a href="#section-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section-3">section</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-3.0.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-3.0.1">subsubsection number should be 3.0.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-3.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-3.0.2">subsubsection number should be 3.0.2</a></li></ul></li></ul></div></div>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-0.0.1">
<span class="section-number">0.</span><span class="sub_section-number">0.1.</span> subsubsection number should be 0.0.1</h4>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-0.0.2">
<span class="section-number">0.</span><span class="sub_section-number">0.2.</span> subsubsection number should be 0.0.2</h4>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-0.0.3">
<span class="section-number">0.</span><span class="sub_section-number">0.3.</span> subsubsection number should be 0.0.3</h4>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-0.0.4">
<span class="section-number">0.</span><span class="sub_section-number">0.4.</span> subsubsection number should be 0.0.4</h4>
<h2 type="section" class="section-title" id="section">
<span class="section-number">1. </span>section</h2>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-1.0.1">
<span class="section-number">1.</span><span class="sub_section-number">0.1.</span> subsubsection number should be 1.0.1</h4>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-1.0.2">
<span class="section-number">1.</span><span class="sub_section-number">0.2.</span> subsubsection number should be 1.0.2</h4>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-1.0.3">
<span class="section-number">1.</span><span class="sub_section-number">0.3.</span> subsubsection number should be 1.0.3</h4>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-1.0.4">
<span class="section-number">1.</span><span class="sub_section-number">0.4.</span> subsubsection number should be 1.0.4</h4>
<h2 type="section" class="section-title" id="section-2">
<span class="section-number">2. </span>section</h2>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-2.0.1">
<span class="section-number">2.</span><span class="sub_section-number">0.1.</span> subsubsection number should be 2.0.1</h4>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-2.0.2">
<span class="section-number">2.</span><span class="sub_section-number">0.2.</span> subsubsection number should be 2.0.2</h4>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-2.0.3">
<span class="section-number">2.</span><span class="sub_section-number">0.3.</span> subsubsection number should be 2.0.3</h4>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-2.0.4">
<span class="section-number">2.</span><span class="sub_section-number">0.4.</span> subsubsection number should be 2.0.4</h4>
<h3 type="subsection" class="sub_section-title" id="subsection">
<span class="section-number">2.</span><span class="sub_section-number">1.</span> subsection</h3>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-2.1.1">
<span class="section-number">2.</span><span class="sub_section-number">1.1.</span> subsubsection number should be 2.1.1</h4>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-2.1.2">
<span class="section-number">2.</span><span class="sub_section-number">1.2.</span> subsubsection number should be 2.1.2</h4>
<h2 type="section" class="section-title" id="section-3">
<span class="section-number">3. </span>section</h2>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-3.0.1">
<span class="section-number">3.</span><span class="sub_section-number">0.1.</span> subsubsection number should be 3.0.1</h4>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-3.0.2">
<span class="section-number">3.</span><span class="sub_section-number">0.2.</span> subsubsection number should be 3.0.2</h4>`,
    tocHtml: `<div id="toc_container"><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.1">subsubsection number should be 0.0.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.2">subsubsection number should be 0.0.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.3">subsubsection number should be 0.0.3</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.4">subsubsection number should be 0.0.4</a></li><li class="toc-title-2"><a href="#section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section">section</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-1.0.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-1.0.1">subsubsection number should be 1.0.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-1.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-1.0.2">subsubsection number should be 1.0.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-1.0.3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-1.0.3">subsubsection number should be 1.0.3</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-1.0.4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-1.0.4">subsubsection number should be 1.0.4</a></li></ul></li><li class="toc-title-2"><a href="#section-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section-2">section</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.0.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.0.1">subsubsection number should be 2.0.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.0.2">subsubsection number should be 2.0.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.0.3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.0.3">subsubsection number should be 2.0.3</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.0.4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.0.4">subsubsection number should be 2.0.4</a></li><li class="toc-title-3"><a href="#subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection">subsection</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.1.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.1.1">subsubsection number should be 2.1.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.1.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.1.2">subsubsection number should be 2.1.2</a></li></ul></li></ul></li><li class="toc-title-2"><a href="#section-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section-3">section</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-3.0.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-3.0.1">subsubsection number should be 3.0.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-3.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-3.0.2">subsubsection number should be 3.0.2</a></li></ul></li></ul></div>`,
    tocHtmlSummary: `<div id="toc_container"><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.1">subsubsection number should be 0.0.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.2">subsubsection number should be 0.0.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.3">subsubsection number should be 0.0.3</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.4">subsubsection number should be 0.0.4</a></li><li class="toc-title-2"><details><summary><a href="#section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section">section</a></summary><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-1.0.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-1.0.1">subsubsection number should be 1.0.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-1.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-1.0.2">subsubsection number should be 1.0.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-1.0.3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-1.0.3">subsubsection number should be 1.0.3</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-1.0.4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-1.0.4">subsubsection number should be 1.0.4</a></li></ul></details></li><li class="toc-title-2"><details><summary><a href="#section-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section-2">section</a></summary><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.0.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.0.1">subsubsection number should be 2.0.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.0.2">subsubsection number should be 2.0.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.0.3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.0.3">subsubsection number should be 2.0.3</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.0.4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.0.4">subsubsection number should be 2.0.4</a></li><li class="toc-title-3"><details><summary><a href="#subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection">subsection</a></summary><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.1.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.1.1">subsubsection number should be 2.1.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-2.1.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-2.1.2">subsubsection number should be 2.1.2</a></li></ul></details></li></ul></details></li><li class="toc-title-2"><details><summary><a href="#section-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section-3">section</a></summary><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-3.0.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-3.0.1">subsubsection number should be 3.0.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-3.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-3.0.2">subsubsection number should be 3.0.2</a></li></ul></details></li></ul></div>`,
  },
  {
   latex: "[[toc]]\n" +
   "\n" +
   "Change subsubsection number to 7 `\\setcounter{subsubsection}{7}`\n" +
   "\n" +
   "\\setcounter{subsubsection}{7}\n" +
   "\n" +
   "\\section*{section unnumbered}\n" +
   "\n" +
   "\\subsubsection*{subsubsection unnumbered}\n" +
   "\n" +
   "\\subsubsection{subsubsection number should be 0.0.8}\n" +
   "\n" +
   "Change subsubsection number to 1 `\\setcounter{subsubsection}{1}`\n" +
   "\n" +
   "\\setcounter{subsubsection}{1}\n" +
   "\n" +
   "\\subsubsection{subsubsection number should be 0.0.2}\n" +
   "\n" +
   "\\subsubsection*{subsubsection unnumbered}\n" +
   "\n" +
   "\\subsubsection{subsubsection number should be 0.0.3}\n" +
   "\n" +
   "\\subsubsection{subsubsection number should be 0.0.4}\n" +
   "\n" +
   "\\section{section}\n" +
   "\n" +
   "Change section number to 5 `\\setcounter{section}{5}`\n" +
   "\\setcounter{section}{5}\n" +
   "\n" +
   "\\subsubsection{subsubsection number should be 5.0.1}\n" +
   "\n" +
   "\\subsubsection*{subsubsection unnumbered}\n" +
   "\n" +
   "Change section number to 7 `\\setcounter{section}{7}`\n" +
   "\\setcounter{section}{7}\n" +
   "\\subsubsection{subsubsection number should be 7.0.2}\n" +
   "\n" +
   "\\subsection*{subsection unnumbered}\n" +
   "\n" +
   "\\subsubsection*{subsubsection unnumbered}\n" +
   "\n" +
   "\\subsubsection{subsubsection number should be 7.0.3}\n" +
   "\n" +
   "\\subsubsection{subsubsection number should be 7.0.4}\n" +
   "\n" +
   "\\section*{section unnumbered}\n" +
   "\n" +
   "\\subsubsection*{subsubsection unnumbered}\n" +
   "\n" +
   "\\subsubsection*{subsubsection unnumbered}\n" +
   "\n" +
   "\\section{section}\n" +
   "\n" +
   "Change subsection number to 7 `\\setcounter{subsection}{7}`\n" +
   "\\setcounter{subsection}{7}\n" +
   "\n" +
   "\\subsubsection{subsubsection number should be 8.7.1}\n" +
   "\n" +
   "\\subsubsection*{subsubsection unnumbered}\n" +
   "\n" +
   "\\subsection{subsection}\n" +
   "\n" +
   "\\subsubsection{subsubsection number should be 8.8.1}\n" +
   "\n" +
   "\\subsection*{subsection unnumbered}\n" +
   "\n" +
   "\\subsubsection{subsubsection number should be 8.8.2}\n" +
   "\n" +
   "Change subsubsection number to 7 `\\setcounter{subsubsection}{7}`\n" +
   "\\setcounter{subsubsection}{7}\n" +
   "\n" +
   "\\subsubsection{subsubsection number should be 8.8.8}\n" +
   "\n" +
   "\\subsection{subsection}\n" +
   "\n" +
   "\\subsubsection{subsubsection number should be 8.9.1}\n" +
   "\n" +
   "\\subsubsection*{subsubsection unnumbered}\n" +
   "\n" +
   "\\subsubsection{subsubsection number should be 8.9.2}\n" +
   "\n" +
   "\\subsection*{subsection unnumbered}\n" +
   "\n" +
   "\\section{section}\n" +
   "\n" +
   "Change subsection number to 7 `\\setcounter{subsection}{7}`\n" +
   "\\setcounter{subsection}{7}\n" +
   "\n" +
   "\\subsubsection*{subsubsection unnumbered}\n" +
   "\n" +
   "\\subsection*{subsection unnumbered}\n" +
   "\n" +
   "\\subsubsection{subsubsection number should be 9.7.1}\n" +
   "\n" +
   "\\subsection{subsection}\n" +
   "\n" +
   "\\subsection*{subsection unnumbered}\n" +
   "\n" +
   "\\subsubsection*{subsubsection unnumbered}\n" +
   "\n" +
   "\\subsection*{subsection unnumbered}\n" +
   "\n" +
   "\\subsubsection{subsubsection number should be 9.8.1}",
   html: `<div><div class="table-of-contents" style="display: none"><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.8" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.8">subsubsection number should be 0.0.8</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.2">subsubsection number should be 0.0.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.3">subsubsection number should be 0.0.3</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.4">subsubsection number should be 0.0.4</a></li><li class="toc-title-2"><a href="#section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section">section</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-5.0.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-5.0.1">subsubsection number should be 5.0.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-7.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-7.0.2">subsubsection number should be 7.0.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-7.0.3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-7.0.3">subsubsection number should be 7.0.3</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-7.0.4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-7.0.4">subsubsection number should be 7.0.4</a></li></ul></li><li class="toc-title-2"><a href="#section-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section-2">section</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.7.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.7.1">subsubsection number should be 8.7.1</a></li><li class="toc-title-3"><a href="#subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection">subsection</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.8.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.8.1">subsubsection number should be 8.8.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.8.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.8.2">subsubsection number should be 8.8.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.8.8" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.8.8">subsubsection number should be 8.8.8</a></li></ul></li><li class="toc-title-3"><a href="#subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection-2">subsection</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.9.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.9.1">subsubsection number should be 8.9.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.9.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.9.2">subsubsection number should be 8.9.2</a></li></ul></li></ul></li><li class="toc-title-2"><a href="#section-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section-3">section</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-9.7.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-9.7.1">subsubsection number should be 9.7.1</a></li><li class="toc-title-3"><a href="#subsection-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection-3">subsection</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-9.8.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-9.8.1">subsubsection number should be 9.8.1</a></li></ul></li></ul></li></ul></div></div>
<div>Change subsubsection number to 7 <code>\\setcounter{subsubsection}{7}</code></div>
<div style="margin-top: 0; margin-bottom: 0;"></div>
<h2 type="section" data-unnumbered="true" class="section-title" id="section-unnumbered">
section unnumbered</h2>
<h4 type="subsubsection" data-unnumbered="true" class="sub_sub_section-title" id="subsubsection-unnumbered">
subsubsection unnumbered</h4>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-0.0.8">
<span class="section-number">0.</span><span class="sub_section-number">0.8.</span> subsubsection number should be 0.0.8</h4>
<div>Change subsubsection number to 1 <code>\\setcounter{subsubsection}{1}</code></div>
<div style="margin-top: 0; margin-bottom: 0;"></div>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-0.0.2">
<span class="section-number">0.</span><span class="sub_section-number">0.2.</span> subsubsection number should be 0.0.2</h4>
<h4 type="subsubsection" data-unnumbered="true" class="sub_sub_section-title" id="subsubsection-unnumbered-2">
subsubsection unnumbered</h4>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-0.0.3">
<span class="section-number">0.</span><span class="sub_section-number">0.3.</span> subsubsection number should be 0.0.3</h4>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-0.0.4">
<span class="section-number">0.</span><span class="sub_section-number">0.4.</span> subsubsection number should be 0.0.4</h4>
<h2 type="section" class="section-title" id="section">
<span class="section-number">1. </span>section</h2>
<div style="margin-top: 0; margin-bottom: 1rem;">Change section number to 5 <code>\\setcounter{section}{5}</code><br>
</div>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-5.0.1">
<span class="section-number">5.</span><span class="sub_section-number">0.1.</span> subsubsection number should be 5.0.1</h4>
<h4 type="subsubsection" data-unnumbered="true" class="sub_sub_section-title" id="subsubsection-unnumbered-3">
subsubsection unnumbered</h4>
<div style="margin-top: 0; margin-bottom: 1rem;">Change section number to 7 <code>\\setcounter{section}{7}</code><br>
</div>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-7.0.2">
<span class="section-number">7.</span><span class="sub_section-number">0.2.</span> subsubsection number should be 7.0.2</h4>
<h3 type="subsection" data-unnumbered="true" class="sub_section-title" id="subsection-unnumbered">
subsection unnumbered</h3>
<h4 type="subsubsection" data-unnumbered="true" class="sub_sub_section-title" id="subsubsection-unnumbered-4">
subsubsection unnumbered</h4>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-7.0.3">
<span class="section-number">7.</span><span class="sub_section-number">0.3.</span> subsubsection number should be 7.0.3</h4>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-7.0.4">
<span class="section-number">7.</span><span class="sub_section-number">0.4.</span> subsubsection number should be 7.0.4</h4>
<h2 type="section" data-unnumbered="true" class="section-title" id="section-unnumbered-2">
section unnumbered</h2>
<h4 type="subsubsection" data-unnumbered="true" class="sub_sub_section-title" id="subsubsection-unnumbered-5">
subsubsection unnumbered</h4>
<h4 type="subsubsection" data-unnumbered="true" class="sub_sub_section-title" id="subsubsection-unnumbered-6">
subsubsection unnumbered</h4>
<h2 type="section" class="section-title" id="section-2">
<span class="section-number">8. </span>section</h2>
<div style="margin-top: 0; margin-bottom: 1rem;">Change subsection number to 7 <code>\\setcounter{subsection}{7}</code><br>
</div>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-8.7.1">
<span class="section-number">8.</span><span class="sub_section-number">7.1.</span> subsubsection number should be 8.7.1</h4>
<h4 type="subsubsection" data-unnumbered="true" class="sub_sub_section-title" id="subsubsection-unnumbered-7">
subsubsection unnumbered</h4>
<h3 type="subsection" class="sub_section-title" id="subsection">
<span class="section-number">8.</span><span class="sub_section-number">8.</span> subsection</h3>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-8.8.1">
<span class="section-number">8.</span><span class="sub_section-number">8.1.</span> subsubsection number should be 8.8.1</h4>
<h3 type="subsection" data-unnumbered="true" class="sub_section-title" id="subsection-unnumbered-2">
subsection unnumbered</h3>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-8.8.2">
<span class="section-number">8.</span><span class="sub_section-number">8.2.</span> subsubsection number should be 8.8.2</h4>
<div style="margin-top: 0; margin-bottom: 1rem;">Change subsubsection number to 7 <code>\\setcounter{subsubsection}{7}</code><br>
</div>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-8.8.8">
<span class="section-number">8.</span><span class="sub_section-number">8.8.</span> subsubsection number should be 8.8.8</h4>
<h3 type="subsection" class="sub_section-title" id="subsection-2">
<span class="section-number">8.</span><span class="sub_section-number">9.</span> subsection</h3>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-8.9.1">
<span class="section-number">8.</span><span class="sub_section-number">9.1.</span> subsubsection number should be 8.9.1</h4>
<h4 type="subsubsection" data-unnumbered="true" class="sub_sub_section-title" id="subsubsection-unnumbered-8">
subsubsection unnumbered</h4>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-8.9.2">
<span class="section-number">8.</span><span class="sub_section-number">9.2.</span> subsubsection number should be 8.9.2</h4>
<h3 type="subsection" data-unnumbered="true" class="sub_section-title" id="subsection-unnumbered-3">
subsection unnumbered</h3>
<h2 type="section" class="section-title" id="section-3">
<span class="section-number">9. </span>section</h2>
<div style="margin-top: 0; margin-bottom: 1rem;">Change subsection number to 7 <code>\\setcounter{subsection}{7}</code><br>
</div>
<h4 type="subsubsection" data-unnumbered="true" class="sub_sub_section-title" id="subsubsection-unnumbered-9">
subsubsection unnumbered</h4>
<h3 type="subsection" data-unnumbered="true" class="sub_section-title" id="subsection-unnumbered-4">
subsection unnumbered</h3>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-9.7.1">
<span class="section-number">9.</span><span class="sub_section-number">7.1.</span> subsubsection number should be 9.7.1</h4>
<h3 type="subsection" class="sub_section-title" id="subsection-3">
<span class="section-number">9.</span><span class="sub_section-number">8.</span> subsection</h3>
<h3 type="subsection" data-unnumbered="true" class="sub_section-title" id="subsection-unnumbered-5">
subsection unnumbered</h3>
<h4 type="subsubsection" data-unnumbered="true" class="sub_sub_section-title" id="subsubsection-unnumbered-10">
subsubsection unnumbered</h4>
<h3 type="subsection" data-unnumbered="true" class="sub_section-title" id="subsection-unnumbered-6">
subsection unnumbered</h3>
<h4 type="subsubsection" class="sub_sub_section-title" id="subsubsection-number-should-be-9.8.1">
<span class="section-number">9.</span><span class="sub_section-number">8.1.</span> subsubsection number should be 9.8.1</h4>`,
   tocHtml: `<div id="toc_container"><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.8" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.8">subsubsection number should be 0.0.8</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.2">subsubsection number should be 0.0.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.3">subsubsection number should be 0.0.3</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.4">subsubsection number should be 0.0.4</a></li><li class="toc-title-2"><a href="#section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section">section</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-5.0.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-5.0.1">subsubsection number should be 5.0.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-7.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-7.0.2">subsubsection number should be 7.0.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-7.0.3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-7.0.3">subsubsection number should be 7.0.3</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-7.0.4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-7.0.4">subsubsection number should be 7.0.4</a></li></ul></li><li class="toc-title-2"><a href="#section-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section-2">section</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.7.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.7.1">subsubsection number should be 8.7.1</a></li><li class="toc-title-3"><a href="#subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection">subsection</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.8.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.8.1">subsubsection number should be 8.8.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.8.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.8.2">subsubsection number should be 8.8.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.8.8" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.8.8">subsubsection number should be 8.8.8</a></li></ul></li><li class="toc-title-3"><a href="#subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection-2">subsection</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.9.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.9.1">subsubsection number should be 8.9.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.9.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.9.2">subsubsection number should be 8.9.2</a></li></ul></li></ul></li><li class="toc-title-2"><a href="#section-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section-3">section</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-9.7.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-9.7.1">subsubsection number should be 9.7.1</a></li><li class="toc-title-3"><a href="#subsection-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection-3">subsection</a><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-9.8.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-9.8.1">subsubsection number should be 9.8.1</a></li></ul></li></ul></li></ul></div>`,
   tocHtmlSummary: `<div id="toc_container"><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.8" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.8">subsubsection number should be 0.0.8</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.2">subsubsection number should be 0.0.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.3">subsubsection number should be 0.0.3</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-0.0.4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-0.0.4">subsubsection number should be 0.0.4</a></li><li class="toc-title-2"><details><summary><a href="#section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section">section</a></summary><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-5.0.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-5.0.1">subsubsection number should be 5.0.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-7.0.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-7.0.2">subsubsection number should be 7.0.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-7.0.3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-7.0.3">subsubsection number should be 7.0.3</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-7.0.4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-7.0.4">subsubsection number should be 7.0.4</a></li></ul></details></li><li class="toc-title-2"><details><summary><a href="#section-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section-2">section</a></summary><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.7.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.7.1">subsubsection number should be 8.7.1</a></li><li class="toc-title-3"><details><summary><a href="#subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection">subsection</a></summary><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.8.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.8.1">subsubsection number should be 8.8.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.8.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.8.2">subsubsection number should be 8.8.2</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.8.8" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.8.8">subsubsection number should be 8.8.8</a></li></ul></details></li><li class="toc-title-3"><details><summary><a href="#subsection-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection-2">subsection</a></summary><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.9.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.9.1">subsubsection number should be 8.9.1</a></li><li class="toc-title-4"><a href="#subsubsection-number-should-be-8.9.2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-8.9.2">subsubsection number should be 8.9.2</a></li></ul></details></li></ul></details></li><li class="toc-title-2"><details><summary><a href="#section-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section-3">section</a></summary><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-9.7.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-9.7.1">subsubsection number should be 9.7.1</a></li><li class="toc-title-3"><details><summary><a href="#subsection-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection-3">subsection</a></summary><ul><li class="toc-title-4"><a href="#subsubsection-number-should-be-9.8.1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection-number-should-be-9.8.1">subsubsection number should be 9.8.1</a></li></ul></details></li></ul></details></li></ul></div>`,
 },
  // {
    //   latex: "",
    //   html: ``,
    //   tocHtml: ``,
    //   tocHtmlSummary: ``,
    // },
];
