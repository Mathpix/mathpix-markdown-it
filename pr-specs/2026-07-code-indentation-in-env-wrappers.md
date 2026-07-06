# PR: Preserve code indentation inside LaTeX env wrappers (lists, `\begin{table}`/`\begin{figure}`, align envs)

Status: Implemented
Owner: @OlgaRedozubova
Base: master
Version: 3.0.1

---

## Context

- Verbatim code inside a LaTeX environment loses the leading whitespace of its lines when rendered, so indented code collapses flush-left. Two wrapper families have this bug:
  1. **List envs** (`\begin{itemize}`/`\begin{enumerate}`): a fenced code block (```` ``` ```` or `~~~`) loses indentation. `\begin{lstlisting}` in the same list is fine.
  2. **Table/align wrappers** — the float wrappers `\begin{table}`/`\begin{figure}` (`begin-table.ts`) and the align wrappers `\begin{center}`/`\begin{left}`/`\begin{right}` (`begin-align.ts`): a `\begin{lstlisting}` inside the wrapped `tabular` loses indentation, even though the same `lstlisting` in a bare `tabular` (no wrapper) is fine.
- Same root cause in all: the env's line loop reads each line **de-indented** — `state.src.slice(state.bMarks[n] + state.tShift[n], …)` — because its own command detection (`\item`, `\caption`, `\end`, close-tag) is `^`-anchored and needs leading spaces stripped. Content that must stay verbatim (a fence, an inner `lstlisting`) is de-indented along with everything else.
- Reference wrappers that already do it right: the standalone `tabular` block rule and the list-env "opaque" handling both re-read the **raw** line (`state.bMarks[n]`, no `tShift`) for content they must preserve.
- Reported from real OCR output — code in a list item and in a table lost its indentation.

## Goal

- Code keeps its indentation in both wrappers: fences inside list envs, and `lstlisting`/fences inside `\begin{table}`/`\begin{figure}`. Matches a standalone fence / a bare `tabular`.

## Non-Goals

- Standalone (non-wrapped) fences and bare `tabular` — already correct, untouched.
- **Bare ```` ``` ````/`~~~` fence in a `tabular` CELL** — out of scope, see Known Limitations.
- The OCR side (`text_formatter`) — renderer-only fix.
- Rendering `$…$` math inside a fence — a fence is verbatim; `lstlisting[mathescape]` is for math.

## Current Behavior

- **Lists:** a fence inside `\item` renders its code flush-left (leading spaces lost); a `~~~` fence is additionally inline-parsed instead of rendered as a block.
- **`\begin{table}`/`\begin{figure}`:** a `lstlisting` inside the wrapped `tabular` renders flush-left — the float wrapper de-indents every line before the `tabular` parser sees it, so the indentation is already gone by the time `lstlisting` is collected.

## Desired Behavior

- Fence content inside a list is verbatim (indentation, blank lines, `~~~` all preserved); `~~~` renders as a code block.
- `lstlisting`/fence inside `\begin{table}`/`\begin{figure}` keeps its indentation, identical to the same content in a bare `tabular`.
- No marker collisions: a ```` ``` ```` inside `lstlisting`/`tabular` stays that env's content; `\begin{lstlisting}`, `\item`, `\end{…}` inside a fence stay literal code.
- An unclosed fence is treated as ordinary content, so the list still renders (items intact) — it never swallows the rest of the list. No crash/loop.

## Implementation

- **Lists** (`md-latex-lists-env/latex-list-env-block.ts`): a fence is treated as an opaque region like `lstlisting`, but committed only if it closes. In the main loop, only when `opaqueStack` is empty, `detectFenceOpen(rawLine)` opens a fence; its lines are **buffered** (not committed) until `isFenceClose(rawLine, fence)` — then the buffer is flushed **raw** (`state.bMarks[n]..state.eMarks[n]`, indentation kept) via `ItemsAddToPrev`. If the fence never closes, the buffer is **replayed through the normal line path** (so the ``` is ordinary content and any `\item`/`\end` inside is handled normally, keeping the list intact). This is a **single pass** (each line is visited once; no lookahead) — the normal per-line logic is factored into one `processLine` closure used by both the loop and the replay. `latex-list-items.ts`: the block-content check is extended so a `~~~` fence is block-parsed. Fence detection is char-code based, mirroring `md-block-rule/mmd-fence.ts` — no new regex.
- **Table/align wrappers** (`begin-table.ts`, `begin-align.ts`): the collection loops still compute the de-indented `lineText` for detection (caption / `\end` / close-tag), but delegate accumulation to a shared helper `appendEnvAwareContentLine` (`md-block-rule/helper.ts`). The helper tracks lstlisting nesting (`envDepth`, same name as the standalone `tabular` rule) and stores a line **raw** (indentation kept) only while inside a `lstlisting`; normal content stays de-indented exactly as before, so multi-line cells are unchanged. `lstlisting` may open/close **mid-line** (`C &\begin{lstlisting}`), so the helper detects it with `indexOf`, not the `^`-anchored `BEGIN_LST_RE`. The standalone `tabular` block rule already preserves indentation (it accumulates raw unconditionally) and keeps its own loop.

## Constraints / Invariants

- No new regex — list fence detection is char-code (mirrors `mmd-fence.ts`); the wrapper helper uses `indexOf`.
- Detection still runs on the de-indented line, so `\item`/`\caption`/`\end`/close-tag matching is unchanged; only lines **inside a lstlisting** are stored raw — normal wrapper content stays de-indented, so no wrapped-tabular output changes.
- List fence handling runs only outside `lstlisting`/`tabular` (`opaqueStack.length === 0`) — no marker collisions.
- Single pass: fence lines are buffered, then either flushed raw (closed) or replayed as content (unclosed); no forward lookahead, no O(n²) scan.
- An unclosed fence never swallows the list — its lines are replayed as ordinary content, matching pre-fence behavior.
- Standalone fences, bare `tabular`, and non-code content are byte-identical to before.

## Known Limitations

- A bare ```` ``` ````/`~~~` fence written **directly in a `tabular` cell** (not wrapped in `lstlisting`) still renders as inline `<code>` (newlines collapsed), unchanged from before. The cell's code placeholder is already stored with indentation intact, so the fix is render-side only; but the block path used elsewhere is unusable here — `parseBlockIntoTokenChildren({disableBlockRules})` escapes the leading fence marker and disables the fence rule, producing a broken empty `<pre>`. A correct fix needs a dedicated inline fence rule (mirroring the `lstlisting`-in-cell inline rule). Deferred to a follow-up. `lstlisting` in a cell already renders correctly.
- In the wrappers, a `lstlisting` opening on the **same line as the `\begin{…}`** (`\begin{center}\begin{lstlisting}`) is not tracked by the helper (that first tail is captured before the loop), so its first code line could de-indent. Real OCR emits `\begin{lstlisting}` on its own line or after a cell `&`, both covered. Also, the wrapper's own close-tag line and a code line containing a literal `\begin{lstlisting}`/`\end{lstlisting}` string are pre-existing `envDepth` edge cases shared with the standalone `tabular` rule. Low risk, malformed-only.

## Observability (if applicable)

N/A — pure renderer change, verified by the deterministic test suite.

## Testing (if applicable)

- **`tests/_data/_lists/_data.js`** — fence cases in lists: indented fence keeps indentation; fence with a language keeps highlighting + indent; consecutive fences; blank line inside a fence; `~~~` fence; unclosed fence → list still renders (items intact); marker collision (`\item`/`\end{itemize}` inside a fence stay literal, list closes on the real `\end`); fence in `\begin{enumerate}`; fence closed by a longer marker; fence before the first `\item` (no crash).
- **`tests/_data/_lstlisting/_data.js`** — `lstlisting` keeping indentation inside `\begin{table}`, `\begin{figure}`, `\begin{left}`, `\begin{center}` (own-line and mid-cell `C &\begin{lstlisting}`); a marker-collision case (```` ``` ```` inside `lstlisting` stays literal, no fence opens); and a blank-line-in-`lstlisting` case asserting parity with a bare `tabular`.
- **Regression:** full suite `npx mocha tests/*.js --exit` — 3547 pass. Notably the `_csv`/`_tsv`/`_table-markdown` suites (wrapped-tabular whitespace) are unchanged, confirming normal content is not affected.
- Run: `npm run compile && npx mocha tests/*.js --exit`

## Done When

- [x] Fenced code inside a list keeps its indentation (```` ``` ````/`~~~`, with/without language, consecutive, blank lines).
- [x] `~~~` fences render as code blocks inside lists.
- [x] `lstlisting` inside `\begin{table}`/`\begin{figure}` and `\begin{center}`/`\begin{left}`/`\begin{right}` keeps its indentation (including mid-cell `C &\begin{lstlisting}`).
- [x] Wrapper de-indent logic shared via `appendEnvAwareContentLine`; wrapped-tabular normal content unchanged (`_csv`/`_tsv` green).
- [x] No marker collisions (covered by tests); markers inside a fence stay literal; an unclosed fence keeps the list intact (single pass, no lookahead).
- [x] New fixtures added; full suite green (3547).
- [x] Bare-fence-in-cell limitation documented as a follow-up.
- [x] `Status` is `Implemented`.
