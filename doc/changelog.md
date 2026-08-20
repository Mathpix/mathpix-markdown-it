# August 2026

## [3.1.0] - List rendering robustness fixes

Read **Breaking changes** before upgrading; the entries under **Fixes that change existing output** need no action. Everything here ships in one publish, so rolling back means installing the previous version (`npm i mathpix-markdown-it@3.0.1`). The specs carry the reasoning and the measurements: `pr-specs/2026-07-list-rendering-robustness.md`, `pr-specs/2026-07-code-block-font-scaling.md`.

**Released as a minor by decision, not because the changes below are small.** Strict semver would make this a major: the content of a `tsv`/`csv` cell and the value of `data-padding-inline-start` are documented output that changed shape, `markdownToHTML` no longer throws out of a failing list rule, and three deep imports are gone. We are shipping it as `3.1.0` anyway — the reasons are outside this repository, and the alternative was holding fixes for output that is currently broken or invalid. Recording it here so the choice is reviewable rather than implied.

What this costs you: **a `^3.0.1` range picks this up on a plain `npm install`**, before anyone reads this file. If you cannot review the diff first, pin the exact version. Three entries reach a consumer with no code change on their side — the `tsv`/`csv` cell exports, the `#preview-content`/`#setText` list and code CSS, and `data-padding-inline-start` — and each is worth checking before upgrading. No documented entry point changed its name, arity or option shape: `markdownToHTML`, the other `MathpixMarkdownModel` methods and `mathpixMarkdownPlugin` are called exactly as before.

> **If you read a `tsv`/`csv` cell as an address, update that reader before this ships.** A cell is not an address even when it starts with one: a link contributes its href and the rest of the cell follows it, space-separated. `[a](http://u) tail` was `http://u`, is now `http://u tail`; `![the alt](i.png)` was `the alti.png`, is now `i.png`.
> **If you caught an exception from `markdownToHTML` to show an error**, note that an internal failure in the list rule no longer throws — it warns once and returns degraded HTML, so that catch will not fire.

- **LaTeX lists.**
  - Markers no longer clip their item text: the reserve is measured per glyph class in `em` (non-ASCII, East-Asian Wide, monospace, math by its rendered width), per nesting level, clamped at `20em`.
  - A block env in a list body renders the same wherever it sits — `table`, `figure`, `center`, `left`, `right` gain their wrapper and caption after a closed sublist or before the first `\item`, and a `tabular` there gains its `table_tabular` wrapper.
  - Those five envs are opaque to the list scanner, as `tabular` and `lstlisting` already were: `\item` in a caption, or a stray `\end{itemize}` written inside one, in code, or in math, is text rather than structure. Such input used to cost the list its items and print the rest as literal LaTeX.
  - A list written inside such a wrapper keeps its nesting depth (`•  –  •`, `decimal | lower-alpha`), where it used to claim top level.
  - Collapsed closers parse, a mid-line closer can open a sibling list, and `\begin`/`\end` are handled in source order — each used to leave the outer list unclosed.
  - A single-line `\begin{tabular}{l}q\end{tabular}` in a list body no longer takes the list down with it, nor does one nested on a single line inside another `tabular`.
  - Also fixed: empty `<>` item bodies, `Figure N`/`Table N` shifted by a speculative parse, `\itemsep`/`\itemindent` mistaken for `\item`, a list swallowed by a preceding `\footnote` scan, and an orphan `<br>` after a `\renewcommand` line inside a list body.
  - Core-markdown `<ul>`/`<ol>` indent `2.5em` instead of the browser default, scoped to `#preview-content`/`#setText`.
  - Not fixed: text sitting after the outermost closer on the same line is dropped, as before; and `\verb` is not modelled as verbatim, so `\item \verb|\end{itemize}|` still ends the list at that closer and prints what follows as literal LaTeX rather than as items — byte-identical to 3.0.1.
- **Tabular cells.** Inline content sitting directly in a cell now reaches the `table-markdown`/`tsv`/`csv` export, where a single-line nested list used to lose its sublist item bodies. A link exports its whole label instead of swallowing the rest of the cell, and no longer leaves an open `<a>` in the pptx output; `tsv`/`csv` record a link by its href and an image by its src.
- **Performance.** Repeated unclosed `\begin{itemize}` units no longer cost a scan per line, so they scale like closed ones — the gain grows with the document and reaches an order of magnitude on the shapes we measured. Unclosed `\begin{tabular}` is cheaper by a similar margin but stays super-linear, so a document of them is still slow. A footnote at the end of a document costs no ruler walk per block ahead of it. Well-formed lists parse faster than 3.0.1 and peak heap over 20 parses of a mixed document is ~20% lower. Figures are not quoted here because they move with the shape of the input and the host; the spec carries the method and the measurements it was taken with.
- **Command arguments with `\\`.** `\\` is a line break, not an escape for the brace after it, so an argument ending in one renders instead of being dropped. There is now one brace-matcher for all of them (`findEndMarker`), the second one in the `tabular` cell parser having been folded into it — measured on `\caption{c \\}`, `\section{s \\}`, `\footnote{f \\}`, `\textbf{b \\}`, `\textit{i \\}`, `\underline{u \\}`, `\caption{a \\{b} c}` and `\backslashbox{a \\}{b}`. Each used to print as literal text, and the `\backslashbox` form also emptied both halves of its diagonal cell and leaked `{a` into the cell beside it. Only the numbering that moves with captions and headings needs action — see **Breaking changes**.
- **Code-block styles.** `pre`/`pre code` sizes are relative, so a code block scales with the container `font-size` (e.g. image export). Pixel-identical at a 16px base except code padding, 16px → 15px, and a raw-HTML `<pre>` with no `<code>` child, 13.6px → 15px.

### Breaking changes

- **A caption, heading or footnote whose argument ends in `\\` renders, and shifts the numbering below it.** `\caption{First line \\}` produced no caption and no `number`, so the next table took `Table 1`; it now renders and that table becomes `Table 2`. The same shift applies to `Figure N` and section numbers. The break itself is not rendered everywhere: a heading emits `<br>`, a caption and a footnote keep a literal `\`, as `\\` written mid-argument already did.
- **`data-padding-inline-start` is an em value with its unit** (`"56"` → `"4.23em"`), and is emitted on nested lists too. A value the renderer receives on a list token and cannot parse as a bare `em` is ignored, and now says so once with `console.warn`; the same attribute written by a consumer in raw HTML is dropped by the sanitiser as before, without a warning.
- **Custom-marker indents change size**: a wide marker reserves ~21% more, a narrow or digit marker 36–70% less. The default indent and gap are pixel-identical at a 16px base.
- **The wrapped-list indent rises to specificity `(1,0,1)`**, so a consumer rule at class specificity no longer wins.
- **A `ul`/`ol` with no `.itemize`/`.enumerate` class indents `2.5em` inside `#preview-content`/`#setText`**, where the UA default `40px` applied before — this reaches core-markdown lists and lists a consumer passes as HTML under `htmlTags: true` alike. `PreviewStyle` sets `#preview { font-size: 17px }`, so in the shipped wrapper that is `42.5px` per level. A TOC keeps `padding: 0` under `.table-of-contents` or `#toc_container`; a TOC copied into any other container shifts by `2.5px` per level — copy it into `#toc_container` (what `getTocContainerHTML(html, false)` returns) or give your container `padding: 0`.
- **`tsv`/`csv` no longer glue an image's alt to its src.** A cell holding `![the alt](i.png)` exports `i.png`, was `the alti.png`. A link cell exports its href followed by whatever else the cell holds, space-separated (`[a](http://u) tail` → `http://u tail`, was `http://u`) — so a consumer reading a cell as an address must not assume the cell *is* one.
- **`table-markdown`/`tsv`/`csv` change for a cell holding a single-line *nested* LaTeX list**: the sublist's item bodies now appear (`| • a<br>&#160;&#160;– b<br> |`, was `| • a&#160;&#160;– <br> |`), and a `<br>` precedes the sublist. **A flat one-line list changes too when the cell holds anything before the first `\item`**: that content used to be dropped and now exports as its own line — `\begin{itemize} loose \item a\end{itemize}` gives `" loose \n • a"` where 3.0.1 gave `" • a"`, `\itemsep 2pt` before the first item gives `"\itemsep 2pt \n • a"` where it gave `" • sep 2pt\n • a"`, and the same holds for `enumerate`. A flat list with nothing before its first `\item` is unchanged. All four forms are pinned by fixtures in `_data/_tsv` and `_data/_csv`.
- **An inline-opened `*_list_open` token carries `prentLevel` = its nesting depth**, was always `0`. A renderer or walker reading that field sees the real depth.
- **Every list reads its own copy of the marker tokens on `*_list_open.itemizeLevel`.** A macro is parsed once per render and the copy carries its own `attrs` and `children`, so a write into a marker — a consumer's or a render rule's — stays with that list. Sharing the tokens leaked: a write reached every later list with the same marker, and a marker built from a link or `\includegraphics` collected `target`/`style` from the renderer itself, so the second `<a>` carried each attribute twice and the third three times, where 3.0.1 rendered each list alike. Copying is not measurable over the fixture corpus; on 400 lists of five items with a math marker it costs about 1 ms of 22, where the same input takes 31 ms on 3.0.1.
- **A link label follows the same `table-markdown` rules as the text beside it**, so `math_inline_delimiters` and `math_as_ascii` now apply inside labels too. Cell math keeps the documented `$…$` default, display math included — pass `math_inline_delimiters: ['$$','$$']` for the block form.
- **`table-markdown` exports a link's address as written**, and the whole label with it, where only its first token was exported before. Escaping guards Markdown syntax, not the URL scheme or HTML — see **Security notes on the Markdown exports** in the README.
- **A consumer's own `env` comes back the way the list rule found it.** `isBlock`, `inheritedListType`, `parentType` and `prentLevel` are restored after **every** list, a successful one included, where they used to survive the parse. A key the parse set and the consumer did not comes back as an own key holding `undefined` rather than being deleted, since `delete` drops `env` into dictionary mode; a key neither side ever had stays absent. `Object.keys(env)` matches `3.0.1` on every shape measured — what changed is the value, which is `undefined` where the parse's own leftover used to show (`parentType: 'itemize'`, `isBlock: false`). Beside those keys the render leaves its source caches on `env` under symbols (eight after a list, emptied by the release hook rather than deleted, for the same reason). They are invisible to `Object.keys` and to JSON, but `Object.assign({}, env)` and `structuredClone` carry them over; a consumer reusing one `env` object across renders gets them emptied, not stale.
- **List nesting depth is reset per parse, not healed mid-render.** A list marked top level no longer forces the depth back to zero while rendering, because a list written in a wrapper's inline content is marked the same way and used to lose its nesting. Every path that goes through `markdownToHTML`, `markdownToHTMLSegments` or a partial render is unaffected; a consumer that hands `md.renderer.render` an unbalanced token slice of its own no longer has the drift corrected for it. Whether a list needs an `<li>` of its own is answered from the whole token array and cached per array and per render, so a consumer that reorders one in place between two `md.renderer.render` calls with no render in between reads the answer paired before the edit — re-rendering one array is unsupported either way, `attrJoin` piling classes onto the same tokens.
- **A failing list rule no longer fails the render.** An internal error while parsing a list is reported once per cause with `console.warn` and the rule does not apply, so `markdownToHTML` returns degraded HTML where it used to throw. Only a failure past the point where tokens have entered the stream still propagates.
- **New `console.warn` diagnostics**, deduplicated per render and capped at 40 per family and 200 overall. All are informational, and each reports something a consumer can act on — a marker merely asking for more room than the `20em` cap is not reported, the reserve being generous enough that the chain usually still fits. There is no option to silence them.
- **Deep imports:** `ClearTableNumbers`/`ClearFigureNumbers` → `clearTableNumbers`/`clearFigureNumbers`, moved to `lib/markdown/common/caption-counters` with no re-export; `getListLevelState` and the unused `ListItemsBlock` are gone (level state is a stack now, read through `getListDepth`); `ListItemsResult`/`ListInlineContext` dropped `padding` and gained required `openTokens`/`allListTokens`, and `ListInlineContext.li.value` narrowed from `any` to `number`; the list rule's view of its source text lives in the new `md-latex-lists-env/list-source-model`, which takes over `splitInlineListEnv` from `latex-list-items`, and the brace pairing under it in `common/argument-spans` (`braceMatches`, `commandArgumentSpans`), both exported for their own tests rather than for use; `skipBackticks` in `lib/markdown/utils` answers past an unmatched run of backticks instead of the end of the string, matching how such a run renders — a deep importer using it to find code spans sees that change; `lib/styles/styles-code` alone no longer sizes code text (its `pre` base moved to `MathpixStyle`).

### Fixes that change existing output

Nothing to do for these — they replace output that was broken or invalid. A consumer diffing the HTML sees them.

- **A chunk before the first `\item` is wrapped in a marker-less `<li>`**, where text, a fence or a block env used to sit straight inside the `<ul>`, which admits only `<li>`. A sublist written in that chunk moves inside the wrapper.
- **`\setcounter` and `\renewcommand` sharing their line with list structure no longer cost the list.** Each is measured by its own span, so what follows it — `\end{itemize}`, the next `\item`, a nested `\begin{…}` — is read as structure: `\setcounter{enumi}{3}\end{enumerate}` used to leave the whole list as literal LaTeX, and `\setcounter` before `\begin{center|left|right|table|figure|tabular|lstlisting}` used to lose the number and print the command to the reader. `markdownToHTMLSegments` follows the HTML, so where a list is now built its segment map has fewer, larger segments than `3.0.1` returned.
- **An `\item` or a closer with no list open stays text.** A closer past the last open list emitted a bare `</ul>` — a tag that reaches the surrounding page — and an `\item` there emitted an `<li>` with nothing around it. `\begin{itemize} \end{itemize} \end{itemize}` and `\begin{itemize} \item a \end{itemize} \item[X] b` are the two smallest shapes; a line that ends up with every command in that position now renders as its own text.
- **A list command between two code spans is structure, not text.** The test was whether a backtick stood on each side, so `` `x` \begin{itemize} `y` `` read as text and left the list a closer short — the tags then crossed. What a code span or an `\item[…]` marker holds is now hidden from the scan before it looks, so the scan finds the next command instead of judging the line by the first: a closer written beside a span (`` `\begin{itemize}` \end{itemize} ``) is taken where it stands, and one written inside a span (`` `\end{itemize}` ``) is still text.
- **A continuation line that contains the word `item` keeps its line break.** The `\item` pattern used to match the bare word anywhere on the line, so such a line was taken as a new chunk and joined to the one above with nothing between them: `\item a` followed by `some item text` exported as `asome item text`. It now reads as the continuation it is, `a<br>\nsome item text`, which is what a line without that word already did. Same for `items`, `itemize` and inside `enumerate`.
- **Content sitting directly in a list is wrapped in an `<li>` wherever it comes from.** A list opened flush against the one around it (`\begin{enumerate}\begin{itemize}` on one line) put everything before its first `\item` into the `<ul>` itself — a fence, a text run or a code span as a direct child, which `<ul>` does not admit. Such a run now gets a marker-less `<li>`, as a chunk on the block path already did.
- **An opener written in a code span no longer opens a sibling list.** `\end{enumerate}` followed by `` `\begin{itemize}` \end{itemize} `` read that span as a real opener, so the closer after it emitted a `</ul>`/`</ol>` with no opener — a tag reaching the surrounding page. The tail is read with spans hidden now, like the rest of the walk.
- **An item whose text holds a closer in a code span keeps that text.** A chunk that is only an end-of-list command is dropped, and the check read the raw line, so `` \begin{itemize}\nkeep `\end{itemize}` me \end{itemize} `` lost the whole chunk and rendered an empty list. It now reads the line with spans hidden, like every other reader: the text and the code span render, and a chunk that really is only a closer is still dropped.
- **A list command written in an `\item[…]` marker is its text.** `\item[\begin{itemize}] a` counted that opener as structure and cost the whole list — 3.0.1 printed the source and left the text after it bare inside the `<ul>`; `\item[\end{itemize}]` ended the list at the closer in the bracket. Both now render the list with the command as the marker.
- **A list written in a `\renewcommand` marker body no longer opens inside the marker.** `\renewcommand{\labelitemi}{\begin{itemize}}` put a real `<ul>` inside `<span class="li_level">` and crossed the tags, because the marker body is parsed while the block flag is still set. A marker command with an optional argument (`\renewcommand{\labelitemi}[1]{Z}`) now takes `Z` as the marker, where it took `[1]{Z`.
- **A closer written in a `\renewcommand` body belongs to the macro, on the inline path too.** `text \begin{itemize}\item a\renewcommand{\x}{\end{itemize}}\item b\end{itemize} tail` ended the list on that closer and printed `}\item b\end{itemize} tail` after it; it now renders both items and the tail. The rule costs the malformed converse: a list whose *only* closer sits in a macro body is unterminated, so it stays literal LaTeX where 3.0.1 built a list from the closer written there.
- **A `\renewcommand` argument written with a bare name ends where its braces end.** `\renewcommand\x{a{b}c}` had its argument end at the first inner `}`, so `c}` printed to the reader; the braced form `{\x}` was already read whole.
- **`\renewcommand*` is the starred form, not a command named `*`.** Reading the star as the name left the definition unconsumed: `\renewcommand*{\x}{y}` printed `{y}` to the reader, `\renewcommand*{\labelitemi}{Z}` never switched the marker, and inside a list the leftovers landed in the `<ul>` as bare text with the body's closer printed as literal LaTeX. The starred form now behaves as the unstarred one throughout.
- **Braces written in prose no longer decide a list's structure, and neither does a group after a name the package does not parse.** A closer standing between them was read as that group's text: `opens {` above a list and `closes }` below it cost the list its second item and printed the tail as literal LaTeX, and `\foo{ \end{itemize} }` kept a sibling list from opening at all. Only the arguments of the commands the package parses shield a closer now — `\caption{x \end{itemize} y}` still does — and a brace with no such name before it is content, as Markdown reads it.
- **A whitespace-only text node between `<ul>` and `<li>` no longer appears.**
- **A stray `\end{itemize}` written inside a wrapper env stops ending the list** — including one written there in code or in math, since the wrapper collects its interior raw: such input rendered one item with the rest as literal LaTeX, and now keeps every item and renders the wrapper. Outside a wrapper only a code span shields it; one written in `$…$` still ends the list, as on 3.0.1.
- **A list opened in the middle of a paragraph keeps its levels.** `text \begin{itemize}` starts an env the paragraph itself carries, and the paragraph used to end on the next `\begin{itemize}` line: half the env went to the block below and the rest printed as literal LaTeX, losing a level and the text after the closer. Whether a list is open is now read from the same source model the list rule uses, rather than from a pattern anchored at the line start, and a paragraph is not ended inside such an env. An env the source cannot close is unaffected — its closer sitting inside a fence, the block below renders and the outer level stays text, as before.
- **An unmatched run of backticks no longer hides a list's own `\end`.** ` ``` ` with no partner renders as text — no `<code>` in the output — but the list scanner read the rest of the source as code, found no complete env and built nothing, so `text \begin{itemize}…\end{itemize} ``` …` came out as literal LaTeX. Such a run is skipped as text now. Over 8000 generated documents built from backticks and list structure this changes 97, each from literal LaTeX to a rendered list.
- **Text or a block env written after the outermost `\end{itemize}` on that line is no longer dropped.** `\end{itemize} tail text` lost `tail text`, and the same position lost a `}` left by an unclosed command, a code span, and the opening of a fence — the rule reported success having dropped them. That stretch of the line now goes back to the block phase and renders as it would anywhere else (`tail text` becomes the same `<div>` a standalone paragraph does). A leftover that opens a list of its own is still dropped, as on 3.0.1: read from that point it would become a top-level list, skipping the check that declined it as a sibling.
- **A closer sharing its line with the env after it keeps its level.** `\end{itemize} \begin{center}x\end{center}` closing a nested list: 3.0.1 printed the wrapper as literal LaTeX, and with a `tabular` there it lost the level and printed the rest of the list as text. Every level survives now and the env after the closer renders — over a grid of 156 well-formed shapes (two list kinds, three depths, seven followers) 3.0.1 loses a level in 16.
- **A wrapper env in a list body takes its whole interior even when a list opens inside it.** `\begin{itemize}\n\item a\n\begin{center}\n\end{itemize}\n\begin{itemize}\n\item b\n\end{center}\n\end{itemize}` used to break the list in two around the wrapper and print the wrapper itself as literal LaTeX; the item and the wrapper now both render, its own rule reading the interior — a list closed there renders, an unclosed one is text. A wrapper holding the list's *only* closer is still declined: the list keeps its items and the wrapper prints as text, an unclosed list not being closed for it.
- **Two wrapper envs on one line in a list body both render.** `\begin{center}x\end{center} \begin{center}y\end{center}` gives two divs, where 3.0.1 dropped the second one.
- **A custom marker's HTML no longer carries edge whitespace** — `\item[  wide  ]` renders `<span class="li_level">wide</span>`.
- **A bare `\item` inside a `\begin{tabular}` cell in a list body renders as literal text**, where it used to emit an orphan `<li>` in the `<td>`. Both are wrong for malformed input; this one is valid HTML.
- **A nested list carries line numbers under `lineNumbering`** (`data_line_start`, `data_line_end`, `data_line`, `count_line` and the `preview-line` list), where it used to carry none.
- **A list inside a `tabular` cell now closes its last `<li>`.**
- **`\end{itemize}` over an open `enumerate` closes the list that is open**, not the one it names: crossed env names used to emit `</ul>` for an `<ol>`, leaving a closing tag with no opener and the `<ol>` open to the end of the document. The depth drift that left behind is gone with it, so the list after such input starts at its own level (`•`, `decimal`; was `·`, `lower-roman` on 3.0.1).
- **Every list opening straight inside a list gets its own marker-less `<li>`, and that item closes with it.** Both rules now ask the same question — is the container this list opens in a list rather than an item — where the opening looked only at the token before it and the closing guessed from the token after. Two such lists in a row used to share one item, and a list opening after a sibling closed got none at all. A list after a real `\item` is unaffected. Every list fixture holds the two shapes apart, and none renders worse than it did.
- **A marker-less `<li>` exports no marker.** It carries no nesting level, so `tsv`/`csv`/`table-markdown` looked one up by `NaN` and exported the word `undefined`; in an `enumerate` it also invented a number the document never had. `tsv` and `csv` now match `3.0.1` byte for byte on these shapes.
- **`table-markdown` keeps `sub`/`sup`/`ins` markup in a plain cell too**, not only inside a link label: `H~2~O`, `x^2^` and `++new++` export as written, where the markers used to be dropped (`H2O`). `tsv`/`csv` are unchanged — they hold no markup.
- **`table_markdown.math_as_ascii` escapes a pipe in the ascii.** `$|x|$` exported `| |x| | 2 |`, a row a Markdown reader cuts into three cells against a two-column header; it is now `| \|x\| | 2 |`. Reachable from `|x|`, `\left|…\right|`, `\vert`, `\|` and a `|` inside `\text{…}`; `\mid` is U+2223 and unaffected. The non-ascii path already escaped, and both now read the same `ascii_md`/`ascii_tsv`/`ascii` chain. `tsv`/`csv` are unchanged — a pipe is legal in both.

# July 2026

## [3.0.1] - Preserve code indentation inside list/table/align env wrappers

Fenced code and `lstlisting` inside LaTeX environment wrappers kept their leading whitespace instead of collapsing flush-left:

- **Lists** (`\begin{itemize}`/`\begin{enumerate}`): fenced code (```` ``` ````/`~~~`) is treated as an opaque region and stored raw, so indentation, blank lines and `~~~` are preserved; `~~~` now renders as a code block.
- **Table/align wrappers** (`\begin{table}`/`\begin{figure}` and `\begin{center}`/`\begin{left}`/`\begin{right}`): `lstlisting` inside the wrapped `tabular` keeps its indentation, matching a bare `tabular`. A shared helper `appendEnvAwareContentLine` stores lines raw only while inside a `lstlisting` (detected with `indexOf`, so mid-cell `C &\begin{lstlisting}` works); normal wrapper content stays de-indented, so wrapped-tabular output (CSV/TSV) is unchanged.

Known limitation: a bare ```` ``` ````/`~~~` fence written directly in a `tabular` cell (not wrapped in `lstlisting`) still renders inline — deferred to a follow-up.

See `pr-specs/2026-07-code-indentation-in-env-wrappers.md`.

# June 2026

## [3.0.0] - Math delimiter mode (strict double-backslash handling) and lstlisting mathescape `\$` rendering

**Breaking change.** New `mathDelimiterMode?: 'strict' | 'legacy'` option (default **`'strict'`**) controls whether DOUBLE-backslash delimiters `\\( ... \\)` and `\\[ ... \\]` are treated as math.

- `'strict'` (default): only single-backslash `\(` / `\[` (and `$` / `$$`) open math. `\\(` is **not** a math delimiter — it follows CommonMark escape semantics (`\\` → literal `\`) and renders as literal text.
- `'legacy'`: also accept `\\(` / `\\[` as math openers — the behavior inherited from `markdown-it-mathjax`, default in all versions ≤ 2.x.

**Migration:** versions ≤ 2.x rendered `\\( ... \\)` as math. Under the new `'strict'` default such content renders as literal `\(...\)`. Consumers that rely on double-backslash delimiters (e.g. pasted / legacy MathJax-era content) must pass `mathDelimiterMode: 'legacy'` explicitly. Single-backslash `\(`/`\[` and `$`/`$$` are unaffected.

- Threaded onto `md.options` (via `markdownToHTML` / `markdownToHTMLSegments` / `render` / `convertToHTML` and the `MathpixMarkdown` React component) so the `multiMath` inline rule honors it.
- lstlisting `[mathescape=true]` is verbatim code: in `'strict'`, `\\(` inside a listing stays literal (the math-only parser uses a verbatim backslash rule instead of the default escape, so code is never collapsed); single `\(` is still math (what `mathescape` enables).
- Browser auto-render (`renderMathInElement`) honors `mathDelimiterMode` (`config.mathDelimiterMode`, default `'strict'`) for symmetry with the server parser.
- Both modes pinned with golden tests: `tests/_math-delimiter-mode.js`, `tests/_auto_render.js`.

See `pr-specs/2026-06-math-delimiter-mode.md`.

### lstlisting mathescape: literal `\$` rendering

Inside a `[mathescape=true]` listing, a run of backslashes immediately before `$` drops exactly one backslash and the `$` is a literal dollar (`\$` → `$`, `\\$` → `\$`); only a bare `$` toggles math. Scoped to `$` only — `\(` / `\[` / `\\(` / `\\[` delimiter handling is unchanged. Plain listings (no `mathescape`) are unaffected. Copy-to-clipboard and a mathescape listing inside a table cell reflect the same un-escaped text via a math-aware `token.meta.codeText`. `verbatimBackslash` in `parse-math-escape-inline.ts`; pinned by `tests/_lstlisting-mathescape-dollar.js`.

See `pr-specs/2026-06-lstlisting-mathescape-dollar-render.md`.

# May 2026

## [2.0.40] - Tabular vertical-align bracket and footnote performance

- Tabular vertical alignment:
  - Parse the optional `[t]/[c]/[b]` bracket on `\begin{tabular}` (standard LaTeX2e syntax) and use it as the row-level vertical-align default for `l/c/r/S` columns. Per-column `m`/`p`/`b` continues to override.
  - Cell-level inference: when an outer cell's content includes a nested `\begin{tabular}[t/c/b]`, the outer `<td>` inherits that vertical-align (matching LaTeX baseline semantics — the cell containing the `[t]` inner tabular sits at the top of the row). Per-column `m`/`p`/`b` on the outer column still wins. Cell-level inference overrides the row-level bracket for that single cell.
  - In `forLatex`, every `td_open` of a tabular with an effective bracket carries `meta.parentBracket` (`'t'`/`'c'`/`'b'`) — the bracket of THIS table, set on every cell of that table. Consumers walking forLatex tokens see parent context directly on each `<td>` without re-deriving from the parent `table_open`. `AddTd` and `AddTdSubTable` accept an optional `meta?: TTdMeta` parameter to attach this and other forLatex-specific cell info.
  - New option `defaultCellVerticalAlign?: 'top' | 'middle' | 'bottom'`. HTML rendering: applies as the fallback for `\begin{tabular}` blocks without an explicit bracket. Explicit source bracket always wins. Default unset is byte-identical to legacy on existing MMD. `'middle'` propagates to regular `l/c/r/S` cells (matches existing default), but is a no-op for `\multicolumn` / `\multirow` cells (preserves legacy no-vertical-align on multicol).
  - `forLatex` round-trip: for `'top'`/`'bottom'` (top-level only) the option's value is injected into `tableOpen.meta.bracket` so the consumer can serialize `\begin{tabular}[pos]{...}`. Nested absent-bracket tabulars stay bracket-less to preserve round-trip.
  - `\multicolumn` / `\multirow` cells inherit `'t'`/`'b'` from any source (bracket or option), and `'c'` only from an explicit source bracket — never from option `'middle'`. Plain `\multicolumn{}` / `\multirow{}` in an absent-bracket tabular continues to emit no `vertical-align` (legacy).
  - Diagbox cells always render with `vertical-align: middle` regardless of the outer tabular's bracket: `getSubTabular` flags wrappers with `hasDiagbox`, the parser skips its own vertical-align emit, and `render-tabular` adds `middle` once. Removes the duplicate `vertical-align: middle;` from existing diagbox snapshots.
  - Explicit `\multirow[t/c/b]` always wins over the row-level default and emits explicit `vertical-align`. Fixes a regression where `\multirow[c]` inside `\begin{tabular}[t]{...}` silently inherited the outer `[t]` instead of honoring the user's explicit `[c]`. Two existing `\multirow[c]` snapshots in `_tabular/_data_digbox.js` updated to include the now-explicit `vertical-align: middle`.
  - **Breaking change** to the exported `openTag` / `openTagG` regexes in `md-block-rule/begin-tabular`: the optional `[pos]` bracket is now a capture group. New shape is `match[1]` = bracket pos (`t`/`c`/`b` or `undefined`), `match[2]` = column spec. Previously `match[1]` = column spec. Consumers calling `openTag.exec(src)[1]` / `src.match(openTag)[1]` for the column spec must read `[2]` instead. `openTagTabular` and `BEGIN_TABULAR_INLINE_RE` (presence-check regexes) likewise allow the optional bracket but keep their existing capture groups.
  - `getParams` (column-spec parser) now skips an optional `[pos]` before `{` and returns the normalized bracket position.

- Footnote rule performance:

- `latex_footnote_block` / `latex_footnotetext_block`: per-state position cache + per-line token guard turn the O(N×M) accumulation scan into one O(|src|) sweep per parse and O(1) per subsequent block-start. ~120× speedup on a 2.45 MB MMD with 706 long tabular blocks (worst case for the pre-change Phase 1 scan); HTML output byte-identical.
- `setChildrenPositions`: per-child `Object.isExtensible` guard before `.positions` assignment fixes `TypeError` thrown by frozen `SHARED_*_CLOSE` singletons inside `tabular_inline` subtrees, restoring `markdownToHTMLSegments({ addPositionsToTokens: true })` on documents with inline subtables. `link_open` branch split into strict-triple `[text](url)` (legacy snapshot-pinned math) + span fallback for fancy contents (`[**bold**](url)`, `` [`code`](url) ``, `[![alt](img)](url)`) — fixes silent NaN/off-by-N positions that existed on master.
- `BeginTheorem`: env-name validation hoisted above `state.push` in non-silent mode — unregistered environments no longer leave unmatched `<div class="theorem_block">` wrappers in the rendered HTML. Silent-mode terminator probes preserved (required by `\newtheorem` ↔ `\begin{NAME}` adjacent-line handshake).
- Behavior change for unregistered `\begin{NAME}…\end{NAME}` (e.g. TikZ): previously the rule emitted an unmatched `<div class="theorem_block">` wrapper around a math-block fallback `<span class="math-block equation-number" number="0"></span>`. Now the wrapper is gone; the inner placeholder is unchanged. `.equation-number` element count is unchanged vs master. Register via `\newtheorem{NAME}{…}` to get the body rendered.
- Behavior change for `markdownToHTMLSegments` consumers: same documents emit more segments than before because the previously unmatched wrapper was preventing segment delimiters from breaking at natural boundaries. Output bytes are unchanged; segment counts are not.
- Behavior change for highlights consumers: fancy-link span fallback (`[**bold**](url)` etc. with overlapping `highlights:`) emits empty `<span class="mmd-highlight"></span>` wrappers around markup-only inner tokens (strong_open/strong_close). Filter empty `.mmd-highlight` matches if iterating.

See `pr-specs/2026-05-footnote-perf-and-parser-invariants.md` for design and known limitations.

# April 2026

## [2.0.39] - Optimize tabular parsing memory and performance

- Algorithms:
  - Rewrote `getSubMath()` from recursive to iterative single-pass (O(N×M) → O(N+M)); `getMathTableContent()` now uses `parts[]` + `join()` instead of repeated slice+concat. The `startPos: number = 0` optional parameter is preserved for signature compatibility with deep-import consumers.
  - `colsToFixWidth` in the tabular parser converted from `Array` + `.includes()` + `.push()` to `Set<number>` for O(1) dedup-on-insert. Previous code was O(N²) in cell count for wide tables; Set path is O(N). Converted to array once at `tableOpen.meta` assignment.
  - Removed two dead `.split('').join('')` round-trips in `common.ts` (`getColumnLines` and `getColumnAlign`) — identity operations that allocated a per-call character array. The `.split('').join(' ')` call on the next line is NOT a no-op and is preserved.
  - `mathTable`, `subTabular`, `extractedCodeBlocks` converted from Array + `findIndex()` to Map for O(1) lookups.
  - `labelsByKey` + `labelsByUuid` Map indexes; `labelsList` export kept as a deprecated backward-compatible `Proxy` that returns a version-cached snapshot of `labelsByKey.values()` — snapshot is rebuilt only when the underlying map changes. Mutations (`.push`, index assignment) target the throwaway target array and are effectively ignored.
  - `diagboxById` reverse Map + `ClearDiagboxTable()`.
  - `buildInlineCodePositionSet()` returns `Set<number>` for O(1) position checks in `findEndMarker` (previously O(n×m) per character).
  - `tagRegexCache` memoizes HTML block regexes; fixed `lastIndex` corruption by swapping `.test()` on g-flag regex for `.match()`.
  - `utf8Encode`: `parts[]` + `join()` instead of O(n²) string concat.
  - `SetItemizeLevelTokens`: saves/restores only `outMath` with `try/finally`.
  - `mathTablePush` accepts both `(id, content)` and `({id, content})` forms (backward-compatible overload).
  - `mathpixMarkdownPlugin`: shared `envToInline` object per table to avoid hundreds of thousands of object copies on large documents.

- Per-parse math cache:
  - Added `state.env.__mathpix` cache (following markdown-it-footnote convention) that deduplicates identical `inline_math` / `display_math` expressions within a single parse. No persistence between parses, no public API options.
  - Cache exclusions: `equation_math` / `equation_math_not_number` (numbering side effects), `inline_mathML` / `display_mathML` (different MathJax path), `return_asciimath` tokens (ascii extraction side effects).
  - Cache bypass via `beginCacheBypass` / `endCacheBypass` when `outMath` is temporarily mutated (e.g. `SetItemizeLevelTokens` for `forDocx`).
  - Accessibility IDs (`mjx-mml-*`) regenerated on cache hit so every token keeps a unique DOM id.
  - Cache hits mark the returned result with `_labelsRegistered: true`; `convertMathToHtml` then skips the per-label `state.md.inline.parse()` + `addIntoLabelsList()` loop (the two are idempotent for the same key+content). `idLabels` is still recomputed from `Object.keys(token.labels)`.

- Token-tree retention fixes:
  - `mdPluginTOC`: stored the parse state on a module-level `gstate` variable so the TOC render rule could reach the top-level token list. The reference was never cleared and pinned the entire token tree across unrelated parses. The token list is now stashed on `state.env[TOC_ENV_KEY]` and released with the env when the parse ends.
  - `coreInline`: rebound `state.env` to a fresh object inside the inline loop. That desynced state.env from the env reference the caller of `md.render(src, env)` still held, so parse-time mutations (TOC / cache) became invisible to render rules. Now mutates state.env in place and uses a private `inlineEnv` for the nested `inline.parse()` call. The same pattern was applied to the deeper recursive walker `walkInlineInTokens` (footnote / tabular deep-walk paths).

- Per-parse cross-plugin state reset (`reset_mmd_global_state` core-ruler hook, before `normalize`):
  - Module-level state in sub-plugins (TOC slug registry, theorem/figure/section counters, labels Map, footnote list, itemize marker token trees, list-depth stack, size counter, MathJax equation counter) was previously cleared only at `md.use(plugin)` time or inside the `initMathpixMarkdown.parse` / `renderer.render` wrappers. Direct users of `markdownIt().use(mathpixMarkdownPlugin)` who reused one md instance across documents saw drift: extra `-2`/`-3` TOC slug suffixes, bumped theorem/section numbers, stale `\ref{}` IDs, stale footnote refs, retention of old `\renewcommand{\labelitemi}` token trees.
  - The new hook clears all of the above at the start of every `md.parse()`. It respects `renderElement.startLine` and skips on partial re-renders so cross-references inside an enclosing parse are preserved.
  - Also fixes a latent leak in `parse-error.ts` — `ParseErrorList` had a `ClearParseErrorList()` function that was never called anywhere; tabular parse errors accumulated monotonically.
  - Exported `resetMmdGlobalState()` from the package root so one-shot converters (e.g. DOCX export) can release module-level state immediately after render without waiting for the next parse. Module-level state that render needs (labels, theorems, footnotes, etc.) is otherwise retained until the next `md.parse()` fires the hook.

- Segment balance fix in `markdownToHtmlPipelineSegments`:
  - The segments renderer tracked a single `pendingCloseTag` + `pendingLevel` pair. A nested same-type same-level `_open` (e.g. md-theorem wraps an inner `paragraph_open` at level 0 inside the outer `paragraph_open` class `theorem_block`) caused the first `paragraph_close` to terminate the segment mid-block, producing `<div><div>...</div>` in one segment and `</div></div>...` in the next.
  - Added a `pendingDepth` counter: nested opens of the same type at the same level now increment depth; the segment closes only when depth drops back to zero. Covered by `tests/_html-segments.js` across 38 scenarios exercising all block rules from `mmdRules.ts`.

- Additional parse-only retention fixes:
  - `cleanup_math_cache` core-ruler hook (pushed, end of pipeline) clears `state.env.__mathpix`. Previously the per-parse math dedup cache was only initialized, never released, so MathJax html/svg strings for every unique expression stayed on env until the caller dropped it (200+ MB on math-heavy docs in long-lived processes).
  - `mdPluginTOC.grab_state` stashes `state.tokens` on `state.env[TOC_ENV_KEY]` only when the document actually used `[[toc]]` — detected by a one-pass scan of inline-token children for `toc_body`. Documents without `[[toc]]` no longer pay the cost of retaining the whole token tree on env.

- Two-hook tabular-state cleanup:
  - `reset_tabular_state` core-ruler hook (before `normalize`) clears tabular module-level state at the start of every `md.parse()`.
  - New `cleanup_tabular_state` hook (pushed, end of core pipeline) drops parse-only caches (`subTabular`, `mathTable`, `extractedCodeBlocks`, `diagboxTable`, column-style intern cache) at the end of parse — they're never read during render. Both hooks respect `renderElement.startLine` for partial renders.

- Per-token allocation reduction:
  - Pre-interned 16 border-style strings (`border-{top,bottom,left,right}-style`: solid / double / dashed / none) replace per-cell template-literal allocations.
  - `columnStyleCache` per-parse intern for the composed `<td>` style string.
  - `getSharedCellAttrs` / `getSharedTableOpenAttrs` / `getSharedTbodyOpenAttrs` / `getSharedTrOpenAttrs` return read-only shared attrs arrays keyed by (style, isEmpty) / (extraClass, numCol). Shared arrays carry the non-enumerable `Symbol.for('mathpix.tabular.attrsShared')` marker; mutation sites (`tokenAttrSet` in the tabular renderer, `addAttributesToParentTokenByType` in utils) clone-on-write before writing.
  - Frozen singleton close-token markers: `SHARED_TD_CLOSE`, `SHARED_TR_CLOSE`, `SHARED_TABLE_CLOSE`, and `SHARED_TBODY_CLOSE` (non-forLatex only — under `forLatex`, `tbody_close` carries a per-table `latex` payload and is allocated per-instance). The multi-column branch of `parse-tabular.ts` also pushes `SHARED_TD_CLOSE` directly instead of allocating a fresh close-token per cell.
  - `addStyle` / `addHLineIntoStyle` check the input attrs for the `attrsSharedMarker` symbol and clone before mutating so that callers which pass in a shared-attrs array do not corrupt the cached object.
  - `StatePushTabulars` no longer assigns `content` / `children = []` onto open/close markers — those fields are never read on markers and assignment would throw on the frozen close singletons.
  - Replaced `res = res.concat(...)` with in-place `res.push(...)` inside the tabular construction loop to remove intermediate array allocations.
  - `applyTypesetResultToToken` drops `svg` from `token.mathData` when `options.highlights` is not set — the field is only read by `renderMathHighlight` (active under highlights); the default render rule uses `token.mathEquation`. The highlight path re-populates `mathData.svg` in `convertMathToHtmlWithHighlight`.
  - `OuterData` returns `null` for empty `labels` instead of cloning an empty `{}` onto every math token.

- Output gating in the tabular renderer:
  - `renderInlineTokenBlock` and `renderNonTableTokenIntoCell` build each output only when the caller requested it via a shared `computeOutputGates(options)` helper: `needHtml` (`!forMD && include_table_html !== false`), `needTsv` (`include_tsv`), `needCsv` (`include_csv`), `needMd` (`forMD || include_table_markdown`), `needSmoothed` (`forPptx`). Both call sites use the same helper so gates cannot drift. Every `result += ...`, array push, `cellMd +=`, and `formatTsvCell` / `formatCsvCell` call is gated on the corresponding flag.
  - Leaf-token handling still calls `slf.renderInline([token], options, env)` even when `needHtml` is false — the `latex_list_item_open` render rule sets `token.meta.itemizeLevel` as a side effect that `handleListTokensForCellMarkdown` reads to emit list markers.
  - `renderTabularInline` short-circuits early when `forMD: true` and neither TSV/CSV/markdown output is requested, avoiding an empty `<div class="inline-tabular"></div>` wrapper.

- HTML-visual attrs skipped for non-HTML outputs:
  - `td_open` style / `_empty` class, `tr_open` border-reset style, `table_open` `class='tabular'`, and the `table_tabular` class + text-align style on the wrapping `paragraph_open` are HTML/CSS-only. When the caller sets `forMD` or `forLatex`, `AddTd` / `AddTdSubTable` / `getMultiColumnMultiRow` / `StatePushParagraphOpen` skip those assignments. Multicol/multirow cells still carry `colspan` / `rowspan`; `paragraph_open.data-align` is preserved for `forLatex`.

- New public option:
  - `outMath.skipMathToHtml` (default `false`). Declared on the exported `TOutputMath` type. When `true`, `applyTypesetResultToToken` skips `token.mathEquation` and `typesetMathForToken` passes `include_svg: false` to MathJax so the SVG string is never serialized. Takes precedence over `include_svg`; other MathJax outputs respect their own `include_*` flags. Intended for callers that walk the token tree directly and never read the serialized math HTML. The per-token outMath clone used here is memoized via `WeakMap` to avoid ~49K spread allocations on large documents.

- Review-follow-up cleanups:
  - `computeOutputGates(options)` helper extracted so both tabular render sites use identical gating.
  - `attrsSharedMarker` centralized in `common/consts.ts` (was duplicated in `tabular-td.ts`, `utils.ts`, `render-tabular.ts`).
  - `getSharedTableOpenAttrs(extraClass, skipVisual=true)` now also drops `class='tabular'` under `skipVisual` (previously leaked the HTML-only class for subtable cases).
  - `getSubTabular` guards the direct Map lookup by a UUID-pattern regex so UUID-looking cell text cannot collide with a stored key.
  - `subTabular` / `mathTable` module-level Maps marked `const` (never reassigned; only `.set` / `.clear` / `.get`).
  - Regression test pins `envToInline` render isolation between blocks sharing `state.env`.

- Cleanup:
  - Removed dead file `src/markdown/mdPluginSeparateForBlock.ts` (and its `lib/*` artifacts). It was never registered with markdown-it; its two core rules (`separateForBlock`, `separateBeforeBlock`) shipped in the initial 2019 commit and never wired in.

- Benchmark (16 MB MMD with 13,713 tabular blocks, ~479K `<td>` cells, ~49K inline math expressions):

  Full SVG/HTML render path:

  | Stage                   | Before  | After  | Δ            |
  |-------------------------|--------:|-------:|-------------:|
  | Peak heap (html held)   | 2597 MB | 778 MB | −1819 (−70%) |
  | Heap after drop html    | 1887 MB |  68 MB | −1819 (−96%) |
  | Parse time              |  17.9 s | 14.6 s |        −18%  |

  Token-only path (`forMD: true`, `outMath.skipMathToHtml: true`):

  | Stage                   | Before  | After  | Δ            |
  |-------------------------|--------:|-------:|-------------:|
  | Peak heap               | 2597 MB | 443 MB | −2154 (−83%) |
  | Heap after drop output  | 1887 MB |  81 MB | −1806 (−96%) |
  | Serialized output size  |  355 MB | 165 MB |        −190  |

- Docs:
  - Implementation details in `pr-specs/2026-04-optimize-tabular-parsing.md` and `pr-specs/2026-04-global-state-cleanup-and-perf.md`.

# March 2026

## [2.0.38] - Fix infinite loop in `inlineMmdIcon` and `inlineDiagbox` silent mode

- Bug Fix:
  - Fixed page freeze when `\icon{...}` or `\diagbox{...}` appeared inside link labels (e.g. `[\icon{unknown}]`). The inline rules returned `true` in silent mode without advancing `state.pos`, causing an infinite loop in markdown-it's `parseLinkLabel` → `skipToken`.

- Refactoring:
  - `inlineMmdIcon` and `inlineDiagbox` refactored to follow the `if (!silent) { ... } state.pos = endPos; return true;` pattern used by all other inline rules.
  - `mmd-icon.ts`: extracted `endPos` constant, eliminated 6 duplicated position assignments.
  - `diagbox-inline.ts`: moved `extractNextBraceContent` before the silent check so `endIndex` is available in both modes.

- Tests:
  - Added 4 test cases for icon and diagbox inside link labels and bare brackets.

- Docs:
  - Added implementation details in `pr-specs/2026-03-fix-silent-mode-state-pos.md`.

## [2.0.37] - CSS scoping and style module cleanup

- CSS Scoping:
  - All MMD class selectors now have `#preview-content`/`#setText` scoped variants for specificity boost.
  - Bare selectors preserved as fallback for `markdownToHTML()` (no wrapper).

- Style Architecture:
  - New `buildStyles(opts: StyleBundleOpts)` single CSS builder — all assembly methods delegate here.
  - `MathpixStyle` restructured into 10 composable sub-functions.
  - Color constants extracted into `src/styles/colors.ts`.
  - `halpers.ts` renamed to `helpers.ts`.

- Improvements:
  - `.tabular` now renders consistently regardless of context (standalone vs nested inside a list). Previously, list context could affect table width and font size via cascade. Fixed with explicit `margin: 0 0 1em`, `font-size: inherit`, and other defensive defaults.
  - `useColors=false` now correctly omits blockquote border, table border, and mark background colors.
  - `getMathpixStyle(useColors=false)` now also omits `ContainerStyle` colors (body text, headings, links, captions). Previously `ContainerStyle()` was always called with default colors.

- Bug Fixes:
  - `div.svg-container` child combinator consistency (`>` for both `#preview-content` and `#setText`).
  - `loadMathJax` updates existing `#Mathpix-styles` element instead of skipping.

- Breaking Changes:
  - `scaleEquation` parameter removed from `loadMathJax`, `getMathpixStyleOnly`, `getMathpixStyle`, and `getMathpixMarkdownStyles`. It was never used in CSS output. If you were passing it positionally, shift your arguments. Use `buildStyles(opts)` for a named-parameter alternative.

- Dead Code Removed:
  - `.empty` selector (never generated), `.preview-right` selector (used as id, not class).

- Docs:
  - Added implementation details in `pr-specs/2026-03-mmd-css-scoping.md`.

# February 2026

## [2.0.36] - 16 February 2026

- Math Output Format:
  - Added `output_format` option to `TOutputMath` to control which math format is placed in HTML output.
  - `'svg'` (default): Pre-rendered SVG with hidden formats, works offline.
  - `'mathml'`: Native `<math>` elements only, smaller file size, requires client-side rendering.
  - `'latex'`: Raw LaTeX with original delimiters, smaller file size, requires client-side rendering.

- Browser Rendering Script (`auto-render.js`):
  - New browser bundle for client-side math rendering at `es5/browser/auto-render.js`.
  - Renders MathML or LaTeX content to SVG.
  - Generates hidden format elements for context menu compatibility.
  - Configurable accessibility support via `MathpixAccessibilityConfig`:
    - `assistive_mml`: Add `<mjx-assistive-mml>` for screen readers.
    - `include_speech`: Add `aria-label` with speech text.

- Browser Speech Script (`add-speech.js`):
  - New browser bundle for adding speech to already-rendered SVG at `es5/browser/add-speech.js`.
  - Use when SVG was rendered with `assistiveMml: true` but without `sre` (speech).
  - Loads SRE dynamically and adds `aria-label`, `role="math"`, `tabindex` to `mjx-container` elements.
  - Requires `mjx-assistive-mml` to be present in the rendered output.
  - Exposes `window.MathpixSpeech.addSpeechToRenderedMath(container?)`.

- Accessibility:
  - `mjx-assistive-mml` is no longer marked with `aria-hidden="true"` when accessibility options are enabled. Previously, the assistive MathML element was hidden from screen readers even when the user explicitly requested accessibility via `assistiveMml: true` or `sre`. Now, if any accessibility option is set, the MathML content is exposed to assistive technology — either via `aria-labelledby` (pointing to the assistive MML) or via `aria-label` (SRE speech text). This affects both server-side rendering (`addAriaToMathHTML`) and the new browser bundles.

- Fixes:
  - Fixed centering issue for equations with numbering inside `.math-block[data-width="full"]`.

- Docs:
  - Added implementation details in `pr-specs/2026-01-html-math-output-options.md`.

## [2.0.35] - 13 February 2026

- Tabular:
  - When `forMD` option is set, `renderTableCellContent` now delegates `image`/`includegraphics` rendering to the caller's render rules instead of hardcoding `![alt](src)`.
  - Added `isTableCell` meta flag on child tokens when `forMD` is set, allowing render rules to escape pipe characters in alt text.
  - Added null-safety for `attrGet('alt')` in the default image rendering path.

- Docs:
  - Added implementation details in `pr-specs/2026-02-formd-delegate-image-rendering-in-table-cells.md`.

## [2.0.34] - 7 February 2026

- Table/Figure:
  - Fixed renderer hang when a `\begin{table}` or `\begin{figure}` has a malformed closing tag (e.g. `\end{table>`).
  - `BeginTable` no longer consumes content across multiple table/figure environments when the first is unclosed.

- Lists (inline):
  - Fixed `latexListEnvInline` silent mode to advance `state.pos`, preventing infinite loops in `skipToken` when `\begin{itemize}` or `\begin{enumerate}` appears in inline content.

- Docs:
  - Added implementation details in `pr-specs/2026-02-fix-stuck-render-malformed-table-close.md`.

# January 2026

## [2.0.33] - 27 January 2026

- Tabular:
  - Fixed rendering of tabular environments following nested tabular placeholders that expand to lists.
  - Block parsing status is now propagated from nested sub-tabulars to parent cells to preserve line breaks.
  - Centralized block detection logic into `detectLocalBlock()`.

- Docs:
  - Added implementation details in `pr-specs/2026-01-nested-tabular-text-prefix-with-lists.md`.

## [2.0.32] - 21 January 2026

- Tabular:
  - Added support for LaTeX `itemize` and `enumerate` lists inside table cells.
  - Nested lists now render with correct markers per level.
  - Custom (`\item[X]`) and empty (`\item[]`) markers are preserved.
  - Fixed edge cases with lists mixed with nested tabular, math, and inline formatting.

- Exports:
  - Markdown: list items are separated with `<br>` inside table cells.
  - TSV/CSV: list items are separated by newline characters.
  - Improved export fidelity for tables containing nested lists.

- Parsing:
  - Tabular cells conditionally switch to block parsing when list environments are detected.
  - Prevent nested `.table_tabular` elements from being processed as top-level tables.

- Docs:
  - Detailed implementation notes and test coverage are documented in
    `pr-specs/2026-01-itemize-support-inside-tabular.md`.
