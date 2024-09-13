import { MathJax } from "../../mathjax/";
import { getWidthFromDocument } from "../utils";
import { addIntoLabelsList, eLabelType } from "./labels";
import { envArraysShouldBeFlattenInTSV } from '../../helpers/consts';
import { formatMathJaxError } from "../../helpers/utils";
import { csvSeparatorsDef, mdSeparatorsDef, tsvSeparatorsDef } from './consts';

/** Perform math to conversion to html and get additional data from MathJax to pass it to render rules */
export const convertMathToHtml = (state, token, options) => {
  const math = token.content;
  let isBlock = token.type !== 'inline_math';
  const begin_number = MathJax.GetLastEquationNumber() + 1;
  try {
    let cwidth = 1200;
    if (options && options.width && options.width > 0) {
      cwidth = options.width;
    } else {
      cwidth = getWidthFromDocument(cwidth);
    }

    if (token.type === 'display_mathML' || token.type === 'inline_mathML') {
      const data = MathJax.TypesetMathML(math, {
        display: true,
        metric: {cwidth: cwidth},
        outMath: options.outMath,
        accessibility: options.accessibility,
        renderingErrors: options.renderingErrors
      });
      token.mathEquation = data.html;
      token.mathData = data.data;
    } else {
      if (token.return_asciimath) {
        MathJax.Reset(begin_number);
        const data = MathJax.TypesetSvgAndAscii(math, {
          display: isBlock,
          metric: {cwidth: cwidth},
          outMath: Object.assign({}, options.outMath, {
            optionAscii: {
              showStyle: false,
              extraBrackets: true,
              tableToTsv: options.outMath?.include_tsv
                && envArraysShouldBeFlattenInTSV.includes(token.math_env),
              tableToCsv: options.outMath?.include_csv
                && envArraysShouldBeFlattenInTSV.includes(token.math_env),
              tableToMd: options.outMath?.include_table_markdown
                && envArraysShouldBeFlattenInTSV.includes(token.math_env),
              isSubTable: token.isSubTable,
              tsv_separators: {...tsvSeparatorsDef},
              csv_separators: {...csvSeparatorsDef},
              md_separators: {...mdSeparatorsDef},
            },
          }),
          mathJax: options.mathJax,
          accessibility: options.accessibility,
          renderingErrors: options.renderingErrors
        });
        token.mathEquation = data.html;
        token.mathData = data.data;
        token.ascii = data.ascii;
        token.ascii_tsv = data.ascii_tsv;
        token.ascii_csv = data.ascii_csv;
        token.ascii_md = data.ascii_md;
        token.labels = data.labels;
      } else {
        MathJax.Reset(begin_number);
        const data = MathJax.Typeset(math, {display: isBlock, metric: { cwidth: cwidth },
          outMath: options.outMath, mathJax: options.mathJax, forDocx: options.forDocx,
          accessibility: options.accessibility,
          nonumbers: options.nonumbers,
          renderingErrors: options.renderingErrors
        });
        token.mathEquation = data.html;
        token.mathData = data.data;
        token.ascii = data.ascii;
        token.ascii_tsv = data.ascii_tsv;
        token.ascii_csv = data.ascii_csv;
        token.ascii_md = data.ascii_md;
        token.labels = data.labels;
      }
    }

    const number = MathJax.GetLastEquationNumber();
    let idLabels = '';
    if (token.labels) {
      /** generate parenID - needs to multiple labels */
      let labelsKeys = token.labels ? Object.keys(token.labels) : [];
      idLabels = labelsKeys?.length ? encodeURIComponent(labelsKeys.join('_')) : '';
      for (const key in token.labels) {
        const tagContent = token.labels[key].tag;
        const tagChildrenTokens = [];
        state.md.inline.parse(tagContent, state.md, state.env, tagChildrenTokens);
        addIntoLabelsList({
          key: key,
          id: idLabels,
          tag: tagContent,
          tagId: token.labels[key].id,
          tagChildrenTokens: tagChildrenTokens,
          type: eLabelType.equation
        });
      }
    }
    token.idLabels = idLabels;
    token.number= number;
    token.begin_number= begin_number;
    token.attrNumber = begin_number >= number
      ? number.toString()
      : begin_number.toString() + ',' + number.toString();
    return token;
  } catch (e) {
    console.error('ERROR [convertMathToHtml] MathJax =>', e.message, e);
    formatMathJaxError(e, math, 'convertMathToHtml');
    token.error = {
      message: e.message,
      error: e
    };
    return token;
  }
};
