# PR: Render literal `$` in lstlisting mathescape (`\$` → `$`)

Status: Implemented
Owner: @OlgaRedozubova
Base: dev/olga/math-delimiter-mode (builds on #418 — the mathescape-only inline parser)
Related: monorepo `pr-specs/2026-06-lstlisting-dollar-render.md` (cross-repo plan; the LaTeX-converter `literate=` part is a separate monorepo change)

---

## Context

- After #418, `\begin{lstlisting}[mathescape=true]` content is parsed by the math-only inline parser (`parse-math-escape-inline.ts` → `createMathOnlyInlineParser`), where a bare `$ ... $` toggles math and `escape` is replaced by the verbatim-backslash rule.
- An escaped `\$` (a literal dollar in the source) is mishandled: `verbatimBackslash` emits the `\` and leaves the `$` for `simpleMath`, so `\$conf_a\$` renders with a visible backslash and/or opens math instead of showing a literal `$`.

## Goal

- In `[mathescape=true]` listings only: a run of backslashes immediately before `$` drops exactly one backslash and the `$` is a literal dollar (`\$` → `$`, `\\$` → `\$`, `\\\$` → `\\$`); a bare `$` keeps its mathescape math behavior. `\(` / `\[` / `\\(` / `\\[` delimiter handling is unchanged (#418).

## Non-Goals

- Plain `\begin{lstlisting}` / ```` ``` ```` fences — no mathescape, their `$` is already verbatim; untouched.
- LaTeX → PDF `literate={\$}{{\textdollar}}1` — separate change in the monorepo LaTeX converter.
- `& % # { }` un-escape — handled upstream in the OCR styler (monorepo).

## Desired behavior

- mathescape `\$x\$` → `$x$`; `\\$conf_a\\$` → `\$conf_a\$`; `\\\$` → `\\$` (one backslash dropped before `$`); bare `$x$` → math; `\(` / `\\(` / `\[` / `\\[` unchanged (#418); a plain listing is unchanged.

## Implementation

- `src/markdown/md-latex-lstlisting-env/parse-math-escape-inline.ts`, `verbatimBackslash`: peek the maximal run of backslashes; if it is immediately followed by `$`, emit `(N-1)` backslashes + a literal `$` and consume the run + the `$` (so the `$` cannot open math). Every other case keeps the original per-call behavior — `\\` pairing and the `\(` / `\[` / `\\(` / `\\[` strict-mode handling are unchanged.
- Scope is automatic: `verbatimBackslash` runs only inside the math-only parser, which is invoked only when `attributes.mathescape` (`lstlisting-options.ts`). Plain listings never reach it.
- **Copy / downstream consistency:** rendering re-parses the content but `token.content` stays raw (`\$`). So the parse also stores `token.meta.codeText` (`lstlisting-options.ts`) — a math-aware plain-text form from `token.children`: text fragments carry the un-escaped literal, math fragments use `token.inputLatex` (original delimiters and any `\$` inside math preserved; whitespace/newlines kept). The copy-to-clipboard button (`mdHighlightCodePlugin.ts`) and the table-cell markdown rendering (`render-table-cell-content.ts`, which wraps a listing cell in `<pre><code>`) both use `token.meta.codeText ?? token.content`, so copy / table-markdown match the rendered display. A plain listing has no `codeText` and falls back to `content`.

## Testing

- `tests/_lstlisting-mathescape-dollar.js`: `\$x\$` → `$x$`; bare `$x$` → math; mixed `\$a\$ $b$` → literal + math; `\\$` → `\$`; `\\$conf_a\\$` → `\$conf_a\$`; `\\\$` → `\\$`; plain listing `\$x\$` → verbatim (backslash kept); bare `[mathescape]`; `\$\$`; trailing backslash; legacy mode.
- codeText/clipboard: `token.meta.codeText` is set even without `copyToClipboard` (literal un-escaped, math verbatim via `inputLatex`, newlines/indentation preserved; a plain listing has none); both the copy-to-clipboard `value` and a mathescape listing inside a table cell use `codeText`.
- `tests/_math-delimiter-mode.js` / `tests/_lstlisting.js`: must stay green — `\(` / `\[` / `\\(` / `\\[` and plain listings are unchanged.
- Run: `npm run compile && npx mocha tests/_lstlisting-mathescape-dollar.js tests/_lstlisting.js tests/_math-delimiter-mode.js --exit` — all pass, no regression.

## Done When

- A run of backslashes before `$` in a `[mathescape=true]` listing drops one backslash and the `$` is literal (`\$`→`$`, `\\$`→`\$`); a bare `$` still renders as math; `\(`/`\[`/`\\(`/`\\[` and plain listings are untouched.
- `token.meta.codeText` carries the math-aware plain text, and copy-to-clipboard uses it (copy matches the rendered display).
- Tests pass; `_lstlisting.js` / `_math-delimiter-mode.js` show no regression.
