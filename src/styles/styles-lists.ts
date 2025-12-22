export const listsStyles = `
  ol.enumerate, ul.itemize {
    padding-inline-start: 40px;
  }
/* It's commented because counter not supporting to change value 
  ol.enumerate.lower-alpha {
    counter-reset: item ;
    list-style-type: none !important;
  }
  .enumerate.lower-alpha > li {
    position: relative;
  }
  .enumerate.lower-alpha > li:before { 
    content: "("counter(item, lower-alpha)")"; 
    counter-increment: item; 
    position: absolute;
    left: -47px;
    width: 47px;
    display: flex;
    justify-content: flex-end;
    padding-right: 7px;
    flex-wrap: nowrap;
    word-break: keep-all;
  }
  */
  
  .itemize > li {
    position: relative;
    min-height: 1.4em;
  }
  .itemize > li > span.li_level, .li_enumerate.not_number > span.li_level { 
    position: absolute;
    right: 100%;
    white-space: nowrap;
    width: max-content;;
    display: flex;
    justify-content: flex-end;
    padding-right: 10px;
    box-sizing: border-box;
  }
  .li_enumerate.not_number {
    position: relative;
    display: inline-block;
    list-style-type: none;
    min-height: 1.4em;
  }
`;
