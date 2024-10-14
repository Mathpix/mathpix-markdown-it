const opentype = require('opentype.js');
import { base64AriaFont } from "./ariaBase64";

export class FontMetrics {
  font = null;
  constructor() {
    this.font = null;
    this.loadFont();
  }

  loadFont() {
    // Convert Base64 string to a buffer
    const fontBuffer = Buffer.from(base64AriaFont, 'base64');
    // Load the font only once
    // const fontBuffer = fs.readFileSync(this.fontPath);
    this.font = opentype.parse(fontBuffer.buffer);
  }
  getWidth(text, fontSize) {
    let totalWidth = 0;

    for (let char of text) {
      const glyph = this.font.charToGlyph(char);
      const advanceWidth = glyph.advanceWidth;

      // Convert the width from font units to pixels
      const pixelWidth = (advanceWidth / this.font.unitsPerEm) * fontSize;
      totalWidth += pixelWidth;
    }

    return totalWidth;
  }

  getWidthInEx(text, fontSize) {
    const widthX = this.getWidth('x', fontSize);
    const widthText = this.getWidth(text, fontSize);

    // Calculate width in ex
    return widthText / widthX;
  }
}

