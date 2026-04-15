# PR: [serialized-typst] Typed AST between MathML tree and Typst string output

Status: Implemented
Owner: @OlgaRedozubova

---

## Context

The Typst math serializer (`src/mathjax/serialized-typst/`) walks MathJax's internal MathML tree and produces Typst strings directly inside each handler. Escaping was distributed across 7+ functions called manually in 56 locations. Each handler built strings without knowing the downstream context (lr, cases, mat, script base, etc.), leading to recurring escaping bugs that required point patches.

This PR introduces a typed AST with centralized escaping to eliminate these bug classes at the architectural level.

---

## Goal

1. Introduce a typed intermediate representation (`TypstMathNode`) between MathML tree traversal and Typst string output
2. Migrate all 22 handlers to return AST nodes instead of strings
3. Centralize all escaping in a single serializer with a context registry
4. Maintain 100% output compatibility: all 937 tests pass
5. Eliminate escaping-related bug classes at the architectural level

---

## Non-Goals

- Changing the set of supported LaTeX constructs
- Changing the public API (`ITypstData`, `toTypstData()`, `SerializedTypstVisitor.visitTree()`)
- Changing output format (identical output for identical input, except fixes below)
- Refactoring non-math Typst conversion (that already uses an AST)

---

## What was implemented

### Pipeline

```
MathML tree (MmlNode)
  → markUnpairedBrackets(root) — per-cell bracket pairing for tables
  → SerializedTypstVisitor.visitTree()
     → AST dispatcher (ast/dispatcher.ts) routes by node.kind
     → Handler returns TypstMathResult { node: TypstMathNode, nodeInline?: TypstMathNode }
  → serializeTypstMath(result.node): string
  → ITypstData { typst, typst_inline? }
  → toTypstData() normalization
```

### Node types (16 total)

| Node type | Purpose |
|-----------|---------|
| `Seq` | Ordered sequence of children |
| `Symbol` | Mapped Typst name: alpha, sum, arrow.r, RR |
| `Text` | Quoted string in math: "text" (with preserveBackslash for mtext) |
| `Number` | Numeric literal |
| `Operator` | +, -, =, /, ;, ", , (serializer escapes and spaces) |
| `FuncCall` | frac(), sqrt(), mat(), op(), bold(), #math.equation(), #grid() |
| `Script` | base_sub^sup, attach(base, tl:, bl:, tr:, br:) |
| `Delimited` | lr(), abs(), norm(), floor(), ceil() |
| `Space` | thin, med, thick, quad, wide |
| `Linebreak` | \\\\ in equation arrays |
| `Alignment` | & and &quad column separators |
| `Raw` | Pre-formatted Typst code (1 constant: counter reset method chain) |
| `Placeholder` | Empty base "" |
| `InlineMath` | $body$ for embedding math in code-mode content blocks |
| `Label` | Typst label: \<key\> |
| `MatrixRow` | Row with separately-escapable cells |

### Discriminated union enums

- `TypstMathNodeType` — 16 node types
- `ArgValueType` — 8 argument value types (math, string, bool, ident, length, raw, inlineMath, call)
- `FuncArgKind` — positional / named
- `DelimitedKind` — lr, abs, norm, floor, ceil
- `FuncEscapeContext` — standard, matrix-cell, matrix-row, wrapper, string-arg, lr-content, none

### Opts interfaces

Builder options extracted as named interfaces extending Node interfaces:
`SeqOpts`, `TextOpts`, `RawOpts`, `InlineMathOpts`, `OperatorOpts`, `FuncCallOpts`, `ScriptOpts`

### Escape context registry

| Context | Escaping | Functions |
|---------|----------|-----------|
| Standard | , → \\, ; → \\; : → word : [] → \\[ \\] | frac, binom, bold, italic, bb, cal, frak, sans, mono, upright, display, limits, scripts, stretch, attach, hide |
| MatrixCell | Same but [] → bracket.l/bracket.r | mat, cases |
| Wrapper | Standard + () → "("/")" | cancel, overline, underline, sqrt, root, overbrace, underbrace, accent, hat, tilde, etc. |
| StringArg | \\ → \\\\\\ " → \\" | op |
| LrContent | ; → \\; : → space before : (after any non-space char); delimiter brackets escaped; for non-bracket delimiters (\|, ‖, ⟨) all ASCII brackets () [] {} escaped | lr (via serializeDelimited) |

### AST dispatcher (7 patterns, order matters)

1. **Big delimiters** — before bare: `\bigl(` is TeXAtom(sized mo), not a bare mo. Tracks nesting depth to pair `\Bigg[...\Bigg]` correctly across inner `\bigg(...\bigg)` pairs.
2. **Bare delimiters** — before normal mo: groups `|..|`→`lr()`, `⌈⌉`→`ceil()` for correct subscript attachment. Validates fence balance across ALL bracket types: `()`, `{}`, `[]`, `⟨⟩`, `⌊⌋`, `⌈⌉` (skips brackets marked as unpaired by `markUnpairedBrackets`). `DOUBLE_VERT` rejection rule extracted to `isDoubleVertContentValid` helper.
3. **\idotsint** — `∫⋯∫` with scripts merged into `lr()` with shared scripts
4. **Thousand separators** — before comma becomes operator: `1,000`→`1\,000`
5. **Combining chains** — consecutive non-Latin mi→`text("merged")`. Individual characters with NFD-decomposing combining marks (ṭ, é, ç, ö, č, ά) are separately wrapped in `text()` by `miAst` via `hasCombiningMarks` — prevents Typst "yielded more than one glyph" errors.
6. **Tagged eqnArray** — consumes all remaining siblings (pre/post content)
7. **\not overlay** — wraps next sibling in `cancel()`

### Bracket pairing (`markUnpairedBrackets`)

Per-cell scoping for tables prevents orphaned brackets in Typst output:

- `SCOPE_BOUNDARIES`: msqrt, mroot, mfrac, menclose, mover, munder, mtr, mlabeledtr, mstyle
- `SCRIPT_SCOPE_KINDS`: msub, msup, msubsup (base in parent scope, scripts separate)
- Opening bracket as script base → excluded from parent scope, marked unpaired
- Table cells: `inTableCell` flag → unpaired brackets use symbol names (paren.l, bracket.l, brace.l)
- Non-table: unpaired brackets use escaped forms (\\(, \\[, \\{)

### Delimiter handling

| LaTeX | MathJax | Typst output |
|-------|---------|-------------|
| `\left[...\right]` | mrow{open, close} | `lr([ ... ])` |
| `\left[...\right.` | mrow{open, close=""} | `lr(\[ ...)` (one-sided, escaped) |
| `\langle...\rangle` | bare mo in inferred mrow | `lr(chevron.l ... chevron.r)` (bare delimiter pattern with nesting) |
| `\{...\}` | bare mo({) mo(}) | `\{ ... \}` (paired, escaped for Typst) |
| `\{` unpaired in table | mo({) marked table-open | `brace.l` (symbol name) |
| `[^{\circ} C]` | msup(mo([), ∘) | `[""^(compose) C]` (bracket separated from script) |

### Side-channel node storage

`astNodeStore` (WeakMap in `ast/types.ts`) stores TypstMathNode pre/post-content alongside MathML nodes. Used by visitInferredMrowNode (Pattern 6: tagged eqnArray with sibling content) to pass typed AST to the table handler.

### File structure

```
src/mathjax/serialized-typst/
├── types.ts              ← MathNode, ITypstData, attribute interfaces
├── common.ts             ← Tree utilities (getNodeText, getAttrs, needsTokenSeparator, etc.)
├── consts.ts             ← Constants, regexes, Unicode chars, OPEN/CLOSE_BRACKETS
├── typst-symbol-map.ts   ← Symbol/font/accent mapping database
├── bracket-utils.ts      ← markUnpairedBrackets, scanBracketTokens, findUnpairedIndices
├── escape-utils.ts       ← scanExpression, escapeLrBrackets, escapeContentSeparators
├── inferred-mrow-patterns.ts ← 7 pattern matchers for inferred mrow
├── index.ts              ← SerializedTypstVisitor entry point
└── ast/
    ├── types.ts           ← 16 node types, enums, Opts interfaces, ITypstMathSerializer, astNodeStore
    ├── builders.ts        ← Factory functions for all nodes and arguments
    ├── serialize.ts       ← serializeTypstMath(), escaping, spacing, scripts, delimiters
    ├── serialize-context.ts ← FuncEscapeContext enum, FUNC_ESCAPE_CONTEXTS registry
    ├── dispatcher.ts      ← AST dispatcher with 7 documented patterns
    ├── token-handlers.ts  ← mi, mo, mn, mtext, mspace
    ├── script-handlers.ts ← mfrac, msup, msub, msubsup, msqrt, mroot,
    │                         mover, munder, munderover, mmultiscripts
    ├── structural-handlers.ts ← mrow, mpadded, mphantom, menclose, mstyle
    ├── table-handlers.ts  ← mtable, mtr (218 lines — dispatch only)
    ├── table-builders.ts  ← numcases, eqnArray, matrix builders (410 lines)
    └── table-helpers.ts   ← MathML helpers, tag/label helpers (295 lines)
```

### raw() usage: 56 → 1

The single remaining `raw()` is a static constant: `#counter(math.equation).update(n => n - 1)` — a Typst code-mode method chain that cannot be expressed as FuncCallNode.

---

## Bug fixes in this branch

### Delimiter fixes
- **Bare `\{`/`\}` escaping**: bare braces now produce `\{`/`\}` (paired) or `brace.l`/`brace.r` (unpaired in table cells) instead of raw `{`/`}` which Typst interprets as code blocks
- **Nested chevron pairing**: `\langle...\langle...\rangle...\rangle` now correctly pairs via nesting depth tracking
- **Per-cell bracket scoping**: `mtr`/`mlabeledtr` added to SCOPE_BOUNDARIES — brackets in different table cells cannot pair, preventing orphaned brackets in aligned/eqnarray cross-row output
- **mstyle scope boundary**: prevents hidden `mo(")") ` inside `\Varangle` from breaking outer bracket pairing
- **Opening bracket as script base**: `[^{\circ}` → `[""^(compose)` — separates bracket from superscript to prevent Typst auto-matching error
- **Bare delimiter fence balance (all bracket types)**: `tryBareDelimiterPattern` now validates balance of `()`, `{}`, `[]`, `⟨⟩`, `⌊⌋`, `⌈⌉` independently (previously only `()` and `{}`). Brackets marked as unpaired by `markUnpairedBrackets` are skipped. Prevents bra-ket `|\psi\rangle=...[|\uparrow\downarrow\rangle]` from wrongly pairing the first `|` with a distant `|` across an unmatched `⟩` or `[`.
- **Big delimiter nesting depth**: `tryBigDelimiterPattern` tracks open/close depth so `\Bigg[ \bigg( ... \bigg) \Bigg]` pairs `\Bigg[` with `\Bigg]`, not the nearest `\big)`.

### Typst formatting safety (`needsSeparator` in `serialize.ts`)
Guards against Typst parser ambiguities that previously produced broken output:
- **Space before `[`/`{` after FuncCall/Delimited**: prevents trailing-content-block parsing. `frac(1, 2)[x]` would be parsed as `frac` with body `[x]` — add space: `frac(1, 2) [x]`. Same for `lr(( a + b )) [c]`.
- **Space before `(` after code-mode (`#hash`) FuncCall**: prevents chained-call parsing in code mode. `#box(stroke: ..., $ G $)(s)` would call the box result with `(s)` — add space: `#box(...) (s)`. Math-mode calls like `frac(1, 2)(x)` are left as-is.
- **Space before `(` after any multi-char identifier** (including Typst builtin ops `sin`, `cos`, `sup`, `max`, etc.): prevents function-call parsing that can treat inner `:` as named arg. `\sup(i: Typ1)` → `sup (i: Typ1)` — without space, Typst parses `i:` as named arg and errors. In Typst math, `sin(x)` and `sin (x)` render identically, so the space is always safe. Covers bare identifiers (`sup (x)`), scripted identifiers (`sin^2 (x)`, `log_2 (n)`) and non-builtin names (`emptyset (x)`). Derivative patterns (`f'(x)`) are exempted via `isDerivativeScript`.
- **Space before `:` after any non-space char**: broadened from "word chars only". `H_+:` in `mat()` cells has `+` before `:` — still needs space to prevent named-argument parsing by Typst.

### Boxed/circle/border simplification

**Problem:** `\boxed{}`, `\enclose{circle}`, bordered arrays, `frame=solid` matrices previously emitted `#align(center, box/circle(...))` as the block variant with raw content as the inline variant. This caused:
1. `#align(center, ...)` is block-level — breaks math flow when placed alongside other math (`\boxed{z}^T \boxed{z}`)
2. Subscript/superscript on a block-level atom is ill-defined
3. `typst_inline` dropped the frame entirely

**Fix:**
- `\boxed{}` → `#box(stroke: ..., inset: ..., $ content $)` — inline-safe
- `\enclose{circle}` → `#ellipse(inset: ..., align(center + horizon, $ content $))` — uses `#ellipse()` for visual parity with MathJax (which stretches the circle to content width). `#circle()` would enforce 1:1 aspect ratio producing oversized frames for long content. Neither shape auto-centers content; explicit `align(center + horizon, ...)` is required.
- Bordered arrays and `frame=solid` use `#box()` without `#align()`
- `typst_inline` is identical to `typst` — frame preserved in inline variant since `#box()` / `#ellipse()` are inline-safe
- Always uses `$ content $` (display math) inside the box — inline `$content$` breaks multi-line `&`/`\\` alignment
- No `baseline` parameter — Typst's default layout handles display centering naturally

### Block-level code-mode func guard

`BLOCK_CODE_FUNCS` set in `consts.ts`: `{math.equation, grid}`. Inline code-mode functions (`#box`, `#ellipse`, `#circle`, `#text`, `#highlight`, `#hide`) are safe in any math context and NOT in the set.

`containsBlockCodeFunc` (`dispatcher.ts`) and `hasBlockCodeFunc` (`table-handlers.ts`) detect when block-level funcs appear with siblings and switch to inline variants. Recursion scope: SeqNode children only — does not inspect `FuncCall.args` or `Delimited.body` (sufficient for current emission patterns).

EXTEND the set when adding a new block-level `funcCall(name, ..., { hash: true })` — otherwise guards will miss it and math flow may silently break.

### Code cleanup
- Deduplicated `COMBINING_FONT_MAP` → use `typstFontMap` from single source
- Extracted `table-helpers.ts` and `table-builders.ts` from 949-line `table-handlers.ts`
- Merged `adapt.ts` (11 lines) and `node-store.ts` (9 lines) into `ast/types.ts`
- Removed dead code: `initTypstData`, `addToTypstData`, `ITypstSerializer`, `contentVal`, `intVal`, `floatVal`, `arrayVal`
- Moved `getCustomCmdTypstSymbol` inline into dispatcher
- Added `ArgValueType`, `FuncArgKind` enums for discriminated union consistency
- Extracted `Opts` interfaces (SeqOpts, TextOpts, etc.) from inline types
- Constants moved to top of files across all handler modules
- `escapeContext` typed as `FuncEscapeContext` enum instead of `string`
- Added console.warn in dispatcher catch blocks instead of silent empty results
- Added null-safety checks in isNumcasesTable and isUnaryPrefix

---

## Constraints / Invariants

1. **All 937 tests pass.** Output verified at each step.
2. **Escaping is serializer-only.** No handler calls escape functions directly.
3. **Typed discriminants.** All node type, arg value, and func arg comparisons use const enums.
4. **Public API preserved.** `ITypstData` remains the external interface.
5. **No circular imports.** `astNodeStore` in `ast/types.ts`.

---

## Observability

- All 937 tests verified at each step
- TypeScript strict mode — zero `any` types in AST handlers
- console.warn on handler errors (previously silently swallowed)

---

## Done When

- [x] `ast/types.ts` defines 16 node types with const enum discriminants
- [x] `ast/builders.ts` provides factory functions with Opts interfaces
- [x] `ast/serialize.ts` produces valid Typst with centralized escaping via context registry
- [x] `ast/serialize-context.ts` defines escape contexts with `FuncEscapeContext` enum
- [x] `ast/dispatcher.ts` dispatches directly with 7 documented pattern priorities
- [x] All 22 handlers return TypstMathResult with typed AST nodes
- [x] `markUnpairedBrackets` uses per-cell scoping for tables
- [x] Bare `\{`/`\}` correctly escaped, chevron nesting tracked
- [x] Opening bracket separated from script base
- [x] Dead code removed, files split, types unified
- [x] All 937 tests pass
- [x] `Status` updated to `Implemented`
