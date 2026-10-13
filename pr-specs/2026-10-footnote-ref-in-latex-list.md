# PR: Inline footnote on a LaTeX list line no longer empties the whole render

Status: Draft — proposed fix, needs maintainer review
Owner: @kai-mathpix
Base: master

---

## Context

An inline footnote (`^[…]`) on a LaTeX list line, outside any `\item`, makes `markdownToHTML` return an empty string for the whole document. It throws inside the parser, and `markdownToHTML` catches the error, logs `ERROR=>[markdownToHTML]=>` and returns `''`. Every other part of the document is lost too, not just the list.

Found in OCR output. Regex text such as `regexp_like(name, '^[aeiou]')` inside a list reads as an inline footnote. The bug is present in 2.0.20, 2.0.40, 3.0.0 and 3.0.1, so it is not a 3.x regression.

| Input (`\n` is a newline) | 3.0.1 | With this PR |
|---|---|---|
| `\begin{itemize}\n^[x]\n\end{itemize}` | empty string | list, 1 footnote |
| `Some text\n\begin{itemize}\n^[x]\n\end{itemize}` | empty string | list, 3 footnote entries (see Known Limitations) |
| `\begin{itemize}\n\item a ^[x]\n\end{itemize}` | renders | unchanged |
| `\begin{itemize}\n^[x] and \footnote{y}\n\item b ^[z]\n\end{itemize}` | renders | unchanged |

Stack trace on 3.0.1:

```
TypeError: Cannot read properties of undefined (reading 'list')
    at grab_footnote_ref (md-latex-footnotes/inline-ruler2.js:50)
    at ParserInline.parse (markdown-it/lib/parser_inline.js:169)
    at ListItems (md-latex-lists-env/latex-list-items.js:88)
    at finalizeListItems (md-latex-lists-env/latex-list-items.js:210)
    at processLine (md-latex-lists-env/latex-list-env-block.js:372)
    at ListsInternal (md-latex-lists-env/latex-list-env-block.js:425)
    at Lists (md-latex-lists-env/latex-list-env-block.js:504)
```

## Root cause

- `state.env.mmd_footnotes` is created by `coreInline` (`md-inline-rule/core-inline.ts:133`), which is a core rule and runs after block parsing.
- `ListItems` (`md-latex-lists-env/latex-list-items.ts:91`) runs `state.md.inline.parse(…, state.env, …)` during block parsing, so the inline `ruler2` rules run before `coreInline` has set up `mmd_footnotes`.
- `^[x]` makes markdown-it-footnote emit a `footnote_ref` token. `grab_footnote_ref` (`md-latex-footnotes/inline-ruler2.ts`) then reads `state.env.mmd_footnotes.list` and throws.
- `\footnote{}` does not throw, because `inline-rule.ts` (around line 101) creates `mmd_footnotes` and `list` when they are missing. `grab_footnote_ref` has no such guard. This is also why the last row of the table renders on 3.0.1: the `\footnote{y}` before the second `^[…]` has already created `mmd_footnotes`.

## Proposed fix (this PR)

`grab_footnote_ref` creates `mmd_footnotes = {}` and `mmd_footnotes.list = []` when they are missing, the same guard `inline-rule.ts` uses. It is 7 lines. Wherever `mmd_footnotes` already exists, nothing changes: the last row of the table gives identical output before and after.

The list must start empty. A first attempt copied `{...state.env.footnotes}`, which shares markdown-it-footnote's own `footnotes.list` array. `grab_footnote_ref` then appended each footnote to that same array, and every footnote rendered twice.

## Questions for the maintainer

- **Entries added during block parsing are dropped.** `coreInline` later replaces `mmd_footnotes` with `{...state.env.footnotes}`. Footnote numbering and links render correctly on the inputs above, but I have not traced whether `footnoteId` stays right in every case.
- **Possible alternatives:**
  - create `mmd_footnotes` in a core rule before `block`, and have `coreInline` keep it instead of replacing it;
  - have `ListItems` defer inline parsing to `coreInline`. It may need the children during block parsing, which is why it parses early.
- Whether `^[` in code-like text should be a footnote at all is existing MMD syntax and out of scope.

## Known Limitations

When the list directly follows a paragraph line, with no blank line between them, one footnote renders as 3 entries and only the last one is linked: `Some text\n\begin{itemize}\n^[x]\n\end{itemize}`. The list block rule runs the inline parser more than once on the same text, likely while markdown-it checks whether the list ends the paragraph. markdown-it-footnote registers the footnote again on each run. Before this PR, the same input rendered nothing.

## Done When

- [x] `tests/_footnotes.js`: `\begin{itemize}\n^[x]\n\end{itemize}` renders the list and one footnote. Fails on 3.0.1.
- [x] `npm test` passes (3548).
- [ ] The maintainer chooses this fix or an alternative.
- [ ] Released with a version bump.
