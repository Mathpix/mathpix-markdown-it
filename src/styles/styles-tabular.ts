import {
  COLOR_TABULAR_TD_BG, COLOR_TABULAR_TD_BORDER,
  COLOR_DARK_BG, COLOR_DARK_TABULAR_TD_BORDER,
} from "./colors";
import {
  FIGURE_IMG_STYLE, TABULAR_STYLE, TABULAR_EMPTY_CELL_STYLE, TABLE_TABULAR_STYLE,
  TABULAR_CELL_PADDING, TABULAR_HEADER_PADDING, cssBlock,
} from "./structural";

export const tabularStyles = (useColors: boolean = true, isPptx: boolean = false): string => {
  const cellColors = useColors && !isPptx;
  return `
.table_tabular,
#preview-content .table_tabular, #setText .table_tabular {
  ${cssBlock(TABLE_TABULAR_STYLE)}
}
.tabular,
#preview-content .tabular, #setText .tabular {
  ${cssBlock(TABULAR_STYLE)}
}
.tabular th,
#preview-content .tabular th, #setText .tabular th {
  border: none !important;
  ${TABULAR_HEADER_PADDING}
  background-color: transparent;
  font-weight: bold;
}
.tabular tr,
#preview-content .tabular tr, #setText .tabular tr {
  border-top: none !important;
  border-bottom: none !important;
  background-color: transparent;
}
.tabular td,
#preview-content .tabular td, #setText .tabular td {
  border-style: none !important;
  ${cellColors ? `background-color: ${COLOR_TABULAR_TD_BG};` : 'background-color: transparent;'}
  ${cellColors ? `border-color: ${COLOR_TABULAR_TD_BORDER} !important;` : 'border-color: currentColor !important;'}
  word-break: keep-all;
  ${TABULAR_CELL_PADDING}
}
.tabular td > p,
#preview-content .tabular td > p, #setText .tabular td > p {
  margin-bottom: 0;
  margin-top: 0;
}
.tabular td._empty,
#preview-content .tabular td._empty, #setText .tabular td._empty {
  ${cssBlock(TABULAR_EMPTY_CELL_STYLE)}
}
.tabular td .f,
#preview-content .tabular td .f, #setText .tabular td .f {
  opacity: 0;
}
#preview-content .sub-table table, #setText .sub-table table {
  margin-bottom: 0;
}
html[data-theme="dark"] .tabular tr,
html[data-theme="dark"] #preview-content .tabular tr, html[data-theme="dark"] #setText .tabular tr,
html[data-theme="dark"] .tabular td,
html[data-theme="dark"] #preview-content .tabular td, html[data-theme="dark"] #setText .tabular td {
  ${cellColors ? `background-color: ${COLOR_DARK_BG};` : 'background-color: transparent;'}
  ${cellColors ? `border-color: ${COLOR_DARK_TABULAR_TD_BORDER} !important;` : 'border-color: currentColor !important;'}
}
.figure_img,
#preview-content .figure_img, #setText .figure_img {
  ${cssBlock(FIGURE_IMG_STYLE)}
}
div.figure_img img,
#preview-content div.figure_img img, #setText div.figure_img img {
  ${!isPptx ? 'display: inline;' : ''}
  margin: 0;
}
`;
};
