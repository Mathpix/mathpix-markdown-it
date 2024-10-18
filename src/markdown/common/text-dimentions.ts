import { parse, Font, Glyph } from "opentype.js";

const fonSizeDef = 16;
const exDef = 8.296875;
export interface IFontMetricsOptions {
  font: ArrayBuffer,
  fontBold?: ArrayBuffer,
  fontSize?: number,
  ex?: number
}

export enum eFontType {
  normal = "normal",
  bold = "bold"
}

export class FontMetrics {
  font: Font = null;
  fontBold: Font = null;
  fontSize: number = fonSizeDef;
  ex: number = exDef;

  constructor() {}

  loadFont(options: IFontMetricsOptions) {
    if (!options.font) {
      console.warn("[FontMetrics]=> No font provided");
      return;
    }
    this.font = parse(options.font);
    if (options.fontBold) {
      this.fontBold = parse(options.fontBold);
    }
    this.fontSize = options.fontSize ?? fonSizeDef;
    this.ex = options.ex ?? exDef;
  }

  isFontLoaded(): boolean {
    if (!this.font) {
      return false;
    }
    return true;
  }

  private getGlyph(char: string, fontType: eFontType = eFontType.normal): Glyph {
    const isBold = this.fontBold && fontType === eFontType.bold;
    return isBold
      ? this.fontBold.charToGlyph(char)
      : this.font.charToGlyph(char);
  }

  getWidth(text: string, fontType: eFontType = eFontType.normal): number {
    if (!this.isFontLoaded()) {
      console.warn("[FontMetrics]=> No font loaded");
      return 0;
    }
    if (typeof text !== "string" || text.length === 0) {
      return 0;
    }
    try {
      let totalWidth: number = 0;
      const isBold: boolean = this.fontBold && fontType === eFontType.bold;
      const font: Font = isBold ? this.fontBold : this.font;
      const unitsPerEm: number = font.unitsPerEm;

      for (let char of text) {
        const glyph: Glyph = this.getGlyph(char, fontType);
        const advanceWidth: number = glyph.advanceWidth;
        // Convert the width from font units to pixels
        const pixelWidth: number = (advanceWidth / unitsPerEm) * this.fontSize;
        totalWidth += pixelWidth;
      }
      return totalWidth;
    } catch (err) {
      console.error("[ERROR]=>[FontMetrics.getWidth]=>", err);
      return 0;
    }
  }

  getWidthInEx(text: string, fontType: eFontType = eFontType.normal): number {
    if (!this.isFontLoaded() || !this.ex) {
      console.warn("[FontMetrics]=> No font or invalid ex value");
      return 0;
    }
    const widthText = this.getWidth(text, fontType);
    // Calculate width in ex
    return widthText / this.ex;
  }
}

export const fontMetrics: FontMetrics = new FontMetrics();
