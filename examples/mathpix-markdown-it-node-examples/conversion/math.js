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
    include_mathml: true,
    include_asciimath: true,
    include_latex: true,
    include_svg: true,
    include_tsv: true,
    include_table_html: true,
  }
};
const latex = `$x^x$`;
const html = MathpixMarkdownModel.markdownToHTML(latex, options);
const parsed = MathpixMarkdownModel.parseMarkdownByHTML(html, false);

console.log('html=>', html);
console.log('parsed=>', parsed);
