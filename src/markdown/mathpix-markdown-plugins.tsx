import { MarkdownIt } from 'markdown-it';

import {
  mdPluginMathJax,
  mdPluginHighlightCode,
  mdPluginText,
  mdPluginTOC,
  mdPluginAnchor,
  mdPluginTableTabular,
  mdPluginList,
  mdPluginChemistry

} from "./mdPluginConfigured";
import { MathJax } from "../mathjax";


const mathpixMarkdownPlugin = (md: MarkdownIt, options) => {
  const {width = 1200,  outMath = {}, smiles = {}, mathJax = {}, renderElement = {},} = options;
  md
    .use(mdPluginChemistry, smiles)
    .use(mdPluginTableTabular, { width: width, outMath: outMath })
    .use(mdPluginList, { width: width, outMath: outMath, renderElement: renderElement })
    .use(mdPluginMathJax({ width: width, outMath: outMath,mathJax: mathJax, renderElement: renderElement }))
    .use(mdPluginText())
    .use(mdPluginHighlightCode, { auto: false })
    .use(mdPluginAnchor)
    .use(mdPluginTOC);

  MathJax.Reset();
};

export default mathpixMarkdownPlugin;
