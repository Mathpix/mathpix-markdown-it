# PR: Fix line-break handling for nested tabular placeholders with lists

Status: Active
Owner: @OlgaRedozubova
Issue: #17912

---

## Context

After adding support for lists inside tabular cells (#17328), a regression was discovered: when a table cell contains content (like a list or text) followed by a nested tabular that itself contains list environments, the rendering would break. The block parsing mode was not properly propagated from nested sub-tabulars to their parent cells.

When parsing a tabular cell, nested tabulars are first replaced with UUID placeholders.
At this stage, child tabulars containing list environments have not yet been expanded.
Because the parent cell did not yet know that its child placeholders would expand to
block-level content, the line break before the nested tabular was trimmed.

**Impact:**
- Cells with content followed by nested tabular placeholders rendered incorrectly
- Line breaks before nested tabulars expanding to lists were removed
- Tabular environments following such placeholders were not rendered

## Goal

- Fix rendering for cells that contain content before a nested tabular with lists
- Propagate block detection status from child sub-tabulars to parent cells
- Ensure consistent block parsing for all cells containing lists at any nesting level

## Non-Goals

- Changing the general list-in-tabular rendering behavior
- Modifying the block detection logic for non-nested cases
- API or interface changes

## Example

### Input LaTeX

```latex
\begin{tabular}{|l|}
\hline
\begin{itemize}
\item[] - First item
\end{itemize} \\
Text
\begin{tabular}{|l|}
\hline \begin{tabular}{l}
\begin{itemize}
\item[] - Item in sub table 1
\end{itemize}
\end{tabular} \\
\hline \begin{tabular}{l}
\begin{itemize}
\item[] - Item in sub table 2
\end{itemize}
\end{tabular} \\
\hline
\end{tabular}
\begin{tabular}{|l|l|}
\hline cell & \begin{itemize}
\item[] - Item in sub table 3
\end{itemize} \\
\hline
\end{tabular} \\
\hline
\end{tabular}
```

### Before (broken)

- **HTML**: Subtable 3 was not rendered

### After (fixed)

- All nested tabulars render correctly
- Lists inside deeply nested tabulars are properly detected and rendered
- Block parsing is triggered for all cells containing lists at any depth

## Why This Approach

### Why track block status in sub-tabulars?

When a cell is parsed, nested tabulars are replaced with UUID placeholders (e.g., `<<uuid>>`). The block detection was only checking the parent cell's direct content—it would see `Text <<uuid>>` and not detect any list environment, even though the nested tabular (behind the placeholder) contained lists.

Because block status was not known at placeholder time, the parent cell was treated as inline content. This caused whitespace and line breaks around placeholders to be trimmed before child tabulars were expanded.

### Why propagate from children to parents?

By storing an `isBlock` flag on each sub-tabular and propagating it upward when a parent references a child placeholder, we ensure that block parsing is triggered correctly regardless of nesting depth.

## Approach

1. **Track block status in sub-tabulars** — Add `isBlock` and `children` fields to the `TSubTabular` type to track whether a sub-tabular contains block-level content.

2. **Propagate block status** — When pushing a new sub-tabular, check if any of its child sub-tabulars have `isBlock: true`. If so, mark the parent as `isBlock: true` as well.

3. **Centralize detection** — Extract the block detection logic into a reusable `detectLocalBlock()` function in `common.ts`.

4. **Use propagated status** — In `getSubTabular()`, check the stored `isBlock` flag instead of re-testing the content string.

## Bug Fixes Included

- Fixed removal of line breaks before nested tabular placeholders that expand to lists
- Prevented subsequent tabular environments from being dropped due to placeholder trimming
- Ensured block context is propagated before placeholder expansion

## Constraints

- List rendering outside tabular must remain unchanged
- Existing tabular tests must pass
- Parent PR (#17328) functionality must not regress

## Testing

**New test coverage:**
- Complex nested tabular with list, text, and multiple nested sub-tabulars containing lists
- Deeply nested tabulars with itemize environments

**Commands:**
```bash
npm test
npm run build
```

## Risk / Rollback

**Risk**: Low
- Minimal code changes focused on propagating existing block status
- No changes to parsing logic, only to block detection

**Rollback**: Revert PR or pin to version 2.0.32

## Related

- Issue: #17912 — [mmd] Rendering breaks when a cell starts with text before a nested tabular with lists
