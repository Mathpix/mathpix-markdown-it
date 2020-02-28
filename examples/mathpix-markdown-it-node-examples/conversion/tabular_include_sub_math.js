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

let options = {
  outMath: {
    include_asciimath: true,
    include_mathml: true,
    include_latex: true,
    include_svg: true,
    include_tsv: true,
    include_table_html: true
  }
};
const latex = `\\begin{tabular}{ l c r }
                 1 & {$x^1$} & 3 \\\\
                 4 & {$y^1$} & 6 \\\\
                 7 & {$z^1$} & 9 \\\\
               \\end{tabular}`;
const html = MathpixMarkdownModel.markdownToHTML(latex, options);
const parsed = MathpixMarkdownModel.parseMarkdownByHTML(html);

console.log('html=>', html);
console.log('parsed=>', parsed);
