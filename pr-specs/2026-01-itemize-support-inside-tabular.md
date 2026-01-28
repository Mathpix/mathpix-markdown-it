# PR: Add itemize/enumerate support inside tabular cells

Status: Implemented
Owner: @OlgaRedozubova
Issue: #17328

---

## Context

LaTeX list environments (`\begin{itemize}` / `\begin{enumerate}`) are block-level constructs. The tabular cell parser in mathpix-markdown-it treated cell content as inline-only, causing list environments inside table cells to be ignored or rendered as plain text.

**Impact:**
- Lists in table cells did not render in HTML
- Export formats (TSV, CSV, Markdown) lost list structure entirely
- Nested tables were sometimes double-processed during export

## Goal

- Render `itemize` and `enumerate` lists correctly inside tabular cells
- Support nested lists with proper marker styles per level
- Preserve custom markers (`\item[X]`) and empty markers (`\item[]`)
- Export list structure to all formats (HTML, Markdown, TSV, CSV)
- Prevent nested tables from being exported as separate top-level elements

## Non-Goals

- Changing list rendering outside tabular context
- Supporting other LaTeX block environments inside cells (e.g., `figure`, `verbatim`)
- API or interface changes

## Example

### Input LaTeX

```latex
\begin{tabular}{l}
\begin{itemize}
\item First item
\item Second item
\end{itemize}
\end{tabular}
```

### Before (broken)

- **HTML**: List content rendered as plain text or dropped
- **Markdown export**: Empty or malformed cell
- **TSV/CSV export**: Missing list content

### After (fixed)

**HTML output** (conceptual):
```html
<table>
  <tr>
    <td>
      <ul class="itemize">
        <li><span class="li_level">•</span>First item</li>
        <li><span class="li_level">•</span>Second item</li>
      </ul>
    </td>
  </tr>
</table>
```

**Markdown export**:
```
| • First item<br>• Second item |
```

**TSV/CSV export**:
```
"• First item
• Second item"
```

### Nested list markers

| Level | Itemize | Enumerate |
|-------|---------|-----------|
| 1 | • | 1. 2. 3. |
| 2 | – | a. b. c. |
| 3 | * | i. ii. iii. |
| 4 | · | A. B. C. |

## Why This Approach

### Why conditional block parsing?

LaTeX lists are block-level constructs that require the block parser to run. Tabular cells normally use inline-only parsing for performance and simplicity. When a list environment is detected in a cell, we switch to block parsing for that cell only.

### Why placeholder + newline injection?

Before parsing a cell, we replace complex nested content (math, sub-tables, code blocks) with UUID placeholders to prevent them from breaking row/column splitting. When re-injecting this content, if it contains block-level LaTeX (like a list), we must ensure it's surrounded by newlines so the block parser recognizes it correctly.

### Why nested table filtering?

When exporting via `parseMarkdownByElement()`, nested `.table_tabular` elements were being collected alongside their parents, causing duplicate processing. We now filter out any table that has a `.table_tabular` ancestor.

## Approach

1. **Detect list environments in cells** — scan cell content for `\begin{itemize}` or `\begin{enumerate}`
2. **Switch to block parsing** — if detected, parse the cell with block rules enabled
3. **Placeholder safety** — inject newlines around block content placeholders before parsing
4. **Render lists** — produce proper `<ul>`/`<ol>` HTML with level-appropriate markers
5. **Export handling** — format list items with `<br>` (Markdown) or `\n` (TSV/CSV) separators
6. **Filter nested tables** — exclude nested `.table_tabular` from top-level export collection

## Bug Fixes Included

- `<br>` escaping when preceding text ends with backslash
- Underline/strikeout formatting inside tabular cells
- Nested tabular appearing on same line as list content
- Custom enumerate markers (e.g., `\textbf{1.}`) now preserved
- Removed problematic `text-indent` CSS for empty markers

## Constraints

- List rendering outside tabular must remain unchanged
- Existing tabular tests must pass
- Placeholder mechanism must not break table structure
- Custom markers must be preserved exactly

## Testing

**New test coverage:**
- Lists inside tabular cells (itemize, enumerate, nested)
- Custom and empty markers
- Export format validation (TSV, CSV, Markdown)
- Nested tabular with lists

**Commands:**
```bash
npm test
npm run build
```

## Risk / Rollback

**Risk**: Medium
- Modifies cell parsing and placeholder handling
- May affect edge cases in complex nested tables

**Rollback**: Revert PR or pin to version 2.0.31

## Related

- Issue: #17328 — [mmd][mmd-converter] Add itemize support inside tabular
