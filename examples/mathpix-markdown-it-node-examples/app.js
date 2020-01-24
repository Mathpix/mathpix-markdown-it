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
  const data = fs.readFileSync(path.join(__dirname + `/data.md`), 'utf8');

  const options = {
    display: 'block',
    htmlTags: true,
    width: 800
  };
  const htmlMM = MathpixMarkdownModel.render(data, options);
  const mathFontsStyle = MathpixMarkdownModel.getMathpixFontsStyle();
  const mathpixStyles = MathpixMarkdownModel.getMathpixStyle(true);

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
      body: htmlMM
    }))
});


const server = http.createServer(app);


server.listen(port, function() {
  console.log(`Listen on port ${port}!`);
});
