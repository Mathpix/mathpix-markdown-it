# PR: Fix stuck render on malformed `\end{table>}` close tag

Status: Implemented
Owner: @OlgaRedozubova

---

## Context

When a `\begin{table}` environment has a malformed closing tag (`\end{table>}` with `>` instead of `}`), the renderer hangs indefinitely. Two separate bugs combine to cause this:

1. **`BeginTable` consumes content across two tables.** The block rule scans forward looking for `\end{table}`. The malformed `\end{table>}` never matches, so the scan continues until it finds a *second* table's valid `\end{table}`. Everything between the first `\begin{table}` and the second `\end{table}` is consumed as a single massive content blob — including markdown text, `\begin{itemize}`, `\begin{enumerate}`, and the second `\begin{table}`.

2. **`latexListEnvInline` returns `true` in silent mode without advancing `state.pos`.** When the massive content is processed by the inline tokenizer, any rule that calls `state.md.inline.skipToken()` in a loop (subscript `~`, emphasis `**`, etc.) encounters a `\begin{itemize}` position. `skipToken` calls `latexListEnvInline` in silent mode, which returns `true` without advancing `state.pos`. This result is cached as `cache[pos] = pos` (self-referencing). Every subsequent `skipToken` call at this position returns the cached no-op. The calling while-loop never makes progress — infinite loop.

**Impact:**
- Any document with a malformed `\end{table>}` followed by a second valid table causes the renderer to hang permanently
- The browser tab becomes unresponsive

## Goal

- Prevent `BeginTable` from consuming content across multiple table environments
- Fix `latexListEnvInline` silent mode to correctly advance `state.pos` so `skipToken` works properly
- Ensure malformed LaTeX degrades gracefully instead of hanging

## Non-Goals

- Recovering or rendering malformed `\end{table>}` as a valid table
- Changing the rendering of well-formed table/figure environments
- API or interface changes

## Example

### Input MMD (malformed)

```latex
\begin{table}
\begin{tabular}{|l|c|}
\hline
\textbf{Header} & \textbf{Value} \\
\hline
Row 1 & Data 1 \\
\hline
\end{tabular}
\caption{First table}
\end{table>

Some markdown text with **bold** and lists:

\begin{itemize}
\item Item A
\item Item B
\end{itemize}

\begin{table}
\begin{tabular}{|l|c|}
\hline
\textbf{Header} & \textbf{Value} \\
\hline
Row 2 & Data 2 \\
\hline
\end{tabular}
\caption{Second table}
\end{table}
```

### Before (broken)

- **Renderer hangs indefinitely** — browser tab becomes unresponsive

### After (fixed)

- First table's `\begin{table}` is not matched (malformed close tag) and rendered as plain text
- Markdown content between the tables renders normally
- Second table renders correctly as a proper table

## Approach

### Fix 1: Guard against cross-table consumption in `BeginTable` (`begin-table.ts`)

In the for-loop that scans for `\end{table}`, add a check: if a new `\begin{table}` (or `\begin{figure}`) of the same environment type is encountered before finding the close tag, break out of the loop. Table/figure float environments cannot be nested in LaTeX, so a second `\begin{table}` always means the first was never properly closed.

```typescript
// After the closeTag check in the scanning loop:
const matchNewBegin = lineText.match(RE_BEGIN_TABLE_OR_FIGURE_WITH_PLACEMENT)
  || lineText.match(RE_BEGIN_FIGURE_OR_TABLE_ENV);
if (matchNewBegin && matchNewBegin[1]?.trim() === type) {
  break; // isCloseTagExist remains false → returns false
}
```

`isCloseTagExist` remains `false`, so `BeginTable` returns `false` for the first table. The block tokenizer treats the `\begin{table}` line as a paragraph, and the second table is processed normally by a fresh `BeginTable` call.

### Fix 2: Advance `state.pos` in silent mode in `latexListEnvInline` (`latex-list-env-inline.ts`)

The `latexListEnvInline` rule already computes `env.end` (the position after `\end{itemize}`) before the silent check. Set `state.pos = env.end` before returning `true` in silent mode, so `skipToken` caches the correct advancement.

```typescript
if (silent) {
  state.pos = env.end;  // advance past the matched environment
  return true;
}
```

This ensures any rule calling `skipToken` (subscript, emphasis, etc.) correctly skips over complete list environments instead of getting stuck.

## Why This Approach

### Why break on a new `\begin{table}` instead of limiting scan distance?

LaTeX table/figure float environments cannot be nested. A second `\begin{table}` before `\end{table}` is always an error in the input. Breaking early is both correct and simple — no heuristics or arbitrary limits needed.

### Why fix both bugs instead of just one?

Fix 1 (begin-table.ts) prevents the massive content from being created, which avoids the hang. Fix 2 (latex-list-env-inline.ts) fixes a standalone bug where `skipToken` hangs on any `\begin{itemize}` regardless of context. Either fix alone prevents this specific hang, but both are needed:
- Fix 1 without Fix 2: a `\begin{itemize}` inside any large inline token (from other code paths) could still hang `skipToken`
- Fix 2 without Fix 1: the first table would consume the second table's content, producing wrong output even though it wouldn't hang

## Files Changed

| File | Change |
|------|--------|
| `src/markdown/md-block-rule/begin-table.ts` | Add guard to break scanning loop when a new `\begin{table/figure}` of the same type is encountered |
| `src/markdown/md-latex-lists-env/latex-list-env-inline.ts` | Advance `state.pos` in silent mode before returning `true` |

## Constraints

- Existing table and figure rendering must remain unchanged
- Well-formed `\begin{itemize}...\end{itemize}` inline processing must not regress
- All existing tests must pass

## Testing

**Manual testing:**
- Verify the example MMD above renders without hanging
- Verify well-formed tables with `\begin{itemize}` inside render correctly
- Verify nested table/figure environments still work

**Commands:**
```bash
npm run build
npm test
```

## Risk / Rollback

**Risk**: Low
- Fix 1: Only adds an early-exit guard to an existing scanning loop; well-formed input never hits this code path
- Fix 2: One-line change that aligns silent-mode behavior with the non-silent code path

**Rollback**: Revert PR or pin to previous version
