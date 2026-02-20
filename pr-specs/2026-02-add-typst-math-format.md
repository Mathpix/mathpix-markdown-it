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
- Produce idiomatic Typst — use native shorthands (`norm()`, `floor()`, `ceil()`, `RR`, `NN`, prime `'` syntax, `dif`) instead of verbose generic forms where possible

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
| `index.ts` | `SerializedTypstVisitor` class — extends MathJax's `MmlVisitor`, handles root traversal, inferred mrow spacing, big delimiter detection (`\big`, `\Big`, etc.), and bare delimiter-pair grouping (`|...|`, `⌊...⌋`, `⌈...⌉`, `‖...‖`) |
| `handlers.ts` | Node-type handlers — one function per MathML element (`mi`, `mo`, `mn`, `mfrac`, `msup`, `msub`, `msubsup`, `msqrt`, `mroot`, `mover`, `munder`, `munderover`, `mmultiscripts`, `mrow`, `mtable`, `mtext`, `mspace`, `mpadded`, `mstyle`, `mphantom`, `menclose`) |
| `typst-symbol-map.ts` | Unicode → Typst symbol name mapping tables (Greek, binary operators, relations, arrows, delimiters, large operators, misc) plus accent map and font map |
| `common.ts` | `ITypstData` interface, `initTypstData`, `addToTypstData`, `addSpaceToTypstData`, `needsParens` helpers |
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
| `\binom{n}{k}` | `binom(n, k)` | `mfrac` (linethickness=0) |

### Greek letters

Full coverage of lowercase, uppercase, and variant forms. Examples: `\alpha` → `alpha`, `\varepsilon` → `epsilon`, `\vartheta` → `theta.alt`.

### Accents

| LaTeX | Typst | Method |
|-------|-------|--------|
| `\hat{x}` | `hat(x)` | Shorthand accent |
| `\bar{x}` | `macron(x)` | Shorthand accent |
| `\vec{x}` | `arrow(x)` | Shorthand accent |
| `\dddot{x}` | `accent(x, dot.triple)` | Generic `accent()` form |
| `\overleftarrow{AB}` | `accent(A B, arrow.l)` | Generic `accent()` form |
| `\overbrace{x+y}^{n}` | `overbrace(x + y)^n` | Shorthand + limits |

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

### Operators and relations

Spaced binary operators (`+`, `-`, `=`, `<`, `>`), named operators (`\cdot` → `dot.op`, `\times` → `times`), relations (`\leq` → `lt.eq`, `\approx` → `approx`), set operators (`\cup` → `union`, `\in` → `in`), negated forms (`\not\equiv` → `equiv.not`).

### Arrows

Standard arrows (`\rightarrow` → `arrow.r`, `\Leftrightarrow` → `arrow.l.r.double`, `\mapsto` → `arrow.r.bar`), extensible arrows (`\xrightarrow{f}` → `limits(arrow.r)^f`), harpoons (`\rightleftharpoons` → `harpoons.rtlb`).

### Named functions

Built-in Typst math operators (`sin`, `cos`, `tan`, `log`, `lim`, etc.) pass through directly. Custom operators via `\operatorname{name}` → `op("name")`, with `limits: #true` when used with limits placement.

### Delimiters

| LaTeX | Typst |
|-------|-------|
| `\left( x \right)` | `lr(( x ))` |
| `\left\| x \right\|` | `norm(x)` |
| `\left\lfloor x \right\rfloor` | `floor(x)` |
| `\left\lceil x \right\rceil` | `ceil(x)` |
| `\left( x \right.` | `( x` (one-sided) |
| `\big( x \big)` | `lr(size: #1.2em, ( x ))` |
| `\|...\|` (without `\left...\right`) | `lr(\| ... \|)` (pipe-pair detection) |
| `\lfloor x \rfloor` (without `\left...\right`) | `floor(x)` (bare delimiter-pair detection) |
| `\lceil y \rceil` (without `\left...\right`) | `ceil(y)` (bare delimiter-pair detection) |
| `\|x\|` (without `\left...\right`) | `norm(x)` (bare delimiter-pair detection) |

### Matrices and equation arrays

| LaTeX | Typst |
|-------|-------|
| `\begin{pmatrix}` | `mat(delim: "(", ...)` |
| `\begin{bmatrix}` | `mat(delim: "[", ...)` |
| `\begin{vmatrix}` | `mat(delim: "\|", ...)` |
| `\begin{array}{c\|c}` | `mat(delim: #none, augment: #(vline: 1), ...)` |
| `\begin{aligned}` | Row-separated with `\` |
| `\begin{cases}` | `cases(...)` |
| `\begin{numcases}` | `#grid(...)` with `cases(...)` + numbering column |

### Equation tags and numbering

Each numbered equation is emitted as an independent `#math.equation(block: true, numbering: ..., $ ... $)` block. This avoids `#set math.equation(numbering: ...)` which would affect subsequent equations.

**Single equations:**

| LaTeX | Typst |
|-------|-------|
| `\begin{equation} y^2 \end{equation}` (auto) | `#math.equation(block: true, numbering: "(1)", $ y^2 $)` |
| `E = mc^2 \tag{1.2}` (explicit) | `#math.equation(block: true, numbering: n => [(1.2)], $ E = m c^2 $)` |
| `\begin{equation*} S \tag{1} \end{equation*}` | `#math.equation(block: true, numbering: n => [(1)], $ S $)` |

**Multi-row environments** (`align`, `gather`): each row becomes a separate block. Numbered rows use `#math.equation(...)`, unnumbered rows use bare `$ ... $`.

| LaTeX | Typst |
|-------|-------|
| `\begin{align} a &= b \\ c &= d \end{align}` (auto) | `#math.equation(block: true, numbering: "(1)", $ a = b $)` + newline + `#math.equation(block: true, numbering: "(1)", $ c = d $)` |
| `\begin{align} a &= b \tag{A} \\ c &= d \tag{B} \end{align}` | `#math.equation(block: true, numbering: n => [(A)], ...)` per row |
| `\begin{align} a &= b \\ c &= d \nonumber \end{align}` | `#math.equation(...)` + newline + `$ c = d $` |
| `\begin{align*} a &= b \\ &= d \end{align*}` | `a = b \` + newline + ` = d` (no numbering, single block) |
| `\begin{equation} \begin{split} a &= b \\ &= c \end{split} \end{equation}` | `#math.equation(block: true, numbering: "(1)", $ a = b \` newline ` = c $)` (single number) |

**numcases / subnumcases environments:**

The `numcases` and `subnumcases` environments (from LaTeX's `cases` package) produce a cases expression where each row has its own equation number. Typst has no direct equivalent, so the serializer emits a `#grid()` layout with two columns: the cases expression on the left and per-row numbering on the right.

Auto-numbered (`\begin{numcases}{f(x)=} 0 & x < 0 \\ x & x \geq 0 \end{numcases}`):
```typst
#grid(
  columns: (1fr, auto),
  math.equation(block: true, numbering: none, $ f(x) = cases(0 & "x < 0", x & "x ≥ 0") $),
  grid(
    row-gutter: 0.65em,
    context { counter(math.equation).step(); counter(math.equation).display("(1)") },
    context { counter(math.equation).step(); counter(math.equation).display("(1)") },
  ),
)
```

Explicit tags (`\tag{3.12}` in condition text):
```typst
#grid(
  columns: (1fr, auto),
  math.equation(block: true, numbering: none, $ f(x) = cases(0 & "x < 0", x & "x ≥ 0") $),
  grid(
    row-gutter: 0.65em,
    [(3.12)],
    [(3.13)],
  ),
)
```

**Tag detection uses two sources**, depending on where `\tag` appears:

1. **Condition-embedded tags**: When numcases has a `&` separator (`\begin{numcases}{f(x)=} 0 & x < 0 \tag{3.12}`), the `\tag{...}` ends up as literal text in the condition `mtext` node (MathJax does not process it as a tag command). The `extractTagFromConditionCell()` helper walks the condition cell's tree to extract `\tag{...}` patterns from mtext content. Extracted tags are stripped from condition text and used as `[(tag)]` labels.

2. **Label-cell tags**: When numcases has no `&` separator or an empty prefix (`\begin{numcases}{} ... \tag{3.12}`), MathJax processes `\tag` as a real tag and places it in the label `mtd` cell. The serializer checks `data-tag-auto` on the label cell — if `false`, it uses `serializeTagContent()` to extract the tag text and emits `[tagContent]` (the label already includes parentheses from MathJax).

**Empty prefix support**: `isNumcasesTable()` accepts 3+ children per row (not just 4+). With an empty prefix `{}` and no `&` separator, MathML has 3 columns (label + prefix-with-brace + content) instead of 4 (label + prefix + value + condition). The content column iteration (`startCol` to `childNodes.length`) handles both layouts.

**Comma escaping in `cases()` rows**: In Typst, commas inside `cases(...)` are row separators. When cases content contains literal commas (e.g. `x^2 + 1,` or `n = 1, 2, \ldots, N`), they would be misinterpreted as row breaks. The `escapeCasesCommas()` helper replaces top-level commas (at parenthesis depth 0) with `","` — a Typst text string that renders as a visual comma without acting as a separator. Commas inside nested parentheses/brackets (e.g. `f(t_n, x^n)`) are left untouched. This applies to both regular `cases()` (from `\left\{...\begin{array}...\right.`) and numcases environments — every cell is escaped before assembly.

Regular cases with commas (`f(x) = \left\{ \begin{array}{ll} {x^2+1,} & {x>1} \\ {1,} & {x=1} \\ {x+1,} & {x<1} \end{array} \right.`):
```typst
f(x) = cases(x^2 + 1"," & x > 1, 1"," & x = 1, x + 1"," & x < 1)
```

Empty prefix numcases with commas and explicit tags (`\begin{numcases}{} \Delta ... f\left(t_n, x^n\right), n=1,2,\ldots,N \tag{3.12} \\ x^0=x_0 \tag{3.13} \end{numcases}`):
```typst
#grid(
  columns: (1fr, auto),
  math.equation(block: true, numbering: none, $ cases(Delta_q^(alpha) x^n = f lr(( t_n, x^n ))"," n = 1"," 2"," dots"," N, x^0 = x_0) $),
  grid(
    row-gutter: 0.65em,
    [(3.12)],
    [(3.13)],
  ),
)
```

Note: the comma inside `lr(( t_n, x^n ))` is at depth 2 and preserved as-is, while top-level commas like `),"` and `1","` are escaped. The comma between `N` and `x^0` is the actual `cases()` row separator.

**Math inside `\tag`:** Tags can contain inline math, e.g. `\tag{$x\sqrt{5}$ 1.3.1}`. MathJax represents this as a mix of `mtext` and math nodes inside the label `mtd`. The `serializeTagContent` helper walks the label tree and emits `mtext` as plain text and math groups as `$typst$`, producing `n => [($x sqrt(5)$ 1.3.1)]`.

### Large operators and integrals

`\sum` → `sum`, `\prod` → `product`, `\int` → `integral`, `\oint` → `integral.cont`, `\iint` → `integral.double`, etc. Limits placement via `_` and `^` for native operators, `limits()` wrapper for non-native bases.

### Scripts with prescripts

`\sideset{_a^b}{_c^d} \sum` → `attach(sum, tl: b, bl: a, t: d, b: c)` via `mmultiscripts` handler.

### Spacing

| LaTeX | Typst |
|-------|-------|
| `\quad` | `quad` |
| `\,` | `thin` |
| `\;` | `med` |
| `\!` | `negthin` |

### Other constructs

| LaTeX | Typst |
|-------|-------|
| `\cancel{x}` | `cancel(x)` |
| `\bcancel{x}` | `cancel(inverted: #true, x)` |
| `\boxed{x=1}` | `#box(stroke: 0.5pt, inset: 3pt, $x = 1$)` (block) / `x = 1` (inline) |
| `\color{red}{x}` | `#text(fill: red)[x]` |
| `\phantom{x}` | `#hide($x$)` (preserves dimensions) |
| `\hphantom{x}` | `#hide($x$)` (same — Typst hide preserves full box) |
| `\vphantom{x}` | `#hide($x$)` (same — no separate h/v variant in Typst) |
| `\substack{i<n \\ j<m}` | `mat(delim: #none, i < n; j < m)` (via mtable) |
| `a \bmod b` | `a mod b` |
| `a \pmod{b}` | `a quad (mod b)` |
| `\text{if }` | `"if "` |
| `f'(x)` | `f'(x)` (prime shorthand) |

## Spacing and Grouping Logic

Correct Typst output requires careful spacing to prevent token merging and avoid unintended function-call syntax.

### Token separation

Adjacent word-character tokens must be separated by spaces. The visitor inserts spaces when the accumulated output does not end with a separator (`\s`, `(`, `{`, `[`, `,`, `|`) and the next token starts with a word character, dot, or quote.

### Slash escaping

In LaTeX, `a/b` is a literal slash between tokens. In Typst, `/` creates a fraction (equivalent to `\frac`). The `mo` handler escapes `/` as `\/` to preserve the literal-slash semantics of the LaTeX source.

### Operator-paren spacing

Multi-character Typst symbol names (e.g. `lt.eq`, `gt.eq`, `arrow.r`) must have a space before `(` or `[` to prevent Typst from interpreting `lt.eq(x)` as a function call. The `mo` handler detects this by peeking at the next sibling.

### Empty-base scripts

LaTeX allows `^{x}` with no preceding base. The `msup`, `msub`, and `msubsup` handlers detect an empty base and emit `""` as a placeholder, preventing Typst's "unexpected hat" error.

### Auto-numbering vs explicit `\tag`

Typst uses `numbering: "(1)"` for standard sequential numbering, and `numbering: n => [(tag)]` for fixed custom labels. The MathML tree does not distinguish auto-numbered equations (`\begin{equation}`) from explicit `\tag{1}` — both produce identical `mlabeledtr` nodes with `<mtext>(1)</mtext>`.

To solve this, `src/mathjax/mathjax.ts` patches `AbstractTags`:
- `autoTag()` sets a `_isAutoTag` flag after calling the original method
- `getTag()` checks the flag and propagates it as `data-tag-auto: true` in the label `mtd` node's properties
- `startEquation()` resets the flag

The `autoTag()` patch only sets the flag when it actually assigns a tag (i.e. `currentTag.tag` was `null` before the call), so explicit `\tag{...}` inside auto-numbering environments like `align` is correctly detected as explicit.

The serializer checks `labelCell.properties['data-tag-auto']`: if `true` → `numbering: "(1)"`; otherwise → `numbering: n => [(tag)]`. This correctly handles edge cases like `\tag{1}` inside `equation*`, which is explicit despite looking like an auto-number.

### Tag label serialization

Tag labels are serialized by `serializeTagContent()` in `handlers.ts`, which walks the label `mtd` tree and emits each node according to its type:
- `mtext` nodes → plain text (for Typst content mode inside `[...]`)
- `mrow`/`TeXAtom` containing `mtext` children → recurse into children
- Pure math groups (`mrow` without `mtext`) → serialize as Typst math and wrap in `$...$`

This handles mixed tags like `\tag{$x\sqrt{5}$ 1.3.1}` where the MathML label contains interleaved `mtext` and math nodes: `<mtext>(</mtext>`, `<mrow><mi>x</mi><msqrt>...</msqrt></mrow>`, `<mtext> 1.3.1)</mtext>` → `($x sqrt(5)$ 1.3.1)`.

### Bare delimiter-pair detection

LaTeX delimiters without `\left...\right` produce unpaired `<mo>` nodes in MathML. The `visitInferredMrowNode` method detects matched delimiter pairs at the top level using a `BARE_DELIM_PAIRS` map and converts them to idiomatic Typst:

| Opening | Closing | Typst output |
|---------|---------|-------------|
| `\|` | `\|` | `lr(\| content \|)` |
| `\lfloor` (⌊) | `\rfloor` (⌋) | `floor(content)` |
| `\lceil` (⌈) | `\rceil` (⌉) | `ceil(content)` |
| `\\|` (‖) | `\\|` (‖) | `norm(content)` |

This ensures paired delimiters form grouped expressions in Typst (important after `/` for correct fraction denominator binding). For symmetric delimiters (`|`, `‖`), pairs inside `TeXAtom` groups (e.g. superscript `{|\alpha|}`) are left as-is since the enclosing script parens already provide grouping.

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
| `src/mathjax/serialized-typst/index.ts` | **New.** `SerializedTypstVisitor` class with root traversal, big-delimiter detection, bare delimiter-pair grouping (`\|`, `⌊⌋`, `⌈⌉`, `‖`); uses `addSpaceToTypstData` for token separation |
| `src/mathjax/serialized-typst/handlers.ts` | **New.** 20+ MathML node-type handlers for Typst serialization; handlers for `mtable`/frame and `menclose`/box set separate `typst_inline` without block wrappers |
| `src/mathjax/serialized-typst/typst-symbol-map.ts` | **New.** Unicode → Typst symbol mapping (~300 entries), accent map, font map |
| `src/mathjax/serialized-typst/common.ts` | **New.** `ITypstData` interface with optional `typst_inline`; `initTypstData`, `addToTypstData` (always propagates `typst_inline` with `typst` fallback), `addSpaceToTypstData`, `needsParens` |
| `src/mathjax/serialized-typst/node-utils.ts` | **New.** Tree position utilities |
| `src/mathjax/mathjax.ts` | Patched `AbstractTags` (`autoTag`, `getTag`, `startEquation`) to mark auto-numbered tags with `data-tag-auto` property |
| `src/mathjax/index.ts` | `toTypstData()` returns `{ typstmath, typstmath_inline }` from the visitor's `ITypstData`; `OuterData()` and `OuterHTML()` populate both fields; `OuterHTML()` emits `<typstmath>` and `<typstmath_inline>` hidden tags; `TexConvertToTypstData()` is the sole public API for Typst (resets MathJax tag state before each conversion); `normalizeTypstSpaces` preserves line-leading indentation (`/(\S) {2,}/g`) |
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
- The visitor is read-only over the MathML tree — no mutations to shared state
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
- Font commands (mathbb, mathcal, mathfrak, mathbf, mathrm, mathit, boldsymbol)
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
- Edge cases (empty-base scripts, cancel, color, boxed, primes, pipe grouping)

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
- `AbstractTags` patch in `mathjax.ts` only adds a `data-tag-auto` property to tag nodes — does not alter existing tag behavior or MathML output
- `tags.reset()` in `TexConvertToTypstData` uses optional chaining — safe before first `convert()` call

**Rollback**: Revert PR or pin to previous version
