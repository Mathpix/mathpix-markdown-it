import {
  COLOR_TABULAR_TD_BG, COLOR_TABULAR_TD_BORDER,
  COLOR_DARK_BG, COLOR_DARK_TABULAR_TD_BORDER,
} from "./colors";

export const tabularStyles = (useColors: boolean = true, isPptx: boolean = false): string => {
  const cellColors = useColors && !isPptx;
  return `
    .table_tabular,
    #preview-content .table_tabular, #setText .table_tabular {
        overflow-x: auto;
        padding: 0 2px 0.5em 2px;
    }
    .tabular,
    #preview-content .tabular, #setText .tabular {
        display: inline-table !important;
        width: auto;
        table-layout: auto;
        border-collapse: collapse;
        border-spacing: 0;
        margin: 0 0 1em;
        font-size: inherit;
        height: fit-content;
    }
    .tabular th,
    #preview-content .tabular th, #setText .tabular th {
        border: none !important;
        padding: 6px 13px;
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
        padding: 0.1em 0.5em !important;
    }
    .tabular td > p,
    #preview-content .tabular td > p, #setText .tabular td > p {
        margin-bottom: 0;
        margin-top: 0;
    }
    .tabular td._empty,
    #preview-content .tabular td._empty, #setText .tabular td._empty {
        height: 1.3em;
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
        margin-bottom: 0.5em;
        overflow-x: auto;
    }
    div.figure_img img,
    #preview-content div.figure_img img, #setText div.figure_img img {
        ${!isPptx ? 'display: inline;' : ''}
        margin: 0;
    }
`;
};
