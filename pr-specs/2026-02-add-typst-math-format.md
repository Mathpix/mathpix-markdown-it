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
- API or interface changes beyond adding `include_typst` to `TOutputMath`

## Architecture

### Conversion pipeline

```
LaTeX string
  → MathJax TeX input jax
  → Internal MathML tree (MmlNode)
  → SerializedTypstVisitor (new)
  → Typst math string
```

The visitor walks the same MathML tree that the existing `SerializedAsciiVisitor` uses. It is invoked when `include_typst: true` is set in `outMath` options.

### Module structure

All new Typst code lives in `src/mathjax/serialized-typst/`:

| File | Purpose |
|------|---------|
| `index.ts` | `SerializedTypstVisitor` class — extends MathJax's `MmlVisitor`, handles root traversal, inferred mrow spacing, big delimiter detection (`\big`, `\Big`, etc.), and `\|...\|` pipe-pair grouping |
| `handlers.ts` | Node-type handlers — one function per MathML element (`mi`, `mo`, `mn`, `mfrac`, `msup`, `msub`, `msubsup`, `msqrt`, `mroot`, `mover`, `munder`, `munderover`, `mmultiscripts`, `mrow`, `mtable`, `mtext`, `mspace`, `mpadded`, `mstyle`, `mphantom`, `menclose`) |
| `typst-symbol-map.ts` | Unicode → Typst symbol name mapping tables (Greek, binary operators, relations, arrows, delimiters, large operators, misc) plus accent map and font map |
| `common.ts` | `ITypstData` interface, `initTypstData`, `addToTypstData`, `needsParens` helpers |
| `node-utils.ts` | `isFirstChild` / `isLastChild` tree-position utilities |

### Integration points

| File | Change |
|------|--------|
| `src/mathjax/index.ts` | `OuterData()` calls `toTypstML()` when `include_typst` is set; `OuterHTML()` emits `<typstmath>` hidden tag; `TexConvertToTypst()` public API method (already existed) |
| `src/mathpix-markdown-model/index.ts` | `include_typst?: boolean` added to `TOutputMath` type |
| `src/contex-menu/menu/consts.ts` | `'typst'` added to `mathExportTypes`; `typst = 'typst'` added to `eMathType` enum |
| `src/contex-menu/menu/menu-item.ts` | `case eMathType.typst:` added with title `'Copy Typst'` |
| `src/helpers/parse-mmd-element.ts` | `'TYPSTMATH'` recognized in DOM parser; mapped to type `'typst'` |

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
| `\|\alpha\|` (without `\left...\right`) | `lr(\| alpha \|)` (pipe-pair detection) |

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
| `\boxed{x=1}` | `#box(stroke: 0.5pt, inset: 3pt, $x = 1$)` |
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

### Pipe-pair detection

LaTeX `|\alpha|` without `\left...\right` produces unpaired `<mo>|</mo>` nodes in MathML. The `visitInferredMrowNode` method detects matched pipe pairs at the top level and wraps them as `lr(| content |)`, ensuring they form a single grouped expression in Typst (important after `/` for correct fraction denominator binding). Pipe pairs inside `TeXAtom` groups (e.g. superscript `{|\alpha|}`) are left as-is since the enclosing script parens already provide grouping.

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
| `src/mathjax/serialized-typst/index.ts` | **New.** `SerializedTypstVisitor` class with root traversal, big-delimiter detection, pipe-pair grouping |
| `src/mathjax/serialized-typst/handlers.ts` | **New.** 20+ MathML node-type handlers for Typst serialization |
| `src/mathjax/serialized-typst/typst-symbol-map.ts` | **New.** Unicode → Typst symbol mapping (~300 entries), accent map, font map |
| `src/mathjax/serialized-typst/common.ts` | **New.** Shared types and helpers (`ITypstData`, `needsParens`) |
| `src/mathjax/serialized-typst/node-utils.ts` | **New.** Tree position utilities |
| `src/mathjax/mathjax.ts` | Patched `AbstractTags` (`autoTag`, `getTag`, `startEquation`) to mark auto-numbered tags with `data-tag-auto` property |
| `src/mathjax/index.ts` | Added `include_typst` to `OuterData` and `OuterHTML`; `<typstmath>` HTML tag; fixed `toTypstML` space-collapse regex to preserve line-leading indentation (`/(\S) {2,}/g` instead of `/ {2,}/g`) |
| `src/mathpix-markdown-model/index.ts` | Added `include_typst?: boolean` to `TOutputMath` |
| `src/contex-menu/menu/consts.ts` | Added `'typst'` to `mathExportTypes` and `eMathType` enum |
| `src/contex-menu/menu/menu-item.ts` | Added `case eMathType.typst:` ("Copy Typst") to context menu |
| `src/helpers/parse-mmd-element.ts` | Added `'TYPSTMATH'` to DOM tag parser |
| `tests/_typst.js` | **New.** Mocha test runner for Typst conversion |
| `tests/_data/_typst/data.js` | **New.** Test cases covering all supported constructs |

## Constraints

- All existing conversion formats (MathML, AsciiMath, LaTeX, SVG) must remain unchanged
- All existing tests must continue to pass
- Typst output is only generated when `include_typst: true` is set — zero overhead when disabled
- The visitor is read-only over the MathML tree — no mutations to shared state

## Testing

Test cases in `tests/_data/_typst/data.js` organized by category:
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
- Context menu changes are additive (new enum value, new case in switch)
- DOM parser change adds one tag name to an existing array
- `AbstractTags` patch in `mathjax.ts` only adds a `data-tag-auto` property to tag nodes — does not alter existing tag behavior or MathML output

**Rollback**: Revert PR or pin to previous version
