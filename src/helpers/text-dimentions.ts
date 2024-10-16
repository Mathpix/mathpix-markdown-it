const opentype = require('opentype.js');

export interface IFonts {
  normal: ArrayBuffer,
  bold?: ArrayBuffer,
}
export class FontMetrics {
  font = null;
  fontBold = null;
  constructor() {
    this.font = null;
    this.fontBold = null;
  }

  loadFont(fonts: IFonts) {
    if (fonts.normal) {
      this.font = opentype.parse(fonts.normal);
      if (fonts.bold) {
        this.fontBold = opentype.parse(fonts.bold);
      }
    }
  }
  getWidth(text, fontSize, fontType = 'normal') {
    if (!this.font) {
      return 0;
    }
    let totalWidth = 0;

    let isBold = this.fontBold && fontType === 'bold';
    for (let char of text) {
      const glyph = isBold ? this.fontBold.charToGlyph(char) : this.font.charToGlyph(char);
      const advanceWidth = glyph.advanceWidth;

      let unitsPerEm = isBold ? this.fontBold.unitsPerEm : this.font.unitsPerEm
      // Convert the width from font units to pixels
      const pixelWidth = (advanceWidth / unitsPerEm) * fontSize;
      totalWidth += pixelWidth;
    }
    return totalWidth;
  }

  getWidthInEx(text, fontSize, fontType = 'normal') {
    if (!this.font) {
      return 0;
    }
    const widthX = fontSize === 16
      ? 8.296875
      : this.getWidth('x', fontSize);
    const widthText = this.getWidth(text, fontSize, fontType);
    // Calculate width in ex
    return widthText / widthX;
  }
}

export const fontMetrics = new FontMetrics();
