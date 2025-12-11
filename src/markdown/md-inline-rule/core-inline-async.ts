import { Token } from 'markdown-it';
import { inlineDecimalParse } from "../md-block-rule/begin-tabular";
import {
  addFootnoteToListForFootnote,
  addFootnoteToListForFootnotetext,
  addFootnoteToListForBlFootnotetext
} from "../md-latex-footnotes/utils";
import { addAttributesToParentToken, applyAttrToInlineMath } from "../utils";
import { setSizeCounter } from "../common/counters";
import { getTextWidthByTokens, ISizeEx } from "../common/textWidthByTokens";

// вспомогательный массив для типов, которые парсим inline-подобно
const INLINE_LIKE_TYPES = [
  'title',
  'section',
  'subsection',
  'subsubsection',
  'addcontentsline',
  'item_inline',
  'caption_table'
];

function isInlineLikeType(type: string): boolean {
  return type === 'inline' || INLINE_LIKE_TYPES.includes(type);
}

export const coreInlineAsync = async (state: any, opts?: { sliceMs?: number }): Promise<void> => {
  console.log("[MMD]=>[coreInlineAsync]=>");
  const tokens: Token[] = state.tokens;
  let currentTag: any = {};
  let envToInline: any = {};
  const sliceMs = (opts && opts.sliceMs) || 30;

  if (!state.env.footnotes) { state.env.footnotes = {}; }
  state.env.mmd_footnotes = { ...state.env.footnotes };
  if (!state.env.mmd_footnotes.list) { state.env.mmd_footnotes.list = []; }

  let lastYield = Date.now();

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    // periodically we give control to the event loop
    if (Date.now() - lastYield > sliceMs) {
      lastYield = Date.now();
      await new Promise<void>(resolve => setImmediate(resolve));
    }
    // --- footnote_* tokens ---
    if (token.type === 'footnote_latex' ||
      token.type === 'footnotetext_latex' ||
      token.type === 'blfootnotetext_latex') {
      if (token.children?.length) {
        for (let j = 0; j < token.children.length; j++) {
          const child: any = token.children[j];
          if (child.type === "paragraph_open") {
            child.notInjectLineNumber = true;
          }
          if (isInlineLikeType(child.type)) {
            state.env = Object.assign({}, { ...state.env }, {
              currentTag: currentTag,
            }, { ...envToInline });
            await state.md.inline.parseAsync(
              child.content,
              state.md,
              state.env,
              child.children,
              { sliceMs }
            );

            if (child.meta?.isMathInText && child.children?.length) {
              applyAttrToInlineMath(child, "data-math-in-text", "true");
            }
            if (i > 0) {
              addAttributesToParentToken(tokens[i - 1], token);
            }
          }

          if (child.type === 'tabular' && child.children?.length) {
            for (let k = 0; k < child.children.length; k++) {
              let tok: any = child.children[k];

              if (tok.token === "inline_decimal") {
                tok = inlineDecimalParse(tok);
                continue;
              }

              if (tok.token === "inline") {
                if (tok.envToInline) {
                  envToInline = tok.envToInline;
                }

                state.env = Object.assign({}, { ...state.env }, {
                  currentTag: currentTag,
                }, { ...envToInline });

                await state.md.inline.parseAsync(
                  tok.content,
                  state.md,
                  state.env,
                  tok.children,
                  { sliceMs }
                );

                if (j > 0 && token.children[j - 1].type === 'td_open') {
                  addAttributesToParentToken(token.children[j - 1], tok);
                }
              }
            }
          }
        }
      }

      if (!state.env.footnotes.list) { state.env.footnotes.list = []; }
      if (!state.env.mmd_footnotes.list) { state.env.mmd_footnotes.list = []; }

      if (token.type === 'footnotetext_latex') {
        addFootnoteToListForFootnotetext(state, token, token.children, token.content, (token as any).numbered, true);
        continue;
      }
      if (token.type === 'blfootnotetext_latex') {
        addFootnoteToListForBlFootnotetext(state, token, token.children, token.content, true);
        continue;
      }
      addFootnoteToListForFootnote(state, token, token.children, token.content, (token as any).numbered, true);
      continue;
    }

    if ((token as any).currentTag) {
      currentTag = (token as any).currentTag;
    }
    if ((token as any).envToInline) {
      envToInline = (token as any).envToInline;
    }

    // --- tabular in top level ---
    if (token.type === 'tabular' && token.children?.length) {
      for (let j = 0; j < token.children.length; j++) {
        let tok: any = token.children[j];

        if (tok.token === "inline_decimal") {
          tok = inlineDecimalParse(tok);
          continue;
        }

        if (tok.token === "inline") {
          if (tok.envToInline) {
            envToInline = tok.envToInline;
          }

          state.env = Object.assign({}, { ...state.env }, {
            currentTag: currentTag,
          }, { ...envToInline });

          await state.md.inline.parseAsync(
            tok.content,
            state.md,
            state.env,
            tok.children,
            { sliceMs }
          );

          if (j > 0 && token.children[j - 1].type === 'td_open') {
            addAttributesToParentToken(token.children[j - 1], tok);
          }
        }
      }
      continue;
    }

    // ---  inline / title / section / ... ---
    if (isInlineLikeType(token.type)) {
      state.env = Object.assign({}, { ...state.env }, {
        currentTag: currentTag,
      }, { ...envToInline });

      await state.md.inline.parseAsync(
        (token as any).content,
        state.md,
        state.env,
        token.children,
        { sliceMs }
      );

      if (token.meta?.isMathInText && token.children?.length) {
        applyAttrToInlineMath(token.children, "data-math-in-text", "true");
      }

      if (state.md.options?.enableSizeCalculation) {
        if (token.type === 'inline' && token.children?.length) {
          const data: ISizeEx | null = getTextWidthByTokens(token.children);
          if (data) {
            (token as any).widthEx = data.widthEx;
            (token as any).heightEx = data.heightEx;
            setSizeCounter(data.widthEx, data.heightEx);
          }
        }
      }

      if (token.type === 'inline' && token.children?.length) {
        if ((token as any).lastBreakToSpace &&
          token.children[token.children.length - 1].type === 'softbreak') {
          const br = token.children[token.children.length - 1] as any;
          br.hidden = true;
          br.showSpace = true;
        }
        if ((token as any).firstBreakToSpace &&
          token.children[0].type === 'softbreak') {
          const br0 = token.children[0] as any;
          br0.hidden = true;
          br0.showSpace = true;
        }
        if (i > 0) {
          addAttributesToParentToken(tokens[i - 1], token);
        }
      }
    }
  }

  state.env.footnotes = null;
};
