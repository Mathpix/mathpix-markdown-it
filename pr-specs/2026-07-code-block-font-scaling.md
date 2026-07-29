# PR: Code-block styles scale with the em context

Status: Implemented
Owner: @OlgaRedozubova
Base: master
Version: 3.1.0

---

## Context

A rendered block can be scaled by a consumer that sets a single `font-size` on the
container (e.g. rendering to a fixed pixel size for image export). Every block scales
with that font size **except code text**, because the code styles pin absolute values:

```css
#setText pre code { font-size: 15px; line-height: 24px; padding: 1rem; }
#setText pre      { font-size: 85%; }
```

`px` sizes are fixed and `rem` resolves against the root, not the block's own `em`, so at
a large base the formula scales but the code block does not — it stays ~15px in a mostly
empty box. Chromium and WebKit both honor the absolute values, so the symptom is
engine-independent.

## Goal

A code block's rendered size is proportional to the font size of its `em` context, like
every other block, so a consumer that scales by font size gets a correctly-sized code block.

## Current Behavior

At a 16px base the code text is 15px in a 24px line box with 16px padding; at a 71px base
it is *still* 15px / 24px / 16px.

## Desired Behavior

The properties become relative, calibrated so at a 16px base the **code text** is
pixel-identical to before (15px glyphs in a 24px line box); the only intentional visual
change is code padding, 16px → 15px:

- `#setText pre { font-size: 0.9375em; }` — replaces `85%`. Already relative; bumped from
  `85%` (13.6px) to `0.9375em` (15px) so that `pre code { font-size: inherit }` resolves to
  the same 15px the code text had absolutely.
- `#setText pre code { font-size: inherit; }` — replaces `15px`; the code text inherits from `pre`.
- `#setText pre code { line-height: 1.6; }` — replaces `24px` (`1.6 × 15 = 24px`, unchanged).
- `#setText pre code { padding: 1em; }` — replaces `1rem` (`1em × 15px = 15px`, was `16px`).

The `pre` wrapper's own font-size moves 13.6px → 15px, so its line box (`line-height: 1.45`)
goes 19.72px → 21.75px. `pre` wraps only the `display:block` `code` element and emits no
direct inline text, so this is not visible — but it is a real computed-style change, not a
pixel-for-pixel no-op.

## Constraints / Invariants

- **No visual change at the default 16px base** apart from the 1px code padding.
- **`em`, not `rem`** — `rem` is exactly what makes padding immune to scaling.
- **All four ship together.** Making `font-size` relative while leaving `line-height: 24px`
  would drop the line box below the glyph height at large sizes and overlap the lines.
- **Styles only** — no change to `lstlisting` / fenced-code markup or `token.meta.codeText`.
- `pre`'s own `font-size` changes 85% → 93.75%; observable only for a non-`code` child of a
  `pre`, which is not emitted. Called out so it is not read as an unrelated tweak.

## Migration

- **Code text now inherits `font-size` from `pre`.** A consumer that used to size code by
  setting `#setText pre code { font-size: … }` still works, but one that sized it via `pre`
  now also affects the code text (previously the absolute `15px` on `pre code` won). Set the
  size on `pre code` if independent control is needed.
- **Code padding is 15px, not 16px, at the default base** (`1em` of a 15px `pre`).
- Scaling the block by a container `font-size` now scales code padding and line height too;
  before, both stayed fixed.

## Implementation

- `src/styles/index.ts` (`codeBlockStyles`): `pre` `font-size` 85% → `0.9375em`; `pre code`
  `padding` `1rem` → `1em` and `line-height` `24px` → `1.6`.
- `src/styles/styles-code.ts` (`codeStyles`): `pre code` `font-size` `15px` → `inherit`.

## Testing

- Style snapshots regenerated (`MathpixStyle-*`, `codeStyles-*`); diff is only the four
  properties above.
- Added a regression gate in `tests/_styles.js`: the generated code styles contain no
  absolute `font-size: 15px` / `line-height: 24px` and no `padding: 1rem` for `pre code`,
  and use the relative forms instead.
- Full suite green.
