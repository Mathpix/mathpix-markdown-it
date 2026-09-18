import {
  cssBlock, LIST_ROOT_STYLE, NESTED_LIST_STYLE, LIST_ITEM_STYLE,
  LIST_MARKER_STYLE, LIST_ITEM_CUSTOM_STYLE, LIST_ITEM_ENUMERATE_STYLE,
} from "./structural";

export const listsStyles = `
ol.enumerate, ul.itemize,
#preview-content ol.enumerate, #setText ol.enumerate,
#preview-content ul.itemize, #setText ul.itemize {
  ${cssBlock(LIST_ROOT_STYLE)}
}
li > ol.enumerate, li > ul.itemize,
#preview-content li > ol.enumerate, #setText li > ol.enumerate,
#preview-content li > ul.itemize, #setText li > ul.itemize {
  ${cssBlock(NESTED_LIST_STYLE)}
}
ul.itemize > li,
#preview-content ul.itemize > li, #setText ul.itemize > li {
  ${cssBlock(LIST_ITEM_STYLE)}
}
.enumerate > .li_enumerate,
#preview-content .enumerate > .li_enumerate, #setText .enumerate > .li_enumerate {
  ${cssBlock(LIST_ITEM_ENUMERATE_STYLE)}
}
.itemize > li > span.li_level, .li_enumerate.not_number > span.li_level,
#preview-content .itemize > li > span.li_level, #setText .itemize > li > span.li_level,
#preview-content .li_enumerate.not_number > span.li_level, #setText .li_enumerate.not_number > span.li_level {
  ${cssBlock(LIST_MARKER_STYLE)}
}
.li_enumerate.not_number,
#preview-content .li_enumerate.not_number, #setText .li_enumerate.not_number {
  ${cssBlock(LIST_ITEM_CUSTOM_STYLE)}
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
