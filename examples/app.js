/**
 * Added accessibility for node
 * */
const MathpixMarkdownModel = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

let  text = "$x^y$";

text = "2:53\n" +
  "\\title{ Preparation $x$ of Papers for IEEE Sponsored Conferences \\& Symposia [^*] }\n" +
  "\n" +
  "\n" +
  "\\author{\n" +
  "Albert Author [^1] and Bernard D. Researcher [^2]\n" +
  "}\n" +
  "\n" +
  "[^1]: Albert Author is with Faculty of Electrical Engineering, Mathematics and Computer Science, University of Twente, 7500 AE Enschede, The Netherlands albert. author a papercept. net\n" +
  "[^2]: Bernard D. Researcheris with the Department of Electrical Engineering, Wright State University, Dayton, OH 45435, USA b.d.researcherdieee.org\n" +
  "[^*]:This work was not supported by any organization"

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


