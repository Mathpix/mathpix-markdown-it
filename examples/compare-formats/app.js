const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const path = require('path');
const fs = require('fs');

const Window = require('window');
const window = new Window();
global.window = window;
global.document = window.document;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
global.DOMParser = new JSDOM().window.DOMParser;

const {MathpixMarkdownModel} = require('mathpix-markdown-it');

const app = express();
const port = '8088';

app.use(bodyParser.text({type:"*/*"}));

app.post('/convert', async (req, res) => {
  const text = req.body;
  if (!text || text === '') {
    res.json({
      "success": false
    });
    return;
  }
  const options = {
    htmlTags: true,
    width: 800
  };
  const htmlMM = MathpixMarkdownModel.markdownToHTML(text, options);

  res.json({
    "htmlMM": htmlMM
  });
});

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname + `/format-cases.txt`), 'utf8');
  const regW = /^(?:#|m:|c:|l:|ans:|a:|cA:|sl:|ts:|ns:|at:|Ml:|T:|X:|nMn:|tc:|anstl:|astcl:|t:|asl:|nsl:|anst:|anstclTXLA:|as:|n:|ast:|anstcMl:|astl:)/;

  const arr = data.split('\n').filter(item => {
    const str = item.trim();
    return !regW.test(str)
  });

  const arrL = [];
  const arrA = [];
  for (let i = 0; i< arr.length; i++) {
    if (arr[i].trim().length > 0) {
      if (arr[i].charCodeAt(0) !== 0x09 && arr[i].charCodeAt(0) !== 0x20) {
        arrL.push(arr[i])
      }
      if (arr[i].trim()[0] === 'A') {
        arrA.push(arr[i].trim().slice(2))
      }
    }
  }
console.log('->arrL->', arrL.length)
console.log('->arrA->', arrA.length)
  const options = {
    display: 'block',
    htmlTags: true,
    width: 800,
    outMath: {
      include_mathml: false,
      include_asciimath: true,
      include_latex: true,
      include_svg: false,
    }
  };

  const mathFontsStyle = MathpixMarkdownModel.getMathpixFontsStyle();
  const mathpixStyles = MathpixMarkdownModel.getMathpixStyle(true);
  let outHTML = '';
  let outText = '';

  for (let i=0; i< arrL.length; i++) {
    const latex = arrL[i].indexOf('\\begin') === 0 ? arrL[i] : '$'+arrL[i]+'$';

    const htmlMM = MathpixMarkdownModel.render(latex, options);
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlMM, "text/html");
    const body = doc.body;
    const asciimath = body.getElementsByTagName('asciimath');
    const asc = asciimath && asciimath[0] ? asciimath[0].innerHTML : ''
    console.log('Latex         => ', latex)
    console.log('ASCIIMATH     => ', asc)
    console.log('ASCIIMATH_OLD =>', arrA[i])
    console.log('')
    outHTML += '<p>';
    outHTML += '\n';
    outHTML += '  <code style="display: block;"> <span>Latex => </span>' + latex + '</code>';
    outHTML += '\n';
    asc
      .replace('/&amp;/g','&')
      .replace('/&lt;/g','<')
      .replace('/&lt;/g','<')
      .replace('/&gt;/g','>')
      .replace('/&quot;/g','\"')
      .replace('/&nbsp;/g','\u0160')
    outHTML += '  <code style="display: block;"> <span>ASCIIMATH => </span>' + asc + '</code>';
    outHTML += '\n';
    outHTML += '  <code style="display: block;"> <span>ASCII_OLD => </span>' + arrA[i] + '</code>';
    outHTML += '\n';
    outHTML += '</p>';
    outHTML += '\n';
    outText += `{\n`;
    outText += `  latex:     \`${latex}\`,\n`;
    outText += `  ascii:     \`${asc}\`,\n`;
    outText += `  ascii_old: \`${arrA[i].trim()}\`\n`;
    outText += `},\n`;
  }
  //const htmlMM = MathpixMarkdownModel.render(data, options);

  const config = {
    site: {
      title: 'Mathpix Markdown Syntax Reference',
      description: 'Mathpix Markdown Syntax Reference'
    }
  };

  res.render(`./index.ejs`, Object.assign({}, config,
    {
      mathFontsStyle: mathFontsStyle,
      mathStyle: mathpixStyles,
      body: outHTML
    }))

  const layoutFileName = `./views/index.ejs`;
  const layoutData = fs.readFileSync(layoutFileName, 'utf-8')
  const completePage = ejs.render(
    layoutData,
    Object.assign({}, config, {
      mathFontsStyle: mathFontsStyle,
      mathStyle: mathpixStyles,
      body: outHTML
    })
  );
  // save the html file
  fs.writeFileSync(`./result.html`, completePage);
  fs.writeFileSync(`./result.txt`, outText);
  //outText
});


const server = http.createServer(app);


server.listen(port, function() {
  console.log(`Listen on port ${port}!`);
});
