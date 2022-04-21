/**
 * Added accessibility for node
 * */
const MathpixMarkdownModel = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

let  text = "$x^y$";

const { loadSreAsync } = require('../lib/sre/sre-node');

( async() => {
  const sre = await loadSreAsync();
  const options = {
    htmlTags: true,
    width: 800,
    accessibility: {
      assistiveMml: true,
      sre: sre
    },
    outMath: {
      include_svg: true,
      include_speech: true,
    }
  };

  const htmlMM = MathpixMarkdownModel.markdownToHTML(text, options);
  console.log('==>htmlMM=>', htmlMM)
})();


