import type Renderer from "markdown-it/lib/renderer";
/**
 * Renderer for opening an itemize list (`itemize_list_open`).
 *
 * Responsibilities:
 *  - Tracks nested itemize depth with `level_itemize`.
 *  - Adds a base "itemize" class and optional line-numbering attributes.
 *  - For DOCX output (`options.forDocx`), computes custom bullet metadata
 *    (`data-custom-marker-type`, `data-custom-marker-content`) based on
 *    precomputed `itemizeLevel` and `itemizeLevelContents`.
 *  - Emits:
 *      - `<ul ... style="list-style-type: none">` for nested lists,
 *      - optionally wraps nested `<ul>` in `<li>` when a list is directly
 *        nested under another `itemize_list_open`.
 *  - For top-level lists, respects `data-padding-inline-start` attribute
 *    (translating it into inline CSS `padding-inline-start`).
 */
export declare const render_itemize_list_open: Renderer.RenderRule;
/**
 * Renderer for opening an enumerate list (`enumerate_list_open`).
 *
 * Responsibilities:
 *  - Tracks nested enumerate depth via `level_enumerate`.
 *  - Resolves the current list-style type (e.g. `decimal`, `lower-alpha`)
 *    from `token.enumerateLevel` with a fallback to `"decimal"`.
 *  - Adds CSS class `enumerate <style>` (e.g. `enumerate decimal`).
 *  - Injects line-numbering attributes when `options.lineNumbering` is enabled.
 *  - For DOCX (`options.forDocx`), adds `data-list-style-type="<style>"`.
 *  - For top-level lists, respects `data-padding-inline-start` attribute
 *    and converts it into inline `padding-inline-start` CSS.
 */
export declare const render_enumerate_list_open: Renderer.RenderRule;
/**
 * Renders the content of a LaTeX list item (`latex_list_item_open`).
 *
 * Responsibilities:
 *  - Renders child tokens (including nested inline/tabular content).
 *  - Marks math fragments with `data-math-in-text` when needed.
 *  - Applies highlight wrappers when `token.highlights` is present.
 *  - Adds a dummy `&nbsp;` for empty list items (to keep bullet visible).
 *  - Delegates final <li> markup to `renderLatexListItemCore`
 *    for plain / nested list cases.
 */
export declare const render_item_inline: Renderer.RenderRule;
export declare const render_latex_list_item_open: Renderer.RenderRule;
export declare const render_latex_list_item_close: Renderer.RenderRule;
/**
 * Renderer for closing an itemize list (`itemize_list_close`).
 *
 * Decreases nested itemize depth and, when another `itemize_list_close`
 * follows immediately and we are still in nested context, outputs
 * `</ul></li>` to close both the nested list and its `<li>`.
 */
export declare const render_itemize_list_close: Renderer.RenderRule;
export declare const render_enumerate_list_close: Renderer.RenderRule;
