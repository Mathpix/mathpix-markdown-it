/* eslint-disable no-param-reassign */
import * as JSZip from 'jszip';
import { addFilesToContainer } from './src/html-to-docx';

const { minify } = require('html-minifier');

const minifyHTMLString = (htmlString) => {
  if (typeof htmlString === 'string' || htmlString instanceof String) {
    try {
      const minifiedHTMLString = minify(htmlString, {
        caseSensitive: true,
        collapseWhitespace: true,
        html5: false,
        keepClosingSlash: true,
      });

      return minifiedHTMLString;
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
};

async function generateContainer(htmlString, headerHTMLString, documentOptions = {}, onlyBuffer = false) {
  const zip = new JSZip();

  let contentHTML = htmlString;
  let headerHTML = headerHTMLString;
  if (htmlString) {
    // contentHTML = contentHTML//minifyHTMLString(contentHTML);
    contentHTML = minifyHTMLString(contentHTML);
  }
  if (headerHTMLString) {
    // headerHTML = headerHTML//minifyHTMLString(headerHTML);
    headerHTML = minifyHTMLString(headerHTML);
  }

  addFilesToContainer(zip, contentHTML, documentOptions, headerHTML);

  const buffer = await zip.generateAsync({ type: 'arraybuffer' });

  if (onlyBuffer) {
    return buffer;
  }
  if (Object.prototype.hasOwnProperty.call(global, 'Blob')) {
    // eslint-disable-next-line no-undef
    return new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
  }
  if (Object.prototype.hasOwnProperty.call(global, 'Buffer')) {
    return Buffer.from(new Uint8Array(buffer));
  }
  throw new Error(
    'Add blob support using a polyfill eg https://github.com/bjornstar/blob-polyfill'
  );
}

export default generateContainer;
