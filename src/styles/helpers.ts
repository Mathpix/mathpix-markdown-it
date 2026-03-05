export const getMaxWidthStyle = (maxWidth: string = '', isHideScroll = false) => {
  if (!maxWidth) {
    return '';
  }

  const hideScroll = (...selectors: string[]) =>
    isHideScroll
      ? selectors.map(s => `${s}::-webkit-scrollbar`).join(',\n    ') + ' { display: none; }'
      : '';

  return `
    #setText {
        max-width: ${maxWidth};
    }
    #setText > div {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
    .math-block,
    #preview-content .math-block, #setText .math-block {
        min-width: unset;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
    ${hideScroll('#setText > div', '#setText > blockquote',
      '#setText > h1', '#setText > h2', '#setText > h3',
      '#setText > h4', '#setText > h5', '#setText > h6')}
    ${hideScroll('.table_tabular', '#preview-content .table_tabular', '#setText .table_tabular')}
    mjx-container[jax="SVG"] > svg {
        overflow-x: auto;
    }
    ${hideScroll('mjx-container')}
    ${hideScroll('mjx-container[jax="SVG"] > svg')}
    .smiles-inline, .smiles,
    #preview-content .smiles-inline, #setText .smiles-inline,
    #preview-content .smiles, #setText .smiles {
        max-width: ${maxWidth};
        overflow-x: auto;
    }
    ${hideScroll('.smiles', '.smiles-inline')}
  `;
};
