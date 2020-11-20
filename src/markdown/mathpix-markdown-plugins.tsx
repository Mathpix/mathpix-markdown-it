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


const mathpixMarkdownPlugin = (md: MarkdownIt, options) => {
  const {width = 1200,  outMath = {}, smiles = {}, mathJax = {}, renderElement = {},} = options;
  Object.assign(md.options, smiles);
  Object.assign(md.options, {
    width: width,
    outMath: outMath,
    mathJax: mathJax,
    renderElement: renderElement
  });

  md
    .use(mdPluginChemistry, smiles)
    .use(mdPluginTableTabular)
    .use(mdPluginList)
    .use(mdPluginMathJax({}))
    .use(mdPluginText())
    .use(mdPluginHighlightCode, { auto: false })
    .use(mdPluginAnchor)
    .use(mdPluginTOC);
};

export default mathpixMarkdownPlugin;
