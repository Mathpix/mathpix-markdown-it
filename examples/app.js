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
    outMath: {
      include_svg: true,
      include_speech: true,
    }
  };

  let htmlMM = MathpixMarkdownModel.markdownToHTML(text, options);
  console.log('==>htmlMM=> [not accessibility] =>', htmlMM);

  htmlMM = MathpixMarkdownModel.markdownToHTML(text, {
    accessibility: {
        assistiveMml: true,
        sre: sre
      }
  });
  console.log('==>htmlMM=>[use accessibility] =>', htmlMM);

  htmlMM = MathpixMarkdownModel.markdownToHTML(text);
  console.log('==>htmlMM=>[not accessibility] =>', htmlMM)
})();


