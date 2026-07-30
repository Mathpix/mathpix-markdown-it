import { LIST_DEFAULT_INDENT_EM, MARKER_GAP_EM } from "../markdown/common/consts";

export const listsStyles = `
ol.enumerate, ul.itemize,
#preview-content ol.enumerate, #setText ol.enumerate,
#preview-content ul.itemize, #setText ul.itemize {
  padding-inline-start: ${LIST_DEFAULT_INDENT_EM}em;
  margin: 0 0 1em 0;
}
#preview-content ul, #setText ul,
#preview-content ol, #setText ol {
  padding-inline-start: ${LIST_DEFAULT_INDENT_EM}em;
}
li > ol.enumerate, li > ul.itemize,
#preview-content li > ol.enumerate, #setText li > ol.enumerate,
#preview-content li > ul.itemize, #setText li > ul.itemize {
  margin: 0;
}
ul.itemize > li,
#preview-content ul.itemize > li, #setText ul.itemize > li {
  position: relative;
  min-height: 1.4em;
  margin-bottom: 0;
}
.enumerate > .li_enumerate,
#preview-content .enumerate > .li_enumerate, #setText .enumerate > .li_enumerate {
  margin-bottom: 0;
}
.itemize > li > span.li_level, .li_enumerate.not_number > span.li_level,
#preview-content .itemize > li > span.li_level, #setText .itemize > li > span.li_level,
#preview-content .li_enumerate.not_number > span.li_level, #setText .li_enumerate.not_number > span.li_level {
  position: absolute;
  right: 100%;
  white-space: nowrap;
  width: max-content;
  display: flex;
  justify-content: flex-end;
  padding-right: ${MARKER_GAP_EM}em;
  box-sizing: border-box;
}
.li_enumerate.not_number,
#preview-content .li_enumerate.not_number, #setText .li_enumerate.not_number {
  position: relative;
  display: inline-block;
  list-style-type: none;
  min-height: 1.4em;
}
.itemize > li > span.li_level .math-inline,
.enumerate > li > span.li_level .math-inline,
#preview-content .itemize > li > span.li_level .math-inline,
#setText .itemize > li > span.li_level .math-inline,
#preview-content .enumerate > li > span.li_level .math-inline,
#setText .enumerate > li > span.li_level .math-inline {
  display: inline-block;
}
`;
