export const getMaxWidthStyle = (maxWidth: string = '', isHideScroll = false) => {
  if (!maxWidth) {
    return ''
  }
  return `
    #setText {
      ${'max-width:' + maxWidth + ';'}
    }
    #setText > div {
      overflow-x: auto; 
      -webkit-overflow-scrolling: touch;
    }
    
    .math-block {
      min-width: unset;
      overflow-x: auto; 
      -webkit-overflow-scrolling: touch;
    }
    
    ${isHideScroll ? '#setText > div::-webkit-scrollbar {  display: none; }' : ''}
    
    ${isHideScroll ? '#setText > blockquote::-webkit-scrollbar {  display: none; }' : ''}
    ${isHideScroll ? '#setText > h1::-webkit-scrollbar {  display: none; }' : ''}
    ${isHideScroll ? '#setText > h2::-webkit-scrollbar {  display: none; }' : ''}
    ${isHideScroll ? '#setText > h3::-webkit-scrollbar {  display: none; }' : ''}
    ${isHideScroll ? '#setText > h4::-webkit-scrollbar {  display: none; }' : ''}
    ${isHideScroll ? '#setText > h5::-webkit-scrollbar {  display: none; }' : ''}
    ${isHideScroll ? '#setText > h6::-webkit-scrollbar {  display: none; }' : ''}
    
    ${isHideScroll ? '.table_tabular::-webkit-scrollbar {  display: none; }' : ''}
        
    ${isHideScroll ? 'mjx-container::-webkit-scrollbar {  display: none; }' : ''}
    
    mjx-container[jax="SVG"] > svg { 
      overflow-x: auto; 
    }
    
    ${isHideScroll ? 'mjx-container[jax="SVG"] > svg::-webkit-scrollbar {  display: none; }' : ''}
    
    .smiles-inline, .smiles {
      ${'max-width:' + maxWidth + ';'}
      overflow-x: auto;
    }
    
    ${isHideScroll ? '.smiles::-webkit-scrollbar {  display: none; }' : ''}
    ${isHideScroll ? '.smiles-inline::-webkit-scrollbar {  display: none; }' : ''}
  `
};
