# PR: HTML Math Output Options and Browser Render Script

Status: Implemented
Owner: @OlgaRedozubova

---

## Context

Users exporting HTML from Mathpix products (Snip apps, v3/converter API) receive math rendered as SVG images. Many users want alternative formats:
- **MathML** for smaller file size and client-side rendering
- **LaTeX source** for smaller file size and client-side rendering

The current rendering pipeline already generates hidden MathML and LaTeX in the output, but only SVG is visible. Users cannot access the semantic formats without inspecting the HTML source.

Additionally, when users export HTML and open it in a browser, they lose the ability to right-click and copy math in different formats (a feature available in Snip preview).

This PR adds:
1. Options to control which math format is placed in HTML output
2. A browser bundle (`auto-render.js`) for client-side rendering with Mathpix's MathJax customizations

Note: Context menu functionality already exists as a separate bundle (`es5/context-menu.js`).

---

## Goal

1. Add `output_format` option to `TOutputMath` interface to control which math format is placed in HTML (SVG, MathML, or LaTeX)
2. Create a browser bundle (`auto-render.js`) for client-side LaTeX/MathML rendering

---

## Non-Goals

- Changing default behavior (SVG remains default)
- Changes to DOCX, PDF, or other format rendering
- Offline bundling of MathJax (CDN approach for LaTeX option)

---

## Current Behavior

### Math Rendering Flow

1. LaTeX input is parsed by markdown-it with mathpix plugin
2. Math tokens are passed to MathJax for rendering
3. `OuterHTML` function assembles output with multiple formats
4. All formats except SVG are hidden with `style="display: none"`

### Current Output Structure

```html
<span class="math-inline">
  <latex style="display: none">\( x^2 + y = 1 \)</latex>
  <mathml style="display: none"><math>...</math></mathml>
  <asciimath style="display: none">x^2 + y = 1</asciimath>
  <mathmlword style="display: none">...</mathmlword>
  <mjx-container jax="SVG"><!-- Visible SVG --></mjx-container>
</span>
```

### Current Options

```typescript
interface TOutputMath {
  include_mathml?: boolean;
  include_mathml_word?: boolean;
  include_asciimath?: boolean;
  include_latex?: boolean;
  include_svg?: boolean;
  include_speech?: boolean;
  // ... other options
}
```

### Key Files

| File | Purpose |
|------|---------|
| `src/mathpix-markdown-model/index.ts` | Options interface, main API |
| `src/mathjax/index.ts` | MathJax rendering, `OuterHTML` assembly |
| `src/markdown/mdPluginRaw.ts` | `renderMath()` function |
| `src/markdown/common/convert-math-to-html.ts` | Math token to HTML conversion |

---

## Desired Behavior

### New Option

Add to `TOutputMath` interface:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `output_format` | `'svg' \| 'mathml' \| 'latex'` | `'svg'` | Math format placed in HTML output |

### Behavior by Format

| `output_format` | Server Output | Script Required | Offline |
|---------------------|---------------|-----------------|---------|
| `'svg'` (default) | Pre-rendered SVG with hidden formats | No | Yes |
| `'mathml'` | Native `<math>` elements only | Yes (rendering + features) | No |
| `'latex'` | Raw LaTeX with original delimiters | Yes (rendering) | No |

### Why Script is Needed for MathML

- **Chrome has no native MathML support** - script provides polyfill
- **Context menu** - script generates hidden formats for copy functionality
- **Accessibility** - script adds `<mjx-assistive-mml>` and ARIA attributes (see below)
- **Consistent rendering** - ensures same appearance across browsers

### Accessibility Options

The `accessibility` config for `auto-render.js` controls how math is made accessible to screen readers.

**Note:** This config format is specific to the browser bundle. Server-side rendering uses the pre-existing `TAccessibility` interface with `assistiveMml: boolean` and `sre: object`.

**Option 1: `{ assistive_mml: true, include_speech: true }` - Speech label + Assistive MathML**
```html
<mjx-container class="MathJax" jax="SVG" role="math" tabindex="0"
               aria-label="a x squared plus b x plus c equals 0">
  <svg>...</svg>
  <mjx-assistive-mml unselectable="on" display="inline">
    <math xmlns="http://www.w3.org/1998/Math/MathML">...</math>
  </mjx-assistive-mml>
</mjx-container>
```
- `aria-label` contains SRE-generated speech text
- `<mjx-assistive-mml>` exposes MathML to assistive technologies

**Option 2: `{ assistive_mml: true }` - Assistive MathML only (no speech)**
```html
<mjx-container class="MathJax" jax="SVG" role="math" tabindex="0"
               aria-labelledby="mjx-mml-ml89vyqgk858vbmasab-2">
  <svg aria-hidden="true">...</svg>
  <mjx-assistive-mml unselectable="on" display="inline" id="mjx-mml-ml89vyqgk858vbmasab-2">
    <math xmlns="http://www.w3.org/1998/Math/MathML">...</math>
  </mjx-assistive-mml>
</mjx-container>
```
- `aria-labelledby` references the `<mjx-assistive-mml>` element by ID
- Screen readers read the MathML directly

**Option 3: No accessibility config - Not accessible**
```html
<mjx-container class="MathJax" jax="SVG">
  <svg xmlns="http://www.w3.org/2000/svg" role="img" focusable="false" viewBox="...">
    ...
  </svg>
</mjx-container>
```
- No `role="math"` or `tabindex` on container
- No `aria-label` or `aria-labelledby`
- No `<mjx-assistive-mml>` element
- SVG has `role="img"` and `focusable="false"` but math is not accessible to screen readers

### Hidden Formats and Context Menu

| `output_format` | Hidden Formats Source | Context Menu |
|---------------------|----------------------|--------------|
| `'svg'` | Server-generated via `include_*` options | Reads hidden elements |
| `'mathml'` | Client-generated by `auto-render.js` | Reads hidden elements |
| `'latex'` | Client-generated by `auto-render.js` | Reads hidden elements |

**Important:** When `output_format` is `'mathml'` or `'latex'`, the server outputs ONLY the raw format (minimal HTML, no hidden elements, no SVG). The `auto-render.js` script then transforms this into the full structure:
1. Renders math to SVG via MathJax (`<mjx-container>`)
2. Generates all hidden format elements for context menu (`<latex>`, `<mathml>`, `<mathmlword>`, `<asciimath>`, `<speech>` with `style="display: none;"`)
3. Adds accessibility via `<mjx-assistive-mml>` element inside `<mjx-container>`

The pre-existing `context-menu.js` script provides the right-click copy menu by reading these hidden elements.

### Output Examples

**SVG output (`output_format: 'svg'`, default) - Server generates full structure:**
```html
<span class="math-inline">
  <latex style="display: none">ax^2 + bx + c = 0</latex>
  <mathml style="display: none"><math>...</math></mathml>
  <mjx-container jax="SVG"><svg>...</svg></mjx-container>
</span>
```

**MathML output (`output_format: 'mathml'`) - Server generates minimal output:**
```html
<span class="math-inline">
  <math>...</math>
</span>
```

**LaTeX output (`output_format: 'latex'`) - Server generates minimal output:**
```html
<!-- Original delimiters from MMD content are preserved -->
<span class="math-inline">$ ax^2 + bx + c = 0 $</span>
<!-- or -->
<span class="math-inline">\( ax^2 + bx + c = 0 \)</span>
<!-- or for display math -->
<span class="math-block">$$ ax^2 + bx + c = 0 $$</span>
```

**After `auto-render.js` processes MathML or LaTeX output - Full structure with all formats:**
```html
<span class="math-inline" data-mathpix-typeset="true">
  <mathml style="display: none;"><math>...</math></mathml>
  <mathmlword style="display: none;"><math>...</math></mathmlword>
  <asciimath style="display: none;">ax^(2)+bx+c=0</asciimath>
  <latex style="display: none;">ax^2 + bx + c = 0</latex>
  <speech style="display: none;">a x squared plus b x plus c equals 0</speech>
  <mjx-container class="MathJax" jax="SVG" role="math" tabindex="0"
                 aria-label="a x squared plus b x plus c equals 0">
    <svg>...</svg>
    <mjx-assistive-mml unselectable="on" display="inline">
      <math xmlns="http://www.w3.org/1998/Math/MathML">...</math>
    </mjx-assistive-mml>
  </mjx-container>
</span>
```

**Key elements after client-side rendering:**
| Element | Purpose |
|---------|---------|
| `<latex style="display: none;">` | Hidden LaTeX source for context menu copy |
| `<mathml style="display: none;">` | Hidden MathML for context menu copy |
| `<mathmlword style="display: none;">` | Hidden Word-compatible MathML for context menu copy |
| `<asciimath style="display: none;">` | Hidden AsciiMath for context menu copy |
| `<speech style="display: none;">` | Hidden speech text for context menu copy |
| `<mjx-container>` | Visible SVG rendering with `role="math"`, `tabindex="0"` |
| `aria-label` | Speech text (when `include_speech: true`) |
| `aria-labelledby` | References `<mjx-assistive-mml>` ID (when `assistive_mml: true` only) |
| `<mjx-assistive-mml>` | Exposes MathML to screen readers (only added when `assistive_mml: true`) |

---

## Implementation

### Part 1: New Option in Interface

**File:** `src/mathpix-markdown-model/index.ts`

Add `output_format` option to `TOutputMath` interface:
- Type: `'svg' | 'mathml' | 'latex'`
- Default: `'svg'`

Update `optionsMathpixMarkdown` default values.

### Part 2: Rendering Logic Changes

**File:** `src/markdown/mdPluginRaw.ts`

Modify `renderMath()` function:
- Check `output_format` option
- When `'latex'`: return raw LaTeX with original delimiters from the MMD content (preserves `$$`, `$`, `\[\]`, `\(\)`, etc.)
- When `'svg'` or `'mathml'`: proceed with MathJax rendering
- Preserve equation numbering context for all formats

**File:** `src/mathjax/index.ts`

Modify `OuterHTML()` function:
- Check `output_format` option
- When `'mathml'`: show MathML as primary, hide SVG container
- When `'svg'`: show SVG as primary (current behavior)
- Ensure MathML is unwrapped from `<mathml>` wrapper when it's the primary format

**File:** `src/markdown/common/convert-math-to-html.ts`

- Pass `output_format` option through to rendering functions
- When `'latex'`: bypass MathJax entirely, return raw delimiters

### Part 3: Browser Bundle

Create new directory: `src/browser/`

The browser bundle (`auto-render.js`) serves different purposes depending on the server output format:

| Format | Script Role |
|--------|-------------|
| `'svg'` | Not needed - already rendered; script skips elements with existing MathJax output |
| `'mathml'` | Required - renders MathML to SVG with hidden formats for context menu |
| `'latex'` | Required - renders LaTeX to SVG with hidden formats for context menu |

**File:** `src/browser/auto-render.ts`

Entry point for client-side processing:

| Export | Description |
|--------|-------------|
| `renderMathInElement(element, config)` | Scan and render math in DOM element |
| `MathpixRender` | Global object exposed on window |

**Configuration interface (`MathpixRenderConfig`) for browser bundle:**

```typescript
interface MathpixAccessibilityConfig {
  /** Expose MathJax assistive MathML for screen readers */
  assistive_mml?: boolean;
  /** Add aria-label speech string generated by SRE */
  include_speech?: boolean;
}

interface MathpixRenderConfig {
  accessibility: MathpixAccessibilityConfig;
  outMath: TOutputMath;
  /** Container width used for layout metrics (cwidth) */
  width?: number;
}
```

**Note:** The browser bundle uses a different accessibility interface than the server-side rendering functions:

| Context | Interface | Fields |
|---------|-----------|--------|
| Browser (`auto-render.js`) | `MathpixAccessibilityConfig` | `assistive_mml: boolean`, `include_speech: boolean` |
| Server/Programmatic | `TAccessibility` | `assistiveMml: boolean`, `sre: object` |

For server-side rendering, you pass the SRE object instance directly rather than a boolean flag.

**Behavior:**
- On DOMContentLoaded, auto-renders math in `document.body`
- Searches for `.math-inline` and `.math-block` elements
- Detects content type: MathML elements or TeX with delimiters (`$$`, `\[\]`, `\(\)`, `$`)
- Skips already-rendered elements (checks for `data-mathpix-typeset` attribute or MathJax containers)
- Renders using `MathJax.Typeset()` or `MathJax.TypesetMathML()`
- Adds accessibility attributes (`aria-label`, `aria-labelledby`, `role="math"`)
- Marks processed elements with `data-mathpix-typeset="true"`

**Note:** Context menu is a separate pre-existing bundle (`es5/context-menu.js`) that can be included independently.

### Part 4: Build Configuration

**File:** `webpack.config.js`

Added `autoRenderConfig` to existing webpack configuration:
- Input: `src/browser/auto-render.ts`
- Output: `es5/browser/auto-render.js`
- Uses existing TypeScript and Babel loaders
- Includes NodePolyfillPlugin for browser compatibility

---

## Distribution

Browser bundles included in npm package, accessible via jsdelivr:

| Bundle | Path | Purpose |
|--------|------|---------|
| `auto-render.js` | `es5/browser/auto-render.js` | Render MathML/LaTeX to SVG (for `output_format: 'mathml'` or `'latex'`) |
| `add-speech.js` | `es5/browser/add-speech.js` | Add speech to already-rendered SVG (requires `mjx-assistive-mml` present) |
| `context-menu.js` | `es5/context-menu.js` | Right-click copy menu (pre-existing, separate bundle) |

CDN URLs:
- `https://cdn.jsdelivr.net/npm/mathpix-markdown-it@{version}/es5/browser/auto-render.js`
- `https://cdn.jsdelivr.net/npm/mathpix-markdown-it@{version}/es5/browser/add-speech.js`
- `https://cdn.jsdelivr.net/npm/mathpix-markdown-it@{version}/es5/context-menu.js`

This follows the existing pattern for `es5/bundle.js`.

---

## Usage Examples

### Server-Side: MathML Output

```typescript
import { MathpixMarkdownModel } from 'mathpix-markdown-it';

const html = MathpixMarkdownModel.markdownToHTML(mmd, {
  outMath: {
    output_format: 'mathml',
    // Note: include_* options are ignored for 'mathml' format
    // Hidden formats are generated client-side by auto-render.js
  }
});
// HTML contains only: <span class="math-inline"><math>...</math></span>
// Include auto-render.js to render SVG and generate hidden formats for context menu
```

### Server-Side: LaTeX Output (for Client Rendering)

```typescript
const html = MathpixMarkdownModel.markdownToHTML(mmd, {
  outMath: {
    output_format: 'latex',
    // Note: include_* options are ignored for 'latex' format
  }
});
// HTML contains only: <span class="math-inline">$ ax^2 + bx + c = 0 $</span>
// Original delimiters from MMD are preserved ($$, $, \[\], \(\), etc.)
// Include auto-render.js to render SVG and generate hidden formats for context menu
```

### Client-Side: Auto-Render

```html
<script>
  window.MathpixRenderConfig = {
    accessibility: {
      assistive_mml: true,
      include_speech: true
    },
    outMath: {
      output_format: 'svg',
      include_svg: true,
      include_latex: true,
      include_mathml: true,
      include_asciimath: true,
      include_mathml_word: true
    },
    width: 1200
  };
</script>
<script src="https://cdn.jsdelivr.net/npm/mathpix-markdown-it@latest/es5/browser/auto-render.js"></script>
<!-- Optional: include context menu for copy functionality -->
<script src="https://cdn.jsdelivr.net/npm/mathpix-markdown-it@latest/es5/context-menu.js"></script>
```

### Client-Side: Manual Render

```javascript
MathpixRender.renderMathInElement(document.getElementById('content'), {
  accessibility: {
    assistive_mml: true,
    include_speech: true
  },
  outMath: {
    output_format: 'svg',
    include_latex: true,
    include_mathml: true
  }
});
```

### Client-Side: Add Speech to Already-Rendered SVG

Use `add-speech.js` when math was rendered server-side with `output_format: 'svg'` but without accessibility:

```html
<script src="https://cdn.jsdelivr.net/npm/mathpix-markdown-it@latest/es5/browser/add-speech.js"></script>
```

Or manually:

```javascript
// After add-speech.js loads
MathpixSpeech.addSpeechToRenderedMath(document.getElementById('content'));
```

This script:
- Loads SRE (Speech Rule Engine) dynamically
- Finds all `mjx-container` elements with `mjx-assistive-mml`
- Adds `aria-label`, `role="math"`, `tabindex="0"` attributes
- Creates hidden `<speech>` elements for context menu

---

## Constraints / Invariants

- Default behavior unchanged (`output_format: 'svg'`)
- When `output_format: 'svg'`: server generates full structure with hidden formats via `include_*` options
- When `output_format: 'mathml'` or `'latex'`: server outputs ONLY the raw format (minimal HTML), `include_*` options are ignored
- When `output_format: 'latex'`: original delimiters from MMD content are preserved
- Browser bundle (`auto-render.js`) must work standalone (no external dependencies except DOM)
- `auto-render.js` is **required** for `'mathml'` and `'latex'` formats to render SVG and generate hidden formats
- `auto-render.js` skips already-rendered elements (detects MathJax containers, `data-mathpix-typeset` attribute)
- Only `'svg'` format works fully offline; `'mathml'` and `'latex'` require client-side script

---

## Testing

### Unit Tests

- `output_format: 'svg'` produces full structure with SVG and hidden formats (default behavior)
- `output_format: 'mathml'` produces minimal output with only native MathML element
- `output_format: 'latex'` produces minimal output with only raw LaTeX delimiters
- `include_*` options work only with `'svg'` format (ignored for `'mathml'` and `'latex'`)
- Inline vs display math handled correctly for all formats
- Equation numbering preserved with all formats

### Browser Bundle Tests (`auto-render.js`)

- Correctly detects MathML elements inside `.math-inline` / `.math-block`
- Correctly detects LaTeX delimiters (`$$`, `\[\]`, `\(\)`, `$`)
- Generates all hidden format elements (`<latex>`, `<mathml>`, `<mathmlword>`, `<asciimath>`, `<speech>`)
- Renders SVG via `<mjx-container>`
- Accessibility when `{ assistive_mml: true, include_speech: true }`: adds `role="math"`, `tabindex="0"`, `aria-label`, `<mjx-assistive-mml>`
- Accessibility when `{ assistive_mml: true }` only: adds `role="math"`, `tabindex="0"`, `aria-labelledby`, `<mjx-assistive-mml>` with ID
- No accessibility when config not set: no `<mjx-assistive-mml>`, no ARIA attributes
- Marks processed elements with `data-mathpix-typeset="true"`
- Skips already-rendered elements

### Integration Tests

- Browser bundle loads without errors
- Auto-render finds and renders `.math-inline` and `.math-block` elements
- Already-rendered elements are skipped (detects `data-mathpix-typeset` attribute)
- MathML input elements are correctly detected and rendered

### Manual Tests

- Verify rendered output matches expected format
- Test accessibility with screen readers
- Test MathML and LaTeX input rendering in browser

---

## Done When

- [x] `output_format` option added to `TOutputMath` interface
- [x] `renderByFormat()` handles all three format values (`'svg'`, `'mathml'`, `'latex'`)
- [x] `OuterHTML()` shows correct primary format based on option
- [x] Browser bundle entry point created (`src/browser/auto-render.ts`)
- [x] Webpack config for browser bundle added to `webpack.config.js`
- [x] Bundle files included in npm package (`es5/browser/auto-render.js`)
- [x] Accessibility improvements (`applyMathJaxA11y`, `aria-labelledby` support)
- [x] `Status` updated to `Implemented`
- [x] Separate `add-speech.js` bundle for adding speech to already-rendered SVG
- [x] Shared `addSpeechToMathContainer()` function in `src/sre/index.ts`
- [x] Changelog updated
- [ ] Unit tests for new options
- [ ] README updated with new options and browser bundle usage

Note: Context menu was already implemented separately (`src/context-menu.tsx` → `es5/context-menu.js`)

---

## Related

- Monorepo PR spec: `monorepo/pr-specs/2026-01-snip-html-export-mathml-option.md`
- Consumers: mmd-converter (v3/converter API), snip-web, desktop apps
