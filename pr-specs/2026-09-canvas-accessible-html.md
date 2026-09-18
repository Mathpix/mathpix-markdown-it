# PR: Canvas-compatible HTML output (`markdownToCanvasHTML`)

Status: Implemented
Owner: @OlgaRedozubova
Base: master
Version: 3.0.2

---

## Context

Canvas (Instructure LMS) sanitizes every piece of user-authored HTML server-side against a fixed allowlist, and its Rich Content Editor applies a second, client-side allowlist on paste. Both were read from source on 2026-09-17:

- server: `instructure/canvas-lms`, `gems/canvas_sanitize/lib/canvas_sanitize/canvas_sanitize.rb` — **127 elements**, including the complete MathML 3 set.
- client: `packages/canvas-rce/src/defaultTinymceConfig.ts` — **129 elements**. The file carries a comment saying it is kept in sync with the server list.

Canvas uses the `sanitize` gem 7.0.0, which merges a caller's config into `Config::DEFAULT`. That merge brings in `remove_contents: %w[iframe math noembed noframes noscript plaintext script style svg xmp]`, so a non-allowlisted element meets one of two fates:

| | Result |
|---|---|
| listed in `remove_contents` (`svg`, `style`, `script`, …) | element **and its contents** deleted |
| any other non-allowlisted element | element **unwrapped** — tag dropped, text kept |

That second row is the reported defect. With the default output a single inline formula reaches a Canvas page as **six visible copies**: two rendered MathML copies (`<mathml>`, `<mathmlword>`), the `asciimath` and `latex` sources as body text, the assistive MathML rendered a third time, and the `speech` string. Reproduced on a live Canvas instance, not simulated.

Canvas filters CSS mainly by **property name**: a rejected sub-property survives inside a shorthand Canvas does allow, and a gradient passes as an ordinary function. Its property list has no `font-weight` and no logical properties. Values are not entirely unchecked, though — a round trip through a live page showed a `url(data:…)` rejected and the whole `style` attribute dropped with it, so the scheme inside `url()` is checked as well.

A Canvas page body is capped at `500.kilobytes - 1` (`config/initializers/active_record.rb`), enforced both client- and server-side.

## Goal

An opt-in render profile whose output a Canvas page accepts intact: native MathML, no duplicate source copies, no scripts, no document wrapper, no element or attribute Canvas silently drops or unwraps, and structure that survives without a stylesheet.

## Non-Goals

- **Changing any default.** Every existing consumer keeps byte-identical output unless it opts in.
- **Clipboard, buttons and export menus.** The profile produces HTML; delivering it is the caller's.
- **Uploading chemistry images to a CDN.** Needs an upload path.
- **`caption` on tables.** Most documents carry no caption source, so one cannot be invented.
- **Moodle / Blackboard / Brightspace variants.**

## Current Behavior

By default `markdownToHTML` emits, per formula, an SVG render, an `<mjx-assistive-mml>` copy, and one hidden custom element per enabled `include_*` flag. Chemistry renders as inline SVG carrying a nested `<style>`. `~~strike~~` renders as `<s>`. Heading levels are emitted as authored, so a document `<h1>` collides with the Canvas page title. Structural layout lives in the stylesheet, which a Canvas page does not take.

## Desired Behavior

`markdownToCanvasHTML(markdown, options)` returns `{ html, warnings }`:

- **Math** — native `<math>` only. The profile forces `outMath.output_format: 'mathml'`, because Canvas deletes `svg` with its contents: any other format would leave the page with no formulas at all. The `include_*` flags are left as the caller set them: under this format none of them reaches the output.
- **Hidden source copies** — dropped, so they cannot become visible body text.
- **Strikethrough** — `del` instead of `s`.
- **Bold** — `strong` instead of `span[font-weight]`, since Canvas has no `font-weight`.
- **Chemistry** — the SMILES source in a `<code>` element instead of the SVG, so the content survives and stays editable.
- **Headings** — shifted down one level (`h1`→`h2` … `h5`→`h6`, `h6` clamped), so the Canvas page title is the only top-level heading.
- **Structure** — the declarations that carry layout travel inline, since Canvas takes no stylesheet: the title and author block, abstract, section titles, display math, figures, list markers, and the borders and padding of both markdown and `tabular` tables.
- **`align`** — replaced by the equivalent declaration on the elements where Canvas drops the attribute: a text alignment in general, a margin on a table, since `align` there places the table rather than its text.
- **URLs** — only the schemes Canvas keeps; query strings survive intact.
- **Warnings** — what a page cannot be fixed for after the fact: the size in bytes and whether it exceeds the page cap, how many structures degraded to their source, how many images carry no alt text, and how much bold could not be carried. Weight travels as `strong`, which replaces the element, so only an element carrying nothing else can be promoted.
- **Fragment, not document** — `htmlWrapper` is ignored under the profile. Canvas allowlists neither `html` nor `head`, so a wrapped document would be unwrapped and the `<title>` text would land on the page as body text.

## Implementation

- `markdownToCanvasHTML` (`src/mathpix-markdown-model/index.ts`) is the only entry point. It fixes the math format, suppresses the document wrapper, renders, and runs the profile over the finished HTML. A single function rather than a flag on `markdownToHTML`, because the profile overrides options the caller would otherwise be setting, because a flag on the shared option type advertises itself on methods that cannot honour it, and because a `string` return cannot carry the warnings. `TMarkdownItOptions` keeps `forCanvas?: boolean` as internal plumbing: the render rules read it from the markdown-it options, and it is documented as set by this function alone.
- `src/markdown/canvas/index.ts` — the profile. It runs over rendered HTML rather than the token stream, so raw HTML written in the document is covered too. Per element: the heading shift, `s`→`del`, `mspace`→`mpadded` when it carries sizing, `span`→`strong` for bold, removal of attributes Canvas drops, and inline styles for the structural classes. Allowed URL schemes match Canvas exactly, and a bare `&` is escaped before parsing — a named entity needs no semicolon, so an unescaped one would swallow a query string that a browser's parser would have kept.
- `src/styles/structural.ts` — the structural declarations as shared constants, rendered either as a stylesheet block or as an inline list. One definition keeps the inline copy from drifting from the rule it mirrors: a change to the stylesheet reaches the Canvas output automatically.
- `src/markdown/sanitize/sanitize-html.ts` — a `transformStyle` hook between the existing postcss parse and the serialization. The profile folds rejected sub-properties into the shorthands Canvas allows (`background-size` into `background`, `text-decoration-style` into `text-decoration`) and drops `font-weight`, operating on the parsed declarations. Working inside the parse that already happens avoids a second pass over every style attribute and keeps the semantics identical to the parser that serializes the result. The hook is optional: without it the sanitizer behaves exactly as before.
- Renderer-level changes behind the flag: chemistry fallback, list markers positioned without logical properties, author block styles inline, `word-break` suppressed, table centring by margin instead of `align`.

## Measurements

Measured over the mmd-converter test corpus, against the same documents rendered by `markdownToHTML`:

- The output is several times smaller, because the math is MathML rather than SVG. Documents too large for a Canvas page become the exception rather than a regular occurrence.
- It is not faster. Nearly all of the difference is MathML generation; the profile itself costs about a millisecond per document.
- Simulating the Canvas sanitizer over the result, the only losses are the elements `svg` and `input` written as raw HTML in the documents, which Canvas removes whole. No attribute, no CSS declaration and no URL is lost.

## Round trip through a live page

The profile's output was pasted into a Canvas page through its HTML editor, saved, and read back. Comparing structurally — elements, attributes, CSS declarations and text — nothing was lost and no text appeared. What a page changes:

- It writes `rel="noopener"` back onto every link it had stripped, so omitting `rel` only produced a difference; the profile leaves the default in place.
- It folds `border-*-style` / `border-*-width` into the shorthand where all four sides agree. Rendering is unchanged, so this is left alone rather than pre-folded.
- It adds a `tbody` to a raw `<table>` written without one.
- It drops a `url(data:…)` in a style, and the `style` attribute with it. The profile never emits one; it can only come from raw HTML in the document.

The round trip is also the only check that sees the result rather than the markup: reading the saved page found list defects no structural comparison could — an item style that read one rule of the cascade instead of its outcome.

## Constraints / Invariants

- Every other output is untouched: across the corpus, `markdownToHTML` and the `forDocx` / `forPptx` / `forLatex` / `forMD` targets are byte-identical to the previous release apart from generated element ids. `forDocx` is the one that had to be checked separately — its author-item style carried a leading space that a shared constant would have dropped.
- The profile is one-shot by nature: a shifted `h2` is indistinguishable from an authored one, so a second application would shift it again and re-prepend the structural declarations. It is applied exactly once inside `markdownToCanvasHTML`, so a second application is not reachable.
- Structural styles have exactly one definition, shared by the stylesheet and the inline output.
- Arbitrary CSS is parsed by postcss, never split by hand; the constants in `structural.ts` are literals written there and are split directly.
- A shorthand is only folded where it cannot change what the page renders: the sub-properties it would reset must be absent, and it must already come before the sub-property being folded into it. Where either fails the declarations are left as they are, and Canvas strips what it strips.
- Declaration order is preserved, so the cascade resolves as it did before folding.

## Tests

- `tests/canvas-profile.js` renders one corpus exercising every construct the profile touches, then asserts the properties this spec claims: nothing Canvas would drop or unwrap is emitted, every structural class carries the style its rule would have given it, URLs and their query strings survive, the warnings report what the page cannot show, and `markdownToHTML` is unchanged. A construct the corpus does not produce fails the test rather than passing silently, so the corpus has to grow with the profile.
- Style snapshot tests assert the generated stylesheet is byte-identical after the constants refactor, for every combination of the style options.

## Known Limitations

- Canvas allows `scope` on `<th>` but **not** `headers` on `<td>`, so complex tables (multirow / multicolumn) cannot be fully associated for screen readers no matter what is emitted. Emitting `scope` on simple tables is a follow-up.
- The client-side (paste) and server-side (save) allowlists are not identical — `s` is the known divergence. Output is targeted at the intersection.
- Chemistry degrades to source text; it is not rendered, and it does so whatever `include_smiles` says: the alternative is losing the structure entirely.
- A background image sized beside a `background-color` is not folded, because the shorthand would reset the colour. Canvas then strips the sizing, so a diagonal cell authored that way in raw HTML loses its diagonal. Nothing reports it; the folded case is the one mmd itself emits.
- A `url(data:…)` inside a style written as raw HTML is dropped by Canvas together with its `style` attribute. The profile emits no data URI of its own.
- Raw HTML authored in a document is passed through, so an `<svg>` or an `<input>` written by hand is still removed by Canvas — the element is not allowlisted at all, so there is nothing to rewrite it into. Warning the caller before export is a follow-up.
- `lineNumbering` is left to the caller. Its `data-*` attributes are allowlisted by Canvas, so they survive a page rather than breaking it, but they count against the 500 KB cap; the profile only overrides what would otherwise be destroyed.
- The profile has no segmented form. `markdownToHTMLSegments` maps each segment by its offset into the HTML it returns, and the profile changes those offsets, so a caller needing segments and Canvas at once would need the map rebuilt after the pass.
- The abstract is emitted at a fixed heading level while `\section` is `h2`, so a document without an `h1` starts below the Canvas page title and Canvas's accessibility check reports a skipped level. Deliberately left alone; heading-outline normalization is a separate change.

## Done When

- [x] `markdownToCanvasHTML` is the only entry point; it fixes the math format, returns a fragment, and reports warnings.
- [x] Hidden source copies, `s`, bold spans, dropped attributes and rejected CSS handled.
- [x] Structural layout travels inline from constants shared with the stylesheet.
- [x] URLs keep their query strings and only the schemes Canvas keeps.
- [x] Style folding runs inside the existing parse, with no second pass over style attributes.
- [x] Every other output byte-identical across the corpus, target flags included; full suite green.
- [x] `Status` is `Implemented`.
