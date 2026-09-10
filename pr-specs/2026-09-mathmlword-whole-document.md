# PR: `parseMathmlWordDocument` — whole-document Word MathML export

Status: Active
Owner: @pashaev
Base: master
Version: 3.0.2

---

## Context

Snip's `Copy MS Word` button copies one equation and no prose, however much math the snip holds. The
cause is on the library side: `parseMarkdownByElement` returns one entry per math element, so every
client has to pick one — Qt takes `.front()`, macOS takes the first table row, snip-web takes
`parse.find(…)`. Prose is never in that list, because `parseMmdElement` only walks the children of
`.math-inline` / `.math-block` containers.

The rendered DOM already holds what a whole-snip export needs. `<mathmlword>` is emitted inline as a
hidden child of each math container (`src/mathjax/index.ts`, `OuterHTML`), sibling to the
`<mjx-container>` SVG — so prose and per-equation Word MathML are already interleaved in document
order. Producing a Word-pasteable document is a walk over that tree, not a re-render.

Consumer-side work (Qt, macOS, snip-web) is tracked in the monorepo spec
`pr-specs/2026-09-copy-ms-word-whole-snip.md`, which this PR is the first step of.

## Goal

Export one function that turns a rendered MMD element into a single HTML string carrying the whole
document — prose plus every equation as Word-flavoured MathML, in rendered order.

## Non-Goals

- No change to `parseMarkdownByElement`, `parseMmdElement`, or the per-element `mathmlword` value.
- No change to what `toMathMLWord` produces for an individual equation.
- No clipboard handling — that belongs to the clients.

## Desired Behavior

```ts
parseMathmlWordDocument(el: HTMLElement | Document): string
parseMathmlWordDocumentByHTML(html: string): string   // on MathpixMarkdownModel
```

Clones the element, replaces each `.math-inline` / `.math-block` with the entity-normalised contents
of its `<mathmlword>` child (reusing `formatSourceHtmlWord`), and returns the resulting HTML. Prose,
ordering and inline-vs-display placement survive because containers are replaced where they stand.

## Constraints / Invariants

- The source element is never mutated — the walk runs on a clone, since the same rendered page backs
  the caller's visible view.
- A single-equation document contains exactly the MathML the per-element path already returns, so
  clients can adopt it without changing what existing users paste.
- A container with no `<mathmlword>` child degrades to its text content; it never emits the SVG and
  never aborts the walk.
- An outer container is replaced before a nested one, which detaches the inner node; detached nodes
  are skipped rather than throwing.
- Rendered order is preserved; equations are never sorted or deduplicated.
- Tables and chemistry are left alone — they are not math containers and Word imports them as HTML.

## Testing

`tests/_mathml_word_document.js`: every equation returned rather than the first; prose kept between
equations; rendered order held; no `<svg>` / `<mjx-container>` survives; MathML namespaced on every
equation; display math marked `display="block"` while inline math stays inline; a single-equation
document matches the per-element value; prose-only input returns no MathML; a container without
`<mathmlword>` degrades to text; the source element is unmodified after the call; a null input
returns `''` rather than throwing.

## Done When

- [x] Helper exported from `src/helpers/parse-mmd-element.ts` and surfaced on
      `MathpixMarkdownModel`.
- [x] Tests above pass, and the existing suite still does.
- [x] Version bumped and `doc/changelog.md` updated.
- [ ] Published to npm so the monorepo can move its pin off `3.0.1`.
