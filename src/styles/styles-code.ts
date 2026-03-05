import {
  COLOR_CODE_BG, COLOR_PRE_CODE_TEXT,
  HLJS_COMMENT, HLJS_COMMAND, HLJS_KEYWORD, HLJS_STRING, HLJS_TITLE,
  HLJS_TYPE, HLJS_TAG, HLJS_REGEXP, HLJS_SYMBOL, HLJS_META,
  HLJS_META_STRING, HLJS_DELETION_BG, HLJS_ADDITION_BG,
} from "./colors";

export const codeStyles = (useColors: boolean = true): string => `
    #preview-content code, #setText code {
        font-family: Inconsolata;
        font-size: inherit;
        display: initial;
        ${useColors ? `background: ${COLOR_CODE_BG};` : ''}
    }
    #preview-content .mmd-highlight code, #setText .mmd-highlight code,
    #preview-content pre.mmd-highlight code, #setText pre.mmd-highlight code {
        background-color: transparent;
    }
    #preview-content pre code, #setText pre code {
        font-family: 'DM Mono', Inconsolata, monospace;
        ${useColors ? `color: ${COLOR_PRE_CODE_TEXT};` : ''}
        font-size: 15px;
    }
    .hljs-comment, .hljs-quote,
    #preview-content .hljs-comment, #setText .hljs-comment,
    #preview-content .hljs-quote, #setText .hljs-quote {
        color: ${HLJS_COMMENT};
        font-style: italic;
    }
    .hljs-command,
    #preview-content .hljs-command, #setText .hljs-command {
        color: ${HLJS_COMMAND};
    }
    .hljs-keyword, .hljs-selector-tag, .hljs-subst,
    #preview-content .hljs-keyword, #setText .hljs-keyword,
    #preview-content .hljs-selector-tag, #setText .hljs-selector-tag,
    #preview-content .hljs-subst, #setText .hljs-subst {
        color: ${HLJS_KEYWORD};
        font-weight: bold;
    }
    .hljs-number, .hljs-literal, .hljs-variable,
    .hljs-template-variable, .hljs-tag .hljs-attr,
    #preview-content .hljs-number, #setText .hljs-number,
    #preview-content .hljs-literal, #setText .hljs-literal,
    #preview-content .hljs-variable, #setText .hljs-variable,
    #preview-content .hljs-template-variable, #setText .hljs-template-variable,
    #preview-content .hljs-tag .hljs-attr, #setText .hljs-tag .hljs-attr {
        color: ${HLJS_COMMAND};
    }
    .hljs-string, .hljs-doctag,
    #preview-content .hljs-string, #setText .hljs-string,
    #preview-content .hljs-doctag, #setText .hljs-doctag {
        color: ${HLJS_STRING};
    }
    .hljs-title, .hljs-section, .hljs-selector-id,
    #preview-content .hljs-title, #setText .hljs-title,
    #preview-content .hljs-section, #setText .hljs-section,
    #preview-content .hljs-selector-id, #setText .hljs-selector-id {
        color: ${HLJS_TITLE};
        font-weight: bold;
    }
    .hljs-subst,
    #preview-content .hljs-subst, #setText .hljs-subst {
        font-weight: normal;
    }
    .hljs-type, .hljs-class .hljs-title,
    #preview-content .hljs-type, #setText .hljs-type,
    #preview-content .hljs-class .hljs-title, #setText .hljs-class .hljs-title {
        color: ${HLJS_TYPE};
        font-weight: bold;
    }
    .hljs-tag, .hljs-name, .hljs-attribute,
    #preview-content .hljs-tag, #setText .hljs-tag,
    #preview-content .hljs-name, #setText .hljs-name,
    #preview-content .hljs-attribute, #setText .hljs-attribute {
        color: ${HLJS_TAG};
        font-weight: normal;
    }
    .hljs-regexp, .hljs-link,
    #preview-content .hljs-regexp, #setText .hljs-regexp,
    #preview-content .hljs-link, #setText .hljs-link {
        color: ${HLJS_REGEXP};
    }
    .hljs-symbol, .hljs-bullet,
    #preview-content .hljs-symbol, #setText .hljs-symbol,
    #preview-content .hljs-bullet, #setText .hljs-bullet {
        color: ${HLJS_SYMBOL};
    }
    .hljs-built_in, .hljs-builtin-name,
    #preview-content .hljs-built_in, #setText .hljs-built_in,
    #preview-content .hljs-builtin-name, #setText .hljs-builtin-name {
        color: ${HLJS_STRING};
    }
    .hljs-meta,
    #preview-content .hljs-meta, #setText .hljs-meta {
        color: ${HLJS_META};
        font-weight: bold;
    }
    .hljs-meta-keyword,
    #preview-content .hljs-meta-keyword, #setText .hljs-meta-keyword {
        color: ${HLJS_KEYWORD};
    }
    .hljs-meta-string,
    #preview-content .hljs-meta-string, #setText .hljs-meta-string {
        color: ${HLJS_META_STRING};
    }
    .hljs-deletion,
    #preview-content .hljs-deletion, #setText .hljs-deletion {
        background: ${HLJS_DELETION_BG};
    }
    .hljs-addition,
    #preview-content .hljs-addition, #setText .hljs-addition {
        background: ${HLJS_ADDITION_BG};
    }
    .hljs-emphasis,
    #preview-content .hljs-emphasis, #setText .hljs-emphasis {
        font-style: italic;
    }
    .hljs-strong,
    #preview-content .hljs-strong, #setText .hljs-strong {
        font-weight: bold;
    }
`;
