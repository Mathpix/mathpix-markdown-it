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

const options = {
  outMath: {
    include_table_html: false,
    include_tsv: true,
  }
};
const latex = `\\begin{tabular}{ l c r }
  1 & 2 & 3 \\\\
  4 & 5 & 6 \\\\
  7 & 8 & 9 \\\\
\\end{tabular}`;
const html = MathpixMarkdownModel.markdownToHTML(latex, options);
const parsed = MathpixMarkdownModel.parseMarkdownByHTML(html, false);

console.log('html=>', html);
console.log('parsed=>', parsed);
