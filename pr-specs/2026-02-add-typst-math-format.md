# PR: Add Typst math format — serializer, symbol map, context menu, and edge-case fixes

Status: Implemented
Owner: @OlgaRedozubova

---

## Context

[Typst](https://typst.app/) is a modern typesetting system gaining adoption as an alternative to LaTeX. mathpix-markdown-it already converts LaTeX math to MathML, AsciiMath, and SVG via MathJax's internal MathML tree. Adding Typst output lets users copy Typst math directly from the rendered preview.

**Before this work:**
- No Typst conversion existed in the codebase
- The `OuterData()` pipeline had slots for MathML, AsciiMath, LaTeX, SVG, and speech — but not Typst
- The right-click context menu exposed LaTeX, AsciiMath, MathML, and other formats — but not Typst

## Goal

- Implement a complete LaTeX → Typst math converter by traversing MathJax's internal MathML tree
- Cover all major LaTeX math constructs: arithmetic, Greek letters, accents, fonts, operators, delimiters, matrices, equation arrays, cases, large operators, integrals, scripts, roots, spacing, and more
- Expose Typst output in the rendering pipeline (`OuterData`, `OuterHTML`) and the right-click context menu
- Produce idiomatic Typst — use native shorthands (`abs()`, `norm()`, `floor()`, `ceil()`, `RR`, `NN`, prime `'` syntax, `dif`) instead of verbose generic forms where possible, with automatic `lr()` fallback when content has separators

## Non-Goals

- Converting non-math Typst markup (text, layout, bibliographies)
- Handling Typst-specific features that have no LaTeX equivalent
- Modifying any existing conversion format (MathML, AsciiMath, LaTeX, SVG)

## Architecture

### Conversion pipeline

```
LaTeX string
  → MathJax TeX input jax
  → Internal MathML tree (MmlNode)
  → SerializedTypstVisitor (new)
  → ITypstData { typst, typst_inline? }
  → toTypstData() normalization
  → { typstmath, typstmath_inline }
```

The visitor walks the same MathML tree that the existing `SerializedAsciiVisitor` uses. It is invoked when `include_typst: true` is set in `outMath` options.

### Dual output format — block vs inline

The converter always produces **two** Typst representations:

| Field | Description |
|-------|------------|
| `typstmath` | Full Typst output, may contain block-level constructs (`#math.equation(...)`, `#grid(...)`, `#box(...)`) |
| `typstmath_inline` | Inline-safe variant for use inside `$...$` — pure math content without block wrappers |

For most expressions these are identical. They differ for:
- **Numbered equations** (`\begin{equation}`, `\tag{}`): `typstmath` uses `#math.equation(block: true, numbering: ..., $ ... $)`, `typstmath_inline` contains the raw math
- **Numcases/subnumcases**: `typstmath` uses `#grid(...)`, `typstmath_inline` contains just `cases(...)`
- **Boxed expressions** (`\boxed{}`): `typstmath` uses `#box(stroke: 0.5pt, inset: 3pt, $ ... $)`, `typstmath_inline` contains the inner content
- **Bordered arrays** (array with `frame=solid`): similar to boxed

**Implementation details:**

`ITypstData` carries both fields through the visitor tree:
```typescript
interface ITypstData {
  typst: string;
  typst_inline?: string;  // undefined = same as typst
}
```

- `typst_inline` is `undefined` by default — this signals "identical to `typst`"
- `addToTypstData()` always propagates `typst_inline`: when the input has no explicit `typst_inline`, it falls back to `typst`
- `addSpaceToTypstData()` inserts separator spaces into both fields simultaneously
- Only handlers that produce block wrappers set `typst_inline` explicitly (mtable/frame, menclose/box, numbered equations, grid layouts)
- `toTypstData()` normalizes the final output, applying `typst_inline ?? typst` fallback

**Examples where formats differ:**

| LaTeX | `typstmath` (block) | `typstmath_inline` |
|-------|--------------------|--------------------|
| `\begin{equation} y^2 \end{equation}` | `#math.equation(block: true, numbering: "(1)", $ y^2 $)` | `y^2` |
| `\boxed{x=1}` | `#box(stroke: 0.5pt, inset: 3pt, $ x = 1 $)` | `x = 1` |
| `\begin{array}{\|c\|}\hline a \\ \hline\end{array}` | `#box(stroke: 0.5pt, inset: 3pt, $ mat(...) $)` | `mat(...)` |

For most expressions (e.g. `\frac{a}{b}`, `\sum_{i=1}^n x_i`) both fields are identical: `frac(a, b)`, `sum_(i = 1)^n x_i`.

### Module structure

All new Typst code lives in `src/mathjax/serialized-typst/`:

| File | Purpose |
|------|---------|
| `index.ts` | `SerializedTypstVisitor` class — extends MathJax's `MmlVisitor`, handles root traversal, inferred mrow spacing, big delimiter detection (`\big`, `\Big`, etc.), bare delimiter-pair grouping (`|...|`, `⌊...⌋`, `⌈...⌉`, `‖...‖`), `\idotsint` grouping (integral-dots-integral pattern via `SCRIPT_KINDS` constant), and thousand-separator comma detection |
| `handlers.ts` | Node-type handlers — one function per MathML element (`mi`, `mo`, `mn`, `mfrac`, `msup`, `msub`, `msubsup`, `msqrt`, `mroot`, `mover`, `munder`, `munderover`, `mmultiscripts`, `mrow`, `mtable`, `mtext`, `mspace`, `mpadded`, `mstyle`, `mphantom`, `menclose`) |
| `typst-symbol-map.ts` | Unicode → Typst symbol name mapping tables (Greek, binary operators, relations, arrows, delimiters, large operators, misc) plus accent map and font map |
| `common.ts` | `ITypstData` interface, `initTypstData`, `addToTypstData`, `addSpaceToTypstData`, `needsParens`, `isThousandSepComma`, `needsTokenSeparator` helpers |
| `node-utils.ts` | `isFirstChild` / `isLastChild` tree-position utilities |

### Integration points

| File | Change |
|------|--------|
| `src/mathjax/index.ts` | `OuterData()` calls `toTypstData()` when `include_typst` is set, populating both `typstmath` and `typstmath_inline`; `OuterHTML()` emits `<typstmath>` and `<typstmath_inline>` hidden tags; `TexConvertToTypstData()` public API — returns `{ typstmath, typstmath_inline }` |
| `src/mathpix-markdown-model/index.ts` | `include_typst?: boolean` added to `TOutputMath` type |
| `src/contex-menu/menu/consts.ts` | `'typst'` and `'typst_inline'` added to `mathExportTypes`; `typst` and `typst_inline` added to `eMathType` enum |
| `src/contex-menu/menu/menu-item.ts` | `case eMathType.typst:` → title `'Typst'`; `case eMathType.typst_inline:` → title `'Typst (inline)'` |
| `src/contex-menu/menu/menu-items.ts` | Skips `typst_inline` when its value equals `typst` (no redundant menu entry) |
| `src/helpers/parse-mmd-element.ts` | `'TYPSTMATH'` and `'TYPSTMATH_INLINE'` recognized in DOM parser; mapped to types `'typst'` and `'typst_inline'` |

## Supported LaTeX Constructs

### Core math

| LaTeX | Typst output | Handler |
|-------|-------------|---------|
| `a/b` | `a\/ b` | `mo` (escaped — Typst `/` creates a fraction) |
| `\frac{a}{b}` | `frac(a, b)` | `mfrac` |
| `x^{2}` | `x^2` | `msup` |
| `x_{i}` | `x_i` | `msub` |
| `x_{i}^{2}` | `x_i^2` | `msubsup` |
| `\sqrt{x}` | `sqrt(x)` | `msqrt` |
| `\sqrt[3]{x}` | `root(3, x)` | `mroot` |
| `\surd` | `\√` | `mo` (escaped — bare `√` triggers Typst sqrt operator) |
| `\binom{n}{k}` | `binom(n, k)` | `mfrac` (linethickness=0) |

### Greek letters

Full coverage of lowercase, uppercase, and variant forms. Examples: `\alpha` → `alpha`, `\varepsilon` → `epsilon`, `\vartheta` → `theta.alt`.

**Dotless letters:** `\imath` → `dotless.i`, `\jmath` → `dotless.j`. Commonly used under accents: `\hat{\imath}` → `hat(dotless.i)`.

### Accents

| LaTeX | Typst | Method |
|-------|-------|--------|
| `\hat{x}` | `hat(x)` | Shorthand accent |
| `\bar{x}` | `macron(x)` | Shorthand accent |
| `\vec{x}` | `arrow(x)` | Shorthand accent |
| `\dddot{x}` | `accent(x, dot.triple)` | Generic `accent()` form |
| `\overleftarrow{AB}` | `accent(A B, arrow.l)` | Generic `accent()` form |
| `\overbrace{x+y}^{n}` | `overbrace(x + y, n)` | Annotation as 2nd argument |
| `\underbrace{x+y}_{n}` | `underbrace(x + y, n)` | Annotation as 2nd argument |
| `\overbrace{x+y}` | `overbrace(x + y)` | No annotation |
| `\underbrace{x+y}` | `underbrace(x + y)` | No annotation |

### Font commands

| LaTeX | Typst |
|-------|-------|
| `\mathbb{R}` | `RR` (doubled-letter shorthand for single uppercase) |
| `\mathbb{1}` | `bb(1)` (generic for non-letter) |
| `\mathcal{L}` | `cal(L)` |
| `\mathfrak{g}` | `frak(g)` |
| `\mathbf{v}` | `upright(bold(v))` |
| `\mathrm{d}` | `dif` (differential operator optimization) |
| `\mathit{word}` | `italic("word")` |
| `\boldsymbol{v}` | `bold(v)` (italic bold) |
| `\boldsymbol{\alpha}` | `bold(alpha)` (bold Greek — `mathvariant="bold-italic"` applied to known symbols) |
| `\textit{ if }` | `italic(" if ")` (via `mtext` with `mathvariant="italic"`) |
| `\textbf{ if }` | `bold(" if ")` (via `mtext` with `mathvariant="bold"`) |

### Operators and relations

Spaced binary operators (`+`, `-`, `=`, `<`, `>`), named operators (`\cdot` → `dot.op`, `\times` → `times`), relations (`\leq` → `lt.eq`, `\approx` → `approx`), set operators (`\cup` → `union`, `\in` → `in`), negated forms (`\not\equiv` → `equiv.not`).

### Arrows

Standard arrows (`\rightarrow` → `arrow.r`, `\Leftrightarrow` → `arrow.l.r.double`, `\mapsto` → `arrow.r.bar`), extensible arrows (`\xrightarrow{f}` → `stretch(arrow.r)^f`), harpoons (`\rightleftharpoons` → `harpoons.rtlb`).

**Extensible arrows vs stacking:** LaTeX extensible arrows (`\xrightarrow`, `\xleftarrow`, `\xtwoheadrightarrow`, `\xmapsto`, `\xlongequal`, `\xtofrom`, etc.) stretch the base symbol to fit annotations. Stacking commands (`\stackrel`, `\overset`, `\underset`) place text above/below without stretching. The serializer distinguishes these by checking the `stretchy` attribute on the base `mo` node (MathJax sets `stretchy=true` for extensible arrows). The inner `mo` is found by unwrapping `mstyle`/`inferredMrow` wrappers (up to 5 levels). Only symbols in `STRETCH_BASE_SYMBOLS` (arrows, harpoons, `=`) are eligible.

| LaTeX | Typst | Why |
|-------|-------|-----|
| `\xrightarrow[below]{above}` | `stretch(arrow.r)_(below)^(above)` | `stretchy=true` → stretch |
| `\xleftarrow{g}` | `stretch(arrow.l)^g` | `stretchy=true` → stretch |
| `\xtwoheadrightarrow[du=dx]{u=x+1}` | `stretch(arrow.r.twohead)_(d u = d x)^(u = x + 1)` | stretch |
| `\xtwoheadleftarrow[du=dx]{u=x+1}` | `stretch(arrow.l.twohead)_(d u = d x)^(u = x + 1)` | stretch |
| `\xmapsto[du=dx]{u=x+1}` | `stretch(arrow.r.bar)_(d u = d x)^(u = x + 1)` | stretch |
| `\xlongequal[du=dx]{u=x+1}` | `stretch(=)_(d u = d x)^(u = x + 1)` | stretch |
| `\xtofrom[du=dx]{u=x+1}` | `stretch(arrows.rr)_(d u = d x)^(u = x + 1)` | stretch |
| `\stackrel{f}{\rightarrow}` | `limits(arrow.r)^f` | no `stretchy` → limits |
| `\overset{n}{=}` | `limits(=)^n` | no `stretchy` → limits |
| `\underset{n}{=}` | `limits(=)_n` | no `stretchy` → limits |

### Named functions

Built-in Typst math operators (`sin`, `cos`, `tan`, `log`, `lim`, etc.) pass through directly. Multi-word operators (`\limsup` → `limsup`, `\liminf` → `liminf`) are mapped from MathJax's thin-space form to Typst built-ins via `MATHJAX_MULTIWORD_OPS`. Custom operators via `\operatorname{name}` → `op("name")`; custom `mo` operators (e.g. `\injlim` → `op("inj lim")`, `\projlim` → `op("proj lim")`) emit bare `op()` without `limits: #true` — the parent handler (`munderover`/`munder`/`mover`) decides placement via `movablelimits`. Thin Unicode spaces in operator names are normalized to regular spaces. Note: `\varinjlim`/`\injlim` and `\varprojlim`/`\projlim` produce identical MathML and thus identical Typst output.

### Delimiters

| LaTeX | Typst |
|-------|-------|
| `\left( x \right)` | `lr(( x ))` |
| `\left| x \right|` | `abs(x)` |
| `\left\| x \right\|` | `norm(x)` |
| `\left\lfloor x \right\rfloor` | `floor(x)` |
| `\left\lceil x \right\rceil` | `ceil(x)` |
| `\left| a, b, c \right|` | `lr(\| a, b, c \|)` (fallback — content has separators) |
| `\left\| a, b \right\|` | `lr(‖ a, b ‖)` (fallback) |
| `\left\lfloor a, b \right\rfloor` | `lr(⌊ a, b ⌋)` (fallback) |
| `\left\lceil a, b \right\rceil` | `lr(⌈ a, b ⌉)` (fallback) |
| `\left( x \right.` | `lr(\( x)` (one-sided, `(` escaped) |
| `\left. x \right]` | `lr(x ])` (one-sided, `]` unescaped for lr() auto-sizing) |
| `\left. x \right)` | `lr(x \))` (one-sided, `)` escaped — closes lr() otherwise) |
| `\big( x \big)` | `lr(size: #1.2em, ( x ))` |
| `|x|` (without `\left...\right`) | `lr(| x |)` (pipe-pair detection) |
| `\lfloor x \rfloor` (without `\left...\right`) | `floor(x)` (bare delimiter-pair detection) |
| `\lceil y \rceil` (without `\left...\right`) | `ceil(y)` (bare delimiter-pair detection) |
| `\|x\|` (‖, without `\left...\right`) | `norm(x)` (bare delimiter-pair detection) |

**One-side-invisible delimiter escaping:** When one delimiter is invisible (`\left.` or `\right.`), the visible delimiter is wrapped in `lr()`. Escaping rules for the visible delimiter: `(`, `)`, `[`, `{`, `}` are backslash-escaped; `]` is left **unescaped** so `lr()` can recognise and auto-size it. Rationale: `(` and `[` open groups/content blocks causing parse errors; `)` prematurely closes the `lr()` function call; `{` and `}` are code block syntax. `]` is safe because it doesn't have special syntactic meaning inside function-call arguments. Additionally, `replaceUnpairedBrackets()` (string-level post-processing for mat/cases cells) would corrupt unescaped `)` — it sees the first `)` as the `lr()` function-call close and replaces the second `)` with `paren.r`. Unescaped `]` is safe here because it falls inside the `lr(...)` function call scope and is skipped by the function-call-aware scanner.

**Separator-safe fallback for shorthand functions:** `abs()`, `norm()`, `floor()`, `ceil()` accept exactly one argument. If the delimited content contains a top-level `,` or `;` (detected by `hasTopLevelSeparators()`), these would be misinterpreted as argument/row separators inside the function call. In such cases, the serializer falls back to `lr()` with explicit delimiter characters (`lr(| ... |)`, `lr(‖ ... ‖)`, `lr(⌊ ... ⌋)`, `lr(⌈ ... ⌉)`), where commas just separate content fragments without breaking semantics. Characters inside nested parentheses/brackets are not counted.

**Semicolon escaping inside `lr()`:** Even after falling back to `lr()`, semicolons remain dangerous — Typst interprets `;` inside any function call as a row separator (like in `mat()`). The `escapeLrSemicolons()` helper replaces top-level `;` with `";"` (Typst text literal) inside all `lr()` calls: shorthand fallbacks, the general `lr()` path, and one-sided delimiter wrapping. Commas are safe in `lr()` since it accepts `..content` (variadic) — they just separate content fragments that get concatenated.

| LaTeX | Typst |
|-------|-------|
| `\left\lfloor a ; b \right\rfloor` | `lr(⌊ a";" b ⌋)` |
| `\left\| a ; b \right\|` | `lr(‖ a";" b ‖)` |
| `\left( a ; b \right)` | `lr(( a";" b ))` |

**Unbalanced parenthesis escaping in `menclose` wrappers:** When serialized child content contains unbalanced `)` characters (e.g. from `\smash{)}` inside `\lcm`), they would prematurely close the wrapping function call (`underline(...)`, `overline(...)`, `sqrt(...)`, etc.). The `escapeUnbalancedParens()` helper tracks parenthesis depth and replaces any `)` at depth 0 with `")"` (Typst string literal). Applied to all `menclose` branches that wrap content: `bottom`, `top`, `radical`, `longdiv`.

### Matrices and equation arrays

| LaTeX | Typst |
|-------|-------|
| `\begin{pmatrix}` | `mat(delim: "(", ...)` |
| `\begin{bmatrix}` | `mat(delim: "[", ...)` |
| `\begin{vmatrix}` | `mat(delim: "\|", ...)` |
| `\begin{array}{c\|c}` | `mat(delim: #none, augment: #(vline: 1), ...)` |
| `\begin{array}{ll}` | `mat(delim: #none, align: #left, ...)` (uniform non-center alignment) |
| `\begin{aligned}` | Row-separated with `\` |
| `\begin{cases}` | `cases(...)` |
| `\begin{numcases}` | `#grid(...)` with `cases(...)` + numbering column |

**Multiline formatting for 2+ rows:** When a `mat()` or `cases()` expression has 2 or more rows, the output uses multiline format with 2-space indentation for readability. Only single-row expressions remain on one line.

```
// 1 row — single-line
mat(delim: #none, a, b, c)

// 2+ rows — multiline
mat(delim: "(",
  a, b;
  c, d,
)
cases(
  x & "if " x > 0,
  - x & "otherwise",
)
```

**Array column alignment:** `\begin{array}{lcr}` extracts the column spec. When all columns share the same non-center alignment, `align: #left` or `align: #right` is emitted. Mixed or all-center alignments omit the parameter (center is Typst's default).

**Unpaired brackets in cells:** When `[`, `]`, `(`, `)`, `{`, `}` appear in a matrix or cases cell without a matching pair in the same cell (e.g., a bracket spanning across rows), the `replaceUnpairedBrackets()` helper replaces them with Typst symbol names (`bracket.l`, `paren.r`, `brace.l`, etc.) to avoid breaking `mat()`/`cases()` parsing. Paired brackets within the same cell, escaped brackets (`\[`), brackets inside function calls (`frac(...)`), and brackets inside quoted strings (`"..."`) are left unchanged. Applied in all three mtable branches: matrix, cases, and numcases.

```
LaTeX:  \begin{array}{lc} a & [ b + c \\ d & + e ] \end{array}
Typst:  mat(delim: #none, a, bracket.l b + c; d, + e bracket.r)
```

**Spanning `\left...\right` inside `mat()`:** When `\left[...\right.` / `\left...\right]` produce one-sided delimiters inside a matrix, the mrow handler wraps the delimiter in `lr()`. Opening delimiters (`(`, `[`, `{`) and `)` are backslash-escaped to avoid parse errors. Closing `]` is left unescaped so `lr()` can auto-size it:

```
LaTeX:  \begin{array}{l} \left[ x \right. \\ \left. y \right] \end{array}
Typst:  mat(delim: #none, align: #left, lr(\[ x); lr(y ]))
```

### Equation tags and numbering

Each numbered equation is emitted as an independent `#math.equation(block: true, numbering: ..., $ ... $)` block. This avoids `#set math.equation(numbering: ...)` which would affect subsequent equations.

**Single equations:**

| LaTeX | Typst |
|-------|-------|
| `\begin{equation} y^2 \end{equation}` (auto) | `#math.equation(block: true, numbering: "(1)", $ y^2 $)` |
| `E = mc^2 \tag{1.2}` (explicit) | `#math.equation(block: true, numbering: n => [(1.2)], $ ... $)` + newline + `#counter(math.equation).update(n => n - 1)` |
| `\begin{equation*} S \tag{1} \end{equation*}` | `#math.equation(block: true, numbering: n => [(1)], $ S $)` + newline + `#counter(math.equation).update(n => n - 1)` |

**Counter rollback for explicit `\tag{}`:** In LaTeX, `\tag{...}` does not increment the equation counter — only auto-numbered equations do. However, Typst's `math.equation` with any `numbering` always steps the counter. To preserve correct numbering, the serializer emits `#counter(math.equation).update(n => n - 1)` after each explicit-tagged equation, undoing the unwanted step.

**Multi-row environments** (`align`, `gather`): each row becomes a separate block. Numbered rows use `#math.equation(...)`, unnumbered rows (`\nonumber`, `\notag`, or untagged rows in `align*`) use `#math.equation(block: true, numbering: none, ...)` to avoid bare `$ ... $` which would cause double math-mode wrapping.

| LaTeX | Typst |
|-------|-------|
| `\begin{align} a &= b \\ c &= d \end{align}` (auto) | `#math.equation(block: true, numbering: "(1)", $ a = b $)` + newline + `#math.equation(block: true, numbering: "(1)", $ c = d $)` |
| `\begin{align} a &= b \tag{A} \\ c &= d \tag{B} \end{align}` | `#math.equation(block: true, numbering: n => [(A)], ...)` + `#counter(...)` rollback per row |
| `\begin{align} a &= b \\ c &= d \nonumber \end{align}` | `#math.equation(...)` + newline + `#math.equation(block: true, numbering: none, $ c = d $)` |
| `\begin{align*} hv &= ... \\ hv &= ... \tag{i} \\ 1.2 hv &= ... \tag{ii} \end{align*}` | `#math.equation(block: true, numbering: none, $ ... $)` + tagged rows with `numbering: n => [(i)]` etc. |
| `\begin{align*} a &= b \\ &= d \end{align*}` | `a = b \` + newline + ` = d` (no tags at all → single block, no wrappers) |
| `\begin{equation} \begin{split} a &= b \\ &= c \end{split} \end{equation}` | `#math.equation(block: true, numbering: "(1)", $ a = b \` newline ` = c $)` (single number) |

**Labels on equations** (`\label{eq:1}`): When a `\label{}` is present, the serializer emits a Typst label `<key>` after the equation block, and adds `supplement: none` to prevent Typst from prefixing "Equation" when referencing:

| LaTeX | Typst |
|-------|-------|
| `\begin{equation} y^2 \label{eq:1} \end{equation}` | `#math.equation(block: true, supplement: none, numbering: "(1)", $ y^2 $) <eq:1>` |
| `\begin{equation} E=mc^2 \tag{rel} \label{eq:e} \end{equation}` | `#math.equation(block: true, supplement: none, numbering: n => [(rel)], $ ... $) <eq:e>` + counter rollback |
| `\begin{equation} y^2 \end{equation}` (no label) | `#math.equation(block: true, numbering: "(1)", $ y^2 $)` (no supplement, no label) |

Labels are preserved through MathJax via a `data-label-key` property patched onto tag `mtd` nodes in `AbstractTags.getTag()`. The `getLabelKey()` helper reads this property to determine whether a label should be emitted.

**numcases / subnumcases environments:**

The `numcases` and `subnumcases` environments (from LaTeX's `cases` package) produce a cases expression where each row has its own equation number. Typst has no direct equivalent, so the serializer emits a `#grid()` layout with two columns: the cases expression on the left and per-row numbering on the right. The grid uses `align: (left, right + horizon)` for proper vertical alignment.

Auto-numbered (`\begin{numcases}{f(x)=} 0 & x < 0 \\ x & x \geq 0 \end{numcases}`):
```typst
#grid(
  columns: (1fr, auto),
  align: (left, right + horizon),
  math.equation(block: true, numbering: none, $ f(x) = cases(0 & "x < 0", x & "x ≥ 0") $),
  grid(
    row-gutter: 0.65em,
    { counter(math.equation).step(); context counter(math.equation).display("(1)") },
    { counter(math.equation).step(); context counter(math.equation).display("(1)") },
  ),
)
```

Note: `counter.step()` is placed **outside** `context` in the document flow (inside a `{ }` code block). The `context` keyword is only used for reading the counter value — calling `step()` inside `context` does not persist.

Explicit tags (`\begin{numcases}{f(x)=} x^2 \tag{A} \\ \sqrt{x} \tag{B} \end{numcases}`):
```typst
#grid(
  columns: (1fr, auto),
  align: (left, right + horizon),
  math.equation(block: true, numbering: none, $ f(x) = cases(x^2, sqrt(x)) $),
  grid(
    row-gutter: 0.65em,
    [(A)],
    [(B)],
  ),
)
```

**Numcases with labels**: Each numcases row can have its own `\label{}`. Since Typst only allows one label per block, the serializer wraps tag entries in `#figure(kind: "eq-tag", ...)` to make each individually labelable:

Auto-numbered with labels:
```typst
{ counter(math.equation).step(); context {
  let n = numbering("(1)", ..counter(math.equation).get());
  [#figure(kind: "eq-tag", supplement: none, numbering: _ => n, [#n]) <nc:1>]
} }
```

Explicit tag with label:
```typst
[#figure(kind: "eq-tag", supplement: none, numbering: n => [(3.12)], [(3.12)]) <eq:3.12>]
```

**Tag detection uses two sources**, depending on where `\tag` appears:

1. **Condition-embedded tags**: When numcases has a `&` separator (`\begin{numcases}{f(x)=} 0 & x < 0 \tag{3.12}`), the `\tag{...}` ends up as literal text in the condition `mtext` node (MathJax does not process it as a tag command). The `extractTagFromConditionCell()` helper walks the condition cell's tree to extract `\tag{...}` patterns from mtext content. Extracted tags are stripped from condition text and used as `[(tag)]` labels.

2. **Label-cell tags**: When numcases has no `&` separator or an empty prefix (`\begin{numcases}{} ... \tag{3.12}`), MathJax processes `\tag` as a real tag and places it in the label `mtd` cell. The serializer checks `data-tag-auto` on the label cell — if `false`, it uses `serializeTagContent()` to extract the tag text and emits `[tagContent]` (the label already includes parentheses from MathJax).

**Empty prefix support**: `isNumcasesTable()` accepts 3+ children per row (not just 4+). With an empty prefix `{}` and no `&` separator, MathML has 3 columns (label + prefix-with-brace + content) instead of 4 (label + prefix + value + condition). The content column iteration (`startCol` to `childNodes.length`) handles both layouts.

**Separator escaping in all function-call wrappers**: In Typst, commas and semicolons inside any function call are parsed as argument/row separators. This affects not only `mat()`/`cases()` but every wrapper that places serialized content inside `(...)`: `sqrt()`, `root()`, `overline()`, `underline()`, `cancel()`, `limits()`, `stretch()`, `scripts()`, `attach()`, `hat()`, `arrow()`, `macron()`, `accent()`, `underbrace()`, `overbrace()`, etc.

Two escape helpers handle this:

- **`escapeContentSeparators(expr)`** — escapes `,` → `","` and `;` → `";"` at parenthesis depth 0. Applied to content arguments of all function-call wrappers listed above.
- **`escapeCasesSeparators(expr)`** — additionally escapes `:` → `":"` (named-argument syntax). Applied only to `mat()`/`cases()` cells where colons are also dangerous (e.g. `p:` parsed as named argument).

Both helpers use `isAlreadyEscaped()` — a peek at adjacent characters (`expr[i-1] === '"' && expr[i+1] === '"'`) — to skip separators that are already escaped as `","` / `";"` / `":"`. This prevents double-escaping when content passes through multiple nested wrappers (e.g. `\underline{\underline{14,320}}` → `underline(underline(14","320))`). Characters inside nested parentheses/brackets (e.g. `f(t_n, x^n)`) are left untouched (depth > 0).

| LaTeX | Typst | Wrapper |
|-------|-------|---------|
| `\underset{\sim}{0,0}` | `limits(0"," 0)_(tilde.op)` | `limits()` |
| `\sqrt{a,b}` | `sqrt(a"," b)` | `sqrt()` |
| `\overline{a;b}` | `overline(a";" b)` | `overline()` |
| `\cancel{x,y}` | `cancel(x"," y)` | `cancel()` |
| `\hat{x,y}` | `hat(x"," y)` | accent |
| `\sqrt{f(a,b)}` | `sqrt(f(a, b))` | depth > 0, not escaped |
| `\underline{\underline{14,320}}` | `underline(underline(14","320))` | nested, no double-escape |

Regular cases with commas (`f(x) = \left\{ \begin{array}{ll} {x^2+1,} & {x>1} \\ {1,} & {x=1} \\ {x+1,} & {x<1} \end{array} \right.`):
```typst
f(x) = cases(
  x^2 + 1"," & x > 1,
  1"," & x = 1,
  x + 1"," & x < 1,
)
```

Empty prefix numcases with commas, explicit tags, and labels (`\begin{numcases}{} \Delta ... f\left(t_n, x^n\right), n=1,2,\ldots,N \tag{3.12}\label{eq:3.12} \\ x^0=x_0 \tag{3.13}\label{eq3.13} \end{numcases}`):
```typst
#grid(
  columns: (1fr, auto),
  align: (left, right + horizon),
  math.equation(block: true, numbering: none, $ cases(...) $),
  grid(
    row-gutter: 0.65em,
    [#figure(kind: "eq-tag", supplement: none, numbering: n => [(3.12)], [(3.12)]) <eq:3.12>],
    [#figure(kind: "eq-tag", supplement: none, numbering: n => [(3.13)], [(3.13)]) <eq3.13>],
  ),
)
```

Note: the comma inside `lr(( t_n, x^n ))` is at depth 2 and preserved as-is, while top-level commas like `),"` and `1","` are escaped. The comma between `N` and `x^0` is the actual `cases()` row separator. Semicolons are escaped the same way — e.g. `L(u) = 1;` in a cases cell becomes `L(u) = 1";"`. Colons are escaped to prevent named-argument interpretation — e.g. `p:` in a mat() cell becomes `p":"`.

Matrix cell escaping examples:
```
LaTeX:  \begin{pmatrix} a & b; \\ c & d \end{pmatrix}
Typst:  mat(delim: "(", a, b";"; c, d)

LaTeX:  \begin{array}{l} p: \\ q \end{array}
Typst:  mat(delim: #none, align: #left, p":"; q)
```

**Math inside `\tag`:** Tags can contain inline math, e.g. `\tag{$x\sqrt{5}$ 1.3.1}`. MathJax represents this as a mix of `mtext` and math nodes inside the label `mtd`. The `serializeTagContent` helper walks the label tree and emits `mtext` as plain text and math groups as `$typst$`, producing `n => [($x sqrt(5)$ 1.3.1)]`.

### Large operators and integrals

`\sum` → `sum`, `\prod` → `product`, `\int` → `integral`, `\oint` → `integral.cont`, `\iint` → `integral.double`, etc. Limits placement via `_` and `^` for native operators, `limits()` wrapper for non-native bases.

**`\idotsint` grouping:** The `\idotsint` command (integral-dots-integral) produces three separate MathML nodes: `mo(∫)`, `mo(⋯)`, and a scripted `mo(∫)` (e.g. `msubsup(mo(∫), sub, sup)`). The `visitInferredMrowNode` method detects this pattern using the `SCRIPT_KINDS` constant (`msubsup`, `msub`, `msup`) and groups them into a single `lr(integral dots.c integral)` expression with attached scripts:

| LaTeX | Typst |
|-------|-------|
| `\idotsint_{a}^{b}` | `lr(integral dots.c integral)_(a)^(b)` |

### Limits / nolimits placement

LaTeX supports three limit-placement modes: **default** (operator decides), **`\limits`** (force below/above), and **`\nolimits`** (force side). The serializer detects these via the MathML `movablelimits` attribute on the base `mo` node:

| `movablelimits` | Meaning | Typst output |
|-----------------|---------|-------------|
| `true` | Default placement (operator decides) | `limsup_(i=1)^n` / `op("inj lim", limits: #true)_(i=1)^n` |
| `false` | Explicit `\limits` | `limits(limsup)_(i=1)^n` / `limits(op("proj lim"))_(i=1)^n` |
| absent (non-`mo` base) | Inferred from context | Uses `TYPST_DISPLAY_LIMIT_OPS` set |

For `\nolimits`, MathJax produces `msubsup`/`msub`/`msup` instead of `munderover`/`munder`/`mover`. The `needsScriptsWrapper()` helper detects known display-limit operators (`sum`, `lim`, `limsup`, etc.) in these contexts and wraps them in `scripts()`:

| LaTeX | Typst |
|-------|-------|
| `\sum_{i=1}^n` | `sum_(i = 1)^n` |
| `\sum\limits_{i=1}^n` | `limits(sum)_(i = 1)^n` |
| `\sum\nolimits_{i=1}^n` | `scripts(sum)_(i = 1)^n` |
| `\limsup_{i=1}^n` | `limsup_(i = 1)^n` |
| `\limsup\limits_{i=1}^n` | `limits(limsup)_(i = 1)^n` |
| `\limsup\nolimits_{i=1}^n` | `scripts(limsup)_(i = 1)^n` |
| `\projlim_{i=1}^n` | `op("proj lim", limits: #true)_(i = 1)^n` |
| `\projlim\limits_{i=1}^n` | `limits(op("proj lim"))_(i = 1)^n` |
| `\projlim\nolimits_{i=1}^n` | `op("proj lim")_(i = 1)^n` |

Multi-word operators (`\limsup` → `limsup`, `\liminf` → `liminf`) are mapped via `MATHJAX_MULTIWORD_OPS` from their thin-space-separated MathJax form ("lim⁠sup") to Typst built-ins.

**Trig/function operators with `\limits`:** MathJax produces `mi` (not `mo`) for category-4 operators (`\cos`, `\sin`, `\tan`, etc.), so `movablelimits` is not available on the base. The `munderover`/`munder`/`mover` handler detects these by checking the serialized base against `TYPST_MATH_OPERATORS` and wraps them in `limits()`:

| LaTeX | Typst |
|-------|-------|
| `\cos\limits_{x}^{y}` | `limits(cos)_(x)^(y)` |
| `\sin\limits_{i=1}^{n}` | `limits(sin)_(i = 1)^n` |

**Known limitations:**
- `\oint\limits` causes a MathJax error ("\\limits is allowed only on operators")
- `\varliminf`/`\varlimsup` with `\limits`: the accent handler produces `underline(lim)`/`overline(lim)` which bypasses limit-placement wrapping

### Brace annotations (underbrace/overbrace)

In Typst, `underbrace` and `overbrace` take annotations as a second argument: `underbrace(content, annotation)`, not as subscripts/superscripts. MathJax creates nested `munder`/`mover` nodes for `\underbrace{x}_{y}` and `\overbrace{x}^{y}`: the inner node produces `underbrace(x)` / `overbrace(x)`, and the outer node's fallback path would normally add `_(y)` / `^(y)`. The `munder`/`mover` fallback handlers detect when the base matches `underbrace(...)` / `overbrace(...)` / `underbracket(...)` / `overbracket(...)` (via `BRACE_ANNOTATION_RE` regex) and insert the annotation as a second argument instead. The same check exists in `msub`/`msup` as a safety fallback.

| LaTeX | Typst |
|-------|-------|
| `\underbrace{x+y}_{n}` | `underbrace(x + y, n)` |
| `\overbrace{x+y}^{\text{sum}}` | `overbrace(x + y, "sum")` |
| `\overbrace{\underbrace{a+b}_{2}+c}^{\text{total}}` | `overbrace(underbrace(a + b, 2) + c, "total")` |
| `\underbrace{1+\cdots+1}_{\frac{n(n+1)}{2}}` | `underbrace(1 + dots.c + 1, frac(n(n + 1), 2))` |

### Scripts with prescripts

`\sideset{_a^b}{_c^d} \sum` → `attach(sum, tl: b, bl: a, t: d, b: c)` via `mmultiscripts` handler.

### Spacing

| LaTeX | Typst |
|-------|-------|
| `\quad` | `quad` |
| `\,` | `thin` |
| `\;` | `med` |
| `\!` | *(skipped — Typst has no `negthin`; LaTeX spacing hack)* |

### Other constructs

| LaTeX | Typst |
|-------|-------|
| `\cancel{x}` | `cancel(x)` |
| `\bcancel{x}` | `cancel(inverted: #true, x)` |
| `\boxed{x=1}` | `#box(stroke: 0.5pt, inset: 3pt, $x = 1$)` (block) / `x = 1` (inline) |
| `\enclose{circle}{x+y}` | `#circle(inset: 3pt, $x + y$)` (block) / `x + y` (inline) |
| `\enclose{radical}{x+y}` | `sqrt(x + y)` |
| `\enclose{top}{x+y}` | `overline(x + y)` |
| `\enclose{bottom}{x+y}` | `underline(x + y)` |
| `\lcm{24}` | `underline(")"24)` (macro expands to `\enclose{bottom}{\smash{)}{24}\:}`; leading `)` from `\smash` → `")"`, trailing `med` from `\:` stripped, no space for tight rendering) |
| `\color{red}{x}` | `#text(fill: red)[x]` |
| `\color{#D61F06}{60}` | `#text(fill: rgb("#D61F06"))[60]` (hex colors wrapped in `rgb("...")`) |
| `\colorbox{yellow}{x+y}` | `#highlight(fill: yellow)[$"x+y"$]` (block) / `"x+y"` (inline) |
| `\colorbox{#D61F06}{abc}` | `#highlight(fill: rgb("#D61F06"))[$"abc"$]` (block) / `"abc"` (inline) |
| `\fcolorbox{red}{yellow}{x}` | `#highlight(fill: yellow)[$"x"$]` (border color not preserved) |
| `\phantom{x}` | `#hide($x$)` (preserves dimensions) |
| `\hphantom{x}` | `#hide($x$)` (same — Typst hide preserves full box) |
| `\vphantom{x}` | `#hide($x$)` (same — no separate h/v variant in Typst) |
| `\ce{H2O}` | `upright(H)""_2 upright(O)` (mhchem — phantom alignment boxes stripped) |
| `\ce{^{A}_{z}X}` | `""_z^(upright(A)) upright(X)` (mhchem isotope notation) |
| `\ce{CO2}` | `upright("CO")""_2` (mhchem multi-char element) |
| `\substack{i<n \\ j<m}` | `mat(delim: #none, i < n; j < m)` (via mtable) |
| `a \bmod b` | `a mod b` |
| `a \pmod{b}` | `a quad (mod b)` |
| `\text{if }` | `"if "` |
| `\text{"hello"}` | `"\"hello\""` (inner `"` escaped — prevents breaking the Typst string literal) |
| `f'(x)` | `f'(x)` (prime shorthand) |
| `\$ 120,000` | `\$ 120","000` (escaped dollar + thousand-separator commas) |
| `\wp` | `℘` (Unicode output — no named Typst symbol) |
| `6 \longdiv{84}` | `6 overline(")"84)` (long division symbol — no space after `)` for tight rendering) |
| `\enclose{longdiv}{500}` | `overline(")"500)` (same via menclose) |

## Symbol Map Validation

The `typst-symbol-map.ts` file maps ~300 Unicode characters to Typst symbol names. All names were validated against the [Typst sym reference](https://typst.app/docs/reference/symbols/sym/). Fixes applied:

| Original (invalid) | Fixed | Symbols |
|---------------------|-------|---------|
| `ast` | `ast.op` | ∗ |
| `bowtie` | `⋈` (Unicode) | ⋈ |
| `cong` | `tilde.equiv` | ≅ |
| `cong.not` | `tilde.equiv.not` | ≇ |
| `corner.tl/tr/bl/br` | `corner.l.t/r.t/l.b/r.b` | ⌜⌝⌞⌟ |
| `eq.dot` | `≐` (Unicode) | ≐ |
| `eth` | `ð` (Unicode) | ð |
| `mid` | `divides` | ∣ |
| `nothing` | `diameter` | ⌀ |
| `ohm.inv` | `Omega.inv` | ℧ |
| `square` | `square.stroked` | □ ◻ |
| `suit.club` | `suit.club.filled` | ♣ |
| `suit.diamond` | `suit.diamond.stroked` | ♢ |
| `suit.heart` | `suit.heart.stroked` | ♡ |
| `suit.spade` | `suit.spade.filled` | ♠ |
| `triangle.t` | `triangle.stroked.t` | △ |
| `triangle.b` | `triangle.stroked.b` | ▽ |
| `wp` | `℘` (Unicode) | ℘ |

For symbols without a named Typst equivalent (`⋈`, `≐`, `ð`, `℘`), the Unicode character is output directly — Typst accepts Unicode in math mode.

## Spacing and Grouping Logic

Correct Typst output requires careful spacing to prevent token merging and avoid unintended function-call syntax.

### Token separation

Adjacent tokens must be separated by spaces to prevent merging. The `needsTokenSeparator(prev, next)` helper in `common.ts` centralizes this check: it returns `true` when `prev` does not end with a separator (`\s`, `(`, `{`, `[`, `,`, `|`) and `next` starts with a word character, dot, quote, or non-ASCII Unicode character (U+0080–U+FFFF). The Unicode range is needed because some symbols (e.g. `℘` from `\wp`) are output as raw Unicode — without the check, `ell℘` would merge into a single unparseable token. This helper is used in both `visitInferredMrowNode` (index.ts) and the `mrow` handler (handlers.ts).

### Special character escaping

Several characters have syntactic meaning in Typst math mode and must be escaped with `\` in the symbol map. These characters arrive as `mi` nodes (from `\#`, `\$`, `\&`, `\_`) or `mo` nodes (from `"`) with `mathvariant="normal"`. Without escaping, the `mi` handler would wrap them in `upright()` (e.g. `upright(#)`), which breaks Typst parsing because the special character retains its syntactic role inside the function call.

**Escape-form bypass in `mi` handler:** When a symbol maps to an escape form (starts with `\`), the `mi` handler skips all font wrapping (`upright()`, `bold()`, etc.) and outputs the escaped form directly. This is enforced by the condition `!(isKnownSymbol && typstValue.startsWith('\\'))` in the font-wrapping branch.

| LaTeX | Typst | Why escape is needed |
|-------|-------|---------------------|
| `\$` | `\$` | `$` terminates math mode |
| `\#` | `\#` | `#` starts a code expression |
| `\"` (in math) | `\"` | `"` starts a string literal |
| `\&` | `\&` | `&` is alignment separator |
| `\_` | `\_` | `_` is subscript operator |
| `\surd` | `\√` | `√` triggers sqrt operator |
| `a/b` | `a\/ b` | `/` creates a fraction (handled in `mo` handler, not symbol map) |

Note: `\%` produces `upright(%)` — `%` has no special meaning in Typst math mode, so no escaping is needed.

**Quote escaping inside `mtext`:** The `mtext` handler wraps text content in `"..."`. When the original text contains literal `"` characters (e.g. `\text{"hello"}`), they are escaped as `\"` before wrapping to avoid breaking the Typst string literal: `"\"hello\""`. This uses `value.replace(/"/g, '\\"')` before the `'"' + value + '"'` concatenation.

### Thousand-separator commas

Numbers like `120,000` arrive as three MathML nodes: `mn(120)`, `mo(,)`, `mn(000)`. A bare comma in Typst math acts as an argument separator, so `120, 000` would be misinterpreted. The `isThousandSepComma()` helper in `common.ts` detects the pattern `mn` + `mo(,)` + `mn(exactly 3 digits)` and is applied in both `visitInferredMrowNode` (top-level) and the `mrow` handler (nested contexts like `\underline{\underline{14,320}}`), merging them into a single token: `14","320`. The `","` is a Typst text literal that renders as a visual comma without separator semantics.

### Slash escaping

In LaTeX, `a/b` is a literal slash between tokens. In Typst, `/` creates a fraction (equivalent to `\frac`). The `mo` handler escapes `/` as `\/` to preserve the literal-slash semantics of the LaTeX source.

### Operator-paren spacing

Multi-character Typst symbol names (e.g. `lt.eq`, `gt.eq`, `arrow.r`) must have a space before `(` or `[` to prevent Typst from interpreting `lt.eq(x)` as a function call. The `mo` handler detects this by peeking at the next sibling.

### Empty-base scripts

LaTeX allows `^{x}` with no preceding base. The `msup`, `msub`, and `msubsup` handlers detect an empty base and emit `""` as a placeholder, preventing Typst's "unexpected hat" error.

### Empty-exponent scripts

LaTeX allows empty script groups like `m^{}` or `a_{}`, which MathJax preserves as `msup`/`msub`/`msubsup` nodes with empty children. The `msup`, `msub`, and `msubsup` handlers detect empty (after trim) superscript or subscript content and silently skip the script operator, preventing dangling `^` or `_` in Typst output.

| LaTeX | Typst |
|-------|-------|
| `\frac{m^{}}{\tau}` | `frac(m, tau)` |
| `a_{}^{2}` | `a^2` |
| `x^{}` | `x` |

### Empty-content protection

Typst functions require non-empty arguments — `sqrt()`, `frac(,)`, `hat()` etc. produce errors. When LaTeX content is empty (e.g. `\sqrt{}`, `\frac{}{}`, `\hat{}`), handlers use `|| '""'` fallback to emit a Typst empty text string as placeholder. Protected handlers: `msqrt`, `mroot`, `mfrac`/`binom`, `mover` (accents), `munder` (accents), `munderover` (limits base), `mmultiscripts` (attach base), `mn` (font wrapping), `menclose` (cancel/boxed).

### mhchem phantom alignment stripping

The `mhchem` package produces zero-size `mpadded` boxes containing `mphantom` for sub/superscript alignment in chemical formulas. For example, `\ce{H2O}` generates `<mpadded width="0"><mphantom><mi>A</mi></mphantom></mpadded>` inside `msub` — an invisible box used only for vertical alignment. Without handling, these produce `#hide($A$)` clutter in Typst output.

The `mpadded` handler strips these phantom alignment boxes using three checks:
1. **`hasPhantomChild(node)`** — shallow DFS (up to 5 levels) checks if the subtree contains an `mphantom` node
2. **`hasScriptAncestor(node)`** — walks the parent chain looking for `msub`/`msup`/`msubsup`/`mmultiscripts` — only phantoms inside script structures are alignment artifacts
3. **`(atr.width === 0 || atr.height === 0)`** — zero-size dimension confirms the box is invisible

When all three conditions are met, the `mpadded` handler returns empty output. Standalone `\hphantom{x}`/`\vphantom{x}` (which also use `mpadded` + `mphantom`) are preserved because they have no script ancestor.

**Empty script elision:** The `msub`, `msup`, and `msubsup` handlers detect when both the base and all script parts are empty (e.g. a fully-phantom alignment `msubsup` in mhchem) and skip the node entirely, preventing orphaned `""` placeholders.

**Phantom-base token separation:** The `needsTokenSeparator()` helper suppresses space before `""_` and `""^` patterns (phantom subscript/superscript bases), so `upright("CO")""_2` renders without a gap.

| LaTeX | Typst |
|-------|-------|
| `\ce{H2O}` | `upright(H)""_2 upright(O)` |
| `\ce{CO2}` | `upright("CO")""_2` |
| `\ce{^{A}_{z}X}` | `""_z^(upright(A)) upright(X)` |
| `\hphantom{x}` | `#hide($x$)` (standalone — no script ancestor) |
| `\vphantom{x}` | `#hide($x$)` (standalone — no script ancestor) |

### Auto-numbering vs explicit `\tag`

Typst uses `numbering: "(1)"` for standard sequential numbering, and `numbering: n => [(tag)]` for fixed custom labels. The MathML tree does not distinguish auto-numbered equations (`\begin{equation}`) from explicit `\tag{1}` — both produce identical `mlabeledtr` nodes with `<mtext>(1)</mtext>`.

To solve this, `src/mathjax/mathjax.ts` patches `AbstractTags`:
- `autoTag()` sets a `_isAutoTag` flag after calling the original method
- `getTag()` checks the flag and propagates it as `data-tag-auto: true` in the label `mtd` node's properties; also stores the original `\label{}` key as `data-label-key` when `this.label` is non-empty
- `startEquation()` resets the flag

The `autoTag()` patch only sets the flag when it actually assigns a tag (i.e. `currentTag.tag` was `null` before the call), so explicit `\tag{...}` inside auto-numbering environments like `align` is correctly detected as explicit.

The serializer checks `labelCell.properties['data-tag-auto']`: if `true` → `numbering: "(1)"`; otherwise → `numbering: n => [(tag)]`. This correctly handles edge cases like `\tag{1}` inside `equation*`, which is explicit despite looking like an auto-number.

### Tag label serialization

Tag labels are serialized by `serializeTagContent()` in `handlers.ts`, which walks the label `mtd` tree and emits each node according to its type:
- `mtext` nodes → plain text (for Typst content mode inside `[...]`)
- `mrow`/`TeXAtom` containing `mtext` children → recurse into children
- Pure math groups (`mrow` without `mtext`) → serialize as Typst math and wrap in `$...$`

This handles mixed tags like `\tag{$x\sqrt{5}$ 1.3.1}` where the MathML label contains interleaved `mtext` and math nodes: `<mtext>(</mtext>`, `<mrow><mi>x</mi><msqrt>...</msqrt></mrow>`, `<mtext> 1.3.1)</mtext>` → `($x sqrt(5)$ 1.3.1)`.

### Unpaired bracket escaping (pre-serialization tree walk)

LaTeX allows unmatched brackets like `\sigma(\mathrm{nm} ;` where `(` has no closing `)`. In Typst, a bare `(` would be interpreted as a function-call open, causing a parse error. The serializer uses a **pre-serialization DFS tree walk** (`markUnpairedBrackets()`) to detect and escape these.

**How it works:**

1. Before `visitTree()`, `markUnpairedBrackets(root)` walks the entire MathML tree via DFS
2. Collects all `mo` nodes containing `( ) [ ] { }` (excludes `|` and `‖` — handled separately)
3. Pairs brackets using a **strict stack**: a closing bracket matches ONLY the top of the stack (no cross-pairing like `({)}`)
4. Marks unpaired nodes with `node.properties['data-unpaired-bracket'] = 'open' | 'close'`
5. The `mo` handler checks this property **early** (before symbol-map lookup, spacing, slash escaping) and emits escaped delimiters

**Output format:** Escaped Typst delimiters (`\(`, `\)`, `\[`, `\]`, `\{`, `\}`) — these render as literal bracket glyphs in math mode with proper kerning, without being parsed as function-call or group delimiters.

**Fence delimiter exclusion:** `\left...\right` delimiters are excluded from collection. They are detected structurally: an `mo` node is a fence delimiter if it is the first or last child of an `mrow` with `texClass === TEXCLASS.INNER` and `open`/`close` properties. The MathML `fence` attribute cannot be used for this check — it defaults to `true` for ALL bracket characters in MathML, not just `\left...\right`. Without this exclusion, `\right]` would pair with an inner `[` inside the fence and prevent it from being marked as unpaired.

| LaTeX | Typst | Why |
|-------|-------|-----|
| `\sigma(\mathrm{nm} ;` | `sigma \(upright("nm");` | `(` unpaired → `\(` |
| `\alpha[x+y` | `alpha \[ x + y` | `[` unpaired → `\[` |
| `f(x+y]` | `f \( x + y \]` | cross-type, both unpaired |
| `x^{(n}` | `x^(\( n)` | unpaired inside superscript |
| `(x+y^{(z-k)}` | `\( x + y^((z - k))` | outer `(` unpaired, inner paired |
| `\frac{(a+b^{(c+d)})}{(e+f}` | `frac((a + b^((c + d))), \( e + f)` | mixed paired/unpaired |
| `\sigma(x)` | `sigma(x)` | paired — unchanged |
| `(q/p)^{(z-k)}` | `(q\/ p)^((z - k))` | all paired — unchanged |
| `\left( x \right)` | `lr(( x ))` | fence delimiters — handled by mrow |
| `\left. x [ y ) \right]` | `lr(x \[ y \) ])` | `[` and `)` unpaired inside fence; fence `]` unescaped for lr() auto-sizing |
| `\left( a [ b \right)` | `lr(( a \[ b ))` | `[` unpaired inside fence |

**Integration with `menclose`:** The `\lcm` macro expands to `\enclose{bottom}{\smash{)}{...}\:}`. The `menclose{bottom}` handler detects both `)` and `\)` prefix (since the tree walk may mark the `)` from `\smash` as unpaired) and produces `underline(")"...)` in both cases.

**Coexistence with cell-level escaping:** `replaceUnpairedBrackets()` (string-level) remains for matrix/cases cells. The tree walk handles top-level expressions; cell-level escaping handles brackets split across matrix rows.

### Bare delimiter-pair detection

LaTeX delimiters without `\left...\right` produce unpaired `<mo>` nodes in MathML. The `visitInferredMrowNode` method detects matched delimiter pairs at the top level using a `BARE_DELIM_PAIRS` map and converts them to idiomatic Typst:

| Opening | Closing | Typst output |
|---------|---------|-------------|
| `|` | `|` | `lr(| content |)` |
| `\lfloor` (⌊) | `\rfloor` (⌋) | `floor(content)` |
| `\lceil` (⌈) | `\rceil` (⌉) | `ceil(content)` |
| `\|` (‖) | `\|` (‖) | `norm(content)` |
| `\langle` (⟨) | `\rangle` (⟩) | `lr(chevron.l content chevron.r)` |

This ensures paired delimiters form grouped expressions in Typst (important after `/` for correct fraction denominator binding). For symmetric delimiters (`|`, `‖`), pairs inside `TeXAtom` groups (e.g. superscript `{|\alpha|}`) are left as-is since the enclosing script parens already provide grouping.

**Scripted closing delimiters:** When the closing delimiter carries a subscript or superscript (e.g. `\|x\|_2` where `‖` is the base of `msub(‖, 2)`), the `getDelimiterChar()` helper cannot see it directly. The `getScriptedDelimiterChar()` helper looks inside `msub`/`msup`/`msubsup` nodes to check if their base is a matching closing delimiter. When found, the script parts are extracted and appended to the delimited expression:

| LaTeX | Typst |
|-------|-------|
| `\|x\|_2` | `norm(x)_2` |
| `\|x\|^2` | `norm(x)^2` |
| `\|x\|_2^p` | `norm(x)_2^p` |
| `\|x\|_p \leq \|x\|_q` | `norm(x)_p lt.eq norm(x)_q` |
| `\|A\|_{\mathrm{F}}` | `norm(A)_(upright(F))` |
| `|x|_2` | `lr(\| x \|)_2` |
| `\lfloor x \rfloor_n` | `floor(x)_n` |
| `\lceil y \rceil^2` | `ceil(y)^2` |

## Example

### Input

```latex
^{|\alpha|} \sqrt{x^{\alpha}} \leq(x \bullet \alpha) /|\alpha|
```

### Output

```typst
""^(|alpha|) sqrt(x^(alpha)) lt.eq (x bullet alpha)\/ lr(| alpha |)
```

## Files Changed

| File | Change |
|------|--------|
| `src/mathjax/serialized-typst/index.ts` | **New.** `SerializedTypstVisitor` class with root traversal, big-delimiter detection, bare delimiter-pair grouping (`|`, `⌊⌋`, `⌈⌉`, `‖`, `⟨⟩`) with scripted-closing-delimiter support (`getScriptedDelimiterChar`), `\idotsint` grouping via `SCRIPT_KINDS`, thousand-separator comma detection; uses `needsTokenSeparator` for token spacing |
| `src/mathjax/serialized-typst/handlers.ts` | **New.** 20+ MathML node-type handlers for Typst serialization; handlers for `mtable`/frame and `menclose`/box set separate `typst_inline` without block wrappers |
| `src/mathjax/serialized-typst/typst-symbol-map.ts` | **New.** Unicode → Typst symbol mapping (~300 entries), accent map, font map |
| `src/mathjax/serialized-typst/common.ts` | **New.** `ITypstData` interface with optional `typst_inline`; `initTypstData`, `addToTypstData` (always propagates `typst_inline` with `typst` fallback), `addSpaceToTypstData`, `needsParens`, `isThousandSepComma`, `needsTokenSeparator` |
| `src/mathjax/serialized-typst/node-utils.ts` | **New.** Tree position utilities |
| `src/mathjax/mathjax.ts` | Patched `AbstractTags` (`autoTag`, `getTag`, `startEquation`) to mark auto-numbered tags with `data-tag-auto` property and preserve `\label{}` keys as `data-label-key` |
| `src/mathjax/index.ts` | `toTypstData()` calls `markUnpairedBrackets(node)` before `visitTree()` to mark unpaired ASCII brackets; returns `{ typstmath, typstmath_inline }` from the visitor's `ITypstData`; `OuterData()` and `OuterHTML()` populate both fields; `OuterHTML()` emits `<typstmath>` and `<typstmath_inline>` hidden tags; `TexConvertToTypstData()` is the sole public API for Typst (resets MathJax tag state before each conversion); `normalizeTypstSpaces` preserves line-leading indentation (`/(\S) {2,}/g`) |
| `src/mathpix-markdown-model/index.ts` | Added `include_typst?: boolean` to `TOutputMath`; `typstmath_inline?: string` to `IOuterData` |
| `src/contex-menu/menu/consts.ts` | Added `'typst'` and `'typst_inline'` to `mathExportTypes`; added both to `eMathType` enum |
| `src/contex-menu/menu/menu-item.ts` | `case eMathType.typst:` → `'Typst'`; `case eMathType.typst_inline:` → `'Typst (inline)'` |
| `src/contex-menu/menu/menu-items.ts` | Skips `typst_inline` menu item when its value equals `typst` |
| `src/helpers/parse-mmd-element.ts` | Added `'TYPSTMATH'` → `'typst'` and `'TYPSTMATH_INLINE'` → `'typst_inline'` to DOM tag parser |
| `tests/_typst.js` | **New.** Mocha test runner — uses `TexConvertToTypstData`, tests both `typstmath` and `typstmath_inline` in a single loop |
| `tests/_data/_typst/data.js` | **New.** Test cases covering all supported constructs; each entry has `latex`, `typst`, and `typst_inline` fields |

## Constraints

- All existing conversion formats (MathML, AsciiMath, LaTeX, SVG) must remain unchanged
- All existing tests must continue to pass
- Typst output is only generated when `include_typst: true` is set — zero overhead when disabled
- The visitor is read-only over the MathML tree — the only mutation is `markUnpairedBrackets()` setting `node.properties['data-unpaired-bracket']` before traversal, which is inert for other serializers (ASCII, MathML) since they never read it
- MathJax tag state (`parseOptions.tags`) must be reset before each `TexConvertToTypstData` call to prevent "Label multiply defined" errors across repeated conversions

## Testing

Test cases in `tests/_data/_typst/data.js` organized by category. Each test entry has three fields:
- `latex` — input LaTeX math
- `typst` — expected block Typst output (`typstmath`)
- `typst_inline` — expected inline Typst output (`typstmath_inline`)

The test runner (`tests/_typst.js`) uses `TexConvertToTypstData` and validates both outputs in a single test per entry.

**Categories:**
- Basic operations (fractions, scripts, roots)
- Greek letters
- Accents (shorthand and generic forms)
- Font commands (mathbb, mathcal, mathfrak, mathbf, mathrm, mathit, boldsymbol, textit, textbf)
- Named functions and operatorname
- Binary/relational/set operators
- Arrows and harpoons
- Large operators and integrals (with limits placement)
- Delimiters (lr, norm, floor, ceil, big variants)
- Matrices with various delimiters and augment lines
- Cases and numcases environments
- Equation arrays with tags
- Combined/nested expressions
- Phantom variants (phantom, hphantom, vphantom)
- Substack
- Mod variants (bmod, pmod)
- Labels on equations (equation, align, gather, split, tag+label, numcases with labels)
- mhchem (chemical formulas — phantom alignment stripping, isotope notation)
- Edge cases (empty-base scripts, empty-exponent scripts, cancel, color, boxed, primes, pipe grouping)

**Commands:**
```bash
npm run build          # TypeScript compilation + webpack (no errors)
npx mocha tests/*.js   # All tests pass (Typst + existing)
```

## Risk / Rollback

**Risk**: Low
- All new Typst code is isolated in `src/mathjax/serialized-typst/` — no changes to existing conversion logic
- Typst conversion is opt-in via `include_typst: true` — disabled by default
- Context menu changes are additive (new enum values, new cases in switch); `typst_inline` entry is automatically hidden when it equals `typst`
- DOM parser change adds two tag names (`TYPSTMATH`, `TYPSTMATH_INLINE`) to an existing array
- `AbstractTags` patch in `mathjax.ts` only adds `data-tag-auto` and `data-label-key` properties to tag nodes — does not alter existing tag behavior or MathML output
- `tags.reset()` in `TexConvertToTypstData` uses optional chaining — safe before first `convert()` call

**Rollback**: Revert PR or pin to previous version
