# PR: Delegate image rendering in table cells when `forMD` is set

Status: Active
Owner: @OlgaRedozubova

---

## Context

`renderTableCellContent()` hardcodes `![alt](src)` markdown for `image` and `includegraphics` tokens, bypassing any custom render rules the caller has registered on the markdown-it renderer. The function already calls `slf.renderInline([child])` for every child token and stores the result in `rendered`, but for images this result is discarded.

This means callers that register custom image render rules (e.g., to resolve CDN URLs to local paths, apply sizing, or add custom formatting) have no way to control how images inside table cells are rendered in the markdown output.

## Goal

When `options.forMD` is true, `renderTableCellContent` should use the renderer's output for `image`/`includegraphics` tokens instead of hardcoding `![alt](src)`. This allows callers (like mmd-converter) to resolve image paths, apply custom formatting, and handle pipe escaping through their own render rules.

## Non-Goals

- Changing HTML, TSV, CSV, or DOCX/PPTX rendering of table images
- Changing behavior when `forMD` is not set (default path is unchanged)
- Adding image resolution logic to mathpix-markdown-it itself (that stays in mmd-converter)

## Current Behavior

In `renderTableCellContent()`, every child token is rendered via `slf.renderInline([child])` and the result is stored in `rendered`. However, for `image`/`includegraphics` tokens, the `mdCell` output ignores `rendered` and constructs markdown manually:

```typescript
case 'image':
case 'includegraphics': {
  const src = child.attrGet('src');
  mdCell += `![${child.attrGet('alt')}](${src})`.replace(/\|/g, '\\|');
  continue;
}
```

Custom render rules registered on the renderer instance are never used for table cell markdown.

## Desired Behavior

When `options.forMD` is true:

1. Set `child.meta.isTableCell = true` before calling `slf.renderInline([child])` — this lets render rules know the token is inside a table cell (e.g., to escape pipe characters in alt text).

2. For `image`/`includegraphics` tokens, use the `rendered` output (from `slf.renderInline`) instead of hardcoded markdown:

```typescript
case 'image':
case 'includegraphics': {
  const src = child.attrGet('src');
  tsvCell += src;
  csvCell += src;
  mdCell += options?.forMD
    ? rendered
    : `![${child.attrGet('alt') ?? ''}](${src})`.replace(/\|/g, '\\|');
  continue;
}
```

When `forMD` is false/undefined, behavior is identical to before.

## Files Changed

| File | Change |
|------|--------|
| `src/markdown/common/render-table-cell-content.ts` | Add `isTableCell` meta tagging when `forMD` is set; use `rendered` for image tokens when `forMD` is set |
| `tests/_data/_table-markdown/_data.js` | Add test case (id: 50) for `\includegraphics` inside tabular |

## Why This Approach

### Why use the existing `rendered` variable instead of a new code path?

`renderTableCellContent` already calls `slf.renderInline([child])` for every child token and stores the result in `rendered`. For most token types, `rendered` is used for the `content` (HTML) output. For images, it was being discarded in favor of hardcoded markdown. Using `rendered` for `mdCell` when `forMD` is set is the minimal change — no new rendering logic, just using what's already computed.

### Why gate on `forMD` instead of always delegating?

The default (`forMD: false`) path produces standard `![alt](src)` markdown that works for all existing consumers (HTML rendering, DOCX, PPTX). Changing the default would risk regressions in those paths. `forMD` is only set by mmd-converter's markdown export pipeline, which is exactly where custom render rules need to participate.

### Why set `isTableCell` on token meta?

Render rules need to know when a token is inside a table cell so they can escape pipe characters (`|` → `\|`) in alt text. Without this, a pipe in alt text would break the markdown table structure. The meta flag is a clean way to communicate this without adding parameters to the render rule signature.

## Constraints

- Default behavior (when `forMD` is not set) must not change
- TSV and CSV output must not change (they still use raw `src`)
- HTML output (`content`) must not change (it already uses `rendered`)
- DOCX/PPTX output (`tableSmoothed`) must not change
- All existing tests must pass

## Testing

New test case (id: 50) in `_table-markdown/_data.js`:

```javascript
{
  id: 50,
  latex: '\\begin{tabular}{|l|l|}\\n\\hline\\n\\textbf{Case} & \\textbf{Image} \\\\\\n\\hline\\n' +
    'LaTeX image without options (should be resolved) &\\n' +
    '\\includegraphics{https://mathpix-ocr-examples.s3.amazonaws.com/cases_printed_1.jpg}\\\\\\n' +
    '\\hline\\n\\end{tabular}',
  table_markdown: '| **Case** | **Image** |\\n| :--- | :--- |\\n' +
    '| LaTeX image without options (should be resolved) | ' +
    '![](https://mathpix-ocr-examples.s3.amazonaws.com/cases_printed_1.jpg) |'
}
```

Note: this test verifies the default (non-`forMD`) behavior produces standard markdown. The `forMD` rendering is tested in mmd-converter's `06-tabular-with-images` test case, which exercises the full pipeline with `renderImageRule` and `renderIncludeGraphics`.

```bash
npm run build
npm test
```

## Risk / Rollback

**Risk**: Low
- Gated behind `forMD` option — only mmd-converter's markdown export path is affected
- Default rendering path is unchanged
- Two-line change in the source file

**Rollback**: Revert PR or pin to previous version

## Related

- Issue: [#18320](https://github.com/Mathpix/monorepo/pull/18320)
