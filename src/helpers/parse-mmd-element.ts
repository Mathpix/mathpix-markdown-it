export const formatSourceHtml = (text: string, notTrim: boolean = false) => {
  text = notTrim ? text : text.trim();
  return text
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
};

export const formatSourceHtmlWord = (text: string, notTrim: boolean = false) => {
  text = notTrim ? text : text.trim();
  return text
    .replace(/<maligngroup><\/maligngroup>/g, '<maligngroup/>')
    .replace(/<malignmark><\/malignmark>/g, '<malignmark/>')
    .replace(/&nbsp;/g, '&#xA0;');
};

export const formatSource = (text: string, notTrim: boolean = false) => {
  text = notTrim ? text : text.trim();
  return text
    .replace(/\u2062/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

export const formatSourceMML = (text: string) => {
  return text.trim()
    .replace( /&#xA0;/g, ' ')
    .replace( /\u00A0/g, ' ')
    .replace(/&nbsp;/g, ' ');
};

export const parseMmdElement = (math_el, res = []) => {
  if (!math_el) return res;
  if (['MOLECULE', 'CHARTDATA'].includes(math_el.tagName?.toUpperCase())) {
    if (math_el.children?.length) {
      for (let i = 0; i < math_el.children.length; i++) {
        res.push({
          type: math_el.children[i].tagName.toLowerCase(),
          value: formatSourceHtml(math_el.children[i].innerHTML)
        });
      }
    }
    return res;
  }
  if (!math_el.children || !math_el.children.length) return res;
  for (let j = 0; j < math_el.children.length; j++) {
    const child = math_el.children[j];

    if (['smiles', 'smiles-inline'].includes(math_el.className) && child.tagName.toUpperCase() === 'SVG') {
      res.push({type: "svg", value: child.outerHTML});
      continue;
    }

    if (["MATHML", "MATHMLWORD", "ASCIIMATH", "LATEX", "MJX-CONTAINER", "LINEARMATH", "TABLE", "TSV", "CSV", "SMILES", "TABLE-MARKDOWN", "ERROR"].indexOf(child.tagName) !== -1) {
      if (child.tagName==="MJX-CONTAINER" || child.tagName==="TABLE") {
        if (child.tagName === "TABLE") {
          res.push({type: "html", value: child.outerHTML});
        } else {
          res.push({type: "svg", value: child.innerHTML});
        }
      } else {
        res.push({
          type: child.tagName.toLowerCase(),
          value: ['LATEX', 'ASCIIMATH', 'LINEARMATH', 'ERROR', 'TSV', 'CSV', 'TABLE-MARKDOWN', 'SMILES'].includes(child.tagName)
            ? formatSourceHtml(child.innerHTML, (child.tagName === 'TSV' || child.tagName === 'CSV' || child.tagName === "TABLE-MARKDOWN"))
            : child.tagName === 'MATHMLWORD'
              ? formatSourceHtmlWord(child.innerHTML)
              : child.innerHTML
        });
      }
    }
  }
  
  return res;
};

export const parseMarkdownByElement = (el: HTMLElement | Document, include_sub_math: boolean = true) => {
  if (!el) return null;
  let querySelectorChem: string = 'pre > mol, svg > metadata > molecule';
  let querySelectorChart: string = 'svg > metadata > chartdata';
  const baseSelector = include_sub_math
    ? '.math-inline, .math-block, .table_tabular, .inline-tabular, .smiles, .smiles-inline'
    : 'div:not(.cell-item) > .math-inline, div:not(.cell-item) > .math-block, .table_tabular, div:not(.cell-item) > .inline-tabular, div:not(.cell-item) > .smiles, div:not(.cell-item) > .smiles-inline';
  const nodes = Array.from(
    el.querySelectorAll(`${baseSelector}, ${querySelectorChem}, ${querySelectorChart}`)
  );
  const filtered = nodes.filter((node) => {
    // Keep table_tabular only if it is not nested inside another table_tabular.
    if (node.classList?.contains('table_tabular')) {
      const parentTable = node.parentElement?.closest('.table_tabular');
      return !parentTable;
    }
    return true;
  });
  let res: any[] = [];
  for (const node of filtered) {
    res = parseMmdElement(node as any, res);
  }
  return res;
};
